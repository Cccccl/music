export function addClass(el, clname) {
  if (hasClass(el, clname)) {
    return false
  }
  let newClass = el.className.split(' ')
  newClass.push(clname)
  el.className = newClass.join(' ')
}

export function hasClass(el, clname) {
  let reg = new RegExp('(^|\\s)' + clname + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}