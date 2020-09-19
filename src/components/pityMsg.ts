import { TemplateResult, html } from 'lit-html'

export const PityMsg = (): TemplateResult => html`
    <div class="alert" style="margin:0 auto 0;width:fit-content;">
      <button type="button" class="close" data-dismiss="alert">&times;</button>
      <strong>真遗憾！</strong>没有找到可预定的考位<span style="margin-left:4px;font-size:20px;">&#128552;</span></div>
    </div>
  `
