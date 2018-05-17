
import crypto from 'crypto'
import request from './request'

let md5 = (value) => {
    let md5 = crypto.createHash('md5')
    md5.update(value)
    return md5.digest('hex')
}
/**
 * 企业用户登录
 */
let corp_user_login = async (username, password) => {
    console.log('进来了')
    let data = {
        username,
        password: md5(password)
    }
    // return new Promise((resolve, rejects) => {
    //     let res = null
    //     axios.post(base_url + '/corp/user/login', params).then(
    //         response => {
    //             console.log(`res=${JSON.stringify(response)}`)
    //             resolve(response.status)
    //         }
    //     ).catch(
    //         error => {
    //             rejects(error)
    //         } 
    //     )
    // })

    let res = null
    // await axios.post(base_url + 'corp/user/login', params).then(
    //     response => {
    //         console.log(`res=${JSON.stringify(response)}`)
    //         res = response.data
    //     }
    // ).catch(
    //     error => {
    //         throw error
    //     } 
    // )
    await request({
        url: '/corp/user/login',
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
    corp_user_login
}

