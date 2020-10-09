import { calcLeft } from './utils'
import * as render from './views/render'
import { selectedCity, dates } from './views/get'

interface StateData {
  city?: string
  cities?: string[]
  currentCity?: string
  citiesLeft?: number

  dates?: string[]
  currentDate?: string
  datesLeft?: number

  sum?: number
  progress?: number

  availableSeats?: number
  err?: number
  isComplete?: boolean
}

export class State {
  private data: StateData = {
    dates: dates(),
    availableSeats: 0,
    err: 0
  }

  get = <K extends keyof StateData>(key: K): StateData[K] | undefined => {
    return this.data[key]
  }

  set = (newData: StateData, update = false): void => {
    Object.assign(this.data, newData)
    if (update) this.update()
  }

  constructor () {
    const city = selectedCity()
    if (city instanceof Array && city.length !== 1) {
      this.data.cities = city
    } else if (city === '-1') {
      return
    } else {
      const singleCity = city instanceof Array ? city[0] : city
      this.data.city = singleCity
      this.data.currentCity = singleCity
    }
    this.data.sum = this.data.dates.length * (this.data.city !== undefined ? 1 : this.data.cities.length)
    this.update()
  }

  private update (): void {
    if (this.data.cities !== undefined) this.data.citiesLeft = calcLeft(this.data.currentCity, this.data.cities)
    this.data.datesLeft = calcLeft(this.data.currentDate, this.data.dates)
    this.data.progress =
      100 -
      (((this.data.cities !== undefined ? this.data.citiesLeft * this.data.dates.length : 0) +
        this.data.datesLeft) /
        this.data.sum) *
        100
    render.progress(this)
  }
}
