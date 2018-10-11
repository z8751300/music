"use strict"


import Storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_LENGTH = 200


export function addFavorite(song) {
  let arr = Storage.get(FAVORITE_KEY, [])
  findIndex(arr, song, (item) => {
    return item.id === song.id
  }, FAVORITE_LENGTH)
  let t = Storage.set(FAVORITE_KEY, arr)
  return t
}
export function deleteFavorite(song) {
  let arr = Storage.get(FAVORITE_KEY, [])
  let index = arr.findIndex((item) => {
    return item.id = song.id
  })
  if (index > -1) {
    arr.splice(index, 1)
  }
  arr = Storage.set(FAVORITE_KEY, arr)
  return arr
}
export function clearFavorite() {
  return Storage.set(FAVORITE_KEY, [])
}
export function loadFavorite() {
  return Storage.get(FAVORITE_KEY, [])
}

export function addPlay(song) {
  let arr = Storage.get(PLAY_KEY, [])
  findIndex(arr, song, (item) => {
    return item.id === song.id
  }, PLAY_LENGTH)
  let t = Storage.set(PLAY_KEY, arr)
  return t
}
export function loadPlay() {
  return Storage.get(PLAY_KEY, [])
}

export function deletePlay(song) {
  let arr = Storage.get(PLAY_KEY, [])
  let index = arr.findIndex((item) => {
    return item.id = song.id
  })
  if (index > -1) {
    arr.splice(index, 1)
  }
  arr = Storage.set(PLAY_KEY, arr)
  return arr
}

export function clearPlay() {
  Storage.set(PLAY_KEY, [])
  return []
}

export function addSearch(str) {
  let arr = Storage.get(SEARCH_KEY, [])
  findIndex(arr, str, (item) => {
    return item == str
  }, SEARCH_LENGTH)
  let t =  Storage.set(SEARCH_KEY, arr)
  return t
}

export function loadSearch() {
  return Storage.get(SEARCH_KEY, [])
}

export function deleteSearch(str) {
  let arr = Storage.get(SEARCH_KEY, [])
  let index = arr.findIndex((item) => {
    return item === str
  })
  if (index > -1) {
    arr.splice(index, 1)
  }
  arr = Storage.set(SEARCH_KEY, arr)
  return arr
}

export function clearSearch() {
  Storage.set(SEARCH_KEY, [])
  return []
}


function findIndex(list, val, compare, len) {
  let index = list.findIndex(compare)
  if (index == 0) {
    return
  }
  if (index > 0) {
    list.splice(index, 1)
  }
  list.unshift(val)
  while (list.length > len) {
    list.pop()
  }
}
