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
    View.add.status(result)
    state.city ? await single() : await multi()
    end()
  }

  function end () {
    state.isComplete.val = true
    View.setProgress(100)
    View.stopProgress()
    View.queryBtn.getEl().innerText = '查询全部日期'
    View.queryBtn.listen(query)
  }

  async function multi () {
    View.hideExpand()
    result.add(Templates.tabbale(state.cities))

    for (const city of state.cities) {
      state.currentCity.val = city
      await single()
      if (state.isComplete.val) break
      if (state.citiesLeft) await Utils.sleep(2000)
    }
  }

  async function single () {
    const initialSeatsNum = state.availableSeats.val

    for (const testDay of state.dates) {
      state.currentDate.val = testDay

      try {
        const response = await View.grab.response(state.currentCity.val, state.currentDate.val)
        const filteredData = filterSeats(response.data)
        if (filteredData) {
          state.availableSeats.val += filteredData.availableSeats
          result.add(Templates.table(filteredData), state.cities ? state.currentCity.val : '')
        }
      } catch (err) {
        if (err instanceof Error) {
          state.err.val++
        } else {
          console.log(err)
          throw err
        }
      }

      if (state.isComplete.val) break
      if (state.datesLeft) await Utils.sleep(2000)
    }

    if (state.cities && state.availableSeats.val === initialSeatsNum)
      result.add(Templates.pityMsg(), state.currentCity.val)
  }
}

View.observeMutation(
  document.getElementById('wg_center'),
  () => {
    if (String(window.location.href).split('#!')[1] === '/testSeat') {
      View.adjustStyle()
      View.add.checkbox()
      View.add.expandBtn()
      View.add.queryBtn(query)
    }
  },
  { childList: true }
)
