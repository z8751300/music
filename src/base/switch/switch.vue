<template>
  <ul class="switch">
    <li v-for="(item, index) in list"
        :class="{active: currentIndex === index}"
        @click="selectItem(index)"
        class="switch-item"
    >
      {{item}}
    </li>
  </ul>
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
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    selectItem(index) {
      this.$emit('switchChange', index)
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.switch
  width: 240px
  display: flex
  align-items: center
  margin: 0 auto
  border: 1px solid $color-dialog-background
  border-radius: 5px

  .switch-item
    flex: 1
    padding: 8px
    text-align: center
    color: $color-text-d
    &.active

      color: $color-text-ll
      background-color: $color-dialog-background
</style>
