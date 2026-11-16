import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Line, OrbitControls, Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMediaQuery'
import Elephant from './Elephant'

const LIME = '#C7F35A'
const TEAL = '#5EE0C8'

type NodeConfig = {
  radius: number
  speed: number
  tilt: number
  phase: number
  color: string
}

const NODES: NodeConfig[] = [
  { radius: 1.9, speed: 0.34, tilt: 0.45, phase: 0, color: LIME },
  { radius: 2.3, speed: -0.26, tilt: -0.7, phase: 1.1, color: TEAL },
  { radius: 2.6, speed: 0.21, tilt: 1.05, phase: 2.2, color: LIME },
  { radius: 1.7, speed: -0.42, tilt: -1.15, phase: 3.0, color: TEAL },
  { radius: 2.8, speed: 0.17, tilt: 0.8, phase: 4.1, color: LIME },
  { radius: 2.1, speed: 0.3, tilt: -0.35, phase: 5.0, color: TEAL },
  { radius: 2.45, speed: -0.19, tilt: 1.3, phase: 0.6, color: LIME },
  { radius: 1.8, speed: 0.38, tilt: -0.9, phase: 2.7, color: TEAL },
]

function Core({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!ref.current || reduced) return
    ref.current.rotation.y += delta * 0.18
    ref.current.rotation.x += delta * 0.07
  })

  return (
    <Float
      speed={reduced ? 0 : 1.4}
      rotationIntensity={reduced ? 0 : 0.12}
      floatIntensity={reduced ? 0 : 0.5}
    >
      <group ref={ref}>
        <mesh>
          <icosahedronGeometry args={[0.92, 1]} />
          <meshStandardMaterial
            color="#0d1510"
            emissive={TEAL}
            emissiveIntensity={0.55}
            roughness={0.35}
            metalness={0.35}
            flatShading
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.16, 1]} />
          <meshBasicMaterial color={LIME} wireframe transparent opacity={0.34} toneMapped={false} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.62, 0]} />
          <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.08} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

function OrbitNode({
  config,
  reduced,
}: {
  config: NodeConfig
  reduced: boolean
}) {
  const pivot = useRef<THREE.Group>(null)
  const linePoints = useMemo<[number, number, number][]>(
    () => [
      [0, 0, 0],
      [config.radius, 0, 0],
    ],
    [config.radius],
  )

  useFrame((_, delta) => {
    if (!pivot.current || reduced) return
    pivot.current.rotation.y += delta * config.speed
  })

  return (
    <group rotation={[config.tilt, config.phase, 0]}>
      <group ref={pivot}>
        <Line
          points={linePoints}
          color={config.color}
          lineWidth={1}
          transparent
          opacity={0.18}
        />
        <mesh position={[config.radius, 0, 0]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial color={config.color} toneMapped={false} />
        </mesh>
        <mesh position={[config.radius, 0, 0]}>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.1}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

function Particles({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const count = isMobile ? 320 : 650
    const data = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const radius = 2.2 + Math.random() * 2.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      data[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      data[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      data[i * 3 + 2] = radius * Math.cos(phi)
    }
    return data
  }, [isMobile])

  useFrame((_, delta) => {
    if (!ref.current || reduced) return
    ref.current.rotation.y += delta * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={LIME}
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

function Network({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!ref.current || reduced) return
    const targetX = -state.pointer.y * 0.25
    const targetY = state.pointer.x * 0.35
    const smoothing = 1 - Math.pow(0.001, delta)
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, smoothing)
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetY, smoothing)
  })

  return (
    <group ref={ref}>
      <Core reduced={reduced} />
      {NODES.map((config, index) => (
        <OrbitNode key={index} config={config} reduced={reduced} />
      ))}
      <Particles reduced={reduced} isMobile={isMobile} />
      <Sparkles
        count={isMobile ? 24 : 48}
        scale={[6, 6, 6]}
        size={1.8}
        speed={reduced ? 0 : 0.35}
        color={TEAL}
        opacity={0.5}
      />
    </group>
  )
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}

class CanvasBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function SceneFallback() {
  return <div className="scene-fallback" />
}

export default function Scene() {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const [webglSupported] = useState(hasWebGL)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleVisibility = () => setVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  return (
    <div className="scene-layer" aria-hidden="true">
      {!webglSupported ? (
        <SceneFallback />
      ) : (
        <CanvasBoundary fallback={<SceneFallback />}>
          <Canvas
            camera={{ position: [0, 0, 6.5], fov: 50 }}
            dpr={[1, isMobile ? 1.5 : 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            shadows={false}
            frameloop={visible ? 'always' : 'never'}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[-4, 2, 3]} intensity={30} color={LIME} distance={22} />
            <pointLight position={[4, -2, 2]} intensity={24} color={TEAL} distance={22} />
            <Suspense fallback={null}>
              <Network reduced={reduced} isMobile={isMobile} />
              <Elephant reduced={reduced} isMobile={isMobile} />
              <EffectComposer>
                <Bloom
                  intensity={0.8}
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.3}
                  mipmapBlur
                />
              </EffectComposer>
            </Suspense>
            <OrbitControls
              makeDefault
              enableZoom={false}
              enablePan={false}
              enableDamping
              dampingFactor={0.06}
              autoRotate={!reduced}
              autoRotateSpeed={0.6}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={(Math.PI * 2) / 3}
            />
          </Canvas>
        </CanvasBoundary>
      )}
    </div>
  )
}
