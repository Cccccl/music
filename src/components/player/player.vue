<template>
  <div class="player" v-show="playing">
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
                        <div class="cd">
                            <img :src="currentSong.image" alt="" class="image">
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="operators">
                    <div class="icon i-left">
                        <i class="icon-sequence"></i>
                    </div>
                    <div class="icon i-left">
                        <i class="icon-prev"></i>
                    </div>
                    <div class="icon i-center">
                        <i class="icon-play"></i>
                    </div>
                    <div class="icon i-right">
                        <i class="icon-next"></i>
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
                <img :src="currentSong.image" alt="" width="40" height="40">
            </div>
            <div class="text">
                <h2 class="name">{{currentSong.name}}</h2>
                <p class="desc">{{currentSong.singer}}</p>
            </div>
            <div class="control"></div>
            <div class="control">
                <i class="icon-playlist"></i>
            </div>
        </div>
    </transition>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')
export default {
  computed: {
    ...mapGetters([
      'playList',
      'fullScreen',
      'playing',
      'currentSong'
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
      setFullScreen: 'SET_FULL_SCREEN'
    })
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
            .operators{
                display: flex;
                align-items: center;
                .icon{
                    flex: 1;
                    color: @color-theme;
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
            .icon-playlist{
                color: @color-theme-d;
                font-size: 30px;
            }
        }
    }
}
</style>
