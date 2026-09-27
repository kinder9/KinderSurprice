const clean = (value, max = 300) => String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max)

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ success: false, message: 'Method not allowed' })
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return response.status(500).json({ success: false, message: 'Telegram is not configured' })
  const body = request.body || {}
  const lines = [
    '❤️ НОВОЕ ПРИГЛАШЕНИЕ ❤️', '', `Ответ:\n${clean(body.answer)}`, '', `🗓️ Дата:\n${clean(body.date)}`,
    '', `⏰ Время:\n${clean(body.time)}`, '', `📍 Куда:\n${clean(body.place)}`, '', '🚶 Как:\nЗа ручку ❤️',
    '', `💯 Насколько ждёт:\n${clean(body.anticipation, 3)}%`,
  ]
  const idea = clean(body.idea)
  if (idea) lines.push('', `✨ Своя идея:\n${idea}`)
  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: lines.join('\n') }) })
    if (!telegramResponse.ok) throw new Error('Telegram API error')
    return response.status(200).json({ success: true })
  } catch (error) { return response.status(500).json({ success: false, message: 'Не получилось отправить 😢 Попробуй ещё раз' }) }
}
