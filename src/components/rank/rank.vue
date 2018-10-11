<template>
  <div class="rank" ref="rank">
    <scroll class="rank-content" :data="topList" ref="topList">
      <ul>
        <li v-for="item in topList" class="rank-item"
            @click="selectItem(item)"
        >

          <div class="pic">
            <img v-lazy="item.picUrl" >
          </div>
          <div class="text">
            <div class="title">{{item.topTitle}}</div>
            <div class="song-list">{{listFilter(item.songList)}}</div>
          </div>
        </li>
      </ul>
      <div class="loading-wrapper" v-if="!topList.length">
        <loading class="loading" :text="'正在加载...'"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getTopList} from '../../api/rank'
  import Scroll from '../../base/scroll/scroll.vue'
  import Loading from '../../base/loading/loading.vue'
  import {playlistMixin} from '../../common/js/mixin'
  import {mapMutations} from 'vuex'
export default {
  data(){
    return {
      topList: [],
    }
  },
  methods: {
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === 0) {
          this.topList = res.data.topList
        }
      })
    },
    listFilter(list) {
      let arr = []
      list.forEach((item) => {
        arr.push(item.singername + ' / ' + item.songname)
      })
      return arr.join(' . ')
    },
    handlePlaylist(list) {
      let bottom = list.length ? '60px': '0'
      this.$refs.rank.style.bottom = bottom
      this.$refs.topList.refresh()
    },
    selectItem(item) {
      console.log(item)
      this.setTopList(item)
      this.$router.push({
        path: `/rank/${item.id}`
      })
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    }),
  },
  created() {
    this._getTopList()
  },
  components: {
    Scroll,
    Loading,
  },
  mounted() {
    this.$refs.topList.refresh()
  },
  mixins: {playlistMixin,}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
.rank
  position: fixed
  top: 88px
  width: 100%
  bottom: 0
  .rank-content
    height: 100%
    overflow: hidden
    padding-top: 20px
    .rank-item
      display: flex
      align-items: center
      margin-bottom: 10px
      &:last-child
        padding-bottom: 60px
      .pic
        flex: 0 0 60px
        width: 60px
        margin: 0 10px 0 20px
        height: 60px
        img
          width: 100%
          height: 100%
      .text
        flex: 1
        no-wrap()
        color: $color-text-l
        padding-right: 20px
        .title
          no-wrap()
          font-size: $font-size-medium
          margin-bottom: 15px
        .song-list
          no-wrap()
          font-size: $font-size-small
    .loading-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translatey(-50%)

</style>
