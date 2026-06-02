# Session Notes — 2026-05-28 S02
## Paso Del Norte: Truck & Equipment Sales

---

## Work Done This Session

### particle-truck.html — Loading Screen (3D Semi Truck)

#### Moon + Environment Map
- Added a `PMREMGenerator`-based environment map baked from a Canvas 2D equirectangular texture
  - Sky: deep navy gradient, amber horizon band, cool moon patch, 60 star glints
  - Processed with `pmrem.fromEquirectangular()` → `scene.environment`
  - `MeshStandardMaterial` picks up env map automatically via `scene.environment`
- `envMapIntensity`: body=2.2, chrome=3.5, glass=2.8 — gives dark panels amber horizon streak, near-mirror chrome, sky-reflecting glass
- Moon: `SphereGeometry(1.4)` with `emissive: #8898cc`, position `(10, 7, -18)` (lowered from Y=16 to be visible in frame)
- Moon glow: custom GLSL additive billboard quad — exponential falloff + `smoothstep` edge mask + `discard` at d>=1 to eliminate the faded box artifact
- `moonLight`: `PointLight('#a8b8e0', 1.1)` casts cool-white moonlight across scene
- Moon glow billboards to camera each frame via `moonGlow.quaternion.copy(camera.quaternion)`
- `renderer.outputEncoding = THREE.sRGBEncoding` added

#### Starry Night Sky (replaced amber dust particles)
- 180 stars confined to top 46% of screen
- 4 color variants: warm golden, cool blue, blue-white, pure white — randomized per star
- Per-star twinkle via independent sine wave (speed, phase, amplitude)
- Larger stars get soft radial glow halo + 2-arm cross sparkle when bright
- **Wishing star**: fires every 7–16 seconds (first at 3.5–8.5s)
  - Diagonal streak 28–50° downward, gradient trail, glowing radial head, 8-point sparkle cross
  - Full fade-in/fade-out envelope via `fadeIn * fadeOut`

#### Terrain & Highway (3D scene bottom)
- Asphalt road plane: `PlaneGeometry(300, 5)`, dark `#111010`, centered on drive path
- Two dirt shoulders flanking road at Z ±4.5
- Yellow center dashes every 6 units, white edge lines at Z ±2.3
- `makeHighwaySign(x, z, w, h)` function: two tapered poles + crossbar + white border frame + dark green panel
  - Signs at X=14, 28, 44, Z=-3.8
- `makeMileMarker(x, z)` function: white post + black sign plate
  - Markers at X=6,14,22,30,38,46 along Z=+3.0 shoulder

#### Physics & Animation Fixes
- **Tire spinning**: `wheelMeshes` array collects meshes named wheel/tire/tyre/rim/axle; spun via `m.rotation.x = wheelAngle` each frame
- **Spring suspension**: `SPRING_K=70, SPRING_DAMP=8`; random bump impulses every 1.4–3.2s during idle; launch kick `suspVel += 0.06` on drive
- **groundOffset bug fixed**: `obj.position.y = -box2.min.y` was stored in `groundOffset` variable and applied every frame as `truck.position.y = groundOffset + suspY` — previously the render loop was zeroing out the seating offset
- **rotation.y removed**: `rotation.y = 5 * (Math.PI/180)` combined with `rotation.x = -Math.PI/2` in XYZ Euler order creates a compound world-space tilt (nose-down). Removed. Only `rotation.x = -Math.PI/2` + `rotation.z = Math.PI` needed.
- **Mouse parallax removed**: Camera is now fully locked; removed `camera.position.x/y = mouseX/Y` from render loop
- **Truck disappear**: Changed from 2000ms to 1000ms after drive trigger

---

## Current File State

### particle-truck.html Key Sections

**Scene setup order:**
1. Renderer (WebGL2, ACES, sRGB encoding, shadow PCFSoft)
2. PMREMGenerator env map (IIFE, runs once)
3. Camera at (-8, 3.5, 12), lookAt(0, 1.5, 0) — LOCKED, no mouse tilt
4. Lighting: AmbientLight #1a1208, DirectionalLight #f59e0b (key+shadow), DirectionalLight #c0d0e0 (rim)
5. Moon: sphere + GLSL glow quad + PointLight
6. Terrain: road + shoulders + dashes + edge lines + signs + mile markers
7. Truck state variables (truck, wheelMeshes, groundOffset, suspY/suspVel, driveX/driveXTarget, driving, driveTriggered)
8. Materials: bodyMat (metalness 0.85, envMapIntensity 2.2), chromeMat (metalness 1.0, envMapIntensity 3.5), glassMat (transparent, envMapIntensity 2.8)
9. OBJLoader: `assets/truck/truck.obj` — rotation.x=-π/2, rotation.z=π, groundOffset stored
10. Loading bar: 5 steps [18,42,65,83,100], triggers drive at 90%, green on complete
11. Starry night canvas (replaces dust): 180 stars top 46%, wishing star every 7-16s
12. Speed lines canvas: active during drive-out
13. Render loop: delta time → wheel spin → bump impulses → spring physics → position update → moon glow billboard

**Render loop truck block:**
```javascript
const dt = Math.min(t - prevT, 0.05);
prevT = t;
driveX += (driveXTarget - driveX) * 0.08;
wheelSpeed += (wheelSpeedTarget - wheelSpeed) * (driving ? 0.07 : 0.025);
wheelAngle += wheelSpeed * dt * 55;
wheelMeshes.forEach(m => { m.rotation.x = wheelAngle; });
// bump impulses (idle only)
// spring: force = -K*suspY - D*suspVel
truck.position.x = driveX;
truck.position.y = groundOffset + suspY;
// idle: gentle sway, camera.lookAt(0,1.5,0)
// driving: truck.rotation.z = Math.PI, camera.lookAt(0,1.5,0)
moonGlow.quaternion.copy(camera.quaternion);
renderer.render(scene, camera);
```

---

## Pending / Next Session

- **Wheel spin axis**: If wheels don't visibly spin, `m.rotation.x` may be wrong axis for this OBJ. Open browser console, log `child.name` in traverse to confirm mesh names. May need `.rotation.y` or `.rotation.z`.
- **Login/Signup/Profile pages**: On hold — user wants to design UI first
- **Firebase credentials**: Replace stubs in `js/data.js`
- **Real phone number**: Replace (832) 555-0180 in listings
- **Subscription tiers**: Tier 1 = limited doc downloads (5/day), Tier 2 = unlimited + live agent + Facebook Marketplace posting
- **Post Generator limits**: Daily post cap per tier, start loading button to send posts live
- **Signature pad**: Canvas draw for doc forms in docs.html
- **Facebook Marketplace integration**: Research API access for auto-posting

---

## Assets
- `assets/truck/truck.obj` — 9.9MB semi-truck OBJ (Z-up export)
- `assets/truck/truck.mtl` — 0 bytes (empty, custom Three.js materials used)
- `assets/truck/blank.jpg` — 0 bytes placeholder

## Admin
- PIN: 1025
- Location: Texas-based
- Previous summary: `landmark/CLAUDE_SUMMARY.md`
