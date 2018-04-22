import {mapGetters} from 'vuex'

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