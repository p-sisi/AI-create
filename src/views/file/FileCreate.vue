<template>
    <div class="container">
        <!-- 头部 -->
        <div class="header" >
            <span class="header-back" @click="router.push('/ai_file/file_home')">< 返回列表</span>
            <span style="margin-left: 40px;font-weight: 600;">{{ fileStore.selectFileInfo.title }}</span>
        </div>

        <!-- 内容部分 -->
        <div class="body">
            <!-- 左边文档预览 -->
            <div class="body-file">
                <iframe class="body-file-iframe" :src="src"></iframe>
            </div>
            
            <!-- 右边文档问答 -->
            <div class="body-chat">
                <div class="body-chat-tabs">
                    <div :class="{'active': isShowChat}" @click="isShowChat = true">对话</div>
                    <div :class="{'active': !isShowChat}" @click="handleClickNote">笔记</div>
                </div>

                <!-- 对话 -->
                <div class="chat" v-if="isShowChat">
                    <!-- 一直都显示的提示 -->
                    <el-scrollbar height="400px" >
                    <div>
                        <div class="chat_tips">
                            <img src="../../assets/images/logo.png" alt="">
                            <div>你好，我是你的AI文档阅读助手，你可以基于文档内容向我提出问题，你还可以让我帮你总结文档内容、书写文档目录等</div>
                        </div>
                    </div>
                    <!-- 对话记录 -->
                    <div class="chat-list" v-for="item in chatHistoryShow" :key="item.id">
                        <div v-if="item.role =='assistant'" class="chat-list-assistant">
                            <img src="/src/assets/images/logo.png" alt="">
                            <div style="display: flex;flex-direction: column;">
                                <span>{{ item.content }}</span>
                                <div class="add-note" @click="addToNote(item)">
                                    <span class="iconfont ai-note"></span>
                                    添加到笔记
                                </div>
                            </div>
                        </div>
                        <div v-else class="chat-list-user">
                            <img src="/src/assets/images/ball.png" alt="">
                            <div>{{ item.content }}</div>
                        </div>
                    </div> 
                    <!-- 生成状态卡片 -->
                    <div class="chat-list" v-if="isGenerating || isTyping">
                        <img src="/src/assets/images/logo.png" alt="">
                        <div v-if="isGenerating || isTyping">
                            <el-skeleton :rows="3" animated v-if="isGenerating"/>
                            <div  v-if="isTyping">{{ generateResult }}</div>
                        </div>
                    </div>
                    </el-scrollbar>

                    <div class="chat-input">
                        <div class="chat-input-icon">
                            <el-input 
                                ref="inputQuestionRef"
                                v-model="inputQuestion" 
                                placeholder="Please input question" 
                                :autosize="{ minRows: 2, maxRows: 5 }"
                                type="textarea"
                            />
                            <el-tooltip effect="dark" content="开始提问" placement="top">
                                <span class="iconfont ai-send" @click="sendQuestion"></span>
                            </el-tooltip>
                        </div>
                        <span class="chat-input-tip">生成内容均由人工智能生成，无法保证其完整性和准确性，仅供参考借鉴。</span>
                    </div>
                </div>
                <!-- 笔记 -->
                <div class="note" v-else>
                    <el-scrollbar height="430px" >
                    <div class="note-content">
                            {{ note }}
                    </div>
                    </el-scrollbar>
                   <div class="note-footer">
                        <el-button type="primary" @click="saveNoteRequest()" color="#b73fed">保存</el-button>
                   </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref, nextTick, computed } from 'vue'
import router from '@/router/index.ts';
import { fetchFileChatHistory, fetchNewChat, fetchChatNote, fetchUpdateChatNote } from '../../apis/file' ;
import { ElMessage } from 'element-plus';
import { useFileStore } from '../../store'

onMounted(() => {
    getChatFileHistory();
    getChatNote();
})

const fileStore = useFileStore();

const src = `http://10.33.109.246:8088/file/files/${fileStore.selectFileInfo.depositFilename}`;

interface HISTORY {
    id: number;
    chatId: number;
    role: string;
    content: string;
    createTime: any;
} 

const chatHistory: Ref<HISTORY[]> = ref([]);        //对话历史记录（去掉了第一条数据）

const chatHistoryShow = computed(()=> {
    return chatHistory.value.filter((item: any) => item.role != 'system')
})   //用于渲染的历史记录

const chatHistoryDelete = ref() //删除的那个第一条数据

/**
 *  根据路由上参数，获取文档的历史对话记录
 */
