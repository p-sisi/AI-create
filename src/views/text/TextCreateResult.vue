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
                    <!-- 加载完成数据 -->
                    <div 
                        class="result-dialogue" 
                        v-for="item in RESULT"
                        :key="item.id">
                        <div class="dialogue-question">
                            <!-- FIXME：图片需要根据后端返回类型值判断应该显示哪一张图片，另一个想法：如果是对话类型的则显示一问一答样式 -->
                            <img src="../../assets/images/logo.png" alt="">
                            <div>{{ item.tempTitle }}</div>
                        </div>
                        <div class="dialogue-answer">{{ item.answer }}</div>
                        <div class="dialogue-footer">
                            <div>
                                <span>生成&nbsp;{{ item.answer.replace(/\s+/g, '').length }}&nbsp;字</span>
                                <el-divider direction="vertical" />
                                <span>{{ item.create_time }}</span>
                            </div>
                            <div>
                                <span class="iconfont ai-no-collect" v-if="item.is_collect == false" @click="handleCollect(item)"></span>
                                <span class="iconfont ai-collect" v-if="item.is_collect == true" @click="handleUnCollect(item)"></span>
                                <el-divider direction="vertical" />
                                <span class="iconfont ai-copy" @click="handleCopy(item.answer)"></span>
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
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { RESULT } from '@/content'

const isLoading = ref(false);   //页面加载

//复制
const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            ElMessage.success('复制成功！')
        })
        .catch((error) => {
            ElMessage.error('复制失败')
        })
}

//收藏
const handleCollect = (item: any) => {
    ElMessage.success('点击收藏')
}

//取消收藏
const handleUnCollect = (item: any) => {
    ElMessage.success('取消收藏')
}

onMounted(() => {
    //TODO:获取历史记录后，将isLoading设置为false
    // isLoading.value = false;
})
</script>

<style lang="scss" scoped>
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
            background: #0b0a0c;
            border-radius: 10px;
            margin: 10px 20px;
            .dialogue-question {
                display: flex;
                flex-flow: row nowrap;
                height: 50px;
                border-bottom: 1px solid #bd70e6;
                img {
                    margin: 4px 8px 0px 10px;
                    width: 40px;
                    height: 40px;
                }
                div {
                    margin-top: 12px;
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
            }
        }
    }
}
::v-deep .el-skeleton {
    --el-skeleton-color: #0b0a0c93;
    --el-skeleton-to-color: #0b0a0c31;
}
</style>