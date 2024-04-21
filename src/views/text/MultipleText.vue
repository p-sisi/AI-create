<template>
    <div @click="handleBackTemp">返回模板创作</div>
</template>

<script setup lang="ts">
import router from '@/router/index.ts';

const handleBackTemp = () => {
    //跳转至模板创作
    router.push('/ai_text/temp');
}
</script>

<style scoped>

</style>