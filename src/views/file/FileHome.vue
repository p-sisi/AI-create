<template>
    <div class="container">
        <el-affix>
            <div class="header">
                <div style="display: flex;align-items: center;gap: 10px;">
                    <div class="back-to">
                        <span class="iconfont ai-back" @click="handleBackToHome"></span>
                    </div>
                    <img src="../../assets/images/logo.png" alt="" class="header-logo">
                    <div class="header-title">文档宝库</div>
                </div>
                <div class="header-use">
                    <el-avatar size="20" src="/src/assets/images/user.png"></el-avatar>
                    <span>{{ commonStore.userInfo.nickname }}</span>
                    <span>|</span>
                    <span class="iconfont ai-loginOut" @click="loginOutdialogVisible = true"></span>
                </div>
            </div>
        </el-affix>

        <!-- 头部介绍区 -->
        <div class="introduce">
            这里是一些介绍啥的，设计一下
            <div>
                
                <el-button v-if="isShowUploadBtn == true" type="primary" @click="handleClick" color="#b73fed">上传文档</el-button>
            </div>
        </div>

        <!-- 上传文档区 -->
        <div v-if="isShowUpload" class="upload-file">
            <div class="file-tips">
                <div>文档格式：支持PDF、World、MarkDown</div>
                <div>文档大小：文档最大支持100M</div>
                <div>文档页数：PDF、world最多可支持100页，字数不限</div>
            </div>
            <el-upload
                class="uploader"
                :show-file-list="false"
                @change="handleChangeFile"
            >
                <div class="uploader-tip">
                    <span class="iconfont ai-upload"></span>
                    <p>拖拽文件到此处，或点击上传</p>
                </div>
            </el-upload>
            <div style="display: flex;flex-direction: column; justify-content: space-between">
                <div class="file-file" v-if="uploadFile">
                    <span class="iconfont ai-file" style="font-size: 40px;color:#67c23a"></span>
                    <span style="display: flex;flex-direction: column;justify-content: space-between;padding: 10px 0;">
                        <span >{{ uploadFile?.name }}</span>
                        <div style="font-size: 12px;color:#ccc">{{ ((uploadFile?.size/1024)/1024).toFixed(2) }}M</div>
                    </span>
                </div>
                <div class="file-btn">
                    <el-button plain @click="handleCancelUpload">取消</el-button>
                    <el-button type="primary" color="#b73fed" @click="handleCreate">上传</el-button>
                </div>
            </div>
        </div>
        <!-- 文档历史记录区 -->
        <div class="file-list">
            <div v-for="item in fileChatList" :key="item.id" class="file-list-item">
                <div class="title"  @click="handleGoToCreate(item)">{{ item.title }}</div>
                <div style="height: 1px;width: 100%;background-color: #ccc;"></div>
                <div style="display: flex;justify-content: space-between;align-items: center;padding: 4px;margin-right: 10px;">
                    <div class="time">
                        <span class="iconfont ai-note"></span>
                        <span style="margin-left: 10px;">{{ getStringTime(item.createTime) }}</span>
                    </div>
                    <el-popconfirm
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        :icon="InfoFilled"
                        icon-color="#b73fed"
                        title="确定删除该文档记录？"
                        @confirm="deleteChat(item)"
                    >
                        <template #reference>
                            <div class="iconfont ai-delete" style="color:#8c939d;margin-top: 4px;cursor: pointer;"></div>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
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
import { ref, onMounted, Ref } from 'vue'
import router from '@/router/index.ts';
import { useCommonStore, useFileStore } from '../../store'
import { ElMessage } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue'
import { fetchLoginOut } from '../../apis/user'
import { fetchFileList, fetchDeleteFileChat } from '../../apis/file'
import axios from 'axios';
import { getStringTime } from '../../utils/index'

onMounted(() => {
    getFileChatList()
})

const commonStore = useCommonStore();
const fileStore = useFileStore();

const handleBackToHome = () => {
    router.push('/')
}

interface LIST {
    id: number,
    userId: number,
    title: string,
    originalFilename: string,   
    depositFilename: string,        //文件预览时，传这个名字
    createTime: string,
    fileSize: number
}

const fileChatList: Ref<LIST[]> = ref([]);     //文档对话列表

/**
 *   获取所有对话记录
 */
