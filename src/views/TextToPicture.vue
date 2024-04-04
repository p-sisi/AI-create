<template>
    <div class="container">
        <!-- 左边需求 -->
        <div class="container-left">
            <div class="textInt">
                <div class="textInt-title">文本生成图片</div>
                <div class="textInt-promo">创造力与想象力的完美融合，让文字变为绚丽图像的神奇力量。</div>
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
            <div class="create-btn" @click="handleCreate">
                <div>{{ isCreating ? '正在作图中' : '开始作图' }}</div>
                <div>
                    <div class="icon-icon-edit iconfont" v-if="!isCreating"></div>
                    <el-icon class="is-loading" v-else><Loading /></el-icon>
                </div>
            </div>
        </div>

        <!-- 右边结果 -->
        <div class="container-right">

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const inputText = ref('');

const handleAddExample = () => {
    inputText.value = '油彩画。很多玫瑰花，壁纸居中，粉黄渐变，玫瑰场景，极高分辨率，暖色光影，自然光，电影光影，整洁。'
}

const SCALE = ['1：1','9：16','16：9','3：4'];
const activeScale = ref('1：1');
const changeScale = (item: string) => {
    if (activeScale.value === item )  return 
    activeScale.value = item;
}

//开始创作
const isCreating = ref(false);
const textInputRef = ref(null);
const handleCreate = () => {
    if(inputText.value === '') {
        textInputRef.value.focus();
        ElMessage.success('请输入文本描述');
        return 
    }
}
</script>

<style lang="scss" scoped>
.promo {
    cursor: pointer;
    font-size: 12px;
    color: #e7b0c9;
}
.container {
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
            }
            .textInt-promo {
                font-size: 11px;
                margin-bottom: 20px;
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
                padding-left:14px ;
                line-height: 30px;
                color: #e7b0c9;
                font-size: 14px;
                background-color:rgba($color: #907ee9, $alpha: 0.2);
                margin-right: 10px;
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
            margin-top: 116px;
            margin-left: 44px;
            background: linear-gradient(to right, #b93bed, #5cfcff);
            cursor: pointer;
            div {
                font-size: 16px;
                color: #fff;
                text-align: center;
                line-height: 40px;
            }
            .icon-icon-edit {
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
}
</style>