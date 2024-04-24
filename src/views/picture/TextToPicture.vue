<template>
    <div class="container">
        <!-- 左边需求 -->
        <div class="container-left">
            <div>
                <div class="textInt">
                    <div class="textInt-title">文本生成图片</div>
                    <p class="textInt-promo">创造力与想象力的完美融合，让文字变为绚丽图像的神奇力量。</p>
                </div>

                <el-input
                    ref="textInputRef"
                    v-model="inputText"
                    style="width: 300px"
                    :rows="8"
                    type="textarea"
                    placeholder="请输入你心中的图片画面描述，尽量详细一点哦~"
                    resize="none"
                />
                <div class="promo example" @click="handleAddExample">插入示例</div>
                <div class="promo clear" @click="inputText = ''">清空</div>

                <div class="photo-text">照片比例：</div>
                <div class="photo-scale">
                    <div
                        v-for="item in SCALE"
                        @click="changeScale(item)"
                        class="scale"
                        :class="{ 'selected': item === activeScale }">
                        {{ item }}
                    </div>
                </div>
            </div>
            
            <div class="create-btn" @click="handleCreate" :disabled="isCreating">
                <div>{{ isCreating ? '正在作图中' : '开始作图' }}</div>
                <div>
                    <div class="ai-edit iconfont" v-if="!isCreating"></div>
                    <el-icon class="is-loading" v-else><Loading /></el-icon>
                </div>
            </div>
        </div>

        <!-- 右边结果 -->
        <div class="container-right">
            <el-scrollbar max-height="520px">
            <div class="result">
                <el-skeleton style="width: 100%" :loading="isLoading" animated :count="2"  :throttle="500">
                    <template #template>
                        <!-- 首次进入页面加载中骨架屏 -->
                        <div>
                            <el-skeleton-item variant="h4" style="width: 50%;margin: 10px;" />
                            <el-skeleton-item variant="h4" style="width: 80%;margin: 5px" />
                            <el-skeleton-item variant="h4" style="width: 30%;margin: 5px" />
                            <el-skeleton-item variant="image" style="width: 600px; height: 100px;margin: 10px;" />
                        </div>
                    </template>
                    <template #default>
                        <!-- 生成状态中的卡片 -->
                        <div class="result-list" v-if="isCreating">
                            <div class="result-list-content">{{ inputText }}</div>
                            <div class="result-list-img">
                                <el-skeleton style="width: 100%" loading animated class="skeleton">
                                    <template #template>
                                        <el-skeleton-item variant="image" style="width: 33.3%;height: 200px;" v-for="item in 3"/>
                                    </template>
                                </el-skeleton>
                            </div>
                        </div>
                        <!-- 历史记录列表 -->
                        <div class="result-list" v-for="item in historyData" :key="item.id">
                            <div class="result-list-content" @click="handleCopy(item.text)">{{ item.text }}</div>
                            <div class="result-list-img">
                                <div class="image-list">
                                    <!-- 第一张图片 -->
                                    <div class="image-list-item" 
                                        v-for="value in [{
                                            name: item.image1,isCollect:item.collect1},
                                            {name: item.image2,isCollect:item.collect2},
                                            {name: item.image3,isCollect:item.collect3}]"
                                        :key="value.name">
                                        <el-image class="item-image" :src="`${BASE_URL}/file/images/${value.name}`" infinite lazy
                                            :preview-src-list="[`${BASE_URL}/file/images/${item.image1}`, `${BASE_URL}/file/images/${item.image2}`, `${BASE_URL}/file/images/${item.image3}`]" >
                                            <template #placeholder>
                                                <div class="item-image-slot">Loading...</div>
                                            </template>
                                        </el-image>
                                        <div class="item-list-mask">
                                            <el-tooltip class="box-item" effect="dark" :content="value.isCollect ? '取消收藏' :'收藏'"placement="bottom">
                                                <span v-if="value.isCollect" class="iconfont ai-collect" style="color:#f7ba2a" @click="handleCollect(value,item)"></span>
                                                <span v-else class="iconfont ai-no-collect" @click="handleCollect(value,item)"></span>
                                            </el-tooltip>
                                            <el-divider direction="vertical" />
                                            <el-tooltip class="box-item" effect="dark" content="下载"placement="bottom">
                                                <span class="iconfont ai-xiazai" @click="handleDownLoad(value)"></span>
                                            </el-tooltip>
                                            <el-divider direction="vertical" />
                                            <el-tooltip class="box-item" effect="dark" content="分享至星球"placement="bottom">
                                                <span class="iconfont ai-share"></span>
                                            </el-tooltip>
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="image-footer" @click="console.log('n点击了上层')">
                                    <div v-for="(value,index) in [{name: item.image1,isCollect:item.collect1},{name: item.image1,isCollect:item.collect1},{name: item.image1,isCollect:item.collect1}]" @click.stop="console.log('点击')">
                                        <span v-if="value.isCollect == false && index == activeImageIndex && activeImageName == value.name" class="iconfont ai-no-collect collect-icon"></span>
                                        <span v-if="value.isCollect == true && showCollectIcon && activeImageName == value.name" class="iconfont ai-collect collect-icon"></span>
                                    </div>
                                </div> -->
                            </div>
                            <div class="result-list-footer">
                                <span>{{ getStringTime(item.createTime) }}</span>
                                <el-popconfirm
                                    width="220"
                                    confirm-button-text="确定"
                                    cancel-button-text="取消"
                                    icon-color="#626AEF"
                                    title="确定删除该条生成记录？删除后无法恢复记录"
                                    @confirm="handleDeleteHistory(item)"
                                >
                                    <template #reference>
                                        <span class="iconfont ai-delete"></span>
                                    </template>
                                </el-popconfirm>
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
import { ref, computed, onMounted, Ref } from 'vue';
import { TEXT_PICTURE_HISTORY } from '../../content/picture'
import { BASE_URL } from '../../content/user'
import { ElMessage } from 'element-plus';
import { getStringTime } from '@/utils/index';
import { Loading } from '@element-plus/icons-vue'
import axios from 'axios';
import { fetchHistoryTextTo, fetchTextToPictureCreate, fetchDeleteTextToPictureHistory,fetchCollectImage, fetchCancelCollectImage } from '../../apis/picture'

