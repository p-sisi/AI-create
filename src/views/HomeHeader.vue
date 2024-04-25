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
            <div class="right-btn" v-if="commonStore.hasLogin == false">
                <div class="btn-sign" @click="handleClickSignUp()">Sign up</div>
                <div class="btn-login" @click="handleClickLoginIn()">Login in</div>
            </div>
            <div class="right-user" v-else>
                <el-avatar size="40" :src="userUrl"/>
                <span>{{ commonStore.userInfo.nickname }}</span>
                <span>|</span>
                <span class="iconfont ai-loginOut" @click="loginOutdialogVisible = true"></span>
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

            <!-- 登录模块 -->
            <div v-if="isLoginStatus">
                <!-- 切换登录头部 -->
                <div class="login-email" @click="loginByEmail()" v-if="!isLoginByEmail">
                    <span class="iconfont ai-youxiang"></span>
                    邮箱登录 >
                </div>
                <div class="login-account" @click="loginByAccount()" v-else>< 账号登录</div>
                <!-- 输入区 -->
                <div class="login-input">
                    <div class="account">
                        <span>{{ isLoginByEmail ? '邮  箱：' : '账号：' }}</span>
                        <span v-if="!isLoginByEmail">
                            <el-input v-model="inputAccount" ref="inputAccountLoginRef" placeholder="请输入账号" class="input-account"/>
                        </span>
                        <span v-else>
                            <el-input ref="inputEmailRef" v-model="inputEmail" placeholder="请输入邮箱地址" class="input-account"/>
                        </span>
                    </div>
                    <div class="password">
                        <span>{{ isLoginByEmail ? '验证码：' : '密码：' }}</span>
                        <span v-if="!isLoginByEmail">
                            <el-input v-model="inputPassword" ref="inputPasswordLoginRef" placeholder="请输入密码" type="password" class="input-account" show-password/>
                        </span>
                        <div v-else class="code">
                            <span><el-input v-model="inputCode" placeholder="请输入验证码" maxlength="6" class="input-account"/></span>
                            <div class="code-num" @click="handleSendVerifyCode()" :class="{'code-num-active': isSendingCode}">{{ isSendingCode ? `（${sendingTime}秒）后重发` :'发送验证码'}}</div>
                        </div>
                    </div>
                </div>
                <div class="login-btn">
                    <el-button type="primary" round style="width: 300px;height: 40px;color: #fff;" color="#938af5" @click="handleLogin()"> {{ isLoging ? '登  录 中': '登  录'}}</el-button>
                </div>
                <div class="login-footer">
                    <span>还没有账号？</span>
                    <span style="color: #938af5;cursor: pointer;" @click="isLoginStatus = false">去注册</span>
                </div>
            </div>

            <!-- 注册模块 -->
            <div v-else>
                <div class="login-input">
                    <div class="account">
                        <span>账号：</span>
                        <span ><el-input ref="inputAccountRef" v-model="inputAccount" style="width: 300px;" placeholder="请输入账号" class="input-account"/></span>
                    </div>
                    <div class="account">
                        <span>密码：</span>
                        <el-tooltip class="box-item" content="密码长度为8-20位，必须包含大小写字母、数字" effect="dark" placement="top">
                            <span ><el-input ref="inputPasswordRef" v-model="inputPassword" style="width: 300px;" placeholder="请输入密码" class="input-account" type="password" show-password/></span>
                        </el-tooltip>
                    </div>
                    <div class="account">
                        <span>邮  箱：</span>
                        <span>
                            <el-input ref="inputEmailSignRef" v-model="inputEmail" placeholder="请输入邮箱地址" class="input-account"/>
                        </span>
                    </div>
                    <div class="password">
                        <span>验证码：</span>
                        <div class="code">
                            <span><el-input ref="inputCodeRef" v-model="inputCode" style="width: 300px" placeholder="请输入验证码" class="input-account"/></span>
                            <div class="code-num" @click="handleSendVerifyCode()" :class="{'code-num-active': isSendingCode}">{{ isSendingCode ? `（${sendingTime}秒）后重发` :'发送验证码'}}</div>
                        </div>
                    </div>
                </div>
                <div class="login-btn">
                    <el-button type="primary" round style="width: 300px;height: 40px;color: #fff;" color="#938af5" @click="handleSign()">注  册</el-button>
                </div>
                <div class="login-footer">
                    <span>已有账号？</span>
                    <span style="color: #938af5;cursor: pointer;" @click="isLoginStatus = true">去登录</span>
                </div>
            </div>
        </el-dialog>
    </div>

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
import { HOME_MENU } from '../content/index';
import { ref,  } from 'vue';
import router from '../router/index.ts';
import { ElMessage } from 'element-plus';
import { useCommonStore } from '../store'
import { fetchLoginIn, fetchLoginOut, fetchSendVerifyCode, fetchLoginInByEmail,fetchSignUp } from '../apis/user'

