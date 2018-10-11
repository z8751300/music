<template>
  <transition name="slide">
  <div class="playlist" v-if="showFlag" @click="hide">
    <div class="playlist-wrapper" @click.stop>
      <div class="playlist-header">
        <div class="playlist-title">
          <span class="mode-icon" @click="changeMode">
            <i class="icon" :class="modeCls"></i>
          </span>
          <span class="title-text" v-html="modeText"></span>
          <i class="icon-clear" @click="showConfirm"></i>
        </div>
        <scroll class="playlist-content" :data="sequenceList"
                ref="scroll"
        >
          <transition-group tag="ul" name="slide"
                            class="playlist-list">
            <li v-for="(item, index) in sequenceList" class="playlist-item"
                ref="playlistItem"
                @click.stop="selectItem(item)"
                :key="item.id"
            >
              <i :class="currentCls(item)" class="current"></i>
              <span class="song-name">{{item.name}}</span>
              <i class="icon-delete" @click.stop="deleteOne(item,index)"></i>
              <i :class="favCls(item)" class="fav"
                 @click.stop="toggleFav(item)"
              >
              </i>
            </li>
          </transition-group>
        </scroll>
        <div class="operator"  @click.stop="addSong">
          <span class="operator-warpper">
            <i class="icon-add"></i>
            <h2 class="operator-text">添加到播放列表</h2>
          </span>
        </div>

      </div>
      <div class="playlist-bottom" @click="hide">
        关闭
      </div>
    </div>
    <confirm text="确认清除播放列表？" @confirmClick="clearSongList"
             ref="confirm"
    >
    </confirm>
    <add-song ref="addSong"></add-song>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import Scroll from '../../base/scroll/scroll.vue'
  import {mode} from '../../common/js/config'
  import Confirm from '../../base/confirm/confirm.vue'
  import {modeMixin} from '../../common/js/mixin'
  import AddSong from '../../components/addSong/addSong.vue'
export default {
  data(){
    return {
      showFlag: false,
    }
  },
  mixins:[modeMixin,],
  methods: {
    show() {
      this.showFlag = true
      this.$nextTick(() => {
        this.scrollToCurrent()
      })
    },
    hide() {
      this.showFlag = false
    },
    toggleShow() {
      this.showFlag = !this.showFlag
    },
    currentCls(item) {
      return item.id == this.currentSong.id ? 'icon-play-mini' : ''
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
    }),
    ...mapActions([
      'deleteItem',
      'clearSongList',
    ]),
    scrollToCurrent() {
      let cIndex = this.sequenceList.findIndex((item) => {
        return item.id == this.currentSong.id
      })
      let elm = this.$refs.playlistItem[cIndex]
      this.$nextTick(() => {
        this.$refs.scroll.scrollToElement(elm, 300)
      })
    },
    selectItem(item, index) {
      console.log('select item')
      if (this.playMode === mode.random) {
        index = this.playlist.findIndex((one) => {
          return one.id === item.id
        })
      } else {
        index = this.sequenceList.findIndex((one) => {
          return one.id === item.id
        })
      }
      this.setCurrentIndex(index)
      if (!this.playingState) {
        this.setPlayingState(true)
      }
      this.scrollToCurrent()
    },
    deleteOne(item, index) {
        this.deleteItem({item, index})
        if (!this.sequenceList.length) {
          this.hide()
        }
    },
    clearPlaylist() {
      console.log('clear')
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    addSong() {
      this.$refs.addSong.show()
    },
  },
  computed: {
    ...mapGetters([
        'sequenceList',
        'playlist',
        'currentIndex',
        'currentSong',
        'playMode',
        'playingState',
      ]
    ),
    modeText() {
      return this.playMode === mode.random ? '随机播放':
        this.playMode === mode.sequence ? '顺序播放': '单曲循环'
    }
  },
  watch: {

    currentSong(newVal, oldVal) {
      if (!this.showFlag || !newVal || newVal.id !== oldVal.id) {
        return
      }
      this.scrollToCurrent()
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong,
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
.playlist
  position: fixed
  left: 0
  top: 0
  bottom: 0
  right: 0
  background-color: $color-background-d
  z-index: 600
  &.slide-enter-active, &.slide-leave-active
    opacity: 0.6
    transition: all .3s
    .playlist-wrapper
      transform: translatey(0)
      transition: all .3s
  &.slide-enter, &.slide-leave-to
    opacity: 0
    .playlist-wrapper
      transform: translatey(100%)
  .playlist-wrapper
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    max-height: 400px
    min-height: 200px
    overflow: hidden
    background-color: $color-dialog-background
    color: $color-text-l
    .playlist-header
      .playlist-title
        line-height: 40px
        height: 40px
        display: flex
        align-items: center
        .mode-icon
          flex: 0 0 22px
          width: 22px
          margin-left: 10px
          heith: 40px
          line-height: 40px
          .icon
            font-size: $font-size-large-x
            line-height: 40px
            color: $color-theme
        .title-text
          flex: 1
          margin-left: 10px
        .icon-clear
          flex: 0 0 18px
          width: 18px
          margin-right: 10px
          font-size: $font-size-small-s
          color: $color-text-d
      .playlist-content
        min-height: 160px
        max-height: 270px
        overflow: hidden
        .playlist-item
          height: 30px
          line-height: 30px
          font-size: $font-size-medium
          color: $color-text-l
          display: flex
          align-items: center
          &.slide-enter-active, &.slide-leave-active
            transition: all .4s ease
          &.slide-enter, &.slide-leave-to
            height: 0
            opacity: 0
          .current
            flex: 0 0 18px
            width: 18px
            font-size: $font-size-medium
            color: $color-theme
            margin: 0 5px 0 10px
          .song-name
            flex: 1
            no-wrap()
          .icon-delete
            font-size: $font-size-small
            color: $color-text-d
            flex: 0 0 12px
            width: 12px
            margin-right: 10px
          .fav
            &.icon-favorite
              color: #FF7425
            font-size: $font-size-small
            color: $color-text-d
            flex: 0 0 12px
            width: 12px
            margin-right: 20px
      .operator
        font-size: $font-size-small
        color: $color-text-ll
        height: 40px
        line-height: 40px
        text-align: center
        .operator-warpper
          border: 1px solid $color-text-l
          padding: 4px 10px
          border-radius: 12px
          .icon-add
            display: inline-block
            margin-right: 5px
          .operator-text
            display: inline-block

    .playlist-bottom
      height: 40px
      line-height: 40px
      background-color: $color-background
      text-align: center
      font-size: $font-size-large


</style>
