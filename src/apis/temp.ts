//模板创作相关接口信息

import request from './request.ts';

/**
 *  获取全部模板
 */
export function fetchAllTemp() {
    return request.get('/modelChat/getModelList');
}