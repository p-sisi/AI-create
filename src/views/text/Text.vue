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
                    <el-avatar size="20" >user</el-avatar>
                    <span>{{ commonStore.userInfo.nickname }}</span>
                    <span>|</span>
                    <span class="iconfont ai-loginOut" @click="loginOutdialogVisible = true"></span>
                </div>
            </div>
        </el-affix>

        <div class="body" v-if="isShowCreate">
            <div v-if="isSelectType" class="body-select">
                <div style="display: flex;align-items: center;gap: 10px;margin-top: 30px;">
                    <img src="../../assets/images/logo.png" alt="">
                    <span class="select-title">你的智能化平台</span>
                </div>
                <div class="select-btn">
                    <div class="select-btn-mul" @click="clickMul">多轮对话</div>
                    <div class="select-btn-temp" @click="clickTemp">模板快速创作</div>
                </div>
            </div>
            <div v-else style="padding: 10px 20px;">
                <!-- 多轮对话 -->
                <div v-if="!textStore.isSelectedTemp">
                    <MultipleText></MultipleText>
                </div>
                <!-- 模板对话 -->
                <div v-else class="body-temp-create">
                    <!-- 创作区 -->
                    <div class="body-temp">
                        <TextTemp></TextTemp>
                    </div>
                    <!-- 结果区 -->
                    <div class="body-result">
                        <TextCreateResult></TextCreateResult>
                    </div>
                </div>
            </div>

        </div>
        <!-- 我的收藏 -->
        <div class="collect" v-else>
            <TextCollect></TextCollect>
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
import TextTemp from './TextTemp.vue';
import TextCreateResult from './TextCreateResult.vue';
import TextCollect from './TextCollect.vue';
import MultipleText from './MultipleText.vue';
import {useTextStore, useCommonStore } from '../../store'
import { ElMessage } from 'element-plus';
import { fetchLoginOut } from '../../apis/user'

const textStore = useTextStore();
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
    isShowCreate.value = !isShowCreate.value
    activeMenu.value = item.label
}

//是否展示创作区
const isShowCreate = ref(true)

const isSelectType = ref(true);    //是否在选择多轮对话、模板创作

//点击了多轮对话
const clickMul  = () => {
    isSelectType.value = false;
    textStore.setIsSelectTemp(false);
}

//点击了模板创作
const clickTemp = () => {
    isSelectType.value = false;
    textStore.setIsSelectTemp(true);
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
    background: linear-gradient(to right, #1d1723, #171f24);
    .header { 
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
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
        height: calc(100% - 80px);
        .body-select {
            height: 90vh;
            width: 100%;
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            background: linear-gradient(to bottom, #0f1012, #33243e);
            .select-title {
                font-size: 30px;
            }
            img {
                width: 80px;
            }
            .select-btn {
                margin-top: 40px;
                display: flex;
                gap: 20px;
                font-size: 20px;
                .select-btn-mul {
                    padding: 10px 20px;
                    border: 1px solid #bd70e6;
                    border-radius: 30px;
                    transition: all .4s;
                    cursor: pointer;
                }
                .select-btn-mul:hover {
                    background-color: #bd70e6;
                    padding: 10px 30px;
                }
                .select-btn-temp {
                    padding: 10px 20px;
                    background-color: #b93bed;
                    border-radius: 30px;
                    transition: all .4s;
                    cursor: pointer;
                }
                .select-btn-temp:hover {
                    padding: 10px 30px;
                }
            }
        }
        .body-temp-create {
            display: flex;
            flex-direction: row;
            height: 100%;
            gap: 20px;
            .body-temp {
                width: 400px;
                padding: 8px;
                background: #0b0a0c;
                border-radius: 10px;
            }
            .body-result {
                width: 900px;
                padding: 8px;
                border-radius: 10px;
            }
        }
    }
}
</style>