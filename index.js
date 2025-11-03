import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Home() {
  const [form, setForm] = useState({
    name: '', phone: '', address: '', postal: '',
    soha500_qty: 0, soha250_qty: 0, pouch1kg_qty: 0, goldpack_qty: 0, plain1kg_qty: 0,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  function update(k, v) { setForm(prev => ({ ...prev, [k]: v })) }

  function validatePhone(p) {
    return /^09\d{9}$/.test(p)
  }

  async function handleSubmit(e){
    e.preventDefault()
    if(!form.name.trim()) return setMessage('لطفاً نام و نام خانوادگی را وارد کنید')
    if(!validatePhone(form.phone)) return setMessage('شماره تماس صحیح را وارد کنید، مثل 09123456789')

    setLoading(true); setMessage(null)
    try{
      const res = await fetch('/api/send-order', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
      const data = await res.json()
      if(res.ok){ setMessage('سفارش شما با موفقیت ارسال شد. ممنون از اعتماد شما 🎉')
        setForm({name:'',phone:'',address:'',postal:'',soha500_qty:0,soha250_qty:0,pouch1kg_qty:0,goldpack_qty:0,plain1kg_qty:0,notes:''})
      } else {
        setMessage(data?.error || 'خطا در ارسال سفارش. لطفاً دوباره تلاش کنید')
      }
    }catch(err){ setMessage('خطا در ارتباط با سرور: ' + err.message) }
    finally{ setLoading(false) }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <motion.section initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="w-full max-w-3xl">
        <div className="card">
          <header className="mb-4">
            <h1 className="text-2xl font-semibold">به فرم ثبت سفارش محصولات طبیعی نوره سها خوش آمدید 💁</h1>
            <p className="text-sm text-gray-600 mt-2">جز توکل بر خدا سرمایه‌ای در کار نیست — لطفاً اطلاعات و جزئیات سفارش را دقیق وارد کنید</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm">👤 نام و نام خانوادگی</span>
                <input aria-label="نام و نام خانوادگی" value={form.name} onChange={e=>update('name', e.target.value)} required className="mt-1 p-3 rounded-lg border" />
              </label>

              <label className="flex flex-col">
                <span className="text-sm">📱 شماره تماس</span>
                <input aria-label="شماره تماس" value={form.phone} onChange={e=>update('phone', e.target.value)} placeholder="09xxxxxxxxx" required className="mt-1 p-3 rounded-lg border" />
              </label>
            </div>

            <label className="flex flex-col">
              <span className="text-sm">🏠 آدرس کامل</span>
              <textarea aria-label="آدرس کامل" value={form.address} onChange={e=>update('address', e.target.value)} required className="mt-1 p-3 rounded-lg border" rows={3} />
            </label>

            <label className="flex flex-col">
              <span className="text-sm">📨 کد پستی (اختیاری)</span>
              <input aria-label="کد پستی" value={form.postal} onChange={e=>update('postal', e.target.value)} className="mt-1 p-3 rounded-lg border" />
            </label>

            <fieldset className="mt-2">
              <legend className="text-base font-medium">🍵 محصولات طبیعی نوره سها</legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <ProductLine label="🟢 سها ۵۰۰ گرمی سبز" value={form.soha500_qty} onChange={v=>update('soha500_qty', v)} />
                <ProductLine label="🟡 سها ۲۵۰ گرمی ساشه" value={form.soha250_qty} onChange={v=>update('soha250_qty', v)} />
                <ProductLine label="📦 باکس پوچ یک کیلویی" value={form.pouch1kg_qty} onChange={v=>update('pouch1kg_qty', v)} />
                <ProductLine label="✨ پاکت طلایی پنجره‌دار" value={form.goldpack_qty} onChange={v=>update('goldpack_qty', v)} />
                <ProductLine label="🤍 پاکت یک کیلویی ساده" value={form.plain1kg_qty} onChange={v=>update('plain1kg_qty', v)} />
              </div>
            </fieldset>

            <label className="flex flex-col">
              <span className="text-sm">📝 توضیحات (اختیاری)</span>
              <input aria-label="توضیحات" value={form.notes} onChange={e=>update('notes', e.target.value)} placeholder="مثلاً ارسال فوری یا زمان تحویل..." className="mt-1 p-3 rounded-lg border" />
            </label>

            <div className="flex gap-3 items-center">
              <button type="submit" disabled={loading} className="px-5 py-3 rounded-lg shadow-sm bg-sohaGreen text-white font-medium">
                {loading ? 'در حال ارسال...' : '📦 ثبت و ارسال سفارش'}
              </button>

              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9891xxxxxxxx'}`} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-3 rounded-lg border">
                📞 تماس با پشتیبانی واتساپ
              </a>
            </div>

            {message && <div role="status" className="text-sm text-center mt-2">{message}</div>}
          </form>
        </div>

        <footer className="text-center text-xs text-gray-500 mt-4">طراحی شده برای فروش محصولات طبیعی — نوره سها</footer>
      </motion.section>
    </main>
  )
}

function ProductLine({label, value, onChange}){
  return (
    <label className="flex items-center justify-between gap-3 p-3 rounded-lg border">
      <div>
        <div className="text-sm">{label}</div>
        <div className="text-xs text-gray-500">تعداد — کارتنی (در صورت سفارش عمده)</div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={()=>onChange(Math.max(0, Number(value)-1))} aria-label={`کاهش ${label}`} className="px-3 py-1 rounded-md border">−</button>
        <input aria-label={`${label} تعداد`} value={value} onChange={e=>onChange(Number(e.target.value||0))} className="w-16 text-center p-1 rounded-md border" inputMode="numeric" />
        <button type="button" onClick={()=>onChange(Number(value)+1)} aria-label={`افزایش ${label}`} className="px-3 py-1 rounded-md border">+</button>
      </div>
    </label>
  )
}
