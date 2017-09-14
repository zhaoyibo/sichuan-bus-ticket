const routers = [{
    path: '/',
    meta: {
        title: '抢车票'
    },
    component: (resolve) => require(['./views/ticket.vue'], resolve)
},
{
    path: '/login',
    meta: {
        title: '登录'
    },
    component: (resolve) => require(['./views/login.vue'], resolve)
},
{
    path: '/ticket',
    meta: {
        title: '开始抢票'
    },
    component: (resolve) => require(['./views/ticket.vue'], resolve)
}];
export default routers;
