import * as View from './view'
import { filterSeats } from './seats'
import { render } from 'lit-html'
import axios from 'axios'

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const singleQuery = testCity => {
  View.clearResult()
  const testDates = View.getTestDatesArr()

  ;(async () => {
    let availableDatesNum = 0
    let availableSeatsNum = 0
    const seatsTpl = []
    let errNum = 0

    for (const day of testDates) {
      layer.msg(
        `正在查询中，剩余${testDates.length - testDates.indexOf(day)}个日期`,
        {
          time: 2000,
          icon: 3,
          anim: -1
        }
      )

      axios
        .get('testSeat/queryTestSeats', {
          params: {
            city: testCity,
            testDay: day
          }
        })
        .then(response => {
          const filteredData = filterSeats(response.data)
          if (filteredData) {
            availableDatesNum++
            availableSeatsNum += filteredData.availableSeatsNum
            seatsTpl.push(View.renderTpl(filteredData))
            render(seatsTpl, document.getElementById('qrySeatResult'))
          }
        })
        .catch(error => {
          console.log(error)
          errNum++
        })

      if (day !== testDates[testDates.length - 1]) {
        await sleep(1500)
      } else if (errNum) {
        layer.alert(`服务器打了个盹儿，漏掉了${errNum}个结果`, {
          title: '出错啦'
        })
      } else if (!availableDatesNum) {
        layer.msg('暂无可预定考位', { time: 2000, icon: 5 })
      } else {
        layer.msg(`查询完成，共找到${availableSeatsNum}个可预定考位`, {
          time: 2000,
          icon: 6
        })
      }
    }
  })()
}

const multiQuery = testCitiesArr => {
  console.log(testCitiesArr)
  View.toggleExpand()
  View.clearResult()

  const testDates = View.getTestDatesArr()
  const dataArr = []

  ;(async () => {
    for (const testCity of testCitiesArr) {
      for (const day of testDates) {
        axios
          .get('testSeat/queryTestSeats', {
            params: {
              city: testCity,
              testDay: day
            }
          })
          .then(response => {
            const filteredData = filterSeats(response.data)
            if (filteredData) {
              dataArr.push(filteredData)
            }
          })
          .catch(error => console.log(error))
        await sleep(1500)
      }
      console.log(dataArr)
      await sleep(1500)
    }
  })()
}

const query = () => {
  const testCity = View.getSelectedCity()
  if (typeof testCity === 'string') {
    if (testCity === '-1') {
      return layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })
    }
    singleQuery(testCity)
  } else {
    multiQuery(testCity)
  }
}

const observeDom = () => {
  const targetNode = document.getElementById('wg_center')
  if (!View.helper.isAvailable(targetNode, observeDom)) return

  const callback = (_, observer) => {
    if (window.location.href.toString().split('#!')[1] === '/testSeat') {
      View.adjustStyle()
      View.addCityCheckbox()
      View.addExpandBtn()
      View.addQueryBtn(query)
    }
  }
  const observer = new MutationObserver(callback)
  const config = { childList: true }
  observer.observe(targetNode, config)
}

observeDom()
