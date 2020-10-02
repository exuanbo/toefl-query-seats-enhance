import { untilAvailable } from '../utils'
import { QueryData } from '../models/Data'
import { State } from '../models/State'
import { App } from '../components/app'
import { Progress } from '../components/progress'
import { Table } from '../components/table'
import { Checkbox } from '../components/checkbox'
import * as Btn from '../components/btn'
import { PityMsg } from '../components/pityMsg'
import { TemplateResult, render, nothing } from 'lit-html'

export const app = (state: State): void => {
  document.getElementById('checkboxes').classList.add('hide')
  const wrapper = document.getElementById('qrySeatResult')
  render(nothing, wrapper)
  render(App(state), wrapper)
}

export const progress = (state: State): void => {
  const wrapper = document.getElementById('progressWrapper')
  if (wrapper) render(Progress(state), wrapper)
}

export const table = (data: QueryData, state: State): void => {
  insertComponent({
    component: Table(data),
    wrapperTag: 'table',
    wrapperAttr: {
      id: `${state.get('currentCity')}[${state.get('currentDate')}]`,
      class: 'table table-bordered',
      style: 'margin-top:12px;font-size:16px;'
    },
    target: document.getElementById(
      `${state.get('city') ? 'tables' : `tab-${state.get('currentCity')}`}`
    ),
    position: 'beforeend'
  })
}

export const checkbox = (): void => {
  const provinceGroup = document.querySelectorAll('#centerProvinceCity optgroup') as NodeListOf<
    HTMLOptGroupElement
  >
  const provinceNum = provinceGroup.length

  if (!untilAvailable(provinceNum, checkbox)) return
  if (!untilAvailable(provinceGroup[provinceNum - 1].label === '浙江', checkbox)) return

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
}

export const expandBtn = (): void => {
  insertComponent({
    component: Btn.expandBtn(),
    wrapperAttr: { id: 'expandBtnWrapper' },
    target: document.getElementById('centerProvinceCity')
  })
}

export const queryBtn = (): void => {
  insertComponent({
    component: Btn.queryBtn(),
    wrapperAttr: { id: 'queryBtnWrapper' },
    target: document.getElementById('expandBtn')
  })
}

export const pityMsg = (state: State): void => {
  render(PityMsg(), document.getElementById(`tab-${state.get('currentCity')}`))
}

interface insertOptions {
  component: TemplateResult
  wrapperTag?: string
  wrapperAttr: {
    id: string
    [Attr: string]: string
  }
  target: HTMLElement
  position?: string
}

function insertComponent ({
  component,
  wrapperTag = 'span',
  wrapperAttr,
  target,
  position = 'afterend'
}: insertOptions): void {
  target.insertAdjacentHTML(
    position as InsertPosition,
    `<${wrapperTag} ${loopAttr(wrapperAttr)}></${wrapperTag}>`
  )
  render(component, document.getElementById(wrapperAttr.id))

  function loopAttr (attrs: typeof wrapperAttr): string {
    return Object.keys(attrs)
      .map(attr => `${attr}="${attrs[attr]}"`)
      .join(' ')
  }
}
