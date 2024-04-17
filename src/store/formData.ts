import { defineStore } from 'pinia'

export interface FormDataState{
    selectedTemp: object; //已选中模板信息
    isCreating: boolean;    //是否正在创作
}

export const useFormDataStore = defineStore('formData',{
    state: (): FormDataState => ({ 
        selectedTemp: {},
        isCreating: false,
	}),
    getters: {

    },
    actions: {
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