//历史记录接口类型
export interface HISTORY {
    id: number;     //记录Id
    modelId: number;    //生成该记录的模板id
    modelImg: string;   //模板logo
    modelTitle: string; //模板标题
    question: string;   //问题
    answer: string;     //回答
    createTime: string; //提问时间
    collect: boolean;   //是否收藏
}

//收藏列表接口数据
export interface TEMP_COLLECT {
    id: number;     //收藏id
    recordId: number;   //收藏的历史记录id
    modelId:  number;   //收藏的相关模板id
    modelImg: string;   //收藏的相关模板logo
    question: string;   //收藏的问题
    answer: string;     //收藏的答案
    collectTime: string;    //Date格式，收藏时间
}