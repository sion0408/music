<template>
    <div>
        <el-button type="primary" @click="open" :loading="isLading">连接</el-button>
        <el-input v-model="textarea" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="Please input" />
        <el-button type="primary" @click="send">发送</el-button>
    </div>
    <div class="demo-collapse">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="Consistency" name="1">
                <div v-for="(item, index) of chatHistory" :key="index"
                    :class="item.userData.name != userInfo().userInfo.name ? 'chat-history__left' : 'chat-history'">
                    <div class="chat-time">
                        {{ item.time }}
                    </div>
                    <div class="chat-history__item">
                        {{ item.str }}
                        <div class="user-information">
                            {{ item.userData.name }}
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { wsStorage, userInfo } from '@/stores/wsStorage'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'


const isLading = ref(false)
const textarea = ref('')
let socket = ref(null)
const activeNames = ref([])
const { chatHistory } = storeToRefs(wsStorage())



// ws连接
const connectWs = () => {
    wsStorage().startConnecting()
}
const close = () => {
    socket.close()
}
const send = () => {
    if (textarea.value) {
        wsStorage().send(textarea.value)
        textarea.value = ''
    }
}
// 连接ws弹窗

const open = () => {
    if (userInfo().userInfo.name) {
        return
    }
    ElMessageBox.prompt('请输入聊天室昵称', '昵称填写(管理端)', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\u4e00-\u9fa5]+/,
        inputErrorMessage: '昵称只能包含汉字',
    })
        .then(({ value }) => {
            //    保存用户信息
            userInfo().setInfo(value)
            // 连接ws 
            wsStorage().startConnecting()

        })
        .catch(() => {
            console.log('用户取消输入');
        })
}

</script>

<style lang="scss" scoped>
.chat-history {
    position: relative;

    .user-information {
        position: absolute;
        top: 0;
        right: 0;
        width: 28px;
        color: blueviolet;
        font-size: 9px;
    }

    &__item {
        // max-width: 85%;
        padding: 0 35px;
        text-align: right;
        word-wrap: break-word;
        position: relative;
    }

}

.chat-history__left {
    position: relative;

    .user-information {
        position: absolute;
        top: 0;
        left: 0;
        width: 28px;
        color: blueviolet;
        font-size: 9px;
    }

    .chat-history__item {
        // max-width: 88%;
        padding: 0 35px;
        text-align: left;
        word-wrap: break-word;
    }
}

.chat-time {
    width: 100%;
    text-align: center;
    color: #aeaebd;

}

.demo-collapse {
    height: 350px;
    overflow-y: scroll;
}
</style>