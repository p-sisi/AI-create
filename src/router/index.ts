import { createRouter,createWebHashHistory } from "vue-router";

import Home from '../views/Home.vue'
import Text from '../views/text/Text.vue'
import Picture from '../views/picture/Picture.vue'
import PictureCreate from '../views/picture/PictureCreate.vue'
import PictureCollect from '../views/picture/PictureCollect.vue'
import PictureStar from '../views/picture/PictureStar.vue'
import File from '../views/file/File.vue'

const routes = [
    {
        name: 'home',   
        path: '/home',  
        component:Home  
    },
    {
        name: 'text',   
        path: '/ai_text',  
        component: Text 
    },
    {
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
        component: File  
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