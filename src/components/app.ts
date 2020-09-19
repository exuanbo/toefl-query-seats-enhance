import { Tabbale } from './tabbale'
import { State } from '../lib/state'
import { TemplateResult, html } from 'lit-html'

export const App = (state: State): TemplateResult => {
  return html`
    <div id="progressWrapper"></div>
    ${state.city
      ? html`
          <div id="tables"></div>
        `
      : html`
          <div class="tabbable">${Tabbale(state)}</div>
        `}
  `
}
