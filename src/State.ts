import { calcLeft } from './utils'
import * as render from './views/render'
import { selectedCity, availableDates } from './views/get'

class StateData {
  city?: string
  cities?: string[]
  currentCity: string
  citiesLeft: number

  dates = availableDates()
  currentDate: string
  datesLeft: number

  sum: number
  progress = 0

  availableSeats = 0
  err = 0
  isComplete = false

  constructor () {
    const city = selectedCity()
    if (city instanceof Array && city.length !== 1) {
      this.cities = city
    } else if (city === '-1') {
      return
    } else {
      const singleCity = city instanceof Array ? city[0] : city
      this.city = singleCity
    }
    this.sum = this.dates.length * (this.city !== undefined ? 1 : this.cities.length)
  }
}

export class State {
  private data = new StateData()

  constructor () {
    this.update()
  }

  get <K extends keyof StateData>(key: K): StateData[K] | undefined {
    return this.data[key]
  }

  set (newData: Partial<StateData>, update = false): void {
    Object.assign(this.data, newData)
    if (update) {
      this.update()
    }
  }

  private update (): void {
    if (this.data.cities !== undefined) {
      this.data.citiesLeft = calcLeft(this.data.currentCity, this.data.cities)
    }
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
