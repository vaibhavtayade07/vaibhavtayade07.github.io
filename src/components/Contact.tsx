import Reveal from './Reveal'

const EMAIL = 'tayadevaibhav60@gmail.com'

export default function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="contact__inner">
          <p className="eyebrow">// CONTACT</p>
          <h2 id="contact-title" className="contact__title">
            Let's build
            <br />
            <span>something.</span>
          </h2>
          <p className="contact__statement">
            Have a hard problem in agents, retrieval, or production AI? I'd love to hear about it.
          </p>

          <div className="contact__actions">
            <a className="btn btn--primary btn--lg" href={`mailto:${EMAIL}`}>
              Email Vaibhav <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          <div className="contact__details">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>

          <div className="contact__socials">
            <a
              href="https://github.com/vaibhavtayade07"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in a new tab)"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/vaibhav-tayade/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in a new tab)"
            >
              LinkedIn
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
