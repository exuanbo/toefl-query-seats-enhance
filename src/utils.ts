export const firstKeyOf = (obj: object): string => Object.keys(obj)[0]

export const calcLeft = (cur: string, arr: string[]): number => arr.length - arr.indexOf(cur) - 1

export const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms))

export const untilAvailable = (con: any, fn: Function, interval: number = 100): boolean => {
  if (!con) {
    window.setTimeout(fn, interval)
    return false
  }
  return true
}

export const forEachElOf = <T extends Node>(
  nodeList: NodeListOf<T>,
  cb: (node: T, index?: number) => void
): void => {
  nodeList.forEach((_, index) => {
    cb(nodeList[index], index)
  })
}

export const mapElOf = <El extends Node, T>(
  nodeList: NodeListOf<El>,
  cb: (node: El, index?: number) => T
): T[] => {
  return Array.from(nodeList).map(cb)
}

export const someElOf = <T extends Node>(
  nodeList: NodeListOf<T>,
  cb: (node: T, index?: number) => boolean
): boolean => {
  return Array.from(nodeList).some(cb)
}

export const formatCurrency = (value: number): string => 'RMB￥' + value.toFixed(2)

export const isMunicipality = (cityName: string): boolean =>
  cityName === '北京' || cityName === '上海' || cityName === '天津' || cityName === '重庆'

export const translateCityName = (cityName: string): string =>
  document.querySelector(`option[value="${cityName}"]`).innerHTML