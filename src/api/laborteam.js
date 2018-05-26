
import request from './request'

/**
 * 劳务队添加
 * @param {*} param 参数 劳务队对象
 */
let save_laborteam = async (param) => {
    // 首先删除参数中的添加和修改时间，防止在修改的时候这两个字段被修改
    delete param.createdAt
    delete param.updatedAt
    
    console.warn(`data=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/laborteam/save',
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
 * 删除劳务队
 * @param {*} id ID
 */
let destory_laborteam = async (id) => {
    let data = {
        id
    }
    let res = null
    await request({
        url: '/laborteam/destory',
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
let get_laborteam = async (id) => {
    let data = {
        id
    }
    console.warn(`data=${JSON.stringify(data)}`)
    let res = null
    await request({
        url: '/laborteam/get',
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

let query_laborteam = async (param) => {
    console.warn(`param=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/laborteam/query',
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
    save_laborteam,
    destory_laborteam,
    get_laborteam,
    query_laborteam
}
