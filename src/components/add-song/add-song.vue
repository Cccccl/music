<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="SearchBox" placeholder="搜索歌曲" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll class="list-scroll" ref="songList" v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll :refreshDelay="refreshDelay" class="list-scroll" ref="searchList" v-if="currentIndex === 1" :data="searchHistory">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query"
          ref="suggest"
          :showSinger="showSinger"
          @select="selectSuggest"
          @listScroll="blurInput"
        ></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import searchBox from 'base/search-box/search-box'
import switches from 'base/switches/switches'
import scroll from 'base/scroll/scroll'
import songList from 'base/song-list/song-list'
import searchList from 'base/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'
import Suggest from 'components/suggest/suggest'
import Song from 'common/js/song'
import {searchMixin} from 'common/js/mixin'
import {mapGetters, mapActions} from 'vuex'

export default {
  mixins: [searchMixin],
  data: function () {
    return {
      showFlag: false,
      // query: '',
      showSinger: false,
      switches: [
        {name: '最近播放'},
        {name: '搜索历史'}
      ],
      currentIndex: 0
    }
  },
  components: {
    searchBox,
    Suggest,
    switches,
    songList,
    searchList,
    scroll,
    TopTip
  },
  methods: {
    show: function () {
      this.showFlag = true
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else if (this.currentIndex === 1) {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide: function () {
      this.showFlag = false
    },
    selectSuggest: function () {
      this.saveSearch()
      this.showTip()
    },
    switchItem: function (index) {
      this.currentIndex = index
    },
    selectSong: function (song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
        this.showTip()
      }
    },
    showTip: function () {
      this.$refs.topTip.show()
    },
    ...mapActions(['insertSong'])
  },
  computed: {
    ...mapGetters(['playHistory'])
  }
}
</script>
<style lang="less" scoped>
@import '~common/less/variable';
@import '~common/less/mixin';

.add-song{
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: @color-background;
  &.slide-enter-active, &.slide-leave-active{
    transition: all 0.3s;
  }
  &.slide-enter, &.slide-leave-to{
    transform: translate3d(100%, 0, 0)
  }
  .header{
    position: relative;
    height: 44px;
    text-align: center;
    .title{
      line-height: 44px;
      font-size: @font-size-large;
      color: @color-text;
    }
    .close{
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close{
        display: block;
        padding: 12px;
        font-size: 20px;
        color: @color-theme;
      }
    }
  }
  .search-box-wrapper{
    margin: 20px;
  }
  .shortcut{
    .list-wrapper{
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;
      .list-scroll{
        height: 100%;
        overflow: hidden;
        .list-inner{
          padding: 20px 30px
        }
      }
    }
  }
  .search-result{
    position: fixed;
    width: 100%;
    top: 124px;
    bottom: 0;
  }
  .tip-title{
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok{
      font-size: @font-size-medium;
      color: @color-theme;
      margin-right: 4px;
    }
    .text{
      font-size: @font-size-medium;
      color: @color-text;
    }
  }
}
</style>
