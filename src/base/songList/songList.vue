<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songs" class="list-item"
          @click="select(index)"
      >
        <div class="rank-icon" v-if="rank" :class="rankCls(index)" v-html="rankText(index)">
        </div>
        <div class="text-wrapper">
          <div class="name">{{song.name}}</div>
          <div class="desc">{{desc(song)}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data(){
    return {}
  },
  props: {
    songs: {
      type: Array,
      default: () => {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    desc(song) {
      return `${song.name} 。${song.album}`
    },
    select(index) {
      this.$emit('selectItem',index)
    },
    rankCls(index) {
      if (index <=2) {
        return `icon-${index + 1}`
      } else {
        return 'icon-text'
      }
    },
    rankText(index) {
      if (index >2) {
        return index + 1
      } else {
        return
      }
    }
  },
  computed: {

  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
.song-list
  .list-item
    line-height: 15px
    height: 80px
    padding-left: 20px
    display: flex
    align-items: center
    &:last-child
      padding-bottom: 40px
    .rank-icon
      flex: 0 0 40px
      width: 40px
      height: 40px
      background-size: 40px 40px
      margin-right: 10px
      &.icon-1
        bg-image('first')
      &.icon-2
        bg-image('second')
      &.icon-3
        bg-image('third')
      &.icon-text
        text-align: center
        line-height: 40px
        color: $color-theme
        font-size: $font-size-large-x
    .text-wrapper
      flex: 1
      .name
        font-size: $font-size-medium
        color: $color-text-ll
        margin-bottom: 10px
      .desc
        color: $color-text-l
        font-size: $font-size-small
</style>
