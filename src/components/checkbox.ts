import { forEachElOf, mapNodeList, isMunicipality } from '../lib/utils'
import { TemplateResult, html, nothing } from 'lit-html'

export const Checkbox = () => {
  return html`
    <span
      id="toggleAllCheckboxesBtnWrapper"
      style="float:right;font-size:13px;text-decoration:underline;"
    >
      <a href="javascript:void(0);" @click=${toggle}>全选/反选</a>
    </span>
    ${loopProvinceGroup()}
  `

  function toggle () {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<
      HTMLInputElement
    >
    forEachElOf(allCheckboxes, box => {
      box.checked = !box.checked
    })
  }

  function loopProvinceGroup () {
    const provinceGroups = document.querySelectorAll('#centerProvinceCity optgroup') as NodeListOf<
      HTMLOptGroupElement
    >

    return mapNodeList(
      provinceGroups,
      (provinceGroup): TemplateResult => {
        const provinceName = provinceGroup.label
        const cities = provinceGroup.childNodes as NodeListOf<HTMLOptionElement>

        return html`
          <div>
            ${mapNodeList(
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
}
