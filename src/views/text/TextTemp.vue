<template>
    <div class="temp">
        <!-- 创作模板列表 -->
        <div class="temp-list" v-if="isShowTempList">
            <div class="header" @click="isShowTempList = false" v-show="Object.keys(textStore.selectedTemp).length !== 0">
                <span class="iconfont ai-back"></span>
                <span>返回编辑</span>
            </div>
            <el-scrollbar max-height="450px" >
                <div 
                    v-for="item in CREATION_TEMPLATE" 
                    :key="item.id" 
                    class="temp-list-body" 
                    @click="handleChangeTemp(item)"
                >
                    <div class="image">
                        <img :src="item.imgUrl" alt="">
                    </div>
                    <div class="list-detail">
                        <div class="title">{{ item.name }}</div>
                        <div class="introduce">{{ item.introduce }}</div>
                    </div>
                </div>
            </el-scrollbar>
        </div>

        <!-- 创作表单 -->
        <div class="temp-form" v-else>
            <!-- 头部 -->
            <div class="form-header">
                <div class="temp-form-header">
                    <div class="temp-form-int">
                        <img :src="formData.imgUrl" alt="">
                        <div>{{ formData.name }}</div>
                    </div>
                    <div class="header" @click="isShowTempList = true">
                        <div style="margin-top: -3px;margin-right: 8px;">选择创作模板</div>
                        <el-icon><ArrowRight /></el-icon>
                    </div>
                </div>

                <div class="temp-form-example" @click="handleExample">
                    <div class="iconfont ai-tips"></div>
                    <div>不知道写啥？试试<span>插入示例</span></div>
                </div>
            </div>
            <el-scrollbar :max-height="containerHeight" ref="container">
                <!-- 表单编辑区 -->
                <el-form 
                    id="form-edit"
                    class="edit-form " 
                    :model="formData"
                    ref="formRef"
                    label-position="top"
                    label-suffix="：" >
                    <el-form-item 
                        v-for="(item, index) in formData.formItems"
                        :key="index"
                        :label="item.label"
                        :prop="item.prop"
                    >
                        <!-- 单行输入框 -->
                        <div  v-if="item.type == 'input'" class="edit-text" @change="changeInputValue(item)">
                            <el-input 
                                class="inputText"
                                v-model="item.collectValue" 
                                :placeholder="item.placeholder"
                                clearable/>
                        </div>

                        <!-- 文本域输入框 -->
                        <div v-if="item.type == 'textarea'" class="edit-text-area">
                            <el-input 
                                type="textarea" 
                                v-model="item.collectValue"
                                :placeholder="item.placeholder" 
                                :autosize="{ minRows: 4, maxRows: 12}"/>
                            <div  class="footer" @click="item.collectValue = ''" v-if="item.collectValue !== ''">清空</div>
                        </div>

                        <!-- 单选框 -->
                        <div class="tab-check" v-if="item.type == 'selectRadio'">
                            <div 
                                v-for="value in item.options" 
                                :key="value"  
                                @click="selectTab(item, value)"  
                                :class="{ 'selected': value === item.collectValue }"
                            >
                                <span style="font-weight: 400;">{{ value }}</span>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </el-scrollbar>
            

            <!-- 生成按钮 -->
            <div class="create-btn" @click="handleCreate()" :class="{ 'is-creating': isCreating }">
                <div>{{ isCreating ? '正在生成中' : '立即生成' }}</div>
                <div>
                    <div class="ai-edit iconfont" v-if="!isCreating"></div>
                    <el-icon class="is-loading" v-else><Loading /></el-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTextStore } from '@/store';
import { ArrowRight, Loading } from '@element-plus/icons-vue'    
import { CREATION_TEMPLATE } from '@/content/createTemp'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { fetchAllTemp } from '../../apis/temp'

const textStore = useTextStore()

const isShowTempList = ref(true);      // 是否显示模板列表

const tempDataList = ref();         //请求获取到的模板列表信息

/**
 *  获取模板列表请求
 */
const getTempDataListRequest = async () => {
    try {
        const result = await fetchAllTemp;
        tempDataList.value = result;
    } catch (error: any) {
        ElMessage.error(error.message);
    }
}

/**
 *  将exampleValue中的值全都匹配到collectValue中，collectValue与表单值双向绑定
 */
const handleExample = () => {
    formData.value.formItems.forEach((item: any) => {
        if (item.exampleValue !== undefined && item.exampleValue !== '') {
            item.collectValue = item.exampleValue;
        }
    });
    console.log('表单数据', formData.value)
}

//表单数据
const formData = ref({
        id: null,
        name: '',
        introduce: '',
        imgUrl: '',
        formItems: []
});
 
// 单选按钮表单
const selectTab = (item: any, value: string) => {
    if( item.collectValue === value && item.rules.required !== 'true') {
        item.collectValue = '';
    } else {
        item.collectValue = value;
    }
    console.log('收集的信息', formData)
}

//生成
const formRef = ref<FormInstance>()
const isCreating = ref(false);

/**
 *  点击开始创作按钮
 */
const handleCreate = async () => {
    if(isCreating.value == true) return ElMessage.warning('正在生成中，请稍等');
    isCreating.value = true;
    textStore.setIsCreating(true);

    //TODO：整理数据，发送请求，请求返回的数据需要传递到textCreateResult组件中
}

const changeInputValue = (item: any) => {
    console.log(item)
}

