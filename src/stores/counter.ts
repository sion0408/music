import { ref } from 'vue'
import { defineStore } from 'pinia'

/* ---------------------------------- 播放列表 ---------------------------------- */
export const useCounterStore = defineStore('playlist', () => {
  const playlist = ref([])
  const playNum = ref(0)
  function increment(data: [], state: any) {
    if (state) playlist.value = data
    playlist.value = [...playlist.value, ...data]
    console.log(playlist.value, '播放列表数据',);
  }
  function numChange(num: any, selfAddition: any) {
    if (selfAddition) {
      playNum.value++
    } else {
      playNum.value = num-1
    }

  }
  function cleanUp(num: number) {
    if (playNum.value === num) {
      playNum.value++
    }
    playlist.value.splice(num, 1)
  }

  return { playlist, increment, playNum, numChange, cleanUp }
})
