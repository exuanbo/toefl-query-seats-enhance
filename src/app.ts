import * as View from './view'
import { QueryData, filterSeats, addQueryTime } from './seats'
import { render, TemplateResult } from 'lit-html'
import axios from 'axios'

declare const layer: {
  msg: (
    text: string,
    options?: { title?: string; time?: number; icon?: number; anim?: number }
  ) => void
  alert: typeof layer.msg
}

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const singleQuery = (testCity: string) => {
  View.clearResult()

  const testDates = View.getTestDatesArr()
  const seatsTpl: TemplateResult[] = []
  const status = {
    availableDatesNum: 0,
    availableSeatsNum: 0,
    errNum: 0
  }

  ;(async () => {
    for (const day of testDates) {
      layer.msg(`正在查询中，剩余${testDates.length - testDates.indexOf(day)}个日期`, {
        time: 2000,
        icon: 3,
        anim: -1
      })

      axios
        .get('testSeat/queryTestSeats', {
          params: {
            city: testCity,
            testDay: day
          }
        })
        .then((response: { data: QueryData }) => {
          const filteredData = filterSeats(response.data)
          if (filteredData) {
            status.availableDatesNum++
            status.availableSeatsNum += filteredData.availableSeatsNum
            seatsTpl.push(View.renderTpl(filteredData))
            render(seatsTpl, document.getElementById('qrySeatResult'))
          }
        })
        .catch((err: Error) => {
          console.log(err)
          status.errNum++
        })

      if (day !== testDates[testDates.length - 1]) {
        await sleep(1500)
      } else if (status.errNum) {
        layer.alert(`服务器打了个盹儿，漏掉了${status.errNum}个结果`, {
          title: '出错啦'
        })
      } else if (!status.availableDatesNum) {
        layer.msg('暂无可预定考位', { time: 2000, icon: 5 })
      } else {
        layer.msg(`查询完成，共找到${status.availableSeatsNum}个可预定考位`, {
          time: 2000,
          icon: 6
        })
      }
    }
  })()
}

const multiQuery = (testCitiesArr: string[]) => {
  console.log(testCitiesArr)
  View.toggleExpand()
  View.clearResult()

  const testDates = View.getTestDatesArr()
  const dataArr: QueryData[] = []
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
          .then((response: { data: QueryData }) => {
            const filteredData = filterSeats(response.data)
            if (filteredData) {
              addQueryTime(filteredData)
              dataArr.push(filteredData)
            }
          })
          .catch((err: Error) => console.log(err))
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

  const callback = () => {
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
