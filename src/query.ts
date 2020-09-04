import * as Utils from './utils'
import * as View from './view'
import * as Templates from './templates'
import { TemplateResult, html, nothing, render } from 'lit-html'

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
    this.update(this.state)
  }

  private update (state: State) {
    state.update()
  }
}

class State {
  city?: string
  cities?: string[]
  currentCity = new Prop(this, null)
  citiesLeft?: number
  dates: string[] = View.grab.dates()
  currentDate = new Prop(this, null)
  datesLeft: number
  sum: number
  progress: number
  availableSeatsNum = new Prop(this, 0)
  errNum = new Prop(this, 0)
  isComplete = new Prop(this, false)

  constructor () {
    const city = View.grab.selectedCity()
    if (city === '-1') {
      return
    } else if (typeof city === 'string') {
      this.city = city
      this.currentCity.val = city
    } else {
      this.cities = city
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
    if (this.cities) this.citiesLeft = Utils.calcLeft(this.currentCity.val as string, this.cities)
    this.datesLeft = Utils.calcLeft(this.currentDate.val as string, this.dates)
    this.calcProgress()
    const statusWrapper = document.getElementById('statusWrapper')
    if (statusWrapper) render(Templates.status(this), statusWrapper)
  }
}

class Result {
  private content: {
    templates: TemplateResult[]
    tabs: { [tabName: string]: TemplateResult[] }
  } = {
    templates: [],
    tabs: {}
  }

  state = new State()

  private getWrapper () {
    return document.getElementById('qrySeatResult')
  }

  private update (tabName: string) {
    tabName
      ? render(this.content.tabs[tabName], document.getElementById(`tab-${tabName}`))
      : render(this.content.templates, this.getWrapper())
  }

  add (tpl: TemplateResult, tabName: string = '') {
    if (tabName) {
      if (!this.content.tabs[tabName]) this.content.tabs[tabName] = []
      this.content.tabs[tabName].push(tpl)
    } else {
      this.content.templates.push(tpl)
    }

    this.update(tabName)
  }

  clear () {
    render(
      html`
        ${nothing}
      `,
      this.getWrapper()
    )
  }
}

export { State, Result }
