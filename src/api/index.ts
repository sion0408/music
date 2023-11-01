import axios, { type AxiosRequestConfig } from 'axios'
import crypto from 'crypto'
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
export const toMD5 = (str: crypto.BinaryLike) => crypto.createHash('md5').update(str).digest('hex')
// axios实例配置
const allocationList = {
    timeout: 5000,
}
// 创建axios实例
const instance = axios.create(allocationList)

const getInstance = (url: string, params?: AxiosRequestConfig<any> | undefined) => {

    return new Promise((resolve, reject) => {
        instance.get(url, { params }).then(
            res => resolve(res),
            err => reject(err)
        )
    })
}
const postInstance = (url: string, params?: AxiosRequestConfig<any> | undefined) => {
    return new Promise((resolve, reject) => {
        instance.post(url, params).then(
            res => resolve(res),
            err => reject(err)
        )

    })
}
function postForm(url: any, data = {}) {
    return new Promise((resolve, reject) => {
        instance({
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                ' Access-Control-Allow-Origin': '*',

            },
            data: QS.stringify(data)
        }).then(
            response => {
                if (response.data.code === 200 || response.data.code === 0) {
                    resolve(response.data)
                } else {
                    resolve(response.data)
                }
            },
            err => {
                reject(err)
                let message = '请求失败！请检查网络'
                if (err.response) {
                    message = err.response.data.message
                }
                console.log(message)
            }
        )
    })
}
const throwObject = {
    get: getInstance,
    post: postInstance,
    postForm,
}
export default throwObject