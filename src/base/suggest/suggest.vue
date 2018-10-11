<template>
  <scroll class="suggest" :data="songs" :pullUpload=true
          @scrollToEnd="getUpload" :beforeScroll=true
          @onBeforeScrollStart="onBeforeScrollStart"
          ref="scroll"
  >
    <ul class="suggest-list" >
      <li v-for="item in songs" class="suggest-item"
          @click="selectItem(item)"
      >
        <div class="pic">
          <i :class="iconCls(item)" class="icon"></i>
        </div>
        <div class="name">
          <h2 v-html="showName(item)" class="suggest-name"></h2>
        </div>
      </li>
      <loading v-if="hasMore" class="loading"></loading>
    </ul>
    <div class="no-result-wrapper" v-if="!hasMore && !songs.length">
      <no-result text="抱歉，没有搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {getSearch} from '../../api/search'
  import {ERR_OK} from '../../api/config'
  import {getMusic} from '../../api/singers'
  import {createSong} from '../../common/js/song'
  import Scroll from '../../base/scroll/scroll.vue'
  import Loading from '../../base/loading/loading.vue'
  import NoResult from '../../base/noResult/noResult.vue'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from '../../common/js/singer'
  const TYPE_SINGER = 'singer'
  const PER_PAGE = 20
export default {
  data(){
    return {
      page: 1,
      songs: [],
      hasMore: true,
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    _getSearch() {
      console.log('getSearch')
      this.page = 1
      this.hasMore = true
      return getSearch(this.query, this.showSinger, this.page, PER_PAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.checkMore(res.data.song)
          return new Promise((resolve, reject) => {
            if (res.data.zhida && res.data.zhida.singerid) {
              this.songs.push(this._normalizeSearch(res.data.zhida))
            }
            this._normalizeSongs(res.data.song.list, resolve)
          })
        }
        return Promise.reject()
      })
    },
    uploadData() {
      return getSearch(this.query, false, ++this.page).then((res) => {
        if (res.code === ERR_OK) {
          this.checkMore(res.data.song)
          return new Promise((resolve, reject) => {
            this._normalizeSongs(res.data.song.list, resolve)
          })
        }
        return Promise.reject()
      })
    },
    getUpload() {
      if (!this.hasMore) {
        return
      }
      console.log('getUpload')
      this.uploadData().then((res) => {
        this.songs = this.songs.concat(res)
      })
    },
    checkMore(res) {
      const {list, curnum, curpage, totalnum} = res
      if (list.length === 0 || curnum*curpage + 350 >= totalnum) {
        return this.hasMore = false
      }
      this.hasMore = true
    },
    _normalizeSearch(zhida) {
      return ({...zhida, ...{type: TYPE_SINGER}})
    },
    async _normalizeSongs(list, resolve) {
      let ret = []
      let arr = []
      let result = []
      let temp
      let t
      list.forEach((item) => {
        if (item.songid && item.albummid) {
          temp = getMusic(item.songmid)
          arr.push(temp)
          ret.push(item)
        }
      })
      t = await Promise.all(arr)
      t.forEach((item, index) => {
        if (item.code === 0) {
          const svley = item.data.items
          const songVkey = svley[0].vkey
          result.push(createSong(ret[index], songVkey))
        }
      })
      return resolve(result)
    },
    iconCls(item) {
      if (item.type && item.type === TYPE_SINGER) {
        return 'icon-mine'
      }
      return 'icon-music'
    },
    showName(item) {
      if (item.type && item.type === TYPE_SINGER) {
        return item.singername
      }
      return `${item.name} - ${item.album}`
    },
    selectItem(item) {
      if (item.type && item.type === TYPE_SINGER) {
        let singer = new Singer({
          mid: item.singermid,
          name: item.singername
        })
        this.setSinger(singer)
        this.$router.push({
          path: `/search/${singer.id}`
        })
      } else {
        console.log(item)
        this.insertPlay(item)
      }
      this.$emit('selectItem')
      return
    },
    onBeforeScrollStart() {
      this.$emit('beforeScroll')
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertPlay']),
    refresh() {
      this.$refs.scroll.refresh()
    },
  },

  async created() {
//    const t = await this._getSearch()
//    console.log(t)
//    this.songs = this.songs.concat(t)
//    console.log(this.songs)
    this._getSearch().then((res) => {
      this.songs = this.songs.concat(res)
    })
  },
  components: {
    Scroll,
    Loading,
    NoResult,
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
.suggest
  height: 100%
  overflow: hidden
  .suggest-list
    .suggest-item
      display: flex
      heiht: 30px
      line-height: 30px
      &:last-child
        padding-bottom: 50px
      .pic
        flex: 0 0 20px
        width: 20px
        margin: 0 10px
        text-align: center
        .cion
          width: 100%
          height: 100%
      .name
        flex: 1
        height: 30px
        line-height: 30px
        no-wrap()
        font-size: $font-size-small
        color: $color-text-l
        margin-right: 20px
        .suggest-name
          no-wrap()
    .loading
      padding-bottom: 50px
  .no-result-wrapper
    position: absolute
    width: 100%
    top: 30%
    transform: translateY(-50%)
</style>
