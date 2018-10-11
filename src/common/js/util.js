"use strict"


function randomInt(max, min) {
  return Math.floor(Math.random()*(max - min + 1) + min)
}

export function shuffle(list) {
  let arr = list.slice()
 arr.forEach((item, index) => {
    let _index = randomInt(index, 0)
    let t = arr[_index]
    arr[_index] = item
    arr[index] = t
  })
  return arr
}


export function debounce(func, delay) {
  let time
  return function(...args) {
    if (time) {
      clearInterval(time)
    }
    time = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
