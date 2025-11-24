import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import vertexShader from '@/shaders/triangle.vert';
import fragmentShader from '@/shaders/triangle.frag';

export function TriangleScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create triangle geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0.0, 1.0, 0.0,   // Top vertex
      -1.0, -1.0, 0.0, // Bottom left vertex
      1.0, -1.0, 0.0   // Bottom right vertex
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    // Create shader material using our custom shaders
    // Using RawShaderMaterial to have full control without Three.js injecting code
    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
    });

    // Create mesh and add to scene
    const triangle = new THREE.Mesh(geometry, material);
    scene.add(triangle);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Rotate the triangle for some visual interest
      triangle.rotation.z += 0.01;

      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    />
  );
}
