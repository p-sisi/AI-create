<!-- 首页中间主体部分 -->
<template>
    <div class="home-body">
        <!-- 第一部分 -->
        <el-row>
            <el-col :span="12" class="body-left">
                <span>智能创作，尽在一处</span>
                <div class="left_C">以AI之力，绘就文学华章；融合创意，雕刻艺术边界。AI综合创作平台，赋予文本、图像、文档以灵魂，开启艺术新纪元。</div>
                <div class="left_E">With the power of 
                    <div class="left_AI animate__animated animate__backInUp">AI</div>
                    , <span class="type-text">{{ activeTypeText }}</span>
                </div>
                <div class="create_btn" @click="handleStartCreate">
                    开始体验 
                    <div class="iconfont icon-ai-TopRight" ></div>
                </div>
            </el-col>
            <el-col :span="12" class="body-right">
                <div><img src="../assets/images/ball.png" alt=""></div>
            </el-col>
        </el-row>

        <div style="margin: 90px 20px 20px 20px;">
            <div style="text-align: center;"><img style="width: 30%;" src="../assets/images/what.png" alt=""></div>
            <el-divider style="margin-bottom: 40px;">We can do everything you want</el-divider>
        </div>
        <el-carousel
            :interval=2000
            type="card" 
            height="320px"
            pause-on-hover
            >
            <el-carousel-item>
                <img src="../assets/images/product1.jpg" alt="">
            </el-carousel-item>
            <el-carousel-item>
                <img src="../assets/images/product2.jpg" alt="">
            </el-carousel-item>
            <el-carousel-item>
                <img src="../assets/images/product3.jpg" alt="">
            </el-carousel-item>
        </el-carousel>
        
        <!-- 下面三个优势点：中间一个球形的图标 -->
        <div class="body-advantage">
            <div style="display: flex;justify-content: flex-start;margin-left: -380px;margin-top: 100px"><img style="height: 800px;opacity: 0.5;" src="../assets/images/home-bg2.png" alt=""></div>
            <div style="display: flex;flex-direction: column;margin-left: 20px;">
                <div class="body-advantage-title1">我们的具有的优势</div>
                <div><img style="width: 40%;" src="../assets/images/why.png" alt=""></div>
                <div style="height: 1px;width:400px;background-color: #fff;"></div>
                <div style="display: flex;gap: 20px;margin-left: 120px;margin-top: 30px;">
                    <div>
                        <div class="advantage">
                            <span style="background-color: #aa40e2;padding: 4px;border-radius: 4px;">diversity</span>
                            <span style="color:#aa40e2">--Template creation, Free Dialogue, free choice </span>
                            <div style="font-size: 20px;padding: 8px 0;font-weight: 600;">多样创作</div>
                            <div style="font-size: 14px;">创意无限，多种模式任你选！自由对话，模板填写，一切创作方式尽在掌握。</div>
                        </div>
                        <div class="advantage">
                            <span style="background-color: #aa40e2;padding: 4px;border-radius: 4px;">efficient</span>
                            <span style="color:#aa40e2">--Template creation, Free Dialogue, free choice </span>
                            <div style="font-size: 20px;padding: 8px 0;font-weight: 600;">高效性</div>
                            <div style="font-size: 14px;">快捷高效，创作轻松完成！模板填写，文图互转，创意从未如此简单。</div>
                        </div>
                    </div>
                    <div style="margin-top: 100px">
                        <div class="advantage">
                            <span style="background-color: #aa40e2;padding: 4px;border-radius: 4px;">interaction</span>
                            <span style="color:#aa40e2">--Template creation, Free Dialogue, free choice </span>
                            <div style="font-size: 20px;padding: 8px 0;font-weight: 600;">创意互动</div>
                            <div style="font-size: 14px;">激发灵感，创意互动！文本转图像，图像转文本，创意无边界。</div>
                        </div>
                        <div class="advantage">
                            <span style="background-color: #aa40e2;padding: 4px;border-radius: 4px;">pluralism</span>
                            <span style="color:#aa40e2">--Template creation, Free Dialogue, free choice </span>
                            <div style="font-size: 20px;padding: 8px 0;font-weight: 600;">多元化创作</div>
                            <div style="font-size: 14px;">文本、图像，一键切换，多元创作，无限可能！释放创意，打造个性作品。</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


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
        <div class="body-product" ref="productRef">
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

        <!-- 回到顶部 -->
        <el-backtop :right="100" :bottom="100">
            <span class="iconfont ai-to-top" style="font-size: 20px; color: #b93bed"></span>
        </el-backtop>
    </div>
