(function () {
    'use strict';

    class CloudError extends Error {
        constructor(message, status) {
            super(message || 'Cloud request failed.');
            this.name = 'CloudError';
            this.status = status || 0;
        }
    }

    class RhineCloudClient {
        constructor(baseUrl, authStorage, fallbackBaseUrl) {
            this.baseUrls = [baseUrl, fallbackBaseUrl]
                .map(function (value) { return String(value || '').replace(/\/$/, ''); })
                .filter(function (value, index, values) { return value && values.indexOf(value) === index; });
            this.baseUrl = this.baseUrls[0] || '';
            this.authStorage = authStorage || window.localStorage;
            this.tokenKey = 'rhine-lab-cloudflare-session-v1';
            this.token = this.authStorage.getItem(this.tokenKey) || '';
            this.authListeners = new Set();
            this.channels = new Set();
            this.auth = this.createAuthApi();
            this.storage = { from: () => this.createStorageApi() };
        }

        createAuthApi() {
            const client = this;
            return {
                onAuthStateChange(callback) {
                    client.authListeners.add(callback);
                    return { data: { subscription: { unsubscribe() { client.authListeners.delete(callback); } } } };
                },
                async getSession() {
                    if (!client.token) return success({ session: null });
                    try {
                        const data = await client.request('/api/auth/session');
                        return success({ session: client.session(data.user) });
                    } catch (error) {
                        if (error.status === 401) await client.clearSession();
                        return failure(error);
                    }
                },
                async signInWithPassword(credentials) {
                    try {
                        const data = await client.request('/api/auth/login/password', { method: 'POST', json: { email: credentials.email, password: credentials.password } });
                        await client.saveSession(data.token);
                        const session = client.session(data.user);
                        client.emitAuth('SIGNED_IN', session);
                        return success({ session, user: data.user });
                    } catch (error) { return failure(error); }
                },
                async signInWithOtp(input) {
                    try {
                        await client.request('/api/auth/login/code/request', { method: 'POST', json: { email: input.email } });
                        return success({ user: null, session: null });
                    } catch (error) { return failure(error); }
                },
                async signUp(input) {
                    try {
                        await client.request('/api/auth/register/request', { method: 'POST', json: { email: input.email, password: input.password } });
                        return success({ user: { email: input.email, identities: [{}] }, session: null });
                    } catch (error) { return failure(error); }
                },
                async verifyOtp(input) {
                    try {
                        const register = input.type === 'signup';
                        const data = await client.request(register ? '/api/auth/register/verify' : '/api/auth/login/code/verify', { method: 'POST', json: { email: input.email, code: input.token } });
                        await client.saveSession(data.token);
                        const session = client.session(data.user);
                        client.emitAuth('SIGNED_IN', session);
                        return success({ session, user: data.user });
                    } catch (error) { return failure(error); }
                },
                async signOut() {
                    try { if (client.token) await client.request('/api/auth/logout', { method: 'POST' }); } catch (_) {}
                    await client.clearSession();
                    client.emitAuth('SIGNED_OUT', null);
                    return success(null);
                },
                async exchangeCodeForSession() { return failure(new CloudError('Link authentication is not enabled. Use password or verification code.')); }
            };
        }

        createStorageApi() {
            const client = this;
            return {
                async upload(path, body) {
                    try {
                        await client.request('/api/attachments?path=' + encodeURIComponent(path), { method: 'PUT', body, rawResponse: true });
                        return success({ path });
                    } catch (error) { return failure(error); }
                },
                async createSignedUrl(path) {
                    try {
                        const response = await client.request('/api/attachments?path=' + encodeURIComponent(path), { rawResponse: true });
                        const blob = await response.blob();
                        return success({ signedUrl: URL.createObjectURL(blob) });
                    } catch (error) { return failure(error); }
                }
            };
        }

        session(user) { return user ? { access_token: this.token, token_type: 'bearer', user } : null; }

        async saveSession(token) {
            this.token = String(token || '');
            await this.authStorage.setItem(this.tokenKey, this.token);
        }

        async clearSession() {
            this.token = '';
            await this.authStorage.removeItem(this.tokenKey);
        }

        emitAuth(event, session) {
            this.authListeners.forEach(function (callback) {
                try { callback(event, session); } catch (error) { console.error(error); }
            });
        }

        async request(path, options) {
            const settings = options || {};
            const headers = new Headers(settings.headers || {});
            if (this.token) headers.set('Authorization', 'Bearer ' + this.token);
            let body = settings.body;
            if (Object.prototype.hasOwnProperty.call(settings, 'json')) {
                headers.set('Content-Type', 'application/json');
                body = JSON.stringify(settings.json);
            }
            let response;
            let networkError = null;
            const candidates = [this.baseUrl].concat(this.baseUrls.filter((url) => url !== this.baseUrl));
            for (const baseUrl of candidates) {
                const controller = new AbortController();
                const timeout = window.setTimeout(function () { controller.abort(); }, Number(settings.timeoutMs || 15000));
                try {
                    response = await fetch(baseUrl + path, { method: settings.method || 'GET', headers, body, cache: 'no-store', signal: controller.signal });
                    this.baseUrl = baseUrl;
                    break;
                } catch (error) {
                    networkError = error && error.name === 'AbortError'
                        ? new Error('Request timed out. Please try again.')
                        : error;
                } finally {
                    window.clearTimeout(timeout);
                }
            }
            if (!response) {
                throw new CloudError(networkError && networkError.message ? networkError.message : 'Network request failed.');
            }
            if (!response.ok) {
                let detail = null;
                try { detail = await response.json(); } catch (_) {}
                throw new CloudError(detail && detail.error ? detail.error : 'Cloud request failed.', response.status);
            }
            if (settings.rawResponse) return response;
            return response.status === 204 ? null : response.json();
        }

        from(table) { return new CloudQuery(this, table); }

        async rpc(name, parameters) {
            try {
                if (name === 'create_lab_with_owner') {
                    const response = await this.request('/api/labs', { method: 'POST', json: { name: parameters.lab_name, password: parameters.lab_password } });
                    return success(response.data);
                }
                if (name === 'set_lab_key_envelope') {
                    const response = await this.request('/api/labs/' + encodeURIComponent(parameters.target_lab_id) + '/key', { method: 'PUT', json: { password: parameters.lab_password, key_envelope: parameters.lab_key_envelope } });
                    return success(response.data);
                }
                if (name === 'join_lab_with_password') {
                    const response = await this.request('/api/labs/join', { method: 'POST', json: { name: parameters.lab_name, password: parameters.lab_password } });
                    return success(response.data);
                }
                if (name === 'list_lab_member_emails') {
                    const response = await this.request('/api/labs/' + encodeURIComponent(parameters.target_lab_id) + '/members');
                    return success(response.data || []);
                }
                throw new CloudError('Unsupported cloud operation: ' + name);
            } catch (error) { return failure(error); }
        }

        channel(name) {
            const channel = new PollingChannel(this, name);
            this.channels.add(channel);
            return channel;
        }

        async removeChannel(channel) {
            if (channel) channel.stop();
            this.channels.delete(channel);
            return 'ok';
        }
    }

    class CloudQuery {
        constructor(client, table) {
            this.client = client;
            this.table = table;
            this.operation = 'select';
            this.filters = {};
            this.value = null;
            this.execution = null;
        }
        select() { return this; }
        eq(field, value) { this.filters[field] = value; return this; }
        order() { return this; }
        upsert(value) { this.operation = 'upsert'; this.value = value; return this; }
        maybeSingle() { return this.execute().then(function (result) { if (result.error) return result; return success(result.data || null); }); }
        single() { return this.execute().then(function (result) { if (result.error) return result; const row = Array.isArray(result.data) ? result.data[0] : result.data; return success(row || null); }); }
        then(resolve, reject) { return this.execute().then(resolve, reject); }
        execute() {
            if (!this.execution) this.execution = this.run();
            return this.execution;
        }
        async run() {
            try {
                if (this.operation === 'upsert') return this.runUpsert();
                if (this.table === 'lab_members') {
                    const response = await this.client.request('/api/labs');
                    return success(response.data || []);
                }
                if (this.table === 'workspace_snapshots') {
                    const response = await this.client.request('/api/workspace');
                    return success(response.data || null);
                }
                if (this.table === 'lab_member_publications') {
                    const labId = this.filters.lab_id;
                    const response = await this.client.request('/api/labs/' + encodeURIComponent(labId) + '/publications');
                    return success(response.data || []);
                }
                throw new CloudError('Unsupported table: ' + this.table);
            } catch (error) { return failure(error); }
        }
        async runUpsert() {
            try {
                if (this.table === 'workspace_snapshots') {
                    const response = await this.client.request('/api/workspace', { method: 'PUT', json: { payload: this.value.payload } });
                    return success(response.data);
                }
                if (this.table === 'lab_member_publications') {
                    const response = await this.client.request('/api/labs/' + encodeURIComponent(this.value.lab_id) + '/publications/me', { method: 'PUT', json: { encrypted_payload: this.value.encrypted_payload } });
                    return success(response.data);
                }
                throw new CloudError('Unsupported table update: ' + this.table);
            } catch (error) { return failure(error); }
        }
    }

    class PollingChannel {
        constructor(client, name) {
            this.client = client;
            this.name = name;
            this.options = null;
            this.callback = null;
            this.timer = 0;
            this.fingerprint = '';
            this.initialized = false;
        }
        on(_kind, options, callback) { this.options = options || {}; this.callback = callback; return this; }
        subscribe() {
            this.poll(true);
            this.timer = window.setInterval(() => this.poll(false), 15000);
            return this;
        }
        stop() { window.clearInterval(this.timer); this.timer = 0; }
        async poll(initial) {
            if (!this.options || !this.callback || !navigator.onLine) return;
            try {
                if (this.options.table === 'workspace_snapshots') {
                    const response = await this.client.request('/api/workspace');
                    const row = response.data;
                    const next = row ? String(row.revision) + '|' + String(row.updated_at) : 'empty';
                    if (!initial && this.initialized && next !== this.fingerprint && row) this.callback({ new: row });
                    this.fingerprint = next;
                    this.initialized = true;
                    return;
                }
                if (this.options.table === 'lab_member_publications') {
                    const filter = String(this.options.filter || '');
                    const labId = filter.replace(/^lab_id=eq\./, '');
                    const response = await this.client.request('/api/labs/' + encodeURIComponent(labId) + '/publications');
                    const rows = response.data || [];
                    const next = rows.map(function (row) { return row.user_id + ':' + row.updated_at; }).join('|');
                    if (!initial && this.initialized && next !== this.fingerprint) this.callback({});
                    this.fingerprint = next;
                    this.initialized = true;
                }
            } catch (error) {
                if (error.status === 401) this.stop();
            }
        }
    }

    function success(data) { return { data, error: null }; }
    function failure(error) { return { data: null, error: error instanceof Error ? error : new CloudError(String(error || 'Cloud request failed.')) }; }

    window.RhineLabCloudflare = {
        createClient(baseUrl, authStorage, fallbackBaseUrl) { return new RhineCloudClient(baseUrl, authStorage, fallbackBaseUrl); }
    };
}());
