import Reveal from './Reveal'

type Role = {
  title: string
  company: string
  period: string
  bullets: string[]
}

const roles: Role[] = [
  {
    title: 'AI Engineer Intern',
    company: 'Avquint Innovation',
    period: 'Jan 2024 to Jun 2024',
    bullets: [
      'Built and experimented with multiple AI agents and agentic workflows, evaluating orchestration and tooling approaches for real use cases.',
      'Worked hands-on across the GenAI toolchain — agent frameworks, LLM APIs, and retrieval components — to prototype and iterate on AI-driven features.',
    ],
  },
  {
    title: 'Founder & AI Solutions Developer',
    company: 'Sericaway.run',
    period: 'Jul 2024 to Jan 2026',
    bullets: [
      'Founded Sericaway, building AI systems and agents for business clients, delivering multiple production-ready systems from requirements through deployment.',
      'Owned the full delivery lifecycle — architecture, implementation, and handoff — across multiple client engagements.',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title">
      <div className="container experience__grid">
        <Reveal className="section__header experience__head">
          <p className="eyebrow">// EXPERIENCE</p>
          <h2 id="experience-title" className="section__title">
            Where I've <span>shipped.</span>
          </h2>
          <p className="section__lede">
            From embedding AI into existing products to founding my own AI solutions practice.
          </p>
        </Reveal>

        <ol className="timeline">
          {roles.map((role, i) => (
            <Reveal key={role.company} delay={i * 120}>
              <li className="timeline__item">
                <span className="timeline__node" aria-hidden="true" />
                <div className="timeline__meta">
                  <span className="timeline__period">{role.period}</span>
                  <span className="timeline__company">{role.company}</span>
                </div>
                <div className="timeline__content">
                  <h3>{role.title}</h3>
                  <ul className="timeline__bullets">
                    {role.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
