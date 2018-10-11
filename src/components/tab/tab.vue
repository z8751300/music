<template>
  <div class="tab">
    <router-link tag="div" to="/recommend" class="router-item">
      <span class="text">推荐</span>
    </router-link>
    <router-link tag="div" to="/singer" class="router-item">
      <span class="text">歌手</span>
    </router-link>
    <router-link tag="div" to="/rank" class="router-item">
      <span class="text">榜单</span>
    </router-link>
    <router-link tag="div" to="/search" class="router-item">
      <span class="text">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data(){
    return {}
  },
  methods: {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.tab
  position: absolute
  left: 0
  top: 50px
  width: 100%
  height: 38px
  display: flex
  margin: 5px 0
  .router-item
    flex: 1
    text-align: center

    &.router-link-active
      .text
        color: $color-theme
        padding-bottom: 4px
        border-bottom: 2px solid $color-theme
</style>
