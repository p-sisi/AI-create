import { defineStore } from 'pinia'

export interface TextState{
    isSelectedTemp: boolean;    //选择模板创作 false：选择多轮对话
}

export const useTextStore = defineStore('text',{
    state: (): TextState => ({ 
        isSelectedTemp: false,
	}),
    actions: {
        setIsSelectTemp(val: boolean) {
            this.isSelectedTemp = val
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