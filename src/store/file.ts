import { defineStore } from 'pinia'

export interface FileState{
    selectFileInfo: object;      //用户选择的文件信息
}

export const useFileStore = defineStore('file',{
    state: (): FileState => ({ 
        selectFileInfo: {},
	}),
    actions: {
        setSelectFileInfo(val: object){
            this.selectFileInfo = val;
        }
    },
    // 持久化配置
    persist: [   
        {
            key: 'file-store',    
            storage: sessionStorage   
        }
    ]  
})