
import request from './request'

/**
 * 保存数据字典
 * @param {*} param 参数 数据字典对象
 */
let save_dic = async (param) => {
    // 首先删除参数中的添加和修改时间，防止在修改的时候这两个字段被修改
    delete param.createdAt
    delete param.updatedAt
    console.warn(`data=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/dictionary/save',
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
 * 删除数据字典
 * @param {*} id ID
 */
let destory_dic = async (id) => {
    let data = {
        id
    }
    let res = null
    await request({
        url: '/dictionary/destory',
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
 * 获取单个数据字典
 */
let get_dic = async (id) => {
    let data = {
        id
    }
    console.warn(`data=${JSON.stringify(data)}`)
    let res = null
    await request({
        url: '/dictionary/get',
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

let query_dic = async (param) => {
    console.warn(`param=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/dictionary/query',
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
    save_dic,
    destory_dic,
    get_dic,
    query_dic
}
