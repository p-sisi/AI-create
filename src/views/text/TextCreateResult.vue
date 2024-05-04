<template>
    <div class="container">
       <div class="tips">
            <span class="iconfont icon-pre_icon_xuanchuanwuliao"></span>
            <div class="tips-top">历史生成记录最多可保存50条，遇到合适的答案可以点击“收藏”哦</div>
            <div class="tips-bottom">本页面生成内容均由人工智能生成，无法保证其完整性和准确性，仅供参考借鉴。</div>
       </div>

       <el-scrollbar max-height="465px">
       <div class="result">
            <el-skeleton style="width: 100%" :loading="isLoading" animated :count="2"  :throttle="500">
                <template #template>
                    <!-- 加载中骨架屏 -->
                    <div>
                        <el-skeleton-item variant="h4" style="width: 50%;margin: 10px;" />
                        <el-skeleton-item variant="h4" style="width: 80%;margin: 5px" />
                        <el-skeleton-item variant="h4" style="width: 30%;margin: 5px" />
                        <el-skeleton-item variant="image" style="width: 600px; height: 100px;margin: 10px;" />
                    </div>
                </template>
                <template #default>
                    <!-- 创作结果生成中时的中间状态：开始创作出现骨架屏，请求结果回来后开始打字 -->
                    <div class="result-dialogue" v-if="textStore.isCreating || textStore.isTyping">
                        <div class="dialogue-question">
                            <img :src="textStore.selectedTemp.modelImg" alt="">
                            <div>{{ textStore.selectedTemp.title }}</div>
                        </div>
                        <div class="dialogue-answer">
                           <div class="create-skeleton" v-if="textStore.isCreating || textStore.isTyping">
                                <el-skeleton :rows="3" animated  v-if="textStore.isCreating "/>
                                <!-- 打字状态的文本generateResult -->
                                <div v-if="textStore.isTyping == true">
                                    <v-md-editor 
                                        v-model="generateResult"    
                                        :disabled-menus="[]"
                                    >
                                    </v-md-editor>
                                </div>
                           </div>
                        </div>
                    </div>
                    <!-- 历史记录数据 -->
                    <div 
                        class="result-dialogue" 
                        v-for="item in textStore.tempHistory"
                        :key="item.id">
                        <div class="dialogue-question">
                            <img :src="`${BASE_URL}/file/images/${item.modelImg}`" alt="">
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                :content="item.question"
                                placement="top-start"
                            >
                                <div>{{ item.modelTitle }}</div>
                            </el-tooltip>
                        </div>
                        <div class="dialogue-answer">
                            <v-md-editor 
                                v-model="item.answer"    
                                :disabled-menus="[]"
                            >
                            </v-md-editor>
                        </div>
                        <div class="dialogue-footer">
                            <div>
                                <span>生成&nbsp;{{ item?.answer.replace(/\s+/g, '').length }}&nbsp;字</span>
                                <el-divider direction="vertical" />
                                <span>{{ getStringTime(item.createTime) }}</span>
                            </div>
                            <div>
                                <span class="iconfont ai-no-collect" v-if="item.collect == false" @click="handleCollect(item)"></span>
                                <span class="iconfont ai-collect" v-if="item.collect == true" @click="handleCancelCollect(item)"></span>
                                <el-divider direction="vertical" />
                                <span class="iconfont ai-copy" @click="handleCopy(item.answer)"></span>
                                <el-divider direction="vertical" />
                                <el-popconfirm
                                    confirm-button-text="Yes"
                                    cancel-button-text="No"
                                    :icon="InfoFilled"
                                    icon-color="#626AEF"
                                    title="确定删除该历史记录？删除后无法恢复"
                                    @confirm="handleDelete(item)"
                                >
                                    <template #reference>
                                        <span class="iconfont ai-delete"></span>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </div>
                    </div>
                </template>
            </el-skeleton>
       </div>
       </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue'
import { BASE_URL } from '../../content/user'
import { getStringTime } from '../../utils/index'
import { useTextStore } from '@/store';
import { fetchAllTempHistory, fetchDeleteTempHistory  } from '../../apis/temp'
import { fetchCollectTemp, fetchCancelCollectTemp  } from '../../apis/collect'

const textStore = useTextStore();

const isLoading = ref(true);   //页面加载

//打字文本动态输入
const generateResult = computed({
    get: () => textStore.activeTypeText || '',
    set: (value: any) => textStore.setActiveTypeText(value)
});

//获取input框文本，存在store中，供模板组件使用
const inputEl = document.querySelector('.generate-result-input') as HTMLElement;
textStore.setInputEl(inputEl)

//复制
const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            ElMessage.success('复制成功！')
        })
        .catch((error: any) => {
            ElMessage.error(error.message)
        })
}

/**
 *  获取模板列表历史记录请求
 */
 const getTempDataListHistoryRequest = async () => {
    try {
        const result = await fetchAllTempHistory();
       textStore.setTempHistory(result.data.reverse());
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

/**
 *  删除历史记录
 * @param item 
 */
const handleDelete = async(item: any) => { 
    try {
        await fetchDeleteTempHistory({
            recordId: item.id
        })
        ElMessage.success('删除成功');
        getTempDataListHistoryRequest()
    } catch (error:any) {
        ElMessage.error(error.message)
    }
}

/**
 *  收藏
 */
const handleCollect = async(item: any) => {
    try {
        const params = {
            answer: item.answer,
            modelId: item.modelId,
            question:item.question,
            recordId: item.id
        }
        await  fetchCollectTemp(params)
        ElMessage.success('收藏成功')

        getTempDataListHistoryRequest()
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

/**
 *     取消收藏
 */
 const handleCancelCollect = async(item: any) => {
    try {
        const params = {
            recordId: item.id
        }
        await  fetchCancelCollectTemp(params)
        ElMessage.success('取消收藏')

        getTempDataListHistoryRequest()
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

onMounted(() => {
    setTimeout(() => {
        isLoading.value = false;
        getTempDataListHistoryRequest();
    }, 2000);   
})
</script>

<style lang="scss" scoped>
//MarkDown样式
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
    background-color:#212121;
}
.container {
    .tips {
        color: #85888b;
        font-size: 12px;
        text-align: center;
        margin-bottom: 10px;
        .iconfont {
            margin-left: -380px;
            color: #62effe;
        }
        &-top {
            margin-top: -22px;
        }
    }
    .result {
        width: 100%;
        .result-dialogue {
            width: 90%;
            min-height: 100px;
            background: #212121;
            border-radius: 10px;
            margin: 10px 20px;
            .dialogue-question {
                display: flex;
                gap: 6px;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: flex-start;
                height: 50px;
                padding-left: 10px;
                border-bottom: 1px solid #bd70e6;
                img {
                    width: 25px;
                    height: 25px;
                }
            }
            .dialogue-answer {
                padding: 20px;
                font-size: 14px;
            }
            .dialogue-footer {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                padding:  10px 20px;
                font-size: 14px;
                color: #85888b;
                .iconfont {
                    cursor: pointer;
                }
                .iconfont:hover {
                    color: #bd70e6;
                }
                .ai-collect {
                    color: #bd70e6;
                }
                .ai-delete:hover {
                    color: #bd70e6;
                }
            }
        }
    }
}
::v-deep .el-skeleton {
    --el-skeleton-color: #0b0a0c93;
    --el-skeleton-to-color: #212121;
}
.create-skeleton {
    ::v-deep .el-skeleton {
        --el-skeleton-color: #303032;
        --el-skeleton-to-color: #212121;
    }
}
</style>