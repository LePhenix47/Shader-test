import { Link, useRouter, useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/404')({
  head: () => ({
    meta: [
      { title: '404 - Page Not Found' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: NotFoundComponent,
});

function NotFoundComponent() {
  const router = useRouter();
  const navigate = useNavigate();

  const goBack = () => {
    // Check if we can safely go back in history
    // Since we used replace: true when navigating to /404,
    // going back should take us to the last valid route
    if (window.history.length > 1) {
      // Use router.history.back() which is async and doesn't reload
      router.history.back();
    } else {
      // No history, navigate to home
      navigate({ to: '/' });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '6rem', margin: '0', color: 'var(--color-primary)' }}>
        404
      </h1>
      <h2 style={{ fontSize: '2rem', margin: '1rem 0', color: 'var(--color-secondary)' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--color-secondary)' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={goBack}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: 'var(--color-blue-500)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-blue-600)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-blue-500)')}
        >
          ← Go Back
        </button>

        <Link
          to="/"
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--color-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'background-color 0.2s',
          }}
        >
          Home →
        </Link>
      </div>
    </div>
  );
}
