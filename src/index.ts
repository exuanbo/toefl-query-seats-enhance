import { observeMutation, adjustStyle } from './views/utils'
import * as Render from './views/render'
import { queryBtn } from './views/get'
import { query } from './query'

observeMutation(
  document.getElementById('wg_center'),
  () => {
    if (window.location.href.toString().split('#!')[1] === '/testSeat') {
      adjustStyle()
      Render.checkbox()
      Render.expandBtn()
      Render.queryBtn()
      queryBtn.onClick(query)
    }
  },
  { childList: true }
)
