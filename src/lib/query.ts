import { sleep } from './utils'
import { renderComponent, insert, grab } from './view'
import { State } from './state'
import { getData } from './data'

export const Query = (): void => {
  const state = new State()

  if (!state.get('city') && !state.get('cities')) {
    layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })
    grab.queryBtn.onClick(Query)
    return
  }

  start()

  async function start (): Promise<void> {
    grab.queryBtn.getEl().innerText = '停止当前查询'
    grab.queryBtn.onClick(end)
    renderComponent.app(state)
    state.get('city') ? await single() : await multi()
    end()
  }

  function end (): void {
    state.set({ isComplete: true }, true)
    grab.queryBtn.getEl().innerText = '查询全部日期'
    grab.queryBtn.onClick(Query)
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
        const data = await getData(state)
        if (data) {
          renderComponent.table(data, state)
          state.set({ availableSeats: state.get('availableSeats') + data.availableSeats })
        }
      } catch {
        state.set({ err: state.get('err') + 1 })
      }

      if (state.get('isComplete')) break
      if (state.get('datesLeft')) await sleep(2000)
    }

    if (state.get('cities') && state.get('availableSeats') === initialSeatsNum)
      insert.pityMsg(state)
  }
}
