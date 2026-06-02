'use client';

import { motion } from 'motion/react';
import RollingBadge from './RollingBadge';
import ScrollIndicator from './ScrollIndicator';

export default function Hero({ revealed = false }: { revealed?: boolean }) {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.h1
        className="font-light tracking-tight text-white"
        style={{ fontSize: '60px' }}
        initial={{ opacity: 0.08, filter: 'blur(12px)', y: 24 }}
        animate={revealed ? { opacity: 1, filter: 'blur(0px)', y: 0 } : { opacity: 0.08, filter: 'blur(12px)', y: 24 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 1.6 }}
      >
        Julien Rion
      </motion.h1>

      <motion.div
        className="mt-4"
        initial={{ opacity: 0.08, filter: 'blur(12px)', y: 12 }}
        animate={revealed ? { opacity: 1, filter: 'blur(0px)', y: 0 } : { opacity: 0.08, filter: 'blur(12px)', y: 12 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 2.5 }}
      >
        <RollingBadge />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 2.0 }}
      >
        <ScrollIndicator />
      </motion.div>
    </section>
  );
}
