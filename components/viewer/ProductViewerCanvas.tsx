'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { DeskLampModel } from '@/components/viewer/DeskLampModel'
import {
  DEFAULT_CAMERA_POSITION,
  MAX_CAMERA_DISTANCE,
  MIN_CAMERA_DISTANCE,
  PRODUCT_NAME,
  type ProductVariant,
} from '@/lib/viewer/config'

type ProductViewerCanvasProps = {
  variant: ProductVariant
  resetToken: number
}

function CameraControls({ resetToken }: { resetToken: number }) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera, invalidate } = useThree()

  useEffect(() => {
    if (resetToken === 0) {
      return
    }

    camera.position.set(...DEFAULT_CAMERA_POSITION)
    controlsRef.current?.target.set(0, 0, 0)
    controlsRef.current?.update()
    invalidate()
  }, [camera, invalidate, resetToken])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      minDistance={MIN_CAMERA_DISTANCE}
      maxDistance={MAX_CAMERA_DISTANCE}
      minPolarAngle={Math.PI / 5}
      maxPolarAngle={(Math.PI * 3) / 5}
    />
  )
}

export function ProductViewerCanvas({
  variant,
  resetToken,
}: ProductViewerCanvasProps) {
  return (
    <Canvas
      className="viewer-canvas"
      camera={{ position: DEFAULT_CAMERA_POSITION, fov: 38 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      role="img"
      aria-label={`Interactive 3D ${PRODUCT_NAME} viewer`}
    >
      <color attach="background" args={['#0a1020']} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 5, 5]} intensity={2.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.75} color="#4a9eff" />
      <DeskLampModel variant={variant} />
      <CameraControls resetToken={resetToken} />
    </Canvas>
  )
}
