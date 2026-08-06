import type { Metadata } from "next";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { primaryCta, secondaryCta, siteConfig } from "./lib/siteConfig";

export const metadata: Metadata = {
  title: "ScheduleLoop | Demand Forecasting, Staffing Planning and Rotas",
  description:
    "Understand expected demand, plan the staffing coverage you need and build the employee rota around it with ScheduleLoop.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ScheduleLoop | Demand Forecasting, Staffing Planning and Rotas",
    description:
      "Understand expected demand, plan the right cover and build the staff rota in one connected workflow.",
    url: siteConfig.url,
  },
};

const workingSteps = [
  {
    title: "Configure your business",
    body: "Set opening hours, roles, staffing assumptions and the details that shape a normal working day.",
  },
  {
    title: "Understand expected demand",
    body: "Use business data and manager input to see when the day is likely to build, peak and ease.",
  },
  {
    title: "Plan practical staff cover",
    body: "Turn demand into stable, role-based staffing requirements that can become realistic shifts.",
  },
  {
    title: "Build the rota",
    body: "Assign employees and create the working schedule around the cover you have planned.",
  },
];

const productStories = [
  {
    id: "shape",
    eyebrow: "Understand the shape of the day",
    title: "See when demand is expected to rise, hold and fall away.",
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
    title: "Keep role requirements clear as you assign shifts.",
    body: "Front of house, kitchen, reception, checkout and floor teams do not always peak at the same time. ScheduleLoop keeps each requirement visible from planning through to the rota.",
    image: "/screens/setup-view.png",
    alt: "ScheduleLoop role setup showing peak cover and minimum cover",
    className: "focus-roles",
  },
];

const businessTypes = [
  {
    title: "Cafes and coffee shops",
    body: "Plan around morning rushes and lunch peaks, then schedule barista, kitchen and front-of-house cover.",
  },
  {
    title: "Restaurants, bars and pubs",
    body: "Turn service peaks and late finishes into practical bar, service and kitchen shifts.",
  },
  {
    title: "Gyms and leisure venues",
    body: "Match reception, floor and class cover to member traffic, then organise the people providing it.",
  },
  {
    title: "Retail stores",
    body: "Plan checkout, sales-floor and stock cover around trading patterns and promotions.",
  },
  {
    title: "Other shift-based teams",
    body: "Connect expected activity to employee shifts wherever demand changes by hour, role or day type.",
  },
];

const earlyAccessBenefits = [
  "Guided planning and rota setup",
  "Direct support",
  "Help configuring roles, opening hours and employees",
  "Influence what gets built next",
  "Early access to new functionality",
];

const connectedBenefits = [
  "Build the rota against a clear staffing target",
  "Keep forecast, role cover and employee shifts in one workflow",
  "Compare scheduled cover with the recommendation by time and role",
  "Adjust shifts while keeping expected demand visible",
];

