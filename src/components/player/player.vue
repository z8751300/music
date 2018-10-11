<template>
  <div class="player" v-if="playlist &&playlist.length">
    <transition name="normal">
    <div class="normal" v-if="fullScrean">
      <div class="bg" >
        <img :src="currentSong.image" >
      </div>
      <i class="icon-back" @click="toggle"></i>
      <div class="singer-name">{{currentSong.singer}}</div>
      <div class="song-name">{{currentSong.album}}.{{currentSong.name}}</div>
      <div class="middle" @touchstart.prevent="middleTouchstart"
                          @touchmove.prevent="middleTouchmove"
                          @touchend="middleTouchend"
      >
        <div class="middle-left" ref="cd">
          <div class="cd">
            <img :src="currentSong.image" :class="cdCls">
          </div>
          <div class="lyric-text" v-if="lyricText">
            {{lyricText}}
          </div>
        </div>
        <div class="middle-right" ref="lyric">
          <div class="lyric" v-if="currentLyric">
            <scroll class="lyric-wrapper" :data="currentLyric && currentLyric.lines"
                    ref="scroll"
            >
              <ul>
                <li v-for="(line, index) in currentLyric.lines"
                    :class="{active: currentLine === index}"
                    class="lyric-line" ref="lyricLine"
                >
                  {{line.txt}}
                </li>
              </ul>
            </scroll>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="dots">
          <span class="dot" :class="{active: currentPage === 'cd'}"></span>
          <span class="dot" :class="{active: currentPage === 'lyric'}"></span>
        </div>
        <div class="progress-bar-warpper">
          <div class="time time-l">
            {{durationTime}}
          </div>
          <progress-bar class="progress" :percent="persent"
                        @percentChange="percentChange"
          >
          </progress-bar>
          <div class="time time-r">
            {{totalTime}}
          </div>
        </div>
        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i :class="modeCls"></i>
          </div>
          <div class="icon i-left" @click="prev">
            <i  class="icon-prev" :class="disableCls"></i>
          </div>
          <div class="icon i-center" @click="togglePlay">
            <i :class="playCls" ></i>
          </div>
          <div class="icon i-right" @click="next" >
            <i class="icon-next" :class="disableCls"></i>
          </div>
          <div class="icon i-right" @click="toggleFav">
            <i :class="favCls()" ></i>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
    <div class="mini" v-show="!fullScrean" @click="toggle" >
      <div class="mini-icon">
        <img  width="40" height="40" :src="currentSong.image"
              :class="cdCls"
        >
      </div>
      <div class="text">
        <h2 class="name" >{{currentSong.singer}}</h2>
        <p class="desc" >{{currentSong.name}}</p>
      </div>
      <div class="control" @click.stop="togglePlay">
        <i :class="miniPlayCls" ></i>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
    </div>
    </transition>
    <audio :src="currentSong.url" ref="audio"
           @play="ready" @error="error"
           @timeupdate="updateTime"
           @ended="end"
    >
    </audio>
    <playlist ref="playlist"></playlist>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import ProgressBar from '../../base/progress/progress-bar.vue'
  import {mode} from '../../common/js/config'
  import Lyric from 'lyric-parser'
  import Scroll from '../../base/scroll/scroll.vue'
  import {profix} from '../../common/js/dom'
  import Playlist from '../../base/playlist/playlist.vue'
  const TRANSFORM = profix('transform')
  const DURATION = profix('transitionDuration')
