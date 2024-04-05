<template>
    <div class="container flex-row">
        <!-- 需求区 -->
        <div class="container-left flex-column">
            <div class="container-left-need">
                <div class="need-title">图片解说</div>
                <p class="need-int">基于图片进行文字创作、回答问题，帮你写文案、构思故事，助你释放创造力，提供灵感和创作支持。</p>
                <div class="need-img">
                    <el-upload
                        class="uploader"
                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                        :show-file-list="false"
                    >
                        <img v-if="imgUrl !== ''" :src="imgUrl" class="img" />
                        <div v-else class="uploader-tip">

                        </div>
                    </el-upload>
                </div>
            </div>

            <div class="container-left-btn"  @click="handleCreate">
                <div>{{ isCreating ? '正在作图中' : '开始作图' }}</div>
                <div>
                    <div class="ai-edit iconfont" v-if="!isCreating"></div>
                    <el-icon class="is-loading" v-else><Loading /></el-icon>
                </div>
            </div>
        </div>

        <!-- 结果区 -->
        <div class="container-right">
            结果
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue'

const isCreating = ref(false);

const imgUrl = ref('');

//创作
const handleCreate = async () => { 
    try {
        
    } catch (error) {
        
    }
}

</script>

<style lang="scss" scoped>
.flex-row {
    display: flex;
    flex-flow: row nowrap;
}
.flex-column {
    display: flex;
    flex-flow: column nowrap;
}
.container {
    justify-content: space-between;
    &-left {
        justify-content: space-between;
        width: 340px;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        background-color: rgba($color: #4236c6, $alpha: 0.3);
        box-shadow: 4px 4px 10px 0px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        color: #fff;
        &-need {
            .need-title {
                font-size: 18px;
            }
            .need-int {
                font-size: 10px;
                margin-bottom: 20px;
                color: #c5c6d0;
            }
            .need-img {
                width: 100%;
                height: auto;
                border: 1px solid #fff;
                .uploader {
                    width: 100%;
                    height: 178px;
                    display: block;
                    .img {

                    }
                    &-tip {

                    }
                }
            }
        }

        &-btn {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            width: 200px;
            border-radius: 20px;
            margin-top: 100px;
            margin-left: 44px;
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
        &-btn:hover {
            background: linear-gradient(to right, #c269e7, #7ce6e8);
        }
    }
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #181747;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: red;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>