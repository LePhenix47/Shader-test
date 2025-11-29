import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import vertexShader from "@/shaders/triangle.vert";
import fragmentShader from "@/shaders/triangle.frag";

export function TriangleScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rAFId = useRef<number>(0);

  // Setup geometry with vertices, colors, and indices
  function createGeometry() {
    const geometry = new THREE.BufferGeometry();

    // prettier-ignore
    const vertices = new Float32Array([
      -1.0, -1.0, 0.0,  // 0: Bottom-left
       1.0, -1.0, 0.0,  // 1: Bottom-right
       1.0,  1.0, 0.0,  // 2: Top-right
      -1.0,  1.0, 0.0   // 3: Top-left
    ]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

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
      2, 3, 0,  // Second triangle
      0, 1, 2   // First triangle
    ]);
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    return geometry;
  }

  // Create shader material with uniforms
  function createMaterial() {
    return new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0.0 },
        u_resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        u_mouse: { value: new THREE.Vector2(0, 0) },
      },
    });
  }

  // Setup scene and camera
  function createScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 0;

    return { scene, camera };
  }

  // Setup renderer
  function createRenderer(canvas: HTMLCanvasElement) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    return renderer;
  }

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js components
    const { scene, camera } = createScene();
    const renderer = createRenderer(canvasRef.current);
    const geometry = createGeometry();
    const material = createMaterial();
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    // AbortController for event listeners
    const abortController = new AbortController();

    // Smooth mouse tracking with GSAP
    const mousePos = { x: 0, y: 0 };
    const quickX = gsap.quickTo(mousePos, "x", {
      duration: 0.25,
      ease: "power2.out",
    });
    const quickY = gsap.quickTo(mousePos, "y", {
      duration: 0.25,
      ease: "power2.out",
    });

    // Animation loop
    function animate() {
      try {
        material.uniforms.u_time.value += 0.01;
        material.uniforms.u_mouse.value.set(mousePos.x, mousePos.y);
        renderer.render(scene, camera);
        rAFId.current = requestAnimationFrame(animate);
      } catch (error) {
        cancelAnimationFrame(rAFId.current);
      }
    }
    animate();

    // Handle window resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.u_resolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    }
    window.addEventListener("resize", handleResize, {
      signal: abortController.signal,
    });

    // Handle pointer movement (mouse, touch, stylus)
    function handlePointerMove(event: PointerEvent) {
      quickX(event.clientX);
      quickY(window.innerHeight - event.clientY);
    }
    window.addEventListener("pointermove", handlePointerMove, {
      signal: abortController.signal,
    });

    // Cleanup
    return () => {
      cancelAnimationFrame(rAFId.current);
      abortController.abort();
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
