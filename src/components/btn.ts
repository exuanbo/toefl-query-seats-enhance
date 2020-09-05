import { html } from 'lit-html'

const expandBtn = () => html`
  <button
    id="expandBtn"
    class="btn"
    @click=${() => document.getElementById('checkboxes').classList.toggle('hide')}
    style="margin-left:8px;"
  >
    展开多选
  </button>
`

const queryBtn = () => html`
  <button id="queryBtn" class="btn btn-primary" style="margin-left:13px;">
    查询全部日期
  </button>
`

export { expandBtn, queryBtn }
