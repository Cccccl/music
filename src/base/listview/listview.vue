<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          @scroll="scrollfn"
          :probeType="probeType"
  >
    <ul>
      <li class="list-group" v-for="group in data" v-bind:key="group.title" ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.items" v-bind:key="item.id">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
        @touchstart="onShortcutTouchstart"
        @touchmove.stop.prevent="onShortcutTouchmove">
        <ul>
            <li v-for="(item, index) in shortcutList"
                class="item"
                :data-index="index"
                v-bind:key="item.id"
                :class="{'current':currentIndex ===index}">
                {{item}}
            </li>
        </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 14
const TITLE_HEIGHT = 30

export default {
  data() {
    return {
      scrollY: 0,
      currentIndex: 0,
      diff: -1
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    onShortcutTouchstart(e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchmove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scrollfn(pos) {
    //   console.log(pos)
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
    },
    _calculateHeight() {
      const list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
      console.log(this.listHeight)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      // console.log(newY)
      const listHeight = this.listHeight
      // 当滚动到顶部，newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      console.log(this.fixedTop)
      // 1.在30~0的时候fixedTo为-0~-30
      // 2.在往下滚动的一瞬间（零界点的时候赋值为0），之后每次过fixed的时候赋值为0。
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      // 只有在fixedTop 在0~30的时候，才会触发dom操作，并且使用GPU加速。
      this.fixedTop = fixedTop
      console.log(this.fixedTop)
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  }
}
</script>
<style lang="less" scoped>
@import "~common/less/variable.less";
.listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: @color-background;
    ul{
        .list-group{
            padding-bottom: 30px;
            .list-group-title{
                height: 30px;
                line-height: 30px;
                padding-left: 20px;
                font-size: @font-size-small;
                color: @color-text-l;
                background: @color-highlight-background;
            }
            ul{
                .list-group-item{
                    display: flex;
                    align-items: center;
                    padding: 20px 0 0 30px;
                    .avatar{
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                    }
                    .name{
                        margin-left: 20px;
                        color: @color-text-l;
                        font-size: @font-size-medium
                    }
                }
            }
        }
    }
    .list-shortcut{
        position: absolute;
        z-index: 30;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        padding: 20px 0;
        border-radius: 10px;
        text-align: center;
        background: @color-background-d;
        font-family: Arial, Helvetica, sans-serif;
        ul{
            .item{
                padding: 1px;
                line-height: 1;
                color: @color-text-l;
                font-size: @font-size-small;
                &.current{
                    color: @color-theme;
                }
            }
        }
    }
    .list-fixed{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background
      }
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%)
    }
}
</style>
