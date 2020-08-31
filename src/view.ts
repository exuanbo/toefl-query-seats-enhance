import * as Utils from './utils'
import * as Templates from './templates'
import { TemplateResult, html, nothing, render } from 'lit-html'

const createWrapper = ({
  target,
  position = 'afterend',
  id,
  tag = 'span'
}: {
  target: HTMLElement
  position?: string
  id: string
  tag?: string
}) => {
  const html = `<${tag} id="${id}"></${tag}>`
  target.insertAdjacentHTML(position as InsertPosition, html)
  return document.getElementById(id)
}

class Result {
  private content: TemplateResult[] = []
  private tab: { [key: string]: TemplateResult[] } = {}
  private getWrapper () {
    return document.getElementById('qrySeatResult')
  }
  private refresh (tabName?: string) {
    tabName
      ? render(this.tab[tabName], document.getElementById(`tab-${tabName}`))
      : render(this.content, this.getWrapper())
  }

  add (tpl: TemplateResult, target?: string) {
    if (target) {
      if (!this.tab[target]) this.tab[target] = []
      this.tab[target].push(tpl)
      this.refresh(target)
    } else {
      this.content.push(tpl)
      this.refresh()
    }
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
  document.querySelector('#progress .bar').setAttribute('style', `width:${num}%`)
}

const stopProgress = () => {
  document.querySelector('#progress .bar').classList.remove('active')
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
  checkbox () {
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

    const selectCity = document.getElementById('centerProvinceCity')
    const formWrapper = selectCity.parentElement.parentElement.parentElement

    const wrapper = createWrapper({
      target: formWrapper,
      position: 'beforeend',
      id: 'checkboxes',
      tag: 'div'
    })
    wrapper.classList.add('hide')
    wrapper.setAttribute(
      'style',
      `max-width:fit-content;margin:4px 0 0 ${selectCity.offsetLeft -
        selectCity.parentElement
          .offsetLeft}px;padding:.5em;border:1px solid #ccc;border-radius:4px;`
    )

    render(Templates.checkboxWrapper(provinceGroup), wrapper)
  },

  expandBtn () {
    render(
      Templates.expandBtn(toggleExpand),
      createWrapper({
        target: document.getElementById('centerProvinceCity'),
        id: 'expandBtnWrapper'
      })
    )
  },

  queryBtn (fn: Function) {
    render(
      Templates.queryBtn(fn),
      createWrapper({
        target: document.getElementById('expandBtn'),
        id: 'queryBtnWrapper'
      })
    )
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

export {
  Result,
  observeMutation,
  toggleExpand,
  setProgress,
  stopProgress,
  adjustStyle,
  addComponent,
  grab
}
