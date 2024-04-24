<template>
    <div class="collect">
        <div class="container">
            <div v-for="item in collectList" :key="item.id" class="item" @mouseenter="handleMouseEnter(item)">
                <img :src="`${BASE_URL}/file/images/${item.filename}`" alt="">
                <div class="mask" v-if="isShowIcon && selectedImgId === item.id">
                    <el-popconfirm
                        width="220"
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        :icon="InfoFilled"
                        icon-color="#b641ee"
                        title="你确定删除该收藏吗?删除后将无法恢复"
                        @confirm="handleDelete(item)"
                    >
                        <template #reference>
                            <span class="iconfont ai-delete" style="color:#f56c6c"></span>
                        </template>
                    </el-popconfirm>
                    <el-divider direction="vertical" />
                    <el-tooltip class="box-item" effect="dark" content="下载"placement="bottom">
                        <a :href="`${BASE_URL}/file/images/download/${item.filename}`"><span class="iconfont ai-xiazai" style="color: #fff"></span></a>
                    </el-tooltip>
                    <el-divider direction="vertical" />
                    <el-tooltip class="box-item" effect="dark" content="分享至星球"placement="bottom">
                        <span class="iconfont ai-share" @click="handleClickShare(item)"></span>
                    </el-tooltip>
                </div>
            </div>
        </div>
    </div>

    <!-- 分享至星球的弹窗 -->
    <el-dialog v-model="shareDialogVisible" title="分享至星球" width="800" :close-on-click-modal="false" :show-close="false">
        <div style="display: flex;justify-content: flex-start;gap: 20px;">
            <div style="display: flex;align-items: center"><img style="width: 300px" :src="`${BASE_URL}/file/images/${selectedImage.filename}`"  alt=""></div>
            <div style="display: flex;flex-direction: column;justify-content: space-between;">
                <div>
                    <div style="font-size: 18px;font-weight: 600;margin-bottom: 10px;">说点什么：</div>
                    <el-input v-model="inputShare" style="width: 440px"  :autosize="{ minRows: 6, maxRows: 8 }"type="textarea"
                        placeholder="分享至星球"
                    />
                </div>
                <div style="display: flex;justify-content: flex-end;margin-bottom: 30px;margin-top: 10px;">
                    <el-button plain @click="shareDialogVisible = false">取消</el-button>
                    <el-button type="primary" color="#b641ee" @click="handleShare()">分享</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { fetchAllCollectImage, fetchCancelCollectImage } from '../../apis/picture'
import { fetchShare } from '../../apis/share'
import { ElMessage } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue'
import { COLLECT_LIST } from '../../content/picture';
import { BASE_URL } from '../../content/user'
import router from '../../router/index.ts';

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

const isShowIcon = ref(false);      //是否展示图片下的图标
const selectedImgId = ref();        //当前选择的图片的id

//鼠标移到图片上
const handleMouseEnter = (item: any) => {
    isShowIcon.value = true;
    selectedImgId.value = item.id
}

/**
 * 删除一个收藏
 * @param item : { id: number;title: string;filename: string; collectTime: string;}
 */
 const handleDelete = async(item: any) => {
    try {
        await fetchCancelCollectImage({
            imageName: item.name,
        })
        return  ElMessage.success('删除成功');
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}
const shareDialogVisible = ref(false);      //分享至星球弹窗
const selectedImage = ref();          //当前选择的图片名称
const inputShare = ref('');          //分享值星球输入的内容

const handleClickShare = (item: any) => {
    shareDialogVisible.value = true;
    selectedImage.value = item;
    inputShare.value = item.title;
}

/**
 *  分享至星球
 */
const handleShare = async() => {
    try {
        await fetchShare({
            title: inputShare.value,
            filename: selectedImage.value.filename
        })
        ElMessage.success('分享成功')
        shareDialogVisible.value = false;
        router.push('/ai_picture/star')
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
            box-sizing: border-box;
        }
        img:hover {
            border: 2px solid #b641ee;
        }
        .mask {
            display: flex;
            height: 40px;
            width: 100%;
            margin-top: -10px;
            justify-content: flex-end;
            align-items: center;
            gap: 2px;
            cursor: pointer;
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