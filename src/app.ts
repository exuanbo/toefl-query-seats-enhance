import * as Utils from './utils'
import * as View from './view'
import { filterSeats } from './seat'

declare const layer: {
  msg: (
    text: string,
    options?: { title?: string; time?: number; icon?: number; anim?: number }
  ) => void
  alert: typeof layer.msg
}

class Query {
  constructor (
    private queryCondition = { city: View.grab.selectedCity(), dates: View.grab.dates() },
    private result = new View.Result(),
    private status = {
      availableDatesNum: 0,
      availableSeatsNum: 0,
      errNum: 0
    }
  ) {
    View.Result.prototype.refresh({ clear: true })
    this.start()
  }

  start () {
    if (typeof this.queryCondition.city === 'string') {
      if (this.queryCondition.city === '-1') {
        layer.msg('请选择考点所在城市', { time: 2000, icon: 0 })
        return
      }
      this.single()
    } else {
      View.toggleExpand()
      this.multi()
    }

    if (this.status.errNum) {
      layer.alert(`服务器打了个盹儿，漏掉了${this.status.errNum}个结果`, {
        title: '出错啦'
      })
    } else if (!this.status.availableDatesNum) {
      layer.msg('暂无可预定考位', { time: 2000, icon: 5 })
    } else {
      layer.msg(`查询完成，共找到${this.status.availableSeatsNum}个可预定考位`, {
        time: 2000,
        icon: 6
      })
    }
  }

  async single ({
    city = this.queryCondition.city as string,
    dates = this.queryCondition.dates
  } = {}) {
    for (const testDay of dates) {
      layer.msg(`正在查询中，剩余${dates.length - dates.indexOf(testDay)}个日期`, {
        time: 2000,
        icon: 3,
        anim: -1
      })

      View.grab
        .data(city, testDay)
        .then(response => {
          const filteredData = filterSeats(response.data)
          if (filteredData) {
            this.status.availableDatesNum++
            this.status.availableSeatsNum += filteredData.availableSeatsNum

            if (this.status.availableDatesNum === 1)
              this.result.add(View.renderTitleTpl(filteredData))
            this.result.add(View.renderTableTpl(filteredData))
            this.result.refresh()
          }
        })
        .catch((err: Error) => {
          console.log(err)
          this.status.errNum++
        })

      if (testDay !== dates[dates.length - 1]) await Utils.sleep(1500)
    }
  }

  async multi () {
    const cities = this.queryCondition.city as string[]
    const { dates } = this.queryCondition
    for (const city of cities) {
      await this.single({ city, dates })
    }
  }
}

View.observeMutation(
  document.getElementById('wg_center'),
  () => {
    if (window.location.href.toString().split('#!')[1] === '/testSeat') {
      View.adjustStyle()
      View.addComponent.checkbox()
      View.addComponent.expandBtn()
      View.addComponent.queryBtn(() => new Query())
    }
  },
  { childList: true }
)
