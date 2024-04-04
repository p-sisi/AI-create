<template>
    <div class="text_container">
        <!-- 头部 -->
        <el-affix>
            <div class="header">
                <div class="back-to">
                    <span class="iconfont icon-fanhui" @click="handleBackToHome"></span>
                </div>
                <img src="../../assets/images/logo.png" alt="" class="header-logo">
                <div class="header-title">智能笔墨</div>
                <div class="header-menu">
                    <div 
                        v-for="item in tabMenu" 
                        :key="item.key" 
                        @click="handleClickMenu(item)"
                        :class="{'isSelected': item.label === activeMenu}"
                        >{{ item.label }}</div>
                </div>
            </div>
        </el-affix>

        <div class="body" v-if="isShowCreate">
            <!-- 模板创作区 -->
            <div class="body-temp">
                <TextTemp></TextTemp>
            </div>
            <!-- 创作结果区 -->
            <div class="body-result">
                <TextCreateResult></TextCreateResult>
            </div>
        </div>
        <!-- 我的收藏 -->
        <div class="collect" v-else>
            <TextCollect></TextCollect>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router/index.ts';
import TextTemp from './TextTemp.vue';
import TextCreateResult from './TextCreateResult.vue';
import TextCollect from './TextCollect.vue';

const handleBackToHome = () => {
    router.push('/')
}

//头部菜单
const tabMenu = [
    {
        key: 1,
        label: '创作区',
        name: 'create'
    },
    {
        key: 2,
        label: '我的收藏',
        name: 'collect'
    }
]
const activeMenu = ref('创作区')
const handleClickMenu = (item : any) => {
    if(item.label === activeMenu.value)  return 
    else {
        isShowCreate.value = !isShowCreate.value
        activeMenu.value = item.label
    }

}

//是否展示创作区
const isShowCreate = ref(true)
</script>

<style lang="scss" scoped>
.text_container {
    background: linear-gradient(to right, #1d1723, #171f24);
    .header { 
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        height: 60px;
        padding: 0 20px;
        background:linear-gradient(to right, #0b0a0c, #161a1c);
        .back-to {
            height: 36px;
            width: 36px;
            border: 1px solid rgb(133, 136, 139);
            border-radius: 10px;
            span {
                color: rgb(133, 136, 139);
                font-size: 20px;
                line-height: 36px;
                text-align: center;
                margin-left: 7px;
                transition: color .3s;
            }
            span:hover {
                cursor: pointer;
                color: #bd70e6;
            }
        }
        .header-logo {
            margin-left: 20px;
            width: 26px;
            height: 26px;
        }
        .header-title {
            margin-left: 4px;
            color: #fff; 
            display: inline-block; 
        }
        .header-menu {
            margin-left: 100px;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 40px;
            color: rgb(133, 136, 139);
            div {
                padding-bottom: 4px;
                cursor: pointer;
                transition: color .3s, font-size .3s;
            }
            div:hover {
                color: #fff;
            }
            .isSelected {
                background: linear-gradient(to right, #b93bed, #5cfcff); 
                -webkit-background-clip: text; 
                color: transparent; 
                display: inline-block; 
                font-size: 18px;
                border-bottom: 1px solid #fff;
            }
        }
    }

    .body {
        display: flex;
        flex-direction: row;
        gap: 20px;
        height: calc(100% - 80px);
        padding: 10px 20px;
        .body-temp {
            width: 400px;
            padding: 8px;
            background: #0b0a0c;
            border-radius: 10px;
        }
        .body-result {
            flex: 1;
            padding: 8px;
            border-radius: 10px;
        }
    }
}
</style>