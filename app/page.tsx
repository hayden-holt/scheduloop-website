import type { Metadata } from "next";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { primaryCta, secondaryCta, siteConfig } from "./lib/siteConfig";

export const metadata: Metadata = {
  title: "ScheduleLoop | Demand Forecasting and Staffing Planning",
  description:
    "Know how many staff you need before building the rota. ScheduleLoop turns expected demand into practical staffing guidance for shift-based businesses.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ScheduleLoop | Demand Forecasting and Staffing Planning",
    description:
      "Turn expected demand into practical staffing guidance before building the rota.",
    url: siteConfig.url,
  },
};

const workingSteps = [
  {
    title: "Set the business baseline",
    body: "Start with opening hours, core roles and the level of cover the business normally needs.",
  },
  {
    title: "Review the shape of the day",
    body: "See where demand builds, when the busiest window is likely to hit and when cover can ease.",
  },
  {
    title: "Turn demand into cover",
    body: "Translate the curve into steady staffing blocks that are practical enough to become shifts.",
  },
  {
    title: "Adjust unusual days",
    body: "Add the local context managers know best, such as events, bookings, promotions or quieter trade.",
  },
];

const productStories = [
  {
    id: "shape",
    eyebrow: "Understand the shape of the day",
    title: "Spot the busy window before the rota is written.",
    body: "ScheduleLoop gives managers a clear view of when demand is expected to rise, peak and settle, so cover can be planned around the real pressure points of the day.",
    image: "/screens/shape-of-day.png",
    alt: "ScheduleLoop shape of the day chart showing demand and staffing need",
    className: "focus-chart",
  },
  {
    id: "cover",
    eyebrow: "Turn demand into practical cover",
    title: "Convert the forecast into staffing guidance people can act on.",
    body: "Instead of reacting to every small spike, ScheduleLoop turns demand into sensible staffing blocks that are easier to discuss, adjust and turn into a rota.",
    image: "/screens/planner-overview.png",
    alt: "ScheduleLoop staffing recommendation with staff hours and busiest period",
    className: "focus-plan",
  },
  {
    id: "roles",
    eyebrow: "Plan different roles",
    title: "Plan role-by-role cover before assigning named staff.",
    body: "Front of house, kitchen, reception, checkout and floor teams do not always peak at the same time. ScheduleLoop keeps those role requirements visible from the start.",
    image: "/screens/setup-view.png",
    alt: "ScheduleLoop role setup showing peak cover and minimum cover",
    className: "focus-roles",
  },
];

const businessTypes = [
  {
    title: "Cafes and coffee shops",
    body: "Plan around morning rushes, lunch peaks and quieter afternoon cover.",
  },
  {
    title: "Restaurants, bars and pubs",
    body: "Prepare for service peaks, late finishes and different front-of-house or kitchen needs.",
  },
  {
    title: "Gyms and leisure venues",
    body: "Match reception, floor and class cover to member traffic across the day.",
  },
  {
    title: "Retail stores",
    body: "Balance checkout, floor and stock cover around trading patterns and promotions.",
  },
  {
    title: "Other shift-based teams",
    body: "Use the same approach wherever demand changes by hour, role or day type.",
  },
];

const earlyAccessBenefits = [
  "Guided setup",
  "Direct support",
  "Help configuring roles and opening hours",
  "Influence what gets built next",
  "Early access to new functionality",
];

