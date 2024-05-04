import { createRouter,createWebHashHistory } from "vue-router";

import Home from '../views/Home.vue'
import Text from '../views/text/Text.vue'
import Picture from '../views/picture/Picture.vue'
import PictureCreate from '../views/picture/PictureCreate.vue'
import PictureCollect from '../views/picture/PictureCollect.vue'
import PictureStar from '../views/picture/PictureStar.vue'
import File from '../views/file/File.vue'

//文本类
import Select from '../views/text/Select.vue'
import TempCreate from '../views/text/TempCreate.vue'
import MultipleText from "../views/text/MultipleText.vue";
import Collect from '../views/text/TextCollect.vue'

//文档类
import FileHome from "../views/file/FileHome.vue";
import FileCreate from "../views/file/FileCreate.vue";

import UserCenter from '../views/UserCenter.vue'

const routes = [
    {
        name: 'home',   
        path: '/home',  
        component:Home  
    },
    {   
        name: 'user',   
        path: '/user_info',  
        component:  UserCenter,
    },
    {   //文本类
        name: 'text',   
        path: '/ai_text',  
        component: Text ,
        children: [
            {
                name: 'text-select',
                path: '/ai_text/select',
                component: Select
            },
            {
                name: 'text-temp',
                path: '/ai_text/temp',
                component: TempCreate
            },
            {
                name: 'text-mul',
                path: '/ai_text/multiple',
                component: MultipleText
            },
            {
                name: 'text-collect',
                path: '/ai_text/collect',
                component: Collect
            },
        ]
    },
    {   //图片类
        name: 'picture',   
        path: '/ai_picture/',  
        component: Picture,
        children: [
            {
                name: 'picture_create',
                path: '/ai_picture/create',
                component: PictureCreate
            },
            {
                name: 'picture_collect',
                path: '/ai_picture/collect',
                component: PictureCollect
            },
            {
                name: 'picture_star',
                path: '/ai_picture/star',
                component: PictureStar
            }
        ]
    },{
        name: 'file',   
        path: '/ai_file',  
        component: File ,
        children: [
            {
                name: 'file_home',   
                path: '/ai_file/file_home',  
                component: FileHome ,
            },
            {
                name: 'file_create',   
                path: '/ai_file/file_create',  
                component: FileCreate ,
            }
        ] 
    },
    {
        path: '/',
        redirect: '/home' 
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;