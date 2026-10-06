import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeColors } from '../../hooks/useThemeColors.js';

/* 代码能力 —— 终端窗口悬浮 + 字符雨下坠 + 环绕代码立方体
   全单色（白灰），风格与其他 artifact 一致 */

const CHAR_COLS = 26;
const CHAR_DROPS = 60;

// ── 4×6 像素字形（拼出终端里的伪代码字符） ──
const FONT = {
  ' ': ['0000','0000','0000','0000','0000','0000'],
  '.': ['0000','0000','0000','0000','0110','0110'],
  ':': ['0000','0110','0110','0000','0110','0110'],
  '>': ['1000','0100','0010','0001','0010','0100'],
  '(': ['0010','0100','1000','1000','1000','0100'],
  ')': ['0100','0010','0001','0001','0001','0010'],
  '+': ['0000','0100','1110','0100','0000','0000'],
  '=': ['0000','1110','0000','1110','0000','0000'],
  '0': ['0110','1001','1011','1101','1001','0110'],
  '1': ['0100','1100','0100','0100','0100','1110'],
  '/': ['0001','0010','0010','0100','0100','1000'],
  'a': ['0000','0110','0001','0111','1001','0111'],
  'c': ['0000','0111','1000','1000','1000','0111'],
  'd': ['0001','0001','0111','1001','1001','0111'],
  'e': ['0000','0110','1001','1111','1000','0111'],
  'f': ['0011','0100','1110','0100','0100','0100'],
  'g': ['0000','0111','1001','0111','0001','1110'],
  'i': ['0100','0000','1100','0100','0100','1110'],
  'l': ['1100','0100','0100','0100','0100','1110'],
  'n': ['0000','1110','1001','1001','1001','1001'],
  'o': ['0000','0110','1001','1001','1001','0110'],
  'p': ['0000','1110','1001','1110','1000','1000'],
  'r': ['0000','1011','1100','1000','1000','1000'],
  's': ['0000','0111','1000','0110','0001','1110'],
  't': ['0100','0100','1110','0100','0100','0011'],
  'u': ['0000','1001','1001','1001','1001','0111'],
  'v': ['0000','1001','1001','1001','0110','0110'],
  'w': ['0000','1001','1001','1011','1101','0110'],
  'x': ['0000','1001','0110','0110','1001','1001'],
  'y': ['0000','1001','1001','0111','0001','1110'],
};

const GLYPH_W = 4, GLYPH_H = 6, GLYPH_GAP = 1;
const CELL = 0.0195;

// 终端文本（注意 FONT 覆盖的字符集，最长 17 字符防溢出）
const TERM_LINES = [
  'def solve(p):',
  '  plan = reason(p)',
  '  code = gen(plan)',
  '  assert ok(code)',
  '',
  '>>> run(sci)',
  '  tests: 1k/1k',
  '  reward: +1.0',
];

