import { sleep } from './utils'
import { init, renderTable, insert, queryBtn } from './view'
import { State } from './state'
import { getData } from './data'

export const Query = (): void => {
  const state = new State()

  if (!state.city && !state.cities) {
    layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })
    queryBtn.listen(Query)
    return
  }

  start()

  async function start (): Promise<void> {
    queryBtn.getEl().innerText = '停止当前查询'
    queryBtn.listen(end)
    init(state)
    state.city ? await single() : await multi()
    end()
  }

  function end (): void {
    state.isComplete.val = true
    queryBtn.getEl().innerText = '查询全部日期'
    queryBtn.listen(Query)
  }

  async function multi (): Promise<void> {
    for (const city of state.cities) {
      state.currentCity.val = city
      await single()
      if (state.isComplete.val) break
      if (state.citiesLeft) await sleep(2000)
    }
  }

  async function single (): Promise<void> {
    const initialSeatsNum = state.availableSeats

    for (const testDay of state.dates) {
      state.currentDate.val = testDay
      try {
        const data = await getData(state)
        if (data) {
          renderTable(data, state)
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
      if (state.datesLeft) await sleep(2000)
    }

    if (state.cities && state.availableSeats === initialSeatsNum) insert.pityMsg(state)
  }
}
