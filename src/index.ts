import * as View from './lib/view'
import { Query } from './lib/query'

View.utils.observeMutation(
  document.getElementById('wg_center'),
  () => {
    if (window.location.href.toString().split('#!')[1] === '/testSeat') {
      View.utils.adjustStyle()
      View.renderComponent.checkbox()
      View.renderComponent.expandBtn()
      View.renderComponent.queryBtn()
      View.grab.queryBtn.onClick(Query)
    }
  },
  { childList: true }
)