const getChatFileHistory = async () => {
    try {
        const result = await fetchFileChatHistory({
            chatId: +router.currentRoute.value.query.chatId 
        })
        //结果去掉第一个，因为第一个是文档解析内容
        chatHistory.value = result.data;
        chatHistoryDelete.value = chatHistory.value.shift();
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const isShowChat = ref(true);   //展示对话、笔记

const note = ref(); //笔记内容
const noteData = ref();     //笔记数据
/**
 *   页面首次加载时获取笔记内容，后面不断添加，但是不请求获取，只发送编辑请求
 */
const getChatNote = async() => {
    try {
        const result = await fetchChatNote({
            chatId: +router.currentRoute.value.query.chatId 
        })
        note.value = result.data.content;
        noteData.value = result.data;
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}
const handleClickNote = () => {
    isShowChat.value = false
}

/**
 * 添加内容到笔记中
 * 自动发送保存的请求
 * @param item AI回答的内容
 */
const addToNote = (item: any) => {
    note.value = note.value + item.content;
    isShowChat.value = false;

    saveNoteRequest();
}

/**
 *    保存笔记的请求
 */
const saveNoteRequest = async () => {
    try {
        await fetchUpdateChatNote({
            noteId: noteData.value.id,
            title: '',
            content: note.value,
        })
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const inputQuestion = ref('');  //用户输入的问题
const inputQuestionRef = ref(null); 

const isGenerating = ref(false);    //是否在生成内容
const isTyping = ref(false);        //是否在打字
const generateResult = ref('');      //打字文本

/**
 *  发送问题
 */
 const sendQuestion = async() => {
    if(inputQuestion.value == '') {
        inputQuestionRef.value.focus();
        return ElMessage.error('问题不能为空')
    }
    //设置状态为生成中,非打字
    isGenerating.value = true;
    isTyping.value = false;

    //发送提问请求，生成打字文本
    try {
        const newChat = {
            chatId: 0,
            content: inputQuestion.value,
            createTime: 0,
            id: 0,
            role: 'user',
        }
        //添加获取历史记录时去掉的第一个元素和用户输入的问题,展示的元素不需要添加
        chatHistory.value.unshift(chatHistoryDelete.value);
        chatHistory.value.push(newChat)
        const result = await fetchNewChat(chatHistory.value,+router.currentRoute.value.query.chatId );

        inputQuestion.value = ''
        isGenerating.value = false;
        generateResult.value = '';
        const typeText = result.data.answer.content;
        await nextTick();

        isTyping.value = true;
        let i = 0;
        const timer2 = setInterval(async () => {
            generateResult.value = generateResult.value + typeText.charAt(i);
            await nextTick();
            i++;
            if (i > typeText.length) {
                //打字结束，设置打字状态为false，清除打字计时器
                isTyping.value = false;
                //新的提问已经加入到历史记录里，需要把新的问题加入，并重新请求历史记录
                chatHistory.value.push(result.data.answer);
                getChatFileHistory();
                clearInterval(timer2);
            }
        }, 20);//50:打字速度
    } catch (error: any) {  
        ElMessage.error(error.message)
    }
}
</script>

<style scoped lang="scss">
.container {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    overflow: hidden;
    color: #000;
}
.header {
    height: 50px;
    padding: 10px 20px;
    color: #000;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    .header-back:hover {
        color: #b73fed;
        cursor: pointer;
        }
}

.body {
    height: calc(100vh - 60px);
    width: 100%;
    display: flex;
    .body-file {
        width: 45%;
        height: 100%;
        border-right: 1px solid #ccc;
        .body-file-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    }
    .body-chat {
        width: 55%;
        height: 100%;
        .body-chat-tabs {
            display: flex;
            gap: 30px;
            padding: 10px 20px 0 20px;
            cursor: pointer;
            border-bottom: 1px solid #ccc;
            div {
                padding-bottom: 10px;
                padding: 0px 20px 10px 20px;
            }
        }
        .active {
            color: #b73fed;
            border-bottom: 2px solid #b73fed;
        }
        .chat {
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
            padding: 20px;
            .chat_tips, .chat-list {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                font-size: 14px;
                padding-bottom: 10px;
                margin-top: 10px;
                img {
                    width: 40px;
                    height: 40px;
                }
            }
            .chat-list {
                .chat-list-assistant,.chat-list-user {
                    width: 100%;
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                    .add-note {
                        width: 80px;
                        padding: 4px 8px;
                        margin-top: 20px;
                        font-size: 12px;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        transition: all 0.3s;
                    }
                    .add-note:hover {
                        border: 1px solid #b73fed;
                        color: #b73fed;
                        cursor: pointer;
                    }
                }
                .chat-list-user {
                    background-color: #efecec6c;
                    border-radius: 8px;
                    padding: 10px 0;
                }
            }
            .chat-input {
                max-width: 90%;
                display: flex;
                margin-left: 40px;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                ::v-deep .el-textarea__inner {
                    padding: 8px 10px 8px 10px;
                    border-radius: 14px;
                    font-size: 14px;
                    color: black;
                    resize: none;
                }
                ::v-deep .el-textarea__inner:focus {
                    box-shadow:0 0 0 1px #b545ee inset;
                }
                .chat-input-icon {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, 0.3);
                    .iconfont {
                        font-size: 30px;
                        cursor: pointer;
                        color: #ccc;
                    }
                    .iconfont:hover {
                        color: #b545ee;
                    }
                }
                .chat-input-tip {
                    color: #ccc;
                    font-size: 12px;
                }
            }

        }
        .note {
            padding: 30px;
            .note-footer {
                padding-top: 10px;
                margin-right: 40px;
                display: flex;
                justify-content: flex-end;
                box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, 0.3);
            }
        }
    }
}


</style>