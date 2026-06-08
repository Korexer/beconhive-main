import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  FolderUp,
  LayoutDashboard,
  LineChart,
  Settings,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const slideLabels = [
  'Smart Onboarding',
  'Dynamic Financial Engine',
  'One-Click Investor Export',
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

const dashboardNavItems = [
  { label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Business Plans', icon: <FileText size={16} /> },
  { label: 'Financial Models', icon: <BarChart3 size={16} /> },
  { label: 'Settings', icon: <Settings size={16} /> },
];

const DashboardShell = ({ children, eyebrow, title, subtitle }) => (
  <div className="ai-shell">
    <aside className="ai-shell-sidebar">
      <div className="ai-brand-block">
        <div className="ai-brand-icon">
          <Sparkles size={18} />
        </div>
        <div>
          <div className="ai-brand-title">Beconhive AI</div>
          <div className="ai-brand-subtitle">Planner Beta</div>
        </div>
      </div>

      <div className="ai-shell-nav">
        {dashboardNavItems.map((item, index) => (
          <div key={item.label} className={`ai-shell-nav-item ${index === 0 ? 'active' : ''}`}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="ai-sidebar-note">
        <div className="ai-sidebar-note-label">Current run</div>
        <strong>Series A funding pack</strong>
        <span>7 assets generated</span>
      </div>
    </aside>

    <div className="ai-shell-content">
      <div className="ai-shell-topbar">
        <div>
          <div className="ai-shell-eyebrow">{eyebrow}</div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <div className="ai-live-pill">
          <span className="ai-live-dot" />
          AI engine live
        </div>
      </div>
      {children}
    </div>
  </div>
);

const OnboardingPreview = () => (
  <DashboardShell
    eyebrow="Slide 1"
    title="Smart onboarding for messy startup inputs"
    subtitle="Founders drop in raw notes, market data, and pitch material. The system turns that into a structured planning brief."
  >
    <div className="ai-onboarding-grid">
      <div className="ai-card">
        <div className="ai-card-header">
          <span>Business profile</span>
          <CheckCircle2 size={16} />
        </div>
        <div className="ai-input-stack">
          <label>
            Business name
            <div className="ai-input-box">Beconhive AI</div>
          </label>
          <label>
            Industry
            <div className="ai-input-box">AI planning software</div>
          </label>
          <label>
            Goal
            <div className="ai-input-box">Raise pre-seed capital in Q3 2026</div>
          </label>
        </div>
      </div>

      <div className="ai-card ai-card-highlight">
        <div className="ai-upload-header">
          <FolderUp size={18} />
          <span>Upload pitch deck or raw financial data</span>
        </div>
        <div className="ai-upload-zone">
          <div className="ai-upload-pill">deck_v4.pdf</div>
          <div className="ai-upload-pill">forecast_assumptions.xlsx</div>
          <div className="ai-upload-action">Drop files here or browse securely</div>
        </div>
        <div className="ai-checklist">
          <div><CheckCircle2 size={16} /> Market summary mapped</div>
          <div><CheckCircle2 size={16} /> Cost assumptions parsed</div>
          <div><CheckCircle2 size={16} /> Funding goals detected</div>
        </div>
      </div>
    </div>
  </DashboardShell>
);

const ModelingPreview = () => (
  <DashboardShell
    eyebrow="Slide 2"
    title="Predictive financial engine in motion"
    subtitle="Scenario modeling updates instantly as the AI builds your revenue paths, burn forecast, and break-even logic."
  >
    <div className="ai-metrics-row">
      <div className="ai-metric-card">
        <span>Projected ARR</span>
        <strong>$1.28M</strong>
        <small>Year 3 estimate</small>
      </div>
      <div className="ai-metric-card">
        <span>Gross margin</span>
        <strong>74%</strong>
        <small>Model confidence high</small>
      </div>
      <div className="ai-metric-card">
        <span>Break-even</span>
        <strong>Month 19</strong>
        <small>Based on current hiring plan</small>
      </div>
    </div>

    <div className="ai-chart-grid">
      <div className="ai-card">
        <div className="ai-card-header">
          <span>3-year revenue projection</span>
          <BarChart3 size={16} />
        </div>
        <div className="ai-bar-chart">
          <div className="bar bar-one"><span /></div>
          <div className="bar bar-two"><span /></div>
          <div className="bar bar-three"><span /></div>
        </div>
      </div>
      <div className="ai-card">
        <div className="ai-card-header">
          <span>Cash flow health</span>
          <LineChart size={16} />
        </div>
        <div className="ai-line-chart">
          <div className="ai-line ai-line-blue" />
          <div className="ai-line ai-line-orange" />
        </div>
      </div>
      <div className="ai-card ai-break-even-card">
        <div className="ai-card-header">
          <span>Break-even analysis</span>
          <TrendingUp size={16} />
        </div>
        <div className="ai-break-even-content">
          <div className="ai-break-even-ring">82%</div>
          <div className="ai-break-even-copy">
            <strong>Investor-ready scenario</strong>
            <p>Best-fit pricing model reaches operating break-even faster than the baseline case.</p>
          </div>
        </div>
      </div>
    </div>
  </DashboardShell>
);

const ExportPreview = () => (
  <DashboardShell
    eyebrow="Slide 3"
    title="One-click export for investors and lenders"
    subtitle="Generate a complete business plan package with a polished document view and downloadable finance files."
  >
    <div className="ai-export-grid">
      <div className="ai-card">
        <div className="ai-card-header">
          <span>Business plan structure</span>
          <FileText size={16} />
        </div>
        <div className="ai-toc-list">
          {[
            'Executive Summary',
            'Problem & Market Gap',
            'Product & GTM Strategy',
            'Financial Forecasts',
            'Funding Ask & Use of Funds',
          ].map((item) => (
            <div key={item} className="ai-toc-item">
              <ChevronRight size={14} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-card ai-document-card">
        <div className="ai-document-toolbar">
          <span>Investor-Ready Business Plan</span>
          <button type="button" className="ai-export-button">
            <Download size={16} />
            Download PDF / Export to Excel
          </button>
        </div>
        <div className="ai-document-viewer">
          <div className="ai-document-title">Beconhive AI Growth Plan</div>
          <div className="ai-document-block large" />
          <div className="ai-document-columns">
            <div className="ai-document-block" />
            <div className="ai-document-block" />
          </div>
          <div className="ai-document-block medium" />
          <div className="ai-document-footer">Version 1.0 generated for founder review</div>
        </div>
      </div>
    </div>
  </DashboardShell>
);

const previewSlides = [
  {
    label: slideLabels[0],
    title: 'Structured founder intake',
    description: 'A clean setup flow that turns scattered startup data into a guided plan.',
    component: <OnboardingPreview />,
  },
  {
    label: slideLabels[1],
    title: 'Live model generation',
    description: 'Interactive charts make financial logic feel transparent and credible.',
    component: <ModelingPreview />,
  },
  {
    label: slideLabels[2],
    title: 'Export-ready output',
    description: 'The final screen shows clear business plan structure and delivery assets.',
    component: <ExportPreview />,
  },
];

const HeroPreview = () => (
  <div className="ai-hero-preview">
    <div className="ai-hero-preview-top">
      <div>
        <div className="ai-mini-label">Planner command center</div>
        <h3>From messy founder notes to investor-ready outputs</h3>
      </div>
      <div className="ai-hero-dots">
        <span />
        <span />
        <span />
      </div>
    </div>

    <div className="ai-hero-preview-grid">
      <div className="ai-mini-kpi">
        <span>Forecast build</span>
        <strong>10 min</strong>
      </div>
      <div className="ai-mini-kpi">
        <span>Scenarios</span>
        <strong>3 models</strong>
      </div>
      <div className="ai-mini-kpi">
        <span>Exports</span>
        <strong>PDF + XLSX</strong>
      </div>
    </div>

    <div className="ai-desktop-only">
      <OnboardingPreview />
    </div>

    <div className="ai-mobile-hero-stack ai-mobile-only">
      <div className="ai-mobile-flow-card">
        <div className="ai-mobile-flow-step">
          <span>01</span>
          <div>
            <strong>Upload raw files</strong>
            <p>Pitch deck, assumptions, and founder notes.</p>
          </div>
        </div>
        <div className="ai-mobile-flow-step">
          <span>02</span>
          <div>
            <strong>AI builds models</strong>
            <p>Revenue, burn, and break-even logic update instantly.</p>
          </div>
        </div>
        <div className="ai-mobile-flow-step">
          <span>03</span>
          <div>
            <strong>Export ready pack</strong>
            <p>Business plan and finance files for investors and lenders.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % previewSlides.length);
    }, 5500);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToPrevious = () => {
    setActiveSlide((current) => (current - 1 + previewSlides.length) % previewSlides.length);
  };

  const goToNext = () => {
    setActiveSlide((current) => (current + 1) % previewSlides.length);
  };

  return (
    <div className="ai-planner-page">
      <section className="ai-hero-section">
        <div className="container ai-hero-layout">
          <div className="ai-hero-copy">
            <div className="ai-hero-badge">Launching Q3 2026. Built for ambitious founders.</div>
            <h1>Automated Business Planning &amp; Predictive Financial Modeling.</h1>
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

          <HeroPreview />
        </div>
      </section>

      <section className="section-padding ai-preview-section">
        <div className="container">
          <div className="ai-section-heading">
            <span className="ai-section-tag">Product Preview</span>
            <h2>A Sneak Peek Inside the Engine.</h2>
            <p>
              A guided preview of the founder workflow, the financial engine, and the final export experience.
            </p>
          </div>

          <div className="ai-preview-controls">
            <div className="ai-preview-tabs">
              {previewSlides.map((slide, index) => (
                <button
                  key={slide.label}
                  type="button"
                  className={index === activeSlide ? 'active' : ''}
                  onClick={() => setActiveSlide(index)}
                >
                  {slide.label}
                </button>
              ))}
            </div>

            <div className="ai-arrow-controls">
              <button type="button" onClick={goToPrevious} aria-label="Previous preview">
                <ArrowLeft size={18} />
              </button>
              <button type="button" onClick={goToNext} aria-label="Next preview">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="ai-preview-stage">
            <div className="ai-preview-copy">
              <h3>{previewSlides[activeSlide].title}</h3>
              <p>{previewSlides[activeSlide].description}</p>
            </div>
            {previewSlides[activeSlide].component}
            <div className="ai-preview-dots">
              {previewSlides.map((slide, index) => (
                <button
                  key={slide.label}
                  type="button"
                  className={index === activeSlide ? 'active' : ''}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show ${slide.label}`}
                />
              ))}
            </div>
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
            linear-gradient(180deg, #04142d 0%, #071b3e 24%, #f5f8fc 24.1%, #ffffff 100%);
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
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 34px;
          align-items: center;
        }

        .ai-hero-copy h1 {
          font-size: clamp(3.1rem, 5vw, 5.35rem);
          line-height: 0.98;
          letter-spacing: -0.05em;
          margin-bottom: 20px;
          max-width: 12ch;
          color: #ffffff;
          text-wrap: balance;
        }

        .ai-hero-copy p {
          max-width: 630px;
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

        .ai-proof-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 26px;
        }

        .ai-proof-row div,
        .ai-support-card,
        .ai-sidebar-note,
        .ai-metric-card,
        .ai-feature-card,
        .ai-bottom-cta-inner,
        .ai-hero-preview {
          backdrop-filter: blur(14px);
        }

        .ai-proof-row div,
        .ai-support-card {
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

        .ai-hero-support {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 14px;
        }

        .ai-hero-preview,
        .ai-preview-stage {
          background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04));
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 26px 80px rgba(4, 20, 45, 0.34);
          border-radius: 30px;
          padding: 18px;
        }

        .ai-hero-preview {
          background: linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.05));
        }

        .ai-hero-preview-top,
        .ai-document-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.76);
        }

        .ai-mini-label {
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.56);
          margin-bottom: 6px;
        }

        .ai-hero-preview-top h3 {
          font-size: 1.55rem;
          line-height: 1.08;
          color: white;
          max-width: 14ch;
        }

        .ai-hero-dots {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }

        .ai-hero-dots span,
        .ai-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--primary-orange);
          box-shadow: 0 0 16px rgba(237, 71, 5, 0.7);
        }

        .ai-hero-preview-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .ai-mini-kpi {
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ai-mini-kpi span {
          display: block;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
        }

        .ai-mini-kpi strong {
          color: white;
          font-size: 1.16rem;
        }

        .ai-section-heading {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 36px;
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

        .ai-preview-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .ai-preview-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .ai-preview-tabs button,
        .ai-arrow-controls button,
        .ai-preview-dots button,
        .ai-export-button {
          font: inherit;
        }

        .ai-preview-tabs button {
          padding: 12px 16px;
          border-radius: 999px;
          border: 1px solid rgba(10, 88, 202, 0.14);
          background: white;
          color: rgba(4, 20, 45, 0.72);
          cursor: pointer;
          transition: all var(--transition);
        }

        .ai-preview-tabs button.active {
          background: #04142d;
          color: white;
          border-color: transparent;
        }

        .ai-arrow-controls {
          display: flex;
          gap: 10px;
        }

        .ai-arrow-controls button,
        .ai-preview-dots button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(10, 88, 202, 0.14);
          background: white;
          cursor: pointer;
        }

        .ai-arrow-controls button {
          width: 42px;
          height: 42px;
        }

        .ai-preview-stage {
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,245,250,0.98));
          border-color: rgba(10, 88, 202, 0.1);
          box-shadow: 0 24px 80px rgba(10, 88, 202, 0.12);
        }

        .ai-preview-copy {
          margin-bottom: 18px;
        }

        .ai-preview-copy h3 {
          font-size: 1.5rem;
          margin-bottom: 6px;
        }

        .ai-preview-copy p {
          color: rgba(4, 20, 45, 0.68);
        }

        .ai-preview-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 18px;
        }

        .ai-preview-dots button {
          width: 12px;
          height: 12px;
        }

        .ai-preview-dots button.active {
          background: var(--primary-orange);
          border-color: var(--primary-orange);
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

        .ai-brand-block,
        .ai-shell-nav-item,
        .ai-upload-header,
        .ai-checklist div,
        .ai-document-toolbar,
        .ai-toc-item,
        .ai-live-pill,
        .ai-break-even-content,
        .ai-mobile-flow-step {
          display: flex;
          align-items: center;
        }

        .ai-brand-block {
          gap: 12px;
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
        .ai-shell-eyebrow,
        .ai-metric-card small,
        .ai-document-footer {
          color: rgba(255, 255, 255, 0.62);
          font-size: 0.82rem;
        }

        .ai-shell-nav {
          display: grid;
          gap: 10px;
        }

        .ai-shell-nav-item {
          gap: 10px;
          padding: 12px 14px;
          border-radius: 14px;
          color: rgba(255, 255, 255, 0.78);
          background: rgba(255, 255, 255, 0.03);
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
          gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          background: white;
          border: 1px solid rgba(10, 88, 202, 0.12);
          white-space: nowrap;
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
          min-width: min(520px, 100%);
        }

        .ai-mobile-only {
          display: none;
        }

        .ai-mobile-flow-card {
          display: grid;
          gap: 12px;
        }

        .ai-mobile-flow-step {
          gap: 14px;
          align-items: flex-start;
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ai-mobile-flow-step span {
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

        .ai-mobile-flow-step strong {
          display: block;
          color: white;
          margin-bottom: 4px;
        }

        .ai-mobile-flow-step p {
          margin: 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.92rem;
        }

        @media (max-width: 1080px) {
          .ai-hero-layout,
          .ai-feature-grid,
          .ai-bottom-cta-inner,
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
            background: linear-gradient(180deg, #04142d 0%, #0d2145 18%, #f6f8fc 18.1%, #ffffff 100%);
          }

          .ai-hero-section {
            padding: 108px 0 56px;
          }

          .ai-hero-layout {
            gap: 24px;
          }

          .ai-hero-copy {
            text-align: left;
          }

          .ai-hero-copy h1 {
            font-size: clamp(2.5rem, 11vw, 3.35rem);
            line-height: 0.98;
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

          .ai-hero-preview,
          .ai-preview-stage {
            border-radius: 24px;
            padding: 14px;
          }

          .ai-hero-preview-grid {
            grid-template-columns: 1fr;
            margin-bottom: 12px;
          }

          .ai-hero-preview-top h3 {
            font-size: 1.2rem;
            max-width: none;
          }

          .ai-desktop-only {
            display: none;
          }

          .ai-mobile-only {
            display: block;
          }

          .ai-section-heading {
            margin-bottom: 26px;
          }

          .ai-section-heading h2 {
            font-size: 2rem;
          }

          .ai-preview-controls {
            align-items: stretch;
            margin-bottom: 14px;
          }

          .ai-preview-tabs {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr;
          }

          .ai-preview-tabs button {
            width: 100%;
            text-align: left;
          }

          .ai-arrow-controls {
            width: 100%;
            justify-content: flex-end;
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
          .ai-feature-card {
            border-radius: 18px;
            padding: 16px;
          }

          .ai-bar-chart,
          .ai-line-chart {
            height: 180px;
          }

          .ai-break-even-content {
            flex-direction: column;
            align-items: flex-start;
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
