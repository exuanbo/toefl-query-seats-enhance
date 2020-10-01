import { State } from '../lib/state'
import { TemplateResult, html, nothing } from 'lit-html'
import { styleMap } from 'lit-html/directives/style-map.js'

export const Progress = (state: State): TemplateResult => {
  const btn = document.getElementById('btnQuerySeat')
  const label = document.querySelector('label[for="centerProvinceCity"]') as HTMLElement
  const barStyle = {
    margin: '1em auto 0',
    width: `${btn.offsetLeft - label.offsetLeft + label.offsetWidth}px`
  }
  const wellStyle = {
    ...barStyle,
    textAlign: 'center'
  }
  const barWidth = {
    width: `${state.get('isComplete') ? 100 : state.get('progress')}%`
  }

  return html`
    <div class="well" style=${styleMap(wellStyle)}>
      <div id="statusMsg">
        ${state.get('isComplete')
          ? html`
              查询完成，找到&nbsp;${state.get('availableSeats')}个可预定考位${state.get('err')
                ? html`
                    。请求失败&nbsp;${state.get('err')}次
                  `
                : nothing}
            `
          : html`
              正在查询中，剩余&nbsp;${state.get('cities')
                ? html`
                    ${state.get('citiesLeft')}个城市&nbsp;
                  `
                : nothing}${state.get('datesLeft')}个日期
            `}
      </div>
      <div id="progress" class="progress progress-striped" style=${styleMap(barStyle)}>
        <div class="bar" style=${styleMap(barWidth)}></div>
      </div>
    </div>
  `
}
