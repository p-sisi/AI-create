<template>
    <div class="text_container">
        <!-- 头部 -->
        <el-affix>
            <div class="header">
                <div style="display: flex;align-items: center;gap: 10px;">
                    <div class="back-to">
                        <span class="iconfont ai-back" @click="handleBackToHome"></span>
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
                
                <div class="header-use">
                    <el-avatar size="10" src="/src/assets/images/user.png"/>
                    <span>{{ commonStore.userInfo.nickname }}</span>
                    <span>|</span>
                    <span class="iconfont ai-loginOut" @click="loginOutdialogVisible = true"></span>
                </div>
            </div>
        </el-affix>

        <div class="body">
            <!-- 文本类子路由出口 -->
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
import { ref } from 'vue'
import router from '@/router/index.ts';
import { useCommonStore } from '../../store'
import { ElMessage } from 'element-plus';
import { fetchLoginOut } from '../../apis/user'

const commonStore = useCommonStore();

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
    activeMenu.value = item.label
    if(activeMenu.value === '创作区') {
        router.push('/ai_text/select')
    } else {
        router.push('/ai_text/collect')
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

<style lang="scss" scoped>
.text_container {
    width: 100%;
    background: #000000;
    .header { 
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 20px;
        background:#000000;
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
        .header-use {
            display: flex;
            align-items: center;
            gap: 10px;
            .iconfont {
                cursor: pointer;
            }
            .iconfont:hover {
                color:#938af5;
            }
        }
    }

    .body {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 20px;
        height: calc(100% - 50px); 
    }
}
</style>