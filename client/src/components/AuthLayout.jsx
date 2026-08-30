import "../pages/auth.css";

export function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <section className="auth-page">
      <span className="auth-bg-icon material-symbols-outlined fill" aria-hidden="true">
        medical_services
      </span>

      <div className="auth-content">
        <div className="auth-icon-badge">
          <span className="material-symbols-outlined fill" aria-hidden="true">
            health_and_safety
          </span>
        </div>

        {eyebrow && <span className="auth-eyebrow">{eyebrow}</span>}
        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}

        <div className="auth-card">{children}</div>
      </div>
    </section>
  );
}
