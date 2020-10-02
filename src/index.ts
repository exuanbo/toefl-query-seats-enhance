import { observeMutation, adjustStyle } from './views/utils'
import * as render from './views/render'
import { queryBtn } from './views/get'
import { query } from './query'

observeMutation(
  document.getElementById('wg_center'),
  () => {
    if (window.location.href.toString().split('#!')[1] === '/testSeat') {
      adjustStyle()
      render.checkbox()
      render.expandBtn()
      render.queryBtn()
      queryBtn.onClick(query)
    }
  },
  { childList: true }
)
