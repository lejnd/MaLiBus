import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "Login" */ './views/login.vue')
        },
        {
            path: '/barcode',
            name: 'barcode',
            component: () => import(/* webpackChunkName: "barcode" */ './views/barcode.vue')
        },
        {
            path: '/bill',
            name: 'Bill',
            component: () => import(/* webpackChunkName: "Bill" */ './views/bill.vue')
        },
        {
            path: '/user',
            name: 'User',
            component: () => import(/* webpackChunkName: "User" */ './views/user.vue')
        },
        {
            path: '/userRecharge',
            name: 'userRecharge',
            component: () => import(/* webpackChunkName: "userRecharge" */ './views/userRecharge.vue')
        },
        {
            path: '/user/download',
            name: 'UserDownload',
            component: () => import(/* webpackChunkName: "UserDownload" */ './views/userDownload.vue')
        },
        {
            path: '/user/invite',
            name: 'UserInvite',
            component: () => import(/* webpackChunkName: "UserInvite" */ './views/userInvite.vue')
        },
        {
            path: '/user/info',
            name: 'UserInfo',
            component: () => import(/* webpackChunkName: "UserInfo" */ './views/userInfo.vue')
        },
        {
            path: '/user/transfer',
            name: 'UserTransfer',
            component: () => import(/* webpackChunkName: "UserTransfer" */ './views/userTransfer.vue')
        },
        {
            path: '/user/transferLogs',
            name: 'transferLogs',
            component: () => import(/* webpackChunkName: "transferLogs" */ './views/userTransferLogs.vue')
        },
        {
            path: '/user/team',
            name: 'UserTeam',
            component: () => import(/* webpackChunkName: "UserTeam" */ './views/userTeam.vue')
        },
        {
            path: '/user/password',
            name: 'UserPassword',
            component: () => import(/* webpackChunkName: "UserPassword" */ './views/userPassword.vue')
        },
        {
            path: '/user/data',
            name: 'UserData',
            component: () => import(/* webpackChunkName: "UserData" */ './views/userData.vue')
        },
        {
            path: '/amountLogs',
            name: 'amountLogs',
            component: () => import(/* webpackChunkName: "amountLogs" */ './views/amountLogs.vue')
        },
        {
            path: '/rechargeLogs',
            name: 'rechargeLogs',
            component: () => import(/* webpackChunkName: "rechargeLogs" */ './views/rechargeLogs.vue')
        }
    ]
})
