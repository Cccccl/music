<template>
  <div class="player" v-show="playing">
    <div class="normal-player" v-show="fullScreen">
        播放器
    </div>
    <div class="mini-player" v-show="!fullScreen"></div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'playList',
      'fullScreen',
      'playing'
    ])
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
    }
}
</style>
