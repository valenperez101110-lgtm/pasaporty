import { useState, useEffect, useRef } from 'react'
import './App.css'

/* ── Intersection observer hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ── Counter animation ── */
function AnimatedNumber({ value, suffix = '', duration = 1200 }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView()
  useEffect(() => {
    if (!inView) return
    const num = parseInt(value)
    const start = performance.now()
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setCount(Math.floor(ease * num))
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value, duration])
  return <span ref={ref}>{value === '#1' ? '#1' : count}{suffix}</span>
}

/* ── Top Notice ── */
function TopNotice() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="top-notice">
      <span>⚠️ <strong>Aviso:</strong> Sitio informativo independiente. <strong>No es una página oficial del Gobierno de Colombia.</strong></span>
      <button onClick={() => setVisible(false)} aria-label="Cerrar aviso" className="notice-close">✕</button>
    </div>
  )
}

/* ── Header ── */
function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#inicio" className="logo">
          <div className="logo-icon">🛂</div>
          <div className="logo-name">Pasa<span>Portal</span> <em>al Día</em></div>
        </a>
        <nav className="nav-links">
          <a href="#pasos">Guía</a>
          <a href="#errores">Errores</a>
          <a href="#asesoria">Asesoría</a>
        </nav>
        <a href="#contacto" className="nav-cta">
          <span>Pedir Asesoría</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </header>
  )
}

