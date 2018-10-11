<template>
  <div class="recommend" ref="recommend">
    <scroll :data="discList" ref="scroll" class="recommend-content">
      <div class="scroll-wrapper">
        <div class="slider-wrapper">
          <slider v-if="recommends.length"
                  :autoPlay=false
          >
            <div v-for="item in recommends" >
              <a :href="item.linkUrl" class="needClick">
                <img :src="item.picUrl" @load="onLoad">
              </a>
            </div>
          </slider>
        </div>
        <div class="disc-list" >
          <div class="disc-title" v-if="discList.length">热门歌曲</div>
          <ul v-if="discList.length">
            <li v-for="item in discList" class="disc-item"
                @click="selectItem(item)"
            >
              <div class="disc-icon">
                <img v-lazy="item.imgurl" width="60px" height="60px">
              </div>
              <div class="disc-text">
                <div class="name" v-html="item.creator.name"></div>
                <div class="disc-name" v-html="item.dissname"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="loading-wrapper" v-if="!discList.length">
      <loading text="正在加载"></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from '../../api/recommend'
  import Scroll from '../../base/scroll/scroll.vue'
  import Slider from '../../base/slider/slider.vue'
  import Loading from '../../base/loading/loading.vue'
  import {playlistMixin} from '../../common/js/mixin'
  import {mapMutations} from 'vuex'
export default {
  data(){
    return {
      recommends: [],
      discList: [],
      hasRefresh: false,
    }
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        this.recommends = res.data.slider
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        this.discList = res.data.list
      })
    },
    onLoad() {
      if (!this.hasRefresh) {
        this.$refs.scroll.refresh()
        this.hasRefresh = true
      }
    },
    handlePlaylist(list) {
      let bottom = list.length ? '60px': '0px'
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      console.log(item)
      this.setDisc(item)
      this.$nextTick(() => {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
      })


    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  mounted() {
    this.$refs.scroll.refresh()
  },
  updated() {
    this.$refs.scroll.refresh()
  },
  components: {
    Slider,
    Scroll,
    Loading,
  },
  mixins: [playlistMixin,]
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
.recommend
  position: fixed
  left:0
  top: 88px
  width: 100%
  bottom: 0
  .recommend-content
    height: 100%
    overflow: hidden
    width: 100%
    .slider-wrapper
      position: relative
      overflow: hidden
      width: 100%
    .disc-list
      position: relative
      .disc-title
        text-align: center
        font-size: $font-size-medium
        margin: 20px 0
      .disc-item
        margin: 0 10px 10px
        display: flex
        align-items: center

        .disc-icon
          flex: 0 0 60px
          width: 60px
          margin-right: 10px
        .disc-text
          flex: 1
          display: flex
          flex-direction: column
          .name
            flex: 1
            no-wrap()
            margin-bottom: 15px
          .disc-name
            flex: 1
            no-wrap()
  .loading-wrapper
    position: absolute
    top: 50%
    width: 100%

</style>
