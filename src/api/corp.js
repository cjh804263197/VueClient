
import request from './request'

/**
 * 获取企业
 */
let get_corp = async (id) => {
    console.log('进来了')
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
    get_corp
}

