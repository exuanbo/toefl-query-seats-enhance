import * as Utils from './utils'
import * as Btn from '../components/btn'
import { Checkbox } from '../components/checkbox'
import { PityMsg } from '../components/pityMsg'
import { QueryData } from './seat'
import { State } from './state'
import { TemplateResult, render } from 'lit-html'
import axios, { AxiosResponse } from 'axios'

const observeMutation = (
  target: HTMLElement,
  callback: MutationCallback,
  config: MutationObserverInit
) => {
  const observeThis = () => observeMutation(target, callback, config)
  if (!Utils.untilAvailable(target, observeThis)) return
  const observer = new MutationObserver(callback)
  observer.observe(target, config)
}

const hideExpand = () => {
  document.getElementById('checkboxes').classList.add('hide')
}

const setProgress = (num: number) => {
  document.querySelector('#progress div').setAttribute('style', `width:${num}%`)
}

const stopProgress = () => {
  document.getElementById('progress').classList.remove('active')
}

const adjustStyle = () => {
  const formWrapper = document.getElementById('centerProvinceCity').parentElement.parentElement
  const selects = document.querySelectorAll('.form-inline select') as NodeListOf<HTMLElement>
  if (!Utils.untilAvailable(formWrapper && selects, adjustStyle)) return

  formWrapper.classList.remove('offset1')
  formWrapper.style.textAlign = 'center'
  for (const select of selects) {
    select.style.width = '12em'
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
  },

  async response (city: string, date: string): Promise<AxiosResponse<QueryData>> {
    return axios.get('testSeat/queryTestSeats', { params: { city: city, testDay: date } })
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

export {
  observeMutation,
  hideExpand,
  setProgress,
  stopProgress,
  adjustStyle,
  insert,
  grab,
  queryBtn
}
