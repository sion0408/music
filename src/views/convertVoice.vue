<template>
    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea">
    </el-input>
    <el-button class="bottom__btn" type="primary" @click="conversion">转换</el-button>
    <div class="convert-title">转换历史</div>
    <listData :listData="musicData" />
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, defineAsyncComponent, onMounted } from 'vue'
import api from '@/api/apiItem/apiM.js'
import { useCounterStore } from '@/stores/counter'

const textarea = ref('')
const listData = ref(null)
const musicData = ref([])

onMounted(() => {
    // TableList.value = defineAsyncComponent(() => import('./components/rotationChart.vue'))
    listData.value = defineAsyncComponent(() => import('@/views/components/musicTable.vue'))
})

// 转换逻辑
const conversion = async () => {

    if (!textarea.value) {
        ElMessage.error('请输入内容');
        return
    }
    const param = {
        key: 'inbZnNG1KzpXfCPnOW3pbElMbn',
        msg: textarea.value
    }
    const { data } = await api.yybaidu(param)
    console.log(data.data, 'resresrresrserser');
    const music = data.data
    if (music.mp3) {
        textarea.value = ''
    }
    musicData.value.unshift({ songname: music.msg, playUrl: music.mp3, singername: '转换转换', id: music.mp3 })
    useCounterStore().increment(musicData.value, true) // 添加到播放列表
    // useCounterStore().numChange(0) // 添加播放下标
}
</script>

<style lang="scss" scoped>
.bottom__btn {
    text-align: center;
    margin-top: 10px;
    margin-left: 50%;

}

.convert-title {
    font-weight: bolder;
    font-family: Arial, Helvetica, sans-serif;
    margin-bottom: 20px;
}
</style>