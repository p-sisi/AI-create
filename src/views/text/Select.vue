<template>
    <div class="body-select">
        <div style="display: flex;align-items: center;gap: 10px;margin-top: 30px;">
            <img src="../../assets/images/logo.png" alt="">
            <span class="select-title">你的智能化平台</span>
        </div>
        <div class="select-btn">
            <div class="select-btn-mul" @click="clickMul">多轮对话</div>
            <div class="select-btn-temp" @click="clickTemp">模板快速创作</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router/index.ts';

const clickMul  = () => {
    //跳转至多轮对话
    router.push('/ai_text/multiple')
}

const clickTemp = () => {
    //跳转至模板创作
    router.push('/ai_text/temp')
}

</script>

<style scoped lang="scss">
        .body-select {
            height: 90vh;
            width: 100%;
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            background: linear-gradient(to bottom, #0f1012, #33243e);
            background-image: url('../../assets/images/select-bg.jpg');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            box-sizing: border-box;
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
</style>