/* ── Hero ── */
function Hero() {
  return (
    <section className="hero" id="inicio">
      {/* Background decoration */}
      <div className="hero-bg-orb hero-bg-orb--1" />
      <div className="hero-bg-orb hero-bg-orb--2" />
      <div className="hero-grid-overlay" />

      <div className="container hero-content">
        <div className="hero-left">
          <div className="hero-badge animate-fade-up">
            <div className="colombia-flag"><div /><div /><div /></div>
            <span>🗓️ Guía actualizada 2025</span>
          </div>

          <h1 className="hero-title animate-fade-up delay-1">
            Tu pasaporte colombiano,{' '}
            <span className="hero-highlight">sin complicaciones</span>
          </h1>

          <p className="hero-sub animate-fade-up delay-2">
            Guía paso a paso para agendar tu cita, conocer los requisitos, costos reales y evitar los errores que le cuestan tiempo y dinero a miles de colombianos.
          </p>

          <div className="hero-ctas animate-fade-up delay-3">
            <a href="#pasos" className="btn btn-gold">
              📋 Ver guía completa
            </a>
            <a href="#contacto" className="btn btn-ghost">
              💬 Solicitar asesoría
            </a>
          </div>
        </div>

        {/* Stats card */}
        <aside className="hero-stats animate-fade-up delay-4">
          <div className="stat-blob">
            <div className="stat-row">
              <div className="stat-item">
                <div className="stat-num gold"><AnimatedNumber value="10" suffix=" años" /></div>
                <p>Vigencia pasaporte adulto</p>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <div className="stat-num"><AnimatedNumber value="90" suffix="+" /></div>
                <p>Países sin visa</p>
              </div>
            </div>
            <div className="stat-full">
              <div className="stat-num gold">#1</div>
              <p>Error más común: datos mal ingresados</p>
            </div>
            <a href="https://cancilleria.gov.co" target="_blank" rel="noopener noreferrer" className="stat-cta">
              Portal oficial Cancillería →
            </a>
          </div>
        </aside>
      </div>

      {/* Trust strip */}
      <div className="trust-strip">
        <div className="container trust-inner">
          {[
            { icon: '✅', text: 'Información verificada' },
            { icon: '🔒', text: 'Datos seguros' },
            { icon: '👨‍💼', text: 'Asesoría personalizada' },
            { icon: '⚡', text: 'Proceso simplificado' },
          ].map((t, i) => (
            <div className="trust-item" key={i}>
              <span>{t.icon}</span> {t.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Steps Section ── */
const STEPS = [
  {
    num: '01',
    icon: '📄',
    title: 'Reúne los documentos',
    desc: 'Antes de agendar, verifica que tienes todo listo. Los requisitos varían si es primera vez o renovación.',
    adultos: ['Cédula de ciudadanía original vigente', 'Pasaporte anterior (si es renovación)', 'Comprobante de pago de derechos'],
    menores: ['Registro civil de nacimiento original', 'Tarjeta de identidad (si aplica)', 'Cédulas de ambos padres o tutor legal', 'Autorización notarial si un padre no asiste'],
  },
  {
    num: '02',
    icon: '💳',
    title: 'Realiza el pago de derechos',
    desc: 'El pago se hace antes de agendar la cita. Puedes pagarlo en entidades bancarias autorizadas o en línea.',
    items: ['Ingresa al portal de Cancillería colombiana', 'Selecciona "Pago de derechos de pasaporte"', 'Paga en línea o en bancos autorizados', 'Descarga y guarda el comprobante', '⚠️ Sin comprobante no podrás agendar'],
    costs: [
      { label: 'Pasaporte ordinario (adulto)', val: '~$274.000 COP' },
      { label: 'Pasaporte menor de edad', val: '~$274.000 COP' },
      { label: 'Pasaporte de emergencia', val: 'Consultar' },
    ],
  },
  {
    num: '03',
    icon: '🗓️',
    title: 'Agenda tu cita en línea',
    desc: 'Una vez realizado el pago, agenda la cita a través del sistema oficial de Cancillería.',
    items: ['Entra a cancilleria.gov.co', 'Selecciona Pasaportes → Agendar cita', 'Ingresa tu cédula y comprobante de pago', 'Elige ciudad, sede y fecha disponible', 'Confirma y descarga el comprobante de cita'],
  },
  {
    num: '04',
    icon: '📍',
    title: '¿Dónde tramitar el pasaporte?',
    desc: 'Puedes hacer el trámite en Oficinas de Pasaportes de la Cancillería en todo el país.',
    items: ['Bogotá — Sede principal (Paloquemao y otras)', 'Medellín, Cali, Barranquilla, Cartagena', 'Pereira, Manizales, Armenia, Bucaramanga', 'Todas las capitales departamentales', 'Consultar sede más cercana en cancilleria.gov.co'],
  },
  {
    num: '05',
    icon: '📬',
    title: 'Recibe tu pasaporte',
    desc: 'Después de tu cita presencial, el pasaporte será enviado a tu domicilio.',
    items: ['Lleva todos tus documentos originales a la cita', 'Te toman foto y huella dactilar en la sede', 'El pasaporte se envía por correo certificado', 'Tiempo de entrega: 15 a 30 días hábiles', 'Puedes rastrear el envío con el número dado'],
  },
]

function StepCard({ step, index }) {
  const [ref, inView] = useInView()
  return (
    <article
      ref={ref}
      className={`step-card ${inView ? 'is-visible' : ''}`}
      style={{ '--delay': `${index * 0.08}s` }}
    >
      <div className="step-header">
        <span className="step-num">{step.num}</span>
        <span className="step-icon">{step.icon}</span>
      </div>
      <h3>{step.title}</h3>
      <p>{step.desc}</p>

      {step.adultos && (
        <>
          <div className="sub-label">Para adultos:</div>
          <ul className="step-list">{step.adultos.map((it, i) => <li key={i}><span className="dot" />{'  '}{it}</li>)}</ul>
          <div className="sub-label" style={{ marginTop: '12px' }}>Para menores de edad:</div>
          <ul className="step-list">{step.menores.map((it, i) => <li key={i}><span className="dot" />{it}</li>)}</ul>
        </>
      )}

      {step.items && !step.costs && (
        <ul className="step-list">{step.items.map((it, i) => <li key={i}><span className="dot" />{it}</li>)}</ul>
      )}

      {step.costs && (
        <>
          <ul className="step-list">{step.items.map((it, i) => <li key={i}><span className="dot" />{it}</li>)}</ul>
          <div className="cost-table">
            {step.costs.map((c, i) => (
              <div className="cost-row" key={i}>
                <span>{c.label}</span>
                <strong>{c.val}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  )
}

function StepsSection() {
  const [ref, inView] = useInView()
  return (
    <section id="pasos" className="steps-section">
      <div className="section-decor" />
      <div className="container">
        <div ref={ref} className={`section-head ${inView ? 'is-visible' : ''}`}>
          <span className="eyebrow">Guía completa</span>
          <h2>Paso a paso: cómo agendar tu pasaporte en Colombia</h2>
          <p>Sigue esta guía en orden. Aplica tanto para pasaporte nuevo como para renovación.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => <StepCard key={i} step={s} index={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ── Errors Section ── */
const ERRORS = [
  { icon: '❌', title: 'Datos incorrectos', desc: 'Errores tipográficos en el nombre o número de cédula invalidan el trámite.', tip: '✅ Verifica cada dato dos veces antes de confirmar.' },
  { icon: '💸', title: 'Pago mal realizado', desc: 'Pagar sin seguir el proceso oficial hace que el pago no se reconozca.', tip: '✅ Solo usa los canales autorizados por Cancillería.' },
  { icon: '📅', title: 'Cita sin comprobante', desc: 'Ir a la cita sin imprimir o tener el comprobante puede hacer que te rechacen.', tip: '✅ Lleva el PDF impreso y también en tu celular.' },
  { icon: '📋', title: 'Documentos incompletos', desc: 'Olvidar un documento original es uno de los errores más frecuentes y costosos.', tip: '✅ Usa nuestra checklist antes de salir de casa.' },
  { icon: '⏰', title: 'Llegar tarde a la cita', desc: 'Las citas en Cancillería son muy puntuales y no permiten demoras.', tip: '✅ Llega 20 minutos antes de tu hora asignada.' },
  { icon: '🔄', title: 'No cancelar a tiempo', desc: 'Si no puedes ir, cancela con anticipación o perderás el pago.', tip: '✅ Cancela con al menos 24h de antelación.' },
]

function ErrorsSection() {
  const [ref, inView] = useInView()
  return (
    <section id="errores" className="errors-section">
      <div className="container">
        <div ref={ref} className={`section-head text-center ${inView ? 'is-visible' : ''}`}>
          <span className="eyebrow eyebrow--red">Errores frecuentes</span>
          <h2>Lo que debes evitar</h2>
          <p>Miles de colombianos repiten el trámite por estos errores. Identifícalos a tiempo.</p>
        </div>
        <div className="errors-grid">
          {ERRORS.map((e, i) => {
            const [eRef, eInView] = useInView()
            return (
              <div
                ref={eRef}
                key={i}
                className={`error-card ${eInView ? 'is-visible' : ''}`}
                style={{ '--delay': `${i * 0.07}s` }}
              >
                <span className="error-icon">{e.icon}</span>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
                <div className="error-tip">{e.tip}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Advisory + Contact ── */
function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | success
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', ciudad: '', mensaje: '' })

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => setStatus('success'), 1200)
  }

  if (status === 'success') return (
    <div className="form-success">
      <div className="success-icon">🎉</div>
      <h3>¡Solicitud enviada!</h3>
      <p>Recibimos tu mensaje. Te contactaremos en menos de 24 horas con la información que necesitas.</p>
    </div>
  )

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label>Nombre completo *</label>
          <input name="nombre" type="text" placeholder="Tu nombre" value={form.nombre} onChange={handle} required />
        </div>
        <div className="form-group">
          <label>Correo electrónico *</label>
          <input name="correo" type="email" placeholder="tu@correo.com" value={form.correo} onChange={handle} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Teléfono / WhatsApp</label>
          <input name="telefono" type="tel" placeholder="+57 300 000 0000" value={form.telefono} onChange={handle} />
        </div>
        <div className="form-group">
          <label>Ciudad</label>
          <input name="ciudad" type="text" placeholder="¿En qué ciudad estás?" value={form.ciudad} onChange={handle} />
        </div>
      </div>
      <div className="form-group">
        <label>¿En qué te podemos ayudar? *</label>
        <textarea name="mensaje" placeholder="Cuéntanos tu caso: primera vez, renovación, menores, urgente..." value={form.mensaje} onChange={handle} required rows={4} />
      </div>
      <button type="submit" className="btn btn-gold btn-full" disabled={status === 'sending'}>
        {status === 'sending' ? '⏳ Enviando...' : '📨 Enviar solicitud de asesoría'}
      </button>
      <p className="form-privacy">Al enviar aceptas nuestra <a href="#legal">política de privacidad</a>. Tu información es confidencial.</p>
    </form>
  )
}

function AdvisorySection() {
  const [ref, inView] = useInView()
  return (
    <section id="asesoria" className="advisory-section">
      <div className="advisory-bg-circle" />
      <div className="container">
        <div ref={ref} className={`advisory-grid ${inView ? 'is-visible' : ''}`}>
          <div className="advisory-left">
            <span className="eyebrow eyebrow--white">Asesoría experta</span>
            <h2 className="white">¿Tienes dudas específicas sobre tu trámite?</h2>
            <p className="white-soft">Nuestros asesores responden todas tus preguntas sobre el proceso de pasaporte colombiano. Sin costo, sin compromisos.</p>
            <ul className="benefits">
              {[
                { icon: '🎯', text: 'Revisión de tu caso particular' },
                { icon: '📋', text: 'Checklist personalizada de documentos' },
                { icon: '🚀', text: 'Guía para casos urgentes o especiales' },
                { icon: '👨‍👩‍👧', text: 'Apoyo para trámites de menores de edad' },
              ].map((b, i) => (
                <li key={i} className="benefit-item">
                  <span className="benefit-icon">{b.icon}</span>
                  <span>{b.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div id="contacto" className="advisory-right">
            <div className="form-card">
              <h3>Solicita tu asesoría gratuita</h3>
              <p>Cuéntanos tu caso y te respondemos en menos de 24 horas</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Reviews ── */
const REVIEWS = [
  { initials: 'ML', name: 'María L.', city: 'Medellín, Antioquia', text: 'Estaba muy perdida con el proceso del pasaporte para mi hija menor. Esta guía me explicó todo clarísimo y pude agendar sin ningún problema.' },
  { initials: 'JR', name: 'Julián R.', city: 'Bogotá, Cundinamarca', text: 'Yo ya había intentado agendar dos veces y fallé. Con esta guía identifiqué que el error era el pago. La tercera vez salió perfecto.' },
  { initials: 'CA', name: 'Camila A.', city: 'Cali, Valle del Cauca', text: 'Necesitaba el pasaporte urgente y la asesoría fue clave. Me dijeron exactamente qué pedir y cómo proceder. ¡Mil gracias!' },
]

function ReviewsSection() {
  return (
    <section className="reviews-section">
      <div className="container">
        <div className="section-head text-center">
          <span className="eyebrow">Testimonios</span>
          <h2>Personas que siguieron esta guía</h2>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => {
            const [ref, inView] = useInView()
            return (
              <article ref={ref} key={i} className={`review-card ${inView ? 'is-visible' : ''}`} style={{ '--delay': `${i * 0.1}s` }}>
                <div className="stars">★★★★★</div>
                <p className="review-text">"{r.text}"</p>
                <div className="reviewer">
                  <div className="reviewer-avatar">{r.initials}</div>
                  <div>
                    <strong>{r.name}</strong>
                    <span>{r.city}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Legal ── */
function LegalSection() {
  return (
    <section id="legal" className="legal-section">
      <div className="container">
        <span className="eyebrow">Transparencia</span>
        <h2>Políticas y términos de uso</h2>
        <div className="legal-grid">
          <div className="legal-block">
            <h3>Política de Privacidad</h3>
            <p>En PasaPortal al Día nos comprometemos a proteger tu información personal. Los datos recopilados a través del formulario de contacto son utilizados exclusivamente para brindarte asesoría sobre el trámite de pasaporte colombiano.</p>
            <p><strong>No vendemos ni compartimos tus datos</strong> con terceros. Puedes solicitar su eliminación en cualquier momento. Al usar este sitio aceptas esta política conforme a la Ley 1581 de 2012 (Habeas Data) de Colombia.</p>
          </div>
          <div className="legal-block">
            <h3>Términos y Condiciones</h3>
            <p><strong>Naturaleza del servicio:</strong> PasaPortal al Día es un servicio de información y asesoría independiente. <strong>No somos una entidad gubernamental</strong> ni tenemos afiliación con la Cancillería colombiana.</p>
            <p><strong>Alcance:</strong> La información es orientativa y se basa en fuentes oficiales. Las regulaciones pueden cambiar. Verifica siempre en <strong>cancilleria.gov.co</strong> antes de realizar tu trámite.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">🛂</div>
              <div className="logo-name">Pasa<span>Portal</span> <em>al Día</em></div>
            </div>
            <p>Guía informativa independiente para colombianos que desean tramitar o renovar su pasaporte.</p>
          </div>
          <div>
            <h4>Guía rápida</h4>
            <nav className="footer-links">
              <a href="#pasos">Paso a paso</a>
              <a href="#errores">Errores comunes</a>
              <a href="#asesoria">Asesoría</a>
              <a href="#contacto">Contacto</a>
            </nav>
          </div>
          <div>
            <h4>Legal</h4>
            <nav className="footer-links">
              <a href="#legal">Política de privacidad</a>
              <a href="#legal">Términos y condiciones</a>
              <a href="https://cancilleria.gov.co" target="_blank" rel="noopener noreferrer">Cancillería oficial ↗</a>
            </nav>
          </div>
        </div>
        <div className="footer-disclaimer">
          <strong>⚠️ Aviso importante:</strong> Este sitio web <strong>NO es una página oficial del Gobierno de Colombia</strong>, la Cancillería colombiana ni ninguna entidad estatal. Es un servicio informativo independiente. Para trámites oficiales visita siempre <strong>cancilleria.gov.co</strong>.
        </div>
        <div className="footer-bottom">
          <p>© 2025 PasaPortal al Día — Todos los derechos reservados</p>
          <p>Hecho con ❤️ para colombianos viajeros</p>
        </div>
      </div>
    </footer>
  )
}

/* ── App ── */
export default function App() {
  return (
    <>
      <TopNotice />
      <Header />
      <main>
        <Hero />
        <StepsSection />
        <ErrorsSection />
        <AdvisorySection />
        <ReviewsSection />
        <LegalSection />
      </main>
      <Footer />
    </>
  )
}
