import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMediaQuery'
import Elephant from './Elephant'

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

/**
 * A fixed, click-through overlay that hosts the decorative elephant so it can
 * follow the cursor across every section, not just inside the hero canvas.
 *
 * The canvas has pointer-events: none, so R3F's own pointer state never updates
 * here. Instead a passive window mousemove listener feeds a normalized -1..1
 * ref that Elephant consumes directly. Touch devices keep the Lissajous drift
 * and prefers-reduced-motion still holds the pose still.
 */
export default function GlobalElephant() {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const [webglSupported] = useState(hasWebGL)
  const [visible, setVisible] = useState(true)
  const pointer = useRef({ x: 0.6, y: -0.2 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const handleVisibility = () => setVisible(document.visibilityState !== 'hidden')
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  if (!webglSupported) return null

  return (
    <div className="elephant-layer" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={visible ? 'always' : 'never'}
      >
        <ambientLight intensity={1.1} />
        <pointLight position={[4, 2, 3]} intensity={30} color="#FFFFFF" distance={22} />
        <Elephant reduced={reduced} isMobile={isMobile} pointer={pointer} scale={0.42} />
      </Canvas>
    </div>
  )
}
