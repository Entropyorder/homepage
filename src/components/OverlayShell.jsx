import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Center overlay shell for detail views.
 *
 * Visual contract:
 * - Background list/home stays visible but dimmed (no black backdrop)
 * - Content layer is a centered column (max width ~900px), no window chrome
 * - Clicking the side background area (or Esc) closes the overlay
 * - Body scroll locked while overlay is open (overlay has its own scroll container)
 */
export function OverlayShell({ children, onCloseFallback }) {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const contentRef = useRef(null);

  const close = () => {
    if (backgroundLocation) {
      // Navigate back to the remembered background so browser history stays coherent
      navigate(-1);
    } else if (onCloseFallback) {
      onCloseFallback();
    } else {
      navigate('/');
    }
  };

  // Esc to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundLocation]);

  // Lock body scroll while overlay is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const onBackdropClick = (e) => {
    // Close only when the click is on the backdrop itself (side gutters), not on content
    if (e.target === e.currentTarget) close();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={onBackdropClick}
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto pt-16 pb-16 px-4 sm:px-8
        bg-black/60 backdrop-blur-md"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-2xl
          bg-eo-bg-2
          shadow-[0_24px_80px_rgba(0,0,0,0.6)]
          border border-white/10
          overflow-hidden"
      >
        {children({ close })}
      </motion.div>
    </motion.div>
  );
}

/**
 * Apply subtle dim + blur to the background page when an overlay is active.
 * Wrap the background <Routes> with this.
 */
export function BackgroundDimmer({ active, children }) {
  return (
    <motion.div
      animate={{
        filter: active ? 'brightness(0.6) blur(1.5px) saturate(0.9)' : 'none',
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      // pointer-events passthrough when inactive
      style={{ pointerEvents: active ? 'none' : 'auto' }}
    >
      {children}
    </motion.div>
  );
}
