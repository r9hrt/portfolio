import WebGLBackground from '@/components/WebGLBackground';
import BadgeCompare from '@/components/BadgeCompare';

export default function ComparePage() {
  return (
    <main>
      <WebGLBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-10 px-6">
        <p className="text-xs tracking-[0.3em] uppercase text-white/30">Glass variants</p>
        <BadgeCompare />
      </div>
    </main>
  );
}
