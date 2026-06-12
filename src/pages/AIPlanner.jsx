import React, { useEffect, useRef, useState } from 'react';
import {
  BrainCircuit,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const previewSlides = [
  {
    label: 'Smart Onboarding',
    title: 'Structured founder intake',
    description: 'A clean setup flow that turns scattered startup data into a guided plan.',
  },
  {
    label: 'Dynamic Financial Engine',
    title: 'Live model generation',
    description: 'Interactive charts make financial logic feel transparent and credible.',
  },
  {
    label: 'One-Click Investor Export',
    title: 'Export-ready output',
    description: 'The final screen shows clear business plan structure and delivery assets.',
  },
];

const aiPlannerFeatures = [
  {
    title: 'Context-Aware AI Generation',
    text: 'Fine-tuned AI workflows map founder inputs into structured business planning logic, market context, and finance narratives.',
    icon: <BrainCircuit size={24} />,
  },
  {
    title: 'Predictive Financial Forecasts',
    text: 'Generate 3 to 5 year revenue paths, break-even analysis, burn visibility, and key planning assumptions in seconds.',
    icon: <TrendingUp size={24} />,
  },
  {
    title: 'Bank & VC Grade Outputs',
    text: 'Export clean business plans and finance packs designed for investors, lenders, grants, and pitch competitions.',
    icon: <FileText size={24} />,
  },
];



const WaitlistForm = ({ source, buttonLabel, compact = false }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState('success');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setMessageTone('error');
      setMessage('Please enter your email address.');
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } = await supabase.from('ai_waitlist_signups').insert([
      {
        email: trimmedEmail,
        source,
        metadata: {
          page: 'ai-planner',
          captured_at: new Date().toISOString(),
        },
      },
    ]);

    if (error) {
      if (error.code === '23505') {
        setMessageTone('success');
        setMessage('This email is already on the waitlist. We will keep you posted.');
        setEmail('');
      } else {
        setMessageTone('error');
        setMessage('Something went wrong while saving your spot. Please try again.');
      }
      setLoading(false);
      return;
    }

    setMessageTone('success');
    setMessage('You are on the list. We will share early access details soon.');
    setEmail('');
    setLoading(false);
  };

  return (
    <div className={`ai-waitlist-block ${compact ? 'compact' : ''}`}>
      <form className="ai-waitlist-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your work email"
          aria-label="Email address"
          required
        />
        <button type="submit" className="btn btn-secondary" disabled={loading}>
          {loading ? 'Saving...' : buttonLabel}
        </button>
      </form>
      {message ? <p className={`ai-form-message ${messageTone}`}>{message}</p> : null}
    </div>
  );
};

