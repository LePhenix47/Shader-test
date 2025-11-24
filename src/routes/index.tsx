import { createFileRoute, Link } from '@tanstack/react-router';
import { ExampleComponent } from '@/components/ExampleComponent';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Home - React Vite Template' },
      {
        name: 'description',
        content: 'Welcome to React + Vite template with TanStack Router, TanStack Query, Zustand, Zod, GSAP, and theme switching'
      },
      { property: 'og:title', content: 'Home - React Vite Template' },
      {
        property: 'og:description',
        content: 'Welcome to React + Vite template with TanStack Router, TanStack Query, Zustand, Zod, GSAP, and theme switching'
      },
      { property: 'og:url', content: 'https://lephenix47.github.io/React_Vite-template/' },
      { name: 'twitter:title', content: 'Home - React Vite Template' },
      {
        name: 'twitter:description',
        content: 'Welcome to React + Vite template with TanStack Router, TanStack Query, Zustand, Zod, GSAP, and theme switching'
      },
    ],
  }),
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div>
      <ThemeToggle />

      <h2>Welcome to React + Vite + TypeScript Template</h2>

      <p style={{ marginBottom: '1rem' }}>
        <Link to="/about" style={{ color: 'var(--color-blue-500)', textDecoration: 'underline' }}>
          Learn more about this template →
        </Link>
      </p>

      <p>Your app is ready to go with:</p>
      <ul>
        <li>TanStack Router - File-based routing</li>
        <li>TanStack Query - Data fetching & caching</li>
        <li>Zustand - State management</li>
        <li>Zod - Schema validation</li>
        <li>GSAP - Animations</li>
        <li>SASS - Styling</li>
        <li>Theme Switching - Light/Dark/System modes</li>
      </ul>

      <ExampleComponent />
    </div>
  );
}
