<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
export default {
  data: function () {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  created: function () {
    this._getMusicList()
  },
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title: function () {
      return this.topList.topTitle
    },
    bgImage: function () {
      if (this.songs.length) {
        return this.songs[0].image
      }
    }
  },
  methods: {
    _getMusicList: function () {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs: function (list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>
<style lang="less" scoped>
.slide-enter-active, .slide-leave-active{
  transition: all 0.3s ease
}
.slide-enter,  .slide-leave-to{
  transform: translate3d(100%, 0, 0)
}
</style>
