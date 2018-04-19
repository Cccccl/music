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
            <div class="middle"
                 @touchstart="middleTouchStart"
                 @touchmove="middleTouchMove"
                 @touchend="middleTouchEnd"
            >
                <div class="middle-l" ref="middleL">
                    <div class="cd-wrapper" ref="cdWrapper">
                        <div class="cd" :class="cdCls">
                            <img :src="currentSong.image" alt="" class="image">
                        </div>
                    </div>
                    <div class="playing-lyric-wrapper">
                      <div class="playing-lyric">{{playingLyric}}</div>
                    </div>
                </div>
                <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
                  <div class="lyric-wrapper">
                    <div v-if="currentLyric">
                      <p ref="lyricLine"
                         class="text"
                         :class="{'current': currentLineNum===index}"
                         v-for="(line, index) in currentLyric.lines" v-bind:key="index"
                      >{{line.txt}}
                      </p>
                    </div>
                  </div>
                </scroll>
            </div>
            <div class="bottom">
                <div class="dot-wrapper">
                  <span class="dot" :class="{'active': currentShow==='cd'}"></span>
                  <span class="dot" :class="{'active': currentShow==='lyric'}"></span>
                </div>
                <div class="progress-wrapper">
                    <span class="time time-l">{{format(currentTime)}}</span>
                    <div class="progress-bar-wrapper">
                        <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                    </div>
                    <span class="time time-r">{{format(currentSong.duration)}}</span>
                </div>
                <div class="operators">
                    <div class="icon i-left" @click="changeMode">
                        <i :class="iconMode"></i>
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
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  data: function () {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    cdCls: function () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon: function () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    iconMode: function () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
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
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  created: function () {
    this.touch = {} // 关联touchStart,touchMove,touchEnd,在created定义，是因为touch不需要getter，setter
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
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    end: function () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop: function () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    next: function () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    prev: function () {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
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
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    changeMode: function () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      /* currentSong 是根据playlist 和 currentIndex 计算而来，
       * 我们希望在切换模式的时候，currentSong不发生变化
       * 新的currentSong的id 和原来的currentSong的id一样，因此需要设置currentIndex
       */
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex: function (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getLyric: function () {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric: function ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart: function (e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove: function (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(Math.max(-window.innerWidth, left + deltaX), 0)
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      // this.$refs.lyricList 是一个vue组件，没法操作dom，this.$refs.lyricList.$el才能够访问dom
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0 ,0)`
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
    },
    middleTouchEnd: function () {
      let offsetWidth = null
      let opacity = null
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyric'
          opacity = 0
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0 ,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
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
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  },
  watch: {
    currentSong: function (newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      // currentLyric 内部有一个定时器，切到下一首歌的时候，需要把上一个定时器关闭掉。
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      // dom 还没有ready,就调用play产生异常，需要添加一个延迟
      setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
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
    ProgressCircle,
    Scroll
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
                .playing-lyric-wrapper{
                  width: 80%;
                  margin: 30px auto 0 auto;
                  overflow: hidden;
                  text-align: center;
                  .playing-lyric{
                    height: 20PX;
                    line-height: 20px;
                    font-size: @font-size-medium;
                    color: @color-text-l
                  }
                }
            }
            .middle-r{
              display: inline-block;
              vertical-align: top;
              width: 100%;
              height: 100%;
              overflow: hidden;
              .lyric-wrapper{
                width: 80%;
                margin: 0 auto;
                overflow: hidden;
                text-align: center;
                .text{
                  line-height: 32px;
                  color: @color-text-l;
                  font-size: @font-size-medium;
                  &.current{
                    color: @color-text;
                  }
                }
              }
            }
        }
        .bottom{
            position: absolute;
            bottom: 50px;
            width: 100%;
            .dot-wrapper{
              text-align: center;
              font-size: 0;
              .dot{
                display: inline-block;
                vertical-align: top;
                margin: 0 4px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: @color-text-l;
                &.active{
                  width: 20px;
                  border-radius: 5px;
                  background: @color-text-ll;
                }
              }
            }
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
