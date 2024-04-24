//图片类创作相关接口信息
import request from './request.ts';

//文生图
/**
 *  获取历史记录
 */
export function fetchHistoryTextTo() {
    return request.get('/textToImage/getAllRecord');
}

/**
 *  文生图创作
 */
export function fetchTextToPictureCreate(params: any) {
    return request.get('/textToImage/textToImage',params);
}

/**
 *  删除文生图创作历史
 */
export function fetchDeleteTextToPictureHistory(params: any) {
    return request.get('/textToImage/deleteRecord',params);
}

/**
 *  获取所有图片的收藏
 */
export function fetchAllCollectImage() {
    return request.get('/collect/getAllImageCollects');
}

/**
 *  收藏图片
 */
export function fetchCollectImage(params: any) {
    return request.post('/collect/collectImage',params);
}

/**
 *  取消收藏图片
 */
export function fetchCancelCollectImage(params: any) {
    return request.get('/collect/cancelImageCollect',params);
}



//图生文
/**
 *  获取历史记录
 */
export function fetchHistoryPictureTo() {
    return request.get('/talkImage/getAllRecord');
}