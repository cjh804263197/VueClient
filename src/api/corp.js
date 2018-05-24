
import request from './request'
import { filetrParams } from './util'
/**
 * 保存企业（包含添加和修改）
 * @param {*} param 参数
 */
let save_corp = async (param) => {
    delete param.createdAt
    delete param.updatedAt
    let data = new FormData()
    for (let key in param) {
        data.append(key, param[key])
    }
    let res = null
    await request({
        url: '/corp/save',
        headers: {'Content-Type': 'multipart/form-data'},
        method: 'post',
        data
    }).then(
        response => {
            console.log(`res=${JSON.stringify(response)}`)
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
 * 删除企业
 * @param {*} id ID
 */
let destory_corp = async (id) => {
    let data = {
        id
    }
    let res = null
    await request({
        url: '/corp/destory',
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
 * 获取企业
 */
let get_corp = async (id) => {
    let data = {
        id
    }
    let res = null
    await request({
        url: '/corp/get',
        method: 'post',
        data
    }).then(
        response => {
            console.log(`res=${JSON.stringify(response)}`)
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
 * 查询企业列表
 * @param {*} param 查询参数
 */
let query_corp = async (param) => {
    let res = null
    console.warn(param)
    param = filetrParams(param)
    console.warn(param)
    await request({
        url: '/corp/query',
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
    get_corp,
    save_corp,
    query_corp,
    destory_corp
}
