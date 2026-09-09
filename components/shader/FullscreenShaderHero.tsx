'use client'

import { useEffect, useRef, useState } from 'react'

const MAX_PIXEL_RATIO = 1.5

const vertexShaderSource = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const fragmentShaderSource = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec2 u_click;
  uniform float u_click_time;

  float gridLine(float coordinate, float width) {
    float line = abs(fract(coordinate) - 0.5);
    return 1.0 - smoothstep(width, width + 0.018, line);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspectRatio = u_resolution.x / u_resolution.y;
    vec2 point = uv * vec2(aspectRatio, 1.0);
    vec2 mouse = (u_mouse / u_resolution.xy) * vec2(aspectRatio, 1.0);
    vec2 click = (u_click / u_resolution.xy) * vec2(aspectRatio, 1.0);
    vec2 direction = point - mouse;
    float distanceToMouse = length(direction);
    float influence = 1.0 - smoothstep(0.0, 0.34, distanceToMouse);

    // Bend cells towards the pointer without folding lines into closed loops.
    point -= direction * influence * 0.14;

    vec2 cells = point * 11.0;
    float horizontal = gridLine(cells.y, 0.014);
    float vertical = gridLine(cells.x, 0.014);
    float grid = max(horizontal, vertical);

    vec2 cell = fract(cells) - 0.5;
    float node = 1.0 - smoothstep(0.025, 0.06, length(cell));
    float clickAge = max(0.0, (u_time - u_click_time) * 0.001);
    float clickDistance = length(point - click);
    float clickRing = 1.0 - smoothstep(0.0, 0.026, abs(clickDistance - clickAge * 0.62));
    float clickFade = 1.0 - smoothstep(0.72, 1.35, clickAge);
    float clickInfluence = clickRing * clickFade;
    float active = max(
      influence,
      clickInfluence
    );

    vec3 background = vec3(0.015, 0.025, 0.075);
    vec3 lines = mix(vec3(0.17, 0.25, 0.42), vec3(0.29, 0.62, 1.0), active);
    vec3 nodes = mix(vec3(0.42, 0.52, 0.7), vec3(0.42, 0.76, 1.0), active);
    vec3 color = background + lines * grid * (0.32 + active * 0.68);
    color += nodes * node * (0.3 + active * 0.7);
    color += vec3(0.11, 0.4, 0.95) * influence * influence * 0.18;

    float vignette = smoothstep(1.05, 0.22, distance(uv, vec2(0.5)));
    color *= 0.7 + vignette * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`

function createShader(
  context: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = context.createShader(type)

  if (!shader) {
    return null
  }

  context.shaderSource(shader, source)
  context.compileShader(shader)

  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    context.deleteShader(shader)
    return null
  }

  return shader
}

export function FullscreenShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    if (!context) {
      setIsAvailable(false)
      return
    }

    const vertexShader = createShader(
      context,
      context.VERTEX_SHADER,
      vertexShaderSource,
    )
    const fragmentShader = createShader(
      context,
      context.FRAGMENT_SHADER,
      fragmentShaderSource,
    )

    if (!vertexShader || !fragmentShader) {
      setIsAvailable(false)
      vertexShader && context.deleteShader(vertexShader)
      fragmentShader && context.deleteShader(fragmentShader)
      return
    }

    const program = context.createProgram()

    if (!program) {
      setIsAvailable(false)
      context.deleteShader(vertexShader)
      context.deleteShader(fragmentShader)
      return
    }

    context.attachShader(program, vertexShader)
    context.attachShader(program, fragmentShader)
    context.linkProgram(program)
    context.deleteShader(vertexShader)
    context.deleteShader(fragmentShader)

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      setIsAvailable(false)
      context.deleteProgram(program)
      return
    }

    const positionBuffer = context.createBuffer()
    const positionLocation = context.getAttribLocation(program, 'a_position')
    const timeLocation = context.getUniformLocation(program, 'u_time')
    const resolutionLocation = context.getUniformLocation(program, 'u_resolution')
    const mouseLocation = context.getUniformLocation(program, 'u_mouse')
    const clickLocation = context.getUniformLocation(program, 'u_click')
    const clickTimeLocation = context.getUniformLocation(program, 'u_click_time')

    if (
      !positionBuffer ||
      positionLocation < 0 ||
      !timeLocation ||
      !resolutionLocation ||
      !mouseLocation ||
      !clickLocation ||
      !clickTimeLocation
    ) {
      setIsAvailable(false)
      context.deleteBuffer(positionBuffer)
      context.deleteProgram(program)
      return
    }

    context.bindBuffer(context.ARRAY_BUFFER, positionBuffer)
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      context.STATIC_DRAW,
    )

    const mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 }
    const click = { x: -9999, y: -9999, time: -999999 }
    let frameId = 0
    let isPageVisible = !document.hidden
    let hasReducedMotion = reducedMotionQuery.matches

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO)
      const width = Math.floor(window.innerWidth * pixelRatio)
      const height = Math.floor(window.innerHeight * pixelRatio)

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      context.viewport(0, 0, width, height)
    }

    const render = (time: number) => {
      if (hasReducedMotion || !isPageVisible) {
        frameId = 0
        return
      }

      resize()
      context.useProgram(program)
      context.bindBuffer(context.ARRAY_BUFFER, positionBuffer)
      context.enableVertexAttribArray(positionLocation)
      context.vertexAttribPointer(positionLocation, 2, context.FLOAT, false, 0, 0)
      context.uniform1f(timeLocation, time)
      context.uniform2f(resolutionLocation, canvas.width, canvas.height)
      context.uniform2f(
        mouseLocation,
        mouse.x * Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO),
        (window.innerHeight - mouse.y) *
          Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO),
      )
      context.uniform2f(
        clickLocation,
        click.x * Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO),
        (window.innerHeight - click.y) *
          Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO),
      )
      context.uniform1f(clickTimeLocation, click.time)
      context.drawArrays(context.TRIANGLES, 0, 6)
      frameId = window.requestAnimationFrame(render)
    }

    const start = () => {
      if (!frameId && !hasReducedMotion && isPageVisible) {
        frameId = window.requestAnimationFrame(render)
      }
    }

    const stop = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
        frameId = 0
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }

    const handleClick = (event: MouseEvent) => {
      click.x = event.clientX
      click.y = event.clientY
      click.time = performance.now()
    }

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden
      isPageVisible ? start() : stop()
    }

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      hasReducedMotion = event.matches
      hasReducedMotion ? stop() : start()
    }

    resize()
    render(performance.now())
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('click', handleClick, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('click', handleClick)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange)
      context.deleteBuffer(positionBuffer)
      context.deleteProgram(program)
    }
  }, [])

  if (!isAvailable) {
    return (
      <div
        className="shader-hero__fallback"
        role="img"
        aria-label="Static FlyRank aurora background"
      />
    )
  }

  return (
    <>
      <canvas ref={canvasRef} className="shader-hero__canvas" aria-hidden="true" />
      <div className="shader-hero__fallback" aria-hidden="true" />
    </>
  )
}
