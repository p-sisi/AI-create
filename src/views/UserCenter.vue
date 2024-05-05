<template>
    <el-affix>
    <div class="header">
        <div style="display: flex;align-items: center;gap: 10px;">
            <div class="back-to">
                <span class="iconfont ai-back" @click="router.go(-1)"></span>
            </div>
            <div class="header-title">返回</div>
        </div>
        <div class="header-use">
            <span>个人中心</span>
            <span>|</span>
            <span class="iconfont ai-loginOut" @click="loginOutdialogVisible = true"></span>
        </div>
    </div>
    </el-affix>

    <div class="center">
        <div class="image">
            <div class="img">
                <img src="/src/assets/images/user.png"/>
            </div>
            <div class="name">{{ commonStore.userInfo.nickname }}</div>
            <div style="display: flex;justify-content: center;margin-top: 20px">
                <el-button type="success" color="#b83ded">上传头像</el-button>
            </div>
        </div>
        <div class="info">
            <!-- 用户基本信息 -->
            <div style="font-weight: 600;">基本信息</div>
            <div class="info-basic">
                <div>
                    <span>昵称：</span>
                    <span v-if="!isEditName">{{ commonStore.userInfo.nickname }}</span>
                    <span v-else> <el-input v-model="editName" style="width: 240px"/></span>
                    <span v-if="!isEditName" style="color:#b83ded;font-size: 12px;cursor: pointer;margin-left: 10px;" @click="handleClickEditName">编辑</span>
                    <span v-else style="color:#b83ded;font-size: 12px;cursor: pointer;margin-left: 10px;" @click="handleEditName">保存</span>
                </div>
                <div>
                    <span>账号：</span>
                    <!-- <span>{{ commonStore.userInfo.account }}</span> -->
                    <span>{{ commonStore.userInfo.account }}</span>
                </div>
            </div>
            <!-- 安全设置 -->
            <div style="font-weight: 600; margin-top: 20px;">安全设置</div>
            <div class="info-safe">
                <div class="phone">
                    <span>
                        <span  class="title">手机</span>
                        <span>{{ commonStore.userInfo.phone == null ? '暂未绑定': commonStore.userInfo.phone }}</span>
                    </span>
                    <!-- <span class="btn" @click="handleClickBindPhone" v-if="!isBindPhone">{{ commonStore.userInfo.phone == null ? '立即绑定': '更改'}}</span> -->
                </div>
                <!-- 绑定手机号编辑区 -->
                <!-- <div v-if="isBindPhone" class="edit-form">
                    <div>
                        <span>&nbsp;&nbsp;手机号：</span>
                        <span><el-input style="width: 300px" placeholder="请输入旧密码" type="password"/></span>
                    </div>
                    <div>
                        <span>&nbsp;&nbsp;新 密 码：</span>
                        <span><el-input v-model="inputNewPassword" style="width: 300px" placeholder="请输入新密码" type="password"/></span>
                    </div>
                    <div>
                        <span>确认密码：</span>
                        <span><el-input v-model="inputNewPassword2" style="width: 300px;" placeholder="再次输入新密码" type="password"/></span>
                    </div>
                    <div class="edit-form-btn">
                        <el-button type="primary" color="#b83ded" >修改</el-button>
                        <el-button @click="isBindPhone = false">取消</el-button>
                    </div>
                </div> -->
                <div class="email">
                    <span>
                        <span  class="title">邮箱</span>
                        <span>{{ commonStore.userInfo.email == null ? '暂未绑定': commonStore.userInfo.email }}</span>
                    </span>
                    <span v-if="!isBindEmail" class="btn" @click="handleClickBindEmail">{{ commonStore.userInfo.email == null ? '立即绑定': '更改'}}</span>
                </div>
                <!-- 绑定邮箱编辑区 -->
                <div v-if="isBindEmail" class="edit-form">
                    <div>
                        <span>邮箱地址：</span>
                        <span><el-input v-model="inputEmail" style="width: 300px" placeholder="请输入邮箱地址"/></span>
                    </div>
                    <div>
                        <span>&nbsp;&nbsp;验 证 码：</span>
                        <span><el-input v-model="inputCode" style="width: 200px;margin-right: 4px" placeholder="请输入验证码"/></span>
                        <span><el-button style="width: 96px;" type="primary" color="#b83ded" @click="handleSendVerifyCode" :disabled="isSending">{{ !isSending ? '发送验证码': `(${sendTime}秒)`}}</el-button></span>
                    </div>
                    <div class="edit-form-btn">
                        <el-button type="primary" color="#b83ded" @click="bindEmail">确定</el-button>
                        <el-button @click="isBindEmail = false">取消</el-button>
                    </div>
                </div>
                <div class="password">
                    <span>
                        <span  class="title">密码</span>
                        <span>**********</span>
                    </span>
                    <span>
                        <span v-if="!isEditPasswordOld" class="btn" style="margin-right: 10px;" @click="handleClickPasswordOld">通过旧密码修改</span>
                        <span v-if="!isEditPasswordEmail" class="btn" @click="handleClickPasswordEmail">通过邮箱修改</span>
                    </span>
                </div>
                <!-- 修改密码编辑区 -->
                <div v-if="isEditPasswordOld" class="edit-form">
                    <div>
                        <span>&nbsp;&nbsp;旧 密 码：</span>
                        <span><el-input v-model="inputOldPassword" style="width: 300px" placeholder="请输入旧密码" type="password"/></span>
                    </div>
                    <div>
                        <span>&nbsp;&nbsp;新 密 码：</span>
                        <span><el-input v-model="inputNewPassword" style="width: 300px" placeholder="请输入新密码" type="password"/></span>
                    </div>
                    <div>
                        <span>确认密码：</span>
                        <span><el-input v-model="inputNewPassword2" style="width: 300px;" placeholder="再次输入新密码" type="password"/></span>
                    </div>
                    <div class="edit-form-btn">
                        <el-button type="primary" color="#b83ded" @click="editPasswordByOld">修改</el-button>
                        <el-button @click="isEditPasswordOld = false">取消</el-button>
                    </div>
                </div>
                <div v-if="isEditPasswordEmail" class="edit-form">
                    <div>
                        <span>&nbsp;&nbsp;新 密 码：</span>
                        <span><el-input v-model="inputNewPassword" style="width: 300px" placeholder="请输入新密码" type="password"/></span>
                    </div>
                    <div>
                        <span>确认密码：</span>
                        <span><el-input v-model="inputNewPassword2" style="width: 300px;" placeholder="再次输入新密码" type="password"/></span>
                    </div>
                    <div>
                        <span>邮箱地址：</span>
                        <span><el-input v-model="inputEmail" style="width: 300px" placeholder="请输入邮箱地址"/></span>
                    </div>
                    <div>
                        <span>&nbsp;&nbsp;验 证 码：</span>
                        <span><el-input v-model="inputCode" style="width: 200px;margin-right: 4px" placeholder="请输入验证码"/></span>
                        <span><el-button style="width: 96px;" type="primary" color="#b83ded" @click="handleSendVerifyCode" :disabled="isSending">{{ !isSending ? '发送验证码': `(${sendTime}秒)`}}</el-button></span>
                    </div>
                    <div class="edit-form-btn">
                        <el-button type="primary" color="#b83ded" @click="editPasswordByEmail">确定</el-button>
                        <el-button @click="isEditPasswordEmail = false">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
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
import { ref } from 'vue';
import { useCommonStore } from '@/store'
import { fetchUpdateUserName, } from '../apis/user'
import { ElMessage } from 'element-plus';
import router from '@/router/index.ts';

