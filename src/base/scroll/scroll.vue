<template>
  <div class="scroll" ref="scroll" >
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

export default {
  data(){
    return {}
  },
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    clickType: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullUpload: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.scroll) {
        return
      }
      this.scroll = new BScroll(this.$refs.scroll, {
        probeType: this.probeType,
        click: this.clickType
      })
      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }
      if (this.pullUpload) {
        this.scroll.on('scrollEnd', (pos) => {
          if (this.scroll.y < this.scroll.maxScrollY + 50) {
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('onBeforeScrollStart')
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    deable() {
      this.scroll && this.scroo.deable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo(0, 4, 0)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll()
    })
  },
  watch: {
    data() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this._initScroll()
        }
        this.scroll && this.scroll.refresh()
      })

    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>

</style>
