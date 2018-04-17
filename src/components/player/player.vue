<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
                <img alt="" width="100%" height="100%" :src="currentSong.image">
            </div>
            <div class="top">
                <div class="back" @click="back()">
                    <i class="icon-back"></i>
                </div>
                <h1 class="title">{{currentSong.name}}</h1>
                <h2 class="subtitle">{{currentSong.singer}}</h2>
            </div>
            <div class="middle">
                <div class="middle-l">
                    <div class="cd-wrapper" ref="cdWrapper">
                        <div class="cd" :class="cdCls">
                            <img :src="currentSong.image" alt="" class="image">
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="progress-wrapper">
                    <span class="time time-l">{{format(currentTime)}}</span>
                    <div class="progress-bar-wrapper">
                        <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                    </div>
                    <span class="time time-r">{{format(currentSong.duration)}}</span>
                </div>
                <div class="operators">
                    <div class="icon i-left">
                        <i class="icon-sequence"></i>
                    </div>
                    <div class="icon i-left" :class="disableCls">
                        <i class="icon-prev" @click="prev"></i>
                    </div>
                    <div class="icon i-center" :class="disableCls">
                        <i @click="togglePlaying" :class="playIcon"></i>
                    </div>
                    <div class="icon i-right" :class="disableCls">
                        <i class="icon-next" @click="next"></i>
                    </div>
                    <div class="icon i-right">
                        <i class="icon icon-not-favorite"></i>
                    </div>
                </div>
            </div>
        </div>
    </transition>
    <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="open()">
            <div class="icon">
                <img :class="cdCls" :src="currentSong.image" alt="" width="40" height="40">
            </div>
            <div class="text">
                <h2 class="name">{{currentSong.name}}</h2>
                <p class="desc">{{currentSong.singer}}</p>
            </div>
            <div class="control">
                <progress-circle :radius="radius" :percent="percent">
                  <i :class="miniIcon" @click.stop="togglePlaying" class="icon-mini"></i>
                </progress-circle>
            </div>
            <div class="control">
                <i class="icon-playlist"></i>
            </div>
        </div>
    </transition>
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'

