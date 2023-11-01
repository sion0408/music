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
      <el-input v-model="searchTerm" placeholder="请输入要搜索的关键词" class="input-with-select">
        <template #prepend>
          <el-select v-model="select" placeholder="Select" style="width: 115px">
            <el-option label="Restaurant" value="1" />
            <el-option label="Order No." value="2" />
            <el-option label="Tel" value="3" />
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" @click="search(1)" />
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
    />
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { ref, defineAsyncComponent, onMounted, watch } from 'vue'
import http from '../api/index.ts'
import { useCounterStore } from '@/stores/counter'

const TableList = ref(null)
const searchTerm = ref('庄心妍')
const select = ref('')
const pageCount = ref(1) // 总页码
const listData = ref([]) // 列表数据
const currentPage = ref(1)
const formatStatus = ref(true)

onMounted(() => {
  TableList.value = defineAsyncComponent(() => import('./components/rotationChart.vue'))
})
// 搜索按钮事件
function search(num) {
  currentPage.value = num
  console.log(num, '-=-=-=-=')
  songList()
}

// 歌曲搜索接口
const songList = async (num) => {
  // let param = {
  //   input: searchTerm.value,
  //   filter: 'name',
  //   type: 'netease',
  //   page: currentPage.value
  // }
  // const { data } = await http.postForm('http://www.xmsj.org/', param)
  // console.log(data, '歌曲列表')
  /* ----------------------------------- 废除 ----------------------------------- */
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
      item.filesize = (item.filesize / 1024 / 1024).toFixed(2) +'MB'
    })
    TableList.value = defineAsyncComponent(() => import('./components/musicTable.vue'))
    useCounterStore().increment(data.data.info, true) // 添加到播放列表
    console.log(listData.value, data.data.info, '父组件的值')
  } else {
    ElMessage.error('搜索失败，请稍候重新再试')
  }
  console.log(pageCount.value, data)
}
</script>

<style lang="scss" scoped>
.head-search {
  width: 100%;
}
</style>