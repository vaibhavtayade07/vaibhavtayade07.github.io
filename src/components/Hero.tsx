import { lazy, Suspense, useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

const Scene = lazy(() => import('./Scene'))

const WORDS = ['Generative AI', 'Agentic Systems', 'RAG Pipelines', 'Multi-Agent Orchestration']

function useTypewriter(reduced: boolean) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduced) return
    const word = WORDS[index]
    let delay = deleting ? 45 : 90
    if (!deleting && text === word) delay = 1700
    if (deleting && text === '') delay = 320

    const timer = window.setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true)
      } else if (deleting && text === '') {
        setDeleting(false)
        setIndex((current) => (current + 1) % WORDS.length)
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
      }
    }, delay)

    return () => window.clearTimeout(timer)
  }, [text, deleting, index, reduced])

  return reduced ? WORDS[0] : text
}

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const typed = useTypewriter(reduced)

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <Suspense
        fallback={
          <div className="scene-layer" aria-hidden="true">
            <div className="scene-fallback" />
          </div>
        }
      >
        <Scene />
      </Suspense>

      <div className="hero__overlay container">
        <div className="hero__content">
          <p className="eyebrow hero__eyebrow">
            <span className="eyebrow__square" aria-hidden="true" />
            Applied AI Engineer <span className="eyebrow__sep">/</span> Pune, India
          </p>

          <div className="status-chip">
            <span className="status-chip__dot" aria-hidden="true" />
            Open to opportunities
          </div>

          <h1 id="hero-title" className="hero__title">
            Vaibhav <span>Tayade</span>
          </h1>

          <p className="hero__type" aria-hidden="true">
            <span className="hero__type-prefix">I build&nbsp;</span>
            <span className="hero__type-word">{typed}</span>
            <span className="hero__caret" />
          </p>
          <p className="sr-only">
            I build Generative AI, Agentic Systems, RAG Pipelines, and Multi-Agent Orchestration.
          </p>

          <p className="hero__intro">
            Shipping AI agents and LLM-powered systems for real-world business applications.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#projects">
              View Projects <span aria-hidden="true">&rarr;</span>
            </a>
            <a className="btn btn--ghost" href="#contact">
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      <div className="hero__hud" aria-hidden="true">
        <div className="hud__row"><span>NET</span><span>AGENT.NEXUS</span></div>
        <div className="hud__row"><span>NODES</span><span>08 / ACTIVE</span></div>
        <div className="hud__row"><span>SIGNAL</span><span className="hud__live">STABLE</span></div>
        <div className="hud__bar"><span /></div>
      </div>

      <a className="hero__scroll" href="#about">
        <span className="hero__scroll-label">Scroll to explore</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  )
}
