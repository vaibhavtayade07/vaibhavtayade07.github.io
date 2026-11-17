import { lazy, Suspense } from 'react'
import Nav from './components/Nav'
import ScrollProgress from './components/ScrollProgress'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'

const GlobalElephant = lazy(() => import('./components/GlobalElephant'))

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollProgress />
      <div className="site-grid" aria-hidden="true" />
      <Suspense fallback={null}>
        <GlobalElephant />
      </Suspense>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
