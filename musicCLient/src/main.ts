import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

/* ------------------------------ element 组件库引入 ----------------------------- */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
