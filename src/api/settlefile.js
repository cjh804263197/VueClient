
import request from './request'
import { filetrParams } from './util'
/**
 * 保存工资工资结算文件（包含添加和修改）
 * @param {*} param 参数
 */
let save_settlefile = async (param) => {
    // 首先删除参数中的添加和修改时间，防止在修改的时候这两个字段被修改
    delete param.createdAt
    delete param.updatedAt
    let res = null
    await request({
        url: '/settlefile/save',
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
 * 删除工资结算文件
 * @param {*} id ID
 */
let destory_settlefile = async (id) => {
    let data = {
        id
    }
    let res = null
    await request({
        url: '/settlefile/destory',
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
 * 获取单个工资结算文件信息
 */
let get_settlefile = async (id) => {
    let data = {
        id
    }
    let res = null
    await request({
        url: '/settlefile/get',
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
 * 查询工资结算文件列表
 * @param {*} param 查询参数
 */
let query_settlefile = async (param) => {
    let res = null
    param = filetrParams(param)
    await request({
        url: '/settlefile/query',
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
 * 生成工资结算文件
 * @param {*} param 请求参数
 */
let create_settle_file = async (param) => {
    let res = null
    param = filetrParams(param)
    await request({
        url: '/settlefile/createSettleFile',
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

// let upload_settle_report_file = async (param) => {

// }

module.exports = {
    get_settlefile,
    save_settlefile,
    query_settlefile,
    destory_settlefile,
    create_settle_file
}
