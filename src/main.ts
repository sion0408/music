import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

/* ------------------------------ element 组件库引入 ----------------------------- */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

/* -------------------------- Ant Design Vue 组件库引入 -------------------------- */
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';



import App from './App.vue'
import router from './router'
import AgoraRtcVue from 'agora-rtc-vue'
import 'agora-rtc-vue/lib/agora-rtc-vue.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(Antd)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
use(AgoraRtcVue, {
    appid: '6dd84603261e4eca9ab9d79075d599cb', // Your App ID
    token: '007eJxTYOib+MygMz/YkEnex7twxZPSkFf/v+iWWyhl+Ncf0bgQkKDAYJaSYmFiZmBsZGaYapKanGiZmGSZYm5pYG6aYmppmZw0u395akMgI4OJcTsDIxSC+IR1MjAAALVnJX8=' // Your temp token
})

app.mount('#app')
