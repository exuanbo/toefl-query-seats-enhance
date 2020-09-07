import * as Utils from './utils'
import * as View from './view'
import { State } from './state'
import { getData } from './data'

export const Query = () => {
  const state = new State()

  if (!state.city && !state.cities) {
    layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })
    View.queryBtn.listen(Query)
    return
  }
  start()

  async function start () {
    View.queryBtn.getEl().innerText = '停止当前查询'
    View.queryBtn.listen(end)
    View.init(state)
    state.city ? await single() : await multi()
    end()
  }

  function end () {
    state.isComplete.val = true
    View.queryBtn.getEl().innerText = '查询全部日期'
    View.queryBtn.listen(Query)
  }

  async function multi () {
    for (const city of state.cities) {
      state.currentCity.val = city
      await single()
      if (state.isComplete.val) break
      if (state.citiesLeft) await Utils.sleep(2000)
    }
  }

  async function single () {
    const initialSeatsNum = state.availableSeats

    for (const testDay of state.dates) {
      state.currentDate.val = testDay
      try {
        const data = await getData(state)
        if (data) {
          View.renderTable(data, state)
          state.availableSeats += data.availableSeats
        }
      } catch (err) {
        if (err instanceof Error) {
          state.err++
        } else {
          console.log(err)
          throw err
        }
      }
      if (state.isComplete.val) break
      if (state.datesLeft) await Utils.sleep(2000)
    }

    if (state.cities && state.availableSeats === initialSeatsNum) View.insert.pityMsg(state)
  }
}
