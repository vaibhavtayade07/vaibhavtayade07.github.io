import Reveal from './Reveal'

type Group = {
  index: string
  title: string
  items: string[]
}

const primary: Group[] = [
  {
    index: '01',
    title: 'AI Agents & Agentic Systems',
    items: [
      'Google ADK',
      'LangChain',
      'Multi-agent orchestration',
      'Tool-use design',
      'Agent memory & handoff patterns',
    ],
  },
  {
    index: '02',
    title: 'Generative AI Engineering',
    items: [
      'RAG pipelines',
      'Vector databases',
      'Embeddings & semantic search',
      'Hybrid retrieval',
      'Prompt engineering',
      'OpenAI API',
      'Hugging Face',
    ],
  },
]

const secondary: Group[] = [
  {
    index: '03',
    title: 'Backend & APIs',
    items: ['FastAPI', 'REST API design', 'Service integration', 'Python'],
  },
  {
    index: '04',
    title: 'AI Systems Architecture',
    items: [
      'Enterprise AI architecture',
      'GenAI project lifecycle',
      'Production AI systems',
      'Performance / scalability / reliability',
    ],
  },
  {
    index: '05',
    title: 'Tools & Practices',
    items: ['Git / GitHub workflows', 'API integration', 'n8n', 'Docker', 'Cross-functional delivery'],
  },
]

function SkillGroup({ group }: { group: Group }) {
  return (
    <div className="skill-group">
      <div className="skill-group__label">
        <span className="skill-group__index">{group.index}</span>
        <h3>{group.title}</h3>
      </div>
      <ul className="chip-list">
        {group.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="container">
        <Reveal className="section__header">
          <p className="eyebrow">// STACK</p>
          <h2 id="skills-title" className="section__title">
            Tools I <span>reach for.</span>
          </h2>
          <p className="section__lede">
            A working stack, not a wishlist — the tools I use to take systems from prototype to
            production.
          </p>
        </Reveal>

        <div className="skills__layout">
          <div className="skills__col skills__col--primary">
            {primary.map((group, i) => (
              <Reveal key={group.index} delay={i * 90}>
                <SkillGroup group={group} />
              </Reveal>
            ))}
          </div>
          <div className="skills__col skills__col--secondary">
            {secondary.map((group, i) => (
              <Reveal key={group.index} delay={100 + i * 90}>
                <SkillGroup group={group} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
