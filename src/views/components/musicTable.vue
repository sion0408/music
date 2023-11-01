// 列表
<template>
  <div>
    <!-- 表格 -->
    <el-table
      @row-click="lineClick"
      :data="props.listData"
      v-loading="loading"
      element-loading-text="正在加载中..."
      height="450"
      style="width: 100%"
    >
      <el-table-column prop="songname" label="歌曲名称" width="210" />
      <el-table-column prop="singername" label="演唱者" width="220" />
      <el-table-column prop="album_name" label="专辑名称" width="380" />
      <el-table-column prop="filesize" label="歌曲大小" />
    </el-table>
  </div>
  <!-- 分页区 -->
  <div class="pagination-area">
    <el-pagination
      :default-current-page="props.currentPage"
      @size-change="sizeChange"
      @current-change="sizeChange"
      background
      layout="prev, pager, next"
      :default-page-size="15"
      :page-size="15"
      :total="props.pageCount"
    />
  </div>
</template>


<script lang="ts" setup>
import { useCounterStore } from '@/stores/counter'
import { defineProps, ref, defineEmits, getCurrentInstance, watch, onMounted } from 'vue'
const props = defineProps(['listData', 'pageCount', 'currentPage', 'formatStatus'])
console.log(props.listData, 'sdfadfasdfasfdaf')

const loading = ref(false) // 数据加载状态
// 定义派发事件
const emit = defineEmits(['sizeChange'])

function sizeChange(value: number) {
  emit('sizeChange', value)
  console.log('-=-='); 
}
// 某行被点击
async function lineClick(row) {
  const currentSongIndex = props.listData.findIndex((item: { hash: any }) => item.hash == row.hash) //获取当前播放音乐下标FF
  useCounterStore().numChange(currentSongIndex) // 添加播放下标
}
console.log(props.listData)
</script>
<style scoped>
.pagination-area {
  width: 100%;
  /* margin-top: 30px; */
  padding: 30px;
  display: flex;
  justify-content: center;
  /* margin-bottom: 30px; */
}
</style>
found 0 vulnerabilities
