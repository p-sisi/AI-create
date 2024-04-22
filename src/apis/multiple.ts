//自由对话相关接口信息

import request from './request.ts';

/**
 *  新建对话
 */
export function fetchNewChat(params: any) {
    return request.get('/freeChat/newOne',params);
}

/**
 *  删除对话
 */
export function fetchDeleteChat(params: any) {
    return request.get('/freeChat/deleteOne',params);
}

/**
 *  获取全部对话列表
 */
export function fetchChatList() {
    return request.get('/freeChat/getAllChat');
}

/**
 *  获取某一对话的全部历史记录
 */
export function fetchChatHistory(params: any) {
    return request.get('/freeChat/getChatRecord',params);
}

/**
 *  进行对话
 */
export function fetchChat(params: any,chatId: number) {
    return request.post(`/freeChat/chat?chatId=${chatId}`,params);
}