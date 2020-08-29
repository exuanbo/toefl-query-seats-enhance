import * as Utils from './utils'
import * as View from './view'
import { QueryData, filterSeats, addQueryTime } from './seat'
import { TemplateResult, render } from 'lit-html'

declare const layer: {
  msg: (
    text: string,
    options?: { title?: string; time?: number; icon?: number; anim?: number }
  ) => void
  alert: typeof layer.msg
}

const singleQuery = ({ city = '', dates = [''] } = {}) => {
  const tpl: TemplateResult[] = []
  const status = {
    availableDatesNum: 0,
    availableSeatsNum: 0,
    errNum: 0
  }
  ;(async () => {
    for (const testDay of dates) {
      layer.msg(`正在查询中，剩余${dates.length - dates.indexOf(testDay)}个日期`, {
        time: 2000,
        icon: 3,
        anim: -1
      })

      View.getData(city, testDay)
        .then(response => {
          const filteredData = filterSeats(response.data)
          if (filteredData) {
            status.availableDatesNum++
            status.availableSeatsNum += filteredData.availableSeatsNum
            tpl.push(View.renderTableTpl(filteredData))
            render(tpl, document.getElementById('qrySeatResult'))
          }
        })
        .catch((err: Error) => {
          console.log(err)
          status.errNum++
        })

      if (testDay !== dates[dates.length - 1]) {
        await Utils.sleep(1500)
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

const multiQuery = ({ cities = [''], dates = [''] } = {}) => {
  const data: QueryData[] = []
  ;(async () => {
    for (const city of cities) {
      for (const testDay of dates) {
        View.getData(city, testDay)
          .then(response => {
            const filteredData = filterSeats(response.data)
            if (filteredData) {
              addQueryTime(filteredData)
              data.push(filteredData)
            }
          })
          .catch((err: Error) => console.log(err))
        await Utils.sleep(1500)
      }
      console.log(data)
      await Utils.sleep(1500)
    }
  })()
}

const query = () => {
  View.clearResult()
  const queryCondition = {
    city: View.getSelectedCity(),
    dates: View.getDates()
  }

  if (typeof queryCondition.city === 'string') {
    if (queryCondition.city === '-1') {
      return layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })
    }
    singleQuery(queryCondition as { city: string; dates: string[] })
  } else {
    View.toggleExpand()
    multiQuery(queryCondition)
  }
}

const observeDom = () => {
  const targetNode = document.getElementById('wg_center')
  if (!Utils.isAvailable(targetNode, observeDom)) return

  const callback = () => {
    if (window.location.href.toString().split('#!')[1] === '/testSeat') {
      View.adjustStyle()
      View.addComponent.checkbox()
      View.addComponent.expandBtn()
      View.addComponent.queryBtn(query)
    }
  }
  const observer = new MutationObserver(callback)
  const config = { childList: true }
  observer.observe(targetNode, config)
}

observeDom()
