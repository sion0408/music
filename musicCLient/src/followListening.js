import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentTime } from './index.ts'

// 定义文件路径及名称
const filePath = '@/views/mock/record.json';


const createAFile = (content) => {
    // 调用 writeFile() 函数创建文件并写入内容
    // fs.writeFile(filePath, content, (err) => {
    //     if (err) throw err; // 处理错误情况
    //     console.log(`${filePath} 已成功创建！`);
    // });
}
// / ws存储
export const followListening = defineStore('socket', () => {
    let socketMusic = null
    let chatHistoryMusic = ref([])
    let musicData = ref({})
    let prompt = ref('')
    const url = '../public/56777133.mp3'
    // 连接ws实例
    function startConnecting() {
        // 创建 WebSocket 实例
        console.log(socketMusic, '====');
        if (socketMusic?.readyState == 1) {
            console.log('已经有实例链接');
            return
        }
        socketMusic = new WebSocket(`ws://192.168.0.38:4444/localChat?id=${userInfo().userInfo.name}`);

        // 等待连接建立成功
        socketMusic.onopen = function (event) {
            // 连接已经建立，可以进行操作
            console.log('WebSocket 已连接');
        };

        // 处理消息等操作
        socketMusic.onmessage = function (event) {
            receivedMessage(event.data)
        };

        // 处理错误
        socketMusic.onerror = function (event) {
            console.error('WebSocket 错误：', event);
        };

        // 处理关闭
        socketMusic.onclose = function (event) {
            console.log('WebSocket 关闭：', event);
        };

    }
    function send(str) {
        // 发送消息
        // 发送消息
        const sendData = { str, userData: userInfo().userInfo, time: getCurrentTime() }
        socketMusic.send(JSON.stringify(sendData))
        console.log(`${getCurrentTime()} 发送消息: `, str);
        chatHistoryMusic.value.push(sendData) // 1是自己 2是他人 
        createAFile(chatHistoryMusic.value)
        // 监听服务器推送事件
        socketMusic.onmessage = function (back) {
            // 存储收到的消息
            receivedMessage(back.data)
            createAFile(chatHistoryMusic.value)

        }
    }
    function close() {
        // socketMusic.onClose()
    }
    function clearData() {
        chatHistoryMusic.value = []
    }
    function receivedMessage(value) {
        const receivedMessage = JSON.parse(value)

        if (receivedMessage.musicData) {
            musicData.value = receivedMessage.musicData
            console.warn(`收到音乐${receivedMessage.musicData.songname || receivedMessage.musicData.song_name}即将播放`);
        } else {
            chatHistoryMusic.value.push(receivedMessage) // 1是自己 2是他人
            console.warn('收到消息,', receivedMessage.str);
            prompt.value = url
            setTimeout(() => {
                prompt.value = ''
            }, 3000);
        }

    }
    return { startConnecting, send, chatHistoryMusic, close, musicData, clearData, prompt }
})



export const userInfo = defineStore('userInfo', () => {
    let userInfo = {
        name: ''
    }; //个人信息
    function setInfo(data) {
        userInfo.name = data
    }
    return { setInfo, userInfo }
})