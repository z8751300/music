<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>

    </div>
    <div class="dots">
        <div class="dot-item" v-for="(item, index) in dots"
              :class="{active: currentIndex === index}"
        >
        </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {setClass} from '../../common/js/dom'
  import BScroll from 'better-scroll'

export default {
  data(){
    return {
      dots: [],
      currentIndex: 0,
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    _setSliderWidth(resize) {
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      let children = this.$refs.sliderGroup.children
      if (!resize) {
        this.children = children
      }
      for(let i=0; i<children.length; i++) {
        setClass(children[i], 'slider-item')
        children[i].style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !resize) {
        width += 2*sliderWidth
        this.children = children
      }
      this.$refs.sliderGroup.style.width = width + 'px'

    },
    _initialScroll() {
      this.scroll = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400,
        click: true,
      })
      this.scroll.on('scrollEnd', () => {
        let x = this.scroll.getCurrentPage().pageX
        if (this.loop) {
          this.currentIndex = x -1
        }
        if (this.autoPlay) {
          this._play()
        }

      })

    },
    _play() {
      let page = this.currentIndex + 1
      if (this.loop) {
        page += 1
      }
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setTimeout(() => {
        this.scroll.goToPage(page, 0, 400)
      }, 2000)
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.$refs.slider) {
        return
      }
      this._setSliderWidth()
      this.dots = new Array(this.children.length)
      this._initialScroll()
      if (this.autoPlay) {
        this._play()
      }

      window.addEventListener('resize', () => {
        if (!this.scroll) {
          return
        }
        this._setSliderWidth(true)
        this.scroll.refresh()
      })
    })
  },
  desctroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.slider
  position: relative
  width: 100%
  overflow: hidden
  .slider-group
    .slider-item
      display: inline-block
      float: left
      img
        width: 100%
        height: auto

  .dots
    position: absolute
    bottom: 10px
    left: 50%
    transform: translatex(-50%)
    .dot-item
      width: 10px
      height: 10px
      float: left
      border-radius: 5px
      margin-right: 10px
      background-color: $color-text-l
      &:last-child
        margin-right: 0
      &.active
        background-color: $color-text
        width: 20px
</style>
