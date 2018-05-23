
import request from './request'
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

module.exports = {
    get_corp,
    save_corp
}
