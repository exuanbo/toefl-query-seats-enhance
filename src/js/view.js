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
  const formatCurrency = value => {
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

export { getTestCity, getTestDatesArr, clearResult, renderResult, addNewQueryBtn }
