/**
 * 过滤参数中值为undefine或者空字符
 * @param {*} param 需要过滤的参数
 */
let filetrParams = (param) => {
    let resParam = {}
    for (let key in param) {
        if (param[key] === undefined || param[key] === '') { continue }
        resParam = {...resParam, [key]: param[key]}
    }
    return resParam
}

module.exports = {
    filetrParams
}
