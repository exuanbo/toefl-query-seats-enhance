import { calcLeft } from './utils'
import { renderProgress, grab } from './view'

class Prop {
  private _val: unknown
  private state: State

  constructor (state: State, value: unknown) {
    this.state = state
    this._val = value
  }

  get val (): unknown {
    return this._val
  }
  set val (value: unknown) {
    this._val = value
    this.state.update()
  }
}

export class State {
  city?: string
  cities?: string[]
  currentCity = new Prop(this, null) as { val: string }
  citiesLeft?: number

  dates: string[] = grab.dates()
  currentDate = new Prop(this, null) as { val: string }
  datesLeft: number

  sum: number
  progress: number

  availableSeats = 0
  err = 0
  isComplete = new Prop(this, false) as { val: boolean }

  constructor () {
    const city = grab.selectedCity()
    const isCityArray = Array.isArray(city)
    if (isCityArray && city.length !== 1) {
      this.cities = city as string[]
    } else if (city === '-1') {
      return
    } else {
      const singleCity = isCityArray ? city[0] : (city as string)
      this.city = singleCity
      this.currentCity.val = singleCity
    }
    this.sum = this.dates.length * (this.city ? 1 : this.cities.length)
    this.update()
  }

  private calcProgress () {
    this.progress =
      100 -
      (((this.cities ? this.citiesLeft * this.dates.length : 0) + this.datesLeft) / this.sum) * 100
  }

  update () {
    if (this.cities) this.citiesLeft = calcLeft(this.currentCity.val, this.cities)
    this.datesLeft = calcLeft(this.currentDate.val, this.dates)
    this.calcProgress()
    renderProgress(this)
  }
}
