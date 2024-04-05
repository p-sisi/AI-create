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
                    >
                        <img v-if="imgUrl !== ''" :src="imgUrl" class="img" />
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
                <div>{{ isCreating ? '正在作图中' : '开始作图' }}</div>
                <div>
                    <div class="ai-edit iconfont" v-if="!isCreating"></div>
                    <el-icon class="is-loading" v-else><Loading /></el-icon>
                </div>
            </div>
        </div>

        <!-- 结果区 -->
        <div class="container-right">
            <div>
                
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus'

const isCreating = ref(false);

const imgUrl = ref('');

const handleUploadSuccess: UploadProps['onSuccess'] = (
    response:any,
    uploadFile:any
) => {
    imgUrl.value = URL.createObjectURL(uploadFile.raw!)
    console.log('上传成功', response, uploadFile)
    console.log('图片地址', imgUrl.value)
}

const handleUploadError: UploadProps['onError'] = (
    response:any,
    uploadFile:any
) => {
    imgUrl.value = URL.createObjectURL(uploadFile.raw!)
    console.log('上传失败', response, uploadFile)
    console.log('图片地址', imgUrl.value)
}

const TYPE = ['普通','诗歌','故事构造'];

const activeType = ref('普通') 
const radioChange = (label: any) => {
    if (activeType.value === label )  return 
    activeType.value = label;
}

//创作
const handleCreate = async () => { 
    try {
        
    } catch (error) {
        
    }
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
        margin: 0px 16px ;
    }
}
</style>