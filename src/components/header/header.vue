<template>
  <div class="header">
    <i class="icon">
      <div class="image"></div>
    </i>
    <span class="text">checken music</span>
    <router-link tag="span" to="/user">
      <i class="icon-mine"></i>
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
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/variable.styl"
.header
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 50px
  text-align: center
  .icon
    display: inline-block
    vertical-align: top
    .image
      width: 30px
      height: 32px
      margin-top: 9px
      bg-image('logo')
      background-size: 30px 32px
  .text
    vertical-align: top
    line-height: 50px
    height: 50px
    font-size: $font-size-large
  .icon-mine
    position: absolute
    right: 0
    top: 0
    margin: 14px 14px 0 0
    font-size: $font-size-large-x
</style>
