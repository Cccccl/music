<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn"
                 @touchstart.prevent="progressTouchStart"
                 @touchmove.prevent="progressTouchMove"
                 @touchend="progressTouchEnd"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>
<script>
import {prefixStyle} from 'common/js/dom'
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created: function () {
    this.touch = {} // 在不同的touch事件下共享的touch数据
  },
  methods: {
    progressTouchStart: function (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove: function (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX // 横向的偏移量
      const offsetWidth = Math.min(Math.max(0, this.touch.left + deltaX), this.$refs.progressBar.clientWidth - progressBtnWidth) // 当手指拖动的很远的时候，需要小于bar的宽度
      this._offset(offsetWidth)
    },
    progressTouchEnd: function () {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick: function (e) {
      // 当我们点击progresBtn的时候，e.offsetX获取不对
      // this._offset(e.offsetX)
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    _triggerPercent: function () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    _offset: function (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    percent: function (newPercent) {
      /* 在拖动进度条的时候，歌曲也在播放中，会导致进度条的跳动，
       * 这时候应该设置 判断条件 （在移动状态值为false的时候，也就是没有拖动的时候，改变进度条的位置），
       * 如果移动状态值为true的情况下，就不会再去改变进度条的位置
       */
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "~common/less/variable";
.progress-bar{
    height: 30px;
    .bar-inner{
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0, 0, 0, 0.3);
        .progress{
            position: absolute;
            height: 100%;
            background: @color-theme;
        }
        .progress-btn-wrapper{
            position: absolute;
            // left: -8px;
            top: -13px;
            width: 30px;
            height: 30px;
            .progress-btn{
                position: relative;
                top: 7px;
                // left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid @color-text;
                border-radius: 50%;
                background-color: @color-theme;
            }
        }
    }
}
</style>
