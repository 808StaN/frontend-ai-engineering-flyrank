import type { ProductVariant } from '@/lib/viewer/config'

type DeskLampModelProps = {
  variant: ProductVariant
}

export function DeskLampModel({ variant }: DeskLampModelProps) {
  return (
    <group rotation={[0, -10.45, 0]}>
      <mesh position={[0, -1.22, 0]}>
        <cylinderGeometry args={[0.98, 1.08, 0.2, 48]} />
        <meshStandardMaterial
          color={variant.color}
          metalness={variant.metalness}
          roughness={variant.roughness}
        />
      </mesh>

      <mesh position={[0.12, -0.68, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.1, 0.14, 1.15, 24]} />
        <meshStandardMaterial
          color={variant.color}
          metalness={variant.metalness}
          roughness={variant.roughness}
        />
      </mesh>
      <mesh position={[0.28, -0.1, 0]}>
        <sphereGeometry args={[0.19, 24, 24]} />
        <meshStandardMaterial color="#dbeafe" metalness={0.65} roughness={0.2} />
      </mesh>

      <mesh position={[-0.2, 0.5, 0]} rotation={[0, 0, 0.64]}>
        <cylinderGeometry args={[0.09, 0.12, 1.55, 24]} />
        <meshStandardMaterial
          color={variant.color}
          metalness={variant.metalness}
          roughness={variant.roughness}
        />
      </mesh>
      <mesh position={[-0.66, 1.12, 0]}>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshStandardMaterial color="#dbeafe" metalness={0.65} roughness={0.2} />
      </mesh>

      <group position={[-0.84, 1.00, 0]} rotation={[0, 0, -0.55]}>
        <mesh>
          <coneGeometry args={[0.58, 0.5, 48, 1, true]} />
          <meshStandardMaterial
            color={variant.color}
            metalness={variant.metalness}
            roughness={variant.roughness}
            side={2}
          />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffd166"
            emissiveIntensity={1.8}
            roughness={0.35}
          />
        </mesh>
        <pointLight color="#ffd166" distance={3.2} intensity={2.1} />
      </group>
    </group>
  )
}
