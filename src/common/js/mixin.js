// 2个组件间共用的JS逻辑可以在mixin里面写出来，减少代码量
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted: function () {
    this.handlePlaylist(this.playList)
  },
  activated: function () {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList: function(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement hanlePlaylist method.')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode: function () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode: function () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      /* currentSong 是根据playlist 和 currentIndex 计算而来，
       * 我们希望在切换模式的时候，currentSong不发生变化
       * 新的currentSong的id 和原来的currentSong的id一样，因此需要设置currentIndex
       */
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex: function (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon: function (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite: function (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite: function (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentSongUrl: 'SET_CURRENT_SONG_URL'
    }),
    ...mapActions(['saveFavoriteList', 'deleteFavoriteList'])
  }
}

export const searchMixin = {
  data: function () {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurInput: function () {
      this.$refs.SearchBox.blur()
    },
    saveSearch: function () {
      this.saveSearchHistory(this.query)
    },
    onQueryChange: function (query) {
      this.query = query
    },
    addQuery: function (query) {
      this.$refs.SearchBox.setQuery(query)
    },
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory'])
  }
}