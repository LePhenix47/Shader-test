import { useEffect, useRef } from "react";
import * as THREE from "three";
import vertexShader from "@/shaders/triangle.vert";
import fragmentShader from "@/shaders/triangle.frag";

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

    // prettier-ignore
    const vertices = new Float32Array([
      -0.5, -0.5, 0.0,  // 0: Bottom-left
       0.5, -0.5, 0.0,  // 1: Bottom-right
       0.5,  0.5, 0.0,  // 2: Top-right
      -0.5,  0.5, 0.0   // 3: Top-left
    ]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    // Add vertex colors
    // prettier-ignore
    const colors = new Float32Array([
      1.0, 0.0, 0.0,  // 0: Red (bottom-left)
      0.0, 1.0, 0.0,  // 1: Green (bottom-right)
      0.0, 0.0, 1.0,  // 2: Blue (top-right)
      1.0, 1.0, 0.0   // 3: Yellow (top-left)
    ]);
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // prettier-ignore
    const indices = new Uint16Array([
      2, 3, 0,   // Second triangle - reuses vertices 0 and 2!
      0, 1, 2,  // First triangle
    ]);

    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // Create shader material using our custom shaders
    // Using RawShaderMaterial to have full control without Three.js injecting code
    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
    });

    // Create mesh and add to scene
    const triangle = new THREE.Mesh(geometry, material);
    scene.add(triangle);

    // Render the scene once
    renderer.render(scene, camera);

    // Handle window resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera); // Re-render after resize
    }
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    />
  );
}
