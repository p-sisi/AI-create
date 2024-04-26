<template>
    <div class="star">
        <div class="star-header">
            <img src="../../assets/images/logo.png" alt="">
            <span style="margin-left: -200px;">
                <span class="select-title">欢迎来到创意星球！</span>
                <div>一个专为用户分享AI生成图片而设计的独特之地,用户能够展示他们的作品、与其他创作者互动，并从中获得灵感和喜悦。</div>
            </span>
            <div class="select-btn-temp" @click="handleClickToCreate">前往创作</div>
        </div>

        <div class="divide"></div>

        <div class="container">
            <div v-for="item in shareList" :key="item.id" class="item" @click="handleClickImage(item)">
                <el-image class="image" 
                    :src="`${BASE_URL}/file/images/${item.filename}`" 
                    infinite lazy 
                    :preview-src-list="[`${BASE_URL}/file/images/${item.filename}`]" 
                    :class="{select: selectedImgId === item.id}"
                    />
                <div class="mask" v-if="isShowFooter && selectedImgId === item.id">
                    <span>{{ item.title }}</span>
                    <div class="mask-footer">
                        <span class="mask-footer-time">{{ getStringTime(item.createTime).slice(0,16) }}</span>
                        <div>
                            <el-popconfirm
                                width="220"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                :icon="InfoFilled"
                                icon-color="#b641ee"
                                title="你确定删除该分享?"
                                @confirm="handleDelete(item)"
                            >
                                <template #reference>
                                    <span v-if="commonStore.userInfo.userId == item.userId" class="iconfont ai-delete"></span>
                                </template>
                            </el-popconfirm>
                            <el-divider direction="vertical" v-if="commonStore.userInfo.userId == item.userId"/>
                            <a :href="`${BASE_URL}/file/images/download/${item.filename}`"><span class="iconfont ai-xiazai" style="color: #fff"></span></a>
                            <el-divider direction="vertical" />
                            <span v-if="item.isLike" class="iconfont ai-like" style="color: #e6a23c;" @click="handleUnLike(item)"></span>
                            <span v-else class="iconfont ai-unlike" @click="handleLike(item)"></span>
                            <span>&nbsp;{{ item.likeCount }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-backtop :right="100" :bottom="100">
            <span class="iconfont ai-to-top" style="font-size: 20px; color: #b93bed"></span>
        </el-backtop>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { fetchShareList, fetchDeleteShare, fetchLikeShare, fetchUnLikeShare } from '../../apis/share'
import { ElMessage } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue'
import router from '@/router/index.ts';
import { BASE_URL } from '../../content/user'
import { getStringTime } from '@/utils/index'
import { usePictureStore, useCommonStore } from '@/store'

const pictureStore = usePictureStore();
const commonStore = useCommonStore()

onMounted(() => {
    getAllShareListRequest();
})

//分享列表数据接口
interface SHARE_LIST {
    id: number,
    userId: number,     //发布者id
    title: string,      //内容
    filename: string,   //图片名称
    likeCount: any,    //点赞数
    createTime: string, //发布时间
    isLike: boolean,    //是否自己发布的
}
const shareList: Ref<SHARE_LIST[]> = ref([]);        //分享列表

/**
 *  获取所有星球内容
 */
const getAllShareListRequest = async () => {
    try {
        const result = await fetchShareList();
        shareList.value = result.data
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

/**
 *  删除自己的分享
 */
const handleDelete = async(item: any) => {
    try {
        await fetchDeleteShare({
            shareId: item.id
        })
        ElMessage.success('删除成功');
        getAllShareListRequest();
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

const isShowFooter = ref(false);      //是否展示图片下的图标
const selectedImgId = ref();        //当前选择的图片的id

const handleClickImage = (item: any) => {
    isShowFooter.value = true;
    selectedImgId.value = item.id
}

/**
 *    取消点赞
 */
const handleUnLike = async (item: any) => {
    try {
        await fetchUnLikeShare({
            shareId: item.id
        })
        item.isLike = false;
        item.likeCount--;
        ElMessage.success('取消点赞')
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

/**
 *     点赞
 */
const handleLike = async (item: any) => {
    try {
        await fetchLikeShare({
            shareId: item.id
        })
        item.isLike = true;
        item.likeCount++;
        ElMessage.success('点赞成功')
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

const handleClickToCreate = () => {
    router.push('/ai_picture/create')
    pictureStore.setActiveHeaderMenu('创作区')
}
</script>

<style scoped lang="scss">
.star {
    height: 200vh;
    padding: 20px;
    background: #000000;
}

.star-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 30px;
    img {
        width: 100px;
    }
    .select-title {
        font-size: 30px;
    }
    .select-btn-temp {
        height: 26px;
        padding: 10px 20px;
        background-color: #b93bed;
        border-radius: 30px;
        transition: all .4s;
        cursor: pointer;
    }
     .select-btn-temp:hover {
        padding: 10px 30px;
    }
}
.divide {
    height: 1px;
    margin: 20px 30px;
    background-color: #b93bed;
    box-sizing: border-box;
}
.container {
    display: flex;
    flex-flow: column wrap;
    height: 100vh; 
    padding: 20px 180px;
    .item {
        margin: 10px;
        width: calc( 100%/4 - 20px);
        .image {
            display: inline-block;
            position: relative;
            width: 100%;
            border-radius: 10px;
            box-sizing: border-box;
        }
        .image:hover {
            border: 2px solid #b641ee;
        }
        .select {
            border: 2px solid #b641ee;
        }
    }
    .mask {
        .mask-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
            .mask-footer-time {
                font-size: 12px;
                color: #ccc;
            }
            .iconfont {
                cursor: pointer;
            }
        }
    }
}
</style>