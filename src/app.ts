import * as Utils from './utils'
import * as Query from './query'
import * as View from './view'
import * as Templates from './templates'
import { filterSeats } from './seat'

const query = () => {
  const result = new Query.Result()
  const state = result.state

  if (!state.city && !state.cities) {
    layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })
    return
  }

  start()

  async function start () {
    View.queryBtn.getEl().innerText = '停止当前查询'
    View.queryBtn.listen(end)
    state.city ? await single() : await multi()
    end()
    View.queryBtn.getEl().innerText = '查询全部日期'
    View.queryBtn.listen(query)
  }

  function end () {
    state.isComplete = true
    result.refreshStatus()
    View.setProgress(100)
    View.stopProgress()
  }

  async function multi () {
    View.hideExpand()

    result.add(Templates.statusWrapper())
    result.refreshStatus()
    result.add(Templates.tabbale(state.cities))

    for (const city of state.cities) {
      state.currentCity = city
      await single()
      if (state.isComplete) break
      if (state.citiesLeft) await Utils.sleep(2000)
    }
  }

  async function single () {
    for (const testDay of state.dates) {
      state.currentDate = testDay
      state.refresh()

      if (state.city) result.add(Templates.statusWrapper())
      result.refreshStatus()

      try {
        const response = await View.grab.response(state.currentCity, state.currentDate)
        const filteredData = filterSeats(response.data)
        if (filteredData) {
          state.availableDatesNum++
          state.availableSeatsNum += filteredData.availableSeatsNum
          result.add(Templates.table(filteredData), state.cities ? state.currentCity : '')
        }
      } catch (err) {
        if (err instanceof Error) {
          state.errNum++
        } else {
          console.log(err)
          throw err
        }
      }

      if (state.isComplete) break
      if (state.datesLeft) await Utils.sleep(2000)
    }
  }
}

View.observeMutation(
  document.getElementById('wg_center'),
  () => {
    if (window.location.href.toString().split('#!')[1] === '/testSeat') {
      View.adjustStyle()
      View.add.checkbox()
      View.add.expandBtn()
      View.add.queryBtn(query)
    }
  },
  { childList: true }
)
