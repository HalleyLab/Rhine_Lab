(function () {
    'use strict';

    const STORAGE_KEY = 'rhineLabWorkspaceV3';
    const INPUT_MEMORY_KEY = 'rhineLabInputMemoryV2';

    const defaults = {
        experiments: [
            { id: 'RL-EXP-026', title: '海马区神经元钙成像', project: '记忆环路可塑性', createdBy: 'NODE-01', status: '进行中', type: '活体成像', date: '2026-08-08', progress: 68, description: '记录情境恐惧训练后 CA1 神经元群体活动，完成基线与召回阶段成像。' },
            { id: 'RL-EXP-025', title: '候选分子 A17 药效验证', project: '神经炎症干预', createdBy: 'NODE-02', status: '待分析', type: '细胞实验', date: '2026-08-07', progress: 84, description: '比较三种浓度下 BV2 细胞炎症因子表达，原始 qPCR 数据等待质控。' },
            { id: 'RL-EXP-024', title: 'Cre 系小鼠基因型鉴定', project: '动物队列构建', createdBy: 'NODE-01', status: '已完成', type: '基因分型', date: '2026-08-06', progress: 100, description: '完成本周断奶小鼠耳样 PCR 与凝胶成像，共鉴定 18 只动物。' },
            { id: 'RL-EXP-023', title: '脑片膜片钳参数优化', project: '突触传递机制', createdBy: 'NODE-03', status: '进行中', type: '电生理', date: '2026-08-05', progress: 45, description: '优化 ACSF 灌流速度与串联电阻阈值，提高稳定记录时长。' },
            { id: 'RL-EXP-022', title: 'LPS 剂量响应曲线', project: '神经炎症干预', createdBy: 'NODE-02', status: '已完成', type: '蛋白检测', date: '2026-08-03', progress: 100, description: '建立 0–1000 ng/mL 剂量响应曲线，确定后续干预实验工作浓度。' },
            { id: 'RL-EXP-021', title: '病毒滴度预实验', project: '记忆环路可塑性', createdBy: 'NODE-01', status: '待分析', type: '病毒载体', date: '2026-08-01', progress: 76, description: '对三个稀释梯度进行感染效率比较，等待图像定量结果。' }
        ],
        results: [
            { id: 'RL-RES-001', experimentId: 'RL-EXP-027', date: '2026-08-04', summary: '16 份脑区 RNA 样本中，14 份 RIN ≥ 8.0，浓度与纯度达到建库要求。', conclusion: '低温匀浆与快速相分离流程稳定，可继续用于后续转录组样本制备。', nextStep: '复核两份低完整性样本的取材与冻融记录。', attachments: [], createdBy: 'NODE-03', history: [] },
            { id: 'RL-RES-002', experimentId: 'RL-EXP-029', date: '2026-08-07', summary: '三个感染复数均检测到荧光表达，其中中剂量组在 72 小时时信噪比最佳。', conclusion: '中剂量条件兼顾表达强度与细胞状态，适合作为后续验证的起始参数。', nextStep: '补充更晚时间点并完成图像盲法定量。', attachments: [], createdBy: 'NODE-05', history: [] }
        ],
        mice: [
            { id: 'M-24071', strain: 'C57BL/6J', genotype: 'WT', sex: '雄', birth: '2026-05-18', cage: 'A-12', status: '实验中', ethics: 'ZJU2026-017' },
            { id: 'M-24072', strain: 'C57BL/6J', genotype: 'WT', sex: '雄', birth: '2026-05-18', cage: 'A-12', status: '实验中', ethics: 'ZJU2026-017' },
            { id: 'M-24088', strain: 'Camk2a-Cre', genotype: 'Cre+', sex: '雌', birth: '2026-06-02', cage: 'B-04', status: '繁育中', ethics: 'ZJU2026-021' },
            { id: 'M-24089', strain: 'Camk2a-Cre', genotype: 'Cre−', sex: '雌', birth: '2026-06-02', cage: 'B-04', status: '待分配', ethics: 'ZJU2026-021' },
            { id: 'M-24102', strain: 'Ai148', genotype: 'Tg/+', sex: '雄', birth: '2026-06-21', cage: 'B-11', status: '繁育中', ethics: 'ZJU2026-021' },
            { id: 'M-24103', strain: 'Ai148', genotype: 'WT', sex: '雌', birth: '2026-06-21', cage: 'B-11', status: '待分配', ethics: 'ZJU2026-021' },
            { id: 'M-24117', strain: 'C57BL/6J', genotype: 'WT', sex: '雌', birth: '2026-07-05', cage: 'C-02', status: '观察期', ethics: 'ZJU2026-017' },
            { id: 'M-24118', strain: 'C57BL/6J', genotype: 'WT', sex: '雄', birth: '2026-07-05', cage: 'C-02', status: '观察期', ethics: 'ZJU2026-017' }
        ],
        cellCultures: [
            { id: 'CELL-BV2-01', name: 'BV2', species: 'Mus musculus', medium: 'DMEM + 10% FBS', container: 'T75 培养瓶', vesselCount: 2, incubator: '37°C / 5% CO₂ · INC-02 / B3', passage: 18, confluence: 68, nextAction: '2026-08-09', status: '培养中', notes: '形态均一，无明显漂浮细胞。', createdBy: 'NODE-02', history: [
                { id: 'CELLLOG-BV2-003', date: '2026-08-07', action: '传代', passage: 18, ratio: '1:4', container: 'T75 培养瓶', vesselCount: 2, confluence: 86, medium: 'DMEM + 10% FBS', notes: 'PBS 清洗后常规消化，贴壁状态正常。', photoData: '' },
                { id: 'CELLLOG-BV2-002', date: '2026-08-05', action: '换液', passage: 17, ratio: '—', container: 'T75 培养瓶', vesselCount: 1, confluence: 62, medium: 'DMEM + 10% FBS', notes: '培养基颜色正常。', photoData: '' }
            ] },
            { id: 'CELL-HEK293T-02', name: 'HEK293T', species: 'Homo sapiens', medium: 'DMEM + 10% FBS + P/S', container: '10 cm 培养皿', vesselCount: 3, incubator: '37°C / 5% CO₂ · INC-01 / A2', passage: 31, confluence: 42, nextAction: '2026-08-10', status: '培养中', notes: '用于 AAV 包装预实验。', createdBy: 'NODE-05', history: [
                { id: 'CELLLOG-293T-002', date: '2026-08-08', action: '传代', passage: 31, ratio: '1:5', container: '10 cm 培养皿', vesselCount: 3, confluence: 92, medium: 'DMEM + 10% FBS + P/S', notes: '分瓶后分布均匀。', photoData: '' }
            ] },
            { id: 'CELL-ORG-03', name: 'iPSC 神经类器官', species: 'Homo sapiens', medium: 'Neural differentiation medium', container: '低吸附 6 孔板', vesselCount: 2, incubator: '37°C / 5% CO₂ · INC-03 / C1', passage: 7, confluence: 55, nextAction: '2026-08-09', status: '分化中', notes: 'D42，计划下一次半量换液并拍照。', createdBy: 'NODE-04', history: [
                { id: 'CELLLOG-ORG-002', date: '2026-08-07', action: '换液', passage: 7, ratio: '半量', container: '低吸附 6 孔板', vesselCount: 2, confluence: 55, medium: 'Neural differentiation medium', notes: '类器官边界清晰，未见明显坏死中心扩大。', photoData: '' }
            ] },
            { id: 'CELL-ASTRO-04', name: '原代星形胶质细胞', species: 'Rattus norvegicus', medium: 'DMEM/F12 + 10% FBS', container: 'T25 培养瓶', vesselCount: 2, incubator: '37°C / 5% CO₂ · INC-02 / B1', passage: 3, confluence: 82, nextAction: '2026-08-08', status: '待传代', notes: '汇合度较高，建议今日完成传代。', createdBy: 'NODE-03', history: [
                { id: 'CELLLOG-ASTRO-001', date: '2026-08-04', action: '复苏', passage: 3, ratio: '1 vial', container: 'T25 培养瓶', vesselCount: 2, confluence: 18, medium: 'DMEM/F12 + 10% FBS', notes: '复苏后贴壁良好。', photoData: '' }
            ] }
        ],
        reagents: [
            { name: 'Anti-c-Fos antibody', category: '抗体', catalog: 'ab190289', lot: 'GR3418-7', location: '-20°C / R2-B4', amount: 18, expiry: '2026-09-12', status: '余量低' },
            { name: 'DMEM, high glucose', category: '培养基', catalog: '11965092', lot: '2645218', location: '4°C / C1-A2', amount: 66, expiry: '2027-01-28', status: '正常' },
            { name: 'Matrigel Matrix', category: '培养基', catalog: '354234', lot: '3227005', location: '-20°C / R1-C3', amount: 32, expiry: '2026-08-22', status: '临期' },
            { name: 'Paraformaldehyde', category: '化学试剂', catalog: 'P6148', lot: 'SLCP9012', location: 'RT / S3-12', amount: 72, expiry: '2028-03-14', status: '正常' },
            { name: 'DAPI Solution', category: '染料', catalog: 'D9542', lot: 'MKCP1178', location: '4°C / C2-D1', amount: 43, expiry: '2027-05-05', status: '正常' },
            { name: 'TRIzol Reagent', category: '化学试剂', catalog: '15596026', lot: '2834011', location: '4°C / C1-B5', amount: 21, expiry: '2026-12-30', status: '余量低' },
            { name: 'Anti-GAPDH antibody', category: '抗体', catalog: '2118S', lot: '16', location: '-20°C / R2-B2', amount: 54, expiry: '2027-08-19', status: '正常' },
            { name: 'Fetal Bovine Serum', category: '培养基', catalog: '10099141', lot: '2710390', location: '-20°C / R1-A1', amount: 80, expiry: '2028-01-08', status: '正常' }
        ],
        samples: [
            { id: 'RL-S-0861', type: '脑组织', source: 'M-24071 / 海马', processing: 'PFA 固定', location: 'FZ-03/B2 · A2', date: '2026-08-08', status: '在库' },
            { id: 'RL-S-0860', type: '脑组织', source: 'M-24072 / 海马', processing: '液氮速冻', location: 'FZ-03/B2 · A5', date: '2026-08-08', status: '在库' },
            { id: 'RL-S-0858', type: '细胞沉淀', source: 'BV2 / LPS-500', processing: 'PBS 清洗', location: 'FZ-03/B2 · B3', date: '2026-08-07', status: '在库' },
            { id: 'RL-S-0856', type: 'RNA', source: 'BV2 / Vehicle', processing: 'TRIzol 提取', location: 'FZ-03/B2 · C4', date: '2026-08-07', status: '在库' },
            { id: 'RL-S-0849', type: '血清', source: 'M-23991', processing: '2000g / 10min', location: 'FZ-03/B2 · D1', date: '2026-08-05', status: '在库' },
            { id: 'RL-S-0842', type: 'DNA', source: 'M-24088 / 耳样', processing: 'Proteinase K', location: 'FZ-03/B2 · E6', date: '2026-08-04', status: '在库' },
            { id: 'RL-S-0837', type: '蛋白裂解液', source: 'HEK293T / A17', processing: 'RIPA 裂解', location: 'FZ-03/B2 · F2', date: '2026-08-03', status: '剩余少' },
            { id: 'RL-S-0829', type: '切片', source: 'M-23987 / PFC', processing: '30 μm 冠状切片', location: 'FZ-03/B2 · F7', date: '2026-08-01', status: '在库' }
        ],
        coldStorageUnits: [
            { id: 'COLD-FZ03', name: '-80°C 超低温冰箱 FZ-03', type: '超低温冰箱', temperature: '-80°C', location: '样本库 A 区 / 北墙 03 位', orientation: '横向', layoutX: 20, layoutY: 30, shelves: 5, rows: 1, columns: 4, levels: [{ mode: 'direct', rows: 1, columns: 4 }, { mode: 'rack', rows: 2, columns: 4 }, { mode: 'rack', rows: 3, columns: 4 }, { mode: 'direct', rows: 1, columns: 4 }, { mode: 'rack', rows: 2, columns: 4 }] },
            { id: 'COLD-LN02', name: '气相液氮罐 LN-02', type: '液氮罐', temperature: '液氮', location: '样本库 B 区 / 液氮平台 02 位', orientation: '竖向', layoutX: 68, layoutY: 42, shelves: 3, rows: 1, columns: 4, levels: [{ mode: 'rack', rows: 1, columns: 4 }, { mode: 'rack', rows: 2, columns: 4 }, { mode: 'rack', rows: 2, columns: 4 }] }
        ],
        freezerBoxes: [
            { id: 'FB-FZ03-B2', name: 'FZ-03-S2-R1C1', storageUnitId: 'COLD-FZ03', shelf: 2, storageRow: 1, storageColumn: 1, storageLocation: '-80°C 超低温冰箱 FZ-03 · 第 2 层 · 第 1 行第 1 位', temperature: '-80°C', rows: 9, columns: 9 },
            { id: 'FB-FZ03-C1', name: 'FZ-03-S3-R1C1', storageUnitId: 'COLD-FZ03', shelf: 3, storageRow: 1, storageColumn: 1, storageLocation: '-80°C 超低温冰箱 FZ-03 · 第 3 层 · 第 1 行第 1 位', temperature: '-80°C', rows: 9, columns: 9 },
            { id: 'FB-LN02-A1', name: 'LN02-S1-R1C1', storageUnitId: 'COLD-LN02', shelf: 1, storageRow: 1, storageColumn: 1, storageLocation: '气相液氮罐 LN-02 · 第 1 层 · 第 1 位', temperature: '液氮', rows: 9, columns: 9 }
        ],
        schedule: [
            { id: 'T-101', date: '2026-08-08', time: '09:00', end: '10:00', title: 'BV2 细胞换液', resource: '细胞房 · BSC-02', type: 'cell', protocolId: 'SOP-CC-014', done: true },
            { id: 'T-102', date: '2026-08-08', time: '10:30', end: '11:30', title: '小鼠基因分型取样', resource: '屏障设施 · A 区', type: 'animal', protocolId: 'SOP-AN-008', done: false },
            { id: 'T-103', date: '2026-08-08', time: '14:30', end: '16:00', title: '海马区双光子成像', resource: '成像中心 · 2P-01', type: 'cell', experimentId: 'RL-EXP-026', protocolId: 'SOP-IM-021', done: false },
            { id: 'T-104', date: '2026-08-08', time: '16:30', end: '17:30', title: 'qPCR 数据质控', resource: '分析工位 · WS-07', type: 'analysis', protocolId: '', done: false },
            { id: 'T-105', date: '2026-08-08', time: '18:00', end: '19:00', title: '项目周会', resource: '会议室 · R203', type: 'meeting', protocolId: '', done: false },
            { id: 'T-106', date: '2026-08-11', time: '09:30', end: '11:00', title: '免疫荧光染色', resource: '组织学平台 · IF-02', type: 'cell', protocolId: 'SOP-IM-021', done: false },
            { id: 'T-107', date: '2026-08-18', time: '13:00', end: '15:00', title: 'Western Blot', resource: '分子平台 · WB-03', type: 'analysis', protocolId: 'SOP-MB-033', done: false }
        ],
        activities: [
            { text: '更新了“海马区神经元钙成像”的实验进度', time: '8 分钟前' },
            { text: '系统检测到 Anti-c-Fos antibody 库存低于阈值', time: '32 分钟前' },
            { text: '上传了 24 份 qPCR 原始结果', time: '1 小时前' },
            { text: 'M-24088 的基因型记录已通过复核', time: '昨天 18:42' }
        ]
    };

    const protocols = [
        { id: 'SOP-CC-014', number: 'SOP-CC-014 · V3.2', title: '哺乳动物细胞复苏', summary: '从液氮取样、快速复温到换液培养的标准流程，含 DMSO 去除与污染检查。', steps: ['37°C 水浴快速复温冻存管', '将细胞缓慢转移至预温完全培养基', '300g 离心 5 分钟并弃去上清', '用新鲜培养基重悬并接种', '次日换液并记录细胞状态'], reagents: [{ catalog: '11965092', amount: 12 }, { catalog: '10099141', amount: 2 }], tag: '细胞培养', meta: '更新 2026-07-18' },
        { id: 'SOP-AN-008', number: 'SOP-AN-008 · V2.6', title: '小鼠基因型鉴定', summary: '耳样采集、裂解、PCR 扩增及凝胶结果判读，包含动物编号核对节点。', steps: ['核对动物编号与伦理批件', '采集耳样并完成笼卡记录', 'Proteinase K 裂解组织', '配置 PCR 反应体系', '琼脂糖凝胶电泳', '判读条带并回填基因型'], reagents: [], tag: '动物实验', meta: '更新 2026-07-29' },
        { id: 'SOP-IM-021', number: 'SOP-IM-021 · V1.9', title: '免疫荧光染色', summary: '固定、通透、封闭、一抗孵育、二抗染色和封片成像的完整操作序列。', steps: ['PFA 固定并用 PBS 清洗', '通透与血清封闭', '一抗 4°C 孵育过夜', '清洗并孵育荧光二抗', 'DAPI 染核', '封片并完成成像'], reagents: [{ catalog: 'P6148', amount: 25 }, { catalog: 'ab190289', amount: 2 }, { catalog: 'D9542', amount: 0.02 }], tag: '组织学', meta: '更新 2026-08-02' },
        { id: 'SOP-MB-033', number: 'SOP-MB-033 · V4.1', title: 'Western Blot', summary: '蛋白定量、制胶电泳、转膜、抗体孵育与曝光定量，附异常条带排查。', steps: ['裂解样本并完成蛋白定量', '配置凝胶并上样电泳', '湿转至 PVDF 膜', '封闭并孵育一抗', '清洗并孵育二抗', '化学发光成像', '归一化定量并存档'], reagents: [{ catalog: '2118S', amount: 2 }], tag: '分子生物学', meta: '更新 2026-06-24' },
        { id: 'SOP-AN-017', number: 'SOP-AN-017 · V2.2', title: '立体定位病毒注射', summary: '麻醉、颅骨定位、缓慢注射、退针及术后恢复的关键参数与伦理要求。', steps: ['核对动物与病毒信息', '诱导麻醉并固定头部', '暴露颅骨并确定坐标', '钻孔并缓慢进针', '低速注射病毒', '静置后缓慢退针', '缝合并进行术后监护'], reagents: [], tag: '动物手术', meta: '更新 2026-07-11' },
        { id: 'SOP-EP-006', number: 'SOP-EP-006 · V1.7', title: '急性脑片制备', summary: '灌流、取脑、切片与恢复液孵育流程，强调低温、氧合与时间控制。', steps: ['预冷切片液并持续氧合', '深麻醉后快速取脑', '修块并固定于振动切片机', '完成目标厚度切片', '恢复液孵育并记录时间'], reagents: [], tag: '电生理', meta: '更新 2026-05-30' }
    ];

    const reagentProfiles = {
        'ab190289': { totalQty: 100, unit: 'µL' },
        '11965092': { totalQty: 500, unit: 'mL' },
        '354234': { totalQty: 10, unit: 'mL' },
        'P6148': { totalQty: 1000, unit: 'mL' },
        'D9542': { totalQty: 10, unit: 'mL' },
        '15596026': { totalQty: 100, unit: 'mL' },
        '2118S': { totalQty: 100, unit: 'µL' },
        '10099141': { totalQty: 500, unit: 'mL' }
    };

    const additionalExamples = {
        experiments: [
            { id: 'RL-EXP-030', title: '神经类器官氧化应激成像', project: '神经退行性病变模型', createdBy: 'NODE-04', status: '进行中', type: '三维培养', date: '2026-08-08', progress: 52, description: '比较过氧化氢刺激前后类器官 ROS 信号与细胞死亡空间分布。', protocolId: 'SOP-IM-021' },
            { id: 'RL-EXP-029', title: 'AAV 表达窗口验证', project: '病毒载体质控', createdBy: 'NODE-05', status: '待分析', type: '病毒载体', date: '2026-08-07', progress: 81, description: '对三个感染复数和四个观察时间点进行荧光表达强度比较。' },
            { id: 'RL-EXP-028', title: '星形胶质细胞代谢追踪', project: '胶质细胞代谢耦联', createdBy: 'NODE-02', status: '进行中', type: '细胞实验', date: '2026-08-06', progress: 37, description: '使用荧光葡萄糖类似物追踪炎症刺激后的摄取速率变化。' },
            { id: 'RL-EXP-027', title: '脑组织 RNA 完整性评估', project: '转录组样本质控', createdBy: 'NODE-03', status: '已完成', type: '核酸质控', date: '2026-08-04', progress: 100, description: '完成 16 份脑区样本的浓度、纯度与完整性检测并筛选建库样本。', protocolId: 'SOP-MB-041' }
        ],
        results: [
            { id: 'RL-RES-001', experimentId: 'RL-EXP-027', date: '2026-08-04', summary: '16 份脑区 RNA 样本中，14 份 RIN ≥ 8.0，浓度与纯度达到建库要求。', conclusion: '低温匀浆与快速相分离流程稳定，可继续用于后续转录组样本制备。', nextStep: '复核两份低完整性样本的取材与冻融记录。', attachments: [], createdBy: 'NODE-03', history: [] },
            { id: 'RL-RES-002', experimentId: 'RL-EXP-029', date: '2026-08-07', summary: '三个感染复数均检测到荧光表达，其中中剂量组在 72 小时时信噪比最佳。', conclusion: '中剂量条件兼顾表达强度与细胞状态，适合作为后续验证的起始参数。', nextStep: '补充更晚时间点并完成图像盲法定量。', attachments: [], createdBy: 'NODE-05', history: [] }
        ],
        mice: [
            { id: 'M-24119', strain: 'Aldh1l1-CreERT2', genotype: 'Cre+', sex: '雌', birth: '2026-07-09', cage: 'C-06', status: '观察期', ethics: 'ZJU2026-026', createdBy: 'NODE-04' },
            { id: 'M-24120', strain: 'Aldh1l1-CreERT2', genotype: 'Cre−', sex: '雄', birth: '2026-07-09', cage: 'C-06', status: '待分配', ethics: 'ZJU2026-026', createdBy: 'NODE-04' },
            { id: 'M-24121', strain: 'Thy1-GCaMP6s', genotype: 'Tg/+', sex: '雄', birth: '2026-06-28', cage: 'D-03', status: '实验中', ethics: 'ZJU2026-017', createdBy: 'NODE-05' },
            { id: 'M-24122', strain: 'C57BL/6J', genotype: 'WT', sex: '雌', birth: '2026-07-16', cage: 'D-08', status: '繁育中', ethics: 'ZJU2026-031', createdBy: 'NODE-02' }
        ],
        reagents: [
            { name: 'PBS, pH 7.4', category: '培养基', catalog: 'P4417', lot: 'SLDR4821', location: 'RT / S2-08', totalQty: 1000, currentQty: 760, unit: 'mL', expiry: '2028-05-20', status: '正常', createdBy: 'NODE-04' },
            { name: 'Proteinase K', category: '酶', catalog: 'P8107S', lot: '10084217', location: '-20°C / R3-A2', totalQty: 5, currentQty: 3.2, unit: 'mL', expiry: '2027-11-03', status: '正常', createdBy: 'NODE-03' },
            { name: 'RIPA Lysis Buffer', category: '化学试剂', catalog: '89900', lot: 'XD352906', location: '4°C / C2-B3', totalQty: 100, currentQty: 14, unit: 'mL', expiry: '2027-02-18', status: '余量低', createdBy: 'NODE-02' },
            { name: 'ECL Substrate', category: '化学试剂', catalog: '34580', lot: 'WK341155', location: '4°C / C3-D4', totalQty: 50, currentQty: 28, unit: 'mL', expiry: '2027-06-11', status: '正常', createdBy: 'NODE-05' },
            { name: 'Agarose, molecular biology grade', category: '化学试剂', catalog: 'A9539', lot: 'BCBW9214', location: 'RT / S1-15', totalQty: 100, currentQty: 64, unit: 'g', expiry: '2029-01-30', status: '正常', createdBy: 'NODE-03' }
        ],
        samples: [
            { id: 'RL-S-0869', type: 'RNA', source: 'M-24121 / 视觉皮层', processing: 'TRIzol 提取', location: 'FZ-03/C1 · A1', date: '2026-08-08', status: '在库', createdBy: 'NODE-05' },
            { id: 'RL-S-0868', type: '脑组织', source: 'M-24119 / 纹状体', processing: '液氮速冻', location: 'FZ-03/C1 · A4', date: '2026-08-08', status: '在库', createdBy: 'NODE-04' },
            { id: 'RL-S-0867', type: '细胞沉淀', source: '类器官 / H2O2-200', processing: 'PBS 清洗', location: 'FZ-03/C1 · B2', date: '2026-08-07', status: '在库', createdBy: 'NODE-04' },
            { id: 'RL-S-0866', type: 'DNA', source: 'M-24120 / 耳样', processing: 'Proteinase K', location: 'FZ-03/C1 · C7', date: '2026-08-07', status: '在库', createdBy: 'NODE-03' },
            { id: 'RL-S-0865', type: '血清', source: 'M-24122', processing: '2000g / 10min', location: 'FZ-03/C1 · G3', date: '2026-08-06', status: '在库', createdBy: 'NODE-02' },
            { id: 'RL-S-0864', type: '蛋白裂解液', source: 'BV2 / A17-10µM', processing: 'RIPA 裂解', location: 'FZ-03/C1 · H8', date: '2026-08-06', status: '剩余少', createdBy: 'NODE-02' },
            { id: 'RL-S-0863', type: '细胞沉淀', source: 'HEK293T / AAV-07', processing: '液氮速冻', location: 'LN-02/A1 · D5', date: '2026-08-05', status: '在库', createdBy: 'NODE-05' },
            { id: 'RL-S-0862', type: '脑组织', source: 'M-24121 / 海马', processing: 'PFA 固定', location: 'LN-02/A1 · I9', date: '2026-08-05', status: '在库', createdBy: 'NODE-05' }
        ],
        protocols: [
            { id: 'SOP-MB-041', number: 'SOP-MB-041 · V1.3', title: '组织 RNA 提取与质控', summary: '从低温组织匀浆、相分离到 RNA 纯化和完整性检查的标准流程。', steps: ['预冷器材并核对样本编号', '加入 TRIzol 完成组织匀浆', '室温静置并加入氯仿', '离心后转移水相', '异丙醇沉淀 RNA', '乙醇清洗并溶解沉淀', '测定浓度与纯度', '完成完整性检测并归档'], reagents: [{ catalog: '15596026', amount: 1 }, { catalog: 'P4417', amount: 8 }], tag: '分子生物学', meta: '更新 2026-08-05', createdBy: 'NODE-03' },
            { id: 'SOP-CC-029', number: 'SOP-CC-029 · V2.0', title: 'BV2 炎症刺激与收样', summary: '细胞铺板、血清同步化、刺激处理、时间点收样与污染检查流程。', steps: ['检查细胞密度与形态', '按目标密度完成铺板', '更换同步化培养基', '配置刺激物工作液', '加入刺激物并开始计时', '按时间点采集培养上清', 'PBS 清洗并收集细胞', '记录显微图像与异常情况'], reagents: [{ catalog: '11965092', amount: 18 }, { catalog: '10099141', amount: 1.8 }, { catalog: 'P4417', amount: 12 }], tag: '细胞培养', meta: '更新 2026-08-06', createdBy: 'NODE-02' }
        ],
        schedule: [
            { id: 'T-201', date: '2026-08-09', time: '08:30', end: '10:00', title: '组织 RNA 提取', resource: '分子平台 · RNA-02', type: 'analysis', protocolId: 'SOP-MB-041', done: false, createdBy: 'NODE-03' },
            { id: 'T-202', date: '2026-08-09', time: '13:30', end: '15:00', title: 'BV2 炎症刺激', resource: '细胞房 · BSC-03', type: 'cell', experimentId: 'RL-EXP-028', protocolId: 'SOP-CC-029', done: false, createdBy: 'NODE-02' },
            { id: 'T-203', date: '2026-08-10', time: '10:00', end: '11:30', title: '类器官 ROS 成像', resource: '成像中心 · CLSM-04', type: 'cell', experimentId: 'RL-EXP-030', protocolId: 'SOP-IM-021', done: false, createdBy: 'NODE-04' },
            { id: 'T-204', date: '2026-08-12', time: '14:00', end: '16:00', title: 'AAV 表达定量', resource: '分析工位 · WS-03', type: 'analysis', protocolId: '', done: false, createdBy: 'NODE-05' },
            { id: 'T-205', date: '2026-08-14', time: '09:00', end: '10:30', title: '动物队列健康检查', resource: '屏障设施 · C 区', type: 'animal', protocolId: '', done: false, createdBy: 'NODE-04' }
        ],
        activities: [
            { text: '新增了“组织 RNA 提取与质控”Protocol', time: '2 小时前' },
            { text: '完成了 FZ-03 / C1 冻存盒样本盘点', time: '昨天 16:20' }
        ]
    };

    const facilityLoads = [
        { name: '双光子显微镜', value: 80 },
        { name: '屏障动物设施', value: 60 },
        { name: '超速离心机', value: 40 },
        { name: '流式细胞仪', value: 90 }
    ];

    const apparatusDefinitions = {
        plate96: { label: '96 孔板', rows: 8, columns: 12, shape: 'round' },
        plate24: { label: '24 孔板', rows: 4, columns: 6, shape: 'round' },
        plate12: { label: '12 孔板', rows: 3, columns: 4, shape: 'round' },
        plate6: { label: '6 孔板', rows: 2, columns: 3, shape: 'round' },
        tubeRack: { label: '离心管架', rows: 6, columns: 8, shape: 'round' },
        slides: { label: '载玻片架', rows: 2, columns: 5, shape: 'slot' },
        gel: { label: '凝胶加样槽', rows: 2, columns: 10, shape: 'slot' },
        custom: { label: '自定义装置网格', rows: 6, columns: 6, shape: 'square' }
    };

    protocols.push.apply(protocols, clone(additionalExamples.protocols));
    defaults.experiments = defaults.experiments.concat(clone(additionalExamples.experiments));
    defaults.results = clone(additionalExamples.results);
    defaults.mice = defaults.mice.concat(clone(additionalExamples.mice));
    defaults.plants = [
        { id: 'PLT-AT-001', name: '拟南芥 Col-0', scientificName: 'Arabidopsis thaliana', materialType: '种子 / 植株', accession: 'Col-0', generation: 'T3', genotype: 'WT', growthStage: '莲座期', growthConditions: '22°C · 16 h / 8 h 光周期', location: '植物房 GR-01 / A2', parentage: 'T2 自交后代', treatment: '对照', phenotype: '株型均一，叶色正常', status: '生长中', frozenSampleId: '', notes: '', createdBy: 'NODE-04', history: [] },
        { id: 'PLT-NB-002', name: '本氏烟草', scientificName: 'Nicotiana benthamiana', materialType: '植株', accession: 'LAB-NB-01', generation: 'P1', genotype: 'WT', growthStage: '6 叶期', growthConditions: '24°C · 16 h / 8 h 光周期', location: '植物房 GR-02 / B1', parentage: '种子繁殖', treatment: '待农杆菌浸润', phenotype: '叶片展开正常', status: '待处理', frozenSampleId: '', notes: '', createdBy: 'NODE-04', history: [] },
        { id: 'PLT-RC-003', name: '水稻愈伤组织', scientificName: 'Oryza sativa', materialType: '愈伤组织', accession: 'Nipponbare', generation: 'T0', genotype: '编辑候选株', growthStage: '诱导期', growthConditions: '28°C · 暗培养', location: '组织培养室 TC-01 / C3', parentage: '成熟胚诱导', treatment: '潮霉素筛选', phenotype: '淡黄色颗粒状愈伤', status: '筛选中', frozenSampleId: '', notes: '', createdBy: 'NODE-03', history: [] }
    ];
    defaults.plantRooms = [
        { id: 'PROOM-GR01', name: '植物房 GR-01', notes: '标准光照培养室', createdBy: 'NODE-04' },
        { id: 'PROOM-TC01', name: '组织培养室 TC-01', notes: '无菌组织培养区', createdBy: 'NODE-03' }
    ];
    defaults.plantRacks = [
        { id: 'PRACK-GR01-01', roomId: 'PROOM-GR01', name: 'GR-01 培养架 1', facility: '植物房 GR-01', rows: 5, columns: 10, layoutX: 18, layoutY: 28, createdBy: 'NODE-04' },
        { id: 'PRACK-TC01-02', roomId: 'PROOM-TC01', name: 'TC-01 培养架 1', facility: '组织培养室 TC-01', rows: 4, columns: 8, layoutX: 22, layoutY: 32, createdBy: 'NODE-03' }
    ];
    defaults.plants[0].rackId = 'PRACK-GR01-01'; defaults.plants[0].position = 'A2';
    defaults.plants[1].rackId = 'PRACK-GR01-01'; defaults.plants[1].position = 'B1';
    defaults.plants[2].rackId = 'PRACK-TC01-02'; defaults.plants[2].position = 'C3';
    defaults.bioProjects = [
        { id: 'BIO-PRJ-001', name: '海马空间转录组图谱', organism: 'Mus musculus', referenceGenome: 'GRCm39 / mm39', objective: '解析记忆形成相关的空间表达变化', organization: '神经基因组工作组', repository: 'DATA-01 / projects/hippocampus-st', status: '进行中', notes: '', createdBy: 'NODE-03', history: [] },
        { id: 'BIO-PRJ-002', name: '拟南芥胁迫响应变异分析', organism: 'Arabidopsis thaliana', referenceGenome: 'TAIR10', objective: '比较干旱处理前后的变异与表达特征', organization: '植物系统研究组', repository: 'DATA-02 / projects/ath-stress', status: '准备中', notes: '', createdBy: 'NODE-04', history: [] }
    ];
    defaults.bioDatasets = [
        { id: 'BIO-DATA-001', name: 'CA1 Visium 原始测序数据', dataType: '空间转录组', projectId: 'BIO-PRJ-001', sampleSource: 'RL-S-0869', accession: 'LOCAL-ST-2608', size: '186 GB', checksum: 'SHA256 已校验', location: 'DATA-01 / raw/visium', format: 'FASTQ + TIFF', notes: '', createdBy: 'NODE-03', history: [] },
        { id: 'BIO-DATA-002', name: '拟南芥胁迫 RNA-seq', dataType: 'RNA-seq', projectId: 'BIO-PRJ-002', sampleSource: 'PLT-AT-001', accession: 'LOCAL-RNA-2611', size: '72 GB', checksum: 'SHA256 已校验', location: 'DATA-02 / raw/rnaseq', format: 'FASTQ', notes: '', createdBy: 'NODE-04', history: [] }
    ];
    defaults.bioPipelines = [
        { id: 'BIO-FLOW-001', name: 'RNA-seq 标准流程', version: 'nf-core/rnaseq 3.18', analysisType: '转录组定量', environment: 'Nextflow · Docker', repository: 'github.com/nf-core/rnaseq', inputType: 'FASTQ + sample sheet', outputType: 'QC + counts + BAM', command: 'nextflow run nf-core/rnaseq -profile docker', projectId: '', notes: '', createdBy: 'NODE-03', history: [] },
        { id: 'BIO-FLOW-002', name: '短变异检测流程', version: 'GATK 4.6', analysisType: 'SNV / Indel calling', environment: 'WDL · Cromwell', repository: 'broadinstitute/gatk', inputType: 'FASTQ / BAM', outputType: 'gVCF / VCF', command: 'java -jar cromwell.jar run workflow.wdl', projectId: '', notes: '', createdBy: 'NODE-02', history: [] }
    ];
    defaults.bioRuns = [
        { id: 'BIO-RUN-001', projectId: 'BIO-PRJ-001', pipelineId: 'BIO-FLOW-001', datasetId: 'BIO-DATA-001', compute: 'WORKSTATION-03 · 24 CPU · 96 GB', startDate: '2026-08-08', endDate: '', status: '运行中', outputLocation: 'DATA-01 / results/st-2608', notes: '已完成原始数据质控。', createdBy: 'NODE-03', history: [] }
    ];
    defaults.microbes = [
        { id: 'MIC-DH5A-001', name: 'E. coli DH5α', species: 'Escherichia coli', strain: 'DH5α', biosafetyLevel: 'BSL-1', genotype: 'recA1 · endA1 · hsdR17', source: '实验室保藏', medium: 'LB', growthConditions: '37°C · 200 rpm', resistance: '无', location: '-80°C / MIC-A1', status: '在库', frozenSampleId: '', notes: '用于常规质粒克隆。', createdBy: 'NODE-02', history: [] },
        { id: 'MIC-BL21-002', name: 'E. coli BL21(DE3)', species: 'Escherichia coli', strain: 'BL21(DE3)', biosafetyLevel: 'BSL-1', genotype: 'T7 RNA polymerase', source: '实验室保藏', medium: 'LB', growthConditions: '37°C · 200 rpm', resistance: '无', location: '-80°C / MIC-A2', status: '在库', frozenSampleId: '', notes: '用于重组蛋白表达。', createdBy: 'NODE-02', history: [] },
        { id: 'MIC-GV31-003', name: 'A. tumefaciens GV3101', species: 'Agrobacterium tumefaciens', strain: 'GV3101', biosafetyLevel: 'BSL-1', genotype: 'pMP90', source: '植物平台', medium: 'YEB', growthConditions: '28°C · 200 rpm', resistance: 'Rifampicin', location: '-80°C / MIC-B1', status: '在库', frozenSampleId: '', notes: '用于植物瞬时表达。', createdBy: 'NODE-04', history: [] }
    ];
    defaults.plasmids = [
        { id: 'PLA-PUC19-001', name: 'pUC19', backbone: 'pUC19', insert: '无', host: 'E. coli DH5α', sizeBp: 2686, resistance: 'Ampicillin', promoter: 'lac', source: '实验室保藏', sequenceRef: 'GenBank / 本地序列文件', location: '-20°C / DNA-A1', status: '在库', frozenSampleId: '', notes: '', createdBy: 'NODE-02', history: [] },
        { id: 'PLA-GFP-002', name: 'pLenti-EF1α-GFP', backbone: 'Lentiviral transfer vector', insert: 'GFP', host: 'E. coli Stbl3', sizeBp: 8740, resistance: 'Ampicillin', promoter: 'EF1α', source: '载体平台', sequenceRef: '本地 GenBank 记录', location: '-20°C / DNA-A3', status: '在库', frozenSampleId: '', notes: '慢病毒包装用转移质粒。', createdBy: 'NODE-05', history: [] }
    ];
    defaults.viruses = [
        { id: 'VIR-AAV9-001', name: 'AAV9-hSyn-GCaMP6s', virusType: 'AAV 载体', serotype: 'AAV9', genome: 'ssAAV', cargo: 'hSyn-GCaMP6s', hostRange: '神经元', titer: '2.1 × 10¹³ vg/mL', batch: 'AAV9-2607', biosafetyLevel: 'BSL-1', productionDate: '2026-07-18', location: '-80°C / VIR-A1', status: '在库', frozenSampleId: '', notes: '', createdBy: 'NODE-01', history: [] },
        { id: 'VIR-LV-002', name: 'LV-EF1α-GFP', virusType: '慢病毒载体', serotype: 'VSV-G 假型', genome: 'RNA', cargo: 'EF1α-GFP', hostRange: '哺乳动物细胞', titer: '8.4 × 10⁸ TU/mL', batch: 'LV-2608-02', biosafetyLevel: 'BSL-2', productionDate: '2026-08-02', location: '-80°C / VIR-B2', status: '在库', frozenSampleId: '', notes: '', createdBy: 'NODE-05', history: [] }
    ];    defaults.reagents = defaults.reagents.concat(clone(additionalExamples.reagents));
    defaults.samples = defaults.samples.concat(clone(additionalExamples.samples));
    defaults.schedule = defaults.schedule.concat(clone(additionalExamples.schedule));
    defaults.activities = defaults.activities.concat(clone(additionalExamples.activities));
    defaults.protocols = clone(protocols);
    defaults.formulations = [
        {
            id: 'FORM-DEMO-001', name: '1× PBS · pH 7.4', physicalForm: '液体', purpose: '细胞与组织常规清洗',
            finalAmount: 1, unit: 'L', concentration: '1×', storage: '室温', version: 'V1.0',
            components: [
                { name: 'NaCl', amount: '8', unit: 'g' },
                { name: 'KCl', amount: '0.2', unit: 'g' },
                { name: 'Na₂HPO₄', amount: '1.44', unit: 'g' },
                { name: 'KH₂PO₄', amount: '0.24', unit: 'g' },
                { name: '超纯水', amount: '定容至', unit: '1 L' }
            ],
            preparation: '依次溶解各组分，以 HCl 或 NaOH 调整至 pH 7.4，定容后按实验要求灭菌。',
            notes: '', createdBy: 'LOCAL-NODE', history: []
        },
        {
            id: 'FORM-DEMO-002', name: '1.5% 琼脂糖凝胶', physicalForm: '凝胶', purpose: 'DNA 琼脂糖凝胶电泳',
            finalAmount: 50, unit: 'mL', concentration: '1.5% (w/v)', storage: '现配现用', version: 'V1.0',
            components: [
                { name: 'Agarose', amount: '0.75', unit: 'g' },
                { name: '1× TAE', amount: '50', unit: 'mL' }
            ],
            preparation: '混匀后加热至琼脂糖完全溶解，冷却至约 60°C 后灌胶。',
            notes: '', createdBy: 'LOCAL-NODE', history: []
        },
        {
            id: 'FORM-DEMO-003', name: '细胞培养混合气', physicalForm: '气体', purpose: '哺乳动物细胞培养箱供气',
            finalAmount: 1, unit: 'batch', concentration: '5% CO₂', storage: '合规气瓶与减压阀', version: 'V1.0',
            components: [
                { name: 'CO₂', amount: '5', unit: '%' },
                { name: 'O₂', amount: '20.9', unit: '%' },
                { name: 'N₂', amount: '余量', unit: '%' }
            ],
            preparation: '由合规供应商预混并提供组分证书；连接培养箱前核对标签、压力与有效期。',
            notes: '', createdBy: 'LOCAL-NODE', history: []
        }
    ];
    defaults.exampleSeedVersion = 7;
    defaults.auditLog = [];
    defaults.lineageLinks = [
        { id: 'LIN-DEMO-001', sourceType: 'animal', sourceId: 'M-24121', targetType: 'sample', targetId: 'RL-S-0869', relation: '取材', quantity: 1, unit: '份', notes: '视觉皮层取材后立即低温处理。', date: '2026-08-08' },
        { id: 'LIN-DEMO-002', sourceType: 'sample', sourceId: 'RL-S-0869', targetType: 'experiment', targetId: 'RL-EXP-027', relation: '用于实验', quantity: 1, unit: '份', notes: '用于 RNA 完整性评估。', date: '2026-08-08' },
        { id: 'LIN-DEMO-003', sourceType: 'cell', sourceId: 'CELL-BV2-01', targetType: 'sample', targetId: 'RL-S-0858', relation: '收集', quantity: 1, unit: '份', notes: 'LPS 处理后收集细胞沉淀。', date: '2026-08-07' },
        { id: 'LIN-DEMO-004', sourceType: 'sample', sourceId: 'RL-S-0858', targetType: 'experiment', targetId: 'RL-EXP-028', relation: '用于实验', quantity: 1, unit: '份', notes: '用于炎症刺激后的代谢追踪。', date: '2026-08-07' },
        { id: 'LIN-DEMO-005', sourceType: 'cell', sourceId: 'CELL-ORG-03', targetType: 'sample', targetId: 'RL-S-0867', relation: '收集', quantity: 1, unit: '份', notes: '氧化应激处理后收集。', date: '2026-08-07' },
        { id: 'LIN-DEMO-006', sourceType: 'sample', sourceId: 'RL-S-0867', targetType: 'experiment', targetId: 'RL-EXP-030', relation: '用于实验', quantity: 1, unit: '份', notes: '关联类器官氧化应激成像。', date: '2026-08-08' }
    ];
    defaults.plateLayouts = [{
        id: 'PLATE-DEMO-001', name: 'BV2 剂量响应', format: 96, experimentId: 'RL-EXP-028', protocolId: 'SOP-CC-029', updatedAt: '2026-08-08T09:00:00.000Z',
        wells: {
            A1: { sample: 'Vehicle', treatment: 'Vehicle', concentration: 0, unit: 'ng/mL', color: '#c9d5d0' }, A2: { sample: 'Vehicle', treatment: 'Vehicle', concentration: 0, unit: 'ng/mL', color: '#c9d5d0' }, A3: { sample: 'Vehicle', treatment: 'Vehicle', concentration: 0, unit: 'ng/mL', color: '#c9d5d0' },
            B1: { sample: 'LPS-low', treatment: 'LPS', concentration: 10, unit: 'ng/mL', color: '#d8ef8f' }, B2: { sample: 'LPS-low', treatment: 'LPS', concentration: 10, unit: 'ng/mL', color: '#d8ef8f' }, B3: { sample: 'LPS-low', treatment: 'LPS', concentration: 10, unit: 'ng/mL', color: '#d8ef8f' },
            C1: { sample: 'LPS-mid', treatment: 'LPS', concentration: 100, unit: 'ng/mL', color: '#b7d948' }, C2: { sample: 'LPS-mid', treatment: 'LPS', concentration: 100, unit: 'ng/mL', color: '#b7d948' }, C3: { sample: 'LPS-mid', treatment: 'LPS', concentration: 100, unit: 'ng/mL', color: '#b7d948' },
            D1: { sample: 'LPS-high', treatment: 'LPS', concentration: 1000, unit: 'ng/mL', color: '#f0b04a' }, D2: { sample: 'LPS-high', treatment: 'LPS', concentration: 1000, unit: 'ng/mL', color: '#f0b04a' }, D3: { sample: 'LPS-high', treatment: 'LPS', concentration: 1000, unit: 'ng/mL', color: '#f0b04a' }
        }
    }];

    applyConfiguredSeed(window.RHINE_LAB_SEED);
    seedDefaultAnimalHousing();

    function seedDefaultAnimalHousing() {
        if (!Array.isArray(defaults.animalRooms) || !defaults.animalRooms.length) {
            defaults.animalRooms = [{ id: 'AROOM-DEMO-01', name: '动物中心 · A 区', notes: '屏障设施饲养室', createdBy: 'NODE-01' }];
        }
        if (!Array.isArray(defaults.animalRacks) || !defaults.animalRacks.length) {
            defaults.animalRacks = [{ id: 'RACK-DEMO-01', roomId: defaults.animalRooms[0].id, name: 'A 区笼架 1', facility: defaults.animalRooms[0].name, rows: 4, columns: 12, layoutX: 18, layoutY: 28, createdBy: 'NODE-01' }];
        }
        const rack = defaults.animalRacks[0];
        const cages = Array.isArray(defaults.animalCages) ? defaults.animalCages.slice() : [];
        const byLabel = new Map(cages.map(function (cage) { return [String(cage.label || cage.position), cage]; }));
        defaults.mice = defaults.mice.map(function (animal) {
            const legacyLabel = String(animal.cage || '未分配');
            let cage = byLabel.get(legacyLabel);
            if (!cage) {
                const position = normalizeAnimalPosition(legacyLabel) || firstAvailableAnimalPosition(rack, cages);
                cage = {
                    id: 'CAGE-DEMO-' + String(cages.length + 1).padStart(3, '0'),
                    rackId: rack.id,
                    position: position,
                    label: legacyLabel,
                    species: animal.species || '小鼠',
                    capacity: 5,
                    status: '在用',
                    notes: '',
                    createdBy: animal.createdBy || 'NODE-01'
                };
                cages.push(cage);
                byLabel.set(legacyLabel, cage);
            }
            return Object.assign({}, animal, { species: animal.species || '小鼠', cageId: cage.id, cage: cage.label });
        });
        defaults.animalCages = cages;
    }

    function applyConfiguredSeed(seed) {
        if (!seed || typeof seed !== 'object') return;
        ['experiments', 'results', 'mice', 'animalRooms', 'animalRacks', 'animalCages', 'plants', 'plantRooms', 'plantRacks', 'microbes', 'plasmids', 'viruses', 'bioProjects', 'bioDatasets', 'bioPipelines', 'bioRuns', 'cellCultures', 'reagents', 'samples', 'coldStorageUnits', 'freezerBoxes', 'schedule', 'activities', 'lineageLinks', 'plateLayouts', 'formulations'].forEach(function (key) {
            if (Array.isArray(seed[key])) defaults[key] = clone(seed[key]);
        });
        if (Array.isArray(seed.protocols)) {
            protocols.splice(0, protocols.length);
            protocols.push.apply(protocols, clone(seed.protocols));
            defaults.protocols = clone(seed.protocols);
        }
        defaults.exampleSeedVersion = Number(seed.exampleSeedVersion) || 7;
    }

    let publicDemoUnlocked = true;
    let workspaceMode = localStorage.getItem('rhineLabWorkspaceMode') === 'lab' ? 'lab' : 'personal';
    let state = migrateState(loadState(workspaceMode));
    let activeView = getInitialView();
    let experimentFilter = '全部';
    let reagentFilter = '全部';
    const publicDemoMode = isPublicDemoRuntime();
    let workspaceAccess = { authenticated: true, labReadOnly: false };
    let workspaceReadOnly = workspaceMode === 'lab';
    let selectedSampleId = state.samples[0] ? state.samples[0].id : '';
    let activeFreezerBoxId = state.freezerBoxes.some(box => box.id === localStorage.getItem('rhineLabActiveFreezerBox')) ? localStorage.getItem('rhineLabActiveFreezerBox') : state.freezerBoxes[0].id;
    let activeColdStorageId = state.coldStorageUnits.some(unit => unit.id === localStorage.getItem('rhineLabActiveColdStorage')) ? localStorage.getItem('rhineLabActiveColdStorage') : ((state.freezerBoxes.find(box => box.id === activeFreezerBoxId) || {}).storageUnitId || state.coldStorageUnits[0].id);
    let activeColdStorageShelf = Math.max(1, Number(localStorage.getItem('rhineLabActiveColdStorageShelf')) || Number((state.freezerBoxes.find(box => box.id === activeFreezerBoxId) || {}).shelf) || 1);
    let activeAnimalRoomId = state.animalRooms.some(function (room) { return room.id === localStorage.getItem('rhineLabActiveAnimalRoom'); }) ? localStorage.getItem('rhineLabActiveAnimalRoom') : (state.animalRooms[0] ? state.animalRooms[0].id : '');
    let activeAnimalRackId = state.animalRacks.some(function (rack) { return rack.id === localStorage.getItem('rhineLabActiveAnimalRack') && (!activeAnimalRoomId || rack.roomId === activeAnimalRoomId); }) ? localStorage.getItem('rhineLabActiveAnimalRack') : ((state.animalRacks.find(function (rack) { return rack.roomId === activeAnimalRoomId; }) || {}).id || '');
    let selectedAnimalCageId = state.animalCages[0] ? state.animalCages[0].id : '';
    let zoomedAnimalRoomId = '';
    let activePlantRoomId = state.plantRooms.some(function (room) { return room.id === localStorage.getItem('rhineLabActivePlantRoom'); }) ? localStorage.getItem('rhineLabActivePlantRoom') : (state.plantRooms[0] ? state.plantRooms[0].id : '');
    let activePlantRackId = state.plantRacks.some(function (rack) { return rack.id === localStorage.getItem('rhineLabActivePlantRack') && (!activePlantRoomId || rack.roomId === activePlantRoomId); }) ? localStorage.getItem('rhineLabActivePlantRack') : ((state.plantRacks.find(function (rack) { return rack.roomId === activePlantRoomId; }) || {}).id || '');
    let selectedPlantId = state.plants[0] ? state.plants[0].id : '';
    let zoomedPlantRoomId = '';
    let pendingPlantDefaults = null;
    let pendingFreezerDefaults = null;
    let editingColdStorageLevel = 0;
    let activeBioinfoTab = localStorage.getItem('rhineLabBioinfoTab') === 'pipelines' ? 'pipelines' : 'projects';
    let activeBioProjectId = localStorage.getItem('rhineLabActiveBioProject') || '';
    let activeBioDatasetId = localStorage.getItem('rhineLabActiveBioDataset') || '';
    let activeBiologyTab = ['animals', 'plants', 'microbes', 'viruses'].includes(localStorage.getItem('rhineLabBiologyTab')) ? localStorage.getItem('rhineLabBiologyTab') : 'animals';
    let bioresourceFilter = '全部';
    let pendingAnimalCageDefaults = null;
    let activeDialogType = '';
    let editingRecord = null;
    let activeRecordDetail = null;
    let pendingDeleteRecord = null;
    let activeProtocolId = '';
    let activeExperimentId = '';
    let activeRunExperimentId = '';
    let activeCellId = '';
    let calendarMode = localStorage.getItem('rhineLabCalendarMode') === 'month' ? 'month' : 'day';
    let calendarDate = parseLocalDate(todayIso());
    let pendingTaskDefaults = null;
    let pendingSampleDefaults = null;
    let pendingPhotoData = '';
    let pendingResultExperimentId = '';
    let pendingResultAttachments = [];
    let sampleIntakeQueue = [];
    let freezerScanScores = [];
    let freezerScanDetected = new Set();
    let freezerScanPhotoData = '';
    let scheduleDrag = null;
    let scheduleDragFrame = 0;
    let scheduleDragPointer = null;
    let toastTimer = null;
    let runInputSaveTimer = null;
    let greetingTimer = 0;
    let themeTimer = 0;
    let runDisplayTimer = 0;
    let activeToolsTab = 'lineage';
    let activeProtocolTab = 'protocols';
    let activeLineageFocus = 'all';
    let activePlateLayoutId = state.plateLayouts[0] ? state.plateLayouts[0].id : '';
    let plateDraft = activePlateLayoutId ? clone(state.plateLayouts[0]) : createBlankPlateLayout();
    let selectedPlateWells = new Set();
    let platePointerDown = false;
    let lineagePan = null;

    const els = {
        breadcrumb: document.getElementById('breadcrumbLabel'),
        globalSearch: document.getElementById('globalSearch'),
        searchOverlay: document.getElementById('searchOverlay'),
        overlaySearchInput: document.getElementById('overlaySearchInput'),
        searchResults: document.getElementById('searchResults'),
        entryDialog: document.getElementById('entryDialog'),
        entryForm: document.getElementById('entryForm'),
        dialogKicker: document.getElementById('dialogKicker'),
        dialogTitle: document.getElementById('dialogTitle'),
        dialogFields: document.getElementById('dialogFields'),
        entrySubmitButton: document.getElementById('entrySubmitButton'),
        toast: document.getElementById('toast'),
        menuToggle: document.getElementById('menuToggle'),
        mobileScrim: document.getElementById('mobileScrim'),
        notificationToggle: document.getElementById('notificationToggle'),
        utilityNavToggle: document.getElementById('utilityNavToggle'),
        utilityNav: document.getElementById('utilityNav'),
        notificationPanel: document.getElementById('notificationPanel'),
        notificationClose: document.getElementById('notificationClose'),
        noticeCount: document.getElementById('noticeCount'),
        markAllRead: document.getElementById('markAllRead'),
        workspaceModeToggle: document.getElementById('workspaceModeToggle'),
        workspaceScopeBanner: document.getElementById('workspaceScopeBanner'),
        workspaceScopeStats: document.getElementById('workspaceScopeStats'),
        recordDetailDialog: document.getElementById('recordDetailDialog'),
        recordDetailKicker: document.getElementById('recordDetailKicker'),
        recordDetailTitle: document.getElementById('recordDetailTitle'),
        recordDetailBody: document.getElementById('recordDetailBody'),
        recordEditButton: document.getElementById('recordEditButton'),
        recordDeleteButton: document.getElementById('recordDeleteButton'),
        deleteConfirmDialog: document.getElementById('deleteConfirmDialog'),
        deleteRecordName: document.getElementById('deleteRecordName'),
        calendarDayView: document.getElementById('calendarDayView'),
        calendarMonthView: document.getElementById('calendarMonthView'),
        calendarPeriodLabel: document.getElementById('calendarPeriodLabel'),
        monthCalendarGrid: document.getElementById('monthCalendarGrid'),
        monthAgendaTitle: document.getElementById('monthAgendaTitle'),
        monthAgendaList: document.getElementById('monthAgendaList'),
        untimedScheduleList: document.getElementById('untimedScheduleList'),
        monthAgendaAdd: document.getElementById('monthAgendaAdd'),
        coldStorageTabs: document.getElementById('coldStorageTabs'),
        coldStorageType: document.getElementById('coldStorageType'),
        coldStorageTitle: document.getElementById('coldStorageTitle'),
        coldStorageMeta: document.getElementById('coldStorageMeta'),
        coldStorageDevice: document.getElementById('coldStorageDevice'),
        coldStorageShelfTabs: document.getElementById('coldStorageShelfTabs'),
        coldStorageLevelTitle: document.getElementById('coldStorageLevelTitle'),
        coldStorageLevelMeta: document.getElementById('coldStorageLevelMeta'),
        coldStorageMap: document.getElementById('coldStorageMap'),
        freezerBoxTabs: document.getElementById('freezerBoxTabs'),
        freezerBoxTitle: document.getElementById('freezerBoxTitle'),
        freezerBoxTemperature: document.getElementById('freezerBoxTemperature'),
        freezerBoxLocation: document.getElementById('freezerBoxLocation'),
        protocolDetailDialog: document.getElementById('protocolDetailDialog'),
        protocolDetailNumber: document.getElementById('protocolDetailNumber'),
        protocolDetailTitle: document.getElementById('protocolDetailTitle'),
        protocolDetailBody: document.getElementById('protocolDetailBody'),
        protocolDetailUsage: document.getElementById('protocolDetailUsage'),
        scheduleProtocolButton: document.getElementById('scheduleProtocolButton'),
        editProtocolButton: document.getElementById('editProtocolButton'),
        experimentDetailDialog: document.getElementById('experimentDetailDialog'),
        experimentDetailForm: document.getElementById('experimentDetailForm'),
        experimentDetailNumber: document.getElementById('experimentDetailNumber'),
        experimentDetailTitle: document.getElementById('experimentDetailTitle'),
        experimentDetailStatus: document.getElementById('experimentDetailStatus'),
        experimentDetailProtocol: document.getElementById('experimentDetailProtocol'),
        experimentDetailDescription: document.getElementById('experimentDetailDescription'),
        experimentUsageRows: document.getElementById('experimentUsageRows'),
        experimentUsageSource: document.getElementById('experimentUsageSource'),
        experimentPhotoPanel: document.getElementById('experimentPhotoPanel'),
        experimentResultSection: document.getElementById('experimentResultSection'),
        experimentHistorySection: document.getElementById('experimentHistorySection'),
        editExperimentButton: document.getElementById('editExperimentButton'),
        experimentDetailSubmitButton: document.getElementById('experimentDetailSubmitButton'),
        experimentRunDialog: document.getElementById('experimentRunDialog'),
        experimentRunKicker: document.getElementById('experimentRunKicker'),
        experimentRunTitle: document.getElementById('experimentRunTitle'),
        experimentRunProtocol: document.getElementById('experimentRunProtocol'),
        experimentRunBody: document.getElementById('experimentRunBody'),
        experimentRunProgressLabel: document.getElementById('experimentRunProgressLabel'),
        experimentRunProgressBar: document.getElementById('experimentRunProgressBar'),
        freezerScanDialog: document.getElementById('freezerScanDialog'),
        freezerScanBoxName: document.getElementById('freezerScanBoxName'),
        freezerScanInput: document.getElementById('freezerScanInput'),
        freezerScanCanvas: document.getElementById('freezerScanCanvas'),
        freezerScanPlaceholder: document.getElementById('freezerScanPlaceholder'),
        freezerScanSensitivity: document.getElementById('freezerScanSensitivity'),
        freezerScanSummary: document.getElementById('freezerScanSummary'),
        freezerScanGrid: document.getElementById('freezerScanGrid'),
        freezerScanStart: document.getElementById('freezerScanStart'),
        cellCultureGrid: document.getElementById('cellCultureGrid'),
        cellMaintenanceQueue: document.getElementById('cellMaintenanceQueue'),
        clearWorkspaceDialog: document.getElementById('clearWorkspaceDialog'),
        clearWorkspacePhrase: document.getElementById('clearWorkspacePhrase'),
        confirmClearWorkspace: document.getElementById('confirmClearWorkspace'),
        endDayButton: document.getElementById('endDayButton'),
        endDayDialog: document.getElementById('endDayDialog'),
        endDaySummary: document.getElementById('endDaySummary')
        ,lineageFocus: document.getElementById('lineageFocus')
        ,lineageMap: document.getElementById('lineageMap')
        ,lineageSource: document.getElementById('lineageSource')
        ,lineageTarget: document.getElementById('lineageTarget')
        ,lineageRelation: document.getElementById('lineageRelation')
        ,lineageQuantity: document.getElementById('lineageQuantity')
        ,lineageUnit: document.getElementById('lineageUnit')
        ,lineageNotes: document.getElementById('lineageNotes')
        ,saveLineageLink: document.getElementById('saveLineageLink')
        ,lineageLinkList: document.getElementById('lineageLinkList')
        ,mastermixRows: document.getElementById('mastermixRows')
        ,plateLayoutList: document.getElementById('plateLayoutList')
        ,plateMap: document.getElementById('plateMap')
        ,plateLayoutName: document.getElementById('plateLayoutName')
        ,plateFormat: document.getElementById('plateFormat')
        ,plateExperiment: document.getElementById('plateExperiment')
        ,plateProtocol: document.getElementById('plateProtocol')
        ,plateLayoutStatus: document.getElementById('plateLayoutStatus')
        ,selectedWellCount: document.getElementById('selectedWellCount')
    };

    window.RhineLabAssistantBridge = {
        getContext: getAssistantContext,
        getTodaySummary: getAssistantTodaySummary,
        applyAction: applyAssistantAction,
        isReadOnly: function () { return Boolean(workspaceReadOnly); },
        getLocale: function () { return document.documentElement.lang === 'en' ? 'en' : 'zh'; }
    };

    init();

    function getAssistantContext() {
        const today = todayIso();
        return {
            today: today,
            workspace: workspaceMode,
            readOnly: Boolean(workspaceReadOnly),
            experiments: state.experiments.slice(0, 24).map(function (item) { return { id: item.id, title: item.title, project: item.project, status: item.status, date: item.date, protocolId: item.protocolId || '' }; }),
            cells: state.cellCultures.slice(0, 24).map(function (item) { return { id: item.id, name: item.name, passage: item.passage, medium: item.medium, container: item.container, incubator: item.incubator, confluence: item.confluence, status: item.status }; }),
            reagents: state.reagents.slice(0, 30).map(function (item) { return { id: item.catalog, name: item.name, currentQty: item.currentQty, totalQty: item.totalQty, unit: item.unit, location: item.location, status: getReagentDisplayStatus(item) }; }),
            protocols: state.protocols.slice(0, 24).map(function (item) { return { id: item.id, title: item.title }; }),
            schedule: state.schedule.filter(function (item) { return item.date === today; }).slice(0, 20).map(function (item) { return { id: item.id, title: item.title, time: item.time, end: item.end, done: Boolean(item.done), protocolId: item.protocolId || '' }; })
        };
    }

    function getAssistantTodaySummary() {
        const today = todayIso();
        const tasks = state.schedule.filter(function (item) { return item.date === today; }).sort(byTime);
        const completed = tasks.filter(function (item) { return item.done; });
        const experiments = state.experiments.filter(function (item) { return item.date === today; });
        const recent = state.activities.slice(0, 6).map(function (item) { return item.text; });
        const english = document.documentElement.lang === 'en';
        if (english) {
            const lines = ['Today: ' + completed.length + ' of ' + tasks.length + ' scheduled items completed; ' + experiments.length + ' experiment records dated today.'];
            if (tasks.length) lines.push('Schedule: ' + tasks.map(function (item) { return scheduleTimeLabel(item) + ' ' + item.title + (item.done ? ' (done)' : ' (pending)'); }).join('; '));
            if (recent.length) lines.push('Recent entries: ' + recent.join('; '));
            return lines.join('\n');
        }
        const lines = ['今天共有 ' + tasks.length + ' 项日程，已完成 ' + completed.length + ' 项；今天日期下有 ' + experiments.length + ' 条实验记录。'];
        if (tasks.length) lines.push('日程：' + tasks.map(function (item) { return scheduleTimeLabel(item) + ' ' + item.title + (item.done ? '（已完成）' : '（待处理）'); }).join('；'));
        if (recent.length) lines.push('最近登记：' + recent.join('；'));
        return lines.join('\n');
    }

    function applyAssistantAction(action) {
        if (denyReadOnlyMutation()) return { ok: false, message: '当前工作区只读，未执行任何修改。' };
        const kind = String(action && action.kind || '');
        const payload = action && action.payload && typeof action.payload === 'object' ? action.payload : {};
        const creator = 'AI 辅助 · 用户确认';
        let activity = '';
        let recordType = '';
        let recordId = '';
        let changes = {};

        if (kind === 'create_experiment') {
            const title = displayOr(payload.title, '未命名实验');
            const record = {
                id: generatedRecordId('RL-EXP'), title: title, project: String(payload.project || '').trim(),
                status: displayOr(payload.status, '进行中'), type: displayOr(payload.type, '未分类'),
                date: payload.date || todayIso(), protocolId: String(payload.protocolId || ''),
                description: String(payload.description || '').trim(), progress: String(payload.status || '') === '已完成' ? 100 : 12,
                reagentUsage: [], usageOverridden: false, photoData: '', createdBy: creator, history: [createdHistoryEntry()]
            };
            if (record.protocolId && !state.protocols.some(function (item) { return item.id === record.protocolId; })) record.protocolId = '';
            state.experiments.unshift(record);
            activity = 'AI 辅助登记实验“' + record.title + '”';
            recordType = 'experiment'; recordId = record.id; changes = clone(record);
        } else if (kind === 'create_task') {
            const start = /^\d{2}:\d{2}$/.test(String(payload.time || '')) ? payload.time : '';
            const end = start && /^\d{2}:\d{2}$/.test(String(payload.end || '')) && timeToMinutes(payload.end) > timeToMinutes(start) ? payload.end : (start ? addMinutes(start, 60) : '');
            const record = {
                id: generatedRecordId('T'), date: payload.date || todayIso(), time: start, end: end,
                title: displayOr(payload.title, '未命名日程'), resource: String(payload.resource || '').trim(),
                type: displayOr(payload.taskType || payload.type, 'cell'), protocolId: String(payload.protocolId || ''),
                experimentId: String(payload.experimentId || ''), shareWithLab: payload.shareWithLab !== 'no',
                done: false, createdBy: creator, history: [createdHistoryEntry()]
            };
            state.schedule.push(record);
            activity = 'AI 辅助添加日程“' + record.title + '”';
            recordType = 'task'; recordId = record.id; changes = clone(record);
        } else if (kind === 'create_reagent') {
            const catalog = displayOr(payload.catalog, generatedRecordId('REAG'));
            if (state.reagents.some(function (item) { return item.catalog === catalog; })) return { ok: false, message: '该试剂货号已经存在，未创建重复条目。' };
            const total = positiveNumber(payload.totalQty, 0);
            const current = number(payload.currentQty === '' || payload.currentQty == null ? total : payload.currentQty, 0, Math.max(total, Number(payload.currentQty) || 0));
            const record = {
                catalog: catalog, name: displayOr(payload.name, '未命名试剂'), category: displayOr(payload.category, '未分类'),
                lot: String(payload.lot || '').trim(), location: String(payload.location || '').trim(), totalQty: total,
                currentQty: current, unit: displayOr(payload.unit, 'mL'), expiry: String(payload.expiry || '').trim(),
                amount: total ? number(current / total * 100, 0, 100) : 0,
                status: total <= 0 ? '待补充' : current / total < .25 ? '余量低' : '正常',
                createdBy: creator, history: [createdHistoryEntry()]
            };
            state.reagents.unshift(record);
            activity = 'AI 辅助录入试剂“' + record.name + '”';
            recordType = 'reagent'; recordId = record.catalog; changes = clone(record);
        } else if (kind === 'record_cell_operation') {
            const identifier = String(payload.cellId || payload.recordId || action.targetId || '').trim().toLowerCase();
            const name = String(payload.cellName || payload.name || '').trim().toLowerCase();
            const matches = state.cellCultures.filter(function (item) { return String(item.id).toLowerCase() === identifier || String(item.name).toLowerCase() === identifier || (name && String(item.name).toLowerCase() === name); });
            if (!matches.length) return { ok: false, message: '没有找到要记录操作的细胞条目。' };
            if (matches.length > 1) return { ok: false, message: '匹配到多个细胞条目，请在指令中写明记录编号。' };
            const culture = matches[0];
            const log = {
                id: 'CELLLOG-' + Date.now(), date: payload.date || todayIso(), action: displayOr(payload.action, '培养操作'),
                passage: Math.max(0, Math.round(positiveNumber(payload.passage, culture.passage || 0))),
                ratio: String(payload.ratio || ''), container: displayOr(payload.container, culture.container || ''),
                confluence: number(payload.confluence === '' || payload.confluence == null ? culture.confluence : payload.confluence, 0, 100),
                medium: displayOr(payload.medium, culture.medium || ''), notes: String(payload.notes || '').trim(), photoData: ''
            };
            culture.history = Array.isArray(culture.history) ? culture.history : [];
            culture.history.unshift(log);
            culture.passage = log.passage; culture.container = log.container; culture.confluence = log.confluence; culture.medium = log.medium;
            activity = 'AI 辅助记录“' + culture.name + '”的' + log.action + '操作';
            recordType = 'cell'; recordId = culture.id; changes = clone(log);
        } else if (kind === 'update_record') {
            const type = String(payload.recordType || action.targetType || '');
            const key = String(payload.recordId || action.targetId || '');
            const field = String(payload.field || '');
            const allowed = {
                experiment: ['title', 'project', 'status', 'type', 'date', 'description'],
                reagent: ['name', 'category', 'lot', 'location', 'currentQty', 'totalQty', 'unit', 'expiry'],
                cell: ['name', 'species', 'medium', 'container', 'incubator', 'passage', 'confluence', 'notes', 'status'],
                task: ['title', 'date', 'time', 'end', 'resource', 'type', 'done']
            };
            if (!allowed[type] || !allowed[type].includes(field)) return { ok: false, message: '这项字段不允许由助理修改。' };
            const record = findRecord(type, key);
            if (!record) return { ok: false, message: '没有找到要修改的条目。' };
            const before = record[field];
            let value = payload.value;
            if (['currentQty', 'totalQty', 'passage', 'confluence'].includes(field)) value = positiveNumber(value, Number(before) || 0);
            if (field === 'done') value = String(value).toLowerCase() === 'true' || String(value) === '1' || String(value) === '已完成';
            record[field] = value;
            if (type === 'reagent') {
                record.amount = record.totalQty ? number(record.currentQty / record.totalQty * 100, 0, 100) : 0;
                record.status = record.totalQty <= 0 ? '待补充' : record.amount < 25 ? '余量低' : isExpiringSoon(record.expiry) ? '临期' : '正常';
            }
            const historyEntry = { at: new Date().toISOString(), action: 'updated', changes: [{ label: field, from: before, to: value }] };
            const historyKey = type === 'cell' ? 'changeHistory' : 'history';
            record[historyKey] = Array.isArray(record[historyKey]) ? record[historyKey] : [];
            record[historyKey].push(historyEntry);
            activity = 'AI 辅助修改' + recordTypeLabel(type) + '“' + (record.title || record.name || key) + '”';
            recordType = type; recordId = key; changes = historyEntry.changes;
        } else {
            return { ok: false, message: '未识别的操作类型，未执行任何修改。' };
        }

        addActivity(activity);
        appendAuditLog({ action: kind.indexOf('create_') === 0 ? 'created' : 'updated', source: 'assistant-confirmed', recordType: recordType, recordId: recordId, changes: changes });
        saveState();
        renderAll();
        showToast('已确认执行：' + activity.replace(/^AI 辅助/, ''));
        return { ok: true, message: activity + '，并已写入修改记录。', recordType: recordType, recordId: recordId };
    }

    function init() {
        applySavedTheme();
        applySavedBackground();
        applyWorkspaceMode();
        setUtilityNav(false);
        setTodayLabels();
        startUiTimers();
        resolveLatestDesktopDownload();
        if (!(publicDemoMode && !publicDemoUnlocked)) saveState();
        applyNotificationState();
        switchView(activeView, false);
        bindEvents();
        bindResearchToolsEvents();
        window.addEventListener('focus', applyTimeThemeIfAutomatic);
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                stopUiTimers();
                return;
            }
            applyTimeThemeIfAutomatic();
            updateTimeGreeting();
            updateRunTimerDisplay();
            startUiTimers();
        });
        window.addEventListener('rhine:languagechange', handleLanguageChange);
        startCloudSync();
        window.dispatchEvent(new CustomEvent('rhine:ready'));
    }

    function startUiTimers() {
        if (!greetingTimer) greetingTimer = window.setInterval(updateTimeGreeting, 60000);
        if (!themeTimer) themeTimer = window.setInterval(applyTimeThemeIfAutomatic, 60000);
        if (!runDisplayTimer) runDisplayTimer = window.setInterval(updateRunTimerDisplay, 1000);
    }

    function stopUiTimers() {
        window.clearInterval(greetingTimer);
        window.clearInterval(themeTimer);
        window.clearInterval(runDisplayTimer);
        greetingTimer = 0;
        themeTimer = 0;
        runDisplayTimer = 0;
    }

    function handleLanguageChange() {
        setTodayLabels();
        updateThemeToggleLabel();
        updateBackgroundToggleLabel();
        applyWorkspaceMode();
        setUtilityNav(Boolean(els.utilityNav && !els.utilityNav.hidden));
        applyNotificationState();
        switchView(activeView, false);
    }

    function interfaceLocale() {
        return window.RhineLabI18n ? window.RhineLabI18n.getLocale() : 'zh-CN';
    }

    function interfaceText(value) {
        return window.RhineLabI18n ? window.RhineLabI18n.t(value) : value;
    }

    function scopeStorageKey(mode) {
        return mode === 'lab' ? STORAGE_KEY + ':lab' : STORAGE_KEY;
    }

    function loadState(mode) {
        try {
            if (isPublicDemoRuntime() && !publicDemoUnlocked) return normalizeStateShape(clone(defaults));
            const storageKey = scopeStorageKey(mode);
            const secureValue = window.RhineLabCrypto ? window.RhineLabCrypto.readLocal(storageKey) : null;
            const raw = secureValue == null ? localStorage.getItem(storageKey) : null;
            if (secureValue == null && !raw) {
                const emptyFirstRun = mode === 'lab' || isInstalledAppRuntime();
                return normalizeStateShape(emptyFirstRun ? emptyWorkspaceState() : clone(defaults));
            }
            const stored = secureValue == null ? JSON.parse(raw) : secureValue;
            return normalizeStateShape(stored);
        } catch (error) {
            return normalizeStateShape(isInstalledAppRuntime() ? emptyWorkspaceState() : clone(defaults));
        }
    }

    function isPublicDemoRuntime() {
        const githubPages = /(^|\.)github\.io$/i.test(location.hostname) && /\/Rhine_Lab(?:\/|$)/i.test(location.pathname);
        const customDomain = /^(?:www\.)?rh1nelab\.com$/i.test(location.hostname);
        return (githubPages || customDomain) && !isInstalledAppRuntime();
    }

    function isInstalledAppRuntime() {
        const distribution = String(window.RHINE_LAB_DISTRIBUTION || '').toLowerCase();
        const nativeProtocol = /^(?:capacitor|chrome-extension|moz-extension):$/i.test(location.protocol);
        const standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
        return distribution === 'desktop' || distribution === 'extension' || nativeProtocol || document.documentElement.classList.contains('native-app') || Boolean(standalone);
    }

    function normalizeStateShape(stored) {
        if (!stored || typeof stored !== 'object') return clone(defaults);
        return {
            experiments: Array.isArray(stored.experiments) ? stored.experiments : clone(defaults.experiments),
            results: Array.isArray(stored.results) ? stored.results : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.results)),
            mice: Array.isArray(stored.mice) ? stored.mice : clone(defaults.mice),
            animalRooms: Array.isArray(stored.animalRooms) ? stored.animalRooms : [],
            animalRacks: Array.isArray(stored.animalRacks) ? stored.animalRacks : [],
            animalCages: Array.isArray(stored.animalCages) ? stored.animalCages : [],
            plants: Array.isArray(stored.plants) ? stored.plants : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.plants)),
            plantRooms: Array.isArray(stored.plantRooms) ? stored.plantRooms : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.plantRooms)),
            plantRacks: Array.isArray(stored.plantRacks) ? stored.plantRacks : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.plantRacks)),
            microbes: Array.isArray(stored.microbes) ? stored.microbes : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.microbes)),
            plasmids: Array.isArray(stored.plasmids) ? stored.plasmids : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.plasmids)),
            viruses: Array.isArray(stored.viruses) ? stored.viruses : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.viruses)),
            bioProjects: Array.isArray(stored.bioProjects) ? stored.bioProjects : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.bioProjects)),
            bioDatasets: Array.isArray(stored.bioDatasets) ? stored.bioDatasets : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.bioDatasets)),
            bioPipelines: Array.isArray(stored.bioPipelines) ? stored.bioPipelines : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.bioPipelines)),
            bioRuns: Array.isArray(stored.bioRuns) ? stored.bioRuns : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.bioRuns)),
            cellCultures: Array.isArray(stored.cellCultures) ? stored.cellCultures : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.cellCultures)),
            reagents: Array.isArray(stored.reagents) ? stored.reagents : clone(defaults.reagents),
            samples: (Array.isArray(stored.samples) ? stored.samples : clone(defaults.samples)).map(function (sample) {
                if (!sample || sample.status !== '质控中') return sample;
                return Object.assign({}, sample, { status: '在库' });
            }),
            coldStorageUnits: Array.isArray(stored.coldStorageUnits) ? stored.coldStorageUnits : clone(defaults.coldStorageUnits),
            freezerBoxes: Array.isArray(stored.freezerBoxes) ? stored.freezerBoxes : clone(defaults.freezerBoxes),
            schedule: Array.isArray(stored.schedule) ? stored.schedule : clone(defaults.schedule),
            protocols: Array.isArray(stored.protocols) ? stored.protocols : clone(defaults.protocols),
            formulations: Array.isArray(stored.formulations) ? stored.formulations : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.formulations)),
            activities: (Array.isArray(stored.activities) ? stored.activities : clone(defaults.activities)).map(normalizeActivityEntry),
            auditLog: Array.isArray(stored.auditLog) ? stored.auditLog : [],
            lineageLinks: Array.isArray(stored.lineageLinks) ? stored.lineageLinks : [],
            plateLayouts: Array.isArray(stored.plateLayouts) ? stored.plateLayouts : [],
            security: stored.security && typeof stored.security === 'object' ? clone(stored.security) : { labKeys: {} },
            exampleSeedVersion: Number(stored.exampleSeedVersion) || 0,
            housingSchemaVersion: Number(stored.housingSchemaVersion) || 0
        };
    }

    function normalizeColdStorageLevels(unit) {
        const shelfCount = Math.max(1, Math.round(number(unit.shelves, 1, 12)) || 1);
        const legacyRows = Math.round(number(unit.rows, 1, 12)) || 1;
        const legacyColumns = Math.round(number(unit.columns, 1, 12)) || 1;
        const source = Array.isArray(unit.levels) && unit.levels.length
            ? unit.levels.slice(0, 12)
            : Array.from({ length: shelfCount }, function (_, index) {
                return { mode: unit.type === '液氮罐' || index > 0 ? 'rack' : 'direct', rows: legacyRows, columns: legacyColumns };
            });
        return source.map(function (level) {
            const mode = level && level.mode === 'rack' ? 'rack' : 'direct';
            const rackCount = mode === 'rack' ? (Math.round(number(level && level.rackCount, 1, 8)) || (unit.type === '液氮罐' ? 3 : 2)) : 1;
            const rackOrder = [];
            (Array.isArray(level && level.rackOrder) ? level.rackOrder : []).concat(Array.from({ length: rackCount }, function (_, index) { return index + 1; })).forEach(function (rack) {
                rack = Math.round(Number(rack));
                if (rack >= 1 && rack <= rackCount && !rackOrder.includes(rack)) rackOrder.push(rack);
            });
            return {
                mode: mode,
                rows: Math.round(number(level && level.rows, 1, 12)) || 1,
                columns: Math.round(number(level && level.columns, 1, 12)) || 1,
                rackCount: rackCount,
                rackOrder: rackOrder
            };
        });
    }

    function coldStorageLevel(unit, shelf) {
        const levels = Array.isArray(unit.levels) && unit.levels.length ? unit.levels : normalizeColdStorageLevels(unit);
        return levels[Math.min(levels.length, Math.max(1, Number(shelf) || 1)) - 1] || levels[0];
    }

    function parseColdStorageLevels(value, shelfCount) {
        const lines = String(value || '').split(/\r?\n/).map(function (line) { return line.trim(); }).filter(Boolean);
        if (lines.length !== shelfCount) return null;
        const levels = lines.map(function (line) {
            const match = line.match(/^(直放|货架|direct|rack)\s*(?:(\d+)\s*(?:架|racks?)\s*)?[:：]?\s*(\d+)\s*[x×*]\s*(\d+)$/i);
            if (!match) return null;
            const mode = /^(货架|rack)$/i.test(match[1]) ? 'rack' : 'direct';
            const rackCount = mode === 'rack' ? (Math.round(number(match[2], 1, 8)) || 1) : 1;
            return {
                mode: mode,
                rows: Math.round(number(match[3], 1, 12)) || 1,
                columns: Math.round(number(match[4], 1, 12)) || 1,
                rackCount: rackCount,
                rackOrder: Array.from({ length: rackCount }, function (_, index) { return index + 1; })
            };
        });
        return levels.every(Boolean) ? levels : null;
    }

    function coldStorageLevelsText(levels) {
        return levels.map(function (level) { return (level.mode === 'rack' ? '货架 ' + (level.rackCount || 1) + '架 ' : '直放 ') + level.rows + 'x' + level.columns; }).join('\n');
    }

    function coldStorageLayoutConflict(unitId, levels) {
        return state.freezerBoxes.find(function (box) {
            const level = levels[Number(box.shelf || 1) - 1];
            return box.storageUnitId === unitId && (!level || Number(box.storageRack || 1) > (level.rackCount || 1) || Number(box.storageRow || 1) > level.rows || Number(box.storageColumn || 1) > level.columns);
        });
    }

    function migrateState(data) {
        if ((Number(data.exampleSeedVersion) || 0) < 2) {
            mergeExampleRecords(data.experiments, additionalExamples.experiments, 'id');
            mergeExampleRecords(data.mice, additionalExamples.mice, 'id');
            mergeExampleRecords(data.reagents, additionalExamples.reagents, 'catalog');
            mergeExampleRecords(data.samples, additionalExamples.samples, 'id');
            mergeExampleRecords(data.protocols, additionalExamples.protocols, 'id');
            mergeExampleRecords(data.schedule, additionalExamples.schedule, 'id');
            additionalExamples.activities.forEach(function (activity) {
                if (!data.activities.some(item => item.text === activity.text)) data.activities.push(clone(activity));
            });
            data.exampleSeedVersion = 2;
        }
        if ((Number(data.exampleSeedVersion) || 0) < 4) {
            mergeExampleRecords(data.results, additionalExamples.results, 'experimentId');
            data.exampleSeedVersion = 4;
        }
        data.coldStorageUnits = (Array.isArray(data.coldStorageUnits) && data.coldStorageUnits.length ? data.coldStorageUnits : clone(defaults.coldStorageUnits)).map(function (unit, index) {
            const seeded = defaults.coldStorageUnits.find(function (item) { return item.id === unit.id; });
            const legacyBuiltIn = !unit.levels && ['COLD-LOCAL-001', 'PUB-COLD-FZ01', 'PUB-COLD-LN01'].includes(unit.id)
                ? defaults.coldStorageUnits[unit.type === '液氮罐' ? 1 : 0]
                : null;
            const preset = seeded || legacyBuiltIn;
            const migratedLocation = unit.id === 'COLD-LOCAL-001' || unit.id === 'PUB-COLD-FZ01'
                ? '样本库 A 区 / 北墙 01 位'
                : (unit.id === 'PUB-COLD-LN01' ? '样本库 B 区 / 液氮平台 01 位' : '');
            const levels = normalizeColdStorageLevels(!unit.levels && preset ? Object.assign({}, unit, { shelves: preset.shelves, rows: preset.rows, columns: preset.columns, levels: preset.levels }) : unit);
            return {
                id: unit.id || 'COLD-' + String(index + 1).padStart(3, '0'),
                name: unit.name || '冻存设备 ' + (index + 1),
                type: unit.type || '超低温冰箱',
                temperature: unit.temperature || (unit.type === '液氮罐' ? '液氮' : '-80°C'),
                location: String(unit.location || migratedLocation || (preset && preset.location) || '位置待设置').trim(),
                orientation: unit.orientation === '竖向' || unit.orientation === '横向' ? unit.orientation : (unit.type === '液氮罐' ? '竖向' : '横向'),
                layoutX: housingLayoutCoordinate(unit.layoutX, index, 'x'),
                layoutY: housingLayoutCoordinate(unit.layoutY, index, 'y'),
                shelves: levels.length,
                rows: levels[0].rows,
                columns: levels[0].columns,
                levels: levels,
                createdBy: anonymousContributor(unit.createdBy),
                history: Array.isArray(unit.history) ? unit.history : []
            };
        });
        data.freezerBoxes = Array.isArray(data.freezerBoxes) && data.freezerBoxes.length ? data.freezerBoxes : clone(defaults.freezerBoxes);
        data.freezerBoxes = data.freezerBoxes.map(function (box, index) {
            const seededLegacyBox = ['FB-FZ03-B2', 'FB-FZ03-C1', 'FB-LN02-A1'].includes(box.id) && Number(box.rows) === 6 && Number(box.columns) === 8;
            const unit = data.coldStorageUnits.find(function (item) { return item.id === box.storageUnitId; }) || data.coldStorageUnits.find(function (item) { return String(box.temperature || '').includes('液氮') === String(item.temperature || '').includes('液氮'); }) || data.coldStorageUnits[0];
            const shelf = Math.round(number(box.shelf, 1, Math.max(1, unit.shelves))) || 1;
            const level = coldStorageLevel(unit, shelf);
            const normalized = {
                id: box.id || 'FB-USR-' + String(index + 1).padStart(3, '0'),
                name: box.name || '冻存盒 ' + (index + 1),
                storageUnitId: unit.id,
                shelf: shelf,
                storageRack: Math.round(number(box.storageRack, 1, level.rackCount || 1)) || 1,
                storageRow: Math.round(number(box.storageRow, 1, level.rows)) || 1,
                storageColumn: Math.round(number(box.storageColumn, 1, level.columns)) || 1,
                temperature: box.temperature || unit.temperature,
                rows: seededLegacyBox ? 9 : (Math.round(number(box.rows, 4, 12)) || 9),
                columns: seededLegacyBox ? 9 : (Math.round(number(box.columns, 4, 12)) || 9),
                lastScanPhoto: box.lastScanPhoto || '',
                createdBy: anonymousContributor(box.createdBy),
                history: Array.isArray(box.history) ? box.history : []
            };
            normalized.storageLocation = formatColdStorageBoxLocation(normalized, data.coldStorageUnits);
            return normalized;
        });

        data.protocols = Array.isArray(data.protocols) ? data.protocols : clone(defaults.protocols);
        data.protocols = data.protocols.map(function (protocol, index) {
            const seeded = defaults.protocols.find(item => item.id === protocol.id || item.number === protocol.number);
            return {
                id: protocol.id || (seeded && seeded.id) || 'SOP-USR-' + String(index + 1).padStart(3, '0'),
                number: protocol.number || (seeded && seeded.number) || 'SOP-USR-' + String(index + 1).padStart(3, '0') + ' · V1.0',
                title: protocol.title || '未命名 Protocol',
                summary: protocol.summary || '',
                steps: Array.isArray(protocol.steps) ? protocol.steps : (seeded ? clone(seeded.steps) : []),
                reagents: Array.isArray(protocol.reagents) ? protocol.reagents : (seeded ? clone(seeded.reagents) : []),
                tag: protocol.tag || '自定义方案',
                meta: protocol.meta || '本地录入',
                literatureTitle: String(protocol.literatureTitle || (seeded && seeded.literatureTitle) || '').trim(),
                literatureCitation: String(protocol.literatureCitation || (seeded && seeded.literatureCitation) || '').trim(),
                literatureId: String(protocol.literatureId || (seeded && seeded.literatureId) || '').trim(),
                literatureUrl: String(protocol.literatureUrl || (seeded && seeded.literatureUrl) || '').trim(),
                photoData: protocol.photoData || '',
                createdBy: anonymousContributor(protocol.createdBy),
                history: Array.isArray(protocol.history) ? clone(protocol.history) : []
            };
        });

        data.formulations = (Array.isArray(data.formulations) ? data.formulations : clone(defaults.formulations)).map(function (formulation, index) {
            return {
                id: formulation.id || 'FORM-' + String(index + 1).padStart(3, '0'),
                name: formulation.name || '未命名配方',
                physicalForm: formulation.physicalForm || '液体',
                purpose: String(formulation.purpose || ''),
                finalAmount: positiveNumber(formulation.finalAmount, 0),
                unit: String(formulation.unit || ''),
                concentration: String(formulation.concentration || ''),
                storage: String(formulation.storage || ''),
                version: String(formulation.version || 'V1.0'),
                components: (Array.isArray(formulation.components) ? formulation.components : []).map(function (component) {
                    return { name: String(component.name || ''), amount: String(component.amount || ''), unit: String(component.unit || '') };
                }).filter(function (component) { return component.name || component.amount || component.unit; }),
                preparation: String(formulation.preparation || ''),
                notes: String(formulation.notes || ''),
                createdBy: anonymousContributor(formulation.createdBy),
                history: Array.isArray(formulation.history) ? clone(formulation.history) : []
            };
        });
        const experimentProtocolMap = {
            'RL-EXP-026': 'SOP-IM-021',
            'RL-EXP-024': 'SOP-AN-008',
            'RL-EXP-023': 'SOP-EP-006'
        };
        data.experiments = data.experiments.map(function (experiment) {
            const migratedExperiment = Object.assign({}, experiment, {
                protocolId: experiment.protocolId == null ? (experimentProtocolMap[experiment.id] || '') : experiment.protocolId,
                reagentUsage: Array.isArray(experiment.reagentUsage) ? experiment.reagentUsage.map(function (usage) {
                    return { catalog: usage.catalog, amount: positiveNumber(usage.amount, 0) };
                }).filter(usage => usage.catalog && usage.amount > 0) : [],
                usageOverridden: Boolean(experiment.usageOverridden),
                photoData: experiment.photoData || '',
                createdBy: anonymousContributor(experiment.createdBy || experiment.owner),
                runSession: normalizeRunSession(experiment.runSession)
            });
            delete migratedExperiment.owner;
            return migratedExperiment;
        });

        data.reagents = data.reagents.map(function (reagent) {
            const profile = reagentProfiles[reagent.catalog] || { totalQty: 100, unit: reagent.unit || 'mL' };
            const parsedTotalQty = Number(reagent.totalQty);
            const totalQty = reagent.totalQty == null || reagent.totalQty === ''
                ? profile.totalQty : Math.max(0, Number.isFinite(parsedTotalQty) ? parsedTotalQty : 0);
            const currentQty = reagent.currentQty == null ? roundQuantity(totalQty * number(reagent.amount, 0, 100) / 100) : positiveNumber(reagent.currentQty, 0);
            return Object.assign({}, reagent, {
                totalQty: totalQty,
                currentQty: currentQty,
                unit: reagent.unit || profile.unit,
                amount: totalQty ? number(currentQty / totalQty * 100, 0, 100) : 0,
                photoData: reagent.photoData || '',
                createdBy: anonymousContributor(reagent.createdBy),
                history: Array.isArray(reagent.history) ? reagent.history : []
            });
        });

        data.samples = data.samples.map(function (sample) {
            const position = sample.position || samplePosition(sample.location);
            const locationPrefix = String(sample.location || '').split('·')[0].replace(/\s/g, '').toLowerCase();
            const inferredBox = data.freezerBoxes.find(function (box) {
                return locationPrefix && box.name.replace(/\s/g, '').toLowerCase() === locationPrefix;
            }) || data.freezerBoxes[0];
            const box = data.freezerBoxes.find(item => item.id === sample.boxId) || inferredBox;
            return Object.assign({}, sample, {
                boxId: box.id,
                position: position,
                location: formatSampleLocation(box, position),
                photoData: sample.photoData || '',
                createdBy: anonymousContributor(sample.createdBy),
                history: Array.isArray(sample.history) ? sample.history : []
            });
        });

        migrateAnimalHousing(data);
        migratePlantHousing(data);
        cleanupLegacyHousingPlaceholders(data);
        normalizeBioinformaticsData(data);

        data.results = (Array.isArray(data.results) ? data.results : []).filter(function (result, index, list) {
            return result && result.experimentId && list.findIndex(item => item && item.experimentId === result.experimentId) === index;
        }).map(function (result, index) {
            return Object.assign({}, result, {
                id: result.id || 'RL-RES-' + String(index + 1).padStart(3, '0'),
                date: result.date || todayIso(),
                summary: result.summary || '',
                conclusion: result.conclusion || '',
                nextStep: result.nextStep || '',
                attachments: Array.isArray(result.attachments) ? result.attachments : [],
                createdBy: anonymousContributor(result.createdBy),
                history: Array.isArray(result.history) ? result.history : []
            });
        });

        data.cellCultures = (Array.isArray(data.cellCultures) ? data.cellCultures : clone(defaults.cellCultures)).map(function (culture, index) {
            const passage = Math.max(0, Math.round(positiveNumber(culture.passage, 0)));
            const vesselCount = Math.max(1, Math.round(positiveNumber(culture.vesselCount, 1)));
            return Object.assign({}, culture, {
                id: culture.id || 'CELL-' + String(index + 1).padStart(3, '0'),
                name: culture.name || '未命名细胞',
                species: culture.species || '',
                medium: culture.medium || '',
                container: culture.container || '',
                vesselCount: vesselCount,
                incubator: culture.incubator || '',
                passage: passage,
                confluence: number(culture.confluence, 0, 100),
                nextAction: culture.nextAction || todayIso(),
                status: culture.status || '培养中',
                notes: culture.notes || '',
                photoData: culture.photoData || '',
                createdBy: anonymousContributor(culture.createdBy),
                changeHistory: Array.isArray(culture.changeHistory) ? culture.changeHistory : [],
                history: Array.isArray(culture.history) ? culture.history.map(function (entry, historyIndex) {
                    return Object.assign({
                        id: 'CELLLOG-' + index + '-' + historyIndex,
                        date: todayIso(),
                        action: '观察',
                        passage: passage,
                        ratio: '—',
                        container: culture.container || '',
                        vesselCount: vesselCount,
                        confluence: number(culture.confluence, 0, 100),
                        medium: culture.medium || '',
                        notes: '',
                        photoData: ''
                    }, entry, { photoData: entry.photoData || '' });
                }) : []
            });
        });

        const protocolByTitle = {
            'BV2 细胞换液': 'SOP-CC-014',
            '小鼠基因分型取样': 'SOP-AN-008',
            '海马区双光子成像': 'SOP-IM-021'
        };
        const experimentByTaskTitle = {
            '海马区双光子成像': 'RL-EXP-026',
            'BV2 炎症刺激': 'RL-EXP-028',
            '类器官 ROS 成像': 'RL-EXP-030'
        };
        data.schedule = data.schedule.map(function (task) {
            const start = /^\d{2}:\d{2}$/.test(String(task.time || '')) ? task.time : '';
            return Object.assign({}, task, {
                date: task.date || todayIso(),
                time: start,
                end: start ? (task.end || addMinutes(start, 60)) : '',
                experimentId: task.experimentId || experimentByTaskTitle[task.title] || '',
                protocolId: task.protocolId == null ? (protocolByTitle[task.title] || '') : task.protocolId,
                done: Boolean(task.done),
                shareWithLab: task.shareWithLab !== false,
                createdBy: anonymousContributor(task.createdBy)
            });
        });
        data.security = data.security && typeof data.security === 'object' ? data.security : { labKeys: {} };
        data.security.labKeys = data.security.labKeys && typeof data.security.labKeys === 'object' ? data.security.labKeys : {};
        data.lineageLinks = (Array.isArray(data.lineageLinks) ? data.lineageLinks : []).map(function (link, index) {
            return {
                id: link.id || 'LIN-' + Date.now() + '-' + index,
                sourceType: String(link.sourceType || ''), sourceId: String(link.sourceId || ''),
                targetType: String(link.targetType || ''), targetId: String(link.targetId || ''),
                relation: String(link.relation || '衍生'), quantity: link.quantity === '' || link.quantity == null ? '' : positiveNumber(link.quantity, 0),
                unit: String(link.unit || ''), notes: String(link.notes || ''), date: link.date || todayIso()
            };
        }).filter(function (link) { return link.sourceType && link.sourceId && link.targetType && link.targetId; });
        data.plateLayouts = (Array.isArray(data.plateLayouts) ? data.plateLayouts : []).map(normalizePlateLayout);
        return data;
    }

    function housingLayoutCoordinate(value, index, axis) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) return Math.min(100, Math.max(0, parsed));
        const columns = axis === 'x' ? [10, 38, 66, 24, 52, 80] : [18, 18, 18, 62, 62, 62];
        return columns[index % columns.length];
    }

    function formatColdStorageBoxLocation(box, units) {
        const unit = (units || state.coldStorageUnits || []).find(function (item) { return item.id === box.storageUnitId; });
        if (!unit) return '位置待设置';
        const shelf = Math.max(1, Number(box.shelf) || 1);
        const level = coldStorageLevel(unit, shelf);
        const rack = Math.max(1, Number(box.storageRack) || 1);
        const row = Math.max(1, Number(box.storageRow) || 1);
        const column = Math.max(1, Number(box.storageColumn) || 1);
        return unit.location + ' / ' + unit.name + ' · 第 ' + shelf + ' 层 · ' + (level.mode === 'rack' ? '第 ' + rack + ' 货架' : '直放区') + ' · 第 ' + row + ' 行第 ' + column + ' 位';
    }

    function firstAvailableColdStorageSlot(unit, shelf, excludedBoxId) {
        const level = coldStorageLevel(unit, shelf);
        const occupied = new Set(state.freezerBoxes.filter(function (box) {
            return box.id !== excludedBoxId && box.storageUnitId === unit.id && Number(box.shelf || 1) === shelf;
        }).map(function (box) { return Number(box.storageRack || 1) + ':' + Number(box.storageRow || 1) + ':' + Number(box.storageColumn || 1); }));
        const racks = level.mode === 'rack' ? level.rackOrder : [1];
        for (const rack of racks) for (let row = 1; row <= level.rows; row += 1) for (let column = 1; column <= level.columns; column += 1) {
            if (!occupied.has(rack + ':' + row + ':' + column)) return { rack: rack, row: row, column: column };
        }
        return { rack: racks[0] || 1, row: 1, column: 1 };
    }

    function normalizeHousingRooms(items, prefix, fallbackName) {
        return (Array.isArray(items) ? items : []).map(function (room, index) {
            return Object.assign({}, room, {
                id: room.id || prefix + '-' + String(index + 1).padStart(3, '0'),
                name: room.name || fallbackName + ' ' + (index + 1),
                notes: String(room.notes || ''),
                shape: ['矩形', '圆角', '斜角', 'L 形'].includes(room.shape) ? room.shape : '矩形',
                entranceSide: ['左侧', '右侧', '上侧', '下侧'].includes(room.entranceSide) ? room.entranceSide : '右侧',
                entrancePosition: number(room.entrancePosition, 12, 88) || 50,
                createdBy: anonymousContributor(room.createdBy),
                history: Array.isArray(room.history) ? room.history : []
            });
        });
    }

    function cleanupLegacyHousingPlaceholders(data) {
        if ((Number(data.housingSchemaVersion) || 0) >= 2) return;
        const usedAnimalRacks = new Set(data.animalCages.map(function (item) { return item.rackId; }).filter(Boolean));
        const usedPlantRacks = new Set(data.plants.map(function (item) { return item.rackId; }).filter(Boolean));
        data.animalRacks = data.animalRacks.filter(function (rack) {
            const placeholder = /^(?:未命名笼架|Untitled rack)$/i.test(String(rack.name || '').trim());
            return usedAnimalRacks.has(rack.id) || !placeholder;
        });
        data.plantRacks = data.plantRacks.filter(function (rack) {
            const placeholder = /^(?:未命名培养架|Untitled growth rack)$/i.test(String(rack.name || '').trim());
            return usedPlantRacks.has(rack.id) || !placeholder;
        });
        data.housingSchemaVersion = 2;
    }

    function roomForLegacyRack(rooms, rack, prefix, fallbackName) {
        let room = rooms.find(function (item) { return item.id === rack.roomId; });
        const facility = String(rack.facility || '').trim();
        if (!room && facility) room = rooms.find(function (item) { return item.name === facility; });
        if (!room) {
            room = {
                id: prefix + '-' + String(rooms.length + 1).padStart(3, '0'),
                name: facility || fallbackName + ' ' + (rooms.length + 1),
                notes: '', createdBy: anonymousContributor(rack.createdBy), history: []
            };
            rooms.push(room);
        }
        return room;
    }

    function migrateAnimalHousing(data) {
        data.animalRooms = normalizeHousingRooms(data.animalRooms, 'AROOM', '动物房间');
        data.animalRacks = (Array.isArray(data.animalRacks) ? data.animalRacks : []).map(function (rack, index) {
            const room = roomForLegacyRack(data.animalRooms, rack, 'AROOM', '动物房间');
            return Object.assign({}, rack, {
                id: rack.id || 'RACK-' + String(index + 1).padStart(3, '0'),
                roomId: room.id,
                name: rack.name || '动物笼架 ' + (index + 1),
                facility: room.name,
                rows: Math.round(number(rack.rows, 1, 12)) || 4,
                columns: Math.round(number(rack.columns, 1, 48)) || 8,
                layoutX: housingLayoutCoordinate(rack.layoutX, index, 'x'),
                layoutY: housingLayoutCoordinate(rack.layoutY, index, 'y'),
                createdBy: anonymousContributor(rack.createdBy),
                history: Array.isArray(rack.history) ? rack.history : []
            });
        });
        data.animalCages = (Array.isArray(data.animalCages) ? data.animalCages : []).map(function (cage, index) {
            return Object.assign({}, cage, {
                id: cage.id || 'CAGE-' + String(index + 1).padStart(3, '0'),
                rackId: cage.rackId || (data.animalRacks[0] ? data.animalRacks[0].id : ''),
                position: normalizeAnimalPosition(cage.position),
                label: cage.label || cage.position || '笼位 ' + (index + 1),
                species: cage.species || '混合 / 待设置',
                capacity: Math.max(1, Math.round(positiveNumber(cage.capacity, 5))),
                status: cage.status || '在用',
                notes: cage.notes || '',
                createdBy: anonymousContributor(cage.createdBy)
            });
        });
        data.mice = (Array.isArray(data.mice) ? data.mice : []).map(function (animal) {
            return Object.assign({}, animal, {
                species: animal.species || '小鼠',
                strain: animal.strain || animal.breed || '',
                createdBy: anonymousContributor(animal.createdBy),
                history: Array.isArray(animal.history) ? animal.history : []
            });
        });
        if (!data.mice.length && !data.animalCages.length && !data.animalRacks.length) return;
        if (!data.animalRacks.length) {
            const room = data.animalRooms[0] || { id: 'AROOM-LEGACY-01', name: '原有动物记录', notes: '', createdBy: 'LOCAL-NODE', history: [] };
            if (!data.animalRooms.length) data.animalRooms.push(room);
            data.animalRacks.push({ id: 'RACK-LEGACY-01', roomId: room.id, name: '迁移笼架', facility: room.name, rows: 6, columns: 12, layoutX: 18, layoutY: 28, createdBy: 'LOCAL-NODE', history: [] });
        }
        const rack = data.animalRacks[0];
        data.mice = data.mice.map(function (animal) {
            let cage = data.animalCages.find(function (item) { return item.id === animal.cageId; });
            if (!cage) {
                const legacyLabel = String(animal.cage || '未分配');
                cage = data.animalCages.find(function (item) { return item.rackId === rack.id && item.label === legacyLabel; });
                if (!cage) {
                    const position = normalizeAnimalPosition(legacyLabel) || firstAvailableAnimalPosition(rack, data.animalCages);
                    cage = { id: 'CAGE-MIG-' + String(data.animalCages.length + 1).padStart(3, '0'), rackId: rack.id, position: position, label: legacyLabel, species: animal.species, capacity: 5, status: '在用', notes: '', createdBy: animal.createdBy };
                    data.animalCages.push(cage);
                }
            }
            return Object.assign({}, animal, { cageId: cage.id, cage: cage.label });
        });
    }

    function migratePlantHousing(data) {
        data.plantRooms = normalizeHousingRooms(data.plantRooms, 'PROOM', '植物培养室');
        data.plantRacks = (Array.isArray(data.plantRacks) ? data.plantRacks : []).map(function (rack, index) {
            const room = roomForLegacyRack(data.plantRooms, rack, 'PROOM', '植物培养室');
            return Object.assign({}, rack, {
                id: rack.id || 'PRACK-' + String(index + 1).padStart(3, '0'),
                roomId: room.id,
                name: rack.name || '植物培养架 ' + (index + 1),
                facility: room.name,
                rows: Math.round(number(rack.rows, 1, 12)) || 4,
                columns: Math.round(number(rack.columns, 1, 48)) || 8,
                layoutX: housingLayoutCoordinate(rack.layoutX, index, 'x'),
                layoutY: housingLayoutCoordinate(rack.layoutY, index, 'y'),
                createdBy: anonymousContributor(rack.createdBy),
                history: Array.isArray(rack.history) ? rack.history : []
            });
        });
        data.plants = (Array.isArray(data.plants) ? data.plants : []).map(function (plant, index) {
            return Object.assign({}, plant, { id: plant.id || 'PLT-' + String(index + 1).padStart(3, '0'), name: plant.name || '未命名植物材料', rackId: plant.rackId || '', position: normalizePlantPosition(plant.position), createdBy: anonymousContributor(plant.createdBy), history: Array.isArray(plant.history) ? plant.history : [] });
        });
        if (!data.plants.length && !data.plantRacks.length) return;
        if (!data.plantRacks.length) {
            const room = data.plantRooms[0] || { id: 'PROOM-LEGACY-01', name: '原有植物记录', notes: '', createdBy: 'LOCAL-NODE', history: [] };
            if (!data.plantRooms.length) data.plantRooms.push(room);
            data.plantRacks.push({ id: 'PRACK-LEGACY-01', roomId: room.id, name: '迁移培养架', facility: room.name, rows: 6, columns: 12, layoutX: 18, layoutY: 28, createdBy: 'LOCAL-NODE', history: [] });
        }
        data.plants.forEach(function (plant) {
            let rack = data.plantRacks.find(function (item) { return item.id === plant.rackId; });
            if (!rack) rack = data.plantRacks.find(function (item) { return String(plant.location || '').includes(item.facility); }) || data.plantRacks[0];
            let position = normalizePlantPosition(plant.position) || normalizePlantPosition(String(plant.location || '').split('/').pop());
            if (!position || !isValidPlantPosition(rack, position) || data.plants.some(function (other) { return other !== plant && other.rackId === rack.id && other.position === position; })) position = firstAvailablePlantPosition(rack, data.plants);
            plant.rackId = rack.id; plant.position = position; plant.location = formatPlantLocation(rack, position);
        });
    }
    function normalizeBioinformaticsData(data) {
        [['bioProjects','BIO-PRJ','未命名项目'],['bioDatasets','BIO-DATA','未命名数据集'],['bioPipelines','BIO-FLOW','未命名分析流程'],['bioRuns','BIO-RUN','未命名运行任务']].forEach(function (spec) {
            data[spec[0]] = (Array.isArray(data[spec[0]]) ? data[spec[0]] : []).map(function (record, index) {
                return Object.assign({}, record, { id: record.id || spec[1] + '-' + String(index + 1).padStart(3, '0'), name: record.name || spec[2], createdBy: anonymousContributor(record.createdBy), history: Array.isArray(record.history) ? record.history : [] });
            });
        });
    }

    function normalizePlantPosition(value) { const match = String(value || '').trim().toUpperCase().match(/^([A-L])[-\s]?(\d{1,2})$/); return match ? match[1] + Number(match[2]) : ''; }
    function isValidPlantPosition(rack, position) { const match = String(position || '').match(/^([A-L])(\d{1,2})$/); return Boolean(rack && match && match[1].charCodeAt(0) - 64 <= rack.rows && Number(match[2]) <= rack.columns); }
    function firstAvailablePlantPosition(rack, plants) {
        if (!rack) return ''; const occupied = new Set(plants.filter(function (item) { return item.rackId === rack.id; }).map(function (item) { return item.position; }));
        for (let row = 0; row < rack.rows; row += 1) for (let column = 1; column <= rack.columns; column += 1) { const position = String.fromCharCode(65 + row) + column; if (!occupied.has(position)) return position; } return '';
    }
    function formatPlantLocation(rack, position) { return rack ? rack.facility + (position ? ' / ' + position : '') : '未分配'; }
    function normalizeAnimalPosition(value) {
        const match = String(value || '').trim().toUpperCase().match(/^([A-L])[-\s]?(\d{1,2})$/);
        return match ? match[1] + Number(match[2]) : '';
    }

    function firstAvailableAnimalPosition(rack, cages) {
        if (!rack) return '';
        const occupied = new Set(cages.filter(item => item.rackId === rack.id).map(item => item.position));
        for (let row = 0; row < rack.rows; row += 1) {
            for (let column = 1; column <= rack.columns; column += 1) {
                const position = String.fromCharCode(65 + row) + column;
                if (!occupied.has(position)) return position;
            }
        }
        return '';
    }

    function mergeExampleRecords(target, examples, key) {
        examples.forEach(function (example) {
            if (!target.some(item => item[key] === example[key])) target.push(clone(example));
        });
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function resolveLatestDesktopDownload() {
        const button = document.getElementById('desktopDownloadButton');
        if (!button || isInstalledAppRuntime()) return;
        fetch('https://api.github.com/repos/HalleyLab/Rhine_Lab/releases/latest', { cache: 'no-store' })
            .then(function (response) { if (!response.ok) throw new Error('Release lookup failed'); return response.json(); })
            .then(function (release) {
                const assets = Array.isArray(release.assets) ? release.assets : [];
                const installer = assets.find(function (asset) { return /-Windows-Setup\.exe$/i.test(String(asset.name || '')); });
                if (!installer || !installer.browser_download_url) throw new Error('Windows installer missing');
                button.href = installer.browser_download_url;
                button.download = installer.name;
            })
            .catch(function () { button.removeAttribute('download'); });
    }

    function normalizeActivityEntry(activity) {
        const item = Object.assign({}, activity);
        if (!item.at && item.time === '刚刚') item.at = new Date().toISOString();
        return item;
    }

    function addActivity(text) {
        if (!Array.isArray(state.activities)) state.activities = [];
        state.activities.unshift({ text: String(text || ''), at: new Date().toISOString() });
        state.activities = state.activities.slice(0, 300);
    }

    function saveState(options) {
        const storageKey = scopeStorageKey(workspaceMode);
        if (!window.RHINE_LAB_STORAGE_LOCKED) {
            if (window.RhineLabCrypto) window.RhineLabCrypto.writeLocal(storageKey, state).catch(function () { showToast('本机加密保存失败，请勿关闭页面'); });
            else localStorage.setItem(storageKey, JSON.stringify(state));
        }
        if (!(options && options.remote) && window.RhineLabSync) {
            window.RhineLabSync.queueState(state, workspaceMode);
        }
    }

    function startCloudSync() {
        if (!window.RhineLabSync) return;
        window.RhineLabSync.start({
            getState: function () { return clone(state); },
            getScope: function () { return workspaceMode; },
            applyState: applyCloudState,
            setAccess: setWorkspaceAccess,
            getLabKey: getLabKey,
            setLabKey: setLabKey,
            buildSharedProjection: buildSharedProjection,
            getPersonalState: function () { return clone(personalStateSnapshot()); },
            setPersonalState: setPersonalState,
            getLabState: function () { return clone(workspaceMode === 'lab' ? state : migrateState(loadState('lab'))); },
            setLabState: setLabState,
            selectScope: setWorkspaceMode,
            getEmptyState: function () { return clone(emptyWorkspaceState()); },
            isPublicShowcase: isPublicDemoRuntime
        });
    }

    function personalStateSnapshot() {
        return workspaceMode === 'personal' ? state : migrateState(loadState('personal'));
    }

    function setPersonalState(payload) {
        const personal = migrateState(normalizeStateShape(payload));
        if (workspaceMode === 'personal') {
            applyCloudState(personal, 'personal');
            return Promise.resolve();
        }
        if (window.RhineLabCrypto) return window.RhineLabCrypto.writeLocal(scopeStorageKey('personal'), personal);
        localStorage.setItem(scopeStorageKey('personal'), JSON.stringify(personal));
        return Promise.resolve();
    }

    function setLabState(payload) {
        const lab = migrateState(normalizeStateShape(payload));
        if (workspaceMode === 'lab') {
            applyCloudState(lab, 'lab');
            return Promise.resolve();
        }
        if (window.RhineLabCrypto) return window.RhineLabCrypto.writeLocal(scopeStorageKey('lab'), lab);
        localStorage.setItem(scopeStorageKey('lab'), JSON.stringify(lab));
        return Promise.resolve();
    }

    function getLabKey(labId) {
        const personal = personalStateSnapshot();
        return personal.security && personal.security.labKeys ? String(personal.security.labKeys[labId] || '') : '';
    }

    function setLabKey(labId, keyValue) {
        if (!labId || !keyValue) return;
        const personal = personalStateSnapshot();
        personal.security = personal.security || { labKeys: {} };
        personal.security.labKeys = personal.security.labKeys || {};
        personal.security.labKeys[labId] = keyValue;
        if (workspaceMode === 'personal') state = personal;
        if (window.RhineLabCrypto) window.RhineLabCrypto.writeLocal(scopeStorageKey('personal'), personal);
        else localStorage.setItem(scopeStorageKey('personal'), JSON.stringify(personal));
        if (window.RhineLabSync) window.RhineLabSync.queueState(personal, 'personal');
    }

    function buildSharedProjection(source) {
        const projection = clone(source || personalStateSnapshot());
        delete projection.security;
        delete projection.auditLog;
        projection.schedule = (projection.schedule || []).filter(function (task) { return task.shareWithLab !== false; });
        ['experiments', 'reagents', 'samples', 'protocols', 'cellCultures'].forEach(function (collectionName) {
            (projection[collectionName] || []).forEach(function (record) { delete record.photoData; delete record.photoPath; delete record.photoEncryption; });
        });
        (projection.freezerBoxes || []).forEach(function (record) { delete record.lastScanPhoto; delete record.lastScanPhotoPath; delete record.lastScanPhotoEncryption; });
        (projection.results || []).forEach(function (record) {
            record.attachments = (record.attachments || []).map(function (attachment) { return { id: attachment.id, name: attachment.name, type: attachment.type, size: attachment.size }; });
        });
        return projection;
    }

    function applyCloudState(payload, scope) {
        if (scope !== workspaceMode) return;
        state = migrateState(normalizeStateShape(payload));
        selectedSampleId = state.samples[0] ? state.samples[0].id : '';
        if (!state.freezerBoxes.some(box => box.id === activeFreezerBoxId)) {
            activeFreezerBoxId = state.freezerBoxes[0].id;
        }
        const activeBox = state.freezerBoxes.find(box => box.id === activeFreezerBoxId);
        if (!state.coldStorageUnits.some(unit => unit.id === activeColdStorageId)) activeColdStorageId = (activeBox && activeBox.storageUnitId) || state.coldStorageUnits[0].id;
        activeColdStorageShelf = Math.max(1, Number(activeBox && activeBox.shelf) || activeColdStorageShelf || 1);
        if (!state.animalRacks.some(rack => rack.id === activeAnimalRackId)) activeAnimalRackId = state.animalRacks[0] ? state.animalRacks[0].id : '';
        if (!state.animalCages.some(cage => cage.id === selectedAnimalCageId)) selectedAnimalCageId = state.animalCages[0] ? state.animalCages[0].id : '';
        saveState({ remote: true });
        renderAll();
    }

    function setWorkspaceAccess(access) {
        const nextAuthenticated = Boolean(access && access.authenticated);
        const publicAccessChanged = publicDemoMode && nextAuthenticated !== publicDemoUnlocked;
        publicDemoUnlocked = nextAuthenticated;
        workspaceAccess = {
            authenticated: nextAuthenticated,
            labReadOnly: Boolean(access && access.readOnly)
        };
        if (publicAccessChanged) {
            state = nextAuthenticated
                ? migrateState(loadState(workspaceMode))
                : migrateState(normalizeStateShape(clone(defaults)));
            selectedSampleId = state.samples[0] ? state.samples[0].id : '';
            if (!state.freezerBoxes.some(box => box.id === activeFreezerBoxId)) activeFreezerBoxId = state.freezerBoxes[0].id;
            const activeBox = state.freezerBoxes.find(box => box.id === activeFreezerBoxId);
            activeColdStorageId = (activeBox && activeBox.storageUnitId) || state.coldStorageUnits[0].id;
            activeColdStorageShelf = Math.max(1, Number(activeBox && activeBox.shelf) || 1);
            if (!state.animalRacks.some(rack => rack.id === activeAnimalRackId)) activeAnimalRackId = state.animalRacks[0] ? state.animalRacks[0].id : '';
            selectedAnimalCageId = (state.animalCages.find(cage => cage.rackId === activeAnimalRackId) || {}).id || '';
        }
        workspaceReadOnly = computeWorkspaceReadOnly();
        applyWorkspaceMode();
        if (publicAccessChanged) renderAll();
    }

    function computeWorkspaceReadOnly() {
        return workspaceMode === 'lab';
    }

    function getInitialView() {
        const hash = location.hash.replace('#', '');
        if (hash === 'results') return 'experiments';
        return ['dashboard', 'experiments', 'mice', 'reagents', 'samples', 'protocols', 'schedule', 'cells'].includes(hash) ? hash : 'dashboard';
    }

    function applySavedTheme() {
        const theme = localStorage.getItem('rhineLabTheme');
        applyTheme(theme === 'dark' || theme === 'light' ? theme : themeFromSystemTime());
    }

    function applySavedBackground() {
        localStorage.removeItem('rhineLabBackground');
        applyBackground('default');
    }

    function applyBackground(background) {
        const allLives = background === 'all-lives';
        document.body.classList.toggle('background-all-lives', allLives);
        document.body.classList.remove('background-black-current');
        updateBackgroundToggleLabel();
    }

    function currentBackground() {
        if (document.body.classList.contains('background-all-lives')) return 'all-lives';
        return 'default';
    }

    function updateBackgroundToggleLabel() {
        const toggle = document.getElementById('backgroundToggle');
        if (!toggle) return;
        const current = currentBackground();
        toggle.dataset.backgroundMode = current;
        toggle.setAttribute('aria-pressed', String(current !== 'default'));
        const text = toggle.querySelector('.utility-label');
        if (text) text.textContent = interfaceText('切换背景');
        toggle.setAttribute('aria-label', interfaceText('切换背景'));
        toggle.setAttribute('title', interfaceText('切换背景'));
    }

    function setUtilityNav(open) {
        if (!els.utilityNav || !els.utilityNavToggle) return;
        els.utilityNav.hidden = !open;
        els.utilityNavToggle.setAttribute('aria-expanded', String(open));
        const label = interfaceText(open ? '关闭工具导航' : '打开工具导航');
        els.utilityNavToggle.setAttribute('aria-label', label);
        els.utilityNavToggle.setAttribute('title', label);
    }

    function themeFromSystemTime(date) {
        const hour = (date || new Date()).getHours();
        return hour >= 6 && hour < 18 ? 'light' : 'dark';
    }

    function applyTimeThemeIfAutomatic() {
        const savedTheme = localStorage.getItem('rhineLabTheme');
        if (savedTheme === 'dark' || savedTheme === 'light') return;
        applyTheme(themeFromSystemTime());
    }

    function applyTheme(theme) {
        const dark = theme === 'dark';
        document.body.classList.toggle('dark-theme', dark);
        document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) themeColor.setAttribute('content', dark ? '#1b2420' : '#f2f4ed');
        const statusBar = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.StatusBar;
        if (statusBar) {
            statusBar.setStyle({ style: dark ? 'LIGHT' : 'DARK' }).catch(function () {});
        }
        updateThemeToggleLabel();
    }

    function updateThemeToggleLabel() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;
        const label = document.body.classList.contains('dark-theme') ? '日间模式☀️' : '夜间模式🌙';
        const text = toggle.querySelector('.utility-label');
        if (text) text.textContent = interfaceText(label);
        toggle.setAttribute('aria-label', interfaceText(label));
        toggle.setAttribute('title', interfaceText(label));
    }

    function applyWorkspaceMode() {
        document.body.classList.toggle('lab-workspace', workspaceMode === 'lab');
        document.body.classList.toggle('workspace-readonly', workspaceReadOnly);
        document.body.classList.toggle('public-demo-locked', publicDemoMode && !workspaceAccess.authenticated);
        const publicBanner = document.getElementById('publicDemoBanner');
        if (publicBanner) publicBanner.hidden = !(publicDemoMode && !workspaceAccess.authenticated);
        if (els.workspaceModeToggle) {
            const button = els.workspaceModeToggle.querySelector('.mobile-workspace-action');
            if (button) {
                const target = workspaceMode === 'lab' ? 'personal' : 'lab';
                button.dataset.workspaceMode = target;
                const text = button.querySelector('.utility-label');
                const source = target === 'lab' ? '切换LAB' : '切换个人';
                if (text) text.textContent = interfaceText(source);
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
            els.workspaceModeToggle.querySelectorAll('.desktop-workspace-options [data-workspace-mode]').forEach(function (option) {
                const active = option.dataset.workspaceMode === workspaceMode;
                option.classList.toggle('active', active);
                option.setAttribute('aria-pressed', String(active));
            });
        }
        if (els.workspaceScopeBanner) els.workspaceScopeBanner.hidden = workspaceMode !== 'lab';
        if (workspaceMode === 'lab' && els.workspaceScopeBanner) {
            const description = els.workspaceScopeBanner.querySelector('div:first-child > span');
            if (description) description.textContent = '通过 .rhinelab 文件合并实验室成员共享记录；此界面只读。';
        }
    }

    function setWorkspaceMode(mode) {
        if (!['personal', 'lab'].includes(mode) || mode === workspaceMode) return;
        saveState();
        workspaceMode = mode;
        localStorage.setItem('rhineLabWorkspaceMode', mode);
        state = migrateState(loadState(mode));
        selectedSampleId = state.samples[0] ? state.samples[0].id : '';
        if (!state.freezerBoxes.some(box => box.id === activeFreezerBoxId)) activeFreezerBoxId = state.freezerBoxes[0].id;
        const activeBox = state.freezerBoxes.find(box => box.id === activeFreezerBoxId);
        activeColdStorageId = (activeBox && activeBox.storageUnitId) || state.coldStorageUnits[0].id;
        activeColdStorageShelf = Math.max(1, Number(activeBox && activeBox.shelf) || 1);
        if (!state.animalRacks.some(rack => rack.id === activeAnimalRackId)) activeAnimalRackId = state.animalRacks[0] ? state.animalRacks[0].id : '';
        selectedAnimalCageId = (state.animalCages.find(cage => cage.rackId === activeAnimalRackId) || {}).id || '';
        workspaceReadOnly = computeWorkspaceReadOnly();
        applyWorkspaceMode();
        renderAll();
        if (window.RhineLabSync) window.RhineLabSync.switchScope(mode);
        showToast(mode === 'lab' ? '已切换到实验室共用界面' : '已返回个人工作界面');
    }

    function renderWorkspaceScope() {
        if (workspaceMode !== 'lab') return;
        const collections = [state.experiments, state.protocols, state.reagents, state.samples, state.mice, state.cellCultures];
        const members = new Set();
        collections.forEach(function (items) {
            items.forEach(item => members.add(contributorName(item)));
        });
        const totalRecords = collections.reduce((sum, items) => sum + items.length, 0);
        els.workspaceScopeStats.innerHTML = '<span><strong>' + members.size + '</strong><small>录入成员</small></span><span><strong>' + totalRecords + '</strong><small>整合记录</small></span><span><strong>' + state.protocols.length + '</strong><small>共享 Protocol</small></span>';
    }

    function contributorName(item) {
        return anonymousContributor(item && item.createdBy);
    }

    function contributorInline(item) {
        return workspaceMode === 'lab' ? ' · 录入 ' + esc(contributorName(item)) : '';
    }

    function anonymousContributor(value) {
        const raw = String(value || '').trim();
        if (!raw) return 'LOCAL-NODE';
        if (/^(?:LOCAL-NODE|NODE-\d{2})$/.test(raw)) return raw;
        let hash = 0;
        for (let index = 0; index < raw.length; index += 1) {
            hash = (hash * 31 + raw.charCodeAt(index)) >>> 0;
        }
        return 'NODE-' + String(hash % 24 + 1).padStart(2, '0');
    }

    function setTodayLabels() {
        const now = new Date();
        const locale = interfaceLocale();
        const label = new Intl.DateTimeFormat(locale, { month: '2-digit', day: '2-digit', weekday: 'short' }).format(now);
        document.getElementById('todayLabel').textContent = label;
        document.getElementById('scheduleDateTitle').textContent = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(now);
        updateTimeGreeting(now);
    }

    function updateTimeGreeting(date) {
        const now = date instanceof Date ? date : new Date();
        const hour = now.getHours();
        let greeting = '晚上好';
        if (hour >= 5 && hour < 11) greeting = '早上好';
        else if (hour >= 11 && hour < 13) greeting = '中午好';
        else if (hour >= 13 && hour < 18) greeting = '下午好';
        document.getElementById('timeGreeting').textContent = interfaceText(greeting + '，研究员。');
    }

    function bindDirectDragScroll() {
        let drag = null;
        let suppressClick = false;
        document.addEventListener('pointerdown', function (event) {
            const scroller = event.target.closest('[data-drag-scroll]');
            if (!scroller || event.button !== 0 || event.pointerType !== 'mouse' || event.target.closest('.animal-rack-delete,.plant-rack-delete')) return;
            drag = { element: scroller, pointerId: event.pointerId, startX: event.clientX, startScroll: scroller.scrollLeft, moved: false };
        });
        document.addEventListener('pointermove', function (event) {
            if (!drag || drag.pointerId !== event.pointerId) return;
            const delta = event.clientX - drag.startX;
            if (!drag.moved && Math.abs(delta) < 5) return;
            drag.moved = true; drag.element.classList.add('is-dragging'); drag.element.scrollLeft = drag.startScroll - delta; event.preventDefault();
        }, { passive: false });
        function finish(event) {
            if (!drag || event.pointerId !== drag.pointerId) return;
            suppressClick = drag.moved; drag.element.classList.remove('is-dragging'); drag = null;
            if (suppressClick) window.setTimeout(function () { suppressClick = false; }, 0);
        }
        document.addEventListener('pointerup', finish); document.addEventListener('pointercancel', finish);
        document.addEventListener('click', function (event) { if (suppressClick && event.target.closest('[data-drag-scroll]')) { event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false; } }, true);
    }
    function bindRoomLayoutDrag() {
        let drag = null;
        let suppressClick = false;
        document.addEventListener('pointerdown', function (event) {
            const card = event.target.closest('[data-room-layout-rack]');
            if (!card || event.button !== 0 || workspaceReadOnly || event.target.closest('[data-delete-animal-rack],[data-delete-plant-rack]')) return;
            const map = card.closest('[data-room-map]');
            if (!map) return;
            const cardRect = card.getBoundingClientRect();
            drag = {
                card: card, map: map, pointerId: event.pointerId,
                kind: card.dataset.roomLayoutRack,
                id: card.dataset.animalRack || card.dataset.plantRack,
                offsetX: event.clientX - cardRect.left, offsetY: event.clientY - cardRect.top,
                moved: false, x: 0, y: 0
            };
            card.setPointerCapture?.(event.pointerId);
        });
        document.addEventListener('pointermove', function (event) {
            if (!drag || drag.pointerId !== event.pointerId) return;
            const mapRect = drag.map.getBoundingClientRect();
            const cardRect = drag.card.getBoundingClientRect();
            const maxX = Math.max(1, mapRect.width - cardRect.width);
            const maxY = Math.max(1, mapRect.height - cardRect.height);
            const left = Math.min(maxX, Math.max(0, event.clientX - mapRect.left - drag.offsetX));
            const top = Math.min(maxY, Math.max(0, event.clientY - mapRect.top - drag.offsetY));
            if (!drag.moved && Math.hypot(left - (cardRect.left - mapRect.left), top - (cardRect.top - mapRect.top)) < 4) return;
            drag.moved = true;
            drag.x = left / maxX * 100;
            drag.y = top / maxY * 100;
            drag.card.style.left = drag.x + '%';
            drag.card.style.top = drag.y + '%';
            drag.card.style.transform = 'translate(-' + drag.x + '%, -' + drag.y + '%)';
            drag.card.classList.add('is-dragging');
            event.preventDefault();
        }, { passive: false });
        function finish(event) {
            if (!drag || drag.pointerId !== event.pointerId) return;
            drag.card.classList.remove('is-dragging');
            if (drag.moved) {
                const collection = drag.kind === 'animal' ? state.animalRacks : state.plantRacks;
                const rack = collection.find(function (item) { return item.id === drag.id; });
                if (rack) { rack.layoutX = roundQuantity(drag.x); rack.layoutY = roundQuantity(drag.y); saveState(); }
                suppressClick = true;
                window.setTimeout(function () { suppressClick = false; }, 0);
            }
            drag = null;
        }
        document.addEventListener('pointerup', finish);
        document.addEventListener('pointercancel', finish);
        document.addEventListener('click', function (event) {
            if (suppressClick && event.target.closest('[data-room-layout-rack]')) {
                event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false;
            }
        }, true);
    }

    function bindColdStorageBoxDrag() {
        let drag = null;
        let suppressClick = false;
        document.addEventListener('pointerdown', function (event) {
            const slot = event.target.closest('[data-cold-storage-box]');
            if (!slot || event.button !== 0 || workspaceReadOnly) return;
            event.stopPropagation();
            drag = { pointerId: event.pointerId, slot: slot, boxId: slot.dataset.coldStorageBox, startX: event.clientX, startY: event.clientY, moved: false, target: null, ghost: null };
            slot.setPointerCapture?.(event.pointerId);
        });
        document.addEventListener('pointermove', function (event) {
            if (!drag || event.pointerId !== drag.pointerId) return;
            if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 2) return;
            if (!drag.moved) {
                drag.moved = true;
                drag.slot.classList.add('is-dragging');
                drag.ghost = drag.slot.cloneNode(true);
                drag.ghost.className = 'cold-storage-box-drag-ghost';
                drag.ghost.removeAttribute('id');
                drag.ghost.setAttribute('aria-hidden', 'true');
                document.body.appendChild(drag.ghost);
            }
            drag.ghost.style.left = event.clientX + 'px';
            drag.ghost.style.top = event.clientY + 'px';
            const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-storage-slot]') || null;
            if (drag.target !== target) {
                drag.target?.classList.remove('drop-target');
                drag.target = target;
                drag.target?.classList.add('drop-target');
            }
            event.preventDefault();
        }, { passive: false });
        function finish(event) {
            if (!drag || event.pointerId !== drag.pointerId) return;
            drag.slot.classList.remove('is-dragging');
            drag.target?.classList.remove('drop-target');
            if (event.type === 'pointerup' && drag.moved && drag.target) {
                const box = state.freezerBoxes.find(function (item) { return item.id === drag.boxId; });
                const targetUnitId = drag.target.dataset.storageUnit || activeColdStorageId;
                const targetShelf = Math.max(1, Number(drag.target.dataset.storageShelf) || activeColdStorageShelf);
                const targetRack = Math.max(1, Number(drag.target.dataset.storageRack) || 1);
                const targetRow = Number(drag.target.dataset.storageRow);
                const targetColumn = Number(drag.target.dataset.storageColumn);
                const targetUnit = state.coldStorageUnits.find(function (item) { return item.id === targetUnitId; });
                const other = state.freezerBoxes.find(function (item) { return item.id !== drag.boxId && item.storageUnitId === targetUnitId && Number(item.shelf || 1) === targetShelf && Number(item.storageRack || 1) === targetRack && Number(item.storageRow || 1) === targetRow && Number(item.storageColumn || 1) === targetColumn; });
                if (box && targetUnit && (box.storageUnitId !== targetUnitId || Number(box.shelf || 1) !== targetShelf || Number(box.storageRack || 1) !== targetRack || Number(box.storageRow) !== targetRow || Number(box.storageColumn) !== targetColumn)) {
                    const sourceUnitId = box.storageUnitId; const sourceShelf = box.shelf; const sourceRack = box.storageRack || 1; const sourceRow = box.storageRow; const sourceColumn = box.storageColumn;
                    box.storageUnitId = targetUnitId; box.shelf = targetShelf; box.storageRack = targetRack; box.storageRow = targetRow; box.storageColumn = targetColumn; box.temperature = targetUnit.temperature;
                    if (other) {
                        const sourceUnit = state.coldStorageUnits.find(function (item) { return item.id === sourceUnitId; });
                        other.storageUnitId = sourceUnitId; other.shelf = sourceShelf; other.storageRack = sourceRack; other.storageRow = sourceRow; other.storageColumn = sourceColumn;
                        if (sourceUnit) other.temperature = sourceUnit.temperature;
                        other.storageLocation = formatColdStorageBoxLocation(other);
                    }
                    box.storageLocation = formatColdStorageBoxLocation(box);
                    const entry = { at: new Date().toISOString(), action: 'updated', changes: [{ field: '冻存盒位置' }] };
                    box.history = Array.isArray(box.history) ? box.history : []; box.history.unshift(entry);
                    if (other) { other.history = Array.isArray(other.history) ? other.history : []; other.history.unshift(entry); }
                    addActivity('移动冻存盒“' + box.name + '”');
                    activeColdStorageId = targetUnitId; activeColdStorageShelf = targetShelf; activeFreezerBoxId = box.id;
                    localStorage.setItem('rhineLabActiveColdStorage', targetUnitId);
                    localStorage.setItem('rhineLabActiveColdStorageShelf', String(targetShelf));
                    localStorage.setItem('rhineLabActiveFreezerBox', box.id);
                    saveState(); renderSamples();
                }
            }
            drag.ghost?.remove();
            if (drag.moved) { suppressClick = true; window.setTimeout(function () { suppressClick = false; }, 350); }
            drag = null;
        }
        document.addEventListener('pointerup', finish);
        document.addEventListener('pointercancel', finish);
        document.addEventListener('click', function (event) {
            if (suppressClick && event.target.closest('[data-storage-slot]')) { event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false; }
        }, true);
    }

    function bindColdStorageRackDrag() {
        let drag = null;
        document.addEventListener('pointerdown', function (event) {
            const handle = event.target.closest('[data-cold-storage-rack-handle]');
            const rack = handle?.closest('[data-cold-storage-rack]');
            if (!rack || event.button !== 0 || workspaceReadOnly) return;
            event.preventDefault();
            event.stopPropagation();
            drag = {
                pointerId: event.pointerId,
                handle: handle,
                rack: rack,
                sourceContainer: rack.parentElement,
                sourceUnitId: rack.dataset.storageUnit,
                sourceShelf: Number(rack.dataset.storageShelf),
                sourceRack: Number(rack.dataset.storageRack),
                startX: event.clientX,
                startY: event.clientY,
                moved: false,
                dropContainer: null
            };
            handle.setPointerCapture?.(event.pointerId);
        }, { passive: false });
        document.addEventListener('pointermove', function (event) {
            if (!drag || event.pointerId !== drag.pointerId) return;
            if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 3) return;
            drag.moved = true;
            drag.rack.classList.add('is-dragging');
            const point = document.elementFromPoint(event.clientX, event.clientY);
            const target = point?.closest('[data-cold-storage-rack]') || null;
            const container = target?.parentElement || point?.closest('[data-cold-storage-racks]') || null;
            if (!container || container.dataset.rackMode !== 'rack' || container.dataset.storageUnit !== drag.sourceUnitId) return;
            const targetShelf = Number(container.dataset.storageShelf);
            if (container !== drag.rack.parentElement) {
                if (targetShelf === drag.sourceShelf && container !== drag.sourceContainer) return;
                const unit = state.coldStorageUnits.find(function (item) { return item.id === drag.sourceUnitId; });
                const sourceLevel = unit && coldStorageLevel(unit, drag.sourceShelf);
                const targetLevel = unit && coldStorageLevel(unit, targetShelf);
                const movingBoxes = state.freezerBoxes.filter(function (box) { return box.storageUnitId === drag.sourceUnitId && Number(box.shelf || 1) === drag.sourceShelf && Number(box.storageRack || 1) === drag.sourceRack; });
                if (!sourceLevel || !targetLevel || sourceLevel.rackOrder.length <= 1 || targetLevel.rackOrder.length >= 8 || movingBoxes.some(function (box) { return Number(box.storageRow || 1) > targetLevel.rows || Number(box.storageColumn || 1) > targetLevel.columns; })) return;
            }
            if (target && target !== drag.rack) {
                const rect = target.getBoundingClientRect();
                const after = container.classList.contains('vertical') ? event.clientX > rect.left + rect.width / 2 : event.clientY > rect.top + rect.height / 2;
                container.insertBefore(drag.rack, after ? target.nextSibling : target);
            } else if (!target) {
                container.appendChild(drag.rack);
            }
            drag.dropContainer?.classList.remove('is-rack-drop-target');
            drag.dropContainer = container;
            drag.dropContainer.classList.add('is-rack-drop-target');
            event.preventDefault();
            event.stopPropagation();
        }, { passive: false });
        function finish(event) {
            if (!drag || event.pointerId !== drag.pointerId) return;
            drag.rack.classList.remove('is-dragging');
            drag.dropContainer?.classList.remove('is-rack-drop-target');
            if (drag.moved) {
                const unit = state.coldStorageUnits.find(function (item) { return item.id === drag.sourceUnitId; });
                const targetContainer = drag.rack.parentElement;
                const targetShelf = Number(targetContainer?.dataset.storageShelf);
                const sourceLevel = unit && coldStorageLevel(unit, drag.sourceShelf);
                const targetLevel = unit && coldStorageLevel(unit, targetShelf);
                if (sourceLevel && targetLevel && targetShelf === drag.sourceShelf) {
                    sourceLevel.rackOrder = Array.from(targetContainer.children).map(function (item) { return Number(item.dataset.storageRack); }).filter(Boolean);
                    unit.history.unshift({ at: new Date().toISOString(), action: 'updated', changes: [{ field: '第 ' + targetShelf + ' 层货架顺序' }] });
                    saveState();
                    renderSamples();
                } else if (sourceLevel && targetLevel && targetContainer !== drag.sourceContainer) {
                    let targetRack = 1;
                    while (targetLevel.rackOrder.includes(targetRack)) targetRack += 1;
                    sourceLevel.rackOrder = sourceLevel.rackOrder.filter(function (rack) { return rack !== drag.sourceRack; });
                    sourceLevel.rackCount = sourceLevel.rackOrder.length;
                    targetLevel.rackOrder = Array.from(targetContainer.children).map(function (item) { return item === drag.rack ? targetRack : Number(item.dataset.storageRack); }).filter(Boolean);
                    targetLevel.rackCount = targetLevel.rackOrder.length;
                    state.freezerBoxes.filter(function (box) { return box.storageUnitId === drag.sourceUnitId && Number(box.shelf || 1) === drag.sourceShelf && Number(box.storageRack || 1) === drag.sourceRack; }).forEach(function (box) {
                        box.shelf = targetShelf;
                        box.storageRack = targetRack;
                        box.storageLocation = formatColdStorageBoxLocation(box);
                    });
                    unit.history.unshift({ at: new Date().toISOString(), action: 'updated', changes: [{ field: '货架由第 ' + drag.sourceShelf + ' 层移动到第 ' + targetShelf + ' 层' }] });
                    activeColdStorageShelf = targetShelf;
                    localStorage.setItem('rhineLabActiveColdStorageShelf', String(targetShelf));
                    addActivity('移动“' + unit.name + '”货架到第 ' + targetShelf + ' 层');
                    saveState();
                    renderSamples();
                }
            }
            drag = null;
        }
        document.addEventListener('pointerup', finish);
        document.addEventListener('pointercancel', finish);
    }

    function bindRoomTabReorder() {
        let draggedTab = null;
        let suppressClick = false;
        document.addEventListener('dragstart', function (event) {
            const tab = event.target.closest('[data-room-tab]');
            if (!tab || workspaceReadOnly || event.target.closest('[data-edit-animal-room],[data-edit-plant-room]')) return;
            draggedTab = tab;
            tab.classList.add('is-reordering');
            if (event.dataTransfer) { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', tab.dataset.roomTab); }
        });
        document.addEventListener('dragover', function (event) {
            const target = event.target.closest('[data-room-tab]');
            if (!draggedTab || !target || target.dataset.roomKind !== draggedTab.dataset.roomKind) return;
            event.preventDefault();
            target.classList.add('is-drop-target');
        });
        document.addEventListener('dragleave', function (event) {
            const target = event.target.closest('[data-room-tab]');
            if (target) target.classList.remove('is-drop-target');
        });
        document.addEventListener('drop', function (event) {
            const target = event.target.closest('[data-room-tab]');
            if (!draggedTab || !target || target === draggedTab || target.dataset.roomKind !== draggedTab.dataset.roomKind) return;
            event.preventDefault();
            const collection = draggedTab.dataset.roomKind === 'animal' ? state.animalRooms : state.plantRooms;
            const from = collection.findIndex(function (item) { return item.id === draggedTab.dataset.roomTab; });
            const to = collection.findIndex(function (item) { return item.id === target.dataset.roomTab; });
            if (from >= 0 && to >= 0) {
                const moved = collection.splice(from, 1)[0];
                collection.splice(to, 0, moved);
                saveState();
                draggedTab.dataset.roomKind === 'animal' ? renderMice() : renderPlants();
                suppressClick = true;
            }
            target.classList.remove('is-drop-target');
        });
        document.addEventListener('dragend', function () {
            document.querySelectorAll('[data-room-tab]').forEach(function (tab) { tab.classList.remove('is-reordering', 'is-drop-target'); });
            draggedTab = null;
            window.setTimeout(function () { suppressClick = false; }, 0);
        });
        document.addEventListener('click', function (event) {
            if (suppressClick && event.target.closest('[data-room-tab]')) { event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false; }
        }, true);
    }

    function bindEvents() {
        bindDirectDragScroll();
        bindRoomLayoutDrag();
        bindColdStorageBoxDrag();
        bindColdStorageRackDrag();
        bindRoomTabReorder();
        document.addEventListener('click', function (event) {
            if (event.target.closest('[data-open-sync]')) {
                const syncControl = document.getElementById('syncControl');
                if (syncControl) syncControl.click();
                return;
            }
            const mutationTarget = event.target.closest('[data-add], [data-animal-position], [data-plant-position], [data-add-animal-to-cage], [data-edit-animal-room], [data-edit-plant-room], [data-edit-cold-storage], [data-edit-cold-storage-level], [data-delete-animal-rack], [data-delete-plant-rack], [data-delete-animal-cage], [data-delete-task], [data-edit-task], [data-add-result-for], [data-edit-result], [data-delete-result], [data-remove-result-attachment], [data-task-check], [data-start-scheduled-experiment], [data-scan-freezer], [data-start-scan-intake], [data-sample-position], [data-add-reagent-row], [data-remove-reagent-row], [data-add-formulation-component], [data-remove-formulation-component], [data-add-experiment-reagent], [data-remove-experiment-reagent], [data-edit-record], [data-delete-record], [data-confirm-delete], [data-run-action], [data-run-timer], [data-run-calculate], [data-calc-token], [data-calc-action], [data-toggle-run-calculator], [data-save-lineage-from], [data-delete-embedded-lineage], [data-clear-apparatus], [data-remove-run-photo], [data-add-passage], [data-open-clear-workspace], [data-confirm-clear-workspace]');
            if (mutationTarget && denyReadOnlyMutation(event)) return;

            const nav = event.target.closest('[data-view]');
            if (nav) {
                switchView(nav.dataset.view);
                closeSidebar();
                return;
            }

            const target = event.target.closest('[data-view-target]');
            if (target) {
                switchView(target.dataset.viewTarget);
                return;
            }

            const workspaceModeButton = event.target.closest('[data-workspace-mode]');
            if (workspaceModeButton) {
                setWorkspaceMode(workspaceModeButton.dataset.workspaceMode);
                return;
            }

            const biologyTab = event.target.closest('[data-biology-tab]');
            if (biologyTab) {
                setBiologyTab(biologyTab.dataset.biologyTab);
                return;
            }
            const bioinfoTab = event.target.closest('[data-bioinfo-tab]');
            if (bioinfoTab) { setBioinfoTab(bioinfoTab.dataset.bioinfoTab); return; }
            const bioFolderHome = event.target.closest('[data-bio-folder-home]');
            if (bioFolderHome) {
                activeBioinfoTab = 'projects';
                activeBioProjectId = '';
                activeBioDatasetId = '';
                localStorage.setItem('rhineLabBioinfoTab', activeBioinfoTab);
                localStorage.setItem('rhineLabActiveBioProject', activeBioProjectId);
                localStorage.setItem('rhineLabActiveBioDataset', activeBioDatasetId);
                renderBioinformatics();
                return;
            }
            const bioProjectToggle = event.target.closest('[data-bio-project-toggle]');
            if (bioProjectToggle) {
                const nextId = bioProjectToggle.dataset.bioProjectToggle;
                activeBioProjectId = activeBioProjectId === nextId ? '' : nextId;
                if (!activeBioProjectId) activeBioDatasetId = '';
                localStorage.setItem('rhineLabActiveBioProject', activeBioProjectId);
                localStorage.setItem('rhineLabActiveBioDataset', activeBioDatasetId);
                renderBioinformatics();
                return;
            }
            const bioDatasetToggle = event.target.closest('[data-bio-dataset-toggle]');
            if (bioDatasetToggle) {
                const nextId = bioDatasetToggle.dataset.bioDatasetToggle;
                activeBioDatasetId = activeBioDatasetId === nextId ? '' : nextId;
                localStorage.setItem('rhineLabActiveBioDataset', activeBioDatasetId);
                renderBioinformatics();
                return;
            }
            const bioresourceFilterButton = event.target.closest('[data-bioresource-filter]');
            if (bioresourceFilterButton) {
                bioresourceFilter = bioresourceFilterButton.dataset.bioresourceFilter;
                updateActiveFilter(document.getElementById('bioresourceFilters'), bioresourceFilterButton);
                renderBioResources();
                return;
            }
            const protocolTab = event.target.closest('[data-protocol-tab]');
            if (protocolTab) {
                setProtocolTab(protocolTab.dataset.protocolTab);
                return;
            }
            const add = event.target.closest('[data-add]');
            if (add) {
                if (add.dataset.bioProjectContext) {
                    activeBioProjectId = add.dataset.bioProjectContext;
                    localStorage.setItem('rhineLabActiveBioProject', activeBioProjectId);
                }
                if (add.dataset.bioDatasetContext) {
                    activeBioDatasetId = add.dataset.bioDatasetContext;
                    localStorage.setItem('rhineLabActiveBioDataset', activeBioDatasetId);
                }
                if (add.dataset.add === 'freezer') {
                    pendingFreezerDefaults = {
                        storageUnitId: add.dataset.storageUnit || activeColdStorageId,
                        shelf: add.dataset.storageShelf || activeColdStorageShelf,
                        storageRack: add.dataset.storageRack || 1,
                        storageRow: add.dataset.storageRow || '',
                        storageColumn: add.dataset.storageColumn || ''
                    };
                }
                openEntryDialog(add.dataset.add);
                return;
            }

            const addResult = event.target.closest('[data-add-result-for]');
            if (addResult) {
                pendingResultExperimentId = addResult.dataset.addResultFor;
                openEntryDialog('result');
                return;
            }

            const editResult = event.target.closest('[data-edit-result]');
            if (editResult) {
                const result = state.results.find(item => item.id === editResult.dataset.editResult);
                if (result) openEntryDialog('result', { edit: true, key: result.id, record: result });
                return;
            }

            const deleteResult = event.target.closest('[data-delete-result]');
            if (deleteResult) {
                const result = state.results.find(item => item.id === deleteResult.dataset.deleteResult);
                if (!result) return;
                const experiment = state.experiments.find(item => item.id === result.experimentId);
                pendingDeleteRecord = { type: 'result', key: result.id, label: experiment ? experiment.title : result.id };
                els.deleteRecordName.textContent = interfaceText('实验结果') + ' “' + pendingDeleteRecord.label + '”';
                els.deleteConfirmDialog.showModal();
                return;
            }

            const removeResultAttachment = event.target.closest('[data-remove-result-attachment]');
            if (removeResultAttachment) {
                pendingResultAttachments = pendingResultAttachments.filter(item => item.id !== removeResultAttachment.dataset.removeResultAttachment);
                renderPendingResultAttachments();
                return;
            }

            const addFormulationComponent = event.target.closest('[data-add-formulation-component]');
            if (addFormulationComponent) {
                const rows = document.getElementById('formulationComponentRows');
                const empty = rows && rows.querySelector('[data-empty-formulation-components]');
                if (empty) empty.remove();
                if (rows) rows.insertAdjacentHTML('beforeend', formulationComponentRowHtml());
                return;
            }

            const removeFormulationComponent = event.target.closest('[data-remove-formulation-component]');
            if (removeFormulationComponent) {
                const row = removeFormulationComponent.closest('.formulation-component-row');
                if (row) row.remove();
                return;
            }
            const addReagentRow = event.target.closest('[data-add-reagent-row]');
            if (addReagentRow) {
                const rows = document.getElementById('protocolReagentRows');
                const empty = rows.querySelector('[data-empty-protocol-reagents]');
                if (empty) empty.remove();
                rows.insertAdjacentHTML('beforeend', reagentUsageRowHtml());
                return;
            }

            const removeReagentRow = event.target.closest('[data-remove-reagent-row]');
            if (removeReagentRow) {
                const row = removeReagentRow.closest('.protocol-reagent-row');
                if (row) row.remove();
                return;
            }

            const addExperimentReagent = event.target.closest('[data-add-experiment-reagent]');
            if (addExperimentReagent) {
                const empty = els.experimentUsageRows.querySelector('.experiment-usage-empty');
                if (empty) empty.remove();
                els.experimentUsageRows.insertAdjacentHTML('beforeend', experimentReagentRowHtml());
                updateExperimentUsageSource();
                return;
            }

            const removeExperimentReagent = event.target.closest('[data-remove-experiment-reagent]');
            if (removeExperimentReagent) {
                const row = removeExperimentReagent.closest('.experiment-reagent-row');
                if (row) row.remove();
                updateExperimentUsageSource();
                return;
            }

            const experimentCard = event.target.closest('[data-experiment-id]');
            if (experimentCard) {
                openExperimentDetail(experimentCard.dataset.experimentId);
                return;
            }

            const protocolCard = event.target.closest('[data-protocol-id]');
            if (protocolCard) {
                openProtocolDetail(protocolCard.dataset.protocolId);
                return;
            }
            const formulationCard = event.target.closest('[data-formulation-id]');
            if (formulationCard) {
                openFormulationDetail(formulationCard.dataset.formulationId);
                return;
            }

            const animalRecord = event.target.closest('[data-mouse-id]');
            if (animalRecord) {
                openAnimalDetail(animalRecord.dataset.mouseId);
                return;
            }

            const plantRecord = event.target.closest('[data-plant-id]');
            if (plantRecord) { selectedPlantId = plantRecord.dataset.plantId; openPlantDetail(plantRecord.dataset.plantId); return; }
            const plantPosition = event.target.closest('[data-plant-position]');
            if (plantPosition) { pendingPlantDefaults = { rackId: activePlantRackId, position: plantPosition.dataset.plantPosition }; openEntryDialog('plant'); return; }
            const bioresourceRecord = event.target.closest('[data-bioresource-id]');
            if (bioresourceRecord) {
                if (bioresourceRecord.dataset.bioresourceType === 'microbe') openMicrobeDetail(bioresourceRecord.dataset.bioresourceId);
                else openPlasmidDetail(bioresourceRecord.dataset.bioresourceId);
                return;
            }
            const virusRecord = event.target.closest('[data-virus-id]');
            if (virusRecord) { openVirusDetail(virusRecord.dataset.virusId); return; }
            const deleteRack = event.target.closest('[data-delete-animal-rack]');
            if (deleteRack) {
                requestRecordDelete('animalRack', deleteRack.dataset.deleteAnimalRack);
                return;
            }

            const deletePlantRack = event.target.closest('[data-delete-plant-rack]');
            if (deletePlantRack) { requestRecordDelete('plantRack', deletePlantRack.dataset.deletePlantRack); return; }

            const deleteCage = event.target.closest('[data-delete-animal-cage]');
            if (deleteCage) {
                requestRecordDelete('animalCage', deleteCage.dataset.deleteAnimalCage);
                return;
            }

            const editTask = event.target.closest('[data-edit-task]');
            if (editTask) {
                const task = state.schedule.find(item => item.id === editTask.dataset.editTask);
                if (task) openEntryDialog('task', { edit: true, key: task.id, record: task });
                return;
            }

            const deleteTask = event.target.closest('[data-delete-task]');
            if (deleteTask) {
                requestRecordDelete('task', deleteTask.dataset.deleteTask);
                return;
            }

            const editAnimalRoom = event.target.closest('[data-edit-animal-room]');
            if (editAnimalRoom) {
                const room = state.animalRooms.find(function (item) { return item.id === editAnimalRoom.dataset.editAnimalRoom; });
                if (room) openEntryDialog('animalRoom', { edit: true, key: room.id, record: room });
                return;
            }
            const editPlantRoom = event.target.closest('[data-edit-plant-room]');
            if (editPlantRoom) {
                const room = state.plantRooms.find(function (item) { return item.id === editPlantRoom.dataset.editPlantRoom; });
                if (room) openEntryDialog('plantRoom', { edit: true, key: room.id, record: room });
                return;
            }

            const animalRoom = event.target.closest('[data-animal-room]');
            if (animalRoom) {
                const roomId = animalRoom.dataset.animalRoom;
                zoomedAnimalRoomId = roomId === activeAnimalRoomId && zoomedAnimalRoomId === roomId ? '' : roomId;
                selectAnimalRoom(roomId);
                return;
            }

            const plantRoom = event.target.closest('[data-plant-room]');
            if (plantRoom) {
                const roomId = plantRoom.dataset.plantRoom;
                zoomedPlantRoomId = roomId === activePlantRoomId && zoomedPlantRoomId === roomId ? '' : roomId;
                selectPlantRoom(roomId);
                return;
            }

            const animalRack = event.target.closest('[data-animal-rack]');
            if (animalRack) {
                selectAnimalRack(animalRack.dataset.animalRack);
                return;
            }

            const plantRack = event.target.closest('[data-plant-rack]');
            if (plantRack) { selectPlantRack(plantRack.dataset.plantRack); return; }

            const animalCage = event.target.closest('[data-animal-cage]');
            if (animalCage) {
                selectAnimalCage(animalCage.dataset.animalCage);
                return;
            }

            const animalPosition = event.target.closest('[data-animal-position]');
            if (animalPosition) {
                pendingAnimalCageDefaults = { rackId: activeAnimalRackId, position: animalPosition.dataset.animalPosition };
                openEntryDialog('animalCage');
                return;
            }

            if (event.target.closest('[data-add-animal-to-cage]')) {
                if (!selectedAnimalCageId) {
                    showToast('请先选择或新建一个笼位');
                    return;
                }
                openEntryDialog('mouse');
                return;
            }

            const bioinfoRecord = event.target.closest('[data-bioinfo-record]');
            if (bioinfoRecord) { openRecordDetail(bioinfoRecord.dataset.bioinfoType, bioinfoRecord.dataset.bioinfoRecord); return; }

            const reagentRecord = event.target.closest('[data-reagent-catalog]');
            if (reagentRecord) {
                openReagentDetail(reagentRecord.dataset.reagentCatalog);
                return;
            }

            const cellRecord = event.target.closest('[data-cell-id]');
            if (cellRecord) {
                openCellDetail(cellRecord.dataset.cellId);
                return;
            }

            if (event.target.closest('[data-add-passage]')) {
                if (!activeCellId) return;
                els.recordDetailDialog.close();
                openEntryDialog('passage');
                return;
            }

            const calendarModeButton = event.target.closest('[data-calendar-mode]');
            if (calendarModeButton) {
                setCalendarMode(calendarModeButton.dataset.calendarMode);
                return;
            }

            const calendarNav = event.target.closest('[data-calendar-nav]');
            if (calendarNav) {
                navigateCalendar(calendarNav.dataset.calendarNav);
                return;
            }

            const calendarDay = event.target.closest('[data-calendar-date]');
            if (calendarDay) {
                calendarDate = parseLocalDate(calendarDay.dataset.calendarDate);
                setCalendarMode('day');
                return;
            }

            const taskCheck = event.target.closest('[data-task-check]');
            if (taskCheck) {
                toggleTask(taskCheck.dataset.taskCheck);
                return;
            }

            const scheduledExperiment = event.target.closest('[data-start-scheduled-experiment]');
            if (scheduledExperiment) {
                startScheduledExperiment(scheduledExperiment.dataset.startScheduledExperiment);
                return;
            }

            if (event.target.closest('[data-edit-cold-storage]')) {
                const unit = state.coldStorageUnits.find(item => item.id === activeColdStorageId);
                if (unit) openEntryDialog('coldStorage', { edit: true, key: unit.id, record: unit });
                return;
            }

            if (event.target.closest('[data-edit-cold-storage-level]')) {
                editingColdStorageLevel = activeColdStorageShelf;
                openEntryDialog('coldStorageLevel');
                return;
            }

            const freezerBoxTab = event.target.closest('[data-freezer-box]');
            if (freezerBoxTab) {
                selectFreezerBox(freezerBoxTab.dataset.freezerBox);
                return;
            }

            const coldStorageTab = event.target.closest('[data-cold-storage]');
            if (coldStorageTab) {
                activeColdStorageId = coldStorageTab.dataset.coldStorage;
                activeColdStorageShelf = 1;
                selectedSampleId = '';
                renderSamples();
                return;
            }

            const coldStorageShelf = event.target.closest('[data-cold-storage-shelf]');
            if (coldStorageShelf) {
                activeColdStorageShelf = Math.max(1, Number(coldStorageShelf.dataset.coldStorageShelf) || 1);
                selectedSampleId = '';
                renderSamples();
                return;
            }

            if (event.target.closest('[data-scan-freezer]')) {
                openFreezerScan();
                return;
            }

            const scanPosition = event.target.closest('[data-scan-position]');
            if (scanPosition && !scanPosition.disabled) {
                const position = scanPosition.dataset.scanPosition;
                if (freezerScanDetected.has(position)) freezerScanDetected.delete(position);
                else freezerScanDetected.add(position);
                renderFreezerScanGrid();
                return;
            }

            const clearPhoto = event.target.closest('[data-clear-photo]');
            if (clearPhoto) {
                const capture = clearPhoto.closest('.photo-capture');
                capture.querySelector('input[type="file"]').value = '';
                capture.querySelector('input[type="hidden"]').value = '';
                capture.querySelector('[data-photo-preview]').innerHTML = '<span>尚未选择照片</span>';
                pendingPhotoData = '';
                return;
            }

            if (event.target.closest('[data-start-scan-intake]')) {
                startScannedSampleIntake();
                return;
            }

            const sampleCell = event.target.closest('[data-sample-id]');
            if (sampleCell) {
                const isCatalogRow = Boolean(sampleCell.closest('#sampleTable'));
                selectedSampleId = sampleCell.dataset.sampleId;
                const sample = state.samples.find(item => item.id === selectedSampleId);
                if (sample && sample.boxId) {
                    activeFreezerBoxId = sample.boxId;
                    localStorage.setItem('rhineLabActiveFreezerBox', sample.boxId);
                }
                renderSamples();
                if (isCatalogRow) openSampleDetail(selectedSampleId);
                return;
            }

            if (event.target.closest('[data-open-sample-detail]')) {
                if (selectedSampleId) openSampleDetail(selectedSampleId);
                return;
            }

            const emptySampleCell = event.target.closest('[data-sample-position]');
            if (emptySampleCell) {
                const position = emptySampleCell.dataset.samplePosition;
                pendingSampleDefaults = {
                    boxId: activeFreezerBoxId,
                    position: position,
                    date: todayIso(),
                    status: '在库'
                };
                openEntryDialog('sample');
                return;
            }

            if (event.target.closest('[data-close-dialog]')) {
                els.entryDialog.close();
                editingRecord = null;
                pendingResultExperimentId = '';
                pendingResultAttachments = [];
                if (activeDialogType === 'sample' && sampleIntakeQueue.length) {
                    sampleIntakeQueue = [];
                    showToast('已暂停照片识别后的批量录入');
                }
                return;
            }

            if (event.target.closest('[data-close-protocol]')) {
                els.protocolDetailDialog.close();
                return;
            }

            if (event.target.closest('[data-close-experiment]')) {
                els.experimentDetailDialog.close();
                return;
            }

            if (event.target.closest('[data-close-run]')) {
                persistRunWorkspaceInputs();
                els.experimentRunDialog.close();
                activeRunExperimentId = '';
                return;
            }

            const runStep = event.target.closest('[data-run-step]');
            if (runStep) {
                selectRunStep(Number(runStep.dataset.runStep));
                return;
            }

            const runAction = event.target.closest('[data-run-action]');
            if (runAction) {
                handleRunAction(runAction.dataset.runAction);
                return;
            }

            const runTimer = event.target.closest('[data-run-timer]');
            if (runTimer) {
                handleRunTimer(runTimer.dataset.runTimer);
                return;
            }

            if (event.target.closest('[data-toggle-run-calculator]')) {
                const context = currentRunContext();
                if (context) context.stepState.calculator.visible = !context.stepState.calculator.visible;
                saveState();
                renderExperimentRun();
                return;
            }

            if (event.target.closest('[data-run-calculate]')) {
                calculateRunExpression();
                return;
            }

            const calculatorToken = event.target.closest('[data-calc-token]');
            if (calculatorToken) {
                insertCalculatorToken(calculatorToken.dataset.calcToken);
                return;
            }

            const calculatorAction = event.target.closest('[data-calc-action]');
            if (calculatorAction) {
                handleCalculatorAction(calculatorAction.dataset.calcAction);
                return;
            }

            const removeRunPhoto = event.target.closest('[data-remove-run-photo]');
            if (removeRunPhoto) {
                removeRunStepPhoto(removeRunPhoto.dataset.removeRunPhoto);
                return;
            }

            if (event.target.closest('[data-clear-apparatus]')) {
                clearApparatusMarks();
                return;
            }

            if (event.target.closest('[data-close-record-detail]')) {
                els.recordDetailDialog.close();
                activeRecordDetail = null;
                return;
            }

            if (event.target.closest('[data-edit-record]')) {
                startRecordEdit();
                return;
            }

            if (event.target.closest('[data-delete-record]')) {
                deleteActiveRecord();
                return;
            }

            if (event.target.closest('[data-close-delete]')) {
                els.deleteConfirmDialog.close();
                pendingDeleteRecord = null;
                return;
            }

            if (event.target.closest('[data-confirm-delete]')) {
                confirmDeleteRecord();
                return;
            }

            if (event.target.closest('[data-open-clear-workspace]')) {
                openClearWorkspaceDialog();
                return;
            }

            if (event.target.closest('[data-close-clear-workspace]')) {
                els.clearWorkspaceDialog.close();
                els.clearWorkspacePhrase.value = '';
                els.confirmClearWorkspace.disabled = true;
                return;
            }

            if (event.target.closest('[data-close-end-day]')) {
                els.endDayDialog.close();
                return;
            }

            if (event.target.closest('[data-confirm-clear-workspace]')) {
                clearCurrentWorkspace();
                return;
            }

            if (event.target.closest('[data-close-scan]')) {
                els.freezerScanDialog.close();
                return;
            }

            if (event.target.closest('[data-close-search]') || event.target.classList.contains('search-backdrop')) {
                closeSearch();
                return;
            }

            const searchResult = event.target.closest('[data-result-view]');
            if (searchResult) {
                navigateToSearchResult(searchResult);
                return;
            }

            const notification = event.target.closest('[data-notification-view]');
            if (notification) {
                markNotificationRead(notification);
                switchView(notification.dataset.notificationView);
                closeNotifications();
                showToast('已打开相关记录');
                return;
            }

            const rowAction = event.target.closest('[data-row-label]');
            if (rowAction) {
                showToast(rowAction.dataset.rowLabel + ' · 记录信息已核对');
            }
        });

        if (els.utilityNavToggle && els.utilityNav) {
            els.utilityNavToggle.addEventListener('click', function (event) {
                event.stopPropagation();
                const open = els.utilityNav.hidden;
                if (open) closeNotifications();
                setUtilityNav(open);
            });
            els.utilityNav.addEventListener('click', function (event) {
                if (event.target.closest('a, button')) window.setTimeout(function () { setUtilityNav(false); }, 0);
            });
        }

        document.getElementById('themeToggle').addEventListener('click', function () {
            const nextTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
            localStorage.setItem('rhineLabTheme', nextTheme);
            applyTheme(nextTheme);
        });

        const backgroundToggle = document.getElementById('backgroundToggle');
        if (backgroundToggle) backgroundToggle.addEventListener('click', function () {
            const current = currentBackground();
            const next = current === 'default' ? 'all-lives' : 'default';
            applyBackground(next);
        });

        els.menuToggle.addEventListener('click', function () {
            const open = document.body.classList.toggle('sidebar-open');
            els.menuToggle.setAttribute('aria-expanded', String(open));
        });
        els.mobileScrim.addEventListener('click', closeSidebar);

        els.notificationToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            setUtilityNav(false);
            if (els.notificationPanel.hidden) {
                openNotifications();
            } else {
                closeNotifications();
            }
        });
        els.notificationClose.addEventListener('click', closeNotifications);
        els.markAllRead.addEventListener('click', function () {
            document.querySelectorAll('[data-notification-id]').forEach(markNotificationRead);
            showToast('全部通知已标记为已读');
        });

        document.addEventListener('click', function (event) {
            if (els.utilityNav && !els.utilityNav.hidden && !event.target.closest('#utilityNav') && !event.target.closest('#utilityNavToggle')) {
                setUtilityNav(false);
            }
            if (!els.notificationPanel.hidden && !event.target.closest('#notificationPanel') && !event.target.closest('#notificationToggle')) {
                closeNotifications();
            }
        });

        els.globalSearch.addEventListener('focus', function () {
            openSearch(els.globalSearch.value);
        });
        els.globalSearch.addEventListener('input', function () {
            openSearch(els.globalSearch.value);
        });
        els.overlaySearchInput.addEventListener('input', function () {
            els.globalSearch.value = els.overlaySearchInput.value;
            renderSearchResults(els.overlaySearchInput.value);
        });

        document.addEventListener('keydown', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                openSearch('');
            }
            if (event.key === 'Escape' && els.utilityNav && !els.utilityNav.hidden) setUtilityNav(false);
            if (event.key === 'Escape' && !els.searchOverlay.hidden) closeSearch();
            if (event.key === 'Escape' && !els.notificationPanel.hidden) closeNotifications();
            if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-mouse-id], [data-reagent-catalog], #sampleTable [data-sample-id], [data-cell-id], [data-plant-id], [data-bioresource-id], [data-virus-id], [data-bioinfo-record]')) {
                event.preventDefault();
                if (event.target.dataset.mouseId) openAnimalDetail(event.target.dataset.mouseId);
                if (event.target.dataset.reagentCatalog) openReagentDetail(event.target.dataset.reagentCatalog);
                if (event.target.dataset.sampleId) openSampleDetail(event.target.dataset.sampleId);
                if (event.target.dataset.cellId) openCellDetail(event.target.dataset.cellId);
                if (event.target.dataset.plantId) openPlantDetail(event.target.dataset.plantId);
                if (event.target.dataset.bioresourceId && event.target.dataset.bioresourceType === 'microbe') openMicrobeDetail(event.target.dataset.bioresourceId);
                if (event.target.dataset.bioresourceId && event.target.dataset.bioresourceType === 'plasmid') openPlasmidDetail(event.target.dataset.bioresourceId);
                if (event.target.dataset.virusId) openVirusDetail(event.target.dataset.virusId);
                if (event.target.dataset.bioinfoRecord) openRecordDetail(event.target.dataset.bioinfoType, event.target.dataset.bioinfoRecord);
            }
        });

        document.getElementById('experimentSearch').addEventListener('input', renderExperiments);
        document.getElementById('mouseSearch').addEventListener('input', renderMice);
        document.getElementById('plantSearch').addEventListener('input', renderPlants);
        document.getElementById('bioresourceSearch').addEventListener('input', renderBioResources);
        document.getElementById('virusSearch').addEventListener('input', renderViruses);
        ['bioProjectSearch'].forEach(function (id) { const field = document.getElementById(id); if (field) field.addEventListener('input', renderBioinformatics); });
        document.getElementById('reagentSearch').addEventListener('input', renderReagents);
        document.getElementById('sampleSearch').addEventListener('input', renderSamples);
        document.getElementById('cellSearch').addEventListener('input', renderCellCultures);
        els.clearWorkspacePhrase.addEventListener('input', function () {
            els.confirmClearWorkspace.disabled = els.clearWorkspacePhrase.value.trim().toUpperCase() !== 'CLEAR';
        });

        document.getElementById('experimentFilters').addEventListener('click', function (event) {
            const button = event.target.closest('[data-filter]');
            if (!button) return;
            experimentFilter = button.dataset.filter;
            updateActiveFilter(event.currentTarget, button);
            renderExperiments();
        });


        document.getElementById('reagentFilters').addEventListener('click', function (event) {
            const button = event.target.closest('[data-filter]');
            if (!button) return;
            reagentFilter = button.dataset.filter;
            updateActiveFilter(event.currentTarget, button);
            renderReagents();
        });

        els.entryForm.addEventListener('submit', function (event) { event.preventDefault(); });
        els.entrySubmitButton.addEventListener('click', saveEntryFromDialog);
        els.entryForm.addEventListener('change', function (event) {
            if (event.target.matches('[data-result-attachments]')) {
                prepareResultAttachments(event.target);
                return;
            }
            if (event.target.matches('[data-photo-capture]')) {
                preparePhotoAttachment(event.target);
                return;
            }
            if (event.target.matches('[data-custom-select]')) {
                toggleCustomSelectInput(event.target, '', true);
                return;
            }
            if (event.target.name === 'protocolId' && event.target.value) {
                const titleInput = els.entryForm.elements.namedItem('title');
                const protocol = state.protocols.find(item => item.id === event.target.value);
                if (titleInput && protocol && !titleInput.value.trim()) titleInput.value = protocol.title;
            }
            if (event.target.name === 'experimentId' && event.target.value) {
                const experiment = state.experiments.find(item => item.id === event.target.value);
                if (!experiment) return;
                if (activeDialogType === 'result') {
                    const dateInput = els.entryForm.elements.namedItem('date');
                    if (dateInput) dateInput.value = experiment.date || todayIso();
                    return;
                }
                const titleInput = els.entryForm.elements.namedItem('title');
                const protocolInput = els.entryForm.elements.namedItem('protocolId');
                if (titleInput && !titleInput.value.trim()) titleInput.value = experiment.title;
                if (protocolInput && experiment.protocolId) protocolInput.value = experiment.protocolId;
            }
        });
        els.experimentDetailForm.addEventListener('submit', function (event) { event.preventDefault(); });
        els.experimentDetailSubmitButton.addEventListener('click', saveExperimentDetail);
        els.experimentDetailProtocol.addEventListener('change', function () {
            applyProtocolDefaultsToExperimentEditor(els.experimentDetailProtocol.value);
        });
        els.experimentDetailStatus.addEventListener('change', function () {
            toggleCustomSelectInput(els.experimentDetailStatus, '', true);
        });
        els.experimentUsageRows.addEventListener('input', updateExperimentUsageSource);
        els.experimentUsageRows.addEventListener('change', updateExperimentUsageSource);
        els.experimentRunBody.addEventListener('input', handleRunWorkspaceInput);
        els.experimentRunBody.addEventListener('change', handleRunWorkspaceChange);
        els.freezerScanInput.addEventListener('change', handleFreezerScanImage);
        els.freezerScanSensitivity.addEventListener('input', applyFreezerScanSensitivity);
        els.monthAgendaAdd.addEventListener('click', function () {
            if (denyReadOnlyMutation()) return;
            pendingTaskDefaults = { date: toIsoDate(calendarDate), time: '', end: '' };
            openEntryDialog('task');
        });
        els.editProtocolButton.addEventListener('click', function () {
            if (denyReadOnlyMutation()) return;
            const protocol = state.protocols.find(item => item.id === activeProtocolId);
            if (!protocol) return;
            els.protocolDetailDialog.close();
            openEntryDialog('protocol', { edit: true, key: protocol.id, record: protocol });
        });
        els.editExperimentButton.addEventListener('click', function () {
            if (denyReadOnlyMutation()) return;
            const experiment = state.experiments.find(item => item.id === activeExperimentId);
            if (!experiment) return;
            els.experimentDetailDialog.close();
            openEntryDialog('experiment', { edit: true, key: experiment.id, record: experiment });
        });
        els.scheduleProtocolButton.addEventListener('click', function () {
            if (denyReadOnlyMutation()) return;
            const protocol = state.protocols.find(item => item.id === activeProtocolId);
            if (!protocol) return;
            els.protocolDetailDialog.close();
            pendingTaskDefaults = { date: toIsoDate(calendarDate), time: '09:00', end: '10:00', title: protocol.title, protocolId: protocol.id };
            openEntryDialog('task');
        });
        els.endDayButton.addEventListener('click', openEndDayDialog);

        document.getElementById('dayTimeline').addEventListener('pointerdown', beginScheduleDrag);
        document.getElementById('dayTimeline').addEventListener('pointermove', updateScheduleDrag);
        document.addEventListener('pointerup', finishScheduleDrag);
        window.addEventListener('hashchange', function () {
            switchView(getInitialView(), false);
        });
    }

    function denyReadOnlyMutation(event) {
        if (!workspaceReadOnly) return false;
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        showToast(publicDemoMode && !workspaceAccess.authenticated ? '公开网页仅供展示；请先登录再修改' : 'LAB 共用页面为只读；请切换到个人工作区录入');
        return true;
    }

    function closeSidebar() {
        document.body.classList.remove('sidebar-open');
        els.menuToggle.setAttribute('aria-expanded', 'false');
    }

    function openEndDayDialog() {
        if (denyReadOnlyMutation()) return;
        const today = todayIso();
        const todaysTasks = state.schedule.filter(function (task) { return task.date === today; });
        const pendingTasks = todaysTasks.filter(function (task) { return !task.done; });
        pendingTasks.forEach(function (task) { task.done = true; });
        if (pendingTasks.length) {
            addActivity('结束今日工作并完成 ' + pendingTasks.length + ' 项日程');
            saveState();
            renderSchedule();
        }
        if (!todaysTasks.length) {
            els.endDaySummary.textContent = '今天没有待处理的日程。记录已妥善保存，明天再继续向前。';
        } else if (pendingTasks.length) {
            els.endDaySummary.textContent = '已自动完成今天剩余的 ' + pendingTasks.length + ' 项日程，共 ' + todaysTasks.length + ' 项。点击日程勾选按钮仍可取消完成。';
        } else {
            els.endDaySummary.textContent = '今天的 ' + todaysTasks.length + ' 项日程均已完成。点击日程勾选按钮仍可取消完成。';
        }
        els.endDayDialog.classList.remove('celebrate');
        els.endDayDialog.showModal();
        void els.endDayDialog.offsetWidth;
        els.endDayDialog.classList.add('celebrate');
    }

    function openNotifications() {
        els.notificationPanel.hidden = false;
        els.notificationToggle.setAttribute('aria-expanded', 'true');
        els.notificationClose.focus();
    }

    function closeNotifications() {
        els.notificationPanel.hidden = true;
        els.notificationToggle.setAttribute('aria-expanded', 'false');
    }

    function getReadNotificationIds() {
        try {
            const ids = JSON.parse(localStorage.getItem('rhineLabReadNotifications'));
            return Array.isArray(ids) ? ids : [];
        } catch (error) {
            return [];
        }
    }

    function applyNotificationState() {
        const readIds = new Set(getReadNotificationIds());
        const suppressSeedNotifications = Number(state.exampleSeedVersion) >= 999;
        document.querySelectorAll('[data-notification-id]').forEach(function (item) {
            item.hidden = suppressSeedNotifications;
            item.classList.toggle('unread', !suppressSeedNotifications && !readIds.has(item.dataset.notificationId));
        });
        updateNotificationCount();
    }

    function markNotificationRead(item) {
        if (!item || !item.dataset.notificationId) return;
        const readIds = new Set(getReadNotificationIds());
        readIds.add(item.dataset.notificationId);
        localStorage.setItem('rhineLabReadNotifications', JSON.stringify(Array.from(readIds)));
        item.classList.remove('unread');
        updateNotificationCount();
    }

    function updateNotificationCount() {
        const count = document.querySelectorAll('[data-notification-id].unread:not([hidden])').length;
        els.noticeCount.textContent = count ? String(count) : '';
        els.notificationToggle.classList.toggle('is-read', count === 0);
        if (els.markAllRead) els.markAllRead.disabled = count === 0;
        els.notificationToggle.setAttribute('aria-label', count ? '打开通知，' + count + ' 条未读' : '打开通知，没有未读消息');
    }

    function updateActiveFilter(container, activeButton) {
        container.querySelectorAll('button').forEach(function (button) {
            button.classList.toggle('active', button === activeButton);
        });
    }

    function switchView(view, updateHash = true) {
        if (view === 'results') view = 'experiments';
        const target = document.getElementById('view-' + view);
        if (!target) return;
        activeView = view;
        renderWorkspaceScope();
        renderView(view);
        document.querySelectorAll('.view').forEach(function (section) {
            section.classList.toggle('active', section === target);
        });
        document.querySelectorAll('.nav-item').forEach(function (button) {
            button.classList.toggle('active', button.dataset.view === view);
        });
        const translatedTitle = interfaceText(target.dataset.title);
        els.breadcrumb.textContent = translatedTitle;
        document.title = translatedTitle + ' · Rhine Lab';
        if (updateHash) history.pushState(null, '', '#' + view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderAll() {
        renderWorkspaceScope();
        renderView(activeView);
    }

    function renderView(view) {
        const renderers = {
            dashboard: renderDashboard,
            experiments: renderExperiments,
            mice: renderBiologyManagement,
            reagents: renderReagents,
            samples: renderSamples,
            protocols: renderProtocols,
            schedule: renderSchedule,
            cells: renderCellCultures,
            bioinformatics: renderBioinformatics
        };
        const renderer = renderers[view];
        if (renderer) renderer();
    }

    function renderDashboard() {
        const projects = state.experiments.filter(item => item.status !== '已完成').slice(0, 4);
        document.getElementById('dashboardProjects').innerHTML = projects.map(function (item, index) {
            return '<article class="project-row" data-view-target="experiments"><span class="project-code">P' + String(index + 1).padStart(2, '0') + '</span><div><h3>' + esc(item.title) + '</h3></div><div class="project-progress"><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status) + '</span><div class="progress-track"><i style="width:' + number(item.progress, 0, 100) + '%"></i></div><small>最近更新 ' + esc(shortDate(item.date)) + '</small></div><span class="project-percent">' + number(item.progress, 0, 100) + '%</span></article>';
        }).join('') || '<p class="search-empty">当前没有进行中的实验。</p>';

        const todayTasks = state.schedule.filter(item => item.date === todayIso()).sort(byTime);
        document.getElementById('dashboardSchedule').innerHTML = todayTasks.slice(0, 5).map(scheduleItemHtml).join('') || '<p class="search-empty">今天还没有安排任务。</p>';
        const pendingToday = todayTasks.filter(item => !item.done);
        const daySummary = document.getElementById('dashboardDaySummary');
        if (pendingToday.length) {
            const nextTimedTask = pendingToday.find(hasScheduleTime);
            daySummary.innerHTML = '今天有 <strong id="todayTaskCount">' + pendingToday.length + ' 项任务</strong> 等待处理' + (nextTimedTask ? '，下一项将在 <strong>' + esc(nextTimedTask.time) + '</strong> 开始。' : '。');
        } else {
            daySummary.innerHTML = '今天还没有待处理任务。可前往 <strong>日程排班</strong> 添加安排。';
        }

        const reagentAlerts = state.reagents.filter(item => getTheoreticalPercent(item) < 25 || item.status !== '正常').map(item => ({
            name: item.name,
            meta: item.catalog,
            category: '试剂',
            status: getReagentDisplayStatus(item),
            detail: item.location,
            view: 'reagents'
        }));
        const sampleAlerts = state.samples.filter(item => item.status !== '在库').map(item => ({
            name: item.id,
            meta: item.source,
            category: '样本',
            status: item.status,
            detail: item.location,
            view: 'samples'
        }));
        const alerts = reagentAlerts.concat(sampleAlerts).slice(0, 5);
        document.getElementById('dashboardAlerts').innerHTML = alerts.map(function (item) {
            return '<tr><td><strong>' + esc(item.name) + '</strong><small>' + esc(item.meta) + '</small></td><td>' + esc(item.category) + '</td><td><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status) + '</span></td><td>' + esc(item.detail) + '</td><td><button class="row-arrow" type="button" data-view-target="' + item.view + '" aria-label="查看">→</button></td></tr>';
        }).join('') || '<tr><td colspan="5">当前没有库存或样本预警。</td></tr>';

        document.getElementById('activityStream').innerHTML = state.activities.slice(0, 4).map(function (activity) {
            return '<div class="activity-item"><i></i><div><p>' + esc(activityDisplayText(activity.text)) + '</p><time>' + esc(activity.at ? formatHistoryTime(activity.at) : activity.time) + '</time></div></div>';
        }).join('');
    }

    function activityDisplayText(value) {
        return String(value || '').replace(/^[\u3400-\u9fff·]{2,6}(?=(更新|上传|登记|修改|完成|添加|创建|提交))/, '');
    }

    function renderExperiments() {
        const search = valueOf('experimentSearch').toLowerCase();
        const items = state.experiments.filter(function (item) {
            const result = state.results.find(entry => entry.experimentId === item.id);
            let matchesFilter = experimentFilter === '全部' || item.status === experimentFilter;
            if (experimentFilter === '有结果') matchesFilter = Boolean(result);
            if (experimentFilter === '待填写结果') matchesFilter = !result;
            const haystack = [item.id, item.title, item.project, item.createdBy, item.type, item.description, result && result.summary, result && result.conclusion, result && result.nextStep].join(' ').toLowerCase();
            return matchesFilter && haystack.includes(search);
        });
        const grouped = groupByDate(items);
        document.getElementById('experimentGrid').innerHTML = grouped.map(function (group) {
            return '<section class="experiment-day-group"><header class="experiment-day-head"><div><span>' + esc(formatDayHeading(group.date)) + '</span><small>' + group.items.length + ' 条记录</small></div><i></i></header><div class="record-grid">' + group.items.map(experimentCardHtml).join('') + '</div></section>';
        }).join('') || '<div class="empty-card">没有找到匹配的实验记录。</div>';
    }

    function experimentCardHtml(item) {
        const protocol = state.protocols.find(protocolItem => protocolItem.id === item.protocolId);
        const usage = getEffectiveExperimentUsage(item);
        const usageLabel = item.usageOverridden ? '本次用量已调整' : protocol ? '按 ' + protocol.id : '未关联 Protocol';
        const photoBadge = item.photoData ? '<span class="photo-badge">照片</span>' : '';
        const record = '<button class="record-card" type="button" data-experiment-id="' + esc(item.id) + '" data-code="' + esc(item.id.replace('RL-EXP-', '')) + '"><div class="record-card-top"><span class="micro-label">' + esc(item.id) + ' · ' + esc(item.type) + contributorInline(item) + '</span><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status) + '</span></div><h2>' + esc(item.title) + '</h2><div class="progress-track"><i style="width:' + number(item.progress, 0, 100) + '%"></i></div><div class="record-usage-line"><span>' + photoBadge + esc(usageLabel) + '</span><strong>' + usage.length + ' 种试剂 →</strong></div><div class="record-meta"><div><small>PROJECT</small><strong>' + esc(item.project) + '</strong></div><div><small>DATE</small><strong>' + esc(shortDate(item.date)) + '</strong></div></div></button>';
        return '<article class="experiment-record-entry">' + record + experimentResultInlineHtml(item, false) + '</article>';
    }

    function experimentResultInlineHtml(experiment, detailed) {
        const result = state.results.find(item => item.experimentId === experiment.id);
        if (!result) {
            return '<section class="experiment-inline-result pending"><header><div><p class="micro-label">EXPERIMENT RESULT</p><h3>实验结果</h3></div><span class="status-chip caution">待填写</span></header><button class="button primary compact" type="button" data-add-result-for="' + esc(experiment.id) + '">＋ 添加结果</button></section>';
        }
        if (!detailed) {
            return '<section class="experiment-inline-result pending"><header><div><p class="micro-label">EXPERIMENT RESULT</p><h3>实验结果</h3></div><span class="status-chip">已填写</span></header><button class="button ghost compact result-preview-action" type="button" data-edit-result="' + esc(result.id) + '"><span>已录入结果</span><b>修改结果</b></button></section>';
        }
        const attachments = result.attachments.slice(0, 6).map(resultAttachmentLinkHtml).join('');
        return '<section class="experiment-inline-result completed detailed"><header><div><p class="micro-label">EXPERIMENT RESULT · ' + esc(result.id) + '</p><h3>实验结果</h3></div><span class="status-chip">已填写</span></header><details class="result-date-accordion" open><summary><span>登记日期</span><strong>' + esc(result.date) + '</strong><b aria-hidden="true">⌄</b></summary><div class="result-date-content"><div class="result-conclusion"><small>主要结果</small><strong>' + esc(result.summary || '') + '</strong></div><div class="result-conclusion"><small>结论与解释</small><strong>' + esc(result.conclusion || '') + '</strong></div><div class="result-conclusion"><small>下一步</small><strong>' + esc(result.nextStep || '') + '</strong></div>' + (attachments ? '<div class="result-attachment-strip">' + attachments + '</div>' : '') + '<footer><span>' + result.attachments.length + ' 个附件</span><div><button class="button ghost compact" type="button" data-edit-result="' + esc(result.id) + '">修改结果</button><button class="result-delete-button" type="button" data-delete-result="' + esc(result.id) + '">删除</button></div></footer></div></details></section>';
    }

    function groupByDate(items) {
        const groups = new Map();
        items.slice().sort(function (left, right) {
            return String(right.date || '').localeCompare(String(left.date || '')) || String(right.id || '').localeCompare(String(left.id || ''));
        }).forEach(function (item) {
            const date = item.date || '未记录日期';
            if (!groups.has(date)) groups.set(date, []);
            groups.get(date).push(item);
        });
        return Array.from(groups, function (entry) { return { date: entry[0], items: entry[1] }; });
    }

    function formatDayHeading(value) {
        if (value === '未记录日期') return value;
        return new Intl.DateTimeFormat(interfaceLocale(), { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }).format(parseLocalDate(value));
    }

    function resultAttachmentLinkHtml(attachment) {
        const isImage = String(attachment.type || '').startsWith('image/');
        const attachmentUrl = /^(?:data:|https?:\/\/)/i.test(String(attachment.data || '')) ? attachment.data : '';
        const preview = isImage && attachmentUrl ? '<img loading="lazy" decoding="async" src="' + esc(attachmentUrl) + '" alt="' + esc(attachment.name) + '">' : '<span aria-hidden="true">FILE</span>';
        return '<a href="' + esc(attachmentUrl || '#') + '" download="' + esc(attachment.name) + '" title="' + esc(attachment.name) + '">' + preview + '<small>' + esc(attachment.name) + '</small></a>';
    }

    function renderMice() {
        const search = valueOf('mouseSearch').toLowerCase();
        const items = state.mice.filter(item => [item.id, item.species, item.strain, item.genotype, item.cage, item.status, item.ethics, item.line, item.parents, item.project, item.marker].join(' ').toLowerCase().includes(search));
        renderAnimalHousing();
        document.getElementById('mouseTable').innerHTML = items.map(function (item) {
            return '<tr class="clickable-data-row" data-mouse-id="' + esc(item.id) + '" tabindex="0" aria-label="查看动物 ' + esc(item.id) + ' 的详细信息"><td><strong>' + esc(item.id) + '</strong><small>ANIMAL RECORD' + contributorInline(item) + '</small></td><td><strong>' + esc(item.species || '未设置') + '</strong></td><td><strong>' + esc(item.strain || '未设置') + '</strong><small>' + esc(item.genotype || '基因型未填写') + '</small></td><td>' + esc(item.sex || '未确认') + '</td><td>' + esc(item.birth || '未填写') + '</td><td><strong>' + esc(item.cage || '未分配') + '</strong></td><td><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status || '在养') + '</span></td><td><button class="row-arrow" type="button" tabindex="-1" aria-hidden="true">→</button></td></tr>';
        }).join('') || '<tr><td colspan="8">暂无动物条目；请先建立笼架和笼位，再添加动物。</td></tr>';
    }

    function setBiologyTab(tab) {
        activeBiologyTab = ['animals', 'plants', 'microbes', 'viruses'].includes(tab) ? tab : 'animals';
        localStorage.setItem('rhineLabBiologyTab', activeBiologyTab);
        document.querySelectorAll('[data-biology-tab]').forEach(function (button) {
            const active = button.dataset.biologyTab === activeBiologyTab;
            button.classList.toggle('active', active);
            button.setAttribute('aria-selected', String(active));
        });
        document.querySelectorAll('[data-biology-panel]').forEach(function (panel) {
            const active = panel.dataset.biologyPanel === activeBiologyTab;
            panel.hidden = !active;
            panel.classList.toggle('active', active);
        });
        if (activeBiologyTab === 'animals') renderMice();
        else if (activeBiologyTab === 'plants') renderPlants();
        else if (activeBiologyTab === 'microbes') renderBioResources();
        else renderViruses();
    }

    function renderBiologyManagement() {
        setBiologyTab(activeBiologyTab);
    }

    function renderPlants() {
        const table = document.getElementById('plantTable');
        if (!table) return;
        renderPlantHousing();
        const search = valueOf('plantSearch').toLowerCase();
        const items = state.plants.filter(function (item) {
            const rack = state.plantRacks.find(function (entry) { return entry.id === item.rackId; });
            return [item.id,item.name,item.scientificName,item.materialType,item.accession,item.generation,item.genotype,item.growthStage,item.growthConditions,item.location,item.position,rack && rack.name,item.status].join(' ').toLowerCase().includes(search);
        });
        table.innerHTML = items.map(function (item) {
            const rack = state.plantRacks.find(function (entry) { return entry.id === item.rackId; });
            const placement = rack ? rack.name + (item.position ? ' · ' + item.position : '') : (item.location || '未分配');
            return '<tr class="clickable-data-row" data-plant-id="' + esc(item.id) + '" tabindex="0"><td><strong>' + esc(item.id) + '</strong><small>PLANT MATERIAL' + contributorInline(item) + '</small></td><td><strong>' + esc(item.name || '未命名植物') + '</strong><small><i>' + esc(item.scientificName || '物种未填写') + '</i></small></td><td><span class="biology-record-kind">' + esc(item.materialType || '未分类') + '</span></td><td><strong>' + esc(item.accession || '未填写') + '</strong><small>' + esc([item.generation,item.genotype].filter(Boolean).join(' · ') || '世代未填写') + '</small></td><td>' + esc(item.growthStage || '未填写') + '</td><td><strong>' + esc(placement) + '</strong><small>' + esc(item.growthConditions || '条件未填写') + '</small></td><td><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status || '在库') + '</span></td><td><button class="row-arrow" type="button" tabindex="-1" aria-hidden="true">→</button></td></tr>';
        }).join('') || '<tr><td colspan="8">暂无植物材料记录。</td></tr>';
    }

    function applyHousingRoomGeometry(map, room) {
        const shapes = { '矩形': 'rectangle', '圆角': 'rounded', '斜角': 'angled', 'L 形': 'l-shape' };
        const entrances = { '左侧': 'left', '右侧': 'right', '上侧': 'top', '下侧': 'bottom' };
        map.dataset.roomShape = shapes[room.shape] || 'rectangle';
        map.dataset.entranceSide = entrances[room.entranceSide] || 'right';
        map.style.setProperty('--room-entrance-position', number(room.entrancePosition, 12, 88) + '%');
    }

    function housingRoomTabHtml(kind, item, index, active, detail, expanded) {
        const editAttribute = kind === 'animal' ? 'data-edit-animal-room' : 'data-edit-plant-room';
        const selectAttribute = kind === 'animal' ? 'data-animal-room' : 'data-plant-room';
        return '<article class="housing-room-tab' + (active ? ' active' : '') + (expanded ? ' is-expanded' : '') + '" role="button" tabindex="0" aria-expanded="' + (expanded ? 'true' : 'false') + '" draggable="true" data-room-tab="' + esc(item.id) + '" data-room-kind="' + kind + '" ' + selectAttribute + '="' + esc(item.id) + '">' +
            '<span>ROOM ' + String(index + 1).padStart(2, '0') + '</span><strong>' + esc(interfaceText(item.name)) + '</strong><small>' + esc(detail) + '</small>' +
            '<button class="housing-room-edit" type="button" ' + editAttribute + '="' + esc(item.id) + '" draggable="false" aria-label="' + esc(interfaceText('编辑房间')) + '" title="' + esc(interfaceText('编辑房间')) + '">✎</button>' +
            '<i class="housing-room-toggle" aria-hidden="true">' + (expanded ? '−' : '+') + '</i>' +
            '<i class="housing-room-grip" aria-hidden="true">⋮⋮</i></article>';
    }

    function housingRackInlineStyle(rack) {
        const x = housingLayoutCoordinate(rack.layoutX, 0, 'x');
        const y = housingLayoutCoordinate(rack.layoutY, 0, 'y');
        return 'left:' + x + '%;top:' + y + '%;transform:translate(-' + x + '%,-' + y + '%)';
    }

    function renderPlantHousing() {
        const roomTabs = document.getElementById('plantRoomTabs');
        const roomMap = document.getElementById('plantRoomMap');
        const roomTitle = document.getElementById('plantRoomTitle');
        const roomMeta = document.getElementById('plantRoomMeta');
        const grid = document.getElementById('plantRackGrid');
        const title = document.getElementById('plantRackTitle');
        const meta = document.getElementById('plantRackMeta');
        if (!roomTabs || !roomMap || !grid) return;
        const room = state.plantRooms.find(function (item) { return item.id === activePlantRoomId; }) || state.plantRooms[0];
        if (!room) {
            activePlantRoomId = ''; activePlantRackId = ''; selectedPlantId = '';
            roomMap.classList.remove('is-zoomed');
            roomMap.closest('.housing-room-overview')?.classList.remove('is-expanded');
            roomTabs.classList.remove('has-expanded-room');
            roomTabs.innerHTML = '<span class="housing-room-empty-tabs">尚无培养室</span>';
            roomTitle.textContent = '尚未建立培养室'; roomMeta.textContent = '先建立培养室，再在房间布局中放置培养架。';
            roomMap.innerHTML = '<button class="housing-room-empty" type="button" data-add="plantRoom"><strong>＋ 新建第一个培养室</strong><span>建立可容纳多个培养架的房间布局</span></button>';
            title.textContent = '尚未选择培养架'; meta.textContent = '点击房间布局中的培养架查看位置。';
            grid.removeAttribute('style'); grid.innerHTML = '<button class="empty-card" type="button" data-add="plantRoom"><strong>＋ 新建培养室</strong></button>';
            renderPlantPositionInspector(); return;
        }
        activePlantRoomId = room.id; localStorage.setItem('rhineLabActivePlantRoom', room.id);
        roomTabs.innerHTML = state.plantRooms.map(function (item, index) {
            const racks = state.plantRacks.filter(function (rack) { return rack.roomId === item.id; });
            return housingRoomTabHtml('plant', item, index, item.id === room.id, interfaceText(racks.length + ' 个培养架'), item.id === zoomedPlantRoomId);
        }).join('');
        const racks = state.plantRacks.filter(function (item) { return item.roomId === room.id; });
        let rack = racks.find(function (item) { return item.id === activePlantRackId; }) || racks[0];
        activePlantRackId = rack ? rack.id : '';
        localStorage.setItem('rhineLabActivePlantRack', activePlantRackId);
        roomTitle.textContent = interfaceText(room.name);
        roomMeta.textContent = (room.notes ? room.notes + ' · ' : '') + interfaceText(racks.length + ' 个培养架 · 可拖动调整布局');
        applyHousingRoomGeometry(roomMap, room);
        const plantRoomExpanded = room.id === zoomedPlantRoomId;
        roomMap.classList.toggle('is-zoomed', plantRoomExpanded);
        roomMap.closest('.housing-room-overview')?.classList.toggle('is-expanded', plantRoomExpanded);
        roomTabs.classList.toggle('has-expanded-room', plantRoomExpanded);
        roomMap.innerHTML = racks.map(function (item) {
            const count = state.plants.filter(function (plant) { return plant.rackId === item.id; }).length;
            const selected = Boolean(rack && item.id === rack.id);
            const detail = interfaceText(item.rows + ' × ' + item.columns + ' · ' + count + ' 株');
            return '<div class="housing-layout-rack plant' + (selected ? ' active' : '') + '" role="button" aria-pressed="' + String(selected) + '" tabindex="0" data-room-layout-rack="plant" data-plant-rack="' + esc(item.id) + '" style="' + housingRackInlineStyle(item) + '"><span>GROWTH RACK</span><strong>' + esc(item.name) + '</strong><small>' + esc(detail) + '</small><button class="housing-layout-rack-delete" type="button" data-delete-plant-rack="' + esc(item.id) + '" aria-label="删除培养架" title="删除培养架"></button></div>';
        }).join('') || '<button class="housing-room-empty" type="button" data-add="plantRack"><strong>＋ 在此房间新建培养架</strong><span>新建后可拖动到实际位置</span></button>';
        if (!rack) {
            selectedPlantId = ''; title.textContent = '尚未建立培养架'; meta.textContent = room.name + ' · 点击上方按钮建立培养架';
            grid.removeAttribute('style'); grid.innerHTML = '<button class="empty-card" type="button" data-add="plantRack"><strong>＋ 新建培养架</strong></button>';
            renderPlantPositionInspector(); return;
        }
        const plants = state.plants.filter(function (item) { return item.rackId === rack.id; });
        const plantByPosition = new Map(plants.map(function (item) { return [item.position,item]; }));
        if (!plants.some(function (item) { return item.id === selectedPlantId; })) selectedPlantId = plants[0] ? plants[0].id : '';
        title.textContent = interfaceText(rack.name); meta.textContent = interfaceText(room.name) + ' · ' + interfaceText(rack.rows + ' 行 × ' + rack.columns + ' 列');
        grid.style.gridTemplateColumns = 'repeat(' + rack.columns + ', minmax(64px, 1fr))';
        let cells = '';
        for (let row = 0; row < rack.rows; row += 1) for (let column = 1; column <= rack.columns; column += 1) {
            const position = String.fromCharCode(65 + row) + column; const plant = plantByPosition.get(position);
            if (!plant) cells += '<button class="plant-rack-position empty" type="button" data-plant-position="' + position + '" aria-label="在 ' + position + ' 登记植物"><span>' + position + '</span><strong>＋</strong></button>';
            else cells += '<button class="plant-rack-position occupied' + (plant.id === selectedPlantId ? ' active' : '') + '" type="button" data-plant-id="' + esc(plant.id) + '"><span>' + position + '</span><strong>' + esc(plant.name) + '</strong><small>' + esc(plant.growthStage || plant.status || '已定位') + '</small></button>';
        }
        grid.innerHTML = cells; renderPlantPositionInspector();
    }
    function renderPlantPositionInspector() {
        const inspector = document.getElementById('plantPositionInspector');
        if (!inspector) return;
        const plant = state.plants.find(function (item) { return item.id === selectedPlantId && item.rackId === activePlantRackId; });
        if (!plant) { inspector.innerHTML = '<div class="plant-position-empty"><span>PLANT</span><strong>选择一个位置</strong><p>查看该位置的植物材料与培养条件。</p></div>'; return; }
        inspector.innerHTML = '<div class="plant-position-summary"><header><div><small>' + esc(plant.id) + '</small><h3>' + esc(plant.name) + '</h3></div><span>' + esc(plant.position) + '</span></header><div class="plant-position-meta"><div><small>物种</small><strong><i>' + esc(plant.scientificName || '未填写') + '</i></strong></div><div><small>生长阶段</small><strong>' + esc(plant.growthStage || '未填写') + '</strong></div><div><small>培养条件</small><strong>' + esc(plant.growthConditions || '未填写') + '</strong></div><div><small>状态</small><strong>' + esc(plant.status || '未填写') + '</strong></div></div><p class="plant-position-notes">' + esc(plant.phenotype || plant.notes || '尚未记录表型或备注。') + '</p><div class="plant-position-buttons"><button class="button primary" type="button" data-plant-id="' + esc(plant.id) + '">查看植物详情</button></div></div>';
    }

    function selectPlantRoom(id) {
        const room = state.plantRooms.find(function (item) { return item.id === id; });
        if (!room) return;
        activePlantRoomId = room.id; localStorage.setItem('rhineLabActivePlantRoom', room.id);
        const rack = state.plantRacks.find(function (item) { return item.roomId === room.id; });
        activePlantRackId = rack ? rack.id : ''; localStorage.setItem('rhineLabActivePlantRack', activePlantRackId);
        selectedPlantId = rack ? ((state.plants.find(function (item) { return item.rackId === rack.id; }) || {}).id || '') : '';
        renderPlants();
    }

    function selectPlantRack(id) {
        const rack = state.plantRacks.find(function (item) { return item.id === id; });
        if (!rack) return;
        activePlantRoomId = rack.roomId; localStorage.setItem('rhineLabActivePlantRoom', activePlantRoomId);
        activePlantRackId = rack.id; localStorage.setItem('rhineLabActivePlantRack', rack.id);
        selectedPlantId = (state.plants.find(function (item) { return item.rackId === rack.id; }) || {}).id || '';
        renderPlants();
    }
    function renderBioResources() {
        const table = document.getElementById('bioresourceTable');
        if (!table) return;
        const search = valueOf('bioresourceSearch').toLowerCase();
        const items = state.microbes.map(function (item) { return { type: 'microbe', kind: '菌种', item: item }; }).concat(state.plasmids.map(function (item) { return { type: 'plasmid', kind: '质粒', item: item }; })).filter(function (entry) {
            if (bioresourceFilter !== '全部' && entry.kind !== bioresourceFilter) return false;
            return Object.values(entry.item).join(' ').toLowerCase().includes(search);
        });
        table.innerHTML = items.map(function (entry) {
            const item = entry.item;
            const host = entry.type === 'microbe' ? item.species : item.host;
            const feature = entry.type === 'microbe' ? [item.strain, item.genotype].filter(Boolean).join(' · ') : [item.backbone, item.insert].filter(Boolean).join(' · ');
            const condition = entry.type === 'microbe' ? [item.medium, item.growthConditions].filter(Boolean).join(' · ') : [item.resistance, item.promoter].filter(Boolean).join(' · ');
            return '<tr class="clickable-data-row" data-bioresource-type="' + entry.type + '" data-bioresource-id="' + esc(item.id) + '" tabindex="0"><td><strong>' + esc(item.id) + '</strong><small>' + (entry.type === 'microbe' ? 'MICROBIAL STRAIN' : 'DNA CONSTRUCT') + contributorInline(item) + '</small></td><td><strong>' + esc(item.name || item.id) + '</strong><small>' + esc(item.source || '来源未填写') + '</small></td><td><span class="biology-record-kind">' + esc(entry.kind) + '</span></td><td>' + esc(host || '未填写') + '</td><td><strong>' + esc(feature || '未填写') + '</strong></td><td>' + esc(condition || '未填写') + '</td><td><strong>' + esc(item.location || '未分配') + '</strong><small>' + esc(item.status || '在库') + '</small></td><td><button class="row-arrow" type="button" tabindex="-1" aria-hidden="true">→</button></td></tr>';
        }).join('') || '<tr><td colspan="8">暂无菌种或质粒记录。</td></tr>';
    }

    function renderViruses() {
        const table = document.getElementById('virusTable');
        if (!table) return;
        const search = valueOf('virusSearch').toLowerCase();
        const items = state.viruses.filter(function (item) { return Object.values(item).join(' ').toLowerCase().includes(search); });
        table.innerHTML = items.map(function (item) {
            return '<tr class="clickable-data-row" data-virus-id="' + esc(item.id) + '" tabindex="0"><td><strong>' + esc(item.id) + '</strong><small>VIRAL RESOURCE' + contributorInline(item) + '</small></td><td><strong>' + esc(item.name || '未命名病毒') + '</strong><small>' + esc(item.virusType || '类型未填写') + '</small></td><td><strong>' + esc(item.serotype || '未填写') + '</strong><small>' + esc(item.genome || '基因组未填写') + '</small></td><td>' + esc(item.cargo || '未填写') + '</td><td>' + esc(item.hostRange || '未填写') + '</td><td><strong>' + esc(item.titer || '未测定') + '</strong><small>' + esc(item.batch || '批次未填写') + '</small></td><td><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.biosafetyLevel || '未设置') + '</span></td><td><button class="row-arrow" type="button" tabindex="-1" aria-hidden="true">→</button></td></tr>';
        }).join('') || '<tr><td colspan="8">暂无病毒资源记录。</td></tr>';
    }
    function setBioinfoTab(tab) {
        activeBioinfoTab = tab === 'pipelines' ? 'pipelines' : 'projects';
        activeBioProjectId = '';
        activeBioDatasetId = '';
        localStorage.setItem('rhineLabBioinfoTab', activeBioinfoTab);
        localStorage.setItem('rhineLabActiveBioProject', activeBioProjectId);
        localStorage.setItem('rhineLabActiveBioDataset', activeBioDatasetId);
        renderBioinformaticsFlow();
    }

    function renderBioinformatics() { renderBioinformaticsFlow(); }
    function renderBioinformaticsTables() { renderBioinformaticsFlow(); }

    function renderBioinformaticsFlow() {
        const root = document.getElementById('bioProjectFlow');
        if (!root) return;
        const searchField = document.getElementById('bioProjectSearch');
        const projectSearch = valueOf('bioProjectSearch').toLowerCase();
        const projects = state.bioProjects.filter(function (item) {
            return Object.values(item).join(' ').toLowerCase().includes(projectSearch);
        });
        if (activeBioProjectId && !state.bioProjects.some(function (item) { return item.id === activeBioProjectId; })) activeBioProjectId = '';
        if (activeBioDatasetId && !state.bioDatasets.some(function (item) { return item.id === activeBioDatasetId; })) activeBioDatasetId = '';
        const atRoot = activeBioinfoTab !== 'pipelines' && !activeBioProjectId && !activeBioDatasetId;
        if (searchField && searchField.closest('.inline-search')) searchField.closest('.inline-search').hidden = !atRoot;

        if (activeBioinfoTab === 'pipelines') {
            root.innerHTML = renderBioWorkflowLibrary();
            return;
        }
        if (activeBioDatasetId) {
            const dataset = state.bioDatasets.find(function (item) { return item.id === activeBioDatasetId; });
            const project = dataset && state.bioProjects.find(function (item) { return item.id === dataset.projectId; });
            if (dataset && project) {
                root.innerHTML = renderBioDatasetFolder(project, dataset);
                return;
            }
            activeBioDatasetId = '';
        }
        if (activeBioProjectId) {
            const project = state.bioProjects.find(function (item) { return item.id === activeBioProjectId; });
            if (project) {
                root.innerHTML = renderBioProjectFolder(project);
                return;
            }
            activeBioProjectId = '';
        }
        root.innerHTML = renderBioFileRoot(projects);
    }

    let bioFolderArtworkSeq = 0;

    function bioFolderArtwork() {
        bioFolderArtworkSeq += 1;
        const backGradientId = 'bio-folder-back-' + bioFolderArtworkSeq;
        const frontGradientId = 'bio-folder-front-' + bioFolderArtworkSeq;
        return '<span class="bio-folder-art" aria-hidden="true" data-i18n-skip>' +
            '<svg viewBox="0 0 320 180" preserveAspectRatio="none" focusable="false">' +
                '<defs>' +
                    '<linearGradient id="' + backGradientId + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7db7b"></stop><stop offset=".58" stop-color="#e5b84d"></stop><stop offset="1" stop-color="#c9922d"></stop></linearGradient>' +
                    '<linearGradient id="' + frontGradientId + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe89a"></stop><stop offset=".55" stop-color="#f1c75e"></stop><stop offset="1" stop-color="#d9a43b"></stop></linearGradient>' +
                '</defs>' +
                '<path class="bio-folder-back" style="fill:url(#' + backGradientId + ')" vector-effect="non-scaling-stroke" d="M5 169V35Q5 18 22 18H101Q111 18 119 27L137 46H299Q315 46 315 62V169Z"></path>' +
                '<path class="bio-folder-front" style="fill:url(#' + frontGradientId + ')" vector-effect="non-scaling-stroke" d="M6 70Q6 59 17 58L300 42Q318 41 315 61L302 165Q300 176 289 176H18Q6 176 6 164Z"></path>' +
            '</svg>' +
        '</span>';
    }

    function renderBioFileRoot(projects) {
        const projectFolders = projects.map(function (project) {
            const datasets = state.bioDatasets.filter(function (item) { return item.projectId === project.id; });
            const runs = state.bioRuns.filter(function (item) { return item.projectId === project.id; });
            const runningCount = runs.filter(function (item) { return /运行|running/i.test(item.status || ''); }).length;
            return '<article class="bio-folder-card bio-project-folder">' + bioFolderArtwork() +
                '<button class="bio-folder-open" type="button" data-bio-project-toggle="' + esc(project.id) + '">' +
                    '<span class="bio-folder-kind">PROJECT</span><strong>' + esc(project.name || '未命名项目') + '</strong>' +
                    '<small>' + esc(project.id) + ' · ' + datasets.length + ' 个数据集</small>' +
                '</button>' +
                '<button class="bio-folder-detail" type="button" data-bioinfo-record="' + esc(project.id) + '" data-bioinfo-type="bioProject" aria-label="查看项目详情">···</button>' +
            '</article>';
        }).join('');
        return '<div class="bio-file-browser">' +
            '<div class="bio-file-breadcrumb"><b>root</b><span>' + projects.length + ' 个项目</span></div>' +
            '<div class="bio-folder-grid">' +
                '<article class="bio-folder-card bio-workflow-folder">' + bioFolderArtwork() +
                    '<button class="bio-folder-open" type="button" data-bioinfo-tab="pipelines"><span class="bio-folder-kind">WORKFLOW</span><strong>分析流程</strong><small>' + state.bioPipelines.length + ' 个分析方法</small><span class="bio-folder-footer"><i>RUN SCRIPT</i><b>打开 →</b></span></button>' +
                '</article>' +
                projectFolders +
            '</div>' +
            (!projectFolders ? '<div class="bio-flow-empty bio-flow-empty-main">暂无生物信息项目。</div>' : '') +
        '</div>';
    }

    function renderBioProjectFolder(project) {
        const datasets = state.bioDatasets.filter(function (item) { return item.projectId === project.id; });
        const folders = datasets.map(function (dataset) {
            const runs = state.bioRuns.filter(function (item) { return item.datasetId === dataset.id; });
            const running = runs.find(function (item) { return /运行|running/i.test(item.status || ''); });
            return '<article class="bio-folder-card bio-dataset-folder">' + bioFolderArtwork() +
                '<button class="bio-folder-open" type="button" data-bio-dataset-toggle="' + esc(dataset.id) + '">' +
                    '<span class="bio-folder-kind">DATASET</span><strong>' + esc(dataset.name || '未命名数据集') + '</strong>' +
                    '<small>' + esc(dataset.dataType || '类型未填写') + ' · ' + esc(dataset.format || '格式未填写') + '</small>' +
                    '<span class="bio-folder-footer"><i>' + esc(dataset.id) + '</i><b>' + (running ? '运行中' : runs.length + ' 个分析记录') + '</b></span>' +
                '</button>' +
                '<button class="bio-folder-detail" type="button" data-bioinfo-record="' + esc(dataset.id) + '" data-bioinfo-type="bioDataset" aria-label="查看数据集详情">···</button>' +
            '</article>';
        }).join('');
        return '<div class="bio-file-browser bio-folder-level">' +
            '<div class="bio-file-breadcrumb"><button type="button" data-bio-folder-home>root</button><span>›</span><b>' + esc(project.name || project.id) + '</b></div>' +
            '<div class="bio-folder-summary"><div><span>PROJECT</span><strong>' + esc(project.id) + '</strong><small>' + esc(project.referenceGenome || '参考基因组未设置') + '</small></div><span class="status-chip ' + statusClass(project.status) + '">' + esc(project.status || '准备中') + '</span><button class="button ghost compact" type="button" data-bioinfo-record="' + esc(project.id) + '" data-bioinfo-type="bioProject">项目信息</button><button class="button primary compact" type="button" data-add="bioDataset" data-bio-project-context="' + esc(project.id) + '"><span>＋</span> 登记数据集</button></div>' +
            '<div class="bio-folder-grid">' + folders + '</div>' +
            (!folders ? '<div class="bio-flow-empty bio-flow-empty-main">该项目还没有登记数据集。</div>' : '') +
        '</div>';
    }

    function renderBioDatasetFolder(project, dataset) {
        const datasetRuns = state.bioRuns.filter(function (item) { return item.datasetId === dataset.id; });
        const linkedPipelineIds = datasetRuns.map(function (item) { return item.pipelineId; });
        const availablePipelines = state.bioPipelines.filter(function (item) {
            return (!item.projectId || item.projectId === project.id) && !linkedPipelineIds.includes(item.id);
        });
        const methodFiles = datasetRuns.map(function (run) {
            const pipeline = state.bioPipelines.find(function (item) { return item.id === run.pipelineId; });
            return renderBioMethodFile(pipeline, run);
        }).concat(availablePipelines.map(function (pipeline) { return renderBioMethodFile(pipeline, null); })).join('');
        return '<div class="bio-file-browser bio-folder-level bio-dataset-level">' +
            '<div class="bio-file-breadcrumb"><button type="button" data-bio-folder-home>root</button><span>›</span><button type="button" data-bio-dataset-toggle="">' + esc(project.name || project.id) + '</button><span>›</span><b>' + esc(dataset.name || dataset.id) + '</b></div>' +
            '<section class="bio-dataset-profile">' +
                '<header><div><span>DATASET</span><h3>' + esc(dataset.name || '未命名数据集') + '</h3><small>' + esc(dataset.id) + '</small></div><button class="button ghost compact" type="button" data-bioinfo-record="' + esc(dataset.id) + '" data-bioinfo-type="bioDataset">编辑信息</button></header>' +
                '<div class="bio-dataset-facts"><div><span>数据集来源</span><strong>' + esc(dataset.sampleSource || '来源未填写') + '</strong><small>' + esc(dataset.accession || '登录号未填写') + '</small></div><div><span>数据类型</span><strong>' + esc(dataset.dataType || '类型未填写') + '</strong><small>' + esc(dataset.format || '格式未填写') + '</small></div><div><span>数据位置</span><strong>' + esc(dataset.location || '位置未设置') + '</strong><small>' + esc(dataset.size || '规模未记录') + '</small></div></div>' +
            '</section>' +
            '<div class="bio-method-heading"><div><span>ANALYSIS</span><h3>分析方法与运行状态</h3></div><button class="button primary compact" type="button" data-add="bioRun" data-bio-project-context="' + esc(project.id) + '" data-bio-dataset-context="' + esc(dataset.id) + '"><span>＋</span> 新建分析任务</button></div>' +
            '<div class="bio-folder-grid bio-analysis-folder-grid">' + (methodFiles || '<div class="bio-flow-empty">尚未关联分析方法。</div>') + '</div>' +
        '</div>';
    }

    function renderBioWorkflowLibrary() {
        const files = state.bioPipelines.map(function (pipeline) {
            const project = state.bioProjects.find(function (item) { return item.id === pipeline.projectId; });
            const runs = state.bioRuns.filter(function (item) { return item.pipelineId === pipeline.id; });
            const runningCount = runs.filter(function (item) { return /运行|running/i.test(item.status || ''); }).length;
            return '<article class="bio-folder-card bio-pipeline-folder">' + bioFolderArtwork() +
                '<button class="bio-folder-open" type="button" data-bioinfo-record="' + esc(pipeline.id) + '" data-bioinfo-type="bioPipeline">' +
                    '<span class="bio-folder-kind">RUN SCRIPT</span><strong>' + esc(pipeline.name || '未命名分析流程') + '</strong>' +
                    '<small>' + esc(pipeline.version || '版本未填写') + ' · ' + esc(pipeline.environment || '环境未设置') + '</small>' +
                    '<span class="bio-folder-footer"><i>' + esc(project ? project.name : '通用分析方法') + '</i><b>' + (runningCount ? runningCount + ' 个运行中' : runs.length + ' 个运行记录') + '</b></span>' +
                '</button>' +
                '<button class="bio-folder-detail" type="button" data-bioinfo-record="' + esc(pipeline.id) + '" data-bioinfo-type="bioPipeline" aria-label="查看分析流程详情">···</button>' +
            '</article>';
        }).join('');
        return '<div class="bio-file-browser bio-workflow-library">' +
            '<div class="bio-file-breadcrumb"><button type="button" data-bio-folder-home>root</button><span>›</span><b>分析流程</b></div>' +
            '<div class="bio-workflow-library-head"><div><span>WORKFLOW LIBRARY</span><h3>运行脚本</h3></div><button class="button primary compact" type="button" data-add="bioPipeline"><span>＋</span> 新建分析方法</button></div>' +
            '<div class="bio-folder-grid bio-pipeline-folder-grid">' + files + '</div>' +
            (!files ? '<div class="bio-flow-empty bio-flow-empty-main">暂无分析流程。</div>' : '') +
        '</div>';
    }

    function renderBioMethodFile(pipeline, run) {
        const pipelineId = pipeline ? pipeline.id : (run && run.pipelineId ? run.pipelineId : '');
        const pipelineName = pipeline ? pipeline.name : '未关联分析流程';
        const method = pipeline ? (pipeline.analysisType || pipeline.inputType || '分析方法未填写') : '流程信息未找到';
        const status = run ? (run.status || '排队中') : '未运行';
        const recordId = run ? run.id : pipelineId;
        const recordType = run ? 'bioRun' : 'bioPipeline';
        return '<article class="bio-folder-card bio-analysis-folder' + (/运行|running/i.test(status) ? ' is-running' : '') + '">' + bioFolderArtwork() +
            '<button class="bio-folder-open" type="button" data-bioinfo-record="' + esc(recordId) + '" data-bioinfo-type="' + recordType + '">' +
                '<span class="bio-folder-kind">' + (run ? 'RUN' : 'FLOW') + ' · ' + esc(method) + '</span><strong>' + esc(pipelineName) + '</strong>' +
                '<small>' + esc(pipeline ? (pipeline.version || pipeline.environment || '版本未填写') : '流程信息未找到') + '</small>' +
                '<span class="bio-folder-footer"><i>' + esc(run ? (run.compute || run.id) : pipelineId) + '</i><b>' + esc(status) + '</b></span>' +
            '</button>' +
            (run && pipeline ? '<button class="bio-folder-detail" type="button" data-bioinfo-record="' + esc(pipelineId) + '" data-bioinfo-type="bioPipeline" aria-label="查看关联分析方法">···</button>' : '') +
        '</article>';
    }
    function bioProjectLabel(id) { const item = state.bioProjects.find(function (entry) { return entry.id === id; }); return item ? item.name + ' · ' + item.id : (id || '未关联'); }
    function bioDatasetLabel(id) { const item = state.bioDatasets.find(function (entry) { return entry.id === id; }); return item ? item.name + ' · ' + item.id : (id || '未关联'); }
    function bioPipelineLabel(id) { const item = state.bioPipelines.find(function (entry) { return entry.id === id; }); return item ? item.name + ' · ' + item.version : (id || '未关联'); }
    function renderAnimalHousing() {
        const roomTabs = document.getElementById('animalRoomTabs');
        const roomMap = document.getElementById('animalRoomMap');
        const roomTitle = document.getElementById('animalRoomTitle');
        const roomMeta = document.getElementById('animalRoomMeta');
        const grid = document.getElementById('animalRackGrid');
        const title = document.getElementById('animalRackTitle');
        const meta = document.getElementById('animalRackMeta');
        if (!roomTabs || !roomMap || !grid) return;
        const room = state.animalRooms.find(function (item) { return item.id === activeAnimalRoomId; }) || state.animalRooms[0];
        if (!room) {
            activeAnimalRoomId = ''; activeAnimalRackId = ''; selectedAnimalCageId = '';
            roomMap.classList.remove('is-zoomed');
            roomMap.closest('.housing-room-overview')?.classList.remove('is-expanded');
            roomTabs.classList.remove('has-expanded-room');
            roomTabs.innerHTML = '<span class="housing-room-empty-tabs">尚无动物房间</span>';
            roomTitle.textContent = '尚未建立动物房间'; roomMeta.textContent = '先建立房间，再在房间布局中放置笼架。';
            roomMap.innerHTML = '<button class="housing-room-empty" type="button" data-add="animalRoom"><strong>＋ 新建第一个动物房间</strong><span>建立可容纳多个笼架的房间布局</span></button>';
            title.textContent = '尚未选择笼架'; meta.textContent = '点击房间布局中的笼架查看笼位。';
            grid.removeAttribute('style'); grid.innerHTML = '<button class="empty-card" type="button" data-add="animalRoom"><strong>＋ 新建动物房间</strong></button>';
            renderAnimalCageInspector(); return;
        }
        activeAnimalRoomId = room.id; localStorage.setItem('rhineLabActiveAnimalRoom', room.id);
        roomTabs.innerHTML = state.animalRooms.map(function (item, index) {
            const racks = state.animalRacks.filter(function (rack) { return rack.roomId === item.id; });
            const cages = state.animalCages.filter(function (cage) { return racks.some(function (rack) { return rack.id === cage.rackId; }); });
            return housingRoomTabHtml('animal', item, index, item.id === room.id, interfaceText(racks.length + ' 个笼架 · ' + cages.length + ' 个笼位'), item.id === zoomedAnimalRoomId);
        }).join('');
        const racks = state.animalRacks.filter(function (item) { return item.roomId === room.id; });
        let rack = racks.find(function (item) { return item.id === activeAnimalRackId; }) || racks[0];
        activeAnimalRackId = rack ? rack.id : '';
        localStorage.setItem('rhineLabActiveAnimalRack', activeAnimalRackId);
        roomTitle.textContent = interfaceText(room.name);
        roomMeta.textContent = (room.notes ? room.notes + ' · ' : '') + interfaceText(racks.length + ' 个笼架 · 可拖动调整布局');
        applyHousingRoomGeometry(roomMap, room);
        const animalRoomExpanded = room.id === zoomedAnimalRoomId;
        roomMap.classList.toggle('is-zoomed', animalRoomExpanded);
        roomMap.closest('.housing-room-overview')?.classList.toggle('is-expanded', animalRoomExpanded);
        roomTabs.classList.toggle('has-expanded-room', animalRoomExpanded);
        roomMap.innerHTML = racks.map(function (item) {
            const cages = state.animalCages.filter(function (cage) { return cage.rackId === item.id; });
            const animals = state.mice.filter(function (animal) { return cages.some(function (cage) { return cage.id === animal.cageId; }); }).length;
            const selected = Boolean(rack && item.id === rack.id);
            const detail = interfaceText(item.rows + ' × ' + item.columns + ' · ' + cages.length + ' 笼位 · ' + animals + ' 个体');
            return '<div class="housing-layout-rack animal' + (selected ? ' active' : '') + '" role="button" aria-pressed="' + String(selected) + '" tabindex="0" data-room-layout-rack="animal" data-animal-rack="' + esc(item.id) + '" style="' + housingRackInlineStyle(item) + '"><span>ANIMAL RACK</span><strong>' + esc(item.name) + '</strong><small>' + esc(detail) + '</small><button class="housing-layout-rack-delete" type="button" data-delete-animal-rack="' + esc(item.id) + '" aria-label="删除笼架" title="删除笼架"></button></div>';
        }).join('') || '<button class="housing-room-empty" type="button" data-add="animalRack"><strong>＋ 在此房间新建笼架</strong><span>新建后可拖动到实际位置</span></button>';
        if (!rack) {
            selectedAnimalCageId = ''; title.textContent = '尚未建立笼架'; meta.textContent = room.name + ' · 点击上方按钮建立笼架';
            grid.removeAttribute('style'); grid.innerHTML = '<button class="empty-card" type="button" data-add="animalRack"><strong>＋ 新建笼架</strong></button>';
            renderAnimalCageInspector(); return;
        }
        const cages = state.animalCages.filter(function (item) { return item.rackId === rack.id; });
        const cageByPosition = new Map(cages.map(function (item) { return [item.position, item]; }));
        if (!cages.some(function (item) { return item.id === selectedAnimalCageId; })) selectedAnimalCageId = cages[0] ? cages[0].id : '';
        title.textContent = interfaceText(rack.name); meta.textContent = interfaceText(room.name) + ' · ' + interfaceText(rack.rows + ' 行 × ' + rack.columns + ' 列');
        grid.style.gridTemplateColumns = 'repeat(' + rack.columns + ', minmax(60px, 1fr))';
        let cells = '';
        for (let row = 0; row < rack.rows; row += 1) {
            for (let column = 1; column <= rack.columns; column += 1) {
                const position = String.fromCharCode(65 + row) + column;
                const cage = cageByPosition.get(position);
                if (!cage) { cells += '<button class="animal-rack-position empty" type="button" data-animal-position="' + position + '" aria-label="在 ' + position + ' 新建笼位"><span>' + position + '</span><strong>＋</strong></button>'; continue; }
                const count = state.mice.filter(function (animal) { return animal.cageId === cage.id; }).length;
                cells += '<button class="animal-rack-position occupied' + (cage.id === selectedAnimalCageId ? ' active' : '') + '" type="button" data-animal-cage="' + esc(cage.id) + '"><span>' + position + '</span><strong>' + esc(cage.label) + '</strong><small>' + count + ' / ' + cage.capacity + ' 个体</small></button>';
            }
        }
        grid.innerHTML = cells;
        renderAnimalCageInspector();
    }
    function renderAnimalCageInspector() {
        const inspector = document.getElementById('animalCageInspector');
        const cage = state.animalCages.find(item => item.id === selectedAnimalCageId);
        if (!cage) {
            inspector.innerHTML = '<div class="animal-cage-empty"><span>CAGE</span><strong>选择一个笼位</strong><p>查看笼位条件与其中的动物，或点击空位建立新笼位。</p></div>';
            return;
        }
        const animals = state.mice.filter(item => item.cageId === cage.id);
        const animalRows = animals.map(function (animal) {
            return '<button class="animal-cage-animal" type="button" data-mouse-id="' + esc(animal.id) + '"><strong>' + esc(animal.id) + ' · ' + esc(animal.species) + '</strong><small>' + esc(animal.strain || '品系未设置') + ' · ' + esc(animal.status || '在养') + '</small><b>→</b></button>';
        }).join('') || '<p class="search-empty">此笼位尚无动物条目。</p>';
        inspector.innerHTML = '<div class="animal-cage-summary"><header><div><small>' + esc(cage.id) + '</small><h3>' + esc(cage.label) + '</h3></div><span>' + esc(cage.position) + '</span></header><div class="animal-cage-meta"><div><small>物种</small><strong>' + esc(cage.species) + '</strong></div><div><small>容量</small><strong>' + animals.length + ' / ' + cage.capacity + '</strong></div><div><small>状态</small><strong>' + esc(cage.status) + '</strong></div></div><p class="animal-cage-notes">' + esc(cage.notes || '未填写饲养条件或备注。') + '</p><div class="animal-cage-list"><header><h4>笼内动物</h4><span>' + animals.length + ' 个体</span></header>' + animalRows + '</div><div class="animal-cage-buttons"><button class="button primary" type="button" data-add-animal-to-cage>＋ 向此笼位添加动物</button><button class="button danger" type="button" data-delete-animal-cage="' + esc(cage.id) + '">删除笼位</button></div></div>';
    }

    function selectAnimalRoom(id) {
        const room = state.animalRooms.find(function (item) { return item.id === id; });
        if (!room) return;
        activeAnimalRoomId = room.id; localStorage.setItem('rhineLabActiveAnimalRoom', room.id);
        const rack = state.animalRacks.find(function (item) { return item.roomId === room.id; });
        activeAnimalRackId = rack ? rack.id : ''; localStorage.setItem('rhineLabActiveAnimalRack', activeAnimalRackId);
        selectedAnimalCageId = rack ? ((state.animalCages.find(function (cage) { return cage.rackId === rack.id; }) || {}).id || '') : '';
        renderMice();
    }

    function selectAnimalRack(id) {
        const rack = state.animalRacks.find(function (item) { return item.id === id; });
        if (!rack) return;
        activeAnimalRoomId = rack.roomId; localStorage.setItem('rhineLabActiveAnimalRoom', activeAnimalRoomId);
        activeAnimalRackId = rack.id;
        localStorage.setItem('rhineLabActiveAnimalRack', rack.id);
        selectedAnimalCageId = (state.animalCages.find(function (cage) { return cage.rackId === rack.id; }) || {}).id || '';
        renderMice();
    }
    function selectAnimalCage(id) {
        const cage = state.animalCages.find(item => item.id === id);
        if (!cage) return;
        selectedAnimalCageId = cage.id;
        if (cage.rackId !== activeAnimalRackId) activeAnimalRackId = cage.rackId;
        renderMice();
    }

    function renderReagents() {
        const search = valueOf('reagentSearch').toLowerCase();
        const items = state.reagents.filter(function (item) {
            const matchesFilter = reagentFilter === '全部' || item.category === reagentFilter;
            return matchesFilter && [item.name, item.category, item.catalog, item.lot, item.location, item.status].join(' ').toLowerCase().includes(search);
        });
        document.getElementById('reagentTable').innerHTML = items.map(function (item) {
            const low = item.amount < 25 ? ' low' : '';
            const displayStatus = getReagentDisplayStatus(item);
            return '<tr class="clickable-data-row" data-reagent-catalog="' + esc(item.catalog) + '" tabindex="0" aria-label="查看试剂 ' + esc(item.name) + ' 的详细信息"><td><strong>' + esc(item.name) + (item.photoData ? ' <span class="table-photo-mark" title="附有录入照片">⌑</span>' : '') + '</strong>' + contributorInline(item) + '</td><td><strong>' + esc(item.category) + '</strong><small>' + esc(item.catalog) + '</small></td><td>' + esc(item.lot) + '</td><td>' + esc(item.location) + '</td><td><div class="amount-meter' + low + '"><div><i style="width:' + number(item.amount, 0, 100) + '%"></i></div><span>' + formatQuantity(item.currentQty) + ' / ' + formatQuantity(item.totalQty) + ' ' + esc(item.unit) + '</span></div></td><td>' + esc(item.expiry) + '</td><td><span class="status-chip ' + statusClass(displayStatus) + '">' + esc(displayStatus) + '</span></td><td><button class="row-arrow" type="button" tabindex="-1" aria-hidden="true">→</button></td></tr>';
        }).join('') || '<tr><td colspan="8">没有找到匹配的试剂记录。</td></tr>';
    }

    function renderCellCultures() {
        if (!els.cellCultureGrid) return;
        const search = valueOf('cellSearch').toLowerCase();
        const items = state.cellCultures.filter(function (culture) {
            return [culture.id, culture.name, culture.species, culture.medium, culture.container, culture.incubator].join(' ').toLowerCase().includes(search);
        });
        els.cellCultureGrid.innerHTML = items.map(function (culture) {
            return '<button class="cell-culture-card" type="button" data-cell-id="' + esc(culture.id) + '">' +
                '<div class="cell-culture-main"><div class="cell-culture-top"><span class="micro-label">' + esc(culture.id) + contributorInline(culture) + '</span></div>' +
                '<h3>' + esc(culture.name) + '</h3><p>' + esc(culture.species) + ' · P' + esc(culture.passage) + '</p>' +
                '<div class="cell-container-line"><span>培养容器</span><strong>' + esc(interfaceText(culture.container || '未填写')) + '</strong></div>' +
                '<div class="cell-container-line"><span>培养基</span><strong>' + esc(culture.medium || '未填写') + '</strong></div>' +
                '<div class="cell-confluence"><span><b>汇合度</b><strong>' + esc(culture.confluence) + '%</strong></span><div><i style="width:' + number(culture.confluence, 0, 100) + '%"></i></div></div>' +
                '<footer><span>' + esc(culture.incubator || '培养条件未填写') + '</span><strong>查看培养记录 →</strong></footer></div></button>';
        }).join('') || '<div class="empty-card cell-empty-card"><strong>尚未登记培养中的细胞</strong><p>点击“登记细胞”记录细胞系、容器、代次与培养条件。</p></div>';

        if (els.cellMaintenanceQueue) els.cellMaintenanceQueue.innerHTML = '';
    }

    function openCellDetail(id) {
        const culture = state.cellCultures.find(item => item.id === id);
        if (!culture) return;
        activeCellId = culture.id;
        prepareRecordDetail('cell', culture.id);
        const photo = culture.photoData ? '<figure class="record-detail-photo"><img src="' + esc(culture.photoData) + '" alt="' + esc(culture.name) + ' 培养照片"><figcaption>当前培养状态照片</figcaption></figure>' : '';
        const nodeField = workspaceMode === 'lab' ? detailFieldHtml('录入节点', contributorName(culture)) : '';
        els.recordDetailKicker.textContent = 'CELL CULTURE RECORD · ' + culture.id;
        els.recordDetailTitle.textContent = culture.name + ' · P' + culture.passage;
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero cell-detail-hero"><div><span class="record-detail-code">' + esc(culture.id) + '</span><h3>' + esc(culture.name) + '</h3><p>' + esc(culture.species) + ' · ' + esc(interfaceText(culture.container || '培养容器未填写')) + '</p></div></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">CURRENT CULTURE</p><h3>当前培养信息</h3></div><div class="record-detail-grid">' +
                detailFieldHtml('细胞名称', culture.name, true) + detailFieldHtml('物种 / 来源', culture.species) + detailFieldHtml('当前代次', 'P' + culture.passage) +
                detailFieldHtml('培养基', culture.medium, true) + detailFieldHtml('培养容器', interfaceText(culture.container || '未填写')) + detailFieldHtml('培养位置与条件', culture.incubator, true) +
                detailFieldHtml('当前汇合度', culture.confluence + '%') + detailFieldHtml('备注', culture.notes, true) + nodeField +
            '</div><div class="detail-stock-meter cell-confluence-meter"><div><i style="width:' + number(culture.confluence, 0, 100) + '%"></i></div><span>' + esc(interfaceText('汇合度')) + ' ' + esc(culture.confluence) + '%</span></div></section>' + embeddedLineageHtml('cell', culture.id) +
            '<section class="record-detail-section cell-passage-section"><div class="record-detail-section-title passage-title"><div><p class="micro-label">CULTURE HISTORY</p><h3>传代与培养记录</h3></div><button class="button primary" type="button" data-add-passage>＋ 记录传代 / 操作</button></div>' + cellCultureHistoryHtml(culture) + '</section>' + photo + recordHistoryHtml(culture);
        if (!els.recordDetailDialog.open) els.recordDetailDialog.showModal();
        scheduleEmbeddedLineageLayout();
    }

    function cellCultureHistoryHtml(culture) {
        const history = Array.isArray(culture.history) ? culture.history : [];
        if (!history.length) return '<p class="record-history-empty">暂无培养操作记录。完成第一次传代、换液或观察后，会显示在这里。</p>';
        return '<div class="cell-passage-list">' + history.map(function (entry) {
            const photo = entry.photoData ? '<img src="' + esc(entry.photoData) + '" alt="' + esc(culture.name) + ' ' + esc(entry.action) + '照片">' : '';
            return '<article class="cell-passage-entry"><div class="cell-passage-date"><time>' + esc(entry.date) + '</time><span>' + esc(entry.action) + '</span></div><div class="cell-passage-content"><header><strong>P' + esc(entry.passage) + '</strong><span>' + esc(interfaceText(entry.container || '培养容器未填写')) + '</span></header><dl><div><dt>比例 / 接种</dt><dd>' + esc(entry.ratio || '—') + '</dd></div><div><dt>操作后汇合度</dt><dd>' + esc(entry.confluence) + '%</dd></div><div><dt>培养基</dt><dd>' + esc(entry.medium || '—') + '</dd></div></dl><p>' + esc(entry.notes || '未填写备注') + '</p>' + photo + '</div></article>';
        }).join('') + '</div>';
    }

    function openAnimalDetail(id) {
        const animal = state.mice.find(item => item.id === id);
        if (!animal) return;
        const cage = state.animalCages.find(item => item.id === animal.cageId);
        const rack = cage ? state.animalRacks.find(item => item.id === cage.rackId) : null;
        prepareRecordDetail('mouse', animal.id);
        els.recordDetailKicker.textContent = 'ANIMAL RECORD · ' + animal.id;
        els.recordDetailTitle.textContent = animal.id + ' · ' + (animal.species || '动物');
        const nodeField = workspaceMode === 'lab' ? detailFieldHtml('录入节点', contributorName(animal)) : '';
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero animal-detail-hero"><div><span class="record-detail-code">' + esc(animal.id) + '</span><h3>' + esc(animal.species || '动物') + '</h3><p>' + esc(animal.strain || '品种 / 品系未设置') + ' · 笼位 ' + esc(animal.cage || '未分配') + '</p></div><span class="status-chip ' + statusClass(animal.status) + '">' + esc(animal.status || '在养') + '</span></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">IDENTITY & HOUSING</p><h3>身份与饲养信息</h3></div><div class="record-detail-grid">' +
                detailFieldHtml('动物编号', animal.id) + detailFieldHtml('物种', animal.species) + detailFieldHtml('品种 / 品系', animal.strain) + detailFieldHtml('基因型', animal.genotype) + detailFieldHtml('性别', animal.sex) +
                detailFieldHtml('出生 / 孵化日期', animal.birth) + detailFieldHtml('当前年龄', animalAgeLabel(animal.birth)) + detailFieldHtml('笼位', animal.cage) + detailFieldHtml('所属笼架', rack ? rack.name : '未分配') + detailFieldHtml('状态', animal.status) +
                detailFieldHtml('繁育系 / 群体', animal.line) + detailFieldHtml('亲本 / 系谱', animal.parents) + detailFieldHtml('研究项目', animal.project) + detailFieldHtml('个体标记', animal.marker) + detailFieldHtml('伦理审批编号', animal.ethics, true) + detailFieldHtml('备注', animal.notes, true) + nodeField +
            '</div></section>' + embeddedLineageHtml('animal', animal.id) +
            '<section class="record-detail-section animal-track"><div class="record-detail-section-title"><p class="micro-label">LIFECYCLE TRACE</p><h3>动物状态轨迹</h3></div><div class="record-timeline"><article><i></i><div><small>出生 / 孵化</small><strong>' + esc(animal.birth || '未填写') + '</strong></div></article><article><i></i><div><small>当前笼位</small><strong>' + esc(animal.cage || '未分配') + '</strong></div></article><article class="active"><i></i><div><small>当前阶段</small><strong>' + esc(animal.status || '在养') + '</strong></div></article></div></section>' +
            recordHistoryHtml(animal);
        if (!els.recordDetailDialog.open) els.recordDetailDialog.showModal();
        scheduleEmbeddedLineageLayout();
    }

    function linkedFrozenSampleLabel(sampleId) {
        const sample = state.samples.find(function (item) { return item.id === sampleId; });
        return sample ? sample.id + ' · ' + sample.type + ' · ' + sample.location : '未关联';
    }

    function openPlantDetail(id) {
        const item = state.plants.find(function (entry) { return entry.id === id; });
        if (!item) return;
        prepareRecordDetail('plant', item.id);
        els.recordDetailKicker.textContent = 'PLANT MATERIAL · ' + item.id;
        els.recordDetailTitle.textContent = item.name || item.id;
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero biology-detail-hero plant-detail-hero"><div><span class="record-detail-code">' + esc(item.id) + '</span><h3>' + esc(item.name || '未命名植物') + '</h3><p><i>' + esc(item.scientificName || '物种未填写') + '</i> · ' + esc(item.accession || '材料编号未填写') + '</p></div><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status || '在库') + '</span></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">GERMPLASM PASSPORT</p><h3>种质与材料信息</h3></div><div class="record-detail-grid">' +
                detailFieldHtml('材料编号', item.id) + detailFieldHtml('材料名称', item.name) + detailFieldHtml('学名', item.scientificName) + detailFieldHtml('材料类型', item.materialType) + detailFieldHtml('品系 / 种质号', item.accession) + detailFieldHtml('世代', item.generation) + detailFieldHtml('基因型', item.genotype) + detailFieldHtml('亲本 / 谱系', item.parentage, true) +
            '</div></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">GROWTH & PHENOTYPE</p><h3>生长、处理与表型</h3></div><div class="record-detail-grid">' +
                detailFieldHtml('生长阶段', item.growthStage) + detailFieldHtml('状态', item.status) + detailFieldHtml('环境与条件', item.growthConditions, true) + detailFieldHtml('位置', item.location) + detailFieldHtml('处理', item.treatment) + detailFieldHtml('表型观察', item.phenotype, true) + detailFieldHtml('冻存样本', linkedFrozenSampleLabel(item.frozenSampleId), true) + detailFieldHtml('备注', item.notes, true) +
            '</div></section>' + embeddedLineageHtml('plant', item.id) + recordHistoryHtml(item);
        if (!els.recordDetailDialog.open) els.recordDetailDialog.showModal();
        scheduleEmbeddedLineageLayout();
    }

    function openMicrobeDetail(id) {
        const item = state.microbes.find(function (entry) { return entry.id === id; });
        if (!item) return;
        prepareRecordDetail('microbe', item.id);
        els.recordDetailKicker.textContent = 'MICROBIAL STRAIN · ' + item.id;
        els.recordDetailTitle.textContent = item.name || item.id;
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero biology-detail-hero microbe-detail-hero"><div><span class="record-detail-code">' + esc(item.id) + '</span><h3>' + esc(item.name || '未命名菌种') + '</h3><p><i>' + esc(item.species || '物种未填写') + '</i> · ' + esc(item.strain || '株系未填写') + '</p></div><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.biosafetyLevel || '未设置') + '</span></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">STRAIN PASSPORT</p><h3>菌种信息</h3></div><div class="record-detail-grid">' + detailFieldHtml('菌种编号', item.id) + detailFieldHtml('名称', item.name) + detailFieldHtml('物种', item.species) + detailFieldHtml('株系', item.strain) + detailFieldHtml('生物安全等级', item.biosafetyLevel) + detailFieldHtml('来源', item.source) + detailFieldHtml('基因型 / 遗传特征', item.genotype, true) + '</div></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">CULTURE & STORAGE</p><h3>培养与保藏</h3></div><div class="record-detail-grid">' + detailFieldHtml('培养基', item.medium) + detailFieldHtml('培养条件', item.growthConditions, true) + detailFieldHtml('抗性', item.resistance) + detailFieldHtml('存储位置', item.location) + detailFieldHtml('状态', item.status) + detailFieldHtml('冻存样本', linkedFrozenSampleLabel(item.frozenSampleId), true) + detailFieldHtml('备注', item.notes, true) + '</div></section>' + embeddedLineageHtml('microbe', item.id) + recordHistoryHtml(item);
        if (!els.recordDetailDialog.open) els.recordDetailDialog.showModal();
        scheduleEmbeddedLineageLayout();
    }

    function openPlasmidDetail(id) {
        const item = state.plasmids.find(function (entry) { return entry.id === id; });
        if (!item) return;
        prepareRecordDetail('plasmid', item.id);
        els.recordDetailKicker.textContent = 'PLASMID RECORD · ' + item.id;
        els.recordDetailTitle.textContent = item.name || item.id;
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero biology-detail-hero plasmid-detail-hero"><div><span class="record-detail-code">' + esc(item.id) + '</span><h3>' + esc(item.name || '未命名质粒') + '</h3><p>' + esc(item.backbone || '骨架未填写') + ' · ' + esc(item.sizeBp ? item.sizeBp + ' bp' : '长度未填写') + '</p></div><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status || '在库') + '</span></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">DNA CONSTRUCT</p><h3>质粒信息</h3></div><div class="record-detail-grid">' + detailFieldHtml('质粒编号', item.id) + detailFieldHtml('质粒名称', item.name) + detailFieldHtml('载体骨架', item.backbone) + detailFieldHtml('插入片段 / 载荷', item.insert) + detailFieldHtml('长度', item.sizeBp ? item.sizeBp + ' bp' : '') + detailFieldHtml('启动子', item.promoter) + detailFieldHtml('筛选标记 / 抗性', item.resistance) + detailFieldHtml('扩增宿主', item.host) + detailFieldHtml('来源', item.source) + detailFieldHtml('序列 / 文件参考', item.sequenceRef, true) + detailFieldHtml('存储位置', item.location) + detailFieldHtml('状态', item.status) + detailFieldHtml('冻存样本', linkedFrozenSampleLabel(item.frozenSampleId), true) + detailFieldHtml('备注', item.notes, true) + '</div></section>' + embeddedLineageHtml('plasmid', item.id) + recordHistoryHtml(item);
        if (!els.recordDetailDialog.open) els.recordDetailDialog.showModal();
        scheduleEmbeddedLineageLayout();
    }

    function openVirusDetail(id) {
        const item = state.viruses.find(function (entry) { return entry.id === id; });
        if (!item) return;
        prepareRecordDetail('virus', item.id);
        els.recordDetailKicker.textContent = 'VIRAL RESOURCE · ' + item.id;
        els.recordDetailTitle.textContent = item.name || item.id;
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero biology-detail-hero virus-detail-hero"><div><span class="record-detail-code">' + esc(item.id) + '</span><h3>' + esc(item.name || '未命名病毒') + '</h3><p>' + esc(item.virusType || '类型未填写') + ' · ' + esc(item.serotype || '株系 / 血清型未填写') + '</p></div><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.biosafetyLevel || '未设置') + '</span></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">VECTOR IDENTITY</p><h3>病毒与载体信息</h3></div><div class="record-detail-grid">' + detailFieldHtml('病毒编号', item.id) + detailFieldHtml('名称', item.name) + detailFieldHtml('病毒 / 载体类型', item.virusType) + detailFieldHtml('株系 / 血清型', item.serotype) + detailFieldHtml('基因组类型', item.genome) + detailFieldHtml('表达载荷', item.cargo, true) + detailFieldHtml('宿主', item.hostRange, true) + detailFieldHtml('生物安全等级', item.biosafetyLevel) + '</div></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">BATCH & STORAGE</p><h3>批次、滴度与保藏</h3></div><div class="record-detail-grid">' + detailFieldHtml('滴度', item.titer) + detailFieldHtml('批次', item.batch) + detailFieldHtml('制备日期', item.productionDate) + detailFieldHtml('存储位置', item.location) + detailFieldHtml('状态', item.status) + detailFieldHtml('冻存样本', linkedFrozenSampleLabel(item.frozenSampleId), true) + detailFieldHtml('备注', item.notes, true) + '</div></section>' + embeddedLineageHtml('virus', item.id) + recordHistoryHtml(item);
        if (!els.recordDetailDialog.open) els.recordDetailDialog.showModal();
        scheduleEmbeddedLineageLayout();
    }
    function openReagentDetail(catalog) {
        const reagent = state.reagents.find(item => item.catalog === catalog);
        if (!reagent) return;
        prepareRecordDetail('reagent', reagent.catalog);
        const displayStatus = getReagentDisplayStatus(reagent);
        const recordedConsumption = getProtocolConsumption(reagent.catalog);
        const photo = reagent.photoData ? '<figure class="record-detail-photo"><img src="' + esc(reagent.photoData) + '" alt="' + esc(reagent.name) + ' 录入照片"><figcaption>录入时附加的试剂标签照片</figcaption></figure>' : '';
        const nodeField = workspaceMode === 'lab' ? detailFieldHtml('录入节点', contributorName(reagent)) : '';
        els.recordDetailKicker.textContent = 'REAGENT RECORD · ' + reagent.catalog;
        els.recordDetailTitle.textContent = reagent.name;
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero reagent-detail-hero"><div><span class="record-detail-code">' + esc(reagent.catalog) + '</span><h3>' + esc(reagent.name) + '</h3><p>' + esc(interfaceText(reagent.category)) + ' · LOT ' + esc(reagent.lot) + '</p></div><span class="status-chip ' + statusClass(displayStatus) + '">' + esc(displayStatus) + '</span></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">INVENTORY PROFILE</p><h3>库存详细信息</h3></div><div class="record-detail-grid reagent-profile-grid">' +
                detailFieldHtml('试剂名称', reagent.name, true) + detailFieldHtml('类别', reagent.category) +
                detailFieldHtml('品牌货号', reagent.catalog) + detailFieldHtml('批次号', reagent.lot) + detailFieldHtml('有效期', reagent.expiry) +
                detailFieldHtml('存储位置', reagent.location) + detailFieldHtml('当前实际库存', formatQuantity(reagent.currentQty) + ' / ' + formatQuantity(reagent.totalQty) + ' ' + reagent.unit) + detailFieldHtml('已记录实验消耗', formatQuantity(recordedConsumption) + ' ' + reagent.unit) + nodeField +
            '</div><div class="detail-stock-meter"><div><i style="width:' + number(reagent.amount, 0, 100) + '%"></i></div><span>' + esc(interfaceText('实际库存')) + ' ' + formatQuantity(reagent.amount) + '%</span></div></section>' + photo + recordHistoryHtml(reagent);
        els.recordDetailDialog.showModal();
    }

    function openSampleDetail(id) {
        const sample = state.samples.find(item => item.id === id);
        if (!sample) return;
        const box = state.freezerBoxes.find(item => item.id === sample.boxId);
        const photo = sample.photoData ? '<figure class="record-detail-photo"><img src="' + esc(sample.photoData) + '" alt="' + esc(sample.id) + ' 录入照片"><figcaption>登记样本时附加的照片</figcaption></figure>' : '';
        const nodeField = workspaceMode === 'lab' ? detailFieldHtml('录入节点', contributorName(sample)) : '';
        prepareRecordDetail('sample', sample.id);
        els.recordDetailKicker.textContent = 'BIOBANK RECORD · ' + sample.id;
        els.recordDetailTitle.textContent = sample.id + ' · ' + sample.type;
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero sample-detail-hero"><div><span class="record-detail-code">' + esc(sample.id) + '</span><h3>' + esc(sample.type) + '</h3><p>' + esc(sample.source) + ' · ' + esc(sample.position) + '</p></div><span class="status-chip ' + statusClass(sample.status) + '">' + esc(sample.status) + '</span></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">BIOBANK PROFILE</p><h3>样本详细信息</h3></div><div class="record-detail-grid">' +
                detailFieldHtml('样本编号', sample.id) + detailFieldHtml('样本类型', sample.type) + detailFieldHtml('当前状态', sample.status) +
                detailFieldHtml('样本来源', sample.source, true) + detailFieldHtml('处理方式', sample.processing, true) +
                detailFieldHtml('冻存盒', box ? box.name : sample.boxId) + detailFieldHtml('盒内位置', sample.position) + detailFieldHtml('入库日期', sample.date) +
                detailFieldHtml('设备 / 层架', box ? box.storageLocation : sample.location, true) + nodeField +
            '</div></section>' + embeddedLineageHtml('sample', sample.id) + photo + recordHistoryHtml(sample);
        if (!els.recordDetailDialog.open) els.recordDetailDialog.showModal();
        scheduleEmbeddedLineageLayout();
    }

    function prepareRecordDetail(type, key) {
        activeRecordDetail = { type: type, key: key };
        els.recordDetailDialog.dataset.recordType = type;
        const readOnly = workspaceMode === 'lab' && workspaceReadOnly;
        els.recordEditButton.disabled = readOnly;
        els.recordDeleteButton.disabled = readOnly;
        els.recordEditButton.title = readOnly ? 'LAB 共用页面为只读' : '编辑此条记录';
        els.recordDeleteButton.title = readOnly ? 'LAB 共用页面为只读' : '删除此条记录';
    }

    function recordHistoryHtml(record) {
        const historySource = Array.isArray(record.changeHistory) ? record.changeHistory : record.history;
        const history = Array.isArray(historySource) ? historySource.slice().reverse() : [];
        const items = history.map(function (entry) {
            const changes = Array.isArray(entry.changes) ? entry.changes : [];
            const summary = entry.action === 'created' ? '首次登记此条记录' : changes.map(function (change) {
                return '<span><em>' + esc(change.label) + '</em><b>：</b><del>' + esc(historyDisplayValue(change.from)) + '</del><b>→</b><ins>' + esc(historyDisplayValue(change.to)) + '</ins></span>';
            }).join('');
            return '<article class="record-history-item"><i></i><div><header><strong>' + (entry.action === 'created' ? '创建记录' : '修改信息') + '</strong><time>' + esc(formatHistoryTime(entry.at)) + '</time></header><p>' + (summary || '保存了记录信息') + '</p></div></article>';
        }).join('');
        return '<section class="record-detail-section record-history"><div class="record-detail-section-title"><p class="micro-label">CHANGE HISTORY</p><h3>修改记录</h3></div><div class="record-history-list">' + (items || '<p class="record-history-empty">暂无修改记录；下次编辑并保存后，会在这里显示变更前后的内容。</p>') + '</div></section>';
    }

    function historyDisplayValue(value) {
        if (value == null || value === '') return '—';
        if (String(value).startsWith('data:image/')) return '已附照片';
        return String(value);
    }

    function formatHistoryTime(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '时间未记录';
        return new Intl.DateTimeFormat(interfaceLocale(), { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
    }

    function recordTypeLabel(type) {
        return { experiment: '实验记录', protocol: '实验方案', formulation: '实验配方', mouse: '动物', plant: '植物材料', microbe: '菌种', plasmid: '质粒', virus: '病毒', reagent: '试剂', sample: '样本', cell: '细胞培养', result: '实验结果', coldStorage: '冻存设备', freezer: '冻存盒', animalRoom: '动物房间', animalRack: '动物笼架', animalCage: '动物笼位', plantRoom: '植物培养室', plantRack: '植物培养架', bioProject: '生物信息项目', bioDataset: '生物信息数据集', bioPipeline: '分析流程', bioRun: '分析任务', task: '日程' }[type] || '记录';
    }

    function recordCollection(type) {
        if (type === 'experiment') return state.experiments;
        if (type === 'protocol') return state.protocols;
        if (type === 'formulation') return state.formulations;
        if (type === 'mouse') return state.mice;
        if (type === 'plant') return state.plants;
        if (type === 'microbe') return state.microbes;
        if (type === 'plasmid') return state.plasmids;
        if (type === 'virus') return state.viruses;
        if (type === 'reagent') return state.reagents;
        if (type === 'sample') return state.samples;
        if (type === 'cell') return state.cellCultures;
        if (type === 'result') return state.results;
        if (type === 'coldStorage') return state.coldStorageUnits;
        if (type === 'freezer') return state.freezerBoxes;
        if (type === 'animalRoom') return state.animalRooms;
        if (type === 'animalRack') return state.animalRacks;
        if (type === 'animalCage') return state.animalCages;
        if (type === 'plantRoom') return state.plantRooms;
        if (type === 'plantRack') return state.plantRacks;
        if (type === 'bioProject') return state.bioProjects;
        if (type === 'bioDataset') return state.bioDatasets;
        if (type === 'bioPipeline') return state.bioPipelines;
        if (type === 'bioRun') return state.bioRuns;
        if (type === 'task') return state.schedule;
        return [];
    }

    function recordKey(type, record) {
        return type === 'reagent' ? record.catalog : record.id;
    }

    function findRecord(type, key) {
        return recordCollection(type).find(function (record) { return recordKey(type, record) === key; });
    }

    function startRecordEdit() {
        if (denyReadOnlyMutation() || !activeRecordDetail) return;
        const target = activeRecordDetail;
        const record = findRecord(target.type, target.key);
        if (!record) return;
        if (els.recordDetailDialog.open) els.recordDetailDialog.close();
        openEntryDialog(target.type, { edit: true, key: target.key, record: record });
    }

    function requestRecordDelete(type, key) {
        if (denyReadOnlyMutation()) return;
        const record = findRecord(type, key);
        if (!record) return;
        const label = record.name || record.label || record.title || record.id || key;
        pendingDeleteRecord = { type: type, key: key, label: label };
        els.deleteRecordName.textContent = interfaceText(recordTypeLabel(type)) + ' “' + label + '”';
        els.deleteConfirmDialog.showModal();
    }

    function deleteActiveRecord() {
        if (denyReadOnlyMutation() || !activeRecordDetail) return;
        const target = activeRecordDetail;
        const collection = recordCollection(target.type);
        const index = collection.findIndex(function (record) { return recordKey(target.type, record) === target.key; });
        if (index < 0) return;
        const record = collection[index];
        const label = record.name || record.label || record.title || record.id || record.catalog;
        pendingDeleteRecord = { type: target.type, key: target.key, label: label };
        els.deleteRecordName.textContent = interfaceText(recordTypeLabel(target.type)) + ' “' + label + '”';
        els.deleteConfirmDialog.showModal();
    }

    function confirmDeleteRecord() {
        if (denyReadOnlyMutation() || !pendingDeleteRecord) return;
        const target = pendingDeleteRecord;
        const collection = recordCollection(target.type);
        const index = collection.findIndex(function (record) { return recordKey(target.type, record) === target.key; });
        if (index < 0) {
            els.deleteConfirmDialog.close();
            pendingDeleteRecord = null;
            return;
        }
        const record = collection[index];
        const label = target.label;
        collection.splice(index, 1);
        const lineageType = target.type === 'mouse' ? 'animal' : target.type;
        state.lineageLinks = state.lineageLinks.filter(function (link) {
            return !(link.sourceType === lineageType && link.sourceId === target.key || link.targetType === lineageType && link.targetId === target.key);
        });
        appendAuditLog({
            action: 'deleted',
            recordType: target.type,
            recordId: target.key,
            snapshot: clone(record)
        });
        if (target.type === 'sample') {
            const nextSample = state.samples.find(item => item.boxId === activeFreezerBoxId) || state.samples[0];
            selectedSampleId = nextSample ? nextSample.id : '';
        } else if (target.type === 'animalCage') {
            state.mice.forEach(function (animal) {
                if (animal.cageId === record.id) {
                    animal.cageId = '';
                    animal.cage = '未分配';
                }
            });
            const nextCage = state.animalCages.find(item => item.rackId === record.rackId);
            selectedAnimalCageId = nextCage ? nextCage.id : '';
        } else if (target.type === 'animalRack') {
            const removedCageIds = new Set(state.animalCages.filter(item => item.rackId === record.id).map(item => item.id));
            state.animalCages = state.animalCages.filter(item => item.rackId !== record.id);
            state.mice.forEach(function (animal) {
                if (removedCageIds.has(animal.cageId)) {
                    animal.cageId = '';
                    animal.cage = '未分配';
                }
            });
            const nextRack = state.animalRacks.find(function (item) { return item.roomId === activeAnimalRoomId; }) || null;
            activeAnimalRackId = nextRack ? nextRack.id : '';
            const nextCage = nextRack ? state.animalCages.find(item => item.rackId === nextRack.id) : null;
            selectedAnimalCageId = nextCage ? nextCage.id : '';
            localStorage.setItem('rhineLabActiveAnimalRack', activeAnimalRackId);
        } else if (target.type === 'plantRack') {
            state.plants.forEach(function (plant) {
                if (plant.rackId === record.id) {
                    plant.rackId = '';
                    plant.position = '';
                    plant.location = '未分配位置';
                }
            });
            const nextRack = state.plantRacks.find(function (item) { return item.roomId === activePlantRoomId; }) || null;
            activePlantRackId = nextRack ? nextRack.id : '';
            selectedPlantId = state.plants.find(function (plant) { return plant.rackId === activePlantRackId; })?.id || '';
            localStorage.setItem('rhineLabActivePlantRack', activePlantRackId);
        }
        addActivity('删除' + recordTypeLabel(target.type) + '记录“' + label + '”并保存操作记录');
        saveState();
        renderAll();
        if (target.type === 'result' && els.experimentDetailDialog.open) {
            const experiment = state.experiments.find(item => item.id === record.experimentId);
            if (experiment) renderExperimentResultSection(experiment);
        }
        els.deleteConfirmDialog.close();
        if (els.recordDetailDialog.open) els.recordDetailDialog.close();
        activeRecordDetail = null;
        pendingDeleteRecord = null;
        showToast(recordTypeLabel(target.type) + '条目已删除，操作记录已保存');
    }

    function openClearWorkspaceDialog() {
        if (denyReadOnlyMutation()) return;
        els.clearWorkspacePhrase.value = '';
        els.confirmClearWorkspace.disabled = true;
        els.clearWorkspaceDialog.showModal();
        window.setTimeout(function () { els.clearWorkspacePhrase.focus(); }, 50);
    }

    function emptyWorkspaceState() {
        return {
            experiments: [],
            results: [],
            mice: [],
            animalRooms: [],
            animalRacks: [],
            animalCages: [],
            plants: [],
            plantRooms: [],
            plantRacks: [],
            microbes: [],
            plasmids: [],
            viruses: [],
            bioProjects: [],
            bioDatasets: [],
            bioPipelines: [],
            bioRuns: [],
            cellCultures: [],
            reagents: [],
            samples: [],
            coldStorageUnits: [{
                id: 'COLD-LOCAL-001',
                name: '-80°C 超低温冰箱 FZ-01',
                type: '超低温冰箱',
                temperature: '-80°C',
                location: '样本库 A 区 / 北墙 01 位',
                orientation: '横向',
                layoutX: 20,
                layoutY: 30,
                shelves: 5,
                rows: 1,
                columns: 4,
                levels: [{ mode: 'direct', rows: 1, columns: 4 }, { mode: 'rack', rows: 2, columns: 4 }, { mode: 'rack', rows: 3, columns: 4 }, { mode: 'direct', rows: 1, columns: 4 }, { mode: 'rack', rows: 2, columns: 4 }],
                createdBy: 'LOCAL-NODE'
            }],
            freezerBoxes: [{
                id: 'FB-LOCAL-001',
                name: 'FZ-01-R1C1',
                storageUnitId: 'COLD-LOCAL-001',
                shelf: 1,
                storageRow: 1,
                storageColumn: 1,
                storageLocation: '样本库 A 区 / 北墙 01 位 / -80°C 超低温冰箱 FZ-01 · 第 1 层 · 直放区 · 第 1 行第 1 位',
                temperature: '-80°C',
                rows: 9,
                columns: 9,
                lastScanPhoto: '',
                createdBy: 'LOCAL-NODE'
            }],
            schedule: [],
            protocols: [],
            formulations: [],
            activities: [],
            auditLog: [],
            lineageLinks: [],
            plateLayouts: [],
            security: { labKeys: {} },
            exampleSeedVersion: 999,
            housingSchemaVersion: 2
        };
    }

    function clearCurrentWorkspace() {
        if (denyReadOnlyMutation()) return;
        if (els.clearWorkspacePhrase.value.trim().toUpperCase() !== 'CLEAR') {
            showToast('请输入 CLEAR 后再确认清空');
            return;
        }
        state = migrateState(normalizeStateShape(emptyWorkspaceState()));
        selectedSampleId = '';
        activeCellId = '';
        activeExperimentId = '';
        activeRunExperimentId = '';
        activeProtocolId = '';
        activeFreezerBoxId = state.freezerBoxes[0].id;
        activeColdStorageId = state.coldStorageUnits[0].id;
        activeColdStorageShelf = 1;
        localStorage.setItem('rhineLabActiveFreezerBox', activeFreezerBoxId);
        localStorage.setItem('rhineLabActiveColdStorage', activeColdStorageId);
        localStorage.setItem('rhineLabActiveColdStorageShelf', '1');
        localStorage.removeItem('rhineLabReadNotifications');
        saveState();
        renderAll();
        applyNotificationState();
        els.clearWorkspaceDialog.close();
        switchView('dashboard');
        showToast('当前工作区的全部记录已清空');
    }

    function appendAuditLog(entry) {
        if (!Array.isArray(state.auditLog)) state.auditLog = [];
        state.auditLog.unshift(Object.assign({ id: 'AUD-' + Date.now(), at: new Date().toISOString() }, entry));
        state.auditLog = state.auditLog.slice(0, 300);
    }

    function detailFieldHtml(label, value, wide) {
        return '<div class="record-detail-field' + (wide ? ' wide' : '') + '"><small>' + esc(label) + '</small><strong>' + esc(value == null || value === '' ? '—' : value) + '</strong></div>';
    }

    function animalAgeLabel(birth) {
        const born = parseLocalDate(birth);
        if (Number.isNaN(born.getTime())) return '待确认';
        const days = Math.max(0, Math.floor((parseLocalDate(todayIso()) - born) / 86400000));
        if (days < 84) return Math.max(1, Math.floor(days / 7)) + ' 周';
        return Math.max(1, Math.floor(days / 30.44)) + ' 个月';
    }

    function coldStorageSlotsHtml(unit, shelf, level, compact, rack) {
        const boxes = state.freezerBoxes.filter(function (box) { return box.storageUnitId === unit.id && Number(box.shelf || 1) === shelf && Number(box.storageRack || 1) === rack; });
        const boxesBySlot = new Map(boxes.map(function (box) { return [Number(box.storageRow || 1) + ':' + Number(box.storageColumn || 1), box]; }));
        const positions = [];
        for (let row = 1; row <= level.rows; row += 1) for (let column = 1; column <= level.columns; column += 1) positions.push([row, column]);
        return positions.map(function (position) {
            const row = position[0]; const column = position[1]; const box = boxesBySlot.get(row + ':' + column);
            const attrs = ' data-storage-slot data-storage-unit="' + esc(unit.id) + '" data-storage-shelf="' + shelf + '" data-storage-rack="' + rack + '" data-storage-row="' + row + '" data-storage-column="' + column + '"';
            const label = compact ? 'R' + row + ' · C' + column : '第 ' + row + ' 行第 ' + column + ' 位';
            return box
                ? '<button class="cold-storage-slot occupied' + (box.id === activeFreezerBoxId ? ' active' : '') + '" type="button"' + attrs + ' data-cold-storage-box="' + esc(box.id) + '" data-freezer-box="' + esc(box.id) + '"><span>' + label + '</span><strong>' + esc(box.name) + '</strong></button>'
                : '<button class="cold-storage-slot empty" type="button"' + attrs + ' data-add="freezer"><span>' + label + '</span><strong>＋ 放置冻存盒</strong></button>';
        }).join('');
    }

    function coldStorageSlotsStyle(level, compact) {
        const width = compact ? 62 : 108;
        return 'grid-template-columns:repeat(' + level.columns + ',minmax(' + width + 'px,1fr))';
    }

    function coldStorageRacksHtml(unit, shelf, level, compact) {
        const racks = level.mode === 'rack' ? level.rackOrder : [1];
        const orientation = level.mode === 'rack' && unit.orientation === '竖向' ? ' vertical' : ' horizontal';
        return '<div class="cold-storage-racks' + orientation + '" data-cold-storage-racks data-rack-mode="' + level.mode + '" data-storage-unit="' + esc(unit.id) + '" data-storage-shelf="' + shelf + '" style="--rack-count:' + racks.length + '">' + racks.map(function (rack) {
            const handle = level.mode === 'rack' ? '<button class="cold-storage-rack-handle" type="button" data-cold-storage-rack-handle><strong>第 ' + rack + ' 货架</strong><span>拖动排序</span></button>' : '';
            return '<section class="cold-storage-rack' + (level.mode === 'rack' ? '' : ' direct') + '" data-cold-storage-rack data-storage-unit="' + esc(unit.id) + '" data-storage-shelf="' + shelf + '" data-storage-rack="' + rack + '">' + handle + '<div class="cold-storage-device-level-slots" style="' + coldStorageSlotsStyle(level, compact) + '">' + coldStorageSlotsHtml(unit, shelf, level, compact, rack) + '</div></section>';
        }).join('') + '</div>';
    }

    function renderSamples() {
        const search = valueOf('sampleSearch').toLowerCase();
        const items = state.samples.filter(item => [item.id, item.type, item.source, item.processing, item.location, item.status].join(' ').toLowerCase().includes(search));
        const activeUnit = state.coldStorageUnits.find(unit => unit.id === activeColdStorageId) || state.coldStorageUnits[0];
        activeColdStorageId = activeUnit.id;
        const shelfCount = Math.max(1, Number(activeUnit.shelves) || 0);
        activeColdStorageShelf = Math.min(shelfCount, Math.max(1, Number(activeColdStorageShelf) || 1));
        const activeLevel = coldStorageLevel(activeUnit, activeColdStorageShelf);
        localStorage.setItem('rhineLabActiveColdStorage', activeColdStorageId);
        localStorage.setItem('rhineLabActiveColdStorageShelf', String(activeColdStorageShelf));
        const visibleBoxes = state.freezerBoxes.filter(box => box.storageUnitId === activeUnit.id && Number(box.shelf || 1) === activeColdStorageShelf);
        const activeBox = visibleBoxes.find(item => item.id === activeFreezerBoxId) || visibleBoxes[0] || null;
        if (activeBox) {
            activeFreezerBoxId = activeBox.id;
            localStorage.setItem('rhineLabActiveFreezerBox', activeBox.id);
        }
        const boxSamples = activeBox ? state.samples.filter(item => item.boxId === activeBox.id) : [];
        const positions = new Map(boxSamples.map(item => [item.position || samplePosition(item.location), item]));
        const rows = activeBox ? Array.from({ length: activeBox.rows }, (_, index) => String.fromCharCode(65 + index)) : [];

        els.coldStorageTabs.innerHTML = state.coldStorageUnits.map(function (unit) {
            const count = state.freezerBoxes.filter(box => box.storageUnitId === unit.id).length;
            return '<button class="cold-storage-tab' + (unit.id === activeUnit.id ? ' active' : '') + '" type="button" data-cold-storage="' + esc(unit.id) + '"><span>' + esc(unit.type) + '</span><strong>' + esc(unit.name) + '</strong><small>' + esc(unit.location) + ' · ' + count + ' 个冻存盒</small></button>';
        }).join('');
        els.coldStorageType.textContent = (activeUnit.type === '液氮罐' ? 'LIQUID NITROGEN TANK' : 'FREEZER') + ' · ' + activeUnit.temperature;
        els.coldStorageTitle.textContent = activeUnit.name;
        els.coldStorageMeta.textContent = activeUnit.location + ' · ' + shelfCount + ' 层设备结构';
        els.coldStorageDevice.dataset.deviceKind = activeUnit.type === '液氮罐' ? 'ln2' : 'freezer';
        els.coldStorageDevice.dataset.rackOrientation = activeUnit.orientation === '竖向' ? 'vertical' : 'horizontal';
        els.coldStorageShelfTabs.classList.remove('vertical-racks');
        els.coldStorageShelfTabs.style.removeProperty('--rack-count');
        els.coldStorageShelfTabs.innerHTML = Array.from({ length: shelfCount }, function (_, index) {
            const shelf = index + 1;
            const level = coldStorageLevel(activeUnit, shelf);
            const boxCount = state.freezerBoxes.filter(box => box.storageUnitId === activeUnit.id && Number(box.shelf || 1) === shelf).length;
            return '<section class="cold-storage-device-level' + (shelf === activeColdStorageShelf ? ' active' : '') + '"><button class="cold-storage-device-level-head" type="button" data-cold-storage-shelf="' + shelf + '" aria-expanded="' + (shelf === activeColdStorageShelf ? 'true' : 'false') + '"><span>第 ' + shelf + ' 层</span><strong>' + (level.mode === 'rack' ? level.rackCount + ' 个' + (activeUnit.orientation === '竖向' ? '竖向' : '横向') + '货架' : '直放') + '</strong><small>每架 ' + level.rows + ' × ' + level.columns + ' 盒位 · ' + boxCount + ' 盒</small></button>' + coldStorageRacksHtml(activeUnit, shelf, level, true) + '</section>';
        }).join('');
        els.coldStorageLevelTitle.textContent = '第 ' + activeColdStorageShelf + ' 层 · ' + (activeLevel.mode === 'rack' ? (activeUnit.orientation === '竖向' ? '竖向插入' : '横向排列') : '直放区');
        els.coldStorageLevelMeta.textContent = (activeLevel.mode === 'rack' ? activeLevel.rackCount + ' 个货架 · 每架 ' : '') + activeLevel.rows + ' 行 × ' + activeLevel.columns + ' 列盒位';
        els.coldStorageMap.classList.toggle('is-rack', activeLevel.mode === 'rack');
        els.coldStorageMap.classList.toggle('vertical-rack', activeLevel.mode === 'rack' && activeUnit.orientation === '竖向');
        els.coldStorageMap.style.cssText = '';
        els.coldStorageMap.innerHTML = coldStorageRacksHtml(activeUnit, activeColdStorageShelf, activeLevel, false);

        els.freezerBoxTabs.innerHTML = visibleBoxes.map(function (box) {
            const count = state.samples.filter(item => item.boxId === box.id).length;
            return '<button class="freezer-box-tab' + (activeBox && box.id === activeBox.id ? ' active' : '') + '" type="button" data-freezer-box="' + esc(box.id) + '"><span><strong>' + esc(box.name) + (box.lastScanPhoto ? ' <em>已扫描</em>' : '') + '</strong><small>' + esc(interfaceText(box.storageLocation)) + contributorInline(box) + '</small></span><b>' + count + ' / ' + (box.rows * box.columns) + '</b></button>';
        }).join('') || '<p class="cold-storage-empty">这一层还没有冻存盒，点击上方空盒位进行放置。</p>';
        els.freezerBoxTitle.textContent = activeBox ? '冻存盒 ' + activeBox.name : '尚未选择冻存盒';
        els.freezerBoxTemperature.textContent = activeBox ? 'FREEZER BOX MAP · ' + activeBox.temperature : 'FREEZER BOX MAP';
        els.freezerBoxLocation.textContent = activeBox ? activeBox.storageLocation + (activeBox.lastScanPhoto ? ' · 最近已完成照片识别' : '') + ' · 点击空位可登记' : '先在设备示意图中放置或选择冻存盒';

        let matrixHtml = '';
        rows.forEach(function (row) {
            for (let column = 1; column <= activeBox.columns; column += 1) {
                const position = row + column;
                const sample = positions.get(position);
                const classes = ['cryo-cell'];
                if (sample) classes.push('occupied');
                if (sample && sample.id === selectedSampleId) classes.push('selected');
                if (!sample) classes.push('empty');
                matrixHtml += '<button class="' + classes.join(' ') + '" type="button"' + (sample ? ' data-sample-id="' + esc(sample.id) + '" aria-label="' + esc(sample.id) + '，位置 ' + position + '"' : ' data-sample-position="' + position + '" aria-label="空位 ' + position + '，点击登记样本" title="点击在 ' + position + ' 登记样本"') + '><span>' + position + '</span></button>';
            }
        });
        const matrix = document.getElementById('cryoMatrix');
        matrix.style.gridTemplateColumns = activeBox ? 'repeat(' + activeBox.columns + ', minmax(24px, 1fr))' : '1fr';
        matrix.innerHTML = matrixHtml || '<button class="empty-card" type="button" data-add="freezer"><strong>＋ 放置冻存盒</strong></button>';

        const selected = boxSamples.find(item => item.id === selectedSampleId) || boxSamples[0];
        selectedSampleId = selected ? selected.id : '';
        const detail = document.getElementById('sampleDetail');
        if (selected) {
            const photo = selected.photoData ? '<img class="sample-record-photo" src="' + selected.photoData + '" alt="' + esc(selected.id) + ' 的录入照片">' : '<div class="sample-vial" data-code="' + esc(selected.id) + '"></div>';
            detail.innerHTML = '<p class="micro-label">SELECTED SAMPLE' + contributorInline(selected) + '</p>' + photo + '<h2>' + esc(selected.type) + '</h2><p>' + esc(selected.id) + ' · ' + esc(selected.status) + '</p><dl class="detail-list"><div><dt>样本来源</dt><dd>' + esc(selected.source) + '</dd></div><div><dt>处理方式</dt><dd>' + esc(selected.processing) + '</dd></div><div><dt>冻存盒位置</dt><dd>' + esc(selected.location) + '</dd></div><div><dt>设备 / 层架</dt><dd>' + esc(activeBox.storageLocation) + '</dd></div><div><dt>入库日期</dt><dd>' + esc(selected.date) + '</dd></div></dl><button class="sample-detail-open" type="button" data-open-sample-detail><span>查看详情、修改与记录</span><b>→</b></button>';
        } else {
            detail.innerHTML = '<p class="search-empty">' + (activeBox ? '这个冻存盒尚未登记样本。可点击左侧空位或使用拍照识别。' : '这一层还没有冻存盒。') + '</p>';
        }

        document.getElementById('sampleTable').innerHTML = items.map(function (item) {
            return '<tr class="clickable-data-row" data-sample-id="' + esc(item.id) + '" tabindex="0" aria-label="查看样本 ' + esc(item.id) + ' 的详细信息"><td><strong>' + esc(item.id) + '</strong>' + (workspaceMode === 'lab' ? '<small>录入 ' + esc(contributorName(item)) + '</small>' : '') + '</td><td>' + esc(item.type) + '</td><td>' + esc(item.source) + '</td><td>' + esc(item.processing) + '</td><td>' + esc(item.location) + '</td><td>' + esc(item.date) + '</td><td><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status) + '</span></td></tr>';
        }).join('') || '<tr><td colspan="7">没有找到匹配的样本记录。</td></tr>';
    }

    function renderProtocols() {
        document.querySelectorAll('[data-protocol-tab]').forEach(function (button) {
            const active = button.dataset.protocolTab === activeProtocolTab;
            button.classList.toggle('active', active);
            button.setAttribute('aria-selected', String(active));
        });
        document.querySelectorAll('[data-protocol-panel]').forEach(function (panel) {
            const active = panel.dataset.protocolPanel === activeProtocolTab;
            panel.classList.toggle('active', active);
            panel.hidden = !active;
        });
        const addProtocolButton = document.getElementById('addProtocolButton');
        if (addProtocolButton) addProtocolButton.hidden = activeProtocolTab !== 'protocols';

        const protocolCount = document.getElementById('protocolCount');
        if (protocolCount) protocolCount.textContent = state.protocols.length;
        document.getElementById('protocolGrid').innerHTML = state.protocols.map(function (item) {
            const usageLabel = item.reagents.length ? item.reagents.length + ' 种试剂已关联' : '未关联库存试剂';
            const literatureBadge = item.literatureTitle || item.literatureId || item.literatureUrl ? '<span class="protocol-reference-badge">文献</span>' : '';
            return '<button class="protocol-card" type="button" data-protocol-id="' + esc(item.id) + '"><span class="protocol-number">' + esc(item.number) + (item.photoData ? ' · 附照片' : '') + contributorInline(item) + literatureBadge + '</span><h2>' + esc(item.title) + '</h2><footer class="protocol-foot"><span>' + esc(item.meta) + '</span><strong>' + esc(usageLabel) + ' →</strong></footer></button>';
        }).join('') || '<div class="empty-card">还没有 Protocol，点击“录入 Protocol”开始建立方案库。</div>';

        const formulationGrid = document.getElementById('formulationGrid');
        if (!formulationGrid) return;
        formulationGrid.innerHTML = state.formulations.map(formulationCardHtml).join('') || '<div class="empty-card">还没有实验配方，点击“新建配方”记录液体、固体、气体或其他配方。</div>';
    }

    function setProtocolTab(tab) {
        activeProtocolTab = tab === 'formulations' ? 'formulations' : 'protocols';
        renderProtocols();
    }

    function formulationPhysicalCode(value) {
        return { '液体': 'LIQ', '固体': 'SOL', '气体': 'GAS', '悬液': 'SUS', '凝胶': 'GEL', '乳液': 'EMU' }[value] || 'MIX';
    }

    function formulationAmountLabel(item) {
        const amount = positiveNumber(item.finalAmount, 0);
        return amount > 0 ? formatQuantity(amount) + (item.unit ? ' ' + item.unit : '') : '未设置';
    }

    function formulationCardHtml(item) {
        return '<button class="formulation-card" type="button" data-formulation-id="' + esc(item.id) + '">' +
            '<header><span class="formulation-form" data-form="' + esc(formulationPhysicalCode(item.physicalForm)) + '">' + esc(item.physicalForm) + '</span><small>' + esc(item.id) + ' · ' + esc(item.version || 'V1.0') + '</small></header>' +
            '<h2>' + esc(item.name) + '</h2><p>' + esc(item.purpose || '用途待补充') + '</p>' +
            '<dl><div><dt>终量</dt><dd>' + esc(formulationAmountLabel(item)) + '</dd></div><div><dt>浓度</dt><dd>' + esc(item.concentration || '—') + '</dd></div></dl>' +
            '<footer><span>' + item.components.length + ' 种组分</span><strong>查看配方 →</strong></footer></button>';
    }

    function openFormulationDetail(id) {
        const formulation = state.formulations.find(item => item.id === id);
        if (!formulation) return;
        prepareRecordDetail('formulation', formulation.id);
        const componentRows = formulation.components.map(function (component) {
            return '<tr><td><strong>' + esc(component.name || '未命名组分') + '</strong></td><td>' + esc(component.amount || '—') + '</td><td>' + esc(component.unit || '—') + '</td></tr>';
        }).join('');
        const nodeField = workspaceMode === 'lab' ? detailFieldHtml('录入节点', contributorName(formulation)) : '';
        els.recordDetailKicker.textContent = 'FORMULATION RECORD · ' + formulation.id;
        els.recordDetailTitle.textContent = formulation.name;
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero formulation-detail-hero"><div><span class="record-detail-code">' + esc(formulation.id) + '</span><h3>' + esc(formulation.name) + '</h3><p>' + esc(formulation.purpose || '用途待补充') + '</p></div><span class="status-chip">' + esc(formulation.physicalForm) + '</span></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">FORMULATION PROFILE</p><h3>配方信息</h3></div><div class="record-detail-grid">' +
                detailFieldHtml('物态 / 形态', formulation.physicalForm) + detailFieldHtml('终量', formulationAmountLabel(formulation)) + detailFieldHtml('目标浓度', formulation.concentration) +
                detailFieldHtml('保存条件', formulation.storage) + detailFieldHtml('版本', formulation.version) + detailFieldHtml('用途', formulation.purpose, true) + nodeField +
            '</div></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">COMPONENTS</p><h3>组成</h3></div>' +
                (componentRows ? '<div class="formulation-component-table"><table><thead><tr><th>组分</th><th>用量</th><th>单位</th></tr></thead><tbody>' + componentRows + '</tbody></table></div>' : '<p class="record-history-empty">尚未记录组分。</p>') +
            '</section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">PREPARATION</p><h3>配制与备注</h3></div><div class="formulation-notes"><div><strong>配制方法</strong><p>' + esc(formulation.preparation || '—') + '</p></div><div><strong>备注</strong><p>' + esc(formulation.notes || '—') + '</p></div></div></section>' +
            recordHistoryHtml(formulation);
        if (!els.recordDetailDialog.open) els.recordDetailDialog.showModal();
    }
    function createBlankPlateLayout() {
        return {
            id: '',
            name: '',
            format: 96,
            experimentId: '',
            protocolId: '',
            wells: {},
            updatedAt: new Date().toISOString()
        };
    }

    function normalizePlateLayout(layout, index) {
        const source = layout && typeof layout === 'object' ? layout : {};
        const allowedFormats = [6, 12, 24, 48, 96, 384];
        const format = allowedFormats.includes(Number(source.format)) ? Number(source.format) : 96;
        return {
            id: String(source.id || 'PLATE-' + String(index + 1).padStart(3, '0')),
            name: String(source.name || '未命名布局'),
            format: format,
            experimentId: String(source.experimentId || ''),
            protocolId: String(source.protocolId || ''),
            wells: source.wells && typeof source.wells === 'object' ? clone(source.wells) : {},
            updatedAt: source.updatedAt || new Date().toISOString()
        };
    }

    function renderResearchTools() {
        if (els.lineageFocus && !els.lineageFocus.options.length) {
            els.lineageFocus.innerHTML = '<option value="all">全部链路</option>';
        }
        if (els.lineageMap && !els.lineageMap.innerHTML.trim()) {
            els.lineageMap.innerHTML = '<div class="tools-empty-state">科研工具正在载入。</div>';
        }
    }
    function toolsEntityKey(type, id) {
        return type + '::' + id;
    }

    function parseToolsEntityKey(value) {
        const split = String(value || '').indexOf('::');
        return split < 0 ? { type: '', id: '' } : { type: value.slice(0, split), id: value.slice(split + 2) };
    }

    function toolsEntityCatalog() {
        const items = [];
        function add(type, id, label, stage, meta) {
            if (!id) return;
            items.push({ key: toolsEntityKey(type, id), type: type, id: String(id), label: String(label || id), stage: stage, meta: String(meta || '') });
        }
        state.mice.forEach(function (item) { add('animal', item.id, item.id, 'origin', [item.species, item.cage].filter(Boolean).join(' · ')); });
        state.plants.forEach(function (item) { add('plant', item.id, item.name || item.id, 'origin', [item.scientificName, item.accession, item.generation].filter(Boolean).join(' · ')); });
        state.microbes.forEach(function (item) { add('microbe', item.id, item.name || item.id, 'origin', [item.species, item.strain].filter(Boolean).join(' · ')); });
        state.plasmids.forEach(function (item) { add('plasmid', item.id, item.name || item.id, 'origin', [item.backbone, item.insert].filter(Boolean).join(' · ')); });
        state.viruses.forEach(function (item) { add('virus', item.id, item.name || item.id, 'origin', [item.virusType, item.serotype].filter(Boolean).join(' · ')); });
        state.cellCultures.forEach(function (item) { add('cell', item.id, item.name || item.id, 'origin', [item.species, item.passage != null ? 'P' + item.passage : ''].filter(Boolean).join(' · ')); });
        state.samples.forEach(function (item) { add('sample', item.id, item.id, 'sample', [item.type, item.source].filter(Boolean).join(' · ')); });
        state.experiments.forEach(function (item) { add('experiment', item.id, item.title || item.id, 'experiment', [item.id, item.date].filter(Boolean).join(' · ')); });
        state.results.forEach(function (item) {
            const experiment = state.experiments.find(function (entry) { return entry.id === item.experimentId; });
            add('result', item.id, (experiment ? experiment.title : item.id) + ' · 结果', 'result', item.date || '');
        });
        return items;
    }

    function toolsEntityTypeLabel(type) {
        return ({ animal: '动物', plant: '植物', microbe: '菌种', plasmid: '质粒', virus: '病毒', cell: '细胞', sample: '样本', experiment: '实验', result: '结果' })[type] || type;
    }

    function lineageEdges(catalog) {
        const valid = new Set(catalog.map(function (item) { return item.key; }));
        const edges = state.lineageLinks.map(function (link) {
            return {
                id: link.id,
                source: toolsEntityKey(link.sourceType, link.sourceId),
                target: toolsEntityKey(link.targetType, link.targetId),
                relation: link.relation || '衍生',
                quantity: link.quantity,
                unit: link.unit || '',
                notes: link.notes || '',
                manual: true
            };
        }).filter(function (edge) { return valid.has(edge.source) && valid.has(edge.target); });
        state.results.forEach(function (result) {
            const source = toolsEntityKey('experiment', result.experimentId);
            const target = toolsEntityKey('result', result.id);
            if (valid.has(source) && valid.has(target) && !edges.some(function (edge) { return edge.source === source && edge.target === target; })) {
                edges.push({ id: 'AUTO-' + result.id, source: source, target: target, relation: '产生结果', manual: false });
            }
        });
        return edges;
    }

    function embeddedLineageHtml(type, id) {
        const currentKey = toolsEntityKey(type, id);
        const catalog = toolsEntityCatalog();
        const entityMap = new Map(catalog.map(function (item) { return [item.key, item]; }));
        const current = entityMap.get(currentKey);
        if (!current) return '';
        const connected = lineageEdges(catalog).filter(function (edge) { return edge.source === currentKey || edge.target === currentKey; });
        const incoming = connected.filter(function (edge) { return edge.target === currentKey; });
        const outgoing = connected.filter(function (edge) { return edge.source === currentKey; });
        function relatedNode(edge, direction) {
            const key = direction === 'incoming' ? edge.source : edge.target;
            const entity = entityMap.get(key);
            if (!entity) return '';
            const remove = edge.manual ? '<button class="embedded-lineage-remove" type="button" data-delete-embedded-lineage="' + esc(edge.id) + '" aria-label="删除谱系关系"></button>' : '';
            return '<div class="embedded-lineage-branch ' + direction + '"><button class="embedded-lineage-node" type="button" data-lineage-entity="' + esc(key) + '"><small>' + esc(toolsEntityTypeLabel(entity.type)) + '</small><strong>' + esc(entity.label) + '</strong><span>' + esc(entity.meta || edge.relation) + '</span></button><i aria-hidden="true"></i><em>' + esc(edge.relation) + '</em>' + remove + '</div>';
        }
        const incomingHtml = incoming.slice(0, 3).map(function (edge) { return relatedNode(edge, 'incoming'); }).join('');
        const outgoingHtml = outgoing.slice(0, 3).map(function (edge) { return relatedNode(edge, 'outgoing'); }).join('');
        const targetOptions = catalog.filter(function (item) { return item.key !== currentKey; }).map(function (item) {
            return '<option value="' + esc(item.key) + '">' + esc(toolsEntityTypeLabel(item.type) + ' · ' + item.label) + '</option>';
        }).join('');
        const editor = workspaceReadOnly ? '' : '<div class="embedded-lineage-editor"><label><span>关联条目</span><select data-lineage-target><option value="">选择已有记录</option>' + targetOptions + '</select></label><label><span>关系</span><select data-lineage-relation><option>取材</option><option>分装</option><option>衍生</option><option>冻存保藏</option><option>用于实验</option><option>产生结果</option><option>其他</option></select></label><button class="button ghost compact" type="button" data-save-lineage-from="' + esc(currentKey) + '">＋ 添加关联</button></div>';
        return '<section class="record-detail-section embedded-lineage-section"><div class="record-detail-section-title"><p class="micro-label">SAMPLE LINEAGE</p><h3>样本谱系</h3></div><div class="embedded-lineage-pan" data-lineage-pan aria-label="可拖动的样本谱系图"><div class="embedded-lineage-flow"><div class="embedded-lineage-side incoming-side">' + incomingHtml + '</div><div class="embedded-lineage-current"><small>' + esc(toolsEntityTypeLabel(current.type)) + '</small><strong>' + esc(current.label) + '</strong><span>' + esc(current.meta || current.id) + '</span></div><div class="embedded-lineage-side outgoing-side">' + outgoingHtml + '</div></div></div>' + (!connected.length ? '<p class="embedded-lineage-empty">暂无关联链路。</p>' : '') + editor + '</section>';
    }

    let embeddedLineageLayoutTimer = 0;
    function scheduleEmbeddedLineageLayout() {
        if (embeddedLineageLayoutTimer) window.clearTimeout(embeddedLineageLayoutTimer);
        embeddedLineageLayoutTimer = window.setTimeout(function () {
            embeddedLineageLayoutTimer = 0;
            document.querySelectorAll('.embedded-lineage-flow').forEach(function (flow) {
                const current = flow.querySelector('.embedded-lineage-current');
                if (!current) return;
                const currentRect = current.getBoundingClientRect();
                if (!currentRect.width) return;
                const currentCenter = currentRect.top + currentRect.height / 2;
                flow.querySelectorAll('.embedded-lineage-branch').forEach(function (branch) {
                    const line = Array.from(branch.children).find(function (child) { return child.tagName === 'I'; });
                    if (!line) return;
                    const lineRect = line.getBoundingClientRect();
                    const delta = Math.round(currentCenter - (lineRect.top + lineRect.height / 2));
                    branch.style.setProperty('--lineage-bend', Math.abs(delta) + 'px');
                    branch.dataset.lineageBend = delta > 2 ? 'source-below' : (delta < -2 ? 'source-above' : 'straight');
                });
            });
        });
    }
    function saveEmbeddedLineage(sourceKey, button) {
        if (denyReadOnlyMutation()) return;
        const section = button.closest('.embedded-lineage-section');
        const source = parseToolsEntityKey(sourceKey);
        const target = parseToolsEntityKey(section.querySelector('[data-lineage-target]').value);
        const relation = section.querySelector('[data-lineage-relation]').value || '衍生';
        if (!source.id || !target.id) {
            showToast('请选择需要关联的记录');
            return;
        }
        const duplicate = state.lineageLinks.some(function (item) {
            return item.sourceType === source.type && item.sourceId === source.id && item.targetType === target.type && item.targetId === target.id;
        });
        if (duplicate) {
            showToast('这条谱系关系已经存在');
            return;
        }
        const link = { id: 'LIN-' + Date.now(), sourceType: source.type, sourceId: source.id, targetType: target.type, targetId: target.id, relation: relation, quantity: '', unit: '', notes: '', date: todayIso() };
        state.lineageLinks.push(link);
        appendAuditLog({ action: 'created', recordType: 'lineage', recordId: link.id, changes: clone(link) });
        saveState();
        refreshActiveRecordDetail();
        showToast('样本谱系关系已保存');
    }

    function deleteEmbeddedLineage(id) {
        if (denyReadOnlyMutation()) return;
        state.lineageLinks = state.lineageLinks.filter(function (item) { return item.id !== id; });
        appendAuditLog({ action: 'deleted', recordType: 'lineage', recordId: id, changes: [] });
        saveState();
        refreshActiveRecordDetail();
        showToast('谱系关系已删除');
    }

    function refreshActiveRecordDetail() {
        if (!activeRecordDetail) return;
        openRecordDetail(activeRecordDetail.type, activeRecordDetail.key);
    }

    function focusedLineageKeys(catalog, edges) {
        if (activeLineageFocus === 'all') return new Set(catalog.map(function (item) { return item.key; }));
        const visible = new Set([activeLineageFocus]);
        let changed = true;
        while (changed) {
            changed = false;
            edges.forEach(function (edge) {
                if (visible.has(edge.source) && !visible.has(edge.target)) { visible.add(edge.target); changed = true; }
                if (visible.has(edge.target) && !visible.has(edge.source)) { visible.add(edge.source); changed = true; }
            });
        }
        return visible;
    }

    function lineageOptionsHtml(catalog, includeAll) {
        const groups = [
            { stage: 'origin', label: '来源：动物、植物、菌、质粒、病毒与细胞' },
            { stage: 'sample', label: '冻存样本' },
            { stage: 'experiment', label: '实验记录' },
            { stage: 'result', label: '实验结果' }
        ];
        let html = includeAll ? '<option value="all">全部链路</option>' : '<option value="">请选择条目</option>';
        groups.forEach(function (group) {
            const members = catalog.filter(function (item) { return item.stage === group.stage; });
            if (!members.length) return;
            html += '<optgroup label="' + esc(group.label) + '">' + members.map(function (item) {
                return '<option value="' + esc(item.key) + '">' + esc(item.label + (item.meta ? ' · ' + item.meta : '')) + '</option>';
            }).join('') + '</optgroup>';
        });
        return html;
    }

    function renderLineageWorkspace() {
        if (!els.lineageMap) return;
        const catalog = toolsEntityCatalog();
        const edges = lineageEdges(catalog);
        const currentFocus = activeLineageFocus;
        els.lineageFocus.innerHTML = lineageOptionsHtml(catalog, true);
        els.lineageFocus.value = catalog.some(function (item) { return item.key === currentFocus; }) ? currentFocus : 'all';
        activeLineageFocus = els.lineageFocus.value;
        const sourceValue = els.lineageSource.value;
        const targetValue = els.lineageTarget.value;
        const entityOptions = lineageOptionsHtml(catalog, false);
        els.lineageSource.innerHTML = entityOptions;
        els.lineageTarget.innerHTML = entityOptions;
        if (catalog.some(function (item) { return item.key === sourceValue; })) els.lineageSource.value = sourceValue;
        if (catalog.some(function (item) { return item.key === targetValue; })) els.lineageTarget.value = targetValue;

        const visibleKeys = focusedLineageKeys(catalog, edges);
        const connectedKeys = new Set();
        edges.forEach(function (edge) { connectedKeys.add(edge.source); connectedKeys.add(edge.target); });
        const visible = catalog.filter(function (item) {
            return visibleKeys.has(item.key) && (activeLineageFocus !== 'all' || connectedKeys.has(item.key));
        });
        if (!visible.length) {
            els.lineageMap.innerHTML = '<div class="tools-empty-state"><strong>尚未建立样本谱系</strong><span>在右侧选择来源与目标条目，保存第一条关系。</span></div>';
        } else {
            const stageOrder = ['origin', 'sample', 'experiment', 'result'];
            const stageLabels = { origin: '来源', sample: '样本', experiment: '实验', result: '结果' };
            const positions = new Map();
            const columns = { origin: 140, sample: 580, experiment: 1020, result: 1460 };
            let maxRows = 1;
            stageOrder.forEach(function (stage) {
                const members = visible.filter(function (item) { return item.stage === stage; });
                maxRows = Math.max(maxRows, members.length);
                members.forEach(function (item, index) { positions.set(item.key, { x: columns[stage], y: 105 + index * 100 }); });
            });
            const height = Math.max(290, 150 + maxRows * 100);
            const visibleEdges = edges.filter(function (edge) { return positions.has(edge.source) && positions.has(edge.target); });
            let svg = '<svg width="1600" height="' + height + '" viewBox="0 0 1600 ' + height + '" role="img" aria-label="样本谱系图"><defs><marker id="lineageArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>';
            stageOrder.forEach(function (stage) { svg += '<text class="lineage-stage-title" x="' + columns[stage] + '" y="35">' + stageLabels[stage] + '</text>'; });
            visibleEdges.forEach(function (edge) {
                const from = positions.get(edge.source); const to = positions.get(edge.target); const mid = (from.x + to.x) / 2;
                svg += '<path class="lineage-edge" d="M ' + (from.x + 100) + ' ' + from.y + ' C ' + mid + ' ' + from.y + ', ' + mid + ' ' + to.y + ', ' + (to.x - 100) + ' ' + to.y + '" marker-end="url(#lineageArrow)"></path>';
                svg += '<text class="lineage-edge-label" x="' + mid + '" y="' + ((from.y + to.y) / 2 - 7) + '" text-anchor="middle">' + esc(edge.relation) + '</text>';
            });
            visible.forEach(function (item) {
                const point = positions.get(item.key);
                svg += '<g class="lineage-node" data-stage="' + item.stage + '" data-lineage-entity="' + esc(item.key) + '" transform="translate(' + (point.x - 100) + ' ' + (point.y - 34) + ')" tabindex="0" role="button"><rect width="200" height="68" rx="8"></rect><text class="lineage-node-type" x="14" y="20">' + esc(toolsEntityTypeLabel(item.type)) + '</text><text class="lineage-node-title" x="14" y="42">' + esc(item.label.slice(0, 20)) + '</text><text class="lineage-node-meta" x="14" y="57">' + esc(item.meta.slice(0, 26)) + '</text><title>' + esc(item.label + ' ' + item.meta) + '</title></g>';
            });
            svg += '</svg>';
            els.lineageMap.innerHTML = svg;
        }
        els.lineageLinkList.innerHTML = state.lineageLinks.slice().reverse().map(function (link) {
            const source = catalog.find(function (item) { return item.key === toolsEntityKey(link.sourceType, link.sourceId); });
            const target = catalog.find(function (item) { return item.key === toolsEntityKey(link.targetType, link.targetId); });
            return '<article><div><strong>' + esc(source ? source.label : link.sourceId) + ' → ' + esc(target ? target.label : link.targetId) + '</strong><span>' + esc(link.relation) + (link.quantity !== '' && link.quantity != null ? ' · ' + formatQuantity(link.quantity) + ' ' + esc(link.unit) : '') + '</span></div><button type="button" data-delete-lineage-link="' + esc(link.id) + '" aria-label="删除关系"></button></article>';
        }).join('') || '<p class="tools-empty-copy">还没有手动建立的关系。</p>';
    }

    function saveLineageRelationship() {
        if (denyReadOnlyMutation()) return;
        const source = parseToolsEntityKey(els.lineageSource.value);
        const target = parseToolsEntityKey(els.lineageTarget.value);
        if (!source.id || !target.id) { showToast('请选择来源条目和目标条目'); return; }
        if (source.type === target.type && source.id === target.id) { showToast('来源与目标不能是同一条记录'); return; }
        if (state.lineageLinks.some(function (item) { return item.sourceType === source.type && item.sourceId === source.id && item.targetType === target.type && item.targetId === target.id; })) { showToast('这条谱系关系已经存在'); return; }
        const link = { id: 'LIN-' + Date.now(), sourceType: source.type, sourceId: source.id, targetType: target.type, targetId: target.id, relation: els.lineageRelation.value || '衍生', quantity: els.lineageQuantity.value === '' ? '' : positiveNumber(els.lineageQuantity.value, 0), unit: els.lineageUnit.value.trim(), notes: els.lineageNotes.value.trim(), date: todayIso() };
        state.lineageLinks.push(link);
        appendAuditLog({ action: 'created', recordType: 'lineage', recordId: link.id, changes: clone(link) });
        saveState();
        els.lineageQuantity.value = ''; els.lineageUnit.value = ''; els.lineageNotes.value = '';
        renderLineageWorkspace();
        showToast('样本谱系关系已保存');
    }

    function openLineageEntity(key) {
        const entity = parseToolsEntityKey(key);
        if (entity.type === 'animal') openAnimalDetail(entity.id);
        else if (entity.type === 'plant') openPlantDetail(entity.id);
        else if (entity.type === 'microbe') openMicrobeDetail(entity.id);
        else if (entity.type === 'plasmid') openPlasmidDetail(entity.id);
        else if (entity.type === 'virus') openVirusDetail(entity.id);
        else if (entity.type === 'cell') openCellDetail(entity.id);
        else if (entity.type === 'sample') openSampleDetail(entity.id);
        else if (entity.type === 'experiment') openExperimentDetail(entity.id);
        else if (entity.type === 'result') {
            const result = state.results.find(function (item) { return item.id === entity.id; });
            if (result) openExperimentDetail(result.experimentId);
        }
    }

    function setToolsTab(tab) {
        activeToolsTab = ['lineage', 'calculators', 'layout'].includes(tab) ? tab : 'lineage';
        document.querySelectorAll('[data-tools-tab]').forEach(function (button) {
            const active = button.dataset.toolsTab === activeToolsTab;
            button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active));
        });
        document.querySelectorAll('[data-tools-panel]').forEach(function (panel) {
            const active = panel.dataset.toolsPanel === activeToolsTab;
            panel.hidden = !active; panel.classList.toggle('active', active);
        });
        if (activeToolsTab === 'lineage') renderLineageWorkspace();
        if (activeToolsTab === 'calculators') renderCalculatorWorkspace();
        if (activeToolsTab === 'layout') renderPlateWorkspace();
    }

    function calculatorValue(id) {
        const input = document.getElementById(id);
        return input ? positiveNumber(input.value, 0) : 0;
    }

    function compactNumber(value, digits) {
        return Number(value || 0).toLocaleString(interfaceLocale(), { maximumFractionDigits: digits == null ? 4 : digits });
    }

    function renderCalculatorWorkspace() {
        if (!els.mastermixRows) return;
        if (!els.mastermixRows.children.length) {
            els.mastermixRows.innerHTML = masterMixRowHtml('2× Master Mix', 10, 'µL') + masterMixRowHtml('Primer mix', 1, 'µL') + masterMixRowHtml('Template', 2, 'µL');
        }
        recalculateResearchTools();
    }

    function masterMixRowHtml(name, amount, unit) {
        return '<div class="mastermix-row"><input data-mix-name type="text" value="' + esc(name || '') + '" placeholder="组分名称"><input data-mix-amount type="number" min="0" step="any" value="' + esc(amount == null ? '' : amount) + '" aria-label="单个反应用量"><input data-mix-unit type="text" value="' + esc(unit || 'µL') + '" aria-label="单位"><button type="button" data-remove-mix-component aria-label="删除组分"></button></div>';
    }

    function recalculateResearchTools() {
        const c1 = calculatorValue('dilutionC1'); const c2 = calculatorValue('dilutionC2'); const v2 = calculatorValue('dilutionV2');
        const volumeUnit = valueOf('dilutionUnit') || 'mL'; const v1 = c1 > 0 ? c2 * v2 / c1 : 0; const diluent = Math.max(0, v2 - v1);
        const dilutionOutput = document.getElementById('dilutionResult');
        if (dilutionOutput) dilutionOutput.innerHTML = c1 > 0 && c2 <= c1 ? '<strong>母液 ' + compactNumber(v1) + ' ' + esc(volumeUnit) + '</strong><span>加入稀释液 ' + compactNumber(diluent) + ' ' + esc(volumeUnit) + '</span>' : '<strong>请检查浓度</strong><span>C1 必须大于或等于 C2</span>';

        const mw = calculatorValue('molarMw'); const concentration = calculatorValue('molarConcentration'); const volume = calculatorValue('molarVolume');
        const concentrationFactors = { M: 1, mM: 0.001, 'µM': 0.000001 }; const volumeFactors = { L: 1, mL: 0.001, 'µL': 0.000001 };
        const massMg = mw * concentration * (concentrationFactors[valueOf('molarConcentrationUnit')] || 1) * volume * (volumeFactors[valueOf('molarVolumeUnit')] || 1) * 1000;
        const molarityOutput = document.getElementById('molarityResult');
        if (molarityOutput) molarityOutput.innerHTML = '<strong>需要 ' + compactNumber(massMg) + ' mg</strong><span>按纯度 100% 计算</span>';

        const perWell = calculatorValue('seedingPerWell'); const wells = Math.max(1, Math.round(calculatorValue('seedingWells'))); const cellConcentration = calculatorValue('seedingConcentration'); const overage = calculatorValue('seedingOverage');
        const totalCells = perWell * wells * (1 + overage / 100); const suspension = cellConcentration > 0 ? totalCells / cellConcentration : 0;
        const seedingOutput = document.getElementById('seedingResult');
        if (seedingOutput) seedingOutput.innerHTML = '<strong>需要 ' + totalCells.toLocaleString(interfaceLocale(), { maximumFractionDigits: 0 }) + ' 个细胞</strong><span>取 ' + compactNumber(suspension) + ' mL 细胞悬液（含 ' + compactNumber(overage, 1) + '% 余量）</span>';

        const reactions = Math.max(1, Math.round(calculatorValue('mixReactionCount'))); const mixOverage = calculatorValue('mixOverage'); const multiplier = reactions * (1 + mixOverage / 100);
        const mixRows = Array.from(document.querySelectorAll('#mastermixRows .mastermix-row'));
        const mixOutput = document.getElementById('mastermixResult');
        if (mixOutput) mixOutput.innerHTML = '<div class="mastermix-result-head"><strong>按 ' + reactions + ' 个反应配制</strong><span>含 ' + compactNumber(mixOverage, 1) + '% 余量</span></div>' + mixRows.map(function (row) {
            const name = row.querySelector('[data-mix-name]').value.trim() || '未命名组分'; const amount = positiveNumber(row.querySelector('[data-mix-amount]').value, 0); const unit = row.querySelector('[data-mix-unit]').value.trim() || 'µL';
            return '<div><span>' + esc(name) + '</span><strong>' + compactNumber(amount * multiplier) + ' ' + esc(unit) + '</strong></div>';
        }).join('');
    }

    function plateDimensions(format) {
        return ({ 6: [2, 3], 12: [3, 4], 24: [4, 6], 48: [6, 8], 96: [8, 12], 384: [16, 24] })[Number(format)] || [8, 12];
    }

    function plateWellIds(format) {
        const dimensions = plateDimensions(format); const ids = [];
        for (let row = 0; row < dimensions[0]; row += 1) for (let column = 1; column <= dimensions[1]; column += 1) ids.push(String.fromCharCode(65 + row) + column);
        return ids;
    }

    function readPlateMetadata() {
        if (!plateDraft) plateDraft = createBlankPlateLayout();
        plateDraft.name = els.plateLayoutName ? els.plateLayoutName.value.trim() : plateDraft.name;
        plateDraft.experimentId = els.plateExperiment ? els.plateExperiment.value : '';
        plateDraft.protocolId = els.plateProtocol ? els.plateProtocol.value : '';
    }

    function renderPlateWorkspace() {
        if (!els.plateMap) return;
        if (activePlateLayoutId) {
            const saved = state.plateLayouts.find(function (item) { return item.id === activePlateLayoutId; });
            if (saved && (!plateDraft || plateDraft.id !== saved.id)) plateDraft = clone(saved);
        }
        if (!plateDraft) plateDraft = createBlankPlateLayout();
        els.plateLayoutList.innerHTML = state.plateLayouts.map(function (layout) {
            const filled = Object.keys(layout.wells || {}).length;
            return '<button type="button" class="plate-layout-item' + (layout.id === activePlateLayoutId ? ' active' : '') + '" data-plate-layout="' + esc(layout.id) + '"><strong>' + esc(layout.name || '未命名布局') + '</strong><span>' + layout.format + ' 孔板 · ' + filled + ' 个已标注孔</span></button>';
        }).join('') || '<p class="tools-empty-copy">还没有保存布局。</p>';
        els.plateLayoutName.value = plateDraft.name || '';
        els.plateFormat.value = String(plateDraft.format || 96);
        els.plateExperiment.innerHTML = '<option value="">不关联实验</option>' + state.experiments.map(function (item) { return '<option value="' + esc(item.id) + '">' + esc(item.title) + '</option>'; }).join('');
        els.plateProtocol.innerHTML = '<option value="">不关联 Protocol</option>' + state.protocols.map(function (item) { return '<option value="' + esc(item.id) + '">' + esc(item.title) + '</option>'; }).join('');
        els.plateExperiment.value = plateDraft.experimentId || '';
        els.plateProtocol.value = plateDraft.protocolId || '';
        renderPlateMap();
        updatePlateMemory();
        els.plateLayoutStatus.textContent = activePlateLayoutId ? '已保存 · ' + new Date(plateDraft.updatedAt).toLocaleString(interfaceLocale()) : '尚未保存';
    }

    function renderPlateMap() {
        const dimensions = plateDimensions(plateDraft.format); const wellIds = plateWellIds(plateDraft.format);
        els.plateMap.style.setProperty('--plate-columns', dimensions[1]);
        els.plateMap.classList.toggle('dense', Number(plateDraft.format) >= 96);
        els.plateMap.innerHTML = wellIds.map(function (id) {
            const data = plateDraft.wells[id] || {}; const selected = selectedPlateWells.has(id);
            const title = [id, data.sample, data.treatment, data.concentration !== '' && data.concentration != null ? data.concentration + ' ' + (data.unit || '') : ''].filter(Boolean).join(' · ');
            return '<button type="button" class="plate-well' + (selected ? ' selected' : '') + (data.sample || data.treatment ? ' assigned' : '') + '" data-plate-well="' + id + '" style="--well-color:' + esc(data.color || '#dce4df') + '" aria-pressed="' + selected + '" title="' + esc(title || id) + '"><span>' + id + '</span><i></i></button>';
        }).join('');
        els.selectedWellCount.textContent = selectedPlateWells.size ? '已选择 ' + selectedPlateWells.size + ' 个孔位' : '未选择孔位';
    }

    function updatePlateMemory() {
        const wells = Object.values(plateDraft.wells || {});
        const samples = Array.from(new Set(wells.map(function (item) { return item.sample; }).filter(Boolean)));
        const treatments = Array.from(new Set(wells.map(function (item) { return item.treatment; }).filter(Boolean)));
        const sampleMemory = document.getElementById('wellSampleMemory'); const treatmentMemory = document.getElementById('wellTreatmentMemory');
        if (sampleMemory) sampleMemory.innerHTML = samples.map(function (value) { return '<option value="' + esc(value) + '">'; }).join('');
        if (treatmentMemory) treatmentMemory.innerHTML = treatments.map(function (value) { return '<option value="' + esc(value) + '">'; }).join('');
    }

    function applyPlateBrush(clear) {
        if (denyReadOnlyMutation()) return;
        if (!selectedPlateWells.size) { showToast('请先选择孔位'); return; }
        selectedPlateWells.forEach(function (id) {
            if (clear) delete plateDraft.wells[id];
            else plateDraft.wells[id] = { sample: valueOf('wellSample'), treatment: valueOf('wellTreatment'), concentration: valueOf('wellConcentration') === '' ? '' : positiveNumber(valueOf('wellConcentration'), 0), unit: valueOf('wellConcentrationUnit'), color: valueOf('wellColor') || '#b8e63b' };
        });
        els.plateLayoutStatus.textContent = '有未保存的修改'; renderPlateMap(); updatePlateMemory();
    }

    function savePlateLayout() {
        if (denyReadOnlyMutation()) return;
        readPlateMetadata();
        if (!plateDraft.name) plateDraft.name = '未命名布局 ' + (state.plateLayouts.length + 1);
        if (!plateDraft.id) plateDraft.id = 'PLATE-' + Date.now();
        plateDraft.updatedAt = new Date().toISOString();
        const saved = normalizePlateLayout(plateDraft, state.plateLayouts.length);
        const index = state.plateLayouts.findIndex(function (item) { return item.id === saved.id; });
        if (index >= 0) state.plateLayouts[index] = clone(saved); else state.plateLayouts.push(clone(saved));
        activePlateLayoutId = saved.id; plateDraft = clone(saved);
        appendAuditLog({ action: index >= 0 ? 'updated' : 'created', recordType: 'plateLayout', recordId: saved.id, changes: { name: saved.name, format: saved.format, wells: Object.keys(saved.wells).length } });
        saveState(); renderPlateWorkspace(); showToast('实验布局已保存');
    }

    function renderResearchTools() {
        setToolsTab(activeToolsTab);
    }

    function beginLineagePan(event) {
        if (event.button !== 0) return;
        const canvas = event.target.closest && event.target.closest('[data-lineage-pan], #lineageMap');
        if (!canvas || event.target.closest('button, a, input, select, textarea, [data-lineage-entity]')) return;
        lineagePan = {
            canvas: canvas,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            scrollLeft: canvas.scrollLeft,
            scrollTop: canvas.scrollTop
        };
        canvas.classList.add('is-panning');
        if (typeof canvas.setPointerCapture === 'function') {
            try { canvas.setPointerCapture(event.pointerId); } catch (error) { /* capture is optional */ }
        }
        event.preventDefault();
    }

    function moveLineagePan(event) {
        if (!lineagePan || event.pointerId !== lineagePan.pointerId) return;
        lineagePan.canvas.scrollLeft = lineagePan.scrollLeft - (event.clientX - lineagePan.startX);
        lineagePan.canvas.scrollTop = lineagePan.scrollTop - (event.clientY - lineagePan.startY);
        event.preventDefault();
    }

    function endLineagePan(event) {
        if (!lineagePan || (event.pointerId != null && event.pointerId !== lineagePan.pointerId)) return;
        const canvas = lineagePan.canvas;
        canvas.classList.remove('is-panning');
        if (typeof canvas.releasePointerCapture === 'function') {
            try { canvas.releasePointerCapture(lineagePan.pointerId); } catch (error) { /* capture is optional */ }
        }
        lineagePan = null;
    }
    function bindResearchToolsEvents() {
        document.addEventListener('click', function (event) {
            const embeddedSave = event.target.closest('[data-save-lineage-from]');
            if (embeddedSave) { saveEmbeddedLineage(embeddedSave.dataset.saveLineageFrom, embeddedSave); return; }
            const embeddedDelete = event.target.closest('[data-delete-embedded-lineage]');
            if (embeddedDelete) { deleteEmbeddedLineage(embeddedDelete.dataset.deleteEmbeddedLineage); return; }
            const tab = event.target.closest('[data-tools-tab]');
            if (tab) { setToolsTab(tab.dataset.toolsTab); return; }
            const node = event.target.closest('[data-lineage-entity]');
            if (node) { openLineageEntity(node.dataset.lineageEntity); return; }
            if (event.target.closest('#saveLineageLink')) { saveLineageRelationship(); return; }
            const deleteLink = event.target.closest('[data-delete-lineage-link]');
            if (deleteLink) { if (denyReadOnlyMutation(event)) return; state.lineageLinks = state.lineageLinks.filter(function (item) { return item.id !== deleteLink.dataset.deleteLineageLink; }); saveState(); renderLineageWorkspace(); showToast('谱系关系已删除'); return; }
            if (event.target.closest('[data-add-mix-component]')) { els.mastermixRows.insertAdjacentHTML('beforeend', masterMixRowHtml('', '', 'µL')); recalculateResearchTools(); return; }
            const removeMix = event.target.closest('[data-remove-mix-component]');
            if (removeMix) { const row = removeMix.closest('.mastermix-row'); if (row) row.remove(); recalculateResearchTools(); return; }
            const layout = event.target.closest('[data-plate-layout]');
            if (layout) { activePlateLayoutId = layout.dataset.plateLayout; plateDraft = clone(state.plateLayouts.find(function (item) { return item.id === activePlateLayoutId; }) || createBlankPlateLayout()); selectedPlateWells.clear(); renderPlateWorkspace(); return; }
            if (event.target.closest('#newPlateLayout')) { activePlateLayoutId = ''; plateDraft = createBlankPlateLayout(); selectedPlateWells.clear(); renderPlateWorkspace(); return; }
            if (event.target.closest('#savePlateLayout')) { savePlateLayout(); return; }
            if (event.target.closest('[data-delete-plate-layout]')) { if (denyReadOnlyMutation(event)) return; if (!activePlateLayoutId) { showToast('当前布局尚未保存'); return; } if (!window.confirm('确认删除当前实验布局？')) return; state.plateLayouts = state.plateLayouts.filter(function (item) { return item.id !== activePlateLayoutId; }); saveState(); activePlateLayoutId = state.plateLayouts[0] ? state.plateLayouts[0].id : ''; plateDraft = activePlateLayoutId ? clone(state.plateLayouts[0]) : createBlankPlateLayout(); selectedPlateWells.clear(); renderPlateWorkspace(); return; }
            if (event.target.closest('[data-clear-well-selection]')) { selectedPlateWells.clear(); renderPlateMap(); return; }
            if (event.target.closest('[data-apply-well-brush]')) { applyPlateBrush(false); return; }
            if (event.target.closest('[data-clear-selected-wells]')) { applyPlateBrush(true); return; }
            const well = event.target.closest('[data-plate-well]');
            if (well) { const id = well.dataset.plateWell; if (event.shiftKey && selectedPlateWells.size) { const all = plateWellIds(plateDraft.format); const previous = all.indexOf(Array.from(selectedPlateWells).pop()); const current = all.indexOf(id); all.slice(Math.min(previous, current), Math.max(previous, current) + 1).forEach(function (entry) { selectedPlateWells.add(entry); }); } else if (selectedPlateWells.has(id)) selectedPlateWells.delete(id); else selectedPlateWells.add(id); renderPlateMap(); return; }
        });
        document.addEventListener('input', function (event) {
            if (event.target.closest('[data-calculator]')) recalculateResearchTools();
            if (event.target.closest('.plate-editor-toolbar') || event.target.closest('.well-brush-panel')) { if (els.plateLayoutStatus) els.plateLayoutStatus.textContent = '有未保存的修改'; }
        });
        document.addEventListener('change', function (event) {
            if (event.target === els.lineageFocus) { activeLineageFocus = els.lineageFocus.value; renderLineageWorkspace(); return; }
            if (event.target === els.plateFormat) { readPlateMetadata(); plateDraft.format = Number(els.plateFormat.value); const valid = new Set(plateWellIds(plateDraft.format)); Object.keys(plateDraft.wells).forEach(function (id) { if (!valid.has(id)) delete plateDraft.wells[id]; }); selectedPlateWells.clear(); renderPlateMap(); els.plateLayoutStatus.textContent = '有未保存的修改'; return; }
            if (event.target.closest('[data-calculator]')) recalculateResearchTools();
        });
        document.addEventListener('keydown', function (event) {
            const node = event.target.closest && event.target.closest('[data-lineage-entity]');
            if (node && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openLineageEntity(node.dataset.lineageEntity); }
        });
        if (els.plateMap) {
            els.plateMap.addEventListener('pointerdown', function (event) {
                const well = event.target.closest('[data-plate-well]');
                if (!well) return;
                platePointerDown = true;
                els.plateMap.dataset.paintMode = selectedPlateWells.has(well.dataset.plateWell) ? 'remove' : 'add';
                if (typeof els.plateMap.setPointerCapture === 'function') {
                    try { els.plateMap.setPointerCapture(event.pointerId); } catch (error) { /* capture is optional */ }
                }
            });
            els.plateMap.addEventListener('pointerover', function (event) {
                if (!platePointerDown) return;
                const well = event.target.closest('[data-plate-well]');
                if (!well) return;
                if (els.plateMap.dataset.paintMode === 'remove') selectedPlateWells.delete(well.dataset.plateWell);
                else selectedPlateWells.add(well.dataset.plateWell);
                renderPlateMap();
            });
        }
        if (els.recordDetailBody && typeof MutationObserver !== 'undefined') {
            const embeddedLineageObserver = new MutationObserver(function (records) {
                const hasLineageChange = records.some(function (record) {
                    return Array.from(record.addedNodes).some(function (node) {
                        return node.nodeType === 1 && (node.matches('.embedded-lineage-section') || node.querySelector('.embedded-lineage-section'));
                    });
                });
                if (hasLineageChange) scheduleEmbeddedLineageLayout();
            });
            embeddedLineageObserver.observe(els.recordDetailBody, { childList: true, subtree: true });
        }
        window.addEventListener('resize', scheduleEmbeddedLineageLayout);
        document.addEventListener('pointerdown', beginLineagePan);
        document.addEventListener('pointermove', moveLineagePan);
        document.addEventListener('pointerup', function (event) { platePointerDown = false; endLineagePan(event); });
        document.addEventListener('pointercancel', endLineagePan);
    }

    function renderSchedule() {
        const selectedIso = toIsoDate(calendarDate);
        const dayTasks = state.schedule.filter(item => item.date === selectedIso).sort(byTime);
        const timedTasks = dayTasks.filter(hasScheduleTime);
        const untimedTasks = dayTasks.filter(function (item) { return !hasScheduleTime(item); });
        document.querySelectorAll('[data-calendar-mode]').forEach(function (button) {
            button.classList.toggle('active', button.dataset.calendarMode === calendarMode);
        });
        els.calendarDayView.hidden = calendarMode !== 'day';
        els.calendarMonthView.hidden = calendarMode !== 'month';
        els.calendarDayView.classList.toggle('active', calendarMode === 'day');
        els.calendarMonthView.classList.toggle('active', calendarMode === 'month');

        if (calendarMode === 'day') {
            els.calendarPeriodLabel.textContent = formatFullDate(calendarDate);
            document.getElementById('scheduleDateTitle').textContent = formatFullDate(calendarDate) + ' · ' + dayTasks.length + ' 项安排';
        } else {
            els.calendarPeriodLabel.textContent = calendarDate.getFullYear() + ' 年 ' + (calendarDate.getMonth() + 1) + ' 月';
        }

        let gridHtml = '';
        const startMinutes = 8 * 60;
        const slotCount = 24;
        if (els.untimedScheduleList) {
            els.untimedScheduleList.hidden = untimedTasks.length === 0;
            els.untimedScheduleList.innerHTML = untimedTasks.length ? '<header><span>UNSCHEDULED</span><strong>无固定时间</strong></header><div>' + untimedTasks.map(scheduleItemHtml).join('') + '</div>' : '';
        }
        const overlapLayout = calculateScheduleOverlap(timedTasks);
        for (let index = 0; index < slotCount; index += 1) {
            const time = minutesToTime(startMinutes + index * 30);
            const label = index % 2 === 0 ? time : '';
            gridHtml += '<time class="calendar-time-label" style="grid-row:' + (index + 1) + '">' + label + '</time><button class="calendar-time-slot" type="button" style="grid-row:' + (index + 1) + '" data-calendar-slot="' + index + '" data-time="' + time + '" aria-label="' + time + ' 开始的空白时间段"></button>';
        }
        timedTasks.forEach(function (item) {
            const start = Math.max(0, Math.min(slotCount - 1, Math.floor((timeToMinutes(item.time) - startMinutes) / 30)));
            const end = Math.max(start + 1, Math.min(slotCount, Math.ceil((timeToMinutes(item.end) - startMinutes) / 30)));
            const span = Math.max(1, end - start);
            const protocol = state.protocols.find(entry => entry.id === item.protocolId);
            const placement = overlapLayout.get(item.id) || { index: 0, count: 1 };
            const left = placement.index / placement.count * 100;
            const width = 100 / placement.count;
            const runButton = scheduleRunButtonHtml(item, protocol, true);
            gridHtml += '<article class="schedule-block ' + esc(item.type) + (item.done ? ' done' : '') + '" data-task-id="' + esc(item.id) + '" style="grid-row:' + (start + 1) + ' / span ' + span + ';--event-left:' + left.toFixed(4) + '%;--event-width:' + width.toFixed(4) + '%" data-overlap-count="' + placement.count + '"><div class="schedule-block-copy"><strong>' + esc(item.title) + '</strong><small>' + esc(item.time) + '–' + esc(item.end) + ' · ' + esc(protocol ? protocol.title : item.resource) + contributorInline(item) + '</small></div><div class="schedule-block-actions">' + runButton + '<button class="schedule-edit-button" type="button" data-edit-task="' + esc(item.id) + '" aria-label="编辑日程" title="编辑日程">✎</button><button class="schedule-delete-button" type="button" data-delete-task="' + esc(item.id) + '" aria-label="删除日程" title="删除日程"></button><button class="schedule-check-button" type="button" data-task-check="' + esc(item.id) + '" aria-label="' + (item.done ? '标记为未完成' : '标记为完成') + '" title="' + (item.done ? '取消完成' : '标记完成') + '">' + (item.done ? '✓' : '○') + '</button></div></article>';
        });
        document.getElementById('dayTimeline').innerHTML = gridHtml;

        renderMonthCalendar();

        document.getElementById('facilityLoads').innerHTML = facilityLoads.map(function (item) {
            const activeSegments = Math.round(item.value / 10);
            const segments = Array.from({ length: 10 }, (_, index) => '<i class="' + (index < activeSegments ? 'active' : '') + '"></i>').join('');
            return '<div class="load-item"><header><span>' + esc(item.name) + '</span><span>' + item.value + '%</span></header><div class="load-track ' + (item.value >= 85 ? 'high' : '') + '">' + segments + '</div></div>';
        }).join('');
    }

    function calculateScheduleOverlap(tasks) {
        const placements = new Map();
        const sorted = tasks.map(function (task) {
            return { id: task.id, start: timeToMinutes(task.time), end: timeToMinutes(task.end) };
        }).sort(function (left, right) { return left.start - right.start || left.end - right.end; });
        let cluster = [];
        let clusterEnd = -1;

        function flushCluster() {
            if (!cluster.length) return;
            const columnEnds = [];
            cluster.forEach(function (item) {
                let column = columnEnds.findIndex(function (end) { return end <= item.start; });
                if (column < 0) column = columnEnds.length;
                columnEnds[column] = item.end;
                item.column = column;
            });
            const count = Math.max(1, columnEnds.length);
            cluster.forEach(function (item) { placements.set(item.id, { index: item.column, count: count }); });
            cluster = [];
            clusterEnd = -1;
        }

        sorted.forEach(function (item) {
            if (cluster.length && item.start >= clusterEnd) flushCluster();
            cluster.push(item);
            clusterEnd = Math.max(clusterEnd, item.end);
        });
        flushCluster();
        return placements;
    }

    function renderMonthCalendar() {
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const first = new Date(year, month, 1);
        const offset = (first.getDay() + 6) % 7;
        const gridStart = new Date(year, month, 1 - offset);
        const selectedIso = toIsoDate(calendarDate);
        const today = todayIso();
        let html = '';
        for (let index = 0; index < 42; index += 1) {
            const date = addDays(gridStart, index);
            const iso = toIsoDate(date);
            const tasks = state.schedule.filter(item => item.date === iso).sort(byTime);
            const classes = ['month-day'];
            if (date.getMonth() !== month) classes.push('outside');
            if (iso === selectedIso) classes.push('selected');
            if (iso === today) classes.push('today');
            const chips = tasks.slice(0, 3).map(function (task) {
                return '<span class="month-task ' + esc(task.type) + (task.done ? ' done' : '') + '"><i></i>' + esc(scheduleTimeLabel(task)) + ' ' + esc(task.title) + '</span>';
            }).join('');
            const more = tasks.length > 3 ? '<small>+' + (tasks.length - 3) + ' 项</small>' : '';
            html += '<button class="' + classes.join(' ') + '" type="button" data-calendar-date="' + iso + '"><time>' + date.getDate() + '</time><div>' + chips + more + '</div></button>';
        }
        els.monthCalendarGrid.innerHTML = html;

        const selectedTasks = state.schedule.filter(item => item.date === selectedIso).sort(byTime);
        els.monthAgendaTitle.textContent = formatShortDate(calendarDate) + ' · ' + selectedTasks.length + ' 项日程';
        els.monthAgendaList.innerHTML = selectedTasks.map(scheduleItemHtml).join('') || '<p class="month-empty">这一天还没有安排。</p>';
    }

    function scheduleItemHtml(item) {
        const protocol = state.protocols.find(entry => entry.id === item.protocolId);
        return '<article class="today-item ' + (item.done ? 'done' : '') + '" data-task-id="' + esc(item.id) + '"><time>' + esc(scheduleTimeLabel(item)) + '</time><i class="task-marker ' + esc(item.type) + '"></i><div><strong>' + esc(item.title) + '</strong><small>' + esc(item.resource) + contributorInline(item) + '</small></div><div class="today-item-actions">' + scheduleRunButtonHtml(item, protocol, false) + '<button class="schedule-edit-button" type="button" data-edit-task="' + esc(item.id) + '" aria-label="编辑日程" title="编辑日程">✎</button><button class="schedule-delete-button" type="button" data-delete-task="' + esc(item.id) + '" aria-label="删除日程" title="删除日程"></button><button class="task-check" type="button" data-task-check="' + esc(item.id) + '" aria-label="' + (item.done ? '标记为未完成' : '标记为完成') + '" title="' + (item.done ? '取消完成' : '标记完成') + '"></button></div></article>';
    }

    function scheduleRunButtonHtml(item, protocol, compact) {
        if (item.done || !protocol || !Array.isArray(protocol.steps) || !protocol.steps.length) return '';
        const experiment = state.experiments.find(entry => entry.id === item.experimentId);
        const resumable = Boolean(experiment && experiment.runSession && !experiment.runSession.finishedAt && experiment.runSession.protocolId === protocol.id);
        const label = resumable ? '继续' : '开始';
        return '<button class="schedule-run-button' + (compact ? ' compact' : '') + '" type="button" data-start-scheduled-experiment="' + esc(item.id) + '" aria-label="' + (resumable ? '继续实验' : '开始实验') + '"><span aria-hidden="true">' + (resumable ? '↻' : '▶') + '</span><b>' + label + '</b></button>';
    }

    function toggleTask(id) {
        const task = state.schedule.find(item => item.id === id);
        if (!task) return;
        task.done = !task.done;
        saveState();
        renderAll();
        showToast(task.done ? (task.protocolId ? '任务已完成，理论试剂余量已更新' : '任务已完成') : (task.protocolId ? '任务已恢复，理论试剂余量已回滚' : '任务已恢复'));
    }

    function setCalendarMode(mode) {
        if (!['day', 'month'].includes(mode)) return;
        calendarMode = mode;
        localStorage.setItem('rhineLabCalendarMode', mode);
        renderSchedule();
    }

    function navigateCalendar(direction) {
        if (direction === 'today') {
            calendarDate = parseLocalDate(todayIso());
        } else if (calendarMode === 'month') {
            calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + (direction === 'next' ? 1 : -1), 1, 12);
        } else {
            calendarDate = addDays(calendarDate, direction === 'next' ? 1 : -1);
        }
        renderSchedule();
    }

    function beginScheduleDrag(event) {
        if (denyReadOnlyMutation(event)) return;
        if (event.target.closest('[data-task-check], [data-start-scheduled-experiment], [data-edit-task], [data-delete-task]') || event.button !== 0 || calendarMode !== 'day') return;
        const slotIndex = scheduleSlotIndexFromPointer(event);
        if (slotIndex < 0) return;
        event.preventDefault();
        scheduleDrag = { startIndex: slotIndex, currentIndex: slotIndex };
        document.getElementById('dayTimeline').classList.add('dragging');
        highlightScheduleDrag();
    }

    function updateScheduleDrag(event) {
        if (!scheduleDrag) return;
        scheduleDragPointer = { target: event.target, clientY: event.clientY };
        if (scheduleDragFrame) return;
        scheduleDragFrame = window.requestAnimationFrame(flushScheduleDrag);
    }

    function flushScheduleDrag() {
        scheduleDragFrame = 0;
        if (!scheduleDrag || !scheduleDragPointer) return;
        const slotIndex = scheduleSlotIndexFromPointer(scheduleDragPointer);
        scheduleDragPointer = null;
        if (slotIndex < 0) return;
        if (slotIndex === scheduleDrag.currentIndex) return;
        scheduleDrag.currentIndex = slotIndex;
        highlightScheduleDrag();
    }

    function finishScheduleDrag() {
        if (!scheduleDrag) return;
        if (scheduleDragFrame) {
            window.cancelAnimationFrame(scheduleDragFrame);
            scheduleDragFrame = 0;
            flushScheduleDrag();
        }
        const first = Math.min(scheduleDrag.startIndex, scheduleDrag.currentIndex);
        const last = Math.max(scheduleDrag.startIndex, scheduleDrag.currentIndex);
        const start = minutesToTime(8 * 60 + first * 30);
        const end = minutesToTime(8 * 60 + (last + 1) * 30);
        pendingTaskDefaults = { date: toIsoDate(calendarDate), time: start, end: end };
        scheduleDrag = null;
        scheduleDragPointer = null;
        document.getElementById('dayTimeline').classList.remove('dragging');
        document.querySelectorAll('[data-calendar-slot].selecting').forEach(item => item.classList.remove('selecting'));
        window.setTimeout(function () { openEntryDialog('task'); }, 0);
    }

    function scheduleSlotIndexFromPointer(event) {
        const timeline = document.getElementById('dayTimeline');
        if (!timeline || !timeline.contains(event.target)) return -1;
        const directSlot = event.target.closest('[data-calendar-slot]');
        if (directSlot) return Number(directSlot.dataset.calendarSlot);
        const rect = timeline.getBoundingClientRect();
        const y = event.clientY - rect.top - 16;
        return Math.max(0, Math.min(23, Math.floor(y / 32)));
    }

    function highlightScheduleDrag() {
        const first = Math.min(scheduleDrag.startIndex, scheduleDrag.currentIndex);
        const last = Math.max(scheduleDrag.startIndex, scheduleDrag.currentIndex);
        document.querySelectorAll('[data-calendar-slot]').forEach(function (slot) {
            const index = Number(slot.dataset.calendarSlot);
            slot.classList.toggle('selecting', index >= first && index <= last);
        });
    }

    function protocolLiteratureHtml(protocol) {
        const title = String(protocol.literatureTitle || '').trim();
        const citation = String(protocol.literatureCitation || '').trim();
        const identifier = String(protocol.literatureId || '').trim();
        const suppliedUrl = String(protocol.literatureUrl || '').trim();
        if (!title && !citation && !identifier && !suppliedUrl) return '';
        let referenceUrl = /^https?:\/\//i.test(suppliedUrl) ? suppliedUrl : '';
        if (!referenceUrl && /^10\.\d{4,9}\//i.test(identifier)) referenceUrl = 'https://doi.org/' + identifier;
        if (!referenceUrl && /^(?:PMID\s*)?\d+$/i.test(identifier)) referenceUrl = 'https://pubmed.ncbi.nlm.nih.gov/' + identifier.replace(/\D/g, '') + '/';
        const action = referenceUrl ? '<a class="protocol-literature-link" href="' + esc(referenceUrl) + '" target="_blank" rel="noopener noreferrer">查看原文 ↗</a>' : '';
        return '<section class="protocol-literature-card"><header><div><p class="micro-label">RELATED LITERATURE</p><h3>关联文献</h3></div>' + action + '</header><strong>' + esc(title || identifier || '未命名文献') + '</strong>' + (citation ? '<p>' + esc(citation) + '</p>' : '') + (identifier ? '<code>' + esc(identifier) + '</code>' : '') + '</section>';
    }
    function openProtocolDetail(id) {
        const protocol = state.protocols.find(item => item.id === id);
        if (!protocol) return;
        activeProtocolId = protocol.id;
        const linked = state.schedule.filter(item => item.protocolId === protocol.id);
        const completed = linked.filter(item => item.done);
        const perRunSuffix = interfaceText('/ 次');
        const reagentRows = protocol.reagents.map(function (usage) {
            const reagent = state.reagents.find(item => item.catalog === usage.catalog);
            if (!reagent) return '<tr><td>' + esc(usage.catalog) + '</td><td>' + formatQuantity(usage.amount) + ' ' + perRunSuffix + '</td><td>库存未登记</td></tr>';
            return '<tr><td><strong>' + esc(reagent.name) + '</strong><small>' + esc(reagent.catalog) + '</small></td><td>' + formatQuantity(usage.amount) + ' ' + esc(reagent.unit) + ' ' + perRunSuffix + '</td><td>' + formatQuantity(getTheoreticalRemaining(reagent)) + ' ' + esc(reagent.unit) + '</td></tr>';
        }).join('');
        const protocolPhoto = protocol.photoData ? '<figure class="record-detail-photo protocol-source-photo"><img src="' + esc(protocol.photoData) + '" alt="' + esc(protocol.title) + ' 的原始方案照片"><figcaption>录入 Protocol 时保留的原始照片</figcaption></figure>' : '';
        const protocolLiterature = protocolLiteratureHtml(protocol);
        els.protocolDetailNumber.textContent = protocol.number + (workspaceMode === 'lab' ? ' · 录入 ' + contributorName(protocol) : '');
        els.protocolDetailTitle.textContent = protocol.title;
        els.protocolDetailBody.innerHTML = protocolPhoto + protocolLiterature + '<section><p class="micro-label">PROCEDURE MAP</p><h3>实验流程图</h3>' + protocolFlowHtml(protocol.steps) + '</section><section><p class="micro-label">REAGENT USAGE</p><h3>试剂用量</h3>' + (reagentRows ? '<div class="protocol-usage-table"><table><thead><tr><th>试剂</th><th>试剂用量</th><th>库存余量</th></tr></thead><tbody>' + reagentRows + '</tbody></table></div>' : '<p class="protocol-no-reagent">此 Protocol 尚未关联库存试剂。</p>') + '</section>' + recordHistoryHtml(protocol);
        els.protocolDetailUsage.textContent = interfaceLocale() === 'en-US' ? linked.length + ' scheduled ' + (linked.length === 1 ? 'item' : 'items') + ' linked · ' + completed.length + ' completed ' + (completed.length === 1 ? 'run' : 'runs') : '已关联 ' + linked.length + ' 项日程 · 已完成 ' + completed.length + ' 次';
        els.protocolDetailDialog.showModal();
    }

    function protocolFlowHtml(steps) {
        const items = Array.isArray(steps) ? steps.filter(Boolean) : [];
        if (!items.length) return '<p class="protocol-no-reagent">此 Protocol 尚未录入实验步骤。</p>';

        return '<div class="protocol-step-path">' + items.map(function (step) {
            return '<article class="protocol-step-item"><i aria-hidden="true"></i><p>' + esc(step) + '</p></article>';
        }).join('') + '</div>';
    }

    function openExperimentDetail(id) {
        const experiment = state.experiments.find(item => item.id === id);
        if (!experiment) return;
        activeExperimentId = experiment.id;
        els.experimentDetailNumber.textContent = experiment.id + ' · ' + experiment.project + (workspaceMode === 'lab' ? ' · 录入 ' + contributorName(experiment) : '');
        els.experimentDetailTitle.textContent = experiment.title;
        const hasPresetStatus = Array.from(els.experimentDetailStatus.options).some(function (option) { return option.value === experiment.status; });
        els.experimentDetailStatus.value = hasPresetStatus ? experiment.status : '__custom__';
        toggleCustomSelectInput(els.experimentDetailStatus, hasPresetStatus ? '' : experiment.status, false);
        els.experimentDetailDescription.value = experiment.description || '';
        els.experimentDetailProtocol.innerHTML = ['<option value="">不关联 Protocol</option>'].concat(state.protocols.map(function (protocol) {
            return '<option value="' + esc(protocol.id) + '"' + (protocol.id === experiment.protocolId ? ' selected' : '') + '>' + esc(protocol.title) + ' · ' + esc(protocol.id) + '</option>';
        })).join('');
        renderExperimentUsageRows(getEffectiveExperimentUsage(experiment));
        if (experiment.photoData) {
            els.experimentPhotoPanel.hidden = false;
            els.experimentPhotoPanel.innerHTML = '<div><p class="micro-label">ATTACHED PHOTO</p><h3>本次实验照片</h3></div><img src="' + experiment.photoData + '" alt="' + esc(experiment.title) + ' 的实验照片">';
        } else {
            els.experimentPhotoPanel.hidden = true;
            els.experimentPhotoPanel.innerHTML = '';
        }
        renderExperimentResultSection(experiment);
        els.experimentHistorySection.innerHTML = recordHistoryHtml(experiment);
        updateExperimentUsageSource();
        if (!els.experimentDetailDialog.open) els.experimentDetailDialog.showModal();
    }

    function renderExperimentResultSection(experiment) {
        if (!els.experimentResultSection) return;
        els.experimentResultSection.innerHTML = experimentResultInlineHtml(experiment, true);
    }

    function getEffectiveExperimentUsage(experiment) {
        if (experiment.usageOverridden) return clone(experiment.reagentUsage || []);
        if (Array.isArray(experiment.reagentUsage) && experiment.reagentUsage.length) return clone(experiment.reagentUsage);
        return getProtocolDefaultUsage(experiment.protocolId);
    }

    function getProtocolDefaultUsage(protocolId) {
        const protocol = state.protocols.find(item => item.id === protocolId);
        return protocol ? clone(protocol.reagents) : [];
    }

    function renderExperimentUsageRows(usages) {
        els.experimentUsageRows.innerHTML = (usages || []).map(experimentReagentRowHtml).join('');
    }

    function experimentReagentRowHtml(usage) {
        const selectedCatalog = usage && usage.catalog ? usage.catalog : (state.reagents[0] ? state.reagents[0].catalog : '');
        const amount = usage && usage.amount != null ? usage.amount : 1;
        const options = state.reagents.map(function (reagent) {
            return '<option value="' + esc(reagent.catalog) + '"' + (reagent.catalog === selectedCatalog ? ' selected' : '') + '>' + esc(reagent.name) + ' · ' + esc(reagent.catalog) + ' · ' + esc(reagent.unit) + '</option>';
        }).join('');
        return '<div class="experiment-reagent-row"><select name="actualReagentCatalog" aria-label="本次使用试剂">' + options + '</select><input name="actualReagentAmount" type="number" min="0.001" step="0.001" value="' + esc(amount) + '" aria-label="本次实际用量"><span>库存单位</span><button type="button" data-remove-experiment-reagent aria-label="移除本次试剂"></button></div>';
    }

    function readExperimentUsageRows() {
        const usageMap = new Map();
        els.experimentUsageRows.querySelectorAll('.experiment-reagent-row').forEach(function (row) {
            const catalog = row.querySelector('[name="actualReagentCatalog"]').value;
            const amount = positiveNumber(row.querySelector('[name="actualReagentAmount"]').value, 0);
            if (catalog && amount > 0) usageMap.set(catalog, roundQuantity((usageMap.get(catalog) || 0) + amount));
        });
        return Array.from(usageMap, function (entry) { return { catalog: entry[0], amount: entry[1] }; });
    }

    function applyProtocolDefaultsToExperimentEditor(protocolId) {
        renderExperimentUsageRows(getProtocolDefaultUsage(protocolId));
        updateExperimentUsageSource();
    }

    function usageSetsEqual(left, right) {
        const normalize = function (items) {
            return (items || []).map(item => item.catalog + ':' + roundQuantity(item.amount)).sort().join('|');
        };
        return normalize(left) === normalize(right);
    }

    function updateExperimentUsageSource() {
        const current = readExperimentUsageRows();
        const protocolId = els.experimentDetailProtocol.value;
        const defaults = getProtocolDefaultUsage(protocolId);
        const matches = usageSetsEqual(current, defaults);
        if (!protocolId) {
            els.experimentUsageSource.textContent = current.length ? '本次手动记录' : '未关联 Protocol';
            els.experimentUsageSource.classList.toggle('modified', current.length > 0);
            return;
        }
        els.experimentUsageSource.textContent = matches ? '按 Protocol 默认' : '本次用量已调整';
        els.experimentUsageSource.classList.toggle('modified', !matches);
    }

    function saveExperimentDetail(event) {
        event.preventDefault();
        if (denyReadOnlyMutation()) return;
        const experiment = state.experiments.find(item => item.id === activeExperimentId);
        if (!experiment) return;
        const before = clone(experiment);
        const usage = readExperimentUsageRows();
        const defaults = getProtocolDefaultUsage(els.experimentDetailProtocol.value);
        experiment.status = els.experimentDetailStatus.value === '__custom__'
            ? document.getElementById('experimentDetailStatusCustom').value.trim()
            : els.experimentDetailStatus.value;
        if (!experiment.status) {
            showToast('请填写自定义选项内容');
            return;
        }
        experiment.progress = experiment.status === '已完成' ? 100 : experiment.status === '待分析' ? Math.max(80, experiment.progress || 0) : Math.min(79, experiment.progress || 40);
        experiment.protocolId = els.experimentDetailProtocol.value;
        experiment.description = els.experimentDetailDescription.value.trim();
        experiment.reagentUsage = usage;
        experiment.usageOverridden = !usageSetsEqual(usage, defaults);
        const detailChanges = [
            { field: 'status', label: '记录状态', from: before.status, to: experiment.status },
            { field: 'protocolId', label: '关联 Protocol', from: before.protocolId, to: experiment.protocolId },
            { field: 'description', label: '本次记录与备注', from: before.description, to: experiment.description },
            { field: 'reagentUsage', label: '本次试剂用量', from: historyFieldValue('reagents', before.reagentUsage), to: historyFieldValue('reagents', experiment.reagentUsage) }
        ].filter(change => String(change.from || '') !== String(change.to || ''));
        if (!detailChanges.length) {
            showToast('没有检测到需要保存的修改');
            return;
        }
        experiment.history = Array.isArray(experiment.history) ? experiment.history : [];
        experiment.history.push({ at: new Date().toISOString(), action: 'updated', changes: detailChanges });
        appendAuditLog({ action: 'updated', recordType: 'experiment', recordId: experiment.id, changes: clone(detailChanges) });
        addActivity('更新实验“' + experiment.title + '”的本次试剂用量');
        saveState();
        renderAll();
        els.experimentDetailDialog.close();
        showToast(experiment.status === '已完成' ? '实验已完成，试剂余量已按本次记录更新' : '本次试剂用量已保存');
    }

    function normalizeRunSession(session) {
        if (!session || typeof session !== 'object' || !session.protocolId) return null;
        return {
            protocolId: String(session.protocolId),
            startedAt: session.startedAt || new Date().toISOString(),
            finishedAt: session.finishedAt || '',
            currentStep: Math.max(0, Math.round(Number(session.currentStep) || 0)),
            stepStates: Array.isArray(session.stepStates) ? session.stepStates.map(normalizeRunStepState) : []
        };
    }

    function normalizeRunStepState(stepState) {
        const source = stepState && typeof stepState === 'object' ? stepState : {};
        const timer = source.timer && typeof source.timer === 'object' ? source.timer : {};
        const apparatus = source.apparatus && typeof source.apparatus === 'object' ? source.apparatus : {};
        const calculator = source.calculator && typeof source.calculator === 'object' ? source.calculator : {};
        return {
            done: Boolean(source.done),
            notes: String(source.notes || ''),
            completedAt: source.completedAt || '',
            photos: Array.isArray(source.photos) ? source.photos.map(function (photo, index) {
                if (typeof photo === 'string') return { id: 'STEP-PHOTO-' + index, data: photo, addedAt: '' };
                return { id: photo.id || 'STEP-PHOTO-' + index, data: photo.data || '', addedAt: photo.addedAt || '' };
            }).filter(photo => String(photo.data).startsWith('data:image/')).slice(0, 6) : [],
            timer: {
                elapsed: Math.max(0, Math.round(Number(timer.elapsed) || 0)),
                startedAt: timer.startedAt || '',
                running: Boolean(timer.running && timer.startedAt)
            },
            calculator: {
                expression: String(calculator.expression || ''),
                result: String(calculator.result || ''),
                angleMode: calculator.angleMode === 'rad' ? 'rad' : 'deg',
                mode: ['scientific', 'dilution', 'molarity', 'seeding', 'mastermix'].includes(calculator.mode) ? calculator.mode : '',
                visible: Boolean(calculator.visible),
                fields: calculator.fields && typeof calculator.fields === 'object' ? Object.assign({}, calculator.fields) : {}
            },
            apparatus: {
                type: apparatusDefinitions[apparatus.type] ? apparatus.type : '',
                marks: apparatus.marks && typeof apparatus.marks === 'object' ? Object.assign({}, apparatus.marks) : {},
                rows: number(apparatus.rows || 6, 1, 12),
                columns: number(apparatus.columns || 6, 1, 12)
            }
        };
    }

    function defaultRunStepState(stepText) {
        return normalizeRunStepState({ calculator: { mode: recommendedCalculator(stepText), visible: false }, apparatus: { type: recommendedApparatus(stepText), marks: {} } });
    }

    function recommendedApparatus(stepText) {
        const text = String(stepText || '');
        if (/凝胶|电泳|gel/i.test(text)) return 'gel';
        if (/切片|封片|载玻片|成像|脑片|slide/i.test(text)) return 'slides';
        if (/离心|冻存管|耳样|样本管|tube/i.test(text)) return 'tubeRack';
        if (/12\s*孔|12[- ]?well/i.test(text)) return 'plate12';
        if (/PCR|qPCR|反应体系|染色|培养|接种|细胞|抗体|孵育|plate/i.test(text)) return 'plate96';
        return 'custom';
    }

    function recommendedCalculator(stepText) {
        const text = String(stepText || '');
        if (/稀释|配液|倍比|dilut|C1V1/i.test(text)) return 'dilution';
        if (/摩尔|molar|mM|µM|称量|分子量/i.test(text)) return 'molarity';
        if (/铺板|接种|细胞数|cell seeding/i.test(text)) return 'seeding';
        if (/PCR|qPCR|master\s*mix|反应体系/i.test(text)) return 'mastermix';
        return 'scientific';
    }

    function ensureRunSession(experiment, protocol) {
        const existing = normalizeRunSession(experiment.runSession);
        if (!existing || existing.protocolId !== protocol.id || existing.finishedAt) {
            experiment.runSession = {
                protocolId: protocol.id,
                startedAt: new Date().toISOString(),
                finishedAt: '',
                currentStep: 0,
                stepStates: protocol.steps.map(defaultRunStepState)
            };
            return experiment.runSession;
        }
        existing.stepStates = protocol.steps.map(function (step, index) {
            const stepState = existing.stepStates[index] || defaultRunStepState(step);
            if (!stepState.apparatus.type) stepState.apparatus.type = recommendedApparatus(step);
            if (!stepState.calculator.mode) stepState.calculator.mode = recommendedCalculator(step);
            return stepState;
        });
        existing.currentStep = Math.min(Math.max(0, existing.currentStep), Math.max(0, protocol.steps.length - 1));
        experiment.runSession = existing;
        return existing;
    }

    function startScheduledExperiment(taskId) {
        if (denyReadOnlyMutation()) return;
        const task = state.schedule.find(item => item.id === taskId);
        if (!task) return;
        const protocol = state.protocols.find(item => item.id === task.protocolId);
        if (!protocol || !protocol.steps.length) {
            showToast('请先为这项日程关联一个包含步骤的 Protocol');
            return;
        }
        let experiment = state.experiments.find(item => item.id === task.experimentId);
        const created = !experiment;
        if (!experiment) {
            experiment = {
                id: 'RL-EXP-' + Date.now().toString().slice(-6),
                title: task.title,
                project: '日程实验',
                status: '进行中',
                type: task.type === 'animal' ? '动物实验' : task.type === 'analysis' ? '分析实验' : '计划实验',
                date: task.date,
                progress: 0,
                description: '由 ' + task.date + ' ' + scheduleTimeLabel(task) + ' 的日程启动。',
                protocolId: protocol.id,
                reagentUsage: clone(protocol.reagents || []),
                usageOverridden: false,
                scheduleId: task.id,
                createdBy: anonymousContributor(task.createdBy)
            };
            state.experiments.unshift(experiment);
            task.experimentId = experiment.id;
        }
        experiment.status = '进行中';
        experiment.protocolId = protocol.id;
        experiment.scheduleId = task.id;
        ensureRunSession(experiment, protocol);
        addActivity((created ? '从日程创建并开始实验“' : '从日程继续实验“') + experiment.title + '”');
        saveState();
        renderAll();
        openExperimentRun(experiment.id);
    }

    function openExperimentRun(experimentId) {
        const experiment = state.experiments.find(item => item.id === experimentId);
        if (!experiment) return;
        const protocol = state.protocols.find(item => item.id === experiment.protocolId);
        if (!protocol || !protocol.steps.length) {
            showToast('当前实验没有可执行的 Protocol 步骤');
            return;
        }
        activeRunExperimentId = experiment.id;
        ensureRunSession(experiment, protocol);
        els.experimentRunKicker.textContent = experiment.id + ' · LIVE PROTOCOL WORKSPACE';
        els.experimentRunTitle.textContent = experiment.title;
        els.experimentRunProtocol.textContent = protocol.title + ' · ' + protocol.number;
        renderExperimentRun();
        els.experimentRunDialog.showModal();
    }

    function currentRunContext() {
        const experiment = state.experiments.find(item => item.id === activeRunExperimentId);
        if (!experiment) return null;
        const protocol = state.protocols.find(item => item.id === experiment.protocolId);
        if (!protocol) return null;
        const session = ensureRunSession(experiment, protocol);
        const stepIndex = Math.min(session.currentStep, Math.max(0, protocol.steps.length - 1));
        return { experiment: experiment, protocol: protocol, session: session, stepIndex: stepIndex, stepState: session.stepStates[stepIndex] };
    }

    function renderExperimentRun() {
        const context = currentRunContext();
        if (!context) return;
        const steps = context.protocol.steps;
        const completed = context.session.stepStates.filter(step => step.done).length;
        const progress = steps.length ? completed / steps.length * 100 : 0;
        const stepText = steps[context.stepIndex] || '未命名步骤';
        const stepState = context.stepState;
        const timerValue = formatRunDuration(timerElapsedSeconds(stepState.timer));
        const apparatus = apparatusDefinitions[stepState.apparatus.type] || apparatusDefinitions.custom;
        const suggestedCalculator = recommendedCalculator(stepText);
        if (!stepState.calculator.mode) stepState.calculator.mode = suggestedCalculator;
        const stepList = steps.map(function (step, index) {
            const stateForStep = context.session.stepStates[index];
            const classes = ['run-step-item'];
            if (index === context.stepIndex) classes.push('active');
            if (stateForStep.done) classes.push('done');
            return '<button class="' + classes.join(' ') + '" type="button" data-run-step="' + index + '"><span>' + String(index + 1).padStart(2, '0') + '</span><div><strong>' + esc(step) + '</strong><small>' + (stateForStep.done ? '已完成' : index === context.stepIndex ? '当前步骤' : '等待执行') + '</small></div><i>' + (stateForStep.done ? '✓' : '→') + '</i></button>';
        }).join('');
        const apparatusOptions = Object.keys(apparatusDefinitions).map(function (key) {
            const definition = apparatusDefinitions[key];
            return '<option value="' + key + '"' + (key === stepState.apparatus.type ? ' selected' : '') + '>' + esc(definition.label) + '</option>';
        }).join('');

        els.experimentRunBody.innerHTML =
            '<aside class="run-step-rail"><div class="run-step-rail-head"><p class="micro-label">SYNCHRONIZED STEPS</p><strong>' + completed + ' / ' + steps.length + ' 已完成</strong></div><div class="run-step-list">' + stepList + '</div></aside>' +
            '<section class="run-step-workspace"><header class="run-current-step"><div><span>STEP ' + String(context.stepIndex + 1).padStart(2, '0') + ' / ' + String(steps.length).padStart(2, '0') + '</span><h3>' + esc(stepText) + '</h3></div><div class="run-current-actions"><button type="button" data-toggle-run-calculator>ƒx ' + esc(calculatorModeLabel(suggestedCalculator)) + '</button><b class="' + (stepState.done ? 'done' : '') + '">' + (stepState.done ? '已完成' : '执行中') + '</b></div></header>' +
            '<label class="run-step-notes"><span>步骤记录与观察</span><textarea data-run-notes placeholder="记录操作参数、异常现象或样本变化…">' + esc(stepState.notes) + '</textarea></label>' +
            runStepPhotoHtml(stepState) +
            '<div class="run-tool-grid">' +
                '<section class="run-tool-card timer-tool"><header><div><p class="micro-label">STEP TIMER</p><h4>步骤计时器</h4></div><span class="tool-status-dot' + (stepState.timer.running ? ' active' : '') + '"></span></header><strong class="run-timer-display" id="runTimerDisplay">' + timerValue + '</strong><div class="run-tool-actions"><button type="button" data-run-timer="start">开始</button><button type="button" data-run-timer="pause">暂停</button><button type="button" data-run-timer="reset">复位</button></div></section>' +
                (stepState.calculator.visible ? runCalculatorHtml(stepState, stepText) : '') +
                '<section class="run-tool-card apparatus-tool"><header><div><p class="micro-label">APPARATUS ANNOTATION</p><h4>装置标注</h4></div><div class="apparatus-controls"><select data-apparatus-type aria-label="装置类型">' + apparatusOptions + '</select>' + apparatusDimensionsHtml(stepState) + '</div></header><div class="apparatus-legend"><span>孔位可直接填写样本名称</span><button type="button" data-clear-apparatus>清空标注</button></div>' + apparatusGridHtml(apparatus, stepState.apparatus) + '</section>' +
            '</div></section>';

        els.experimentRunProgressLabel.textContent = '步骤进度 ' + completed + ' / ' + steps.length;
        els.experimentRunProgressBar.style.width = progress + '%';
        const previous = els.experimentRunDialog.querySelector('[data-run-action="previous"]');
        const next = els.experimentRunDialog.querySelector('[data-run-action="next"]');
        const toggle = els.experimentRunDialog.querySelector('[data-run-action="toggle-complete"]');
        previous.disabled = context.stepIndex === 0;
        next.disabled = context.stepIndex >= steps.length - 1;
        toggle.textContent = stepState.done ? '撤销步骤完成' : '完成当前步骤';
        toggle.classList.toggle('completed', stepState.done);
    }

    function runStepPhotoHtml(stepState) {
        const photos = Array.isArray(stepState.photos) ? stepState.photos : [];
        const items = photos.map(function (photo, index) {
            return '<figure><img src="' + esc(photo.data) + '" alt="实验步骤照片 ' + (index + 1) + '"><button type="button" data-remove-run-photo="' + esc(photo.id) + '" aria-label="删除步骤照片"></button><figcaption>步骤照片 ' + (index + 1) + (photo.addedAt ? ' · ' + esc(formatHistoryTime(photo.addedAt)) : '') + '</figcaption></figure>';
        }).join('');
        return '<section class="run-step-photos"><header><div><p class="micro-label">STEP IMAGES</p><h4>步骤照片记录</h4></div><label class="run-photo-add" for="runStepPhotoInput"><input id="runStepPhotoInput" type="file" accept="image/*" capture="environment" multiple data-run-photo-input><span>＋ 拍照 / 选择图片</span></label></header><div class="run-step-photo-grid">' + (items || '<p>尚未保存本步骤的照片。</p>') + '</div><small>每个步骤最多保存 6 张压缩照片；切换步骤后仍会保留。</small></section>';
    }

    function calculatorModeLabel(mode) {
        return ({ scientific: '科学计算', dilution: '稀释计算', molarity: '摩尔配制', seeding: '细胞铺板', mastermix: '反应体系' })[mode] || '科学计算';
    }

    function calculatorFieldValue(stepState, name, fallback) {
        const value = stepState.calculator.fields[name];
        return value == null || value === '' ? fallback : value;
    }

    function smartCalculatorFieldsHtml(stepState, mode) {
        const definitions = {
            dilution: [['c1', '母液浓度 C1', 100], ['c2', '目标浓度 C2', 10], ['v2', '终体积 V2', 10]],
            molarity: [['mw', '分子量', 180.16], ['concentration', '目标浓度 mM', 10], ['volume', '终体积 mL', 100]],
            seeding: [['cellsPerWell', '每孔细胞数', 50000], ['wells', '使用孔数', 12], ['cellConcentration', '细胞浓度 cells/mL', 1000000], ['overage', '余量 %', 10]],
            mastermix: [['perReaction', '每反应用量 µL', 20], ['reactions', '反应数量', 12], ['overage', '余量 %', 10]]
        };
        return '<div class="smart-calculator-fields">' + (definitions[mode] || []).map(function (field) {
            return '<label><span>' + field[1] + '</span><input data-calc-field="' + field[0] + '" type="number" min="0" step="any" value="' + esc(calculatorFieldValue(stepState, field[0], field[2])) + '"></label>';
        }).join('') + '</div><div class="calculator-result-row"><button class="calculator-equals" type="button" data-run-calculate aria-label="计算">=</button><output id="runCalculatorResult">' + esc(stepState.calculator.result || '等待输入') + '</output></div>';
    }

    function runCalculatorHtml(stepState, stepText) {
        const mode = stepState.calculator.mode || recommendedCalculator(stepText);
        const modeOptions = ['scientific', 'dilution', 'molarity', 'seeding', 'mastermix'].map(function (key) {
            return '<option value="' + key + '"' + (key === mode ? ' selected' : '') + '>' + calculatorModeLabel(key) + '</option>';
        }).join('');
        const modeControl = '<select data-calc-mode aria-label="计算类型">' + modeOptions + '</select>';
        if (mode !== 'scientific') {
            return '<section class="run-tool-card calculator-tool smart-calculator"><header><div><p class="micro-label">PROTOCOL MATCHED CALCULATION</p><h4>' + esc(calculatorModeLabel(mode)) + '</h4></div>' + modeControl + '</header>' + smartCalculatorFieldsHtml(stepState, mode) + '</section>';
        }
        const buttons = [
            ['sin(', 'sin'], ['cos(', 'cos'], ['tan(', 'tan'], ['sqrt(', '√'], ['log(', 'log'], ['ln(', 'ln'],
            ['(', '('], [')', ')'], ['pi', 'π'], ['e', 'e'], ['^2', 'x²'], ['^', 'xʸ'],
            ['7', '7'], ['8', '8'], ['9', '9'], ['/', '÷'], ['abs(', 'abs'], ['exp(', 'exp'],
            ['4', '4'], ['5', '5'], ['6', '6'], ['*', '×'], ['!', 'n!'], ['%', '%'],
            ['1', '1'], ['2', '2'], ['3', '3'], ['-', '−'], ['.', '.'], ['+', '+'],
            ['0', '0']
        ].map(function (entry) {
            return '<button type="button" data-calc-token="' + esc(entry[0]) + '">' + esc(entry[1]) + '</button>';
        }).join('');
        return '<section class="run-tool-card calculator-tool scientific-calculator"><header><div><p class="micro-label">SCIENTIFIC CALCULATION</p><h4>科学计算器</h4></div><div class="calculator-header-controls">' + modeControl + '<select data-calc-angle aria-label="角度模式"><option value="deg"' + (stepState.calculator.angleMode === 'deg' ? ' selected' : '') + '>DEG</option><option value="rad"' + (stepState.calculator.angleMode === 'rad' ? ' selected' : '') + '>RAD</option></select></div></header><label><span>计算式</span><input data-run-expression type="text" value="' + esc(stepState.calculator.expression) + '" placeholder="例如：sin(30) + sqrt(16)"></label><div class="scientific-keypad">' + buttons + '<button class="key-action" type="button" data-calc-action="backspace">⌫</button><button class="key-action danger" type="button" data-calc-action="clear">C</button></div><div class="calculator-result-row"><button class="calculator-equals" type="button" data-run-calculate aria-label="计算">=</button><output id="runCalculatorResult">' + esc(stepState.calculator.result || '等待输入') + '</output></div></section>';
    }

    function apparatusDimensionsHtml(stepState) {
        if (stepState.apparatus.type !== 'custom') return '';
        return '<label class="apparatus-dimension"><span>行</span><input data-apparatus-dimension="rows" type="number" min="1" max="12" value="' + esc(stepState.apparatus.rows) + '"></label><label class="apparatus-dimension"><span>列</span><input data-apparatus-dimension="columns" type="number" min="1" max="12" value="' + esc(stepState.apparatus.columns) + '"></label>';
    }

    function apparatusGridHtml(definition, apparatus) {
        const rows = apparatus.type === 'custom' ? number(apparatus.rows, 1, 12) : definition.rows;
        const columns = apparatus.type === 'custom' ? number(apparatus.columns, 1, 12) : definition.columns;
        const marks = apparatus.marks || {};
        let cells = '';
        for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
            for (let column = 1; column <= columns; column += 1) {
                const label = String.fromCharCode(65 + rowIndex) + column;
                const legacy = { sample: '样本', control: '对照', blank: '空白' }[marks[label]];
                const value = legacy || marks[label] || '';
                cells += '<label class="apparatus-cell ' + definition.shape + (value ? ' filled' : '') + '"><span>' + label + '</span><input data-apparatus-label="' + label + '" type="text" maxlength="32" value="' + esc(value) + '" aria-label="' + label + ' 样本名称"></label>';
            }
        }
        return '<div class="apparatus-scroll"><div class="apparatus-grid ' + definition.shape + '" style="grid-template-columns:repeat(' + columns + ',minmax(58px,1fr));min-width:' + (columns * 62) + 'px">' + cells + '</div></div>';
    }

    function persistRunWorkspaceInputs() {
        const context = currentRunContext();
        if (!context || !els.experimentRunDialog.open) return;
        const notes = els.experimentRunBody.querySelector('[data-run-notes]');
        const expression = els.experimentRunBody.querySelector('[data-run-expression]');
        if (notes) context.stepState.notes = notes.value;
        if (expression) context.stepState.calculator.expression = expression.value;
        els.experimentRunBody.querySelectorAll('[data-calc-field]').forEach(function (input) { context.stepState.calculator.fields[input.dataset.calcField] = input.value; });
        els.experimentRunBody.querySelectorAll('[data-apparatus-label]').forEach(function (input) { if (input.value.trim()) context.stepState.apparatus.marks[input.dataset.apparatusLabel] = input.value.trim(); else delete context.stepState.apparatus.marks[input.dataset.apparatusLabel]; });
        window.clearTimeout(runInputSaveTimer);
        saveState();
    }

    function handleRunWorkspaceInput(event) {
        const context = currentRunContext();
        if (!context) return;
        if (event.target.matches('[data-run-notes]')) context.stepState.notes = event.target.value;
        if (event.target.matches('[data-run-expression]')) context.stepState.calculator.expression = event.target.value;
        if (event.target.matches('[data-calc-field]')) context.stepState.calculator.fields[event.target.dataset.calcField] = event.target.value;
        if (event.target.matches('[data-apparatus-label]')) {
            const value = event.target.value.trim();
            if (value) context.stepState.apparatus.marks[event.target.dataset.apparatusLabel] = value;
            else delete context.stepState.apparatus.marks[event.target.dataset.apparatusLabel];
        }
        window.clearTimeout(runInputSaveTimer);
        runInputSaveTimer = window.setTimeout(function () { saveState(); }, 700);
    }

    function handleRunWorkspaceChange(event) {
        const context = currentRunContext();
        if (!context) return;
        if (event.target.matches('[data-run-photo-input]')) {
            addRunStepPhotos(event.target);
            return;
        }
        if (event.target.matches('[data-calc-angle]')) {
            context.stepState.calculator.angleMode = event.target.value === 'rad' ? 'rad' : 'deg';
            saveState();
            return;
        }
        if (event.target.matches('[data-calc-mode]')) {
            context.stepState.calculator.mode = event.target.value;
            context.stepState.calculator.result = '';
            context.stepState.calculator.visible = true;
            saveState();
            renderExperimentRun();
            return;
        }
        if (event.target.matches('[data-apparatus-type]')) {
            const definition = apparatusDefinitions[event.target.value] || apparatusDefinitions.custom;
            context.stepState.apparatus = { type: event.target.value, marks: {}, rows: definition.rows, columns: definition.columns };
            saveState();
            renderExperimentRun();
            return;
        }
        if (event.target.matches('[data-apparatus-dimension]')) {
            context.stepState.apparatus[event.target.dataset.apparatusDimension] = number(event.target.value, 1, 12);
            saveState();
            renderExperimentRun();
            return;
        }
        if (event.target.matches('[data-run-notes], [data-run-expression]')) {
            window.clearTimeout(runInputSaveTimer);
            saveState();
        }
    }

    async function addRunStepPhotos(input) {
        const context = currentRunContext();
        const files = Array.from(input.files || []);
        if (!context || !files.length) return;
        const remaining = Math.max(0, 6 - context.stepState.photos.length);
        if (!remaining) {
            showToast('每个步骤最多保存 6 张照片');
            return;
        }
        showToast('正在压缩并保存步骤照片…');
        try {
            const selected = files.slice(0, remaining);
            for (let index = 0; index < selected.length; index += 1) {
                const data = await compressPhoto(selected[index], 720, .6);
                context.stepState.photos.push({ id: 'STEP-PHOTO-' + Date.now() + '-' + index, data: data, addedAt: new Date().toISOString() });
            }
            saveState();
            renderExperimentRun();
            showToast('已保存 ' + selected.length + ' 张步骤照片');
        } catch (error) {
            showToast('照片读取失败，请重新选择');
        }
    }

    function removeRunStepPhoto(photoId) {
        const context = currentRunContext();
        if (!context) return;
        context.stepState.photos = context.stepState.photos.filter(photo => photo.id !== photoId);
        saveState();
        renderExperimentRun();
        showToast('步骤照片已删除');
    }

    function insertCalculatorToken(token) {
        const context = currentRunContext();
        const input = els.experimentRunBody.querySelector('[data-run-expression]');
        if (!context || !input) return;
        const start = Number.isFinite(input.selectionStart) ? input.selectionStart : input.value.length;
        const end = Number.isFinite(input.selectionEnd) ? input.selectionEnd : start;
        input.setRangeText(token, start, end, 'end');
        context.stepState.calculator.expression = input.value;
        saveState();
        input.focus();
    }

    function handleCalculatorAction(action) {
        const context = currentRunContext();
        const input = els.experimentRunBody.querySelector('[data-run-expression]');
        if (!context || !input) return;
        if (action === 'clear') {
            input.value = '';
            context.stepState.calculator.expression = '';
            context.stepState.calculator.result = '';
            const output = document.getElementById('runCalculatorResult');
            if (output) output.textContent = '等待输入';
        } else if (action === 'backspace') {
            const start = Number.isFinite(input.selectionStart) ? input.selectionStart : input.value.length;
            const end = Number.isFinite(input.selectionEnd) ? input.selectionEnd : start;
            if (start !== end) input.setRangeText('', start, end, 'end');
            else if (start > 0) input.setRangeText('', start - 1, start, 'end');
            context.stepState.calculator.expression = input.value;
        }
        saveState();
        input.focus();
    }

    function selectRunStep(index) {
        const context = currentRunContext();
        if (!context) return;
        persistRunWorkspaceInputs();
        context.session.currentStep = Math.max(0, Math.min(context.protocol.steps.length - 1, index));
        saveState();
        renderExperimentRun();
    }

    function handleRunAction(action) {
        const context = currentRunContext();
        if (!context) return;
        persistRunWorkspaceInputs();
        if (action === 'previous') {
            selectRunStep(context.stepIndex - 1);
            return;
        }
        if (action === 'next') {
            selectRunStep(context.stepIndex + 1);
            return;
        }
        if (action === 'toggle-complete') {
            context.stepState.done = !context.stepState.done;
            context.stepState.completedAt = context.stepState.done ? new Date().toISOString() : '';
            if (context.stepState.done) pauseRunTimer(context.stepState.timer);
            const completed = context.session.stepStates.filter(step => step.done).length;
            context.experiment.progress = Math.min(95, Math.round(completed / context.protocol.steps.length * 100));
            if (context.stepState.done && context.stepIndex < context.protocol.steps.length - 1) context.session.currentStep += 1;
            saveState();
            renderAll();
            renderExperimentRun();
            showToast(context.stepState.done ? '步骤已完成并同步进度' : '已撤销步骤完成状态');
            return;
        }
        if (action === 'finish') finishExperimentRun(context);
    }

    function handleRunTimer(action) {
        const context = currentRunContext();
        if (!context) return;
        persistRunWorkspaceInputs();
        const timer = context.stepState.timer;
        if (action === 'start' && !timer.running) {
            timer.startedAt = new Date().toISOString();
            timer.running = true;
        } else if (action === 'pause') {
            pauseRunTimer(timer);
        } else if (action === 'reset') {
            timer.elapsed = 0;
            timer.startedAt = '';
            timer.running = false;
        }
        saveState();
        renderExperimentRun();
    }

    function pauseRunTimer(timer) {
        if (timer.running && timer.startedAt) timer.elapsed = timerElapsedSeconds(timer);
        timer.startedAt = '';
        timer.running = false;
    }

    function timerElapsedSeconds(timer) {
        const stored = Math.max(0, Number(timer.elapsed) || 0);
        if (!timer.running || !timer.startedAt) return Math.round(stored);
        const started = new Date(timer.startedAt).getTime();
        if (!Number.isFinite(started)) return Math.round(stored);
        return Math.max(0, Math.round(stored + (Date.now() - started) / 1000));
    }

    function updateRunTimerDisplay() {
        if (!els || !els.experimentRunDialog || !els.experimentRunDialog.open) return;
        const context = currentRunContext();
        const display = document.getElementById('runTimerDisplay');
        if (context && display) display.textContent = formatRunDuration(timerElapsedSeconds(context.stepState.timer));
    }

    function formatRunDuration(seconds) {
        const value = Math.max(0, Math.round(Number(seconds) || 0));
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor(value % 3600 / 60);
        const remainingSeconds = value % 60;
        return [hours, minutes, remainingSeconds].map(part => String(part).padStart(2, '0')).join(':');
    }

    function calculateRunExpression() {
        const context = currentRunContext();
        const input = els.experimentRunBody.querySelector('[data-run-expression]');
        if (!context) return;
        const calculator = context.stepState.calculator;
        const mode = calculator.mode || 'scientific';
        els.experimentRunBody.querySelectorAll('[data-calc-field]').forEach(function (field) { calculator.fields[field.dataset.calcField] = field.value; });
        try {
            let resultText = '';
            if (mode === 'scientific') {
                if (!input) return;
                const result = evaluateArithmeticExpression(input.value, calculator.angleMode);
                calculator.expression = input.value;
                resultText = formatQuantity(result);
            } else if (mode === 'dilution') {
                const c1 = positiveNumber(calculator.fields.c1, 0);
                const c2 = positiveNumber(calculator.fields.c2, 0);
                const v2 = positiveNumber(calculator.fields.v2, 0);
                if (!c1 || c2 > c1) throw new Error('invalid dilution');
                const v1 = c2 * v2 / c1;
                resultText = '母液 ' + formatQuantity(v1) + '；稀释液 ' + formatQuantity(v2 - v1);
            } else if (mode === 'molarity') {
                const mw = positiveNumber(calculator.fields.mw, 0);
                const concentration = positiveNumber(calculator.fields.concentration, 0);
                const volume = positiveNumber(calculator.fields.volume, 0);
                if (!mw || !concentration || !volume) throw new Error('invalid molarity');
                resultText = '称量 ' + formatQuantity(mw * concentration * volume / 1000) + ' mg';
            } else if (mode === 'seeding') {
                const cellsPerWell = positiveNumber(calculator.fields.cellsPerWell, 0);
                const wells = positiveNumber(calculator.fields.wells, 0);
                const concentration = positiveNumber(calculator.fields.cellConcentration, 0);
                const factor = 1 + positiveNumber(calculator.fields.overage, 0) / 100;
                if (!cellsPerWell || !wells || !concentration) throw new Error('invalid seeding');
                const cells = cellsPerWell * wells * factor;
                resultText = formatQuantity(cells) + ' cells；取 ' + formatQuantity(cells / concentration) + ' mL';
            } else if (mode === 'mastermix') {
                const perReaction = positiveNumber(calculator.fields.perReaction, 0);
                const reactions = positiveNumber(calculator.fields.reactions, 0);
                const factor = 1 + positiveNumber(calculator.fields.overage, 0) / 100;
                if (!perReaction || !reactions) throw new Error('invalid master mix');
                resultText = '体系总量 ' + formatQuantity(perReaction * reactions * factor) + ' µL';
            }
            calculator.result = resultText;
            saveState();
            document.getElementById('runCalculatorResult').textContent = calculator.result;
        } catch (error) {
            calculator.result = '输入有误';
            document.getElementById('runCalculatorResult').textContent = mode === 'scientific' ? '表达式有误，请检查括号与运算符' : '请检查输入数值和单位';
        }
    }

    function evaluateArithmeticExpression(expression, angleMode) {
        const compact = String(expression || '').toLowerCase().replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/\s+/g, '');
        if (!compact || compact.length > 180) throw new Error('invalid expression');
        const tokens = compact.match(/\d*\.?\d+(?:e[+\-]?\d+)?|[a-z]+|[()+\-*/%^!]/g) || [];
        if (tokens.join('') !== compact) throw new Error('invalid token');
        const mode = angleMode === 'rad' ? 'rad' : 'deg';
        const functions = {
            sin: value => Math.sin(toRadians(value)),
            cos: value => Math.cos(toRadians(value)),
            tan: value => Math.tan(toRadians(value)),
            asin: value => fromRadians(Math.asin(value)),
            acos: value => fromRadians(Math.acos(value)),
            atan: value => fromRadians(Math.atan(value)),
            sqrt: value => Math.sqrt(value),
            log: value => Math.log10(value),
            ln: value => Math.log(value),
            exp: value => Math.exp(value),
            abs: value => Math.abs(value),
            floor: value => Math.floor(value),
            ceil: value => Math.ceil(value),
            round: value => Math.round(value)
        };
        let cursor = 0;

        function toRadians(value) {
            return mode === 'deg' ? value * Math.PI / 180 : value;
        }

        function fromRadians(value) {
            return mode === 'deg' ? value * 180 / Math.PI : value;
        }

        function parseExpression() {
            let value = parseTerm();
            while (tokens[cursor] === '+' || tokens[cursor] === '-') {
                const operator = tokens[cursor++];
                const right = parseTerm();
                value = operator === '+' ? value + right : value - right;
            }
            return value;
        }

        function parseTerm() {
            let value = parsePower();
            while (tokens[cursor] === '*' || tokens[cursor] === '/' || tokens[cursor] === '%') {
                const operator = tokens[cursor++];
                const right = parsePower();
                if ((operator === '/' || operator === '%') && right === 0) throw new Error('division by zero');
                value = operator === '*' ? value * right : operator === '/' ? value / right : value % right;
            }
            return value;
        }

        function parsePower() {
            let value = parseUnary();
            if (tokens[cursor] === '^') {
                cursor += 1;
                value = Math.pow(value, parsePower());
            }
            return value;
        }

        function parseUnary() {
            if (tokens[cursor] === '+') {
                cursor += 1;
                return parseUnary();
            }
            if (tokens[cursor] === '-') {
                cursor += 1;
                return -parseUnary();
            }
            return parsePostfix();
        }

        function parsePostfix() {
            let value = parsePrimary();
            while (tokens[cursor] === '!') {
                cursor += 1;
                if (!Number.isInteger(value) || value < 0 || value > 170) throw new Error('invalid factorial');
                let factorial = 1;
                for (let index = 2; index <= value; index += 1) factorial *= index;
                value = factorial;
            }
            return value;
        }

        function parsePrimary() {
            const token = tokens[cursor++];
            if (token === '(') {
                const value = parseExpression();
                if (tokens[cursor++] !== ')') throw new Error('missing parenthesis');
                return value;
            }
            if (token === 'pi') return Math.PI;
            if (token === 'e') return Math.E;
            if (functions[token]) {
                if (tokens[cursor++] !== '(') throw new Error('missing function parenthesis');
                const value = parseExpression();
                if (tokens[cursor++] !== ')') throw new Error('missing function parenthesis');
                return functions[token](value);
            }
            const value = Number(token);
            if (!Number.isFinite(value)) throw new Error('invalid number');
            return value;
        }

        const result = parseExpression();
        if (cursor !== tokens.length || !Number.isFinite(result)) throw new Error('invalid result');
        return result;
    }

    function cycleApparatusCell(label) {
        const context = currentRunContext();
        if (!context) return;
        const cycle = ['', 'sample', 'control', 'blank'];
        const current = context.stepState.apparatus.marks[label] || '';
        const next = cycle[(cycle.indexOf(current) + 1) % cycle.length];
        if (next) context.stepState.apparatus.marks[label] = next;
        else delete context.stepState.apparatus.marks[label];
        saveState();
        renderExperimentRun();
    }

    function clearApparatusMarks() {
        const context = currentRunContext();
        if (!context) return;
        context.stepState.apparatus.marks = {};
        saveState();
        renderExperimentRun();
    }

    function finishExperimentRun(context) {
        const remaining = context.session.stepStates.filter(step => !step.done).length;
        if (remaining) {
            showToast('还有 ' + remaining + ' 个步骤未完成，请逐步确认后归档');
            return;
        }
        context.session.stepStates.forEach(function (step) { pauseRunTimer(step.timer); });
        context.session.finishedAt = new Date().toISOString();
        context.experiment.status = '已完成';
        context.experiment.progress = 100;
        const scheduledTask = state.schedule.find(task => task.id === context.experiment.scheduleId || task.experimentId === context.experiment.id);
        if (scheduledTask) {
            scheduledTask.experimentId = context.experiment.id;
            scheduledTask.done = true;
        }
        addActivity('完成实验“' + context.experiment.title + '”并归档执行步骤');
        saveState();
        renderAll();
        els.experimentRunDialog.close();
        activeRunExperimentId = '';
        showToast('实验已完成，步骤记录已归档，试剂余量已更新');
    }

    function getProtocolConsumption(catalog) {
        const scheduled = state.schedule.reduce(function (sum, task) {
            if (!task.done || !task.protocolId) return sum;
            const linkedExperiment = state.experiments.find(experiment => experiment.id === task.experimentId && experiment.status === '已完成');
            if (linkedExperiment) return sum;
            const protocol = state.protocols.find(item => item.id === task.protocolId);
            if (!protocol) return sum;
            const usage = protocol.reagents.find(item => item.catalog === catalog);
            return sum + (usage ? positiveNumber(usage.amount, 0) : 0);
        }, 0);
        const recorded = state.experiments.reduce(function (sum, experiment) {
            if (experiment.status !== '已完成') return sum;
            const usage = getEffectiveExperimentUsage(experiment).find(item => item.catalog === catalog);
            return sum + (usage ? positiveNumber(usage.amount, 0) : 0);
        }, 0);
        return roundQuantity(scheduled + recorded);
    }

    function getTheoreticalRemaining(reagent) {
        return roundQuantity(Math.max(0, positiveNumber(reagent.currentQty, 0) - getProtocolConsumption(reagent.catalog)));
    }

    function getTheoreticalPercent(reagent) {
        return reagent.totalQty ? number(getTheoreticalRemaining(reagent) / reagent.totalQty * 100, 0, 100) : 0;
    }

function getReagentDisplayStatus(reagent) {
    if (!positiveNumber(reagent.totalQty, 0)) return reagent.status || '待补充';
    if (getTheoreticalPercent(reagent) < 25) return '余量低';
    return reagent.status;
}

    function getActiveFreezerBox() {
        return state.freezerBoxes.find(box => box.id === activeFreezerBoxId && box.storageUnitId === activeColdStorageId && Number(box.shelf || 1) === activeColdStorageShelf) || null;
    }

    function selectFreezerBox(id) {
        const box = state.freezerBoxes.find(item => item.id === id);
        if (!box) return;
        activeFreezerBoxId = box.id;
        activeColdStorageId = box.storageUnitId;
        activeColdStorageShelf = Math.max(1, Number(box.shelf) || 1);
        localStorage.setItem('rhineLabActiveFreezerBox', box.id);
        localStorage.setItem('rhineLabActiveColdStorage', activeColdStorageId);
        localStorage.setItem('rhineLabActiveColdStorageShelf', String(activeColdStorageShelf));
        const firstSample = state.samples.find(item => item.boxId === box.id);
        selectedSampleId = firstSample ? firstSample.id : '';
        renderSamples();
    }

    function formatSampleLocation(box, position) {
        return box ? box.name.replace(/\s+/g, '') + ' · ' + (position || '待分配') : position || '';
    }

    function isValidBoxPosition(box, position) {
        const match = String(position || '').match(/^([A-Z])(\d{1,2})$/);
        if (!match) return false;
        const row = match[1].charCodeAt(0) - 64;
        const column = Number(match[2]);
        return row >= 1 && row <= box.rows && column >= 1 && column <= box.columns;
    }

    function openFreezerScan() {
        const box = getActiveFreezerBox();
        if (!box) { showToast('请先选择一个冻存盒'); return; }
        freezerScanScores = [];
        freezerScanDetected = new Set();
        freezerScanPhotoData = '';
        els.freezerScanInput.value = '';
        els.freezerScanCanvas.hidden = true;
        els.freezerScanPlaceholder.hidden = false;
        els.freezerScanPlaceholder.textContent = '照片会在这里显示，并按 ' + box.rows + ' × ' + box.columns + ' 网格分析管位。';
        els.freezerScanBoxName.textContent = box.name + ' · ' + box.storageLocation;
        els.freezerScanSummary.textContent = '等待照片';
        renderFreezerScanGrid();
        els.freezerScanDialog.showModal();
    }

    async function handleFreezerScanImage(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        els.freezerScanSummary.textContent = '正在分析照片…';
        try {
            freezerScanPhotoData = await compressPhoto(file, 1000, .72);
            const image = await loadDataImage(freezerScanPhotoData);
            const canvas = els.freezerScanCanvas;
            const scale = Math.min(1, 760 / Math.max(image.naturalWidth, image.naturalHeight));
            canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
            canvas.getContext('2d', { willReadFrequently: true }).drawImage(image, 0, 0, canvas.width, canvas.height);
            canvas.hidden = false;
            els.freezerScanPlaceholder.hidden = true;
            analyzeFreezerImage();
        } catch (error) {
            els.freezerScanSummary.textContent = '照片读取失败，请重新拍摄';
        }
    }

    function loadDataImage(source) {
        return new Promise(function (resolve, reject) {
            const image = new Image();
            image.onload = function () { resolve(image); };
            image.onerror = reject;
            image.src = source;
        });
    }

    function analyzeFreezerImage() {
        const box = getActiveFreezerBox();
        const canvas = els.freezerScanCanvas;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        const cellWidth = canvas.width / box.columns;
        const cellHeight = canvas.height / box.rows;
        freezerScanScores = [];

        for (let rowIndex = 0; rowIndex < box.rows; rowIndex += 1) {
            for (let columnIndex = 0; columnIndex < box.columns; columnIndex += 1) {
                const x0 = Math.floor(columnIndex * cellWidth + cellWidth * .14);
                const x1 = Math.floor((columnIndex + 1) * cellWidth - cellWidth * .14);
                const y0 = Math.floor(rowIndex * cellHeight + cellHeight * .14);
                const y1 = Math.floor((rowIndex + 1) * cellHeight - cellHeight * .14);
                let count = 0;
                let sum = 0;
                let sumSquare = 0;
                let saturationSum = 0;
                let centerSum = 0;
                let centerCount = 0;
                let edgeSum = 0;
                let edgeCount = 0;
                for (let y = y0; y < y1; y += 2) {
                    for (let x = x0; x < x1; x += 2) {
                        const offset = (y * image.width + x) * 4;
                        const red = image.data[offset];
                        const green = image.data[offset + 1];
                        const blue = image.data[offset + 2];
                        const light = .2126 * red + .7152 * green + .0722 * blue;
                        const maxChannel = Math.max(red, green, blue);
                        const minChannel = Math.min(red, green, blue);
                        const saturation = maxChannel ? (maxChannel - minChannel) / maxChannel : 0;
                        const dx = Math.abs((x - (x0 + x1) / 2) / Math.max(1, (x1 - x0) / 2));
                        const dy = Math.abs((y - (y0 + y1) / 2) / Math.max(1, (y1 - y0) / 2));
                        const radius = Math.max(dx, dy);
                        count += 1;
                        sum += light;
                        sumSquare += light * light;
                        saturationSum += saturation;
                        if (radius < .42) { centerSum += light; centerCount += 1; }
                        if (radius > .68) { edgeSum += light; edgeCount += 1; }
                    }
                }
                const mean = count ? sum / count : 0;
                const variance = count ? Math.max(0, sumSquare / count - mean * mean) : 0;
                const centerMean = centerCount ? centerSum / centerCount : mean;
                const edgeMean = edgeCount ? edgeSum / edgeCount : mean;
                const score = Math.sqrt(variance) * .78 + (count ? saturationSum / count : 0) * 38 + Math.abs(centerMean - edgeMean) * .62;
                freezerScanScores.push({ position: String.fromCharCode(65 + rowIndex) + (columnIndex + 1), score: score });
            }
        }
        applyFreezerScanSensitivity();
    }

    function applyFreezerScanSensitivity() {
        if (!freezerScanScores.length) return;
        const values = freezerScanScores.map(item => item.score);
        const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
        const deviation = Math.sqrt(values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length);
        const sensitivity = Number(els.freezerScanSensitivity.value);
        const threshold = mean + deviation * (1.15 - sensitivity / 70);
        const occupied = new Set(state.samples.filter(item => item.boxId === activeFreezerBoxId).map(item => item.position));
        freezerScanDetected = new Set(freezerScanScores.filter(item => item.score >= threshold && !occupied.has(item.position)).map(item => item.position));
        renderFreezerScanGrid();
    }

    function renderFreezerScanGrid() {
        const box = getActiveFreezerBox();
        const occupied = new Set(state.samples.filter(item => item.boxId === box.id).map(item => item.position));
        let html = '';
        for (let rowIndex = 0; rowIndex < box.rows; rowIndex += 1) {
            for (let column = 1; column <= box.columns; column += 1) {
                const position = String.fromCharCode(65 + rowIndex) + column;
                const isOccupied = occupied.has(position);
                const isDetected = freezerScanDetected.has(position);
                html += '<button class="scan-position' + (isOccupied ? ' occupied' : '') + (isDetected ? ' detected' : '') + '" type="button" data-scan-position="' + position + '"' + (isOccupied ? ' disabled' : '') + ' aria-label="' + position + (isOccupied ? ' 已登记' : isDetected ? ' 疑似有冻存管' : ' 未检测到冻存管') + '">' + position + '</button>';
            }
        }
        els.freezerScanGrid.style.gridTemplateColumns = 'repeat(' + box.columns + ', minmax(24px, 1fr))';
        els.freezerScanGrid.innerHTML = html;
        const count = freezerScanDetected.size;
        els.freezerScanSummary.textContent = freezerScanScores.length ? '识别 ' + count + ' 个疑似新管位' : '等待照片';
        els.freezerScanStart.disabled = count === 0;
    }

    function startScannedSampleIntake() {
        const box = getActiveFreezerBox();
        const occupied = new Set(state.samples.filter(item => item.boxId === box.id).map(item => item.position));
        sampleIntakeQueue = Array.from(freezerScanDetected).filter(position => !occupied.has(position)).sort(compareBoxPositions);
        if (!sampleIntakeQueue.length) {
            showToast('没有可录入的新管位');
            return;
        }
        box.lastScanPhoto = freezerScanPhotoData;
        saveState();
        els.freezerScanDialog.close();
        openNextScannedSample();
    }

    function openNextScannedSample() {
        const box = getActiveFreezerBox();
        while (sampleIntakeQueue.length) {
            const position = sampleIntakeQueue.shift();
            const occupied = state.samples.some(item => item.boxId === box.id && item.position === position);
            if (occupied) continue;
            pendingSampleDefaults = { boxId: box.id, position: position, date: todayIso(), status: '在库' };
            openEntryDialog('sample');
            showToast('正在录入 ' + position + '，剩余 ' + sampleIntakeQueue.length + ' 个位置');
            return;
        }
        showToast('照片识别的管位已全部录入');
    }

    function compareBoxPositions(left, right) {
        const leftMatch = left.match(/^([A-Z])(\d+)$/);
        const rightMatch = right.match(/^([A-Z])(\d+)$/);
        if (!leftMatch || !rightMatch) return left.localeCompare(right);
        return leftMatch[1].localeCompare(rightMatch[1]) || Number(leftMatch[2]) - Number(rightMatch[2]);
    }

    function openSearch(query) {
        els.searchOverlay.hidden = false;
        document.body.style.overflow = 'hidden';
        els.overlaySearchInput.value = query || '';
        renderSearchResults(query || '');
        window.setTimeout(function () {
            els.overlaySearchInput.focus();
            els.overlaySearchInput.setSelectionRange(els.overlaySearchInput.value.length, els.overlaySearchInput.value.length);
        }, 0);
    }

    function closeSearch() {
        els.searchOverlay.hidden = true;
        document.body.style.overflow = '';
        els.globalSearch.blur();
    }

    function navigateToSearchResult(result) {
        const type = result.dataset.resultType || '';
        const id = result.dataset.resultId || '';
        if (result.dataset.resultBiologyTab) {
            activeBiologyTab = result.dataset.resultBiologyTab;
            localStorage.setItem('rhineLabBiologyTab', activeBiologyTab);
        }
        if (result.dataset.resultProtocolTab) activeProtocolTab = result.dataset.resultProtocolTab;
        if (result.dataset.resultBioinfoTab) activeBioinfoTab = result.dataset.resultBioinfoTab;

        if (type === 'bioProject') {
            activeBioinfoTab = 'projects';
            activeBioProjectId = '';
            activeBioDatasetId = '';
        } else if (type === 'bioDataset') {
            const dataset = state.bioDatasets.find(function (item) { return item.id === id; });
            activeBioinfoTab = 'projects';
            activeBioProjectId = dataset ? dataset.projectId : '';
            activeBioDatasetId = '';
        } else if (type === 'bioRun') {
            const run = state.bioRuns.find(function (item) { return item.id === id; });
            activeBioinfoTab = 'projects';
            activeBioProjectId = run ? run.projectId : '';
            activeBioDatasetId = run ? run.datasetId : '';
        } else if (type === 'bioPipeline') {
            activeBioinfoTab = 'pipelines';
            activeBioProjectId = '';
            activeBioDatasetId = '';
        } else if (type === 'task') {
            const task = state.schedule.find(function (item) { return item.id === id; });
            if (task) calendarDate = parseLocalDate(task.date);
            calendarMode = 'day';
            localStorage.setItem('rhineLabCalendarMode', calendarMode);
        }
        localStorage.setItem('rhineLabBioinfoTab', activeBioinfoTab);
        localStorage.setItem('rhineLabActiveBioProject', activeBioProjectId);
        localStorage.setItem('rhineLabActiveBioDataset', activeBioDatasetId);

        closeSearch();
        switchView(result.dataset.resultView);
        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                const target = findSearchResultElement(type, id);
                if (!target) return;
                target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                target.classList.add('search-target-highlight');
                window.setTimeout(function () { target.classList.remove('search-target-highlight'); }, 2200);
            });
        });
        showToast('已定位到“' + result.dataset.resultTitle + '”');
    }

    function findSearchResultElement(type, id) {
        let targetType = type;
        let targetId = id;
        if (type === 'result') {
            const result = state.results.find(function (item) { return item.id === id; });
            targetType = 'experiment';
            targetId = result ? result.experimentId : id;
        }
        const lookup = {
            experiment: ['#experimentGrid [data-experiment-id]', 'data-experiment-id'],
            mouse: ['#mouseTable [data-mouse-id]', 'data-mouse-id'],
            plant: ['#plantTable [data-plant-id]', 'data-plant-id'],
            microbe: ['#bioresourceTable [data-bioresource-id]', 'data-bioresource-id'],
            plasmid: ['#bioresourceTable [data-bioresource-id]', 'data-bioresource-id'],
            virus: ['#virusTable [data-virus-id]', 'data-virus-id'],
            reagent: ['#reagentTable [data-reagent-catalog]', 'data-reagent-catalog'],
            sample: ['#sampleTable [data-sample-id]', 'data-sample-id'],
            protocol: ['#protocolGrid [data-protocol-id]', 'data-protocol-id'],
            formulation: ['#formulationGrid [data-formulation-id]', 'data-formulation-id'],
            cell: ['#cellCultureGrid [data-cell-id]', 'data-cell-id'],
            task: ['#view-schedule [data-task-id]', 'data-task-id'],
            bioProject: ['#bioProjectFlow [data-bio-project-toggle]', 'data-bio-project-toggle'],
            bioDataset: ['#bioProjectFlow [data-bio-dataset-toggle]', 'data-bio-dataset-toggle'],
            bioPipeline: ['#bioProjectFlow [data-bioinfo-record]', 'data-bioinfo-record'],
            bioRun: ['#bioProjectFlow [data-bioinfo-record]', 'data-bioinfo-record']
        }[targetType];
        if (!lookup) return null;
        const element = Array.from(document.querySelectorAll(lookup[0])).find(function (item) {
            return item.getAttribute(lookup[1]) === targetId;
        });
        return element && (element.closest('article,tr,button') || element);
    }

    function renderSearchResults(query) {
        const term = query.trim().toLowerCase();
        const entries = [];
        state.experiments.forEach(item => entries.push({ view: 'experiments', type: 'experiment', id: item.id, category: 'EXPERIMENT', title: item.title, detail: item.id + ' · ' + item.project, search: Object.values(item).join(' ') }));
        state.results.forEach(function (item) {
            const experiment = state.experiments.find(record => record.id === item.experimentId);
            entries.push({ view: 'experiments', type: 'result', id: item.id, category: 'RESULT', title: experiment ? experiment.title : item.id, detail: item.date + ' · ' + item.attachments.length + ' 个附件', search: [item.id, item.experimentId, item.summary, item.conclusion, item.nextStep, experiment && experiment.title].join(' ') });
        });
        state.mice.forEach(item => entries.push({ view: 'mice', type: 'mouse', id: item.id, biologyTab: 'animals', category: 'ANIMAL', title: item.id + ' · ' + (item.species || '动物') + ' · ' + item.strain, detail: item.genotype + ' · 笼位 ' + item.cage, search: Object.values(item).join(' ') }));
        state.plants.forEach(item => entries.push({ view: 'mice', type: 'plant', id: item.id, biologyTab: 'plants', category: 'PLANT', title: item.name + ' · ' + item.id, detail: [item.scientificName, item.accession, item.location].filter(Boolean).join(' · '), search: Object.values(item).join(' ') }));
        state.microbes.forEach(item => entries.push({ view: 'mice', type: 'microbe', id: item.id, biologyTab: 'microbes', category: 'MICROBIAL STRAIN', title: item.name + ' · ' + item.id, detail: [item.species, item.strain, item.location].filter(Boolean).join(' · '), search: Object.values(item).join(' ') }));
        state.plasmids.forEach(item => entries.push({ view: 'mice', type: 'plasmid', id: item.id, biologyTab: 'microbes', category: 'PLASMID', title: item.name + ' · ' + item.id, detail: [item.backbone, item.insert, item.location].filter(Boolean).join(' · '), search: Object.values(item).join(' ') }));
        state.viruses.forEach(item => entries.push({ view: 'mice', type: 'virus', id: item.id, biologyTab: 'viruses', category: 'VIRUS', title: item.name + ' · ' + item.id, detail: [item.virusType, item.serotype, item.titer].filter(Boolean).join(' · '), search: Object.values(item).join(' ') }));
        state.reagents.forEach(item => entries.push({ view: 'reagents', type: 'reagent', id: item.catalog, category: 'REAGENT', title: item.name, detail: item.catalog + ' · ' + item.location, search: Object.values(item).join(' ') }));
        state.samples.forEach(item => entries.push({ view: 'samples', type: 'sample', id: item.id, category: 'SAMPLE', title: item.id + ' · ' + item.type, detail: item.source + ' · ' + item.location, search: Object.values(item).join(' ') }));
        state.schedule.forEach(item => entries.push({ view: 'schedule', type: 'task', id: item.id, category: 'SCHEDULE', title: item.title, detail: item.date + ' · ' + (hasScheduleTime(item) ? item.time + '–' + item.end : '无固定时间'), search: Object.values(item).join(' ') }));
        state.protocols.forEach(item => entries.push({ view: 'protocols', type: 'protocol', id: item.id, protocolTab: 'protocols', category: 'PROTOCOL', title: item.title, detail: item.number, search: [item.number, item.title, item.summary, item.steps.join(' '), item.literatureTitle, item.literatureCitation, item.literatureId].join(' ') }));
        state.formulations.forEach(item => entries.push({ view: 'protocols', type: 'formulation', id: item.id, protocolTab: 'formulations', category: 'FORMULATION', title: item.name, detail: item.physicalForm + ' · ' + formulationAmountLabel(item), search: [item.id, item.name, item.physicalForm, item.purpose, item.concentration, item.storage, item.components.map(component => [component.name, component.amount, component.unit].join(' ')).join(' ')].join(' ') }));
        state.cellCultures.forEach(item => entries.push({ view: 'cells', type: 'cell', id: item.id, category: 'CELL CULTURE', title: item.name + ' · P' + item.passage, detail: item.container + ' · ' + item.incubator, search: [item.id, item.name, item.species, item.medium, item.container, item.incubator].join(' ') }));
        state.bioProjects.forEach(item => entries.push({ view: 'bioinformatics', type: 'bioProject', id: item.id, bioinfoTab: 'projects', category: 'BIOINFORMATICS PROJECT', title: item.name, detail: [item.id, item.referenceGenome].filter(Boolean).join(' · '), search: Object.values(item).join(' ') }));
        state.bioDatasets.forEach(item => entries.push({ view: 'bioinformatics', type: 'bioDataset', id: item.id, bioinfoTab: 'projects', category: 'DATASET', title: item.name, detail: [item.id, item.dataType, item.accession].filter(Boolean).join(' · '), search: Object.values(item).join(' ') }));
        state.bioPipelines.forEach(item => entries.push({ view: 'bioinformatics', type: 'bioPipeline', id: item.id, bioinfoTab: 'pipelines', category: 'WORKFLOW', title: item.name, detail: [item.id, item.version, item.environment].filter(Boolean).join(' · '), search: Object.values(item).join(' ') }));
        state.bioRuns.forEach(item => entries.push({ view: 'bioinformatics', type: 'bioRun', id: item.id, bioinfoTab: 'projects', category: 'ANALYSIS RUN', title: item.name || item.id, detail: [item.id, item.status, item.compute].filter(Boolean).join(' · '), search: Object.values(item).join(' ') }));
        const results = entries.filter(item => !term || item.search.toLowerCase().includes(term)).slice(0, 12);
        els.searchResults.innerHTML = results.map(function (item) {
            return '<button class="search-result" type="button" data-result-view="' + item.view + '" data-result-type="' + item.type + '" data-result-id="' + esc(item.id) + '"' + (item.biologyTab ? ' data-result-biology-tab="' + item.biologyTab + '"' : '') + (item.bioinfoTab ? ' data-result-bioinfo-tab="' + item.bioinfoTab + '"' : '') + (item.protocolTab ? ' data-result-protocol-tab="' + item.protocolTab + '"' : '') + ' data-result-title="' + esc(item.title) + '"><span>' + esc(item.category) + '</span><span><strong>' + esc(item.title) + '</strong><small>' + esc(item.detail) + '</small></span><b>→</b></button>';
        }).join('') || '<div class="search-empty">数据库中没有与“' + esc(query) + '”匹配的记录。</div>';
    }

    const dialogSchemas = {
        experiment: {
            kicker: 'NEW EXPERIMENT RECORD', title: '新建实验记录',
            fields: [
                field('title', '实验名称', 'text', '例：海马组织免疫荧光', true),
                field('project', '所属项目', 'text', '例：记忆环路可塑性', true),
                field('status', '当前状态', 'select', ['进行中', '待分析', '已完成'], true),
                field('type', '实验类型', 'text', '例：组织学', true),
                field('date', '实验日期', 'date', '', true),
                field('protocolId', '关联 Protocol', 'protocol-select', '', false, true),
                field('description', '实验目的与简述', 'textarea', '记录核心假设、变量和预期观察…', true, true),
                field('photoData', '照片辅助录入', 'photo-capture', '拍摄实验记录、手写记录或仪器屏幕', false, true)
            ]
        },
        result: {
            kicker: 'EXPERIMENT RESULT', title: '填写实验结果',
            fields: [
                field('experimentId', '对应实验记录', 'result-experiment-select', '', true, true),
                field('date', '结果日期', 'date', '', true),
                field('summary', '主要结果', 'textarea', '记录最重要的观察、数值、图像特征或统计结果…', true, true),
                field('conclusion', '结论与解释', 'textarea', '说明结果是否支持假设、可能原因与限制…', true, true),
                field('nextStep', '下一步计划', 'textarea', '记录复现、补充实验或后续分析安排…', false, true),
                field('attachments', '照片与文件附件', 'file-attachments', '', false, true)
            ]
        },
        mouse: {
            kicker: 'ANIMAL REGISTRATION', title: '添加动物条目',
            fields: [
                field('id', '动物编号', 'text', '例：ANM-001', true),
                field('species', '物种', 'select', ['小鼠', '大鼠', '兔', '豚鼠', '斑马鱼', '果蝇', '非人灵长类', '其他'], true),
                field('strain', '品种 / 品系', 'text', '例：C57BL/6J', true),
                field('genotype', '基因型 / 亚型', 'text', '例：WT', false),
                field('sex', '性别', 'select', ['雄', '雌', '未知', '不适用'], true),
                field('birth', '出生 / 孵化日期', 'date', '', false),
                field('cageId', '所属笼位', 'animal-cage-select', '', true),
                field('status', '当前状态', 'select', ['在养', '观察期', '繁育中', '实验中', '隔离中', '已转出'], true),
                field('line', '繁育系 / 群体', 'text', '例：Camk2a-Cre × Ai148', false),
                field('parents', '亲本 / 系谱', 'text', '例：M-23018 × M-23024', false),
                field('project', '研究项目', 'text', '例：记忆环路可塑性', false),
                field('marker', '个体标记', 'text', '例：耳标 071 / 尾纹', false),
                field('ethics', '伦理审批编号', 'text', '例：IACUC-2026-001', false),
                field('notes', '动物备注', 'textarea', '记录体重、标记方式、来源或特殊照护要求…', false, true)
            ]
        },
        plant: {
            kicker: 'PLANT MATERIAL REGISTRATION', title: '登记植物材料',
            fields: [
                field('id', '材料编号', 'text', '例：PLT-AT-001', true),
                field('name', '材料名称', 'text', '例：拟南芥 Col-0', true),
                field('scientificName', '学名', 'text', '例：Arabidopsis thaliana', false),
                field('materialType', '材料类型', 'select', ['种子', '植株', '幼苗', '愈伤组织', '组织培养', '花粉', '果实', '其他'], true),
                field('accession', '品系 / 种质号', 'memory-text', '例：Col-0', false),
                field('generation', '世代', 'text', '例：T3 / F2 / BC1', false),
                field('genotype', '基因型', 'text', '例：WT / 编辑候选株', false),
                field('parentage', '亲本 / 谱系', 'text', '例：母本 × 父本或自交来源', false, true),
                field('growthStage', '生长阶段', 'memory-text', '例：莲座期 / 开花期', false),
                field('growthConditions', '环境与条件', 'memory-text', '例：22°C · 16 h / 8 h 光周期', false, true),
                field('rackId', '所属培养架', 'plant-rack-select', '', false),
                field('position', '架内位置', 'text', '例：A1', false),
                field('treatment', '处理', 'text', '例：干旱处理 / 农杆菌浸润', false),
                field('phenotype', '表型观察', 'textarea', '记录株高、叶色、发育、成像或评分…', false, true),
                field('status', '当前状态', 'select', ['在库', '生长中', '待处理', '筛选中', '已收获', '已终止'], true),
                field('frozenSampleId', '关联冻存样本', 'frozen-sample-select', '', false, true),
                field('notes', '备注', 'textarea', '记录播种、移栽、批次或特殊条件…', false, true)
            ]
        },
        microbe: {
            kicker: 'MICROBIAL STRAIN REGISTRATION', title: '录入菌种',
            fields: [
                field('id', '菌种编号', 'text', '例：MIC-DH5A-001', true),
                field('name', '菌种名称', 'text', '例：E. coli DH5α', true),
                field('species', '物种', 'text', '例：Escherichia coli', false),
                field('strain', '株系', 'text', '例：DH5α', false),
                field('biosafetyLevel', '生物安全等级', 'select', ['BSL-1', 'BSL-2', 'BSL-3', '其他'], true),
                field('genotype', '基因型 / 遗传特征', 'textarea', '记录基因型、缺失、携带元件或关键表型…', false, true),
                field('source', '来源', 'text', '例：实验室保藏 / 菌种库', false),
                field('medium', '培养基', 'memory-text', '例：LB / YPD / MRS', false),
                field('growthConditions', '培养条件', 'memory-text', '例：37°C · 200 rpm · 16 h', false, true),
                field('resistance', '抗性 / 筛选标记', 'memory-text', '例：Ampicillin', false),
                field('location', '存储位置', 'memory-text', '例：-80°C / MIC-A1', false),
                field('status', '当前状态', 'select', ['在库', '培养中', '待鉴定', '污染隔离', '已耗尽'], true),
                field('frozenSampleId', '关联冻存样本', 'frozen-sample-select', '', false, true),
                field('notes', '备注', 'textarea', '记录用途、鉴定结果、保藏方式或异常…', false, true)
            ]
        },
        plasmid: {
            kicker: 'PLASMID REGISTRATION', title: '录入质粒',
            fields: [
                field('id', '质粒编号', 'text', '例：PLA-PUC19-001', true),
                field('name', '质粒名称', 'text', '例：pUC19', true),
                field('backbone', '载体骨架', 'memory-text', '例：pUC19 / pLenti', false),
                field('insert', '插入片段 / 载荷', 'text', '例：GFP / Cas9-sgRNA', false),
                field('host', '扩增宿主', 'memory-text', '例：E. coli DH5α', false),
                field('sizeBp', '长度（bp）', 'number', '2686', false),
                field('resistance', '筛选标记 / 抗性', 'memory-text', '例：Ampicillin', false),
                field('promoter', '启动子', 'memory-text', '例：CMV / EF1α / T7', false),
                field('source', '来源', 'text', '例：Addgene / 实验室构建', false),
                field('sequenceRef', '序列 / 文件参考', 'text', 'GenBank、FASTA、SBOL 或本地文件名', false, true),
                field('location', '存储位置', 'memory-text', '例：-20°C / DNA-A1', false),
                field('status', '当前状态', 'select', ['在库', '待测序', '待鉴定', '构建中', '已耗尽'], true),
                field('frozenSampleId', '关联冻存样本', 'frozen-sample-select', '', false, true),
                field('notes', '备注', 'textarea', '记录克隆策略、测序验证或使用限制…', false, true)
            ]
        },
        virus: {
            kicker: 'VIRAL RESOURCE REGISTRATION', title: '录入病毒',
            fields: [
                field('id', '病毒编号', 'text', '例：VIR-AAV9-001', true),
                field('name', '名称', 'text', '例：AAV9-hSyn-GCaMP6s', true),
                field('virusType', '病毒 / 载体类型', 'select', ['AAV 载体', '慢病毒载体', '腺病毒载体', '噬菌体', '实验病毒株', '其他'], true),
                field('serotype', '株系 / 血清型', 'text', '例：AAV9 / VSV-G 假型', false),
                field('genome', '基因组类型', 'select', ['ssDNA', 'dsDNA', 'ssRNA', 'dsRNA', '逆转录 RNA', '其他'], false),
                field('cargo', '表达载荷', 'text', '例：hSyn-GCaMP6s', false, true),
                field('hostRange', '宿主', 'text', '例：神经元 / 哺乳动物细胞', false, true),
                field('titer', '滴度', 'text', '例：2.1 × 10¹³ vg/mL', false),
                field('batch', '制备批次', 'text', '例：AAV9-2607', false),
                field('biosafetyLevel', '生物安全等级', 'select', ['BSL-1', 'BSL-2', 'BSL-3', '其他'], true),
                field('productionDate', '制备日期', 'date', '', false),
                field('location', '存储位置', 'memory-text', '例：-80°C / VIR-A1', false),
                field('status', '当前状态', 'select', ['在库', '待滴定', '待质控', '使用中', '已耗尽'], true),
                field('frozenSampleId', '关联冻存样本', 'frozen-sample-select', '', false, true),
                field('notes', '备注', 'textarea', '记录包装体系、质控、冻融次数或使用限制…', false, true)
            ]
        },
        animalRoom: {
            kicker: 'ANIMAL FACILITY', title: '新建动物房间',
            fields: [
                field('name', '房间名称', 'text', '例：动物中心 A 区', true),
                field('shape', '房间形状', 'select', ['矩形', '圆角', '斜角', 'L 形'], true),
                field('entranceSide', '入口方向', 'select', ['左侧', '右侧', '上侧', '下侧'], true),
                field('entrancePosition', '入口位置（%）', 'number', '50', true),
                field('notes', '房间说明', 'textarea', '记录屏障级别、温湿度或房间用途…', false, true)
            ]
        },
        animalRack: {
            kicker: 'ANIMAL HOUSING', title: '新建动物笼架',
            fields: [
                field('name', '笼架名称', 'text', '例：A 区笼架 1', true),
                field('roomId', '所属房间', 'animal-room-select', '', true),
                field('rows', '笼架行数（最多 12 行）', 'number', '4', true),
                field('columns', '每行笼位数', 'number', '8', true)
            ]
        },
        animalCage: {
            kicker: 'ANIMAL HOUSING', title: '新建动物笼位',
            fields: [
                field('rackId', '所属笼架', 'animal-rack-select', '', true),
                field('position', '架内位置', 'text', '例：A1', true),
                field('label', '笼位标签', 'text', '例：CAGE-A01', true),
                field('species', '物种', 'select', ['小鼠', '大鼠', '兔', '豚鼠', '斑马鱼', '果蝇', '非人灵长类', '混合 / 待设置', '其他'], true),
                field('capacity', '建议容量', 'number', '5', true),
                field('status', '笼位状态', 'select', ['在用', '隔离', '清洁中', '停用'], true),
                field('notes', '饲养条件与备注', 'textarea', '记录垫料、光照、饲料、温度或特殊照护要求…', false, true)
            ]
        },
        plantRoom: {
            kicker: 'PLANT GROWTH ROOM', title: '新建植物培养室',
            fields: [
                field('name', '培养室名称', 'text', '例：植物房 GR-01', true),
                field('shape', '房间形状', 'select', ['矩形', '圆角', '斜角', 'L 形'], true),
                field('entranceSide', '入口方向', 'select', ['左侧', '右侧', '上侧', '下侧'], true),
                field('entrancePosition', '入口位置（%）', 'number', '50', true),
                field('notes', '培养室说明', 'textarea', '记录光周期、温湿度或培养用途…', false, true)
            ]
        },
        plantRack: {
            kicker: 'PLANT GROWTH HOUSING', title: '新建植物培养架',
            fields: [
                field('name', '培养架名称', 'text', '例：GR-01 培养架 1', true),
                field('roomId', '所属培养室', 'plant-room-select', '', true),
                field('rows', '培养架行数（最多 12 行）', 'number', '5', true),
                field('columns', '每行位置数', 'number', '10', true)
            ]
        },
        bioProject: {
            kicker: 'COMPUTATIONAL PROJECT', title: '新建生物信息项目',
            fields: [
                field('id','项目编号','text','例：BIO-PRJ-001',true), field('name','项目名称','text','例：空间转录组图谱',true),
                field('referenceGenome','参考基因组','memory-text','例：GRCm39 / mm39',false),
                field('objective','研究目标','textarea','记录核心问题与分析范围…',false,true),
                field('repository','数据 / 项目位置','memory-text','例：DATA-01 / projects/demo',false), field('status','项目状态','select',['准备中','进行中','暂停','已完成','已归档'],true),
                field('notes','备注','textarea','记录访问权限、关键版本或协作说明…',false,true)
            ]
        },
        bioDataset: {
            kicker: 'RESEARCH DATASET', title: '登记生物信息数据集',
            fields: [
                field('id','数据集编号','text','例：BIO-DATA-001',true), field('name','数据集名称','text','例：CA1 RNA-seq 原始数据',true),
                field('dataType','数据类型','select',['RNA-seq','单细胞转录组','空间转录组','全基因组测序','外显子组','宏基因组','蛋白质组','成像组学','临床队列','其他'],true),
                field('projectId','关联项目','bio-project-select','',false), field('sampleSource','样本 / 来源','text','样本编号、公共数据库或队列',false),
                field('accession','登录号 / 内部批次','text','GEO、SRA、ENA 或内部编号',false), field('size','数据规模','text','例：186 GB / 48 samples',false),
                field('checksum','完整性校验','text','例：SHA256 已校验',false), field('location','数据位置','memory-text','例：DATA-01 / raw/rnaseq',false),
                field('format','文件格式','memory-text','例：FASTQ + metadata.tsv',false), field('notes','备注','textarea','记录授权范围、去标识化或质控信息…',false,true)
            ]
        },
        bioPipeline: {
            kicker: 'REPRODUCIBLE WORKFLOW', title: '新建分析方法',
            fields: [
                field('id','流程编号','text','例：BIO-FLOW-001',true), field('name','流程名称','text','例：RNA-seq 标准流程',true),
                field('version','版本','text','例：nf-core/rnaseq 3.18',false), field('analysisType','分析类型','memory-text','例：转录组定量',false),
                field('environment','运行环境','memory-text','例：Nextflow · Docker',false), field('repository','代码仓库 / 位置','text','Git URL 或本地路径',false),
                field('inputType','输入要求','text','例：FASTQ + sample sheet',false), field('outputType','输出内容','text','例：QC + counts + BAM',false),
                field('command','运行脚本','textarea','记录可复现的入口命令、参数或脚本…',false,true), field('projectId','默认关联项目','bio-project-select','',false),
                field('notes','备注','textarea','记录依赖、资源要求或验证状态…',false,true)
            ]
        },
        bioRun: {
            kicker: 'ANALYSIS RUN', title: '新建分析任务',
            fields: [
                field('id','任务编号','text','例：BIO-RUN-001',true), field('projectId','关联项目','bio-project-select','',false),
                field('pipelineId','分析流程','bio-pipeline-select','',false), field('datasetId','输入数据集','bio-dataset-select','',false),
                field('compute','计算资源','memory-text','例：24 CPU · 96 GB · GPU 0',false), field('startDate','开始日期','date','',false),
                field('endDate','完成日期','date','',false), field('status','运行状态','select',['排队中','运行中','失败','已完成','已取消'],true),
                field('outputLocation','输出位置','memory-text','例：DATA-01 / results/run-001',false), field('notes','运行备注','textarea','记录关键参数、错误原因或质控结论…',false,true)
            ]
        },        reagent: {
            kicker: 'INVENTORY INTAKE', title: '录入新试剂',
            fields: [
                field('name', '试剂名称', 'text', '例：Anti-NeuN antibody', true),
                field('category', '试剂类别', 'select', ['抗体', '培养基', '化学试剂', '实验耗材', '染料', '酶'], true),
                field('catalog', '品牌货号', 'text', 'CATALOG NO.', true),
                field('lot', '批次号', 'text', 'LOT NO.', true),
                field('location', '存储位置', 'text', '-20°C / R2-C1', true),
                field('totalQty', '包装总量', 'number', '100', true),
                field('currentQty', '当前实际余量', 'number', '100', true),
                field('unit', '计量单位', 'select', ['mL', 'µL', 'g', 'mg', '片', '支'], true),
                field('expiry', '有效期', 'date', '', true),
                field('photoData', '拍照识别 / 留档', 'photo-capture', '拍摄试剂标签；支持浏览器条码识别', false, true)
            ]
        },
        sample: {
            kicker: 'BIOBANK INTAKE', title: '登记新生物样本',
            fields: [
                field('id', '样本编号', 'text', 'RL-S-0862', true),
                field('type', '样本类型', 'select', ['脑组织', '细胞沉淀', 'RNA', 'DNA', '血清', '蛋白裂解液', '切片'], true),
                field('source', '样本来源', 'text', '动物编号 / 细胞系', true),
                field('processing', '处理方式', 'text', '例：液氮速冻', true),
                field('boxId', '冻存盒', 'freezer-select', '', true),
                field('position', '盒内位置', 'text', 'A1', true),
                field('date', '入库日期', 'date', '', true),
                field('status', '当前状态', 'select', ['在库', '剩余少'], true),
                field('photoData', '样本照片', 'photo-capture', '拍摄冻存管标签或样本外观', false, true)
            ]
        },
        cell: {
            kicker: 'CELL CULTURE REGISTRATION', title: '登记培养细胞',
            fields: [
                field('id', '培养记录编号', 'text', 'CELL-BV2-01', true),
                field('name', '细胞名称 / 细胞系', 'text', '例：BV2', true),
                field('species', '物种 / 来源', 'text', '例：Mus musculus', true),
                field('medium', '当前培养基', 'memory-text', '例：DMEM + 10% FBS', true, true),
                field('container', '培养容器', 'memory-text', '例：T75 培养瓶', true),
                field('incubator', '培养位置与条件', 'memory-text', '37°C / 5% CO₂ · INC-01 / A2', true, true),
                field('passage', '当前代次', 'number', '1', true),
                field('confluence', '当前汇合度（%）', 'number', '50', true),
                field('notes', '培养备注', 'textarea', '记录细胞形态、用途、污染检查或特别培养要求…', false, true),
                field('photoData', '当前培养照片', 'photo-capture', '拍摄显微视野、培养容器或细胞状态', false, true)
            ]
        },
        passage: {
            kicker: 'CELL CULTURE LOG', title: '记录传代 / 培养操作',
            fields: [
                field('date', '操作日期', 'date', '', true),
                field('action', '操作类型', 'select', ['传代', '换液', '复苏', '冻存', '观察', '加药处理', '污染处理'], true),
                field('passage', '操作后代次', 'number', '1', true),
                field('ratio', '传代比例 / 接种量', 'text', '例：1:4 或 2.0 × 10⁵ cells/well', true),
                field('container', '操作后容器', 'memory-text', '例：T75 培养瓶', true),
                field('confluence', '操作后汇合度（%）', 'number', '25', true),
                field('medium', '培养基', 'memory-text', '例：DMEM + 10% FBS', true, true),
                field('notes', '操作记录与观察', 'textarea', '记录消化时间、细胞状态、接种密度和异常情况…', false, true),
                field('photoData', '本次操作照片', 'photo-capture', '拍摄传代前后显微视野或培养容器', false, true)
            ]
        },
        task: {
            kicker: 'SCHEDULE ENTRY', title: '添加实验日程',
            fields: [
                field('date', '日期', 'date', '', true),
                field('time', '开始时间（可选）', 'time', '09:00', false),
                field('end', '结束时间（可选）', 'time', '10:00', false),
                field('title', '任务名称', 'text', '例：细胞传代', true),
                field('resource', '地点 / 仪器', 'text', '细胞房 · BSC-01', true),
                field('type', '任务类型', 'select', ['cell|细胞 / 成像', 'animal|动物操作', 'analysis|数据分析', 'meeting|会议'], true),
                field('experimentId', '关联实验（用于开始与继续）', 'experiment-select', '', false, true),
                field('protocolId', '关联 Protocol（用于理论耗量）', 'protocol-select', '', false, true)
            ]
        },
        protocol: {
            kicker: 'PROTOCOL BUILDER', title: '录入 Protocol',
            fields: [
                field('title', 'Protocol 名称', 'text', '例：细胞免疫荧光染色', true),
                field('summary', '注释', 'textarea', '记录用途、关键条件或注意事项…', false, true),
                field('literatureTitle', '关联文献题目', 'text', '输入与本 Protocol 相关的文献题目', false, true),
                field('literatureCitation', '作者 / 期刊 / 年份', 'text', '例：Author et al. · Journal · 2025', false, true),
                field('literatureId', 'DOI / PMID', 'text', '例：10.xxxx/xxxxx 或 PMID 12345678', false),
                field('literatureUrl', '文献链接', 'url', 'https://doi.org/... 或 PubMed 链接', false),
                field('stepsText', '实验步骤（每行一步）', 'textarea', '样本固定\n通透与封闭\n一抗孵育\n二抗染色', true, true),
                field('reagents', '每次执行的试剂用量', 'reagent-list', '', false, true),
                field('photoData', '方案照片辅助录入', 'photo-capture', '拍摄纸质 SOP 或实验本页面作为附件', false, true)
            ]
        },
        formulation: {
            kicker: 'FORMULATION BUILDER', title: '新建实验配方',
            fields: [
                field('name', '配方名称', 'text', '例：1× PBS · pH 7.4', true, true),
                field('physicalForm', '物态 / 形态', 'select', ['液体', '固体', '气体', '悬液', '凝胶', '乳液', '其他'], true),
                field('purpose', '用途', 'text', '例：细胞与组织清洗', false),
                field('finalAmount', '终量', 'number', '500', false),
                field('unit', '终量单位', 'select', ['mL', 'L', 'µL', 'g', 'mg', 'kg', 'mol', 'batch|批'], false),
                field('concentration', '目标浓度', 'text', '例：1×、1.5% (w/v) 或 5% CO₂', false),
                field('components', '配方组成', 'formulation-components', '', false, true),
                field('preparation', '配制方法', 'textarea', '按顺序记录溶解、混合、调节 pH、定容、灭菌或供气步骤…', false, true),
                field('storage', '保存条件', 'memory-text', '例：4°C 避光、室温或现配现用', false),
                field('version', '版本', 'text', 'V1.0', false),
                field('notes', '备注', 'textarea', '记录安全要求、稳定期、质量检查或替代组分…', false, true)
            ]
        },
        coldStorage: {
            kicker: 'COLD STORAGE EQUIPMENT', title: '新增冰箱 / 液氮罐',
            fields: [
                field('name', '设备名称', 'text', '例：-80°C 超低温冰箱 FZ-01', true),
                field('type', '设备类型', 'select', ['超低温冰箱', '-20°C 冰箱', '4°C 冰箱', '液氮罐'], true),
                field('temperature', '存储条件', 'select', ['-80°C', '-20°C', '4°C', '液氮'], true),
                field('location', '设备位置', 'text', '例：样本库 A 区 / 北墙 01 位', true),
                field('orientation', '货架排列', 'select', ['横向', '竖向'], true),
                field('shelves', '货架 / 层数量', 'number', '5', true),
                field('levelLayout', '各层结构（每行：直放；或货架 数量架 行×列）', 'textarea', '直放 1x4\n货架 2架 2x4\n货架 3架 3x4\n直放 1x4\n货架 2架 2x4', true, true)
            ]
        },
        coldStorageLevel: {
            kicker: 'COLD STORAGE LEVEL', title: '编辑设备层',
            fields: [
                field('mode', '层结构', 'select', ['直放', '货架'], true),
                field('rackCount', '货架数量', 'number', '2', true),
                field('rows', '盒位行数', 'number', '2', true),
                field('columns', '盒位列数', 'number', '4', true)
            ]
        },
        freezer: {
            kicker: 'FREEZER BOX REGISTRATION', title: '新增冻存盒',
            fields: [
                field('name', '冻存盒名称', 'text', '例：FZ-03 / C2', true),
                field('storageUnitId', '所属冰箱 / 液氮罐', 'cold-storage-select', '', true),
                field('shelf', '层架', 'number', '1', true),
                field('storageRack', '货架编号', 'number', '1', true),
                field('storageRow', '盒位行', 'number', '1', true),
                field('storageColumn', '盒位列', 'number', '1', true),
                field('rows', '行数', 'select', ['4', '5', '6', '7', '8', '9', '10'], true),
                field('columns', '列数', 'select', ['6', '7', '8', '9', '10', '12'], true)
            ]
        }
    };

    function field(name, label, type, placeholderOrOptions, required, full) {
        return { name, label, type, placeholderOrOptions, required: Boolean(required), full: Boolean(full) };
    }

    function openEntryDialog(type, options) {
        const schema = dialogSchemas[type];
        if (!schema) return;
        const editOptions = options && options.edit ? options : null;
        editingRecord = editOptions ? { type: type, key: editOptions.key } : null;
        let defaultsForEntry = null;
        if (editOptions) {
            defaultsForEntry = clone(editOptions.record);
            if (type === 'protocol') defaultsForEntry.stepsText = (editOptions.record.steps || []).join('\n');
            if (type === 'coldStorage') defaultsForEntry.levelLayout = coldStorageLevelsText(editOptions.record.levels || []);
        } else if (type === 'result') {
            const preferred = state.experiments.find(item => item.id === pendingResultExperimentId) || state.experiments.find(function (experiment) {
                return !state.results.some(result => result.experimentId === experiment.id);
            });
            defaultsForEntry = { experimentId: preferred ? preferred.id : '', date: preferred ? preferred.date : todayIso() };
        } else if (type === 'task') {
            defaultsForEntry = Object.assign({ date: toIsoDate(calendarDate), time: '', end: '', experimentId: '', protocolId: '', shareWithLab: 'yes' }, pendingTaskDefaults || {});
        } else if (type === 'sample') {
            defaultsForEntry = Object.assign({ boxId: activeFreezerBoxId, date: todayIso(), status: '在库' }, pendingSampleDefaults || {});
        } else if (type === 'mouse') {
            const cage = state.animalCages.find(item => item.id === selectedAnimalCageId);
            defaultsForEntry = { cageId: cage ? cage.id : '', species: cage && !cage.species.includes('混合') ? cage.species : '小鼠', status: '在养' };
        } else if (type === 'plant') {
            const rack = state.plantRacks.find(function (item) { return item.id === activePlantRackId; });
            defaultsForEntry = Object.assign({ materialType: '植株', status: '生长中', rackId: rack ? rack.id : '', position: rack ? firstAvailablePlantPosition(rack, state.plants) : '' }, pendingPlantDefaults || {});
        } else if (type === 'microbe') {
            defaultsForEntry = { biosafetyLevel: 'BSL-1', status: '在库' };
        } else if (type === 'plasmid') {
            defaultsForEntry = { status: '在库' };
        } else if (type === 'virus') {
            defaultsForEntry = { biosafetyLevel: 'BSL-1', status: '在库' };
        } else if (type === 'animalRoom') {
            defaultsForEntry = { shape: '矩形', entranceSide: '右侧', entrancePosition: 50 };
        } else if (type === 'animalRack') {
            defaultsForEntry = { roomId: activeAnimalRoomId || (state.animalRooms[0] ? state.animalRooms[0].id : ''), rows: '4', columns: '8' };
        } else if (type === 'plantRoom') {
            defaultsForEntry = { shape: '矩形', entranceSide: '右侧', entrancePosition: 50 };
        } else if (type === 'plantRack') {
            defaultsForEntry = { roomId: activePlantRoomId || (state.plantRooms[0] ? state.plantRooms[0].id : ''), rows: '5', columns: '10' };
        } else if (type === 'bioProject') {
            defaultsForEntry = { status: '准备中' };
        } else if (type === 'bioDataset') {
            defaultsForEntry = { projectId: activeBioProjectId || (state.bioProjects[0] ? state.bioProjects[0].id : '') };
        } else if (type === 'bioPipeline') {
            defaultsForEntry = { projectId: activeBioProjectId || '' };
        } else if (type === 'bioRun') {
            defaultsForEntry = { projectId: activeBioProjectId || (state.bioProjects[0] ? state.bioProjects[0].id : ''), pipelineId: state.bioPipelines.find(function (item) { return item.projectId === activeBioProjectId; })?.id || (state.bioPipelines[0] ? state.bioPipelines[0].id : ''), datasetId: activeBioDatasetId || (state.bioDatasets.find(function (item) { return item.projectId === activeBioProjectId; })?.id || (state.bioDatasets[0] ? state.bioDatasets[0].id : '')), startDate: todayIso(), status: '排队中' };
        } else if (type === 'animalCage') {
            const rack = state.animalRacks.find(item => item.id === activeAnimalRackId);
            defaultsForEntry = Object.assign({ rackId: rack ? rack.id : '', position: rack ? firstAvailableAnimalPosition(rack, state.animalCages) : '', species: '小鼠', capacity: 5, status: '在用' }, pendingAnimalCageDefaults || {});
        } else if (type === 'formulation') {
            defaultsForEntry = { physicalForm: '液体', unit: 'mL', version: 'V1.0' };
        } else if (type === 'coldStorage') {
            const levels = normalizeColdStorageLevels({ shelves: 5, levels: [{ mode: 'direct', rows: 1, columns: 4 }, { mode: 'rack', rackCount: 2, rows: 2, columns: 4 }, { mode: 'rack', rackCount: 3, rows: 3, columns: 4 }, { mode: 'direct', rows: 1, columns: 4 }, { mode: 'rack', rackCount: 2, rows: 2, columns: 4 }] });
            defaultsForEntry = { type: '超低温冰箱', temperature: '-80°C', orientation: '横向', shelves: 5, levelLayout: coldStorageLevelsText(levels) };
        } else if (type === 'coldStorageLevel') {
            const unit = state.coldStorageUnits.find(item => item.id === activeColdStorageId) || state.coldStorageUnits[0];
            const level = coldStorageLevel(unit, editingColdStorageLevel || activeColdStorageShelf);
            defaultsForEntry = { mode: level.mode === 'rack' ? '货架' : '直放', rackCount: level.rackCount || 1, rows: level.rows, columns: level.columns };
        } else if (type === 'freezer') {
            const unit = state.coldStorageUnits.find(item => item.id === activeColdStorageId) || state.coldStorageUnits[0];
            const requestedShelf = Math.min(Math.max(1, Number(activeColdStorageShelf) || 1), Math.max(1, Number(unit.shelves) || 1));
            const slot = firstAvailableColdStorageSlot(unit, requestedShelf, editOptions && editOptions.key);
            defaultsForEntry = Object.assign({ storageUnitId: unit.id, shelf: requestedShelf, storageRack: slot.rack, storageRow: slot.row, storageColumn: slot.column, rows: '9', columns: '9' }, pendingFreezerDefaults || {});
        } else if (type === 'cell') {
            defaultsForEntry = { passage: 1, confluence: 50 };
        } else if (type === 'passage') {
            const culture = state.cellCultures.find(item => item.id === activeCellId);
            if (!culture) return;
            defaultsForEntry = {
                date: todayIso(),
                action: '传代',
                passage: Math.max(0, positiveNumber(culture.passage, 0) + 1),
                ratio: '1:3',
                container: culture.container,
                confluence: 25,
                medium: culture.medium
            };
        }
        pendingPhotoData = editOptions && editOptions.record.photoData ? editOptions.record.photoData : '';
        pendingResultAttachments = type === 'result' && editOptions ? clone(editOptions.record.attachments || []) : [];
        activeDialogType = type;
        els.entryDialog.dataset.entryType = type;
        if (els.entrySaveStatus) {
            const saveStatusRow = els.entrySaveStatus.closest('p');
            const hideRoomStatus = type === 'animalRoom' || type === 'plantRoom';
            els.entrySaveStatus.hidden = hideRoomStatus;
            if (saveStatusRow) saveStatusRow.hidden = hideRoomStatus;
        }
        els.dialogKicker.textContent = editOptions ? 'EDITABLE DATABASE RECORD' : schema.kicker;
        els.dialogTitle.textContent = editOptions ? '编辑' + recordTypeLabel(type) + '信息' : schema.title;
        els.entrySubmitButton.textContent = editOptions ? '保存修改' : '确认保存';
        els.dialogFields.innerHTML = schema.fields.map(fieldHtml).join('');
        if (type === 'result') renderPendingResultAttachments();
        if (type === 'protocol' && editOptions) renderProtocolReagentEditor(editOptions.record.reagents || []);
        if (type === 'formulation') renderFormulationComponentEditor(editOptions ? editOptions.record.components || [] : []);
        if (defaultsForEntry) {
            Object.keys(defaultsForEntry).forEach(function (name) {
                const control = els.entryForm.elements.namedItem(name);
                if (!control) return;
                if (control.matches && control.matches('[data-custom-select]')) {
                    const value = String(defaultsForEntry[name] == null ? '' : defaultsForEntry[name]);
                    const hasPreset = Array.from(control.options).some(function (option) { return option.value === value; });
                    control.value = hasPreset ? value : '__custom__';
                    toggleCustomSelectInput(control, hasPreset ? '' : value, false);
                    return;
                }
                control.value = defaultsForEntry[name];
            });
        }
        if (editOptions) {
            const keyFieldName = type === 'reagent' ? 'catalog' : 'id';
            const keyField = els.entryForm.elements.namedItem(keyFieldName);
            if (keyField) {
                keyField.readOnly = true;
                keyField.setAttribute('aria-describedby', 'record-key-lock-note');
                const wrapper = keyField.closest('.form-field');
                if (wrapper) {
                    wrapper.classList.add('locked-record-key');
                    wrapper.insertAdjacentHTML('beforeend', '<small class="field-note" id="record-key-lock-note">关联标识不可修改，其他信息均可更新。</small>');
                }
            }
            els.dialogFields.insertAdjacentHTML('beforeend', '<div class="entry-edit-history full">' + recordHistoryHtml(editOptions.record) + '</div>');
            if (pendingPhotoData) {
                const capture = els.dialogFields.querySelector('.photo-capture');
                if (capture) {
                    const hidden = capture.querySelector('input[type="hidden"]');
                    const preview = capture.querySelector('[data-photo-preview]');
                    if (hidden) hidden.value = pendingPhotoData;
                    if (preview) preview.innerHTML = '<img src="' + esc(pendingPhotoData) + '" alt="当前记录照片"><button type="button" data-clear-photo aria-label="移除照片"></button>';
                }
            }
        }
        pendingTaskDefaults = null;
        pendingSampleDefaults = null;
        pendingAnimalCageDefaults = null;
        pendingPlantDefaults = null;
        pendingFreezerDefaults = null;
        els.entryDialog.showModal();
        const first = els.dialogFields.querySelector('input, select, textarea');
        if (first) first.focus();
    }

    function readInputMemory() {
        try {
            const value = JSON.parse(localStorage.getItem(INPUT_MEMORY_KEY) || '{}');
            return value && typeof value === 'object' ? value : {};
        } catch (error) {
            return {};
        }
    }

    function rememberedFieldValues(type, name) {
        const memory = readInputMemory();
        const key = type + '.' + name;
        const values = Array.isArray(memory[key]) ? memory[key].slice() : [];
        recordCollection(type).forEach(function (record) {
            if (record && record[name] != null && !Array.isArray(record[name])) values.push(String(record[name]));
        });
        if (type === 'cell' || type === 'passage') {
            state.cellCultures.forEach(function (culture) {
                if (culture[name]) values.push(String(culture[name]));
                (Array.isArray(culture.history) ? culture.history : []).forEach(function (entry) {
                    if (entry[name]) values.push(String(entry[name]));
                });
            });
        }
        return Array.from(new Set(values.map(value => String(value).trim()).filter(Boolean))).slice(0, 24);
    }

    function rememberEntryValues(type, data) {
        const schema = dialogSchemas[type];
        if (!schema) return;
        const memory = readInputMemory();
        schema.fields.forEach(function (config) {
            if (!['select', 'memory-text', 'text'].includes(config.type)) return;
            const value = String(data[config.name] || '').trim();
            if (!value) return;
            const key = type + '.' + config.name;
            memory[key] = [value].concat(Array.isArray(memory[key]) ? memory[key] : []).filter(function (item, index, list) {
                return item && list.indexOf(item) === index;
            }).slice(0, 24);
        });
        localStorage.setItem(INPUT_MEMORY_KEY, JSON.stringify(memory));
    }

    function fieldHtml(config) {
        const className = 'form-field' + (config.full ? ' full' : '');
        const required = '';
        let control = '';
        if (config.type === 'select') {
            const presetValues = config.placeholderOrOptions.map(function (option) { return String(option).split('|')[0]; });
            const remembered = config.name === 'shareWithLab' ? [] : rememberedFieldValues(activeDialogType, config.name).filter(value => !presetValues.includes(value));
            const options = config.placeholderOrOptions.concat(remembered).map(function (option) {
                const parts = String(option).split('|');
                return '<option value="' + esc(parts[0]) + '">' + esc(interfaceText(parts[1] || parts[0])) + '</option>';
            }).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '" data-custom-select' + required + '>' + options + '<option value="__custom__">自定义…</option></select><input class="custom-select-input" name="' + config.name + 'Custom" type="text" data-custom-input-for="' + config.name + '" placeholder="输入自定义内容" hidden>';
        } else if (config.type === 'memory-text') {
            const listId = 'memory-' + activeDialogType + '-' + config.name;
            const options = rememberedFieldValues(activeDialogType, config.name).map(function (value) {
                return '<option value="' + esc(value) + '"></option>';
            }).join('');
            control = '<input id="field-' + config.name + '" name="' + config.name + '" type="text" list="' + listId + '" autocomplete="off" placeholder="' + esc(config.placeholderOrOptions) + '"><datalist id="' + listId + '">' + options + '</datalist>';
        } else if (config.type === 'protocol-select') {
            const options = ['<option value="">不关联 Protocol</option>'].concat(state.protocols.map(function (protocol) {
                return '<option value="' + esc(protocol.id) + '">' + esc(protocol.title) + ' · ' + esc(protocol.id) + '</option>';
            })).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '">' + options + '</select><small class="field-note">关联后会带入 Protocol 的步骤与默认试剂用量，实验记录中仍可修改。</small>';
        } else if (config.type === 'experiment-select') {
            const options = ['<option value="">开始时自动创建实验记录</option>'].concat(state.experiments.map(function (experiment) {
                return '<option value="' + esc(experiment.id) + '">' + esc(experiment.title) + ' · ' + esc(experiment.id) + '</option>';
            })).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '">' + options + '</select><small class="field-note">可选择已有实验；留空时，点击日程中的“开始”会自动建立实验记录。</small>';
        } else if (config.type === 'result-experiment-select') {
            const currentResult = editingRecord ? state.results.find(item => item.id === editingRecord.key) : null;
            const available = state.experiments.filter(function (experiment) {
                return currentResult && currentResult.experimentId === experiment.id || !state.results.some(result => result.experimentId === experiment.id);
            });
            const options = ['<option value="">选择一条实验记录</option>'].concat(available.map(function (experiment) {
                return '<option value="' + esc(experiment.id) + '">' + esc(experiment.date) + ' · ' + esc(experiment.title) + ' · ' + esc(experiment.id) + '</option>';
            })).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '"' + required + '>' + options + '</select><small class="field-note">每条实验记录只能保存一份实验结果；可随时编辑结果与附件。</small>';
        } else if (config.type === 'frozen-sample-select') {
            const options = ['<option value="">不关联冻存样本</option>'].concat(state.samples.map(function (sample) {
                return '<option value="' + esc(sample.id) + '">' + esc(sample.id + ' · ' + sample.type + ' · ' + sample.location) + '</option>';
            })).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '">' + options + '</select>';        } else if (config.type === 'cold-storage-select') {
            const options = state.coldStorageUnits.map(function (unit) {
                return '<option value="' + esc(unit.id) + '">' + esc(unit.name) + ' · ' + esc(unit.temperature) + '</option>';
            }).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '"' + required + '>' + options + '</select>';
        } else if (config.type === 'freezer-select') {
            const options = state.freezerBoxes.map(function (box) {
                return '<option value="' + esc(box.id) + '">' + esc(box.name) + ' · ' + esc(interfaceText(box.storageLocation)) + '</option>';
            }).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '"' + required + '>' + options + '</select>';
        } else if (config.type === 'animal-room-select') {
            const options = state.animalRooms.map(function (room) { return '<option value="' + esc(room.id) + '">' + esc(interfaceText(room.name)) + '</option>'; }).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '"' + required + '>' + (options || '<option value="">请先新建动物房间</option>') + '</select>';
        } else if (config.type === 'plant-room-select') {
            const options = state.plantRooms.map(function (room) { return '<option value="' + esc(room.id) + '">' + esc(interfaceText(room.name)) + '</option>'; }).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '"' + required + '>' + (options || '<option value="">请先新建植物培养室</option>') + '</select>';
        } else if (config.type === 'animal-rack-select') {
            const options = state.animalRacks.map(function (rack) {
                return '<option value="' + esc(rack.id) + '">' + esc(interfaceText(rack.name)) + ' · ' + esc(interfaceText(rack.facility)) + '</option>';
            }).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '"' + required + '>' + (options || '<option value="">请先新建笼架</option>') + '</select>';
        } else if (config.type === 'animal-cage-select') {
            const options = state.animalCages.map(function (cage) {
                const rack = state.animalRacks.find(item => item.id === cage.rackId);
                return '<option value="' + esc(cage.id) + '">' + esc((rack ? rack.name + ' · ' : '') + cage.position + ' · ' + cage.label) + '</option>';
            }).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '"' + required + '>' + (options || '<option value="">请先新建笼位</option>') + '</select><small class="field-note">动物条目会归入所选笼位；一个笼位可以包含多个动物。</small>';
        } else if (config.type === 'plant-rack-select') {
            const options = ['<option value="">未分配培养架</option>'].concat(state.plantRacks.map(function (rack) { return '<option value="' + esc(rack.id) + '">' + esc(interfaceText(rack.name)) + ' · ' + esc(interfaceText(rack.facility)) + '</option>'; })).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '">' + options + '</select>';
        } else if (config.type === 'bio-project-select') {
            const options = ['<option value="">不关联项目</option>'].concat(state.bioProjects.map(function (item) { return '<option value="' + esc(item.id) + '">' + esc(item.name + ' · ' + item.id) + '</option>'; })).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '">' + options + '</select>';
        } else if (config.type === 'bio-pipeline-select') {
            const options = ['<option value="">不关联流程</option>'].concat(state.bioPipelines.map(function (item) { return '<option value="' + esc(item.id) + '">' + esc(item.name + ' · ' + item.id) + '</option>'; })).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '">' + options + '</select>';
        } else if (config.type === 'bio-dataset-select') {
            const options = ['<option value="">不关联数据集</option>'].concat(state.bioDatasets.map(function (item) { return '<option value="' + esc(item.id) + '">' + esc(item.name + ' · ' + item.id) + '</option>'; })).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '">' + options + '</select>';
        } else if (config.type === 'formulation-components') {
            control = '<div class="formulation-component-editor" id="field-' + config.name + '"><div class="formulation-component-head"><span>组分</span><span>用量</span><span>单位</span><i></i></div><div id="formulationComponentRows"><p class="field-note" data-empty-formulation-components>尚未添加组分。</p></div><button class="add-reagent-row" type="button" data-add-formulation-component>＋ 添加组分</button></div>';        } else if (config.type === 'reagent-list') {
            control = '<div class="protocol-reagent-editor" id="field-' + config.name + '"><div id="protocolReagentRows"><p class="field-note" data-empty-protocol-reagents>可暂不关联试剂，之后再补充。</p></div><button class="add-reagent-row" type="button" data-add-reagent-row>＋ 添加试剂</button><p>用量单位自动采用试剂库存中登记的单位。</p></div>';
        } else if (config.type === 'photo-capture') {
            control = '<div class="photo-capture" id="field-' + config.name + '"><input class="photo-capture-input" id="photo-input-' + config.name + '" type="file" accept="image/*" capture="environment" data-photo-capture><input type="hidden" name="' + config.name + '" value=""><label class="photo-capture-button" for="photo-input-' + config.name + '"><span>⌑</span><strong>拍照或选择图片</strong></label><div class="photo-capture-preview" data-photo-preview><span>尚未选择照片</span></div></div>';
        } else if (config.type === 'file-attachments') {
            control = '<div class="result-attachment-editor" id="field-' + config.name + '"><input id="resultAttachmentInput" type="file" accept="image/*,.pdf,.csv,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx" multiple data-result-attachments><label class="result-attachment-upload" for="resultAttachmentInput"><span>＋</span><strong>上传照片或文件</strong><small>选择图片、PDF、表格或文档</small></label><div class="pending-result-attachments" id="pendingResultAttachments"></div><p class="field-note">图片会压缩保存；其他文件单个不超过 1 MB，最多 6 个附件。</p></div>';
        } else if (config.type === 'textarea') {
            control = '<textarea id="field-' + config.name + '" name="' + config.name + '" placeholder="' + esc(config.placeholderOrOptions) + '"' + required + '></textarea>';
        } else if (config.type === 'text') {
            const listId = 'smart-' + activeDialogType + '-' + config.name;
            const options = rememberedFieldValues(activeDialogType, config.name).map(function (value) { return '<option value="' + esc(value) + '"></option>'; }).join('');
            control = '<input id="field-' + config.name + '" name="' + config.name + '" type="text"' + (options ? ' list="' + listId + '"' : '') + ' autocomplete="off" placeholder="' + esc(config.placeholderOrOptions) + '"' + required + '>' + (options ? '<datalist id="' + listId + '">' + options + '</datalist>' : '');
        } else {
            const defaultValue = ['date', 'time'].includes(config.type) ? ' value="' + (config.type === 'date' ? todayIso() : esc(config.placeholderOrOptions)) + '"' : '';
            const minmax = config.type === 'number' ? (config.name === 'rows' && ['animalRack', 'plantRack'].includes(activeDialogType) ? ' min="1" max="12" step="1"' : config.name === 'columns' && ['animalRack', 'plantRack'].includes(activeDialogType) ? ' min="1" max="48" step="1"' : ' min="0" step="0.01"') : '';
            control = '<input id="field-' + config.name + '" name="' + config.name + '" type="' + config.type + '" placeholder="' + esc(config.placeholderOrOptions) + '"' + defaultValue + minmax + required + '>';
        }
        return '<div class="' + className + '"><label for="field-' + config.name + '">' + esc(config.label) + '</label>' + control + '</div>';
    }

    function toggleCustomSelectInput(select, initialValue, focusInput) {
        const wrapper = select.closest('.form-field') || select.parentElement;
        const input = wrapper && wrapper.querySelector('[data-custom-input-for="' + select.name + '"]');
        if (!input) return;
        const custom = select.value === '__custom__';
        input.hidden = !custom;
        input.required = false;
        if (custom && initialValue) input.value = initialValue;
        if (!custom) input.value = '';
        if (custom && focusInput) window.setTimeout(function () { input.focus(); }, 0);
    }

    function resolveCustomSelectValues(data) {
        els.entryForm.querySelectorAll('[data-custom-select]').forEach(function (select) {
            const customName = select.name + 'Custom';
            if (data[select.name] === '__custom__') {
                data[select.name] = String(data[customName] || '').trim();
            }
            delete data[customName];
        });
        return true;
    }

    function formulationComponentRowHtml(component) {
        const item = component || {};
        return '<div class="formulation-component-row"><input name="formulationComponentName" type="text" value="' + esc(item.name || '') + '" placeholder="例：NaCl" aria-label="组分名称"><input name="formulationComponentAmount" type="text" value="' + esc(item.amount || '') + '" placeholder="例：8" aria-label="组分用量"><input name="formulationComponentUnit" type="text" value="' + esc(item.unit || '') + '" placeholder="例：g" aria-label="组分单位"><button type="button" data-remove-formulation-component aria-label="移除此组分"></button></div>';
    }

    function renderFormulationComponentEditor(components) {
        const rows = document.getElementById('formulationComponentRows');
        if (!rows) return;
        rows.innerHTML = (components || []).map(formulationComponentRowHtml).join('') || '<p class="field-note" data-empty-formulation-components>尚未添加组分。</p>';
    }

    function readFormulationComponents(formData) {
        const names = formData.getAll('formulationComponentName');
        const amounts = formData.getAll('formulationComponentAmount');
        const units = formData.getAll('formulationComponentUnit');
        return names.map(function (name, index) {
            return { name: String(name || '').trim(), amount: String(amounts[index] || '').trim(), unit: String(units[index] || '').trim() };
        }).filter(function (component) { return component.name || component.amount || component.unit; });
    }
    function reagentUsageRowHtml(usage) {
        const selectedCatalog = usage && usage.catalog ? usage.catalog : (state.reagents[0] ? state.reagents[0].catalog : '');
        const amount = usage && usage.amount != null ? usage.amount : 1;
        const options = state.reagents.map(function (reagent) {
            return '<option value="' + esc(reagent.catalog) + '"' + (reagent.catalog === selectedCatalog ? ' selected' : '') + '>' + esc(reagent.name) + ' · ' + esc(reagent.unit) + '</option>';
        }).join('');
        if (!options) return '<p class="field-note">请先在试剂库存中录入试剂。</p>';
        return '<div class="protocol-reagent-row"><select name="reagentCatalog">' + options + '</select><input name="reagentAmount" type="number" min="0.001" step="0.001" value="' + esc(amount) + '" aria-label="单次用量"><span>库存单位 / 次</span><button type="button" data-remove-reagent-row aria-label="移除此试剂"></button></div>';
    }

    function renderProtocolReagentEditor(usages) {
        const rows = document.getElementById('protocolReagentRows');
        if (!rows) return;
        rows.innerHTML = (usages || []).map(reagentUsageRowHtml).join('') || '<p class="field-note" data-empty-protocol-reagents>可暂不关联试剂，之后再补充。</p>';
    }

    async function prepareResultAttachments(input) {
        const files = Array.from(input.files || []);
        if (!files.length) return;
        if (pendingResultAttachments.length + files.length > 6) {
            showToast('每份实验结果最多保存 6 个附件');
            input.value = '';
            return;
        }
        for (const file of files) {
            try {
                const image = String(file.type || '').startsWith('image/');
                if (!image && file.size > 1024 * 1024) {
                    showToast('文件“' + file.name + '”超过 1 MB，未加入附件');
                    continue;
                }
                const data = image ? await compressPhoto(file, 1400, .78) : await readFileAsDataUrl(file);
                pendingResultAttachments.push({
                    id: 'ATT-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
                    name: file.name,
                    type: image ? 'image/jpeg' : (file.type || 'application/octet-stream'),
                    size: file.size,
                    data: data
                });
            } catch (error) {
                showToast('无法读取文件“' + file.name + '”');
            }
        }
        input.value = '';
        renderPendingResultAttachments();
    }

    function readFileAsDataUrl(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = function () { resolve(reader.result); };
            reader.readAsDataURL(file);
        });
    }

    function renderPendingResultAttachments() {
        const container = document.getElementById('pendingResultAttachments');
        if (!container) return;
        container.innerHTML = pendingResultAttachments.map(function (attachment) {
            const image = String(attachment.type || '').startsWith('image/');
            const preview = image ? '<img src="' + esc(attachment.data) + '" alt="' + esc(attachment.name) + '">' : '<span class="pending-file-icon">FILE</span>';
            return '<article>' + preview + '<div><strong>' + esc(attachment.name) + '</strong><small>' + formatFileSize(attachment.size) + '</small></div><button type="button" data-remove-result-attachment="' + esc(attachment.id) + '" aria-label="删除附件 ' + esc(attachment.name) + '"></button></article>';
        }).join('') || '<p class="result-attachment-empty">尚未上传附件</p>';
    }

    function formatFileSize(value) {
        const bytes = Math.max(0, Number(value) || 0);
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    }

    async function preparePhotoAttachment(input) {
        const file = input.files && input.files[0];
        if (!file) return;
        const capture = input.closest('.photo-capture');
        const preview = capture.querySelector('[data-photo-preview]');
        try {
            const dataUrl = await compressPhoto(file, 900, .68);
            pendingPhotoData = dataUrl;
            capture.querySelector('input[type="hidden"]').value = dataUrl;
            preview.innerHTML = '<img src="' + dataUrl + '" alt="待保存的录入照片"><button type="button" data-clear-photo aria-label="移除照片"></button>';
            if (activeDialogType === 'reagent' && 'BarcodeDetector' in window) {
                try {
                    const detector = new window.BarcodeDetector();
                    const bitmap = await createImageBitmap(file);
                    const codes = await detector.detect(bitmap);
                    bitmap.close();
                    if (codes.length) {
                        const catalogInput = els.entryForm.elements.namedItem('catalog');
                        if (catalogInput && !catalogInput.value.trim()) catalogInput.value = codes[0].rawValue;
                    }
                } catch (error) {}
            }
        } catch (error) {
            preview.innerHTML = '<span>无法读取图片</span>';
        }
    }

    function compressPhoto(file, maxSize, quality) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = function () {
                const image = new Image();
                image.onerror = reject;
                image.onload = function () {
                    const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
                    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
                    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                image.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function generatedRecordId(prefix) {
        return prefix + '-' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(2, 5).toUpperCase();
    }

    function displayOr(value, fallback) {
        const text = String(value == null ? '' : value).trim();
        return text || fallback;
    }

    function firstAvailableSamplePosition(box) {
        if (!box) return '';
        const occupied = new Set(state.samples.filter(function (sample) {
            return sample.boxId === box.id;
        }).map(function (sample) {
            return sample.position || samplePosition(sample.location);
        }));
        for (let row = 0; row < box.rows; row += 1) {
            for (let column = 1; column <= box.columns; column += 1) {
                const position = String.fromCharCode(65 + row) + column;
                if (!occupied.has(position)) return position;
            }
        }
        return '';
    }

    function saveEntryFromDialog(event) {
        event.preventDefault();
        if (denyReadOnlyMutation()) return;
        const formData = new FormData(els.entryForm);
        const data = Object.fromEntries(formData.entries());
        if (!resolveCustomSelectValues(data)) return;
        data.createdBy = anonymousContributor(data.createdBy);
        if (editingRecord && ['experiment', 'protocol', 'formulation', 'task', 'mouse', 'plant', 'microbe', 'plasmid', 'virus', 'reagent', 'sample', 'cell', 'result', 'coldStorage', 'animalRoom', 'plantRoom', 'bioProject', 'bioDataset', 'bioPipeline', 'bioRun'].includes(activeDialogType)) {
            saveEditedRecord(data);
            return;
        }
        let activityText = '';

        if (activeDialogType === 'experiment') {
            data.id = generatedRecordId('RL-EXP');
            data.title = displayOr(data.title, '未命名实验');
            data.project = String(data.project || '').trim();
            data.status = displayOr(data.status, '进行中');
            data.type = displayOr(data.type, '未分类');
            data.date = data.date || todayIso();
            data.description = String(data.description || '').trim();
            data.progress = data.status === '已完成' ? 100 : 12;
            data.reagentUsage = [];
            data.usageOverridden = false;
            data.history = [createdHistoryEntry()];
            state.experiments.unshift(data);
            activityText = '新建实验记录“' + data.title + '”';
        } else if (activeDialogType === 'result') {
            let experiment = state.experiments.find(item => item.id === data.experimentId);
            if (!experiment) {
                experiment = {
                    id: generatedRecordId('RL-EXP'), title: '未命名实验', project: '', status: '进行中', type: '未分类',
                    date: data.date || todayIso(), protocolId: '', description: '', progress: 0, reagentUsage: [],
                    usageOverridden: false, photoData: '', createdBy: data.createdBy, history: [createdHistoryEntry()]
                };
                state.experiments.unshift(experiment);
                data.experimentId = experiment.id;
            }
            if (state.results.some(item => item.experimentId === data.experimentId)) {
                showToast('这条实验记录已经有对应结果，可直接编辑原结果');
                return;
            }
            data.id = generatedRecordId('RL-RES');
            data.date = data.date || experiment.date || todayIso();
            data.summary = String(data.summary || '').trim();
            data.conclusion = String(data.conclusion || '').trim();
            data.nextStep = String(data.nextStep || '').trim();
            data.attachments = clone(pendingResultAttachments);
            data.history = [createdHistoryEntry()];
            state.results.unshift(data);
            activityText = '填写“' + experiment.title + '”的实验结果';
        } else if (activeDialogType === 'animalRoom') {
            const room = { id: generatedRecordId('AROOM'), name: displayOr(data.name, '未命名动物房间'), shape: displayOr(data.shape, '矩形'), entranceSide: displayOr(data.entranceSide, '右侧'), entrancePosition: number(data.entrancePosition, 12, 88) || 50, notes: String(data.notes || '').trim(), createdBy: data.createdBy, history: [createdHistoryEntry()] };
            state.animalRooms.push(room);
            activeAnimalRoomId = room.id; activeAnimalRackId = ''; selectedAnimalCageId = '';
            localStorage.setItem('rhineLabActiveAnimalRoom', room.id);
            localStorage.setItem('rhineLabActiveAnimalRack', '');
            activityText = '新建动物房间“' + room.name + '”';
        } else if (activeDialogType === 'animalRack') {
            const room = state.animalRooms.find(function (item) { return item.id === data.roomId; });
            if (!room) { showToast('请先新建并选择一个动物房间'); return; }
            const roomRacks = state.animalRacks.filter(function (item) { return item.roomId === room.id; });
            const rack = {
                id: generatedRecordId('RACK'), roomId: room.id,
                name: displayOr(data.name, '未命名笼架'), facility: room.name,
                rows: Math.min(12, Math.max(1, Math.round(positiveNumber(data.rows, 4)))),
                columns: Math.min(48, Math.max(1, Math.round(positiveNumber(data.columns, 8)))),
                layoutX: housingLayoutCoordinate(undefined, roomRacks.length, 'x'),
                layoutY: housingLayoutCoordinate(undefined, roomRacks.length, 'y'),
                createdBy: data.createdBy, history: [createdHistoryEntry()]
            };
            state.animalRacks.push(rack);
            activeAnimalRoomId = room.id; activeAnimalRackId = rack.id; selectedAnimalCageId = '';
            localStorage.setItem('rhineLabActiveAnimalRoom', room.id);
            localStorage.setItem('rhineLabActiveAnimalRack', rack.id);
            activityText = '在“' + room.name + '”新建动物笼架“' + rack.name + '”';
        } else if (activeDialogType === 'plantRoom') {
            const room = { id: generatedRecordId('PROOM'), name: displayOr(data.name, '未命名植物培养室'), shape: displayOr(data.shape, '矩形'), entranceSide: displayOr(data.entranceSide, '右侧'), entrancePosition: number(data.entrancePosition, 12, 88) || 50, notes: String(data.notes || '').trim(), createdBy: data.createdBy, history: [createdHistoryEntry()] };
            state.plantRooms.push(room);
            activePlantRoomId = room.id; activePlantRackId = ''; selectedPlantId = '';
            localStorage.setItem('rhineLabActivePlantRoom', room.id);
            localStorage.setItem('rhineLabActivePlantRack', '');
            activityText = '新建植物培养室“' + room.name + '”';
        } else if (activeDialogType === 'plantRack') {
            const room = state.plantRooms.find(function (item) { return item.id === data.roomId; });
            if (!room) { showToast('请先新建并选择一个植物培养室'); return; }
            const roomRacks = state.plantRacks.filter(function (item) { return item.roomId === room.id; });
            const rack = {
                id: generatedRecordId('PLANT-RACK'), roomId: room.id,
                name: displayOr(data.name, '未命名培养架'), facility: room.name,
                rows: Math.min(12, Math.max(1, Math.round(positiveNumber(data.rows, 5)))),
                columns: Math.min(48, Math.max(1, Math.round(positiveNumber(data.columns, 10)))),
                layoutX: housingLayoutCoordinate(undefined, roomRacks.length, 'x'),
                layoutY: housingLayoutCoordinate(undefined, roomRacks.length, 'y'),
                createdBy: data.createdBy, history: [createdHistoryEntry()]
            };
            state.plantRacks.push(rack);
            activePlantRoomId = room.id; activePlantRackId = rack.id; selectedPlantId = '';
            localStorage.setItem('rhineLabActivePlantRoom', room.id);
            localStorage.setItem('rhineLabActivePlantRack', rack.id);
            activityText = '在“' + room.name + '”新建植物培养架“' + rack.name + '”';
        } else if (activeDialogType === 'animalCage') {
            const rack = state.animalRacks.find(item => item.id === data.rackId);
            if (!rack) {
                showToast('请先新建并选择一个动物笼架');
                return;
            }
            const position = normalizeAnimalPosition(data.position) || firstAvailableAnimalPosition(rack, state.animalCages);
            if (!position) {
                showToast('当前笼架没有可用空位');
                return;
            }
            const match = position.match(/^([A-L])(\d{1,2})$/);
            if (!match || match[1].charCodeAt(0) - 64 > rack.rows || Number(match[2]) > rack.columns) {
                showToast('笼位位置超出当前笼架范围');
                return;
            }
            if (state.animalCages.some(item => item.rackId === rack.id && item.position === position)) {
                showToast('该笼架位置已经建立了笼位');
                return;
            }
            const cage = {
                id: generatedRecordId('CAGE'), rackId: rack.id, position: position,
                label: displayOr(data.label, '笼位 ' + position), species: displayOr(data.species, '混合 / 待设置'),
                capacity: Math.max(1, Math.round(positiveNumber(data.capacity, 5))), status: displayOr(data.status, '在用'),
                notes: String(data.notes || '').trim(), createdBy: data.createdBy
            };
            state.animalCages.push(cage);
            activeAnimalRackId = rack.id;
            selectedAnimalCageId = cage.id;
            localStorage.setItem('rhineLabActiveAnimalRack', rack.id);
            activityText = '在“' + rack.name + '”新建笼位 ' + cage.label;
        } else if (activeDialogType === 'mouse') {
            data.id = displayOr(data.id, generatedRecordId('ANM'));
            if (state.mice.some(item => item.id === data.id)) {
                showToast('该动物编号已存在，请使用新的编号');
                return;
            }
            const cage = state.animalCages.find(item => item.id === data.cageId);
            data.species = displayOr(data.species, '未设置物种');
            data.strain = String(data.strain || '').trim();
            data.cageId = cage ? cage.id : '';
            data.cage = cage ? cage.label : '未分配';
            data.status = displayOr(data.status, '在养');
            data.history = [createdHistoryEntry()];
            state.mice.unshift(data);
            if (cage) selectedAnimalCageId = cage.id;
            activityText = '添加' + data.species + '动物条目 ' + data.id;
        } else if (activeDialogType === 'plant') {
            data.id = displayOr(data.id, generatedRecordId('PLT'));
            if (state.plants.some(function (item) { return item.id === data.id; })) { showToast('该植物材料编号已存在'); return; }
            const rack = state.plantRacks.find(function (item) { return item.id === data.rackId; });
            const position = rack ? normalizePlantPosition(data.position) || firstAvailablePlantPosition(rack, state.plants) : '';
            if (rack && (!position || !isValidPlantPosition(rack, position))) { showToast('培养架位置格式不正确或超出范围'); return; }
            if (rack && state.plants.some(function (item) { return item.rackId === rack.id && item.position === position; })) { showToast('该培养架位置已有植物材料'); return; }
            data.name = displayOr(data.name, '未命名植物材料');
            data.materialType = displayOr(data.materialType, '未分类');
            data.status = displayOr(data.status, '在库');
            data.rackId = rack ? rack.id : '';
            data.position = position;
            data.location = rack && position ? formatPlantLocation(rack, position) : '未分配位置';
            data.history = [createdHistoryEntry()];
            state.plants.unshift(data);
            if (rack) { activePlantRackId = rack.id; localStorage.setItem('rhineLabActivePlantRack', rack.id); }
            selectedPlantId = data.id;
            syncFrozenSampleLineage('plant', data.id, data.frozenSampleId);
            activityText = '登记植物材料“' + data.name + '”';
        } else if (activeDialogType === 'microbe') {
            data.id = displayOr(data.id, generatedRecordId('MIC'));
            if (state.microbes.some(function (item) { return item.id === data.id; })) { showToast('该菌种编号已存在'); return; }
            data.name = displayOr(data.name, '未命名菌种');
            data.status = displayOr(data.status, '在库');
            data.history = [createdHistoryEntry()];
            state.microbes.unshift(data);
            syncFrozenSampleLineage('microbe', data.id, data.frozenSampleId);
            activityText = '录入菌种“' + data.name + '”';
        } else if (activeDialogType === 'plasmid') {
            data.id = displayOr(data.id, generatedRecordId('PLA'));
            if (state.plasmids.some(function (item) { return item.id === data.id; })) { showToast('该质粒编号已存在'); return; }
            data.name = displayOr(data.name, '未命名质粒');
            data.sizeBp = Math.max(0, Math.round(positiveNumber(data.sizeBp, 0)));
            data.status = displayOr(data.status, '在库');
            data.history = [createdHistoryEntry()];
            state.plasmids.unshift(data);
            syncFrozenSampleLineage('plasmid', data.id, data.frozenSampleId);
            activityText = '录入质粒“' + data.name + '”';
        } else if (activeDialogType === 'virus') {
            data.id = displayOr(data.id, generatedRecordId('VIR'));
            if (state.viruses.some(function (item) { return item.id === data.id; })) { showToast('该病毒编号已存在'); return; }
            data.name = displayOr(data.name, '未命名病毒');
            data.status = displayOr(data.status, '在库');
            data.history = [createdHistoryEntry()];
            state.viruses.unshift(data);
            syncFrozenSampleLineage('virus', data.id, data.frozenSampleId);
            activityText = '录入病毒资源“' + data.name + '”';
        } else if (['bioProject', 'bioDataset', 'bioPipeline', 'bioRun'].includes(activeDialogType)) {
            const definitions = {
                bioProject: { collection: state.bioProjects, prefix: 'BIO-PRJ', fallback: '未命名生物信息项目', tab: 'projects' },
                bioDataset: { collection: state.bioDatasets, prefix: 'BIO-DATA', fallback: '未命名数据集', tab: 'datasets' },
                bioPipeline: { collection: state.bioPipelines, prefix: 'BIO-FLOW', fallback: '未命名分析流程', tab: 'pipelines' },
                bioRun: { collection: state.bioRuns, prefix: 'BIO-RUN', fallback: '未命名分析任务', tab: 'runs' }
            };
            const definition = definitions[activeDialogType];
            data.id = displayOr(data.id, generatedRecordId(definition.prefix));
            if (definition.collection.some(function (item) { return item.id === data.id; })) { showToast('该编号已存在，请使用新的编号'); return; }
            if (activeDialogType === 'bioRun') data.name = bioPipelineLabel(data.pipelineId) + ' · ' + data.id;
            else data.name = displayOr(data.name, definition.fallback);
            if (activeDialogType === 'bioProject') data.status = displayOr(data.status, '准备中');
            if (activeDialogType === 'bioRun') data.status = displayOr(data.status, '排队中');
            data.history = [createdHistoryEntry()];
            definition.collection.unshift(data);
            activeBioinfoTab = definition.tab;
            localStorage.setItem('rhineLabBioinfoTab', activeBioinfoTab);
            activityText = '新增' + recordTypeLabel(activeDialogType) + '“' + (data.name || data.id) + '”';
        } else if (activeDialogType === 'reagent') {
            data.catalog = displayOr(data.catalog, generatedRecordId('REAG'));
            if (state.reagents.some(item => item.catalog === data.catalog)) {
                showToast('该试剂货号已存在，可从详情页编辑原条目');
                return;
            }
            data.name = displayOr(data.name, '未命名试剂');
            data.location = String(data.location || '').trim();
            data.totalQty = positiveNumber(data.totalQty, 0);
            data.currentQty = number(data.currentQty, 0, data.totalQty);
            data.amount = data.totalQty ? number(data.currentQty / data.totalQty * 100, 0, 100) : 0;
            data.status = data.totalQty <= 0 ? '待补充' : data.amount < 25 ? '余量低' : isExpiringSoon(data.expiry) ? '临期' : '正常';
            data.history = [createdHistoryEntry()];
            state.reagents.unshift(data);
            activityText = '录入试剂“' + data.name + '”';
        } else if (activeDialogType === 'sample') {
            data.id = displayOr(data.id, generatedRecordId('SMP'));
            const box = state.freezerBoxes.find(item => item.id === data.boxId) || state.freezerBoxes[0];
            const position = samplePosition(data.position) || firstAvailableSamplePosition(box);
            if (position && (!box || !isValidBoxPosition(box, position))) {
                showToast('盒内位置格式不正确或超出当前冻存盒范围');
                return;
            }
            if (state.samples.some(item => item.id === data.id)) {
                showToast('该样本编号已存在，可从详情页编辑原条目');
                return;
            }
            const occupied = box && position && state.samples.some(item => item.boxId === box.id && item.position === position);
            if (occupied) {
                showToast('该冻存盒位置已被占用，请选择其他空位');
                return;
            }
            data.type = displayOr(data.type, '未分类');
            data.date = data.date || todayIso();
            data.boxId = box ? box.id : '';
            data.position = position;
            data.location = box && position ? formatSampleLocation(box, position) : '未分配位置';
            data.history = [createdHistoryEntry()];
            state.samples.unshift(data);
            if (box) {
                activeFreezerBoxId = box.id;
                localStorage.setItem('rhineLabActiveFreezerBox', box.id);
            }
            selectedSampleId = data.id;
            activityText = '样本 ' + data.id + ' 完成入库';
        } else if (activeDialogType === 'protocol') {
            const code = generatedRecordId('SOP-USR');
            const catalogs = formData.getAll('reagentCatalog');
            const amounts = formData.getAll('reagentAmount');
            const reagentMap = new Map();
            catalogs.forEach(function (catalog, index) {
                const amount = positiveNumber(amounts[index], 0);
                if (catalog && amount > 0) reagentMap.set(catalog, roundQuantity((reagentMap.get(catalog) || 0) + amount));
            });
            const steps = String(data.stepsText || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean);
            const protocol = {
                id: code,
                number: code + ' · V1.0',
                title: displayOr(data.title, '未命名 Protocol'),
                summary: String(data.summary || '').trim(),
                steps: steps,
                reagents: Array.from(reagentMap, function (entry) { return { catalog: entry[0], amount: entry[1] }; }),
                tag: '',
                meta: '本地录入 ' + todayIso(),
                literatureTitle: String(data.literatureTitle || '').trim(),
                literatureCitation: String(data.literatureCitation || '').trim(),
                literatureId: String(data.literatureId || '').trim(),
                literatureUrl: String(data.literatureUrl || '').trim(),
                photoData: data.photoData || '',
                createdBy: data.createdBy,
                history: [createdHistoryEntry()]
            };
            state.protocols.unshift(protocol);
            activeProtocolId = protocol.id;
            activityText = '录入 Protocol“' + protocol.title + '”';
        } else if (activeDialogType === 'formulation') {
            const formulation = {
                id: generatedRecordId('FORM'),
                name: displayOr(data.name, '未命名配方'),
                physicalForm: displayOr(data.physicalForm, '其他'),
                purpose: String(data.purpose || '').trim(),
                finalAmount: positiveNumber(data.finalAmount, 0),
                unit: String(data.unit || '').trim(),
                concentration: String(data.concentration || '').trim(),
                components: readFormulationComponents(formData),
                preparation: String(data.preparation || '').trim(),
                storage: String(data.storage || '').trim(),
                version: displayOr(data.version, 'V1.0'),
                notes: String(data.notes || '').trim(),
                createdBy: data.createdBy,
                history: [createdHistoryEntry()]
            };
            state.formulations.unshift(formulation);
            activeProtocolTab = 'formulations';
            activityText = '新建实验配方“' + formulation.name + '”';
        } else if (activeDialogType === 'cell') {
            data.id = displayOr(data.id, generatedRecordId('CELL'));
            if (state.cellCultures.some(item => item.id === data.id)) {
                showToast('该培养记录编号已存在，请使用新的编号');
                return;
            }
            data.name = displayOr(data.name, '未命名细胞');
            data.status = '培养中';
            data.vesselCount = 1;
            data.nextAction = '';
            data.passage = Math.max(0, Math.round(positiveNumber(data.passage, 0)));
            data.confluence = number(data.confluence, 0, 100);
            data.history = [];
            data.changeHistory = [createdHistoryEntry()];
            state.cellCultures.unshift(data);
            activeCellId = data.id;
            activityText = '登记培养细胞“' + data.name + '”';
        } else if (activeDialogType === 'passage') {
            const culture = state.cellCultures.find(item => item.id === activeCellId);
            if (!culture) {
                showToast('原细胞培养记录不存在');
                return;
            }
            const log = {
                id: 'CELLLOG-' + Date.now(),
                date: data.date,
                action: data.action,
                passage: Math.max(0, Math.round(positiveNumber(data.passage, culture.passage))),
                ratio: data.ratio,
                container: data.container,
                confluence: number(data.confluence, 0, 100),
                medium: data.medium,
                notes: data.notes || '',
                photoData: data.photoData || ''
            };
            culture.history = Array.isArray(culture.history) ? culture.history : [];
            culture.history.unshift(log);
            culture.passage = log.passage;
            culture.container = log.container;
            culture.confluence = log.confluence;
            culture.medium = log.medium;
            if (log.photoData) culture.photoData = log.photoData;
            activityText = '记录“' + culture.name + '”的' + data.action + '操作';
        } else if (activeDialogType === 'task') {
            data.date = data.date || todayIso();
            if (!normalizeScheduleTimes(data)) return;
            data.title = displayOr(data.title, '未命名日程');
            data.resource = String(data.resource || '').trim();
            data.type = displayOr(data.type, 'cell');
            data.shareWithLab = data.shareWithLab !== 'no';
            if (data.experimentId) {
                const linkedExperiment = state.experiments.find(item => item.id === data.experimentId);
                if (!linkedExperiment) data.experimentId = '';
                else if (linkedExperiment.protocolId) data.protocolId = linkedExperiment.protocolId;
            }
            data.id = generatedRecordId('T');
            data.done = false;
            data.history = [createdHistoryEntry()];
            state.schedule.push(data);
            calendarDate = parseLocalDate(data.date);
            activityText = '添加日程“' + data.title + '”';
        } else if (activeDialogType === 'coldStorageLevel') {
            const unit = state.coldStorageUnits.find(item => item.id === activeColdStorageId);
            if (!unit) return;
            const levelIndex = Math.min(unit.levels.length, Math.max(1, editingColdStorageLevel || activeColdStorageShelf)) - 1;
            const levels = unit.levels.map(function (level) { return Object.assign({}, level); });
            const mode = data.mode === '货架' ? 'rack' : 'direct';
            const rackCount = mode === 'rack' ? (Math.round(number(data.rackCount, 1, 8)) || 1) : 1;
            levels[levelIndex] = { mode: mode, rackCount: rackCount, rackOrder: Array.from({ length: rackCount }, function (_, index) { return index + 1; }), rows: Math.round(number(data.rows, 1, 12)) || 1, columns: Math.round(number(data.columns, 1, 12)) || 1 };
            if (coldStorageLayoutConflict(unit.id, levels)) {
                showToast('请先移动超出新范围的冻存盒');
                return;
            }
            unit.levels = levels;
            unit.rows = levels[0].rows;
            unit.columns = levels[0].columns;
            unit.history.unshift({ at: new Date().toISOString(), action: 'updated', changes: [{ field: '第 ' + (levelIndex + 1) + ' 层结构' }] });
            state.freezerBoxes.filter(box => box.storageUnitId === unit.id).forEach(function (box) { box.storageLocation = formatColdStorageBoxLocation(box, [unit]); });
            editingColdStorageLevel = 0;
            activityText = '更新冻存设备“' + unit.name + '”第 ' + (levelIndex + 1) + ' 层';
        } else if (activeDialogType === 'coldStorage') {
            const shelfCount = Math.round(number(data.shelves, 1, 12)) || 1;
            const levels = parseColdStorageLevels(data.levelLayout, shelfCount);
            if (!levels) {
                showToast('请按设备层数逐行填写，例如“直放 1x4”或“货架 2架 2x4”');
                return;
            }
            const unit = {
                id: generatedRecordId('COLD'),
                name: displayOr(data.name, '未命名冻存设备'),
                type: displayOr(data.type, '超低温冰箱'),
                temperature: displayOr(data.temperature, '-80°C'),
                location: displayOr(data.location, '位置待设置'),
                orientation: data.orientation === '竖向' ? '竖向' : '横向',
                layoutX: housingLayoutCoordinate('', state.coldStorageUnits.length, 'x'),
                layoutY: housingLayoutCoordinate('', state.coldStorageUnits.length, 'y'),
                shelves: levels.length,
                rows: levels[0].rows,
                columns: levels[0].columns,
                levels: levels,
                createdBy: data.createdBy,
                history: [createdHistoryEntry()]
            };
            state.coldStorageUnits.push(unit);
            activeColdStorageId = unit.id;
            activeColdStorageShelf = 1;
            selectedSampleId = '';
            localStorage.setItem('rhineLabActiveColdStorage', unit.id);
            localStorage.setItem('rhineLabActiveColdStorageShelf', '1');
            activityText = '新增冻存设备“' + unit.name + '”';
        } else if (activeDialogType === 'freezer') {
            const unit = state.coldStorageUnits.find(item => item.id === data.storageUnitId) || state.coldStorageUnits[0];
            const shelf = Math.round(number(data.shelf, 1, Math.max(1, Number(unit.shelves) || 1))) || 1;
            const level = coldStorageLevel(unit, shelf);
            const storageRack = level.mode === 'rack' ? (Math.round(number(data.storageRack, 1, level.rackCount || 1)) || 1) : 1;
            const storageRow = Math.round(number(data.storageRow, 1, level.rows)) || 1;
            const storageColumn = Math.round(number(data.storageColumn, 1, level.columns)) || 1;
            if (state.freezerBoxes.some(box => box.storageUnitId === unit.id && Number(box.shelf || 1) === shelf && Number(box.storageRack || 1) === storageRack && Number(box.storageRow || 1) === storageRow && Number(box.storageColumn || 1) === storageColumn)) {
                showToast('该设备盒位已经放置冻存盒');
                return;
            }
            const box = {
                id: generatedRecordId('FB-USR'),
                name: displayOr(data.name, '未命名冻存盒'),
                storageUnitId: unit.id,
                shelf: shelf,
                storageRack: storageRack,
                storageRow: storageRow,
                storageColumn: storageColumn,
                temperature: unit.temperature,
                rows: Math.round(number(data.rows || 9, 4, 12)),
                columns: Math.round(number(data.columns || 9, 4, 12)),
                lastScanPhoto: '',
                createdBy: data.createdBy,
                history: [createdHistoryEntry()]
            };
            box.storageLocation = formatColdStorageBoxLocation(box, state.coldStorageUnits);
            state.freezerBoxes.push(box);
            activeFreezerBoxId = box.id;
            activeColdStorageId = unit.id;
            activeColdStorageShelf = shelf;
            localStorage.setItem('rhineLabActiveFreezerBox', box.id);
            localStorage.setItem('rhineLabActiveColdStorage', unit.id);
            localStorage.setItem('rhineLabActiveColdStorageShelf', String(shelf));
            selectedSampleId = '';
            activityText = '新增冻存盒“' + box.name + '”';
        }

        rememberEntryValues(activeDialogType, data);
        if (activityText) addActivity(activityText);
        saveState();
        renderAll();
        els.entryDialog.close();
        if (activeDialogType === 'result' && activeExperimentId && els.experimentDetailDialog.open) {
            const experiment = state.experiments.find(item => item.id === activeExperimentId);
            if (experiment) renderExperimentResultSection(experiment);
        }
        editingRecord = null;
        pendingResultExperimentId = '';
        pendingResultAttachments = [];
        showToast('记录已保存并同步到工作台');
        if (activeDialogType === 'passage' && activeCellId) {
            window.setTimeout(function () { openCellDetail(activeCellId); }, 120);
        }
        if (activeDialogType === 'sample' && sampleIntakeQueue.length) {
            window.setTimeout(openNextScannedSample, 120);
        }
    }

    function syncFrozenSampleLineage(type, id, sampleId) {
        state.lineageLinks = state.lineageLinks.filter(function (link) {
            return !(link.sourceType === type && link.sourceId === id && link.relation === '冻存保藏');
        });
        if (!sampleId || !state.samples.some(function (sample) { return sample.id === sampleId; })) return;
        state.lineageLinks.push({ id: 'LIN-' + Date.now() + '-' + type, sourceType: type, sourceId: id, targetType: 'sample', targetId: sampleId, relation: '冻存保藏', quantity: '', unit: '', notes: '', date: todayIso() });
    }
    function createdHistoryEntry() {
        return { at: new Date().toISOString(), action: 'created', changes: [] };
    }

    function saveEditedRecord(data) {
        const target = editingRecord;
        const collection = recordCollection(target.type);
        const index = collection.findIndex(function (record) { return recordKey(target.type, record) === target.key; });
        if (index < 0) {
            showToast('原记录不存在，无法保存修改');
            return;
        }
        const current = collection[index];
        let updated = Object.assign({}, current, data, {
            createdBy: current.createdBy,
            history: Array.isArray(current.history) ? current.history.slice() : [],
            changeHistory: Array.isArray(current.changeHistory) ? current.changeHistory.slice() : undefined
        });

        if (target.type === 'experiment') {
            updated.id = current.id;
            updated.title = displayOr(data.title, '未命名实验');
            updated.date = data.date || current.date || todayIso();
            updated.status = displayOr(data.status, current.status || '进行中');
            updated.progress = updated.status === '已完成' ? 100 : updated.status === '待分析' ? Math.max(80, current.progress || 0) : Math.min(79, current.progress || 40);
        } else if (target.type === 'protocol') {
            updated.id = current.id;
            updated.number = current.number;
            updated.steps = String(data.stepsText || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean);
            const catalogs = Array.from(els.entryForm.querySelectorAll('[name="reagentCatalog"]')).map(input => input.value);
            const amounts = Array.from(els.entryForm.querySelectorAll('[name="reagentAmount"]')).map(input => input.value);
            const reagentMap = new Map();
            catalogs.forEach(function (catalog, index) {
                const amount = positiveNumber(amounts[index], 0);
                if (catalog && amount > 0) reagentMap.set(catalog, roundQuantity((reagentMap.get(catalog) || 0) + amount));
            });
            updated.reagents = Array.from(reagentMap, entry => ({ catalog: entry[0], amount: entry[1] }));
            delete updated.stepsText;
        } else if (target.type === 'formulation') {
            updated.id = current.id;
            updated.name = displayOr(data.name, '未命名配方');
            updated.physicalForm = displayOr(data.physicalForm, '其他');
            updated.finalAmount = positiveNumber(data.finalAmount, 0);
            updated.components = readFormulationComponents(new FormData(els.entryForm));
            updated.version = displayOr(data.version, current.version || 'V1.0');
        } else if (target.type === 'task') {
            updated.id = current.id;
            updated.done = current.done;
            updated.date = data.date || current.date || todayIso();
            updated.time = data.time;
            updated.end = data.end;
            updated.shareWithLab = data.shareWithLab !== 'no';
            if (!normalizeScheduleTimes(updated)) return;
            if (updated.experimentId) {
                const linkedExperiment = state.experiments.find(item => item.id === updated.experimentId);
                if (!linkedExperiment) updated.experimentId = '';
                else if (linkedExperiment.protocolId) updated.protocolId = linkedExperiment.protocolId;
            }
        } else if (target.type === 'coldStorage') {
            const shelfCount = Math.round(number(data.shelves, 1, 12)) || 1;
            const levels = parseColdStorageLevels(data.levelLayout, shelfCount);
            if (!levels) { showToast('请按设备层数逐行填写，例如“直放 1x4”或“货架 2架 2x4”'); return; }
            if (coldStorageLayoutConflict(current.id, levels)) { showToast('请先移动超出新范围的冻存盒'); return; }
            updated.id = current.id;
            updated.name = displayOr(data.name, current.name || '未命名冻存设备');
            updated.type = displayOr(data.type, current.type || '超低温冰箱');
            updated.temperature = displayOr(data.temperature, current.temperature || '-80°C');
            updated.location = displayOr(data.location, current.location || '位置待设置');
            updated.orientation = data.orientation === '竖向' ? '竖向' : '横向';
            updated.shelves = levels.length;
            updated.rows = levels[0].rows;
            updated.columns = levels[0].columns;
            updated.levels = levels;
            updated.layoutX = current.layoutX;
            updated.layoutY = current.layoutY;
            delete updated.levelLayout;
        } else if (target.type === 'freezer') {
            const unit = state.coldStorageUnits.find(function (item) { return item.id === data.storageUnitId; }) || state.coldStorageUnits[0];
            const shelf = Math.round(number(data.shelf, 1, Math.max(1, Number(unit.shelves) || 1))) || 1;
            const level = coldStorageLevel(unit, shelf);
            const storageRack = level.mode === 'rack' ? (Math.round(number(data.storageRack, 1, level.rackCount || 1)) || 1) : 1;
            const storageRow = Math.round(number(data.storageRow, 1, level.rows)) || 1;
            const storageColumn = Math.round(number(data.storageColumn, 1, level.columns)) || 1;
            if (state.freezerBoxes.some(function (box) { return box.id !== current.id && box.storageUnitId === unit.id && Number(box.shelf || 1) === shelf && Number(box.storageRack || 1) === storageRack && Number(box.storageRow || 1) === storageRow && Number(box.storageColumn || 1) === storageColumn; })) {
                showToast('该设备盒位已经放置冻存盒');
                return;
            }
            updated.id = current.id;
            updated.storageUnitId = unit.id;
            updated.shelf = shelf;
            updated.storageRack = storageRack;
            updated.storageRow = storageRow;
            updated.storageColumn = storageColumn;
            updated.temperature = unit.temperature;
            updated.storageLocation = formatColdStorageBoxLocation(updated);
        } else if (target.type === 'animalRoom' || target.type === 'plantRoom') {
            updated.id = current.id;
            updated.name = displayOr(data.name, current.name || (target.type === 'animalRoom' ? '未命名动物房间' : '未命名植物培养室'));
            updated.shape = displayOr(data.shape, current.shape || '矩形');
            updated.entranceSide = displayOr(data.entranceSide, current.entranceSide || '右侧');
            updated.entrancePosition = number(data.entrancePosition, 12, 88) || 50;
            updated.notes = String(data.notes || '').trim();
            const racks = target.type === 'animalRoom' ? state.animalRacks : state.plantRacks;
            racks.filter(function (rack) { return rack.roomId === current.id; }).forEach(function (rack) { rack.facility = updated.name; });
        } else if (target.type === 'mouse') {
            updated.id = current.id;
            const cage = state.animalCages.find(item => item.id === data.cageId);
            updated.cageId = cage ? cage.id : '';
            updated.cage = cage ? cage.label : '未分配';
            updated.species = displayOr(data.species, '未设置物种');
        } else if (target.type === 'plant') {
            updated.id = current.id;
            const rack = state.plantRacks.find(function (item) { return item.id === data.rackId; });
            const position = rack ? normalizePlantPosition(data.position) || firstAvailablePlantPosition(rack, state.plants.filter(function (item) { return item.id !== current.id; })) : '';
            if (rack && (!position || !isValidPlantPosition(rack, position))) { showToast('培养架位置格式不正确或超出范围'); return; }
            if (rack && state.plants.some(function (item) { return item.id !== current.id && item.rackId === rack.id && item.position === position; })) { showToast('该培养架位置已有植物材料'); return; }
            updated.name = displayOr(data.name, current.name || '未命名植物材料');
            updated.rackId = rack ? rack.id : '';
            updated.position = position;
            updated.location = rack && position ? formatPlantLocation(rack, position) : '未分配位置';
        } else if (target.type === 'microbe') {
            updated.id = current.id;
            updated.name = displayOr(data.name, current.name || '未命名菌种');
        } else if (target.type === 'plasmid') {
            updated.id = current.id;
            updated.name = displayOr(data.name, current.name || '未命名质粒');
            updated.sizeBp = Math.max(0, Math.round(positiveNumber(data.sizeBp, current.sizeBp || 0)));
        } else if (target.type === 'virus') {
            updated.id = current.id;
            updated.name = displayOr(data.name, current.name || '未命名病毒');
        } else if (['bioProject', 'bioDataset', 'bioPipeline', 'bioRun'].includes(target.type)) {
            updated.id = current.id;
            if (target.type === 'bioRun') updated.name = bioPipelineLabel(updated.pipelineId) + ' · ' + updated.id;
            else updated.name = displayOr(data.name, current.name || '未命名记录');
            if (target.type === 'bioProject') updated.status = displayOr(data.status, current.status || '准备中');
            if (target.type === 'bioRun') updated.status = displayOr(data.status, current.status || '排队中');
        } else if (target.type === 'cell') {
            updated.id = current.id;
            updated.passage = Math.max(0, Math.round(positiveNumber(data.passage, current.passage || 0)));
            updated.confluence = number(data.confluence, 0, 100);
        } else if (target.type === 'reagent') {
            updated.catalog = current.catalog;
            updated.totalQty = positiveNumber(data.totalQty, current.totalQty || 100);
            updated.currentQty = number(data.currentQty, 0, updated.totalQty);
            updated.amount = updated.totalQty ? number(updated.currentQty / updated.totalQty * 100, 0, 100) : 0;
            updated.status = updated.amount < 25 ? '余量低' : isExpiringSoon(updated.expiry) ? '临期' : '正常';
        } else if (target.type === 'sample') {
            updated.id = current.id;
            const box = state.freezerBoxes.find(item => item.id === updated.boxId);
            const position = samplePosition(updated.position);
            if (!box || !isValidBoxPosition(box, position)) {
                showToast('盒内位置格式不正确或超出当前冻存盒范围');
                return;
            }
            const occupied = state.samples.some(function (item) {
                return item.id !== current.id && item.boxId === box.id && item.position === position;
            });
            if (occupied) {
                showToast('该冻存盒位置已被占用，请选择其他空位');
                return;
            }
            updated.position = position;
            updated.location = formatSampleLocation(box, position);
        } else if (target.type === 'result') {
            const experiment = state.experiments.find(item => item.id === data.experimentId);
            if (!experiment) {
                showToast('请选择一条有效的实验记录');
                return;
            }
            if (state.results.some(item => item.id !== current.id && item.experimentId === data.experimentId)) {
                showToast('这条实验记录已经有对应结果');
                return;
            }
            updated.id = current.id;
            updated.attachments = clone(pendingResultAttachments);
        }

        const schema = dialogSchemas[target.type];
        const changes = schema.fields.filter(function (config) {
            return !((target.type === 'reagent' && config.name === 'catalog') || (target.type !== 'reagent' && config.name === 'id'));
        }).map(function (config) {
            return {
                field: config.name,
                label: config.label,
                from: historyFieldValue(config.name, schemaRecordValue(target.type, current, config.name)),
                to: historyFieldValue(config.name, schemaRecordValue(target.type, updated, config.name))
            };
        }).filter(function (change) {
            return String(change.from == null ? '' : change.from) !== String(change.to == null ? '' : change.to);
        });

        if (!changes.length) {
            showToast('没有检测到需要保存的修改');
            return;
        }

        const historyEntry = { at: new Date().toISOString(), action: 'updated', changes: changes };
        if (target.type === 'cell') updated.changeHistory.push(historyEntry);
        else updated.history.push(historyEntry);
        collection[index] = updated;
        if (target.type === 'coldStorage') state.freezerBoxes.filter(function (box) { return box.storageUnitId === updated.id; }).forEach(function (box) { box.temperature = updated.temperature; box.storageLocation = formatColdStorageBoxLocation(box, [updated]); });
        if (['plant', 'microbe', 'plasmid', 'virus'].includes(target.type)) syncFrozenSampleLineage(target.type, updated.id, updated.frozenSampleId);
        appendAuditLog({ action: 'updated', recordType: target.type, recordId: target.key, changes: clone(changes) });
        addActivity('更新' + recordTypeLabel(target.type) + '记录“' + (updated.name || updated.id || updated.catalog) + '”');
        if (target.type === 'sample') {
            activeFreezerBoxId = updated.boxId;
            selectedSampleId = updated.id;
            localStorage.setItem('rhineLabActiveFreezerBox', updated.boxId);
        } else if (target.type === 'cell') {
            activeCellId = updated.id;
        } else if (target.type === 'coldStorage') {
            activeColdStorageId = updated.id;
            activeColdStorageShelf = Math.min(updated.levels.length, activeColdStorageShelf);
            localStorage.setItem('rhineLabActiveColdStorage', updated.id);
        } else if (target.type === 'freezer') {
            activeFreezerBoxId = updated.id;
            activeColdStorageId = updated.storageUnitId;
            activeColdStorageShelf = updated.shelf;
            localStorage.setItem('rhineLabActiveFreezerBox', updated.id);
            localStorage.setItem('rhineLabActiveColdStorage', updated.storageUnitId);
            localStorage.setItem('rhineLabActiveColdStorageShelf', String(updated.shelf));
        } else if (target.type === 'animalRoom') {
            activeAnimalRoomId = updated.id;
            localStorage.setItem('rhineLabActiveAnimalRoom', updated.id);
        } else if (target.type === 'plantRoom') {
            activePlantRoomId = updated.id;
            localStorage.setItem('rhineLabActivePlantRoom', updated.id);
        } else if (target.type === 'plant') {
            selectedPlantId = updated.id;
            if (updated.rackId) {
                activePlantRackId = updated.rackId;
                localStorage.setItem('rhineLabActivePlantRack', updated.rackId);
            }
        } else if (target.type === 'formulation') {
            activeProtocolTab = 'formulations';
        }
        saveState();
        renderAll();
        els.entryDialog.close();
        if (activeDialogType === 'result' && activeExperimentId && els.experimentDetailDialog.open) {
            const experiment = state.experiments.find(item => item.id === activeExperimentId);
            if (experiment) renderExperimentResultSection(experiment);
        }
        editingRecord = null;
        pendingResultExperimentId = '';
        pendingResultAttachments = [];
        showToast('修改已保存，并写入变更记录');
    }

    function schemaRecordValue(type, record, fieldName) {
        if (type === 'protocol' && fieldName === 'stepsText') return (record.steps || []).join('\n');
        if (type === 'formulation' && fieldName === 'components') return record.components || [];
        if (type === 'task' && fieldName === 'shareWithLab') return record.shareWithLab === false ? 'no' : 'yes';
        if (type === 'coldStorage' && fieldName === 'levelLayout') return coldStorageLevelsText(record.levels || []);
        return record[fieldName];
    }

    function historyFieldValue(fieldName, value) {
        if (fieldName === 'photoData') return value ? '已附照片' : '未附照片';
        if (fieldName === 'reagents' || fieldName === 'reagentUsage') {
            return (Array.isArray(value) ? value : []).map(function (item) { return item.catalog + ' × ' + formatQuantity(item.amount); }).join('、');
        }
        if (fieldName === 'components') {
            return (Array.isArray(value) ? value : []).map(function (item) { return [item.name, item.amount, item.unit].filter(Boolean).join(' '); }).join('、');
        }
        if (fieldName === 'attachments') {
            const attachments = Array.isArray(value) ? value : [];
            return attachments.length + ' 个附件' + (attachments.length ? ' · ' + attachments.map(item => item.name).join('、') : '');
        }
        return value;
    }

    function openRecordDetail(type, key) {
        if (type === 'experiment') openExperimentDetail(key);
        if (type === 'protocol') openProtocolDetail(key);
        if (type === 'mouse') openAnimalDetail(key);
        if (type === 'plant') openPlantDetail(key);
        if (type === 'microbe') openMicrobeDetail(key);
        if (type === 'plasmid') openPlasmidDetail(key);
        if (type === 'virus') openVirusDetail(key);
        if (type === 'reagent') openReagentDetail(key);
        if (type === 'sample') openSampleDetail(key);
        if (type === 'cell') openCellDetail(key);
        if (type === 'formulation') openFormulationDetail(key);
        if (['bioProject', 'bioDataset', 'bioPipeline', 'bioRun'].includes(type)) openBioinformaticsDetail(type, key);
        if (type === 'result') {
            const result = state.results.find(item => item.id === key);
            if (result) openExperimentDetail(result.experimentId);
        }
    }

    function openBioinformaticsDetail(type, key) {
        const record = findRecord(type, key);
        const schema = dialogSchemas[type];
        if (!record || !schema) return;
        prepareRecordDetail(type, key);
        const title = record.name || record.id;
        const labels = { bioProject: 'COMPUTATIONAL PROJECT', bioDataset: 'RESEARCH DATASET', bioPipeline: 'REPRODUCIBLE WORKFLOW', bioRun: 'ANALYSIS RUN' };
        els.recordDetailKicker.textContent = labels[type] + ' · ' + record.id;
        els.recordDetailTitle.textContent = title;
        const fields = schema.fields.map(function (config) {
            let value = schemaRecordValue(type, record, config.name);
            if (config.name === 'projectId') value = bioProjectLabel(value);
            if (config.name === 'pipelineId') value = bioPipelineLabel(value);
            if (config.name === 'datasetId') value = bioDatasetLabel(value);
            return detailFieldHtml(config.label, value, ['objective', 'notes', 'command'].includes(config.name));
        }).join('');
        const command = type === 'bioPipeline' && record.command ? '<section class="record-detail-section bioinfo-command"><div class="record-detail-section-title"><p class="micro-label">REPRODUCIBLE ENTRYPOINT</p><h3>运行入口</h3></div><pre class="bioinfo-code-block"><code>' + esc(record.command) + '</code></pre></section>' : '';
        els.recordDetailBody.innerHTML = '<section class="record-detail-hero bioinfo-detail-hero"><div><span class="record-detail-code">' + esc(record.id) + '</span><h3>' + esc(title) + '</h3><p>' + esc(record.referenceGenome || record.dataType || record.analysisType || bioProjectLabel(record.projectId)) + '</p></div><span class="status-chip ' + statusClass(record.status) + '">' + esc(record.status || labels[type]) + '</span></section><section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">COMPUTATIONAL RECORD</p><h3>记录详情</h3></div><div class="record-detail-grid">' + fields + '</div></section>' + command + recordHistoryHtml(record);
        if (!els.recordDetailDialog.open) els.recordDetailDialog.showModal();
    }

    function isExpiringSoon(dateString) {
        if (!dateString) return false;
        const expiry = new Date(dateString + 'T00:00:00');
        const days = (expiry.getTime() - Date.now()) / 86400000;
        return days >= 0 && days <= 60;
    }

    function showToast(message) {
        els.toast.querySelector('p').textContent = message;
        els.toast.classList.add('show');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(function () {
            els.toast.classList.remove('show');
        }, 2600);
    }

    function statusClass(status) {
        if (['进行中', '实验中', '质控中', '运行中'].includes(status)) return 'processing';
        if (['待分析', '临期', '观察期', '待传代', '待操作', '排队中', '准备中'].includes(status)) return 'caution';
    if (['余量低', '剩余少', '失败'].includes(status)) return 'danger';
        if (['待分配'].includes(status)) return 'neutral';
        return '';
    }

    function samplePosition(location) {
        const match = String(location || '').match(/([A-Z]\d{1,2})\s*$/i);
        return match ? match[1].toUpperCase() : '';
    }

    function valueOf(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : '';
    }

    function shortDate(date) {
        const match = String(date || '').match(/(\d{4})-(\d{2})-(\d{2})/);
        return match ? match[2] + '/' + match[3] : date;
    }

    function todayIso() {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
    }

    function parseLocalDate(iso) {
        const match = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match) return new Date();
        return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
    }

    function toIsoDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    function addDays(date, days) {
        const next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
        next.setDate(next.getDate() + days);
        return next;
    }

    function formatFullDate(date) {
        return new Intl.DateTimeFormat(interfaceLocale(), { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }).format(date);
    }

    function formatShortDate(date) {
        return new Intl.DateTimeFormat(interfaceLocale(), { month: 'long', day: 'numeric', weekday: 'short' }).format(date);
    }

    function timeToMinutes(time) {
        const parts = String(time || '00:00').split(':').map(Number);
        return (parts[0] || 0) * 60 + (parts[1] || 0);
    }

    function minutesToTime(minutes) {
        const normalized = Math.max(0, Math.min(24 * 60, minutes));
        const hour = Math.floor(normalized / 60);
        const minute = normalized % 60;
        return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
    }

    function addMinutes(time, minutes) {
        return minutesToTime(timeToMinutes(time) + minutes);
    }

    function hasScheduleTime(item) {
        return /^\d{2}:\d{2}$/.test(String(item && item.time || '')) && /^\d{2}:\d{2}$/.test(String(item && item.end || ''));
    }

    function scheduleTimeLabel(item) {
        return hasScheduleTime(item) ? item.time : '未定';
    }

    function normalizeScheduleTimes(item) {
        const start = String(item.time || '').trim();
        const end = String(item.end || '').trim();
        if (!start && !end) {
            item.time = '';
            item.end = '';
            return true;
        }
        if (!start || !end) {
            showToast('请同时填写开始和结束时间，或都留空');
            return false;
        }
        if (timeToMinutes(end) <= timeToMinutes(start)) {
            showToast('结束时间需要晚于开始时间');
            return false;
        }
        item.time = start;
        item.end = end;
        return true;
    }

    function byTime(a, b) {
        const aTimed = hasScheduleTime(a);
        const bTimed = hasScheduleTime(b);
        if (aTimed !== bTimed) return aTimed ? 1 : -1;
        return aTimed ? a.time.localeCompare(b.time) : String(a.title || '').localeCompare(String(b.title || ''));
    }

    function number(value, min, max) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return min;
        return Math.max(min, Math.min(max, parsed));
    }

    function positiveNumber(value, fallback) {
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
    }

    function roundQuantity(value) {
        return Math.round((Number(value) + Number.EPSILON) * 1000) / 1000;
    }

    function formatQuantity(value) {
        return Number(value || 0).toLocaleString(interfaceLocale(), { maximumFractionDigits: 3 });
    }

    function esc(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
})();
