<template>
    <div class="collect">
        <div class="container">
            <div v-for="item in collectList" :key="item.id" class="item" >
                <img :src="`${BASE_URL}/file/images/${item.filename}`" alt="">
                <div class="mask">
                    <span class="iconfont ai-collect" @click="console.log('你好')"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { fetchAllCollectImage } from '../../apis/picture'
import { ElMessage } from 'element-plus';
import { COLLECT_LIST } from '../../content/picture';
import { BASE_URL } from '../../content/user'

onMounted(() => {
    getAllCollectRequest();
})

const collectList: Ref<COLLECT_LIST[]> = ref([]);      //收藏列表

/**
 *  获取所有图片的收藏
 */
const getAllCollectRequest = async () => {
    try {
        const result = await fetchAllCollectImage();
        collectList.value = result.data
    } catch (error: any) {
      ElMessage.error(error.message)  
    }
}
</script>

<style scoped lang="scss">
.container {
    display: flex;
    flex-flow: column wrap;
    height: 100vh; 
    padding: 20px 180px;
    .item {
        margin: 10px;
        width: calc( 100%/4 - 10px);
        img {
            display: inline-block;
            position: relative;
            width: 100%;
            border-radius: 10px;
            z-index: 4;
        }
        img:hover:before {
                            content: "";
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(to top, rgba(#000,0.8), rgba(#000,0.0));
                            z-index: 2; /* 遮罩层的层级 ,要比图标低，因为图标需要显示高亮*/
                            pointer-events: none;//鼠标事件穿透遮罩层，图片层级1，为了点击图片可以进行预览
                        }
        img:hover {
            border: 1px solid #b641ee;
        }
        .mask {
            height: 40px;
            width: 100%;
            margin-top: -30px;
            border: 1px solid #ccc;
            background: #b641ee;
            .iconfont {
                cursor: pointer;
            }
        }
    }
}
.collect {
    background-color: #0e0e27;
    height: 200vh;
}
</style>