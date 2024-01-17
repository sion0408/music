<script setup lang="ts">
import { followListening, userInfo } from './followListening.js'
import { onMounted, ref, watch, computed } from "vue";
import { storeToRefs } from 'pinia'
const musicData = storeToRefs(followListening()).musicData
const audioFrequencyDom = ref(null) // 音频DOm
const textarea = ref('')
const activeNames = ref([])
const { chatHistoryMusic } = storeToRefs(followListening())
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

const url = '../public/65755091.mp3'
const prompt = ref('')

watch(musicData, (getvalue) => {
  audioFrequencyDom.value.play()
})

onMounted(() => {
  open()
})

// 连接ws弹窗

const open = () => {
  if (userInfo().userInfo.name) {
    return
  }
  ElMessageBox.prompt('请输入聊天室昵称', '昵称填写(接收端)', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^[\u4e00-\u9fa5]{1,4}$/,
    inputErrorMessage: '昵称只能包含汉字且最多三个',
  })
    .then(({ value }) => {
      //    保存用户信息
      userInfo().setInfo(value)
      // 连接ws 
      followListening().startConnecting()

    })
    .catch(() => {
      console.log('用户取消输入');
    })
}
const send = () => {
  if (textarea.value) {
    followListening().send(textarea.value)
    textarea.value = ''
  } else {
    ElNotification({
      title: '提示',
      message: '消息不能为空',
      type: 'warning',
    })
  }


}
const clearData = () => {
  followListening().clearData()
}
const typess = ref(false)
const ssss = () => {
  typess.value = !typess.value
}
</script>

<template>
  <button @click="ssss">关闭or打开</button>
  <div v-show="typess">
    <header>
      {{ musicData.songname || musicData.song_name }}
      <audio ref="audioFrequencyDom" :src="musicData.playUrl || musicData.play_url" autoplay controls />
      <audio :src="followListening().prompt" autoplay />
    </header>
    <main>
      <div>
        <el-input v-model="textarea" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="Please input" />
        <el-button type="primary" @click="send">发送</el-button>
        <el-button type="primary" @click="clearData">清除数据</el-button>
      </div>
      <div class="demo-collapse">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="Consistency" name="1">
            <div v-for="(item, index) of chatHistoryMusic" :key="index"
              :class="item?.userData?.name != userInfo().userInfo.name ? 'chat-history__left' : 'chat-history'">
              <div class="chat-time">
                {{ item.time }}
              </div>
              <div v-if="item.prompt" class="chat-time">
                {{ item.prompt.userId }} {{ item.prompt.type == 1 ? "已连接" : "已断开" }}
              </div>
              <div v-else class="chat-history__item">
                {{ item.str }}
                <div class="user-information">
                  {{ item.userData.name }}
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </main>
  </div>
</template>

<style lang="scss"  scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

.chat-history {
  position: relative;

  .user-information {
    position: absolute;
    top: 23px;
    right: 0;
    width: 28px;
    color: blueviolet;
    font-size: 9px;
  }

  &__item {
    // max-width: 92%;
    text-align: right;
    padding: 0 35px;
    word-wrap: break-word;
  }
}

.chat-history__left {
  position: relative;

  .user-information {
    position: absolute;
    position: absolute;
    top: 23px;
    left: 0;
    width: 28px;
    font-size: 9px;
    color: blueviolet;
  }

  .chat-history__item {
    max-width: 92%;
    text-align: left;
    padding: 0 35px;
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
