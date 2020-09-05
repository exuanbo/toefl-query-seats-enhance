import * as Utils from './lib/utils'
import * as View from './lib/view'
import { State } from './lib/state'
import { QueryData, filterSeats } from './lib/seat'
import { App } from './components/app'
import { Tables } from './components/tables'
import { render } from 'lit-html'

const query = () => {
  const state = new State()

  if (!state.city && !state.cities) {
    layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })
    return
  }

  start()

  async function start () {
    View.queryBtn.getEl().innerText = '停止当前查询'
    View.queryBtn.listen(end)
    render(App(state), document.getElementById('qrySeatResult'))
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

    for (const city of state.cities) {
      state.currentCity.val = city
      await single()
      if (state.isComplete.val) break
      if (state.citiesLeft) await Utils.sleep(2000)
    }
  }

  async function single () {
    const initialSeatsNum = state.availableSeats.val
    const dataArr: QueryData[] = []

    for (const testDay of state.dates) {
      state.currentDate.val = testDay

      try {
        const response = await View.grab.response(state.currentCity.val, state.currentDate.val)
        const filteredData = filterSeats(response.data)
        if (filteredData) {
          dataArr.push(filteredData)
          render(
            Tables(dataArr),
            document.getElementById(state.city ? 'tables' : `tab-${state.currentCity.val}`)
          )
          state.availableSeats.val += filteredData.availableSeats
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

    if (state.cities && state.availableSeats.val === initialSeatsNum) View.insert.pityMsg(state)
  }
}

View.observeMutation(
  document.getElementById('wg_center'),
  () => {
    if (String(window.location.href).split('#!')[1] === '/testSeat') {
      View.adjustStyle()
      View.insert.checkbox()
      View.insert.expandBtn()
      View.insert.queryBtn(query)
    }
  },
  { childList: true }
)
