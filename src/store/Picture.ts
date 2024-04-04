import { defineStore } from 'pinia'

export interface PictureState{
    activeHeaderMenu: string,  //头部激活的菜单
}

export const usePictureStore = defineStore('picture',{
    state: (): PictureState => ({ 
        activeHeaderMenu: '创作区'
	}),
    getters: {

    },
    actions: {
        setActiveHeaderMenu(val: string) {
            this.activeHeaderMenu = val;
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