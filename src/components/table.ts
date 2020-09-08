import { firstKeyOf, isMunicipality, formatCurrency } from '../lib/utils'
import { QueryData, SeatDetail } from '../lib/data'
import { TemplateResult, html, nothing } from 'lit-html'
import { styleMap } from 'lit-html/directives/style-map.js'

export const Table = (data: QueryData) => {
  const stylesMiddle = {
    textAlign: 'center',
    verticalAlign: 'middle'
  }

  return html`
    <thead>
      <tr style="background-color:#993333;">
        <th colspan="4">
          <span style="color:#fff;">考试日期：${data.testDate}</span
          ><span style="margin-left:.5em;color:#fff;"
            ><i class="fa fa-calendar-check-o" aria-hidden="true"></i></span
          ><span style="color:#fff;float:right;"
            >考试时间：${firstKeyOf(data.testSeats).split('|')[0]}<span style="padding-left:30px;"
              >最晚到达时间：${firstKeyOf(data.testSeats).split('|')[2]}</span
            ></span
          >
        </th>
      </tr>
      <tr>
        <th style=${styleMap(stylesMiddle)} width="20%">
          城市
        </th>
        <th style=${styleMap(stylesMiddle)}>考点</th>
        <th style="text-align:center;" width="20%">费用<br />(RMB￥)</th>
        <th style=${styleMap(stylesMiddle)} width="10%">
          考位
        </th>
      </tr>
    </thead>
    <tbody>
      ${data.testSeats[firstKeyOf(data.testSeats)].map(
        (seat: SeatDetail): TemplateResult =>
          html`
            ${rowTpl(seat)}
          `
      )}
    </tbody>
  `

  function rowTpl (seat: SeatDetail) {
    return html`
      <tr>
        <td style=${styleMap(stylesMiddle)}>
          ${isMunicipality(seat.provinceCn)
            ? html`
                ${seat.cityCn}
              `
            : html`
                ${seat.provinceCn}&nbsp;${seat.cityCn}
              `}
        </td>
        <td style=${styleMap(stylesMiddle)}>
          <span
            ><a
              href="javascript:void(0);"
              onclick="showTestCenterInfo('考场信息', '${seat.centerCode}')"
              style="text-decoration:underline;"
              >${seat.centerCode}</a
            ></span
          ><span style="margin-left:8px;">${seat.centerNameCn}</span>
        </td>
        <td style=${styleMap(stylesMiddle)}>
          ${seat.lateRegFlag === 'Y'
            ? html`
                <span style="color:#FF0000;">*</span>
              `
            : nothing}
          <span><strong>${formatCurrency(seat.testFee / 100)}</strong></span>
          ${seat.lateRegFlag === 'Y'
            ? html`
                <br />(已包含逾期费附加费)
              `
            : nothing}
        </td>
        <td style=${styleMap(stylesMiddle)}>
          ${seat.seatStatus === -1 ? '已截止' : seat.seatStatus === 1 ? '有名额' : '名额暂满'}
        </td>
      </tr>
    `
  }
}
