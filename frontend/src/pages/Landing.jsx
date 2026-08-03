import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Private by default',
    description:
      'Every note is tied to your account. Sign up once and your notes stay yours, no one else can see them.',
  },
  {
    title: 'Rich text editing',
    description:
      'Format your notes with bold, italics, and lists — write the way you actually think, not just plain text.',
  },
  {
    title: 'Fast, clean dashboard',
    description:
      'See every note at a glance, sorted by what you touched most recently. No clutter, no distractions.',
  },
  {
    title: 'Secure authentication',
    description:
      'Passwords are hashed, sessions are token-based, and every request is verified before it touches your data.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Sign up',
    description: 'Create an account in seconds — just your name, email, and a password.',
  },
  {
    num: '02',
    title: 'Write',
    description: 'Open the editor and start writing. Format as you go with the built-in toolbar.',
  },
  {
    num: '03',
    title: 'Stay organized',
    description: 'Every note lives on your dashboard, ready whenever you need it.',
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-badge">A simple place for your notes</div>
          <h1 className="hero-title">
            Write it down with <span className="hero-highlight">Scribe</span>
          </h1>
          <p className="hero-subtitle">
            A clean, private notes app. Sign up, start writing, and everything
            stays organized and just yours.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get started free
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Everything you need, nothing you don't</h2>
            <p>A notes app built to stay out of your way.</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card card">
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-header">
            <h2>Get started in three steps</h2>
          </div>
          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.num} className="step">
                <div className="step-number">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container cta-inner">
          <h2>Ready to start writing?</h2>
          <p>It's free, it's fast, and your notes stay private.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Create your account
          </Link>
        </div>
      </section>
    </div>
  );
}