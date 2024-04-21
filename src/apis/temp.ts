//模板创作相关接口信息

import request from './request.ts';

/**
 *  获取全部模板
 */
export function fetchAllTemp() {
    return request.get('/modelChat/getModelList');
}

/**
 *  获取全部模板的历史记录
 */
export function fetchAllTempHistory() {
    return request.get('/modelChat/getRecords');
}

/**
 *   删除某个历史记录
 */
export function fetchDeleteTempHistory(params: any) {
    return request.get('/modelChat/deleteRecord',params);
}

/**
 *  使用模板进行对话
 */
export function fetchTempChat(params: any) {
    return request.get('/modelChat/chat',params);
}