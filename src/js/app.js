import * as View from './View'
import { filterSeats } from './Seats'

const timer = ms => {
 return new Promise(res => setTimeout(res, ms))
}

const query = () => {
  const testCity = document.getElementById('centerProvinceCity').value
  if (testCity === '-1') {
    return View.popUpMsg("请选择考点所在城市", 2000)
  }

  const testDays = []
  document.getElementById('testDays').childNodes.forEach(e => {
    const day = e.value
    if (day && day !== '-1') testDays.push(day)
  })

  document.getElementById('qrySeatResult').innerHTML = ''
  View.popUpMsg(`正在查询中，请耐心等待${testDays.length}秒左右`, testDays.length * 1000, 6)

  ;(async () => {
    let availableSeats = 0
    let errNum = 0

    for(const day of testDays) {
      $.getJSON(
        'testSeat/queryTestSeats',
        {
          city: testCity,
          testDay: day
        },
        data => {
          const result = filterSeats(data)
          if(result) {
            availableSeats++
            View.renderResult(result)
          }
        }
      ).fail(err => errNum++)

      if(day !== testDays[testDays.length - 1]) {
        await timer(1000)
      } else if(errNum) {
        layer.alert(`服务器刚才打了${errNum}个盹儿，请重新查询`)
      } else if(!availableSeats) {
        View.popUpMsg("暂无可预定考位信息", 2000, 5)
      }
    }
  })()
}

const observeDom = () => {
  const callback = (_, observer) => {
    if(window.location.href.toString().split('#!')[1] === '/testSeat') {
      View.addNewQueryBtn()
      document.getElementById('newQueryBtn').addEventListener('click', query)
    }
  }

  const observer = new MutationObserver(callback)

  const addObserverIfNodeAvailable = () => {
    const targetNode = document.getElementById('wg_center')
    if(!targetNode) {
      window.setTimeout(addObserverIfNodeAvailable, 100)
      return
    }
    const config = { childList: true }
    observer.observe(targetNode, config)
  }

  addObserverIfNodeAvailable()
}

observeDom()
