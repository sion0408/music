<template>
  <!-- <el-button mb-2 @click="toggle">Switch Language</el-button> -->
  <el-config-provider :locale="locale">
    <div class="boss">
      <el-row class="tac">
        <el-col>
          <h5 class="mb-2">Default colors</h5>
          <el-menu router default-active="1" class="el-menu-vertical-demo">
            <template v-for="(item, index) of navigationBar" :key="index">
              <el-menu-item v-if="!item.subset" :span="12" :index="item.name">
                <el-icon>
                  <component :is="item.icon"></component>
                </el-icon>
                <span>
                  {{ item.title }}
                </span>
              </el-menu-item>
              <el-sub-menu v-else>
                <template #title>
                  <el-icon>
                    <component :is="item.icon"></component>
                  </el-icon>
                  <span>
                    {{ item.title }}
                  </span>
                </template>
                <el-menu-item-group v-for="(oItem, oIndex) of item.subset" :key="index + oIndex" :index="oItem.name">
                  <el-menu-item :index="oItem.name">
                    <el-icon>
                      <component :is="oItem.icon"></component>
                    </el-icon>
                    <span>
                      {{ oItem.title }}
                    </span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
            </template>
          </el-menu>
        </el-col>
      </el-row>
      <div class="right-content">
        <RouterView v-if="!$route.meta.keep" />
        <keep-alive>
          <router-view v-if="$route.meta.keep" />
        </keep-alive>
      </div>
    </div>
    <div class="bottom-play__control">
      <MusicPlay />
    </div>
  </el-config-provider>
</template>

<script setup>
import { computed, ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import MusicPlay from './views/components/musicPlayback.vue'
const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
const toggle = () => {
  language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
}
const navigationBar = ref([
  {
    path: '/homePage',
    name: 'homePage',
    title: '首页',
    icon: 'House'
  },
  {
    path: '/musicPage',
    name: 'musicPage',
    title: '音乐歌单',
    icon: 'Service'
  },
  {
    path: '/userPage',
    name: 'userPage',
    title: '用户',
    icon: 'Avatar'
  },
  {
    path: '/rankPage',
    name: 'rankPage',
    title: '排行榜',
    icon: 'Histogram'
  },
  {
    path: '',
    name: '',
    title: '工具',
    icon: 'Menu',
    subset: [
      {
        path: '/convertVoice',
        name: 'convertVoice',
        title: '文字转语音',
        icon: 'Microphone',
      },
      {
        path: '/localChat',
        name: 'localChat',
        title: '局域网聊天',
        icon: 'ChatDotSquare',
      },

    ]
  }
])
</script>

<style lang="scss" scoped>
.el-row {
  width: 25%;
  min-width: 175px;
}

.boss {
  display: flex;
  gap: 60px;
  height: 95%;
}

.right-content {
  width: 75%;
  padding: 5%;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
}

.bottom-play__control {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>