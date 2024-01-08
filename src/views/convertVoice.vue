<template>
    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea">
    </el-input>
    <el-button type="primary" @click="conversion" icon="el-icon-search">转换</el-button>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api/apiItem/apiM.js'
import { useCounterStore } from '@/stores/counter'

const textarea = ref('')

// 转换逻辑
const conversion = async () => {
    const param = {
        key: 'inbZnNG1KzpXfCPnOW3pbElMbn',
        msg: textarea.value
    }
    const { data } = await api.yybaidu(param)
    console.log(data.data, 'resresrresrserser');
    const music = data.data
    const musicData = [{ songname: music.msg, playUrl: music.mp3 }]
    useCounterStore().increment(musicData, true) // 添加到播放列表
    useCounterStore().numChange(1) // 添加播放下标
}
</script>

<style lang="scss" scoped></style>