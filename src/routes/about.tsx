import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About - React Vite Template' },
      {
        name: 'description',
        content: 'Learn about this React + Vite template with modern development tools and best practices'
      },
      { property: 'og:title', content: 'About - React Vite Template' },
      {
        property: 'og:description',
        content: 'Learn about this React + Vite template with modern development tools and best practices'
      },
      { property: 'og:url', content: 'https://lephenix47.github.io/React_Vite-template/about' },
      { name: 'twitter:title', content: 'About - React Vite Template' },
      {
        name: 'twitter:description',
        content: 'Learn about this React + Vite template with modern development tools and best practices'
      },
    ],
  }),
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>About This Template</h1>

      <p>
        This is a modern React template built with cutting-edge tools and best practices.
      </p>

      <h2>Tech Stack</h2>
      <ul>
        <li><strong>React 19</strong> - UI library</li>
        <li><strong>Vite 6</strong> - Build tool</li>
        <li><strong>TypeScript 5</strong> - Type safety</li>
        <li><strong>SASS</strong> - Styling with variables and mixins</li>
        <li><strong>TanStack Router</strong> - File-based routing with type-safe navigation</li>
        <li><strong>TanStack Query</strong> - Data fetching and caching</li>
        <li><strong>Zustand</strong> - Lightweight state management</li>
        <li><strong>Zod</strong> - Schema validation</li>
        <li><strong>GSAP</strong> - Professional-grade animations</li>
        <li><strong>Bun</strong> - Fast JavaScript runtime</li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>🎨 Theme switching (Light/Dark/System)</li>
        <li>📱 Responsive design</li>
        <li>🚀 Optimized build with code splitting</li>
        <li>🔍 SEO-friendly with per-route meta tags</li>
        <li>♿ Accessibility best practices</li>
        <li>💅 Modern CSS with CSS variables</li>
        <li>🧪 Ready for testing setup</li>
      </ul>

      <p style={{ marginTop: '2rem' }}>
        <Link to="/">← Back to Home</Link>
      </p>
    </div>
  );
}
