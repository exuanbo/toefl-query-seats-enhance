const getSelectedCity = () => {
  const checkedCitiesArr = []
  const checkboxes = document.querySelectorAll('input[type="checkbox"]')
  for (const box of checkboxes) {
    if (box.checked) checkedCitiesArr.push(box.id)
  }
  return checkedCitiesArr.length ? checkedCitiesArr : document.getElementById('centerProvinceCity').value
}

const getTestDatesArr = () => {
  const testDates = []
  document.getElementById('testDays').childNodes.forEach(e => {
    const day = e.value
    if (day && day !== '-1') testDates.push(day)
  })
  return testDates
}

const adjustStyle = () => {
  const formWrapper = document.getElementById('centerProvinceCity').parentElement.parentElement
  formWrapper.classList.remove('offset1')
  formWrapper.style.textAlign = 'center'

  const select = document.querySelectorAll('.form-inline select').forEach(el => {
    el.style.width = '12em'
  })
}

const clearResult = () => {
  document.getElementById('qrySeatResult').innerHTML = ''
}

const renderResult = filteredData => {
  const qrySeatResult = document.getElementById('qrySeatResult')
  const helper = { formatCurrency: value => 'RMB￥' + value.toFixed(2) }
  const tplHtml = `
    ${!qrySeatResult.hasChildNodes() ? '<h4>考位查询结果</h4><div><div>"<span style="color:red;">*</span>"表示为逾期报名，需要缴纳逾期报名附加费{{:~formatCurrency(lateRegFee/100)}}</div>' : '<div>'}
      {{props testSeats}}
        <table class="table table-bordered" style="margin-top:12px;font-size:16px;">
          <thead>
            <tr style="background-color:#993333;">
              <th colspan="4"><span style="color:#fff;">考试日期：{{:#parent.parent.data.testDate}}</span><span style="margin-left:.5em;color: #fff;"><i class="fa fa-calendar-check-o" aria-hidden="true"></i></span><span style="color:#fff;float:right;">考试时间：{{:key.split("|")[0]}}<span style="padding-left:30px;">最晚到达时间：{{:key.split("|")[2]}}</span></span></th>
            </tr>
            <tr>
              <th style="text-align:center;vertical-align:middle;" width="20%">城市</th>
              <th style="text-align:center;vertical-align:middle;">考点</th>
              <th style="text-align:center;" width="20%">费用<br/>(RMB￥)</th>
              <th style="text-align:center;vertical-align:middle;" width="10%">考位</th>
            </tr>
          </thead>
          <tbody>
            {{props prop}}
              <tr>
                <td style="text-align:center;vertical-align:middle;">
                  {{if prop.provinceCn=="北京" || prop.provinceCn=="上海" || prop.provinceCn=="天津" || prop.provinceCn=="重庆"}}
                    {{:prop.cityCn}}
                  {{else}}
                    {{:prop.provinceCn}} {{:prop.cityCn}}
                  {{/if}}
                </td>
                <td style="text-align:center;vertical-align:middle;"><span><a href="javascript:void(0);" onclick="showTestCenterInfo('考场信息','{{:prop.centerCode}}');" style="text-decoration:underline;">{{:prop.centerCode}}</a></span> <span>{{:prop.centerNameCn}}</span></td>
                <td style="text-align:center;vertical-align:middle;">{{if prop.lateRegFlag=='Y'}}<span style="color:red;">*</span>{{/if}}<span><strong>{{:~formatCurrency(prop.testFee/100)}}</strong></span>{{if prop.lateRegFlag=='Y'}}<br/>(已包含逾期费附加费){{/if}}</td>
                <td style="text-align:center;vertical-align:middle;">
                  {{if prop.seatStatus==-1}}
                    已截止
                  {{else prop.seatStatus==1}}
                    有名额
                  {{else}}
                    名额暂满
                  {{/if}}
                </td>
              </tr>
            {{/props}}
          </tbody>
        </table>
      {{/props}}
    </div>
  `
  const tpl = $.templates(tplHtml)
  const html = tpl.render(filteredData, helper)
  qrySeatResult.insertAdjacentHTML('beforeend', html)
}

const addCityCheckbox = () => {
  const provinceGroup = document.querySelectorAll('#centerProvinceCity optgroup')
  if (!provinceGroup.length) {
    window.setTimeout(addCityCheckbox, 100)
    return
  }

  const selectCity = document.getElementById('centerProvinceCity')
  const formWrapper = selectCity.parentElement.parentElement.parentElement
  const style = 'max-width:fit-content;margin-top:4px;padding:.5em;border:1px solid #ccc;border-radius:4px;'
  formWrapper.insertAdjacentHTML('beforeend', `<div id="checkboxes" class="hide" style="${style}"></div>`)
  const checkboxWrapper = document.getElementById('checkboxes')

  const a = selectCity.parentElement.offsetLeft
  const b = selectCity.offsetLeft
  checkboxWrapper.style.marginLeft = `${b - a}px`

  for (const province of provinceGroup) {
    const provinceName = province.label
    const cities = province.children
    const provinceBlock = []

    for (const city of cities) {
      const isMunicipality = cities.length === 1 && (city.label === '北京' || city.label === '上海' || city.label === '天津' || city.label === '重庆')
      const isFirst = city === cities.item(0)
      const template = `${isMunicipality ? '' : `${isFirst ? `<span class="muted">${provinceName}：</span>` : '' }` }<span><label for="${city.value}" style="display:inline;">${city.label}</label>&nbsp;<input type="checkbox" id="${city.value}" style="margin:0 0 2px;"></span>`
      provinceBlock.push(template)
    }

    const html = '<div>' + provinceBlock.join('&nbsp;') + '</div>'
    checkboxWrapper.insertAdjacentHTML('beforeend', html)
  }

  const toggleLink = '<a href="javascript:void(0);" id="toggleLink" style="float:right;font-size:13px;text-decoration:underline;">全选/反选</a>'
  checkboxWrapper.insertAdjacentHTML('afterbegin', toggleLink)
  const toggleSelectAll = () => {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]')
    allCheckboxes.forEach(el => {
      el.checked = !el.checked
    })
  }
  document.getElementById('toggleLink').addEventListener('click', toggleSelectAll)
}

const addExpandBtn = () => {
  const btnHtml = '&nbsp;&nbsp;&nbsp;<button id="expandBtn" class="btn">展开多选</button>'
  document.getElementById('centerProvinceCity').insertAdjacentHTML('afterend', btnHtml)
}

const toggleExpand = () => {
  document.getElementById('checkboxes').classList.toggle('hide')
}

const addNewQueryBtn = () => {
  const btnHtml = '&nbsp;<button id="newQueryBtn" class="btn btn-primary">查询全部日期</button>'
  document.getElementById('expandBtn').insertAdjacentHTML('afterend', btnHtml)
}

export {
  getSelectedCity,
  getTestDatesArr,
  adjustStyle,
  clearResult,
  renderResult,
  addCityCheckbox,
  addExpandBtn,
  toggleExpand,
  addNewQueryBtn
}
