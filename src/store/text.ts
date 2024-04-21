import { defineStore } from 'pinia'

export interface TextState{
    isSelectedTemp: boolean;    //选择模板创作 false：选择多轮对话
    selectedTemp: object; //已选中模板信息
    isCreating: boolean;    //是否正在创作
}

export const useTextStore = defineStore('text',{
    state: (): TextState => ({ 
        isSelectedTemp: false,
        selectedTemp: {},
        isCreating: false,
	}),
    actions: {
        setIsSelectTemp(val: boolean) {
            this.isSelectedTemp = val
        },
        setSelectedTemp(temp: object){
            this.selectedTemp = temp;
        },
        setIsCreating(val: boolean) {
            this.isCreating = val;
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