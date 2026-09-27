import { useMemo, useState } from 'react'

const places = [
  ['🌳', 'В парк'], ['🎬', 'В кино'], ['🚶', 'Просто погулять'],
  ['🍕', 'Покушать'], ['☕', 'В кафе'], ['✨', 'Есть ещё идея'],
]
const noTexts = ['Не получится)', 'Не поймаешь 😏', 'Точно не получится?', 'Попробуй ещё раз 😂', 'Ну давай, поймай меня 😄']

const pad = (number) => String(number).padStart(2, '0')
const today = new Date()
const minDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
const formatDate = (value) => value ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) : 'не выбрана'

export default function App() {
  const [screen, setScreen] = useState(0)
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [noIndex, setNoIndex] = useState(0)
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const [answers, setAnswers] = useState({ date: '', time: '', place: '', idea: '', anticipation: 87 })
  const [notice, setNotice] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const step = Math.min(Math.max(screen, 1), 7)
  const selectedPlace = useMemo(() => places.find(([, label]) => label === answers.place), [answers.place])

  const next = () => setScreen((current) => current + 1)
  const back = () => { setNotice(''); setScreen((current) => Math.max(1, current - 1)) }
  const dodge = () => {
    setNoIndex((current) => (current + 1) % noTexts.length)
    setNoPosition({ x: Math.round((Math.random() - 0.5) * 150), y: Math.round((Math.random() - 0.5) * 78) })
  }
  const update = (field, value) => setAnswers((current) => ({ ...current, [field]: value }))
  const submit = async () => {
    if (sending) return
    setSending(true); setNotice('')
    try {
      const response = await fetch('/api/send-telegram', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answer: 'Да, с удовольствием ❤️', ...answers }) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.success) throw new Error(data.message || 'Не получилось отправить 😢 Попробуй ещё раз')
      setSent(true)
    } catch (error) { setNotice(error.message || 'Не получилось отправить 😢 Попробуй ещё раз') }
    finally { setSending(false) }
  }

  return <main className="app">
    <div className="aurora" /><div className="hearts" aria-hidden="true"><i>♥</i><i>♥</i><i>♥</i><i>♥</i><i>♥</i></div>
    <section className="card" aria-live="polite">
      {screen > 0 && screen < 8 && <header><span className="progress">❤️ {step} / 7</span>{screen > 1 && <button className="back" onClick={back}>← Назад</button>}</header>}
      {screen === 0 && <div className="intro">
        <button className={`envelope ${envelopeOpen ? 'open' : ''}`} onClick={() => { setEnvelopeOpen(true); setTimeout(() => setScreen(1), 820) }} aria-label="Открыть конверт">
          <span className="flap" /><span className="letter">💌<b>Для тебя ❤️</b></span><span className="seal">♥</span>
        </button>
        <p>Нажми на конверт</p>
      </div>}
      {screen === 1 && <div className="scene"><span className="eyebrow">маленькое приглашение</span><h1>Пойдёшь со мной<br />на свидание? ❤️</h1><div className="answer-buttons"><button className="primary" onClick={next}>Да, с удовольствием ❤️</button><button className="secondary dodging" onPointerEnter={dodge} onClick={dodge} style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)` }}>{noTexts[noIndex]}</button></div></div>}
      {screen === 2 && <div className="scene"><h1>Тогда давай выберем день ❤️</h1><label>Дата<input type="date" min={minDate} value={answers.date} onChange={(event) => update('date', event.target.value)} /></label>{answers.date && <p className="chosen">🗓️ {formatDate(answers.date)}</p>}<button className="primary" disabled={!answers.date} onClick={next}>Дальше →</button></div>}
      {screen === 3 && <div className="scene"><h1>А во сколько<br />встретимся? ⏰</h1><label>Время<input type="time" value={answers.time} onChange={(event) => update('time', event.target.value)} /></label><button className="primary" disabled={!answers.time} onClick={next}>Дальше →</button></div>}
      {screen === 4 && <div className="scene"><h1>Куда хочешь сходить? ❤️</h1><div className="choices">{places.map(([emoji, label]) => <button key={label} className={`choice ${answers.place === label ? 'selected' : ''}`} onClick={() => update('place', label)}><span>{emoji}</span>{label}</button>)}</div>{answers.place === 'Есть ещё идея' && <label className="idea">Расскажи свою идею ❤️<input value={answers.idea} maxLength="300" placeholder="Например, на концерт" onChange={(event) => update('idea', event.target.value)} /></label>}<button className="primary" disabled={!answers.place || (answers.place === 'Есть ещё идея' && !answers.idea.trim())} onClick={next}>Дальше →</button></div>}
      {screen === 5 && <div className="scene"><h1>А на чём поедем<br />или пойдём? 😏</h1><div className="travel"><button onClick={() => setNotice('Не-не 😄 Попробуй другой вариант')}>🚕 На такси</button><button onClick={() => setNotice('Хмм... нет 😏')}>🚶 Пешком</button><button className="hand" onClick={() => { setNotice('Вот теперь правильно ❤️'); setTimeout(next, 600) }}>❤️ За ручку</button></div>{notice && <p className="notice">{notice}</p>}</div>}
      {screen === 6 && <div className="scene"><span className="eyebrow">И под конец... ❤️</span><h1>На сколько сильно ждёшь нашу встречу?</h1><input className="range" type="range" min="0" max="100" value={answers.anticipation} onChange={(event) => update('anticipation', Number(event.target.value))} /><output className={answers.anticipation === 100 ? 'full' : ''}>{answers.anticipation}% ❤️</output><button className="primary" onClick={next}>Показать наше свидание →</button></div>}
      {screen === 7 && <div className="scene result"><span className="eyebrow">почти готово</span><h1>Свидание почти<br />запланировано ❤️</h1><dl><dt>Ответ</dt><dd>Да, с удовольствием ❤️</dd><dt>Дата</dt><dd>{formatDate(answers.date)}</dd><dt>Время</dt><dd>{answers.time}</dd><dt>Куда</dt><dd>{selectedPlace ? `${selectedPlace[0]} ${selectedPlace[1]}` : '—'}</dd><dt>Как</dt><dd>За ручку ❤️</dd><dt>Насколько ждёт</dt><dd>{answers.anticipation}%</dd>{answers.idea && <><dt>Своя идея</dt><dd>{answers.idea}</dd></>}</dl>{notice && <p className="notice error">{notice}</p>}<button className="primary" disabled={sending || sent} onClick={submit}>{sent ? 'Отправлено ❤️' : sending ? 'Отправляем…' : 'Отправить ❤️'}</button>{sent && <p className="sent">Ура! Я уже жду нашу встречу ❤️</p>}</div>}
    </section>
  </main>
}
