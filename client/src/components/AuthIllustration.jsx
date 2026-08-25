const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PROGRESS = 0.8;

export function AuthIllustration() {
  return (
    <div className="auth-illustration">
      <div className="auth-illustration-art">
        <svg viewBox="0 0 320 340" role="img" aria-label="Illustration of a person meditating, wearing a shirt with a first aid cross">
          <circle cx="160" cy="112" r="80" fill="none" stroke="var(--green)" strokeWidth="2" strokeDasharray="1 11" opacity="0.7" />

          <path d="M96,52 q-18,-8 -10,-28" stroke="var(--green-dark)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M224,52 q18,-8 10,-28" stroke="var(--green-dark)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="256" cy="54" r="3" fill="var(--green-dark)" opacity="0.7" />
          <circle cx="60" cy="130" r="3" fill="var(--green-dark)" opacity="0.7" />

          <path d="M118,192 Q68,184 66,128" stroke="#14110f" strokeWidth="22" fill="none" strokeLinecap="round" />
          <path d="M118,192 Q68,184 66,128" stroke="#f3c9a4" strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d="M202,192 Q252,184 254,128" stroke="#14110f" strokeWidth="22" fill="none" strokeLinecap="round" />
          <path d="M202,192 Q252,184 254,128" stroke="#f3c9a4" strokeWidth="16" fill="none" strokeLinecap="round" />

          <circle cx="66" cy="124" r="15" fill="#f3c9a4" stroke="#14110f" strokeWidth="3" />
          <circle cx="254" cy="124" r="15" fill="#f3c9a4" stroke="#14110f" strokeWidth="3" />
          <path d="M58,111 q-3,-7 -8,-10" stroke="#14110f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M68,107 q0,-8 -2,-13" stroke="#14110f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M262,111 q3,-7 8,-10" stroke="#14110f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M252,107 q0,-8 2,-13" stroke="#14110f" strokeWidth="2" fill="none" strokeLinecap="round" />

          <rect x="90" y="250" width="140" height="62" rx="30" fill="#f7f2e7" stroke="#14110f" strokeWidth="4" />
          <path d="M120,255 Q160,288 200,255" stroke="#14110f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="95" cy="276" r="10" fill="#f3c9a4" stroke="#14110f" strokeWidth="3" />
          <circle cx="225" cy="276" r="10" fill="#f3c9a4" stroke="#14110f" strokeWidth="3" />

          <rect x="100" y="156" width="120" height="112" rx="50" fill="var(--green)" stroke="#14110f" strokeWidth="4" />

          <circle cx="160" cy="205" r="18" fill="#fff" stroke="#14110f" strokeWidth="3" />
          <rect x="156" y="194" width="8" height="22" rx="3" fill="var(--red)" />
          <rect x="149" y="201" width="22" height="8" rx="3" fill="var(--red)" />

          <rect x="150" y="144" width="20" height="16" fill="#f3c9a4" stroke="#14110f" strokeWidth="3" />

          <circle cx="160" cy="110" r="36" fill="#f3c9a4" stroke="#14110f" strokeWidth="4" />
          <path d="M124,108 A36,36 0 0 1 196,108 Q196,80 160,80 Q124,80 124,108 Z" fill="#2a2118" stroke="#14110f" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="142" cy="120" r="5" fill="#f2a48c" opacity="0.5" />
          <circle cx="178" cy="120" r="5" fill="#f2a48c" opacity="0.5" />
          <path d="M146,112 q5,5 10,0" stroke="#14110f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M164,112 q5,5 10,0" stroke="#14110f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M148,126 q12,10 24,0" stroke="#14110f" strokeWidth="3" fill="none" strokeLinecap="round" />

          <circle cx="36" cy="54" r="26" fill="#fff" stroke="#14110f" strokeWidth="3" />
          <rect x="32" y="44" width="8" height="20" rx="2" fill="var(--red)" />
          <rect x="26" y="50" width="20" height="8" rx="2" fill="var(--red)" />

          <circle cx="286" cy="196" r="26" fill="#fff" stroke="#14110f" strokeWidth="3" />
          <circle cx="280" cy="189" r="8" fill="var(--green-dark)" />
          <circle cx="292" cy="189" r="8" fill="var(--green-dark)" />
          <rect x="277" y="186" width="16" height="16" fill="var(--green-dark)" transform="rotate(45 286 194)" />
        </svg>

        <div className="auth-card">
          <div className="auth-card-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <rect x="9" y="3" width="6" height="18" rx="2" fill="var(--red)" />
              <rect x="3" y="9" width="18" height="6" rx="2" fill="var(--red)" />
            </svg>
          </div>
          <div className="auth-card-body">
            <div className="auth-card-title">CPR Basics</div>
            <div className="auth-card-sub">6 short lessons</div>
          </div>
          <div className="auth-card-ring">
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r={RADIUS} fill="none" stroke="var(--border)" strokeWidth="4" />
              <circle
                cx="20"
                cy="20"
                r={RADIUS}
                fill="none"
                stroke="var(--green-dark)"
                strokeWidth="4"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - PROGRESS)}
                strokeLinecap="round"
                transform="rotate(-90 20 20)"
              />
              <text x="20" y="23" textAnchor="middle" fontSize="9" fill="var(--text-h)">
                80%
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div className="auth-dots">
        <span className="active" />
        <span />
        <span />
      </div>

      <div className="auth-caption">
        <h2>Learn skills that save lives</h2>
        <p>
          Practical <strong>first aid</strong> training paired with tools to help you stay calm when it matters most.
        </p>
      </div>
    </div>
  );
}
