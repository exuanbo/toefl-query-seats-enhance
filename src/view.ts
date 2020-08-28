import { html, nothing, render, TemplateResult } from 'lit-html'
import { Data, SeatDetail } from './seats'

const helper = {
  firstKeyOf: (obj: object) => Object.keys(obj)[0],
  isAvailable: (con: any, fn: Function) => {
    if (!con) {
      window.setTimeout(fn, 100)
      return false
    }
    return true
  },
  formatCurrency: (value: number) => 'RMB￥' + value.toFixed(2),
  isMunicipality: (cityName: string) =>
    cityName === '北京' ||
    cityName === '上海' ||
    cityName === '天津' ||
    cityName === '重庆'
}

const getSelectedCity = () => {
  const checkedCitiesArr: string[] = []
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]'
  ) as NodeListOf<HTMLInputElement>
  for (const box of checkboxes) {
    if (box.checked) checkedCitiesArr.push(box.id)
  }
  if (checkedCitiesArr.length) return checkedCitiesArr
  const selectedCity = document.getElementById(
    'centerProvinceCity'
  ) as HTMLInputElement
  return selectedCity.value
}

const getTestDatesArr = () => {
  const testDates: string[] = []
  const options = document.getElementById('testDays').childNodes as NodeListOf<
    HTMLInputElement
  >
  for (const el of options) {
    const day = el.value
    if (day && day !== '-1') testDates.push(day)
  }
  return testDates
}

