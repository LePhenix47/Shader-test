import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useExampleStore } from '@/stores/exampleStore';

export function ExampleComponent() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { count, increment, decrement, reset } = useExampleStore();

  useEffect(() => {
    // GSAP animation example
    if (boxRef.current) {
      gsap.from(boxRef.current, {
        duration: 1,
        opacity: 0,
        y: -50,
        ease: 'power2.out',
      });
    }
  }, []);

  const handleAnimate = () => {
    if (boxRef.current) {
      gsap.to(boxRef.current, {
        duration: 0.5,
        rotation: '+=360',
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Example Component</h3>

      <div
        ref={boxRef}
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: '#007bff',
          margin: '1rem 0',
          borderRadius: '8px',
        }}
      />

      <button onClick={handleAnimate} style={{ marginBottom: '1rem' }}>
        Animate Box (GSAP)
      </button>

      <div>
        <h4>Zustand Counter: {count}</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={increment}>+</button>
          <button onClick={decrement}>-</button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  );
}
