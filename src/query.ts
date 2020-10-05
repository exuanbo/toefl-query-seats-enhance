import { sleep } from './utils'
import { queryBtn } from './views/get'
import * as render from './views/render'
import { State } from './State'
import { Data } from './Data'

export const query = async (): Promise<void> => {
  const state = new State()

  const noCitySelected = state.get('city') === undefined && state.get('cities') === undefined
  if (noCitySelected) {
    layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })
    queryBtn.onClick(query)
    return
  }

  await start()

  async function start (): Promise<void> {
    queryBtn.getEl().innerText = '停止当前查询'
    queryBtn.onClick(end)
    render.app(state)
    state.get('city') !== undefined ? await single() : await multi()
    end()
  }

  function end (): void {
    state.set({ isComplete: true }, true)
    queryBtn.getEl().innerText = '查询全部日期'
    queryBtn.onClick(query)
  }

  async function multi (): Promise<void> {
    for (const city of state.get('cities')) {
      state.set({ currentCity: city }, true)

      await single()
      if (state.get('isComplete')) break
      if (state.get('citiesLeft') > 0) await sleep(2000)
    }
  }

  async function single (): Promise<void> {
    const initialSeatsNum = state.get('availableSeats')

    for (const testDay of state.get('dates')) {
      state.set({ currentDate: testDay }, true)

      try {
        const data = await Data.get(state)
        if (data !== null) {
          render.table(data, state)
          state.set({ availableSeats: state.get('availableSeats') + data.availableSeats })
        }
      } catch {
        state.set({ err: state.get('err') + 1 })
      }

      if (state.get('isComplete')) break
      if (state.get('datesLeft') > 0) await sleep(2000)
    }

    if (state.get('cities') !== undefined && state.get('availableSeats') === initialSeatsNum) { render.pityMsg(state) }
  }
}
