<template>
  <div class="no-result">
    <div class="icon">
    </div>
    <div class="text">{{text}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data(){
    return {}
  },
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  methods: {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
@import "../../common/stylus/mixin.styl"
@import "../../common/stylus/variable.styl"
  .no-result
    text-align: center
    width: 100%
    heigt: 130px
    .icon
      width: 86px
      height: 90px
      margin: 0 auto
      background-size: 86px 90px
      bg-image('./no-result')
    .text
      margin-top: 15px
      font-size: $font-size-medium
      color: $color-text-l
</style>
