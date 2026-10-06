import { Hero } from '../components/Hero.jsx';
import { ExpertDataValue } from '../components/ExpertDataValue.jsx';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function WaveDivider() {
  return (
    <div
      className="relative z-10 overflow-hidden leading-none bg-eo-bg"
      style={{ height: 72, marginTop: -1, marginBottom: -1 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
        <path
          d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1380,18 1440,36 L1440,72 L0,72 Z"
          fill="var(--bg)"
        />
        <path
          d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1380,18 1440,36"
          fill="none"
          stroke="rgb(var(--eo-w) / 0.08)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const tryScroll = () => {
      const el = document.getElementById(target);
      if (el) {
        const navbarH = 64;
        const y = el.getBoundingClientRect().top + window.scrollY - navbarH;
        window.scrollTo({ top: y, behavior: 'smooth' });
        navigate(location.pathname, { replace: true, state: {} });
      }
    };
    const timer = setTimeout(tryScroll, 80);
    return () => clearTimeout(timer);
  }, [location.state, location.pathname, navigate]);

  return (
    <main>
      <Hero />
      <WaveDivider />
      <ExpertDataValue />
    </main>
  );
}
