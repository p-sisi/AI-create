<!-- 首页 -->
<template>
    <div class="home-container">
        <Header></Header>
        <Body></Body>
    </div>
</template>

<script setup lang="ts">
import Header from './HomeHeader.vue';
import Body from './HomeBody.vue';
</script>

<style lang="scss" scoped>
.home-container {
    height: 440vh;
    background-image: url('../assets//images/home-bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;
}
</style>