import {
  AmbientLight, BoxGeometry, BufferGeometry, CanvasTexture, CatmullRomCurve3,
  DirectionalLight, DoubleSide, ExtrudeGeometry, Float32BufferAttribute, Group,
  Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, Scene, Shape,
  ShapeGeometry, SRGBColorSpace, TorusGeometry, Vector3, WebGLRenderer
} from './vendor/three/build/three.module.min.js';

const cardWidth = 2.48;
const cardHeight = 3.37;
const cardDepth = .068;
const paper = '#edeedf';
const dark = '#172c21';
const accent = '#ffbc8b';
const display = '"Barlow Condensed", "Arial Narrow", sans-serif';
const mono = '"JetBrains Mono", monospace';

function texture(width, height, paint) {
  const surface = document.createElement('canvas');
  surface.width = width;
  surface.height = height;
  paint(surface.getContext('2d'));
  const map = new CanvasTexture(surface);
  map.colorSpace = SRGBColorSpace;
  map.anisotropy = 4;
  return map;
}

function text(ctx, value, x, y, font, color, maxWidth = 664, align = 'left') {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(value, x, y, maxWidth);
}

function rule(ctx, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(52, y, 664, 2);
}

function croppedPhoto(ctx, image, x, y, width, height) {
  ctx.fillStyle = '#284635';
  ctx.fillRect(x, y, width, height);
  if (!image.naturalWidth) {
    text(ctx, 'RRT', x + width / 2, y + height / 2 + 64, `800 204px ${display}`, accent, width - 44, 'center');
    return;
  }
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const cropWidth = width / scale;
  const cropHeight = height / scale;
  // Keep the original portrait's hair and chin in the landscape badge window.
  ctx.drawImage(image, (image.naturalWidth - cropWidth) / 2, (image.naturalHeight - cropHeight) * .12,
    cropWidth, cropHeight, x, y, width, height);
}

function readFace(element) {
  return {
    brand: element.querySelector('.badge-heading b').textContent.trim(),
    label: element.querySelector('.badge-heading span').textContent.trim().toUpperCase(),
    foot: [...element.querySelectorAll('.badge-foot span')].map(span => span.textContent.trim())
  };
}

function lines(element) {
  return [...element.childNodes]
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent.trim().toUpperCase())
    .filter(Boolean);
}

function faceTextures(portrait) {
  const card = portrait.closest('figure');
  const front = card.querySelector('.badge-front');
  const back = card.querySelector('.badge-back');

  function paintFace(face, background, ink, ruleColor, paintBody) {
    const { brand, label, foot } = readFace(face);
    return texture(768, 1044, ctx => {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, 768, 1044);
      text(ctx, brand, 52, 119, `800 56px ${display}`, ink);
      text(ctx, label, 716, 115, `27px ${mono}`, ink, 310, 'right');
      rule(ctx, 140, ruleColor);
      paintBody(ctx);
      rule(ctx, 947, ruleColor);
      text(ctx, foot[0], 52, 994, `30px ${mono}`, ink);
      if (foot[1]) text(ctx, foot[1], 716, 994, `30px ${mono}`, ink, 320, 'right');
    });
  }

  const frontMap = paintFace(front, paper, dark, '#819181', ctx => {
    croppedPhoto(ctx, portrait, 52, 168, 664, 448);
    const name = lines(front.querySelector('.badge-name'));
    name.forEach((line, index) => text(ctx, line, 50, 721 + 95 * index, `800 116px ${display}`, dark));
    text(ctx, front.querySelector('.badge-role').textContent.trim(), 54, 893, '600 40px "Segoe UI", sans-serif', dark);
  });

  const backMap = paintFace(back, '#20382b', paper, '#839a85', ctx => {
    lines(back.querySelector('.badge-back-title')).forEach((line, index) => {
      text(ctx, line, 44, 325 + 124 * index, `800 152px ${display}`, accent);
    });
    [...back.querySelectorAll('li')].forEach((item, index) => {
      const y = 536 + 101 * index;
      rule(ctx, y, '#839a85');
      text(ctx, item.textContent.trim(), 52, y + 62, '600 39px "Segoe UI", sans-serif', paper);
    });
  });

  return [frontMap, backMap];
}

function roundedCard() {
  const x = cardWidth / 2;
  const y = cardHeight / 2;
  const radius = .124;
  const shape = new Shape();
  shape.moveTo(-x + radius, -y);
  shape.lineTo(x - radius, -y);
  shape.quadraticCurveTo(x, -y, x, -y + radius);
  shape.lineTo(x, y - radius);
  shape.quadraticCurveTo(x, y, x - radius, y);
  shape.lineTo(-x + radius, y);
  shape.quadraticCurveTo(-x, y, -x, y - radius);
  shape.lineTo(-x, -y + radius);
  shape.quadraticCurveTo(-x, -y, -x + radius, -y);
  return shape;
}

