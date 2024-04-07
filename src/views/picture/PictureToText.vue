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
                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                        :on-success="handleUploadSuccess"
                        :on-error="handleUploadError"
                        :on-progress="handleUploadProgress"
                    >
                        <img v-if="imgUrl !== '' && !isUploading" :src="imgUrl" class="img" />
                        <el-progress v-else-if="isUploading" type="circle" :percentage="0" />
                        <div v-else class="uploader-tip">
                            <span class="iconfont ai-upload"></span>
                            <p>上传不超过10M的图片</p>
                        </div>
                    </el-upload>
                </div>
                <div style="font-size: 14px;margin-top: 10px;">解说类型：</div>
                <div class="need-type">
                    <div 
                        v-for="item in TYPE"   
                        @click="radioChange(item)" 
                        class="type"
                        :class="{ 'selected': item === activeType }"
                    >
                        {{ item }}
                    </div>
                </div>
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
            <el-scrollbar max-height="460px">
            <div class="container-right-list">
                <div class="list" v-for="item in DATA">
                    <div class="list-header">
                        <div class="flex-row" style="gap:10px;align-items: flex-end">
                            <el-tooltip
                                effect="dark"
                                content="点击查看图片"
                                placement="right-start"
                            >
                                <div class="list-header-img">
                                    <el-image v-if="item.text == ''" :src="imgUrl" :preview-src-list="[imgUrl]"/>
                                    <el-image v-else :src="item.imgUrl" :preview-src-list="[item.imgUrl]"/>
                                </div>
                            </el-tooltip>
                            <span>图片</span>
                        </div>
                        <div>
                            <span>{{ item.createTime }}</span>
                            <span style="margin: 8px;color: #3b3387">|</span>
                            <span>共 {{ item.text.length }} 字</span>
                            <span style="margin: 8px;color: #3b3387">|</span>
                            <el-tooltip
                                effect="dark"
                                :content=" item.isCollect==true ? '取消收藏' : '收藏'"
                                placement="bottom"
                            >
                                <span class="iconfont ai-no-collect icon" v-if="!item.isCollect" @click="handleCollect(item)"></span>
                                <span class="iconfont ai-collect icon" v-else @click="handleCancelCollect(item)"></span>
                            </el-tooltip>
                            <span style="margin: 8px;color: #3b3387">|</span>
                            <el-tooltip
                                effect="dark"
                                content="复制"
                                placement="bottom"
                            >
                                <span class="iconfont ai-copy icon" @click="handleCopy(item.text)"></span>
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
                        <div v-if="item.text !== ''">{{ item.text }}</div>
                        <el-skeleton :rows="2" animated :throttle="500" v-else/>
                    </div>
                </div>
            </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, Loading } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus';
import { getCurrentTime } from '@/utils/index';

const DATA = ref([
    {
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        text: '基于图片进行文字创作、回答问题，帮你写文案、构思故事，助你释放创造力，提供灵感和创作支持。',
        createTime: '2023-03-21 12:30:00',
        isCollect: true,
    },
    {
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        text: '基于图片进行文字创作、回答问题，帮你写文案、构思故事，助你释放创造力，提供灵感和创作支持。',
        createTime: '2023-03-21 12:30:00',
        isCollect: false,
    },
    {
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        text: '基于图片进行文字创作、回答问题，帮你写文案、构思故事，助你释放创造力，提供灵感和创作支持。',
        createTime: '2023-03-21 12:30:00',
        isCollect: true,
    },
    {
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        text: '基于图片进行文字创作、回答问题，帮你写文案、构思故事，助你释放创造力，提供灵感和创作支持。',
        createTime: '2023-03-21 12:30:00',
        isCollect: false,
    },
])

const isCreating = ref(false);


const isUploading = ref(false);
const imgUrl = ref('');

const handleUploadProgress = (evt: any) => {
    isUploading.value = true;
    console.log('上传进度', evt)
}

const handleUploadSuccess: UploadProps['onSuccess'] = (
    response:any,
    uploadFile:any
) => {
    isUploading.value = false;
    imgUrl.value = URL.createObjectURL(uploadFile.raw!)
    ElMessage.success('上传成功')
    console.log('上传成功', response, uploadFile)
    console.log('图片地址', imgUrl.value)
}

const handleUploadError: UploadProps['onError'] = (
    response:any,
    uploadFile:any
) => {
    isUploading.value = false;
    imgUrl.value = URL.createObjectURL(uploadFile.raw!)
    console.log('上传失败', response, uploadFile)
    console.log('图片地址', imgUrl.value)
    ElMessage.error('上传失败')

}

const TYPE = ['普通','诗歌','故事构造'];

const activeType = ref('普通') 
const radioChange = (label: any) => {
    if (activeType.value === label )  return 
    activeType.value = label;
}

//创作
// 生成状态卡片数据
const currentTime = ref('');
const creatingData = computed(() => {
    return {
        imgUrl: imgUrl.value,
        text:'',
        createTime: currentTime.value,
        isCollect: false
    }
})
const handleCreate = async () => { 
    // if(imgUrl.value == '')  return ElMessage.error('请先上传图片');
    // if(isUploading.value )  return ElMessage.warning('图片正在上传中');
    if(isCreating.value) return ElMessage.warning('请稍后再试，正在解读中...');
    try {
        //开始创作
        isCreating.value = true;

        currentTime.value = getCurrentTime();
        DATA.value.unshift(creatingData.value)

        const params = {
            imgUrl: imgUrl.value,
            type: activeType.value
        }
        //发送请求，请求结束后
        // isCreating.value = false;
    } catch (error) {
        isCreating.value = false;
        ElMessage.error('生成失败！请稍后再试')
        DATA.value.shift();
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
            .need-img {
                width: 100%;
                height: auto;
                .uploader {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 178px;
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
            .need-type {
                display: flex;
                flex-flow: row nowrap;
                margin-top: 10px;
                .type {    //未选中时按钮样式
                    height: 30px;
                    width: 80px;
                    margin-right: 10px;
                    text-align: center;
                    line-height: 30px;
                    color: #e7b0c9;
                    font-size: 14px;
                    background-color:rgba($color: #907ee9, $alpha: 0.2);
                    border-radius: 2px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .type.selected {     //选中时的样式
                    background-color:rgba($color: #907ee9, $alpha: 0.7);
                    color: #eb9dc0;
                }
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
                    background-color: #25206e;
                    border-radius: 10px;
                    box-sizing: border-box;
                    ::v-deep .el-skeleton {
                        --el-skeleton-color: #3b3387;
                        --el-skeleton-to-color: #6961a8a2;
                    }
                }
            }
        }
    }
}
</style>