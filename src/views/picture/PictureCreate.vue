<template>
    <div class="container">
        <div class="container-create">
            <!-- 左边菜单栏 -->
            <div class="left">
                <div class="left-divide"></div>
                <div 
                    v-for="item in TAB_MENU" 
                    :key="item.id" 
                    class="left-context" 
                    :class="{'selected': item.label == activeTabLabel}"
                    @click="handleChangeMenu(item.label)">
                    <div class="icon">
                        <span class="iconfont ai-wenshengtu" v-if="item.label == '文生图'"></span>
                        <!-- <span class="iconfont ai-similar" v-if="item.label == '相似图像生成'"></span> -->
                        <span class="iconfont ai-tushengwen" v-if="item.label == '图片解说'"></span>
                    </div>
                    <div class="left-context-text">{{ item.label }}</div>
                </div>
            </div>

            <!-- 右边创作区 -->
            <div class="right">
                <TextToPicture v-if="activeTabLabel == '文生图'"></TextToPicture>
                <PictureToText v-if="activeTabLabel == '图片解说'"></PictureToText>
                <!-- <PictureSimilar v-if="activeTabLabel == '相似图像生成'"></PictureSimilar> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TextToPicture from './TextToPicture.vue';
import PictureToText from './PictureToText.vue';
import PictureSimilar from './PictureSimilar.vue';

const TAB_MENU = [
    {
        id: 1,
        label: '文生图',
        description: '用户输入文字描述，AI生成对应的图片',
    },
    {
        id: 2,
        label: '图片解说',
        description: '用户上传图片，AI生成对应的文字描述',
    },
    // {
    //     id: 3,
    //     label: '相似图像生成',
    //     description: '用户上传一张图片，AI根据图片生成相似图像',
    // },
]


const activeTabLabel = ref('文生图') 
const handleChangeMenu = (label: any) => {
    if (activeTabLabel.value === label )  return 
    activeTabLabel.value = label;

}
</script>

<style lang="scss" scoped>
.container {
    color: #907ee9;
    .container-create {
        display: flex;
        flex-flow: row nowrap;
        .left {
            width: 140px;
            height: calc(100vh - 92px);
            background: #0e0e27;
            padding: 15px;
            .left-divide {
                width: 80%;
                height: 2px;
                background-color:#907ee9;
                border-radius: 2px;
                margin: 20px 10px;
            }
            .left-context {
                display: flex;
                flex-flow: row nowrap;
                height: 24px;
                border-radius: 10px;
                margin-bottom: 10px;
                padding: 10px;
                font-size: 14px;
                cursor: pointer;
                &-text {
                    margin-left: 10px;
                }
            }
            .left-context.selected {
                color: #fff;
                background-color: #25206e;
                font-weight: 600;
            }
            .ai-similar {
                font-size: 12px;
            }
        }
        .right {
            flex: 1;
            padding: 10px ;
            background: #0e0e27;
            display: flex;
            flex-flow: row nowrap;
        }
    }
}
</style>