const adjustStyle = () => {
  const formWrapper = (document.getElementById(
    'centerProvinceCity'
  ) as HTMLElement).parentElement.parentElement
  const selects = document.querySelectorAll(
    '.form-inline select'
  ) as NodeListOf<HTMLElement>
  if (!helper.isAvailable(formWrapper && selects, adjustStyle)) return

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

const renderTpl = (filteredData: Data) => {
  const rowTpl = (seat: SeatDetail) => html`
    <tr>
      <td style="text-align:center;vertical-align:middle;">
        ${helper.isMunicipality(seat.provinceCn)
          ? html`
              ${seat.cityCn}
            `
          : html`
              ${seat.provinceCn}&nbsp;${seat.cityCn}
            `}
      </td>
      <td style="text-align:center;vertical-align:middle;">
        <span
          ><a
            href="javascript:void(0);"
            onclick="showTestCenterInfo('考场信息', '${seat.centerCode}')"
            style="text-decoration:underline;"
            >${seat.centerCode}</a
          ></span
        >&nbsp;<span>${seat.centerNameCn}</span>
      </td>
      <td style="text-align:center;vertical-align:middle;">
        ${seat.lateRegFlag === 'Y'
          ? html`
              <span style="color:red;">*</span>
            `
          : nothing}
        <span
          ><strong>${helper.formatCurrency(seat.testFee / 100)}</strong></span
        >
        ${seat.lateRegFlag === 'Y'
          ? html`
              <br />(已包含逾期费附加费)
            `
          : nothing}
      </td>
      <td style="text-align:center;vertical-align:middle;">
        ${seat.seatStatus === -1
          ? '已截止'
          : seat.seatBookStatus === 1
          ? '有名额'
          : '名额暂满'}
      </td>
    </tr>
  `

  const seatsTpl = (data: Data) => html`
    ${!document.getElementById('qrySeatResult').children.length
      ? html`
          <h4>考位查询结果</h4>
          <div>
            "<span style="color:red;">*</span
            >"表示为逾期报名，需要缴纳逾期报名附加费${helper.formatCurrency(
              data.lateRegFee / 100
            )}
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
              >考试时间：${helper.firstKeyOf(data.testSeats).split('|')[0]}<span
                style="padding-left:30px;"
                >最晚到达时间：${helper
                  .firstKeyOf(data.testSeats)
                  .split('|')[2]}</span
              ></span
            >
          </th>
        </tr>
        <tr>
          <th style="text-align:center;vertical-align:middle;" width="20%">
            城市
          </th>
          <th style="text-align:center;vertical-align:middle;">考点</th>
          <th style="text-align:center;" width="20%">费用<br />(RMB￥)</th>
          <th style="text-align:center;vertical-align:middle;" width="10%">
            考位
          </th>
        </tr>
      </thead>
      <tbody>
        ${data.testSeats[helper.firstKeyOf(data.testSeats)].map(
          (seat: SeatDetail): TemplateResult =>
            html`
              ${rowTpl(seat)}
            `
        )}
      </tbody>
    </table>
  `
  return seatsTpl(filteredData)
}

const addCityCheckbox = () => {
  const provinceGroup = document.querySelectorAll(
    '#centerProvinceCity optgroup'
  ) as NodeListOf<HTMLOptGroupElement>
  if (!helper.isAvailable(provinceGroup.length, addCityCheckbox)) return
  if (
    !helper.isAvailable(
      provinceGroup[provinceGroup.length - 1].label === '浙江',
      addCityCheckbox
    )
  )
    return

  const selectCity = document.getElementById('centerProvinceCity')
  const formWrapper = selectCity.parentElement.parentElement.parentElement
  const style = `max-width:fit-content;margin:4px 0 0 ${selectCity.offsetLeft -
    selectCity.parentElement
      .offsetLeft}px;padding:.5em;border:1px solid #ccc;border-radius:4px;`
  formWrapper.insertAdjacentHTML(
    'beforeend',
    `<div id="checkboxes" class="hide" style="${style}"></div>`
  )
  const checkboxWrapper = document.getElementById('checkboxes')

  const checkboxWrapperTpl: TemplateResult[] = []
  for (const province of provinceGroup) {
    const provinceName = province.label
    const cities = province.childNodes as NodeListOf<HTMLOptionElement>
    const citiesTpl: TemplateResult[] = []

    for (const city of cities) {
      const template = html`
        ${helper.isMunicipality(city.label)
          ? nothing
          : html`
              ${city === cities.item(0)
                ? html`
                    <span
                      class="muted"
                      style="${provinceName.length === 3
                        ? nothing
                        : 'margin-right:1em;'}"
                      >${provinceName}：</span
                    >
                  `
                : nothing}
            `}<span
          style="${helper.isMunicipality(city.label) ? 'margin-left:4em;' : ''}"
          ><input
            type="checkbox"
            id="${city.value}"
            style="margin:0 0 2px;"
          />&nbsp;<label for="${city.value}" style="display:inline;"
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
  render(checkboxWrapperTpl, checkboxWrapper)

  const toggleAllCheckboxes = () => {
    const allCheckboxes = document.querySelectorAll(
      'input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>
    for (const checkbox of allCheckboxes) {
      checkbox.checked = !checkbox.checked
    }
  }
  checkboxWrapper.insertAdjacentHTML(
    'afterbegin',
    '<span id="toggleAllCheckboxesWrapper" style="float:right;font-size:13px;text-decoration:underline;"></span'
  )
  const toggleAllCheckboxesBtnTpl = html`
    <a href="javascript:void(0);" @click=${toggleAllCheckboxes}>全选/反选</a>
  `
  render(
    toggleAllCheckboxesBtnTpl,
    document.getElementById('toggleAllCheckboxesWrapper')
  )
}

const toggleExpand = () => {
  document.getElementById('checkboxes').classList.toggle('hide')
}

const addExpandBtn = () => {
  document
    .getElementById('centerProvinceCity')
    .insertAdjacentHTML('afterend', '<span id="expandBtnWrapper"></span>')
  const btnTpl = html`
    &nbsp;<button id="expandBtn" class="btn" @click=${toggleExpand}>
      展开多选
    </button>
  `
  render(btnTpl, document.getElementById('expandBtnWrapper'))
}

const addQueryBtn = (fn: Function) => {
  document
    .getElementById('expandBtn')
    .insertAdjacentHTML('afterend', '<span id="queryBtnWrapper"></span>')
  const btnTpl = html`
    <button
      id="queryBtn"
      class="btn btn-primary"
      @click=${fn}
      style="margin-left:13px;"
    >
      查询全部日期
    </button>
  `
  render(btnTpl, document.getElementById('queryBtnWrapper'))
}

export {
  helper,
  getSelectedCity,
  getTestDatesArr,
  adjustStyle,
  clearResult,
  renderTpl,
  addCityCheckbox,
  toggleExpand,
  addExpandBtn,
  addQueryBtn
}
