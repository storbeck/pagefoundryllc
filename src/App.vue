<template>
  <div class="page">
    <div class="layout">
      <nav class="top-nav">
        <div class="brand">
          <img src="/images/logo.png" alt="PageFoundry mark" />
          <span>PageFoundry LLC</span>
        </div>
        <div class="menu">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="`#${link.id}`"
            :class="{ active: activeSection === link.id }"
          >
            {{ link.label }}
          </a>
        </div>
        <div class="nav-actions">
          <div class="contact-menu">
            <button
              class="action-dots"
              type="button"
              aria-label="Open contact menu"
              :aria-expanded="contactOpen"
              @click.stop="toggleContactMenu"
              ref="dotsButton"
            >
              <span></span><span></span><span></span>
            </button>
            <transition name="fade-scale">
              <div
                v-if="contactOpen"
                class="contact-menu-panel"
                ref="contactPanel"
                role="menu"
                aria-label="Contact links"
                @click.stop
              >
                <div class="contact-menu-header">Get in touch</div>
                <button class="contact-menu-item" type="button" role="menuitem" @click="openCardView">
                  <span class="contact-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14l-4-3-4 3-4-3-2 1.5V5Z"
                      />
                    </svg>
                  </span>
                  Card
                </button>
                <a
                  class="contact-menu-item"
                  href="https://www.linkedin.com/in/geoff-storbeck-81a25035/"
                  target="_blank"
                  rel="noreferrer"
                  role="menuitem"
                >
                  <span class="contact-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5ZM.24 8h4.52V24H.24V8ZM8.77 8h4.33v2.18h.06c.6-1.14 2.07-2.35 4.27-2.35 4.57 0 5.41 3 5.41 6.9V24h-4.71v-7.27c0-1.73-.03-3.95-2.41-3.95-2.41 0-2.78 1.88-2.78 3.82V24H8.77V8Z"
                      />
                    </svg>
                  </span>
                  LinkedIn
                </a>
                <a class="contact-menu-item" href="https://storbeck.dev" target="_blank" rel="noreferrer" role="menuitem">
                  <span class="contact-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M4 4.5A2.5 2.5 0 0 1 6.5 2h11A2.5 2.5 0 0 1 20 4.5v15.11c0 .2-.22.33-.4.23L15.7 17.5H6.5A2.5 2.5 0 0 1 4 15v-10Zm2.5-.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h9.5l1.5 1V4.5a.5.5 0 0 0-.5-.5h-10Z"
                      />
                    </svg>
                  </span>
                  Blog
                </a>
                <a class="contact-menu-item" href="mailto:hello@pagefoundry.dev" role="menuitem">
                  <span class="contact-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2.7-.4a.5.5 0 0 0-.7.4v.2l6 4.3a1.5 1.5 0 0 0 1.8 0l6-4.2v-.3a.5.5 0 0 0-.7-.4L12 10 5.7 6.1Z"
                      />
                    </svg>
                  </span>
                  Email
                </a>
              </div>
            </transition>
          </div>
        </div>
      </nav>
      <transition name="fade-scale">
        <div
          v-if="showCardView"
          class="card-view"
          role="dialog"
          aria-modal="true"
          aria-label="Digital business card full view"
        >
          <div class="card-view-controls">
            <div class="card-view-actions">
              <button class="close-card" type="button" @click="closeCardView" aria-label="Close card view">
                ×
              </button>
            </div>
          </div>
          <div class="card-view-stage">
            <div class="card-flip" :class="{ flipped: cardFlipped }" @click="toggleCardFlip" aria-live="polite">
              <div class="card-face card-front">
                <div class="card-front-body">
                  <div class="card-front-mark">
                    <img src="/images/logo.png" alt="PageFoundry logo" />
                  </div>
                  <div class="card-front-text">
                    <div class="card-front-name">PageFoundry LLC</div>
                    <div class="card-front-tagline">Web Development & Digital Solutions</div>
                  </div>
                </div>
              </div>
              <div class="card-face card-back">
                <div class="card-back-body">
                  <div class="card-back-copy">
                    <div class="card-back-name">Geoff Storbeck</div>
                    <div class="card-back-role">Founder & Developer</div>
                    <div class="card-back-list">
                      <div class="card-back-item">
                        <span class="card-back-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path :d="icons.email" />
                          </svg>
                        </span>
                        <span>geoff@pagefoundry.dev</span>
                      </div>
                      <div class="card-back-item">
                        <span class="card-back-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path :d="icons.location" />
                          </svg>
                        </span>
                        <span>Ormond Beach, FL</span>
                      </div>
                      <div class="card-back-item">
                        <span class="card-back-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path :d="icons.web" />
                          </svg>
                        </span>
                        <span>https://pagefoundry.dev</span>
                      </div>
                    </div>

                  </div>
                  <div class="card-back-qr">
                    <img src="/images/business-card-qr.png" alt="QR code to pagefoundry.dev" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <header class="hero" id="top">
        <div class="hero-grid">
          <div class="hero-left">
            <div class="email">hello@pagefoundry.dev</div>
            <div class="hero-title-row">
              <h1>Hey There,<br />I’m Geoff at PageFoundry</h1>
            </div>
            <p class="hero-lead">
              I forge fast, intentional frontends for teams that need production-ready UI and clear UX.
            </p>
            <div class="hero-meta">
              <div class="years">
                <span class="num">15</span>
                <span>Years<br />Shipping UI</span>
              </div>
            </div>
          </div>

          <div class="hero-center">
            <div class="brush-layer"></div>
            <div class="avatar-ring">
              <img src="/images/profile.webp" alt="Geoff's avatar" />
            </div>
          </div>

          <div class="hero-right">
            <p>I’m a modern blacksmith for the web—shaping ideas into durable, beautiful products.</p>
            <div class="hero-contacts">
              <a class="icon-btn" aria-label="LinkedIn" href="https://www.linkedin.com/in/geoff-storbeck-81a25035/" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5ZM.24 8h4.52V24H.24V8ZM8.77 8h4.33v2.18h.06c.6-1.14 2.07-2.35 4.27-2.35 4.57 0 5.41 3 5.41 6.9V24h-4.71v-7.27c0-1.73-.03-3.95-2.41-3.95-2.41 0-2.78 1.88-2.78 3.82V24H8.77V8Z"/>
                </svg>
              </a>
              <a class="icon-btn" aria-label="Email" href="mailto:hello@pagefoundry.dev">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2.7-.4a.5.5 0 0 0-.7.4v.2l6 4.3a1.5 1.5 0 0 0 1.8 0l6-4.2v-.3a.5.5 0 0 0-.7-.4L12 10 5.7 6.1Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      <section class="about" id="about">
        <h2>About Me</h2>
        <p class="about-lead">
          I forged my professional roots in one of the largest offices in America—the McCoy Center in Columbus, Ohio—shipping enterprise
          systems surrounded by one of the busiest and most complex financial firms in the world. Today I’m based in sunny, slower Ormond Beach, Florida, where pastel
          concrete buildings stand up to hurricanes and salt air tests every connection.
        </p>
        <div class="about-grid">
          <div class="about-card">
            <div class="about-card-title">Roots in scale</div>
            <p>
              The McCoy Center taught me to thrive in complex environments: regulated stacks, high-volume workflows, and
              releases that couldn’t miss. That experience anchors my discipline and bias for clear, maintainable code.
            </p>
          </div>
          <div class="about-card">
            <div class="about-card-title">Coastal mindset</div>
            <p>
              Living by the ocean means planning for salt and storms—anticipating corrosion, replacing batteries early,
              and fixing fast after a surge. I carry that readiness into engineering: resilient architectures and quick
              response patterns when things break.
            </p>
          </div>
          <div class="about-card">
            <div class="about-card-title">Small-team endurance</div>
            <p>
              I blend big-office rigor with a beach-town pace to build high-performing solutions that small teams can
              run for years. I align with your design language, ship ahead of deadlines, and keep a fast learning
              flywheel to absorb new tech without slowing delivery.
            </p>
          </div>
        </div>
      </section>

      <section class="services-help" id="services">
        <div class="services-stack">
          <div
            v-for="service in services"
            :key="service.title"
            class="service-row"
            :class="service.color"
          >
            <div class="dot"></div>
            <div class="service-copy">
              <div class="service-title">{{ service.title }}</div>
              <div class="service-count">{{ service.projects }}</div>
            </div>
          </div>
        </div>

        <div class="help-copy">
          <h2>What do I do?</h2>
          <p>
            I turn fuzzy requirements into production-ready interfaces—design systems, complex
            dashboards, and polished product UI that ships fast and scales cleanly.
          </p>
          <div class="wins">
            <div class="win-item">
              <div class="win-title">React & Vue</div>
              <div class="win-desc">Ship production React/TypeScript and Vue 3 (Vite/Electron) apps with clear patterns.</div>
            </div>
            <div class="win-item">
              <div class="win-title">TypeScript & JavaScript</div>
              <div class="win-desc">Strong typing, clean state management, and predictable data flows for long-lived products.</div>
            </div>
            <div class="win-item">
              <div class="win-title">CSS Systems</div>
              <div class="win-desc">Design tokens, layout primitives, and responsive grids tuned for design-system reuse.</div>
            </div>
            <div class="win-item">
              <div class="win-title">Frontend Architecture</div>
              <div class="win-desc">Testing, linting, accessibility, and performance budgets that keep teams shipping safely.</div>
            </div>
          </div>
        </div>
      </section>

      <section class="experience" id="experience">
        <div class="section-header">
          <h2>My Work Experience</h2>
        </div>
        <div class="timeline">
          <div v-for="item in experience" :key="item.company + item.period" class="timeline-item">
            <div class="timeline-left">
              <div class="timeline-company">{{ item.company }}</div>
              <div class="timeline-role">{{ item.role }}</div>
            </div>
            <div class="timeline-right">
              <ul class="timeline-points">
                <li v-for="point in item.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="latest-works" id="works">
        <div class="section-header">
          <div>
            <h2>Recent Work</h2>
          </div>
        </div>
        <div class="works-swiper">
          <Swiper
            :modules="swiperModules"
            :slides-per-view="1.1"
            :centeredSlides="false"
            :loop="true"
            :spaceBetween="12"
            :navigation="true"
            :pagination="{ clickable: true }"
            :grabCursor="true"
            :simulateTouch="true"
            :allowTouchMove="true"
            :longSwipesRatio="0.2"
            :threshold="6"
            :breakpoints="{
              720: { slidesPerView: 1.3, spaceBetween: 14 },
              1024: { slidesPerView: 2, spaceBetween: 16 },
              1280: { slidesPerView: 3, spaceBetween: 18 }
            }"
            class="works-swiper-track"
          >
            <SwiperSlide v-for="work in works" :key="work.title">
              <article class="work-card">
                <div class="work-bg" :style="{ backgroundImage: `url(${work.image})` }"></div>
                <div class="work-overlay"></div>
                <div class="work-meta overlay">
                  <div class="work-top">{{ work.title }}</div>
                  <div class="work-sub">{{ work.subtitle }}</div>
                </div>
              </article>
            </SwiperSlide>
            <div class="gallery-fade fade-left"></div>
            <div class="gallery-fade fade-right"></div>
          </Swiper>
        </div>
      </section>

      <section class="testimonials" id="notes">
        <div class="section-header">
          <div>
            <h2>What people say</h2>
          </div>
          <div class="dots">
            <span class="active"></span><span></span><span></span>
          </div>
        </div>
        <div class="testimonial-grid">
          <article v-for="item in testimonials" :key="item.name" class="testimonial-card">
            <div class="quote-mark">“</div>
            <p class="quote">{{ item.quote }}</p>
            <div class="person">
              <div class="avatar-placeholder">
                <img :src="item.image" :alt="item.name" loading="lazy" />
              </div>
              <div>
                <div class="name">{{ item.name }}</div>
                <div class="role">{{ item.role }}</div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="cta">
        <div>
          <h2>Let’s forge your next product.</h2>
          <div class="cta-actions">
            <a class="cta-pill" href="https://www.linkedin.com/in/geoff-storbeck-81a25035/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a class="cta-pill ghost" href="mailto:hello@pagefoundry.dev">Email me</a>
          </div>
        </div>
        <div class="cta-info">
          <div class="info-title">Information</div>
          <div>Ormond Beach, Florida, USA</div>
          <div>hello@pagefoundry.dev</div>
        </div>
      </section>

      <footer>
        <div class="footer-brand">PageFoundry</div>
        <div class="footer-links">
          <a href="#services">Services</a>
          <a href="#works">Works</a>
          <a href="#notes">Notes</a>
          <a href="#experience">Experience</a>
        </div>
        <div class="footer-meta">© 2025 PageFoundry LLC · Crafted by Geoff Storbeck</div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { mdiEmailOutline, mdiMapMarkerOutline, mdiWeb } from '@mdi/js';

