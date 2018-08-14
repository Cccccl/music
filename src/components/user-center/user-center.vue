<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" ref="playBtn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll class="list-scroll" v-show="currentIndex===0" ref="favoriteList" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll class="list-scroll" v-show="currentIndex===1" ref="playList" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import {mapGetters, mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Switches from 'base/switches/switches'
import NoResult from 'base/no-result/no-result'
import Song from 'common/js/song'
import {playlistMixin} from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  data: function () {
    return {
      switches: [
        {name: '我喜欢的'},
        {name: '最近听的'}
      ],
      currentIndex: 0
    }
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  },
  computed: {
    noResult: function () {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else if (this.currentIndex === 1) {
        return !this.playHistory.length
      }
    },
    noResultDesc: function () {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else if (this.currentIndex === 1) {
        return '你还没有听过歌曲'
      }
    },
    ...mapGetters(['playHistory', 'favoriteList'])
  },
  methods: {
    handlePlaylist: function (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      setTimeout(() => {
        this.$refs.playList && this.$refs.playList.refresh()
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      }, 20)
    },
    back: function () {
      this.$router.push('/')
    },
    switchItem: function (index) {
      this.currentIndex = index
      this.handlePlaylist(this.playList)
    },
    selectSong: function (song) {
      this.insertSong(new Song(song))
    },
    random: function () {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      list = list.map((song) => {
        return new Song(song)
      })
      this.randomPlay({list})
    },
    ...mapActions(['insertSong', 'randomPlay'])
  }
}
</script>
<style lang="less" scoped>
@import "~common/less/variable";
.user-center{
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: @color-background;
  &.slide-enter-active, &.slide-leave-active{
    transition: all 0.3s;
  }
  &.slide-enter, &.slide-leave-to{
    transform: translate3d(100%, 0, 0)
  }
  .back{
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back{
      display: block;
      padding: 10px;
      font-size: @font-size-large-x;
      color: @color-theme;
    }
  }
  .switches-wrapper{
    margin: 10px 0 30px 0;
  }
  .play-btn{
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid @color-text-l;
    color: @color-text-l;
    border-radius: 100px;
    font-size: 0;
    .icon-play{
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: @font-size-medium-x;
    }
    .text{
      display: inline-block;
      vertical-align: middle;
      font-size: @font-size-small;
    }
  }
  .list-wrapper{
    position: fixed;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll{
      position: relative;
      height: 100%;
      overflow: hidden;
      .list-inner{
        padding: 20px 30px
      }
    }
  }
  .no-result-wrapper{
    position: absolute;
    width: 100%;
    top: 50%;
    text-align: center;
    transform: translateY(-50%);
  }
}
</style>
