import { forEach } from './object-utils';

export function styledLogMessage(message, style) {
  return [`%c${message}`, style]
}

const styledMessageFn = style => message => styledLogMessage(message, style)

export const styles = {
  red: styledMessageFn('color: red;'),
  blue: styledMessageFn('color: blue;'),
  green: styledMessageFn('color: green;'),
  grey: styledMessageFn('color: grey;'),

  bold: styledMessageFn('font-weight:bold;')
}

Object.assign(styles.bold, {
  red: styledMessageFn('color: red; font-weight:bold;'),
  green: styledMessageFn('color: green; font-weight:bold;'),
  blue: styledMessageFn('color: blue; font-weight:bold;')
})

export default function slog(...args) {
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
