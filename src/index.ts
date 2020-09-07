import * as View from './lib/view'
import { Query } from './lib/query'

View.utils.observeMutation(
  document.getElementById('wg_center'),
  () => {
    if (String(window.location.href).split('#!')[1] === '/testSeat') {
      View.utils.adjustStyle()
      View.insert.checkbox()
      View.insert.expandBtn()
      View.insert.queryBtn()
      View.queryBtn.listen(Query)
    }
  },
  { childList: true }
)
