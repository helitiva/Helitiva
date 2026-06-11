import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Fixed full-page particle field with three states:
 *  1. tilted spiral galaxy in the hero,
 *  2. scattered ambient starfield while scrolling,
 *  3. and, when the #earth-anchor element is centered in view, every particle
 *     gathers into a slowly rotating Earth (landmass sampled from the bundled
 *     equirectangular map; oceans stay dim).
 * Scroll progress and the anchor rect are read inside the rAF loop; no scroll
 * listeners, no React state.
 */

const VERTEX = /* glsl */ `
  attribute vec3 aScatter;
  attribute vec3 aGlobe;
  attribute float aLand;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aKeep;
  attribute float aBlur;
  attribute float aCardIdx;
  attribute vec2 aRect;
  attribute vec3 aHole;
  uniform float uMix;
  uniform float uGlobe;
  uniform float uCardsMix;
  uniform float uHole;
  uniform vec2 uHoleC;
  uniform vec2 uHoleR;
  uniform vec4 uCards[4];
  uniform vec2 uNdcC;
  uniform vec2 uNdcR;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vKeep;
  varying float vBlur;
  varying float vFront;
  varying float vCard;
  varying float vHole;
  varying float vHoleGlow;

  void main() {
    vec3 p = mix(position, aScatter, uMix);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clipA = projectionMatrix * mv;
    vec3 ndcA = clipA.xyz / clipA.w;

    // earth state: spin around the axis, add a slight viewing tilt, then place
    // as a screen-space billboard so the sphere is a perfect pixel circle
    float ga = uTime * 0.22;
    vec3 g = aGlobe;
    vec3 gy = vec3(g.x * cos(ga) + g.z * sin(ga), g.y, -g.x * sin(ga) + g.z * cos(ga));
    float tilt = 0.35;
    vec3 gr = vec3(gy.x, gy.y * cos(tilt) - gy.z * sin(tilt), gy.y * sin(tilt) + gy.z * cos(tilt));
    vec3 ndcB = vec3(uNdcC + vec2(gr.x * uNdcR.x, gr.y * uNdcR.y), 0.0);

    // card-frame state: the faded particles regroup along the card perimeters
    float border = 1.0 - step(0.5, aKeep);
    float cm = uCardsMix * border;
    vec4 card = uCards[int(aCardIdx)];
    float breathe = 1.0 + 0.012 * sin(uTime * 1.7 + aCardIdx * 7.0 + aSize * 9.0);
    vec3 ndcCard = vec3(card.xy + aRect * card.zw * breathe, 0.0);

    // black-hole state: Keplerian disk, gravitationally lensed top arc,
    // and a thin photon ring hugging the horizon
    float hr = aHole.x;
    float hth = aHole.y + uTime * (0.55 / max(hr, 0.3));
    float isRing = step(0.5, aHole.z);
    float s = sin(hth);
    float thick = (fract(aSize * 7.31) - 0.5) * 0.07 * hr;

    // front half: flat disk sweeping in front of the horizon
    vec2 diskFront = vec2(cos(hth) * hr, s * hr * 0.2 - 0.05 + thick);
    // back half: light bent over the top into a dome
    float ra = 0.55 + (hr - 0.5) * 0.3;
    vec2 arcTop = vec2(cos(hth) * ra, abs(s) * ra * 0.8 + thick * 0.6);
    float behind = step(0.0, s);
    vec2 diskP = mix(diskFront, arcTop, behind);
    float tiltC = cos(-0.1);
    float tiltS = sin(-0.1);
    diskP = vec2(diskP.x * tiltC - diskP.y * tiltS, diskP.x * tiltS + diskP.y * tiltC);

    // photon ring: a thin upright circle at the horizon
    vec2 ringP = vec2(cos(hth) * hr, sin(hth) * hr) * 0.98;
    vec2 hp = mix(diskP, ringP, isRing);

    float diskGlow = clamp(1.4 - hr * 0.55, 0.16, 1.0) * mix(1.15, 0.8, behind);
    float ringGlow = 0.85 + 0.15 * s;
    float hglow = mix(diskGlow, ringGlow, isRing);
    vec3 ndcHole = vec3(uHoleC + vec2(hp.x * uHoleR.x, hp.y * uHoleR.y), 0.0);

    vec3 ndc = mix(ndcA, ndcCard, cm);
    ndc = mix(ndc, ndcB, uGlobe);
    ndc = mix(ndc, ndcHole, uHole);
    gl_Position = vec4(ndc, 1.0);

    float sizeA = clamp(aSize * uPixelRatio * (6.5 / -mv.z), 1.0, 30.0 * uPixelRatio);
    float sizeB = aSize * uPixelRatio * 1.15;
    float sizeH = aSize * uPixelRatio * (0.7 + hglow * 0.65);
    float sz = mix(mix(sizeA, aSize * uPixelRatio * 0.95, cm), sizeB, uGlobe);
    gl_PointSize = mix(sz, sizeH, uHole);

    vColor = aColor;
    vTwinkle = 0.72 + 0.28 * sin(uTime * 0.7 + aSize * 17.3 + position.x * 3.1);
    // dispersion thins the field; card frames and the earth pull particles back
    float base = mix(1.0, aKeep, uMix);
    base = mix(base, 1.0, cm);
    vKeep = mix(base, aLand, uGlobe);
    vKeep = mix(vKeep, 1.0, uHole);
    // the far hemisphere is occluded by the planet body
    vFront = mix(1.0, 0.05 + 0.95 * smoothstep(-0.12, 0.3, gr.z), uGlobe);
    vFront = mix(vFront, 1.0, uHole);
    vBlur = aBlur;
    vCard = cm;
    vHole = uHole;
    vHoleGlow = hglow;
  }
`

const FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  uniform float uGlobe;
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vKeep;
  varying float vBlur;
  varying float vFront;
  varying float vCard;
  varying float vHole;
  varying float vHoleGlow;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float edge = mix(0.40, 0.03, vBlur);
    float alpha = smoothstep(0.5, edge, d);
    alpha *= mix(1.0, 0.45, vBlur);
    // several particles stack per land dot, so the earth runs at lower alpha;
    // card frames glow a touch brighter than the ambient field
    float opacity = mix(uOpacity, 0.5, vCard);
    opacity = mix(opacity, 0.4, uGlobe);
    opacity = mix(opacity, 0.18 + 0.42 * clamp(vHoleGlow, 0.0, 1.0), vHole);
    // the accretion disk heats up toward the horizon: deep emerald to hot mint
    vec3 holeCol = mix(vec3(0.02, 0.3, 0.24), vec3(0.62, 0.96, 0.84), clamp(vHoleGlow, 0.0, 1.0));
    vec3 col = mix(vColor, holeCol, vHole);
    gl_FragColor = vec4(col, alpha * opacity * vTwinkle * vKeep * vFront);
  }
`

export function Galaxy({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    // ── particles: galaxy + scatter + unit-sphere globe ──────
    const count = window.innerWidth < 768 ? 14000 : 36000
    const radius = 5
    const branches = 4
    const spin = 1.15
    const randomness = 0.45
    const randomnessPower = 2.8
    const inside = new THREE.Color('#a7f3d0')
    const mid = new THREE.Color('#34d399')
    const outside = new THREE.Color('#0e7490')

    const positions = new Float32Array(count * 3)
    const scatter = new Float32Array(count * 3)
    const globe = new Float32Array(count * 3)
    const land = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const blurs = new Float32Array(count)

    const spherePoint = (i3: number, lat: number, lon: number) => {
      globe[i3] = Math.cos(lat) * Math.cos(lon)
      globe[i3 + 1] = Math.sin(lat)
      globe[i3 + 2] = Math.cos(lat) * Math.sin(lon)
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const r = Math.pow(Math.random(), 1.4) * radius
      const branchAngle = ((i % branches) / branches) * Math.PI * 2
      const spinAngle = r * spin
      const rnd = (scale: number) =>
        Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * scale
      positions[i3] = Math.cos(branchAngle + spinAngle) * r + rnd(1)
      positions[i3 + 1] = rnd(0.3)
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + rnd(1)

      scatter[i3] = (Math.random() - 0.5) * 26
      scatter[i3 + 1] = (Math.random() - 0.5) * 14
      scatter[i3 + 2] = -2.5 - Math.random() * 5

      // provisional globe: uniform sphere until the land map loads
      spherePoint(i3, Math.asin(2 * Math.random() - 1), Math.random() * Math.PI * 2)
      land[i] = 0.8

      const t = r / radius
      const c = t < 0.4 ? inside.clone().lerp(mid, t / 0.4) : mid.clone().lerp(outside, (t - 0.4) / 0.6)
      colors[i3] = c.r
      colors[i3 + 1] = c.g
      colors[i3 + 2] = c.b

      blurs[i] = 0
      sizes[i] = 0.7 + Math.random() * 1.8
    }

    const keep = new Float32Array(count)
    for (let i = 0; i < count; i++) keep[i] = Math.random() < 0.35 ? 1 : 0

    // black-hole targets: (radius, start angle, type) — 80% accretion disk
    // with a dense hot inner edge, 20% lensed photon ring at the horizon
    const holeAttr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const isRing = Math.random() < 0.08
      if (isRing) {
        holeAttr[i3] = 0.5 + (Math.random() - 0.5) * 0.05
        holeAttr[i3 + 2] = 1
      } else {
        // long wings, but mass concentrates at the hot inner edge
        holeAttr[i3] = 0.56 + Math.pow(Math.random(), 2.4) * 2.1
        holeAttr[i3 + 2] = 0
      }
      holeAttr[i3 + 1] = Math.random() * Math.PI * 2
    }

    // card-frame targets: a spot on a unit-rect perimeter plus outward fuzz
    const cardIdx = new Float32Array(count)
    const rectPos = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      cardIdx[i] = i % 4
      const t = Math.random() * 4
      const side = Math.floor(t)
      const u = (t - side) * 2 - 1
      let x = 0
      let y = 0
      let nx = 0
      let ny = 0
      if (side === 0) {
        x = u; y = -1; ny = -1
      } else if (side === 1) {
        x = 1; y = u; nx = 1
      } else if (side === 2) {
        x = -u; y = 1; ny = 1
      } else {
        x = -1; y = -u; nx = -1
      }
      const fuzz = Math.pow(Math.random(), 2) * 0.07
      rectPos[i * 2] = x + nx * fuzz
      rectPos[i * 2 + 1] = y + ny * fuzz
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3))
    geometry.setAttribute('aGlobe', new THREE.BufferAttribute(globe, 3))
    geometry.setAttribute('aLand', new THREE.BufferAttribute(land, 1))
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aKeep', new THREE.BufferAttribute(keep, 1))
    geometry.setAttribute('aBlur', new THREE.BufferAttribute(blurs, 1))
    geometry.setAttribute('aCardIdx', new THREE.BufferAttribute(cardIdx, 1))
    geometry.setAttribute('aRect', new THREE.BufferAttribute(rectPos, 2))
    geometry.setAttribute('aHole', new THREE.BufferAttribute(holeAttr, 3))

    // resample the sphere against the bundled landmass map: most particles
    // seek land (bright), the rest trace dim oceans so the ball stays readable
    const img = new Image()
    img.src = '/Threejs-globe/assets/textures/map_indexed.png'
    img.onload = () => {
      const mc = document.createElement('canvas')
      mc.width = 512
      mc.height = 256
      const mctx = mc.getContext('2d')
      if (!mctx) return
      mctx.drawImage(img, 0, 0, 512, 256)
      const px = mctx.getImageData(0, 0, 512, 256).data
      const at = (x: number, y: number) => {
        const k = (y * 512 + x) * 4
        return [px[k], px[k + 1], px[k + 2]]
      }
      const ocean = at(10, 140) // mid-Pacific reference
      const isLand = (lat: number, lon: number) => {
        const u = lon / (Math.PI * 2) + 0.5
        const v = 0.5 - lat / Math.PI
        const [r, g, b] = at(
          Math.min(511, Math.max(0, Math.floor(u * 512))),
          Math.min(255, Math.max(0, Math.floor(v * 256))),
        )
        return Math.abs(r - ocean[0]) + Math.abs(g - ocean[1]) + Math.abs(b - ocean[2]) > 60
      }

      // structured dotted-earth: a regular lat/lon grid, land cells only
      const landDots: [number, number][] = []
      const ROWS = 110
      const COLS = 220
      for (let row = 0; row < ROWS; row++) {
        const lat = ((row + 0.5) / ROWS - 0.5) * Math.PI
        for (let col = 0; col < COLS; col++) {
          const lon = ((col + 0.5) / COLS - 0.5) * Math.PI * 2
          if (isLand(lat, lon)) landDots.push([lat, lon])
        }
      }
      if (!landDots.length) return
      for (let i = 0; i < count; i++) {
        const [lat, lon] = landDots[i % landDots.length]
        spherePoint(i * 3, lat, lon)
        land[i] = 1
      }
      geometry.attributes.aGlobe.needsUpdate = true
      geometry.attributes.aLand.needsUpdate = true
    }

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uMix: { value: reduce ? 0.15 : 0 },
        uGlobe: { value: 0 },
        uCardsMix: { value: 0 },
        uCards: {
          value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()],
        },
        uHole: { value: 0 },
        uHoleC: { value: new THREE.Vector2(0, 0) },
        uHoleR: { value: new THREE.Vector2(0.2, 0.2) },
        uNdcC: { value: new THREE.Vector2(0, 0) },
        uNdcR: { value: new THREE.Vector2(0.2, 0.2) },
        uTime: { value: 0 },
        uOpacity: { value: 0.95 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    points.position.set(1.5, -0.15, 0)
    scene.add(points)

    camera.position.set(0, 1.6, 2.3)
    camera.lookAt(points.position)

    // ── render loop ──────────────────────────────────────────
    let frame = 0
    let mix = 0
    let globeMix = 0
    let cardsMix = 0
    let holeMix = 0
    const clock = new THREE.Clock()

    const tick = () => {
      const dt = clock.getDelta()
      material.uniforms.uTime.value += dt
      if (!reduce) {
        points.rotation.y += dt * (0.05 - mix * 0.035)

        const target = Math.min(1, window.scrollY / (window.innerHeight * 1.25))
        mix += (target - mix) * 0.06
        material.uniforms.uMix.value = mix
        material.uniforms.uOpacity.value = 0.9 - mix * 0.68
        camera.position.z = 2.3 + mix * 1.6
        camera.position.y = 1.6 + mix * 0.7
        camera.lookAt(points.position)

        // earth assembly: driven by how centered the anchor is in the viewport
        const anchor = document.getElementById('earth-anchor')
        let globeTarget = 0
        if (anchor) {
          const rect = anchor.getBoundingClientRect()
          const vh = window.innerHeight
          if (rect.bottom > 0 && rect.top < vh) {
            const cy = rect.top + rect.height / 2
            const t = Math.max(0, Math.min(1, 1 - Math.abs(cy - vh * 0.5) / (vh * 0.62)))
            // plateau: fully assembled well before perfectly centered
            const x = Math.max(0, Math.min(1, (t - 0.25) / 0.5))
            globeTarget = x * x * (3 - 2 * x)
          }
          if (globeTarget > 0.01) {
            const cx = rect.left + rect.width / 2
            const cy = rect.top + rect.height / 2
            const rPx = Math.min(rect.width, rect.height) * 0.42
            material.uniforms.uNdcC.value.set((cx / window.innerWidth) * 2 - 1, -(cy / vh) * 2 + 1)
            material.uniforms.uNdcR.value.set((rPx * 2) / window.innerWidth, (rPx * 2) / vh)
          }
        }
        globeMix += (globeTarget - globeMix) * 0.07
        material.uniforms.uGlobe.value = globeMix

        // card frames: the faded particles regroup around the lab cards
        let cardsTarget = 0
        const cardEls = document.querySelectorAll('#lab-cards .group')
        if (cardEls.length === 4) {
          const vw = window.innerWidth
          const vh = window.innerHeight
          const grid = document.getElementById('lab-cards')!.getBoundingClientRect()
          const overlap = Math.max(0, Math.min(grid.bottom, vh) - Math.max(grid.top, 0))
          const t = Math.max(0, Math.min(1, overlap / (vh * 0.72)))
          const x = Math.max(0, Math.min(1, (t - 0.3) / 0.5))
          cardsTarget = x * x * (3 - 2 * x)
          if (cardsTarget > 0.01) {
            cardEls.forEach((el, i) => {
              const r = el.getBoundingClientRect()
              const cx = ((r.left + r.width / 2) / vw) * 2 - 1
              const cy = -((r.top + r.height / 2) / vh) * 2 + 1
              material.uniforms.uCards.value[i].set(cx, cy, (r.width / 2 + 7) * (2 / vw), (r.height / 2 + 7) * (2 / vh))
            })
          }
        }
        cardsMix += (cardsTarget - cardsMix) * 0.07
        material.uniforms.uCardsMix.value = cardsMix

        // black hole: the field collapses below the footer
        const holeAnchor = document.getElementById('blackhole-anchor')
        let holeTarget = 0
        if (holeAnchor) {
          const rect = holeAnchor.getBoundingClientRect()
          const vh = window.innerHeight
          if (rect.bottom > 0 && rect.top < vh) {
            const cy = rect.top + rect.height / 2
            const t = Math.max(0, Math.min(1, 1 - Math.abs(cy - vh * 0.55) / (vh * 0.75)))
            const x = Math.max(0, Math.min(1, (t - 0.2) / 0.45))
            holeTarget = x * x * (3 - 2 * x)
          }
          if (holeTarget > 0.01) {
            const cx = rect.left + rect.width / 2
            // center sits in the lower third so the lensed dome rises behind the content
            const cyHole = rect.top + rect.height * 0.64
            const rPx = rect.height * 0.55
            material.uniforms.uHoleC.value.set((cx / window.innerWidth) * 2 - 1, -(cyHole / vh) * 2 + 1)
            material.uniforms.uHoleR.value.set((rPx * 2) / window.innerWidth, (rPx * 2) / vh)
          }
        }
        holeMix += (holeTarget - holeMix) * 0.07
        material.uniforms.uHole.value = holeMix
      }
      renderer.render(scene, camera)
      frame = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className={className} aria-hidden="true" />
}
