<template>
    <div class="collect">
        <div v-if="isLoading" class="collect-loading">
            <div  ref="animation1"></div>
            正在加载中...
        </div>
       <div class="collect-container" v-for="item in COLLECTION_LIST" :key="item.id" v-else>
           <div class="title">
            <!-- FIXME：图片需要根据后端返回类型值判断应该显示哪一张图片 -->
                <img src="../../assets/images/logo.png" alt="">
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
                    <span class="iconfont ai-copy" @click="handleCopy(item.answer)"></span>
                    <el-divider direction="vertical" />
                    <el-popconfirm
                        confirm-button-text="删除"
                        cancel-button-text="取消"
                        title="确定删除该收藏？"
                        @confirm="confirmEvent(item)"
                        @cancel="cancelEvent(item)"
                    >
                        <template #reference>
                            <span class="iconfont ai-delete"></span>
                        </template>
                    </el-popconfirm>
                </div>
           </div>
       </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { COLLECTION_LIST } from '@/content/index'
import { ElMessage } from 'element-plus';
import { Loading } from '@element-plus/icons-vue';
import lottie from 'lottie-web';
import LoadingCar from '@/assets/images/car-loading.json';

const isLoading = ref(false);  //页面加载状态

const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            ElMessage.success('复制成功')
        })
        .catch((error: any) => {
            ElMessage.error('复制失败')
        })
}

const confirmEvent = (item: any) => {
    console.log('删除收藏',item)
    ElMessage.success('删除成功')
}

const animation1 = ref<any>(null) 

onMounted(() => {
    lottie.loadAnimation({
        container: animation1.value,   
        renderer: 'svg',   
        loop: true,  
        autoplay: true,  
        animationData: LoadingCar   
    })
    //TODO:请求收藏数据之后，将isLoading设置为false
    setTimeout(() => { 
        isLoading.value = false 
    }, 5000)
})
</script>

<style lang="scss" scoped>
.collect {
    height: 90%;
    display: flex;
    flex-flow: row wrap;
    gap: 20px;
    padding: 24px;
    &-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 80vh;
        width: 100%;
        font-size: 12px;
        color: #999;
        div {
            width: 100px;
            height: 100px;
            margin-bottom: 10px;
        }
    }
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
                .ai-copy:hover {
                    color: #b93bed;
                }
                .ai-delete:hover {
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