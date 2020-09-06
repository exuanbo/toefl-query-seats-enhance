import { State } from '../lib/state'
import { html, nothing } from 'lit-html'
import { styleMap } from 'lit-html/directives/style-map.js'

const Progress = (state: State) => {
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
    width: `${state.progress}%`
  }

  return html`
    <div class="well" style=${styleMap(wellStyle)}>
      <div id="statusMsg">
        ${state.isComplete.val
          ? html`
              查询完成，找到&nbsp;${state.availableSeats}个可预定考位${state.err
                ? html`
                    。请求失败&nbsp;${state.err}次
                  `
                : nothing}
            `
          : html`
              正在查询中，剩余&nbsp;${state.cities
                ? html`
                    ${state.citiesLeft}个城市&nbsp;
                  `
                : nothing}${state.datesLeft}个日期
            `}
      </div>
      <div id="progress" class="progress progress-striped active" style=${styleMap(barStyle)}>
        <div class="bar" style=${styleMap(barWidth)}></div>
      </div>
    </div>
  `
}

export { Progress }
