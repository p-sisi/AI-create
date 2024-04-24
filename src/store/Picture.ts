import { defineStore } from 'pinia'

export interface PictureState{
    activeHeaderMenu: string,  //头部激活的菜单
    activeTypeText: string;     //图片生成文本中的打字文本
}

export const usePictureStore = defineStore('picture',{
    state: (): PictureState => ({ 
        activeHeaderMenu: '创作区',
        activeTypeText: ''
	}),
    getters: {

    },
    actions: {
        setActiveHeaderMenu(val: string) {
            this.activeHeaderMenu = val;
        },
        setActiveTypeText(val: string) {
            this.activeTypeText = val
        }
    },

    // 持久化配置
    persist: [   
        {
            key: 'picture-store',    
            storage: sessionStorage   
        }
    ]  
})