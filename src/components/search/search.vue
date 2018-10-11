<template>
<div class="search" ref="search">
  <div class="sear-box-wrapper">
    <search-box ref="searchBox" @queryChange="queryChange">
    </search-box>
  </div>
  <scroll class="short-cut" :data="scrollDate" ref="shortcut"
          v-if="!this.query"
  >
    <div class="shot-cut-wrapper">
      <div class="hotkey"  >
        <h1 class="hotkey-title">热门搜索</h1>
        <ul>
          <li v-for="item in hotkey" class="hotkey-item "
              @click="addSearch(item.k)"
          >
            {{item.k}}
          </li>
        </ul>
      </div>
      <div class="search-history" >
        <div class="search-history-title" >
          <h1 class="title-text">搜索历史</h1>
          <i class="icon-clear" @click="clearSearchConfirm"></i>
        </div>
        <search-list :list="searchHistory" @selectItem="addSearch"
                     @deleteItem="deleteSearchAction"
                      ref="searchList"
        >
        </search-list>
      </div>
    </div>
  </scroll>
  <div class="suggest-wrapper" v-if="this.query" ref="suggestWrapper">
    <suggest :query="query" @selectItem="selectItem"
             @beforeScroll="onBeforeScroll"
             ref="suggest"
    >
    </suggest>
  </div>
  <confirm text="确认删除" ref="confirm" @confirmClick="clearSearchAction">
  </confirm>
  <router-view></router-view>
</div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from '../../base/searchBox/searchBox.vue'
  import {getHotkey} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  import Suggest from '../../base/suggest/suggest.vue'
  import {mapMutations, mapActions, mapGetters} from 'vuex'
  import SearchList from '../../base/searchList/searchList.vue'
  import Confirm from '../../base/confirm/confirm.vue'
  import Scroll from '../../base/scroll/scroll.vue'
  import {playlistMixin} from '../../common/js/mixin'
export default {
  data(){
    return {
      hotkey: [],
      query: '',
    }
  },
  methods: {
    _getHotkey() {
      getHotkey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    addSearch(k) {
      this.$refs.searchBox.addSearch(k)
    },
    queryChange(newVal) {
      this.query = newVal
    },
    selectItem() {
      this.addSearchAction(this.query)
    },
    onBeforeScroll() {
      this.$refs.searchBox.inputBlur()
    },

    clearSearchConfirm() {
      this.$refs.confirm.show()
    },
    ...mapActions([
      'addSearchAction',
      'deleteSearchAction',
      'clearSearchAction',
    ]),
    handlePlaylist(list) {
      let bottom = list.length > 0 ? '60px': '0'
      this.$refs.search.style.bottom = bottom

      this.$refs.shortcut ? this.$refs.shortcut.refresh() : ''

//      this.$refs.suggestWrapper.style.bottom = bottom
      this.$refs.suggest ? this.$refs.suggest.refresh() : ''
    }
  },
  computed: {
    ...mapGetters(['searchHistory']),
    scrollDate() {
      return this.hotkey.concat(this.searchHistory)
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll,
  },
  watch: {
    query(newVal) {
      if (!newVal) {
        console.log('scroll')
        this.$nextTick(() => {
          this.$refs.shortcut.refresh()
        })
      }
    }
  },
  created() {
    this._getHotkey()
  },
  mixins: [playlistMixin,]
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.search
  position: fixed
  left:0
  top: 88px
  width: 100%
  bottom: 0
  .sear-box-wrapper
    position: relative
    margin-bottom: 10px
  .short-cut
    position: relative
    bottom: 0
    height: 100%
    overflow: hidden
    .hotkey
      position: relative
      margin: 20px

      .hotkey-title
        font-size: $font-size-medium
        color: $color-text-d
        margin: 0 0 5px 0
      .hotkey-item
        font-size: $font-size-medium
        background-color: $color-highlight-background
        padding: 8px 10px
        display: inline-block
        margin: 5px 6px 5px 0
        border-radius: 4px
        color: $color-text-l
    .search-history
      margin-top: 15px
      .search-history-title
        display: flex
        align-items: center
        .title-text
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          margin: 0 0 5px 20px
        .icon-clear
          color: $color-text-d
          font-size: $font-size-small
          flex: 0 0 12px
          width: 12px
          text-align: center
          margin-right: 20px
  .suggest-wrapper
    position: relative
    height: 100%
</style>
