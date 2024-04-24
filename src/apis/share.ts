//分享相关接口

import request from './request.ts';

/**
 *  分享
 */
export function fetchShare(params: any) {
    return request.get('/share/newOne',params);
}

/**
 *  获取分享列表
 */
export function fetchShareList() {
    return request.get('/share/getAllShares');
}

/**
 *  删除分享
 */
export function fetchDeleteShare(params: any) {
    return request.get('/share/delete',params);
}

/**
 *  点赞
 */
export function fetchLikeShare(params: any) {
    return request.get('/share/likeOne',params);
}

/**
 *  取消点赞
 */
export function fetchUnLikeShare(params: any) {
    return request.get('/share/cancelLike',params);
}