const faqs = [
  {
    question: "What is ScheduleLoop?",
    answer:
      "ScheduleLoop is a staffing planning tool for shift-based businesses. It helps managers understand how many people are likely to be needed across the day before they build the rota, using expected demand, roles, opening hours and manager context.",
  },
  {
    question: "Is ScheduleLoop a rota builder?",
    answer:
      "ScheduleLoop sits before the rota. Its current job is to calculate practical staffing requirements, not automatically assign named employees. That makes it useful as a planning layer: managers can decide the level of cover first, then build the rota with more confidence.",
  },
  {
    question: "What kinds of businesses can use it?",
    answer:
      "ScheduleLoop is designed for businesses where staffing needs change throughout the day, including cafes, restaurants, bars, gyms, leisure venues, retail stores and other small teams with hourly peaks and quieter periods.",
  },
  {
    question: "Do I need historical data?",
    answer:
      "Historical data is helpful because it gives ScheduleLoop a clearer pattern to work from, but it is not the only starting point. During guided early access, you can begin with opening hours, role assumptions and typical demand patterns, then improve the plan as better data becomes available.",
  },
  {
    question: "Can I upload a CSV?",
    answer:
      "Yes. The current product includes CSV upload for trading history such as orders, sales, bookings, covers or similar demand indicators. ScheduleLoop uses that information to shape staffing guidance, and the data should only be uploaded where your business has permission to use it.",
  },
  {
    question: "Can I plan different employee roles?",
    answer:
      "Yes. ScheduleLoop is built around role-based planning. You can think about front of house, kitchen, reception, checkout, floor staff or other roles separately, which is important because different parts of the team often peak at different times.",
  },
  {
    question: "How does it handle unusually busy days?",
    answer:
      "Managers can adjust the day type and add context for situations the data alone may not explain, such as promotions, bookings, school holidays, nearby events or unusually quiet trading conditions. The aim is to combine the forecast with what the manager already knows.",
  },
  {
    question: "Does it automatically import weather and events?",
    answer:
      "Not currently. ScheduleLoop does not present automatic weather, event or roadworks integrations as live features. The current product keeps this honest by letting managers add relevant context themselves, which is often the fastest and most accurate source of local knowledge.",
  },
  {
    question: "Will it show labour cost?",
    answer:
      "ScheduleLoop can estimate staff hours and labour cost from an example hourly rate, helping managers understand the staffing commitment before the rota is finalised. It does not process payroll or replace payroll software.",
  },
  {
    question: "Will it assign individual employees?",
    answer:
      "No. ScheduleLoop currently recommends staffing levels and role requirements rather than choosing named employees. Managers still decide who works each shift based on availability, skills and business judgement.",
  },
  {
    question: "How accurate are the recommendations?",
    answer:
      "The quality of the recommendation depends on the quality of the input data, how consistent the business pattern is and how well unusual days are explained. ScheduleLoop is designed to give managers a stronger starting point, while keeping final judgement with the people who know the business.",
  },
  {
    question: "Does ScheduleLoop replace manager judgement?",
    answer:
      "No. ScheduleLoop supports manager judgement rather than replacing it. It brings demand, roles and staffing assumptions into one clear view so decisions can be made with better information.",
  },
  {
    question: "How do I get access?",
    answer:
      "Book a free walkthrough. ScheduleLoop is currently offered through guided early access, so we can understand your business, help configure the basics and show how the product could fit into your staffing process.",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-media" aria-hidden="true">
          <img src="/screens/planner-overview.png" alt="" className="hero-image" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Demand-led staffing guidance</p>
          <h1 id="hero-title">Know how many staff you need before you build the rota.</h1>
          <p className="hero-copy">
            ScheduleLoop turns expected demand into clear, role-by-role staffing
            guidance, so managers can plan busy periods, protect quieter cover and
            build the rota from a stronger starting point.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href={siteConfig.routes.walkthrough}>
              {primaryCta}
            </a>
            <a className="button button-secondary" href={siteConfig.routes.demo}>
              {secondaryCta}
            </a>
          </div>
          <p className="hero-reassurance">
            No account required for the demo. Uses example business data.
          </p>
        </div>
      </section>

      <section className="metric-band" aria-label="Example ScheduleLoop forecast">
        <div>
          <span className="metric-label">Example business forecast using demonstration data</span>
          <strong>36</strong>
          <span>staff hours estimated before the rota is built</span>
        </div>
        <div>
          <span className="metric-label">Busiest period</span>
          <strong>11:00-14:00</strong>
          <span>cover window surfaced for manager review</span>
        </div>
        <div>
          <span className="metric-label">Forecast confidence</span>
          <strong>High</strong>
          <span>based on comparable historical data in the example</span>
        </div>
      </section>

      <section className="section two-column" id="product" aria-labelledby="product-title">
        <div className="section-copy">
          <p className="eyebrow">Product</p>
          <h2 id="product-title">Demand is not the same as staffing.</h2>
          <p>
            Orders, bookings, check-ins and footfall move in waves. Staffing needs a
            more practical shape: stable enough for shifts, specific enough for each
            role and flexible enough for the manager&apos;s judgement.
          </p>
          <p>
            ScheduleLoop sits before the rota and answers the operational question
            managers usually have to solve manually: how much cover should the day
            actually have?
          </p>
        </div>
        <figure className="focused-shot focus-plan">
          <img
            src="/screens/planner-overview.png"
            alt="ScheduleLoop planner showing recommended staff hours, busiest period and confidence"
          />
          <figcaption>Example business forecast using demonstration data</figcaption>
        </figure>
      </section>

      <section className="section" id="how-it-works" aria-labelledby="works-title">
        <div className="section-heading">
          <p className="eyebrow">How It Works</p>
          <h2 id="works-title">A clearer way to decide daily cover.</h2>
        </div>
        <div className="feature-grid feature-grid-four">
          {workingSteps.map((step, index) => (
            <article className="feature-card" key={step.title}>
              <span className="step-number" aria-hidden="true">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section product-story-list" aria-label="Product walkthrough">
        {productStories.map((story, index) => (
          <article className="product-story" key={story.id}>
            <div className="section-copy">
              <p className="eyebrow">{story.eyebrow}</p>
              <h2>{story.title}</h2>
              <p>{story.body}</p>
            </div>
            <figure className={`focused-shot ${story.className}`}>
              <img src={story.image} alt={story.alt} loading={index === 0 ? "eager" : "lazy"} />
              <figcaption>Labelled ScheduleLoop product screenshot</figcaption>
            </figure>
          </article>
        ))}
      </section>

      <section className="section two-column demo-teaser" aria-labelledby="demo-title">
        <div className="section-copy">
          <p className="eyebrow">Demo</p>
          <h2 id="demo-title">Try a guided example without creating an account.</h2>
          <p>
            The demo lets you switch business type, day type and hourly wage using
            stable example data. It shows how ScheduleLoop turns a demand pattern into
            staffing blocks, role requirements and labour-cost estimates.
          </p>
          <div className="inline-actions">
            <a className="button button-primary" href={siteConfig.routes.demo}>
              {secondaryCta}
            </a>
            <a className="button button-light" href={siteConfig.routes.walkthrough}>
              {primaryCta}
            </a>
          </div>
        </div>
        <div className="demo-card-summary">
          <span>Example demo includes</span>
          <strong>Cafe, restaurant, gym and retail patterns</strong>
          <p>Quiet, normal, busy and event days with role-specific cover, staffing blocks and labour-cost estimates.</p>
        </div>
      </section>

      <section className="section" id="who-its-for" aria-labelledby="audience-title">
        <div className="section-heading">
          <p className="eyebrow">Who It&apos;s For</p>
          <h2 id="audience-title">Built for managers who need cover to match the day.</h2>
        </div>
        <div className="audience-grid">
          {businessTypes.map((type) => (
            <article key={type.title}>
              <h3>{type.title}</h3>
              <p>{type.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-proof" aria-labelledby="labour-title">
        <figure className="focused-shot focus-roles">
          <img
            src="/screens/setup-view.png"
            alt="ScheduleLoop setup screen showing role assumptions and cover levels"
            loading="lazy"
          />
          <figcaption>Role setup and staffing assumptions</figcaption>
        </figure>
        <div className="section-copy">
          <p className="eyebrow">Roles and Labour Cost</p>
          <h2 id="labour-title">See the staffing commitment before building the rota.</h2>
          <p>
            ScheduleLoop shows estimated staffed hours and labour cost before the rota
            is finalised. It helps managers understand the commitment early, while
            leaving payroll and final staffing decisions exactly where they belong.
          </p>
        </div>
      </section>

      <section className="section trust-grid" aria-label="Early access and data">
        <article className="trust-panel">
          <p className="eyebrow">Early Access</p>
          <h2>Help shape ScheduleLoop</h2>
          <p>
            We are working with a small number of shift-based businesses to test
            ScheduleLoop against real staffing decisions. Early-access businesses get
            direct setup support, a closer feedback loop and a chance to influence the
            product while it is still flexible.
          </p>
          <ul>
            {earlyAccessBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
          <a className="button button-primary" href={siteConfig.routes.walkthrough}>
            {primaryCta}
          </a>
        </article>
        <article className="trust-panel">
          <p className="eyebrow">Data and Responsibility</p>
          <h2>Your business data stays your business data</h2>
          <p>
            ScheduleLoop uses business setup details and any uploaded trading history
            to create staffing recommendations for your business. Managers retain
            final control, and staffing results are presented as decision support
            rather than guarantees.
          </p>
          <p>
            Uploaded data should only be used where the business has permission to use
            it. Users can request access or deletion through the public contact email
            once confirmed.
          </p>
        </article>
      </section>

      <section className="section faq-section" id="faq" aria-labelledby="faq-title">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title">Questions managers usually ask first.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details className="faq-item" key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta-band" aria-labelledby="cta-title">
        <div>
          <p className="eyebrow">Talk it through</p>
          <h2 id="cta-title">Want to see ScheduleLoop with your own business setup?</h2>
          <p>
            Book a short walkthrough and we&apos;ll look at how your opening hours,
            roles and demand patterns could be turned into practical staffing guidance.
          </p>
        </div>
        <div className="cta-actions">
          <a className="button button-primary" href={siteConfig.routes.walkthrough}>
            {primaryCta}
          </a>
          <a className="button button-secondary" href={siteConfig.routes.demo}>
            {secondaryCta}
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
