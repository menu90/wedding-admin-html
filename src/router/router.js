import Main from '@/views/Main.vue';
import Util from '@/libs/util.js';


// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: '/home', title: '主页', name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } }
    ]
};

export const appRouter =[
    {
        path: '/system',
        icon: 'settings',
        name: 'system',
        title: '系统管理',
        component: Main,
        children: [//aceess 1可以访问 0 不能访问
            { path: 'index', title: '权限管理', name: 'access',access:1, component: resolve => { require(['@/views/system/access/access.vue'], resolve); } },
            { path: 'menu', title: '菜单管理', name: 'menu',access:1, component: resolve => { require(['@/views/system/menu/index.vue'], resolve); } }
        ]
    }
];
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter
];
