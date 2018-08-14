import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'
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
  mode: playMode.sequence,
  // 当前播放的是哪一首歌(索引)
  currentIndex: -1,
  // 歌单
  disc: {},
  topList: {},
  // 搜索的历史列表
  searchHistory: loadSearch(),
  // 播放的历史列表
  playHistory: loadPlay(),
  // 喜欢的歌曲列表
  favoriteList: loadFavorite()
}
export default state