import { translateCityName } from '../lib/utils'
import { State } from '../lib/state'
import { TemplateResult, html } from 'lit-html'

export const Tabbale = (state: State): TemplateResult => {
  const cities = state.get('cities')

  return html`
    <ul class="nav nav-tabs" style="margin:1em auto 0;width:fit-content;">
      ${cities.map(
        city => html`
          <li class="${cities.indexOf(city) === 0 ? 'active' : ''}">
            <a href="#tab-${city}" data-toggle="tab">${translateCityName(city)}</a>
          </li>
        `
      )}
    </ul>
    <div class="tab-content">
      ${cities.map(
        city => html`
          <div
            class="tab-pane ${cities.indexOf(city) === 0 ? 'active' : ''}"
            id="tab-${city}"
          ></div>
        `
      )}
    </div>
  `
}
