//文档类相关接口

import request from './request.ts';

/**
 *  获取文档历史记录列表
 */
export function fetchFileList() {
    return request.get('/docChat/getAllChat')
}

/**
 *  获取当个文档的对话记录
 */
export function fetchFileChatHistory(params: any) {
    return request.get('/docChat/getChatRecord',params)
}

/**
 *  新建一个文档对话
 */
export function fetchNewFileChat(params: any) {
    return request.get('/docChat/newChat',params)
}

/**
 *  删除一个文档对话
 */
export function fetchDeleteFileChat(params: any) {
    return request.get('/docChat/deleteOne',params)
}

/**
 *  开始对话
 */
export function fetchNewChat(params: any,chatId: number) {
    return request.post(`/docChat/chat?chatId=${chatId}`,params)
}

/**
 *  获取对话的笔记
 */
export function fetchChatNote(params: any) {
    return request.get(`/docChat/getNote`,params)
}

/**
 *  更新对话的笔记
 */
export function fetchUpdateChatNote(params: any) {
    return request.get(`/docChat/updateNote`,params)
}