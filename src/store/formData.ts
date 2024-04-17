import { defineStore } from 'pinia'

export interface FormDataState{
    selectedTemp: object; //已选中模板信息
}

export const useFormDataStore = defineStore('formData',{
    state: (): FormDataState => ({ 
        selectedTemp: {
            id: 1,
            name: '自由对话模式',
            introduce: '与AI进行自由对话，探索未知领域，获取更多灵感。',
            imgUrl: '/src/assets/images/logo.png',
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
	}),
    getters: {

    },
    actions: {
        setSelectedTemp(temp: object){
            this.selectedTemp = temp;
        }
    },
    // 持久化配置
    persist: [   
        {
            key: 'text-store',    
            storage: sessionStorage   
        }
    ]  
})