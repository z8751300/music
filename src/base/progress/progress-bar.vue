<template>
  <div class="progress-bar" ref="out"
        @click="click"
  >
    <div class="progress-out" ></div>
    <div class="progress-inner" ref="inner"></div>
    <div class="progress-btn" ref="btn"
         @touchstart="onTouchStart"
         @touchmove="onTouchMove"
         @touchend="onTouchEnd"
    >
      <div class="btn" ref="button"></div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  const BTN_WIDTH = 16
  import {profix} from '../../common/js/dom'
  const TRANSFORM = profix('transform')
export default {
  data(){
    return {
      initial: false,
    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    },
  },
  methods: {
    onTouchStart(e) {
      this.touch.start = e.touches[0].pageX
      this.touch.left = this.$refs.inner.clientWidth
      this.initial = true
    },
    onTouchMove(e) {
      if (!this.initial) { return }
      this.touch.end = e.touches[0].pageX
      let width = this.touch.end - this.touch.start
      width = Math.min(this.width, Math.max(0, width +this.touch.left))
      this._offset(width)
    },
    onTouchEnd(e) {
      this.initial = false
      let percent = this.$refs.inner.clientWidth/(this.$refs.out.clientWidth - BTN_WIDTH)
      this.$emit('percentChange', percent)
    },
    click(e) {
      let right = e.pageX
      let left = this.$refs.out.getBoundingClientRect().left
      let width = Math.min(this.width, Math.max(0, right - left))
      let percent = width / this.width
      this.$emit('percentChange', percent)
    },
    _offset(width) {
      this.$refs.inner.style.width = width + 'px'
      this.$refs.btn.style.transform = `translate3d(${width}px, 0, 0)`
    }

  },
  created() {
    this.touch = {}
  },
  mounted() {
    this.width = this.$refs.out.clientWidth - BTN_WIDTH
  },
  watch: {
    percent(newValue) {
      if (newValue > 0 && !this.initial) {
        let outWidth = this.$refs.out.clientWidth
        let width = (outWidth - BTN_WIDTH)*newValue
        this._offset(width)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.progress-bar
  heigth: 16px
  line-height: 16px
  position: relative
  .progress-out
    position: absolute
    left: 0
    top: 6px
    width: 100%
    height: 2px
    background-color: $color-text-l
  .progress-inner
    position: absolute
    left: 0
    top: 6px
    width: 0
    height: 2px
    background-color: $color-theme
  .progress-btn
    transform: translate3d(0,0,0)
    .btn

      width: 16px
      height: 16px
      background-color: $color-theme
      border-radius: 50%
      box-shadow: 0 0 3px 5px #000 inset
</style>
