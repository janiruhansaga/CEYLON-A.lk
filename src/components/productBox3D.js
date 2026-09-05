/* ==========================================================================
   Section 08 — Interactive 3D Product Box (Three.js WebGL)
   ========================================================================== */

import * as THREE from 'three';

export function initProductBox3D() {
  const canvas = document.getElementById('product-canvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  let width = container.clientWidth;
  let height = container.clientHeight;

  // Scene setup
  const scene = new THREE.Scene();

  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0.5, 4.5);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xe8d098, 2.5);
  mainLight.position.set(5, 8, 5);
  scene.add(mainLight);

  const goldRimLight = new THREE.DirectionalLight(0xc9a865, 3.0);
  goldRimLight.position.set(-5, 2, -4);
  scene.add(goldRimLight);

  const fillLight = new THREE.PointLight(0x0e2319, 2.0, 10);
  fillLight.position.set(0, -2, 2);
  scene.add(fillLight);

  // Create Luxury Box Mesh
  const boxGroup = new THREE.Group();

  // Box Dimensions (Rectangular packaging: W: 1.8, H: 0.9, D: 1.2)
  const geometry = new THREE.BoxGeometry(1.8, 0.9, 1.2);

  // Canvas texture for Box front label
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 1024;
  labelCanvas.height = 512;
  const lCtx = labelCanvas.getContext('2d');

  // Background deep green
  lCtx.fillStyle = '#091710';
  lCtx.fillRect(0, 0, 1024, 512);

  // Gold border frame
  lCtx.strokeStyle = '#C9A865';
  lCtx.lineWidth = 12;
  lCtx.strokeRect(30, 30, 964, 452);
  lCtx.lineWidth = 4;
  lCtx.strokeRect(45, 45, 934, 422);

  // Gold text
  lCtx.fillStyle = '#C9A865';
  lCtx.textAlign = 'center';

  lCtx.font = 'bold 54px "Cinzel Decorative", serif';
  lCtx.fillText('CEYLONÉA', 512, 180);

  lCtx.font = '400 28px "Cormorant Garamond", serif';
  lCtx.fillStyle = '#E8D098';
  lCtx.fillText('CEYLON CINNAMON INFUSION STICKS', 512, 250);

  lCtx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  lCtx.fillStyle = '#AFA898';
  lCtx.fillText('100% PURE CEYLON CINNAMON  |  20 STICKS  |  40g', 512, 340);

  lCtx.font = 'italic 20px "Cormorant Garamond", serif';
  lCtx.fillStyle = '#C9A865';
  lCtx.fillText('PRODUCT OF SRI LANKA', 512, 400);

  const labelTexture = new THREE.CanvasTexture(labelCanvas);

  // Material for sides
  const sideMaterial = new THREE.MeshStandardMaterial({
    color: 0x091710,
    roughness: 0.25,
    metalness: 0.3
  });

  // Material for front with label texture
  const frontMaterial = new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 0.2,
    metalness: 0.4
  });

  const materials = [
    sideMaterial, // Right
    sideMaterial, // Left
    sideMaterial, // Top
    sideMaterial, // Bottom
    frontMaterial, // Front
    sideMaterial  // Back
  ];

  const boxMesh = new THREE.Mesh(geometry, materials);
  boxGroup.add(boxMesh);

  // Add Gold Foil Trim Accent Line around middle
  const trimGeo = new THREE.BoxGeometry(1.82, 0.04, 1.22);
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xc9a865,
    roughness: 0.1,
    metalness: 0.9
  });
  const trimMesh = new THREE.Mesh(trimGeo, trimMat);
  trimMesh.position.y = 0;
  boxGroup.add(trimMesh);

  // Floating Cinnamon Quills around box
  const quills = [];
  const quillGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 16);
  const quillMat = new THREE.MeshStandardMaterial({
    color: 0x8c492e,
    roughness: 0.7,
    metalness: 0.1
  });

  for (let i = 0; i < 4; i++) {
    const quill = new THREE.Mesh(quillGeo, quillMat);
    quill.rotation.x = Math.PI / 2 + (Math.random() - 0.5);
    quill.rotation.z = (Math.random() - 0.5) * 1.5;
    quill.position.set(
      (Math.random() - 0.5) * 2.8,
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 1.2
    );
    quills.push({ mesh: quill, baseY: quill.position.y, speed: 0.01 + Math.random() * 0.01 });
    boxGroup.add(quill);
  }

  scene.add(boxGroup);

  // User Interaction Dragging
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotationY = 0.4;
  let targetRotationX = 0.2;

  function onPointerDown(e) {
    isDragging = true;
    previousMousePosition = {
      x: e.clientX || e.touches[0].clientX,
      y: e.clientY || e.touches[0].clientY
    };
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (clientX === undefined) return;

    const deltaX = clientX - previousMousePosition.x;
    const deltaY = clientY - previousMousePosition.y;

    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;

    previousMousePosition = { x: clientX, y: clientY };
  }

  function onPointerUp() {
    isDragging = false;
  }

  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  canvas.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (!isDragging) {
      targetRotationY += 0.004; // Smooth auto rotation
    }

    boxGroup.rotation.y += (targetRotationY - boxGroup.rotation.y) * 0.05;
    boxGroup.rotation.x += (targetRotationX - boxGroup.rotation.x) * 0.05;
    boxGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

    quills.forEach(q => {
      q.mesh.position.y = q.baseY + Math.sin(elapsedTime * 2 + q.mesh.position.x) * 0.05;
      q.mesh.rotation.y += 0.005;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    if (container) {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  });
}