const isLoading  = ref(true);   //页面加载

const historyData: Ref<TEXT_PICTURE_HISTORY[]> = ref([]);

/**
 *  获取全部历史记录
 */
const getAllHistoryRequest = async() => {
    try {
        const result = await fetchHistoryTextTo();
        historyData.value = result.data.reverse();
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const inputText = ref('');      //用户输入的文本

const handleAddExample = () => {
    inputText.value = '油彩画。很多玫瑰花，壁纸居中，粉黄渐变，玫瑰场景，极高分辨率，暖色光影，自然光，电影光影，整洁。'
    activeScale.value = '1 : 1'
}

const SCALE = ['1 : 1','9 : 16','16 : 9'];
const activeScale = ref('1 : 1');
const changeScale = (item: string) => {
    if (activeScale.value === item )  return 
    activeScale.value = item;
}

const isCreating = ref(false);      //是否在生成中
const textInputRef = ref(null);

//获取后端需要的照片尺寸参数
const imageSize = computed(() => {
    if(activeScale.value == '1 : 1') return '1024*1024'
    if(activeScale.value == '9 : 16') return '720*1280'
    if(activeScale.value == '16 : 9') return '1280*720'
})

/**
 *  发送创作请求
 */
const handleCreate = async () => {
    if(inputText.value === '') {
        textInputRef.value.focus();
        ElMessage.error('请输入文本描述');
        return 
    }
    if(isCreating.value) return ElMessage.warning('请稍后再试，正在生成中...');
    try {
        isCreating.value = true;

        const params = {
            text: inputText.value,
            size: imageSize.value,
        }
        await fetchTextToPictureCreate(params);
        //返回数据结构  image3 = {filename:'',isSuccess:true}

        isCreating.value = false;
        inputText.value = ''

        getAllHistoryRequest();
    } catch (error) {
        isCreating.value = false;
        ElMessage.error('生成失败！请稍后再试')
    }
}

/**
 * 收藏和取消收藏
 * @param value ：{name: '',isCollect: false}
 * @param item ：{image1: '',image2: '',image3: '',collect1: false,collect2: false,collect3: false}
 */
const handleCollect = async(value: any,item: any) => {
    try {
        if(value.isCollect == true) {
            value.isCollect = false
            await fetchCancelCollectImage({
                imageName: value.name,
            })
            return  ElMessage.success('取消收藏成功');

        }else {
            value.isCollect = true
            await fetchCollectImage({
                imageName: value.name,
                title: item.text
            })
            return ElMessage.success('收藏成功');
        }
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

// 设置请求头
const token = localStorage.getItem('Token');
const config = {
  headers: {
    'Content-Type': 'multipart/form-data', // 设置Content-Type为formData类型
    'Authorization': `${token}`, 
  }
}
//下载图片
const handleDownLoad = async (value: any) => {
    try {
        axios.get(`http://localhost:1033/file/images/download/${value.name}`, config)
            .then((response: any) => {
                const blob = new Blob([response.data]);
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', value.name); // 在这里设置文件名
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                ElMessage.success('下载成功');
            })
            .catch((error: any) => {
                console.error('Error:', error);
            });

    } catch (error) {
        console.error('Error:', error);
    }
};


//删除历史记录
const handleDeleteHistory = async (item: any) => {
    try {
        await  fetchDeleteTextToPictureHistory({
            recordId: item.id
        })
        ElMessage.success('删除成功')
        getAllHistoryRequest();
    } catch (error: any) {
        ElMessage.error(error.message)
    }

}

//复制文本
const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    ElMessage.success('复制成功');
}

onMounted(() => {
    setTimeout(()=> {
        isLoading.value = false;
    },2000)
    getAllHistoryRequest()
})
</script>

<style lang="scss" scoped>
.promo {
    cursor: pointer;
    font-size: 12px;
    color: #e7b0c9;
}
.promo:hover {
    color:#b445ee;
}
.container {
    display: flex;
    flex-flow: row nowrap;
    gap: 10px;
    &-left{
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        width: 340px;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        background-color: rgba($color: #4236c6, $alpha: 0.3);
        box-shadow: 4px 4px 10px 0px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        color: #fff;
        .textInt {
            .textInt-title {
                font-size: 18px;
                margin-bottom: 8px;
            }
            .textInt-promo {
                font-size: 10px;
                margin-bottom: 20px;
                color: #c5c6d0;
            }
        }
        ::v-deep(.el-textarea__inner) {
            background-color:rgba($color: #907ee9, $alpha: 0.2);
            box-shadow: none;
            color: #fff;
            padding: 5px 10px 15px 10px
        }
        .example {
            position: relative;
            margin-top: -20px;
            margin-left: 6px;
            z-index: 999;
        }
        .clear {
            position: relative;
            cursor: pointer;
            margin-top: -18px;
            margin-left: 270px;
            z-index: 999;
        }
        .photo-text {
            font-size: 14px;
            margin: 20px 0px 10px 0px;
        }
        .photo-scale {
            display: flex;
            flex-flow: row nowrap;
            .scale {
                width: 100px;
                height: 30px;
                margin-right: 10px;
                text-align: center;
                line-height: 30px;
                color: #fff;
                font-size: 14px;
                background-color:rgba($color: #907ee9, $alpha: 0.2);
                border-radius: 2px;
                cursor: pointer;
                transition: all 0.3s;
            }
            .scale.selected {
                background-color:rgba($color: #907ee9, $alpha: 0.7);
                color: #eb9dc0;
            }
        }
        .create-btn {
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
        .create-btn:hover {
            background: linear-gradient(to right, #c269e7, #7ce6e8);
        }
    }

    &-right {
        flex:1;
        padding-left: 15px;
        .result {
            color: #fff;
            &-list {
                position: relative;
                padding-right: 30px;
                padding: 10px;
                border-radius: 8px;
                background-color: #25206e6f;
                margin-bottom: 50px;
                margin-right: 10px;
                &-content {
                    margin-bottom: 10px;
                    font-size: 15px;
                    color: #fff;
                    cursor: pointer;
                }
                .skeleton,.image-slot {
                    display: flex;
                    padding: 8px 20px;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    gap: 20px;
                }
                &-img {
                    display: flex;
                    flex-flow: column nowrap;
                    .image-list {
                        display: flex;
                        padding: 8px 20px;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        gap: 20px;
                        .image-list-item {
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-end;
                            align-items: flex-end;
                            .item-image {
                                .item-image-slot {
                                    height: 100%;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    color: #ccc;
                                    background-color: #0e0e27;
                                }
                            }
                            .item-list-mask {
                                display: flex;
                                align-items: center;
                                gap: 2px;
                                cursor: pointer;
                            }
                        }
                        // .image:hover:before {
                        //     content: "";
                        //     position: absolute;
                        //     top: 0;
                        //     left: 0;
                        //     width: 100%;
                        //     height: 100%;
                        //     background: linear-gradient(to top, rgba(#000,0.8), rgba(#000,0.0));
                        //     z-index: 2; /* 遮罩层的层级 ,要比图标低，因为图标需要显示高亮*/
                        //     pointer-events: none;//鼠标事件穿透遮罩层，图片层级1，为了点击图片可以进行预览
                        // }
                    }
                }
                &-footer {
                    float: right;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 20px;
                    margin-top: 20px;
                    font-size: 13px;
                    color: #907ee9;
                    .iconfont {
                        cursor: pointer;
                    }
                    .iconfont:hover {
                        color: #b445ee;
                    }
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