<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" v-model="query" ref="query">
    <i class="icon-dismiss" @click="clear" v-show="query"></i>
  </div>
</template>
<script type="text/ecmascript-6">
import {debounce} from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲，歌手'
    }
  },
  data: function () {
    return {
      query: ''
    }
  },
  methods: {
    clear: function () {
      this.query = ''
    },
    setQuery: function (query) {
      this.query = query
    },
    blur: function () {
      console.log('blur')
      this.$refs.query.blur()
    }
  },
  created: function () {
    // 做节流处理。
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>
<style lang="less" scoped>
@import "~common/less/variable";
.search-box{
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: @color-highlight-background;
  border-radius: 6px;
  .icon-search{
    font-size: 24px;
    color: @color-background;
  }
  .box{
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: @color-highlight-background;
    color: @color-text;
    font-size: @font-size-medium;
    &::placeholder{
      color: @color-text-d;
    }
  }
  .icon-dismiss{
    font-size: 16px;
    color: @color-background;
  }
}
</style>