//计算表单高度
const containerHeight = ref(0);
const container = ref(null);
const updateContainerHeight = () => {
    if (container.value ) {
        containerHeight.value = container.value.clientHeight - 98 - 54 - 80;
    }
};

//切换创作模板
const handleChangeTemp = (item: any) => {
    isShowTempList.value = false;
    // 修改store中的储存数据
    textStore.setSelectedTemp(item);

    formData.value = item;
}

onMounted(() => {
    getTempDataListRequest();

    updateContainerHeight(); 
    window.addEventListener('resize', updateContainerHeight);
    formData.value = textStore.selectedTemp
});
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    color:#e9e6e6;
    font-size: 14px;
    margin-bottom: 10px;
    .iconfont {
        font-size: 16px;
        margin-right: 10px;
    }
}
.header:hover {
    color: #fff;
}
.temp {
    .temp-list {
        cursor: pointer;
        .temp-list-body {
            display: flex;
            flex-flow: row nowrap;
            gap: 20px;
            height: 64px;
            width: 80%;
            margin: 10px 20px;
            padding: 20px;
            background-color: rgba(133, 136, 139, 0.3);
            border-radius: 10px;
            .image {
                width: 60px;
                height: 60px;
                background-color:#fff;
                border-radius: 10px;
                box-shadow: 0px 0px 5px 0 rgba(0, 0, 0, 0.3);
                img {
                    width: 50px;
                    height: 50px;
                    padding: 5px;
                }
            }
            .list-detail {
                .introduce {
                    margin-top: 4px;
                    font-size: 12px;
                    color: #85888b;
                }
            }
        }
        .temp-list-body:hover {
            background-color: rgba(123, 114, 129, 0.3);
        }
    }


    .temp-form {
        display: flex;
        height: 100%;
        flex-flow: column nowrap;
        padding: 10px;
        .form-header {
            height: 54px;
            .temp-form-header {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                color: #fff;
                font-size: 16px;
                .temp-form-int {
                    display: flex;
                    flex-direction: row;
                    img {
                        width: 28px;
                        height: 28px;
                        padding: 2px;
                        background-color: #fff;
                        border-radius: 4px;
                    }
                    div {
                        margin-left: 8px;
                    }
                }
            }
            .temp-form-example {
                flex: 1;
                display: flex;
                flex-flow: row nowrap;
                width: 190px;
                height: 22px;
                margin: 8px auto;
                background-color: rgba(133, 136, 139, 0.3);
                color: #e9e6e6;
                border-radius: 10px;
                .ai-tips {
                    color: #fdc732 ;
                    font-size: 18px;
                    margin-left: 10px;
                    margin-top: -4px;
                }
                div {
                    font-size: 12px;
                    margin-top: 2px;
                }
                span {
                    margin-left: 4px;
                    color: #bd70e6;
                    cursor: pointer;
                }
            }
            .temp-form-example:hover {
                color: #fff;
            }
        }

        .edit-form {
            height: calc(100vh - 98px - 54px - 80px);
            padding: 4px;
            margin-top: 18px;
            box-sizing: border-box;
            .edit-text {
                width: 100%;
                ::v-deep .el-input__wrapper {
                    background-color: rgba(133, 136, 139, 0.3);
                    box-shadow: 0 0 0 0px transparent;
                }
                ::v-deep .el-input__wrapper.is-focus {
                    box-shadow: 0 0 0 1px var(--el-input-focus-border-color);
                }
                ::v-deep .el-input__inner {
                    color: #fff;
                }
            }
            .edit-text-area {
                position: relative;
                width: 100%;
                ::v-deep .el-textarea__inner {
                    background-color: rgba(133, 136, 139, 0.3);
                    color: #fff;
                    border-radius: 10px;
                    border: none;
                    resize: none;
                    padding: 10px;
                    box-sizing: border-box;
                    box-shadow: 0 0 0 0px transparent;
                }
                ::v-deep .el-textarea__inner:focus {
                    border: none;
                    box-shadow: 0 0 0 1px var(--el-input-focus-border-color);
                }
                .footer {
                    position: absolute;
                    right: 2px;
                    cursor: pointer;
                    width: 30px;
                    font-size: 12px;
                }
                .footer:hover {
                    color: #409eff;
                }
            }
            //单选框样式
            .tab-check {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                div {
                    height: 32px;
                    padding: 0px 12px;
                    margin:0 8px 8px 0;
                    border-radius: 4px;
                    background-color: rgba(133, 136, 139, 0.3);
                    cursor: pointer;
                }
                div.selected {
                    background: #e9f2ff;
                    color: #1472FF;
                }
            }

        }
        .create-btn {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            width: 200px;
            margin: 0 auto;
            border-radius: 20px;
            background: linear-gradient(to right, #b93bed, #5cfcff);
            cursor: pointer;
            div {
                font-size: 16px;
                color: #fff;
                text-align: center;
                line-height: 40px;
            }
            .ai-edit {
                width: 40px;
                margin-left: -5px;
            }
            .is-loading {
                margin-left: 4px;
            }
        }
        .create-btn:hover{
            background: linear-gradient(to right, #c269e7, #7ce6e8);
        }
        //生成状态按钮样式
        .is-creating {
            background: linear-gradient(to right, #c269e7, #7ce6e8)!important;
            cursor: not-allowed!important;
        }
    }
}

::v-deep .el-form--default.el-form--label-top .el-form-item .el-form-item__label {
    margin-bottom: 4px;
    color: #fff;
}
</style>