import { ref } from 'vue'
import { defineStore } from 'pinia'
import http from '../api/index'
import { ElMessage } from 'element-plus'

/* ---------------------------------- 播放列表 ---------------------------------- */
export const useCounterStore = defineStore('playlist', () => {
  const playlist = ref([])
  const playNum = ref(0)
  function increment(data: [], state: any) {
    if (state) playlist.value = data
    playlist.value = [...playlist.value, ...data]
    console.log(playlist.value, '播放列表数据',);
  }
  function numChange(num: any, selfAddition: String) {
    if (selfAddition === 'plus') {
      playNum.value++
    } else if (selfAddition === 'minus') {
      playNum.value--
    } else {
      playNum.value = num
    }

  }
  async function downloadMusic(params: object) {
    const currentSong = {
      hash: params.hash,
      album_id: params.album_id,
      album_audio_id: params.audio_id,
      _: Math.round(new Date()),
      appid: 1014,
      mid: '56bbbd2918b95d6975f420f96c5c29bb'
    }
    const { data } = await http.get(`/yy/index.php?r=play/getdata`, currentSong)
    if (data.err_code === 0 && data.data.play_url) {
      window.open(data.data.play_url)
    } else {
      ElMessage.error('下载失败，请稍候重新再试')
    }
  }

  function cleanUp(num: number) {
    if (playNum.value === num) {
      playNum.value++
    }
    playlist.value.splice(num, 1)
  }
  return { playlist, increment, playNum, numChange, cleanUp, downloadMusic }
})
