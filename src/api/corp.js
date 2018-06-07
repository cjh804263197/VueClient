
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

/**
 * 企业分类状态统计查询
 * @param {*} param 参数
 */
let corp_statistic = async (param) => {
    let res = null
    await request({
        url: '/corp/statistic',
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
    // 数据加工
    let result = {
        kindList: [],
        effList: [],
        invList: []
    }
    for (let i = 0; i < res.length; i++) {
        if (result.kindList.indexOf(res[i].kind) === -1) {
            result.kindList.push(res[i].kind)
        }
        if (res[i].status === '未审核') {
            result.invList.push(res[i].count)
        } else {
            result.effList.push(res[i].count)
        }
    }
    return result
}

module.exports = {
    get_corp,
    save_corp,
    query_corp,
    destory_corp,
    corp_statistic
}
