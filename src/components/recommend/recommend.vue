<template>
  <div class="recommend">
      <div class="recommend-content">
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul></ul>
        </div>
      </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Slider from 'base/slider/slider'
import {ERR_OK} from 'api/config'
import {getRecommend, getDiscList} from 'api/recommend'
export default {
  data: function () {
    return {
      recommends: []
    }
  },
  components: {
    Slider
  },
  created: function () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    _getRecommend: function () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.list)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "~common/less/variable.less";

.recommend{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content{
    height: 100%;
    overflow: hidden;
    .slider-wrapper{
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommend-list{
      .list-title{
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: @font-size-medium;
        color: @color-theme;
      }
    }
  }
}
</style>
