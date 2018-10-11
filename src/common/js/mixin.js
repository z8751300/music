"use strict"


import {mapGetters, mapMutations,mapActions,} from 'vuex'
import {mode} from '../../common/js/config'

export const  playlistMixin = {
  methods: {
    handlePlaylist(playlist) {
      throw new Error('this methods mast be immplementd')
    }
  },
  watch: {
    playlist(newVal) {
      console.log('watch mixin')
      this.handlePlaylist(newVal)
    }
  },
  computed: {
    ...mapGetters(['playlist',])
  },
  updated() {
    this.handlePlaylist(this.playlist)
  },
  mounted() {
    console.log('mounted mixin')
    this.handlePlaylist(this.playlist)
  }
}

export const modeMixin = {
  methods: {
    changeMode() {
      this.setPlayMode((this.playMode + 1) % 3)
      this.changePlayMode({song: this.currentSong})
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
    }),
    ...mapActions([
      'changePlayMode',
      'addFavoriteAction',
      'deleteFavoriteAction',
    ]),
    toggleFav(song) {
      this.isFav(song) ? this.deleteFavoriteAction(song) :
        this.addFavoriteAction(song)
    },
    isFav(song) {
      let index = this.favoriteHistory.findIndex((item) => {
        return item.id == song.id
      })
      return index > -1
    },
    favCls(song) {
      return this.isFav(song) ? 'icon-favorite' : 'icon-not-favorite'
    },
  },
  computed: {
    modeCls() {
      return this.playMode === mode.random ? 'icon-random': this.playMode === mode.loop ? 'icon-loop': 'icon-sequence'
    },
    ...mapGetters([
      'playMode',
      'currentSong',
      'favoriteHistory',
    ]),
  }
  
}

export const searchMixin = {
  data(){
    return {
      query: '',
    }
  },
  methods: {
    addSearch(k) {
      this.$refs.searchBox.addSearch(k)
    },
    queryChange(newVal) {
      this.query = newVal
    },
    selectItem() {
      this.setStorage(this.query)
    },
    onBeforeScroll() {
      this.$refs.searchBox.inputBlur()
    },
    ...mapActions([
      'setStorage'
    ]),
  },
  computed: {
  
  },
}
