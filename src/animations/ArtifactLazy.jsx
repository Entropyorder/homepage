import { useRef } from 'react';
import { useInView } from 'framer-motion';

export function ArtifactLazy({ children, width = '100%', height = 320 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-100px' });

  return (
    <div ref={ref} style={{ width, minHeight: height }}>
      {inView ? children : <div style={{ width, height }} />}
    </div>
  );
}
