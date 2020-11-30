import { untilAvailable, forEachElOf } from '../utils'

export const observeMutation = (
  target: HTMLElement,
  callback: MutationCallback,
  config: MutationObserverInit
): void => {
  const observeThis = (): void => observeMutation(target, callback, config)

  if (!untilAvailable(target, observeThis)) {
    return
  }

  const observer = new MutationObserver(callback)
  observer.observe(target, config)
}

export const adjustStyle = (): void => {
  const formWrapper = document.getElementById('centerProvinceCity')
    .parentElement.parentElement
  const selects = document.querySelectorAll<HTMLElement>('.form-inline select')

  if (!untilAvailable(formWrapper !== null && selects, adjustStyle)) {
    return
  }

  formWrapper.classList.remove('offset1')
  formWrapper.style.textAlign = 'center'
  forEachElOf(selects, el => {
    el.style.width = '12em'
  })
}
