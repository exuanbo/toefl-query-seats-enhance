const getTestCity = () => {
  return document.getElementById('centerProvinceCity').value
}

const getTestDaysArray = () => {
  const testDays = []
  document.getElementById('testDays').childNodes.forEach(e => {
    const day = e.value
    if (day && day !== '-1') testDays.push(day)
  })
  return testDays
}

const clearResult = () => {
  document.getElementById('qrySeatResult').innerHTML = ''
}

const renderResult = filteredData => {
  var formatCurrency = formatCurrency = value => {
    return 'RMB￥' + value.toFixed(2)
  }

  const tmpl = $.templates('testSeatListTemplate', {
    markup: '#testSeatListTpl',
    helpers: {
      formatCurrency: formatCurrency
    }
  })

  const html = tmpl.render(filteredData)
  document.getElementById('qrySeatResult').insertAdjacentHTML('beforeend', html)
}

const addNewQueryBtn = () => {
  document.getElementById('btnQuerySeat').insertAdjacentHTML('afterend', '&nbsp;<button id="newQueryBtn" class="btn btn-primary">查询全部日期</button>')
}

export { getTestCity, getTestDaysArray, clearResult, renderResult, addNewQueryBtn }
