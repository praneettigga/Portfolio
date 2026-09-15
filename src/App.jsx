import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import resumeUrl from '../Docs/References/MyResume-1.pdf'
import portraitUrl from './assets/portrait-pixel.png'
import { Header } from './components/Header.jsx'
import { InteractivePixelField } from './components/InteractivePixelField.jsx'
import { ProjectCard } from './components/ProjectCard.jsx'
import { SectionHeading } from './components/SectionHeading.jsx'
import { certifications, experience, links, projects, skills } from './data/portfolio.js'

gsap.registerPlugin(ScrollTrigger)

function ExternalLink({ href, children, className = '' }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

function App() {
  const pageRef = useRef(null)

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const context = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 42,
        opacity: 0,
        duration: 1.05,
        stagger: 0.08,
        ease: 'power3.out',
      })

      gsap.from('.portrait-wrap', {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.4,
        ease: 'power4.inOut',
        delay: 0.15,
      })

      gsap.to('.portrait', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })

      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 56,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
            once: true,
          },
        })
      })

      gsap.to('.scroll-progress', {
        scaleX: 1,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: true,
        },
      })
    }, pageRef)

    return () => context.revert()
  }, [])

  return (
    <div className="page" ref={pageRef}>
      <div className="scroll-progress" aria-hidden="true" />
      <Header />

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero__pixel-field" aria-hidden="true">
            <InteractivePixelField />
          </div>
          <div className="cursor-reticle" aria-hidden="true"><span>+</span></div>

          <div className="hero__role hero-reveal">
            <p>Software Engineer</p>
            <span>Web systems · Linux · DevOps · IoT</span>
          </div>

          <div className="portrait-wrap">
            <div className="portrait">
              <div className="portrait__crop">
              <img className="portrait__image" src={portraitUrl} alt="Praneet Nischal Tigga" />
              <canvas className="portrait__pixels" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="hero__name" id="hero-title">
            <h1 aria-label="Praneet Tigga">
              <span className="hero-reveal hero__first-name">Praneet</span>
              <span className="hero-reveal hero__last-name">Tigga.</span>
            </h1>
          </div>

          <div className="hero__facts hero-reveal">
            <span><i /> 3rd-year CSE student</span>
            <span><i /> Based in Coimbatore, India</span>
            <span><i /> Open to opportunities</span>
          </div>

          <a className="hero__scroll hero-reveal" href="#work">
            <span aria-hidden="true">▼</span> Scroll
          </a>

          <div className="hero__hud hero-reveal" aria-hidden="true">
            <span>SCRL <b>0.00</b></span>
            <span>CRSR <b data-cursor-value>0.0</b></span>
            <span>01 — INTRO</span>
            <span>THEME <b>■ #C3FFFC</b></span>
            <span>+05:30</span>
          </div>
        </section>

        <section className="section work" id="work" aria-labelledby="work-title">
          <SectionHeading number="01" eyebrow="Selected experience" title="Work / leadership" count="03 ENTRIES" />

          <div className="timeline">
            {experience.map((item, index) => (
              <article className="timeline-item reveal" key={`${item.organization}-${item.role}`}>
                <div className="timeline-item__number">0{index + 1}</div>
                <div className="timeline-item__period">{item.period}</div>
                <div className="timeline-item__main">
                  <p>{item.organization}</p>
                  <h3>{item.role}</h3>
                  <p className="timeline-item__summary">{item.summary}</p>
                  <ul className="tag-list">
                    {item.stack.map((technology) => <li key={technology}>{technology}</li>)}
                  </ul>
                </div>
                <div className="timeline-item__location">{item.location}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="section projects" id="projects" aria-labelledby="projects-title">
          <SectionHeading number="02" eyebrow="Selected builds" title="Projects with a pulse" count="02 PROJECTS" />
          <div className="project-list">
            {projects.map((project) => <ProjectCard key={project.title} project={project} />)}
          </div>
        </section>

        <section className="section toolkit" id="toolkit" aria-labelledby="toolkit-title">
          <SectionHeading number="03" eyebrow="Technical inventory" title="Tools I think with" count="04 GROUPS" />
          <div className="toolkit-grid">
            <div className="toolkit-console reveal" aria-hidden="true">
              <div className="console-bar"><span>praneet@portfolio:~</span><span>● ● ●</span></div>
              <pre>{`$ whoami\nsoftware_engineer_in_progress\n\n$ ls ./interests\nlinux  devops  web  iot\n\n$ systemctl status curiosity\n● active (running)\n\n$ _`}</pre>
            </div>
            <div className="skill-list">
              {skills.map((skill) => (
                <article className="skill-row reveal" key={skill.group}>
                  <div><span>{skill.number}</span><h3>{skill.group}</h3></div>
                  <p>{skill.items.join(' · ')}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section about" id="about" aria-labelledby="about-title">
          <SectionHeading number="04" eyebrow="Context & curiosity" title="Beyond the code" />

          <div className="about-grid">
            <div className="about-statement reveal">
              <p className="kicker">Now / next</p>
              <p>
                Third-year Computer Science student at Karunya Institute of Technology and Sciences,
                learning by building systems that connect <em>people, software, and the physical world.</em>
              </p>
            </div>

            <article className="about-card reveal">
              <span>EDU / 01</span>
              <div>
                <p>2024 — Present</p>
                <h3>B.Tech · Computer Science & Engineering</h3>
                <p>Karunya Institute of Technology and Sciences · Coimbatore</p>
              </div>
            </article>

            <article className="about-card reveal">
              <span>LEAD / 02</span>
              <div>
                <p>Current</p>
                <h3>Career Guidance Club President</h3>
                <p>Building opportunities for students through workshops, events, and shared direction.</p>
              </div>
            </article>

            <div className="interests reveal">
              <div className="interests__orbit" aria-hidden="true"><span>+</span></div>
              <div>
                <p className="kicker">Off the clock / still creating</p>
                <h3>Sound is another system.</h3>
                <p>
                  Away from editors and terminals, I explore music production—and occasionally release what I make into the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section certifications" id="certifications" aria-labelledby="certifications-title">
          <SectionHeading number="05" eyebrow="Learning trail" title="Certifications" count="06 VERIFIED STUDIES" />
          <div className="certification-list">
            {certifications.map((certification, index) => (
              <article className="certification-row reveal" key={certification.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{certification.issuer}</p>
                <h3>{certification.title}</h3>
                <span aria-hidden="true">◇</span>
              </article>
            ))}
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="contact__meta reveal">
            <span>06 / CONTACT</span>
            <span>OPEN TO INTERNSHIPS & COLLABORATION</span>
          </div>
          <div className="contact__main">
            <p className="kicker reveal">Have a system worth building?</p>
            <h2 id="contact-title" className="reveal">Let&apos;s make it <em>work.</em></h2>
            <a className="contact__email reveal" href={links.email}>
              praneetnischal@karunya.edu.in <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="contact__links reveal">
            <ExternalLink href={links.github}>GitHub <span>↗</span></ExternalLink>
            <ExternalLink href={links.linkedin}>LinkedIn <span>↗</span></ExternalLink>
            <a href={resumeUrl} download="Praneet-Nischal-Tigga-Resume.pdf">Résumé <span>↓</span></a>
            <a href="#top">Back to top <span>↑</span></a>
          </div>
          <footer>
            <span>© 2026 PRANEET NISCHAL TIGGA</span>
            <span>DESIGNED & BUILT WITH INTENT</span>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App
