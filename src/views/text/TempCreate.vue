<template>
    <div class="body-temp-create">
        <!-- 创作区 -->
        <div class="body-temp">
            <TextTemp></TextTemp>
        </div>
        <!-- 结果区 -->
        <div class="body-result">
            <TextCreateResult></TextCreateResult>
        </div>
    </div>
</template>

<script setup lang="ts">
import TextTemp from './TextTemp.vue';
import TextCreateResult from './TextCreateResult.vue';

</script>

<style scoped lang="scss">
.body-temp-create {
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 12px 20px;
    .body-temp {
        width: 400px;
        padding: 8px;
        background: #212121;
        border-radius: 10px;
    }
    .body-result {
        width: 900px;
        padding: 8px;
        border-radius: 10px;
    }
}
</style>