const AIPlanner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const railRef = useRef(null);

  const handleRailScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const slideWidth = rail.scrollWidth / previewSlides.length;
    setActiveSlide(Math.round(rail.scrollLeft / slideWidth));
  };

  const scrollToSlide = (index) => {
    const rail = railRef.current;
    if (!rail) return;
    const slideWidth = rail.scrollWidth / previewSlides.length;
    rail.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute('content');

    document.title = 'Beconhive AI Planner | Automated Business Planning';

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute(
      'content',
      'Beconhive AI helps founders generate investor-ready business plans, predictive financial models, and export-ready planning documents in minutes.'
    );

    return () => {
      document.title = previousTitle;
      if (previousDescription) {
        descriptionTag.setAttribute('content', previousDescription);
      }
    };
  }, []);

  return (
    <div className="ai-planner-page">
      <section className="ai-hero-section">
        <div className="container ai-hero-layout">
          <div className="ai-hero-copy">
            <div className="ai-hero-badge">Launching Q3 2026. Built for ambitious founders.</div>
            <h1>Automated Business Planning & Predictive Financial Modeling</h1>
            <p>
              Upload raw business inputs, founder notes, or spreadsheet assumptions and generate investor-ready
              financial forecasts, cash-flow statements, and structured business plans in under 10 minutes.
            </p>
            <WaitlistForm source="hero" buttonLabel="Join the Beta Waitlist" />

            <div className="ai-proof-row">
              <div>
                <strong>10 minutes</strong>
                <span>from raw inputs to a structured planning draft</span>
              </div>
              <div>
                <strong>3 to 5 years</strong>
                <span>automated projection ranges for growth scenarios</span>
              </div>
            </div>

            <div className="ai-hero-support">
              <div className="ai-support-card">
                <span>Fine-tuned workflow</span>
                <strong>Built for founders, funding teams, and early-stage operators.</strong>
              </div>
              <div className="ai-support-card">
                <span>Early access</span>
                <strong>Secure your place before the private beta rollout begins.</strong>
              </div>
            </div>
          </div>

          <div className="ai-hero-side-card">
            <div className="ai-mini-label">What founders get</div>
            <h3>One workspace for planning, forecasting, and export-ready deliverables.</h3>
            <div className="ai-hero-points">
              <div className="ai-hero-point">
                <span>01</span>
                <div>
                  <strong>Drop in raw inputs</strong>
                  <p>Notes, pitch decks, spreadsheets, and assumptions.</p>
                </div>
              </div>
              <div className="ai-hero-point">
                <span>02</span>
                <div>
                  <strong>Generate financial logic</strong>
                  <p>Revenue, burn, break-even, and structured planning outputs.</p>
                </div>
              </div>
              <div className="ai-hero-point">
                <span>03</span>
                <div>
                  <strong>Export investor-ready files</strong>
                  <p>Business plans and finance packs ready for review.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding ai-preview-section">
        <div className="container">
          <div className="ai-section-heading ai-section-heading--dark">
            <span className="ai-section-tag ai-section-tag--orange">Product Preview</span>
            <h2>A Sneak Peek Inside the Engine</h2>
            <p>
              Browse the core product screens below — from smart onboarding through live financial modeling to export-ready outputs.
            </p>
          </div>

          <div className="ai-preview-label-row">
            {previewSlides.map((slide, index) => (
              <button
                key={slide.label}
                type="button"
                className={`ai-preview-label-pill${activeSlide === index ? ' active' : ''}`}
                onClick={() => scrollToSlide(index)}
              >
                {slide.label}
              </button>
            ))}
          </div>

          <div className="ai-preview-rail" ref={railRef} onScroll={handleRailScroll}>
            <article className="ai-preview-slide">
              <div className="ai-preview-stage">
                <img
                  src="/ai_planner_onboarding.png"
                  alt="Smart onboarding screen"
                  className="ai-preview-img"
                />
              </div>
            </article>

            <article className="ai-preview-slide">
              <div className="ai-preview-stage">
                <img
                  src="/ai_planner_financial.png"
                  alt="Financial modeling screen"
                  className="ai-preview-img"
                />
              </div>
            </article>

            <article className="ai-preview-slide">
              <div className="ai-preview-stage">
                <img
                  src="/ai_planner_export.png"
                  alt="Export-ready output screen"
                  className="ai-preview-img"
                />
              </div>
            </article>
          </div>

          <div className="ai-slide-dots">
            {previewSlides.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                className={`ai-slide-dot${activeSlide === dotIndex ? ' active' : ''}`}
                aria-label={`Go to slide ${dotIndex + 1}`}
                onClick={() => scrollToSlide(dotIndex)}
              />
            ))}
          </div>

          <div className="ai-mobile-only ai-swipe-note">
            <div className="ai-swipe-chip">Swipe to see more screens</div>
          </div>
        </div>
      </section>

      <section className="section-padding ai-features-section">
        <div className="container">
          <div className="ai-section-heading">
            <span className="ai-section-tag">Why It Matters</span>
            <h2>Built like a software platform, not a service handoff.</h2>
            <p>
              Beconhive AI is being shaped as a repeatable planning engine for founders, operators, and funding teams.
            </p>
          </div>

          <div className="ai-feature-grid">
            {aiPlannerFeatures.map((feature) => (
              <div key={feature.title} className="ai-feature-card">
                <div className="ai-feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-bottom-cta" id="ai-waitlist-footer">
        <div className="container ai-bottom-cta-inner">
          <div>
            <span className="ai-section-tag">Early Access</span>
            <h2>Secure your spot for early-bird access and exclusive cloud-computing beta perks.</h2>
          </div>
          <WaitlistForm source="footer" buttonLabel="Get Early Access" compact />
        </div>
      </section>

      <style>{`
        .ai-planner-page {
          background:
            radial-gradient(circle at top left, rgba(237, 71, 5, 0.14), transparent 24%),
            linear-gradient(180deg, #04142d 0%, #071b3e 38%, #1a3a6b 42%, #f5f8fc 46%, #ffffff 100%);
        }

        .ai-hero-section {
          padding: 128px 0 88px;
          color: white;
          overflow: hidden;
          position: relative;
        }

        .ai-hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 82% 14%, rgba(237, 71, 5, 0.22), transparent 22%),
            radial-gradient(circle at 10% 12%, rgba(10, 88, 202, 0.26), transparent 28%);
          pointer-events: none;
        }

        .ai-hero-layout {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 460px);
          gap: 34px;
          align-items: center;
        }

        .ai-hero-copy h1 {
          font-size: clamp(3rem, 5vw, 5rem);
          line-height: 1.04;
          letter-spacing: -0.05em;
          margin-bottom: 20px;
          max-width: 12ch;
          color: #ffffff;
        }

        .ai-hero-copy p {
          max-width: 650px;
          font-size: 1.08rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 26px;
        }

        .ai-hero-badge,
        .ai-section-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 18px;
        }

        .ai-waitlist-form {
          display: flex;
          gap: 12px;
          padding: 10px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          max-width: 620px;
        }

        .ai-waitlist-form input {
          flex: 1;
          min-height: 56px;
          padding: 0 18px;
          border-radius: 14px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.98);
          color: #04142d;
          font: inherit;
          outline: none;
        }

        .ai-waitlist-form input:focus {
          border-color: var(--primary-orange);
          box-shadow: 0 0 0 4px rgba(237, 71, 5, 0.12);
        }

        .ai-waitlist-form input:invalid:not(:placeholder-shown) {
          border-color: #ff4d4d;
          box-shadow: 0 0 0 4px rgba(255, 77, 77, 0.12);
        }

        .ai-form-message {
          margin-top: 10px;
          font-size: 0.95rem;
        }

        .ai-form-message.success {
          color: #c7f9cc;
        }

        .ai-form-message.error {
          color: #ffd7d7;
        }

        .ai-proof-row,
        .ai-hero-support {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .ai-proof-row div,
        .ai-support-card,
        .ai-hero-side-card,
        .ai-sidebar-note,
        .ai-metric-card,
        .ai-feature-card,
        .ai-bottom-cta-inner {
          backdrop-filter: blur(14px);
        }

        .ai-proof-row div,
        .ai-support-card,
        .ai-hero-side-card {
          padding: 18px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ai-proof-row strong,
        .ai-support-card strong {
          display: block;
          font-size: 1.12rem;
        }

        .ai-proof-row span,
        .ai-support-card span {
          display: block;
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.9rem;
          margin-bottom: 6px;
        }

        .ai-mini-label {
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.56);
          margin-bottom: 8px;
        }

        .ai-hero-side-card h3 {
          font-size: 1.45rem;
          line-height: 1.1;
          color: white;
          margin-bottom: 18px;
        }

        .ai-hero-points {
          display: grid;
          gap: 14px;
        }

        .ai-hero-point,
        .ai-brand-block,
        .ai-shell-nav-item,
        .ai-upload-header,
        .ai-checklist div,
        .ai-document-toolbar,
        .ai-toc-item,
        .ai-live-pill,
        .ai-break-even-content {
          display: flex;
          gap: 12px;
        }

        .ai-hero-point span {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.88rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, var(--primary-orange), #ff8b5a);
        }

        .ai-hero-point strong {
          display: block;
          color: white;
          margin-bottom: 4px;
        }

        .ai-hero-point p {
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.94rem;
        }

        .ai-section-heading {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 30px;
        }

        .ai-section-heading .ai-section-tag {
          background: rgba(10, 88, 202, 0.08);
          border-color: rgba(10, 88, 202, 0.16);
          color: var(--primary-blue);
        }

        .ai-section-heading h2 {
          font-size: clamp(2.1rem, 4vw, 3.4rem);
          line-height: 1.06;
          margin-bottom: 12px;
        }

        .ai-section-heading p {
          color: rgba(4, 20, 45, 0.74);
          font-size: 1.04rem;
        }

        /* Preview section heading — white text on dark bg */
        .ai-section-heading--dark h2 {
          color: #ffffff;
        }

        .ai-section-heading--dark p {
          color: rgba(255, 255, 255, 0.78);
        }

        /* Orange badge variant */
        .ai-section-tag--orange {
          background: var(--primary-orange) !important;
          border-color: var(--primary-orange) !important;
          color: #ffffff !important;
        }

        .ai-preview-label-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 18px;
        }

        .ai-preview-label-pill {
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(10, 88, 202, 0.14);
          background: white;
          color: rgba(4, 20, 45, 0.72);
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }

        .ai-preview-label-pill.active {
          background: var(--primary-blue);
          border-color: var(--primary-blue);
          color: white;
        }

        .ai-preview-label-pill:hover:not(.active) {
          background: rgba(10, 88, 202, 0.06);
          border-color: rgba(10, 88, 202, 0.3);
        }

        .ai-slide-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 18px;
        }

        .ai-slide-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: none;
          background: rgba(10, 88, 202, 0.2);
          cursor: pointer;
          padding: 0;
          transition: background 0.2s, width 0.2s;
        }

        .ai-slide-dot.active {
          background: var(--primary-orange);
          width: 28px;
        }

        /* Image slide */
        .ai-preview-img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 20px;
        }

        .ai-preview-rail {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 14px;
          scrollbar-width: thin;
          scrollbar-color: rgba(10, 88, 202, 0.3) transparent;
        }

        .ai-preview-rail::-webkit-scrollbar {
          height: 10px;
        }

        .ai-preview-rail::-webkit-scrollbar-thumb {
          background: rgba(10, 88, 202, 0.24);
          border-radius: 999px;
        }

        .ai-preview-slide {
          flex: 0 0 min(1040px, 88vw);
          scroll-snap-align: start;
        }

        .ai-preview-stage {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(4, 20, 45, 0.22);
        }

        .ai-mobile-only {
          display: none;
        }

        .ai-swipe-note {
          margin-top: 14px;
          text-align: center;
        }

        .ai-swipe-chip {
          display: inline-flex;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(10, 88, 202, 0.08);
          color: var(--primary-blue);
          font-weight: 600;
        }

        .ai-shell {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr);
          border-radius: 22px;
          overflow: hidden;
          background: #eef4fb;
          min-height: 470px;
        }

        .ai-shell-sidebar {
          background: linear-gradient(180deg, #04142d 0%, #0a2348 100%);
          color: white;
          padding: 22px 18px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .ai-brand-block {
          align-items: center;
        }

        .ai-brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--primary-orange), #ff8b5a);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .ai-brand-title {
          font-weight: 700;
        }

        .ai-brand-subtitle,
        .ai-sidebar-note-label,
        .ai-metric-card small {
          color: rgba(255, 255, 255, 0.62);
          font-size: 0.82rem;
        }

        .ai-shell-nav {
          display: grid;
          gap: 10px;
        }

        .ai-shell-nav-item {
          padding: 12px 14px;
          border-radius: 14px;
          color: rgba(255, 255, 255, 0.78);
          background: rgba(255, 255, 255, 0.03);
          align-items: center;
        }

        .ai-shell-nav-item.active {
          background: rgba(237, 71, 5, 0.18);
          color: white;
          border: 1px solid rgba(237, 71, 5, 0.4);
        }

        .ai-sidebar-note {
          margin-top: auto;
          padding: 16px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: grid;
          gap: 4px;
        }

        .ai-sidebar-note span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .ai-shell-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          color: #04142d;
        }

        .ai-shell-topbar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .ai-shell-topbar h3 {
          font-size: 1.4rem;
          margin-bottom: 4px;
        }

        .ai-shell-topbar p {
          color: rgba(4, 20, 45, 0.64);
        }

        .ai-shell-eyebrow {
          color: var(--primary-blue);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .ai-live-pill {
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          background: white;
          border: 1px solid rgba(10, 88, 202, 0.12);
          white-space: nowrap;
        }

        .ai-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--primary-orange);
          box-shadow: 0 0 16px rgba(237, 71, 5, 0.7);
        }

        .ai-onboarding-grid,
        .ai-export-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .ai-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 20px;
          border: 1px solid rgba(10, 88, 202, 0.1);
          padding: 18px;
          box-shadow: 0 18px 42px rgba(10, 88, 202, 0.08);
        }

        .ai-card-highlight {
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(240,245,250,0.95));
        }

        .ai-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          color: #0a2348;
          font-weight: 600;
        }

        .ai-input-stack {
          display: grid;
          gap: 14px;
        }

        .ai-input-stack label {
          display: grid;
          gap: 8px;
          font-size: 0.9rem;
          color: rgba(4, 20, 45, 0.68);
        }

        .ai-input-box,
        .ai-upload-action {
          min-height: 48px;
          border-radius: 14px;
          background: #f5f8fc;
          border: 1px solid rgba(10, 88, 202, 0.1);
          display: flex;
          align-items: center;
          padding: 0 14px;
          color: #04142d;
          font-weight: 600;
        }

        .ai-upload-header {
          align-items: center;
          gap: 10px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .ai-upload-zone {
          min-height: 170px;
          border-radius: 20px;
          border: 1.5px dashed rgba(10, 88, 202, 0.18);
          background: linear-gradient(180deg, rgba(10,88,202,0.04), rgba(237,71,5,0.05));
          padding: 18px;
          display: grid;
          align-content: start;
          gap: 10px;
          margin-bottom: 16px;
        }

        .ai-upload-pill {
          display: inline-flex;
          width: fit-content;
          padding: 8px 12px;
          border-radius: 999px;
          background: white;
          border: 1px solid rgba(10, 88, 202, 0.08);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .ai-checklist {
          display: grid;
          gap: 10px;
          color: rgba(4, 20, 45, 0.78);
          font-size: 0.92rem;
        }

        .ai-checklist div,
        .ai-toc-item {
          align-items: center;
          gap: 8px;
        }

        .ai-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .ai-metric-card {
          padding: 16px 18px;
          border-radius: 18px;
          background: linear-gradient(180deg, #0a2348, #04142d);
          color: white;
          display: grid;
          gap: 6px;
        }

        .ai-metric-card strong {
          font-size: 1.65rem;
        }

        .ai-chart-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 18px;
        }

        .ai-break-even-card {
          grid-column: 1 / -1;
        }

        .ai-bar-chart {
          display: flex;
          align-items: end;
          gap: 16px;
          height: 220px;
          padding-top: 20px;
        }

        .ai-bar-chart .bar {
          flex: 1;
          display: flex;
          align-items: end;
          height: 100%;
          border-radius: 16px 16px 6px 6px;
          background: rgba(10, 88, 202, 0.08);
          padding: 10px;
        }

        .ai-bar-chart .bar span {
          width: 100%;
          border-radius: 12px 12px 4px 4px;
          background: linear-gradient(180deg, #ed4705, #0a58ca);
          box-shadow: 0 14px 28px rgba(10, 88, 202, 0.18);
        }

        .bar-one span { height: 42%; }
        .bar-two span { height: 68%; }
        .bar-three span { height: 88%; }

        .ai-bar-labels {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }

        .ai-bar-labels span {
          flex: 1;
          text-align: center;
          font-size: 0.78rem;
          color: rgba(4, 20, 45, 0.5);
          font-weight: 500;
        }

        .ai-line-chart {
          position: relative;
          height: 220px;
          border-radius: 18px;
          background:
            linear-gradient(rgba(10,88,202,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10,88,202,0.06) 1px, transparent 1px);
          background-size: 100% 44px, 48px 100%;
          overflow: hidden;
        }

        .ai-line {
          position: absolute;
          inset: auto 0 28px 0;
          height: 120px;
          border-radius: 999px;
          opacity: 0.95;
        }

        .ai-line-blue {
          clip-path: polygon(0% 80%, 15% 70%, 30% 72%, 45% 58%, 60% 62%, 75% 38%, 100% 10%, 100% 100%, 0% 100%);
          background: linear-gradient(180deg, rgba(10, 88, 202, 0.34), rgba(10, 88, 202, 0.05));
          border-top: 3px solid #0a58ca;
        }

        .ai-line-orange {
          clip-path: polygon(0% 92%, 20% 84%, 40% 78%, 58% 64%, 75% 58%, 100% 24%, 100% 100%, 0% 100%);
          background: linear-gradient(180deg, rgba(237, 71, 5, 0.22), rgba(237, 71, 5, 0.03));
          border-top: 3px solid #ed4705;
          height: 150px;
        }

        .ai-break-even-content {
          gap: 18px;
        }

        .ai-break-even-ring {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #04142d;
          background: conic-gradient(var(--primary-orange) 0 295deg, rgba(10, 88, 202, 0.14) 295deg 360deg);
        }

        .ai-break-even-copy p {
          margin-top: 8px;
          color: rgba(4, 20, 45, 0.68);
        }

        .ai-toc-list {
          display: grid;
          gap: 12px;
        }

        .ai-toc-item {
          padding: 12px 14px;
          border-radius: 14px;
          background: #f5f8fc;
          color: #04142d;
        }

        .ai-document-card {
          background: linear-gradient(180deg, #fefefe, #f5f8fc);
        }

        .ai-document-toolbar {
          margin-bottom: 16px;
          color: #04142d;
          align-items: center;
        }

        .ai-export-button {
          border: none;
          background: #04142d;
          color: white;
          padding: 10px 14px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .ai-export-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .ai-document-viewer {
          border-radius: 18px;
          background: white;
          border: 1px solid rgba(10, 88, 202, 0.08);
          padding: 20px;
          display: grid;
          gap: 14px;
        }

        .ai-document-title {
          font-size: 1.15rem;
          font-weight: 700;
        }

        .ai-document-columns {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .ai-document-block {
          height: 74px;
          border-radius: 12px;
          background: linear-gradient(180deg, #f7f9fc, #ebf1f9);
          border: 1px solid rgba(10, 88, 202, 0.08);
        }

        .ai-document-block.large {
          height: 112px;
        }

        .ai-document-block.medium {
          height: 92px;
        }

        .ai-document-footer {
          color: rgba(4, 20, 45, 0.56);
        }

        .ai-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .ai-feature-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,245,250,0.98));
          border-radius: 24px;
          padding: 24px;
          border: 1px solid rgba(10, 88, 202, 0.1);
          box-shadow: 0 18px 50px rgba(10, 88, 202, 0.08);
        }

        .ai-feature-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(10, 88, 202, 0.08);
          color: var(--primary-blue);
          margin-bottom: 18px;
        }

        .ai-feature-card h3 {
          font-size: 1.25rem;
          margin-bottom: 10px;
        }

        .ai-feature-card p {
          color: rgba(4, 20, 45, 0.7);
        }

        .ai-bottom-cta {
          padding: 0 0 90px;
        }

        #ai-waitlist-footer {
          scroll-margin-top: 96px;
        }

        .ai-bottom-cta-inner {
          padding: 34px;
          border-radius: 28px;
          background: linear-gradient(135deg, #04142d 0%, #0a58ca 100%);
          color: white;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 28px;
          align-items: center;
          box-shadow: 0 28px 70px rgba(4, 20, 45, 0.2);
        }

        .ai-bottom-cta-inner h2 {
          max-width: 700px;
          font-size: clamp(1.8rem, 3.8vw, 3rem);
          line-height: 1.08;
        }

        .ai-bottom-cta .ai-section-tag {
          color: white;
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.2);
        }

        .ai-waitlist-block.compact .ai-waitlist-form {
          background: rgba(255, 255, 255, 0.12);
          width: min(520px, 100%);
          min-width: 0;
        }

        @media (max-width: 860px) {
          .ai-bottom-cta-inner {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 1080px) {
          .ai-hero-layout,
          .ai-feature-grid,
          .ai-chart-grid {
            grid-template-columns: 1fr;
          }

          .ai-hero-copy h1 {
            max-width: none;
          }

          .ai-shell {
            grid-template-columns: 1fr;
          }

          .ai-shell-sidebar {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .ai-planner-page {
            background: linear-gradient(180deg, #04142d 0%, #0d2145 36%, #f6f8fc 40%, #ffffff 100%);
          }

          .ai-hero-section {
            padding: 108px 0 56px;
          }

          .ai-hero-layout {
            gap: 24px;
          }

          .ai-hero-copy h1 {
            font-size: clamp(2.4rem, 10vw, 3.3rem);
            line-height: 1.04;
            margin-bottom: 16px;
          }

          .ai-hero-copy p {
            font-size: 1rem;
            margin-bottom: 20px;
          }

          .ai-waitlist-form,
          .ai-waitlist-block.compact .ai-waitlist-form {
            flex-direction: column;
            padding: 12px;
            min-width: 100%;
          }

          .ai-waitlist-form button {
            width: 100%;
          }

          .ai-proof-row,
          .ai-hero-support,
          .ai-onboarding-grid,
          .ai-export-grid,
          .ai-document-columns,
          .ai-metrics-row {
            grid-template-columns: 1fr;
          }

          .ai-hero-side-card {
            border-radius: 24px;
          }

          .ai-preview-slide {
            flex-basis: calc(100vw - 32px);
          }


          .ai-mobile-only {
            display: block;
          }

          .ai-section-heading {
            margin-bottom: 24px;
          }

          .ai-section-heading h2 {
            font-size: 2rem;
          }

          .ai-shell-content {
            padding: 14px;
            gap: 14px;
          }

          .ai-shell-topbar {
            flex-direction: column;
          }

          .ai-shell-topbar h3 {
            font-size: 1.2rem;
          }

          .ai-live-pill {
            padding: 8px 12px;
          }

          .ai-card,
          .ai-feature-card,
          .ai-hero-side-card {
            border-radius: 18px;
            padding: 16px;
          }

          .ai-bar-chart,
          .ai-line-chart {
            height: 180px;
          }

          .ai-break-even-content {
            flex-direction: column;
          }

          .ai-bottom-cta {
            padding-bottom: 70px;
          }

          .ai-bottom-cta-inner {
            padding: 24px 18px;
            border-radius: 24px;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default AIPlanner;
