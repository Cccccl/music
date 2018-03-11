<template>
    <div class="m-header">
        <div class="icon"></div>
        <h1 class="text">Chicken Music</h1>
        <router-link tag="div" class="mine" to="/user">
            <i class="icon-mine"></i>
        </router-link>
    </div>
</template>
<script type="text/ecmascript-6">
export default {
}
</script>
<style lang="less" scoped>
@import "~common/less/variable.less";
@import "~common/less/mixin.less";
.m-header{
    position: relative;
    height: 44px;
    text-align: center;
    color: @color-theme;
    font-size: 0;
    .icon{
        display: inline-block;
        vertical-align: top;
        margin-top:6px;
        width: 30px;
        height: 32px;
        margin-right: 9px;
        .bg-image('../../components/m-header/logo@2x.png');
        @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
            .bg-image('../../components/m-header/logo@3x.png');
        }
        background-size: 30px 32px;
    }
    .text{
        display: inline-block;
        vertical-align: top;
        line-height: 44px;
        font-size: @font-size-large;
    }
    .mine{
        position: absolute;
        top:0;
        right: 0;
        .icon-mine{
            display:block;
            padding: 12px;
            font-size: 20px;
            color: @color-theme;
        }
    }
}
</style>
