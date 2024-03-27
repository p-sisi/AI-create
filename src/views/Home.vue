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
    height: 200vh;
    background: linear-gradient(to top, #000000, #1c0935);
}
</style>