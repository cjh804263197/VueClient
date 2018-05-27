
import crypto from 'crypto'
import request from './request'

let md5 = (value) => {
    let md5 = crypto.createHash('md5')
    md5.update(value)
    return md5.digest('hex')
}
/**
 * 企业用户登录
 * @param url 登录地址
 */
let login = async (username, password, url) => {
    let data = {
        username,
        password: md5(password)
    }
    let res = null
    await request({
        // url: '/corp/user/login',
        url,
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
    login
}