const transform = prefixStyle('transform')
export default {
  data: function () {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32
    }
  },
  computed: {
    cdCls: function () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon: function () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon: function () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableCls: function () {
      return this.songReady ? '' : 'disable'
    },
    percent: function () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'playList',
      'fullScreen',
      'playing',
      'currentSong',
      'currentIndex'
    ])
  },
  methods: {
    back: function () {
      this.setFullScreen(false)
    },
    open: function () {
      this.setFullScreen(true)
    },
    /*
     *  根据vuejs提供的动画钩子创建animations动画。
     *  用js创建css3动画，利用第三方开源库create-keyframe-animation
     */
    enter: function (el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0 , 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0 , 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter: function (el) {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = '' // 清空animation
    },
    leave: function (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave: function (el) {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    togglePlaying: function () {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    next: function () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    prev: function () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    ready: function () {
      this.songReady = true
    },
    error: function () {
      // 网络错误或者歌曲的url存在错误，这时候songReay不能赋值为true,下一首歌的功能也不能用
      this.songReady = true // 这样发生上诉错误的时候也能使用
    },
    updateTime: function (e) {
      this.currentTime = e.target.currentTime
    },
    format: function (interval) {
      interval = Math.floor(interval)
      const minute = this._pad(Math.floor(interval / 60))
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    onProgressBarChange: function (percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    _pad: function (num, n = 2) {
      let len = num.toString().length
      while (len < 2) {
        num = '0' + num
        len++
      }
      return num
    },
    // 获取初始位置和缩放尺寸
    _getPosAndScale: function () {
      const targetWidth = 40 // 小图的宽度
      const paddingLeft = 40 // 小图中心点的坐标离左边有40的距离
      const paddingBottom = 30 // 小图中心点的坐标离底部有30的距离
      const paddingTop = 80 // 大图顶部距离顶部有80的距离
      const width = window.innerWidth * 0.8 // cd的宽度
      const scale = targetWidth / width // 初始的缩放比例
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  watch: {
    currentSong: function () {
      // dom 还没有ready,就调用play产生异常，需要添加一个延迟
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    playing: function (newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle
  }
}
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";
.player{
    .normal-player{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: @color-background;
        &.normal-enter-active,&.normal-leave-active{
            transition: all 0.4s;
            .top, .bottom{
                transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32)
            }
        }
        &.normal-enter, &.normal-leave-to{
            opacity: 0;
            .top{
                transform: translate3d(0, -100px, 0)
            }
            .bottom{
                transform: translate3d(0, 100px, 0)
            }
        }
        .background{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px);
            img{
            }
        }
        .top{
            position: relative;
            margin-bottom: 25px;
            .back{
                position: absolute;
                top: 0;
                left: 6px;
                z-index: 50;
                i{
                    display: block;
                    padding: 9px;
                    font-size: @font-size-large-x;
                    color: @color-theme;
                    transform: rotate(-90deg)
                }
            }
            .title{
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
            }
            .subtitle{
                line-height: 20px;
                text-align: center;
                font-size: @font-size-medium;
                color: @color-text;
            }
        }
        .middle{
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-size: 0;
            .middle-l{
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;
                .cd-wrapper{
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    height: 100%;
                    .cd{
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border: 10px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50%;
                        // cd 旋转的样式
                        &.play{
                            animation: rotate 20s linear infinite
                        }
                        &.pause{
                            animation-play-state: paused
                        }
                        .image{
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                }
            }
        }
        .bottom{
            position: absolute;
            bottom: 50px;
            width: 100%;
            .progress-wrapper{
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0 auto;
                padding: 10px 0;
                .time{
                    color: @color-text;
                    font-size: @font-size-small;
                    flex: 0 0 30px;
                    line-height: 30px;
                    width: 30px;
                    &.time-l{
                        margin-right: 2%;
                        text-align: left;
                    }
                    &.time-r{
                        margin-left: 2%;
                        text-align: right;
                    }
                }
                .progress-bar-wrapper{
                    flex: 1;
                }
            }
            .operators{
                display: flex;
                align-items: center;
                .icon{
                    flex: 1;
                    color: @color-theme;
                    &.disable{
                        color: @color-theme-d
                    }
                    i{
                        font-size: @font-size-large;
                    }
                }
                .i-left{
                    text-align: right;
                    .icon-sequence{
                    }
                    .icon-prev{
                    }
                }
                .i-center{
                    padding: 0 20px;
                    text-align: center;
                    .icon-play{
                    }
                }
                .i-right{
                    text-align: left;
                    .icon-next{
                    }
                    .icon-not-favorite{
                        color: @color-sub-theme;
                    }
                }
            }
        }
    }
    .mini-player{
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: @color-highlight-background;
        &.mini-enter-active,&.mini-leave-active{
            transition: all 0.4s;
        }
        &.mini-enter,&.mini-leave-to{
            opacity: 0;
        }
        .icon{
            flex: 0 0 40px;
            width: 40px;
            padding: 0 10px 0 20px;
            img{
                border-radius: 50%;
                // cd 旋转的样式
                &.play{
                    animation: rotate 20s linear infinite
                }
                &.pause{
                    animation-play-state: paused
                }
            }
        }
        .text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            .name{
                margin-bottom: 2px;
                .no-wrap();
                font-size: @font-size-medium;
                color: @color-text;
            }
            .desc{
                .no-wrap();
                font-size: @font-size-small;
                color: @color-text-d;
            }
        }
        .control{
            flex: 0 0 30px;
            width: 30px;
            padding: 0 10px;
            .icon-play-mini,.icon-pause-mini,.icon-playlist{
                color: @color-theme-d;
                font-size: 30px;
            }
            .icon-mini{
              font-size: 32px;
              position: absolute;
              left: 0;
              top: 0;
            }
        }
    }
}
@keyframes rotate {
    0%{
        transform: rotate(0)
    }
    100%{
        transform: rotate(360deg)
    }
}
</style>