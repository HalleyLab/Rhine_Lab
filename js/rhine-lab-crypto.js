(function () {
    'use strict';

    const DB_NAME = 'rhine-lab-secure-store';
    const STORE_NAME = 'keys';
    const DEVICE_KEY_ID = 'device-aes-gcm-v1';
    const ACCOUNT_KEY_PREFIX = 'account-aes-gcm-v1:';
    const ENVELOPE_VERSION = 1;
    const PBKDF2_ITERATIONS = 600000;
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const localCache = new Map();
    const localWrites = new Map();
    let deviceKey = null;
    let accountKey = null;
    let accountId = '';

    function toBase64(bytes) {
        let binary = '';
        const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
        for (let offset = 0; offset < view.length; offset += 0x8000) {
            binary += String.fromCharCode.apply(null, view.subarray(offset, offset + 0x8000));
        }
        return btoa(binary);
    }

    function fromBase64(value) {
        const binary = atob(String(value || ''));
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
        return bytes;
    }

    function toBase64Url(bytes) {
        return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    }

    function fromBase64Url(value) {
        const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
        return fromBase64(normalized + '='.repeat((4 - normalized.length % 4) % 4));
    }

    function isEnvelope(value, purpose) {
        return Boolean(value && typeof value === 'object' && value.v === ENVELOPE_VERSION && value.alg === 'A256GCM' && value.iv && value.ciphertext && (!purpose || value.purpose === purpose));
    }

    function openDatabase() {
        return new Promise(function (resolve, reject) {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = function () {
                if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
            };
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error || new Error('无法打开设备安全存储')); };
        });
    }

    async function getDeviceKey() {
        if (deviceKey) return deviceKey;
        const database = await openDatabase();
        deviceKey = await new Promise(function (resolve, reject) {
            const transaction = database.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(DEVICE_KEY_ID);
            request.onsuccess = async function () {
                try {
                    if (request.result) {
                        resolve(request.result);
                        return;
                    }
                    const generated = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
                    store.put(generated, DEVICE_KEY_ID);
                    resolve(generated);
                } catch (error) {
                    reject(error);
                }
            };
            request.onerror = function () { reject(request.error || new Error('无法读取设备密钥')); };
            transaction.oncomplete = function () { database.close(); };
        });
        return deviceKey;
    }

    async function encryptJson(value, key, purpose, additionalData) {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const options = { name: 'AES-GCM', iv: iv };
        if (additionalData) options.additionalData = encoder.encode(additionalData);
        const ciphertext = await crypto.subtle.encrypt(options, key, encoder.encode(JSON.stringify(value)));
        return { v: ENVELOPE_VERSION, alg: 'A256GCM', purpose: purpose, iv: toBase64(iv), ciphertext: toBase64(ciphertext) };
    }

    async function decryptJson(envelope, key, additionalData) {
        const options = { name: 'AES-GCM', iv: fromBase64(envelope.iv) };
        if (additionalData) options.additionalData = encoder.encode(additionalData);
        const plaintext = await crypto.subtle.decrypt(options, key, fromBase64(envelope.ciphertext));
        return JSON.parse(decoder.decode(plaintext));
    }

    async function prepareLocalStorage(keys) {
        const key = await getDeviceKey();
        const recoveredKeys = [];
        for (const storageKey of keys || []) {
            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                localCache.set(storageKey, null);
                continue;
            }
            try {
                const parsed = JSON.parse(raw);
                if (isEnvelope(parsed, 'local-workspace')) {
                    localCache.set(storageKey, await decryptJson(parsed, key, storageKey));
                } else {
                    localCache.set(storageKey, parsed);
                    await writeLocal(storageKey, parsed);
                }
            } catch (error) {
                const recoveryKey = storageKey + ':recovery';
                try { if (!localStorage.getItem(recoveryKey)) localStorage.setItem(recoveryKey, raw); } catch (recoveryError) { console.error('Unable to preserve an additional recovery copy.', recoveryError); }
                localCache.set(storageKey, null);
                recoveredKeys.push(storageKey);
                window.dispatchEvent(new CustomEvent('rhine:crypto-error', { detail: { storageKey: storageKey, error: error } }));
                console.warn('An unreadable local record was skipped so Rhine Lab could continue loading.', storageKey, error);
            }
        }
        return { recoveredKeys: recoveredKeys };
    }

    function readLocal(storageKey) {
        const value = localCache.get(storageKey);
        return value == null ? null : JSON.parse(JSON.stringify(value));
    }

    function writeLocal(storageKey, value) {
        localCache.set(storageKey, JSON.parse(JSON.stringify(value)));
        const previous = localWrites.get(storageKey) || Promise.resolve();
        const next = previous.then(async function () {
            const envelope = await encryptJson(value, await getDeviceKey(), 'local-workspace', storageKey);
            localStorage.setItem(storageKey, JSON.stringify(envelope));
        });
        localWrites.set(storageKey, next.catch(function () {}));
        return next;
    }

    function removeLocal(storageKey) {
        localCache.delete(storageKey);
        localStorage.removeItem(storageKey);
    }

    function encryptedAuthStorage(prefix) {
        return {
            getItem: function (key) {
                const value = readLocal(prefix + key);
                return value == null ? null : String(value);
            },
            setItem: function (key, value) {
                return writeLocal(prefix + key, String(value));
            },
            removeItem: function (key) {
                removeLocal(prefix + key);
            }
        };
    }

    async function deriveAccountKey(userId, passphrase) {
        const material = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
        const digest = await crypto.subtle.digest('SHA-256', encoder.encode('Rhine Lab account vault v1|' + userId));
        return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: digest, iterations: PBKDF2_ITERATIONS }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    }

    async function storeAccountKey(userId, key) {
        const database = await openDatabase();
        await new Promise(function (resolve, reject) {
            const transaction = database.transaction(STORE_NAME, 'readwrite');
            transaction.objectStore(STORE_NAME).put(key, ACCOUNT_KEY_PREFIX + userId);
            transaction.oncomplete = resolve;
            transaction.onerror = function () { reject(transaction.error || new Error('无法保存账户密钥')); };
            transaction.onabort = function () { reject(transaction.error || new Error('账户密钥保存已中止')); };
        });
        database.close();
    }

    async function restoreAccount(userId) {
        if (!userId) return false;
        const database = await openDatabase();
        const storedKey = await new Promise(function (resolve, reject) {
            const transaction = database.transaction(STORE_NAME, 'readonly');
            const request = transaction.objectStore(STORE_NAME).get(ACCOUNT_KEY_PREFIX + userId);
            request.onsuccess = function () { resolve(request.result || null); };
            request.onerror = function () { reject(request.error || new Error('无法读取账户密钥')); };
            transaction.oncomplete = function () { database.close(); };
        });
        if (!storedKey) return false;
        accountKey = storedKey;
        accountId = userId;
        return true;
    }

    async function unlockAccount(userId, passphrase) {
        if (!userId || String(passphrase || '').length < 10) throw new Error('账户密码至少需要 10 个字符');
        accountKey = await deriveAccountKey(userId, passphrase);
        accountId = userId;
        return true;
    }

    async function rememberAccount(userId) {
        if (!accountKey || accountId !== userId) throw new Error('账户尚未解锁');
        await storeAccountKey(userId, accountKey);
    }

    async function forgetAccount(userId) {
        if (userId) {
            const database = await openDatabase();
            await new Promise(function (resolve, reject) {
                const transaction = database.transaction(STORE_NAME, 'readwrite');
                transaction.objectStore(STORE_NAME).delete(ACCOUNT_KEY_PREFIX + userId);
                transaction.oncomplete = resolve;
                transaction.onerror = function () { reject(transaction.error || new Error('无法清除账户密钥')); };
            });
            database.close();
        }
        lockAccount();
    }

    function lockAccount() {
        accountKey = null;
        accountId = '';
    }

    function accountUnlocked(userId) {
        return Boolean(accountKey && accountId === userId);
    }

    async function encryptCloud(value) {
        if (!accountKey || !accountId) throw new Error('请先解锁 LAB');
        const envelope = await encryptJson(value, accountKey, 'account-workspace', 'user:' + accountId);
        envelope.kdf = { name: 'PBKDF2-SHA256', iterations: PBKDF2_ITERATIONS, salt: 'account-id-derived' };
        return envelope;
    }

    async function decryptCloud(value) {
        if (!isEnvelope(value, 'account-workspace')) return value;
        if (!accountKey || !accountId) throw new Error('请先解锁 LAB');
        return decryptJson(value, accountKey, 'user:' + accountId);
    }

    async function generateLabKey() {
        const raw = crypto.getRandomValues(new Uint8Array(32));
        return toBase64Url(raw);
    }

    async function importLabKey(rawValue) {
        const raw = fromBase64Url(rawValue);
        if (raw.byteLength !== 32) throw new Error('LAB 邀请密钥无效');
        return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
    }

    async function deriveLabPasswordKey(labId, passphrase) {
        if (!labId || String(passphrase || '').length < 10) throw new Error('LAB 密码至少需要 10 个字符');
        const material = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
        const salt = await crypto.subtle.digest('SHA-256', encoder.encode('Rhine Lab shared key v1|' + labId));
        return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: PBKDF2_ITERATIONS }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    }

    async function wrapLabKey(labId, passphrase, rawLabKey) {
        await importLabKey(rawLabKey);
        const envelope = await encryptJson({ key: rawLabKey }, await deriveLabPasswordKey(labId, passphrase), 'lab-key-wrap', 'lab-key:' + labId);
        envelope.kdf = { name: 'PBKDF2-SHA256', iterations: PBKDF2_ITERATIONS, salt: 'lab-id-derived' };
        return envelope;
    }

    async function unwrapLabKey(labId, passphrase, envelope) {
        if (!isEnvelope(envelope, 'lab-key-wrap')) throw new Error('该 LAB 尚未启用密码加入，请联系创建者发送邀请链接');
        const result = await decryptJson(envelope, await deriveLabPasswordKey(labId, passphrase), 'lab-key:' + labId);
        await importLabKey(result && result.key);
        return result.key;
    }

    async function encryptLab(value, rawKey, labId) {
        return encryptJson(value, await importLabKey(rawKey), 'lab-publication', 'lab:' + labId);
    }

    async function decryptLab(value, rawKey, labId) {
        if (!isEnvelope(value, 'lab-publication')) return value;
        return decryptJson(value, await importLabKey(rawKey), 'lab:' + labId);
    }

    async function encryptBinary(arrayBuffer, rawLabKey) {
        const key = rawLabKey ? await importLabKey(rawLabKey) : accountKey;
        if (!key) throw new Error('加密密钥尚未解锁');
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, arrayBuffer);
        return { bytes: new Uint8Array(ciphertext), iv: toBase64(iv) };
    }

    async function decryptBinary(arrayBuffer, ivValue, rawLabKey) {
        const key = rawLabKey ? await importLabKey(rawLabKey) : accountKey;
        if (!key) throw new Error('解密密钥尚未解锁');
        return crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(ivValue) }, key, arrayBuffer);
    }

    async function derivePortableKey(passphrase, salt) {
        if (String(passphrase || '').length < 10) throw new Error('传输密码至少需要 10 个字符');
        const material = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: PBKDF2_ITERATIONS },
            material,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async function encryptPortable(value, passphrase) {
        const salt = crypto.getRandomValues(new Uint8Array(32));
        const envelope = await encryptJson(value, await derivePortableKey(passphrase, salt), 'portable-workspace', 'rhine-lab-transfer-v1');
        return {
            format: 'rhine-lab-transfer',
            version: 1,
            createdAt: new Date().toISOString(),
            kdf: { name: 'PBKDF2-SHA256', iterations: PBKDF2_ITERATIONS, salt: toBase64(salt) },
            envelope: envelope
        };
    }

    async function decryptPortable(value, passphrase) {
        if (!value || value.format !== 'rhine-lab-transfer' || value.version !== 1 || !value.kdf || !value.envelope) {
            throw new Error('不是有效的 Rhine Lab 同步文件');
        }
        if (value.kdf.name !== 'PBKDF2-SHA256' || value.kdf.iterations !== PBKDF2_ITERATIONS || !value.kdf.salt) {
            throw new Error('同步文件使用了不受支持的加密参数');
        }
        if (!isEnvelope(value.envelope, 'portable-workspace')) throw new Error('同步文件的加密封装无效');
        return decryptJson(value.envelope, await derivePortableKey(passphrase, fromBase64(value.kdf.salt)), 'rhine-lab-transfer-v1');
    }

    window.RhineLabCrypto = {
        prepareLocalStorage: prepareLocalStorage,
        readLocal: readLocal,
        writeLocal: writeLocal,
        removeLocal: removeLocal,
        unlockAccount: unlockAccount,
        rememberAccount: rememberAccount,
        restoreAccount: restoreAccount,
        forgetAccount: forgetAccount,
        lockAccount: lockAccount,
        accountUnlocked: accountUnlocked,
        encryptCloud: encryptCloud,
        decryptCloud: decryptCloud,
        generateLabKey: generateLabKey,
        wrapLabKey: wrapLabKey,
        unwrapLabKey: unwrapLabKey,
        encryptLab: encryptLab,
        decryptLab: decryptLab,
        encryptBinary: encryptBinary,
        decryptBinary: decryptBinary,
        encryptPortable: encryptPortable,
        decryptPortable: decryptPortable,
        encryptedAuthStorage: encryptedAuthStorage,
        isEnvelope: isEnvelope
    };
}());
