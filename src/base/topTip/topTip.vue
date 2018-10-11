<template>
  <transition name="slide">
  <div class="tip" @click.stop="hide" v-if="showFlag">
    {{text}}
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  data(){
    return {
      showFlag: false,
    }
  },
  props: {
    text:{
      type: String,
      default: "操作成功"
    },
    delay: {
      type: Number,
      default: 1500
    }
  },
  methods: {
    show() {
      this.showFlag = true
      let time
      if (time) {
        clearInterval(time)
      }
      time = setTimeout(() => {
        this.showFlag = false
      }, this.delay)
    },
    hide() {
      this.showFlag = false
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.tip
  position: fixed
  left: 0
  top: 0
  width: 100%
  height: 40px
  line-height: 40px
  text-align: center
  color: $color-text
  font-size: $font-size-medium
  background-color: $color-background
  z-index: 800
  &.slide-enter-active, &.slide-leave-active
    transition: all .3s ease
  &.slide-enter, &.slide-leave-to
    transform: translateY(-100%)
</style>
