import { defineStore } from 'pinia'
import { HISTORY } from '../content/text'

export interface TextState{
    isSelectedTemp: boolean;    //选择模板创作 false：选择多轮对话
    selectedTemp: object; //已选中模板信息
    isCreating: boolean;    //是否正在创作
    isTyping: boolean;     //是否在打字
    activeTypeText: string;  //打字效果的文本
    inputEl: any;           //打字的输入框
    activeTypeTextMul: string;  //打字效果的文本（多轮对话中）

    tempHistory: HISTORY[];     //模板创作的历史记录
}

export const useTextStore = defineStore('text',{
    state: (): TextState => ({ 
        isSelectedTemp: false,
        selectedTemp: {},
        isCreating: false,
        isTyping: false,
        activeTypeText: '',
        inputEl: null,
        activeTypeTextMul: '',
        tempHistory: [],
	}),
    actions: {
        setIsSelectTemp(val: boolean) {
            this.isSelectedTemp = val
        },
        setSelectedTemp(temp: object){
            this.selectedTemp = temp;
        },
        setIsCreating(val: boolean) {
            this.isCreating = val;
        },
        setIsTyping(val: boolean) {
            this.isTyping = val
        },
        setActiveTypeText(text: string) {
            this.activeTypeText = text;
        },
        setInputEl(val: any) {
            this.inputEl = val
        },
        setActiveTypeTextMul(val: string) {
            this.activeTypeTextMul = val;
        },
        setTempHistory(val: any) {
            this.tempHistory = val
        }
    },
    // 持久化配置
    persist: [   
        {
            key: 'text-store',    
            storage: sessionStorage   
        }
    ]  
})