(function () {
    'use strict';

    const integer = (value, fallback, min, max) => Math.min(max, Math.max(min, Math.round(Number.isFinite(Number(value)) ? Number(value) : fallback)));
    const copy = value => JSON.parse(JSON.stringify(value));
    const clean = (value, length = 160) => String(value == null ? '' : value).slice(0, length);
    const id = () => 'LAYOUT-' + (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
    const functions = ['general', 'cell', 'molecular', 'animal', 'plant', 'microbe', 'storage', 'instrument', 'office', 'custom'];
    const deviceTypes = ['bench', 'freezer', 'tank', 'incubator', 'animalRack', 'plantRack', 'microscope', 'centrifuge', 'sink', 'desk', 'custom'];

    function fitBox(box, scene) {
        const width = integer(box.width, 160, 24, scene.width);
        const height = integer(box.height, 100, 24, scene.height);
        return { x: integer(box.x, 0, 0, scene.width - width), y: integer(box.y, 0, 0, scene.height - height), width, height };
    }

    function drawBox(start, end, scene) {
        return fitBox({ x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), width: Math.abs(start.x - end.x), height: Math.abs(start.y - end.y) }, scene);
    }

    function normalizeItems(input, scene, insideRoom) {
        const seen = new Set();
        return (Array.isArray(input) ? input : []).slice(0, 500).filter(item => item && typeof item === 'object').map(item => {
            let itemId = clean(item.id);
            if (!itemId || seen.has(itemId)) itemId = id();
            seen.add(itemId);
            const kind = (insideRoom ? ['device', 'shape'] : ['room', 'corridor', 'shape']).includes(item.kind) ? item.kind : 'shape';
            const output = Object.assign({ id: itemId, kind, shape: item.shape === 'ellipse' ? 'ellipse' : 'rect', name: clean(item.name), notes: clean(item.notes, 2000) }, fitBox(item, scene));
            if (kind === 'room') {
                output.function = functions.includes(item.function) ? item.function : 'general';
                output.purpose = clean(item.purpose);
                output.interiorWidth = integer(item.interiorWidth, 1000, 240, 4096);
                output.interiorHeight = integer(item.interiorHeight, 700, 240, 4096);
                output.items = normalizeItems(item.items, { width: output.interiorWidth, height: output.interiorHeight }, true);
            }
            if (kind === 'device') {
                output.deviceType = deviceTypes.includes(item.deviceType) ? item.deviceType : 'custom';
                output.link = clean(item.link);
            }
            return output;
        });
    }

    function normalizePlans(input) {
        const seen = new Set();
        return (Array.isArray(input) ? input : []).slice(0, 64).filter(plan => plan && typeof plan === 'object').map(plan => {
            let planId = clean(plan.id);
            if (!planId || seen.has(planId)) planId = id();
            seen.add(planId);
            const output = { id: planId, name: clean(plan.name), width: integer(plan.width, 1200, 240, 4096), height: integer(plan.height, 800, 240, 4096), createdBy: clean(plan.createdBy), updatedAt: clean(plan.updatedAt, 40) };
            output.items = normalizeItems(plan.items, output, false);
            return output;
        });
    }

    window.RhineLabLayoutModel = { normalizePlans, fitBox, drawBox };
    const root = document.getElementById('labLayoutWorkspace');
    if (!root) return;

    const words = {
        zh: {
            title: '实验室布局', floorPlan: '平面图', newPlan: '新建平面图', choosePlan: '选择平面图', overview: '实验室平面图', back: '返回平面图', room: '房间', corridor: '走廊', shape: '形状', device: '设备', select: '选择 / 拖动', rectangle: '方框', circle: '圆形', squareRoom: '方形房间', roundRoom: '圆形房间', equipment: '摆放设备', fit: '适应', zoomIn: '放大', zoomOut: '缩小', undo: '撤销', redo: '重做', saved: '已自动保存', readOnly: '当前工作区只读', saveFailed: '布局未保存，请重试', empty: '新建平面图，开始排列房间和走廊。', drawHint: '选择形状后，在画布上拖动绘制；点击房间进入内部。', roomHint: '拖动设备调整位置；右下角方块可调整大小。', selectHint: '选择图形编辑名称、用途和尺寸。', name: '名称', purpose: '房间用途', customPurpose: '具体用途', notes: '备注', width: '宽度', height: '高度', x: '水平位置', y: '垂直位置', interiorWidth: '室内画布宽度', interiorHeight: '室内画布高度', shapeType: '形状', deviceType: '设备类型', link: '关联已有设备', noLink: '不关联', save: '保存设置', enter: '进入房间', openDevice: '查看关联设备', duplicate: '复制', remove: '删除', front: '移到前面', deletePlan: '删除平面图', deletePlanConfirm: '删除这个平面图及其所有房间布局？', deleteRoomConfirm: '删除这个房间及其内部设备布局？', deleteItemConfirm: '删除这个图形？', planSettings: '平面图设置', roomSettings: '房间设置', inspector: '布局设置', roomList: '房间列表', resize: '调整大小', canvas: '布局画布', general: '综合实验', cell: '细胞培养', molecular: '分子实验', animal: '动物饲养', plant: '植物培养', microbe: '微生物培养', storage: '样本 / 试剂存储', instrument: '仪器室', office: '办公', custom: '自定义', bench: '实验台', freezer: '冰箱', tank: '液氮罐', incubator: '培养箱', animalRack: '笼架', plantRack: '培养架', microscope: '显微镜', centrifuge: '离心机', sink: '水槽', desk: '办公桌'
        },
        en: {
            title: 'Lab Layout', floorPlan: 'Floor plan', newPlan: 'New floor plan', choosePlan: 'Choose floor plan', overview: 'Laboratory floor plan', back: 'Back to floor plan', room: 'Room', corridor: 'Corridor', shape: 'Shape', device: 'Equipment', select: 'Select / move', rectangle: 'Rectangle', circle: 'Circle', squareRoom: 'Rectangular room', roundRoom: 'Round room', equipment: 'Place equipment', fit: 'Fit', zoomIn: 'Zoom in', zoomOut: 'Zoom out', undo: 'Undo', redo: 'Redo', saved: 'Saved automatically', readOnly: 'This workspace is read-only', saveFailed: 'Layout was not saved. Try again.', empty: 'Create a floor plan to arrange rooms and corridors.', drawHint: 'Choose a shape and drag to draw. Click a room to enter it.', roomHint: 'Drag equipment to move it. Drag the lower-right handle to resize.', selectHint: 'Select a shape to edit its name, function and size.', name: 'Name', purpose: 'Room function', customPurpose: 'Specific use', notes: 'Notes', width: 'Width', height: 'Height', x: 'Horizontal position', y: 'Vertical position', interiorWidth: 'Interior canvas width', interiorHeight: 'Interior canvas height', shapeType: 'Shape', deviceType: 'Equipment type', link: 'Link existing equipment', noLink: 'No link', save: 'Save settings', enter: 'Enter room', openDevice: 'View linked equipment', duplicate: 'Duplicate', remove: 'Delete', front: 'Bring to front', deletePlan: 'Delete floor plan', deletePlanConfirm: 'Delete this floor plan and all room layouts?', deleteRoomConfirm: 'Delete this room and its equipment layout?', deleteItemConfirm: 'Delete this shape?', planSettings: 'Floor plan settings', roomSettings: 'Room settings', inspector: 'Layout settings', roomList: 'Rooms', resize: 'Resize', canvas: 'Layout canvas', general: 'General laboratory', cell: 'Cell culture', molecular: 'Molecular laboratory', animal: 'Animal housing', plant: 'Plant cultivation', microbe: 'Microbial culture', storage: 'Sample / reagent storage', instrument: 'Instrument room', office: 'Office', custom: 'Custom', bench: 'Lab bench', freezer: 'Freezer', tank: 'Liquid nitrogen tank', incubator: 'Incubator', animalRack: 'Animal rack', plantRack: 'Growth rack', microscope: 'Microscope', centrifuge: 'Centrifuge', sink: 'Sink', desk: 'Desk'
        }
    };
    const t = key => words[document.documentElement.lang === 'en' ? 'en' : 'zh'][key] || key;
    const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const bridge = () => window.RhineLabLayoutBridge;
    let snapshot = { plans: [], equipment: [], readOnly: true, canArrange: false };
    let plans = [], planId = '', roomId = '', selectedId = '', tool = 'select', zoom = 1, gesture = null;
    let history = [], future = [], scope = '', status = '';
    const plan = () => plans.find(item => item.id === planId);
    const room = () => plan() && plan().items.find(item => item.id === roomId && item.kind === 'room');
    const scene = () => room() ? { width: room().interiorWidth, height: room().interiorHeight, items: room().items } : plan();
    const selected = () => scene() && scene().items.find(item => item.id === selectedId);
    const label = (item, index = 0) => item.name || (t(item.kind === 'device' ? item.deviceType : item.kind === undefined ? 'floorPlan' : item.kind) + ' #' + (index + 1));
    const itemLabel = item => label(item, (scene() ? scene().items : []).indexOf(item));

    function refresh() {
        if (!bridge()) return;
        if (gesture) cancelGesture();
        snapshot = bridge().getSnapshot();
        if (scope !== snapshot.scope) { history = []; future = []; planId = ''; roomId = ''; selectedId = ''; scope = snapshot.scope; }
        plans = normalizePlans(snapshot.plans);
        if (!plan()) { planId = plans[0] ? plans[0].id : ''; roomId = ''; }
        if (!room()) roomId = '';
        render();
    }

    function save(before, arrange = false, recordHistory = true) {
        plans = normalizePlans(plans);
        if (JSON.stringify(before) === JSON.stringify(plans)) { render(); return; }
        if (!bridge() || !bridge().savePlans(plans, arrange)) { plans = before; status = t('saveFailed'); render(); return; }
        if (recordHistory) { history.push(before); if (history.length > 40) history.shift(); future = []; }
        status = t('saved');
        render();
    }

    function button(action, text, disabled = false, extra = '') {
        return '<button class="button ghost compact" type="button" data-layout-action="' + action + '" ' + (disabled ? 'disabled ' : '') + extra + '>' + esc(text) + '</button>';
    }

    function render() {
        const current = plan();
        const activeRoom = room();
        const previousCanvas = root.querySelector('.lab-layout-canvas');
        const scroll = previousCanvas && previousCanvas.dataset.scene === planId + '|' + roomId ? { x: previousCanvas.parentElement.scrollLeft, y: previousCanvas.parentElement.scrollTop } : null;
        if (!current) {
            root.innerHTML = '<div class="lab-layout-empty"><svg viewBox="0 0 96 72" aria-hidden="true"><path d="M8 8h32v22H8zM56 8h32v36H56zM8 46h32v18H8zM48 8v56M8 38h32"/></svg><p>' + esc(t('empty')) + '</p><button class="button primary" type="button" data-layout-action="new" ' + (snapshot.readOnly ? 'disabled' : '') + '>＋ ' + esc(t('newPlan')) + '</button></div>';
            return;
        }
        const tools = activeRoom ? ['select', 'device', 'rect', 'ellipse'] : ['select', 'room', 'round-room', 'corridor', 'rect', 'ellipse'];
        const toolNames = { select: 'select', room: 'squareRoom', 'round-room': 'roundRoom', corridor: 'corridor', rect: 'rectangle', ellipse: 'circle', device: 'equipment' };
        root.innerHTML = '<header class="lab-layout-toolbar"><label><span class="sr-only">' + esc(t('choosePlan')) + '</span><select data-layout-plan>' + plans.map((item, index) => '<option value="' + esc(item.id) + '" ' + (item.id === planId ? 'selected' : '') + '>' + esc(label(item, index)) + '</option>').join('') + '</select></label>' + button('new', '＋ ' + t('newPlan'), snapshot.readOnly) + '<div class="lab-layout-history">' + button('undo', '↶ ' + t('undo'), snapshot.readOnly || !history.length) + button('redo', '↷ ' + t('redo'), snapshot.readOnly || !future.length) + '</div></header>' +
            '<div class="lab-layout-tools" role="toolbar" aria-label="' + esc(t('title')) + '">' + tools.map(key => '<button type="button" data-layout-tool="' + key + '" aria-pressed="' + (tool === key) + '" ' + (snapshot.readOnly && key !== 'select' ? 'disabled' : '') + '>' + esc(t(toolNames[key])) + '</button>').join('') + (activeRoom ? '<select data-layout-device aria-label="' + esc(t('deviceType')) + '">' + deviceTypes.map(type => '<option value="' + type + '">' + esc(t(type)) + '</option>').join('') + '</select>' : '') + '</div>' +
            '<div class="lab-layout-path">' + (activeRoom ? button('back', '← ' + t('back')) : '') + '<strong>' + esc(activeRoom ? label(activeRoom, current.items.indexOf(activeRoom)) : label(current, plans.indexOf(current))) + '</strong><span class="lab-layout-status" role="status">' + esc(snapshot.readOnly ? t('readOnly') : status || t('saved')) + '</span><div class="lab-layout-zoom">' + button('zoom-out', '−', false, 'aria-label="' + esc(t('zoomOut')) + '"') + button('fit', t('fit')) + button('zoom-in', '＋', false, 'aria-label="' + esc(t('zoomIn')) + '"') + '</div></div>' +
            '<div class="lab-layout-workbench"><div class="lab-layout-drawing"><div class="lab-layout-viewport"><svg class="lab-layout-canvas" tabindex="0" role="group" aria-label="' + esc(t('canvas')) + '" viewBox="0 0 ' + scene().width + ' ' + scene().height + '" data-tool="' + tool + '"></svg></div><p class="lab-layout-hint">' + esc(t(activeRoom ? 'roomHint' : 'drawHint')) + '</p>' + (!activeRoom ? '<div class="lab-layout-room-list" aria-label="' + esc(t('roomList')) + '">' + current.items.filter(item => item.kind === 'room').map(item => '<button type="button" data-layout-enter="' + esc(item.id) + '">' + esc(label(item, current.items.indexOf(item))) + '</button>').join('') + '</div>' : '') + '</div><aside class="lab-layout-inspector" aria-label="' + esc(t('inspector')) + '"></aside></div>';
        renderBoard(); renderInspector();
        if (scroll) { const viewport = root.querySelector(".lab-layout-viewport"); viewport.scrollLeft = scroll.x; viewport.scrollTop = scroll.y; }
    }

    function deviceIcon(type) {
        const paths = {
            freezer: 'M6 2h24v34H6zM6 16h24M10 7v4M10 22v7',
            tank: 'M8 8c0-6 20-6 20 0v23c0 6-20 6-20 0zM8 8c0 6 20 6 20 0M13 1h10M18 1v4',
            bench: 'M2 12h32v6H2zM6 18v16M30 18v16M9 26h18',
            incubator: 'M4 3h28v32H4zM9 10h18v18H9zM11 6h3M19 6h3',
            animalRack: 'M4 2h28v33H4zM4 13h28M4 24h28M18 2v33',
            plantRack: 'M4 9h28M4 22h28M4 34h28M7 3v31M29 3v31M14 9V4m10 18v-7M12 34v-7',
            microscope: 'M14 2l10 7-6 9-10-7zM25 12c14 16-1 22-14 20M6 34h24M7 24h15',
            centrifuge: 'M3 15c0-15 30-15 30 0v17H3zM3 16h30M11 10h14M8 24h4M22 24h6',
            sink: 'M3 13h30v20H3zM9 18h18v8H9zM18 13V5h8v7',
            desk: 'M2 9h32v5H2zM5 14v21M31 14v21M24 14v16h7',
            custom: 'M4 4h28v28H4zM10 10h16v16H10z'
        };
        return '<g class="lab-layout-device-icon" transform="translate(12 12)"><path d="' + (paths[type] || paths.custom) + '"/></g>';
    }

    function renderBoard() {
        const svg = root.querySelector('.lab-layout-canvas');
        if (!svg || !scene()) return;
        const current = scene();
        svg.dataset.scene = planId + '|' + roomId;
        const viewport = svg.parentElement;
        svg.style.width = Math.max(640, viewport.clientWidth || 640) * zoom + 'px';
        svg.style.aspectRatio = current.width + '/' + current.height;
        svg.innerHTML = '<rect class="lab-layout-background" x="1" y="1" width="' + (current.width - 2) + '" height="' + (current.height - 2) + '" rx="8"/>' + current.items.map((item, index) => {
            const name = label(item, index);
            const linked = snapshot.equipment.find(entry => entry.id === item.link);
            const subtitle = item.kind === 'room' ? (item.purpose || t(item.function)) : linked ? linked.name : '';
            return '<g class="lab-layout-item ' + item.kind + (item.id === selectedId ? ' selected' : '') + '" data-layout-item="' + esc(item.id) + '" transform="translate(' + item.x + ' ' + item.y + ')" tabindex="0" role="button" aria-label="' + esc(name + (subtitle ? ' · ' + subtitle : '')) + '"><title>' + esc(name) + '</title>' + (item.shape === 'ellipse' ? '<ellipse class="lab-layout-outline" cx="' + item.width / 2 + '" cy="' + item.height / 2 + '" rx="' + item.width / 2 + '" ry="' + item.height / 2 + '"/>' : '<rect class="lab-layout-outline" width="' + item.width + '" height="' + item.height + '" rx="' + (item.kind === 'corridor' ? 3 : 8) + '"/>') + (item.kind === 'device' && item.width >= 80 && item.height >= 68 ? deviceIcon(item.deviceType) : '') + '<text class="lab-layout-label" x="' + item.width / 2 + '" y="' + (item.height / 2 + (subtitle ? -4 : 7)) + '" text-anchor="middle">' + esc(name.length > 20 ? name.slice(0, 19) + '…' : name) + '</text>' + (subtitle && item.height > 65 ? '<text class="lab-layout-sublabel" x="' + item.width / 2 + '" y="' + (item.height / 2 + 24) + '" text-anchor="middle">' + esc(subtitle.length > 22 ? subtitle.slice(0, 21) + '…' : subtitle) + '</text>' : '') + (item.id === selectedId && !snapshot.readOnly ? '<rect class="lab-layout-resize" data-layout-resize="' + esc(item.id) + '" x="' + (item.width - 12) + '" y="' + (item.height - 12) + '" width="18" height="18"><title>' + esc(t('resize')) + '</title></rect>' : '') + '</g>';
        }).join('');
    }

    function field(name, value, type = 'text', max = '') {
        return '<label><span>' + esc(t(name)) + '</span><input name="' + name + '" type="' + type + '" value="' + esc(value) + '" ' + (type === 'number' ? 'step="1" min="' + (['x', 'y'].includes(name) ? 0 : 24) + '" max="' + (max || 4096) + '"' : 'maxlength="160"') + '></label>';
    }

    function selectField(name, value, options) {
        return '<label><span>' + esc(t(name)) + '</span><select name="' + name + '">' + options.map(([key, text]) => '<option value="' + esc(key) + '" ' + (key === value ? 'selected' : '') + '>' + esc(text) + '</option>').join('') + '</select></label>';
    }

    function renderInspector() {
        const inspector = root.querySelector('.lab-layout-inspector');
        if (!inspector) return;
        const item = selected();
        const activeRoom = room();
        const target = item || activeRoom || plan();
        const targetKind = item ? 'item' : activeRoom ? 'room' : 'plan';
        const targetName = item ? itemLabel(item) : activeRoom ? label(activeRoom, plan().items.indexOf(activeRoom)) : label(plan(), plans.indexOf(plan()));
        let fields = field('name', target.name || '') + '<div class="lab-layout-field-pair">' + field('width', target.width, 'number') + field('height', target.height, 'number') + '</div>';
        if (targetKind !== 'plan') {
            fields += '<div class="lab-layout-field-pair">' + field('x', target.x, 'number') + field('y', target.y, 'number') + '</div>' + selectField('shapeType', target.shape, [['rect', t('rectangle')], ['ellipse', t('circle')]]);
            if (target.kind === 'room') fields += selectField('purpose', target.function, functions.map(key => [key, t(key)])) + field('customPurpose', target.purpose) + '<div class="lab-layout-field-pair">' + field('interiorWidth', target.interiorWidth, 'number') + field('interiorHeight', target.interiorHeight, 'number') + '</div>';
            if (target.kind === 'device') fields += selectField('deviceType', target.deviceType, deviceTypes.map(key => [key, t(key)])) + selectField('link', target.link, [['', t('noLink')]].concat(snapshot.equipment.map(entry => [entry.id, entry.name])));
            fields += '<label><span>' + esc(t('notes')) + '</span><textarea name="notes" rows="3" maxlength="2000">' + esc(target.notes) + '</textarea></label>';
        }
        inspector.innerHTML = '<p class="micro-label">' + esc(t(targetKind === 'plan' ? 'planSettings' : target.kind === 'room' ? 'roomSettings' : 'inspector')) + '</p><h3>' + esc(targetName) + '</h3><form data-layout-form="' + targetKind + '"><fieldset ' + (snapshot.readOnly ? 'disabled' : '') + '>' + fields + '<button class="button primary compact" type="submit">' + esc(t('save')) + '</button></fieldset></form><div class="lab-layout-item-actions">' + (item && item.kind === 'room' ? button('enter', t('enter')) : '') + (target.kind === 'device' && target.link && snapshot.equipment.some(entry => entry.id === target.link) ? button('open-device', t('openDevice')) : '') + (item ? button('duplicate', t('duplicate'), snapshot.readOnly) + button('front', t('front'), snapshot.readOnly) + button('delete-item', t('remove'), snapshot.readOnly) : targetKind === 'plan' ? button('delete-plan', t('deletePlan'), snapshot.readOnly) : '') + '</div>';
    }

    function enterRoom(nextId) {
        if (!plan().items.some(item => item.id === nextId && item.kind === 'room')) return;
        roomId = nextId; selectedId = ''; tool = 'select'; zoom = 1; render();
    }

    function newItem(box) {
        const kind = ['room', 'round-room'].includes(tool) ? 'room' : tool === 'corridor' ? 'corridor' : tool === 'device' ? 'device' : 'shape';
        const type = root.querySelector('[data-layout-device]');
        return Object.assign({ id: id(), kind, shape: ['ellipse', 'round-room'].includes(tool) ? 'ellipse' : 'rect', name: '', notes: '' }, box, kind === 'room' ? { function: 'general', purpose: '', interiorWidth: 1000, interiorHeight: 700, items: [] } : kind === 'device' ? { deviceType: type ? type.value : 'bench', link: '' } : {});
    }

    function position(event, svg) {
        const point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
        const matrix = svg.getScreenCTM();
        return matrix ? point.matrixTransform(matrix.inverse()) : { x: 0, y: 0 };
    }

    function cancelGesture() {
        if (!gesture) return;
        const previous = gesture; gesture = null; plans = previous.before;
        if (previous.svg.hasPointerCapture(previous.pointerId)) previous.svg.releasePointerCapture(previous.pointerId);
        render();
    }

    root.addEventListener('pointerdown', event => {
        const svg = event.target.closest('.lab-layout-canvas');
        if (!svg || event.button !== 0 || gesture || event.isPrimary === false) return;
        const group = event.target.closest('[data-layout-item]');
        const point = position(event, svg);
        if (tool !== 'select' && !snapshot.readOnly) {
            gesture = { mode: 'draw', pointerId: event.pointerId, svg, start: point, before: copy(plans), preview: document.createElementNS('http://www.w3.org/2000/svg', ['ellipse', 'round-room'].includes(tool) ? 'ellipse' : 'rect') };
            gesture.preview.setAttribute('class', 'lab-layout-preview'); svg.appendChild(gesture.preview);
        } else if (group) {
            selectedId = group.dataset.layoutItem;
            renderInspector();
            gesture = { mode: !snapshot.canArrange ? 'select' : event.target.closest('[data-layout-resize]') && !snapshot.readOnly ? 'resize' : 'move', pointerId: event.pointerId, svg, start: point, clientX: event.clientX, clientY: event.clientY, before: copy(plans), item: selected(), original: copy(selected()), group, moved: false };
        } else {
            selectedId = ''; renderInspector();
            gesture = { mode: 'pan', pointerId: event.pointerId, svg, start: point, clientX: event.clientX, clientY: event.clientY, viewport: svg.parentElement, scrollX: svg.parentElement.scrollLeft, scrollY: svg.parentElement.scrollTop, before: copy(plans) };
        }
        svg.setPointerCapture(event.pointerId);
        event.preventDefault();
    });

    root.addEventListener('pointermove', event => {
        if (!gesture || event.pointerId !== gesture.pointerId) return;
        if (gesture.mode === 'select') return;
        if (gesture.mode === 'pan') {
            gesture.viewport.scrollLeft = gesture.scrollX - (event.clientX - gesture.clientX);
            gesture.viewport.scrollTop = gesture.scrollY - (event.clientY - gesture.clientY);
            event.preventDefault(); return;
        }
        const point = position(event, gesture.svg);
        const dx = point.x - gesture.start.x, dy = point.y - gesture.start.y;
        if (gesture.mode === 'draw') {
            gesture.end = point;
            const box = drawBox(gesture.start, point, scene());
            const attributes = gesture.preview.tagName === 'ellipse' ? { cx: box.x + box.width / 2, cy: box.y + box.height / 2, rx: box.width / 2, ry: box.height / 2 } : box;
            Object.entries(attributes).forEach(([key, value]) => gesture.preview.setAttribute(key, value));
        } else {
            if (!gesture.moved && Math.hypot(event.clientX - gesture.clientX, event.clientY - gesture.clientY) < 5) return;
            gesture.moved = true;
            const box = fitBox(Object.assign({}, gesture.original, gesture.mode === 'move' ? { x: gesture.original.x + dx, y: gesture.original.y + dy } : { width: gesture.original.width + dx, height: gesture.original.height + dy }), scene());
            Object.assign(gesture.item, box);
            if (gesture.mode === 'move') gesture.group.setAttribute('transform', 'translate(' + box.x + ' ' + box.y + ')');
            else renderBoard();
        }
        event.preventDefault();
    });

    root.addEventListener('pointerup', event => {
        if (!gesture || event.pointerId !== gesture.pointerId) return;
        const previous = gesture;
        gesture = null;
        if (previous.svg.hasPointerCapture(event.pointerId)) previous.svg.releasePointerCapture(event.pointerId);
        if (previous.mode === 'pan') { renderBoard(); renderInspector(); return; }
        if (previous.mode === 'draw') {
            const end = previous.end || position(event, previous.svg);
            const box = previous.end ? drawBox(previous.start, end, scene()) : fitBox({ x: end.x, y: end.y, width: tool === 'corridor' ? 340 : tool === 'device' ? 160 : 260, height: tool === 'corridor' ? 80 : tool === 'device' ? 110 : 190 }, scene());
            const item = newItem(box); scene().items.push(item); selectedId = item.id; tool = 'select'; save(previous.before);
        } else if (previous.moved) save(previous.before, true);
        else if (previous.item.kind === 'room') enterRoom(previous.item.id);
        else { renderBoard(); renderInspector(); }
    });
    root.addEventListener('pointercancel', event => { if (gesture && event.pointerId === gesture.pointerId) cancelGesture(); });

    root.addEventListener('submit', event => {
        const form = event.target.closest('[data-layout-form]');
        if (!form || snapshot.readOnly) return;
        event.preventDefault();
        const values = new FormData(form);
        const before = copy(plans);
        const target = form.dataset.layoutForm === 'item' ? selected() : form.dataset.layoutForm === 'room' ? room() : plan();
        if (!target) return;
        target.name = values.get('name');
        target.width = Number(values.get('width')); target.height = Number(values.get('height'));
        if (form.dataset.layoutForm !== 'plan') {
            target.x = Number(values.get('x')); target.y = Number(values.get('y')); target.shape = values.get('shapeType'); target.notes = values.get('notes');
            if (target.kind === 'room') { target.function = values.get('purpose'); target.purpose = values.get('customPurpose'); target.interiorWidth = Number(values.get('interiorWidth')); target.interiorHeight = Number(values.get('interiorHeight')); }
            if (target.kind === 'device') { target.deviceType = values.get('deviceType'); target.link = values.get('link'); }
        }
        save(before);
    });

    root.addEventListener('change', event => {
        if (!event.target.matches('[data-layout-plan]')) return;
        planId = event.target.value; roomId = ''; selectedId = ''; tool = 'select'; zoom = 1; render();
    });

    function action(name) {
        if (name === 'back') { roomId = ''; selectedId = ''; tool = 'select'; render(); return; }
        if (name === 'enter' && selected()) { enterRoom(selected().id); return; }
        if (name === 'open-device') { const linked = snapshot.equipment.find(item => item.id === selected().link); if (linked) bridge().openEquipment(linked.id); return; }
        if (['zoom-in', 'zoom-out', 'fit'].includes(name)) { zoom = name === 'fit' ? Math.min(1, root.querySelector('.lab-layout-viewport').clientWidth / 640) : Math.min(3, Math.max(.35, zoom + (name === 'zoom-in' ? .2 : -.2))); renderBoard(); return; }
        if (snapshot.readOnly) return;
        const before = copy(plans);
        if (name === 'new') { const created = { id: id(), name: '', width: 1200, height: 800, items: [] }; plans.push(created); planId = created.id; roomId = ''; selectedId = ''; tool = 'room'; save(before); return; }
        if (name === 'delete-plan') { if (!window.confirm(t('deletePlanConfirm'))) return; plans = plans.filter(item => item.id !== planId); planId = plans[0] ? plans[0].id : ''; roomId = ''; selectedId = ''; save(before); return; }
        if (name === 'undo' || name === 'redo') { const source = name === 'undo' ? history : future; if (!source.length) return; const value = source.pop(); (name === 'undo' ? future : history).push(before); plans = value; if (!plan()) { planId = plans[0] ? plans[0].id : ''; roomId = ''; } if (!room()) roomId = ''; selectedId = ''; save(before, false, false); return; }
        const item = selected();
        if (!item) return;
        if (name === 'duplicate') { const duplicate = copy(item); duplicate.id = id(); if (duplicate.items) duplicate.items.forEach(child => { child.id = id(); }); Object.assign(duplicate, fitBox(Object.assign({}, duplicate, { x: item.x + 24, y: item.y + 24 }), scene())); scene().items.push(duplicate); selectedId = duplicate.id; }
        if (name === 'front') { scene().items.splice(scene().items.indexOf(item), 1); scene().items.push(item); }
        if (name === 'delete-item') { if (!window.confirm(t(item.kind === 'room' ? 'deleteRoomConfirm' : 'deleteItemConfirm'))) return; scene().items.splice(scene().items.indexOf(item), 1); selectedId = ''; }
        save(before);
    }

    root.addEventListener('click', event => {
        const enter = event.target.closest('[data-layout-enter]');
        if (enter) { enterRoom(enter.dataset.layoutEnter); return; }
        const toolButton = event.target.closest('[data-layout-tool]');
        if (toolButton && !toolButton.disabled) { tool = toolButton.dataset.layoutTool; render(); return; }
        const actionButton = event.target.closest('[data-layout-action]');
        if (actionButton && !actionButton.disabled) action(actionButton.dataset.layoutAction);
    });

    root.addEventListener('keydown', event => {
        if (event.target.closest('input,select,textarea')) return;
        if (event.key === 'Escape') { if (gesture) cancelGesture(); else { tool = 'select'; render(); } return; }
        const group = event.target.closest('[data-layout-item]');
        if (!group) return;
        selectedId = group.dataset.layoutItem;
        const item = selected();
        if (!item) return;
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (item.kind === 'room') enterRoom(item.id); else renderInspector(); return; }
        if (!snapshot.canArrange || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault(); const before = copy(plans); const amount = event.shiftKey ? 20 : 5;
        Object.assign(item, fitBox(Object.assign({}, item, { x: item.x + (event.key === 'ArrowRight' ? amount : event.key === 'ArrowLeft' ? -amount : 0), y: item.y + (event.key === 'ArrowDown' ? amount : event.key === 'ArrowUp' ? -amount : 0) }), scene()));
        save(before, true); Array.from(root.querySelectorAll('[data-layout-item]')).find(node => node.dataset.layoutItem === item.id)?.focus();
    });

    window.addEventListener('rhine:ready', refresh);
    window.addEventListener('rhine:layoutchange', refresh);
    window.addEventListener('rhine:languagechange', refresh);
    refresh();
}());
