<template>
    <div class="picture">
        <!-- 头部 -->
        <el-affix>
            <div class="picture-header">
                <div class="header">
                    <div class="back-to">
                        <span class="iconfont ai-back" @click="handleBackToHome"></span>
                    </div>
                    <img src="../../assets/images/logo.png" alt="" class="header-logo">
                    <div class="header-title">视觉魔法</div>
                    <div class="header-menu">
                        <div 
                            v-for="item in ['创作区','创意星球','我的']"  
                            @click="handleClickHeaderMenu(item)"
                            :class="{'isSelected': item === pictureStore.activeHeaderMenu}"
                        >{{ item }}</div>
                    </div>
                </div>

                <!-- 个人头像 -->
                <div class="header-use" @click="router.push('/user_info')">
                    <el-avatar size="20" src="/src/assets/images/user.png"></el-avatar>
                    <span>{{ commonStore.userInfo.nickname }}</span>
                    <span>|</span>
                    <span class="iconfont ai-loginOut" @click="loginOutdialogVisible = true"></span>
                </div>
            </div>
        </el-affix>

        <!-- 内容 -->
        <div class="container-create">
            <!-- 图片创作子路由出口 -->
            <router-view></router-view>
        </div>
    </div>

    <!-- 退出登录确认框 -->
    <el-dialog
        v-model="loginOutdialogVisible"
        title="提示"
        width="400"
    >
        <span style="margin-left: 20px;">确定要退出登录？</span>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="loginOutdialogVisible = false" >取消</el-button>
            <el-button type="primary" @click="loginOutRequest" color="#b24aee">退出</el-button>
        </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchLoginOut } from '../../apis/user'
import router from '@/router/index.ts';
import { usePictureStore } from '@/store'
import { useCommonStore } from '../../store'

const commonStore = useCommonStore();

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


/**
 *  退出登录
 */
 const loginOutdialogVisible = ref(false);       //退出登录对话框
const loginOutRequest = async() => {
    try {
        await fetchLoginOut({
            token: localStorage.getItem('Token')
        })
        localStorage.removeItem('Token');
        ElMessage.success('退出登录成功')
        //清除store中数据
        commonStore.setHasLogin(false);
        commonStore.setUserInfo({});

        loginOutdialogVisible.value = false;
        
        router.push('/home')
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}
</script>

<style scoped lang="scss">
.picture {
    background: #181747;
    height: 100vh;
    .picture-header {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 20px;
        background: #0e0e27;
        color: #fff;
        .header {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
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
        .header-use {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            .iconfont {
                cursor: pointer;
            }
            .iconfont:hover {
                color:#938af5;
            }
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