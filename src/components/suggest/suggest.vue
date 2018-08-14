<template>
  <scroll class="suggest"
    ref="suggest"
    :pullUp="pullUp"
    :beforeScroll="beforeScroll"
    @scrollToEnd="_searchMore"
    @beforeScroll="listScroll"
    :data="result">
    <keep-alive>
      <ul class="suggest-list">
        <li class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item)">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="_getDisplayName(item)"></p>
          </div>
        </li>
        <loading v-show="hasMore" title=""></loading>
      </ul>
    </keep-alive>
    <div class="no-result-wrapper" v-show="resultMes === 'no results'">
      <no-result class="no-result-content" title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
const perpage = 20
const TYPE_SINGER = 'singer'
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  },
  data: function () {
    return {
      page: 1,
      result: [],
      resultMes: '',
      pullUp: true,
      beforeScroll: true,
      hasMore: true
    }
  },
  methods: {
    _search: function () {
      this.page = 1
      this.$refs.suggest.scrollTo(0, 0)
      this.hasMore = true
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._getResult(res.data)
          this._checkMore(res.data)
          if (res.message === 'no results') {
            this.resultMes = 'no results'
          } else {
            this.resultMes = ''
          }
        }
      })
    },
    _searchMore: function () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._getResult(res.data))
          this._checkMore(res.data)
          if (res.message === 'no results') {
            this.resultMes = 'no results'
          } else {
            this.resultMes = ''
          }
        }
      })
    },
    _checkMore: function (data) {
      if ((data.song.totalnum - data.song.curpage * perpage) <= 0) {
        this.hasMore = false
      }
    },
    _getResult: function (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        // type 用来区分数据是歌曲 还是 歌手
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    getIconCls: function (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    _getDisplayName: function (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    _normalizeSongs: function (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    selectItem: function (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singerid,
          name: item.singername,
          mid: item.singermid
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      // 搜索，suggest组件不做存储搜索历史记录这样的事情，因此需要把这个事件派发出去。
      this.$emit('select')
    },
    listScroll: function () {
      this.$emit('listScroll')
    },
    refresh: function () {
      this.$refs.suggest.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query: function () {
      this._search()
    }
  }
}
</script>
<style lang="less" scoped>
@import '~common/less/variable';
@import '~common/less/mixin';
.suggest{
  height: 100%;
  overflow: hidden;
  .suggest-list{
    padding: 0 30px;
    .suggest-item{
      display: flex;
      align-items: center;
      padding: 0 0 20px 0;
      .icon{
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: @color-text-d;
        }
      }
      .name{
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
        .text{
          .no-wrap();
        }
      }
    }
  }
  .no-result-wrapper{
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    .no-result-content{
      text-align: center;
    }
  }
}
</style>
