<template>
    <div class="collect">
        <!-- 左侧菜单栏 -->
        <el-affix :offset="120">
        <div class="tabs">
            <div 
                v-for="item in menuList" 
                :key="item.label"
                @click="radioChange(item.label)" 
                class="tabs-temp" 
                :class="{ 'selected': item.label === selectedMenu }"
            >
                <span :class="item.icon" class="iconfont"></span>
                <div>{{ item.label }}</div>
            </div>
        </div>
        </el-affix>

        <!-- 收藏列表 -->
        <div class="container">
            <div v-for="item in List" :key="item.id" class="item" @mouseenter="handleMouseEnter(item)">
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
import { fetchMyShareList, fetchMyLikeList, fetchDeleteShare, fetchUnLikeShare } from '../../apis/share'
import { fetchShare } from '../../apis/share'
import { ElMessage } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue'
import { COLLECT_LIST } from '../../content/picture';
import { BASE_URL } from '../../content/user'
import router from '../../router/index.ts';

onMounted(() => {
    getAllCollectRequest();
    getAllShareRequest();
    getAllLikeRequest();
})

const List = ref();     //展示的图片列表

const collectList: Ref<COLLECT_LIST[]> = ref([]);      //收藏列表
const shareList: Ref<COLLECT_LIST[]> = ref([]);      //分享列表
const likeList: Ref<COLLECT_LIST[]> = ref([]);      //点赞列表

//菜单栏
const menuList = [
    {
        label: '收藏夹',
        icon: 'ai-collect-all'
    },
    {
        label: '我的点赞',
        icon: 'ai-like'
    },
    {
        label: '我的分享',
        icon: 'ai-share-all'
    }
]
const selectedMenu = ref('收藏夹') //默认选中
const radioChange = (label: any) => {
    //当重复点击时，取消选中
    if (selectedMenu.value === label )  return 
    selectedMenu.value = label;

    if(label === '收藏夹') {
        List.value = collectList.value;
    } else if (label === '我的分享') {
        List.value = shareList.value;
    } else {
        List.value = likeList.value;
    }
}


/**
 *  获取所有图片的收藏
 */
const getAllCollectRequest = async () => {
    try {
        const result = await fetchAllCollectImage();
        collectList.value = result.data;
        //首次加载，展示收藏列表
        List.value = collectList.value;
    } catch (error: any) {
      ElMessage.error(error.message)  
    }
}

/**
 *  获取所有我的分享
 */
 const getAllShareRequest = async () => {
    try {
        const result = await fetchMyShareList();
        shareList.value = result.data
    } catch (error: any) {
      ElMessage.error(error.message)  
    }
}

/**
 *  获取所有我的点赞
 */
 const getAllLikeRequest = async () => {
    try {
        const result = await fetchMyLikeList();
        likeList.value = result.data
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
 * 点击图片的删除按钮
 * @param item : { id: number;title: string;filename: string; collectTime: string;}
 */
 const handleDelete = async(item: any) => {
    try {
        if(selectedMenu.value === '收藏夹'){
            await fetchCancelCollectImage({
                imageName: item.filename,
            })
            getAllCollectRequest();
        }else if(selectedMenu.value === '我的分享'){
            await fetchDeleteShare({
                shareId: item.id
            })
            getAllShareRequest();
            List.value = shareList.value;
        } else {
            await fetchUnLikeShare({
                shareId: item.id
            })
            getAllLikeRequest();
            List.value = likeList.value;
        }
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
//菜单样式
.tabs-temp {    //未选中时按钮样式
    display: flex;
    gap: 20px;
    height: 40px;
    padding: 2px 16px;
    margin-right: 8px;
    border-radius: 4px;
    background-color: #212137;
    font-size: 16px;
    line-height: 40px;
    cursor: pointer;
}
.tabs-temp.selected {     //选中时的样式
    background: #e1c5f0;
    color: #b641ee;
}

.container {
    flex: 1;
    display: flex;
    flex-flow: column wrap;
    align-content: flex-start;
    height: 120vh; 
    padding: 20px 20px;
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
    display: flex;
    background-color: #0e0e27;
    height: 200vh;
    .tabs {
        display: flex;
        flex-flow: column nowrap;
        gap: 10px;
        padding-left: 20px;
        width: 200px;
    }
}
</style>