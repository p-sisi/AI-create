// 创作模板信息
export const CREATION_TEMPLATE = [
    {
        id: 1,
        name: '自由对话模式',
        introduce: '与AI进行自由对话，探索未知领域，获取更多灵感。',
        imgUrl: '/src/assets/images/temp-free.png',
        formItems: [
            {
                label: '对话内容',
                prop: 'content',
                type: 'input',
                placeholder: '请输入对话内容',
                rules: {
                    required: true,
                    message: '请输入对话内容',
                },
                collectValue: '',
                exampleValue: '你好，帮我写一段200字的任意文章',
            },
            {
                label: '文章内容',
                prop: 'articleContent',
                type: 'textarea',
                placeholder: '请输入文章内容',
                rules: {
                    required: true,
                    message: '请输入文章内容',
                },
                collectValue: '',
                exampleValue: '这是一段示例文章内容，请替换为你的文章内容。',
            },
            {
                label: '文章类型',
                prop: 'type',
                type: 'selectRadio',
                placeholder: '请选择文章类型',
                options: ['新闻', '科技', '娱乐', '体育'],
                rules: {
                    required: true,
                    message: '请选择文章类型',
                },
                collectValue: '新闻',
                exampleValue: '新闻',
            }
        ]
    },
    {
        id: 2,
        name: '文本生成',
        introduce: '一键生成精美文本，满足不同创作需求。',
        imgUrl: '/src/assets/images/logo.png',
        formItems: [
            {
                label: '生成内容',
                prop: 'content',
                type: 'textarea',
                placeholder: '请输入生成内容',
                rules: {
                    required: true,
                    message: '请输入对话内容',
                }
            }
        ]
    },
    {
        id: 3,
        name: '文本生成',
        introduce: '一键生成精美文本，满足不同创作需求。',
        imgUrl: '/src/assets/images/logo.png',
        formItems: [
            {
                label: '生成内容',
                prop: 'content',
                type: 'textarea',
                placeholder: '请输入生成内容',
                rules: {
                    required: true,
                    message: '请输入对话内容',
                }
            }
        ]
    },
    {
        id: 4,
        name: '文本生成',
        introduce: '一键生成精美文本，满足不同创作需求。',
        imgUrl: '/src/assets/images/logo.png',
        formItems: [
            {
                label: '生成内容',
                prop: 'content',
                type: 'textarea',
                placeholder: '请输入生成内容',
                rules: {
                    required: true,
                    message: '请输入对话内容',
                }
            }
        ]
    },
    {
        id: 5,
        name: '文本生成',
        introduce: '一键生成精美文本，满足不同创作需求。',
        imgUrl: '/src/assets/images/logo.png',
        formItems: [
            {
                label: '生成内容',
                prop: 'content',
                type: 'textarea',
                placeholder: '请输入生成内容',
                rules: {
                    required: true,
                    message: '请输入对话内容',
                }
            }
        ]
    }
]