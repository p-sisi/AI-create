<template>
    <div class="container">
        <!-- 左边对话管理 -->
        <div class="container-left">
            <!-- 新建对话 -->
            <el-button class="container-left-btn" @click="clickNewChat" color="#9c76f2">
                <el-icon style="margin-right: 8px;" ><Plus /></el-icon>New&nbsp;Chat
            </el-button>

            <div class="divide"></div>

            <!-- 对话列表 -->
            <el-scrollbar height="450px">
                <div
                    class="container-left-chat"
                    v-for="item in chatList"
                    :key="item.id"
                    @click="clickChat(item)"
                    >
                    <div class="chat-title" :class="{ 'selected': item.id === activeCollectRadio }">
                        <div class="chat-title-title">
                            <span>{{ item.title }}</span>
                        </div>
                        <div>
                            <el-dropdown trigger="click">
                                <el-icon style="margin-top: 8px;" v-show="item.id === activeCollectRadio"><MoreFilled /></el-icon>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item :icon="EditPen" @click="handleResetTitle(item)">编辑</el-dropdown-item>
                                        <el-dropdown-item :icon="Delete" @click="handleDeleteChat(item)">删除</el-dropdown-item>  
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>              
                    </div>
                </div>
            </el-scrollbar>
        </div>

        <!-- 右边对话区 -->
        <div class="container-right">
            <el-scrollbar height="450px" ref="chatScrollbar">
                <!-- 空状态图片 -->
                <div class="empty-img" v-if="!isClickChat">
                    <div class="empty-img-title">
                        <img src="/src/assets/images/logo.png" alt="">
                        <span>你好，我是你的AI智能助手</span>
                    </div>
                    <div class="empty-img-prop">我可以为你输出高效的文案，想点子，又能陪你聊天，期待与你的每一次互动！</div>
                    <span class="empty-img-prop" style="margin-top: 30px;margin-left: -800px;">你可以试着这样问我：</span>
                    <div style="display: flex;gap: 20px;">
                        <div class="empty-img-example" @click="handleClickExample1">
                            <div class="title">
                                <img src="/src/assets/images/wechat-friend.png" alt="">
                                <span>朋友圈文案</span>
                            </div>
                            <span class="content">你擅长写朋友圈文案：1.文案会吸引众人点赞；2.言简意赅，30字以内。输入主题：我得奖了</span>
                        </div>
                        <div class="empty-img-example" @click="handleClickExample2">
                            <div class="title">
                                <img src="/src/assets/images/traval.png" alt="">
                                <span>景点推荐</span>
                            </div>
                            <span class="content">你是一位经验丰富的导游，会结合旅游目的的天气、当地风俗习惯、游客预算以及时间规划安排做景点推荐，旅游目的地是：长沙</span>
                        </div>
                    </div>
                    <div class="empty-img-temp">
                        <span>我还提供了更加高效的提问方式,根据提示填写内容，即可快速生成</span>
                        <div class="btn" @click="router.push('/ai_text/temp')">前往模板创作</div>
                    </div>
                </div>  

                <!-- 对话记录 -->
                <div class="list-container" v-else>
                    <div 
                        class="list"
                        v-for="item in chatHistory"
                        :key="item.id"
                    >
                        <div class="list-item">
                            <span class="list-item-title">
                                <img v-if="item.role =='assistant'" src="/src/assets/images/logo.png" alt="">
                                <img v-else src="/src/assets/images/user.png" alt="">
                                <span v-if="item.role =='assistant'" class="title-content">AI-Create</span>
                                <span v-else class="title-content">You</span>
                            </span>
                            <div class="list-item-content">
                                <v-md-editor 
                                    v-model="item.content"    
                                    :disabled-menus="[]"
                                    >
                                </v-md-editor>
                            </div>
                        </div>
                    </div> 
                    <!-- 生成状态卡片 -->
                    <div v-if="isGenerating || isTyping">
                        <div class="list-item">
                            <span class="list-item-title">
                                <img src="/src/assets/images/logo.png" alt="">
                                <span class="title-content">AI-Create</span>
                            </span>
                            <div v-if="isGenerating || isTyping">
                                <el-skeleton class="list-item-content" :rows="3" animated v-if="isGenerating"/>
                                <div class="list-item-content" v-if="isTyping">
                                    <v-md-editor 
                                    v-model="generateResult"    
                                    :disabled-menus="[]"
                                    >
                                    </v-md-editor>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref="historyItemRef"></div>
                </div> 
            </el-scrollbar>

            <!-- input问答框 -->
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

        <!-- 删除对话对话框 -->
        <el-dialog
            v-model="deleteDialogVisible"
            title="提示"
            width="400"
        >
            <span>确定删除该对话<span style="font-size: 18px;font-weight: 600;margin-left: 10px;">{{ selectChat.title }}</span></span>
            <div>删除后对话记录将无法恢复</div>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteChatRequest()">删除</el-button>
            </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useTextStore } from '@/store';
