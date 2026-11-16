import { useEffect, useState } from 'react'

const EMAIL = 'tayadevaibhav60@gmail.com'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <a className="monogram" href="#top" aria-label="Vaibhav Tayade, back to top">
          <span className="monogram__mark">VT</span>
          <span className="monogram__bracket" aria-hidden="true" />
        </a>

        <nav className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`} aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              <span className="nav__link-index" aria-hidden="true">/</span>
              {link.label}
            </a>
          ))}
          <a className="nav__cta nav__cta--mobile" href={`mailto:${EMAIL}`}>
            Get in Touch
          </a>
        </nav>

        <a className="nav__cta nav__cta--desktop" href={`mailto:${EMAIL}`}>
          Get in Touch <span aria-hidden="true">&rarr;</span>
        </a>

        <button
          type="button"
          className={`nav__toggle ${menuOpen ? 'nav__toggle--open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
