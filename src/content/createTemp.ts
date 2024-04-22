// 创作模板信息
export const CREATION_TEMPLATE = [
    {//文言文翻译器
        id: 1,
        title: '文案润色',
        modelContent: '提升文案品质，打造精彩文字，让您的内容更具吸引力。',
        modelImg: '/src/assets/images/wenan-runse.png',
        formItems: [
            {
                label: '需要润色的文案',
                prop: 'content',
                type: 'textarea',
                placeholder: '请输入需要润色的文案',
                collectValue: '',
                exampleValue: '在这个校园里，每天都有新的故事发生。清晨，知识在青春中生根；午后，图书馆是智慧的海洋；黄昏，操场上是青春与梦想的交融。这里，承载着学习、友谊和成长的美好时光。',
            },
            {
                label: '创作风格',
                prop: 'createType',
                type: 'selectRadio',
                placeholder: '请选择文章类型',
                options: ['不限', '专业严谨', '轻松幽默', '文艺风','随笔'],
                collectValue: '',
                exampleValue: '不限',
            }
        ],
    },
    {
        id: 2,
        title: '通知撰写',
        modelContent: '智能撰写通知，节省时间提高效率。',
        modelImg: '/src/assets/images/notice-temp.png',
        formItems: [
            {
                label: '通知主题',
                prop: 'meetTheme',
                type: 'input',
                placeholder: '请输入通知主题',
                collectValue: '',
                exampleValue: '季度销售总结',
            },
            {
                label: '时间地点',
                prop: 'meetTime',
                type: 'input',
                placeholder: '请输入时间地点',
                collectValue: '',
                exampleValue: '周一下午三点、一楼大会议室',
            },
            {
                label: '会议内容',
                prop: 'meetContent',
                type: 'textarea',
                placeholder: '请输入会议内容',
                collectValue: '',
                exampleValue: '',
            },
        ]
    },
    {
        id: 3,
        title: '工作周报',
        modelContent: '高质量汇报本周工作情况。',
        modelImg: '/src/assets/images/weekly-report.png',
        formItems: [
            {
                label: '岗位/职务',
                prop: 'job',
                type: 'input',
                placeholder: '请输入通知主题',
                collectValue: '',
                exampleValue: '前端开发工程师',
            },
            {
                label: '本周工作内容',
                prop: 'weeklyContent',
                type: 'textarea',
                placeholder: '简要描述本周工作成果/内容',
                collectValue: '',
                exampleValue: '完成AI创作的文本类功能开发',
            }
        ]
    },
    {
        id: 4,
        title: '文章撰写',
        modelContent: '提供文章主题，帮你完成一篇文章',
        modelImg: '/src/assets/images/article.png',
        formItems: [
            {
                label: '文章主题',
                prop: 'theme',
                type: 'textarea',
                placeholder: '请简要描述文章主题',
                collectValue: '',
                exampleValue: '学校的特色',
            },
            {
                label: '字数限制',
                prop: 'num',
                type: 'input',
                placeholder: '请输入文章字数限制',
                collectValue: '',
                exampleValue: '200',
            },
        ]
    },
]