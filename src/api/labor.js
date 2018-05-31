
import request from './request'

/**
 * 劳务人员添加
 * @param {*} param 参数 劳务人员对象
 */
let save_labor = async (param) => {
    // 首先删除参数中的添加和修改时间，防止在修改的时候这两个字段被修改
    delete param.createdAt
    delete param.updatedAt
    console.warn(`data=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/labor/save',
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
 * 删除劳务人员
 * @param {*} id ID
 */
let destory_labor = async (id) => {
    let data = {
        id
    }
    let res = null
    await request({
        url: '/labor/destory',
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
 * 获取单个用户
 */
let get_labor = async (id) => {
    let data = {
        id
    }
    console.warn(`data=${JSON.stringify(data)}`)
    let res = null
    await request({
        url: '/labor/get',
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

let query_labor = async (param) => {
    console.warn(`param=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/labor/query',
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
    save_labor,
    destory_labor,
    get_labor,
    query_labor
}