export default {
  data(){
    return {
      isReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLine: 0,
      currentPage: 'cd',
      lyricText: '',
    }
  },
  methods: {
    toggle() {
      this.setFullScrean(!this.fullScrean)
    },
    toggleFav() {
      this.isFav() ? this.deleteFavoriteAction(this.currentSong) :
        this.addFavoriteAction(this.currentSong)
    },
    isFav() {
      let index = this.favoriteHistory.findIndex((item) => {
        return item.id == this.currentSong.id
      })
      return index > -1
    },
    favCls() {
      return this.isFav() ? 'icon-favorite' : 'icon-not-favorite'
    },
    ...mapMutations({
      setFullScrean: 'SET_FULL_SCREAN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
    }),
    ...mapActions([
      'changePlayMode',
      'addPlayAction',
      'addFavoriteAction',
      'deleteFavoriteAction',
    ]),
    togglePlay() {
      this.setPlayingState(!this.playingState)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    prev() {
      if (!this.isReady) { return }
      if (this.playlist.length === 1) {
        this._loop()
        return
      }
      let i = this.currentIndex
      i -= 1
      if (i <= -1) {
        i = this.playlist.length -1
      }
      this.setCurrentIndex(i)
      if (!this.playingState) {
        this.togglePlay()
      }
      this.isReady = false
    },
    next() {
      if (!this.isReady) { return }
      if (this.playlist.length === 1) {
        this._loop()
        return
      }
      let i = this.currentIndex
      i += 1
      if (i >= this.playlist.length ) {
        i = 0
      }
      this.setCurrentIndex(i)
      if (!this.playingState) {
        this.togglePlay()
      }
      this.isReady = false
    },
    ready() {
      this.isReady = true
      this.addPlayAction(this.currentSong)
    },
    error() {
      this.isReady = true
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime | 0
    },
    formatTime(t) {
      let m = t / 60 | 0
      let s = t % 60
      return m + ':' + this._pad(s)
    },
    _pad(num, n=2) {
      let len = num.toString().length + 1
      while (len <= n) {
        num = '0' + num
        len += 1
      }
      return num
    },
    percentChange(percent) {
      let time = percent*this.currentSong.duration
      this.$refs.audio.currentTime= time
      if (this.currentLyric) {
        this.currentLyric.seek(time*1000)
      }
    },
    changeMode() {
      this.setPlayMode((this.playMode + 1) % 3)
      this.changePlayMode({song: this.currentSong})
    },
    _loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    end() {
      if (this.playMode === mode.loop) {
        this._loop()
      } else {
        this.next()
      }
    },
    getLyric() {
      this.currentSong.getLyric().then((res) => {
        if (!res) { return }
        this.currentLyric = new Lyric(res, this.handleLyric)
        if (this.playingState) {
          this.currentLyric.play()
        }
      })
    },
    handleLyric({txt, lineNum}) {
      if (!this.$refs.scroll) { return }
      this.currentLine = lineNum
      let els = this.$refs.lyricLine
      let line = lineNum - 5
      this.lyricText = txt
      if (lineNum <= 5) {
        this.$refs.scroll.scrollTo(0, 0, 300)
      } else {
        this.$refs.scroll.scrollToElement(els[line], 300)
      }
    },
    middleTouchstart(e) {
      this.touch.touchX = e.touches[0].pageX
      this.touch.touchY = e.touches[0].pageY
      this.touch.initialed = true
    },
    middleTouchmove(e) {
      if (!this.touch.initialed) {return}
      let deltaX = e.touches[0].pageX - this.touch.touchX
      let deltaY = e.touches[0].pageY - this.touch.touchY
      if (Math.abs(deltaY) > Math.abs(deltaX)) { return }
      let left = this.currentPage === 'cd' ? 0 : -window.innerWidth
      let offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth) / window.innerWidth
      this.$refs.lyric.style[TRANSFORM] = `translatex(${offsetWidth}px)`
      this.$refs.lyric.style[DURATION] = '0'
      this.$refs.cd.style.opacity = 1- this.touch.percent + ''
      this.$refs.cd.style[DURATION] = '0'
    },
    middleTouchend() {
      const time = 300
      this.touch.initialed = false
      let offsetWidth
      let opacity
      if (this.currentPage === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          this.currentPage = 'lyric'
          opacity = 0
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentPage = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyric.style[TRANSFORM] = `translatex(${offsetWidth}px)`
      this.$refs.lyric.style[DURATION] = `${time}ms`
      this.$refs.cd.style.opacity = opacity + ''
      this.$refs.cd.style[DURATION] = '${time}ms'
    },
    showPlaylist() {
      this.$refs.playlist.show()
    }
  },
  computed: {
    ...mapGetters([
      'fullScrean',
      'playlist',
      'currentSong',
      'playingState',
      'currentIndex',
      'playMode',
      'favoriteHistory',
    ]),

    playCls() {
      return this.playingState ? 'icon-pause': 'icon-play'
    },
    miniPlayCls() {
      return this.playingState ? 'icon-play-mini': 'icon-pause-mini'
    },
    cdCls() {
      return this.playingState ? 'playing' : 'playing pause'
    },
    disableCls() {
      return this.isReady ? '': 'disable'
    },
    durationTime() {
      return this.formatTime(this.currentTime)
    },
    totalTime() {
      return this.formatTime(this.currentSong.duration)
    },
    persent() {
      return this.currentTime / this.currentSong.duration
    },
    modeCls() {
      return this.playMode === mode.random ? 'icon-random': this.playMode === mode.loop ? 'icon-loop': 'icon-sequence'
    }
  },
  watch: {
    playingState(newState) {
      this.$nextTick(() => {
        let audio = this.$refs.audio
        newState ? audio.play() : audio.pause()
      })
    },
    currentSong(newValue, oldValue) {
      if (newValue && newValue != oldValue) {
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        this.$nextTick(() => {
          let audio = this.$refs.audio
          audio.play()
          this.getLyric()
        })
      }
    }
  },
  components: {
    ProgressBar,
    Scroll,
    Playlist,
  },
  created() {
    this.touch = {}
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import '../../common/stylus/variable.styl'
  @import "../../common/stylus/mixin.styl"
.player
  .normal
    position: fixed
    left: 0
    top: 0
    width: 100%
    height:100%
    z-index: 300
    background-color: $color-background
    &.normal-enter-active, &.normal-leave-active
      transition: all .3s
      .singer-name, .song-name
        transition: all .3s
      .bottom
        transition: all .3s
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .singer-name, .song-name
        transform: translatey(-100%)
      .bottom
        transform: translatey(100%)
    .bg
      width: 100%
      height: 100%
      position: fixed
      left: 0
      top: 0
      z-index: -1
      filter: blur(20px)
      img
        width: 100%
        height: 100%
    .icon-back
      position: absolute
      left: 10px
      top: 10px
      font-size: $font-size-large
      color: $color-theme
      transform: rotate(270deg)
    .singer-name, .song-name
      width: 80%
      margin-left: 10%
      text-align: center
      line-height: 20px
      font-size: $font-size-medium
      color:$color-text-l
      margin-top: 10px
    .middle
      position: relative
      white-space: nowrap
      overflow: hidden
      .middle-left
        position: relative
        margin-top: 20px
        width: 100%
        height: 0
        padding-top: 100%
        display: inline-block
        .cd
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          box-sizing: border-box
          border-radius: 50%
          padding: 20px
          img
            width: 100%
            height: 100%
            box-sizing: border-box
            border-radius: 50%
            border: 5px solid $color-text-d
            box-shadow: $color-text-d 0 0 3px 3px
            &.playing
              animation: rotate 20s linear infinite
            &.pause
              animation-play-state: paused
        .lyric-text
          line-height: 30px
          height: 30px
          font-size: $font-size-medium
          text-align: center
          color: $color-text-l
      .middle-right
        display: inline-block
        position: relative
        margin-top: 20px
        width: 100%
        height: 0
        padding-top: 100%
        padding-bottom: 10%

        .lyric
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          overflow: hidden
          text-align: center
          no-wrap()
          line-height: 35px
          color: $color-text-l
          .lyric-line
            &.active
              color: $color-text-ll
    .bottom
      position: fixed
      bottom: 70px
      left: 0
      width: 100%
      height: 40px
      text-align: center
      .dots
        text-align: center
        margin-bottom: 15px
        .dot
          display: inline-block
          width: 10px
          height: 10px
          background-color: $color-text-d
          margin-right: 5px
          border-radius: 5px
          &.active
            width: 20px
            color: $color-text-ll
      .progress-bar-warpper
        margin: 10px auto
        width: 80%
        display: flex
        align-items: center
        .time
          flex: 0 0 40px
          width: 40px
        .time-l
          margin-right: 10px
        .time-r
          margin-left: 10px
        .progress-bar
          flex: 1
      .operators
        width: 94%
        margin: 0 auto
        display: flex
        line-height: 40px
        color: $color-theme
        .icon
          flex: 1
          font-size: 25px
        .i-center
          font-size: 30px
        .icon-prev, .icon-next
          &.disable
            color: $color-text-l
        .icon-favorite
          color: #FF7425
  .mini
    z-index: 400
    position: fixed
    left: 0
    bottom: 0
    height: 50px
    width: 100%
    display: flex
    text-align: center
    color:$color-text-l
    background-color: $color-highlight-background
    line-height: 50px
    .mini-icon
      flex: 0 0 40px
      width: 40px
      margin: 5px 10px
      img
        border-radius: 50%
        &.playing
          animation: rotate 20s linear infinite
        &.pause
          animation-play-state: paused
    .control
      flex: 0 0 22px
      width: 22px
      margin: 0 10px
      color: $color-theme
      font-size: $font-size-large-x
    .text
      flex: 1
      text-align: left

      display: flex
      flex-direction: column
      font-size: $font-size-small
      .name, .desc
        flex: 1
        line-height: 25px

  @keyframes rotate
    0%
      transform: rotate(0deg)
    100%
      transform: rotate(360deg)
</style>
