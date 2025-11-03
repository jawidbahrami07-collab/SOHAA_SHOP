export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const body = req.body || {}
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if(!token || !chatId) return res.status(500).json({ error: 'Telegram bot token or chat id not configured' })

  const lines = []
  lines.push(`<b>سفارش جدید از فرم وب</b>`)
  lines.push(`<b>نام:</b> ${escapeHtml(body.name || '-')}`)
  lines.push(`<b>شماره:</b> ${escapeHtml(body.phone || '-')}`)
  lines.push(`<b>آدرس:</b> ${escapeHtml(body.address || '-')}`)
  if(body.postal) lines.push(`<b>کد پستی:</b> ${escapeHtml(body.postal)}`)
  lines.push(`<b>محصولات:</b>`)
  lines.push(`سها 500: ${Number(body.soha500_qty || 0)}`)
  lines.push(`سها 250: ${Number(body.soha250_qty || 0)}`)
  lines.push(`باکس پوچ 1kg: ${Number(body.pouch1kg_qty || 0)}`)
  lines.push(`پاکت طلایی: ${Number(body.goldpack_qty || 0)}`)
  lines.push(`پاکت ساده 1kg: ${Number(body.plain1kg_qty || 0)}`)
  if(body.notes) lines.push(`<b>توضیحات:</b> ${escapeHtml(body.notes)}`)

  const text = lines.join('\n')

  try{
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    })
    const tgJson = await tgRes.json()
    if(!tgRes.ok) return res.status(500).json({ error: 'Telegram API error', details: tgJson })
    return res.status(200).json({ ok:true, result: tgJson })
  }catch(err){
    return res.status(500).json({ error: err.message })
  }
}

function escapeHtml(str){
  return String(str).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))
}
