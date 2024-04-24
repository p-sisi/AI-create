<template>
    <div class="container flex-row">
        <!-- 需求区 -->
        <div class="container-left flex-column">
            <div class="container-left-need">
                <div class="need-title">图片解说</div>
                <p class="need-int">基于图片进行文字创作、回答问题，帮你写文案、构思故事，助你释放创造力，提供灵感和创作支持。</p>
                <div class="need-img">
                    <el-upload
                        class="uploader"
                        :show-file-list="false"
                        :on-error="handleUploadError"
                        :on-progress="handleUploadProgress"
                        @change="handleChangeFile"
                    >
                        <img v-if="imgUrl !== '' && !isUploading" :src="imgUrl" class="img" />
                        <el-progress v-else-if="isUploading" type="circle" :percentage="0" />
                        <div v-else class="uploader-tip">
                            <span class="iconfont ai-upload"></span>
                            <p>上传不超过10M的图片</p>
                        </div>
                    </el-upload>
                </div>
                <div class="need-text">问题：</div>
                <el-input
                    ref="textInputRef"
                    v-model="inputText"
                    style="width: 300px"
                    :rows="{max: 4, min: 1}"
                    type="textarea"
                    placeholder="请输入你想要问的问题"
                    resize="none"
                />
            </div>

            <div class="container-left-btn"  @click="handleCreate">
                <div>{{ isCreating ? '正在解读中' : '开始作图' }}</div>
                <div>
                    <div class="ai-edit iconfont" v-if="!isCreating"></div>
                    <el-icon class="is-loading" v-else><Loading /></el-icon>
                </div>
            </div>
        </div>

        <!-- 结果区 -->
        <div class="container-right">
            <el-scrollbar max-height="520px">
            <div class="container-right-list">
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
                        <!-- 生成状态卡片 -->
                        <div class="list" v-if="isCreating || isTyping">
                            <div class="list-header">
                                <div class="flex-row" style="gap:10px;align-items: center">
                                    <el-tooltip
                                        effect="dark"
                                        content="点击查看图片"
                                        placement="right-start"
                                    >
                                        <div class="list-header-img">
                                            <el-image :src="imgUrl" :preview-src-list="[imgUrl]" lazy/>
                                        </div>
                                    </el-tooltip>
                                    <span>{{ inputText == ''? '请帮我解说一下整张图片的内容': inputText }}</span>
                                </div>
                            </div>
                            <div class="list-text" v-if="isCreating || isTyping">
                                <el-skeleton :rows="2" animated :throttle="500" v-if="isTyping == false"/>
                                <div v-else>{{ generateResult }}</div>
                            </div>
                        </div>
                        <!-- 加载完成数据 -->
                        <div class="list" v-for="item in historyList" :key="item.id">
                            <div class="list-header">
                                <div class="flex-row" style="gap:10px;align-items: center">
                                    <el-tooltip
                                        effect="dark"
                                        content="点击查看图片"
                                        placement="right-start"
                                    >
                                        <div class="list-header-img">
                                            <el-image :src="`${BASE_URL}/file/images/${item.filename}`" :preview-src-list="[`${BASE_URL}/file/images/${item.filename}`]" lazy/>
                                        </div>
                                    </el-tooltip>
                                    <span>{{item.question}}</span>
                                </div>
                                <div>
                                    <span>{{ getStringTime(item.createTime) }}</span>
                                    <span style="margin: 8px;color: #3b3387">|</span>
                                    <span>共 {{ item.answer.length }} 字</span>
                                    <span style="margin: 8px;color: #3b3387">|</span>
                                    <el-tooltip
                                        effect="dark"
                                        content="复制"
                                        placement="bottom"
                                    >
                                        <span class="iconfont ai-copy icon" @click="handleCopy(item.answer)"></span>
                                    </el-tooltip>
                                    <span style="margin: 8px;color: #3b3387">|</span>
                                    <el-popconfirm width="220"
                                        confirm-button-text="确定"
                                        cancel-button-text="取消"
                                        icon-color="#626AEF"
                                        title="确定删除该条生成记录？删除后无法恢复记录"
                                        @confirm="handleDelete(item)" 
                                        >
                                        <template #reference>
                                            <span class="iconfont ai-delete icon"></span>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </div>
                            <div class="list-text">
                                <div >{{ item.answer }}</div>
                            </div>
                        </div>
                    </template>
                </el-skeleton>
            </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref, nextTick } from 'vue';
