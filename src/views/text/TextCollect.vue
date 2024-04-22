<template>
    <div class="collect">
        <div v-if="isLoading" class="collect-loading">
            <div  ref="animation1"></div>
            <span>正在加载中...</span>
        </div>
       <div class="collect-container" v-for="item in collectList" :key="item.id" v-else>
           <div class="title">
                <img :src="`${BASE_URL}/file/images/${item.modelImg}`" alt="">
                <div>{{ item.answer.slice(0,19) }}</div>
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
import { BASE_URL } from '../../content/user'
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
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    gap: 20px;
    padding: 24px;
    &-loading {
        height: 80vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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
        height: 390px;
        background-color: #303032;
        border-radius: 10px;
        overflow: hidden;
        transition: all 0.4s ;
        box-sizing: border-box;
        .title {
            display: flex;
            align-items: center;
            gap: 4px;
            height: 40px;
            color: #fff;
            padding: 8px 8px 0px 8px;
            img {
                width: 30px;
                height: 30px;
            }
            div {
                width: 90%;
                font-size: 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .divider {
            width: 100%;
            height: 2px;
            background: linear-gradient(to right, #b93bed, #5cfcff);
        }
        .content {
            color: #ccc;
            max-height: 290px;
            min-height: 290px;
            padding: 8px 10px;
            font-size: 13px;
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
        margin-top: 4px;
    }
}
</style>