import { fetchChatList, fetchChatHistory, fetchDeleteChat, fetchNewChat, fetchChat } from '../../apis/multiple' 
import { ElMessage } from 'element-plus';
import { EditPen, Delete, Plus, DocumentCopy, MoreFilled} from '@element-plus/icons-vue';
import router from '@/router/index.ts';

onMounted(() => {
    getAllChatList()
})

const textStore = useTextStore();

const isClickChat = ref(false);     //是否点击了对话，没点击就展示提示语

const chatList = ref();     //对话列表数据

/**
 *  获取全部对话数据
 */
const getAllChatList = async() => {
    try {
        const result = await fetchChatList();
        chatList.value = result.data
    } catch (error: any) {
        ElMessage.error(error.message)
    }
} 

const chatHistory = ref();      //对话的历史记录

const historyItemRef = ref();   //历史记录item的ref

/**
 *  点击对话列表
 */
const activeCollectRadio = ref(); //当前激活的对话标题
const selectChat = ref();       //当前选择的对话

const clickChat = async (item: any) => {
    //展示对话历史
    isClickChat.value = true;
    //改变激活的标题
    activeCollectRadio.value = item.id;
    selectChat.value = item;
    //获取对话的历史记录
    try {
        const result = await fetchChatHistory({
            chatId: item.id
        })
        chatHistory.value = result.data;
        //等待DOM渲染之后，滚动到最底部
        await nextTick();
        historyItemRef.value.scrollIntoView({ behavior: 'smooth' });
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const isNewChat = ref(false);   //是否为新对话

//点击提问示例
const handleClickExample1  = () => {
    isNewChat.value = true;
    activeCollectRadio.value = null
    inputQuestion.value = '你擅长写朋友圈文案：1.文案会吸引众人点赞；2.言简意赅，30字以内。输入主题：我得奖了'
    inputQuestionRef.value.focus();
}
const handleClickExample2  = () => {
    isNewChat.value = true;
    activeCollectRadio.value = null
    inputQuestion.value = '你是一位经验丰富的导游，会结合旅游目的的天气、当地风俗习惯、游客预算以及时间规划安排做景点推荐，旅游目的地是：长沙'
    inputQuestionRef.value.focus();
}

//新对话
const clickNewChat = () => {
    //新对话，发送问题时需要先发送新建对话的请求
    isNewChat.value = true;
    //展示提示语，不展示历史记录
    isClickChat.value = false;
    //当前激活对话设为空
    activeCollectRadio.value = null
    //对话框获得焦点
    inputQuestionRef.value.focus();
}

//编辑对话标题
const handleResetTitle = (item: any) => {

}

//删除对话
const deleteDialogVisible = ref(false);
const handleDeleteChat = (item: any) => {
    deleteDialogVisible.value = true;
    selectChat.value = item
}
const deleteChatRequest = async () => {
    try {
        await fetchDeleteChat({
            chatId: selectChat.value.id
        })
        ElMessage.success('删除成功')
        deleteDialogVisible.value = false;
        getAllChatList();

        //将当前激活的标题设为删除的下一个对话，如果当前激活的是当前删除的对话的话，且当前创作区变成上一个对话的历史记录
        if(activeCollectRadio.value == selectChat.value.id) {
            debugger
            activeCollectRadio.value = chatList.value[chatList.value.length - 2].id
        }
        clickChat(chatList.value[chatList.value.length - 2])
    }catch (error: any) {
        ElMessage.error(error.message)
    }
}

//打字文本动态输入
const generateResult = computed({
    get: () => textStore.activeTypeTextMul || '',
    set: (value: any) => textStore.setActiveTypeTextMul(value)
});

const inputQuestion = ref('');      //输入的问题
const inputQuestionRef = ref(null); 
const inputValue = ref('');         //暂存输入的问题，为了生成状态时，清除不会清空生成卡片中问题

const isGenerating = ref(false);    //是否在生成内容
const isTyping = ref(false);        //是否在打字

const newChatId = ref();        //新对话的id

/**
 *  发送问题：如果是新对话，需要先创建对话
 */
const sendQuestion = async() => {
    if(isGenerating.value == true || isTyping.value == true) return ElMessage.error('正在生成中，请稍后')
    if(inputQuestion.value == '') {
        inputQuestionRef.value.focus();
        return ElMessage.error('问题不能为空')
    }
    inputValue.value = inputQuestion.value;
    //新对话
    if(isNewChat.value == true) {
        //先清空历史记录
        chatHistory.value = [];
        const result = await fetchNewChat({
            title: inputQuestion.value.slice(0, 10)
        })
        newChatId.value = result.data;
        //重新获取对话列表，并设置当前选中的对话为当前新建的标题
        getAllChatList()
        activeCollectRadio.value = newChatId.value
        isNewChat.value = false;
    }
    isClickChat.value = true;
    //设置状态为生成中,非打字
    isGenerating.value = true;
    await nextTick();
    historyItemRef.value.scrollIntoView({ behavior: 'smooth' });
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
        chatHistory.value.push(newChat)
        const result = await fetchChat(chatHistory.value,activeCollectRadio.value);

        //请求成功，清除input文本内容
        inputQuestion.value = ''
        isGenerating.value = false;
        textStore.setActiveTypeTextMul('');
        const typeText = result.data.answer.content; 
        await nextTick();

        isTyping.value = true;
        let i = 0;
        const timer2 = setInterval(async () => {
            textStore.setActiveTypeTextMul(textStore.activeTypeTextMul + typeText.charAt(i));
            await nextTick();
            historyItemRef.value.scrollIntoView({ behavior: 'smooth' });
            i++;
            if (i > typeText.length) {
                //打字结束，设置打字状态为false，清除打字计时器
                isTyping.value = false;
                //新的提问已经加入到历史记录里，需要把新的问题加入，并重新请求历史记录
                chatHistory.value.push(result.data.answer)
                clearInterval(timer2);
                historyItemRef.value.scrollIntoView({ behavior: 'smooth' });
            }
        }, 20);//50:打字速度
    } catch (error: any) {  
        ElMessage.error(error.message)
    }
}

</script>

<style scoped lang="scss">
::v-deep .v-md-editor__toolbar{
    display: none;
}
::v-deep .v-md-editor__editor-wrapper {
    display: none;
}
::v-deep .vuepress-markdown-body:not(.custom) {
    padding: 4px;
}
::v-deep .vuepress-markdown-body {
    font-size: 14px;
    color: #fff;
    background:linear-gradient(to right, #0b0a0c, #161a1c);
}
.container {
    height: 90vh;
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    gap: 20px;
    background:linear-gradient(to right, #0b0a0c, #161a1c);
    .container-left {
        width: 200px;
        height: 92%;
        margin: 10px;
        padding: 10px 20px;
        border-radius: 6px;
        background-color: #303032a4;
        overflow: hidden;
        .divide {
            height: 2px;
            width: 100%;
            text-align: center;
            margin-bottom: 10px;
            background-color: #fff;
            opacity: 0.3;
        }
        .container-left-btn {
            width: 100%;
            height: 40px;
            color: #fff;
            margin-bottom: 26px;
        }
        .container-left-chat {
            .chat-title {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                height: 30px;
                padding-left: 10px;
                padding-right: 16px;
                color: #fff;
                line-height: 30px;
                font-size: 13px;
                cursor: pointer;
                border-radius: 8px;
                margin-bottom: 10px;
                transition: all 0.9;
                .chat-title-title {
                    width: calc(100% - 20px);
                    overflow: hidden; 
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .selected {     
                background: #0f1012;
                font-size: 15px;
            }
            .chat-title:hover {
                background-color: #0f1012;
            }
            .isActiveChatItem {
                background-color: #fff;
            }
        }
    }

    .container-right {
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        margin-left: 180px;
        margin-bottom: 8px;
        .empty-img {
            display: flex;
            flex-flow: column nowrap;
            text-align: center;
            margin-top: 50px;
            .empty-img-title {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: -200px;
                gap: 10px;
                img {
                    width: 50px;
                }
                span {
                    font-weight: 600;
                    font-size: 24px;
                }
            }
            .empty-img-prop {
                font-size: 12px;
                color: #ccc;
                margin-top: 10px;
                margin-left: -100px;
            }
            .empty-img-temp {
                display: flex;
                margin-top: 30px;
                margin-left: -100px;
                align-items: center;
                justify-content: center;
                gap: 20px;
                span{
                    width: 300px;
                }
                div {
                    height: 30px;
                    padding: 10px 30px;
                    background-color: #b93bed;
                    border-radius: 30px;
                    line-height: 30px;
                    transition: all .4s;
                    cursor: pointer;
                }
                div:hover {
                    padding: 10px 40px;
                }
            }
            .empty-img-example {
                display: flex;
                width: 300px;
                height: 80px;
                margin-top: 20px;
                padding: 10px 20px;
                margin-left: 20px;
                flex-flow: column nowrap;
                align-items: flex-start;
                gap: 10px;
                border: 1px solid #d795f3;
                border-radius: 10px;
                transition: all 0.3s;
                cursor: pointer;
                .title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    img {
                        width: 30px;
                    }
                    span {
                        font-size: 16px;
                        font-weight: 600;
                    }
                }
                .content {
                    width: 100%;
                    font-size: 12px;
                    color: #ecebeb;
                    white-space: nowrap; /* 防止文本换行 */
                    overflow: hidden; /* 隐藏超出容器的文本部分 */
                    text-overflow: ellipsis;
                }
            }
            .empty-img-example:hover {
                margin-top: 16px;
                height: 80px;
            }
        }
        .list-container {
            width: 80%;
            margin-top: 10px;
                .list-item {
                    display: flex;
                    margin-bottom: 30px;
                    flex-flow: column nowrap;
                    img {
                        width: 30px;
                    }
                    .list-item-title {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        .title-content {
                            font-weight: 600;
                        }
                    }
                    .list-item-content {
                        margin-left: 40px;
                        font-size: 14px;
                    }
                }
        }
        .chat-input {
            max-width: 80%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, 0.3);
            ::v-deep .el-textarea__inner {
                padding: 8px 10px 8px 10px;
                border-radius: 14px;
                font-size: 14px;
                color: black;
                resize: none;
            }
            ::v-deep .el-textarea__inner:focus {
                box-shadow:0 0 0 2px #b545ee inset;
            }
            .chat-input-icon {
                width: 100%;
                display: flex;
                align-items: center;
                gap: 10px;
                .iconfont {
                    font-size: 30px;
                    cursor: pointer;
                    color:#fff;
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
}
//生成状态骨架屏
::v-deep .el-skeleton {
    --el-skeleton-color: #46454793;
    --el-skeleton-to-color: #22212231;
}
</style>