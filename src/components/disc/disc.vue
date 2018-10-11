<template>
  <transition name="slide">
  <div class="disc">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '../musicList/musicList.vue'
  import {mapGetters} from 'vuex'
  import {getSongList1} from '../../api/recommend'
  import {getMusic} from '../../api/singers'
  import {createSong} from '../../common/js/song'
export default {
  data(){
    return {
      songs: [],
    }
  },
  methods: {
    _getSongList() {
      if (!this.disc || !this.disc.dissid) {
        this.$router.push({
          path: '/recommend'
        })
        return
      }
      getSongList1(this.disc.dissid).then((res) => {
        if (res.code === 0) {
          this._normalizeSongs(res.cdlist[0].songlist)
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
        if (item.ksong.mid && item.album.mid) {
          temp = getMusic(item.ksong.mid)
          arr.push(temp)
          ret.push({
            songid: item.ksong.id,
            songmid: item.ksong.mid,
            singer: item.singer,
            songname: item.name,
            albumname: item.album.name,
            interval: item.interval,
            albummid: item.album.mid
          })
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
      console.log(result)
    },
  },
  computed: {
    ...mapGetters(['disc']),
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    }
  },
  created() {
    this._getSongList()
  },
  components: {
    MusicList,
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.disc
  position: fixed
  left: 0
  top: 0
  width: 100%
  bottom: 0
  background-color: $color-background
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.3s
  &.slide-enter, &.slide-leave-to
    transform: translatex(100%)
</style>
