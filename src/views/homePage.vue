<template>
  <div>
    <!-- 列表形式切换 -->
    <el-switch
      v-model="formatStatus"
      size="large"
      inline-prompt
      active-text="分页"
      inactive-text="列表"
    />
    <!-- 顶部搜索 -->
    <div class="head-search">
      <el-input @keyup="keyboard"  v-model="searchTerm" placeholder="请输入要搜索的关键词" class="input-with-select">
        <template #prepend>
          <el-select v-model="select" placeholder="Select" style="width: 115px">
            <el-option label="酷狗音乐" value="kugou" />
            <el-option label="slider" value="slider" />
            <el-option disabled label="Tel" value="3" />
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" @click="search()" />
        </template>
      </el-input>
    </div>
    <!-- 列表内容区区 -->
    <TableList
      @sizeChange="search"
      :currentPage="currentPage"
      :listData="listData"
      :pageCount="pageCount"
      :formatStatus="formatStatus"
      :loading="loading"
    />
  </div>
  <div class="recommended-singer">
    <div>相似歌手</div>
    <div class="similar-singer">
      <div @click="search(item.name)" class="similar-singer__item" v-for="(item, index) of similarartists" :key="index">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { ref, defineAsyncComponent, onMounted, watch } from 'vue'
import http from '../api/index.ts'
import api from '@/api/apiItem/apiM.js'
import { useCounterStore } from '@/stores/counter'

const TableList = ref(null)
const searchTerm = ref('庄心妍')
const select = ref('slider')
const pageCount = ref(1) // 总页码
const listData = ref([]) // 列表数据
const currentPage = ref(1)
const formatStatus = ref(true)
const loading = ref(true) // 数据加载状态
const similarartists = ref([]) // 相似歌手推荐

onMounted(() => {
  // TableList.value = defineAsyncComponent(() => import('./components/rotationChart.vue'))
  TableList.value = defineAsyncComponent(() => import('./components/musicTable.vue'))
  songList({ top: '' })
})
watch(select, (newValue) => {
  search()
})
function keyboard (e) {
 if (e.keyCode === 13) {
  search()
 }
}
// 搜索按钮事件
function search(title) {
  if(title) searchTerm.value = title
  loading.value = true
  currentPage.value = 1
  interfaceArray[select.value]()
  // songList({ q: searchTerm.value })
}
// 相似歌手推荐
async function similarSinger() {
  const { data } = await api.similarSinger(searchTerm.value)
  similarartists.value = data.similarartists.artist
  console.log(data.similarartists.artist, '相似歌手')
}
// 歌曲搜索接口
const songList = async (param) => {
  try {
    param = param ? param : { q: searchTerm.value }
    formatStatus.value = false
    const { data } = await api.searchMusic(param)
    similarSinger()
    let dataDetails = data.audios
    if (dataDetails?.constructor === Object) {
      listData.value = Object.values(dataDetails)[0]
    } else {
      console.log(dataDetails, '8888')
      listData.value = dataDetails.reduce(function (a, b) {
        return a.concat(b)
      })
    }

    listData.value.forEach((item) => {
      item.songname = item.tit_art || '未知'
      item.singername = false || '未知'
      item.filesize = '未知'
      if (item.url.indexOf('https') == 0) {
        item.playUrl = item.url || '未知'
      } else {
        item.playUrl = `https://slider.kz/${item.url}` || '未知'
      }
    })
    useCounterStore().increment(listData.value, true) // 添加到播放列表
    loading.value = false
  } catch (error) {
    ElMessage.error('搜索失败，请稍候重新再试')
    loading.value = false
    // songList(param)
  }
}

// 酷狗音乐搜索接口
async function kugouSongList() {
  let param = {
    format: 'json',
    keyword: searchTerm.value,
    page: currentPage.value,
    pagesize: 15,
    showtype: 1
  }
  const { data } = await http.get('/api/v3/search/song', param)
  if (data.errcode === 0) {
    pageCount.value = data.data.total
    listData.value = data.data.info
    listData.value.forEach((item) => {
      item.filesize = (item.filesize / 1024 / 1024).toFixed(2) + 'MB'
    })
    // TableList.value = defineAsyncComponent(() => import('./components/musicTable.vue'))
    useCounterStore().increment(data.data.info, true) // 添加到播放列表
    loading.value = false
    console.log(listData.value, data.data.info, '父组件的值')
  } else {
    ElMessage.error('搜索失败，请稍候重新再试')
  }
  console.log(pageCount.value, data)
}
const interfaceArray = {
  kugou: kugouSongList,
  slider: songList
}
</script>

<style lang="scss" scoped>
.head-search {
  width: 100%;
}
.similar-singer {
  margin-top: 35px;
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  color: gray;
  &__item {
    &:hover {
      cursor: pointer;
      text-decoration: underline;
      color: aquamarine;
    }
  }
}
.recommended-singer {
  margin-top: 35px;
}
</style>