const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'experience', label: 'Experience' },
  { id: 'works', label: 'Works' }
];

const activeSection = ref('about');
const contactOpen = ref(false);
const dotsButton = ref(null);
const contactPanel = ref(null);
const showCardView = ref(false);
const cardFlipped = ref(false);

const services = [
  { title: 'Frontend Architecture', projects: 'Design systems, UI kits, scalable code', color: 'teal' },
  { title: 'Product UI & Dashboards', projects: 'Complex data, multi-surface flows', color: 'orange' },
  { title: 'Rapid Prototyping', projects: 'Pixel-accurate Figma-to-frontend delivery', color: 'red' }
];

const icons = {
  email: mdiEmailOutline,
  location: mdiMapMarkerOutline,
  web: mdiWeb
};

const works = [
  {
    title: 'Vulnerability Triage',
    subtitle: 'High-signal triage workflow and evidence views',
    image: '/projects/praetorian/vulnerabilities.png'
  },
  {
    title: 'Integrations Hub',
    subtitle: 'Connected surface for scanners and ticketing',
    image: '/projects/praetorian/integrations.png'
  },
  {
    title: 'Platform Navigation',
    subtitle: 'Global drawer for workflows and role-aware shortcuts',
    image: '/projects/praetorian/drawer.png'
  },
  {
    title: 'Executive Metrics',
    subtitle: 'Program-level dashboards for leadership',
    image: '/projects/praetorian/metrics.png'
  },
  {
    title: 'G.V() IDE (Light)',
    subtitle: 'Daytime theme for graph modeling IDE',
    image: '/projects/gdotv/light.png'
  },
  {
    title: 'G.V() IDE (Dark)',
    subtitle: 'High-contrast operator theme',
    image: '/projects/gdotv/dark.png'
  }
];
const swiperModules = [Navigation, Pagination];

