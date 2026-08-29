const crypto = require('node:crypto');
const { execFile } = require('node:child_process');
const dgram = require('node:dgram');
const https = require('node:https');

const PROTOCOL = 'rhine-lab-local-sync-v1';
const DISCOVERY_PORT = 32124;
const HTTP_PORT = 32123;
const MAX_BODY_BYTES = 32 * 1024 * 1024;

function isPrivateAddress(value) {
    const address = String(value || '').replace(/^::ffff:/, '');
    if (/^10\./.test(address) || /^192\.168\./.test(address) || /^169\.254\./.test(address)) return true;
    const match = address.match(/^172\.(\d+)\./);
    return Boolean(match && Number(match[1]) >= 16 && Number(match[1]) <= 31);
}

function isSnapshot(value) {
    return Boolean(value
        && value.protocol === PROTOCOL
        && typeof value.deviceId === 'string'
        && value.deviceId.length >= 8
        && typeof value.hash === 'string'
        && value.hash.length >= 16
        && typeof value.createdAt === 'string'
        && value.envelope
        && value.envelope.format === 'rhine-lab-transfer');
}

function requestSignature(authKey, timestamp, nonce, body) {
    const digest = crypto.createHash('sha256').update(body).digest('hex');
    return crypto.createHmac('sha256', Buffer.from(authKey, 'hex')).update(timestamp + '\n' + nonce + '\n' + digest).digest('hex');
}

function messageSignature(authKey, value) {
    return crypto.createHmac('sha256', Buffer.from(authKey, 'hex')).update(value).digest('hex');
}

function createEphemeralCertificate() {
    const script = [
        '$rsa=[System.Security.Cryptography.RSA]::Create(2048)',
        '$dn=[System.Security.Cryptography.X509Certificates.X500DistinguishedName]::new("CN=Rhine Lab Local Sync")',
        '$req=[System.Security.Cryptography.X509Certificates.CertificateRequest]::new($dn,$rsa,[System.Security.Cryptography.HashAlgorithmName]::SHA256,[System.Security.Cryptography.RSASignaturePadding]::Pkcs1)',
        '$cert=$req.CreateSelfSigned((Get-Date).AddMinutes(-1),(Get-Date).AddHours(24))',
        '$value=@{pfx=[Convert]::ToBase64String($cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pfx));cert=[Convert]::ToBase64String($cert.RawData)}|ConvertTo-Json -Compress',
        '$cert.Dispose();$rsa.Dispose();$value'
    ].join(';');
    return new Promise(function (resolve, reject) {
        execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], { windowsHide: true, maxBuffer: 1024 * 1024 }, function (error, stdout) {
            if (error) { reject(error); return; }
            try {
                const value = JSON.parse(stdout.trim());
                const certificate = Buffer.from(value.cert, 'base64');
                resolve({ pfx: Buffer.from(value.pfx, 'base64'), fingerprint: crypto.createHash('sha256').update(certificate).digest('hex') });
            } catch (parseError) { reject(parseError); }
        });
    });
}

function validRequest(request, body, authKey, usedNonces) {
    const now = Date.now();
    usedNonces.forEach(function (seenAt, key) { if (now - seenAt > 60000) usedNonces.delete(key); });
    const timestamp = String(request.headers['x-rhine-timestamp'] || '');
    const nonce = String(request.headers['x-rhine-nonce'] || '');
    const signature = String(request.headers['x-rhine-auth'] || '');
    if (!/^[a-f0-9]{64}$/.test(authKey) || !/^\d{13}$/.test(timestamp) || !/^[a-f0-9]{32}$/.test(nonce) || !/^[a-f0-9]{64}$/.test(signature)) return false;
    if (Math.abs(now - Number(timestamp)) > 30000 || usedNonces.has(nonce)) return false;
    const expected = requestSignature(authKey, timestamp, nonce, body);
    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))) return false;
    usedNonces.set(nonce, now);
    return true;
}

function createUsbSyncBridge(options) {
    let httpServer = null;
    let discoveryServer = null;
    let startPromise = null;
    let startVersion = 0;
    const usedNonces = new Map();

    function start() {
        if (httpServer || discoveryServer) return Promise.resolve();
        if (startPromise) return startPromise;
        const version = ++startVersion;
        startPromise = createEphemeralCertificate().then(function (certificate) {
        if (version !== startVersion) return;
        httpServer = https.createServer({ pfx: certificate.pfx }, function (request, response) {
            const remoteAddress = request.socket && request.socket.remoteAddress;
            if (!isPrivateAddress(remoteAddress) || request.method !== 'POST' || request.url !== '/exchange') {
                response.writeHead(404).end();
                return;
            }
            if ((Number(request.headers['content-length']) || 0) > MAX_BODY_BYTES) {
                response.writeHead(413).end();
                return;
            }
            const chunks = [];
            let size = 0;
            request.on('data', function (chunk) {
                size += chunk.length;
                if (size > MAX_BODY_BYTES) request.destroy();
                else chunks.push(chunk);
            });
            request.on('end', function () {
                try {
                    const raw = Buffer.concat(chunks);
                    const local = options.getLocal();
                    if (!local || !validRequest(request, raw, local.authKey, usedNonces)) {
                        response.writeHead(401).end();
                        return;
                    }
                    const body = JSON.parse(raw.toString('utf8'));
                    if (body.protocol !== PROTOCOL || !isSnapshot(body.snapshot)) throw new Error('Invalid snapshot');
                    options.onRemote(body.snapshot);
                    const payload = JSON.stringify({ protocol: PROTOCOL, snapshot: isSnapshot(local.snapshot) ? local.snapshot : null });
                    response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'Cache-Control': 'no-store' });
                    response.end(payload);
                } catch (_error) {
                    response.writeHead(400).end();
                }
            });
        });
        httpServer.on('error', options.onError);
        httpServer.listen(HTTP_PORT, '0.0.0.0');

        discoveryServer = dgram.createSocket({ type: 'udp4', reuseAddr: true });
        discoveryServer.on('message', function (message, remote) {
            if (!isPrivateAddress(remote.address)) return;
            try {
                const local = options.getLocal();
                const request = JSON.parse(message.toString('utf8'));
                const signed = 'DISCOVER\n' + request.timestamp + '\n' + request.nonce;
                if (!local || request.protocol !== PROTOCOL || Math.abs(Date.now() - Number(request.timestamp)) > 30000 || request.signature !== messageSignature(local.authKey, signed)) return;
                const reply = { protocol: PROTOCOL, port: HTTP_PORT, fingerprint: certificate.fingerprint, timestamp: request.timestamp, nonce: request.nonce };
                reply.signature = messageSignature(local.authKey, 'REPLY\n' + reply.timestamp + '\n' + reply.nonce + '\n' + reply.port + '\n' + reply.fingerprint);
                discoveryServer.send(Buffer.from(JSON.stringify(reply)), remote.port, remote.address);
            } catch (_error) {}
        });
        discoveryServer.on('error', options.onError);
        discoveryServer.bind(DISCOVERY_PORT, '0.0.0.0');
        }).finally(function () { startPromise = null; });
        return startPromise;
    }

    function stop() {
        startVersion += 1;
        if (httpServer) httpServer.close();
        if (discoveryServer) discoveryServer.close();
        httpServer = null;
        discoveryServer = null;
        usedNonces.clear();
    }

    return { start, stop };
}

module.exports = { PROTOCOL, createUsbSyncBridge, isPrivateAddress, isSnapshot, messageSignature, requestSignature };
