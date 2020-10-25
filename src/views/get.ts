import { mapElOf } from '../utils'

export const queryBtn = {
  getEl (): HTMLElement {
    return document.getElementById('queryBtn')
  },

  onClick (fn: Function): void {
    this.getEl().addEventListener('click', fn as EventHandlerNonNull, { once: true })
  }
}

export const selectedCity = (): string | string[] => {
  const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
  const checkedCities = mapElOf(checkboxes, (box): string => (box.checked ? box.id : null)).filter(
    Boolean
  )
  const isExpanded = !document.getElementById('checkboxes').classList.contains('hide')

  if (checkedCities.length > 0 && isExpanded) {
    return checkedCities
  } else {
    const selectedCity = document.getElementById('centerProvinceCity') as HTMLInputElement
    return selectedCity.value
  }
}

export const availableDates = (): string[] => {
  const options = document.getElementById('testDays').childNodes as NodeListOf<HTMLInputElement>
  return mapElOf(options, (option): string => {
    const day = option.value
    if (day !== undefined && day !== '-1') {
      return day
    }
  }).filter(Boolean)
}
