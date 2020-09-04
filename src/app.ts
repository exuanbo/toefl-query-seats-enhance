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
    state.setVal('isComplete', true)
    View.setProgress(100)
    View.stopProgress()
    View.queryBtn.getEl().innerText = '查询全部日期'
    View.queryBtn.listen(query)
  }

  async function multi () {
    View.hideExpand()
    result.add(Templates.tabbale(state.cities))

    for (const city of state.cities) {
      state.setVal('currentCity', city)
      await single()
      if (state.getVal('isComplete') as boolean) break
      if (state.citiesLeft) await Utils.sleep(2000)
    }
  }

  async function single () {
    const initialSeatsNum = state.getVal('availableSeatsNum')

    for (const testDay of state.dates) {
      state.setVal('currentDate', testDay)

      try {
        const response = await View.grab.response(
          state.getVal('currentCity') as string,
          state.getVal('currentDate') as string
        )
        const filteredData = filterSeats(response.data)
        if (filteredData) {
          state.increaseVal('availableSeatsNum', filteredData.availableSeatsNum)
          result.add(
            Templates.table(filteredData),
            state.cities ? (state.getVal('currentCity') as string) : ''
          )
        }
      } catch (err) {
        if (err instanceof Error) {
          state.increaseVal('errNum', 1)
        } else {
          console.log(err)
          throw err
        }
      }

      if (state.getVal('isComplete') as boolean) break
      if (state.datesLeft) await Utils.sleep(2000)
    }

    if (state.cities && state.getVal('availableSeatsNum') === initialSeatsNum)
      result.add(Templates.pityMsg(), state.getVal('currentCity') as string)
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
