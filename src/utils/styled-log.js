import { forEach } from './object-utils';

export function styledLogMessage(message, style) {
  return [`%c${message}`, style]
}

const styledMessageFn = style => message => styledLogMessage(message, style)

export default {
  red: styledMessageFn('color: red;'),
  blue: styledMessageFn('color: blue;'),
  green: styledMessageFn('color: green;'),
  grey: styledMessageFn('color: grey;'),

  bold: {
    m: styledMessageFn('font-weight:bold;'),
    red: styledMessageFn('color: red; font-weight:bold;'),
    blue: styledMessageFn('color: blue; font-weight:bold;'),
    green: styledMessageFn('color: green; font-weight:bold;'),
  }
}

export function joinStyledLogs(...args) {
  const messages = []
  const styles = []
  forEach(args, arg => {
    if (Array.isArray(arg)) {
      if(arg.length > 0){
        messages.push(arg[0])
      }
      if(arg.length > 1){
        styles.push(arg[1])
      }
    } else {
      messages.push(!/^\s*%c/.test(arg) ? `%c${arg}` : arg)
      styles.push(undefined)
    }
  })

  return [messages.join(' '), ...styles]
}

export const styledConsole = {
  warn: (...args) => console.warn(...joinStyledLogs(...args)),
  log: (...args) => console.log(...joinStyledLogs(...args))
}
