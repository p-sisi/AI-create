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