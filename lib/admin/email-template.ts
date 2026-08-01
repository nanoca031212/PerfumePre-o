import { renderEmailBody } from './email-messages'

const BRAND_NAME = 'THE PERFUME SHOP'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function textToHtml(text: string): string {
  return text
    .split('\n\n')
    .map((paragraph) => `<p style="margin:0 0 16px;">${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

export function renderEmailBodyHtml(body: string, name: string): string {
  return textToHtml(renderEmailBody(body, name))
}

export function renderEmailTemplate(bodyHtml: string): string {
  return `<div style="background:#F8F8F8;padding:40px 0;font-family:Arial, Helvetica, sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #E0E0E0;">
    <div style="background:#000000;padding:24px 32px;text-align:center;">
      <div style="font-size:14px;font-weight:900;letter-spacing:0.3em;text-transform:uppercase;color:#ffffff;">
        ${BRAND_NAME}
      </div>
    </div>
    <div style="background:#E00034;height:4px;line-height:0;font-size:0;">&nbsp;</div>
    <div style="padding:32px;color:#303030;font-size:14px;line-height:1.7;">
      ${bodyHtml}
    </div>
    <div style="padding:24px 32px;border-top:1px solid #E0E0E0;text-align:center;background:#F8F8F8;">
      <div style="font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#000000;margin-bottom:12px;">
        ${BRAND_NAME}
      </div>
      <p style="margin:0;font-size:11px;line-height:1.6;color:#808080;letter-spacing:0.05em;">
        This is an automated order notification.<br>
        &copy; ${new Date().getFullYear()} The Perfume Shop. ALL RIGHTS RESERVED.
      </p>
    </div>
  </div>
</div>`
}
