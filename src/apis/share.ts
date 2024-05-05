//分享相关接口

import request from './request.ts';

/**
 *  分享
 */
export function fetchShare(params: any) {
    return request.get('/share/newOne',params);
}

/**
 *  获取全部分享列表
 */
export function fetchShareList() {
    return request.get('/share/getAllShares');
}

/**
 *  获取我的分享列表
 */
export function fetchMyShareList() {
    return request.get('/share/getMyShares');
}

/**
 *  删除分享
 */
export function fetchDeleteShare(params: any) {
    return request.get('/share/delete',params);
}

/**
 *  获取我的点赞列表
 */
export function fetchMyLikeList() {
    return request.get('/share/getMyLikes');
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