
import request from './request'
import { filetrParams } from './util'

/**
 * 保存项目信息
 * @param {*} param 参数 项目对象
 */
let save_project = async (param) => {
    // 首先删除参数中的添加和修改时间，防止在修改的时候这两个字段被修改
    delete param.createdAt
    delete param.updatedAt
    console.warn(`data=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/project/save',
        method: 'post',
        data: param
    }).then(
        response => {
            res = response.data
        }
    ).catch(
        error => {
            throw error
        }
    )
    return res
}

/**
 * 删除项目信息
 * @param {*} id ID
 */
let destory_project = async (id) => {
    let data = {
        id
    }
    let res = null
    await request({
        url: '/project/destory',
        method: 'post',
        data
    }).then(
        response => {
            res = response.data
        }
    ).catch(
        error => {
            throw error
        }
    )
    return res
}
/**
 * 获取单个项目信息对象
 */
let get_project = async (id) => {
    let data = {
        id
    }
    console.warn(`data=${JSON.stringify(data)}`)
    let res = null
    await request({
        url: '/project/get',
        method: 'post',
        data
    }).then(
        response => {
            res = response.data
        }
    ).catch(
        error => {
            throw error
        }
    )
    return res
}

/**
 * 查询项目信息对象列表
 * @param {*} param 查询参数
 */
let query_project = async (param) => {
    param = filetrParams(param)
    console.warn(`param=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/project/query',
        method: 'post',
        data: param
    }).then(
        response => {
            res = response.data
        }
    ).catch(
        error => {
            throw error
        }
    )
    return res
}

/**
 * 保存项目劳务队关系
 * @param {*} param 参数
 */
let save_project_laborteam = async (param) => {
    // 首先删除参数中的添加和修改时间，防止在修改的时候这两个字段被修改
    delete param.createdAt
    delete param.updatedAt
    console.warn(`data=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/project/laborteam/save',
        method: 'post',
        data: param
    }).then(
        response => {
            res = response.data
        }
    ).catch(
        error => {
            throw error
        }
    )
    return res
}

/**
 * 获取单个项目劳务队关系对象
 */
let get_project_laborteam = async (id) => {
    let data = {
        id
    }
    console.warn(`data=${JSON.stringify(data)}`)
    let res = null
    await request({
        url: '/project/laborteam/get',
        method: 'post',
        data
    }).then(
        response => {
            res = response.data
        }
    ).catch(
        error => {
            throw error
        }
    )
    return res
}

/**
 * 查询项目劳务队信息对象列表
 * @param {*} param 查询参数
 */
let query_project_laborteam = async (param) => {
    param = filetrParams(param)
    console.warn(`param=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/project/laborteam/query',
        method: 'post',
        data: param
    }).then(
        response => {
            res = response.data
        }
    ).catch(
        error => {
            throw error
        }
    )
    return res
}

module.exports = {
    save_project,
    destory_project,
    get_project,
    query_project,
    save_project_laborteam,
    get_project_laborteam,
    query_project_laborteam
}
