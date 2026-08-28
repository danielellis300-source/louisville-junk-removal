/* ════════════════════════════════════════════════════════════
   Service-area landing page generator — Louisville Junk Removal Co
   Run: node scripts/gen-cities.js
   Produces: <slug>.html at the site root, one per entry in
   scripts/cities-data.js. Design mirrors index.html (self-contained
   inline CSS). FAQ schema is built from the same data as the visible
   FAQ so the two can never drift apart.
   ════════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');
const config = require('./site-config');
const cities = require('./cities-data');

const ROOT = path.join(__dirname, '..');
const PHONE = config.phoneDisplay;
const TEL = config.phoneTel;
const DOMAIN = config.domain;

// Same design system as index.html — kept inline so each landing page
// is fully self-contained (matches the original site architecture).
const STYLE = `  <style>
    :root { --brand: #374151; --brand-dk: #1F2937; --dark: #2D3748; --text: #2D3748; --light-bg: #F9FAFB; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', system-ui, sans-serif; font-size: 16px; line-height: 1.6; color: var(--text); }
    img { max-width: 100%; height: auto; display: block; }
    a { color: inherit; text-decoration: none; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    .btn { display: inline-block; padding: 15px 30px; border-radius: 6px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: background .2s, transform .1s; border: none; line-height: 1.3; }
    .btn:active { transform: scale(.98); }
    .btn-primary { background: var(--brand); color: #fff; }
    .btn-primary:hover { background: var(--brand-dk); }
    .btn-outline { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,.7); }
    .btn-outline:hover { background: rgba(255,255,255,.1); border-color: #fff; }
    .btn-white { background: #fff; color: var(--brand); }
    .btn-white:hover { background: #f0f0f0; }
    .section { padding: 72px 0; }
    .text-center { text-align: center; }
    .section-title { font-size: clamp(1.65rem, 3vw, 2.2rem); font-weight: 900; color: var(--dark); margin-bottom: 10px; }
    .section-sub { font-size: 1.05rem; color: #718096; margin-bottom: 48px; max-width: 640px; margin-left: auto; margin-right: auto; }
    .site-header { position: sticky; top: 0; z-index: 200; background: var(--dark); box-shadow: 0 2px 16px rgba(0,0,0,.4); }
    .header-inner { display: flex; align-items: center; justify-content: space-between; height: 62px; }
    .logo { font-size: 1.3rem; font-weight: 900; color: #fff; letter-spacing: -.3px; }
    .logo span { color: #9CA3AF; }
    .header-right { display: flex; align-items: center; gap: 16px; }
    .header-phone { font-weight: 700; font-size: 1rem; color: #fff; }
    .header-phone a { color: #fff; }
    .site-header .btn-primary { background: #fff; color: var(--dark); }
    .site-header .btn-primary:hover { background: #E5E7EB; }
    @media (max-width: 520px) {
      .header-phone { display: none; }
      .logo { font-size: .72rem; white-space: normal; line-height: 1.3; max-width: 58%; }
      .site-header .btn-primary { padding: 8px 12px; font-size: .8rem; }
      .header-inner { height: 60px; }
    }
    .menu-wrap { position: relative; }
    .menu-btn { background: none; border: 1.5px solid rgba(255,255,255,.35); border-radius: 6px; color: #fff; padding: 7px 13px; font-size: .88rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap; transition: border-color .2s; }
    .menu-btn:hover { border-color: #fff; }
    .menu-dropdown { display: none; position: absolute; top: calc(100% + 10px); right: 0; background: #1F2937; border: 1px solid rgba(255,255,255,.12); border-radius: 10px; min-width: 180px; padding: 8px 0; box-shadow: 0 8px 24px rgba(0,0,0,.4); z-index: 300; }
    .menu-dropdown.open { display: block; }
    .menu-dropdown a { display: block; padding: 11px 20px; color: #E5E7EB; font-size: .92rem; font-weight: 600; text-decoration: none; transition: background .15s, color .15s; }
    .menu-dropdown a:hover { background: rgba(255,255,255,.08); color: #fff; }
    .breadcrumb { background: #F3F4F6; border-bottom: 1px solid #E5E7EB; padding: 10px 0; font-size: .83rem; color: #718096; }
    .breadcrumb a { color: var(--brand); }
    .breadcrumb span { margin: 0 6px; }
    .hero { background: #ffffff; color: var(--dark); padding: 80px 0 72px; border-bottom: 1px solid #E5E7EB; }
    .hero-inner { display: grid; grid-template-columns: 1fr 420px; gap: 52px; align-items: start; }
    @media (max-width: 860px) { .hero-inner { grid-template-columns: 1fr; } .hero-form-card { max-width: 520px; margin: 0 auto; } }
    .hero-badge { display: inline-flex; align-items: center; gap: 7px; background: #F9FAFB; border: 1px solid #E5E7EB; color: #374151; padding: 6px 14px; border-radius: 100px; font-size: .82rem; font-weight: 700; margin-bottom: 22px; letter-spacing: .3px; }
    .hero h1 { font-size: clamp(2.1rem, 4.5vw, 3.1rem); font-weight: 900; line-height: 1.13; margin-bottom: 18px; }
    .hero h1 em { font-style: normal; color: var(--brand); }
    .hero-sub { font-size: 1.1rem; color: #718096; margin-bottom: 32px; max-width: 500px; }
    .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 32px; }
    .trust-row { display: flex; gap: 18px; flex-wrap: wrap; }
    .trust-item { display: flex; align-items: center; gap: 7px; font-size: .88rem; color: #718096; }
    .check { color: #22c55e; font-size: 1rem; }
    .hero .btn-outline { color: var(--dark); border-color: #E5E7EB; }
    .hero .btn-outline:hover { background: #F9FAFB; border-color: var(--dark); }
    .hero-form-card { background: #fff; border-radius: 16px; padding: 36px 30px; box-shadow: 0 4px 24px rgba(0,0,0,.08); border: 1px solid #E5E7EB; }
    .form-title { font-size: 1.25rem; font-weight: 800; color: var(--dark); margin-bottom: 4px; }
    .form-sub { font-size: .88rem; color: #777; margin-bottom: 22px; }
    .form-group { margin-bottom: 14px; }
    .form-group label { display: block; font-size: .82rem; font-weight: 600; color: #444; margin-bottom: 5px; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px 14px; border: 1.5px solid #ddd; border-radius: 8px; font-family: inherit; font-size: .93rem; color: var(--text); transition: border-color .2s; outline: none; background: #fff; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--brand); }
    .form-group textarea { resize: vertical; min-height: 80px; }
    .form-submit { width: 100%; padding: 15px; font-size: 1rem; font-weight: 700; background: var(--brand); color: #fff; border: none; border-radius: 8px; cursor: pointer; transition: background .2s; margin-top: 6px; font-family: inherit; }
    .form-submit:hover { background: var(--brand-dk); }
    .form-privacy { text-align: center; font-size: .76rem; color: #999; margin-top: 9px; }
    .form-success { display: none; text-align: center; padding: 20px 0; }
    .form-success .check-big { font-size: 3rem; margin-bottom: 14px; }
    .form-success h3 { font-size: 1.2rem; font-weight: 800; color: var(--dark); margin-bottom: 8px; }
    .form-success p { font-size: .92rem; color: #718096; }
    .stats-bar { background: var(--brand); padding: 26px 0; }
    .stats-grid { display: flex; justify-content: center; align-items: center; gap: 40px; flex-wrap: wrap; }
    .stat-item { text-align: center; color: #fff; }
    .stat-num { font-size: 1.9rem; font-weight: 900; display: block; line-height: 1.1; }
    .stat-label { font-size: .82rem; opacity: .88; letter-spacing: .3px; }
    .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,.25); }
    @media (max-width: 600px) { .stat-divider { display: none; } }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; margin-top: 48px; }
    .service-card { border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 28px 22px; transition: box-shadow .25s, transform .25s; background: #fff; }
    .service-card:hover { box-shadow: 0 10px 36px rgba(0,0,0,.09); transform: translateY(-4px); }
    .service-icon { font-size: 2.2rem; margin-bottom: 14px; }
    .service-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
    .service-card p { font-size: .9rem; color: #718096; line-height: 1.65; }
    .about-city { background: #fff; }
    .about-city-inner { max-width: 820px; margin: 0 auto; }
    .about-city-inner p { font-size: 1rem; color: #4A5568; line-height: 1.85; margin-bottom: 18px; }
    .why-section { background: var(--light-bg); }
    .why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 32px; margin-top: 48px; }
    .why-item { text-align: center; }
    .why-icon { width: 66px; height: 66px; background: var(--brand); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.55rem; font-weight: 900; }
    .why-item h3 { font-size: 1rem; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
    .why-item p { font-size: .88rem; color: #718096; line-height: 1.65; }
    .process-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 28px; margin-top: 48px; }
    .process-step { background: #fff; border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 30px 22px; text-align: center; }
    .step-num { width: 50px; height: 50px; background: var(--brand); color: #fff; font-weight: 900; font-size: 1.25rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
    .process-step h3 { font-size: 1rem; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
    .process-step p { font-size: .88rem; color: #718096; line-height: 1.65; }
    .areas-section { background: var(--light-bg); }
    .areas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 10px; margin-top: 40px; }
    .area-pill { background: #fff; border: 1.5px solid #E5E7EB; border-radius: 8px; padding: 12px 14px; text-align: center; font-size: .88rem; font-weight: 600; color: var(--dark); transition: border-color .2s, color .2s; }
    .area-pill:hover { border-color: var(--brand); color: var(--brand); }
    .area-pill.current { background: var(--brand); color: #fff; border-color: var(--brand); }
    .faq-list { margin-top: 48px; max-width: 800px; margin-left: auto; margin-right: auto; }
    .faq-item { border: 1.5px solid #E5E7EB; border-radius: 10px; margin-bottom: 10px; overflow: hidden; background: #fff; }
    .faq-question { width: 100%; background: transparent; border: none; padding: 20px 22px; text-align: left; font-family: inherit; font-size: .98rem; font-weight: 600; color: var(--dark); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
    .faq-question:hover { background: #fafafa; }
    .faq-chevron { flex-shrink: 0; width: 20px; height: 20px; transition: transform .25s; color: var(--brand); }
    .faq-item.open .faq-chevron { transform: rotate(180deg); }
    .faq-answer { max-height: 0; overflow: hidden; transition: max-height .35s ease; }
    .faq-item.open .faq-answer { max-height: 500px; }
    .faq-answer-inner { padding: 0 22px 20px; font-size: .92rem; color: #718096; line-height: 1.75; }
    .cta-banner { background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dk) 100%); padding: 68px 0; text-align: center; color: #fff; }
    .cta-banner h2 { font-size: clamp(1.9rem, 3.5vw, 2.6rem); font-weight: 900; margin-bottom: 14px; }
    .cta-banner p { font-size: 1.08rem; opacity: .92; margin-bottom: 34px; max-width: 540px; margin-left: auto; margin-right: auto; }
    .cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .site-footer { background: var(--dark); color: #888; padding: 52px 0 24px; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; margin-bottom: 40px; }
    @media (max-width: 680px) { .footer-grid { grid-template-columns: 1fr; gap: 28px; } }
    .footer-brand { font-size: 1.2rem; font-weight: 900; color: #fff; margin-bottom: 14px; }
    .footer-brand span { color: #9CA3AF; }
    .footer-nap { font-size: .88rem; line-height: 2.1; }
    .footer-nap a { color: #9CA3AF; }
    .footer-col h4 { font-size: .9rem; font-weight: 700; color: #fff; margin-bottom: 14px; }
    .footer-links { list-style: none; }
    .footer-links li { margin-bottom: 9px; }
    .footer-links a { font-size: .87rem; color: #718096; transition: color .2s; }
    .footer-links a:hover { color: #9CA3AF; }
    .footer-bottom { border-top: 1px solid rgba(255,255,255,.07); padding-top: 22px; text-align: center; font-size: .8rem; color: #444; }
    @media (max-width: 768px) { .hero { padding: 52px 0 44px; } .section { padding: 52px 0; } .hero-actions { flex-direction: column; } .hero-actions .btn { text-align: center; } .cta-actions { flex-direction: column; align-items: center; } }
  </style>`;

function areaPills(currentSlug) {
  return config.cities.map(c => {
    const href = c.file === '/' ? '/' : c.file.replace(/^\//, '');
    const cur = ('/' + currentSlug) === c.file ? ' current' : '';
    return `        <a href="${href}" class="area-pill${cur}">${c.name}</a>`;
  }).join('\n');
}

function footerCityLinks() {
  return config.cities.map(c => {
    const href = c.file === '/' ? '/' : c.file.replace(/^\//, '');
    return `            <li><a href="${href}">${c.name}</a></li>`;
  }).join('\n');
}

function serviceCards() {
  return `        <div class="service-card">
          <div class="service-icon">🛋️</div>
          <h3>Furniture Removal</h3>
          <p>Couches, sectionals, recliners, dressers, bed frames, and office furniture carried out from any floor — no scratched walls, no strained backs.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🧊</div>
          <h3>Appliance Removal</h3>
          <p>Refrigerators, washers, dryers, dishwashers, stoves, and water heaters disconnected and hauled off for recycling wherever possible.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">📦</div>
          <h3>Garage &amp; Basement Cleanouts</h3>
          <p>Years of boxes, tools, bikes, paint cans, and "we'll deal with it later" piles cleared in a single visit. You get the space back.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🏠</div>
          <h3>Estate &amp; Whole-House Cleanouts</h3>
          <p>Downsizing, probate, or a rental turnover — we clear a property top to bottom, working respectfully and setting aside anything for donation.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🚧</div>
          <h3>Construction &amp; Remodel Debris</h3>
          <p>Drywall, lumber, old cabinets, flooring, tile, and demo debris loaded out so your contractor keeps moving and the site stays safe.</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🛁</div>
          <h3>Hot Tub &amp; Shed Removal</h3>
          <p>We break down and haul away hot tubs, above-ground pools, swing sets, trampolines, and rotting sheds — including the disassembly.</p>
        </div>`;
}

function faqBlocks(faqs) {
  return faqs.map(f => `        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            ${f.q}
            <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer" role="region">
            <div class="faq-answer-inner">
              ${f.a}
            </div>
          </div>
        </div>`).join('\n\n');
}

// FAQ schema text must mirror the visible answer — strip tags and collapse whitespace.
function plain(html) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function renderCity(city) {
  const cityState = `${city.name}, ${city.stateAbbr}`;
  const localBiz = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": config.businessName,
    "@id": `${DOMAIN}/#business`,
    "url": `${DOMAIN}/`,
    "telephone": PHONE,
    "priceRange": "$$",
    "description": `Junk removal and cleanout services in ${cityState} and the surrounding ${city.county} area. Furniture, appliance, garage, and estate cleanouts with same-day service and upfront flat-rate pricing.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city.name,
      "addressRegion": city.stateAbbr,
      "addressCountry": "US"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": city.lat, "longitude": city.lng },
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], "opens": "07:00", "closes": "19:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Sunday"], "opens": "08:00", "closes": "17:00" }
    ],
    "areaServed": [{ "@type": "City", "name": city.name }, { "@type": "City", "name": "Louisville" }]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": city.faqs.map(f => ({
      "@type": "Question",
      "name": plain(f.q),
      "acceptedAnswer": { "@type": "Answer", "text": plain(f.a) }
    }))
  };

  const title = `Junk Removal in ${cityState} | ${config.businessName} | ${PHONE}`;
  const desc = `Full-service junk removal in ${cityState}. Furniture, appliances, garage &amp; estate cleanouts hauled away — we do the lifting. Same-day service, upfront flat-rate pricing. Free quote — call ${PHONE}.`;
  const canonical = `${DOMAIN}/${city.slug}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="Junk Removal in ${cityState} | ${config.businessName}" />
  <meta property="og:description" content="Full-service junk removal in ${cityState}. Same-day pickups, upfront pricing — call ${PHONE}." />

  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="website" />
  <meta name="geo.region" content="US-${city.stateAbbr}" />
  <meta name="geo.placename" content="${city.name}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />

  <script type="application/ld+json">
  ${JSON.stringify(localBiz, null, 2)}
  </script>

  <script type="application/ld+json">
  ${JSON.stringify(faqSchema, null, 2)}
  </script>

${STYLE}
</head>
<body>

  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="logo">${config.logoHtml}</a>
      <div class="header-right">
        <div class="header-phone">Call us: <a href="tel:${TEL}">${PHONE}</a></div>
        <a href="#quote" class="btn btn-primary">Free Quote</a>
        <div class="menu-wrap">
          <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="menuDropdown">&#9776; Menu</button>
          <div class="menu-dropdown" id="menuDropdown" role="menu">
            <a href="/">Home</a>
            <a href="/#services">Services</a>
            <a href="/#areas">Service Areas</a>
            <a href="#quote">Get a Quote</a>
            <a href="/blog/">Blog</a>
          </div>
        </div>
      </div>
    </div>
  </header>

  <nav class="breadcrumb">
    <div class="container">
      <a href="/">Home</a><span>›</span>Junk Removal in ${cityState}
    </div>
  </nav>

  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-content">
        <div class="hero-badge">Serving ${city.areaLabel}</div>
        <h1>Junk Removal in <em>${city.name}, ${city.stateAbbr}</em></h1>
        <p class="hero-sub">${city.heroBlurb}</p>
        <div class="hero-actions">
          <a href="tel:${TEL}" class="btn btn-primary" style="font-size:1.1rem; padding:17px 28px;">
            Call ${PHONE}
          </a>
          <a href="#quote" class="btn btn-outline">Get Free Quote Online</a>
        </div>
        <div class="trust-row">
          <div class="trust-item"><span class="check">✓</span> Same-Day Service</div>
          <div class="trust-item"><span class="check">✓</span> Upfront Flat-Rate Pricing</div>
          <div class="trust-item"><span class="check">✓</span> We Do All the Lifting</div>
          <div class="trust-item"><span class="check">✓</span> Free Quotes</div>
        </div>
      </div>
      <div class="hero-form-card" id="quote">
        <div class="form-title">Get Your Free ${city.name} Quote</div>
        <div class="form-sub">We respond fast · No obligation, no pressure</div>
        <form id="lead-form" novalidate>
          <input type="hidden" name="access_key" value="${config.web3formsKey}" />
          <input type="hidden" name="subject" value="New Lead — ${cityState} Junk Removal" />
          <input type="hidden" name="redirect" value="false" />
          <input type="hidden" name="location" value="${cityState}" />
          <div class="form-group">
            <label for="name">Your Name *</label>
            <input type="text" id="name" name="name" placeholder="John Smith" required autocomplete="name" />
          </div>
          <div class="form-group">
            <label for="phone">Phone Number *</label>
            <input type="tel" id="phone" name="phone" placeholder="(502) 000-0000" required autocomplete="tel" />
          </div>
          <div class="form-group">
            <label for="service">What do you need hauled?</label>
            <select id="service" name="service">
              <option value="">Select a service...</option>
              <option>Furniture Removal</option>
              <option>Appliance Removal</option>
              <option>Garage / Basement Cleanout</option>
              <option>Estate / Whole-House Cleanout</option>
              <option>Construction &amp; Remodel Debris</option>
              <option>Hot Tub / Shed Removal</option>
              <option>Mattress Disposal</option>
              <option>Yard Waste Removal</option>
              <option>Commercial / Office Cleanout</option>
              <option>Other — Not Sure</option>
            </select>
          </div>
          <div class="form-group">
            <label for="message">Tell us more (optional)</label>
            <textarea id="message" name="message" placeholder="What items, roughly how much, pickup address, and the best time to reach you..."></textarea>
          </div>
          <button type="submit" class="form-submit">Send My Free Quote Request →</button>
          <div class="form-privacy">Your info is private and never shared.</div>
        </form>
        <div class="form-success" id="form-success">
          <div class="check-big"></div>
          <h3>Request Received!</h3>
          <p>We'll call you back ASAP to confirm your free quote. Check your phone!</p>
        </div>
      </div>
    </div>
  </section>

  <div class="stats-bar">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item"><span class="stat-num">Same-Day</span><span class="stat-label">&amp; Next-Day Pickups</span></div>
        <div class="stat-divider"></div>
        <div class="stat-item"><span class="stat-num">Flat-Rate</span><span class="stat-label">Upfront Pricing, No Surprises</span></div>
        <div class="stat-divider"></div>
        <div class="stat-item"><span class="stat-num">7 Days/Wk</span><span class="stat-label">Evening &amp; Weekend Availability</span></div>
        <div class="stat-divider"></div>
        <div class="stat-item"><span class="stat-num">$0</span><span class="stat-label">Cost For A Quote</span></div>
      </div>
    </div>
  </div>

  <section class="section" id="services">
    <div class="container text-center">
      <h2 class="section-title">Junk Removal Services in ${cityState}</h2>
      <p class="section-sub">One crew, one truck, almost anything gone — from a single couch to a full property cleanout</p>
      <div class="services-grid">
${serviceCards()}
      </div>
    </div>
  </section>

  <section class="section about-city">
    <div class="container">
      <h2 class="section-title text-center">Junk Removal in ${city.name}, ${city.stateName}</h2>
      <p class="section-sub text-center">Local crews who know ${city.county}</p>
      <div class="about-city-inner">
        <p>${city.about[0]}</p>
        <p>${city.about[1]}</p>
      </div>
    </div>
  </section>

  <section class="section why-section">
    <div class="container text-center">
      <h2 class="section-title">Why ${city.name} Calls Us First</h2>
      <p class="section-sub">No dumpster on the lawn, no sorting it yourself, no guessing what it'll cost</p>
      <div class="why-grid">
        <div class="why-item">
          <div class="why-icon">1</div>
          <h3>Upfront Flat-Rate Pricing</h3>
          <p>You get a firm price on site before we lift anything — based on the volume your junk fills in the truck, with no hourly meter and no add-ons after.</p>
        </div>
        <div class="why-item">
          <div class="why-icon">2</div>
          <h3>We Do 100% of the Lifting</h3>
          <p>Everything stays where it is until we arrive. We carry it out from the basement, attic, or top floor — you just point at what goes.</p>
        </div>
        <div class="why-item">
          <div class="why-icon">3</div>
          <h3>Fast, Flexible Scheduling</h3>
          <p>Same-day and next-day slots across ${city.county}, including evenings and weekends, so a cleanout never waits for a day off.</p>
        </div>
        <div class="why-item">
          <div class="why-icon">4</div>
          <h3>Donate &amp; Recycle First</h3>
          <p>Usable furniture goes to local charities; metal, appliances, and e-waste go to recyclers. The landfill is the last stop, not the first.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container text-center">
      <h2 class="section-title">How Junk Removal in ${city.name} Works</h2>
      <p class="section-sub">3 simple steps from a cluttered room to an empty one</p>
      <div class="process-steps">
        <div class="process-step">
          <div class="step-num">1</div>
          <h3>Tell Us What You've Got</h3>
          <p>Call ${PHONE} or fill out the form. Describe the items or send a few photos and we'll set an arrival window that fits your day.</p>
        </div>
        <div class="process-step">
          <div class="step-num">2</div>
          <h3>Get a Free On-Site Quote</h3>
          <p>Our crew looks at everything, gives you a firm flat-rate price based on volume, and only starts once you say go.</p>
        </div>
        <div class="process-step">
          <div class="step-num">3</div>
          <h3>We Haul It Away</h3>
          <p>We load everything by hand, sweep the area, and drive off. Usable items are set aside for donation and recycling.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section areas-section" id="areas">
    <div class="container text-center">
      <h2 class="section-title">All Areas We Serve</h2>
      <p class="section-sub">We cover ${city.name} and the entire Louisville metro plus Southern Indiana. Not sure if we reach you? Just call ${PHONE}.</p>
      <div class="areas-grid">
${areaPills(city.slug)}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container text-center">
      <h2 class="section-title">Junk Removal FAQs — ${cityState}</h2>
      <p class="section-sub">Common questions about junk removal and cleanouts in ${city.name} and ${city.county}</p>
      <div class="faq-list">

${faqBlocks(city.faqs)}

      </div>
    </div>
  </section>

  <section class="cta-banner">
    <div class="container">
      <h2>Ready to Clear Out Your ${city.name} Property?</h2>
      <p>Call now to book junk removal in ${cityState}. Same-day service, flat-rate pricing, and we carry every last piece out ourselves.</p>
      <div class="cta-actions">
        <a href="tel:${TEL}" class="btn btn-white" style="font-size:1.08rem; padding:17px 32px;">Call ${PHONE}</a>
        <a href="#quote" class="btn btn-outline">Request Online Quote</a>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">${config.logoHtml}</div>
          <div class="footer-nap">
            <strong style="color:#ddd;">Serving ${city.name} &amp; Greater Louisville</strong><br>
            Phone: <a href="tel:${TEL}">${PHONE}</a><br>
            Email: <a href="mailto:${config.email}">${config.email}</a><br>
            Serving ${city.county} &amp; surrounding areas
          </div>
        </div>
        <div class="footer-col">
          <h4>Services</h4>
          <ul class="footer-links">
            <li><a href="/#services">Furniture Removal</a></li>
            <li><a href="/#services">Appliance Removal</a></li>
            <li><a href="/#services">Garage &amp; Basement Cleanouts</a></li>
            <li><a href="/#services">Estate &amp; Whole-House Cleanouts</a></li>
            <li><a href="/#services">Construction Debris Removal</a></li>
            <li><a href="/#services">Hot Tub &amp; Shed Removal</a></li>
            <li><a href="/blog/">Blog</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Service Areas</h4>
          <ul class="footer-links">
${footerCityLinks()}
          </ul>
        </div>
      </div>
      <div class="footer-bottom" style="color:#ddd;">
        &copy; 2026 ${config.businessName}. All rights reserved.
      </div>
    </div>
  </footer>

  <script>
    document.querySelectorAll('.faq-question').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = btn.closest('.faq-item');
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function(el) {
          el.classList.remove('open');
          el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
    document.getElementById('lead-form').addEventListener('submit', function(e) {
      e.preventDefault();
      var form = this;
      var btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) })
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (data.success) { form.style.display = 'none'; document.getElementById('form-success').style.display = 'block'; }
          else { btn.textContent = 'Send My Free Quote Request →'; btn.disabled = false; alert('Something went wrong. Please call us directly at ${PHONE}.'); }
        })
        .catch(function() { btn.textContent = 'Send My Free Quote Request →'; btn.disabled = false; alert('Something went wrong. Please call us directly at ${PHONE}.'); });
    });
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  </script>
  <script>
    (function(){
      var btn = document.getElementById('menuBtn');
      var drop = document.getElementById('menuDropdown');
      if(!btn) return;
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        var open = drop.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('click', function(){
        drop.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    })();
  </script>

</body>
</html>
`;
}

function generateCities() {
  cities.forEach(city => {
    const html = renderCity(city);
    const out = path.join(ROOT, `${city.slug}.html`);
    fs.writeFileSync(out, html, 'utf8');
    console.log('wrote', `${city.slug}.html`);
  });
  console.log(`Generated ${cities.length} service-area pages.`);
}

module.exports = { generateCities };

if (require.main === module) generateCities();
