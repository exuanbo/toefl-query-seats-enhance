import { forEachElOf, mapElOf, someElOf, isMunicipality } from '../utils'
import { TemplateResult, html, nothing } from 'lit-html'

export const Checkbox = (): TemplateResult => html`
  <span
    id="toggleAllCheckboxesBtnWrapper"
    style="float:right;font-size:13px;text-decoration:underline;"
  >
    <a href="javascript:void(0);" @click=${toggleCheck}>全选/全不选</a>
  </span>
  ${loopProvinceGroup()}
`

const toggleCheck = (): void => {
  const allCheckboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
  const notAllChecked = someElOf(allCheckboxes, box => !box.checked)
  forEachElOf(allCheckboxes, box => {
    box.checked = notAllChecked
  })
}

const loopProvinceGroup = (): TemplateResult[] => {
  const provinceGroups = document.querySelectorAll<HTMLOptGroupElement>('#centerProvinceCity optgroup')

  return mapElOf(
    provinceGroups,
    (provinceGroup): TemplateResult => {
      const provinceName = provinceGroup.label
      const cities = provinceGroup.childNodes as NodeListOf<HTMLOptionElement>

      return html`
        <div>
          ${mapElOf(
            cities,
            (city, index): TemplateResult => html`
              ${isMunicipality(city.label)
                ? nothing
                : html`
                    ${index === 0
                      ? html`
                          <span
                            class="muted"
                            style="${provinceName.length === 3 ? '' : 'margin-right:1em;'}"
                            >${provinceName}：</span
                          >
                        `
                      : nothing}
                  `}<span style="${isMunicipality(city.label) ? 'margin-left:4em;' : ''}"
                ><input type="checkbox" id=${city.value} style="margin:0 0 2px;" /><label
                  for=${city.value}
                  style="display:inline;margin:${index === cities.length - 1
                    ? '0 0 0 4px'
                    : '0 8px 0 4px'}"
                  >${city.label}</label
                ></span
              >
            `
          )}
        </div>
      `
    }
  )
}
