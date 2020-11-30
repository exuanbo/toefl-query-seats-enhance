import { State } from '../State'
import { TemplateResult, html, nothing } from 'lit-html'
import { styleMap } from 'lit-html/directives/style-map.js'

export const Progress = ({ get }: State): TemplateResult => {
  const btn = document.getElementById('btnQuerySeat')
  const label = document.querySelector<HTMLElement>(
    'label[for="centerProvinceCity"]'
  )
  const barStyle = {
    margin: '1em auto 0',
    width: `${btn.offsetLeft - label.offsetLeft + label.offsetWidth}px`
  }
  const wellStyle = {
    ...barStyle,
    textAlign: 'center'
  }
  const barWidth = {
    width: `${get('isComplete') ? 100 : get('progress')}%`
  }

  return html`
    <div class="well" style=${styleMap(wellStyle)}>
      <div id="statusMsg">
        ${get('isComplete')
          ? html`
              查询完成，找到&nbsp;${get('availableSeats')}个可预定考位${get(
                'err'
              ) > 0
                ? html`。请求失败&nbsp;${get('err')}次`
                : nothing}
            `
          : html`
              正在查询中，剩余&nbsp;${get('cities') !== undefined
                ? html`${get('citiesLeft')}个城市&nbsp;`
                : nothing}${get('datesLeft')}个日期
            `}
      </div>
      <div
        id="progress"
        class="progress progress-striped"
        style=${styleMap(barStyle)}
      >
        <div class="bar" style=${styleMap(barWidth)}></div>
      </div>
    </div>
  `
}
