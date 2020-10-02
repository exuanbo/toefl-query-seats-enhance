import { sleep } from './utils'
import { queryBtn } from './views/get'
import * as Render from './views/render'
import { State } from './models/State'
import * as Data from './models/Data'

export const query = (): void => {
  const state = new State()

  if (!state.get('city') && !state.get('cities')) {
    layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })
    queryBtn.onClick(query)
    return
  }

  start()

  async function start (): Promise<void> {
    queryBtn.getEl().innerText = '停止当前查询'
    queryBtn.onClick(end)
    Render.app(state)
    state.get('city') ? await single() : await multi()
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
      if (state.get('citiesLeft')) await sleep(2000)
    }
  }

  async function single (): Promise<void> {
    const initialSeatsNum = state.get('availableSeats')

    for (const testDay of state.get('dates')) {
      state.set({ currentDate: testDay }, true)

      try {
        const data = await Data.get(state)
        if (data) {
          Render.table(data, state)
          state.set({ availableSeats: state.get('availableSeats') + data.availableSeats })
        }
      } catch {
        state.set({ err: state.get('err') + 1 })
      }

      if (state.get('isComplete')) break
      if (state.get('datesLeft')) await sleep(2000)
    }

    if (state.get('cities') && state.get('availableSeats') === initialSeatsNum)
      Render.pityMsg(state)
  }
}
