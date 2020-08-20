import * as View from './View'
import { filterSeats } from './Seats'

const sleep = ms => {
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

  ;(async () => {
    let availableSeats = 0
    let errNum = 0

    for(const day of testDays) {
      View.popUpMsg(`正在查询中，剩余${testDays.length - testDays.indexOf(day)}个日期`, 1500, { icon: 6, anim: testDays.indexOf(day) === 0 ? 0 : -1 })
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
        await sleep(1000)
      } else if(errNum) {
        layer.alert(`服务器刚才打了个盹儿，漏掉了${errNum}个结果`)
      } else if(!availableSeats) {
        View.popUpMsg("暂无可预定考位信息", 2000, { icon: 5 })
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
