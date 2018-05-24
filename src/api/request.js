import axios from 'axios'
import baseUrl from './url'

// 创建一个axios实例
const service = axios.create({
    baseURL: baseUrl + 'api',
    timeout: 5000, // 请求超时时长
    withCredentials: true // 允许携带cookie
})

// request拦截器
service.interceptors.request.use(
    config => {
        // 发送请求之前，要做的业务
        return config
    },
    error => {
        console.error(`request_error:${JSON.stringify(error)}`)
        // 错误处理代码
        return Promise.reject(error)
    }
)

// response拦截器
service.interceptors.response.use(
    response => {
        // 数据响应之后，要做的业务
        return response
    },
    error => {
        // console.error(`response_error:${JSON.stringify(error)}`)
        return Promise.reject(error)
    }
)

export default service
