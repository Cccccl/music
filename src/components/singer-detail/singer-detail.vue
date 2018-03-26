<template>
    <transition name="slide">
        <div class="singer-detail">
            singer-detail!!!
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    console.log(this.singer)
  }
}
</script>
<style lang="less" scoped>
@import '~common/less/variable.less';
.singer-detail{
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: @color-background
}
.slide-enter-active, .slide-leave-active{
    transition: all 0.3s;
}
.slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0)
}
</style>
