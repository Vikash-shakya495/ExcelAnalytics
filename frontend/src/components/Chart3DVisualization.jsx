import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Chart3DVisualization({ data }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = mountRef.current.clientWidth;
    const height = 400;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Create bars for data
    const maxVal = Math.max(...data.map(d => Number(d.value) || 0));
    const barWidth = 1;
    const gap = 0.5;

    data.forEach((d, i) => {
      const heightVal = (Number(d.value) || 0) / maxVal * 20;
      const geometry = new THREE.BoxGeometry(barWidth, heightVal, barWidth);
      const material = new THREE.MeshBasicMaterial({ color: 0x0077ff });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = i * (barWidth + gap);
      bar.position.y = heightVal / 2 - 10;
      scene.add(bar);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [data]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '400px' }} />
  );
}
