export const PRODUCT_NAME = 'Luma Desk Lamp'

export const productVariants = [
  {
    id: 'accent',
    label: 'Blue',
    description: 'Blue finish',
    color: '#4a9eff',
    metalness: 0.55,
    roughness: 0.28,
  },
  {
    id: 'success',
    label: 'Green',
    description: 'Green finish',
    color: '#34d399',
    metalness: 0.4,
    roughness: 0.35,
  },
  {
    id: 'graphite',
    label: 'Graphite',
    description: 'Dark graphite finish',
    color: '#292d36',
    metalness: 0.75,
    roughness: 0.22,
  },
] as const

export type ProductVariant = (typeof productVariants)[number]
export type ProductVariantId = ProductVariant['id']

export const DEFAULT_VARIANT_ID: ProductVariantId = 'accent'
export const DEFAULT_CAMERA_POSITION: [number, number, number] = [4.4, 2.7, 5.2]
export const MIN_CAMERA_DISTANCE = 3.5
export const MAX_CAMERA_DISTANCE = 8
