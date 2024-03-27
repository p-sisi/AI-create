<template>
    <div class="container">
       <div class="tips">
            <span class="iconfont icon-pre_icon_xuanchuanwuliao"></span>
            <div class="tips-top">历史生成记录最多可保存50条，遇到合适的答案可以点击“收藏”哦</div>
            <div class="tips-bottom">本页面生成内容均由人工智能生成，无法保证其完整性和准确性，仅供参考借鉴。</div>
       </div>

       <el-scrollbar max-height="465px">
       <div class="result">
            <div 
                class="result-dialogue" 
                v-for="item in RESULT"
                :key="item.id">
                <div class="dialogue-question">
                    <!-- FIXME：图片需要根据后端返回类型值判断应该显示哪一张图片，另一个想法：如果是对话类型的则显示一问一答样式 -->
                    <img src="../assets/images/logo.png" alt="">
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
                        <span class="iconfont icon-icon-uncollect" v-if="item.is_collect == false" @click="handleCollect(item)"></span>
                        <span class="iconfont icon-icon-collect" v-if="item.is_collect == true" @click="handleUnCollect(item)"></span>
                        <el-divider direction="vertical" />
                        <span class="iconfont icon-icon-copy" @click="handleCopy(item.answer)"></span>
                    </div>
                </div>
            </div>
       </div>
       </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { RESULT } from '../content'

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
                .icon-icon-collect {
                    color: #bd70e6;
                }
            }
        }
    }
}
</style>