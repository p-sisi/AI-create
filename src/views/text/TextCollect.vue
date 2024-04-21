<template>
    <div class="collect">
        <div v-if="isLoading" class="collect-loading">
            <div  ref="animation1"></div>
            正在加载中...
        </div>
       <div class="collect-container" v-for="item in collectList" :key="item.id" v-else>
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
                <div class="footer-time">{{ getStringTime(item.collectTime) }}</div>
                <div class="footer-icon">
                    <span class="iconfont ai-copy" @click="handleCopy(item.answer)"></span>
                    <el-divider direction="vertical" />
                    <el-popconfirm
                        confirm-button-text="删除"
                        cancel-button-text="取消"
                        title="确定删除该收藏？"
                        @confirm="confirmEvent(item)"
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
import { ref, onMounted, Ref, computed } from 'vue';
import { TEMP_COLLECT } from '@/content/text'
import { fetchCollectListText } from '../../apis/collect'
import { fetchCancelCollectTemp  } from '../../apis/collect'
import { ElMessage } from 'element-plus';
import lottie from 'lottie-web';
import LoadingCar from '@/assets/images/car-loading.json';
import { getStringTime } from '../../utils/index'

const isLoading = ref(true);  //页面加载状态

const collectList: Ref<TEMP_COLLECT[]> = ref([]);       //收藏列表

/**
 *  获取全部的收藏列表
 */
const getCollectListRequest = async() => {
    try {
        const result = await fetchCollectListText()
        collectList.value = result.data
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

//复制
const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            ElMessage.success('复制成功')
        })
        .catch((error: any) => {
            ElMessage.error(error.message)
        })
}

/**
 *    删除收藏
 */
 const confirmEvent = async(item: any) => {
    try {
        const params = {
            recordId: item.recordId
        }
        await  fetchCancelCollectTemp(params)
        ElMessage.success('删除成功')

        getCollectListRequest()
    } catch (error: any) {
        ElMessage.error(error.message)
    }
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
    setTimeout(() => {
        isLoading.value = false;
        getCollectListRequest()
    }, 1000);   
})
</script>

<style lang="scss" scoped>
.collect {
    height: 90vh;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
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
            max-height: 290px;
            min-height: 290px;
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