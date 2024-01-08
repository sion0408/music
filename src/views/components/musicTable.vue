// 列表
<template>
  <div style="  cursor: pointer;
    user-select: none; z-index:0 ;position: relative;">
    <!-- 表格 -->
    <el-table @row-click="lineClick" ref="singleTableRef" :data="props.listData" v-loading="props.loading"
      highlight-current-row element-loading-text="正在加载中..." height="450" style="width: 100%">
      <el-table-column fixed="left" prop="songname" label="歌曲名称" width="210" />
      <el-table-column prop="singername" label="演唱者" width="220" />
      <el-table-column prop="album_name" label="专辑名称" width="380" />
      <el-table-column prop="filesize" label="歌曲大小" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.stop="handleClick(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页区 -->
  <div class="pagination-area" v-if="props.formatStatus">
    <el-pagination :default-current-page="props.currentPage" @size-change="sizeChange" @current-change="sizeChange"
      background layout="prev, pager, next" :default-page-size="15" :page-size="15" :total="props.pageCount" />
  </div>
</template>


<script lang="ts" setup>
import { useCounterStore } from '@/stores/counter'
import { ElTable } from 'element-plus'
import { defineProps, ref, defineEmits, getCurrentInstance, watch, onMounted } from 'vue'
const props = defineProps(['listData', 'pageCount', 'currentPage', 'formatStatus', 'loading'])

// 定义派发事件
const emit = defineEmits(['sizeChange'])

function sizeChange(value: number) {
  emit('sizeChange', value)
  console.log('-=-=')
}
const singleTableRef = ref<InstanceType<typeof ElTable>>()
const currentRow = ref()
// 某行被点击
async function lineClick(row) {
  let currentSongIndex = ''
  console.log(row.playUrl, '---')
  if (row.playUrl) {
    currentSongIndex = props.listData.findIndex((item: { id: any }) => item.id == row.id) //获取当前播放音乐下标FF
  } else {
    currentSongIndex = props.listData.findIndex((item: { hash: any }) => item.hash == row.hash) //获取当前播放音乐下标FF
  }
  singleTableRef.value.setCurrentRow(currentSongIndex)
  useCounterStore().numChange(currentSongIndex) // 添加播放下标
}
// 下载歌曲
function handleClick(item) {
  if (item.playUrl) {
    window.open(item.playUrl)
  } else {
    useCounterStore().downloadMusic(item)
  }
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