const getFileChatList = async () => {
    try {
        const result = await fetchFileList();
        fileChatList.value = result.data;
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

/**
 *  删除某个对话
 */
const deleteChat = async(item: any) => {
    try {
        await fetchDeleteFileChat({
            chatId:item.id
        })
        ElMessage.success('删除成功')
        getFileChatList()
    } catch (error: any) {
        ElMessage.error(error.message)
    }
}

//点击历史记录，跳转至创作页
const handleGoToCreate = (item: any) => {
    router.push({ path: '/ai_file/file_create', query: { chatId: item.id} });
    fileStore.setSelectFileInfo(item)
    console.log(item);
    console.log(fileStore.selectFileInfo)
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

const isShowUpload = ref(false);    //是否展示上传文档区
const isShowUploadBtn = ref(true); //是否展示上传文档按钮

const uploadFile = ref();           //当前选择的文件

const handleChangeFile = (file: any) => {
    uploadFile.value = file.raw;
    console.log(file.raw)
};

const handleClick = () => {
    isShowUpload.value = true;
    isShowUploadBtn.value = false;
}

const handleCancelUpload = () => {
    isShowUpload.value = false;
    isShowUploadBtn.value = true;
}

// 设置请求头
const token = localStorage.getItem('Token');
const config = {
  headers: {
    'Content-Type': 'multipart/form-data', // 设置Content-Type为formData类型
    'Authorization': `${token}`, 
  }
}

/**
 *  自定义发送创建新对话请求
 */
const handleCreate = async () => { 
    if( !uploadFile.value)  return ElMessage.error('请先上传文件');
    try {
        let formData = new FormData();

        formData.append('file', uploadFile.value);
        axios.post(`http://localhost:1033/docChat/newChat?title=${uploadFile.value.name}`, formData, config)
            .then((response: any) => {
                console.log(response)
                //保存新对话id，带对话id跳转至文档创作页
                router.push({ path: '/ai_file/file_create', query: { chatId: response.data.data.id } })
                fileStore.setSelectFileInfo(response.data.data)
            })
            .catch((error: any) => {
                console.error('Error:', error);
            });
    } catch (error) {
        ElMessage.error('文档解析失败！请稍后再试')
    }
}
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    box-sizing: border-box;
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
    .introduce {
        padding: 20px 40px;
        color:#000000;
    }
    .upload-file {
        display: flex;
        width: 80%;
        margin: 0 auto;
        padding: 20px 40px;
        color: #000000;
        background-color: rgba(242, 232, 247, 0.326);
        border-radius: 10px;
        box-sizing: border-box;
        .file-tips {
            display: flex;
            margin-right: 10px;
            flex-direction: column;
            justify-content: flex-end;
            color: #8c939d;
            font-size: 12px;
        }
        .uploader {
            display: flex;
            flex-flow: column nowrap;
            margin-right: 30px;
            .uploader-tip {
                display: flex;
                flex-flow: column nowrap;
                align-items: center;
                justify-content: center;
                height: 200px;
                padding: 0px 40px;
                margin-left: 20px;
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                background-color: #fafafa;
                cursor: pointer;
                span {
                    font-size: 40px;
                    color: #8c939d;
                }
                p {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #8c939d;
                }
            }
            .uploader-tip:hover {
                border: 1px dashed #b73fed;
                span {
                    color: #b73fed;
                }
            }
        }
        .file-file {
            display: flex;
            gap: 20px;
            margin-top: 20px;
            padding-left: 10px;
            width: 400px;
            border: 1px solid #ccc;
            border-radius: 8px;
        }
        .file-btn {
            flex: 1;
            margin-top: 70px;
            display: flex;
            height: 100%;
            margin-left: 270px;
        }
    }
    .file-list {
        display: flex;
        padding: 20px 100px;
        gap: 20px;
        color: #000;
        .file-list-item {
            height: 120px;
            width: 300px;
            border: 1px solid #ccc;
            border-radius: 10px;
            transition: all 0.5s;
            box-sizing: border-box;
            .title {
                padding: 20px 10px;
                text-align: center;
                font-size: 20px;
                cursor: pointer;
            }
            .time {
                margin-left: 10px;
                margin-top: 10px;
                font-size: 14px;
                color: #8c939d;
            }
        }
        .file-list-item:hover {
            box-shadow: 0px 0px 10px rgba(#000,0.3);
            border: transparent;
        }
    }
}

</style>