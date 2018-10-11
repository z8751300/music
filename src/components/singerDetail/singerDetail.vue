<template>
  <transition name="slide">
  <div class="singer-detail">
    <music-list :songs="songs" :title="title" :bgImage="bgImage">
    </music-list>

  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail, getMusic} from '../../api/singers'
  import {ERR_OK} from '../../api/config'
  import {createSong, createSong1} from '../../common/js/song'
  import MusicList from '../musicList/musicList.vue'
export default {
  data(){
    return {
      songs: [],
    }
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer || !this.singer.id) {
//        return this.$router.push({
//          path: '/singer'
//        })
        return this.$router.back()
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this._normalizeSongs(res.data.list)
        }
      })
    },
    async _normalizeSongs(list) {
      let ret = []
      let arr = []
      let result = []
      let temp
      let t
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          temp = getMusic(musicData.songmid)
          arr.push(temp)
          ret.push(musicData)
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
      this.songs = result
    },
    _normalizeSongs1(list) {
      let arr = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          arr.push(createSong(musicData))
        }
      })
      this.songs = arr
    }
  },
  computed: {
    ...mapGetters(['singer']),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  created() {
    this._getSingerDetail()
  },
  components: {
    MusicList,
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.singer-detail
  position: fixed
  left: 0
  top: 0
  bottom: 0
  right: 0
  z-inxex: 400
  background: $color-background
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.3s
  &.slide-enter, &.slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
