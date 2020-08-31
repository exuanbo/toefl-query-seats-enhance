import * as Utils from './utils'
import * as View from './view'
import * as Templates from './templates'
import { QueryData, filterSeats } from './seat'

const query = () => {
  const queryCondition = (() => {
    const city = View.grab.selectedCity()
    const type = city === '-1' ? null : typeof city === 'string' ? 'single' : 'multi'
    return { city: city, dates: View.grab.dates(), type: type }
  })()

  if (!queryCondition.type) return layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })

  const status = {
    availableDatesNum: 0,
    availableSeatsNum: 0,
    errNum: 0
  }
  const result = new View.Result()
  start()

  async function start () {
    queryCondition.type === 'single' ? await single() : await multi()

    View.stopProgress()
    status.availableDatesNum
      ? layer.msg(`查询完成，共找到${status.availableSeatsNum}个可预定考位`, {
          time: 2000,
          icon: 6
        })
      : layer.msg('暂无可预定考位', { time: 2000, icon: 5 })
  }

  async function multi () {
    View.toggleExpand()

    const cities = queryCondition.city as string[]
    const { dates } = queryCondition
    const sum = dates.length * cities.length

    result.add(Templates.progress())
    result.add(Templates.tabbale(cities))

    for (const [index, city] of cities.entries()) {
      const citiesLeft = cities.length - index - 1
      await single({ city, dates, isMulti: true, sum: sum, citiesLeft: citiesLeft })
      if (index !== cities.length - 1) await Utils.sleep(1500)
    }
  }

  async function single ({
    city = queryCondition.city as string,
    dates = queryCondition.dates,
    isMulti = false,
    sum = null as number,
    citiesLeft = null as number
  } = {}) {
    if (!isMulti) result.add(Templates.progress())

    for (const [index, testDay] of dates.entries()) {
      layer.msg(
        `正在查询中，剩余 ${isMulti ? `${citiesLeft}个城市 ` : ''}${dates.length - index}个日期`,
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
          }
        })
        .catch((err: Error) => {
          console.log(err)
          status.errNum++
        })

      View.setProgress(
        100 - (((isMulti ? citiesLeft * dates.length : 0) + dates.length - index - 1) / sum) * 100
      )
      if (index !== dates.length - 1) await Utils.sleep(1500)
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
