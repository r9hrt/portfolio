'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Loader from './Loader';
import WebGLBackground from './WebGLBackground';
import Hero from './Hero';

export default function PageShell() {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <Loader onComplete={() => setRevealed(true)} />

      {/* WebGL pop : scale + opacity */}
      <motion.div
        className="fixed inset-0"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 }}
        transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <WebGLBackground />
      </motion.div>

      <Hero revealed={revealed} />
    </>
  );
}
