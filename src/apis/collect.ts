//收藏相关接口

import request from './request.ts';

/**
 *  获取全部模板收藏列表
 */
export function fetchCollectListText() {
    return request.get('/collect/getAllModelCollects');
}

/**
 *  收藏模板创作历史记录
 */
export function fetchCollectTemp(params: any) {
    return request.post('/collect/collectModelRecord',params);
}

/**
 *  取消收藏收藏模板创作历史记录
 */
export function fetchCancelCollectTemp(params: any) {
    return request.get('/collect/cancelModelCollect',params);
}