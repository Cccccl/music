<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li class="search-item"
        v-for="(item) in searches"
        :key="item"
        @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem: function (item) {
      this.$emit('select', item)
    },
    deleteOne: function (item) {
      this.$emit('delete', item)
    }
  }
}
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";
.search-list{
  .search-item{
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    &.list-enter-active, &.list-leave-active{
      transition: height 0.3s;
    }
    &.list-enter, &.list-leave-to{
      height: 0;
    }
    .text{
      flex: 1;
      color: @color-text-l;
    }
    .icon{
      .extend-click();
      .icon-delete{
        font-size: @font-size-small;
        color: @color-text-d;
      }
    }
  }
}
</style>
