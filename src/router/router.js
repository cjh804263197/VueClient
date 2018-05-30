import Main from '@/views/Main.vue'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
}

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
}

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
}

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
}

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') }
    ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/system-setting',
        icon: 'ios-infinite',
        name: 'system-setting',
        title: '系统设置',
        component: Main,
        meta: {
            roles: ['监管人员'] // you can set roles in root nav
        },
        children: [
            { path: 'dictionary-manage', title: '数据字典', name: 'dictionary-manage', icon: 'link', component: () => import('@/views/dictionary/data-list.vue') }
        ]
    },
    {
        path: '/corp-manage',
        icon: 'ios-infinite',
        name: 'corp-manage',
        title: '企业管理',
        component: Main,
        meta: {
            roles: ['监管人员'] // you can set roles in root nav
        },
        children: [
            { path: 'corp-add', title: '企业添加', name: 'corp-add', meta: { roles: ['监管人员']}, icon: 'link', component: () => import('@/views/corp/corp-edit.vue') },
            { path: 'corp-list', title: '企业查询', name: 'corp-list', meta: { roles: ['监管人员']}, icon: 'link', component: () => import('@/views/corp/corp-list.vue') },
            { path: 'corp-users', title: '用户管理', name: 'corp-users', meta: { roles: ['监管人员']}, icon: 'link', component: () => import('@/views/corp/corp-users.vue')}
        ]
    },
    {
        path: '/labor-manage',
        icon: 'ios-infinite',
        name: 'labor-manage',
        title: '劳务管理',
        component: Main,
        meta: {
            roles: ['劳务公司经理', '监管人员']
        },
        children: [
            { path: 'laborteams-list', title: '劳务队管理', name: 'laborteams', icon: 'link', component: () => import('@/views/laborteam/laborteam-list.vue')},
            { path: 'labors-list', title: '劳务人员管理', name: 'labors', icon: 'link', component: () => import('@/views/labors/labor-list.vue')}
        ]
    },
    {
        path: '/project-manage',
        icon: 'ios-infinite',
        name: 'project-manage',
        title: '项目管理',
        meta: {
            roles: ['劳务公司经理', '监管人员', '项目经理', '建设单位主管']
        },
        component: Main,
        children: [
            { path: 'project-add', title: '创建项目', name: 'project-add', meta: {
                roles: ['建设单位主管']
            }, icon: 'link', component: () => import('@/views/project/project-edit.vue') },
            { path: 'project-list', title: '项目查询', name: 'project-list', meta: {
                roles: ['监管人员', '项目经理', '建设单位主管']
            },icon: 'link', component: () => import('@/views/project/project-list.vue') },
            { path: 'project-laborteam-list', title: '分配关系管理', name: 'project-laborteam-list',meta: {
                roles: ['劳务公司经理', '监管人员', '项目经理', '建设单位主管']
            }, icon: 'link', component: () => import('@/views/project/project-laborteam-list.vue') }
        ]
    },
    {
        path: '/salary-manage',
        icon: 'ios-infinite',
        name: 'salary-manage',
        title: '工资管理',
        component: Main,
        meta: {
            roles: ['劳务公司经理', '监管人员', '劳资员']
        },
        children: [
            { path: 'salary-add', title: '工资录入', name: 'salary-add',meta: {
                roles: ['劳资员']
            }, icon: 'link', component: () => import('@/views/salary/salary-add.vue') },
            { path: 'salary-list', title: '工资查询', name: 'salary-list', meta: {
                roles: ['劳务公司经理', '监管人员', '劳资员']
            },icon: 'link', component: () => import('@/views/salary/salary-list.vue') }
        ]
    },
    {
        path: '/settlefile-manage',
        icon: 'ios-infinite',
        name: 'settlefile-manage',
        title: '结算文件管理',
        component: Main,
        meta: {
            roles: ['劳资员', '银行人员']
        },
        children: [
            { path: 'settlefile-list', title: '结算文件', name: 'settlefile-list', icon: 'link', component: () => import('@/views/settlefile/settlefile-list.vue') }
        ]
    }
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
]
