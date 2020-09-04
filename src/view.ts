import * as Utils from './utils'
import * as Templates from './templates'
import { TemplateResult, render } from 'lit-html'

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
  if (!Utils.isAvailable(formWrapper && selects, adjustStyle)) return

  formWrapper.classList.remove('offset1')
  formWrapper.style.textAlign = 'center'
  for (const select of selects) {
    select.style.width = '12em'
  }
}

const add = {
  checkbox () {
    const provinceGroup = document.querySelectorAll('#centerProvinceCity optgroup') as NodeListOf<
      HTMLOptGroupElement
    >
    if (!Utils.isAvailable(provinceGroup.length, add.checkbox)) return
    if (!Utils.isAvailable(provinceGroup[provinceGroup.length - 1].label === '浙江', add.checkbox))
      return

    const selectCity = document.getElementById('centerProvinceCity')
    const formWrapper = selectCity.parentElement.parentElement.parentElement

    createComponent({
      template: Templates.checkboxWrapper(provinceGroup),
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
    createComponent({
      template: Templates.expandBtn(toggleExpand),
      wrapperAttr: { id: 'expandBtnWrapper' },
      target: document.getElementById('centerProvinceCity')
    })

    function toggleExpand () {
      document.getElementById('checkboxes').classList.toggle('hide')
    }
  },

  queryBtn (fn: Function) {
    createComponent({
      template: Templates.queryBtn(),
      wrapperAttr: { id: 'queryBtnWrapper' },
      target: document.getElementById('expandBtn')
    })
    document
      .getElementById('queryBtn')
      .addEventListener('click', fn as EventHandlerNonNull, { once: true })
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

  async data (city: string, date: string) {
    return $.getJSON('testSeat/queryTestSeats', {
      city: city,
      testDay: date
    })
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

function createComponent ({
  template,
  wrapperTag = 'span',
  wrapperAttr,
  target,
  position = 'afterend'
}: {
  template: TemplateResult | TemplateResult[]
  wrapperTag?: string
  wrapperAttr: {
    id: string
    [Attr: string]: string
  }
  target: HTMLElement
  position?: string
}) {
  const html = `<${wrapperTag} ${loopAttr(wrapperAttr)}></${wrapperTag}>`
  target.insertAdjacentHTML(position as InsertPosition, html)
  render(template, document.getElementById(wrapperAttr.id))

  function loopAttr (attrs: typeof wrapperAttr) {
    const result: string[] = []
    for (const attr in attrs) {
      const html = `${attr}="${attrs[attr]}"`
      result.push(html)
    }
    return result.join(' ')
  }
}

export { observeMutation, hideExpand, setProgress, stopProgress, adjustStyle, add, grab, queryBtn }
