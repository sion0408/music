import { createRouter, createWebHistory } from 'vue-router'
import homePage from '../views/homePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/homePage',
      name: 'home',
      component: homePage,
      meta: {
        title: '听音乐'
      }
    }
  ]
})

export default router
