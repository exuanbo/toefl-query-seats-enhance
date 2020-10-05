import { Tabbale } from './tabbale'
import { State } from '../State'
import { TemplateResult, html } from 'lit-html'

export const App = (state: State): TemplateResult => {
  return html`
    <div id="progressWrapper"></div>
    ${state.get('city') !== undefined
      ? html`
          <div id="tables"></div>
        `
      : html`
          <div class="tabbable">${Tabbale(state)}</div>
        `}
  `
}