const testimonials = [
  {
    image: '/images/arthur.jpeg',
    name: 'Arthur Bigeard',
    role: 'Creator of G.V()',
    quote:
      "On the latest version that includes Geoff Storbeck's welcome tab redesign—though the sample set is small (26 users)—95% of these users have gone on to query at least one database whilst using G.V()."
  },
  {
    image: '/images/anthony.jpeg',
    name: 'Anthony Paimoney',
    role: 'Offensive Security Consultant',
    quote: 'Geoff is awesome to work with, a real subject matter expert, and would be able to dig into any new areas with ease.'
  },
  {
    image: '/images/josh.jpeg',
    name: 'Josh Endres',
    role: 'Creative Guy',
    quote: 'One of the best I\'ve ever worked with!'
  }
];

const experience = [
  {
    company: 'PageFoundry LLC',
    period: 'Oct 2025 – Present',
    role: 'Founder · Frontend Lead',
    tags: ['Fractional FE leadership', 'Design systems'],
    points: [
      'Partner with product teams to ship production-ready UX fast using shared UI standards and review practices.',
      'Lead React/TypeScript builds, design systems, and performance/accessibility budgets for client platforms.'
    ]
  },
  {
    company: 'Praetorian — Chariot Offensive Security Platform',
    period: '2021 – 2025',
    role: 'Staff Frontend Engineer',
    tags: ['React/TypeScript', 'Design system', 'AWS'],
    points: [
      'Led the end-to-end frontend rewrite, moving the org from monthly to same-day releases with CI quality gates.',
      'Created the Chariot design system and frontend standards (testing, linting, review playbooks) to reduce regressions.',
      'Partnered with offensive security to design flows for attack-surface scanning, triage, and remediation.'
    ]
  },
  {
    company: 'JPMorgan Chase — Cassandra as a Service',
    period: '2019 – 2021',
    role: 'Lead UI/UX Developer',
    tags: ['React/Redux', 'Platform UX'],
    points: [
      'Rebuilt the internal Cassandra console from Angular 1 + Spring embed to a standalone React/Redux app for speed and onboarding.',
      'Designed self-service flows for cluster provisioning, health, and query tooling used by SRE and data platform teams.',
      'Defined reusable UI patterns, linting/tests, and release gates that became the standard for the service.'
    ]
  },
  {
    company: 'JPMorgan Chase — Account Lifecycle & Graph Tooling',
    period: '2015 – 2019',
    role: 'Lead UI/UX Developer',
    tags: ['Enterprise controls', 'AngularJS'],
    points: [
      'Bootstrapped firm-wide account controls MVP, then led scale-out across five apps while onboarding engineers.',
      'Ran design studios with business lines to align UX with control and remediation requirements.',
      'Maintained GROOT graph-visualization tools; split a Grails monolith into a standalone frontend consuming services.'
    ]
  },
  {
    company: 'JPMorgan Chase — Move Money',
    period: '2012 – 2015',
    role: 'Application Developer',
    tags: ['AngularJS', 'Batch operations'],
    points: [
      'Built and owned the Move Money dashboard (AngularJS, WebSockets, Highcharts) monitoring high-volume batch flows.',
      'Supported AIX/Windows pipelines, SSIS packages, and Sterling File Gateway for secure file transfers.',
      'Kept critical batch processing healthy through rigorous QA and production support.'
    ]
  },
  {
    company: 'FreeCodeCamp',
    period: '2015',
    role: 'Curriculum Developer',
    tags: ['Community', 'Education'],
    points: [
      'Authored example projects and frontend lessons for the certificate program.',
      'Mentored students via Gitter to accelerate their progress.'
    ]
  },
  {
    company: 'Jumpline.com',
    period: '2008 – 2012',
    role: 'Systems Administrator',
    tags: ['Infrastructure', 'Security'],
    points: [
      'Led a cross–data center migration of ~300 servers with zero downtime using a custom LiveCD duplication tool.',
      'Built custom kernel modules and RAID strategies to support diverse hardware in production.',
      'Deployed SNORT-based IDS with automated blocking and segmented Cisco networks to reduce attack surface.'
    ]
  }
];

