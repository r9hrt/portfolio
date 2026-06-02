'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import WebGLBackground from '@/components/WebGLBackground';
import RollingBadge from '@/components/RollingBadge';

const DELAY_TITLE = 1.6;
const DELAY_BADGE = 2.5;
const DURATION = 0.4;

const variants = [
  {
    label: 'A — Pre-glow',
    titleInitial: { opacity: 0, filter: 'blur(8px)' },
    titleAnimate: { opacity: 1, filter: 'blur(0px)' },
    badgeInitial: { opacity: 0, filter: 'blur(8px)' },
    badgeAnimate: { opacity: 1, filter: 'blur(0px)' },
  },
  {
    label: 'B — Ghost opacity',
    titleInitial: { opacity: 0.04 },
    titleAnimate: { opacity: 1 },
    badgeInitial: { opacity: 0.04 },
    badgeAnimate: { opacity: 1 },
  },
  {
    label: 'C — Scale',
    titleInitial: { opacity: 0, scale: 0.97 },
    titleAnimate: { opacity: 1, scale: 1 },
    badgeInitial: { opacity: 0, scale: 0.97 },
    badgeAnimate: { opacity: 1, scale: 1 },
  },
  {
    label: 'D — Blur + ghost',
    titleInitial: { opacity: 0.08, filter: 'blur(12px)' },
    titleAnimate: { opacity: 1, filter: 'blur(0px)' },
    badgeInitial: { opacity: 0.08, filter: 'blur(12px)' },
    badgeAnimate: { opacity: 1, filter: 'blur(0px)' },
  },
];

function Variant({ v }: { label: string; titleInitial: object; titleAnimate: object; badgeInitial: object; badgeAnimate: object; }) {
  const [key, setKey] = useState(0);
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 h-64 border border-white/10 rounded-xl px-6 cursor-pointer" onClick={() => setKey(k => k + 1)}>
      <span className="absolute top-3 left-4 text-xs text-white/30 tracking-wide">{v.label}</span>
      <span className="absolute top-3 right-4 text-xs text-white/20">↺ replay</span>
      <motion.p
        key={`title-${key}`}
        className="font-light text-white text-3xl whitespace-nowrap"
        initial={v.titleInitial as any}
        animate={v.titleAnimate as any}
        transition={{ duration: DURATION, ease: 'easeOut', delay: DELAY_TITLE }}
      >
        Julien Rion
      </motion.p>
      <motion.div
        key={`badge-${key}`}
        initial={v.badgeInitial as any}
        animate={v.badgeAnimate as any}
        transition={{ duration: DURATION, ease: 'easeOut', delay: DELAY_BADGE }}
      >
        <RollingBadge />
      </motion.div>
    </div>
  );
}

export default function CompareAnim() {
  return (
    <main>
      <WebGLBackground />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 gap-6">
        <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-2">Anim foreshadow — cliquer pour rejouer</p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
          {variants.map((v) => (
            <Variant key={v.label} v={v} {...v} />
          ))}
        </div>
      </div>
    </main>
  );
}
