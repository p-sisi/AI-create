<template>
    <div>
        <video ref="videoPlayer" :src="videoUrl"></video>
        <div>
            <button @click="play">播放</button>
            <button @click="pause">暂停</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const videoPlayer = ref(null);
const videoUrl = ref('http://10.33.18.17:8081/file/videos/yuanshen.mp4'); 


// 播放视频
const play = () => {
    videoPlayer.value.play();
};

// 暂停视频
const pause = () => {
    videoPlayer.value.pause();
};
</script>

<style scoped lang="scss">

</style>