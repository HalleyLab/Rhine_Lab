import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [app, bootstrap, css, mobile, html, themeInit, i18n, defaultVial] = await Promise.all([
  readFile(new URL('../js/rhine-lab.js', import.meta.url), 'utf8'),
  readFile(new URL('../js/rhine-lab-bootstrap.js', import.meta.url), 'utf8'),
  readFile(new URL('../css/rhine-lab.css', import.meta.url), 'utf8'),
  readFile(new URL('../css/rhine-lab-mobile.css', import.meta.url), 'utf8'),
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../js/rhine-lab-theme-init.js', import.meta.url), 'utf8'),
  readFile(new URL('../js/rhine-lab-i18n.js', import.meta.url), 'utf8'),
  readFile(new URL('../images/reagent-vial-default.svg', import.meta.url), 'utf8')
]);

assert.match(app, /function coldStorageRackPosition/);
assert.match(app, /rackPositions: rackPositions/);
assert.match(app, /data-storage-device-slot/);
assert.match(app, /grid-row:' \+ position\.row \+ '\/span ' \+ layout\.rows/);
assert.match(app, /function bindColdStorageBoxGridDrag/);
assert.match(app, /function bindColdStorageReagentDrag/);
assert.match(app, /function reagentDoorDropAction/);
const reagentDropAction = new Function(app.match(/function reagentDoorDropAction\(source, target\) \{[\s\S]*?\n    \}/)[0] + '; return reagentDoorDropAction;')();
const sameReagentStorageArea = new Function(app.match(/function sameReagentStorageArea\(position, target\) \{[\s\S]*?\n    \}/)[0] + '; return sameReagentStorageArea;')();
const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value)));
const reagentDoorPosition = new Function('number', app.match(/function reagentDoorPosition\(reagent\) \{[\s\S]*?\n    \}/)[0] + '; return reagentDoorPosition;')(clamp);
const reagentDropCoordinates = new Function('number', app.match(/function reagentDropCoordinates\(pointer, bounds\) \{[\s\S]*?\n    \}/)[0] + '; return reagentDropCoordinates;')(clamp);
const bottleFunctions = new Function('esc', app.match(/function reagentBottleVisualHtml\(reagent\) \{[\s\S]*?\n    \}/)[0] + app.match(/function reagentBottleHtml\(reagent, className, attributes\) \{[\s\S]*?\n    \}/)[0] + '; return { visual: reagentBottleVisualHtml, button: reagentBottleHtml };')(String);
const emptyWorkspace = new Function(app.match(/function emptyWorkspaceState\(\) \{[\s\S]*?\n    \}/)[0] + '; return emptyWorkspaceState;')();
assert.equal(reagentDropAction({ area: 'door', unitId: 'A', shelf: 1 }, { area: 'door', unitId: 'B', shelf: 2, x: 40, y: 60 }), 'move');
assert.equal(reagentDropAction(null, { area: 'device', unitId: 'B', x: 40, y: 60 }), 'move');
assert.equal(reagentDropAction(null, { area: 'box', unitId: 'B', boxId: 'BOX-1', x: 40, y: 60 }), 'move');
assert.equal(reagentDropAction(null, { pool: true }), 'none');
assert.equal(sameReagentStorageArea({ area: 'door', unitId: 'A', shelf: 2 }, { area: 'door', unitId: 'A', shelf: 2 }), true);
assert.equal(sameReagentStorageArea({ area: 'door', unitId: 'A', shelf: 2 }, { area: 'door', unitId: 'A', shelf: 3 }), false);
assert.equal(sameReagentStorageArea({ area: 'box', unitId: 'A', boxId: 'B1' }, { area: 'box', unitId: 'A', boxId: 'B1' }), true);
assert.equal(reagentDoorPosition({ doorStorage: { area: 'device', unitId: 'A', x: 4, y: 2 } }).y, 2);
assert.deepEqual(reagentDropCoordinates({ clientX: 0, clientY: 0 }, { left: 0, top: 0, width: 240, height: 460 }), { x: 5, y: 5 });
assert.match(bottleFunctions.visual({ bottleStyle: '试剂瓶', photoData: '' }), /reagent-vial-default\.svg/);
assert.match(bottleFunctions.visual({ bottleStyle: 'EP 管', photoData: 'photo' }), /bottle-style-photo has-photo/);
assert.match(bottleFunctions.button({ name: 'DMEM', catalog: '11965092', location: '4°C' }, 'reagent-door-bottle', ''), /data-reagent-name="DMEM"/);
assert.match(bottleFunctions.button({ name: 'DMEM', catalog: '11965092', location: '4°C' }, 'reagent-door-bottle', ''), /aria-label="DMEM"/);
assert.doesNotMatch(bottleFunctions.button({ name: 'DMEM', catalog: '11965092', location: '4°C' }, 'reagent-door-bottle', ''), /title=/);
assert.deepEqual(emptyWorkspace().coldStorageUnits, []);
assert.deepEqual(emptyWorkspace().freezerBoxes, []);
assert.deepEqual(emptyWorkspace().microbeIncubators, []);
assert.deepEqual(emptyWorkspace().microbeRacks, []);
assert.match(app, /data-door-shelf/);
assert.match(app, /nextReagentStorageZ/);
assert.match(app, /position\.x \+ '%;top:' \+ position\.y/);
assert.match(app, /reagentBottleVisualHtml/);
assert.match(app, /reagent\.bottleStyle === 'EP 管' \? 'ep-tube'/);
assert.match(app, /const detail = reagent\.name;/);
assert.match(app, /ghostSource: handle \|\| row\.querySelector\('\.reagent-inventory-bottle'\)/);
assert.match(app, /images\/reagent-vial-default\.svg/);
assert.match(defaultVial, /viewBox="0 0 64 132"/);
assert.match(app, /data-reagent-device-area/);
assert.match(app, /data-reagent-box-area/);
assert.match(app, /if \(publicDemoMode\) return;/);
assert.match(app, /return publicDemoMode \|\| workspaceMode === 'lab'/);
assert.match(app, /reagent-inventory-bottle/);
assert.match(app, /#reagentTable \[data-reagent-catalog\]/);
assert.match(app, /addEventListener\('drop'[\s\S]*preparePhotoAttachment/);
assert.match(app, /preparePhotoAttachment\(input, droppedFile\)/);
assert.match(app, /drag\.ghost\.classList\.add\('housing-slot-drag-ghost'\)/);
assert.doesNotMatch(app, /drag\.ghost\.className = 'housing-slot-drag-ghost'/);
assert.doesNotMatch(app, /data-door-slot/);
assert.doesNotMatch(app, /doorSlots/);
assert.match(html, /id="coldStorageSideDoor"/);
assert.match(html, /<header><strong>侧门<\/strong><\/header>/);
assert.doesNotMatch(html, /试剂侧门|自由放置/);
assert.doesNotMatch(html, /coldStorageReagentTray|待放入试剂/);
assert.ok(html.indexOf('data-view="cells"') < html.indexOf('data-view="reagents"') && html.indexOf('data-view="reagents"') < html.indexOf('data-view="samples"'));
assert.match(css, /\.reagent-bottle-visual::after/);
assert.match(css, /\.photo-capture\.is-drop-target/);
assert.match(css, /\.reagent-bottle-visual\.has-photo/);
assert.match(css, /\.bottle-style-ep-tube/);
assert.match(css, /\.freezer-box-reagent-layer/);
assert.match(css, /#reagentFilters button/);
assert.match(css, /\.reagent-door-free-area/);
assert.match(css, /\.reagent-name-bubble/);
assert.match(app, /requestAnimationFrame\(flushReagentDrag\)/);
assert.match(app, /querySelector\(boxArea \? '\.freezer-box-reagent-layer' : '\.cold-storage-device-reagent-layer'\)/);
assert.match(mobile, /\.cold-storage-device\.has-reagent-door/);
assert.match(app, /other \? '交换冻存盒位置'/);
assert.match(app, /function openColdStorageDeviceDuringDrag/);
assert.match(app, /function bindHousingSlotDrag/);
assert.match(app, /data-biological-drag="mouse"/);
assert.match(app, /data-biological-drag="plant"/);
assert.match(app, /data-biological-drag="microbe"/);
assert.match(app, /function biologicalDragIconHtml/);
assert.match(app, /目标笼位已达到容量上限/);
assert.match(app, /function renderMicrobeHousing/);
assert.match(html, /id="microbeIncubatorMap"/);
assert.match(html, /data-add="microbeRack"/);
assert.match(app, /const touchPoints = new Map\(\)/);
assert.match(app, /touchPoints\.size < 2/);
assert.match(app, /touchIds: new Set/);
assert.match(app, /function housingHitAt/);
assert.match(app, /function housingSlotTargetAt/);
assert.match(app, /document\.elementsFromPoint/);
assert.match(app, /event\.type === 'pointerup' \? housingSlotTargetAt\(x, y, drag\.kind\) : null/);
assert.doesNotMatch(app, /drag\.slot\.releasePointerCapture/);
assert.match(app, /function coldStorageRackDropPlan/);
assert.match(app, /function coldStorageApplyRackDrop/);
assert.match(app, /coldStorageSchemaVersion = 2/);
assert.match(app, /deviceRows: 4, deviceColumns: 4, rackCount: 0, rows: 4, columns: 4/);
assert.match(app, /name: '货架#' \+ rack/);
assert.match(i18n, /\^货架#\(\\d\+\)\$/);
assert.match(i18n, /点击空位放置冻存盒/);
assert.match(i18n, /第 \(\\d\+\) 行第 \(\\d\+\) 位/);
assert.match(app, /inputmode="numeric"/);
assert.match(app, /els\.coldStorageOverview\.hidden = coldStorageOverviewHidden/);
assert.doesNotMatch(app, /每架 .*盒位/);
assert.match(app, /cold-storage-slot empty[^\n]+<strong>＋<\/strong>/);
assert.match(css, /rack-drop-preview/);
assert.match(css, /\.dark-theme \.global-search kbd/);
assert.match(css, /\.dark-theme \.animal-rack-position\.active/);
assert.match(css, /\.cold-storage-device-slot\.drop-target/);
assert.match(css, /body\.background-all-lives \.freezer-box-tab\.active small/);
assert.match(css, /\.record-detail-body,.experiment-detail-body,.freezer-scan-body/);
assert.match(css, /html\.native-app body\.dark-theme \.app-boot-screen/);
assert.match(mobile, /\.view > \.page-heading \+ \*/);
assert.match(mobile, /\.view\.active > \* \+ \*/);
assert.match(mobile, /touch-action: pan-x/);
assert.match(mobile, /\.animal-rack-position\.occupied \{ touch-action: none; \}/);
assert.match(mobile, /width: 100% !important;\s*\n\s*max-width: 100% !important;\s*\n\s*min-width: 0 !important;/);
assert.match(mobile, /grid-template-columns: 18px max-content !important/);
assert.match(mobile, /input,\s*\n\s*select,\s*\n\s*textarea \{\s*\n\s*font-size: 16px !important/);
assert.match(html, /id="editColdStorageRackButton"/);
assert.ok(html.indexOf('rhine-lab-theme-init.js') < html.indexOf('rhine-lab.css'));
assert.match(themeInit, /getHours\(\) < 6/);
assert.match(bootstrap, /'rhineLabWorkspaceV3', 'rhineLabWorkspaceV3:lab'/);
assert.match(bootstrap, /readLocal\('rhineLabWorkspaceV2' \+ suffix\)/);
assert.match(bootstrap, /writeLocal\(currentKey, previousValue\)/);
assert.match(app, /const emptyFirstRun = mode === 'lab' \|\| isInstalledAppRuntime\(\) \|\| isBrowserAppRuntime\(\);/);
assert.match(app, /coldStorageUnits: \[\],\s*freezerBoxes: \[\]/);
assert.match(app, /Array\.isArray\(data\.coldStorageUnits\) \? data\.coldStorageUnits/);
assert.match(app, /if \(!activeUnit\) \{[\s\S]*尚未添加冻存设备/);

async function runBootstrap(initialValues) {
  const values = new Map(Object.entries(initialValues));
  const writes = [];
  const crypto = {
    prepareLocalStorage: async function () {},
    readLocal: function (key) { return values.has(key) ? values.get(key) : null; },
    writeLocal: async function (key, value) { writes.push([key, value]); values.set(key, value); }
  };
  const document = { body: { dataset: {}, appendChild: function () {} }, createElement: function () { return {}; } };
  const localStorage = { length: 0, key: function () { return null; } };
  new Function('window', 'document', 'localStorage', bootstrap)({ RHINE_LAB_CONFIG: {}, RhineLabCrypto: crypto }, document, localStorage);
  await new Promise(function (resolve) { setTimeout(resolve, 0); });
  return { values, writes };
}

const migratedStorage = await runBootstrap({ rhineLabWorkspaceV2: { marker: 'legacy' } });
assert.deepEqual(migratedStorage.values.get('rhineLabWorkspaceV3'), { marker: 'legacy' });
const preservedStorage = await runBootstrap({ rhineLabWorkspaceV2: { marker: 'legacy' }, rhineLabWorkspaceV3: { marker: 'current' } });
assert.deepEqual(preservedStorage.values.get('rhineLabWorkspaceV3'), { marker: 'current' });
assert.equal(preservedStorage.writes.length, 0);

const cultureHelpers = new Function('number', 'positiveNumber', 'normalizeHousingRooms', 'housingLayoutCoordinate', 'anonymousContributor',
  app.match(/function normalizePlantPosition\(value\) \{[^\n]*\}/)[0] +
  app.match(/function isValidPlantPosition\(rack, position\) \{[^\n]*\}/)[0] +
  app.match(/function formatMicrobeLocation\(rack, position, incubators\) \{[\s\S]*?\n    \}/)[0] +
  app.match(/function migrateMicrobeHousing\(data\) \{[\s\S]*?\n    \}/)[0] +
  '; return { migrate: migrateMicrobeHousing, valid: isValidPlantPosition };'
)(clamp, value => Math.max(0, Number(value) || 0), rooms => rooms, () => 25, value => value);
assert.equal(cultureHelpers.valid({ rows: 4, columns: 4 }, 'A0'), false);
assert.equal(cultureHelpers.valid({ rows: 4, columns: 4 }, 'D4'), true);
assert.equal(cultureHelpers.valid({ rows: 4, columns: 4 }, 'E1'), false);
const cultureData = {
  microbeIncubators: [{ id: 'INC', name: '37°C' }],
  microbeRacks: [{ id: 'R1', incubatorId: 'INC', rows: 2.6, columns: 5.5 }],
  microbes: [{ id: 'M1', rackId: 'R1', position: 'a-1' }, { id: 'M2', rackId: 'R1', position: 'A1', location: 'original' }]
};
cultureHelpers.migrate(cultureData);
assert.equal(cultureData.microbeRacks[0].rows, 3); assert.equal(cultureData.microbeRacks[0].columns, 6);
assert.equal(cultureData.microbes[0].location, '37°C / 摇架 #1 / A1');
assert.equal(cultureData.microbes[1].rackId, ''); assert.equal(cultureData.microbes[1].location, 'original');
const emptyCulture = { microbeIncubators: [], microbeRacks: [], microbes: [] };
cultureHelpers.migrate(emptyCulture); assert.deepEqual(emptyCulture.microbeIncubators, []);

// Exercise the actual pointer handlers, not a separate copy of the move logic.
function housingDragHarness(kind, state, target) {
  const listeners = new Map();
  const classes = () => ({ add() {}, remove() {} });
  const source = { dataset: { biologicalDrag: kind, biologicalItem: 'moving' }, classList: classes(), closest: () => source };
  const env = {
    state, saves: 0, messages: [],
    activeAnimalRackId: 'R1', activePlantRackId: 'R1', activeMicrobeRackId: 'R1',
    selectedAnimalCageId: '', selectedPlantId: '', selectedMicrobeId: '',
    zoomedAnimalRoomId: '', zoomedPlantRoomId: '', zoomedMicrobeIncubatorId: '',
    document: {
      addEventListener(name, handler) { const handlers = listeners.get(name) || []; handlers.push(handler); listeners.set(name, handlers); },
      body: { appendChild() {}, setPointerCapture() {}, hasPointerCapture: () => false },
      createElement: () => ({ classList: classes(), style: {}, setAttribute() {}, remove() {} })
    },
    window: { setTimeout() {} }, localStorage: { setItem() {} },
    dragInteractionsLocked: () => false, housingHitAt: () => null,
    housingSlotTargetAt: () => env.target,
    biologicalDragIconHtml: () => '<svg></svg>',
    saveState: () => env.saves++, showToast: message => env.messages.push(message), addActivity() {},
    renderMice() {}, renderPlants() {}, renderBioResources() {},
    selectAnimalRoom() {}, selectPlantRoom() {}, selectMicrobeIncubator() {},
    selectAnimalRack() {}, selectPlantRack() {}, selectMicrobeRack() {},
    formatPlantLocation: (rack, position) => rack ? rack.id + '/' + position : 'unassigned',
    formatMicrobeLocation: (rack, position) => rack ? rack.id + '/' + position : 'unassigned',
    target: target && { dataset: target, classList: classes() }
  };
  new Function('env', 'with (env) {' + app.match(/function bindHousingSlotDrag\(\) \{[\s\S]*?\n    \}/)[0] + '; bindHousingSlotDrag(); }')(env);
  const send = (type, x = 80) => (listeners.get(type) || []).forEach(handler => handler({ type, target: source, button: 0, pointerType: 'mouse', pointerId: 1, clientX: x, clientY: 80, preventDefault() {}, stopPropagation() {} }));
  send('pointerdown', 10); send('pointermove');
  return { env, send };
}
const dragState = () => ({
  mice: [{ id: 'moving', cageId: 'C1' }],
  animalCages: [{ id: 'C1', rackId: 'R1', label: 'A1', capacity: 2 }, { id: 'C2', rackId: 'R2', label: 'B1', capacity: 1 }],
  plants: [{ id: 'moving', rackId: 'R1', position: 'A1' }, { id: 'other', rackId: 'R2', position: 'B2' }],
  microbes: [{ id: 'moving', rackId: 'R1', position: 'A1' }, { id: 'other', rackId: 'R2', position: 'B2' }],
  plantRacks: [{ id: 'R1' }, { id: 'R2' }], microbeRacks: [{ id: 'R1' }, { id: 'R2' }]
});
let dragCheck = housingDragHarness('mouse', dragState(), { animalCage: 'C2' });
dragCheck.send('pointerup');
assert.equal(dragCheck.env.state.mice[0].cageId, 'C2');
assert.equal(dragCheck.env.saves, 1);
const fullCageState = dragState(); fullCageState.mice.push({ id: 'resident', cageId: 'C2' });
dragCheck = housingDragHarness('mouse', fullCageState, { animalCage: 'C2' }); dragCheck.send('pointerup');
assert.equal(fullCageState.mice[0].cageId, 'C1'); assert.equal(dragCheck.env.saves, 0);
assert.match(dragCheck.env.messages[0], /容量上限/);
for (const kind of ['plant', 'microbe']) {
  dragCheck = housingDragHarness(kind, dragState(), { rackId: 'R2', position: 'B2' }); dragCheck.send('pointerup');
  const records = dragCheck.env.state[kind === 'plant' ? 'plants' : 'microbes'];
  assert.equal(records[0].location, 'R2/B2'); assert.equal(records[1].location, 'R1/A1');
  assert.equal(dragCheck.env.saves, 1);
}
dragCheck = housingDragHarness('plant', dragState(), { rackId: 'R2', position: 'A3' }); dragCheck.send('pointerup');
assert.equal(dragCheck.env.state.plants[0].position, 'A3');
dragCheck = housingDragHarness('mouse', dragState(), { animalCage: 'C2' }); dragCheck.send('pointercancel');
assert.equal(dragCheck.env.state.mice[0].cageId, 'C1'); assert.equal(dragCheck.env.saves, 0);
dragCheck = housingDragHarness('plant', dragState(), { rackId: 'R2', position: 'B2' });
dragCheck.env.target = null; dragCheck.send('pointerup'); assert.equal(dragCheck.env.saves, 0);
const unassignedCulture = dragState(); unassignedCulture.microbes[0].rackId = ''; unassignedCulture.microbes[0].position = '';
dragCheck = housingDragHarness('microbe', unassignedCulture, { rackId: 'R2', position: 'B2' }); dragCheck.send('pointerup');
assert.equal(unassignedCulture.microbes[1].position, 'B2'); assert.equal(dragCheck.env.saves, 0);

console.log('Storage layout, mobile tools, theme, and biology drag checks passed.');
