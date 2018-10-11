"use strict"

import * as types from './mutations-types'
import {mode} from '../common/js/config'
import {shuffle} from '../common/js/util'
import {addSearch, deleteSearch, clearSearch,
        addPlay, deletePlay, clearPlay,
        addFavorite, deleteFavorite,
        } from '../common/js/catch'


export const addFavoriteAction = ({commit}, song) => {
  commit(types.SET_FAVORAITE_HISTORY, addFavorite(song))
}

export const deleteFavoriteAction = ({commit}, song) => {
  commit(types.SET_FAVORAITE_HISTORY, deleteFavorite(song))
}

export const set_play = ({commit, state}, {list, index}) => {
  let arr = shuffle(list)
  let song = list[index]
  let currentIndex = findIndex(arr, song)
  commit(types.SET_PLAYLIST, arr)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_FULL_SCREAN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_CURRENT_INDEX, currentIndex)
}

export const changePlayMode = ({commit, state}, {song}) => {
  if (state.playMode === mode.random) {
    let list = shuffle(state.sequenceList)
    let index = findIndex(list, song)
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_PLAY_MODE, mode.random)
    commit(types.SET_CURRENT_INDEX, index)
  } else {
    let index = findIndex(state.sequenceList, song)
    commit(types.SET_PLAYLIST, state.sequenceList)
    commit(types.SET_CURRENT_INDEX, index)
  }
}

export const insertPlay = ({commit, state}, item) => {
  let playlist = state.playlist.slice(0)
  let sequenceList = state.sequenceList.slice(0)
  let currentIndex = state.currentIndex

  const currentSong = playlist[currentIndex] ? playlist[currentIndex] : null
  let randomIndex = findIndex(playlist, currentSong)
  
  if (currentSong && currentSong.id === item.id) {
    return
  }
  let itemIndex = findIndex(playlist, item)

  playlist.splice(randomIndex + 1, 0, item)

  if (itemIndex >= 0) {
    if (itemIndex < randomIndex) {
      playlist.splice(itemIndex, 1)
    } else {
      playlist.splice(itemIndex + 1, 1)
    }
  }
  let sIndex = findIndex(sequenceList, item)
  sequenceList.splice(currentIndex + 1, 0, item)
  console.log(sIndex, sequenceList)
  if (sIndex >= 0) {
    console.log(sIndex, currentIndex)
    if (sIndex < currentIndex) {
      sequenceList.splice(sIndex, 1)
      currentIndex--
    } else {
      sequenceList.splice(sIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_FULL_SCREAN, false)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_CURRENT_INDEX, currentIndex +1)
}

export const randomPlay = ({commit, state}, {list}) => {
  let arr = shuffle(list)
  commit(types.SET_PLAYLIST, arr)
  commit(types.SET_PLAY_MODE, mode.random)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_FULL_SCREAN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const addSearchAction = ({commit}, str) => {
  commit('SET_SEARCH_HISTORY', addSearch(str))
}
export const deleteSearchAction = ({commit}, str) => {
  commit('SET_SEARCH_HISTORY', deleteSearch(str))
}
export const clearSearchAction = ({commit}) => {
  commit('SET_SEARCH_HISTORY', clearSearch())
}
export const addPlayAction = ({commit}, song) => {
  commit('SET_PLAY_HISTORY',addPlay(song) )
}
export const deletPlayAction = ({commit}, song) => {
  commit('SET_PLAY_HISTORY', deletePlay(song))
}
export const clearPlayAction = ({commit}) => {
  commit('SET_PLAY_HISTORY', clearPlay())
}
export const deleteItem = ({commit, state}, {item, index}) => {
  let playlist = state.playlist.slice(0)
  let sequenceList = state.sequenceList.slice(0)
  let currentIndex = state.currentIndex
  sequenceList.splice(index, 1)
  let pIndex = playlist.findIndex((v) => {
    return v.id === item.id
  })
  playlist.splice(pIndex, 1)
  if (currentIndex > index ||currentIndex === sequenceList.length) {
    currentIndex--
  }
  if (!sequenceList.length) {
    commit(types.SET_PLAYING_STATE, false)
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
}

export const clearSongList = ({commit}) => {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_FULL_SCREAN, false)
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_CURRENT_INDEX, -1)
}

function findIndex(list, song) {
   return list.findIndex((item) => {
     return item.id === song.id
   })
}
