import { calcLeft } from './utils'
import { renderComponent, grab } from './view'

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

type StateDataKey = keyof StateData

export class State {
  private data: StateData = {
    dates: grab.dates(),
    availableSeats: 0,
    err: 0,
    isComplete: false
  }

  constructor () {
    const city = grab.selectedCity()
    if (city instanceof Array && city.length !== 1) {
      this.data.cities = city
    } else if (city === '-1') {
      return
    } else {
      const singleCity = city instanceof Array ? city[0] : city
      this.data.city = singleCity
      this.data.currentCity = singleCity
    }
    this.data.sum = this.data.dates.length * (this.data.city ? 1 : this.data.cities.length)
    this.update()
  }

  private calcProgress (): void {
    this.data.progress =
      100 -
      (((this.data.cities ? this.data.citiesLeft * this.data.dates.length : 0) +
        this.data.datesLeft) /
        this.data.sum) *
        100
  }

  set (newData: StateData, render = false): void {
    Object.assign(this.data, newData)
    if (render) this.update()
  }

  get<T extends StateDataKey> (prop: T): StateData[T] {
    return this.data[prop]
  }

  update (): void {
    if (this.data.cities) this.data.citiesLeft = calcLeft(this.data.currentCity, this.data.cities)
    this.data.datesLeft = calcLeft(this.data.currentDate, this.data.dates)
    this.calcProgress()
    renderComponent.progress(this)
  }
}
