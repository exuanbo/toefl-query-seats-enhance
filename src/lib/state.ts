import * as Utils from './utils'
import * as View from './view'
import { Progress } from '../components/progress'
import { render } from 'lit-html'

class Prop {
  private _val: any
  private state: State

  constructor (state: State, value: any) {
    this.state = state
    this._val = value
  }

  get val (): any {
    return this._val
  }
  set val (value: any) {
    this._val = value
    this.update()
  }

  private update () {
    this.state.update()
  }
}

class State {
  city?: string
  cities?: string[]
  currentCity: { val: string } = new Prop(this, null)
  citiesLeft?: number

  dates: string[] = View.grab.dates()
  currentDate: { val: string } = new Prop(this, null)
  datesLeft: number

  sum: number
  progress: number

  availableSeats = 0
  err = 0
  isComplete: { val: boolean } = new Prop(this, false)

  constructor () {
    const city = View.grab.selectedCity()
    if (city === '-1') {
      return
    } else if (Array.isArray(city) && city.length !== 1) {
      this.cities = city
    } else {
      const singleCity = Array.isArray(city) ? city[0] : city
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
    if (this.cities) this.citiesLeft = Utils.calcLeft(this.currentCity.val, this.cities)
    this.datesLeft = Utils.calcLeft(this.currentDate.val, this.dates)
    this.calcProgress()

    const progressWrapper = document.getElementById('progressWrapper')
    if (progressWrapper) render(Progress(this), progressWrapper)
  }
}

export { State }
