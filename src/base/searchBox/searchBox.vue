<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" v-model="search" class="input"
           :placeholder="placeholder" ref="input"
    >
    <i class="icon-delete" v-if="search" @click="del"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from '../../common/js/util'
export default {
  data(){
    return {
      search: '',
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '搜索音乐.歌手'
    }
  },
  methods: {
    del() {
      this.search = ''
    },
    addSearch(search) {
      this.search = search
    },
    inputBlur() {
      this.$refs.input.blur()
    }
  },
  created() {
    this.$watch('search', debounce((newVal) => {
      this.$emit('queryChange', newVal)
    }, 200))
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scope>
  @import "../../common/stylus/variable.styl"
.search-box
  background-color: $color-dialog-background
  padding: 4px 6px
  line-height: 30px
  height: 30px
  display: flex
  align-items: center
  width: 90%
  margin: 0 auto
  border-radius: 5px
  .icon-search, .input, .icon-delete
    display: inline-block
  .icon-search
    flex: 0 0 22px
    width: 22px
    margin-right: 3px
    color: $color-text-d
    font-size: $font-size-large-x
  .icon-delete
    flex: 0 0 18px
    width: 18px
    margin-left: 5px
    font-size: $font-size-small-s
    color: $color-text-d
    background-color: $color-background
    text-align: center
    height: 18px
    line-height: 18px
    border-radius: 50%
  .input
    flex: 1
    background-color: $color-dialog-background
    height: 26px
    line-height: 26px
    border-radius: 4px
    outline: none
    text-indent: 10px
    color: $color-text-ll
    font-size: $font-size-mediu-x


</style>
