import * as Utils from './utils'
import * as View from './view'
import * as Templates from './templates'
import { QueryData, filterSeats } from './seat'

const query = () => {
  const queryCondition = { city: View.grab.selectedCity(), dates: View.grab.dates() }
  const result = new View.Result()
  const status = {
    availableDatesNum: 0,
    availableSeatsNum: 0,
    errNum: 0
  }
  start()

  async function start () {
    View.Result.prototype.refresh({ clear: true })
    if (typeof queryCondition.city === 'string') {
      if (queryCondition.city === '-1') {
        layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })
        return
      }
      await single()
    } else {
      View.toggleExpand()
      await multi()
    }

    if (status.errNum) {
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

  async function multi () {
    const cities = queryCondition.city as string[]
    const { dates } = queryCondition

    result.add(Templates.tabbale(cities))
    result.refresh()

    for (const [index, city] of cities.entries()) {
      await single({ city, dates, isMulti: true, citiesLeft: cities.length - index - 1 })
      if (index !== cities.length - 1) await Utils.sleep(1500)
    }
  }

  async function single ({
    city = queryCondition.city as string,
    dates = queryCondition.dates,
    isMulti = false,
    citiesLeft = null as number
  } = {}) {
    for (const testDay of dates) {
      layer.msg(
        `正在查询中，剩余 ${isMulti ? `${citiesLeft}个城市 ` : ''}${dates.length -
          dates.indexOf(testDay)}个日期`,
        {
          time: 2000,
          icon: 3,
          anim: -1
        }
      )

      View.grab
        .data(city, testDay)
        .then((data: QueryData) => {
          const filteredData = filterSeats(data)
          if (filteredData) {
            status.availableDatesNum++
            status.availableSeatsNum += filteredData.availableSeatsNum

            result.add(Templates.table(filteredData), isMulti ? city : '')
            result.refresh({ tabName: isMulti ? city : '' })
          }
        })
        .catch((err: Error) => {
          console.log(err)
          status.errNum++
        })

      if (testDay !== dates[dates.length - 1]) await Utils.sleep(1500)
    }
  }
}

View.observeMutation(
  document.getElementById('wg_center'),
  () => {
    if (window.location.href.toString().split('#!')[1] === '/testSeat') {
      View.adjustStyle()
      View.addComponent.checkbox()
      View.addComponent.expandBtn()
      View.addComponent.queryBtn(query)
    }
  },
  { childList: true }
)
