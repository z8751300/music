<template>
  <transition name="scroll">
  <div class="confirm" v-if="showFlag">
    <div class="confirm-filter"></div>

    <div class="confirm-wrapper">
      <div class="scale-wrapper">
        <div class="confirm-text">{{text}}</div>
        <div class="confirm-btns">
          <span class="cancle-btn" @click="cancle">
            {{cancleBtnText}}
          </span>
          <span class="confirm-btn" @click="confirmClick">{{confirmBtnText}}</span>
        </div>
      </div>
    </div>
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
    text: {
      type: String,
      default: ''
    },
    cancleBtnText: {
      type: String,
      default: '取消'
    },
    confirmBtnText: {
      type: String,
      default: '确认'
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    cancle() {
      this.showFlag = false
    },
    confirmClick() {
      this.$emit('confirmClick')
      this.showFlag = false
    },
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.confirm
  position: fixed
  left: 0
  top: 0
  width: 100%
  height: 100%
  &.scroll-enter-active
    transition: all .3s
    .scale-wrapper
      animation: zoom .3s
  &.scroll-enter
    opacity: 0
  .confirm-filter
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    background-color: $color-background
    opacity: 0.9
  .confirm-wrapper
    position: absolute
    left: 50%
    top: 50%
    transform: translate3d(-50%, -50%, 0)
    background-color: $color-dialog-background
    text-align: center
    width: 200px
    border-radius: 5px
    color: $color-text-l
    .confirm-text
      height: 50px
      width: 100%
      text-align: center
      line-height: 50px
      font-size: $font-size-large
      border-bottom: 1px solid $color-background-d
    .confirm-btns
      width: 100%
      height: 50px
      line-height: 50px
      display: flex
      font-size: $font-size-m
      .cancle-btn
        flex: 1
        border-right: 1px solid $color-background-d
      .confirm-btn
        flex: 1
@keyframes zoom
  0%
    transform: scale(0)
  20%
    transform: scale(1.1)
  100%
    transform: scale(1)
@keyframes fade
  0%
    opacity: 0
  100%
    opacity: 0.6
</style>
