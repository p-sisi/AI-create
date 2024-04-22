<template>
    <div class="picture">
        <!-- 头部 -->
        <el-affix>
            <div class="header">
                <div class="back-to">
                    <span class="iconfont ai-back" @click="handleBackToHome"></span>
                </div>
                <img src="../../assets/images/logo.png" alt="" class="header-logo">
                <div class="header-title">视觉魔法</div>
                <div class="header-menu">
                    <div 
                        v-for="item in ['创作区','创意星球','收藏夹']"  
                        @click="handleClickHeaderMenu(item)"
                        :class="{'isSelected': item === pictureStore.activeHeaderMenu}"
                    >{{ item }}</div>
                </div>
            </div>
        </el-affix>

        <!-- 内容 -->
        <div class="container-create">
            <!-- 图片创作子路由出口 -->
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router/index.ts';
import { usePictureStore } from '@/store'

const pictureStore = usePictureStore();

const handleBackToHome = () => {
    router.push('/')
}

//切换菜单
const handleClickHeaderMenu = (item: any) => {
    if(item === pictureStore.activeHeaderMenu)  return 
    else {
        pictureStore.setActiveHeaderMenu(item);
        if(item === '创意星球'){
            router.push('/ai_picture/star')
        }else if(item === '创作区') {
            router.push('/ai_picture/create')
        } else{
            router.push('/ai_picture/collect')
        }
    }
}

</script>

<style scoped lang="scss">
.picture {
    background: #181747;
    height: 100vh;
    .header {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        height: 60px;
        padding: 0 20px;
        background: #0e0e27;
        color: #fff;
        .back-to {
            height: 36px;
            width: 36px;
            border: 1px solid #fff;
            border-radius: 10px;
            span {
                color: #fff;
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
            margin-left: 6px;
            display: inline-block; 
            font-weight: 600;
        }
    }
    &-create {
        height: calc(100vh - 92px);
    }
}
//头部菜单样式
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
</style>