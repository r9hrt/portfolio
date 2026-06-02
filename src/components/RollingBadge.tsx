'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const LABELS = ['Design Engineer', 'Product Builder', 'UX/UI Specialist'];

export default function RollingBadge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % LABELS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative overflow-hidden rounded-full px-7 py-3"
      style={{
        minWidth: '230px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        background: 'rgba(8,6,20,0.5)',
        border: '0.5px solid rgba(255,255,255,0.22)',
        boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.18), 0 4px 24px rgba(0,0,0,0.5)',
      }}
    >
      {/* top shine */}
      <div
        className="pointer-events-none absolute inset-x-4 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
      />

      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          className="block text-center font-light whitespace-nowrap"
          style={{ fontSize: '24px', color: 'rgba(255,255,255,0.85)' }}
          initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          {LABELS[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
