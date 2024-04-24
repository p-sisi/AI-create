//分享相关接口

import request from './request.ts';

/**
 *  分享
 */
export function fetchShare(params: any) {
    return request.get('/share/newOne',params);
}