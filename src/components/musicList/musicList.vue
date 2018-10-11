<template>
  <div class="music-list" ref="musicList">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="singer-name" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter"></div>
      <div class="play-btn" ref="playBtn" @click="startRandomPlay">
        <i class="icon-play-mini"></i>
        <h2 class="play-text">随机播放</h2>
      </div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll :data="songs" class="list" ref="list"
            :probe-type=3 :listen-scroll=true
            @scroll="scroll"
    >
      <div class="song-list-wrapper" v-show="songs.length">
        <song-list :songs="songs" :rank="rank"
                   @selectItem="selectItem"
        >
        </song-list>
      </div>
      <div class="loading-wrapper" v-if="!songs.length">
        <loading class="loading" :text="'正在加载歌曲列表'"></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import Scroll from '../../base/scroll/scroll.vue'
  import SongList from '../../base/songList/songList.vue'
  import {profix} from '../../common/js/dom'
  import Loading from '../../base/loading/loading.vue'
  import {mapActions} from 'vuex'
  import {playlistMixin} from '../../common/js/mixin'
  const REMAIN_HEIGHT = 30
  const TRANSFORM = profix('transform')

export default {
  data(){
    return {
      scrollY: 0,
    }
  },
  props: {
    songs: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selectItem(index) {
      this.set_play({list: this.songs, index})
    },
    ...mapActions(['set_play', 'randomPlay']),
    startRandomPlay() {
      console.log('music list start random')
      this.randomPlay({list: this.songs})
    },
    handlePlaylist(list) {
      let bottom = list.length ? '80px': ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    }
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    },
    ...mapGetters(['singer'])
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.maxHeight = this.imageHeight - REMAIN_HEIGHT
    this.$refs.list.$el.style.top = this.$refs.bgImage.clientHeight + 'px'
  },
  watch: {
    scrollY(y) {
      let height = Math.max(-this.maxHeight, y)
      let zindex = 0
      this.$refs.bgLayer.style[TRANSFORM] = `translateY(${y}px)`
      let percent = 1
      if (y > 0) {
        percent = 1 + y/this.imageHeight
        this.$refs.bgImage.style[TRANSFORM] = `scale(${percent})`
        zindex = 10
      }
      if (height > -this.maxHeight) {
        zindex = 0
        this.$refs.bgImage.style.height = '0px'
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.playBtn.style.display= ''
      } else {
        zindex = 10
        this.$refs.bgImage.style.height = REMAIN_HEIGHT + 'px'
        this.$refs.bgImage.style.paddingTop = '0px'
        this.$refs.playBtn.style.display= 'none'
      }
      this.$refs.bgImage.style.zIndex = zindex
    }
  },
  created() {
  },
  components: {
    Scroll,
    SongList,
    Loading,
  },
  mixins: [playlistMixin,]
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.music-list
  position: absolute
  left: 0
  top: 0
  bottom: 0px
  right: 0
  overflow: hidden


  .back
    position: absolute
    left: 10px
    top: 6px
    font-size: $font-size-large
    color: $color-theme
    z-index: 60
  .singer-name
    position: absolute
    width: 80%
    height: 30px
    line-height: 30px
    display: block
    left: 0
    top: 0
    margin: 0 10%
    z-index: 50
    text-align: center
    color: $color-text-l
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    .filter
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      background-color: rgba(7,17,27,0.3)
    .play-btn
      position: absolute
      left: 50%
      bottom: 15px
      transform: translatex(-50%)
      font-size: $font-size-small
      color: $color-theme
      line-height: 13px
      padding: 3px 10px
      border: 1px solid
      border-radius: 12px
      .icon-play-mini
        display: inline-block
        margin-right: 5px
      .play-text
        display: inline-block

  .bg-layer
    background-color: $color-background
    width: 100%
    height: 150%
  .list
    position: fixed
    left: 0
    top: 0
    width: 100%

    bottom: 0
    overflow: visible
    paddin-bottom: 40px
    .loading-wrapper
      position: relative
      width: 100%
      height: 300px
      .loading
        position: absolute
        top: 50%
        transform: translatey(-50%)
</style>
