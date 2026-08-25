import { AuthIllustration } from "./AuthIllustration";
import "../pages/auth.css";

export function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <section className="auth-page">
      <div className="auth-panel-left">
        <div className="auth-panel-left-inner">
          {eyebrow && <span className="auth-eyebrow">{eyebrow}</span>}
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
        </div>
      </div>
      <div className="auth-panel-right">
        <AuthIllustration />
      </div>
    </section>
  );
}
