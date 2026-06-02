'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const LABELS = ['Design Engineer', 'Product Builder', 'UX/UI Specialist'];

function RollingText({ color = 'rgba(255,255,255,0.85)' }: { color?: string }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % LABELS.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={index}
        className="block text-center text-base font-light whitespace-nowrap"
        style={{ color }}
        initial={{ y: 16, opacity: 0, filter: 'blur(4px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        exit={{ y: -16, opacity: 0, filter: 'blur(4px)' }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {LABELS[index]}
      </motion.span>
    </AnimatePresence>
  );
}

const variants = [
  {
    label: 'C — original',
    style: {
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      background: 'rgba(20,10,60,0.35)',
      border: '1px solid rgba(255,255,255,0.22)',
      boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.2), 0 12px 40px rgba(0,0,0,0.4)',
    },
  },
  {
    label: 'C1 — + dense',
    style: {
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'rgba(20,10,60,0.55)',
      border: '1px solid rgba(255,255,255,0.18)',
      boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.3), 0 16px 48px rgba(0,0,0,0.5)',
    },
  },
  {
    label: 'C2 — violet vif',
    style: {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      background: 'rgba(60,20,120,0.4)',
      border: '1px solid rgba(160,120,255,0.3)',
      boxShadow: 'inset 0 1px 0 rgba(200,170,255,0.2), 0 8px 32px rgba(0,0,0,0.4)',
    },
  },
  {
    label: 'D — original',
    style: {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid rgba(255,255,255,0.14)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 16px rgba(0,0,0,0.5)',
    },
  },
  {
    label: 'D1 — + opaque',
    style: {
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'rgba(0,0,0,0.55)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4), 0 8px 40px rgba(0,0,0,0.6)',
    },
  },
  {
    label: 'D2 — bordure fine',
    style: {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      background: 'rgba(8,6,20,0.5)',
      border: '0.5px solid rgba(255,255,255,0.22)',
      boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.18), 0 4px 24px rgba(0,0,0,0.5)',
    },
  },
];

export default function BadgeCompare() {
  return (
    <div className="flex flex-col items-center gap-6">
      {variants.map((v) => (
        <div key={v.label} className="flex items-center gap-5">
          <span className="w-24 text-right text-xs text-white/35 tracking-wide">{v.label}</span>
          <div
            className="relative overflow-hidden rounded-full px-7 py-3"
            style={{ minWidth: '230px', ...v.style }}
          >
            {/* top shine */}
            <div
              className="pointer-events-none absolute inset-x-4 top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
            />
            <RollingText color={'textColor' in v ? (v as { textColor: string }).textColor : undefined} />
          </div>
        </div>
      ))}
    </div>
  );
}
