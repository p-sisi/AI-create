<template>
    <div class="file">
      <!-- <div>文件预览区</div> -->
        <!-- <button @click="previewFile">预览文件</button>
        <iframe ref="previewFrame" style="width: 100%; height: 500px;"></iframe> -->
        <!-- <vue-office-docx
            :src="docx"
            style="height: 100vh;"
            @rendered="renderedHandler"
            @error="errorHandler"
        /> -->

        <!-- 文件类路由主出口 -->
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
// import {ref} from 'vue'
// import { BASE_URL } from '../../content/user'
// import VueOfficeDocx from '@vue-office/docx'
// import '@vue-office/docx/lib/index.css'
 

// const previewFrame = ref();

//     const previewFile = () => {
//       const fileUrl = './src/assets/file/text.docx'; // 文件路径
//       console.log(fileUrl)
//       const previewUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`;
//       previewFrame.value.src = previewUrl;
//       console.log(previewFrame.value.src)
//     };


// const docx = ref(`${BASE_URL}/file/files/file1.docx`) //设置文档网络地址，可以是相对地址
// const renderedHandler=()=>{
//   console.log("渲染完成")
// }
// const errorHandler=(e)=>{
//   console.log("渲染失败",e)
// }

</script>

<style lang="scss" scoped>
.file {
    height: 100vh;
}
</style>