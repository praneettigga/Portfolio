import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import resumeUrl from '../Docs/References/MyResume-1.pdf'
import portraitUrl from './assets/portrait-pixel.png'
import { Header } from './components/Header.jsx'
import { PageHud } from './components/PageHud.jsx'
import { InteractivePixelField } from './components/InteractivePixelField.jsx'
import { SoundVisualizer } from './components/SoundVisualizer.jsx'

import { VariableName } from './components/VariableName.jsx'
import { ProjectCard } from './components/ProjectCard.jsx'
import { ExperienceCard } from './components/ExperienceCard.jsx'
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
  const heroRef = useRef(null)
  const [hasPassedLanding, setHasPassedLanding] = useState(false)

  useLayoutEffect(() => {
    const motion = gsap.matchMedia()

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const page = pageRef.current
      const root = document.documentElement
      let frame = 0
      let disposed = false
      page.classList.add('page--contact-transition')

      const fade = gsap.fromTo(root, { '--page-background': '#090909' }, {
        '--page-background': '#efeee9',
        ease: 'none',
        onUpdate() {
          // Switch polarity before white text loses contrast on the gray backdrop.
          page.dataset.contactTone = this.progress() < 0.473 ? 'dark' : 'light'
        },
        scrollTrigger: {
          trigger: page.querySelector('#contact'),
          start: 'clamp(top 95%)',
          end: 'clamp(top 35%)',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })

      const refresh = () => {
        frame = 0
        if (disposed) return
        ScrollTrigger.refresh()
        // Restored scroll positions and hash navigation must start at their actual theme.
        fade.progress(fade.scrollTrigger.progress)
      }
      const scheduleRefresh = () => {
        if (!frame && !disposed) frame = window.requestAnimationFrame(refresh)
      }
      const resize = new window.ResizeObserver(scheduleRefresh)
      resize.observe(page)
      window.addEventListener('pageshow', scheduleRefresh)
      document.fonts.ready.then(scheduleRefresh)
      refresh()

      return () => {
        disposed = true
        window.cancelAnimationFrame(frame)
        resize.disconnect()
        window.removeEventListener('pageshow', scheduleRefresh)
        page.classList.remove('page--contact-transition')
        delete page.dataset.contactTone
      }
    }, pageRef)

    return () => motion.revert()
  }, [])

  useEffect(() => {
    const updateTopButton = () => {
      setHasPassedLanding(heroRef.current?.getBoundingClientRect().bottom <= 0)
    }

    updateTopButton()
    window.addEventListener('scroll', updateTopButton, { passive: true })
    window.addEventListener('resize', updateTopButton)

    return () => {
      window.removeEventListener('scroll', updateTopButton)
      window.removeEventListener('resize', updateTopButton)
    }
  }, [])

  useLayoutEffect(() => {
    const motion = gsap.matchMedia()

    motion.add('(prefers-reduced-motion: no-preference)', (context) => {
      gsap.from('.hero-reveal', {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.07,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      })

      gsap.from('.portrait-wrap', {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.15,
        ease: 'power4.inOut',
        delay: 0.15,
      })

      gsap.to('.portrait', {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })

      const elements = gsap.utils.toArray('.reveal')
      const targetsFor = (element) => element.matches('.section-heading')
        ? [...element.children]
        : [element]

      elements.forEach((element) => {
        gsap.set(targetsFor(element), { y: 24, opacity: 0 })
      })

      // Live intersection geometry stays accurate while role details change height.
      // Observe the stable heading wrapper so its metadata leads the title slightly.
      const observer = new window.IntersectionObserver((entries) => {
        context.add(() => {
          entries.filter((entry) => entry.isIntersecting).forEach(({ target }, index) => {
            gsap.to(targetsFor(target), {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: Math.min(index * 0.055, 0.165),
              stagger: 0.07,
              ease: 'power3.out',
              overwrite: true,
              clearProps: 'transform,opacity',
            })
            observer.unobserve(target)
          })
        })
      }, { rootMargin: '0px 0px -5% 0px', threshold: 0 })
      elements.forEach((element) => observer.observe(element))

      const revealFocused = (event) => {
        const element = event.target.closest('.reveal')
        if (!element) return
        observer.unobserve(element)
        context.add(() => {
          gsap.to(targetsFor(element), {
            y: 0, opacity: 1, duration: 0, overwrite: true, clearProps: 'transform,opacity',
          })
        })
      }
      const page = pageRef.current
      page.addEventListener('focusin', revealFocused)

      return () => {
        observer.disconnect()
        page.removeEventListener('focusin', revealFocused)
      }
    }, pageRef)

    return () => motion.revert()
  }, [])

  return (
    <div className="page" ref={pageRef}>
      <Header />
      <PageHud />

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title" ref={heroRef}>
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
              <VariableName text="Praneet" base={320} hover={700} className="hero-reveal hero__first-name" />
              <VariableName text="Tigga" base={900} hover={600} className="hero-reveal hero__last-name" />
            </h1>
          </div>

          <div className="hero__facts hero-reveal">
            <span><i /> 3rd-year CSE student</span>
            <span><i /> Based in Coimbatore, India</span>
            <span><i /> Open to opportunities</span>
          </div>

        </section>

        <section className="section work" id="work" aria-labelledby="work-title">
          <SectionHeading number="01" eyebrow="Selected experience" title="Work / leadership" count="03 ENTRIES" />

          <div className="timeline">
            {experience.map((item, index) => (
              <ExperienceCard item={item} index={index} key={`${item.organization}-${item.role}`} />
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
          <SectionHeading number="04" eyebrow="Context & curiosity" title="ABOUT ME" />

          <div className="about-grid">
            <div className="about-statement reveal">
              <p className="kicker">Now / next</p>
              <p>
                Third-year Computer Science student at Karunya Institute of Technology and Sciences,
                learning by building systems that connect <em>people, software, and the physical world.</em>
              </p>
            </div>

            <div className="about-education-layout">
              <figure className="about-photo reveal">
                <img className="about-event-photo" src="/images/CGC-mc.PNG" alt="Praneet hosting an event at Karunya University" width="280" height="210" loading="lazy" />
              </figure>
            <div className="education-trail reveal">
              <p className="kicker">Where I’ve studied</p>
              <ol className="education-timeline" aria-label="Education timeline">
                <li>
                  <span className="education-timeline__date">2009 — 2017</span>
                  <div><h3>Bishop Cotton Boys’ School</h3><p>Bangalore, India</p></div>
                </li>
                <li>
                  <span className="education-timeline__date">2017 — 2021</span>
                  <div><h3>St. Paul’s School</h3><p>Darjeeling, India</p></div>
                </li>
                <li>
                  <span className="education-timeline__date">2021 — 2023</span>
                  <div><h3>Bishop Cotton Boys’ School</h3><p>Bangalore, India</p></div>
                </li>
                <li className="education-timeline__current">
                  <span className="education-timeline__date">2024 — Present</span>
                  <div>
                    <h3>Karunya Institute of Technology and Sciences</h3>
                    <p>B.Tech · Computer Science & Engineering · Coimbatore</p>
                    <div className="education-timeline__leadership">
                      <div>
                        <span>Along the way</span>
                        <h4>President · Career Guidance Club</h4>
                        <p>Creating opportunities through career events and study abroad workshops.</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
            </div>

            <div className="interests reveal">
              <SoundVisualizer />
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
            <ExternalLink className="contact__email contact__social reveal" href={links.github}>
              GitHub <span aria-hidden="true">↗</span>
            </ExternalLink>
            <ExternalLink className="contact__email contact__social reveal" href={links.linkedin}>
              LinkedIn <span aria-hidden="true">↗</span>
            </ExternalLink>
          </div>
          <div className="contact__links">
            <a className="contact__download" href={resumeUrl} download="Praneet-Nischal-Tigga-Resume.pdf">Résumé <span aria-hidden="true">↓</span></a>
          </div>
          <footer>
            <span>© 2026 PRANEET NISCHAL TIGGA</span>
            <span>DESIGNED & BUILT WITH INTENT</span>
          </footer>
        </section>
      </main>
      {hasPassedLanding && (
        <a className="back-to-top" href="#top" aria-label="Back to top" title="Back to top">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 11L12 5L18 11M12 5V20M5 3H19" />
          </svg>
          <span aria-hidden="true">TOP</span>
        </a>
      )}
    </div>
  )
}

export default App
