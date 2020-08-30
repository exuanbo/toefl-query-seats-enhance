import * as Utils from './utils'
import { QueryData, SeatDetail } from './seat'
import { TemplateResult, html, nothing } from 'lit-html'
import { styleMap } from 'lit-html/directives/style-map.js'

const checkboxWrapper = (provinceGroup: NodeListOf<HTMLOptGroupElement>) => {
  const template: TemplateResult[] = [
    html`
      <span
        id="toggleAllCheckboxesBtnWrapper"
        style="float:right;font-size:13px;text-decoration:underline;"
      >
        ${toggleAllCheckboxesBtn()}
      </span>
    `
  ]

  function toggleAllCheckboxesBtn () {
    const toggle = () => {
      const allCheckboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<
        HTMLInputElement
      >
      for (const checkbox of allCheckboxes) {
        checkbox.checked = !checkbox.checked
      }
    }

    return html`
      <a href="javascript:void(0);" @click=${toggle}>全选/反选</a>
    `
  }

  for (const province of provinceGroup) {
    const provinceName = province.label
    const cities = province.childNodes as NodeListOf<HTMLOptionElement>
    const citiesTpl: TemplateResult[] = []

    for (const city of cities) {
      const template = html`
        ${Utils.isMunicipality(city.label)
          ? nothing
          : html`
              ${city === cities.item(0)
                ? html`
                    <span
                      class="muted"
                      style="${provinceName.length === 3 ? nothing : 'margin-right:1em;'}"
                      >${provinceName}：</span
                    >
                  `
                : nothing}
            `}<span style="${Utils.isMunicipality(city.label) ? 'margin-left:4em;' : ''}"
          ><input type="checkbox" id="${city.value}" style="margin:0 0 2px;" />&nbsp;<label
            for="${city.value}"
            style="display:inline;"
            >${city.label}</label
          >&nbsp;</span
        >
      `
      citiesTpl.push(template)
    }

    const provinceBlockTpl = html`
      <div>${citiesTpl}</div>
    `
    template.push(provinceBlockTpl)
  }

  return template
}

const expandBtn = (fn: Function) => {
  return html`
    &nbsp;<button id="expandBtn" class="btn" @click=${fn}>
      展开多选
    </button>
  `
}

const queryBtn = (fn: Function) => {
  return html`
    <button id="queryBtn" class="btn btn-primary" @click=${fn} style="margin-left:13px;">
      查询全部日期
    </button>
  `
}

const tableTitle = (data: QueryData) => html`
  <h4>考位查询结果</h4>
  <div>
    "<span style="color:red;">*</span>"表示为逾期报名，需要缴纳逾期报名附加费${Utils.formatCurrency(
      data.lateRegFee / 100
    )}
  </div>
`

const table = (filteredData: QueryData) => {
  const stylesMiddle = {
    textAlign: 'center',
    verticalAlign: 'middle'
  }

  const tableTpl = (data: QueryData) => html`
    <table class="table table-bordered" style="margin-top:12px;font-size:16px;">
      <thead>
        <tr style="background-color:#993333;">
          <th colspan="4">
            <span style="color:#fff;">考试日期：${data.testDate}</span
            ><span style="margin-left:.5em;color:#fff;"
              ><i class="fa fa-calendar-check-o" aria-hidden="true"></i></span
            ><span style="color:#fff;float:right;"
              >考试时间：${Utils.firstKeyOf(data.testSeats).split('|')[0]}<span
                style="padding-left:30px;"
                >最晚到达时间：${Utils.firstKeyOf(data.testSeats).split('|')[2]}</span
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
        ${data.testSeats[Utils.firstKeyOf(data.testSeats)].map(
          (seat: SeatDetail): TemplateResult =>
            html`
              ${rowTpl(seat)}
            `
        )}
      </tbody>
    </table>
  `

  const rowTpl = (seat: SeatDetail) => html`
    <tr>
      <td style=${styleMap(stylesMiddle)}>
        ${Utils.isMunicipality(seat.provinceCn)
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
        >&nbsp;<span>${seat.centerNameCn}</span>
      </td>
      <td style=${styleMap(stylesMiddle)}>
        ${seat.lateRegFlag === 'Y'
          ? html`
              <span style="color:red;">*</span>
            `
          : nothing}
        <span><strong>${Utils.formatCurrency(seat.testFee / 100)}</strong></span>
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

  return tableTpl(filteredData)
}

export { checkboxWrapper, expandBtn, queryBtn, tableTitle, table }
