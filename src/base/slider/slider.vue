<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="item" :class="{active: currentPageIndex===index}">
      </span>
    </div>
  </div>
</template>
<script>
import {addClass} from 'common/js/dom'
import BScroll from 'better-scroll'
export default {
  name: 'slider',
  data: function () {
    return {
      dots: [],
      currentPageIndex: 0,
      sliderChildren: []
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 1000
    }
  },
  mounted: function () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return false
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  destroyed: function () {
    clearTimeout(this.timer)
  },
  methods: {
    _setSliderWidth: function (isResize) {
      this.sliderChildren = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.sliderChildren.length; i++) {
        let child = this.sliderChildren[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots: function () {
      this.dots = new Array(this.sliderChildren.length)
    },
    _initSlider: function () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          this._play()
        }
      })

      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _play: function () {
      let pageIndex = this.currentPageIndex + 1
      if (this.loop && pageIndex === this.sliderChildren.length - 2) {
        pageIndex = 0
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  }
}
</script>
<style lang="less" scoped>
@import "~common/less/variable.less";
.slider{
    min-height: 1px;
    .slider-group{
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        .slider-item{
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;
            a{
                display: block;
                width: 100%;
                overflow: hidden;
                text-decoration: none;
                img{
                    display: block;
                    width: 100%;
                }
            }
        }
    }
    .dots{
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      text-align: center;
      font-size: 0;
      .dot{
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: @color-text-l;
        &.active{
          width: 20px;
          border-radius: 5px;
          background-color: @color-text-ll
        }
      }
    }
}
</style>
