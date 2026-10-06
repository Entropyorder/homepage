import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Line, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeColors } from '../../hooks/useThemeColors.js';

/* 科学推理 —— 原子结构
   核心泛光、电子拖尾、二十面体轨道点阵、外围微尘环。全单色。 */

const ORBIT_RADIUS = 1.55;
const TRAIL_SEGS = 28;

/** 核心 + 脉动双层辉光 + 自旋点云 */
function Nucleus({ C }) {
  const glowRef = useRef();
  const cloudRef = useRef();

  const positions = useMemo(() => {
    const count = 110;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.3 + Math.random() * 0.24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (glowRef.current) {
      const s = 1 + 0.08 * Math.sin(t * 1.8);
      glowRef.current.scale.setScalar(s);
      glowRef.current.material.opacity = 0.08 + 0.05 * Math.sin(t * 1.8);
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.5;
      cloudRef.current.rotation.x = t * 0.22;
      cloudRef.current.material.opacity = 0.5 + 0.28 * Math.sin(t * 1.4);
    }
  });

  return (
    <group>
      {/* 主核 */}
      <Sphere args={[0.3, 48, 48]}>
        <meshStandardMaterial
          color={C['--ink']}
          emissive={C['--ink']}
          emissiveIntensity={2.6}
          metalness={0.9}
          roughness={0.08}
        />
      </Sphere>
      {/* 脉动辉光壳 */}
      <Sphere ref={glowRef} args={[0.55, 32, 32]}>
        <meshBasicMaterial color={C['--ink-2']} transparent opacity={0.1} depthWrite={false} />
      </Sphere>
      {/* 自旋点云 */}
      <points ref={cloudRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={C['--ink-2']} size={0.05} transparent opacity={0.65} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

/** 单条轨道：发光环 + 电子 + 渐隐拖尾 */
function Orbit({ tiltX, tiltY, speed, color }) {
  const electronRef = useRef();
  const trailRef = useRef();
  const trailPts = useRef(Array.from({ length: TRAIL_SEGS }, () => new THREE.Vector3()));

  useFrame(({ clock }) => {
    const angle = clock.getElapsedTime() * speed;
    const px = ORBIT_RADIUS * Math.cos(angle);
    const py = ORBIT_RADIUS * Math.sin(angle);
    if (electronRef.current) electronRef.current.position.set(px, py, 0);

    // 拖尾：头最新，尾最旧
    const pts = trailPts.current;
    pts.pop();
    pts.unshift(new THREE.Vector3(px, py, 0));
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
    <group rotation={[tiltX, tiltY, 0]}>
      {/* 轨道环 */}
      <Torus args={[ORBIT_RADIUS, 0.009, 12, 200]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          metalness={0.65}
          roughness={0.12}
          transparent
          opacity={0.5}
        />
      </Torus>
      {/* 电子 */}
      <mesh ref={electronRef}>
        <sphereGeometry args={[0.085, 20, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
      </mesh>
      {/* 拖尾 */}
      <line ref={trailRef} geometry={trailInit}>
        <lineBasicMaterial color={color} transparent opacity={0.28} />
      </line>
    </group>
  );
}

/** 环绕原子的二十面体点阵（缓慢整体旋转） */
function IcosaLattice({ C }) {
  const ref = useRef();
  const verts = useMemo(() => new THREE.IcosahedronGeometry(2.35, 0).attributes.position, []);
  const count = verts.count;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.06;
    ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.12) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={verts.array} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={C['--dim']} size={0.06} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** 外围微尘环（近乎平躺的盘） */
function DustRing({ C }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const count = 260;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 0.9;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3]     = r * Math.cos(a);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.16;
      pos[i * 3 + 2] = r * Math.sin(a);
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = -clock.getElapsedTime() * 0.045;
  });

  return (
    <points ref={ref} rotation={[0.28, 0, 0.1]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={C['--mute']} size={0.035} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Atom({ C }) {
  const groupRef = useRef();
  const ORBITS = [
    { tiltX: Math.PI / 2, tiltY: 0,               speed: 1.05, color: C['--ink'] },
    { tiltX: Math.PI / 2, tiltY: Math.PI * 2 / 3, speed: 0.8,  color: C['--dim'] },
    { tiltX: Math.PI / 2, tiltY: Math.PI * 4 / 3, speed: 0.92, color: C['--ink-2'] },
  ];
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.16;
    groupRef.current.rotation.x = Math.sin(t * 0.22) * 0.14;
    groupRef.current.position.y = Math.sin(t * 0.55) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <Nucleus C={C} />
      {ORBITS.map((o, i) => <Orbit key={i} {...o} />)}
      <IcosaLattice C={C} />
      <DustRing C={C} />
    </group>
  );
}

export function ExpertArtifact() {
  const C = useThemeColors(['--ink', '--ink-2', '--dim', '--mute']);
  return (
    <div className="w-full h-64 md:h-80">
      <Canvas
        camera={{ position: [0, 0.5, 5.6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.25, alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[4, 4, 4]} intensity={4} color="#9a9aa4" />
        <pointLight position={[-4, -3, 3]} intensity={3} color="#8a8a94" />
        <pointLight position={[0, -3, 2]} intensity={2} color="#6e6e78" />
        <Environment preset="city" />
        <Atom C={C} />
      </Canvas>
    </div>
  );
}
