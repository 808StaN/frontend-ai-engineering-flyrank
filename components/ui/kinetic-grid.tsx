'use client'

import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Point {
  x: number
  y: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  opacity: number
  born: number
}

const CELL_SIZE = 55
const INFLUENCE_RADIUS = 260
const MAX_WARP = 24
const DOT_SPACING = 28
const LERP_SPEED = 0.08

const LINE_BASE = { r: 255, g: 255, b: 255, a: 0.13 }
const NODE_BASE_RADIUS = 1.8
const NODE_ACTIVE_RADIUS = 3.2

function lerpN(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpColor(
  base: { r: number; g: number; b: number; a: number },
  active: { r: number; g: number; b: number; a: number },
  t: number,
): string {
  const r = Math.round(lerpN(base.r, active.r, t))
  const g = Math.round(lerpN(base.g, active.g, t))
  const b = Math.round(lerpN(base.b, active.b, t))
  const a = lerpN(base.a, active.a, t)
  return `rgba(${r},${g},${b},${a.toFixed(3)})`
}

export default function KineticGrid({
  children,
  className,
  globalColor = 'default',
}: {
  children?: ReactNode
  className?: string
  globalColor?: 'default' | 'monochrome'
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<Point>({ x: -9999, y: -9999 })
  const targetMouseRef = useRef<Point>({ x: -9999, y: -9999 })
  const ripplesRef = useRef<Ripple[]>([])
  const rafRef = useRef<number>(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  const getWarpedPoint = useCallback(
    (
      gx: number,
      gy: number,
      col: number,
      row: number,
      mouse: Point,
      ripples: Ripple[],
      cols: number,
      rows: number,
    ): { pt: Point; proximity: number } => {
      const edgeMargin = 1.5
      const colPin = Math.min(
        col / edgeMargin,
        (cols - 1 - col) / edgeMargin,
        1,
      )
      const rowPin = Math.min(
        row / edgeMargin,
        (rows - 1 - row) / edgeMargin,
        1,
      )
      const pinFactor = colPin * colPin * rowPin * rowPin
      const dx = gx - mouse.x
      const dy = gy - mouse.y
      const distance = Math.hypot(dx, dy)
      const proximity =
        Math.max(0, 1 - distance / INFLUENCE_RADIUS) * pinFactor

      let rippleX = 0
      let rippleY = 0

      for (const ripple of ripples) {
        const rippleDx = gx - ripple.x
        const rippleDy = gy - ripple.y
        const rippleDistance = Math.hypot(rippleDx, rippleDy)
        const waveWidth = 55
        const difference = rippleDistance - ripple.radius

        if (Math.abs(difference) < waveWidth) {
          const strength =
            (1 - Math.abs(difference) / waveWidth) *
            ripple.opacity *
            18 *
            pinFactor
          const angle = Math.atan2(rippleDy, rippleDx)
          const sign = difference < 0 ? -1 : 1
          rippleX += Math.cos(angle) * strength * sign * -1
          rippleY += Math.sin(angle) * strength * sign * -1
        }
      }

      if (distance < INFLUENCE_RADIUS && distance > 0 && pinFactor > 0) {
        const t = distance / INFLUENCE_RADIUS
        const eased =
          t < 0.01
            ? 0
            : (1 - t) * (1 - t) * Math.min(1, distance / 60)
        const warpAmount = eased * MAX_WARP * pinFactor
        const angle = Math.atan2(dy, dx)

        return {
          pt: {
            x: gx - Math.cos(angle) * warpAmount + rippleX,
            y: gy - Math.sin(angle) * warpAmount + rippleY,
          },
          proximity,
        }
      }

      return {
        pt: { x: gx + rippleX, y: gy + rippleY },
        proximity,
      }
    },
    [],
  )

  const draw = useCallback(
    (now: number) => {
      const canvas = canvasRef.current

      if (!canvas) {
        return
      }

      const context = canvas.getContext('2d')

      if (!context) {
        return
      }

      const { w: width, h: height } = sizeRef.current
      const mouse = mouseRef.current
      const ripples = ripplesRef.current
      const theme = {
        default: {
          background: '#161618',
          lineActive: { r: 74, g: 158, b: 255, a: 0.9 },
          nodeActive: { r: 74, g: 158, b: 255, a: 1 },
          glow: '74,158,255',
          ripple: '100,180,255',
        },
        monochrome: {
          background: '#000000',
          lineActive: { r: 255, g: 255, b: 255, a: 0.9 },
          nodeActive: { r: 255, g: 255, b: 255, a: 1 },
          glow: '255,255,255',
          ripple: '255,255,255',
        },
      }[globalColor]

      context.clearRect(0, 0, width, height)
      context.fillStyle = theme.background
      context.fillRect(0, 0, width, height)

      context.fillStyle = 'rgba(255,255,255,0.05)'
      for (let x = DOT_SPACING / 2; x < width; x += DOT_SPACING) {
        for (let y = DOT_SPACING / 2; y < height; y += DOT_SPACING) {
          context.beginPath()
          context.arc(x, y, 0.7, 0, Math.PI * 2)
          context.fill()
        }
      }

      for (let index = ripples.length - 1; index >= 0; index--) {
        const ripple = ripples[index]
        const age = (now - ripple.born) / 1000
        ripple.radius = Math.max(0, age * 400)
        ripple.opacity = Math.max(0, 1 - age * 1.2)

        if (ripple.opacity <= 0) {
          ripples.splice(index, 1)
        }
      }

      const columns = Math.max(2, Math.ceil(width / CELL_SIZE)) + 1
      const rows = Math.max(2, Math.ceil(height / CELL_SIZE)) + 1
      const cellWidth = width / (columns - 1)
      const cellHeight = height / (rows - 1)
      const points: Point[][] = []
      const proximity: number[][] = []

      for (let row = 0; row < rows; row++) {
        points[row] = []
        proximity[row] = []

        for (let column = 0; column < columns; column++) {
          const result = getWarpedPoint(
            column * cellWidth,
            row * cellHeight,
            column,
            row,
            mouse,
            ripples,
            columns,
            rows,
          )
          points[row][column] = result.pt
          proximity[row][column] = result.proximity
        }
      }

      const drawSegment = (
        first: Point,
        second: Point,
        firstProximity: number,
        secondProximity: number,
      ) => {
        const average = (firstProximity + secondProximity) / 2
        const t = average * average * (3 - 2 * average)

        context.beginPath()
        context.moveTo(first.x, first.y)
        context.lineTo(second.x, second.y)
        context.strokeStyle = lerpColor(LINE_BASE, theme.lineActive, t)
        context.lineWidth = lerpN(0.8, 1.5, t)
        context.stroke()
      }

      context.lineCap = 'butt'

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns - 1; column++) {
          drawSegment(
            points[row][column],
            points[row][column + 1],
            proximity[row][column],
            proximity[row][column + 1],
          )
        }
      }

      for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows - 1; row++) {
          drawSegment(
            points[row][column],
            points[row + 1][column],
            proximity[row][column],
            proximity[row + 1][column],
          )
        }
      }

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const point = points[row][column]
          const pointProximity = proximity[row][column]
          const t =
            pointProximity * pointProximity * (3 - 2 * pointProximity)
          const radius = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t)

          if (t > 0.3) {
            const glowRadius = radius + lerpN(0, 6, (t - 0.3) / 0.7)
            const gradient = context.createRadialGradient(
              point.x,
              point.y,
              radius * 0.5,
              point.x,
              point.y,
              glowRadius,
            )
            gradient.addColorStop(
              0,
              `rgba(${theme.glow},${(t * 0.3).toFixed(3)})`,
            )
            gradient.addColorStop(1, `rgba(${theme.glow},0)`)
            context.beginPath()
            context.arc(point.x, point.y, glowRadius, 0, Math.PI * 2)
            context.fillStyle = gradient
            context.fill()
          }

          context.beginPath()
          context.arc(point.x, point.y, radius, 0, Math.PI * 2)
          context.fillStyle = lerpColor(
            { r: 255, g: 255, b: 255, a: 0.2 },
            theme.nodeActive,
            t,
          )
          context.fill()
        }
      }

      for (const ripple of ripples) {
        context.beginPath()
        context.arc(
          ripple.x,
          ripple.y,
          Math.max(0, ripple.radius),
          0,
          Math.PI * 2,
        )
        context.strokeStyle = `rgba(${theme.ripple},${(ripple.opacity * 0.28).toFixed(3)})`
        context.lineWidth = 1.5
        context.stroke()
      }
    },
    [getWarpedPoint, globalColor],
  )

  const animate = useCallback(
    (now: number) => {
      const mouse = mouseRef.current
      const targetMouse = targetMouseRef.current

      mouse.x = lerpN(mouse.x, targetMouse.x, LERP_SPEED)
      mouse.y = lerpN(mouse.y, targetMouse.y, LERP_SPEED)

      draw(now)
      rafRef.current = requestAnimationFrame(animate)
    },
    [draw],
  )

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      sizeRef.current = { w: window.innerWidth, h: window.innerHeight }
    }

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseRef.current = { x: event.clientX, y: event.clientY }
    }

    const handleClick = (event: MouseEvent) => {
      ripplesRef.current.push({
        x: event.clientX,
        y: event.clientY,
        radius: 0,
        opacity: 1,
        born: performance.now(),
      })
    }

    setSize()
    window.addEventListener('resize', setSize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', setSize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  return (
    <div
      className={cn(
        'relative min-h-screen w-full overflow-hidden',
        globalColor === 'monochrome' ? 'bg-black' : 'bg-[#161618]',
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 size-full"
        aria-hidden="true"
      />
      <div className="relative z-10 size-full">{children}</div>
    </div>
  )
}
