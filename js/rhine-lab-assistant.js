(function () {
    'use strict';

    let initialized = false;
    let busy = false;
    let messages = [];
    let dragState = null;
    let suppressOpen = false;
    const POSITION_KEY = 'rhineLabAssistantPosition';

    function byId(id) { return document.getElementById(id); }
    function bridge() { return window.RhineLabAssistantBridge || null; }
    function english() { return document.documentElement.lang === 'en'; }
    function id(prefix) { return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7); }

    function saveMessages() { messages = messages.slice(-30); }

    function init() {
        if (initialized || !bridge() || !byId('assistantDrawer')) return;
        initialized = true;
        if (!messages.length) {
            messages.push({ id: id('msg'), role: 'assistant', content: initialMessage(), actions: [] });
            saveMessages();
        }
        bindEvents();
        updateLabels();
        renderMessages();
        window.requestAnimationFrame(restoreCharacterPosition);
    }

    function initialMessage() {
        return english()
            ? 'I am here. Tell me what you completed today, or describe a record to create or revise. Every write is shown as a preview first and requires your confirmation.'
            : '我在。告诉我今天完成了什么，或直接说明要登记、修改的条目。任何写入都会先展示预览，并由你逐条确认。';
    }

    function bindEvents() {
        const toggle = byId('assistantToggle');
        toggle.addEventListener('click', function (event) {
            if (suppressOpen) { event.preventDefault(); suppressOpen = false; return; }
            openDrawer();
        });
        toggle.addEventListener('pointerdown', beginCharacterDrag);
        toggle.addEventListener('pointermove', moveCharacter);
        toggle.addEventListener('pointerup', endCharacterDrag);
        toggle.addEventListener('pointercancel', endCharacterDrag);
        byId('assistantClose').addEventListener('click', closeDrawer);
        byId('assistantScrim').addEventListener('click', closeDrawer);
        byId('assistantForm').addEventListener('submit', function (event) { event.preventDefault(); sendInput(); });
        byId('assistantInput').addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); sendInput(); }
        });
        byId('assistantQuickActions').addEventListener('click', function (event) {
            const button = event.target.closest('[data-assistant-prompt]');
            if (!button || busy) return;
            byId('assistantInput').value = button.dataset.assistantPrompt;
            sendInput();
        });
        byId('assistantMessages').addEventListener('click', handleActionClick);
        window.addEventListener('rhine:languagechange', function () { updateLabels(); renderMessages(); });
        window.addEventListener('resize', restoreCharacterPosition);
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !byId('assistantDrawer').hidden) closeDrawer();
        });
    }

    function updateLabels() {
        const isEnglish = english();
        const remote = Boolean(String((window.RHINE_LAB_CONFIG || {}).assistantApiUrl || '').trim());
        byId('assistantMode').textContent = remote ? 'SERVER' : 'LOCAL';
        const toggle = byId('assistantToggle');
        const toggleLabel = isEnglish ? 'Open or drag Kristen research assistant' : '打开或拖动克里斯滕科研助理';
        toggle.setAttribute('aria-label', toggleLabel);
        toggle.setAttribute('title', toggleLabel);
        byId('assistantRole').textContent = isEnglish ? 'Research Assistant' : '科研助理';
        byId('assistantTitle').textContent = isEnglish ? 'Kristen' : '克里斯滕';
        byId('assistantClose').setAttribute('aria-label', isEnglish ? 'Close research assistant' : '关闭科研助理');
        byId('assistantQuickActions').setAttribute('aria-label', isEnglish ? 'Common prompts' : '常用指令');
        const quickActions = isEnglish
            ? [['Summarize today', 'Summarize my work today'], ['Record experiment', 'Create an experiment record'], ['Add schedule', "Add today's schedule"]]
            : [['总结今天', '总结我今天的工作'], ['登记实验', '新建一条实验记录'], ['添加日程', '添加一项今天的日程']];
        Array.from(byId('assistantQuickActions').querySelectorAll('button')).forEach(function (button, index) {
            button.textContent = quickActions[index][0];
            button.dataset.assistantPrompt = quickActions[index][1];
        });
        byId('assistantMessages').setAttribute('aria-label', isEnglish ? 'Conversation with Kristen' : '与克里斯滕的对话');
        byId('assistantInput').setAttribute('placeholder', isEnglish ? 'Example: BV2 was passaged to P19 today, 1:4, 82% confluence' : '例如：BV2 今天传代到 P19，1:4，汇合度 82%');
        byId('assistantSend').setAttribute('aria-label', isEnglish ? 'Send' : '发送');
        if (messages.length === 1 && messages[0].role === 'assistant' && !(messages[0].actions || []).length) messages[0].content = initialMessage();
    }

    function beginCharacterDrag(event) {
        if (event.button !== 0 || dragState) return;
        const toggle = byId('assistantToggle');
        const rect = toggle.getBoundingClientRect();
        const touch = event.pointerType === 'touch';
        dragState = { pointerId: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, startX: event.clientX, startY: event.clientY, touch: touch, active: false, moved: false, holdTimer: 0 };
        if (touch) {
            dragState.holdTimer = window.setTimeout(function () {
                if (dragState && dragState.pointerId === event.pointerId) activateCharacterDrag();
            }, 180);
        } else {
            try { toggle.setPointerCapture(event.pointerId); } catch (_) { /* capture is optional */ }
        }
    }

    function activateCharacterDrag() {
        if (!dragState || dragState.active) return;
        dragState.active = true;
        const toggle = byId('assistantToggle');
        toggle.classList.add('is-dragging', 'has-custom-position');
        try { toggle.setPointerCapture(dragState.pointerId); } catch (_) { /* capture is optional */ }
    }

    function moveCharacter(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
        if (dragState.touch && !dragState.active) {
            if (distance > 8) {
                window.clearTimeout(dragState.holdTimer);
                dragState = null;
            }
            return;
        }
        if (!dragState.active && distance < 5) return;
        activateCharacterDrag();
        dragState.moved = true;
        event.preventDefault();
        placeCharacter(event.clientX - dragState.offsetX, event.clientY - dragState.offsetY);
    }

    function endCharacterDrag(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        window.clearTimeout(dragState.holdTimer);
        const toggle = byId('assistantToggle');
        if (toggle.hasPointerCapture(event.pointerId)) toggle.releasePointerCapture(event.pointerId);
        toggle.classList.remove('is-dragging');
        if (dragState.active) {
            suppressOpen = true;
            if (dragState.moved) localStorage.setItem(POSITION_KEY, JSON.stringify({ left: parseFloat(toggle.style.left), top: parseFloat(toggle.style.top) }));
            window.setTimeout(function () { suppressOpen = false; }, 0);
        }
        dragState = null;
    }

    function placeCharacter(left, top) {
        const toggle = byId('assistantToggle');
        const rect = toggle.getBoundingClientRect();
        const nextLeft = Math.max(0, Math.min(window.innerWidth - rect.width, Number(left) || 0));
        const nextTop = Math.max(0, Math.min(window.innerHeight - rect.height, Number(top) || 0));
        toggle.style.left = nextLeft + 'px';
        toggle.style.top = nextTop + 'px';
        toggle.style.right = 'auto';
        toggle.style.bottom = 'auto';
    }

    function restoreCharacterPosition() {
        let saved;
        try { saved = JSON.parse(localStorage.getItem(POSITION_KEY) || 'null'); } catch (_) { saved = null; }
        if (!saved || !Number.isFinite(saved.left) || !Number.isFinite(saved.top)) return;
        byId('assistantToggle').classList.add('has-custom-position');
        placeCharacter(saved.left, saved.top);
    }

    function openDrawer() {
        byId('assistantDrawer').hidden = false;
        byId('assistantScrim').hidden = false;
        byId('assistantToggle').setAttribute('aria-expanded', 'true');
        document.body.classList.add('assistant-open');
    }

    function closeDrawer() {
        byId('assistantDrawer').hidden = true;
        byId('assistantScrim').hidden = true;
        byId('assistantToggle').setAttribute('aria-expanded', 'false');
        document.body.classList.remove('assistant-open');
        byId('assistantToggle').focus();
    }

    async function sendInput() {
        if (busy) return;
        const input = byId('assistantInput');
        const text = String(input.value || '').trim();
        if (!text) return;
        input.value = '';
        messages.push({ id: id('msg'), role: 'user', content: text, actions: [] });
        saveMessages();
        renderMessages();
        setBusy(true);
        try {
            const local = parseLocal(text);
            const response = local.fallback ? await remoteOrLocal(text, local) : local;
            messages.push({ id: id('msg'), role: 'assistant', content: response.content, actions: normalizeActions(response.actions) });
            saveMessages(); renderMessages();
        } finally {
            setBusy(false);
        }
    }

    async function remoteOrLocal(text, local) {
        if (!navigator.onLine || !window.RhineLabSync || !window.RhineLabSync.assistantChat || !String((window.RHINE_LAB_CONFIG || {}).assistantApiUrl || '').trim()) return local;
        try {
            return { content: await window.RhineLabSync.assistantChat(text, english() ? 'en-US' : 'zh-CN'), actions: [] };
        } catch (_) {
            return local;
        }
    }

    function setBusy(value) {
        busy = value;
        byId('assistantSend').disabled = value;
        const existing = byId('assistantWorking');
        if (existing) existing.remove();
        if (!value) return;
        const working = document.createElement('article');
        working.className = 'assistant-message assistant is-working';
        working.id = 'assistantWorking';
        const meta = document.createElement('span');
        meta.className = 'assistant-message-meta';
        meta.textContent = 'KRISTEN';
        const body = document.createElement('div');
        body.className = 'assistant-message-body';
        body.textContent = english() ? 'Organizing' : '正在整理';
        working.append(meta, body);
        byId('assistantMessages').appendChild(working);
        byId('assistantMessages').scrollTop = byId('assistantMessages').scrollHeight;
    }

    function renderMessages() {
        const container = byId('assistantMessages');
        container.replaceChildren();
        messages.forEach(function (message) {
            const article = document.createElement('article');
            article.className = 'assistant-message ' + (message.role === 'user' ? 'user' : 'assistant');
            article.dataset.messageId = message.id;
            const meta = document.createElement('span');
            meta.className = 'assistant-message-meta';
            meta.textContent = message.role === 'user' ? (english() ? 'YOU' : '你') : 'KRISTEN';
            const body = document.createElement('div');
            body.className = 'assistant-message-body';
            body.textContent = message.content;
            article.append(meta, body);
            (message.actions || []).forEach(function (action) { article.appendChild(renderAction(action, message.id)); });
            container.appendChild(article);
        });
        container.scrollTop = container.scrollHeight;
    }

    function renderAction(action, messageId) {
        const card = document.createElement('section');
        card.className = 'assistant-action-card';
        card.dataset.actionId = action.id;
        card.dataset.messageId = messageId;
        card.dataset.state = action.state;
        const kicker = document.createElement('small');
        kicker.textContent = action.state === 'applied' ? (english() ? 'APPLIED' : '已执行') : action.state === 'dismissed' ? (english() ? 'DISMISSED' : '已忽略') : (english() ? 'ACTION PREVIEW' : '操作预览');
        const title = document.createElement('strong');
        title.textContent = action.label || actionLabel(action.kind);
        const summary = document.createElement('p');
        summary.textContent = action.summary || payloadSummary(action.payload);
        card.append(kicker, title, summary);
        if (action.state === 'pending') {
            const controls = document.createElement('div');
            controls.className = 'assistant-action-buttons';
            const dismiss = document.createElement('button');
            dismiss.type = 'button'; dismiss.dataset.assistantDismiss = ''; dismiss.textContent = english() ? 'Dismiss' : '忽略';
            const confirm = document.createElement('button');
            confirm.type = 'button'; confirm.dataset.assistantConfirm = ''; confirm.textContent = english() ? 'Confirm' : '确认执行';
            controls.append(dismiss, confirm);
            card.appendChild(controls);
        } else if (action.result) {
            const result = document.createElement('p');
            result.className = 'assistant-action-result'; result.textContent = action.result; card.appendChild(result);
        }
        return card;
    }

    function handleActionClick(event) {
        const card = event.target.closest('.assistant-action-card');
        if (!card) return;
        const message = messages.find(function (item) { return item.id === card.dataset.messageId; });
        const action = message && message.actions.find(function (item) { return item.id === card.dataset.actionId; });
        if (!action || action.state !== 'pending') return;
        if (event.target.closest('[data-assistant-dismiss]')) {
            action.state = 'dismissed';
            action.result = english() ? 'No data was changed.' : '没有修改任何数据。';
        } else if (event.target.closest('[data-assistant-confirm]')) {
            const result = bridge().applyAction(action);
            action.state = result && result.ok ? 'applied' : 'pending';
            action.result = english()
                ? (result && result.ok ? 'The confirmed change was saved.' : 'The action could not be completed.')
                : (result && result.message ? result.message : '操作未能完成。');
        } else return;
        saveMessages(); renderMessages();
    }

    function parseLocal(text) {
        const context = bridge().getContext();
        const lower = text.toLowerCase();
        if (/(总结|今天.*(做了|完成|工作)|今日.*(记录|工作)|what.*today|summari[sz]e)/i.test(text)) {
            return { content: bridge().getTodaySummary(), actions: [] };
        }

        const cell = context.cells.find(function (item) { return lower.includes(String(item.id).toLowerCase()) || lower.includes(String(item.name).toLowerCase()); });
        if (cell && /(传代|换液|复苏|冻存|培养|passage|medium change|thaw|freeze)/i.test(text)) {
            const passage = matchNumber(text, /(?:P|p|代次\s*)\s*(\d+)/);
            const confluence = matchNumber(text, /(\d{1,3})\s*%/);
            const ratio = text.match(/1\s*[:：]\s*(\d+)/);
            const operation = /换液|medium change/i.test(text) ? '换液' : /复苏|thaw/i.test(text) ? '复苏' : /冻存|freeze/i.test(text) ? '冻存' : /传代|passage/i.test(text) ? '传代' : '培养操作';
            return { content: ui('我先把它整理成细胞操作记录。确认前不会写入。', 'I organized this as a cell-operation record. Nothing is written until you confirm.'), actions: [makeAction('record_cell_operation', ui('记录 ' + cell.name + ' 的' + operation, 'Record a cell operation for ' + cell.name), {
                cellId: cell.id, cellName: cell.name, action: operation,
                passage: passage == null ? String(cell.passage || 0) : String(passage),
                ratio: ratio ? '1:' + ratio[1] : '', confluence: confluence == null ? String(cell.confluence || 0) : String(confluence),
                container: extractContainer(text) || cell.container || '', medium: cell.medium || '', notes: text
            })] };
        }

        const reagent = context.reagents.find(function (item) { return lower.includes(String(item.id).toLowerCase()) || lower.includes(String(item.name).toLowerCase()); });
        if (reagent && /(用了|使用|消耗|剩余|还剩|used|remaining)/i.test(text)) {
            const amount = matchNumber(text, /(\d+(?:\.\d+)?)\s*(?:ml|μl|ul|g|mg|支|瓶)?/i);
            if (amount != null) {
                const next = /(剩余|还剩|remaining)/i.test(text) ? amount : Math.max(0, Number(reagent.currentQty || 0) - amount);
                const action = makeAction('update_record', ui('更新 ' + reagent.name + ' 的库存', 'Update inventory for ' + reagent.name), { recordType: 'reagent', recordId: reagent.id, field: 'currentQty', value: String(next) });
                action.targetType = 'reagent'; action.targetId = reagent.id;
                return { content: ui('我计算了更新后的实际库存。请确认数量和单位后再执行。', 'I calculated the updated on-hand quantity. Check the amount and unit before confirming.'), actions: [action] };
            }
        }

        if (/(新建|新增|登记|记录|create|add).*(实验|experiment)|(?:实验|experiment).*(新建|登记|记录|create)/i.test(text)) {
            const title = quoted(text) || cleanTitle(text, ['新建', '新增', '登记', '记录', '一个', '一条', '实验记录', '实验']);
            return { content: ui('已整理为一条实验记录草稿。请先核对标题。', 'I prepared an experiment-record draft. Check the title before confirming.'), actions: [makeAction('create_experiment', ui('新建实验记录', 'Create experiment record'), { title: title || ui('未命名实验', 'Untitled experiment'), date: context.today, status: '进行中', description: text })] };
        }

        if (/(日程|安排|提醒|schedule|task)/i.test(text) && /(添加|新建|安排|记录|add|create)/i.test(text)) {
            const time = extractTime(text) || '09:00';
            const date = /(明天|tomorrow)/i.test(text) ? addDay(context.today) : context.today;
            const title = quoted(text) || cleanTitle(text, ['添加', '新建', '安排', '一项', '今天', '明天', '的', '日程', '提醒']);
            return { content: ui('已整理为日程草稿。请核对日期和时间。', 'I prepared a schedule draft. Check the date and time before confirming.'), actions: [makeAction('create_task', ui('添加日程', 'Add schedule'), { title: title || ui('未命名日程', 'Untitled schedule entry'), date: date, time: time, end: addHour(time), resource: '' })] };
        }

        if (/(录入|新增|添加|新建|add|create).*(试剂|reagent)/i.test(text)) {
            const name = quoted(text) || cleanTitle(text, ['录入', '新增', '添加', '新建', '一条', '试剂']);
            return { content: ui('已建立试剂条目草稿。没有说明的数量会先保留为零。', 'I prepared a reagent draft. Unspecified quantities remain zero.'), actions: [makeAction('create_reagent', ui('录入试剂', 'Add reagent'), { name: name || ui('未命名试剂', 'Untitled reagent'), category: '未分类', unit: 'mL', totalQty: '0', currentQty: '0' })] };
        }

        if (/^(你好|在吗|hello|hi)\b/i.test(text)) return { content: english() ? 'I am here. Tell me what you want to record, revise, or review.' : '我在。直接告诉我要整理、修改或回顾什么。', actions: [] };
        if (/(记录细胞操作|细胞操作|record cell operation)/i.test(text)) return { content: ui('请写明细胞名称或编号、操作类型，以及代次、比例、汇合度等信息。例如：BV2 今天传代到 P19，1:4，汇合度 82%。', 'Include the cell name or ID, operation, passage, split ratio and confluence. Example: BV2 was passaged to P19 today, 1:4, 82% confluence.'), actions: [] };
        return { content: english() ? 'For local autofill, include the record name or ID and the values to create or revise.' : '本地自动填充需要更明确的信息。请写明条目名称或编号，以及要登记或修改的数值。', actions: [], fallback: true };
    }

    function normalizeActions(actions) {
        const allowed = ['create_experiment', 'create_task', 'create_reagent', 'record_cell_operation', 'update_record'];
        return (actions || []).filter(function (item) { return item && allowed.includes(item.kind); }).slice(0, 5).map(function (item) {
            item.id = String(item.id || id('action')); item.state = item.state || 'pending'; item.requiresConfirmation = true; return item;
        });
    }

    function makeAction(kind, label, payload) { return { id: id('action'), kind: kind, label: label, summary: '', payload: payload, requiresConfirmation: true, state: 'pending' }; }
    function actionLabel(kind) {
        const labels = english()
            ? { create_experiment: 'Create experiment record', create_task: 'Add schedule', create_reagent: 'Add reagent', record_cell_operation: 'Record cell operation', update_record: 'Revise record' }
            : { create_experiment: '新建实验记录', create_task: '添加日程', create_reagent: '录入试剂', record_cell_operation: '记录细胞操作', update_record: '修改条目' };
        return labels[kind] || ui('待确认操作', 'Pending action');
    }
    function ui(zh, en) { return english() ? en : zh; }
    function payloadSummary(payload) { return Object.keys(payload || {}).filter(function (key) { return payload[key] !== '' && payload[key] != null && !['notes', 'description'].includes(key); }).slice(0, 7).map(function (key) { const value = window.RhineLabI18n ? window.RhineLabI18n.t(payload[key]) : payload[key]; return key + ': ' + value; }).join(' · '); }
    function quoted(text) { const match = String(text).match(/[“\"']([^”\"']+)[”\"']/); return match ? match[1].trim() : ''; }
    function cleanTitle(text, words) { let value = String(text); words.forEach(function (word) { value = value.replace(new RegExp(word, 'gi'), ' '); }); return value.replace(/\s+/g, ' ').replace(/^[：:，,。\s]+|[。\s]+$/g, '').slice(0, 80); }
    function matchNumber(text, pattern) { const match = String(text).match(pattern); return match ? Number(match[1]) : null; }
    function extractContainer(text) { const match = String(text).match(/\b(T\s*\d+|\d+\s*孔板|\d+[- ]?well(?: plate)?)\b/i); return match ? match[1].replace(/\s+/g, '') : ''; }
    function extractTime(text) { const match = String(text).match(/(?:上午|下午|晚上|今晚)?\s*(\d{1,2})(?:[:：点时]\s*(\d{1,2}))?/); if (!match) return ''; let hour = Number(match[1]); const minute = Number(match[2] || 0); if (/(下午|晚上|今晚)/.test(match[0]) && hour < 12) hour += 12; return String(Math.min(23, hour)).padStart(2, '0') + ':' + String(Math.min(59, minute)).padStart(2, '0'); }
    function addHour(time) { const values = String(time).split(':').map(Number); return String(Math.min(23, (values[0] || 0) + 1)).padStart(2, '0') + ':' + String(values[1] || 0).padStart(2, '0'); }
    function addDay(iso) { const date = new Date(String(iso) + 'T12:00:00'); date.setDate(date.getDate() + 1); return date.toISOString().slice(0, 10); }

    window.addEventListener('rhine:ready', init);
    if (document.readyState !== 'loading') window.setTimeout(init, 0);
}());
