<template>
  <transition name="slide">
  <div class="user-center" ref="userCenter" >
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="switch-wrapper">
      <switcher :list="['播放历史', '收藏历史']"
                @switchChange="switchChange"
                :currentIndex="currentIndex"
      >
      </switcher>
    </div>
    <div class="operator"  @click.stop="addSong">
      <span class="operator-warpper" >
        <i class="icon-add"></i>
        <h2 class="operator-text">添加到播放列表</h2>
      </span>
    </div>
    <div class="list-wrapper">
      <scroll  ref="songList" v-show="currentIndex === 0"
               class="scroll-list" :data="playHistory"
      >
        <song-list :songs="playHistory" @selectItem="selectItem" >
        </song-list>
      </scroll>
      <scroll  ref="favList" v-show="currentIndex === 1"
               class="scroll-list" :data="favoriteHistory"
      >
        <song-list :songs="favoriteHistory" @selectItem="selectItem">
        </song-list>
      </scroll>
      <div class="no-result-wrapper"
           v-if="currentIndex===0 && playHistory.length ===0 ||
                 currentIndex===1 && favoriteHistory.length ===0">
        <no-result></no-result>
      </div>
    </div>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switcher from '../../base/switch/switch.vue'
  import Scroll from '../../base/scroll/scroll.vue'
  import SongList from '../../base/songList/songList.vue'
  import {mapGetters, mapActions} from 'vuex'
  import Song from '../../common/js/song'
  import {playlistMixin} from '../../common/js/mixin'
  import NoResult from '../../base/noResult/noResult.vue'

export default {
  data(){
    return {
      currentIndex: 1,
    }
  },
  methods: {
    switchChange(index) {
      this.currentIndex = index
    },
    back() {
      this.$router.back()
    },
    selectItem(index) {
      if (this.currentIndex === 0) {
        this.insertPlay(new Song(this.playHistory[index]))
      } else {
        this.insertPlay(new Song(this.favoriteHistory[index]))
      }
    },
    ...mapActions([
      'insertPlay',
      'set_play',
    ]),
    addSong() {
      let arr
      if (this.currentIndex === 0) {
        arr = this.playHistory.map((item) => {
          return new Song(item)
        })
      } else {
        arr = this.favoriteHistory.map((item) => {
          return new Song(item)
        })
      }
      console.log(arr)
      this.set_play({list: arr, index: 0})
    },
    handlePlaylist(list) {
      let bottom = list.length > 0 ? '60px': '0'
      this.$refs.userCenter.style.bottom = bottom
      this.$refs.songList && this.$refs.songList.refresh()
      this.$refs.favList && this.$refs.favList.refresh()
    }
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'favoriteHistory',
    ]),

  },
  watch: {
    currentIndex(index) {
      console.log(index)
      this.$nextTick(() => {
        index === 0 ? this.$refs.songList.refresh()
          : this.$refs.favList.refresh()
      })
    }
  },
  components: {
    Switcher,
    Scroll,
    SongList,
    NoResult,
  },
  mixins: [playlistMixin, ]
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.user-center
  position: fixed
  left: 0
  top: 0
  right: 0
  bottom: 0
  background-color: $color-background
  &.slide-enter-active, &.slide-leave-active
    transition: all .3s ease
  &.slide-enter, &.slide-leave-to
    transform: translateX(100%)
  .back
    position: absolute
    left: 10px
    top: 19px
    font-size: $font-size-large
    color: $color-theme
  .switch-wrapper
    margin: 10px
  .operator
    font-size: $font-size-small
    color: $color-text-ll
    height: 40px
    line-height: 40px
    text-align: center
    .operator-warpper
      border: 1px solid $color-text-l
      padding: 6px 10px
      border-radius: 14px
      .icon-add
        display: inline-block
        margin-right: 5px
      .operator-text
        display: inline-block

  .list-wrapper
    position: relative
    height: 100%
    .scroll-list
      height: 100%
      overflow: hidden
      .list-item
        &:last-child
          padding-bottom: 120px
    .no-result-wrapper
      position: absolute
      left:  0
      top: 50%
      width: 100%
      transform: translateY(-50%)
</style>