/** 把一段文本栅格化成发光小方块的 instancedMesh */
function GlyphText({ lines, origin, C }) {
  const { mesh, count } = useMemo(() => {
    const cells = [];
    lines.forEach((line, row) => {
      [...line].forEach((ch, col) => {
        const g = FONT[ch] || FONT[' '];
        g.forEach((bits, gy) => {
          [...bits].forEach((b, gx) => {
            if (b === '1') {
              cells.push([
                origin.x + col * (GLYPH_W + GLYPH_GAP) * CELL + gx * CELL,
                origin.y - row * (GLYPH_H + 3) * CELL - gy * CELL,
                origin.z,
                row >= 5, // 输出区更亮
              ]);
            }
          });
        });
      });
    });

    const geo = new THREE.BoxGeometry(CELL * 0.82, CELL * 0.82, 0.004);
    const mat = new THREE.MeshStandardMaterial({
      color: C['--ink-2'], emissive: C['--ink'], emissiveIntensity: 1.4, transparent: true, opacity: 0.92,
    });
    const m = new THREE.InstancedMesh(geo, mat, cells.length);
    const dummy = new THREE.Object3D();
    const cBright = new THREE.Color(C['--ink']);
    const cDim = new THREE.Color(C['--dim']);
    cells.forEach(([x, y, z, bright], i) => {
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, bright ? cBright : cDim);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    return { mesh: m, count: cells.length };
  }, [lines, origin.x, origin.y, origin.z, C]);

  return <primitive object={mesh} />;
}

// 环绕窗口循环的数据包（recv → compute → send）—— 在窗口后方绕行
function DataLoop({ C }) {
  const packets = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ offset: (i / 6) * Math.PI * 2, speed: 0.5 + (i % 3) * 0.15 })),
    []
  );
  const refs = useRef([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    packets.forEach((p, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const a = t * p.speed + p.offset;
      // 深度环面（绕窗口后方，z 始终为负）
      const R = 2.0;
      mesh.position.set(
        Math.cos(a) * R,
        Math.sin(a * 1.3 + p.offset) * 0.7,
        -0.9 + Math.sin(a) * 0.5  // z ∈ [-1.4, -0.4]，始终在窗口(0.05)后
      );
      mesh.material.opacity = 0.45 + 0.35 * Math.sin(a * 3);
    });
  });
  return (
    <group>
      {packets.map((_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color={C['--ink-2']} transparent opacity={0.6} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// 字符雨平面上的点阵（下坠的发光方块）—— 避开窗口中央，只落两侧
function CharRain({ C }) {
  const ref = useRef();
  const drops = useMemo(
    () =>
      Array.from({ length: CHAR_DROPS }, (_, i) => {
        // 一半在左、一半在右，中间留出窗口区域
        const side = i % 2 === 0 ? -1 : 1;
        const xBase = 1.72 + ((i * 7.3) % 8) * 0.13; // 距中心 1.72 ~ 2.7，避开窗口(±1.35)
        return {
          x: side * xBase,
          y0: 2.2 + ((i * 1.37) % 3),
          speed: 0.35 + ((i * 11) % 7) * 0.09,
          size: 0.02 + ((i * 5) % 3) * 0.008,
          opacity: 0.25 + ((i * 13) % 5) * 0.12,
        };
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    drops.forEach((d, i) => {
      const span = 4.6;
      const y = ((d.y0 - t * d.speed) % span + span) % span - 2.2;
      dummy.position.set(d.x, y, -0.7);
      dummy.scale.setScalar(d.size);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[null, null, CHAR_DROPS]}>
      <boxGeometry args={[1, 2.2, 1]} />
      <meshBasicMaterial color={C['--dim']} transparent opacity={0.45} />
    </instancedMesh>
  );
}

// 环绕的代码立方体 —— 始终在窗口后方（z<0）环绕
function OrbitCube({ radius, size, speed, offset, wobble, C }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + offset;
      ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.7 + offset) * wobble,
      -1.1 + Math.sin(t) * 0.6   // z ∈ [-1.7, -0.5]，不会穿到窗口前
    );
    ref.current.rotation.set(t * 0.5, t * 0.8, 0);
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={C['--ink-2']}
        emissive={C['--dim']}
        emissiveIntensity={1.6}
        metalness={0.7}
        roughness={0.25}
      />
    </mesh>
  );
}

// 终端窗口（悬浮、微倾斜、呼吸浮动 + 外框辉光 + 字形代码）
function TerminalWindow({ C }) {
  const group = useRef();
  const haloRef = useRef();

  const { W, H } = { W: 2.6, H: 1.7 };

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 0.6) * 0.07;
    group.current.rotation.y = -0.16 + Math.sin(t * 0.3) * 0.03;
    group.current.rotation.x = Math.sin(t * 0.42) * 0.02;
    if (haloRef.current) {
      haloRef.current.material.opacity = 0.06 + 0.04 * Math.sin(t * 1.7);
    }
  });

  return (
    <group ref={group}>
      {/* 外框辉光 */}
      <mesh ref={haloRef} position={[0, -0.05, -0.02]}>
        <boxGeometry args={[W + 0.34, H + 0.58, 0.02]} />
        <meshBasicMaterial color={C['--dim']} transparent opacity={0.08} depthWrite={false} />
      </mesh>

      {/* 窗口外框 */}
      <mesh>
        <boxGeometry args={[W + 0.1, H + 0.34, 0.08]} />
        <meshStandardMaterial
          color={C['--bg-3']}
          metalness={0.85}
          roughness={0.3}
          emissive={C['--mute']}
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* 屏幕 */}
      <mesh position={[0, -0.12, 0.045]}>
        <boxGeometry args={[W, H, 0.01]} />
        <meshStandardMaterial color={C['--bg']} emissive={C['--bg']} roughness={0.9} />
      </mesh>
      {/* 标题栏三点 */}
      {[-0.09, 0, 0.09].map((dx, i) => (
        <mesh key={i} position={[-(W / 2) + 0.12 + dx + 0.09, H / 2 + 0.1, 0.05]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshStandardMaterial color={C['--dim']} emissive={C['--dim']} emissiveIntensity={1.2} />
        </mesh>
      ))}

      {/* 像素字形代码 */}
      <GlyphText
        C={C}
        lines={TERM_LINES}
        origin={{ x: -(W / 2) + 0.16, y: H / 2 - 0.22 - 0.12, z: 0.058 }}
      />

      {/* 光标闪烁 —— 最后一行 reward 之后 */}
      <CursorBlink
        C={C}
        x={-(W / 2) + 0.16 + 14 * (GLYPH_W + GLYPH_GAP) * CELL}
        y={H / 2 - 0.34 - 7 * (GLYPH_H + 3) * CELL - GLYPH_H * CELL / 2}
      />
    </group>
  );
}

function CursorBlink({ x, y, C }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.material.opacity = Math.floor(clock.getElapsedTime() * 1.6) % 2 === 0 ? 0.95 : 0.1;
  });
  return (
    <mesh ref={ref} position={[x, y, 0.055]}>
      <boxGeometry args={[0.05, 0.09, 0.005]} />
      <meshStandardMaterial
        color={C['--ink']}
        emissive={C['--ink']}
        emissiveIntensity={3}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

function Scene({ C }) {
  const group = useRef();
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.16) * 0.1;
  });

  const cubes = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        radius: 2.75 + (i % 2) * 0.55,
        size: 0.055 + (i % 3) * 0.02,
        speed: 0.25 + (i % 4) * 0.08,
        offset: (i / 5) * Math.PI * 2,
        wobble: 0.75 + (i % 3) * 0.3,
      })),
    []
  );

  return (
    <group ref={group}>
      <TerminalWindow C={C} />
      <CharRain C={C} />
      <DataLoop C={C} />
      {cubes.map((c, i) => (
        <OrbitCube key={i} {...c} C={C} />
      ))}
    </group>
  );
}

export function CodeArtifact() {
  const C = useThemeColors(['--ink', '--ink-2', '--dim', '--mute', '--bg', '--bg-3']);
  return (
    <div className="w-full h-64 md:h-80">
      <Canvas
        camera={{ position: [0, 0.4, 6.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.4, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]} intensity={5} color="#9a9aa4" />
        <pointLight position={[-3, -3, 3]} intensity={4} color="#8a8a94" />
        <pointLight position={[0, 3, 2]} intensity={2.5} color="#6e6e78" />
        <Environment preset="city" />
        <Scene C={C} />
      </Canvas>
    </div>
  );
}
