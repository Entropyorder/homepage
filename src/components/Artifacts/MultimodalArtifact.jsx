import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeColors } from '../../hooks/useThemeColors.js';

/* 多模态 —— 模态汇聚流
   文/图/视频/音频 4 个发光核沿螺旋轨道汇入中央奇点，
   半透明汇聚壳 + 内嵌反向旋转二十面体 + 入流粒子。全单色。 */

const SHELL_R = 2.15;

const STREAMS_PER_MODALITY = 24;
const TRAIL_SEGS = 22;

/** 单个模态核：大球 + 脉动 + 环绕轨道 + 拖尾 */
function ModalityCore({ tilt, phase, speed, size, color }) {
  const pivot = useRef();
  const coreRef = useRef();
  const trailRef = useRef();
  const trailPts = useRef(Array.from({ length: TRAIL_SEGS }, () => new THREE.Vector3()));
  const orbitR = 1.35;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    const px = orbitR * Math.cos(t);
    const py = orbitR * Math.sin(t) * 0.6;
    const pz = orbitR * Math.sin(t) * 0.8;
    if (coreRef.current) {
      coreRef.current.position.set(px, py, pz);
      const s = 1 + 0.12 * Math.sin(clock.getElapsedTime() * 2.2 + phase);
      coreRef.current.scale.setScalar(s);
    }
    const pts = trailPts.current;
    pts.pop();
    pts.unshift(new THREE.Vector3(px, py, pz));
    if (trailRef.current) {
      const flat = new Float32Array(TRAIL_SEGS * 3);
      pts.forEach((p, i) => { flat[i * 3] = p.x; flat[i * 3 + 1] = p.y; flat[i * 3 + 2] = p.z; });
      trailRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(flat, 3));
      trailRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const trailInit = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL_SEGS * 3), 3));
    return g;
  }, []);

  return (
    <group rotation={tilt} ref={pivot}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4.2} />
      </mesh>
      <line ref={trailRef} geometry={trailInit}>
        <lineBasicMaterial color={color} transparent opacity={0.32} />
      </line>
      {/* 该模态的入流粒子：从壳面螺旋飞向奇点 */}
      {Array.from({ length: STREAMS_PER_MODALITY }).map((_, i) => (
        <InflowParticle key={i} seed={i * 0.37 + phase} color={color} speed={speed} />
      ))}
    </group>
  );
}

/** 从外壳向中心螺旋内流的发光微粒 */
function InflowParticle({ seed, color, speed }) {
  const ref = useRef();
  const params = useMemo(() => ({
    theta0: seed * 12.9,
    phi0: Math.acos(2 * ((seed * 7.7) % 1) - 1),
    dur: 2.6 + (seed % 1.3),
    delay: seed % 2.4,
  }), [seed]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.getElapsedTime() * speed * 1.4 + params.delay) % params.dur) / params.dur;
    const r = SHELL_R * (1 - t * 0.94);         // 从壳面收到核心
    const theta = params.theta0 + t * 3.2;      // 螺旋
    ref.current.position.set(
      r * Math.sin(params.phi0) * Math.cos(theta),
      r * Math.cos(params.phi0),
      r * Math.sin(params.phi0) * Math.sin(theta)
    );
    ref.current.material.opacity = Math.sin(t * Math.PI) * 0.85;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

/** 中央奇点 + 辉光 + 反向旋转内嵌二十面体 */
function Singularity({ C }) {
  const glowRef = useRef();
  const icoRef = useRef();

  const icoEdges = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.55, 0);
    return new THREE.EdgesGeometry(geo);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (glowRef.current) {
      const s = 1 + 0.1 * Math.sin(t * 2.4);
      glowRef.current.scale.setScalar(s);
      glowRef.current.material.opacity = 0.1 + 0.06 * Math.sin(t * 2.4);
    }
    if (icoRef.current) {
      icoRef.current.rotation.y = -t * 0.5;
      icoRef.current.rotation.x = -t * 0.3;
    }
  });

  return (
    <group>
      <Sphere args={[0.24, 40, 40]}>
        <meshStandardMaterial
          color={C['--ink']}
          emissive={C['--ink']}
          emissiveIntensity={3.4}
          metalness={0.85}
          roughness={0.1}
        />
      </Sphere>
      <Sphere ref={glowRef} args={[0.48, 28, 28]}>
        <meshBasicMaterial color={C['--ink-2']} transparent opacity={0.12} depthWrite={false} />
      </Sphere>
      <lineSegments ref={icoRef} geometry={icoEdges}>
        <lineBasicMaterial color={C['--dim']} transparent opacity={0.55} />
      </lineSegments>
    </group>
  );
}

/** 半透明汇聚壳（菲涅尔感：基础壳 + 线框壳） */
function ConvergenceShell({ C }) {
  const wire = useMemo(() => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(SHELL_R, 1)), []);
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.04;
  });
  return (
    <group ref={ref}>
      <Sphere args={[SHELL_R, 48, 48]}>
        <meshStandardMaterial
          color={C['--dim']}
          transparent
          opacity={0.045}
          roughness={0.2}
          metalness={0.6}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
      <lineSegments geometry={wire}>
        <lineBasicMaterial color={C['--mute']} transparent opacity={0.16} />
      </lineSegments>
    </group>
  );
}

function Convergence({ C }) {
  const groupRef = useRef();
  const MODALITIES = [
    { tilt: [0.5, 0, 0.3],   phase: 0,               speed: 0.5,  size: 0.13, color: C['--ink'] },
    { tilt: [-0.4, 0.6, 0],  phase: Math.PI / 2,     speed: 0.42, size: 0.12, color: C['--ink-2'] },
    { tilt: [0.3, -0.7, 0.5],phase: Math.PI,         speed: 0.47, size: 0.12, color: C['--dim'] },
    { tilt: [-0.6, -0.3, 0], phase: Math.PI * 1.5,   speed: 0.38, size: 0.11, color: C['--ink-2'] },
  ];
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.14;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.12;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.07;
  });

  return (
    <group ref={groupRef}>
      <Singularity C={C} />
      <ConvergenceShell C={C} />
      {MODALITIES.map((m, i) => <ModalityCore key={i} {...m} />)}
    </group>
  );
}

export function MultimodalArtifact() {
  const C = useThemeColors(['--ink', '--ink-2', '--dim', '--mute']);
  return (
    <div className="w-full h-64 md:h-80">
      <Canvas
        camera={{ position: [0, 0.4, 6.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.35, alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={5} color="#9a9aa4" />
        <pointLight position={[-4, -3, 3]} intensity={4} color="#8a8a94" />
        <pointLight position={[0, -4, 2]} intensity={3} color="#6e6e78" />
        <Environment preset="night" />
        <Convergence C={C} />
      </Canvas>
    </div>
  );
}
