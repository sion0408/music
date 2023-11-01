<template>
  <div @click="openDetails" class="bottom-music__control">
    <audio
      ref="audioFrequencyDom"
      @error="playbackFailed"
      @play="playBtn"
      v-show="true"
      @ended="endOfPlayback"
      :src="play_url"
      @timeupdate="updateProgress"
      @loadedmetadata="loadedmetadata"
      preload="auto"
      autoplay
    />
    <div class="song__avatars">
      <img class="song__img" :src="currentSongDetails.img" alt="" />
      <div class="song-title">
        <div class="scroll-item">{{ currentSongDetails.song_name }}</div>
        <div class="scroll-item__name">{{ currentSongDetails.author_name }}</div>
      </div>
    </div>
    <div class="control-buttons">
      <div class="play-control">
        <el-icon :size="38" color="#99A9BF"><ArrowLeftBold /></el-icon>
        <el-icon v-if="!playButtonStatus" @click.stop="playBtn" :size="38" color="#99A9BF">
          <VideoPlay
        /></el-icon>
        <el-icon :size="38" color="#99A9BF" v-else @click="playPause"><VideoPause /></el-icon>
        <el-icon :size="38" color="#99A9BF"><ArrowRightBold /></el-icon>
      </div>
      <div class="slider-demo-block">
        <el-slider
          @input="progressBar"
          v-model="schedule"
          :show-tooltip="false"
          :step="0.000001"
          :max="durationTime"
        />
        <span style="font-size: 12px; margin-right: -40px">{{ current }}/{{ duration }}</span>
      </div>
    </div>
    <div>
      <el-popover placement="top" :width="300" trigger="click">
        <template #reference>
          <el-icon :size="38" color="#99A9BF"><Fold /></el-icon>
        </template>
        播放列表
        <div class="playlist">
          <div
            class="playlist__item"
            v-for="(item, index) of playlist"
            :key="index"
            @click="play(index)"
          >
            <span>{{ item.filename }}</span>
            <el-icon @click.stop="ClearPlay(index)"><Close /></el-icon>
            <el-divider />
          </div>
        </div>
      </el-popover>
      <el-popover placement="top" :width="207" trigger="click">
        <template #reference>
          <el-icon :size="38" color="#99A9BF"><Operation /></el-icon>
        </template>
        <div class="audio-control">
          <div>
            <div>音量</div>
            <el-slider v-model="volumeControl" :step="0.1" vertical :max="1" height="100px" />
            <span>{{ volumeControl * 10 }}</span>
          </div>
          <div>
            <div>倍速</div>
            <el-slider
              v-model="doubleSpeed"
              show-stops
              :step="0.5"
              :max="10"
              vertical
              height="100px"
            />
            <span>{{ doubleSpeed }}</span>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import http from '../../api/index'
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

import { ref, onMounted, watch } from 'vue'

const currentSong = ref({})
const { playlist, playNum } = storeToRefs(useCounterStore())
const play_url = ref('')
const currentSongDetails = ref({})
const schedule = ref(0)
const audioFrequencyDom = ref(null) // 音频DOm
const playButtonStatus = ref(false)
const current = ref('')
const duration = ref('')
const durationTime = ref('')
const doubleSpeed = ref(1)
const volumeControl = ref(50) // 音量控制

onMounted(() => {
  console.log(audioFrequencyDom.value, 'domdomodomodom') // 在控制台输出获取到的DOM元素
})
watch(playNum, (newValue) => {
  if (playlist.value.length > 0) {
    play(newValue)
  } else {
    ElMessage.error('播放列表为空')
  }
})
watch(volumeControl, (newValue) => {
  audioFrequencyDom.value.volume = newValue
})
watch(doubleSpeed, (newValue) => {
  audioFrequencyDom.value.playbackRate = newValue
})