</template>

<script setup lang="ts">
import car from "../assets/images/car.json"
import { ref, onMounted, nextTick } from 'vue'
import lottie from 'lottie-web'
import { HOME_PRODUCT }  from '../content'
import router from '../router/index.ts';
import { ElMessage } from "element-plus";
import { useCommonStore } from '../store'

const commonStore = useCommonStore();

const animation1 = ref<any>(null)
let timer2;

onMounted(() => {
    lottie.loadAnimation({
        container: animation1.value,  
        renderer: 'svg',   
        loop: true,   
        autoplay: true,   
        animationData: car  
    })
    timer2 = setInterval(async() => {
        activeTypeText.value = '';
        const typeText = 'painting a brilliant chapter of literature; fusing creativity, carving the boundary of art. AI comprehensive creation platform, giving text, image, document with soul, opening a new era of art.'
        await nextTick();

        //开始打字
        let i = 0;
        const timer = setInterval(async () => {
            activeTypeText.value = activeTypeText.value + typeText.charAt(i);
            await nextTick();
            i++;
            if (i > typeText.length) {
                clearInterval(timer);
            }
        }, 50);//50:打字速度
    },12000)
    
})

const activeTypeText = ref('');     //保存打字的文本

const productRef = ref();

    // 开始体验
const handleStartCreate = () => {
    console.log('滚动')
    console.log(productRef.value)
    productRef.value.scrollIntoView({ behavior: 'smooth' });
 };

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
    //未登录，拦截
    if(commonStore.hasLogin == false) {
        return ElMessage.error('请先登录')
    }
    //清除
    //已登录，跳转
    if(item.id == 1) router.push('/ai_text/select')
    if(item.id == 2) router.push('/ai_picture')
    if(item.id == 3) router.push('/ai_file/file_home')
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
            min-height: 140px;
            .left_AI {
                display: inline-block;
                font-size: 40px;
                font-weight: 900;
                background: linear-gradient(to bottom, #933ce5, #386eda);
                -webkit-background-clip: text; 
                color: transparent; 
            }
            .type-text {
                font-size: 14px;
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
    .body-advantage {
        display: flex;
        flex-flow: row nowrap;
        .body-advantage-title1 {
            margin-top: 90px;
            width: 100%;
            font-size: 20px;
            background: linear-gradient(to bottom, #f89c84, #eee6df); /* 设置渐变背景 */
            -webkit-background-clip: text; /* 使背景仅在文字区域可见，适用于WebKit浏览器 */
            color: transparent; /* 使文字透明 */
            display: inline-block;
        }
        .advantage {
            width: 300px;
            height: 200px;
            padding: 30px;
            margin-bottom: 10px;
            background-color: rgba($color: #000000, $alpha: 0.3);
            border-top-right-radius: 50px;
            border-bottom-left-radius: 50px;
            border-left: 5px solid;
            border-image: linear-gradient(to bottom, #b545ee, rgba(#000,0.0)) 1;
            box-sizing: border-box;
        }
    }
    .body-experience {
        margin-top: -30px;
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
        margin-top: -40px;
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
            background-color: rgba(#000, 0.4);
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
//走马灯样式
.body-product {
    margin-top: 30px;
}
.el-carousel__item {
    color: #475669;
    line-height: 400px;
    margin: 0;
    text-align: center;
    img {
        width: 100%;
        height: 100%;
    }
}

.el-carousel__item:nth-child(2n) {

}

.el-carousel__item:nth-child(2n+1) {

}
</style>