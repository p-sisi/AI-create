<!-- 首页中间主体部分 -->
<template>
    <div class="home-body">
        <!-- 第一部分 -->
        <el-row>
            <el-col :span="12" class="body-left">
                <span>智能创作，尽在一处</span>
                <div class="left_C">以AI之力，绘就文学华章；融合创意，雕刻艺术边界。AI综合创作平台，赋予文本、图像、文档以灵魂，开启艺术新纪元。</div>
                <div class="left_E">With the power of <div class="left_AI animate__animated animate__backInUp">AI</div>, painting a brilliant chapter of literature; fusing creativity, carving the boundary of art. AI comprehensive creation platform, giving text, image, document with soul, opening a new era of art.</div>
                <div class="create_btn" @click="handleStartCreate">
                    开始体验 
                    <div class="iconfont icon-ai-TopRight" ></div>
                </div>
            </el-col>
            <el-col :span="12" class="body-right">
                <div><img src="../assets/images/ball.png" alt=""></div>
            </el-col>
        </el-row>

        <!-- FIXME: 介绍体验产品 -->

        <!-- 产品部分 -->
        <div class="body-experience">
            Start To Experience
            <div ref="animation1" class="car-animation"></div>
        </div>
        <div class="experience">
            <div>
                <span>开启您的AI之旅</span>
                <div>降低你的AI使用门槛，发挥你的创作能力</div>
            </div>
        </div>
        <div class="body-product">
            <div 
                class="product" 
                v-for="item in HOME_PRODUCT" 
                :key="item.id"
                @mouseover="showButton(item)"
                @mouseleave="hideButton"
                >
                    <div class="product-title">
                        <img :src="item.productUrl" alt="">
                        <div>{{ item.productName }}</div>
                    </div>
                <div class="product-text">{{ item.productIntroduce }}</div>
                <div v-show="item.id == activeProductId">
                    <div class="create_btn" @click="StartToCreate(item)" >
                        去体验 
                        <div class="iconfont icon-ai-TopRight" ></div>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script setup lang="ts">
import car from "../assets/images/car.json"
import { ref, onMounted } from 'vue'
import lottie from 'lottie-web'
import { HOME_PRODUCT }  from '../content'
import router from '../router/index.ts';

const animation1 = ref<any>(null)

onMounted(() => {
    lottie.loadAnimation({
        container: animation1.value,  
        renderer: 'svg',   
        loop: true,   
        autoplay: true,   
        animationData: car  
    })
})

// 开始体验
const handleStartCreate = () => {
    //滚动到当前页面某个位置
}

//鼠标移动触发事件
const isShowButton = ref(false);
let activeProductId = ref();
const showButton = (item: any) => {
    activeProductId.value = item.id;
    isShowButton.value = true;
}
const hideButton = () => {
    activeProductId.value = 4;
    isShowButton.value = false;
}
const StartToCreate = (item: any) => {
    if(item.id == 1) router.push('/ai_text')
    if(item.id == 2) router.push('/ai_picture')
    if(item.id == 3) router.push('/ai_file')
}
</script>

<style lang="scss" scoped>
.home-body {
    padding: 40px;
    .body-left {
        display: flex;
        flex-flow: column nowrap;
        span {
            color:#fff;
            font-size: 36px;
        }
        
        .left_C {
            margin: 10px 0;
            color: #aeaeae;
        }
        .left_E {
            color: #666464;
            .left_AI {
                display: inline-block;
                font-size: 40px;
                font-weight: 900;
                background: linear-gradient(to bottom, #933ce5, #386eda);
                -webkit-background-clip: text; 
                color: transparent; 
            }
        }
        .create_btn {
            cursor: pointer;
            padding: 5px 30px;
            margin-top: 20px;
            margin-left: 10px;
            width: 100px;
            text-align: center;
            border-radius: 30px;
            color: #fff;
            background: linear-gradient(to right, #b93bed, #66e5fd);
            transition: width 0.3s, background 0.2s;
            .icon-ai-TopRight {
                display: inline-block;
                margin-left: 10px;
            }
        }
        .create_btn:hover {
            width: 120px;
            background: linear-gradient(to right, #bf74df, #78daee);
            color: #fff;
        }
    }
    .body-right {
        img {
            width: 350px;
            margin-left: 140px;
        }
    }
    .body-experience {
        margin-top: 50px;
        font-size: 36px;
        font-weight: 900;
        color: #19b8bc;
        .car-animation {
            width: 100px;
            height: 90px;
            margin-top: -95px;
            margin-left: 360px;
        }
    }
    .experience {
        display: flex;
        justify-content: flex-end;
        color: #fff;
        div {
            display: flex;
            flex-direction: column;
            span {
                margin-left: 174px;
            }
        }
    }
    .body-product {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        gap: 30px;
        margin: 20px;
        .product {
            width: 270px;
            height: 150px;
            padding: 20px;
            border: 1px solid #19b8bc;
            border-radius: 30px;
            transition: box-shadow 0.5s, border 0.3s, height 0.4s, width 0.4s;
            .product-title {
                display: flex;
                flex-flow: row nowrap;
                img {
                    width: 100px;
                }
                div {
                    margin-top: 20px;
                    margin-left: 30px;
                    color: #fff;
                    font-size: 24px;
                    font-weight: 700;
                }
            }
            .product-text {
                margin-top: 20px;
                font-size: 14px;
                color: #b2adad;
            }
            .create_btn {
                cursor: pointer;
                padding: 5px 30px;
                margin-top: 30px;
                margin-left: 60px;
                width: 100px;
                text-align: center;
                border-radius: 30px;
                color: #fff;
                background: linear-gradient(to right, #b93bed, #66e5fd);
                .icon-ai-TopRight {
                    display: inline-block;
                    margin-left: 10px;
                }
            }
        }
        .product:hover {
            width: 300px;
            height: 220px;
            border: 1px solid #802ba5; 
            box-shadow: 6px 6px 6px 1px rgba(84, 20, 113, 0.75);
        }
    }
}
</style>