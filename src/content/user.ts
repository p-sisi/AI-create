export const BASE_URL = 'http://10.33.109.246:8088'

//登录返回的用户信息接口
export interface USER_INFO {
    userId: number,        //用户id
    nickname: string,      //用户昵称
    headImg: any,          //用户头像
}