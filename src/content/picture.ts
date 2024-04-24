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

//收藏夹数据接口信息
export interface COLLECT_LIST {
    id: number;    
    title: string;  //图片说明
    filename: string;   //图片名字
    collectTime: string;//收藏时间
}


//图片解说接口数据信息
export interface PICTURE_TEXT_HISTORY {
    id: number;    
    userId: number; 
    filename: string;  //图片名字
    question: string;   //问题
    answer: string;     //回答
    createTime: string; //回答时间
}