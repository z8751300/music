"use strict"

import * as types from './mutations-types'

export default {
  [types.SET_SINGER]: (state, singer) => {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE]: (state, flag) => {
    state.playingState = flag
  },
  [types.SET_FULL_SCREAN]: (state, flag) => {
    state.fullScrean = flag
  },
  [types.SET_PLAYLIST]: (state, list) => {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST]: (state, list) => {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE]: (state, mode) => {
    state.playMode = mode
  },
  [types.SET_CURRENT_INDEX]: (state, index) => {
    state.currentIndex = index
  },
  [types.SET_DISC]: (state, obj) => {
    state.disc = obj
  },
  [types.SET_TOP_LIST]: (state, obj) => {
    state.topList = obj
  },
  [types.SET_SEARCH_HISTORY]: (state, list) => {
    state.searchHistory = list
  },
  [types.SET_PLAY_HISTORY]: (state, list) => {
    state.playHistory = list
  },
  [types.SET_FAVORAITE_HISTORY]: (state, list) => {
    state.favoriteHistory = list
  }
}
