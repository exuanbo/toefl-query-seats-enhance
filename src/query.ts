import * as Utils from './utils'
import * as View from './view'
import * as Templates from './templates'
import { TemplateResult, html, nothing, render } from 'lit-html'

class State {
  city?: string
  cities?: string[]
  private _currentCity: string
  citiesLeft?: number
  dates: string[] = View.grab.dates()
  private _currentDate: string
  datesLeft: number
  sum: number
  progress: number
  private _availableSeatsNum = 0
  private _errNum = 0
  private _isComplete = false

  constructor () {
    const city = View.grab.selectedCity()
    if (city === '-1') {
      return
    } else if (typeof city === 'string') {
      this.city = city
      this.setVal('currentCity', city, true)
    } else {
      this.cities = city
    }
    this.sum = this.dates.length * (this.city ? 1 : this.cities.length)
    this.update(true)
  }

  getVal (propertyName: string): any {
    return this[`_${propertyName}` as keyof this]
  }

  setVal (propertyName: string, value: any, init: boolean = false) {
    this[`_${propertyName}` as keyof this] = value
    this.update(init)
  }

  increaseVal (propertyName: string, value: number) {
    ;(this[`_${propertyName}` as keyof this] as any) += value
  }

  private update (init?: boolean) {
    if (this.cities)
      this.citiesLeft = Utils.calcLeft(this.getVal('currentCity') as string, this.cities)
    this.datesLeft = Utils.calcLeft(this.getVal('currentDate') as string, this.dates)
    this.calcProgress()
    if (!init) render(Templates.status(this), document.getElementById('statusWrapper'))
  }

  private calcProgress () {
    this.progress =
      100 -
      (((this.cities ? this.citiesLeft * this.dates.length : 0) + this.datesLeft) / this.sum) * 100
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
