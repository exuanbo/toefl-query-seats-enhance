import * as Utils from '../lib/utils'
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
    for (const checkbox of allCheckboxes) {
      checkbox.checked = !checkbox.checked
    }
  }

  function loopProvinceGroup () {
    const provinceGroups = document.querySelectorAll('#centerProvinceCity optgroup') as NodeListOf<
      HTMLOptGroupElement
    >
    const provinceGroupsTpl: TemplateResult[] = []

    for (const provinceGroup of provinceGroups) {
      const provinceName = provinceGroup.label
      const cities = provinceGroup.childNodes as NodeListOf<HTMLOptionElement>
      const citiesTpl: TemplateResult[] = []

      for (const city of cities) {
        const tpl = html`
          ${Utils.isMunicipality(city.label)
            ? nothing
            : html`
                ${city === cities.item(0)
                  ? html`
                      <span
                        class="muted"
                        style="${provinceName.length === 3 ? '' : 'margin-right:1em;'}"
                        >${provinceName}：</span
                      >
                    `
                  : nothing}
              `}<span style="${Utils.isMunicipality(city.label) ? 'margin-left:4em;' : ''}"
            ><input type="checkbox" id=${city.value} style="margin:0 0 2px;" />&nbsp;<label
              for=${city.value}
              style="display:inline;"
              >${city.label}</label
            >&nbsp;</span
          >
        `
        citiesTpl.push(tpl)
      }

      const provinceBlock = html`
        <div>${citiesTpl}</div>
      `
      provinceGroupsTpl.push(provinceBlock)
    }

    return provinceGroupsTpl
  }
}