const commonStore = useCommonStore();

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
const inputAccountLoginRef = ref(null);
const inputPassword = ref('');      //输入的密码
const inputPasswordLoginRef = ref(null);

//头部菜单栏
const activeMenu = ref('home');
const clickMenu = (type: string) => {
    //未登录，拦截
    if(!localStorage.getItem('Token')) return ElMessage.error('请先登录')
    if (activeMenu.value === type )  return 
    activeMenu.value = type;
    if(activeMenu.value === 'text') router.push('/ai_text/select')
    if(activeMenu.value === 'picture') router.push('/ai_picture/create')
    if(activeMenu.value === 'file') router.push('/ai_file/file_home')
}
const isLoging = ref(false);        //是否正在登录

/**
 *    登录
 *    保存token
 */
const handleLogin = async() => {
    if(inputAccount.value === '' || inputPassword.value === '') {
        if(inputAccount.value === '') {
            ElMessage.error('用户账号不能为空');
            inputAccountLoginRef.value.focus();
            return
        }else{
            ElMessage.error('用户密码不能为空');
            inputPasswordLoginRef.value.focus();
            return 
        }
    }
    let result;
    try {
        isLoging.value = true;
        if(isLoginByEmail.value == false) {
            const params = {
                account: inputAccount.value,
                password: inputPassword.value,
            }
            result = await fetchLoginIn(params);
        }else {
            await fetchLoginInByEmail({
                email: inputEmail.value,
                code: inputCode.value
            })
        }
        ElMessage.success('登录成功')
        dialogVisible.value = false;
        localStorage.setItem('Token', result?.data.token);

        commonStore.setHasLogin(true);
        commonStore.setUserInfo(result?.data.userInfo)

        //重置验证码倒计时，清除计时器
        sendingTime.value = 60;
        clearInterval(intervalId.value);
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const inputAccountRef = ref(null);
const inputCodeRef = ref(null);
const inputPasswordRef = ref(null);

/**
 *  注册，注册成功跳转登录
 */
const handleSign = async () => {
    if(inputAccount.value == ''){
        inputAccountRef.value.focus();
        ElMessage.error('账号不能为空')
        return
    }
    if(inputPassword.value == ''){
        inputPasswordRef.value.focus();
        ElMessage.error('密码不能为空')
        return
    }
    if(inputCode.value == ''){
        return ElMessage.error('验证码不能为空')
    }
    try {
        await fetchSignUp({
            account: inputAccount.value,
            email: inputEmail.value,
            password: inputPassword.value
        })
        ElMessage.success('注册成功');

        //设置为账号登录状态
        isLoginStatus.value = true;
        isLoginByEmail.value = false;

        inputPassword.value = '';
        inputCode.value = '';
        inputEmail.value = '';
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

const isLoginByEmail = ref(false);      //是否使用邮箱登录

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

const inputEmail = ref('');        // 输入的邮箱
const inputEmailRef = ref(null);
const inputCode = ref('');          //输入的验证码

const isSendingCode = ref(false);       //是否正在发送验证码
const sendingTime = ref(60);          //发送验证码倒计时
const intervalId = ref();          //发送验证码倒计时定时器

//发送验证码
const handleSendVerifyCode = async () => {
    var pattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    if (!pattern.test(inputEmail.value)) {
        inputEmailRef.value.focus();
        return ElMessage.error("请输入正确的邮箱地址");
    }
    isSendingCode.value = true;
    intervalId.value = setInterval(() => {
        sendingTime.value--;
        if(sendingTime.value <= 0) {
            clearInterval(intervalId.value);
            isSendingCode.value = false;
        }
    }, 1000); 

    try {
        const params = {
            email: inputEmail.value
        }
        await fetchSendVerifyCode(params);
        ElMessage.success('验证码发送成功')
    } catch (error: any) {
        ElMessage.error(error.message)
        clearInterval(intervalId.value);
        isSendingCode.value = false;
    }
}

//用户信息
const userUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

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
        .right-user {
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
                        width: 300px;
                        .el-input__wrapper {
                            background-color:#090312!important;
                            box-shadow: 0 0 0 0px transparent !important;
                            border-radius: 10px;
                            .el-input__inner {
                                height: 40px;
                                color: #fff;
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