import { calcLeft } from './utils'
import { renderProgress, grab } from './view'

class Prop<T> {
  private _val: T
  private state: State

  constructor (state: State, value: T) {
    this.state = state
    this._val = value
  }

  get val (): T {
    return this._val
  }
  set val (value: T) {
    this._val = value
    this.state.update()
  }
}

export class State {
  city?: string
  cities?: string[]
  currentCity = new Prop(this, '')
  citiesLeft?: number

  dates: string[] = grab.dates()
  currentDate = new Prop(this, '')
  datesLeft: number

  sum: number
  progress: number

  availableSeats = 0
  err = 0
  isComplete = new Prop(this, false)

  constructor () {
    const city = grab.selectedCity()
    if (city instanceof Array && city.length !== 1) {
      this.cities = city
    } else if (city === '-1') {
      return
    } else {
      const singleCity = city instanceof Array ? city[0] : city
      this.city = singleCity
      this.currentCity.val = singleCity
    }
    this.sum = this.dates.length * (this.city ? 1 : this.cities.length)
    this.update()
  }

  private calcProgress (): void {
    this.progress =
      100 -
      (((this.cities ? this.citiesLeft * this.dates.length : 0) + this.datesLeft) / this.sum) * 100
  }

  update (): void {
    if (this.cities) this.citiesLeft = calcLeft(this.currentCity.val, this.cities)
    this.datesLeft = calcLeft(this.currentDate.val, this.dates)
    this.calcProgress()
    renderProgress(this)
  }
}
