'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface Props {
  onComplete: () => void;
}

export default function Loader({ onComplete }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      onComplete();   // WebGL commence à fade in
      setVisible(false); // loader commence à fade out — en simultané
    }, 1600);
    return () => clearTimeout(id);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* barre de progression */}
          <div className="w-72 overflow-hidden rounded-full" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              className="h-full rounded-full bg-white/60"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