function makeBody(portrait) {
  const shape = roundedCard();
  const body = new ExtrudeGeometry(shape, { depth: cardDepth, bevelThickness: .025, bevelSize: .024, bevelSegments: 3 });
  body.translate(0, 0, -cardDepth / 2);
  const badge = new Group();
  badge.add(new Mesh(body, new MeshStandardMaterial({ color: '#bac2ae', roughness: .3, metalness: .23 })));

  const face = new ShapeGeometry(shape);
  const positions = face.getAttribute('position');
  const uv = face.getAttribute('uv');
  for (let i = 0; i < positions.count; i++) {
    uv.setXY(i, positions.getX(i) / cardWidth + .5, positions.getY(i) / cardHeight + .5);
  }

  const [front, back] = faceTextures(portrait);
  for (const [map, direction] of [[front, 1], [back, -1]]) {
    const surface = new Mesh(face, new MeshBasicMaterial({ map }));
    surface.rotation.y = direction === 1 ? 0 : Math.PI;
    surface.position.z = direction * (cardDepth / 2 + .026);
    badge.add(surface);
  }
  return badge;
}

function makeRibbon() {
  const spine = new CatmullRomCurve3([
    new Vector3(0, 1.89, .012),
    new Vector3(.06, 2.19, -.03),
    new Vector3(.27, 2.58, -.16),
    new Vector3(.57, 3.07, -.06),
    new Vector3(.75, 3.83, -.17)
  ]);
  const positions = [];
  const uv = [];
  const indices = [];
  const steps = 38;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = spine.getPointAt(t);
    const tangent = spine.getTangentAt(t);
    const cross = new Vector3(1, 0, -.86 * Math.sin(t * Math.PI)).normalize();
    cross.addScaledVector(tangent, -cross.dot(tangent)).normalize().multiplyScalar(.225);
    positions.push(...p.clone().sub(cross).toArray(), ...p.clone().add(cross).toArray());
    uv.push(0, t, 1, t);
    if (i < steps) {
      const n = i * 2;
      indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const fabric = texture(128, 1024, ctx => {
    ctx.fillStyle = '#c88961';
    ctx.fillRect(0, 0, 128, 1024);
    ctx.fillStyle = '#91563b';
    ctx.fillRect(0, 0, 7, 1024);
    ctx.fillRect(121, 0, 7, 1024);
    ctx.fillStyle = '#f8c5a0';
    ctx.fillRect(9, 0, 2, 1024);
    ctx.fillRect(117, 0, 2, 1024);
    for (let y = 0; y < 1024; y += 3) {
      ctx.fillStyle = y % 2 ? '#3f22162b' : '#ffffff23';
      ctx.fillRect(0, y, 128, 1);
    }
  });
  return new Mesh(geometry, new MeshStandardMaterial({ map: fabric, side: DoubleSide, roughness: .87 }));
}

function hardware() {
  const clip = new Group();
  const metal = new MeshStandardMaterial({ color: '#a5b4a8', roughness: .27, metalness: .48 });
  const rubber = new MeshStandardMaterial({ color: '#2d3c33', roughness: .6 });
  const loop = new Mesh(new TorusGeometry(.145, .041, 10, 36), metal);
  loop.position.set(0, 1.71, .04);
  loop.scale.y = 1.27;
  const end = new Mesh(new BoxGeometry(.458, .146, .105), rubber);
  end.position.set(0, 1.93, .006);
  const rivet = new Mesh(new TorusGeometry(.064, .019, 8, 22), metal);
  rivet.position.set(0, 1.55, .075);
  const reverseRivet = rivet.clone();
  reverseRivet.position.z = -.075;
  clip.add(loop, end, rivet, reverseRivet);
  return clip;
}

export function createBadgeScene(canvas, context, portrait) {
  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  const stage = canvas.parentElement;
  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, .1, 40);
  camera.position.z = 8.4;

  const badge = makeBody(portrait);
  badge.position.y = -.41;
  badge.add(makeRibbon(), hardware());
  const rig = new Group();
  rig.add(badge);
  scene.add(rig, new AmbientLight('#e0e8df', 2.05));
  const key = new DirectionalLight('#ffffed', 2.6);
  key.position.set(-3, 5, 6);
  const rim = new DirectionalLight('#c1debb', 1.45);
  rim.position.set(4, 2, -3);
  scene.add(key, rim);

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let side = false;
  let flipFrame = 0;
  let drawFrame = 0;
  let aimFrame = 0;
  let aimTime;
  let width = 0;
  let height = 0;
  let drag;
  let scrollProgress = 0;
  let flipLift = 0;
  const aim = { x: 0, y: 0 };
  const tilt = { x: 0, y: 0 };

  function draw() {
    if (canvas.hidden || context.isContextLost()) return;
    const nextWidth = stage.clientWidth;
    const nextHeight = stage.clientHeight;
    if (!nextWidth || !nextHeight) return;
    if (width !== nextWidth || height !== nextHeight) {
      width = nextWidth;
      height = nextHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }
    renderer.render(scene, camera);
  }

  function requestDraw() {
    if (drawFrame) return;
    drawFrame = requestAnimationFrame(() => {
      drawFrame = 0;
      draw();
    });
  }

  function updateRig() {
    const arc = Math.sin(scrollProgress * Math.PI);
    rig.rotation.set(
      .17 * arc - tilt.y * .145,
      Math.sin(scrollProgress * 2 * Math.PI) * 1.07 + tilt.x * .21,
      .31 * arc + tilt.x * .045
    );
    rig.position.set(-.42 * arc, .43 * arc + flipLift, -.25 * arc);
    rig.scale.setScalar(1 + .2 * arc);
  }

  function updateAim(now) {
    aimFrame = 0;
    if (canvas.hidden) {
      tilt.x = aim.x = 0;
      tilt.y = aim.y = 0;
      aimTime = undefined;
      return;
    }
    const elapsed = Math.min(now - (aimTime ?? now - 16.7), 64);
    const amount = 1 - Math.exp(-elapsed / 85);
    for (const axis of ['x', 'y']) {
      const distance = aim[axis] - tilt[axis];
      tilt[axis] = Math.abs(distance) < .003 ? aim[axis] : tilt[axis] + distance * amount;
    }
    updateRig();
    requestDraw();
    if (tilt.x !== aim.x || tilt.y !== aim.y) {
      aimTime = now;
      aimFrame = requestAnimationFrame(updateAim);
    } else {
      aimTime = undefined;
    }
  }

  function pointAt(x, y) {
    if (aim.x === x && aim.y === y) return;
    aim.x = x;
    aim.y = y;
    if (!aimFrame) aimFrame = requestAnimationFrame(updateAim);
  }

  function showSide(back, animate = true) {
    side = back;
    drag = null;
    cancelAnimationFrame(flipFrame);
    const home = { x: .10, y: back ? Math.PI - .23 : -.23, z: back ? .15 : -.18 };
    if (!animate || motion.matches) {
      flipLift = 0;
      badge.rotation.set(home.x, home.y, home.z);
      updateRig();
      draw();
      return;
    }

    const start = badge.rotation.clone();
    const startLift = flipLift;
    const startTime = performance.now();
    function turn(now) {
      if (canvas.hidden) return;
      const progress = motion.matches ? 1 : Math.min((now - startTime) / 610, 1);
      if (progress === 1) {
        flipLift = 0;
        badge.rotation.set(home.x, home.y, home.z);
        updateRig();
        requestDraw();
        return;
      }
      const t = (1 - Math.cos(progress * Math.PI)) / 2;
      flipLift = startLift * (1 - t) + Math.sin(progress * Math.PI) * .15;
      badge.rotation.set(start.x + (home.x - start.x) * t, start.y + (home.y - start.y) * t, start.z + (home.z - start.z) * t);
      updateRig();
      requestDraw();
      flipFrame = requestAnimationFrame(turn);
    }
    flipFrame = requestAnimationFrame(turn);
  }

  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0 || drag) return;
    cancelAnimationFrame(flipFrame);
    pointAt(0, 0);
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, pitch: badge.rotation.x, yaw: badge.rotation.y };
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointermove', event => {
    if (drag?.id === event.pointerId) {
      const yaw = (event.clientX - drag.x) / Math.max(1, width) * 3.1;
      const pitch = (event.clientY - drag.y) / Math.max(1, height) * 2;
      badge.rotation.y = drag.yaw + Math.max(-.9, Math.min(.9, yaw));
      badge.rotation.x = drag.pitch + Math.max(-.55, Math.min(.55, pitch));
      requestDraw();
    } else if (!drag && event.pointerType === 'mouse' && !motion.matches) {
      const bounds = canvas.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / Math.max(1, bounds.width) * 2 - 1;
      const y = (event.clientY - bounds.top) / Math.max(1, bounds.height) * 2 - 1;
      pointAt(x, y);
    }
  });
  canvas.addEventListener('pointerleave', () => pointAt(0, 0));

  const finishDrag = event => {
    if (drag?.id === event.pointerId) showSide(side);
  };
  canvas.addEventListener('pointerup', finishDrag);
  canvas.addEventListener('pointercancel', finishDrag);
  canvas.addEventListener('lostpointercapture', finishDrag);
  const observer = new ResizeObserver(requestDraw);
  observer.observe(stage);

  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    cancelAnimationFrame(aimFrame);
    aimFrame = 0;
    aimTime = undefined;
    tilt.x = aim.x = 0;
    tilt.y = aim.y = 0;
    showSide(side, false);
  });

  function setScrollProgress(progress) {
    scrollProgress = progress;
    updateRig();
    requestDraw();
  }

  return { showSide, setScrollProgress };
}
