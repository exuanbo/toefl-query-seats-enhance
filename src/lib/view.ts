import { untilAvailable, forEachElOf, mapElOf } from './utils'
import { App } from '../components/app'
import * as Btn from '../components/btn'
import { Checkbox } from '../components/checkbox'
import { Table } from '../components/table'
import { Progress } from '../components/progress'
import { PityMsg } from '../components/pityMsg'
import { QueryData } from './data'
import { State } from './state'
import { TemplateResult, render, nothing } from 'lit-html'

export const init = (state: State) => {
  document.getElementById('checkboxes').classList.add('hide')
  const wrapper = document.getElementById('qrySeatResult')
  render(nothing, wrapper)
  render(App(state), wrapper)
}

export const renderProgress = (state: State) => {
  const wrapper = document.getElementById('progressWrapper')
  if (wrapper) render(Progress(state), wrapper)
}

export const renderTable = (data: QueryData, state: State) => {
  const id = `${state.currentCity.val}[${state.currentDate.val}]`
  const target = document.getElementById(
    `${state.city ? 'tables' : `tab-${state.currentCity.val}`}`
  )

  insertComponent({
    component: Table(data),
    wrapperTag: 'table',
    wrapperAttr: {
      id: id,
      class: 'table table-bordered',
      style: 'margin-top:12px;font-size:16px;'
    },
    target: target,
    position: 'beforeend'
  })
}

export const utils = {
  observeMutation (target: HTMLElement, callback: MutationCallback, config: MutationObserverInit) {
    const observeThis = () => this.observeMutation(target, callback, config)

    if (!untilAvailable(target, observeThis)) {
      return
    }

    const observer = new MutationObserver(callback)
    observer.observe(target, config)
  },

  adjustStyle () {
    const formWrapper = document.getElementById('centerProvinceCity').parentElement.parentElement
    const selects = document.querySelectorAll('.form-inline select') as NodeListOf<HTMLElement>

    if (!untilAvailable(formWrapper && selects, this.adjustStyle)) {
      return
    }

    formWrapper.classList.remove('offset1')
    formWrapper.style.textAlign = 'center'
    forEachElOf(selects, el => {
      el.style.width = '12em'
    })
  }
}

export const insert = {
  checkbox () {
    const provinceGroup = document.querySelectorAll('#centerProvinceCity optgroup') as NodeListOf<
      HTMLOptGroupElement
    >
    const provinceNum = provinceGroup.length

    if (!untilAvailable(provinceNum, insert.checkbox)) {
      return
    }

    if (!untilAvailable(provinceGroup[provinceNum - 1].label === '浙江', insert.checkbox)) {
      return
    }

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

  queryBtn () {
    insertComponent({
      component: Btn.queryBtn(),
      wrapperAttr: { id: 'queryBtnWrapper' },
      target: document.getElementById('expandBtn')
    })
  },

  pityMsg (state: State) {
    render(PityMsg(), document.getElementById(`tab-${state.currentCity.val}`))
  }
}

export const grab = {
  selectedCity () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<
      HTMLInputElement
    >
    const checkedCities = mapElOf(checkboxes, (box): string =>
      box.checked ? box.id : null
    ).filter(Boolean)
    const isExpanded = !document.getElementById('checkboxes').classList.contains('hide')

    if (checkedCities.length && isExpanded) {
      return checkedCities
    } else {
      const selectedCity = document.getElementById('centerProvinceCity') as HTMLInputElement
      return selectedCity.value
    }
  },

  dates () {
    const options = document.getElementById('testDays').childNodes as NodeListOf<HTMLInputElement>
    return mapElOf(options, (option): string => {
      const day = option.value
      if (day && day !== '-1') return day
    }).filter(Boolean)
  }
}

export const queryBtn = {
  getEl () {
    return document.getElementById('queryBtn')
  },

  listen (fn: Function) {
    this.getEl().addEventListener('click', fn as EventHandlerNonNull, { once: true })
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
    return Object.keys(attrs)
      .map(attr => `${attr}="${attrs[attr]}"`)
      .join(' ')
  }
}
