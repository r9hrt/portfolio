'use client';

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2  u_resolution;
uniform float u_phase;
uniform float u_pixel;

#define TAU 6.28318530718

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

const mat2 M = mat2(1.62, 1.18, -1.18, 1.62);
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = M * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 res = u_resolution;
  vec2 p = (gl_FragCoord.xy - 0.5 * res) / res.y;
  vec2 uv = gl_FragCoord.xy / res;

  p *= 2.2;

  float ang = TAU * u_phase;
  vec2  c1  = vec2(cos(ang), sin(ang));
  vec2  c2  = vec2(cos(ang + 2.094), sin(ang + 2.094));
  vec2  c3  = vec2(cos(ang - 2.094), sin(ang - 2.094));

  vec2 q;
  q.x = fbm(p + 0.32 * c1);
  q.y = fbm(p + vec2(5.2, 1.3) + 0.32 * c2);

  vec2 r;
  r.x = fbm(p + 3.0 * q + vec2(1.7, 9.2) + 0.26 * c2);
  r.y = fbm(p + 3.0 * q + vec2(8.3, 2.8) + 0.26 * c3);

  float f = fbm(p + 3.4 * r + 0.18 * c1);

  vec3 base0  = vec3(0.039, 0.055, 0.153);
  vec3 base1  = vec3(0.082, 0.039, 0.180);
  vec3 viol0  = vec3(0.176, 0.106, 0.412);
  vec3 viol1  = vec3(0.290, 0.173, 0.561);
  vec3 vein0  = vec3(0.353, 0.561, 1.000);
  vec3 vein1  = vec3(0.541, 0.435, 1.000);

  vec3 col = mix(base0, base1, smoothstep(0.25, 0.85, f));
  col = mix(col, viol0, smoothstep(0.40, 0.95, f) * 0.30);

  float lq = length(q);
  float violetMass = smoothstep(0.55, 1.10, lq);
  col = mix(col, viol0, violetMass * 0.85);
  float dense = smoothstep(0.90, 1.30, lq + 0.3 * r.x);
  col = mix(col, viol1, dense * 0.65);

  float crease = abs(r.x - r.y);
  float vein = pow(1.0 - smoothstep(0.0, 0.42, crease), 4.0);
  vein *= smoothstep(0.22, 0.80, f);
  float breathe = 0.55 + 0.45 * cos(ang + lq * 2.5);
  vein *= breathe;

  float crease2 = abs(q.x - r.y);
  float vein2 = pow(1.0 - smoothstep(0.0, 0.30, crease2), 6.0);
  vein2 *= smoothstep(0.45, 0.95, f) * (0.5 + 0.5 * cos(ang - r.x * 3.0));

  vec3 veinCol  = mix(vein0, vein1, 0.5 + 0.5 * sin(ang + r.x * 4.0));
  vec3 veinCol2 = mix(vein1, vein0, 0.5 + 0.5 * sin(ang + q.y * 3.0));
  col += veinCol  * vein  * 1.35;
  col += veinCol2 * vein2 * 0.95;

  float glow = smoothstep(0.78, 1.25, f + 0.35 * q.y);
  float glowBreath = 0.5 + 0.5 * cos(ang - q.x * 2.0);
  col += mix(vein0, viol1, 0.5) * glow * glowBreath * 0.18;

  float vig = smoothstep(1.45, 0.20, length((uv - 0.5) * vec2(res.x / res.y, 1.0) * 1.35));
  col *= mix(0.50, 1.0, vig);

  col = clamp(col, 0.0, 1.0);
  col = col * col * (3.0 - 2.0 * col);
  col = mix(col, col * col, 0.25);

  float dither = (hash(gl_FragCoord.xy + u_phase) - 0.5) / 200.0;
  col += dither;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

export default function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uPhase = gl.getUniformLocation(prog, 'u_phase');
    const uPixel = gl.getUniformLocation(prog, 'u_pixel');

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      || Math.min(window.innerWidth, window.innerHeight) < 600;
    const maxDPR = isMobile ? 1.0 : 1.5;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDPR);
      const w = Math.max(1, Math.floor(canvas!.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas!.clientHeight * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }

    window.addEventListener('resize', resize);
    resize();

    const LOOP_SECONDS = 48.0;
    const start = performance.now();
    let raf: number;
    let lastFrame = 0;

    function draw(timeMs: number) {
      resize();
      const phase = ((timeMs / 1000) % LOOP_SECONDS) / LOOP_SECONDS;
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uPhase, phase);
      gl!.uniform1f(uPixel, Math.min(window.devicePixelRatio || 1, maxDPR));
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    function render(now: number) {
      if (now - lastFrame >= 12) {
        lastFrame = now;
        draw(now - start);
      }
      raf = requestAnimationFrame(render);
    }

    draw(0);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: '#000000' }}
    />
  );
}
