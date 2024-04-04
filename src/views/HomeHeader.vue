<template>
    <div class="home-header">
        <div class="home-header-left">
            <img src="../assets/images/logo.png" alt="" class="left-img">
            <span>AI综合创作平台</span>
        </div>
        <div class="home-header-center">
            <div 
                class="center-item" 
                v-for="item in HOME_MENU"
                :key="item.key"
                :class="{'isSelected': item.type === activeMenu}"
                @click="clickMenu(item.type)"
            >{{item.label}}
            </div>
        </div>
        <div class="home-header-right">
            <div class="right-btn" v-if="!isLogin">
                <div class="btn-sign" @click="handleSign">Sign up</div>
                <div class="btn-login" @click="handleLogin">Login in</div>
            </div>
            <div class="right-user" v-else>
                <el-avatar size="40" :src="userUrl"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { HOME_MENU } from '../content/index';
import { ref } from 'vue';
import router from '../router/index.ts';

//头部菜单栏
const activeMenu = ref('home');
const clickMenu = (type: string) => {
    if (activeMenu.value === type )  return 
    activeMenu.value = type;
    if(activeMenu.value === 'text') router.push('/ai_text')
    if(activeMenu.value === 'picture') router.push('/ai_picture/create')
    if(activeMenu.value === 'file') router.push('/ai_file')
}

// 注册事件
const handleSign = () => {
    console.log('handleSign')
}

//登录事件
const handleLogin = () => {
    console.log('handleLogin')
}

// 是否登录
const isLogin = ref(false);

//用户信息
const userUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

</script>

<style lang="scss" scoped>
.home-header {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    // 左侧
    &-left {
        display: flex;
        cursor: pointer;
        .left-img {
            width: 40px;
        }
        span {
            margin-left: 20px;
            margin-top: 4px;
            background: linear-gradient(to right, #b93bed, #5cfcff);
            -webkit-background-clip: text; 
            color: transparent; 
            display: inline-block; 
            font-size: 22px;
        }
    }
    // 中间
    &-center {
        display: flex;
        gap: 20px;
        flex-flow: row nowrap;
        cursor: pointer;
        .center-item {
            margin-top: 10px;
            color: rgb(133, 136, 139);
        }
        .isSelected {
            font-size: 18px;
            color: aliceblue;
            border-bottom: 2px solid ;
        } 
    }
    // 右侧
    &-right {
        .right-btn {
            display: flex;
            justify-content: center;
            color: aliceblue;
            cursor: pointer;
            .btn-sign {
                padding: 5px 30px;
                border: 1px solid #b93bed;
                border-radius: 30px;
            }
            .btn-login {
                padding: 5px 30px;
                margin-left: 20px;
                border-radius: 30px;
                background: linear-gradient(to right, #b93bed, #66e5fd);
            }
            .btn-login:hover {
                background: linear-gradient(to right, #bf74df, #78daee);
                color: #fff;
            }
            .btn-sign:hover {
                border: 1px solid #d39eea;
            }
        }
    }
}

</style>