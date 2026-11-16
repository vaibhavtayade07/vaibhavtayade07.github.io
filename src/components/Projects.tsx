import { useRef, type MouseEvent } from 'react'
import Reveal from './Reveal'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

type Project = {
  title: string
  subtitle: string
  bullets: string[]
  tags: string[]
}

const projects: Project[] = [
  {
    title: 'TretaInvestment',
    subtitle: 'AI Mutual-Fund Back-Office Platform',
    bullets: [
      'Independently designed and built a production system automating a mutual fund distributor’s entire workflow with Python, PostgreSQL, and LLMs.',
      'ETL pipelines for AMFI/NSE market data and a RAG knowledge base over SEBI/AMFI circulars; Telegram bot with human-in-the-loop approvals and constraint-validated recommendations.',
      'Transaction ledger with FIFO cost basis, commission tracking, and a compliance rule engine, plus a NiceGUI dashboard with ECharts, CI, and full Docker deployment.',
    ],
    tags: ['Python', 'PostgreSQL', 'LLMs', 'RAG', 'Docker', 'NiceGUI'],
  },
  {
    title: 'FlytBase BDR Hackathon',
    subtitle: 'Autonomous Outbound Agent Pipeline',
    bullets: [
      'Built a 4-stage agent workflow covering account ID, contact discovery, account research, and email generation in a live single-day hackathon with no pre-reads.',
      'Targeted LatAm mining prospects for FlytBase’s drone inspection product.',
    ],
    tags: ['Multi-Agent', 'LangChain', 'Automation'],
  },
  {
    title: 'Enterprise RAG Knowledge Assistant',
    subtitle: 'Document-grounded Q&A at scale',
    bullets: [
      'Built a retrieval-augmented generation system for document-based Q&A, handling ingestion, chunking, and embedding generation into a vector database.',
      'Served through a FastAPI backend with a clean retrieval and generation interface.',
    ],
    tags: ['RAG', 'Vector DB', 'FastAPI'],
  },
  {
    title: 'Multi-Agent Business Ops System',
    subtitle: 'Supervisor-led specialist delegation',
    bullets: [
      'Designed and deployed a multi-agent system with a supervisor agent delegating to specialist sub-agents for distinct business tasks.',
      'Implemented structured tool use and handoff logic for reliable task routing.',
    ],
    tags: ['Google ADK', 'Multi-Agent', 'Tool Use'],
  },
]

function ProjectCard({ project, index, reduced }: { project: Project; index: number; reduced: boolean }) {
  const cardRef = useRef<HTMLElement>(null)

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduced || !cardRef.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform =
      `perspective(1000px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg) translateY(-4px)`
  }

  const handleLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  return (
    <Reveal delay={(index % 2) * 100}>
      <div className="project-card__wrap" onMouseMove={handleMove} onMouseLeave={handleLeave}>
        <article
          ref={cardRef}
          className={`project-card ${index === 0 ? 'project-card--featured' : ''}`}
        >
          <div className="project-card__top">
            <span className="project-card__index">0{index + 1}</span>
            <span className="project-card__glyph" aria-hidden="true" />
          </div>
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__subtitle">{project.subtitle}</p>
          <ul className="project-card__bullets">
            {project.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <ul className="project-card__tags" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </article>
      </div>
    </Reveal>
  )
}

export default function Projects() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="container">
        <Reveal className="section__header section__header--split">
          <div>
            <p className="eyebrow">// SELECTED WORK</p>
            <h2 id="projects-title" className="section__title">
              Things I've <span>built.</span>
            </h2>
          </div>
          <p className="section__lede">
            A few systems where I owned the outcome, from architecture and retrieval all the way
            to deployment.
          </p>
        </Reveal>

        <div className="projects__grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  )
}
