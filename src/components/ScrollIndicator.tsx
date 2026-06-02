'use client';

import { useMotionValue, useTransform, animate, motion } from 'motion/react';
import { useEffect } from 'react';

const BAR_H = 64;
const DROP_H = 10;

export default function ScrollIndicator() {
  const progress = useMotionValue(-DROP_H);

  useEffect(() => {
    let cancelled = false;

    async function loop() {
      while (!cancelled) {
        await animate(progress, BAR_H + DROP_H, {
          duration: 0.9,
          ease: [0.4, 0, 0.8, 1],
        });
        progress.set(-DROP_H);
        // pause entre chaque goutte
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    loop();
    return () => { cancelled = true; };
  }, [progress]);

  // visibilité : 1 quand dans la barre, 0 quand hors limites
  const opacity = useTransform(progress, [-DROP_H, 0, BAR_H - DROP_H, BAR_H - DROP_H + 2], [0, 1, 1, 0]);

  return (
    <div className="relative mx-auto" style={{ width: 2, height: BAR_H }}>
      {/* trait de fond */}
      <div className="absolute inset-0 rounded-full bg-white/15" />

      {/* glow — non clipé */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 8,
          height: DROP_H,
          left: '50%',
          x: '-50%',
          top: progress,
          background: 'rgba(255,255,255,0.9)',
          filter: 'blur(3px)',
          opacity,
        }}
      />

      {/* trait blanc pur — clipé */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <motion.div
          className="absolute left-0 right-0 rounded-full bg-white"
          style={{ height: DROP_H, top: progress }}
        />
      </div>
    </div>
  );
}
