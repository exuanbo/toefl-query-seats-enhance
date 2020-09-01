const firstKeyOf = (obj: object) => Object.keys(obj)[0]

const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms))

const isAvailable = (con: any, fn: Function) => {
  if (!con) {
    window.setTimeout(fn, 100)
    return false
  }
  return true
}

const formatCurrency = (value: number) => 'RMB￥' + value.toFixed(2)

const isMunicipality = (cityName: string) =>
  cityName === '北京' || cityName === '上海' || cityName === '天津' || cityName === '重庆'

export { firstKeyOf, sleep, isAvailable, formatCurrency, isMunicipality }
