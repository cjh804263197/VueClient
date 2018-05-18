import Vue from 'vue'
import iView from 'iview'
import Util from '../libs/util'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import {routers, otherRouter, appRouter} from './router'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
}

export const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    Util.title(to.meta.title)
    console.warn(`to.name=${to.name}`)
    if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        })
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false)
    } else {
        if (!Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login'
            })
        } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
            Util.title()
            next({
                name: 'home_index'
            })
        } else if (!Cookies.get('user') && to.name === 'login') {
            next()
        } else {
            // 通过路由名称找到该路由对象
            const curRouterObj = Util.getRouterObjByName([...routers], to.name)
            console.warn(`curRouterObj.name=${curRouterObj.name}`)
            let role = JSON.parse(Cookies.get('user')).position
            if (!curRouterObj || curRouterObj.meta === undefined || curRouterObj.meta.roles === undefined) {
                console.warn(`111:${JSON.stringify(curRouterObj)}`)
                // 没有配置权限的路由, 直接通过
                Util.toDefaultPage([...routers], to.name, router, next)
            } else {
                console.warn('222')
                if (curRouterObj.meta.roles.indexOf(role) >= 0) {
                    console.warn('222-111')
                    Util.toDefaultPage([...otherRouter, ...appRouter], to.name, router, next) // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
                } else {
                    console.warn('222-222')
                    next({
                        replace: true,
                        name: 'error-403'
                    })
                }
            }
            // if (curRouterObj && curRouterObj.meta.roles !== undefined) { // 需要判断权限的路由
            //     if (curRouterObj.meta.roles.indexOf(role) >= 0) {
            //         Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next) // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
            //     } else {
            //         next({
            //             replace: true,
            //             name: 'error-403'
            //         })
            //     }
            // } else { // 没有配置权限的路由, 直接通过
            //     Util.toDefaultPage([...routers], to.name, router, next)
            // }
        }
    }
})

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query)
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})
