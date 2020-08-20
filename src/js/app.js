import * as view from './view'

const timer = ms => {
 return new Promise(res => setTimeout(res, ms))
}

const query = () => {
  const testCity = document.getElementById('centerProvinceCity').value
  if (testCity === '-1') {
    return view.popUpMsg("请选择考点所在城市", 2000)
  }

  const testDays = []
  document.getElementById('testDays').childNodes.forEach(e => {
    const day = e.value
    if (day && day !== '-1') testDays.push(day)
  })

  document.getElementById('qrySeatResult').innerHTML = ''
  view.popUpMsg('正在查询中，请耐心等待20秒左右', 20000)

  ;(async () => {
    let availableSeats = 0
    for(const day of testDays) {
      $.getJSON(
        'testSeat/queryTestSeats',
        {
          city: testCity,
          testDay: day
        },
        data => {
          if(view.renderResults(data)) availableSeats++
        }
      )

      if(day !== testDays[testDays.length - 1]) {
        await timer(750)
      } else if(!availableSeats) {
        view.popUpMsg("暂无可预定考位信息", 2000)
      }
    }
  })()
}

const observeDom = () => {
  const targetNode = document.getElementById('wg_center')
  const config = { childList: true }
  const callback = (_, observer) => {
    if(window.location.href.toString().split('#!')[1] === '/testSeat') {
      view.addNewQueryBtn()
      document.getElementById('newQueryBtn').addEventListener('click', query)
    }
  }

  const observer = new MutationObserver(callback)
  observer.observe(targetNode, config)
}

observeDom()