const commonStore = useCommonStore();

//编辑名字
const isEditName = ref(false)
const editName = ref('');   //编辑的用户名
const handleClickEditName = () => {
    isEditName.value = !isEditName.value;
    editName.value = commonStore.userInfo.nickname ;
}
const handleEditName = async () => {
    try {
        const params = {
            userId: commonStore.userInfo.userId,
            name: editName.value
        }
        await fetchUpdateUserName(params);
        commonStore.updateUserName(editName.value);
        ElMessage.success('修改成功')
        isEditName.value = !isEditName.value;
        editName.value = '';
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}


const isBindPhone = ref(false);     //是否绑定手机号
const isBindEmail = ref(false);     //是否绑定邮箱
const isEditPasswordOld = ref(false);     //通过旧密码编辑密码
const isEditPasswordEmail = ref(false);     //通过邮箱编辑密码
// const handleClickBindPhone = () => {
//     isBindPhone.value = true;
//     isBindEmail.value = false;
//     isEditPasswordOld.value = false;
//     isEditPasswordEmail.value = false;
// }
const handleClickBindEmail = () => {
    isBindEmail.value = true;
    isBindPhone.value = false;
    isEditPasswordOld.value = false;
    isEditPasswordEmail.value = false;
}
const handleClickPasswordOld = () => {
    isEditPasswordOld.value = true;
    isBindPhone.value = false;
    isBindEmail.value = false;
    isEditPasswordEmail.value = false;
}
const handleClickPasswordEmail = () => {
    isEditPasswordEmail.value = true;
    isBindPhone.value = false;
    isBindEmail.value = false;
    isEditPasswordOld.value = false;
}

const isSending = ref(false);
const sendTime = ref(60);
const inputEmail = ref('');   //邮箱地址
const inputCode = ref();      //验证码
const intervalId = ref();     //发送验证码倒计时定时器

//发送验证码
const handleSendVerifyCode = async () => {
    var pattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    if (!pattern.test(inputEmail.value)) {
        return ElMessage.error("请输入正确的邮箱地址");
    }
    //判断邮箱是否已经被绑定
    try {
        await fetchHasBindEmail({
            email: inputEmail.value
        })
    } catch (error:any) {
        ElMessage.error(error.message)
        return;
    }
    isSending.value = true;
    intervalId.value = setInterval(() => {
        sendTime.value--;
        if(sendTime.value <= 0) {
            clearInterval(intervalId.value);
            isSending.value = false;
        }
    }, 1000); 

    try {
        debugger
        const params = {
            email: inputEmail.value
        }
        await fetchSendEmailCode(params);
        ElMessage.success('验证码发送成功')
    } catch (error: any) {
        ElMessage.error(error.message)
        clearInterval(intervalId.value);
        isSending.value = false;
    }
}

/**
 *  根据邮箱修改密码
 */
const bindEmail  =  async () => {
    if(inputCode.value == '') {
        return ElMessage.error("请输入验证码");
    }
    try {
        const params = {
            email: inputEmail.value,
            code: inputCode.value
        }
        await fetchBindEmail(params);
        ElMessage.success('绑定成功')
        //修改store中数据
        commonStore.updateUserEmail(inputEmail.value)
        
        isEditPasswordEmail.value = false;
        isBindEmail.value = false;
        inputEmail.value = '';
        inputCode.value = '';
        isSending.value = false;
        clearInterval(intervalId.value);
        sendTime.value = 60;
    }catch(error: any) {
        ElMessage.error(error.message)
    }
}

//通过旧密码修改密码
const inputOldPassword = ref();     //旧密码
const inputNewPassword = ref();     //新密码
const inputNewPassword2 = ref();     //确认密码

const editPasswordByOld = async () => {
    if(inputOldPassword.value == '') {
        return ElMessage.error("请输入旧密码");
    }
    if(inputNewPassword.value == '') {
        return ElMessage.error("请输入新密码");
    }
    if(inputNewPassword2.value == '') {
        return ElMessage.error("请输入确认密码");
    }
    if(inputNewPassword.value != inputNewPassword2.value) {
        return ElMessage.error("新密码与确认密码不一致");
    }
    try {
        const params = {
            account: commonStore.userInfo.account,
            oldPassword: inputOldPassword.value,
            newPassword: inputNewPassword.value
        }
        await fetchUpdateUserPasswordByOld(params);
        ElMessage.success('修改成功')

        //重新登陆获取新token
        login();
        inputOldPassword.value = '';
        inputNewPassword.value = '';
        inputNewPassword2.value = '';
        isEditPasswordOld.value = false;
        isEditPasswordEmail.value = false;
    }catch(error: any) {
        ElMessage.error(error.message)
    }
}

//通过邮箱更改密码
const editPasswordByEmail = async () => {
    if(inputCode.value == '') {
        return ElMessage.error("请输入验证码");
    }
    try {
        const params = {
            account: commonStore.userInfo.account,
            email: inputEmail.value,
            code: inputCode.value,
            newPassword: inputNewPassword.value
        }
        await fetchUpdateUserPasswordByEmail(params);
        ElMessage.success('修改成功')
        //重新登陆获取新token
        login();

        inputEmail.value = '';
        inputCode.value = '';
        inputNewPassword.value = '';
        isEditPasswordEmail.value = false;
    }catch(error: any) {
        ElMessage.error(error.message)
    }
}

/**
 *  登录：目的是修改密码之后重新登陆，获取新token
 */
const login = async () => {
    try {
        const params = {
            account: commonStore.userInfo.account,
            password: inputNewPassword.value
        }
        const result =  await fetchLoginIn(params);
        ElMessage.success('登录成功')

        commonStore.setUserType(result?.data.userInfo.userType);
        commonStore.setUserInfo(result?.data.userInfo);
        localStorage.setItem('Token', result?.data.token);
    }catch(error: any) {
        ElMessage.error(error.message)
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
.center {
    display: flex;
    padding: 20px 40px;
    gap: 20px;
    color: #000000;
    .image {
        min-width: 250px;
        height: 300px;
        box-shadow: 0px 2px 8px rgba($color: #000000, $alpha: 0.2);
        border-radius: 8px;
        .img {
            display: flex;
            justify-content: center;
            margin-top: 20px;
            img {
                width: 80px;
                border-radius: 50%;
            }
        }
        .name {
            text-align: center;
            margin-top: 20px;
            font-size: 20px;
            font-weight: 600;
        }
    }
    .info {
        flex:1;
        height: 80vh;
        margin-left: 30px;
        border-radius: 8px;
        margin-bottom: 30px;
        .info-basic {
            margin-left: 40px;
            margin-top: 20px;
            display: flex;
            flex-flow: column nowrap;
            gap: 20px;
        }
        .info-safe {
            .phone,.email,.password {
                display: flex;
                justify-content: space-between;
                margin-left: 40px;
                margin-top: 20px;
                padding-bottom: 10px;
                padding-right: 40px;
                .title {
                    margin-right: 50px;
                    color: #999;
                }
                .btn {
                    color: #b83ded;
                    font-size: 12px;
                    cursor: pointer;
                    border-bottom: 1px solid #b83ded;
                }
            }
            .edit-form {
                margin-top: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                flex-flow: column nowrap;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
                .edit-form-btn {
                    margin-left: -90px;
                }
            }
        }
    }
}
</style>