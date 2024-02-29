import { createRouter, createWebHistory } from 'vue-router'
import homePage from '../views/homePage.vue'
import convertVoice from '../views/convertVoice.vue'
import localChat from '../views/localChat.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/homePage',
      name: 'home',
      component: homePage,
      meta: {
        title: '听音乐',
        keep: true
      }
    },
    {
      path: '/convertVoice',
      name: 'convertVoice',
      component: convertVoice,
      meta: {
        title: '文字转语音',
        // keep: true
      }
    },
    {
      path: '/localChat',
      name: 'localChat',
      component: localChat,
      meta: {
        title: '局域网聊天',
        keep: true
      }
    },
    {
      path: '/audioSharing',
      name: 'audioSharing',
      component: () => import(`../views/audioSharing.vue`),
      meta: {
        title: '局域网聊天',
        keep: true
      }
    }
  ]
})

export default router
