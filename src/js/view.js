const getTestCity = () => {
  return document.getElementById('centerProvinceCity').value
}

const getTestDatesArr = () => {
  const testDates = []
  document.getElementById('testDays').childNodes.forEach(e => {
    const day = e.value
    if (day && day !== '-1') testDates.push(day)
  })
  return testDates
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

const addNewQueryBtn = () => {
  const btnHtml = '&nbsp;<button id="newQueryBtn" class="btn btn-primary">查询全部日期</button>'
  document.getElementById('btnQuerySeat').insertAdjacentHTML('afterend', btnHtml)
}

export { getTestCity, getTestDatesArr, clearResult, renderResult, addNewQueryBtn }
