<template>
  <transition name="slide">
  <div class="top-list">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank=true>
    </music-list>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import MusicList from '../../components/musicList/musicList.vue'
  import {getMusicList} from '../../api/rank'
  import {ERR_OK} from '../../api/config'
  import {getMusic} from '../../api/singers'
  import {createSong} from '../../common/js/song'
export default {
  data(){
    return {
      songs: [],
    }
  },
  methods: {
    _getMusicList() {
      getMusicList(this.topList.id).then((res) => {
        console.log(res)
        if (res.code === ERR_OK) {
          this._normalizeSongs(res.songlist.slice(0, 9))
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
        let {data} = item
        if (data.songid && data.albummid) {
          temp = getMusic(data.songmid)
          arr.push(temp)
          ret.push(data)
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
    ...mapGetters(['topList']),
    title() {
      return this.topList ? this.topList.topTitle : ''
    },
    bgImage() {
      if (this.songs.length) {
        console.log('song image')
        return this.songs[0].image
      }
      return this.topList.picUrl
    }
  },
  created() {
    this._getMusicList()
  },
  components: {
    MusicList,
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.top-list
  position: fixed
  left: 0
  top: 0
  width: 100%
  bottom: 0
  background-color: $color-background
  &.slide-enter-active, &.slide-leave-active
    transition: all .3s
  &.slide-enter, &.slide-leave-to
    transform: translatex(100%)
</style>
