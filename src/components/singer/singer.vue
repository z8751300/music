<template>
<div class="singer" ref="singer">
  <list-view :arrayList="singers" @selectSinger="selectSinger" ref="listView"></list-view>
  <router-view></router-view>
</div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from '../../api/singers'
  import {ERR_OK} from '../../api/config'
  import Singer from '../../common/js/singer'
  import ListView from '../../base/list-view/list-view.vue'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from '../../common/js/mixin'
  const HOT_TEXT = '热门'
  const HOT_LENGTH = 10
export default {
  data(){
    return {
      singers: [],
    }
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_TEXT,
          items:[]
        }
      }
      list.forEach((item) => {
        if (map.hot.items.length < HOT_LENGTH) {
          map.hot.items.push(new Singer({
            mid: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        } else {
          if (!map[item.Findex]) {
            map[item.Findex] = {
              title: item.Findex,
              items: []
            }
          }
          map[item.Findex].items.push(new Singer({
            mid: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
      })
      let temp = []
      for(let k in map) {
        if (k.match(/^[a-zA-Z]{1}$/)) {
          temp.push(map[k])
        }
      }
      temp.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      temp.unshift(map.hot)
      this.singers = temp
    },
    selectSinger(singer) {
      this.$router.push({
        path:  `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    handlePlaylist(list) {
      let bottom = list.length ? '60px': '0px'
      this.$refs.singer.style.bottom = bottom
      this.$refs.listView.refresh()
    }
  },
  computed: {

  },
  mounted() {
    this.$refs.listView.refresh()
  },
  created() {
    this._getSingerList()
  },
  components: {
    ListView,
  },
  mixins: [playlistMixin,]
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.singer
  position: fixed
  left:0
  top: 88px
  width: 100%
  bottom: 0



</style>