let observer;
let hashListener;
let outsideClickListener;
let escapeListener;

const toggleContactMenu = () => {
  contactOpen.value = !contactOpen.value;
};

const closeContactMenu = () => {
  contactOpen.value = false;
};

const openCardView = () => {
  contactOpen.value = false;
  showCardView.value = true;
  cardFlipped.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const closeCardView = () => {
  showCardView.value = false;
  cardFlipped.value = false;
};

const toggleCardFlip = () => {
  cardFlipped.value = !cardFlipped.value;
};

onMounted(() => {
  const sectionIds = navLinks.map((link) => link.id);
  const targets = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el) => Boolean(el));

  const hash = window.location.hash.replace('#', '');
  if (hash && sectionIds.includes(hash)) {
    activeSection.value = hash;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) {
        activeSection.value = visible[0].target.id;
      }
    },
    {
      threshold: [0.15, 0.3, 0.5],
      rootMargin: '-18% 0px -55% 0px'
    }
  );

  targets.forEach((el) => observer.observe(el));

  hashListener = () => {
    const current = window.location.hash.replace('#', '');
    if (sectionIds.includes(current)) {
      activeSection.value = current;
    }
  };

  window.addEventListener('hashchange', hashListener);

  outsideClickListener = (event) => {
    const target = event.target;
    const clickedMenu = contactPanel.value?.contains(target);
    const clickedButton = dotsButton.value?.contains(target);
    if (!clickedMenu && !clickedButton) {
      closeContactMenu();
    }
  };

  escapeListener = (event) => {
    if (event.key === 'Escape') {
      if (showCardView.value) {
        closeCardView();
      } else {
        closeContactMenu();
      }
    }
  };

  window.addEventListener('click', outsideClickListener);
  window.addEventListener('keydown', escapeListener);
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
  if (hashListener) {
    window.removeEventListener('hashchange', hashListener);
  }
  if (outsideClickListener) {
    window.removeEventListener('click', outsideClickListener);
  }
  if (escapeListener) {
    window.removeEventListener('keydown', escapeListener);
  }
});
</script>

<style src="./design.css"></style>
