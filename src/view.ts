import * as Utils from './utils'
import * as Templates from './templates'
import { TemplateResult, html, nothing, render } from 'lit-html'

class Result {
  constructor (
    private content: TemplateResult[] = [
      html`
        ${nothing}
      `
    ]
  ) {}

  add (tpl: TemplateResult) {
    this.content.push(tpl)
  }

  refresh ({ clear = false } = {}) {
    render(
      clear
        ? html`
            ${nothing}
          `
        : this.content,
      document.getElementById('qrySeatResult')
    )
  }
}

const observeMutation = (
  target: HTMLElement,
  callback: MutationCallback,
  config: MutationObserverInit
) => {
  const observeThis = () => observeMutation(target, callback, config)
  if (!Utils.isAvailable(target, observeThis)) return
  const observer = new MutationObserver(callback)
  observer.observe(target, config)
}

const toggleExpand = () => {
  document.getElementById('checkboxes').classList.toggle('hide')
}

const adjustStyle = () => {
  const formWrapper = document.getElementById('centerProvinceCity').parentElement.parentElement
  const selects = document.querySelectorAll('.form-inline select') as NodeListOf<HTMLElement>
  if (!Utils.isAvailable(formWrapper && selects, adjustStyle)) return

  formWrapper.classList.remove('offset1')
  formWrapper.style.textAlign = 'center'
  for (const select of selects) {
    select.style.width = '12em'
  }
}

const addComponent = {
  checkbox: () => {
    const provinceGroup = document.querySelectorAll('#centerProvinceCity optgroup') as NodeListOf<
      HTMLOptGroupElement
    >
    if (!Utils.isAvailable(provinceGroup.length, addComponent.checkbox)) return
    if (
      !Utils.isAvailable(
        provinceGroup[provinceGroup.length - 1].label === '浙江',
        addComponent.checkbox
      )
    )
      return

    const checkboxWrapperTpl = Templates.checkboxWrapper(provinceGroup)

    const selectCity = document.getElementById('centerProvinceCity')
    const formWrapper = selectCity.parentElement.parentElement.parentElement

    formWrapper.insertAdjacentHTML(
      'beforeend',
      `<div id="checkboxes" class="hide" style="max-width:fit-content;margin:4px 0 0 ${selectCity.offsetLeft -
        selectCity.parentElement
          .offsetLeft}px;padding:.5em;border:1px solid #ccc;border-radius:4px;"></div>`
    )
    const checkboxWrapper = document.getElementById('checkboxes')

    render(checkboxWrapperTpl, checkboxWrapper)
  },

  expandBtn: () => {
    document
      .getElementById('centerProvinceCity')
      .insertAdjacentHTML('afterend', '<span id="expandBtnWrapper"></span>')
    const btnTpl = Templates.expandBtn(toggleExpand)
    render(btnTpl, document.getElementById('expandBtnWrapper'))
  },

  queryBtn: (fn: Function) => {
    document
      .getElementById('expandBtn')
      .insertAdjacentHTML('afterend', '<span id="queryBtnWrapper"></span>')
    const btnTpl = Templates.queryBtn(fn)
    render(btnTpl, document.getElementById('queryBtnWrapper'))
  }
}

const grab = {
  selectedCity: () => {
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

  dates: () => {
    const dates: string[] = []
    const options = document.getElementById('testDays').childNodes as NodeListOf<HTMLInputElement>
    for (const el of options) {
      const day = el.value
      if (day && day !== '-1') dates.push(day)
    }
    return dates
  },

  data: async (city: string, date: string) => {
    return $.getJSON('testSeat/queryTestSeats', {
      city: city,
      testDay: date
    })
  }
}

export { Result, observeMutation, toggleExpand, adjustStyle, addComponent, grab }
