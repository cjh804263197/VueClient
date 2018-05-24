
import request from './request'
import util from '../libs/util'
import crypto from 'crypto'

let md5 = (value) => {
    let md5 = crypto.createHash('md5')
    md5.update(value)
    return md5.digest('hex')
}
/**
 * 企业用户添加
 * @param {*} param 参数 企业用户对象
 */
let save_user = async (param) => {
    // 首先删除参数中的添加和修改时间，防止在修改的时候这两个字段被修改
    delete param.createdAt
    delete param.updatedAt
    if(param.password !== '') {
        param.password = md5(param.password)
    } else {
        delete param.password
    }
    console.warn(`data=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/corp/user/save',
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
 * 删除企业用户
 * @param {*} id ID
 */
let destory_user = async (id) => {
    let data = {
        id
    }
    let res = null
    await request({
        url: '/corp/user/destory',
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
let get_user = async (id) => {
    let data = {
        id
    }
    console.warn(`data=${JSON.stringify(data)}`)
    let res = null
    await request({
        url: '/corp/user/get',
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

let query_user = async (param) => {
    console.warn(`param=${JSON.stringify(param)}`)
    let res = null
    await request({
        url: '/corp/user/query',
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
    save_user,
    destory_user,
    get_user,
    query_user
}
