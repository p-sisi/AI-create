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
                <div class="btn-sign" @click="handleClickSignUp()">Sign up</div>
                <div class="btn-login" @click="handleClickLoginIn()">Login in</div>
            </div>
            <div class="right-user" v-else>
                <el-avatar size="40" :src="userUrl"/>
            </div>
        </div>
    </div>

    <!-- 注册登录弹窗 -->
    <div class="dialog-class">
        <el-dialog 
        v-model="dialogVisible" 
        width="600" class="dialog" 
        style="--el-dialog-bg-color:#1a1a23;--el-dialog-border-radius:20px;"
        modal-class="dialog-modal"
        >
            <div class="dialog-header">
                <img src="/src/assets/images/logo.png" alt="">
                <span>AI创作</span>
            </div>
            <!-- 登录 -->
            <div v-if="isLoginStatus">
                <div class="login-email" @click="loginByEmail()" v-if="!isLoginByEmail">
                    <span class="iconfont ai-youxiang"></span>
                    邮箱登录 >
                </div>
                <div class="login-account" @click="loginByAccount()" v-else>
                    < 账号登录
                </div>
                    <div class="login-input">
                        <div class="account">
                            <span>{{isLoginByEmail ? '邮  箱：' : '账号：'}}</span>
                            <span v-if="!isLoginByEmail"><el-input v-model="inputAccount" style="width: 300px;" placeholder="请输入账号" class="input-account"/></span>
                            <span v-else><el-input ref="inputEmailRef" v-model="inputEmail" style="width: 300px;" placeholder="请输入邮箱号" class="input-account"/></span>
                        </div>
                        <div class="password">
                            <span>{{isLoginByEmail ? '验证码：' : '密码：'}}</span>
                            <span v-if="!isLoginByEmail"><el-input v-model="inputPassword" style="width: 300px" placeholder="请输入账号" type="password" class="input-account"/></span>
                            <div v-else class="code">
                                <span><el-input v-model="inputCode" style="width: 300px" placeholder="请输入验证码" class="input-account"/></span>
                                <div class="code-num" @click="handleSentCode()" :class="{'code-num-active': isSending}">发送验证码</div>
                            </div>
                        </div>
                    </div>
                    <div class="login-btn">
                        <el-button type="primary" round style="width: 300px;height: 40px;color: #fff;" color="#938af5" @click="handleLogin()">登录</el-button>
                    </div>
                    <div class="login-footer">
                        <span>还没有账号？</span>
                        <span style="color: #938af5;cursor: pointer;" @click="isLoginStatus = false">去注册</span>
                    </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { HOME_MENU } from '../content/index';
import { ref,  } from 'vue';
import router from '../router/index.ts';
import { ElMessage } from 'element-plus';

const dialogVisible = ref(false);
const isLoginStatus = ref(true);          //是否  true登录状态 false注册状态

const handleClickSignUp = () => {
    dialogVisible.value = true;
    isLoginStatus.value = false;
}
const handleClickLoginIn = () => {
    dialogVisible.value = true;
    isLoginStatus.value = true;
}

const inputAccount = ref('');       // 输入的账号
const inputPassword = ref('');      //输入的密码
const inputEmail = ref('');        // 输入的邮箱
const inputEmailRef = ref(null);
const inputCode = ref('');          //输入的验证码

const isSending = ref(false);       //是否正在发送验证码

//头部菜单栏
const activeMenu = ref('home');
const clickMenu = (type: string) => {
    if (activeMenu.value === type )  return 
    activeMenu.value = type;
    if(activeMenu.value === 'text') router.push('/ai_text')
    if(activeMenu.value === 'picture') router.push('/ai_picture/create')
    if(activeMenu.value === 'file') router.push('/ai_file')
}

//登录事件
const handleLogin = () => {
    if(inputAccount.value == '' || inputPassword.value == ''){
        return ElMessage.error('账号密码不能为空')
    }
}

const isLoginByEmail = ref(false);

//点击邮箱登录
const loginByEmail = () => {
    isLoginByEmail.value = true;
    inputAccount.value = ''
    inputPassword.value = '';
}

//点击账号登录
const loginByAccount = () => {
    isLoginByEmail.value = false;
    inputEmail.value = '';
    inputCode.value = '';
}

//发送验证码
const handleSentCode = () => {
    if(inputEmail.value == ''){
        inputEmailRef.value.focus();
        return ElMessage.error('邮箱不能为空')
    }
    if(isSending) {
        return ElMessage.warning('验证码已发送')
    }
}

// 是否登录
const isLogin = ref(false);

//用户信息
const userUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

</script>

<style lang="scss" >
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

.dialog-class {
    .dialog-modal {
        background: rgba($color: #0b0a0c, $alpha: 0.9)!important;
    }
    .dialog {
//登录注册弹窗样式
        .dialog-header {
                display: flex;
                justify-content: center;
                img {
                    width: 40px;
                }
                span {
                    margin-left: 14px;
                    margin-top: 4px;
                    background: linear-gradient(to right, #b93bed, #5cfcff);
                    -webkit-background-clip: text; 
                    color: transparent; 
                    display: inline-block; 
                    font-size: 22px;
                    font-weight: 600;
                }
            }
            .login-email {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                color: #bdbec3;
                cursor: pointer;
                span {
                    color: #938af5;
                    margin-right: 6px;
                    font-size: 17px;
                }
            }
            .login-account {
                color: #bdbec3;
                margin-left: 20px;
                cursor: pointer;
            }
            .login-email:hover,.login-account:hover {
                color: #fff;
            }
            .login-input {
                display: flex;
                margin-top: 20px;
                flex-flow: column nowrap;
                align-items: center;
                gap: 20px;
                color: #bdbec3;
                .account,.password {
                    .input-account {
                        .el-input__wrapper {
                            background-color:#090312!important;
                            box-shadow: 0 0 0 0px transparent !important;
                            border-radius: 10px;
                            .el-input__inner {
                                height: 40px;
                            }
                        }
                        .el-input__wrapper:hover {
                            box-shadow: 0 0 0 1px #938af5!important;
                        }
                        .el-input__wrapper.is-focus {
                            box-shadow: 0 0 0 1px #938af5!important;
                        }
                    }
                }
                .password {
                    display: flex;
                    justify-content: center;
                    align-items:center ;
                    .code {
                        position: relative;
                        display: flex;
                        justify-items: center;
                        align-items: center;
                        color: #938af5;
                        .code-num {
                            position: absolute;
                            margin-left: 220px;
                            cursor: pointer;
                        }
                        .code-num-active {
                            color: #b0aaf4;
                        }
                        .code-num-active:hover {
                            cursor: not-allowed;
                        }
                    }
                }

            }
        .login-btn {
            display: flex;
            justify-content: center;
            margin-top: 40px;
        }
        .login-footer {
            display: flex;
            margin-top: 30px;
            margin-bottom: 20px;
            justify-content: center;
        }
    }

}


//输入框样式

</style>