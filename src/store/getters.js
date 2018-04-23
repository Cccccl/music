export const singer = (state) => state.singer
export const playing = (state) => state.playing
export const fullScreen = (state) => state.fullScreen
export const playList = (state) => state.playList
export const sequenceList = (state) => state.sequenceList
export const mode = (state) => state.mode
export const currentIndex = (state) => state.currentIndex
// getters 可以计算属性，组件里如果需要直接访问currentSong，可以通过currentIndex 和 playlist 计算而来。
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || []
}

export const disc = (state) => state.disc
export const topList = (state) => state.topList