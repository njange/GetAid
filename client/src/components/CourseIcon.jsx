const STROKE = "#14110f";

function CprIcon() {
  return (
    <>
      <path
        d="M6,21 C6,21 3,17.5 3,14.2 C3,11.8 4.8,10 7,10 C8.4,10 9.6,10.8 10.5,12 C11.4,10.8 12.6,10 14,10 C16.2,10 18,11.8 18,14.2 C18,17.5 15,21 15,21"
        fill="var(--green)"
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M2,15 L6,15 L8,11 L10.5,18 L12.5,13 L14,15 L19,15"
        fill="none"
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function ChokingIcon() {
  return (
    <>
      <circle cx="10.5" cy="7" r="3.4" fill="#f3c9a4" stroke={STROKE} strokeWidth="1.6" />
      <path
        d="M6,20 C6,15.5 8,13 10.5,13 C13,13 15,15.5 15,20"
        fill="var(--green)"
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M15,12 C17,12.5 18.5,14 18.5,16" fill="none" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M18.5,16 l2,-1 M18.5,16 l0.5,2.2" fill="none" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" />
    </>
  );
}

function BurnsIcon() {
  return (
    <path
      d="M11,2 C8,6 6,8.5 6,12 C6,16.5 9,19 12,19 C15.5,19 18,16.2 18,12.8 C18,10.5 16.5,9 15.5,8.2 C15.7,10 14.8,11.2 13.6,11.2 C12.4,11.2 12,10.2 12.4,9 C12.9,7.5 12.4,4.5 11,2 Z"
      fill="var(--red)"
      stroke={STROKE}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  );
}

function WoundsIcon() {
  return (
    <>
      <rect x="5" y="9" width="12" height="6" rx="3" fill="#f7f2e7" stroke={STROKE} strokeWidth="1.6" />
      <path d="M9,9 L9,15 M13,9 L13,15" stroke={STROKE} strokeWidth="1.3" strokeDasharray="1.6 1.6" />
      <path d="M7,12 L15,12" stroke="var(--red)" strokeWidth="1.4" strokeLinecap="round" />
    </>
  );
}

function DrowningIcon() {
  return (
    <>
      <circle cx="10.5" cy="6" r="2.6" fill="#f3c9a4" stroke={STROKE} strokeWidth="1.5" />
      <path d="M7,15 C7,11.5 8.5,9.5 10.5,9.5 C12.5,9.5 14,11.5 14,15" fill="var(--green)" stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2,17 C3,15.8 4.2,15.8 5.2,17 C6.2,18.2 7.4,18.2 8.4,17 C9.4,15.8 10.6,15.8 11.6,17 C12.6,18.2 13.8,18.2 14.8,17 C15.8,15.8 17,15.8 18,17" fill="none" stroke="var(--green-dark)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2,20.5 C3,19.3 4.2,19.3 5.2,20.5 C6.2,21.7 7.4,21.7 8.4,20.5 C9.4,19.3 10.6,19.3 11.6,20.5 C12.6,21.7 13.8,21.7 14.8,20.5 C15.8,19.3 17,19.3 18,20.5" fill="none" stroke="var(--green-dark)" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </>
  );
}

function FracturesIcon() {
  return (
    <path
      d="M4,17 L8,13 L6.5,11.5 L9,9 L10.5,10.5 L13,8 L11.5,6.5 L14,4 M4,17 C3,18 3,19.5 4,20.2 C5,21 6.5,20.8 7.3,19.8 M14,4 C15,3 16.5,3 17.3,4 C18.1,5 17.8,6.5 16.8,7.3"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

const ICONS = {
  cpr: CprIcon,
  choking: ChokingIcon,
  burns: BurnsIcon,
  wounds: WoundsIcon,
  drowning: DrowningIcon,
  fractures: FracturesIcon,
};

export function CourseIcon({ name, size = 22 }) {
  const IconComponent = ICONS[name];
  if (!IconComponent) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true">
      <IconComponent />
    </svg>
  );
}
