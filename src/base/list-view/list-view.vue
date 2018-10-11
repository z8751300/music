<template>
<div class="list-view">
  <scroll class="scroll-view" :data="arrayList" ref="scroll"
          :probeType=3 :listenScroll=true @scroll="onScroll"
  >
    <ul>
      <li class="group" v-for="group in arrayList" ref="group">
        <div class="title">{{group.title}}</div>
        <ul>
          <li v-for="singer in group.items" class="list-item"
              @click="select(singer)"
          >
            <div class="avatar">
              <img v-lazy="singer.avatar">
            </div>
            <div class="singer-name">{{singer.name}}</div>
          </li>
        </ul>
      </li>
    </ul>
  </scroll>
  <div class="shortcut">
    <div class="shortcut-item" v-for="(item, index) in shortcutList"
         :data-index="index"
         @touchstart="onTouchstart"
         @touchmove="onTouchMove"
         @touchend = "onTouchEnd"
         :class="{active: currentIndex === index}"
    >
      {{item}}
    </div>
  </div>
  </div>
</div>

</template>

<script type="text/ecmascript-6">
  import Scroll from '../scroll/scroll.vue'
  import {getData} from '../../common/js/dom'
  const EL_HEIGHT = 20
  export default {
    data(){
      return {
        currentIndex: 0,
        heightList: [],
        scrollY: 0,
        dif: 0,
      }
    },
    props: {
      arrayList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    methods: {
      onTouchstart(el) {
        let index = this.checkIndex(parseInt(getData(el.target, 'index')))
        if (index < 0) {
          return
        }
        this._scrollTo(index)
        this.touch.start = el.touches[0].pageY
        this.touch.flag = true
        this.touch.index = index

        this.scrollY = this.heightList && this.heightList[index] ? -this.heightList[index] : 0
      },
      onTouchMove(el) {
        let end = el.touches[0].pageY
        let distiance
        if (this.touch.flag) {
          let end = el.touches[0].pageY
          let distance = parseInt((end - this.touch.start)/EL_HEIGHT) + this.touch.index
          this._scrollTo(distance)
          let index = this.checkIndex(distance)
          if (index < 0 ) {
            return
          } else {
            this.scrollY = this.heightList && this.heightList[index] ? -this.heightList[index] : 0
          }
        }
      },
      onTouchEnd(el) {
        this.touch.flag = false
      },
      _scrollTo(index) {
        index = this.checkIndex(index)
        if (index < -1) {
          return
        }
        this.$refs.scroll.scrollToElement(this.$refs.group[index], 300)
      },
      checkIndex(index) {
        if (!index && index !== 0) {
          return -1
        }
        if (index < 0) {
          index = 0
        } else if(index > this.arrayList.length -1) {
          index = this.arrayList.length -1
        }
        return index
      },
      _calculateHeightList() {
        let list = this.$refs.group
        let arr = []
        let height = 0
        arr.push(height)
        Array.prototype.slice.call(list).forEach((item) => {
          arr.push(height += item.clientHeight)
        })
        this.heightList = arr
      },
      onScroll(pos) {
        this.scrollY = pos.y
      },
      select(singer) {
        this.$emit('selectSinger', singer)
      },
      refresh() {
        this.$refs.scroll.refresh()
      }
    },

    computed: {
      shortcutList() {
        return this.arrayList.map((item) => {
          return item.title.slice(0,1)
        })
      },
      fixedTitle() {
//        if (parseInt(Math.abs(this.scrollY)) === parseInt(this.heightList[this.currentIndex])) {
//          console.log('sssssssssssssssss')
//          return ''
//        }
        if (this.scrollY > 0) {
          return
        } else {
          return this.arrayList.map((item) => {
            return item.title
          })[this.currentIndex]
        }

      }
    },
    watch: {
      scrollY(v) {
        let len = this.heightList.length
        if (v > 0){
          this.currentIndex = 0
        } else if (v < -this.heightList[len -1]) {
          this.currentIndex = len -2
        } else {
          let h1
          let h2
          v = Math.floor(parseInt(v))
          for(let i=0; i<len; i++) {
            h1 = Math.floor(parseInt(this.heightList[i]))
            h2 = Math.floor(parseInt(this.heightList[i +1]))
            if (-v >= h1 && -v < h2) {
              this.currentIndex = i
              this.dif = h2
            }
          }
        }
//        let y = parseInt(Math.abs(Math.min(0, v)))
//        this.currentIndex = this.heightList.findIndex(
//          (top, index) => {
//            return (y >= top && y < this.heightList[index +1])
//          }
//        )
      },

    },
    created() {
      this.touch = {}
      this.scrollY = 0
    },
    updated() {
      if (this.arrayList.length && this.$refs.scroll) {
        this._calculateHeightList()
      }
    },
    mounted() {
      this.$refs.scroll.refresh()
    },
    components: {
      Scroll,
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.list-view

  position: absolute
  left: 0
  top: 0
  right: 0
  bottom: 0
  overflow: hidden
  .scroll-view
    height: 100%
    color: $color-text-d
    .title
      width: 100%
      height: 30px
      line-height: 30px
      padding-left: 10px
      background-color: $color-highlight-background
    .list-item
      display: flex
      margin: 10px 10px 10px 25px
      .avatar
        flex: 0 0 50px
        width: 50px
        img
          width: 40px
          height: 40px
          background-size: 30px 30px
          border-radius: 50%
      .singer-name
        flex: 1
        line-height: 50px
  .shortcut
    position: absolute
    right: 8px
    top: 50%
    transform: translateY(-50%)
    text-align: center
    background-color: $color-background-d
    padding: 5px 1px
    border-radius: 5px
    .shortcut-item
      color: $color-text-d
      padding: 2px 0
      font-size: $font-size-small
      &:last-child
        padding-bottom: 0
      &.active
        color: $color-text


  .fixed-title
    position: fixed
    left: 0
    top: 88px
    width: 100%
    height: 30px
    z-index: 500
    line-height: 30px
    padding-left: 10px
    background-color: $color-highlight-background
</style>
