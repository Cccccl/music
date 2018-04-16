import {playMode} from 'common/js/config'
const state = {
  singer: {},
  // 播放状态 (on / off)
  playing: false,
  // 播放器展开收起
  fullScreen: false,
  // 播放列表(顺序播放的时候，播放列表和顺序列表一样；随机播放的时候，播放列表和顺序列表不同)
  playList: [],
  // 顺序列表
  sequenceList: [],
  // 播放模式(3种播放模式：顺序，循环，随机) [语义化，配置文件]
  mode: playMode.random,
  // 当前播放的是哪一首歌(索引)
  currentIndex: -1
}
export default state