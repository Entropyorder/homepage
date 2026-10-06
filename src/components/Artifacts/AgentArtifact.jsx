import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeColors } from '../../hooks/useThemeColors.js';

const SPHERE_RADIUS = 1.8;
const N_NODES = 28;
const CONNECT_THRESHOLD = SPHERE_RADIUS * 1.12;

// Hub: nodes with degree >= this get a larger/brighter treatment
const HUB_DEGREE = 4;
const COLOR_KEYS = ['--ink', '--ink-2', '--dim'];

function buildNetwork(C) {
  const NODE_COLORS = [C['--ink'], C['--ink-2'], C['--dim'], C['--ink'], C['--ink-2']];
  const phi = Math.PI * (3 - Math.sqrt(5));
  const nodes = Array.from({ length: N_NODES }, (_, i) => {
    const y = 1 - (i / (N_NODES - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    return {
      position: new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta))
        .multiplyScalar(SPHERE_RADIUS),
      color: NODE_COLORS[i % NODE_COLORS.length],
      speed: 0.5 + (i % 7) * 0.22,
      phase: (i * 0.618) * Math.PI * 2,
      degree: 0,
    };
  });

  const edges = [];
  for (let i = 0; i < N_NODES; i++) {
    for (let j = i + 1; j < N_NODES; j++) {
      if (nodes[i].position.distanceTo(nodes[j].position) < CONNECT_THRESHOLD) {
        edges.push({
          a: nodes[i].position.toArray(),
          b: nodes[j].position.toArray(),
          aIdx: i,
          bIdx: j,
          phase: (i + j * 0.5) * 0.8,
          speed: 0.6 + ((i + j) % 5) * 0.15,
        });
        nodes[i].degree++;
        nodes[j].degree++;
      }
    }
  }

  // Mark hubs
  nodes.forEach(n => { n.isHub = n.degree >= HUB_DEGREE; });

  // Pick edges with at least one hub endpoint for packet travel
  const packetEdges = edges.filter(e => nodes[e.aIdx].isHub || nodes[e.bIdx].isHub).slice(0, 6);

  const hubs = nodes.filter(n => n.isHub);

  return { nodes, edges, packetEdges, hubs };
}

// A small glowing sphere that travels along an edge
function DataPacket({ from, to, speed, color }) {
  const meshRef = useRef();
  const start = useMemo(() => new THREE.Vector3(...from), []);
  const end   = useMemo(() => new THREE.Vector3(...to),   []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = ((clock.getElapsedTime() * speed) % 1 + 1) % 1;
    meshRef.current.position.lerpVectors(start, end, t);
    meshRef.current.material.opacity = Math.sin(t * Math.PI) * 0.9;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={5}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

function NetworkSphere() {
  const C = useThemeColors(COLOR_KEYS);
  const groupRef = useRef();
  const nodeRefs = useRef([]);
  const lineRefs = useRef([]);
  const spokeRefs = useRef([]);
  const hubRef = useRef();
  const pulseRef = useRef();

  const { nodes, edges, packetEdges, hubs } = useMemo(
    () => buildNetwork(C),
    // 主题切换时用新色值重建网络（颜色取自 C）
    [C['--ink'], C['--ink-2'], C['--dim']]
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.07;
    groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.1;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.07;

    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh?.material) return;
      const node = nodes[i];
      const base = node.isHub ? 1.5 : 0.4;
      const amp  = node.isHub ? 2.2 : 1.5;
      mesh.material.emissiveIntensity = base + amp * Math.max(0, Math.sin(t * node.speed + node.phase));
    });

    lineRefs.current.forEach((line, i) => {
      if (!line?.material) return;
      const e = edges[i];
      line.material.opacity = 0.06 + 0.3 * Math.max(0, Math.sin(t * e.speed + e.phase));
    });

    // 中枢辐射连线：亮度随中枢脉冲呼吸
    const hubPulse = 0.5 + 0.5 * Math.sin(t * 1.6);
    spokeRefs.current.forEach((line, i) => {
      if (!line?.material) return;
      line.material.opacity = 0.08 + 0.3 * hubPulse * (0.5 + 0.5 * Math.sin(t * 2 + i));
    });

    // 中枢缩放脉动
    if (hubRef.current) {
      const s = 1 + 0.14 * Math.sin(t * 1.6);
      hubRef.current.scale.setScalar(s);
    }
    // 扩散脉冲环：周期性从中枢炸开
    if (pulseRef.current) {
      const pt = (t % 3) / 3;
      pulseRef.current.scale.setScalar(0.4 + pt * SPHERE_RADIUS * 1.15);
      pulseRef.current.material.opacity = (1 - pt) * 0.22;
    }
  });

  return (
    <group ref={groupRef}>
      {edges.map((e, i) => (
        <Line
          key={`e-${i}`}
          ref={el => { lineRefs.current[i] = el; }}
          points={[e.a, e.b]}
          color={C['--dim']}
          lineWidth={0.7}
          transparent
          opacity={0.12}
        />
      ))}

      {/* 中枢 → 各 hub 的辐射连线 */}
      {hubs.map((h, i) => (
        <Line
          key={`s-${i}`}
          ref={el => { spokeRefs.current[i] = el; }}
          points={[[0, 0, 0], h.position.toArray()]}
          color={C['--ink-2']}
          lineWidth={0.9}
          transparent
          opacity={0.2}
        />
      ))}

      {nodes.map((node, i) => (
        <mesh
          key={i}
          ref={el => { nodeRefs.current[i] = el; }}
          position={node.position}
        >
          <sphereGeometry args={[node.isHub ? 0.12 : 0.065, 14, 14]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={node.isHub ? 2.5 : 1.0}
          />
        </mesh>
      ))}

      {/* 中枢指挥节点 */}
      <mesh ref={hubRef}>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshStandardMaterial
          color={C['--ink']}
          emissive={C['--ink']}
          emissiveIntensity={4}
          metalness={0.85}
          roughness={0.1}
        />
      </mesh>
      {/* 中枢脉冲扩散环 */}
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.012, 8, 96]} />
        <meshBasicMaterial color={C['--ink-2']} transparent opacity={0.2} depthWrite={false} />
      </mesh>

      {/* Data packets travelling along hub edges */}
      {packetEdges.map((e, i) => (
        <DataPacket
          key={`p-${i}`}
          from={e.a}
          to={e.b}
          speed={0.4 + i * 0.12}
          color={nodes[e.aIdx] ? nodes[e.aIdx].color : C['--ink']}
        />
      ))}
    </group>
  );
}

export function AgentArtifact() {
  return (
    <div className="w-full h-64 md:h-80">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ toneMappingExposure: 1.4, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]} intensity={5} color="#9a9aa4" />
        <pointLight position={[-3, -3, 3]} intensity={4} color="#8a8a94" />
        <pointLight position={[0, 3, 2]} intensity={2.5} color="#6e6e78" />
        <Environment preset="city" />
        <NetworkSphere />
      </Canvas>
    </div>
  );
}
