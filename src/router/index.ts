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
        component: () => import('../views/Text.vue')  
    },{
        name: 'picture',   
        path: '/ai_picture',  
        component: () => import('../views/Picture.vue')  
    },{
        name: 'file',   
        path: '/ai_file',  
        component: () => import('../views/File.vue')  
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