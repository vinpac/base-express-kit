import { styles } from '../utils/styled-log';

export const HMR_DOCS_URL = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html";
export const options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  useFlag: true
}

export const colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
}

export const FLAG = options.useFlag ? styles.bold.blue('[HMR]') : ''
export const failureStatuses = { abort: 1, fail: 1 };
export const applyOptions = { ignoreUnaccepted: true };
