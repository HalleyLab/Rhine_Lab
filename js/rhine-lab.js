(function () {
    'use strict';

    const STORAGE_KEY = 'rhineLabWorkspaceV1';

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
            { id: 'RL-S-0856', type: 'RNA', source: 'BV2 / Vehicle', processing: 'TRIzol 提取', location: 'FZ-03/B2 · C4', date: '2026-08-07', status: '质控中' },
            { id: 'RL-S-0849', type: '血清', source: 'M-23991', processing: '2000g / 10min', location: 'FZ-03/B2 · D1', date: '2026-08-05', status: '在库' },
            { id: 'RL-S-0842', type: 'DNA', source: 'M-24088 / 耳样', processing: 'Proteinase K', location: 'FZ-03/B2 · E6', date: '2026-08-04', status: '在库' },
            { id: 'RL-S-0837', type: '蛋白裂解液', source: 'HEK293T / A17', processing: 'RIPA 裂解', location: 'FZ-03/B2 · F2', date: '2026-08-03', status: '剩余少' },
            { id: 'RL-S-0829', type: '切片', source: 'M-23987 / PFC', processing: '30 μm 冠状切片', location: 'FZ-03/B2 · F7', date: '2026-08-01', status: '在库' }
        ],
        freezerBoxes: [
            { id: 'FB-FZ03-B2', name: 'FZ-03 / B2', storageLocation: '-80°C 冰箱 FZ-03 · 第 2 层 · B 位', temperature: '-80°C', rows: 9, columns: 9 },
            { id: 'FB-FZ03-C1', name: 'FZ-03 / C1', storageLocation: '-80°C 冰箱 FZ-03 · 第 3 层 · C 位', temperature: '-80°C', rows: 9, columns: 9 },
            { id: 'FB-LN02-A1', name: 'LN-02 / A1', storageLocation: '液氮罐 LN-02 · 提篮 A · 第 1 层', temperature: '液氮', rows: 9, columns: 9 }
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
            { id: 'RL-S-0869', type: 'RNA', source: 'M-24121 / 视觉皮层', processing: 'TRIzol 提取', location: 'FZ-03/C1 · A1', date: '2026-08-08', status: '质控中', createdBy: 'NODE-05' },
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
    defaults.reagents = defaults.reagents.concat(clone(additionalExamples.reagents));
    defaults.samples = defaults.samples.concat(clone(additionalExamples.samples));
    defaults.schedule = defaults.schedule.concat(clone(additionalExamples.schedule));
    defaults.activities = defaults.activities.concat(clone(additionalExamples.activities));
    defaults.protocols = clone(protocols);
    defaults.exampleSeedVersion = 4;
    defaults.auditLog = [];

    applyConfiguredSeed(window.RHINE_LAB_SEED);

    function applyConfiguredSeed(seed) {
        if (!seed || typeof seed !== 'object') return;
        ['experiments', 'results', 'mice', 'cellCultures', 'reagents', 'samples', 'freezerBoxes', 'schedule', 'activities'].forEach(function (key) {
            if (Array.isArray(seed[key])) defaults[key] = clone(seed[key]);
        });
        if (Array.isArray(seed.protocols)) {
            protocols.splice(0, protocols.length);
            protocols.push.apply(protocols, clone(seed.protocols));
            defaults.protocols = clone(seed.protocols);
        }
        defaults.exampleSeedVersion = Number(seed.exampleSeedVersion) || 4;
    }

    let workspaceMode = localStorage.getItem('rhineLabWorkspaceMode') === 'lab' ? 'lab' : 'personal';
    let state = migrateState(loadState(workspaceMode));
    let activeView = getInitialView();
    let experimentFilter = '全部';
    let resultFilter = '全部';
    let reagentFilter = '全部';
    let workspaceReadOnly = workspaceMode === 'lab';
    let selectedSampleId = state.samples[0] ? state.samples[0].id : '';
    let activeFreezerBoxId = state.freezerBoxes.some(box => box.id === localStorage.getItem('rhineLabActiveFreezerBox')) ? localStorage.getItem('rhineLabActiveFreezerBox') : state.freezerBoxes[0].id;
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
    let toastTimer = null;
    let runInputSaveTimer = null;

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
        monthAgendaAdd: document.getElementById('monthAgendaAdd'),
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
        experimentDetailDialog: document.getElementById('experimentDetailDialog'),
        experimentDetailForm: document.getElementById('experimentDetailForm'),
        experimentDetailNumber: document.getElementById('experimentDetailNumber'),
        experimentDetailTitle: document.getElementById('experimentDetailTitle'),
        experimentDetailStatus: document.getElementById('experimentDetailStatus'),
        experimentDetailProtocol: document.getElementById('experimentDetailProtocol'),
        experimentDetailDescription: document.getElementById('experimentDetailDescription'),
        experimentUsageRows: document.getElementById('experimentUsageRows'),
        experimentUsageSource: document.getElementById('experimentUsageSource'),
        experimentUsageImpact: document.getElementById('experimentUsageImpact'),
        experimentPhotoPanel: document.getElementById('experimentPhotoPanel'),
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
        cellMaintenanceMetrics: document.getElementById('cellMaintenanceMetrics'),
        cellCultureGrid: document.getElementById('cellCultureGrid'),
        cellMaintenanceQueue: document.getElementById('cellMaintenanceQueue'),
        clearWorkspaceDialog: document.getElementById('clearWorkspaceDialog'),
        clearWorkspacePhrase: document.getElementById('clearWorkspacePhrase'),
        confirmClearWorkspace: document.getElementById('confirmClearWorkspace'),
        endDayButton: document.getElementById('endDayButton'),
        endDayDialog: document.getElementById('endDayDialog'),
        endDaySummary: document.getElementById('endDaySummary')
    };

    init();

    function init() {
        applySavedTheme();
        applyWorkspaceMode();
        setTodayLabels();
        window.setInterval(updateTimeGreeting, 60000);
        window.setInterval(applyTimeThemeIfAutomatic, 60000);
        window.setInterval(updateRunTimerDisplay, 1000);
        saveState();
        applyNotificationState();
        switchView(activeView, false);
        bindEvents();
        window.addEventListener('focus', applyTimeThemeIfAutomatic);
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) applyTimeThemeIfAutomatic();
        });
        window.addEventListener('rhine:languagechange', handleLanguageChange);
        startCloudSync();
    }

    function handleLanguageChange() {
        setTodayLabels();
        updateThemeToggleLabel();
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
            const stored = JSON.parse(localStorage.getItem(scopeStorageKey(mode)));
            return normalizeStateShape(stored);
        } catch (error) {
            return clone(defaults);
        }
    }

    function normalizeStateShape(stored) {
        if (!stored || typeof stored !== 'object') return clone(defaults);
        return {
            experiments: Array.isArray(stored.experiments) ? stored.experiments : clone(defaults.experiments),
            results: Array.isArray(stored.results) ? stored.results : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.results)),
            mice: Array.isArray(stored.mice) ? stored.mice : clone(defaults.mice),
            cellCultures: Array.isArray(stored.cellCultures) ? stored.cellCultures : (Number(stored.exampleSeedVersion) >= 999 ? [] : clone(defaults.cellCultures)),
            reagents: Array.isArray(stored.reagents) ? stored.reagents : clone(defaults.reagents),
            samples: Array.isArray(stored.samples) ? stored.samples : clone(defaults.samples),
            freezerBoxes: Array.isArray(stored.freezerBoxes) ? stored.freezerBoxes : clone(defaults.freezerBoxes),
            schedule: Array.isArray(stored.schedule) ? stored.schedule : clone(defaults.schedule),
            protocols: Array.isArray(stored.protocols) ? stored.protocols : clone(defaults.protocols),
            activities: Array.isArray(stored.activities) ? stored.activities : clone(defaults.activities),
            auditLog: Array.isArray(stored.auditLog) ? stored.auditLog : [],
            exampleSeedVersion: Number(stored.exampleSeedVersion) || 0
        };
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
        data.freezerBoxes = Array.isArray(data.freezerBoxes) && data.freezerBoxes.length ? data.freezerBoxes : clone(defaults.freezerBoxes);
        data.freezerBoxes = data.freezerBoxes.map(function (box, index) {
            const seededLegacyBox = ['FB-FZ03-B2', 'FB-FZ03-C1', 'FB-LN02-A1'].includes(box.id) && Number(box.rows) === 6 && Number(box.columns) === 8;
            return {
                id: box.id || 'FB-USR-' + String(index + 1).padStart(3, '0'),
                name: box.name || '冻存盒 ' + (index + 1),
                storageLocation: box.storageLocation || '位置待补充',
                temperature: box.temperature || '-80°C',
                rows: seededLegacyBox ? 9 : (Math.round(number(box.rows, 4, 12)) || 9),
                columns: seededLegacyBox ? 9 : (Math.round(number(box.columns, 4, 12)) || 9),
                lastScanPhoto: box.lastScanPhoto || '',
                createdBy: anonymousContributor(box.createdBy)
            };
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
                photoData: protocol.photoData || '',
                createdBy: anonymousContributor(protocol.createdBy)
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
            const totalQty = positiveNumber(reagent.totalQty, profile.totalQty);
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

        data.mice = data.mice.map(function (mouse) {
            return Object.assign({}, mouse, {
                createdBy: anonymousContributor(mouse.createdBy),
                history: Array.isArray(mouse.history) ? mouse.history : []
            });
        });

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
            return Object.assign({}, task, {
                date: task.date || todayIso(),
                end: task.end || addMinutes(task.time || '09:00', 60),
                experimentId: task.experimentId || experimentByTaskTitle[task.title] || '',
                protocolId: task.protocolId == null ? (protocolByTitle[task.title] || '') : task.protocolId,
                done: Boolean(task.done),
                createdBy: anonymousContributor(task.createdBy)
            });
        });
        return data;
    }

    function mergeExampleRecords(target, examples, key) {
        examples.forEach(function (example) {
            if (!target.some(item => item[key] === example[key])) target.push(clone(example));
        });
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function saveState(options) {
        localStorage.setItem(scopeStorageKey(workspaceMode), JSON.stringify(state));
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
            setAccess: setWorkspaceAccess
        });
    }

    function applyCloudState(payload, scope) {
        if (scope !== workspaceMode) return;
        state = migrateState(normalizeStateShape(payload));
        selectedSampleId = state.samples[0] ? state.samples[0].id : '';
        if (!state.freezerBoxes.some(box => box.id === activeFreezerBoxId)) {
            activeFreezerBoxId = state.freezerBoxes[0].id;
        }
        saveState({ remote: true });
        renderAll();
    }

    function setWorkspaceAccess(access) {
        workspaceReadOnly = workspaceMode === 'lab' && Boolean(access && access.readOnly);
        applyWorkspaceMode();
    }

    function getInitialView() {
        const hash = location.hash.replace('#', '');
        return ['dashboard', 'experiments', 'results', 'mice', 'reagents', 'samples', 'protocols', 'schedule', 'cells'].includes(hash) ? hash : 'dashboard';
    }

    function applySavedTheme() {
        const theme = localStorage.getItem('rhineLabTheme');
        applyTheme(theme === 'dark' || theme === 'light' ? theme : themeFromSystemTime());
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
        if (themeColor) themeColor.setAttribute('content', dark ? '#1b2420' : '#d8ff45');
        updateThemeToggleLabel();
    }

    function updateThemeToggleLabel() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;
        const label = document.body.classList.contains('dark-theme') ? '切换日间模式' : '切换夜间模式';
        toggle.setAttribute('aria-label', interfaceText(label));
        toggle.setAttribute('title', interfaceText(label));
    }

    function applyWorkspaceMode() {
        document.body.classList.toggle('lab-workspace', workspaceMode === 'lab');
        document.body.classList.toggle('workspace-readonly', workspaceReadOnly);
        els.workspaceModeToggle.querySelectorAll('[data-workspace-mode]').forEach(function (button) {
            const active = button.dataset.workspaceMode === workspaceMode;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        els.workspaceScopeBanner.hidden = workspaceMode !== 'lab';
        if (workspaceMode === 'lab') {
            const description = els.workspaceScopeBanner.querySelector('div:first-child > span');
            if (description) description.textContent = workspaceReadOnly ? '集中查看所有成员录入的信息；当前账户对共用数据为只读。' : '集中管理所有成员录入的实验、Protocol、库存、动物、样本与细胞信息。';
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
        workspaceReadOnly = mode === 'lab';
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
        els.workspaceScopeStats.innerHTML = '<div><small>录入成员</small><strong>' + members.size + '</strong></div><div><small>整合记录</small><strong>' + totalRecords + '</strong></div><div><small>共享 Protocol</small><strong>' + state.protocols.length + '</strong></div>';
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

    function bindEvents() {
        document.addEventListener('click', function (event) {
            const mutationTarget = event.target.closest('[data-add], [data-add-result-for], [data-edit-result], [data-delete-result], [data-remove-result-attachment], [data-task-check], [data-start-scheduled-experiment], [data-scan-freezer], [data-start-scan-intake], [data-sample-position], [data-add-reagent-row], [data-remove-reagent-row], [data-add-experiment-reagent], [data-remove-experiment-reagent], [data-edit-record], [data-delete-record], [data-confirm-delete], [data-run-action], [data-run-timer], [data-run-calculate], [data-calc-token], [data-calc-action], [data-apparatus-cell], [data-clear-apparatus], [data-remove-run-photo], [data-add-passage], [data-open-clear-workspace], [data-confirm-clear-workspace]');
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

            const add = event.target.closest('[data-add]');
            if (add) {
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

            const addReagentRow = event.target.closest('[data-add-reagent-row]');
            if (addReagentRow) {
                document.getElementById('protocolReagentRows').insertAdjacentHTML('beforeend', reagentUsageRowHtml());
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

            const animalRecord = event.target.closest('[data-mouse-id]');
            if (animalRecord) {
                openAnimalDetail(animalRecord.dataset.mouseId);
                return;
            }

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

            const freezerBoxTab = event.target.closest('[data-freezer-box]');
            if (freezerBoxTab) {
                selectFreezerBox(freezerBoxTab.dataset.freezerBox);
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
                capture.querySelector('[data-photo-status]').textContent = '照片只在当前设备中压缩保存';
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

            const apparatusCell = event.target.closest('[data-apparatus-cell]');
            if (apparatusCell) {
                cycleApparatusCell(apparatusCell.dataset.apparatusCell);
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
                switchView(searchResult.dataset.resultView);
                closeSearch();
                showToast('已定位到“' + searchResult.dataset.resultTitle + '”');
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

        document.getElementById('themeToggle').addEventListener('click', function () {
            const nextTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
            localStorage.setItem('rhineLabTheme', nextTheme);
            applyTheme(nextTheme);
        });

        els.menuToggle.addEventListener('click', function () {
            const open = document.body.classList.toggle('sidebar-open');
            els.menuToggle.setAttribute('aria-expanded', String(open));
        });
        els.mobileScrim.addEventListener('click', closeSidebar);

        els.notificationToggle.addEventListener('click', function (event) {
            event.stopPropagation();
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
            if (event.key === 'Escape' && !els.searchOverlay.hidden) closeSearch();
            if (event.key === 'Escape' && !els.notificationPanel.hidden) closeNotifications();
            if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-mouse-id], [data-reagent-catalog], #sampleTable [data-sample-id], [data-cell-id]')) {
                event.preventDefault();
                if (event.target.dataset.mouseId) openAnimalDetail(event.target.dataset.mouseId);
                if (event.target.dataset.reagentCatalog) openReagentDetail(event.target.dataset.reagentCatalog);
                if (event.target.dataset.sampleId) openSampleDetail(event.target.dataset.sampleId);
                if (event.target.dataset.cellId) openCellDetail(event.target.dataset.cellId);
            }
        });

        document.getElementById('experimentSearch').addEventListener('input', renderExperiments);
        document.getElementById('resultSearch').addEventListener('input', renderResults);
        document.getElementById('mouseSearch').addEventListener('input', renderMice);
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

        document.getElementById('resultFilters').addEventListener('click', function (event) {
            const button = event.target.closest('[data-filter]');
            if (!button) return;
            resultFilter = button.dataset.filter;
            updateActiveFilter(event.currentTarget, button);
            renderResults();
        });

        document.getElementById('reagentFilters').addEventListener('click', function (event) {
            const button = event.target.closest('[data-filter]');
            if (!button) return;
            reagentFilter = button.dataset.filter;
            updateActiveFilter(event.currentTarget, button);
            renderReagents();
        });

        els.entryForm.addEventListener('submit', saveEntryFromDialog);
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
        els.experimentDetailForm.addEventListener('submit', saveExperimentDetail);
        els.experimentDetailProtocol.addEventListener('change', function () {
            applyProtocolDefaultsToExperimentEditor(els.experimentDetailProtocol.value);
        });
        els.experimentDetailStatus.addEventListener('change', function () {
            toggleCustomSelectInput(els.experimentDetailStatus, '', true);
            updateExperimentUsageImpact();
        });
        els.experimentUsageRows.addEventListener('input', updateExperimentUsageSource);
        els.experimentUsageRows.addEventListener('change', updateExperimentUsageSource);
        els.experimentRunBody.addEventListener('input', handleRunWorkspaceInput);
        els.experimentRunBody.addEventListener('change', handleRunWorkspaceChange);
        els.freezerScanInput.addEventListener('change', handleFreezerScanImage);
        els.freezerScanSensitivity.addEventListener('input', applyFreezerScanSensitivity);
        els.monthAgendaAdd.addEventListener('click', function () {
            if (denyReadOnlyMutation()) return;
            pendingTaskDefaults = { date: toIsoDate(calendarDate), time: '09:00', end: '10:00' };
            openEntryDialog('task');
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
        showToast('LAB 共用页面为只读；请切换到个人工作区录入');
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
            state.activities.unshift({ text: '结束今日工作并完成 ' + pendingTasks.length + ' 项日程', time: '刚刚' });
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
        els.notificationToggle.setAttribute('aria-label', count ? '打开通知，' + count + ' 条未读' : '打开通知，没有未读消息');
    }

    function updateActiveFilter(container, activeButton) {
        container.querySelectorAll('button').forEach(function (button) {
            button.classList.toggle('active', button === activeButton);
        });
    }

    function switchView(view, updateHash = true) {
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
            results: renderResults,
            mice: renderMice,
            reagents: renderReagents,
            samples: renderSamples,
            protocols: renderProtocols,
            schedule: renderSchedule,
            cells: renderCellCultures
        };
        const renderer = renderers[view];
        if (renderer) renderer();
    }

    function renderDashboard() {
        const activeExperiments = state.experiments.filter(item => item.status !== '已完成').length;
        const activeMice = state.mice.filter(item => item.status === '实验中').length;
        const lowReagents = state.reagents.filter(item => getTheoreticalPercent(item) < 25 || item.status !== '正常').length;
        const sampleCount = state.samples.length;
        const metrics = [
            { label: '进行中实验', value: activeExperiments, unit: '项', trend: state.experiments.length ? '+2 本周' : '暂无记录', code: 'EXP' },
            { label: '在管实验动物', value: state.mice.length, unit: '只', trend: activeMice + ' 只实验中', code: 'ANI' },
            { label: '登记生物样本', value: sampleCount, unit: '份', trend: state.samples.length ? '+8 本周' : '暂无记录', code: 'BIO' },
            { label: '试剂预警', value: lowReagents, unit: '项', trend: lowReagents ? '需处理' : '状态良好', code: 'CHM' }
        ];
        const metricViews = ['experiments', 'mice', 'samples', 'reagents'];
        document.getElementById('metricsGrid').innerHTML = metrics.map(function (metric, index) {
            return '<button class="metric-card metric-link-card" type="button" data-index="0' + (index + 1) + '" data-view-target="' + metricViews[index] + '" aria-label="打开' + esc(metric.label) + '"><div class="metric-top"><span class="metric-icon">' + metric.code + '</span><span class="metric-trend">' + esc(metric.trend) + '</span></div><div class="metric-value"><strong>' + metric.value + '</strong><span>' + metric.unit + ' · ' + metric.label + '</span></div><span class="metric-link-arrow" aria-hidden="true">→</span></button>';
        }).join('');

        const projects = state.experiments.filter(item => item.status !== '已完成').slice(0, 4);
        document.getElementById('dashboardProjects').innerHTML = projects.map(function (item, index) {
            return '<article class="project-row" data-view-target="experiments"><span class="project-code">P' + String(index + 1).padStart(2, '0') + '</span><div><h3>' + esc(item.title) + '</h3><p>' + esc(item.project) + contributorInline(item) + '</p></div><div class="project-progress"><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status) + '</span><div class="progress-track"><i style="width:' + number(item.progress, 0, 100) + '%"></i></div><small>最近更新 ' + esc(shortDate(item.date)) + '</small></div><span class="project-percent">' + number(item.progress, 0, 100) + '%</span></article>';
        }).join('') || '<p class="search-empty">当前没有进行中的实验。</p>';

        const todayTasks = state.schedule.filter(item => item.date === todayIso()).sort(byTime);
        document.getElementById('dashboardSchedule').innerHTML = todayTasks.slice(0, 5).map(scheduleItemHtml).join('') || '<p class="search-empty">今天还没有安排任务。</p>';
        const pendingToday = todayTasks.filter(item => !item.done);
        const daySummary = document.getElementById('dashboardDaySummary');
        if (pendingToday.length) {
            daySummary.innerHTML = '今天有 <strong id="todayTaskCount">' + pendingToday.length + ' 项任务</strong> 等待处理，下一项将在 <strong>' + esc(pendingToday[0].time) + '</strong> 开始。';
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
            return '<div class="activity-item"><i></i><div><p>' + esc(activityDisplayText(activity.text)) + '</p><time>' + esc(activity.time) + '</time></div></div>';
        }).join('');
    }

    function activityDisplayText(value) {
        return String(value || '').replace(/^[\u3400-\u9fff·]{2,6}(?=(更新|上传|登记|修改|完成|添加|创建|提交))/, '');
    }

    function renderExperiments() {
        const search = valueOf('experimentSearch').toLowerCase();
        const items = state.experiments.filter(function (item) {
            const matchesFilter = experimentFilter === '全部' || item.status === experimentFilter;
            const haystack = [item.id, item.title, item.project, item.createdBy, item.type, item.description].join(' ').toLowerCase();
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
            return '<button class="record-card" type="button" data-experiment-id="' + esc(item.id) + '" data-code="' + esc(item.id.replace('RL-EXP-', '')) + '"><div class="record-card-top"><span class="micro-label">' + esc(item.id) + ' · ' + esc(item.type) + contributorInline(item) + '</span><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status) + '</span></div><h2>' + esc(item.title) + '</h2><p>' + esc(item.description) + '</p><div class="progress-track"><i style="width:' + number(item.progress, 0, 100) + '%"></i></div><div class="record-usage-line"><span>' + photoBadge + esc(usageLabel) + '</span><strong>' + usage.length + ' 种试剂 →</strong></div><div class="record-meta"><div><small>PROJECT</small><strong>' + esc(item.project) + '</strong></div><div><small>DATE</small><strong>' + esc(shortDate(item.date)) + '</strong></div></div></button>';
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

    function renderResults() {
        const search = valueOf('resultSearch').toLowerCase();
        const records = state.experiments.filter(function (experiment) {
            const result = state.results.find(item => item.experimentId === experiment.id);
            const status = result ? '已填写' : '待填写';
            const haystack = [experiment.id, experiment.title, experiment.project, experiment.type, result && result.summary, result && result.conclusion, result && result.nextStep].join(' ').toLowerCase();
            return (resultFilter === '全部' || resultFilter === status) && haystack.includes(search);
        });
        const attachmentCount = state.results.reduce(function (total, result) { return total + result.attachments.length; }, 0);
        const metrics = [
            { label: '实验记录', value: state.experiments.length, code: 'REC' },
            { label: '已填写结果', value: state.results.length, code: 'DONE' },
            { label: '待填写结果', value: Math.max(0, state.experiments.length - state.results.length), code: 'WAIT' },
            { label: '附件总数', value: attachmentCount, code: 'FILE' }
        ];
        document.getElementById('resultMetrics').innerHTML = miniMetricsHtml(metrics);
        const grouped = groupByDate(records);
        document.getElementById('resultGrid').innerHTML = grouped.map(function (group) {
            return '<section class="result-day-group"><header class="experiment-day-head"><div><span>' + esc(formatDayHeading(group.date)) + '</span><small>' + group.items.length + ' 条实验记录</small></div><i></i></header><div class="result-card-grid">' + group.items.map(resultCardHtml).join('') + '</div></section>';
        }).join('') || '<div class="empty-card">没有找到匹配的实验结果。</div>';
    }

    function resultCardHtml(experiment) {
        const result = state.results.find(item => item.experimentId === experiment.id);
        if (!result) {
            return '<article class="result-card pending"><div class="result-card-top"><span class="micro-label">' + esc(experiment.id) + ' · ' + esc(experiment.type) + '</span><span class="status-chip caution">待填写</span></div><h2>' + esc(experiment.title) + '</h2><p>这条实验记录还没有对应结果。填写后可保存结论、照片和文件，并与原始记录保持一一对应。</p><div class="result-card-footer"><span>' + esc(experiment.project) + '</span><button class="button primary compact" type="button" data-add-result-for="' + esc(experiment.id) + '">＋ 添加结果</button></div></article>';
        }
        const attachments = result.attachments.slice(0, 4).map(resultAttachmentLinkHtml).join('');
        return '<article class="result-card"><div class="result-card-top"><span class="micro-label">' + esc(experiment.id) + ' · ' + esc(result.id) + '</span><span class="status-chip">已填写</span></div><h2>' + esc(experiment.title) + '</h2><p class="result-summary">' + esc(result.summary) + '</p><div class="result-conclusion"><small>结论与解释</small><strong>' + esc(result.conclusion) + '</strong></div>' + (attachments ? '<div class="result-attachment-strip">' + attachments + '</div>' : '<p class="result-no-attachments">尚未上传附件</p>') + '<div class="result-card-footer"><span>' + esc(result.date) + ' · ' + result.attachments.length + ' 个附件</span><div><button class="button ghost compact" type="button" data-edit-result="' + esc(result.id) + '">编辑结果</button><button class="result-delete-button" type="button" data-delete-result="' + esc(result.id) + '">删除</button></div></div></article>';
    }

    function resultAttachmentLinkHtml(attachment) {
        const isImage = String(attachment.type || '').startsWith('image/');
        const attachmentUrl = /^(?:data:|https?:\/\/)/i.test(String(attachment.data || '')) ? attachment.data : '';
        const preview = isImage && attachmentUrl ? '<img loading="lazy" decoding="async" src="' + esc(attachmentUrl) + '" alt="' + esc(attachment.name) + '">' : '<span aria-hidden="true">FILE</span>';
        return '<a href="' + esc(attachmentUrl || '#') + '" download="' + esc(attachment.name) + '" title="' + esc(attachment.name) + '">' + preview + '<small>' + esc(attachment.name) + '</small></a>';
    }

    function renderMice() {
        const search = valueOf('mouseSearch').toLowerCase();
        const items = state.mice.filter(item => [item.id, item.strain, item.genotype, item.cage, item.status, item.ethics].join(' ').toLowerCase().includes(search));
        const metrics = [
            { label: '在管总数', value: state.mice.length, code: 'ALL' },
            { label: '实验进行中', value: state.mice.filter(item => item.status === '实验中').length, code: 'RUN' },
            { label: '繁育队列', value: state.mice.filter(item => item.status === '繁育中').length, code: 'BRD' },
            { label: '使用笼位', value: new Set(state.mice.map(item => item.cage)).size, code: 'CGE' }
        ];
        document.getElementById('mouseMetrics').innerHTML = miniMetricsHtml(metrics);
        document.getElementById('mouseTable').innerHTML = items.map(function (item) {
            return '<tr class="clickable-data-row" data-mouse-id="' + esc(item.id) + '" tabindex="0" aria-label="查看动物 ' + esc(item.id) + ' 的详细信息"><td><strong>' + esc(item.id) + '</strong><small>RFID VERIFIED' + contributorInline(item) + '</small></td><td><strong>' + esc(item.strain) + '</strong><small>' + esc(item.genotype) + '</small></td><td>' + esc(item.sex) + '</td><td>' + esc(item.birth) + '</td><td><strong>' + esc(item.cage) + '</strong></td><td><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status) + '</span></td><td>' + esc(item.ethics) + '</td><td><button class="row-arrow" type="button" tabindex="-1" aria-hidden="true">→</button></td></tr>';
        }).join('') || '<tr><td colspan="8">没有找到匹配的动物记录。</td></tr>';
    }

    function renderReagents() {
        const search = valueOf('reagentSearch').toLowerCase();
        const items = state.reagents.filter(function (item) {
            const matchesFilter = reagentFilter === '全部' || item.category === reagentFilter;
            return matchesFilter && [item.name, item.category, item.catalog, item.lot, item.location, item.status].join(' ').toLowerCase().includes(search);
        });
        const metrics = [
            { label: '库存品类', value: state.reagents.length, code: 'SKU' },
            { label: '余量低', value: state.reagents.filter(item => getTheoreticalPercent(item) < 25).length, code: 'LOW' },
            { label: '临近效期', value: state.reagents.filter(item => item.status === '临期').length, code: 'EXP' },
            { label: '存储区域', value: new Set(state.reagents.map(item => item.location.split('/')[0].trim())).size, code: 'LOC' }
        ];
        document.getElementById('reagentMetrics').innerHTML = miniMetricsHtml(metrics);
        document.getElementById('reagentTable').innerHTML = items.map(function (item) {
            const low = item.amount < 25 ? ' low' : '';
            const displayStatus = getReagentDisplayStatus(item);
            return '<tr class="clickable-data-row" data-reagent-catalog="' + esc(item.catalog) + '" tabindex="0" aria-label="查看试剂 ' + esc(item.name) + ' 的详细信息"><td><strong>' + esc(item.name) + (item.photoData ? ' <span class="table-photo-mark" title="附有录入照片">⌑</span>' : '') + '</strong><small>' + esc(item.catalog) + contributorInline(item) + '</small></td><td>' + esc(item.category) + '</td><td>' + esc(item.lot) + '</td><td>' + esc(item.location) + '</td><td><div class="amount-meter' + low + '"><div><i style="width:' + number(item.amount, 0, 100) + '%"></i></div><span>' + formatQuantity(item.currentQty) + ' / ' + formatQuantity(item.totalQty) + ' ' + esc(item.unit) + '</span></div></td><td>' + esc(item.expiry) + '</td><td><span class="status-chip ' + statusClass(displayStatus) + '">' + esc(displayStatus) + '</span></td><td><button class="row-arrow" type="button" tabindex="-1" aria-hidden="true">→</button></td></tr>';
        }).join('') || '<tr><td colspan="8">没有找到匹配的试剂记录。</td></tr>';
    }

    function renderCellCultures() {
        if (!els.cellCultureGrid) return;
        const search = valueOf('cellSearch').toLowerCase();
        const items = state.cellCultures.filter(function (culture) {
            return [culture.id, culture.name, culture.species, culture.medium, culture.container, culture.incubator, culture.status].join(' ').toLowerCase().includes(search);
        });
        const today = todayIso();
        const dueCount = state.cellCultures.filter(culture => culture.nextAction && culture.nextAction <= today && culture.status !== '已结束').length;
        const totalVessels = state.cellCultures.reduce((sum, culture) => sum + positiveNumber(culture.vesselCount, 0), 0);
        const highConfluence = state.cellCultures.filter(culture => positiveNumber(culture.confluence, 0) >= 80 && culture.status !== '已结束').length;
        els.cellMaintenanceMetrics.innerHTML = miniMetricsHtml([
            { label: '培养中细胞', value: state.cellCultures.filter(culture => culture.status !== '已结束').length, code: 'LIVE' },
            { label: '今日待操作', value: dueCount, code: 'DUE' },
            { label: '培养容器', value: totalVessels, code: 'VES' },
            { label: '高汇合度', value: highConfluence, code: 'CNF' }
        ]);
        els.cellCultureGrid.innerHTML = items.map(function (culture) {
            const due = culture.nextAction && culture.nextAction <= today && culture.status !== '已结束';
            const status = due ? '待操作' : culture.status;
            const thumb = culture.photoData ? '<img src="' + esc(culture.photoData) + '" alt="' + esc(culture.name) + ' 培养照片">' : '<span>' + esc(culture.name.slice(0, 2).toUpperCase()) + '</span>';
            return '<button class="cell-culture-card' + (due ? ' due' : '') + '" type="button" data-cell-id="' + esc(culture.id) + '">' +
                '<div class="cell-culture-thumb">' + thumb + '</div><div class="cell-culture-main"><div class="cell-culture-top"><span class="micro-label">' + esc(culture.id) + contributorInline(culture) + '</span><span class="status-chip ' + statusClass(status) + '">' + esc(status) + '</span></div>' +
                '<h3>' + esc(culture.name) + '</h3><p>' + esc(culture.species) + ' · P' + esc(culture.passage) + '</p>' +
                '<div class="cell-container-line"><span>容器</span><strong>' + esc(culture.vesselCount) + ' × ' + esc(culture.container) + '</strong></div>' +
                '<div class="cell-confluence"><span><b>汇合度</b><strong>' + esc(culture.confluence) + '%</strong></span><div><i style="width:' + number(culture.confluence, 0, 100) + '%"></i></div></div>' +
                '<footer><span>下次操作 <b>' + esc(culture.nextAction || '待安排') + '</b></span><strong>查看培养记录 →</strong></footer></div></button>';
        }).join('') || '<div class="empty-card cell-empty-card"><strong>尚未登记培养中的细胞</strong><p>点击“登记细胞”记录细胞系、容器、代次与培养条件。</p></div>';

        const queue = state.cellCultures.filter(culture => culture.status !== '已结束').slice().sort(function (a, b) {
            return String(a.nextAction || '9999').localeCompare(String(b.nextAction || '9999'));
        }).slice(0, 6);
        els.cellMaintenanceQueue.innerHTML = queue.map(function (culture) {
            const due = culture.nextAction && culture.nextAction <= today;
            return '<button class="cell-queue-item' + (due ? ' due' : '') + '" type="button" data-cell-id="' + esc(culture.id) + '"><time>' + esc(shortDate(culture.nextAction)) + '</time><span><strong>' + esc(culture.name) + '</strong><small>P' + esc(culture.passage) + ' · ' + esc(culture.container) + '</small></span><b>' + (due ? '!' : '→') + '</b></button>';
        }).join('') || '<p class="search-empty">暂无待处理的培养操作。</p>';
    }

    function openCellDetail(id) {
        const culture = state.cellCultures.find(item => item.id === id);
        if (!culture) return;
        activeCellId = culture.id;
        prepareRecordDetail('cell', culture.id);
        const due = culture.nextAction && culture.nextAction <= todayIso() && culture.status !== '已结束';
        const status = due ? '待操作' : culture.status;
        const photo = culture.photoData ? '<figure class="record-detail-photo"><img src="' + esc(culture.photoData) + '" alt="' + esc(culture.name) + ' 培养照片"><figcaption>当前培养状态照片</figcaption></figure>' : '';
        const nodeField = workspaceMode === 'lab' ? detailFieldHtml('录入节点', contributorName(culture)) : '';
        els.recordDetailKicker.textContent = 'CELL CULTURE RECORD · ' + culture.id;
        els.recordDetailTitle.textContent = culture.name + ' · P' + culture.passage;
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero cell-detail-hero"><div><span class="record-detail-code">' + esc(culture.id) + '</span><h3>' + esc(culture.name) + '</h3><p>' + esc(culture.species) + ' · ' + esc(culture.vesselCount) + ' × ' + esc(culture.container) + '</p></div><span class="status-chip ' + statusClass(status) + '">' + esc(status) + '</span></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">CURRENT CULTURE</p><h3>当前培养信息</h3></div><div class="record-detail-grid">' +
                detailFieldHtml('细胞名称', culture.name, true) + detailFieldHtml('物种 / 来源', culture.species) + detailFieldHtml('当前代次', 'P' + culture.passage) +
                detailFieldHtml('培养基', culture.medium, true) + detailFieldHtml('培养容器', culture.vesselCount + ' × ' + culture.container) + detailFieldHtml('培养位置', culture.incubator, true) +
                detailFieldHtml('当前汇合度', culture.confluence + '%') + detailFieldHtml('下次操作', culture.nextAction) + detailFieldHtml('培养状态', culture.status) + detailFieldHtml('备注', culture.notes, true) + nodeField +
            '</div><div class="detail-stock-meter cell-confluence-meter"><div><i style="width:' + number(culture.confluence, 0, 100) + '%"></i></div><span>汇合度 ' + esc(culture.confluence) + '%</span></div></section>' +
            '<section class="record-detail-section cell-passage-section"><div class="record-detail-section-title passage-title"><div><p class="micro-label">CULTURE HISTORY</p><h3>传代与培养记录</h3></div><button class="button primary" type="button" data-add-passage>＋ 记录传代 / 操作</button></div>' + cellCultureHistoryHtml(culture) + '</section>' + photo + recordHistoryHtml(culture);
        els.recordDetailDialog.showModal();
    }

    function cellCultureHistoryHtml(culture) {
        const history = Array.isArray(culture.history) ? culture.history : [];
        if (!history.length) return '<p class="record-history-empty">暂无培养操作记录。完成第一次传代、换液或观察后，会显示在这里。</p>';
        return '<div class="cell-passage-list">' + history.map(function (entry) {
            const photo = entry.photoData ? '<img src="' + esc(entry.photoData) + '" alt="' + esc(culture.name) + ' ' + esc(entry.action) + '照片">' : '';
            return '<article class="cell-passage-entry"><div class="cell-passage-date"><time>' + esc(entry.date) + '</time><span>' + esc(entry.action) + '</span></div><div class="cell-passage-content"><header><strong>P' + esc(entry.passage) + '</strong><span>' + esc(entry.vesselCount) + ' × ' + esc(entry.container) + '</span></header><dl><div><dt>比例 / 接种</dt><dd>' + esc(entry.ratio || '—') + '</dd></div><div><dt>操作后汇合度</dt><dd>' + esc(entry.confluence) + '%</dd></div><div><dt>培养基</dt><dd>' + esc(entry.medium || '—') + '</dd></div></dl><p>' + esc(entry.notes || '未填写备注') + '</p>' + photo + '</div></article>';
        }).join('') + '</div>';
    }

    function openAnimalDetail(id) {
        const animal = state.mice.find(item => item.id === id);
        if (!animal) return;
        prepareRecordDetail('mouse', animal.id);
        els.recordDetailKicker.textContent = 'ANIMAL RECORD · ' + animal.id;
        els.recordDetailTitle.textContent = animal.id + ' · ' + animal.strain;
        const nodeField = workspaceMode === 'lab' ? detailFieldHtml('录入节点', contributorName(animal)) : '';
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero animal-detail-hero"><div><span class="record-detail-code">' + esc(animal.id) + '</span><h3>' + esc(animal.strain) + '</h3><p>' + esc(animal.genotype) + ' · 笼位 ' + esc(animal.cage) + '</p></div><span class="status-chip ' + statusClass(animal.status) + '">' + esc(animal.status) + '</span></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">IDENTITY & COLONY</p><h3>身份与群体信息</h3></div><div class="record-detail-grid">' +
                detailFieldHtml('动物编号', animal.id) + detailFieldHtml('品系', animal.strain) + detailFieldHtml('基因型', animal.genotype) + detailFieldHtml('性别', animal.sex) +
                detailFieldHtml('出生日期', animal.birth) + detailFieldHtml('当前周龄', animalAgeLabel(animal.birth)) + detailFieldHtml('笼位', animal.cage) + detailFieldHtml('实验状态', animal.status) +
                detailFieldHtml('伦理审批编号', animal.ethics, true) + nodeField +
            '</div></section>' +
            '<section class="record-detail-section animal-track"><div class="record-detail-section-title"><p class="micro-label">LIFECYCLE TRACE</p><h3>动物状态轨迹</h3></div><div class="record-timeline"><article><i></i><div><small>出生登记</small><strong>' + esc(animal.birth) + '</strong></div></article><article><i></i><div><small>当前笼位</small><strong>' + esc(animal.cage) + '</strong></div></article><article class="active"><i></i><div><small>当前阶段</small><strong>' + esc(animal.status) + '</strong></div></article></div></section>' +
            recordHistoryHtml(animal);
        els.recordDetailDialog.showModal();
    }

    function openReagentDetail(catalog) {
        const reagent = state.reagents.find(item => item.catalog === catalog);
        if (!reagent) return;
        prepareRecordDetail('reagent', reagent.catalog);
        const displayStatus = getReagentDisplayStatus(reagent);
        const recordedConsumption = getProtocolConsumption(reagent.catalog);
        const linkedProtocols = state.protocols.filter(protocol => (protocol.reagents || []).some(usage => usage.catalog === reagent.catalog)).length;
        const photo = reagent.photoData ? '<figure class="record-detail-photo"><img src="' + esc(reagent.photoData) + '" alt="' + esc(reagent.name) + ' 录入照片"><figcaption>录入时附加的试剂标签照片</figcaption></figure>' : '';
        const warning = displayStatus === '余量低' ? '<aside class="record-detail-alert"><span>!</span><div><strong>余量低</strong><p>根据已完成日程和实验记录触发低余量提醒，请核对实际库存并考虑补充。</p></div></aside>' : '';
        const nodeField = workspaceMode === 'lab' ? detailFieldHtml('录入节点', contributorName(reagent)) : '';
        els.recordDetailKicker.textContent = 'REAGENT RECORD · ' + reagent.catalog;
        els.recordDetailTitle.textContent = reagent.name;
        els.recordDetailBody.innerHTML =
            '<section class="record-detail-hero reagent-detail-hero"><div><span class="record-detail-code">' + esc(reagent.catalog) + '</span><h3>' + esc(reagent.name) + '</h3><p>' + esc(reagent.category) + ' · LOT ' + esc(reagent.lot) + '</p></div><span class="status-chip ' + statusClass(displayStatus) + '">' + esc(displayStatus) + '</span></section>' +
            warning +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">INVENTORY PROFILE</p><h3>库存详细信息</h3></div><div class="record-detail-grid">' +
                detailFieldHtml('试剂名称', reagent.name, true) + detailFieldHtml('类别', reagent.category) + detailFieldHtml('品牌货号', reagent.catalog) + detailFieldHtml('批次号', reagent.lot) +
                detailFieldHtml('存储位置', reagent.location, true) + detailFieldHtml('当前实际库存', formatQuantity(reagent.currentQty) + ' / ' + formatQuantity(reagent.totalQty) + ' ' + reagent.unit) +
                detailFieldHtml('实际库存比例', formatQuantity(reagent.amount) + '%') + detailFieldHtml('有效期', reagent.expiry) + detailFieldHtml('当前状态', displayStatus) + nodeField +
            '</div><div class="detail-stock-meter"><div><i style="width:' + number(reagent.amount, 0, 100) + '%"></i></div><span>实际库存 ' + formatQuantity(reagent.amount) + '%</span></div></section>' +
            '<section class="record-detail-section"><div class="record-detail-section-title"><p class="micro-label">USAGE TRACE</p><h3>使用关联</h3></div><div class="record-detail-grid compact">' + detailFieldHtml('关联 Protocol', linkedProtocols + ' 项') + detailFieldHtml('已记录实验消耗', formatQuantity(recordedConsumption) + ' ' + reagent.unit) + '</div></section>' + photo + recordHistoryHtml(reagent);
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
            '</div></section>' + photo + recordHistoryHtml(sample);
        els.recordDetailDialog.showModal();
    }

    function prepareRecordDetail(type, key) {
        activeRecordDetail = { type: type, key: key };
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
        return { mouse: '动物', reagent: '试剂', sample: '样本', cell: '细胞培养', result: '实验结果' }[type] || '记录';
    }

    function recordCollection(type) {
        if (type === 'mouse') return state.mice;
        if (type === 'reagent') return state.reagents;
        if (type === 'sample') return state.samples;
        if (type === 'cell') return state.cellCultures;
        if (type === 'result') return state.results;
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

    function deleteActiveRecord() {
        if (denyReadOnlyMutation() || !activeRecordDetail) return;
        const target = activeRecordDetail;
        const collection = recordCollection(target.type);
        const index = collection.findIndex(function (record) { return recordKey(target.type, record) === target.key; });
        if (index < 0) return;
        const record = collection[index];
        const label = record.name || record.id || record.catalog;
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
        appendAuditLog({
            action: 'deleted',
            recordType: target.type,
            recordId: target.key,
            snapshot: clone(record)
        });
        if (target.type === 'sample') {
            const nextSample = state.samples.find(item => item.boxId === activeFreezerBoxId) || state.samples[0];
            selectedSampleId = nextSample ? nextSample.id : '';
        }
        state.activities.unshift({ text: '删除' + recordTypeLabel(target.type) + '记录“' + label + '”并保存操作记录', time: '刚刚' });
        saveState();
        renderAll();
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
            cellCultures: [],
            reagents: [],
            samples: [],
            freezerBoxes: [{
                id: 'FB-LOCAL-001',
                name: '冻存盒 1',
                storageLocation: '位置待设置',
                temperature: '-80°C',
                rows: 9,
                columns: 9,
                lastScanPhoto: '',
                createdBy: 'LOCAL-NODE'
            }],
            schedule: [],
            protocols: [],
            activities: [],
            auditLog: [],
            exampleSeedVersion: 999
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
        localStorage.setItem('rhineLabActiveFreezerBox', activeFreezerBoxId);
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

    function renderSamples() {
        const search = valueOf('sampleSearch').toLowerCase();
        const items = state.samples.filter(item => [item.id, item.type, item.source, item.processing, item.location, item.status].join(' ').toLowerCase().includes(search));
        const activeBox = getActiveFreezerBox();
        const boxSamples = state.samples.filter(item => item.boxId === activeBox.id);
        const positions = new Map(boxSamples.map(item => [item.position || samplePosition(item.location), item]));
        const rows = Array.from({ length: activeBox.rows }, (_, index) => String.fromCharCode(65 + index));

        els.freezerBoxTabs.innerHTML = state.freezerBoxes.map(function (box) {
            const count = state.samples.filter(item => item.boxId === box.id).length;
            return '<button class="freezer-box-tab' + (box.id === activeBox.id ? ' active' : '') + '" type="button" data-freezer-box="' + esc(box.id) + '"><span><strong>' + esc(box.name) + (box.lastScanPhoto ? ' <em>已扫描</em>' : '') + '</strong><small>' + esc(box.storageLocation) + contributorInline(box) + '</small></span><b>' + count + ' / ' + (box.rows * box.columns) + '</b></button>';
        }).join('');
        els.freezerBoxTitle.textContent = '冻存盒 ' + activeBox.name;
        els.freezerBoxTemperature.textContent = 'FREEZER MAP · ' + activeBox.temperature;
        els.freezerBoxLocation.textContent = activeBox.storageLocation + (activeBox.lastScanPhoto ? ' · 最近已完成照片识别' : '') + ' · 点击空位可登记';

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
        matrix.style.gridTemplateColumns = 'repeat(' + activeBox.columns + ', minmax(24px, 1fr))';
        matrix.innerHTML = matrixHtml;

        const selected = boxSamples.find(item => item.id === selectedSampleId) || boxSamples[0];
        selectedSampleId = selected ? selected.id : '';
        const detail = document.getElementById('sampleDetail');
        if (selected) {
            const photo = selected.photoData ? '<img class="sample-record-photo" src="' + selected.photoData + '" alt="' + esc(selected.id) + ' 的录入照片">' : '<div class="sample-vial" data-code="' + esc(selected.id) + '"></div>';
            detail.innerHTML = '<p class="micro-label">SELECTED SAMPLE' + contributorInline(selected) + '</p>' + photo + '<h2>' + esc(selected.type) + '</h2><p>' + esc(selected.id) + ' · ' + esc(selected.status) + '</p><dl class="detail-list"><div><dt>样本来源</dt><dd>' + esc(selected.source) + '</dd></div><div><dt>处理方式</dt><dd>' + esc(selected.processing) + '</dd></div><div><dt>冻存盒位置</dt><dd>' + esc(selected.location) + '</dd></div><div><dt>设备 / 层架</dt><dd>' + esc(activeBox.storageLocation) + '</dd></div><div><dt>入库日期</dt><dd>' + esc(selected.date) + '</dd></div></dl><button class="sample-detail-open" type="button" data-open-sample-detail><span>查看详情、修改与记录</span><b>→</b></button>';
        } else {
            detail.innerHTML = '<p class="search-empty">这个冻存盒尚未登记样本。可点击左侧空位或使用拍照识别。</p>';
        }

        document.getElementById('sampleTable').innerHTML = items.map(function (item) {
            return '<tr class="clickable-data-row" data-sample-id="' + esc(item.id) + '" tabindex="0" aria-label="查看样本 ' + esc(item.id) + ' 的详细信息"><td><strong>' + esc(item.id) + '</strong>' + (workspaceMode === 'lab' ? '<small>录入 ' + esc(contributorName(item)) + '</small>' : '') + '</td><td>' + esc(item.type) + '</td><td>' + esc(item.source) + '</td><td>' + esc(item.processing) + '</td><td>' + esc(item.location) + '</td><td>' + esc(item.date) + '</td><td><span class="status-chip ' + statusClass(item.status) + '">' + esc(item.status) + '</span></td></tr>';
        }).join('') || '<tr><td colspan="7">没有找到匹配的样本记录。</td></tr>';
    }

    function renderProtocols() {
        document.getElementById('protocolCount').textContent = state.protocols.length;
        document.getElementById('protocolGrid').innerHTML = state.protocols.map(function (item) {
            const usageLabel = item.reagents.length ? item.reagents.length + ' 种试剂已关联' : '未关联库存试剂';
            return '<button class="protocol-card" type="button" data-protocol-id="' + esc(item.id) + '"><span class="protocol-number">' + esc(item.number) + (item.photoData ? ' · 附照片' : '') + contributorInline(item) + '</span><h2>' + esc(item.title) + '</h2><p>' + esc(item.summary) + '</p><div class="protocol-path-preview" aria-label="从准备到归档，共 ' + item.steps.length + ' 个步骤"><span>准备</span><i></i><span>执行</span><i></i><span>质控</span><i></i><span>归档</span><b>' + item.steps.length + ' 步</b></div><footer class="protocol-foot"><span>' + esc(item.tag) + ' · ' + esc(item.meta) + '</span><strong>' + esc(usageLabel) + ' →</strong></footer></button>';
        }).join('') || '<div class="empty-card">还没有 Protocol，点击“录入 Protocol”开始建立方案库。</div>';
    }

    function renderSchedule() {
        const selectedIso = toIsoDate(calendarDate);
        const dayTasks = state.schedule.filter(item => item.date === selectedIso).sort(byTime);
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
        const overlapLayout = calculateScheduleOverlap(dayTasks);
        for (let index = 0; index < slotCount; index += 1) {
            const time = minutesToTime(startMinutes + index * 30);
            const label = index % 2 === 0 ? time : '';
            gridHtml += '<time class="calendar-time-label" style="grid-row:' + (index + 1) + '">' + label + '</time><button class="calendar-time-slot" type="button" style="grid-row:' + (index + 1) + '" data-calendar-slot="' + index + '" data-time="' + time + '" aria-label="' + time + ' 开始的空白时间段"></button>';
        }
        dayTasks.forEach(function (item) {
            const start = Math.max(0, Math.min(slotCount - 1, Math.floor((timeToMinutes(item.time) - startMinutes) / 30)));
            const end = Math.max(start + 1, Math.min(slotCount, Math.ceil((timeToMinutes(item.end) - startMinutes) / 30)));
            const span = Math.max(1, end - start);
            const protocol = state.protocols.find(entry => entry.id === item.protocolId);
            const placement = overlapLayout.get(item.id) || { index: 0, count: 1 };
            const left = placement.index / placement.count * 100;
            const width = 100 / placement.count;
            const runButton = scheduleRunButtonHtml(item, protocol, true);
            gridHtml += '<article class="schedule-block ' + esc(item.type) + (item.done ? ' done' : '') + '" style="grid-row:' + (start + 1) + ' / span ' + span + ';--event-left:' + left.toFixed(4) + '%;--event-width:' + width.toFixed(4) + '%" data-overlap-count="' + placement.count + '"><div class="schedule-block-copy"><strong>' + esc(item.title) + '</strong><small>' + esc(item.time) + '–' + esc(item.end) + ' · ' + esc(protocol ? protocol.title : item.resource) + contributorInline(item) + '</small></div><div class="schedule-block-actions">' + runButton + '<button class="schedule-check-button" type="button" data-task-check="' + esc(item.id) + '" aria-label="' + (item.done ? '标记为未完成' : '标记为完成') + '" title="' + (item.done ? '取消完成' : '标记完成') + '">' + (item.done ? '✓' : '○') + '</button></div></article>';
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
                return '<span class="month-task ' + esc(task.type) + (task.done ? ' done' : '') + '"><i></i>' + esc(task.time) + ' ' + esc(task.title) + '</span>';
            }).join('');
            const more = tasks.length > 3 ? '<small>+' + (tasks.length - 3) + ' 项</small>' : '';
            html += '<button class="' + classes.join(' ') + '" type="button" data-calendar-date="' + iso + '"><time>' + date.getDate() + '</time><div>' + chips + more + '</div></button>';
        }
        els.monthCalendarGrid.innerHTML = html;

        const selectedTasks = state.schedule.filter(item => item.date === selectedIso).sort(byTime);
        els.monthAgendaTitle.textContent = formatShortDate(calendarDate) + ' · ' + selectedTasks.length + ' 项日程';
        els.monthAgendaList.innerHTML = selectedTasks.map(scheduleItemHtml).join('') || '<p class="month-empty">这一天还没有安排。</p>';
    }

    function miniMetricsHtml(metrics) {
        return metrics.map(function (item) {
            return '<article class="mini-metric"><div><small>' + esc(item.label) + '</small><strong>' + item.value + '</strong></div><i>' + esc(item.code) + '</i></article>';
        }).join('');
    }

    function scheduleItemHtml(item) {
        const protocol = state.protocols.find(entry => entry.id === item.protocolId);
        return '<article class="today-item ' + (item.done ? 'done' : '') + '"><time>' + esc(item.time) + '</time><i class="task-marker ' + esc(item.type) + '"></i><div><strong>' + esc(item.title) + '</strong><small>' + esc(item.resource) + contributorInline(item) + '</small></div><div class="today-item-actions">' + scheduleRunButtonHtml(item, protocol, false) + '<button class="task-check" type="button" data-task-check="' + esc(item.id) + '" aria-label="' + (item.done ? '标记为未完成' : '标记为完成') + '" title="' + (item.done ? '取消完成' : '标记完成') + '"></button></div></article>';
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
        if (event.target.closest('[data-task-check], [data-start-scheduled-experiment]') || event.button !== 0 || calendarMode !== 'day') return;
        const slotIndex = scheduleSlotIndexFromPointer(event);
        if (slotIndex < 0) return;
        event.preventDefault();
        scheduleDrag = { startIndex: slotIndex, currentIndex: slotIndex };
        document.getElementById('dayTimeline').classList.add('dragging');
        highlightScheduleDrag();
    }

    function updateScheduleDrag(event) {
        if (!scheduleDrag) return;
        const slotIndex = scheduleSlotIndexFromPointer(event);
        if (slotIndex < 0) return;
        scheduleDrag.currentIndex = slotIndex;
        highlightScheduleDrag();
    }

    function finishScheduleDrag() {
        if (!scheduleDrag) return;
        const first = Math.min(scheduleDrag.startIndex, scheduleDrag.currentIndex);
        const last = Math.max(scheduleDrag.startIndex, scheduleDrag.currentIndex);
        const start = minutesToTime(8 * 60 + first * 30);
        const end = minutesToTime(8 * 60 + (last + 1) * 30);
        pendingTaskDefaults = { date: toIsoDate(calendarDate), time: start, end: end };
        scheduleDrag = null;
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

    function openProtocolDetail(id) {
        const protocol = state.protocols.find(item => item.id === id);
        if (!protocol) return;
        activeProtocolId = protocol.id;
        const linked = state.schedule.filter(item => item.protocolId === protocol.id);
        const completed = linked.filter(item => item.done);
        const reagentRows = protocol.reagents.map(function (usage) {
            const reagent = state.reagents.find(item => item.catalog === usage.catalog);
            if (!reagent) return '<tr><td>' + esc(usage.catalog) + '</td><td>' + formatQuantity(usage.amount) + ' / 次</td><td>库存未登记</td></tr>';
            return '<tr><td><strong>' + esc(reagent.name) + '</strong><small>' + esc(reagent.catalog) + '</small></td><td>' + formatQuantity(usage.amount) + ' ' + esc(reagent.unit) + ' / 次</td><td>' + formatQuantity(getTheoreticalRemaining(reagent)) + ' ' + esc(reagent.unit) + '</td></tr>';
        }).join('');
        els.protocolDetailNumber.textContent = protocol.number + ' · ' + protocol.tag + (workspaceMode === 'lab' ? ' · 录入 ' + contributorName(protocol) : '');
        els.protocolDetailTitle.textContent = protocol.title;
        els.protocolDetailBody.innerHTML = '<p class="protocol-detail-summary">' + esc(protocol.summary) + '</p><section><p class="micro-label">PROCEDURE MAP</p><h3>实验流程图</h3>' + protocolFlowHtml(protocol.steps) + '</section><section><p class="micro-label">REAGENT CONSUMPTION / RUN</p><h3>单次试剂理论用量</h3>' + (reagentRows ? '<div class="protocol-usage-table"><table><thead><tr><th>试剂</th><th>每次用量</th><th>当前理论余量</th></tr></thead><tbody>' + reagentRows + '</tbody></table></div>' : '<p class="protocol-no-reagent">此 Protocol 尚未关联库存试剂。</p>') + '</section>';
        els.protocolDetailUsage.textContent = '已关联 ' + linked.length + ' 项日程 · 已完成 ' + completed.length + ' 次';
        els.protocolDetailDialog.showModal();
    }

    function protocolFlowHtml(steps) {
        const items = Array.isArray(steps) ? steps.filter(Boolean) : [];
        if (!items.length) return '<p class="protocol-no-reagent">此 Protocol 尚未录入实验步骤。</p>';

        const phaseCount = items.length === 1 ? 1 : Math.min(6, Math.max(2, Math.ceil(items.length / 3)));
        const phaseNames = {
            1: [['执行与记录', 'PROCEDURE']],
            2: [['准备与核对', 'PREPARE'], ['结果与收尾', 'FINISH']],
            3: [['准备与核对', 'PREPARE'], ['关键操作', 'PROCESS'], ['结果与收尾', 'FINISH']],
            4: [['准备与核对', 'PREPARE'], ['样本处理', 'TREAT'], ['关键操作', 'PROCESS'], ['结果与收尾', 'FINISH']],
            5: [['准备与核对', 'PREPARE'], ['样本处理', 'TREAT'], ['关键操作', 'PROCESS'], ['反应与观察', 'OBSERVE'], ['结果与收尾', 'FINISH']],
            6: [['准备与核对', 'PREPARE'], ['样本处理', 'TREAT'], ['关键操作', 'PROCESS'], ['反应与观察', 'OBSERVE'], ['采集与质控', 'QUALITY'], ['结果与收尾', 'FINISH']]
        };
        const labels = phaseNames[phaseCount];
        const baseSize = Math.floor(items.length / phaseCount);
        const remainder = items.length % phaseCount;
        let cursor = 0;

        return '<div class="protocol-flow-map">' + labels.map(function (label, phaseIndex) {
            const phaseSize = baseSize + (phaseIndex < remainder ? 1 : 0);
            const phaseSteps = items.slice(cursor, cursor + phaseSize);
            cursor += phaseSize;
            return '<section class="protocol-flow-phase"><header><span class="flow-phase-dot" aria-hidden="true"></span><div><strong>' + label[0] + '</strong><small>' + label[1] + '</small></div></header><div class="protocol-flow-steps">' + phaseSteps.map(function (step) {
                return '<article class="protocol-flow-node"><i aria-hidden="true"></i><p>' + esc(step) + '</p></article>';
            }).join('') + '</div></section>';
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
        updateExperimentUsageSource();
        updateExperimentUsageImpact();
        els.experimentDetailDialog.showModal();
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
        els.experimentUsageRows.innerHTML = (usages || []).map(experimentReagentRowHtml).join('') || '<p class="experiment-usage-empty">当前没有试剂用量，点击下方按钮添加。</p>';
    }

    function experimentReagentRowHtml(usage) {
        const selectedCatalog = usage && usage.catalog ? usage.catalog : (state.reagents[0] ? state.reagents[0].catalog : '');
        const amount = usage && usage.amount != null ? usage.amount : 1;
        const options = state.reagents.map(function (reagent) {
            return '<option value="' + esc(reagent.catalog) + '"' + (reagent.catalog === selectedCatalog ? ' selected' : '') + '>' + esc(reagent.name) + ' · ' + esc(reagent.catalog) + ' · ' + esc(reagent.unit) + '</option>';
        }).join('');
        return '<div class="experiment-reagent-row"><select name="actualReagentCatalog" aria-label="本次使用试剂">' + options + '</select><input name="actualReagentAmount" type="number" min="0.001" step="0.001" value="' + esc(amount) + '" aria-label="本次实际用量"><span>库存单位</span><button type="button" data-remove-experiment-reagent aria-label="移除本次试剂">×</button></div>';
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

    function updateExperimentUsageImpact() {
        const completed = els.experimentDetailStatus.value === '已完成';
        els.experimentUsageImpact.textContent = completed ? '保存后将立即按本次用量更新试剂余量' : '未完成的记录不会计入库存消耗';
        els.experimentUsageImpact.classList.toggle('will-consume', completed);
    }

    function saveExperimentDetail(event) {
        event.preventDefault();
        if (denyReadOnlyMutation()) return;
        const experiment = state.experiments.find(item => item.id === activeExperimentId);
        if (!experiment) return;
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
        state.activities.unshift({ text: '更新实验“' + experiment.title + '”的本次试剂用量', time: '刚刚' });
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
                angleMode: calculator.angleMode === 'rad' ? 'rad' : 'deg'
            },
            apparatus: {
                type: apparatusDefinitions[apparatus.type] ? apparatus.type : '',
                marks: apparatus.marks && typeof apparatus.marks === 'object' ? Object.assign({}, apparatus.marks) : {}
            }
        };
    }

    function defaultRunStepState(stepText) {
        return normalizeRunStepState({ apparatus: { type: recommendedApparatus(stepText), marks: {} } });
    }

    function recommendedApparatus(stepText) {
        const text = String(stepText || '');
        if (/凝胶|电泳|gel/i.test(text)) return 'gel';
        if (/切片|封片|载玻片|成像|脑片|slide/i.test(text)) return 'slides';
        if (/离心|冻存管|耳样|样本管|tube/i.test(text)) return 'tubeRack';
        if (/PCR|qPCR|反应体系|染色|培养|接种|细胞|抗体|孵育|plate/i.test(text)) return 'plate96';
        return 'custom';
    }

    function ensureRunSession(experiment, protocol) {
        const existing = experiment.runSession && typeof experiment.runSession === 'object' ? experiment.runSession : normalizeRunSession(experiment.runSession);
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
                description: '由 ' + task.date + ' ' + task.time + ' 的日程启动。',
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
        state.activities.unshift({ text: (created ? '从日程创建并开始实验“' : '从日程继续实验“') + experiment.title + '”', time: '刚刚' });
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
            '<section class="run-step-workspace"><header class="run-current-step"><div><span>STEP ' + String(context.stepIndex + 1).padStart(2, '0') + ' / ' + String(steps.length).padStart(2, '0') + '</span><h3>' + esc(stepText) + '</h3><p>步骤来自 ' + esc(context.protocol.id) + '，笔记与工具状态会自动保存在本次实验中。</p></div><b class="' + (stepState.done ? 'done' : '') + '">' + (stepState.done ? '已完成' : '执行中') + '</b></header>' +
            '<label class="run-step-notes"><span>步骤记录与观察</span><textarea data-run-notes placeholder="记录操作参数、异常现象或样本变化…">' + esc(stepState.notes) + '</textarea></label>' +
            runStepPhotoHtml(stepState) +
            '<div class="run-tool-grid">' +
                '<section class="run-tool-card timer-tool"><header><div><p class="micro-label">STEP TIMER</p><h4>步骤计时器</h4></div><span class="tool-status-dot' + (stepState.timer.running ? ' active' : '') + '"></span></header><strong class="run-timer-display" id="runTimerDisplay">' + timerValue + '</strong><div class="run-tool-actions"><button type="button" data-run-timer="start">开始</button><button type="button" data-run-timer="pause">暂停</button><button type="button" data-run-timer="reset">复位</button></div><p>切换步骤或关闭窗口后，计时仍会按保存的时间继续。</p></section>' +
                scientificCalculatorHtml(stepState) +
                '<section class="run-tool-card apparatus-tool"><header><div><p class="micro-label">APPARATUS ANNOTATION</p><h4>装置标注</h4></div><select data-apparatus-type aria-label="装置类型">' + apparatusOptions + '</select></header><div class="apparatus-legend"><span><i class="sample"></i>样本</span><span><i class="control"></i>对照</span><span><i class="blank"></i>空白</span><button type="button" data-clear-apparatus>清空标注</button></div>' + apparatusGridHtml(apparatus, stepState.apparatus.marks) + '<p>点击孔位循环标记“样本 → 对照 → 空白”；装置建议根据当前步骤自动选择，也可手动更改。</p></section>' +
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
            return '<figure><img src="' + esc(photo.data) + '" alt="实验步骤照片 ' + (index + 1) + '"><button type="button" data-remove-run-photo="' + esc(photo.id) + '" aria-label="删除步骤照片">×</button><figcaption>步骤照片 ' + (index + 1) + (photo.addedAt ? ' · ' + esc(formatHistoryTime(photo.addedAt)) : '') + '</figcaption></figure>';
        }).join('');
        return '<section class="run-step-photos"><header><div><p class="micro-label">STEP IMAGES</p><h4>步骤照片记录</h4></div><label class="run-photo-add" for="runStepPhotoInput"><input id="runStepPhotoInput" type="file" accept="image/*" capture="environment" multiple data-run-photo-input><span>＋ 拍照 / 选择图片</span></label></header><div class="run-step-photo-grid">' + (items || '<p>尚未保存本步骤的照片。</p>') + '</div><small>每个步骤最多保存 6 张压缩照片；切换步骤后仍会保留。</small></section>';
    }

    function scientificCalculatorHtml(stepState) {
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
        return '<section class="run-tool-card calculator-tool scientific-calculator"><header><div><p class="micro-label">SCIENTIFIC CALCULATION</p><h4>科学计算器</h4></div><select data-calc-angle aria-label="角度模式"><option value="deg"' + (stepState.calculator.angleMode === 'deg' ? ' selected' : '') + '>DEG</option><option value="rad"' + (stepState.calculator.angleMode === 'rad' ? ' selected' : '') + '>RAD</option></select></header><label><span>计算式</span><input data-run-expression type="text" value="' + esc(stepState.calculator.expression) + '" placeholder="例如：sin(30) + sqrt(16)"></label><div class="scientific-keypad">' + buttons + '<button class="key-action" type="button" data-calc-action="backspace">⌫</button><button class="key-action danger" type="button" data-calc-action="clear">C</button></div><div class="calculator-result-row"><button type="button" data-run-calculate>计算结果</button><output id="runCalculatorResult">' + esc(stepState.calculator.result || '等待输入') + '</output></div><p>支持三角函数、对数、平方根、指数、幂、阶乘、π 与角度模式，适合浓度和配液换算。</p></section>';
    }

    function apparatusGridHtml(definition, marks) {
        let cells = '';
        for (let rowIndex = 0; rowIndex < definition.rows; rowIndex += 1) {
            for (let column = 1; column <= definition.columns; column += 1) {
                const label = String.fromCharCode(65 + rowIndex) + column;
                const mark = marks[label] || '';
                cells += '<button class="apparatus-cell ' + definition.shape + (mark ? ' ' + mark : '') + '" type="button" data-apparatus-cell="' + label + '" aria-label="' + label + (mark ? ' · ' + apparatusMarkLabel(mark) : ' · 未标注') + '"><span>' + label + '</span></button>';
            }
        }
        return '<div class="apparatus-grid ' + definition.shape + '" style="grid-template-columns:repeat(' + definition.columns + ',minmax(22px,1fr))">' + cells + '</div>';
    }

    function apparatusMarkLabel(mark) {
        return interfaceText({ sample: '样本', control: '对照', blank: '空白' }[mark] || '未标注');
    }

    function persistRunWorkspaceInputs() {
        const context = currentRunContext();
        if (!context || !els.experimentRunDialog.open) return;
        const notes = els.experimentRunBody.querySelector('[data-run-notes]');
        const expression = els.experimentRunBody.querySelector('[data-run-expression]');
        if (notes) context.stepState.notes = notes.value;
        if (expression) context.stepState.calculator.expression = expression.value;
        window.clearTimeout(runInputSaveTimer);
        saveState();
    }

    function handleRunWorkspaceInput(event) {
        const context = currentRunContext();
        if (!context) return;
        if (event.target.matches('[data-run-notes]')) context.stepState.notes = event.target.value;
        if (event.target.matches('[data-run-expression]')) context.stepState.calculator.expression = event.target.value;
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
        if (event.target.matches('[data-apparatus-type]')) {
            context.stepState.apparatus = { type: event.target.value, marks: {} };
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
        if (!context || !input) return;
        try {
            const result = evaluateArithmeticExpression(input.value, context.stepState.calculator.angleMode);
            context.stepState.calculator.expression = input.value;
            context.stepState.calculator.result = formatQuantity(result);
            saveState();
            document.getElementById('runCalculatorResult').textContent = context.stepState.calculator.result;
        } catch (error) {
            context.stepState.calculator.result = '表达式有误';
            document.getElementById('runCalculatorResult').textContent = '表达式有误，请检查括号与运算符';
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
        state.activities.unshift({ text: '完成实验“' + context.experiment.title + '”并归档执行步骤', time: '刚刚' });
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
    if (getTheoreticalPercent(reagent) < 25) return '余量低';
    return reagent.status;
}

    function getActiveFreezerBox() {
        return state.freezerBoxes.find(box => box.id === activeFreezerBoxId) || state.freezerBoxes[0];
    }

    function selectFreezerBox(id) {
        const box = state.freezerBoxes.find(item => item.id === id);
        if (!box) return;
        activeFreezerBoxId = box.id;
        localStorage.setItem('rhineLabActiveFreezerBox', box.id);
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

    function renderSearchResults(query) {
        const term = query.trim().toLowerCase();
        const entries = [];
        state.experiments.forEach(item => entries.push({ view: 'experiments', category: 'EXPERIMENT', title: item.title, detail: item.id + ' · ' + item.project, search: Object.values(item).join(' ') }));
        state.results.forEach(function (item) {
            const experiment = state.experiments.find(record => record.id === item.experimentId);
            entries.push({ view: 'results', category: 'RESULT', title: experiment ? experiment.title : item.id, detail: item.date + ' · ' + item.attachments.length + ' 个附件', search: [item.id, item.experimentId, item.summary, item.conclusion, item.nextStep, experiment && experiment.title].join(' ') });
        });
        state.mice.forEach(item => entries.push({ view: 'mice', category: 'ANIMAL', title: item.id + ' · ' + item.strain, detail: item.genotype + ' · 笼位 ' + item.cage, search: Object.values(item).join(' ') }));
        state.reagents.forEach(item => entries.push({ view: 'reagents', category: 'REAGENT', title: item.name, detail: item.catalog + ' · ' + item.location, search: Object.values(item).join(' ') }));
        state.samples.forEach(item => entries.push({ view: 'samples', category: 'SAMPLE', title: item.id + ' · ' + item.type, detail: item.source + ' · ' + item.location, search: Object.values(item).join(' ') }));
        state.protocols.forEach(item => entries.push({ view: 'protocols', category: 'PROTOCOL', title: item.title, detail: item.number + ' · ' + item.tag, search: [item.number, item.title, item.summary, item.tag, item.steps.join(' ')].join(' ') }));
        state.cellCultures.forEach(item => entries.push({ view: 'cells', category: 'CELL CULTURE', title: item.name + ' · P' + item.passage, detail: item.container + ' · ' + item.incubator, search: [item.id, item.name, item.species, item.medium, item.container, item.incubator, item.status].join(' ') }));
        const results = entries.filter(item => !term || item.search.toLowerCase().includes(term)).slice(0, 12);
        els.searchResults.innerHTML = results.map(function (item) {
            return '<button class="search-result" type="button" data-result-view="' + item.view + '" data-result-title="' + esc(item.title) + '"><span>' + esc(item.category) + '</span><span><strong>' + esc(item.title) + '</strong><small>' + esc(item.detail) + '</small></span><b>→</b></button>';
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
            kicker: 'ANIMAL REGISTRATION', title: '登记实验动物',
            fields: [
                field('id', '动物编号', 'text', 'M-24119', true),
                field('strain', '品系', 'text', 'C57BL/6J', true),
                field('genotype', '基因型', 'text', 'WT', true),
                field('sex', '性别', 'select', ['雄', '雌', '待确认'], true),
                field('birth', '出生日期', 'date', '', true),
                field('cage', '笼位', 'text', 'C-03', true),
                field('status', '实验状态', 'select', ['待分配', '观察期', '繁育中', '实验中'], true),
                field('ethics', '伦理审批编号', 'text', 'ZJU2026-017', true)
            ]
        },
        reagent: {
            kicker: 'INVENTORY INTAKE', title: '录入新试剂',
            fields: [
                field('name', '试剂名称', 'text', '例：Anti-NeuN antibody', true),
                field('category', '试剂类别', 'select', ['抗体', '培养基', '化学试剂', '染料', '酶'], true),
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
                field('status', '当前状态', 'select', ['在库', '质控中', '剩余少'], true),
                field('photoData', '样本照片', 'photo-capture', '拍摄冻存管标签或样本外观', false, true)
            ]
        },
        cell: {
            kicker: 'CELL CULTURE REGISTRATION', title: '登记培养细胞',
            fields: [
                field('id', '培养记录编号', 'text', 'CELL-BV2-01', true),
                field('name', '细胞名称 / 细胞系', 'text', '例：BV2', true),
                field('species', '物种 / 来源', 'text', '例：Mus musculus', true),
                field('status', '培养状态', 'select', ['培养中', '待传代', '分化中', '冻存', '观察中', '已结束'], true),
                field('medium', '当前培养基', 'text', '例：DMEM + 10% FBS', true, true),
                field('container', '培养容器', 'select', ['T25 培养瓶', 'T75 培养瓶', 'T175 培养瓶', '6 孔板', '12 孔板', '24 孔板', '96 孔板', '10 cm 培养皿', '15 cm 培养皿', '低吸附 6 孔板', '悬浮培养瓶', '其他'], true),
                field('vesselCount', '容器数量', 'number', '1', true),
                field('incubator', '培养位置与条件', 'text', '37°C / 5% CO₂ · INC-01 / A2', true, true),
                field('passage', '当前代次', 'number', '1', true),
                field('confluence', '当前汇合度（%）', 'number', '50', true),
                field('nextAction', '下次操作日期', 'date', '', true),
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
                field('container', '操作后容器', 'select', ['T25 培养瓶', 'T75 培养瓶', 'T175 培养瓶', '6 孔板', '12 孔板', '24 孔板', '96 孔板', '10 cm 培养皿', '15 cm 培养皿', '低吸附 6 孔板', '悬浮培养瓶', '其他'], true),
                field('vesselCount', '操作后容器数量', 'number', '1', true),
                field('confluence', '操作后汇合度（%）', 'number', '25', true),
                field('medium', '培养基', 'text', '例：DMEM + 10% FBS', true, true),
                field('nextAction', '下次操作日期', 'date', '', true),
                field('notes', '操作记录与观察', 'textarea', '记录消化时间、细胞状态、接种密度和异常情况…', false, true),
                field('photoData', '本次操作照片', 'photo-capture', '拍摄传代前后显微视野或培养容器', false, true)
            ]
        },
        task: {
            kicker: 'SCHEDULE ENTRY', title: '添加实验日程',
            fields: [
                field('date', '日期', 'date', '', true),
                field('time', '开始时间', 'time', '09:00', true),
                field('end', '结束时间', 'time', '10:00', true),
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
                field('tag', '方案分类', 'text', '例：组织学', true),
                field('summary', '方案说明', 'textarea', '说明用途、关键条件和注意事项…', true, true),
                field('stepsText', '实验步骤（每行一步）', 'textarea', '样本固定\n通透与封闭\n一抗孵育\n二抗染色', true, true),
                field('reagents', '每次执行的试剂用量', 'reagent-list', '', false, true),
                field('photoData', '方案照片辅助录入', 'photo-capture', '拍摄纸质 SOP 或实验本页面作为附件', false, true)
            ]
        },
        freezer: {
            kicker: 'FREEZER BOX REGISTRATION', title: '新增冻存盒',
            fields: [
                field('name', '冻存盒名称', 'text', '例：FZ-03 / C2', true),
                field('storageLocation', '设备 / 层架位置', 'text', '例：-80°C 冰箱 FZ-03 · 第 3 层 · C 位', true),
                field('temperature', '存储条件', 'select', ['-80°C', '-20°C', '液氮', '4°C'], true),
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
        } else if (type === 'result') {
            const preferred = state.experiments.find(item => item.id === pendingResultExperimentId) || state.experiments.find(function (experiment) {
                return !state.results.some(result => result.experimentId === experiment.id);
            });
            defaultsForEntry = { experimentId: preferred ? preferred.id : '', date: preferred ? preferred.date : todayIso() };
        } else if (type === 'task') {
            defaultsForEntry = Object.assign({ date: toIsoDate(calendarDate), time: '09:00', end: '10:00', experimentId: '', protocolId: '' }, pendingTaskDefaults || {});
        } else if (type === 'sample') {
            defaultsForEntry = Object.assign({ boxId: activeFreezerBoxId, date: todayIso(), status: '在库' }, pendingSampleDefaults || {});
        } else if (type === 'freezer') {
            defaultsForEntry = { rows: '9', columns: '9', temperature: '-80°C' };
        } else if (type === 'cell') {
            defaultsForEntry = { status: '培养中', vesselCount: 1, passage: 1, confluence: 50, nextAction: todayIso() };
        } else if (type === 'passage') {
            const culture = state.cellCultures.find(item => item.id === activeCellId);
            if (!culture) return;
            defaultsForEntry = {
                date: todayIso(),
                action: '传代',
                passage: Math.max(0, positiveNumber(culture.passage, 0) + 1),
                ratio: '1:3',
                container: culture.container,
                vesselCount: culture.vesselCount,
                confluence: 25,
                medium: culture.medium,
                nextAction: toIsoDate(addDays(parseLocalDate(todayIso()), 2))
            };
        }
        pendingPhotoData = editOptions && editOptions.record.photoData ? editOptions.record.photoData : '';
        pendingResultAttachments = type === 'result' && editOptions ? clone(editOptions.record.attachments || []) : [];
        activeDialogType = type;
        els.dialogKicker.textContent = editOptions ? 'EDITABLE DATABASE RECORD' : schema.kicker;
        els.dialogTitle.textContent = editOptions ? '编辑' + recordTypeLabel(type) + '信息' : schema.title;
        els.entrySubmitButton.textContent = editOptions ? '保存修改' : '确认保存';
        els.dialogFields.innerHTML = schema.fields.map(fieldHtml).join('');
        if (type === 'result') renderPendingResultAttachments();
        if (type === 'task') {
            els.dialogFields.insertAdjacentHTML('afterbegin', '<aside class="schedule-overlap-note"><span>↔</span><div><strong>支持重叠日程</strong><p>同一时间可以安排多个事件；每日视图会自动并排显示。</p></div></aside>');
        }
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
            if (pendingPhotoData) {
                const capture = els.dialogFields.querySelector('.photo-capture');
                if (capture) {
                    const hidden = capture.querySelector('input[type="hidden"]');
                    const preview = capture.querySelector('[data-photo-preview]');
                    const status = capture.querySelector('[data-photo-status]');
                    if (hidden) hidden.value = pendingPhotoData;
                    if (preview) preview.innerHTML = '<img src="' + esc(pendingPhotoData) + '" alt="当前记录照片"><button type="button" data-clear-photo aria-label="移除照片">×</button>';
                    if (status) status.textContent = '当前记录已有照片；可重新拍摄或移除';
                }
            }
        }
        pendingTaskDefaults = null;
        pendingSampleDefaults = null;
        els.entryDialog.showModal();
        const first = els.dialogFields.querySelector('input, select, textarea');
        if (first) first.focus();
    }

    function fieldHtml(config) {
        const className = 'form-field' + (config.full ? ' full' : '');
        const required = config.required ? ' required' : '';
        let control = '';
        if (config.type === 'select') {
            const options = config.placeholderOrOptions.map(function (option) {
                const parts = String(option).split('|');
                return '<option value="' + esc(parts[0]) + '">' + esc(parts[1] || parts[0]) + '</option>';
            }).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '" data-custom-select' + required + '>' + options + '<option value="__custom__">自定义…</option></select><input class="custom-select-input" name="' + config.name + 'Custom" type="text" data-custom-input-for="' + config.name + '" placeholder="输入自定义内容" hidden>';
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
        } else if (config.type === 'freezer-select') {
            const options = state.freezerBoxes.map(function (box) {
                return '<option value="' + esc(box.id) + '">' + esc(box.name) + ' · ' + esc(box.storageLocation) + '</option>';
            }).join('');
            control = '<select id="field-' + config.name + '" name="' + config.name + '"' + required + '>' + options + '</select>';
        } else if (config.type === 'reagent-list') {
            control = '<div class="protocol-reagent-editor" id="field-' + config.name + '"><div id="protocolReagentRows">' + reagentUsageRowHtml() + '</div><button class="add-reagent-row" type="button" data-add-reagent-row>＋ 添加试剂</button><p>用量单位自动采用试剂库存中登记的单位。</p></div>';
        } else if (config.type === 'photo-capture') {
            control = '<div class="photo-capture" id="field-' + config.name + '"><input class="photo-capture-input" id="photo-input-' + config.name + '" type="file" accept="image/*" capture="environment" data-photo-capture><input type="hidden" name="' + config.name + '" value=""><label class="photo-capture-button" for="photo-input-' + config.name + '"><span>⌑</span><strong>拍照或选择图片</strong><small>' + esc(config.placeholderOrOptions) + '</small></label><div class="photo-capture-preview" data-photo-preview><span>尚未选择照片</span></div><p class="photo-capture-status" data-photo-status>照片只在当前设备中压缩保存</p></div>';
        } else if (config.type === 'file-attachments') {
            control = '<div class="result-attachment-editor" id="field-' + config.name + '"><input id="resultAttachmentInput" type="file" accept="image/*,.pdf,.csv,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx" multiple data-result-attachments><label class="result-attachment-upload" for="resultAttachmentInput"><span>＋</span><strong>上传照片或文件</strong><small>选择图片、PDF、表格或文档</small></label><div class="pending-result-attachments" id="pendingResultAttachments"></div><p class="field-note">图片会压缩保存；其他文件单个不超过 1 MB，最多 6 个附件。</p></div>';
        } else if (config.type === 'textarea') {
            control = '<textarea id="field-' + config.name + '" name="' + config.name + '" placeholder="' + esc(config.placeholderOrOptions) + '"' + required + '></textarea>';
        } else {
            const defaultValue = ['date', 'time'].includes(config.type) ? ' value="' + (config.type === 'date' ? todayIso() : esc(config.placeholderOrOptions)) + '"' : '';
            const minmax = config.type === 'number' ? ' min="0" step="0.01"' : '';
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
        input.required = custom && select.required;
        if (custom && initialValue) input.value = initialValue;
        if (!custom) input.value = '';
        if (custom && focusInput) window.setTimeout(function () { input.focus(); }, 0);
    }

    function resolveCustomSelectValues(data) {
        let valid = true;
        els.entryForm.querySelectorAll('[data-custom-select]').forEach(function (select) {
            const customName = select.name + 'Custom';
            if (data[select.name] === '__custom__') {
                data[select.name] = String(data[customName] || '').trim();
                if (!data[select.name]) valid = false;
            }
            delete data[customName];
        });
        if (!valid) showToast('请填写自定义选项内容');
        return valid;
    }

    function reagentUsageRowHtml() {
        const options = state.reagents.map(function (reagent) {
            return '<option value="' + esc(reagent.catalog) + '">' + esc(reagent.name) + ' · ' + esc(reagent.unit) + '</option>';
        }).join('');
        if (!options) return '<p class="field-note">请先在试剂库存中录入试剂。</p>';
        return '<div class="protocol-reagent-row"><select name="reagentCatalog">' + options + '</select><input name="reagentAmount" type="number" min="0.001" step="0.001" value="1" aria-label="单次用量"><span>库存单位 / 次</span><button type="button" data-remove-reagent-row aria-label="移除此试剂">×</button></div>';
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
            return '<article>' + preview + '<div><strong>' + esc(attachment.name) + '</strong><small>' + formatFileSize(attachment.size) + '</small></div><button type="button" data-remove-result-attachment="' + esc(attachment.id) + '" aria-label="删除附件 ' + esc(attachment.name) + '">×</button></article>';
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
        const status = capture.querySelector('[data-photo-status]');
        status.textContent = '正在压缩并分析照片…';
        try {
            const dataUrl = await compressPhoto(file, 900, .68);
            pendingPhotoData = dataUrl;
            capture.querySelector('input[type="hidden"]').value = dataUrl;
            preview.innerHTML = '<img src="' + dataUrl + '" alt="待保存的录入照片"><button type="button" data-clear-photo aria-label="移除照片">×</button>';
            status.textContent = '照片已附加；文字内容请在保存前核对';
            if (activeDialogType === 'reagent' && 'BarcodeDetector' in window) {
                try {
                    const detector = new window.BarcodeDetector();
                    const bitmap = await createImageBitmap(file);
                    const codes = await detector.detect(bitmap);
                    bitmap.close();
                    if (codes.length) {
                        const catalogInput = els.entryForm.elements.namedItem('catalog');
                        if (catalogInput && !catalogInput.value.trim()) catalogInput.value = codes[0].rawValue;
                        status.textContent = '已识别条码 ' + codes[0].rawValue + '，请核对货号与批次';
                    }
                } catch (error) {
                    status.textContent = '照片已附加；当前浏览器未能识别条码，请手动核对';
                }
            }
        } catch (error) {
            status.textContent = '无法读取这张照片，请换一张图片重试';
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

    function saveEntryFromDialog(event) {
        event.preventDefault();
        if (denyReadOnlyMutation()) return;
        const formData = new FormData(els.entryForm);
        const data = Object.fromEntries(formData.entries());
        if (!resolveCustomSelectValues(data)) return;
        data.createdBy = anonymousContributor(data.createdBy);
        if (editingRecord && ['mouse', 'reagent', 'sample', 'cell', 'result'].includes(activeDialogType)) {
            saveEditedRecord(data);
            return;
        }
        let activityText = '';

        if (activeDialogType === 'experiment') {
            data.id = 'RL-EXP-' + String(27 + state.experiments.length).padStart(3, '0');
            data.progress = data.status === '已完成' ? 100 : 12;
            data.reagentUsage = [];
            data.usageOverridden = false;
            state.experiments.unshift(data);
            activityText = '新建实验记录“' + data.title + '”';
        } else if (activeDialogType === 'result') {
            const experiment = state.experiments.find(item => item.id === data.experimentId);
            if (!experiment) {
                showToast('请选择一条有效的实验记录');
                return;
            }
            if (state.results.some(item => item.experimentId === data.experimentId)) {
                showToast('这条实验记录已经有对应结果，可直接编辑原结果');
                return;
            }
            data.id = 'RL-RES-' + Date.now().toString().slice(-8);
            data.attachments = clone(pendingResultAttachments);
            data.history = [createdHistoryEntry()];
            state.results.unshift(data);
            activityText = '填写“' + experiment.title + '”的实验结果';
        } else if (activeDialogType === 'mouse') {
            if (state.mice.some(item => item.id === data.id)) {
                showToast('该动物编号已存在，请使用新的编号');
                return;
            }
            data.history = [createdHistoryEntry()];
            state.mice.unshift(data);
            activityText = '登记实验动物 ' + data.id;
        } else if (activeDialogType === 'reagent') {
            if (state.reagents.some(item => item.catalog === data.catalog)) {
                showToast('该试剂货号已存在，可从详情页编辑原条目');
                return;
            }
            data.totalQty = positiveNumber(data.totalQty, 100);
            data.currentQty = number(data.currentQty, 0, data.totalQty);
            data.amount = data.totalQty ? number(data.currentQty / data.totalQty * 100, 0, 100) : 0;
            data.status = data.amount < 25 ? '余量低' : isExpiringSoon(data.expiry) ? '临期' : '正常';
            data.history = [createdHistoryEntry()];
            state.reagents.unshift(data);
            activityText = '录入试剂“' + data.name + '”';
        } else if (activeDialogType === 'sample') {
            const box = state.freezerBoxes.find(item => item.id === data.boxId);
            const position = samplePosition(data.position);
            if (!box || !isValidBoxPosition(box, position)) {
                showToast('盒内位置格式不正确或超出当前冻存盒范围');
                return;
            }
            if (state.samples.some(item => item.id === data.id)) {
                showToast('该样本编号已存在，可从详情页编辑原条目');
                return;
            }
            const occupied = state.samples.some(item => item.boxId === box.id && item.position === position);
            if (occupied) {
                showToast('该冻存盒位置已被占用，请选择其他空位');
                return;
            }
            data.position = position;
            data.location = formatSampleLocation(box, position);
            data.history = [createdHistoryEntry()];
            state.samples.unshift(data);
            activeFreezerBoxId = box.id;
            localStorage.setItem('rhineLabActiveFreezerBox', box.id);
            selectedSampleId = data.id;
            activityText = '样本 ' + data.id + ' 完成入库';
        } else if (activeDialogType === 'protocol') {
            const code = 'SOP-USR-' + Date.now().toString().slice(-5);
            const catalogs = formData.getAll('reagentCatalog');
            const amounts = formData.getAll('reagentAmount');
            const reagentMap = new Map();
            catalogs.forEach(function (catalog, index) {
                const amount = positiveNumber(amounts[index], 0);
                if (catalog && amount > 0) reagentMap.set(catalog, roundQuantity((reagentMap.get(catalog) || 0) + amount));
            });
            const steps = String(data.stepsText || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean);
            if (!steps.length) {
                showToast('请至少填写一个实验步骤');
                return;
            }
            const protocol = {
                id: code,
                number: code + ' · V1.0',
                title: data.title,
                summary: data.summary,
                steps: steps,
                reagents: Array.from(reagentMap, function (entry) { return { catalog: entry[0], amount: entry[1] }; }),
                tag: data.tag,
                meta: '本地录入 ' + todayIso(),
                photoData: data.photoData || '',
                createdBy: data.createdBy
            };
            state.protocols.unshift(protocol);
            activeProtocolId = protocol.id;
            activityText = '录入 Protocol“' + protocol.title + '”';
        } else if (activeDialogType === 'cell') {
            if (state.cellCultures.some(item => item.id === data.id)) {
                showToast('该培养记录编号已存在，请使用新的编号');
                return;
            }
            data.vesselCount = Math.max(1, Math.round(positiveNumber(data.vesselCount, 1)));
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
                vesselCount: Math.max(1, Math.round(positiveNumber(data.vesselCount, culture.vesselCount))),
                confluence: number(data.confluence, 0, 100),
                medium: data.medium,
                notes: data.notes || '',
                photoData: data.photoData || ''
            };
            culture.history = Array.isArray(culture.history) ? culture.history : [];
            culture.history.unshift(log);
            culture.passage = log.passage;
            culture.container = log.container;
            culture.vesselCount = log.vesselCount;
            culture.confluence = log.confluence;
            culture.medium = log.medium;
            culture.nextAction = data.nextAction;
            culture.status = data.action === '冻存' ? '冻存' : data.action === '污染处理' ? '观察中' : '培养中';
            if (log.photoData) culture.photoData = log.photoData;
            activityText = '记录“' + culture.name + '”的' + data.action + '操作';
        } else if (activeDialogType === 'task') {
            if (timeToMinutes(data.end) <= timeToMinutes(data.time)) {
                showToast('结束时间需要晚于开始时间');
                return;
            }
            if (data.experimentId) {
                const linkedExperiment = state.experiments.find(item => item.id === data.experimentId);
                if (!linkedExperiment) data.experimentId = '';
                else if (linkedExperiment.protocolId) data.protocolId = linkedExperiment.protocolId;
            }
            data.id = 'T-' + Date.now().toString().slice(-6);
            data.done = false;
            state.schedule.push(data);
            calendarDate = parseLocalDate(data.date);
            activityText = '添加日程“' + data.title + '”';
        } else if (activeDialogType === 'freezer') {
            const box = {
                id: 'FB-USR-' + Date.now().toString().slice(-6),
                name: data.name,
                storageLocation: data.storageLocation,
                temperature: data.temperature,
                rows: Math.round(number(data.rows, 4, 12)),
                columns: Math.round(number(data.columns, 4, 12)),
                lastScanPhoto: '',
                createdBy: data.createdBy
            };
            state.freezerBoxes.push(box);
            activeFreezerBoxId = box.id;
            localStorage.setItem('rhineLabActiveFreezerBox', box.id);
            selectedSampleId = '';
            activityText = '新增冻存盒“' + box.name + '”';
        }

        if (activityText) state.activities.unshift({ text: activityText, time: '刚刚' });
        saveState();
        renderAll();
        els.entryDialog.close();
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

        if (target.type === 'mouse') {
            updated.id = current.id;
        } else if (target.type === 'cell') {
            updated.id = current.id;
            updated.vesselCount = Math.max(1, Math.round(positiveNumber(data.vesselCount, current.vesselCount || 1)));
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
                from: historyFieldValue(config.name, current[config.name]),
                to: historyFieldValue(config.name, updated[config.name])
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
        appendAuditLog({ action: 'updated', recordType: target.type, recordId: target.key, changes: clone(changes) });
        state.activities.unshift({ text: '更新' + recordTypeLabel(target.type) + '记录“' + (updated.name || updated.id || updated.catalog) + '”', time: '刚刚' });
        if (target.type === 'sample') {
            activeFreezerBoxId = updated.boxId;
            selectedSampleId = updated.id;
            localStorage.setItem('rhineLabActiveFreezerBox', updated.boxId);
        } else if (target.type === 'cell') {
            activeCellId = updated.id;
        }
        saveState();
        renderAll();
        els.entryDialog.close();
        editingRecord = null;
        pendingResultExperimentId = '';
        pendingResultAttachments = [];
        showToast('修改已保存，并写入变更记录');
        window.setTimeout(function () { openRecordDetail(target.type, target.key); }, 100);
    }

    function historyFieldValue(fieldName, value) {
        if (fieldName === 'photoData') return value ? '已附照片' : '未附照片';
        if (fieldName === 'attachments') {
            const attachments = Array.isArray(value) ? value : [];
            return attachments.length + ' 个附件' + (attachments.length ? ' · ' + attachments.map(item => item.name).join('、') : '');
        }
        return value;
    }

    function openRecordDetail(type, key) {
        if (type === 'mouse') openAnimalDetail(key);
        if (type === 'reagent') openReagentDetail(key);
        if (type === 'sample') openSampleDetail(key);
        if (type === 'cell') openCellDetail(key);
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
        if (['进行中', '实验中', '质控中'].includes(status)) return 'processing';
        if (['待分析', '临期', '观察期', '待传代', '待操作'].includes(status)) return 'caution';
    if (['余量低', '剩余少'].includes(status)) return 'danger';
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

    function byTime(a, b) {
        return a.time.localeCompare(b.time);
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
