import { sleep } from './utils'
import { queryBtn } from './views/get'
import * as render from './views/render'
import { State } from './State'
import { getData } from './data'

export const query = async (): Promise<void> => {
  const state = new State()
  const { get, set } = state

  const noCitySelected = get('city') === undefined && get('cities') === undefined
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

    if (get('city') !== undefined) {
      set({ currentCity: get('city') }, true)
      await single()
    } else {
      await multi()
    }

    end()
  }

  function end (): void {
    set({ isComplete: true }, true)
    queryBtn.getEl().innerText = '查询全部日期'
    queryBtn.onClick(query)
  }

  async function multi (): Promise<void> {
    for (const city of get('cities')) {
      set({ currentCity: city }, true)

      await single()

      if (get('isComplete')) {
        break
      }
      if (get('citiesLeft') > 0) {
        await sleep(2000)
      }
    }
  }

  async function single (): Promise<void> {
    const initialSeatsNum = get('availableSeats')

    for (const testDay of get('dates')) {
      set({ currentDate: testDay }, true)

      try {
        const data = await getData(state)
        if (data !== null) {
          render.table(data, state)
          set({ availableSeats: get('availableSeats') + data.availableSeats })
        }
      } catch {
        set({ err: get('err') + 1 })
      }

      if (get('isComplete')) {
        break
      }
      if (get('datesLeft') > 0) {
        await sleep(2000)
      }
    }

    if (get('cities') !== undefined && get('availableSeats') === initialSeatsNum) {
      render.pityMsg(state)
    }
  }
}
