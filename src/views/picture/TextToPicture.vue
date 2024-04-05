<template>
    <div class="container">
        <!-- 左边需求 -->
        <div class="container-left">
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
                <!-- 历史记录列表 -->
                <div class="result-list" v-for="item in resultList">
                    <div class="result-list-content">{{ item.content }}</div>
                    <div class="result-list-img">
                        <el-image 
                            :src="value"  
                            v-for="value in item.imgUrl" 
                            v-if="item.imgUrl.length !== 0" 
                            :preview-src-list="item.imgUrl" 
                            infinite></el-image>
                        <!-- 预览骨架屏 -->
                        <el-skeleton style="width: 100%" loading animated v-else class="skeleton">
                            <template #template>
                                <el-skeleton-item variant="image" style="width: 33.3%;height: 200px;" v-for="item in 3"/>
                            </template>
                        </el-skeleton>
                    </div>
                    <div class="result-list-footer">
                        <span>{{ item.createTime }}</span>
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
            </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getCurrentTime } from '@/utils/index';
import { Loading } from '@element-plus/icons-vue'

const resultList = ref([
    {
        id: 1,
        content: '文本内容文本内容',
        createTime: '2023-12-12 12:12:12',
        imgUrl: [
            'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
            'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
            'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        ],
        scale: '1:1',
    },
    {
        id: 2,
        content: '文本内容文本内容',
        createTime: '2023-12-12 12:12:19',
        imgUrl: [
            'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
            'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
            'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        ],
        scale:'9:16',
    },
    {
        id: 3,
        content: '文本内容文本内容',
        createTime: '2023-12-12 12:12:19',
        imgUrl: [
            'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
            'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
            'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        ],
        scale:'16:9',
    },
])

const inputText = ref('');

const handleAddExample = () => {
    inputText.value = '油彩画。很多玫瑰花，壁纸居中，粉黄渐变，玫瑰场景，极高分辨率，暖色光影，自然光，电影光影，整洁。'
}

const SCALE = ['1 : 1','9 : 16','16 : 9'];
const activeScale = ref('1：1');
const changeScale = (item: string) => {
    if (activeScale.value === item )  return 
    activeScale.value = item;
}

//开始创作
const isCreating = ref(false);
const textInputRef = ref(null);
const currentTime = ref('');

//生成状态中间数据
const creatingData = computed(() => {
    return {
        content: inputText.value,
        createTime: currentTime.value,
        imgUrl: [],
        scale: activeScale.value,
    };
});

const handleCreate = async () => {
    if(inputText.value === '') {
        textInputRef.value.focus();
        ElMessage.error('请输入文本描述');
        return 
    }
    if(isCreating.value) return ElMessage.warning('请稍后再试，正在生成中...');
    try {
        isCreating.value = true;
        currentTime.value = getCurrentTime();
        resultList.value.unshift(creatingData.value)

        console.log('生成结果',resultList.value);
        const params = {
            inputText: inputText.value,
            scale: activeScale.value,
        }
        //TODO:发送文本生成图像的请求,结果的图片地址赋值给imgUrl

        //请求结束后
        // isCreating.value = false;

    } catch (error) {
        isCreating.value = false;
        ElMessage.error('生成失败！请稍后再试')
        resultList.value.shift();
    }

}

//删除历史记录
const handleDeleteHistory = (item: any) => {
    //TODO:发送请求
}
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
    &-left{
        position: relative;
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
                color: #e7b0c9;
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
            position: absolute;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            width: 200px;
            border-radius: 20px;
            margin-top: 100px;
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
                padding-right: 20px;
                padding: 10px;
                padding-bottom: 20px;
                border-radius: 8px;
                background-color: #25206e;
                margin-bottom: 50px;
                margin-right: 10px;
                &-content {
                    margin-bottom: 10px;
                    font-size: 15px;
                    color: #fff;
                }
                &-img,.skeleton {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    gap: 8px;
                    ::v-deep .el-skeleton {
                        --el-skeleton-color: #3b3387;
                        --el-skeleton-to-color: #6961a8a2;
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
</style>