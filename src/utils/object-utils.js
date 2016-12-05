import has from 'has';

export function rangeEach(length, fn) {
  let i = 0;
  for (; i < length; i++) {
    if(fn(i, i) === false) {
      break;
    }
  }
}

export function rangeMap(length, fn) {
  let arr = []
  rangeEach(length, (i) => arr.push(fn(i, i)))
  return arr
}

export function dryObject(obj) {
  const copy = {}
  const filter = {}

  if (typeof arguments[1] === 'string') {
    for (let i = 1; i < arguments.length; i++) {
      filter[arguments[i]] = true
    }
  }

  for (let key in obj) {
    if (!filter[key]) continue

    copy[key] = obj[key]
  }

  return copy
}

export function map(obj, fn) {
  if (Array.isArray(obj)) {
    return obj.map(fn)
  } else {
    const mapped = []
    let i = 0
    for(let key in obj) {
      if (obj.hasOwnProperty(key)) {
        i++;
        mapped.push(fn(obj[key], key, i))
      }
    }
    return mapped
  }
}

export function forEach(obj, fn) {
  if (Array.isArray(obj)) {
      let i = 0;
      let len = obj.length;

      for (; i < len; i++) {
        if(fn(obj[i], i) === false) {
          break;
        }
      }
  } else {
    let i = 0;
    for (let key in obj) {
      if(has(obj, key)) {
        i++;
        if (fn(obj[key], key, i) === false) {
          break;
        }
      }
    }
  }
}
