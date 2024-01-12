import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentTime } from '@/views/mock/index.ts'
import { useCounterStore } from '@/stores/counter'

// 定义文件路径及名称
const filePath = '@/views/mock/record.json';


const createAFile = (content: any) => {
    // 调用 writeFile() 函数创建文件并写入内容
    // fs.writeFile(filePath, content, (err) => {
    //     if (err) throw err; // 处理错误情况
    //     console.log(`${filePath} 已成功创建！`);
    console.log(content);

    // });
}
// / ws存储
export const wsStorage = defineStore('socket', () => {
    let socket = null
    let chatHistory = ref([])
    // 连接ws实例
    function startConnecting() {
        // 创建 WebSocket 实例
        console.log(socket, '====');
        if (socket?.readyState == 1) {
            console.log('已经有实例链接');
            return
        }
        socket = new WebSocket('ws://192.168.0.38:8080');

        // 等待连接建立成功
        socket.onopen = function (event) {
            // 连接已经建立，可以进行操作
            console.log('WebSocket 已连接');
        };
        // 处理消息等操作
        socket.onmessage = function (event) {
            console.log('收到消息：', event);
            receivedMessage(event.data)
        };

        // 处理错误
        socket.onerror = function (event) {
            console.error('WebSocket 错误：', event);
        };

        // 处理关闭
        socket.onclose = function (event) {
            console.log('WebSocket 关闭：', event);
        };

    }
    function send(str: String, musicData: object) {
        // 发送消息
        const sendData = { str, musicData, userData: userInfo().userInfo, time: getCurrentTime() }
        socket.send(JSON.stringify(sendData))
        // 存储自己消息
        console.log(str, '发送消息', name)
        if (!musicData) {
            chatHistory.value.push(sendData)
        }



        createAFile(chatHistory.value)
        // 监听服务器推送事件
        socket.onmessage = function (back) {
            // 存储收到的消息
            receivedMessage(back.data)
            createAFile(chatHistory.value)

        }
    }
    function receivedMessage(value: object) {
        const receivedMessage = JSON.parse(value)
        console.log(receivedMessage, '收到消息', chatHistory.value)
        chatHistory.value.push(receivedMessage) // 1是自己 2是他人
    }
    return { startConnecting, send, chatHistory }
})
class Info {
    name: string
    constructor(name: string) {
        this.name = name = name
    }
}

export const userInfo = defineStore('userInfo', () => {
    let userInfo = {
        name: ''
    }; //个人信息
    function setInfo(data: string) {
        userInfo.name = data
    }
    return { setInfo, userInfo }
})
