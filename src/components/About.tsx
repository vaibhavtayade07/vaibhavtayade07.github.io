import Reveal from './Reveal'

const stats = ['Founder @ Sericaway', "COEP '27", 'Pune, India']

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about__grid">
        <Reveal className="about__head">
          <p className="eyebrow">// ABOUT</p>
          <h2 id="about-title" className="section__title">
            AI systems,
            <br />
            <span>end to end.</span>
          </h2>
          <div className="section__rule" aria-hidden="true" />
        </Reveal>

        <Reveal className="about__body" delay={120}>
          <p>
            I'm a final year Computer Science student at COEP Technological University and the
            founder of Sericaway, where I build AI agents and LLM powered systems for real world
            business applications. My work spans agentic workflows, Model Context Protocol (MCP),
            LangChain, RAG, and vector search, backed by FastAPI services and hands on experience
            with Hugging Face, n8n, and modern AI frameworks.
          </p>
          <p>
            I take systems end to end, from data pipelines and retrieval systems to Telegram bots
            and Docker deployments. I pick up unfamiliar tech quickly and execute under pressure,
            having once shipped a four stage agent pipeline in a one day hackathon with no prior
            prep.
          </p>

          <ul className="stat-strip" aria-label="At a glance">
            {stats.map((stat) => (
              <li key={stat}>
                <span className="stat-strip__marker" aria-hidden="true" />
                {stat}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
