import { createRouter,createWebHashHistory } from "vue-router";


const routes = [
    {
        name: 'home',   
        path: '/home',  
        component: () => import('../views/Home.vue')  
    },
    {
        name: 'text',   
        path: '/ai_text',  
        component: () => import('../views/text/Text.vue')  
    },{
        name: 'picture',   
        path: '/ai_picture/',  
        component: () => import('../views/picture/Picture.vue'),
        children: [
            {
                name: 'picture_create',
                path: '/ai_picture/create',
                component: () => import('../views/picture/PictureCreate.vue')
            },
            {
                name: 'picture_collect',
                path: '/ai_picture/collect',
                component: () => import('../views/picture/PictureCollect.vue')
            },
            {
                name: 'picture_star',
                path: '/ai_picture/star',
                component: () => import('../views/picture/PictureStar.vue')
            }
        ]
    },{
        name: 'file',   
        path: '/ai_file',  
        component: () => import('../views/file/File.vue')  
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