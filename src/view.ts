import * as Utils from './utils'
import * as Templates from './templates'
import { TemplateResult, html, nothing, render } from 'lit-html'

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
        class: 'hide',
        style: `max-width:fit-content;margin:4px 0 0 ${selectCity.offsetLeft -
          selectCity.parentElement
            .offsetLeft}px;padding:.5em;border:1px solid #ccc;border-radius:4px;`
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
  },

  queryBtn (fn: Function) {
    createComponent({
      template: Templates.queryBtn(fn),
      wrapperAttr: { id: 'queryBtnWrapper' },
      target: document.getElementById('expandBtn')
    })
  },

  progress (result: Result) {
    result.add(Templates.progress())
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

export { Result, observeMutation, toggleExpand, setProgress, stopProgress, adjustStyle, add, grab }
