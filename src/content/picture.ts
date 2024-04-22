//文生图历史记录接口信息
export interface TEXT_PICTURE_HISTORY {
    id: number;     
    text: string;   //文生图的文本
    image1: string; //第一张图片
    image2: string; //
    image3: string; //
    createTime: string; //创作时间
    collect1: boolean;  //第一张图片是否收藏
    collect2: boolean;  //
    collect3: boolean;  //
}