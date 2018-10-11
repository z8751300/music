<template>
  <div class="search-list">
    <transition-group tag="ul" name="slide">
      <li v-for="item in list" class="search-item"
          @click="selectItem(item)" :key="item"
      >
        <span class="item-text">{{item}}</span>
        <i class="icon-delete" @click.stop="deleteItem(item)"></i>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data(){
    return {}
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('selectItem', item)
    },
    deleteItem(item) {
      this.$emit('deleteItem', item)
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.search-list
  heigth: 100%
  overflow: hidden
  padding-bottom: 65px
  .search-item
    display: flex
    align-items: center
    height: 30px
    line-height: 30px
    &.slide-enter-active, &.slide-leave-active
      transition: all .4s ease
    &.slide-enter, &.slide-leave-to
      height: 0
      opacity: 0
    .item-text
      flex: 1
      margin-left: 20px
      font-size: $font-size-small
      color: $color-text-l
    .icon-delete
      text-align: center
      flex: 0 0 12px
      width: 12px
      font-size: 10px
      margin-right: 20px
      color: $color-text-d

</style>
