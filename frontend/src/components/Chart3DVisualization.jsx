// Chart3DVisualization.jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Chart3DVisualization({ data, xAxisColumn, yAxisColumn }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    // Validate inputs
    if (
      !data ||
      data.length === 0 ||
      !xAxisColumn ||
      !yAxisColumn ||
      !mountRef.current
    )
      return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = 400;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 20, 50);
    camera.lookAt(0, 10, 0);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Grid helper
    scene.add(new THREE.GridHelper(100, 50, 0xcccccc, 0xdddddd));

    // Prepare data safely
    const filteredData = data.map((row) => {
      let label = row[xAxisColumn];
      if (label === null || label === undefined) label = '';
      else label = label.toString();

      let val = Number(row[yAxisColumn]);
      if (isNaN(val)) val = 0;

      return { label, value: val };
    });

    // Calculate max value for scaling bars (avoid zero max)
    const maxVal = Math.max(...filteredData.map((d) => d.value), 1);

    // Bar dimensions
    const barWidth = 2;
    const gap = 1;
    const totalWidth = filteredData.length * (barWidth + gap);
    const startX = -totalWidth / 2 + (barWidth + gap) / 2;

    // Function to create canvas texture for labels and values
    const createTextCanvas = (text) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '20px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      return canvas;
    };

    // Add bars and labels to scene
    filteredData.forEach((item, i) => {
      const heightVal = (item.value / maxVal) * 25;

      // Create bar geometry and material
      const geometry = new THREE.BoxGeometry(barWidth, heightVal, barWidth);
      const material = new THREE.MeshStandardMaterial({ color: 0x1e3a8a });
      const bar = new THREE.Mesh(geometry, material);

      bar.position.x = startX + i * (barWidth + gap);
      bar.position.y = heightVal / 2;
      scene.add(bar);

      // Value label (above bar)
      const valueText = item.value.toFixed(0);
      const valueCanvas = createTextCanvas(valueText);
      const valueTexture = new THREE.CanvasTexture(valueCanvas);
      const valueSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: valueTexture, transparent: true })
      );
      valueSprite.scale.set(4, 1, 1);
      valueSprite.position.set(bar.position.x, heightVal + 1.5, 0);
      scene.add(valueSprite);

      // X-axis label (below bar)
      const labelCanvas = createTextCanvas(item.label);
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: labelTexture, transparent: true })
      );
      labelSprite.scale.set(4, 1, 1);
      labelSprite.position.set(bar.position.x, -1.5, 0);
      scene.add(labelSprite);
    });

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      scene.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount or dependency change
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        mount.removeChild(rendererRef.current.domElement);
        rendererRef.current = null;
      }
    };
  }, [data, xAxisColumn, yAxisColumn]);

  return (
    <div
      ref={mountRef}
      className="rounded-xl shadow-lg border border-gray-300"
      style={{ width: '100%', height: '400px', background: 'transparent' }}
    />
  );
}