import { Plus, Loading } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus';
import { getCurrentTime, getStringTime } from '@/utils/index';
import { PICTURE_TEXT_HISTORY } from '@/content/picture'
import { BASE_URL } from '@/content/user'
import { fetchHistoryPictureTo } from '../../apis/picture'
import { usePictureStore } from '@/store'
import axios from 'axios';

const pictureStore = usePictureStore();

const isLoading = ref(true);   //页面加载

const historyList: Ref<PICTURE_TEXT_HISTORY[]> = ref([]);      //历史记录
/**
 *  获取全部历史记录
 */
const getAllHistory = async() => {
    try {
        const result = await fetchHistoryPictureTo()
        historyList.value = result.data.reverse();
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const isCreating = ref(false);      //图片正在创作中
const isUploading = ref(false);     //本地图片正在上传中
const isTyping = ref(false);        //图片正在打字中


//打字文本动态输入
const generateResult = computed({
    get: () => pictureStore.activeTypeText || '',
    set: (value: any) => pictureStore.setActiveTypeText(value)
});

const uploadFile = ref();           //当前选择的文件
const imgUrl = ref('');

const handleUploadProgress = (evt: any) => {
    isUploading.value = true;
    console.log('上传进度', evt)
}

const handleUploadError: UploadProps['onError'] = (
    response:any,
    uploadFile:any
) => {
    isUploading.value = false;
    imgUrl.value = URL.createObjectURL(uploadFile.raw!)
    console.log('上传失败', response, uploadFile)
    console.log('图片地址', imgUrl.value)
}

const handleChangeFile = (file: any) => {
    // file 是当前选择的文件，可以通过 file.raw 获取原始的 File 对象,fileList是上传的文件列表
    uploadFile.value = file.raw;
    imgUrl.value = URL.createObjectURL(file.raw!)
    console.log(file.raw)
};

const inputText  = ref('');     //用户输入内容

// 设置请求头
const token = localStorage.getItem('Token');
const config = {
  headers: {
    'Content-Type': 'multipart/form-data', // 设置Content-Type为formData类型
    'Authorization': `${token}`, 
  }
}
const handleCreate = async () => { 
    if(imgUrl.value == '')  return ElMessage.error('请先上传图片');
    if(isUploading.value )  return ElMessage.warning('图片正在上传中');
    if(isCreating.value) return ElMessage.warning('图片正在解读中，请稍后再试');
    try {
        //开始创作
        isCreating.value = true;
        isTyping.value = false;

        let formData = new FormData();
        let question = inputText.value == ''? '请帮我解说一下整张图片的内容': inputText.value;
        formData.append('file', uploadFile.value);
        axios.post(`http://localhost:1033/talkImage/call?question=${question}`, formData, config)
            .then(async(response: any) => {
                isCreating.value = false;
                pictureStore.setActiveTypeText('');
                const typeText = response.data.data.answer; 
                await nextTick();

                //开始打字
                isTyping.value = true;
                let i = 0;
                const timer = setInterval(async () => {
                    pictureStore.setActiveTypeText(pictureStore.activeTypeText + typeText.charAt(i));
                    await nextTick();
                    console.log(pictureStore.activeTypeText)
                    i++;
                    if (i > typeText.length) {
                        //打字结束，设置打字状态为false，清除打字计时器
                        isTyping.value = false;
                        clearInterval(timer);
                        getAllHistory();
                    }
                }, 20);//50:打字速度
            })
            .catch((error: any) => {
                console.error('Error:', error);
            });
    } catch (error) {
        isCreating.value = false;
        ElMessage.error('生成失败！请稍后再试')
        historyList.value.shift();
    }
}


//收藏
const handleCollect = (item: any) => {
    ElMessage.success('收藏成功');
}

//取消收藏
const handleCancelCollect= (item: any) => {
    ElMessage.success('取消收藏成功');
}

//复制
const handleCopy = (text: any) => {
    navigator.clipboard.writeText(text).then(() => {
        ElMessage.success('复制成功')
    }).catch((error) => {
        console.error('复制失败', error)
        ElMessage.error('复制失败')
    })
}

//删除记录
const handleDelete = (item: any) => {
    ElMessage.success('删除成功');
}

onMounted(() => {
    getAllHistory();
    setTimeout(()=> {
        isLoading.value = false;
    },2000)
})
</script>

<style lang="scss" scoped>
.flex-row {
    display: flex;
    flex-flow: row nowrap;
}
.flex-column {
    display: flex;
    flex-flow: column nowrap;
}
.container {
    width: 100%;
    justify-content: space-between;
    &-left {
        justify-content: space-between;
        width: 340px;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        background-color: rgba($color: #4236c6, $alpha: 0.3);
        box-shadow: 4px 4px 10px 0px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        color: #fff;
        &-need {
            .need-title {
                font-size: 18px;
            }
            .need-int {
                font-size: 10px;
                margin-bottom: 20px;
                color: #c5c6d0;
            }
            ::v-deep(.el-textarea__inner) {
                background-color:rgba($color: #907ee9, $alpha: 0.2);
                box-shadow: none;
                color: #fff;
                padding: 5px 10px 15px 10px
            }
            .need-img {
                width: 100%;
                height: auto;
                .uploader {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 150px;
                    text-align: center;
                    background-color:rgba($color: #907ee9, $alpha: 0.2);
                    border-radius: 8px;
                    overflow: hidden;
                    .img {
                        width: 100%;
                    }
                    &-tip {
                        font-size: 10px;
                        color: #c5c6d0;
                        .ai-upload {
                            font-size: 40px;
                        }
                        .ai-upload:hover {
                            color: #fff;
                        }
                    }
                }
            }
            .need-text {
                margin-top: 10px;
                margin-bottom: 4px;
            }
        }

        &-btn {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            width: 200px;
            border-radius: 20px;
            margin-left: 44px;
            background: linear-gradient(to right, #b93bed, #5cfcff);
            cursor: pointer;
            div {
                font-size: 16px;
                color: #fff;
                text-align: center;
                line-height: 40px;
            }
            .ai-edit {
                width: 40px;
                margin-left: -5px;
            }
            .is-loading {
                margin-left: 4px;
            }
        }
        &-btn:hover {
            background: linear-gradient(to right, #c269e7, #7ce6e8);
        }
    }

    &-right {
        flex: 1;
        margin-left: 20px;
        &-list {
            .list {
                margin-bottom: 22px;
                padding-right: 14px;
                &-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    &-img {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 40px;
                        background-color: rgba($color: #4236c6, $alpha: 0.3);
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    span {
                        font-size: 12px;
                    }
                }
                .icon {
                    font-size: 14px;
                    cursor: pointer;
                }
                .icon:hover {
                    color:#a240da;
                }
                &-text {
                    width: 100%;
                    min-height: 50px;
                    margin-top: 10px;
                    padding: 10px;
                    font-size: 14px;
                    color: #fff;
                    background-color: #25206e;
                    border-radius: 10px;
                    box-sizing: border-box;
                }
            }
        }
    }
}
::v-deep .el-skeleton {
    --el-skeleton-color: #574dac80;
    --el-skeleton-to-color: #6961a8a2;
}
</style>