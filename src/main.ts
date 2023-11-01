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

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(Antd)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
