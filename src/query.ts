import * as Utils from './utils'
import * as View from './view'
import * as Templates from './templates'
import { TemplateResult, html, nothing, render } from 'lit-html'

class State {
  city?: string
  cities?: string[]
  currentCity: string
  citiesLeft?: number
  dates: string[] = View.grab.dates()
  currentDate: string
  datesLeft: number
  sum: number
  progress: number
  availableDatesNum = 0
  availableSeatsNum = 0
  errNum = 0
  isComplete = false

  private calcProgress () {
    this.progress =
      100 -
      (((this.cities ? this.citiesLeft * this.dates.length : 0) + this.datesLeft) / this.sum) * 100
  }

  constructor () {
    const city = View.grab.selectedCity()
    if (city === '-1') {
      return
    } else if (typeof city === 'string') {
      this.city = city
      this.currentCity = city
    } else {
      this.cities = city
    }
    this.sum = this.dates.length * (this.city ? 1 : this.cities.length)
    this.refresh()
  }

  refresh () {
    if (this.cities) this.citiesLeft = Utils.calcLeft(this.currentCity, this.cities)
    this.datesLeft = Utils.calcLeft(this.currentDate, this.dates)
    this.calcProgress()
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

  private getWrapper () {
    return document.getElementById('qrySeatResult')
  }

  private refresh (tabName: string) {
    tabName
      ? render(this.content.tabs[tabName], document.getElementById(`tab-${tabName}`))
      : render(this.content.templates, this.getWrapper())
  }

  state = new State()

  refreshStatus () {
    render(Templates.status(this.state), document.getElementById('statusWrapper'))
  }

  add (tpl: TemplateResult, tabName: string = '') {
    if (tabName) {
      if (!this.content.tabs[tabName]) this.content.tabs[tabName] = []
      this.content.tabs[tabName].push(tpl)
    } else {
      this.content.templates.push(tpl)
    }

    this.refresh(tabName)
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
