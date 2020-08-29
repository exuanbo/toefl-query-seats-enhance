import * as Utils from './utils'
import { QueryData, SeatDetail } from './seats'
import axios, { AxiosResponse } from 'axios'
import { html, nothing, render, TemplateResult } from 'lit-html'
import { styleMap } from 'lit-html/directives/style-map.js'

const adjustStyle = () => {
  const formWrapper = document.getElementById('centerProvinceCity').parentElement.parentElement
  const selects = document.querySelectorAll('.form-inline select') as NodeListOf<HTMLElement>
  if (!Utils.isAvailable(formWrapper && selects, adjustStyle)) return

  formWrapper.classList.remove('offset1')
  formWrapper.style.textAlign = 'center'
  for (const select of selects) {
    select.style.width = '12em'
  }
}

const clearResult = () => {
  render(
    html`
      ${nothing}
    `,
    document.getElementById('qrySeatResult')
  )
}

const getSelectedCity = () => {
  const checkedCities: string[] = []
  const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<
    HTMLInputElement
  >
  for (const box of checkboxes) {
    if (box.checked) checkedCities.push(box.id)
  }
  if (checkedCities.length) return checkedCities
  const selectedCity = document.getElementById('centerProvinceCity') as HTMLInputElement
  return selectedCity.value
}

const getDates = () => {
  const dates: string[] = []
  const options = document.getElementById('testDays').childNodes as NodeListOf<HTMLInputElement>
  for (const el of options) {
    const day = el.value
    if (day && day !== '-1') dates.push(day)
  }
  return dates
}

const getData = async (city: string, date: string): Promise<AxiosResponse<QueryData>> => {
  return axios
    .get('testSeat/queryTestSeats', {
      params: {
        city: city,
        testDay: date
      }
    })
}

const renderTableTpl = (filteredData: QueryData) => {
  const stylesMiddle = {
    textAlign: 'center',
    verticalAlign: 'middle'
  }

  const seatsTpl = (data: QueryData) => html`
    ${!document.getElementById('qrySeatResult').children.length
      ? html`
          <style>
            .ta-center-va-middle {
              text-align: center;
              vertical-align: middle;
            }
          </style>
          <h4>考位查询结果</h4>
          <div>
            "<span style="color:red;">*</span
            >"表示为逾期报名，需要缴纳逾期报名附加费${Utils.formatCurrency(data.lateRegFee / 100)}
          </div>
        `
      : nothing}
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
        ${seat.seatStatus === -1 ? '已截止' : seat.seatBookStatus === 1 ? '有名额' : '名额暂满'}
      </td>
    </tr>
  `

  return seatsTpl(filteredData)
}

const addComponent = {
  checkbox: () => {
    const provinceGroup = document.querySelectorAll('#centerProvinceCity optgroup') as NodeListOf<
      HTMLOptGroupElement
    >
    if (!Utils.isAvailable(provinceGroup.length, addComponent.checkbox)) return
    if (
      !Utils.isAvailable(provinceGroup[provinceGroup.length - 1].label === '浙江', addComponent.checkbox)
    )
      return


    const checkboxWrapperTpl: TemplateResult[] = []
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
      checkboxWrapperTpl.push(provinceBlockTpl)
    }

    const selectCity = document.getElementById('centerProvinceCity')
    const formWrapper = selectCity.parentElement.parentElement.parentElement
    const style = `max-width:fit-content;margin:4px 0 0 ${selectCity.offsetLeft -
      selectCity.parentElement.offsetLeft}px;padding:.5em;border:1px solid #ccc;border-radius:4px;`
    formWrapper.insertAdjacentHTML(
      'beforeend',
      `<div id="checkboxes" class="hide" style="${style}"></div>`
    )
    const checkboxWrapper = document.getElementById('checkboxes')
    render(checkboxWrapperTpl, checkboxWrapper)

    checkboxWrapper.insertAdjacentHTML(
      'afterbegin',
      '<span id="toggleAllCheckboxesWrapper" style="float:right;font-size:13px;text-decoration:underline;"></span'
    )
    const toggleAllCheckboxesBtnTpl = html`
      <a href="javascript:void(0);" @click=${toggleAllCheckboxes}>全选/反选</a>
    `
    render(toggleAllCheckboxesBtnTpl, document.getElementById('toggleAllCheckboxesWrapper'))
  },

  expandBtn: () => {
    document
      .getElementById('centerProvinceCity')
      .insertAdjacentHTML('afterend', '<span id="expandBtnWrapper"></span>')
    const btnTpl = html`
      &nbsp;<button id="expandBtn" class="btn" @click=${toggleExpand}>
        展开多选
      </button>
    `
    render(btnTpl, document.getElementById('expandBtnWrapper'))
  },

  queryBtn: (fn: Function) => {
    document
      .getElementById('expandBtn')
      .insertAdjacentHTML('afterend', '<span id="queryBtnWrapper"></span>')
    const btnTpl = html`
      <button id="queryBtn" class="btn btn-primary" @click=${fn} style="margin-left:13px;">
        查询全部日期
      </button>
    `
    render(btnTpl, document.getElementById('queryBtnWrapper'))
  }
}

const toggleExpand = () => {
  document.getElementById('checkboxes').classList.toggle('hide')
}

const toggleAllCheckboxes = () => {
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<
    HTMLInputElement
  >
  for (const checkbox of allCheckboxes) {
    checkbox.checked = !checkbox.checked
  }
}

export {
  adjustStyle,
  clearResult,
  getSelectedCity,
  getDates,
  getData,
  renderTableTpl,
  addComponent,
  toggleExpand
}
