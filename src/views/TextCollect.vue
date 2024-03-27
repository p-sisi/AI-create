<template>
    <div class="collect">
       <div class="collect-container" v-for="item in COLLECTION_LIST" :key="item.id">
           <div class="title">
            <!-- FIXME：图片需要根据后端返回类型值判断应该显示哪一张图片 -->
                <img src="../assets/images/logo.png" alt="">
                <div>{{ item.title }}</div>
           </div>
           <div class="divider"></div>
           <div class="content">
            <el-scrollbar max-height="290px" :min-size="10">
                <div>{{ item.answer }}</div>
           </el-scrollbar>
           </div>

           <div class="footer">
                <div class="footer-time">{{item.createTime}}</div>
                <div class="footer-icon">
                    <span class="iconfont icon-icon-copy" @click="handleCopy(item.answer)"></span>
                    <el-divider direction="vertical" />
                    <el-popconfirm
                        confirm-button-text="删除"
                        cancel-button-text="取消"
                        title="确定删除该收藏？"
                        @confirm="confirmEvent(item)"
                        @cancel="cancelEvent(item)"
                    >
                        <template #reference>
                            <span class="iconfont icon-icon-delete"></span>
                        </template>
                    </el-popconfirm>
                </div>
           </div>
       </div>
    </div>
</template>

<script setup lang="ts">
import { COLLECTION_LIST } from '../content/index'
import { ElMessage } from 'element-plus';

const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            ElMessage.success('复制成功')
        })
        .catch((error) => {
            ElMessage.error('复制失败')
        })
}

const confirmEvent = (item: any) => {
    console.log('删除收藏',item)
    ElMessage.success('删除成功')
}
</script>

<style lang="scss" scoped>
.collect {
    height: 90%;
    display: flex;
    flex-flow: row wrap;
    gap: 20px;
    padding: 24px;
    .collect-container {
        width: 320px;
        height: 400px;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        .title {
            height: 50px;
            color: black;
            padding: 8px 8px 0px 8px;
            img {
                width: 40px;
                height: 40px;
            }
            div {
                width: 90%;
                margin-left: 46px;
                margin-top: -38px;
            }
        }
        .divider {
            width: 100%;
            height: 2px;
            background: linear-gradient(to right, #b93bed, #5cfcff);
        }
        .content {
            color: black;
            height: 290px;
            padding: 8px;
            font-size: 14px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        .footer {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            padding: 0px 8px;
            color: #ccc;
            font-size: 14px;
            &-time {
                margin-top: 6px;
            }
            &-icon {
                padding: 2px 2px;
                cursor: pointer;
                .icon-icon-copy:hover {
                    color: #b93bed;
                }
                .icon-icon-delete:hover {
                    color: #b93bed;
                }
            }
        }
    }
    .collect-container:hover {
        background-color: rgba($color: #fff, $alpha: 0.9) ;
    }
}
</style>