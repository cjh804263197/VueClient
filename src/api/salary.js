
import request from './request'
import { filetrParams } from './util'
/**
 * 保存工资（包含添加和修改）
 * @param {*} param 参数
 */
let save_salary = async (param) => {
    // 首先删除参数中的添加和修改时间，防止在修改的时候这两个字段被修改
    delete param.createdAt
    delete param.updatedAt
    let res = null
    await request({
        url: '/salary/save',
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
 * 删除工资
 * @param {*} id ID
 */
let destory_salary = async (id) => {
    let data = {
        id
    }
    let res = null
    await request({
        url: '/salary/destory',
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
 * 获取单条工资记录
 */
let get_salary = async (id) => {
    let data = {
        id
    }
    let res = null
    await request({
        url: '/salary/get',
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
 * 查询工资列表
 * @param {*} param 查询参数
 */
let query_salary = async (param) => {
    let res = null
    param = filetrParams(param)
    await request({
        url: '/salary/query',
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
 * 批量生成工资初始记录根据项目和劳务队
 * @param {*} param 请求参数
 */
let batch_create_salary = async (param) => {
    let res = null
    param = filetrParams(param)
    await request({
        url: '/salary/createSalaryByProLabTeam',
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
    get_salary,
    save_salary,
    query_salary,
    destory_salary,
    batch_create_salary
}
