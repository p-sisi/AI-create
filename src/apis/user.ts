//登录注册相关请求

import request from './request.ts';

/**
 *  注册--需要发送邮箱验证
 */
export function fetchSignUp(params: any) {
    return request.post('/user/register', params);
}

/**
 *  登录---通过账号密码
 */
export function fetchLoginIn(params: any) {
    return request.post('/user/login', params);
}

/**
 *  登录---通过邮箱验证码
 */
export function fetchLoginInByEmail(params: any) {
    return request.get('/user/loginByEmail', params);
}

/**
 *  退出登录
 */
export function fetchLoginOut(params: any) {
    return request.get('/user/logout', params);
}

/**
 *  发送邮箱验证码
 */
export function fetchSendVerifyCode(params: any) {
    return request.get('/user/sendEmailCode', params);
}