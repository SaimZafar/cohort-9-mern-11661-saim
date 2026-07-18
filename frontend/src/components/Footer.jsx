export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="navbar-logo-mark">S</span>
          <span>Scribe</span>
        </div>
        <p className="footer-text">
          © {year} Scribe. Built by{' '}
          <a
            href="https://github.com/SaimZafar"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Saim Zafar
          </a>
        </p>
      </div>
    </footer>
  );
}