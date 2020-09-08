export const firstKeyOf = (obj: object) => Object.keys(obj)[0]

export const calcLeft = (cur: string, arr: string[]) => arr.length - arr.indexOf(cur) - 1

export const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms))

export const untilAvailable = (con: any, fn: Function) => {
  if (!con) {
    window.setTimeout(fn, 100)
    return false
  }
  return true
}

export const forEachElOf = <T extends Node>(THIS: NodeListOf<T>, cb: (node: T) => void) => {
  THIS.forEach(function (this: typeof THIS, _, index) {
    cb(this[index])
  }, THIS)
}

export const mapNodeList = <El extends Node, T>(
  nodeList: NodeListOf<El>,
  cb: (node: El, index?: number) => T
) => {
  return Array.from(nodeList).map(cb)
}

export const formatCurrency = (value: number) => 'RMB￥' + value.toFixed(2)

export const isMunicipality = (cityName: string) =>
  cityName === '北京' || cityName === '上海' || cityName === '天津' || cityName === '重庆'

export const translateCityName = (cityName: string) =>
  document.querySelector(`option[value="${cityName}"]`).innerHTML
