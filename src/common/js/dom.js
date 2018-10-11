"use strict"


export function setClass(el, cls) {
  if (hasCalss(el, 'slider-item')) {
    return
  }
  let arr = el.className.split(' ')
  arr.push(cls)
  el.className = arr.join(' ')
}

function hasCalss(el, cls) {
  let reg = new RegExp('(^|\\s)' + cls + '(^|$)')
  return reg.test(el.className)
}

export function getData(el, name, value) {
  let data = 'data-' + name
  if (value) {
    return el.setAttribute(data, value)
  } else {
    return el.getAttribute(data)
  }
}


const elStyle = document.createElement('div').style

const vender = (() => {
  let obj = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransfrom',
    stand: 'transform'
  }
  for(let k in obj) {
    if (elStyle[obj[k]] !== undefined) {
      return k
    }
  }
  return undefined
})()

export function profix(style) {
  if (vender === undefined) {
    throw new Error('browser is bad')
  }
  if (vender === 'stand') {
    return style
  } else {
    return vender + style.charAt(0).toUpperCase() + style.slice(1)
  }
}
