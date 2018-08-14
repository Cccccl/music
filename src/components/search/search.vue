<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="SearchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <Scroll class="shortcut" ref="shortCut" :data="shortCut" :refreshDelay="refreshDelay">
        <div>
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="(item, index) in hotKey" :key="index" @click="addQuery(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length > 0">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list :searches="searchHistory"
            @select="addQuery"
            @delete="deleteOne"></search-list>
        </div>
        </div>
      </Scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest"
        @listScroll="blurInput"
        @select="saveSearch"
        :query="query"></suggest>
    </div>
    <confirm ref="confirm"
      text="是否删除全部搜索历史"
      @confirm="clearSearchHistory"
    ></confirm>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import SearchBox from 'base/search-box/search-box'
import SearchList from 'base/search-list/search-list'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import Suggest from 'components/suggest/suggest'
import {mapActions, mapGetters} from 'vuex'
import {playlistMixin, searchMixin} from 'common/js/mixin'
export default {
  mixins: [playlistMixin, searchMixin],
  data: function () {
    return {
      hotKey: []
      // query: ''
    }
  },
  created: function () {
    this._getHotKey()
  },
  computed: {
    shortCut: function () {
      return this.hotKey.concat(this.searchHistory)
    },
    ...mapGetters([
      // 'searchHistory'
    ])
  },
  methods: {
    handlePlaylist: function (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortCut.refresh()
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    _getHotKey: function () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    // onQueryChange: function (query) {
    //   this.query = query
    // },
    // addQuery: function (query) {
    //   this.$refs.SearchBox.setQuery(query)
    // },
    deleteOne: function (item) {
      this.deleteSearchHistory(item)
    },
    showConfirm: function () {
      this.$refs.confirm.show()
    },
    // blurInput: function () {
    //   this.$refs.SearchBox.blur()
    // },
    // saveSearch: function () {
    //   this.saveSearchHistory(this.query)
    // },
    ...mapActions([
      // 'saveSearchHistory',
      // 'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  watch: {
    query: function (newquery) {
      if (!newquery) {
        setTimeout(() => {
          this.$refs.shortCut.refresh()
        }, 200)
      }
    }
  },
  components: {
    SearchBox,
    SearchList,
    Suggest,
    Confirm,
    Scroll
  }
}
</script>
<style lang="less" scoped>
@import '~common/less/variable';
@import '~common/less/mixin';
.search{
  .search-box-wrapper{
    margin: 20px;
  }
  .shortcut-wrapper{
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    .shortcut{
      height: 100%;
      overflow: hidden;
      .hot-key{
        margin: 0 20px 20px 20px;
        .title{
          margin: 0 0 20px 0;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
        ul{
          .item{
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: @color-highlight-background;
            font-size: @font-size-medium;
            color: @color-text-d;
            span{

            }
          }
        }
      }
      .search-history{
        position: relative;
        margin: 0 20px;
        .title{
          display: flex;
          align-items: center;
          height: 40px;
          font-size: @font-size-medium;
          color: @color-text-l;
          .text{
            flex: 1;
          }
          .clear{
            .extend-click();
            .icon-clear{
              font-size: @font-size-medium;
              color: @color-text-d;
            }
          }
        }
      }
    }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
