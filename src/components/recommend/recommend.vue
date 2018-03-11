<template>
  <div class="">
      推荐页面
  </div>
</template>
<script type="text/ecmascript-6">
import {ERR_OK} from 'api/config'
import {getRecommend} from 'api/recommend'
export default {
  created: function () {
    this._getRecommend()
  },
  methods: {
    _getRecommend: function () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.slider)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
