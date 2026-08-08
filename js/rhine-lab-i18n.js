(function () {
    'use strict';

    const STORAGE_KEY = 'rhineLabLanguage';
    const SUPPORTED_LANGUAGES = ['zh', 'en'];

    const english = Object.freeze({
        'Rhine Lab 生命科学实验管理工作台：实验记录、动物、试剂、样本与实验日程。': 'Rhine Lab life-science workspace for experiments, animals, reagents, samples and schedules.',
        'Rhine Lab · 生命科学研究工作台': 'Rhine Lab · Life Science Research Workspace',
        '实验记录、动物管理、试剂库存、样本库与实验日程的一体化科研工作台。': 'An integrated research workspace for experiment records, animal management, reagent inventory, biobanking and schedules.',
        '莱茵生命 RHINE LAB': 'Rhine Lab logo',
        '生命科学': 'LIFE SCIENCE',
        '研究终端': 'RESEARCH TERMINAL',
        '跳至主要内容': 'Skip to main content',
        '打开导航': 'Open navigation',
        'Rhine Lab 功能导航': 'Rhine Lab navigation',
        'WORKSPACE / 工作区': 'WORKSPACE',
        '工作区': 'Workspace',
        '工作总览': 'Overview',
        '实验记录': 'Experiment Records',
        '动物管理': 'Animal Management',
        '试剂库存': 'Reagent Inventory',
        '样本库': 'Biobank',
        '实验方案': 'Protocols',
        '日程排班': 'Schedule',
        '本地模式': 'Local mode',
        '云同步未连接': 'Cloud sync offline',
        '仅此设备': 'This device',
        '个人': 'Personal',
        'LAB 共用': 'LAB Shared',
        '切换工作区范围': 'Switch workspace scope',
        '切换夜间模式': 'Toggle dark mode',
        '通知': 'Notifications',
        '通知中心': 'Notification Center',
        '关闭通知': 'Close notifications',
        '全部标为已读': 'Mark all as read',
        '系统信息实时更新': 'System information updates live',
        'Anti-c-Fos antibody 库存不足': 'Anti-c-Fos antibody is low',
        '当前余量 18%，建议尽快补充 · 32 分钟前': '18% remaining; restock recommended · 32 minutes ago',
        'Matrigel 即将到期': 'Matrigel expires soon',
        '有效期为 2026-08-22 · 1 小时前': 'Expires 2026-08-22 · 1 hour ago',
        '双光子成像预约提醒': 'Two-photon imaging reservation reminder',
        '今天 14:30 · 成像中心 2P-01': 'Today 14:30 · Imaging Center 2P-01',
        '实验室共用界面': 'Shared LAB Workspace',
        '集中查看所有成员录入的实验、Protocol、库存、动物与样本信息。': 'View experiments, protocols, inventory, animals and samples entered by all members.',
        '集中查看所有成员录入的信息；当前账户对共用数据为只读。': 'View records entered by all members; shared data is read-only for this account.',
        '集中管理所有成员录入的实验、Protocol、库存、动物与样本信息。': 'Manage experiments, protocols, inventory, animals and samples entered by all members.',
        '个人工作区': 'Personal Workspace',
        'LAB 共用页面为只读；请切换到个人工作区录入': 'The shared LAB workspace is read-only. Switch to Personal Workspace to add records.',
        '已切换到实验室共用界面': 'Switched to the shared LAB workspace',
        '已返回个人工作界面': 'Returned to the personal workspace',
        '/ 研究控制台': '/ RESEARCH CONTROL',
        '/ 实验档案': '/ EXPERIMENT ARCHIVE',
        '/ 实验动物中心': '/ ANIMAL FACILITY',
        '/ 物料追踪': '/ MATERIAL TRACKING',
        '/ 生物样本库': '/ BIOBANK MATRIX',
        '/ 标准作业库': '/ PROTOCOL LIBRARY',
        '/ 运行日程': '/ OPERATIONS SCHEDULE',
        '早上好，研究员。': 'Good morning, Researcher.',
        '中午好，研究员。': 'Good noon, Researcher.',
        '下午好，研究员。': 'Good afternoon, Researcher.',
        '晚上好，研究员。': 'Good evening, Researcher.',
        '今天有': 'You have',
        '等待处理，细胞成像实验将在': 'pending. The cell imaging experiment starts at',
        '开始。': '.',
        '查看日程': 'View schedule',
        '新建实验记录': 'New experiment record',
        '进行中的研究项目': 'Active research projects',
        '查看全部': 'View all',
        '今日安排': "Today's schedule",
        '添加日程': 'Add schedule',
        '打开完整日程': 'Open full schedule',
        '库存与样本预警': 'Inventory & sample alerts',
        '需要关注': 'Attention required',
        '对象': 'Item',
        '分类': 'Category',
        '当前状态': 'Current status',
        '位置 / 截止': 'Location / deadline',
        '近期动态': 'Recent activity',
        '项 · 进行中实验': ' · active experiments',
        '只 · 在管实验动物': ' · registered animals',
        '份 · 登记生物样本': ' · registered samples',
        '项 · 试剂预警': ' · reagent alerts',
        '进行中实验': 'Active experiments',
        '在管实验动物': 'Research animals',
        '登记生物样本': 'Registered samples',
        '试剂预警': 'Reagent alerts',
        '需处理': 'Action required',
        '从假设、执行到结果，把每一次实验变成可追溯的证据链。': 'Turn every experiment—from hypothesis to result—into a traceable chain of evidence.',
        '新建记录': 'New record',
        '全部': 'All',
        '进行中': 'In progress',
        '待分析': 'Pending analysis',
        '已完成': 'Completed',
        '筛选项目、编号或实验类型': 'Filter by project, ID or experiment type',
        '集中管理实验动物的笼位、品系、基因型、实验状态与伦理信息。': 'Manage housing, strain, genotype, experiment status and ethics information for research animals.',
        '登记动物': 'Register animal',
        '在库动物': 'Registered animals',
        '在管总数': 'Total animals',
        '实验进行中': 'In experiments',
        '繁育队列': 'Breeding cohort',
        '使用笼位': 'Cages in use',
        '搜索编号、品系或笼位': 'Search ID, strain or cage',
        '动物编号': 'Animal ID',
        '品系 / 基因型': 'Strain / genotype',
        '性别': 'Sex',
        '出生日期': 'Date of birth',
        '笼位': 'Cage',
        '实验状态': 'Experiment status',
        '伦理编号': 'Ethics ID',
        '批号、余量、效期与存储条件始终清晰，减少实验前的库存意外。': 'Keep lots, remaining quantities, expiry dates and storage conditions clear to prevent inventory surprises.',
        '录入试剂': 'Add reagent',
        '抗体': 'Antibody',
        '培养基': 'Culture medium',
        '化学试剂': 'Chemical',
        '染料': 'Dye',
        '酶': 'Enzyme',
        '搜索名称、货号或位置': 'Search name, catalog number or location',
        '试剂名称': 'Reagent name',
        '类别 / 货号': 'Category / catalog no.',
        '批次': 'Lot',
        '存储位置': 'Storage location',
        '实际库存': 'Actual inventory',
        '临近效期': 'Expiring soon',
        '存储区域': 'Storage areas',
        '有效期': 'Expiry date',
        '状态': 'Status',
        '用冻存盒位置图快速定位组织、细胞、DNA 与血清样本。': 'Locate tissue, cell, DNA and serum samples quickly with freezer-box maps.',
        '登记样本': 'Register sample',
        '冻存盒管理': 'Freezer-box management',
        '拍照识别': 'Photo recognition',
        '新增冻存盒': 'Add freezer box',
        '冻存盒': 'Freezer box',
        '点击任意空位即可开始登记样本': 'Select any empty position to register a sample',
        '已占用': 'Occupied',
        '当前': 'Current',
        '空位': 'Empty',
        '冻存盒位置图': 'Freezer-box position map',
        '冻存盒位置': 'Freezer-box position',
        '样本目录': 'Sample catalog',
        '搜索样本编号或来源': 'Search sample ID or source',
        '样本编号': 'Sample ID',
        '类型': 'Type',
        '来源': 'Source',
        '处理方式': 'Processing method',
        '入库日期': 'Storage date',
        '把关键步骤、风险节点和版本历史组织为可执行的实验 SOP。': 'Organize critical steps, risk points and version history into executable SOPs.',
        '份 SOP 已同步': 'SOPs synced',
        '录入 Protocol': 'Add Protocol',
        '切换日历或每日模式；在每日时间网格中拖动，即可建立新的日程时段。': 'Switch between day and calendar views; drag across the daily timeline to create a schedule block.',
        '日程显示方式': 'Schedule view',
        '每日': 'Day',
        '日历': 'Calendar',
        '上一时间段': 'Previous period',
        '今天': 'Today',
        '下一时间段': 'Next period',
        '今日运行计划': "Today's operations",
        '在空白时间段拖动创建': 'Drag across an empty time range to create',
        '每日时间网格': 'Daily timeline',
        '资源使用率': 'Facility utilization',
        '安全提醒': 'Safety reminder',
        '离开实验室前确认生物安全柜 UV 已关闭，并完成危废登记。': 'Before leaving, confirm that biosafety-cabinet UV is off and hazardous waste has been logged.',
        '周一': 'Mon',
        '周二': 'Tue',
        '周三': 'Wed',
        '周四': 'Thu',
        '周五': 'Fri',
        '周六': 'Sat',
        '周日': 'Sun',
        '当日日程': 'Daily agenda',
        '＋ 添加到这一天': '+ Add to this day',
        '关闭检索结果': 'Close search results',
        '全局检索': 'Global search',
        '检索实验、动物、试剂或样本…': 'Search experiments, animals, reagents or samples…',
        '输入关键词…': 'Enter keywords…',
        '新建记录': 'New record',
        '关闭': 'Close',
        '数据将先保存到本机缓存': 'Data will first be saved to the local cache',
        '取消': 'Cancel',
        '确认保存': 'Save',
        '设备同步': 'Device sync',
        '当前仅保存在这台设备': 'Currently stored only on this device',
        '连接云数据库并登录后，电脑与手机会使用同一份数据。': 'Connect a cloud database and sign in to share the same data across desktop and mobile.',
        '登录邮箱': 'Sign-in email',
        '发送登录链接': 'Send sign-in link',
        '已登录账户': 'Signed-in account',
        'LAB 权限': 'LAB access',
        '云同步尚未配置；页面仍可作为本地工作台使用。': 'Cloud sync is not configured; the page remains available as a local workspace.',
        '安装到此设备': 'Install on this device',
        '退出登录': 'Sign out',
        '完成': 'Done',
        '详细信息': 'Details',
        '数据来自当前工作区': 'Data from the current workspace',
        '理论用量按每次执行计算': 'Theoretical usage is calculated per run',
        '安排此 Protocol': 'Schedule this Protocol',
        '记录状态': 'Record status',
        '关联 Protocol': 'Linked Protocol',
        '本次记录与备注': 'Record notes',
        '本次试剂用量': 'Reagent usage for this run',
        '按 Protocol 默认': 'Protocol defaults',
        '先显示关联 Protocol 的单次用量。可直接修改、删除或增加试剂；记录完成后，库存余量将采用这里保存的数值。': 'Usage defaults to the linked Protocol. Edit, remove or add reagents as needed; completed records update inventory using the saved values.',
        '＋ 增加本次试剂': '+ Add reagent usage',
        '未完成的记录不会计入库存消耗': 'Incomplete records do not consume inventory',
        '保存本次记录': 'Save experiment record',
        '冻存盒拍照识别': 'Freezer-box photo recognition',
        '当前冻存盒': 'Current freezer box',
        '拍照或选择冻存盒照片': 'Take or choose a freezer-box photo',
        '请让冻存盒正对镜头并尽量占满画面': 'Face the box directly toward the camera and fill the frame',
        '照片会在这里显示，并按当前冻存盒网格分析管位。': 'The photo will appear here and tube positions will be analyzed against the current box grid.',
        '识别灵敏度': 'Detection sensitivity',
        '等待照片': 'Waiting for photo',
        '识别结果，可点击修正': 'Detection results; select to correct',
        '绿色为疑似有冻存管，灰色为已登记位置。识别结果可逐格点击修正。': 'Green marks likely tubes; gray marks registered positions. Select cells to correct the result.',
        '按识别结果逐个录入': 'Register detected positions',
        '记录已保存': 'Record saved',
        '记录已保存并同步到工作台': 'Record saved and synced to the workspace',
        '记录信息已核对': 'Record information verified',
        '本次试剂用量已保存': 'Reagent usage saved',
        '实验已完成，试剂余量已按本次记录更新': 'Experiment completed; reagent inventory updated from this record',
        '保存后将立即按本次用量更新试剂余量': 'Saving will immediately update reagent inventory using this run',
        '本次用量已调整': 'Usage adjusted for this run',
        '本次手动记录': 'Manual usage record',
        '未关联 Protocol': 'No linked Protocol',
        '不关联 Protocol': 'No Protocol',
        '未关联库存试剂': 'No inventory reagent linked',
        '当前没有试剂用量，点击下方按钮添加。': 'No reagent usage yet. Use the button below to add one.',
        '请先在试剂库存中录入试剂。': 'Add a reagent to inventory first.',
        '移除本次试剂': 'Remove reagent usage',
        '本次使用试剂': 'Reagent used in this run',
        '库存单位': 'Inventory unit',
        '余量低': 'Low stock',
        '临期': 'Expiring soon',
        '正常': 'Normal',
        '剩余少': 'Low stock',
        '待分配': 'Unassigned',
        '实验中': 'In experiment',
        '繁育中': 'Breeding',
        '观察期': 'Observation',
        '质控中': 'Quality control',
        '在库': 'In storage',
        '待确认': 'Pending confirmation',
        '完成入库': 'Stored',
        '雄': 'Male',
        '雌': 'Female',
        '当前没有进行中的实验。': 'No active experiments.',
        '今天还没有安排任务。': 'No tasks scheduled today.',
        '当前没有库存或样本预警。': 'No inventory or sample alerts.',
        '没有找到匹配的实验记录。': 'No matching experiment records.',
        '没有找到匹配的动物记录。': 'No matching animal records.',
        '没有找到匹配的试剂记录。': 'No matching reagent records.',
        '没有找到匹配的样本记录。': 'No matching sample records.',
        '这一天还没有安排。': 'Nothing scheduled for this day.',
        '这个冻存盒尚未登记样本。可点击左侧空位或使用拍照识别。': 'No samples are registered in this box. Select an empty position or use photo recognition.',
        '还没有 Protocol，点击“录入 Protocol”开始建立方案库。': 'No Protocols yet. Select “Add Protocol” to create the library.',
        '此 Protocol 尚未关联库存试剂。': 'This Protocol has no linked inventory reagents.',
        '此 Protocol 尚未录入实验步骤。': 'This Protocol has no experiment steps.',
        '实验流程图': 'Procedure map',
        '单次试剂理论用量': 'Theoretical reagent usage per run',
        '试剂': 'Reagent',
        '每次用量': 'Usage per run',
        '当前理论余量': 'Current theoretical balance',
        '准备': 'Prepare',
        '执行': 'Execute',
        '质控': 'Quality control',
        '归档': 'Archive',
        '身份与群体信息': 'Identity & colony',
        '动物状态轨迹': 'Animal lifecycle',
        '库存详细信息': 'Inventory profile',
        '使用关联': 'Usage trace',
        '当前周龄': 'Current age',
        '当前笼位': 'Current cage',
        '当前实际库存': 'Current actual inventory',
        '当前实际余量': 'Current actual balance',
        '设备 / 层架': 'Equipment / shelf',
        '存储条件': 'Storage conditions',
        '品牌货号': 'Brand / catalog no.',
        '批次号': 'Lot number',
        '计量单位': 'Unit',
        '实际库存比例': 'Actual inventory percentage',
        '库存品类': 'Inventory category',
        '当前阶段': 'Current stage',
        '录入成员': 'Contributors',
        '整合记录': 'Combined records',
        '共享 Protocol': 'Shared Protocols',
        '照片': 'Photo',
        '附有录入照片': 'Intake photo attached',
        '尚未选择照片': 'No photo selected',
        '移除照片': 'Remove photo',
        '待保存的录入照片': 'Pending intake photo',
        '拍照或选择图片': 'Take or choose a photo',
        '照片只在当前设备中压缩保存': 'The compressed photo is stored only on this device',
        '照片辅助录入': 'Photo-assisted intake',
        '拍照识别 / 留档': 'Photo recognition / archive',
        '查看': 'View',
        '样本': 'Sample',
        '实际库存': 'Actual inventory',
        '最近更新': 'Last updated',
        '标记为完成': 'Mark completed',
        '标记为未完成': 'Mark incomplete',
        '任务已完成': 'Task completed',
        '任务已恢复': 'Task restored',
        '任务已完成，理论试剂余量已更新': 'Task completed; theoretical reagent balance updated',
        '任务已恢复，理论试剂余量已回滚': 'Task restored; theoretical reagent balance rolled back',
        '全部通知已标记为已读': 'All notifications marked as read',
        '已打开相关记录': 'Related record opened',
        '该冻存盒位置已被占用，请选择其他空位': 'This freezer-box position is occupied. Select another position.',
        '盒内位置格式不正确或超出当前冻存盒范围': 'The position format is invalid or outside the current freezer box.',
        '没有可录入的新管位': 'No new tube positions to register',
        '照片识别的管位已全部录入': 'All photo-detected tube positions have been registered',
        '无法读取这张照片，请换一张图片重试': 'Unable to read this photo. Try another image.',
        '照片读取失败，请重新拍摄': 'Photo reading failed. Take another photo.',
        '正在分析照片…': 'Analyzing photo…',
        '正在压缩并分析照片…': 'Compressing and analyzing photo…',
        '照片已附加；文字内容请在保存前核对': 'Photo attached; verify the text before saving',
        '照片已附加；当前浏览器未能识别条码，请手动核对': 'Photo attached; barcode recognition was unavailable. Verify it manually.',
        '已识别条码': 'Barcode recognized',
        '未检测到冻存管': 'No tube detected',
        '疑似有冻存管': 'Possible tube detected',
        '已登记': 'Registered',
        '有照片': 'Has photo',
        '存储区域': 'Storage area',
        '动物编号 / 细胞系': 'Animal ID / cell line',
        '实验名称': 'Experiment name',
        '所属项目': 'Project',
        '实验类型': 'Experiment type',
        '实验日期': 'Experiment date',
        '实验目的与简述': 'Purpose and summary',
        '关联 Protocol（用于理论耗量）': 'Linked Protocol (for theoretical usage)',
        '关联后会带入 Protocol 的步骤与默认试剂用量，实验记录中仍可修改。': 'Linking a Protocol imports its steps and default reagent usage; the experiment record can still be edited.',
        '记录核心假设、变量和预期观察…': 'Record the core hypothesis, variables and expected observations…',
        '任务名称': 'Task name',
        '任务类型': 'Task type',
        '日期': 'Date',
        '开始时间': 'Start time',
        '结束时间': 'End time',
        '地点 / 仪器': 'Location / instrument',
        '结束时间需要晚于开始时间': 'End time must be later than start time',
        '方案分类': 'Protocol category',
        'Protocol 名称': 'Protocol name',
        '方案说明': 'Protocol description',
        '实验步骤（每行一步）': 'Experiment steps (one per line)',
        '每次执行的试剂用量': 'Reagent usage per run',
        '＋ 添加试剂': '+ Add reagent',
        '用量单位自动采用试剂库存中登记的单位。': 'Units follow the values registered in reagent inventory.',
        '请至少填写一个实验步骤': 'Enter at least one experiment step',
        '未命名 Protocol': 'Untitled Protocol',
        '冻存盒名称': 'Freezer-box name',
        '设备 / 层架位置': 'Equipment / shelf location',
        '行数': 'Rows',
        '列数': 'Columns',
        '盒内位置': 'Box position',
        '样本类型': 'Sample type',
        '样本来源': 'Sample source',
        '样本处理': 'Sample processing',
        '样本照片': 'Sample photo',
        '录入新试剂': 'Add reagent',
        '试剂类别': 'Reagent category',
        '说明用途、关键条件和注意事项…': 'Describe use, key conditions and precautions…',
        '拍摄实验记录、手写记录或仪器屏幕': 'Photograph the experiment record, handwritten notes or instrument screen',
        '拍摄试剂标签；支持浏览器条码识别': 'Photograph the reagent label; browser barcode recognition is supported',
        '拍摄冻存管标签或样本外观': 'Photograph the cryotube label or sample appearance',
        '拍摄纸质 SOP 或实验本页面作为附件': 'Photograph a printed SOP or notebook page as an attachment',
        '当前实际库存': 'Current actual inventory',
        '当前余量': 'Current balance',
        '理论用量按每次执行计算': 'Theoretical usage is calculated per run',
        '昨天 16:20': 'Yesterday 16:20',
        '昨天 18:42': 'Yesterday 18:42',
        '刚刚': 'Just now',
        '8 分钟前': '8 minutes ago',
        '32 分钟前': '32 minutes ago',
        '1 小时前': '1 hour ago',
        '2 小时前': '2 hours ago'
    });

    const patterns = [
        [/^打开通知，(\d+) 条未读$/, function (m) { return 'Open notifications, ' + m[1] + ' unread'; }],
        [/^打开通知，没有未读消息$/, function () { return 'Open notifications, no unread messages'; }],
        [/^(\d+) 条未读$/, function (m) { return m[1] + ' unread'; }],
        [/^(\d+) 项任务$/, function (m) { return m[1] + ' tasks'; }],
        [/^(\d+) 项安排$/, function (m) { return m[1] + ' scheduled items'; }],
        [/^(\d+) 项日程$/, function (m) { return m[1] + ' schedule items'; }],
        [/^(\d+) 项日程 · 已完成$/, function (m) { return m[1] + ' schedule items · completed'; }],
        [/^(.+) · (\d+) 项安排$/, function (m) { return m[1] + ' · ' + m[2] + ' scheduled items'; }],
        [/^(.+) · (\d+) 项日程$/, function (m) { return m[1] + ' · ' + m[2] + ' schedule items'; }],
        [/^(\d+) 份 SOP 已同步$/, function (m) { return m[1] + ' SOPs synced'; }],
        [/^从准备到归档，共 (\d+) 个步骤$/, function (m) { return 'From preparation to archive · ' + m[1] + ' steps'; }],
        [/^(\d+) 个步骤$/, function (m) { return m[1] + ' steps'; }],
        [/^(\d+) 个位置$/, function (m) { return m[1] + ' positions'; }],
        [/^(\d+) 个疑似新管位$/, function (m) { return m[1] + ' possible new tube positions'; }],
        [/^(\d+) 种试剂已关联$/, function (m) { return m[1] + ' reagents linked'; }],
        [/^(\d+) 种试剂已关联 →$/, function (m) { return m[1] + ' reagents linked →'; }],
        [/^(\d+) 步$/, function (m) { return m[1] + ' steps'; }],
        [/^(\d+) 种试剂 →$/, function (m) { return m[1] + ' reagents →'; }],
        [/^最近更新 (.+)$/, function (m) { return 'Last updated ' + m[1]; }],
        [/^录入 (.+)$/, function (m) { return 'Entered by ' + m[1]; }],
        [/^按 (SOP-[A-Z]+-\d+)$/, function (m) { return 'Based on ' + m[1]; }],
        [/^(.+) · 更新 (.+)$/, function (m) { return translateCore(m[1]) + ' · updated ' + m[2]; }],
        [/^笼位 (.+)$/, function (m) { return 'Cage ' + m[1]; }],
        [/^空位 (.+)，点击登记样本$/, function (m) { return 'Empty ' + m[1] + ' · select to register a sample'; }],
        [/^点击在 (.+) 登记样本$/, function (m) { return 'Register a sample at ' + m[1]; }],
        [/^(.+) 已登记$/, function (m) { return m[1] + ' registered'; }],
        [/^(.+) 疑似有冻存管$/, function (m) { return m[1] + ' possible tube'; }],
        [/^(.+) 未检测到冻存管$/, function (m) { return m[1] + ' no tube detected'; }],
        [/^查看动物 (.+) 的详细信息$/, function (m) { return 'View animal ' + m[1] + ' details'; }],
        [/^查看试剂 (.+) 的详细信息$/, function (m) { return 'View reagent ' + m[1] + ' details'; }],
        [/^(.+) 的实验照片$/, function (m) { return 'Experiment photo for ' + m[1]; }],
        [/^(.+) 的录入照片$/, function (m) { return 'Intake photo for ' + m[1]; }],
        [/^(\d{4}) 年 (\d{1,2}) 月 (\d{1,2}) 日$/, function (m) { return m[2] + '/' + m[3] + '/' + m[1]; }],
        [/^(\d+) 只实验中$/, function (m) { return m[1] + ' in experiments'; }],
        [/^(\d+) 项$/, function (m) { return m[1] + ' items'; }],
        [/^(\d+) 只$/, function (m) { return m[1] + ' animals'; }],
        [/^(\d+) 份$/, function (m) { return m[1] + ' samples'; }],
        [/^(\d+) 支$/, function (m) { return m[1] + ' tubes'; }],
        [/^(\d+) 片$/, function (m) { return m[1] + ' slices'; }],
        [/^(\d+) 次$/, function (m) { return m[1] + ' runs'; }],
        [/^\+(\d+) 项$/, function (m) { return '+' + m[1] + ' items'; }],
        [/^\+([0-9]+) 本周$/, function (m) { return '+' + m[1] + ' this week'; }]
    ];

    const textSources = new WeakMap();
    const attributeSources = new WeakMap();
    let language = normalizeLanguage(localStorage.getItem(STORAGE_KEY));
    let applyingLanguageSwitch = false;

    function normalizeLanguage(value) {
        return SUPPORTED_LANGUAGES.includes(value) ? value : 'zh';
    }

    function translateCore(value) {
        if (!value || language !== 'en') return value;
        if (Object.prototype.hasOwnProperty.call(english, value)) return english[value];
        for (const entry of patterns) {
            const match = value.match(entry[0]);
            if (match) return entry[1](match);
        }
        return value;
    }

    function translate(value) {
        const stringValue = String(value == null ? '' : value);
        const leading = (stringValue.match(/^\s*/) || [''])[0];
        const trailing = (stringValue.match(/\s*$/) || [''])[0];
        const coreEnd = stringValue.length - trailing.length;
        const core = stringValue.slice(leading.length, coreEnd < leading.length ? leading.length : coreEnd);
        const translatedCore = translateCore(core);
        const normalizedLeading = language === 'en' && /^[.,;:!?]/.test(translatedCore) ? '' : leading;
        return normalizedLeading + translatedCore + trailing;
    }

    function shouldSkipText(node) {
        const parent = node.parentElement;
        return !parent || Boolean(parent.closest('script, style, noscript, code, pre, [data-i18n-skip], [contenteditable="true"]'));
    }

    function applyTextNode(node) {
        if (shouldSkipText(node)) return;
        const parent = node.parentElement;
        if (parent && parent.tagName === 'OPTION' && !parent.hasAttribute('value')) {
            parent.setAttribute('value', parent.value);
        }
        let source = textSources.get(node);
        if (source === undefined) {
            source = node.nodeValue;
            textSources.set(node, source);
        } else if (!applyingLanguageSwitch) {
            const expected = language === 'en' ? translateWithLanguage(source, 'en') : source;
            if (node.nodeValue !== expected) {
                source = node.nodeValue;
                textSources.set(node, source);
            }
        }
        const nextValue = language === 'en' ? translateWithLanguage(source, 'en') : source;
        if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
    }

    function translateWithLanguage(value, nextLanguage) {
        const previous = language;
        language = nextLanguage;
        const result = translate(value);
        language = previous;
        return result;
    }

    function applyAttributes(element) {
        if (!(element instanceof Element) || element.hasAttribute('data-i18n-control')) return;
        const names = ['placeholder', 'title', 'aria-label', 'alt'];
        let sources = attributeSources.get(element);
        if (!sources) {
            sources = {};
            attributeSources.set(element, sources);
        }
        names.forEach(function (name) {
            if (!element.hasAttribute(name)) return;
            const current = element.getAttribute(name);
            if (!(name in sources)) {
                sources[name] = current;
            } else if (!applyingLanguageSwitch) {
                const expected = language === 'en' ? translateWithLanguage(sources[name], 'en') : sources[name];
                if (current !== expected) sources[name] = current;
            }
            const nextValue = language === 'en' ? translateWithLanguage(sources[name], 'en') : sources[name];
            if (current !== nextValue) element.setAttribute(name, nextValue);
        });
    }

    function applyTree(root) {
        if (!root) return;
        if (root.nodeType === Node.TEXT_NODE) {
            applyTextNode(root);
            return;
        }
        if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
        if (root.nodeType === Node.ELEMENT_NODE) applyAttributes(root);
        const elementWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        while (elementWalker.nextNode()) applyAttributes(elementWalker.currentNode);
        const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        while (textWalker.nextNode()) applyTextNode(textWalker.currentNode);
    }

    function updateMetadata() {
        const titleSource = 'Rhine Lab · 生命科学研究工作台';
        if (!document.title || document.title.includes('生命科学研究工作台') || document.title.includes('Life Science Research Workspace')) {
            document.title = language === 'en' ? english[titleSource] : titleSource;
        }
        document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]').forEach(function (meta) {
            const source = meta.dataset.i18nSource || meta.getAttribute('content') || '';
            meta.dataset.i18nSource = source;
            meta.setAttribute('content', language === 'en' ? translateWithLanguage(source, 'en') : source);
        });
    }

    function updateToggle() {
        const button = document.getElementById('languageToggle');
        if (!button) return;
        const nextIsEnglish = language === 'zh';
        const label = nextIsEnglish ? 'Switch to English' : '切换为中文';
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
        button.setAttribute('aria-pressed', String(language === 'en'));
        const display = button.querySelector('[data-i18n-skip]');
        if (display) display.textContent = nextIsEnglish ? 'EN' : '中';
    }

    function setLanguage(nextLanguage, notify) {
        const normalized = normalizeLanguage(nextLanguage);
        language = normalized;
        localStorage.setItem(STORAGE_KEY, normalized);
        document.documentElement.lang = normalized === 'en' ? 'en' : 'zh-CN';
        document.body.classList.toggle('language-en', normalized === 'en');
        applyingLanguageSwitch = true;
        try {
            applyTree(document.body);
        } finally {
            applyingLanguageSwitch = false;
        }
        updateMetadata();
        updateToggle();
        if (notify !== false) {
            window.dispatchEvent(new CustomEvent('rhine:languagechange', { detail: { language: normalized, locale: getLocale() } }));
        }
    }

    function getLocale() {
        return language === 'en' ? 'en-US' : 'zh-CN';
    }

    function observeChanges() {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'characterData') {
                    applyTextNode(mutation.target);
                    return;
                }
                mutation.addedNodes.forEach(applyTree);
                if (mutation.type === 'attributes') applyAttributes(mutation.target);
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['placeholder', 'title', 'aria-label', 'alt']
        });
    }

    window.RhineLabI18n = {
        getLanguage: function () { return language; },
        getLocale: getLocale,
        t: function (value) { return language === 'en' ? translateWithLanguage(value, 'en') : value; },
        setLanguage: setLanguage,
        toggle: function () { setLanguage(language === 'zh' ? 'en' : 'zh'); }
    };

    const toggle = document.getElementById('languageToggle');
    if (toggle) toggle.addEventListener('click', window.RhineLabI18n.toggle);
    setLanguage(language, false);
    observeChanges();
})();
