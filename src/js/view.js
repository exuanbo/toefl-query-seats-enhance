const addNewQueryBtn = () => {
  document.getElementById('btnQuerySeat').insertAdjacentHTML('afterend', '&nbsp;<button id="newQueryBtn" class="btn btn-primary">查询全部日期</button>')
}

const popUpMsg = (msg, time) => {
  layer.msg(msg, {
    time: time,
    icon: 0,
    shift: 0
  })
}

const renderResults = data => {
  var formatCurrency = formatCurrency = value => {
    return "RMB￥" + value.toFixed(2)
  }

  if (data.status === true) {
    const tmpl = $.templates('testSeatListTemplate', {
      markup: '#testSeatListTpl',
      helpers: {
        formatCurrency: formatCurrency
      }
    })

    const dataDate = Object.keys(data.testSeats)[0]
    const SeatsArr = data.testSeats[dataDate]
    const newSeatsArr = []
    for(const seat of SeatsArr) {
      if(seat.seatStatus) newSeatsArr.push(seat)
    }

    if (newSeatsArr.length) {
      data.testSeats[dataDate] = newSeatsArr
      const html = tmpl.render(data)
      document.getElementById('qrySeatResult').insertAdjacentHTML('beforeend', html)
      return 1
    }
  }

  return 0
}

export { addNewQueryBtn, popUpMsg, renderResults }
