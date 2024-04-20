<template>
    <div @click="handleBackTemp">返回模板创作</div>
</template>

<script setup lang="ts">
import {useTextStore } from '../../store'

const textStore = useTextStore();

const handleBackTemp = () => {
    textStore.setIsSelectTemp(true);
}
</script>

<style scoped>

</style>