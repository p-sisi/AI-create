import { defineStore } from 'pinia'
import { USER_INFO } from '../content/user'

export interface CommonState{
    hasLogin: boolean;      //用户是否登录
    userInfo: USER_INFO;       //用户基本信息
}

export const useCommonStore = defineStore('common',{
    state: (): CommonState => ({ 
        hasLogin: false,
        userInfo: {} as USER_INFO,
	}),
    actions: {
        setHasLogin(val: boolean){
            this.hasLogin = val;
        },
        setUserInfo(val: USER_INFO) {
            this.userInfo = val;
        },
        updateUserName(val: string) {
            this.userInfo.nickname = val;
        },
    },
    // 持久化配置
    persist: [   
        {
            key: 'common-store',    
            storage: sessionStorage   
        }
    ]  
})