function ClearPlay(num) {
   useCounterStore().cleanUp(num) // 
}
async function play(num) {
  const row = playlist.value[num]
  console.log(row, '===', playlist)
  currentSong.value = {
    hash: row.hash,
    album_id: row.album_id,
    album_audio_id: row.audio_id,
    _: Math.round(new Date()),
    appid: 1014,
    mid: '56bbbd2918b95d6975f420f96c5c29bb'
  }
  const { data } = await http.get(`/yy/index.php?r=play/getdata`, currentSong.value)
  if (data.err_code === 0 && data.data.play_url) {
    play_url.value = data.data.play_url
    currentSongDetails.value = data.data
  } else {
    playbackFailed()
  }
}
function playbackFailed() {
  ElMessage.error('暂时无法播放，即将切换到下一首')
  endOfPlayback()
}
// 播放结束
function endOfPlayback() {
  playButtonStatus.value = false
    audioFrequencyDom.value.currentTime = 0
  useCounterStore().numChange(0, true)
}
function openDetails() {}
function progressBar(newValue) {
  console.log(newValue)
  audioFrequencyDom.value.currentTime = newValue
}
function playBtn() {
  audioFrequencyDom.value.play()
  playButtonStatus.value = true
}
function playPause() {
  audioFrequencyDom.value.pause()
  playButtonStatus.value = false
}
// 时分秒转换
function transTime(value) {
  var time = ''
  var h = parseInt(`${value / 3600}`)
  value %= 3600
  var m = parseInt(`${value / 60}`)
  var s = parseInt(`${value % 60}`)
  if (h > 0) {
    time = formatTime(h + ':' + m + ':' + s)
  } else {
    time = formatTime(m + ':' + s)
  }
  return time
}
// 补零
function formatTime(value) {
  var time = ''
  var s = value.split(':')
  var i = 0
  for (; i < s.length - 1; i++) {
    time += s[i].length === 1 ? '0' + s[i] : s[i]
    time += ':'
  }
  time += s[i].length === 1 ? '0' + s[i] : s[i]

  return time
}
// 更新当前播放时间
function updateProgress(e) {
  schedule.value = e.target.currentTime
  // console.log(schedule.value)
  current.value = transTime(e.target.currentTime)
}
function loadedmetadata(e) {
  durationTime.value = e.target.duration
  duration.value = transTime(e.target.duration)
}
</script>

<style lang="scss" scoped>
.bottom-music__control {
  background-color: antiquewhite;
  height: 95px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 100px;
  justify-content: space-between;
}
.song__img {
  width: 75px;
  height: 75px;
}
.song__avatars {
  display: flex;
  gap: 10px;
}
.song-title {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100px;
  padding: 10px 0;
  vertical-align: top;
  overflow: hidden;
  white-space: nowrap;
}
.scroll-item {
  animation: scroll linear 5s alternate infinite;
  &__name {
    animation: scroll linear 4s alternate infinite;
  }
}
@keyframes scroll {
  0% {
    margin-left: 0;
  }
  100% {
    margin-left: -100%;
  }
}
.control-buttons {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  /* width: 133px; */
  justify-content: center;
  align-items: center;
}

.play-control {
  width: 150px;
  display: flex;
  justify-content: space-between;
}
.slider-demo-block {
  display: flex;
  align-items: center;
  width: 200px;
}
::v-deep {
  .el-slider__button {
    display: none;
  }
}
.audio-control {
  display: flex;
  gap: 25px;
  padding: 20px;
}
.playlist {
  width: 300px;
  height: 450px;
  overflow: hidden;
  overflow-y: scroll;
  padding: 20px;
  &__item {
    position: relative;
    ::v-deep {
      .el-icon {
        position: absolute;
        top: 4px;
        display: none;
        right: 30px;
        /* margin-left: 100px; */
        vertical-align: middle;
      }
    }
    &:hover {
      ::v-deep {
        .el-icon {
          display: block;
        }
      }
    }
  }
}
</style>