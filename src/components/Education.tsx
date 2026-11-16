import Reveal from './Reveal'

export default function Education() {
  return (
    <section id="education" className="section education" aria-labelledby="education-title">
      <div className="container education__grid">
        <Reveal>
          <p className="eyebrow">// EDUCATION</p>
          <h2 id="education-title" className="section__title">
            <span>Foundation.</span>
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="education__card">
            <div className="education__badge">
              <span>2027</span>
              <small>EXPECTED</small>
            </div>
            <div className="education__detail">
              <h3>B.Tech in Computer Science</h3>
              <p>COEP Technological University</p>
              <p className="education__location">Pune, India</p>
            </div>
            <span className="education__glyph" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
