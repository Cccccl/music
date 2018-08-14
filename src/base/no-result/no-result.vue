<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";
.no-result{
  .no-result-icon{
    width: 86px;
    height: 90px;
    background-size: 100%;
    margin: 0 auto 30px auto;
    .bg-image('../../base/no-result/no-result@2x.png');
      @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
      .bg-image('../../base/no-result/no-result@3x.png');
    }
  }
  .no-result-text{
    font-size: @font-size-medium;
    color: @color-text-d;
  }
}
</style>
