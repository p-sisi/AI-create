<template>
     <div class="container flex-row">
        <!-- 需求区 -->
        <div class="container-left flex-column">
            <div class="container-left-need">
                <div class="need-title">相似图像生成</div>
                <p class="need-int">以图像为基础，帮助你发现相关联的图片，并提供相关信息和灵感，为你的创作、研究和探索提供强大支持。</p>
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
                                    <el-image v-if="item.originImg == ''" :src="imgUrl" :preview-src-list="[imgUrl]"/>
                                    <el-image v-else :src="item.originImg" :preview-src-list="[item.originImg]"/>
                                </div>
                            </el-tooltip>
                            <span>图片</span>
                        </div>
                        
                        <div>
                            <span>{{ item.createTime }}</span>
                            <span style="margin: 8px;color: #3b3387">|</span>
                            <el-popconfirm width="220"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                icon-color="#626AEF"
                                title="确定删除该条生成记录？删除后无法恢复记录" 
                                @confirm="handleDelete(item)" teleported>
                                <template #reference>
                                    <span class="iconfont ai-delete icon"></span>
                                </template>
                            </el-popconfirm>
                        </div>
                    </div>

                    <div class="list-img">
                        <el-image 
                            :src="value"  
                            v-for="value in item.imgUrlArray" 
                            v-if="item.imgUrlArray.length !== 0" 
                            :preview-src-list="item.imgUrlArray" 
                            infinite></el-image>
                        <!-- 预览骨架屏 -->
                        <el-skeleton style="width: 100%" loading animated v-else class="skeleton">
                            <template #template>
                                <el-skeleton-item variant="image" style="width: 33.3%;height: 200px;" v-for="item in 3"/>
                            </template>
                        </el-skeleton>
                    </div>
                </div>
            </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { UploadProps } from 'element-plus'
import { Plus, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { getCurrentTime } from '@/utils/index';

const DATA = ref([
    {
        id: 1,
        originImg: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        imgUrlArray:[
            'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
            'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
            'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        ],
        createTime: '2023-03-01 12:00:00',
    },
    {
        id: 2,
        originImg: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        imgUrlArray:[
            'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
            'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
            'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        ],
        createTime: '2023-03-01 12:00:00',
    },
    {
        id: 3,
        originImg: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        imgUrlArray:[
            'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
            'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
            'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        ],
        createTime: '2023-03-01 12:00:00',
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

const currentTime = ref('');
//生成状态卡片数据
const creatingData = computed(() => {
    return {
        id: 3,
        originImg: imgUrl.value,
        imgUrlArray:[],
        createTime: currentTime.value,
    }
})
//创作
const handleCreate = async () => {
    if(isCreating.value) return ElMessage.warning('请稍后再试，正在生成中...');

    try {
        isCreating.value = true;
        currentTime.value = getCurrentTime();

        DATA.value.unshift(creatingData.value)

    } catch (error) {
        isCreating.value = false;
        ElMessage.error('生成失败！请稍后再试')
        DATA.value.shift();
    }
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
                &-img,.skeleton {
                    display: flex;
                    width: 100%;
                    min-height: 50px;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    gap: 8px;
                    background-color: #25206e;
                    border-radius: 10px;
                    box-sizing: border-box;
                    ::v-deep .el-skeleton {
                        --el-skeleton-color: #3b3387;
                        --el-skeleton-to-color: #6961a8a2;
                    }
                }
                &-img {
                    padding: 10px;
                    margin-top: 10px;
                }
            }
        }
    }
}
</style>