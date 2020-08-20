const addNewQueryBtn = () => {
  document.getElementById('btnQuerySeat').insertAdjacentHTML('afterend', '&nbsp;<button id="newQueryBtn" class="btn btn-primary">查询全部日期</button>')
}

const popUpMsg = (msg, time, icon = 0) => {
  layer.msg(msg, {
    time: time,
    icon: icon,
    shift: 0
  })
}

const renderResult = filteredData => {
  var formatCurrency = formatCurrency = value => {
    return "RMB￥" + value.toFixed(2)
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

export { addNewQueryBtn, popUpMsg, renderResult }
