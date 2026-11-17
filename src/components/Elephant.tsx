import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMediaQuery } from '../hooks/useMediaQuery'

type ElephantProps = {
  reduced: boolean
  isMobile: boolean
  pointer?: MutableRefObject<{ x: number; y: number }>
  scale?: number
}

// The elephant lives in front of the core network, closer to the camera.
const ELEPHANT_Z = 1.9
// Visible world width at ELEPHANT_Z is ~70% of the width at the camera target (z=0),
// so scale the pointer-derived target to keep screen-space tracking roughly 1:1.
const DEPTH_FACTOR = 0.7

/**
 * A small, low-poly elephant built entirely from Three.js primitives.
 *
 * - On fine pointers it lerps toward a cursor-derived world target, with a
 *   gentle idle bob, ear flap and a tilt that leans into its movement.
 * - On touch / mobile it drifts slowly on a Lissajous path instead.
 * - With prefers-reduced-motion it stays completely still.
 *
 * - When a pointer ref is supplied (the global overlay) it tracks that instead
 *   of R3F pointer state, so it follows the cursor outside the hero canvas.
 *
 * It has no pointer event handlers, so it never intercepts DOM clicks; its
 * surrounding overlay layer is aria-hidden, keeping it decorative.
 */
export default function Elephant({ reduced, isMobile, pointer, scale = 0.55 }: ElephantProps) {
  const isTouch = useMediaQuery('(pointer: coarse)')
  const drift = isMobile || isTouch

  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  const earLeft = useRef<THREE.Mesh>(null)
  const earRight = useRef<THREE.Mesh>(null)

  const target = useRef({ x: 0, y: 0 })

  // Shared materials — created once, reused by every mesh.
  const materials = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({
        color: '#93B2AC',
        roughness: 0.85,
        metalness: 0.05,
        flatShading: true,
      }),
      shade: new THREE.MeshStandardMaterial({
        color: '#76948F',
        roughness: 0.9,
        metalness: 0.03,
        flatShading: true,
      }),
      tusk: new THREE.MeshStandardMaterial({
        color: '#F0E9D6',
        roughness: 0.6,
        metalness: 0.05,
      }),
      eye: new THREE.MeshStandardMaterial({ color: '#0E1416', roughness: 0.4 }),
      glint: new THREE.MeshBasicMaterial({ color: '#FFFFFF' }),
    }),
    [],
  )

  // The trunk is a single tapered-looking tube following a gentle curve.
  const trunkGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.2, 0.1),
      new THREE.Vector3(0, -0.4, 0.18),
      new THREE.Vector3(0.01, -0.58, 0.24),
      new THREE.Vector3(0.05, -0.72, 0.38),
      new THREE.Vector3(0.12, -0.72, 0.54),
    ])
    return new THREE.TubeGeometry(curve, 18, 0.105, 7, false)
  }, [])

  useFrame((state, delta) => {
    const g = group.current
    const body = inner.current
    if (!g || !body) return

    // Reduced motion: hold the initial pose, never update anything.
    if (reduced) return

    const t = state.clock.elapsedTime

    if (drift) {
      // Touch / mobile: slow, self-contained drifting instead of pointer follow.
      target.current.x = Math.sin(t * 0.24) * 1.5
      target.current.y = Math.cos(t * 0.19) * 0.75
    } else {
      const rangeX = (state.viewport.width / 2) * DEPTH_FACTOR
      const rangeY = (state.viewport.height / 2) * DEPTH_FACTOR
      const px = pointer ? pointer.current.x : state.pointer.x
      const py = pointer ? pointer.current.y : state.pointer.y
      target.current.x = px * rangeX
      target.current.y = py * rangeY
    }

    const smoothing = 1 - Math.pow(0.0016, delta)
    const dx = target.current.x - g.position.x
    const dy = target.current.y - g.position.y
    g.position.x += dx * smoothing
    g.position.y += dy * smoothing

    // Lean into horizontal movement, turn slightly toward the direction of travel.
    const tilt = THREE.MathUtils.clamp(dx * 0.14, -0.32, 0.32)
    body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, -tilt, smoothing)
    body.rotation.y = THREE.MathUtils.lerp(body.rotation.y, tilt * 0.7, smoothing)

    // Idle bob + a slow, sleepy ear flap.
    body.position.y = Math.sin(t * 1.7) * 0.05
    const flap = Math.sin(t * 2.1) * 0.13
    if (earLeft.current) earLeft.current.rotation.y = 0.12 + flap
    if (earRight.current) earRight.current.rotation.y = -0.12 - flap
  })

  return (
    <group
      ref={group}
      position={[1.1, -0.2, ELEPHANT_Z]}
      scale={scale}
      rotation={[0.05, -0.25, 0]}
    >
      <group ref={inner}>
        {/* Body */}
        <mesh material={materials.skin} scale={[0.62, 0.52, 0.8]} position={[0, 0.02, -0.16]}>
          <sphereGeometry args={[1, 16, 12]} />
        </mesh>

        {/* Head */}
        <mesh material={materials.skin} scale={[0.43, 0.43, 0.41]} position={[0, 0.2, 0.6]}>
          <sphereGeometry args={[1, 16, 12]} />
        </mesh>

        {/* Ears */}
        <mesh
          ref={earLeft}
          material={materials.shade}
          scale={[0.1, 0.4, 0.3]}
          position={[-0.42, 0.24, 0.52]}
          rotation={[0, 0.12, 0.12]}
        >
          <sphereGeometry args={[1, 12, 10]} />
        </mesh>
        <mesh
          ref={earRight}
          material={materials.shade}
          scale={[0.1, 0.4, 0.3]}
          position={[0.42, 0.24, 0.52]}
          rotation={[0, -0.12, -0.12]}
        >
          <sphereGeometry args={[1, 12, 10]} />
        </mesh>

        {/* Trunk */}
        <mesh material={materials.skin} geometry={trunkGeometry} position={[0, -0.04, 0.94]} />

        {/* Tusks */}
        <mesh
          material={materials.tusk}
          position={[-0.18, -0.12, 1.0]}
          rotation={[-1.15, 0, -0.16]}
        >
          <coneGeometry args={[0.05, 0.24, 8]} />
        </mesh>
        <mesh
          material={materials.tusk}
          position={[0.18, -0.12, 1.0]}
          rotation={[-1.15, 0, 0.16]}
        >
          <coneGeometry args={[0.05, 0.24, 8]} />
        </mesh>

        {/* Eyes + glints */}
        {[-0.2, 0.2].map((x) => (
          <group key={x}>
            <mesh material={materials.eye} position={[x, 0.3, 0.95]}>
              <sphereGeometry args={[0.062, 10, 8]} />
            </mesh>
            <mesh material={materials.glint} position={[x - 0.018, 0.318, 0.998]}>
              <sphereGeometry args={[0.018, 8, 6]} />
            </mesh>
          </group>
        ))}

        {/* Legs */}
        {[
          [-0.36, -0.5, 0.34],
          [0.36, -0.5, 0.34],
          [-0.36, -0.5, -0.56],
          [0.36, -0.5, -0.56],
        ].map(([x, y, z], i) => (
          <mesh key={i} material={materials.shade} position={[x, y, z]}>
            <cylinderGeometry args={[0.16, 0.14, 0.56, 10]} />
          </mesh>
        ))}

        {/* Tail + tuft */}
        <mesh material={materials.skin} position={[0, -0.08, -0.98]} rotation={[0.55, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.028, 0.5, 8]} />
        </mesh>
        <mesh material={materials.shade} position={[0, -0.32, -1.15]}>
          <sphereGeometry args={[0.09, 10, 8]} />
        </mesh>
      </group>
    </group>
  )
}
