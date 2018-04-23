<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="toplist">
      <ul>
        <li class="item" v-for="(item,index) in topList" v-bind:key="index" @click="selectItem(item)">
          <div class="icon">
            <img alt="" width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList" v-bind:key="index">
              <span>{{index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading_container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  mixins: [playlistMixin],
  data: function () {
    return {
      topList: []
    }
  },
  created() {
    setTimeout(() => {
      this._getTopList()
    }, 1000)
  },
  methods: {
    handlePlaylist: function (playList) {
      const bottom = playList.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem: function (item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    _getTopList: function () {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations({
      'setTopList': 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";
.rank{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .toplist{
    height: 100%;
    overflow: hidden;
    ul{
      .item{
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;
        &:last-child{
          padding-bottom: 20px;
        }
        .icon{
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
          img{

          }
        }
        .songlist{
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: @color-highlight-background;
          color: @color-text-d;
          font-size: @font-size-small;
          .song{
            .no-wrap();
            line-height: 26px;
            span{

            }
          }
        }
      }
    }
    .loading_container{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