const faqs = [
  {
    question: "What is ScheduleLoop?",
    answer:
      "ScheduleLoop is a demand-led staffing and rota tool for shift-based businesses. It helps managers understand how much cover the day is likely to need, turn that into role-based staffing guidance and build the employee rota around the plan.",
  },
  {
    question: "Is ScheduleLoop a rota builder?",
    answer:
      "Yes. ScheduleLoop includes a straightforward rota area where managers can add employees, create and manage shifts, move between weeks and review the rota as a draft or published schedule. Its main difference is that the rota is built after first understanding the staffing coverage the day is expected to require.",
  },
  {
    question: "How does the rota connect to the forecast?",
    answer:
      "The forecast shows when demand is likely to rise or fall. ScheduleLoop turns that into recommended staffing coverage by time and role, then compares the shifts on the rota with that recommendation so managers can see where cover is matched, under, over or assigned to the wrong role.",
  },
  {
    question: "Does ScheduleLoop automatically create the rota?",
    answer:
      "No. ScheduleLoop provides the staffing guidance and rota workspace, while the manager remains in control of employee assignments, shift times, breaks and the final rota. It can copy suitable shifts from the previous week, but it does not generate or assign the whole rota automatically.",
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
      "Yes. ScheduleLoop can estimate the cost of the recommended staffing plan and the scheduled rota where wage information is available. These figures support planning; ScheduleLoop does not process payroll or replace payroll software.",
  },
  {
    question: "Does ScheduleLoop assign individual employees?",
    answer:
      "Managers can manually add employees and assign them while building the rota. ScheduleLoop does not currently choose employees or generate the entire rota automatically, so availability, skills and final shift decisions remain with the manager.",
  },
  {
    question: "Does ScheduleLoop replace existing rota software?",
    answer:
      "For businesses that need straightforward employee and shift planning, ScheduleLoop can provide the core forecasting-to-rota workflow in one place. Businesses that rely on advanced HR, payroll, availability, holiday or shift-swapping features may continue using ScheduleLoop alongside their existing systems.",
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
      "Request a free walkthrough. ScheduleLoop is currently offered through guided early access, so we can understand your business, help configure the basics and show how forecasting, staffing guidance and rota creation could fit your operation.",
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
            ScheduleLoop turns expected demand into practical, role-by-role staffing
            guidance, then helps you build the rota around the cover your business
            actually needs.
          </p>
          <p className="hero-flow-line">
            Forecast demand, plan coverage and build the rota in one connected workflow.
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
          <span>recommended staff hours to use as the rota target</span>
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
            Most rota tools begin with employee scheduling. ScheduleLoop begins with
            the staffing requirement, then helps managers build the rota around it.
          </p>
          <div className="product-flow" aria-label="ScheduleLoop planning workflow">
            <span>Expected demand</span>
            <i aria-hidden="true">&rarr;</i>
            <span>Staffing requirement</span>
            <i aria-hidden="true">&rarr;</i>
            <span>Staff rota</span>
          </div>
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
          <h2 id="works-title">From expected demand to a working rota.</h2>
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

      <section id="rota-planning" className="section rota-showcase" aria-labelledby="rota-showcase-title">
        <div className="section-copy">
          <p className="eyebrow">Rota Planning</p>
          <h2 id="rota-showcase-title">Turn the staffing plan into a working rota.</h2>
          <p>
            Once you understand the cover the day requires, ScheduleLoop gives you a
            clear place to schedule employees and build the rota around that plan.
            Create and adjust shifts while keeping the expected staffing requirement
            in view.
          </p>
          <ul className="connected-benefits">
            {connectedBenefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
        <figure className="focused-shot rota-product-shot">
          <img
            src="/screens/rota-week.jpg"
            alt="ScheduleLoop weekly rota showing employees, shifts, scheduled hours and forecast coverage checks"
            loading="lazy"
          />
          <figcaption>Real ScheduleLoop rota workspace</figcaption>
        </figure>
      </section>

      <section className="section two-column demo-teaser" aria-labelledby="demo-title">
        <div className="section-copy">
          <p className="eyebrow">Demo</p>
          <h2 id="demo-title">Try a guided example without creating an account.</h2>
          <p>
            The demo lets you switch business type, day type and hourly wage using
            stable example data. It shows how ScheduleLoop turns a demand pattern into
            staffing blocks, role requirements and labour-cost estimates, then shows
            how that plan continues into the rota workspace.
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
          <p>Quiet, normal, busy and event days with role-specific cover, labour-cost estimates and a read-only view of the next rota step.</p>
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
          <h2 id="labour-title">See the staffing commitment as you build the rota.</h2>
          <p>
            ScheduleLoop estimates the planned staff hours and labour cost, then shows
            the scheduled hours and cost as shifts are added. Managers can review the
            commitment without turning the product into payroll software.
          </p>
        </div>
      </section>

      <section className="section trust-grid" aria-label="Early access and data">
        <article className="trust-panel">
          <p className="eyebrow">Early Access</p>
          <h2>Help shape ScheduleLoop</h2>
          <p>
            We are working with a small number of shift-based businesses to test
            staffing planning and rota creation together. Early-access businesses get
            guided setup for roles, opening hours, demand assumptions and employees,
            plus a direct feedback loop while the product is still flexible.
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
            it. Users can request access or deletion through the public contact email.
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
            Request a short walkthrough and we&apos;ll show how ScheduleLoop can help you
            understand expected demand, plan the required cover and build the rota
            around it.
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
