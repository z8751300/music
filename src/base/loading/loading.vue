<template>
  <div class="loading">
    <img src="./loading.gif" width="30px" height="30px" >
    <div class="loading-text" v-if="text">
      {{text}}
    </div>
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
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
.loading
  text-align: center
  width: 100%
  img
    background-size: 30px 30px
  .loading-text
    line-height: 20px
    color: $color-text-d
    font-size: $font-size-medium
</style>
