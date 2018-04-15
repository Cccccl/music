<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" v-for="(song,index) in songs" v-bind:key="song.id" class="item">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem: function (item, index) {
      this.$emit('select', item, index)
    },
    getDesc: function (song) {
      return `${song.singer}.${song.ablum}`
    }
  }
}
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.song-list{
    .item{
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 64px;
        font-size: @font-size-medium;
        .content{
            flex:1;
            line-height: 20px;
            overflow: hidden;
            .name{
                .no-wrap();
                color: @color-text;
            }
            .desc{
                .no-wrap();
                margin-top: 4px;
                color: @color-text-d;
            }
        }
    }
}
</style>
