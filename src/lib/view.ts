import * as Utils from './utils'
import { App } from '../components/app'
import * as Btn from '../components/btn'
import { Checkbox } from '../components/checkbox'
import { Table } from '../components/table'
import { Progress } from '../components/progress'
import { PityMsg } from '../components/pityMsg'
import { QueryData } from './query'
import { State } from './state'
import { TemplateResult, render, nothing } from 'lit-html'

const init = (state: State) => {
  const wrapper = document.getElementById('qrySeatResult')
  render(nothing, wrapper)
  render(App(state), wrapper)
}
const renderProgress = (state: State) => {
  const progressWrapper = document.getElementById('progressWrapper')
  if (progressWrapper) render(Progress(state), progressWrapper)
}

const renderTable = (data: QueryData, state: State) => {
  const id = `${state.currentCity.val}[${state.currentDate.val}]`

  document
    .getElementById(`${state.city ? 'tables' : `tab-${state.currentCity.val}`}`)
    .insertAdjacentHTML(
      'beforeend',
      `<table id="${id}" class="table table-bordered" style="margin-top:12px;font-size:16px;"></table>`
    )

  render(Table(data), document.getElementById(id))
}

const utils = {
  observeMutation (target: HTMLElement, callback: MutationCallback, config: MutationObserverInit) {
    const observeThis = () => this.observeMutation(target, callback, config)
    if (!Utils.untilAvailable(target, observeThis)) return
    const observer = new MutationObserver(callback)
    observer.observe(target, config)
  },

  hideExpand () {
    document.getElementById('checkboxes').classList.add('hide')
  },

  setProgress (num: number) {
    document.querySelector('#progress div').setAttribute('style', `width:${num}%`)
  },

  stopProgress () {
    document.getElementById('progress').classList.remove('active')
  },

  adjustStyle () {
    const formWrapper = document.getElementById('centerProvinceCity').parentElement.parentElement
    const selects = document.querySelectorAll('.form-inline select') as NodeListOf<HTMLElement>
    if (!Utils.untilAvailable(formWrapper && selects, this.adjustStyle)) return

    formWrapper.classList.remove('offset1')
    formWrapper.style.textAlign = 'center'
    for (const select of selects) {
      select.style.width = '12em'
    }
  }
}

const insert = {
  checkbox () {
    const provinceGroup = document.querySelectorAll('#centerProvinceCity optgroup') as NodeListOf<
      HTMLOptGroupElement
    >
    if (!Utils.untilAvailable(provinceGroup.length, insert.checkbox)) return
    if (
      !Utils.untilAvailable(
        provinceGroup[provinceGroup.length - 1].label === '浙江',
        insert.checkbox
      )
    )
      return

    const selectCity = document.getElementById('centerProvinceCity')
    const formWrapper = selectCity.parentElement.parentElement.parentElement

    insertComponent({
      component: Checkbox(),
      wrapperTag: 'div',
      wrapperAttr: {
        id: 'checkboxes',
        class: 'hide well',
        style: `max-width:fit-content;margin:4px 0 0 ${selectCity.offsetLeft -
          selectCity.parentElement.offsetLeft}px;padding:1em;`
      },
      target: formWrapper,
      position: 'beforeend'
    })
  },

  expandBtn () {
    insertComponent({
      component: Btn.expandBtn(),
      wrapperAttr: { id: 'expandBtnWrapper' },
      target: document.getElementById('centerProvinceCity')
    })
  },

  queryBtn (fn: Function) {
    insertComponent({
      component: Btn.queryBtn(),
      wrapperAttr: { id: 'queryBtnWrapper' },
      target: document.getElementById('expandBtn')
    })
    document
      .getElementById('queryBtn')
      .addEventListener('click', fn as EventHandlerNonNull, { once: true })
  },

  pityMsg (state: State) {
    render(PityMsg(), document.getElementById(`tab-${state.currentCity.val}`))
  }
}

function insertComponent ({
  component,
  wrapperTag = 'span',
  wrapperAttr,
  target,
  position = 'afterend'
}: {
  component: TemplateResult
  wrapperTag?: string
  wrapperAttr: {
    id: string
    [Attr: string]: string
  }
  target: HTMLElement
  position?: string
}) {
  target.insertAdjacentHTML(
    position as InsertPosition,
    `<${wrapperTag} ${loopAttr(wrapperAttr)}></${wrapperTag}>`
  )
  render(component, document.getElementById(wrapperAttr.id))

  function loopAttr (attrs: typeof wrapperAttr) {
    const result: string[] = []
    for (const attr in attrs) {
      const html = `${attr}="${attrs[attr]}"`
      result.push(html)
    }
    return result.join(' ')
  }
}

const grab = {
  selectedCity () {
    const checkedCities: string[] = []
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<
      HTMLInputElement
    >
    for (const box of checkboxes) {
      if (box.checked) checkedCities.push(box.id)
    }
    if (checkedCities.length) return checkedCities
    const selectedCity = document.getElementById('centerProvinceCity') as HTMLInputElement
    return selectedCity.value
  },

  dates () {
    const dates: string[] = []
    const options = document.getElementById('testDays').childNodes as NodeListOf<HTMLInputElement>
    for (const el of options) {
      const day = el.value
      if (day && day !== '-1') dates.push(day)
    }
    return dates
  }
}

const queryBtn = {
  getEl () {
    return document.getElementById('queryBtn')
  },

  listen (fn: EventHandlerNonNull) {
    this.getEl().addEventListener('click', fn, { once: true })
  }
}

export { init, renderProgress, renderTable, utils, insert, grab, queryBtn }
