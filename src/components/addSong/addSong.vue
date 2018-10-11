<template>
  <transition name="slide">
  <div class="add-song" @click.stop v-if="showFlag">
    <div class="add-song-header">
      <div class="add-song-title">添加歌曲</div>
      <i class="icon-delete" @click="hide"></i>
    </div>
    <div class="search-box-wrapper">
      <search-box placeholder="搜索歌曲" ref="searchBox"
                  @queryChange="queryChange"
      >
      </search-box>
    </div>
    <div class="shortcut" v-if="!query">
      <switcher :list="list" @switchChange="switchChange"
                :currentIndex="currentIndex" class="switch"
      >
      </switcher>
      <scroll  ref="songList" v-show="currentIndex === 1"
              class="scroll-list" :data="playHistory"

      >
        <song-list :songs="playHistory" @selectItem="addSong">
        </song-list>
      </scroll>
      <scroll v-show="currentIndex === 0" ref="searchList"
              class="scroll-list" :data="searchHistory"
      >
        <search-list :list="searchHistory"
                     @selectItem=addQuery
                     @deleteItem="deleteSearchAction"
        >
        </search-list>
      </scroll>
    </div>
    <div class="search-result" v-if="query">
      <suggest :query="query" :showSinger=false
               @selectItem="selectItem"
             @beforeScroll="onBeforeScroll"
             ref="suggest"
      >
      </suggest>
    </div>
    <top-tip ref="tip" text="添加成功"></top-tip>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from '../../base/searchBox/searchBox.vue'
  import Suggest from '../../base/suggest/suggest.vue'
  import {searchMixin} from '../../common/js/mixin'
  import Switcher from '../../base/switch/switch.vue'
  import Scroll from '../../base/scroll/scroll.vue'
  import SongList from '../../base/songList/songList.vue'
  import {mapGetters, mapActions} from 'vuex'
  import SearchList from '../../base/searchList/searchList.vue'
  import Song from '../../common/js/song'
  import TopTip from '../../base/topTip/topTip.vue'
export default {
  data(){
    return {
      showFlag: false,
      currentIndex: 0,
      list: ['搜索历史', '播放历史'],
      query: '',
    }
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        if (this.currentIndex === 0) {
          console.log('searchlist refresh')
          this.$refs.searchList.refresh()
        } else {
          this.$refs.songList.refresh()
          console.log('songlist refresh')
        }
      },20)
    },
    hide() {
      this.showFlag = false
    },
    switchChange(index) {
      this.currentIndex = index
    },
    addSong(index) {
      let song = this.playHistory[index]
      song = new Song(song)
      this.insertPlay(song)
      this.$refs.tip.show()
    },
    ...mapActions([
      'insertPlay',
      'deleteSearchAction'
    ]),
    addQuery(item) {
      this.$refs.searchBox.addSearch(item)
    },
    deleteItem(item) {

    }
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'searchHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    Switcher,
    Scroll,
    SongList,
    SearchList,
    TopTip,
  },
  watch: {
    currentIndex(v) {
      console.log(v)
      setTimeout(() => {
        if (this.currentIndex === 0) {
          console.log('searchlist refresh')
          this.$refs.searchList.refresh()
        } else {
          this.$refs.songList.refresh()
          console.log('songlist refresh')
        }
      },20)
    }
  },
  mixins:[searchMixin,]
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.add-song
  position: fixed
  left: 0
  top: 0
  width: 100%
  height: 100%
  background-color: $color-background
  z-index: 800
  &.slide-enter-active, &.slide-leave-active
    transition: all .3s
  &.slide-enter, &.slide-leave-to
    transform: translateX(100%)
  .add-song-header
    height: 40px
    line-height: 40px
    position: relative
    text-align: center
    color: $color-text-l
    .icon-delete
      position: absolute
      right: 0
      top: 0
      display: block
      padding: 10px
      font-size: 20px
      color: $color-theme
  .shortcut
    margin-top: 15px
    .switch
      margin-bottom: 10px
    .scroll-list
      position: absolute
      left: 0
      top: 140px
      width: 100%
      bottom: 0
      overflow: hidden
</style>
