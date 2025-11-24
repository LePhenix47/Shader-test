import { useEffect } from "react";
import {
  createRootRoute,
  Outlet,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAppStore } from "@/stores/useAppStore";
import env from "@env";

function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{ fontSize: "6rem", margin: "0", color: "var(--color-primary)" }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "2rem",
          margin: "1rem 0",
          color: "var(--color-secondary)",
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          fontSize: "1.2rem",
          marginBottom: "2rem",
          color: "var(--color-secondary)",
        }}
      >
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          backgroundColor: "var(--color-blue-500)",
          color: "white",
          border: "none",
          borderRadius: "4px",
          textDecoration: "none",
          display: "inline-block",
          transition: "background-color 0.2s",
        }}
      >
        Go to Home →
      </Link>
    </div>
  );
}

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { httpEquiv: "X-UA-Compatible", content: "ie=edge" },
      { name: "robots", content: "index, follow" },
      // Default meta tags (will be overridden by child routes)
      { title: "React Vite Template" },
      {
        name: "description",
        content:
          "A modern React + Vite + TypeScript + SASS template with TanStack Router, TanStack Query, Zustand, Zod, and GSAP",
      },
      // Default Open Graph tags
      { property: "og:type", content: "website" },
      { property: "og:title", content: "React Vite Template" },
      {
        property: "og:description",
        content:
          "A modern React + Vite + TypeScript + SASS template with TanStack Router, TanStack Query, Zustand, Zod, and GSAP",
      },
      { property: "og:image", content: "/Shader-test/img/jpg/webgl.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:url",
        content: "https://younes-portfolio-dev.vercel.app/React_Vite-template/",
      },
      // Default Twitter Card tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "React Vite Template" },
      {
        name: "twitter:description",
        content:
          "A modern React + Vite + TypeScript + SASS template with TanStack Router, TanStack Query, Zustand, Zod, and GSAP",
      },
      { name: "twitter:image", content: "/Shader-test/img/jpg/webgl.jpg" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "/Shader-test/img/jpg/webgl.jpg",
      },
    ],
    scripts: [
      {
        src: "https://kit.fontawesome.com/904e9ee361.js",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  // Theme logic - ONLY place where theme class is applied
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const abortController = new AbortController();

    const applyTheme = (currentTheme: "light" | "dark" | "system") => {
      const isDark =
        currentTheme === "dark" ||
        (currentTheme === "system" && mediaQuery.matches);
      root.classList.toggle("dark", isDark);
      root.classList.toggle("light", !isDark);
    };

    // Apply theme immediately
    applyTheme(theme);

    // Listen for OS theme changes when in system mode
    const handleChange = () => {
      if (theme !== "system") {
        return;
      }
      applyTheme(theme);
    };

    mediaQuery.addEventListener("change", handleChange, {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
    };
  }, [theme]);

  return (
    <>
      {/* Portal HeadContent into the document head */}
      {createPortal(<HeadContent />, document.querySelector("head")!)}

      <header className="header" data-element="header">
        <svg className="hide header__svg-filters"></svg>
        <h1 className="header__title" title="Title">
          React Template
        </h1>
      </header>

      <main className="index" data-element="index">
        <Outlet />
      </main>

      <footer className="footer" data-element="footer">
        <p className="footer__paragraph">
          Made by:{" "}
          <a
            href="https://younes-portfolio-dev.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Younes Lahouiti
          </a>
        </p>
      </footer>

      <Scripts />
      {env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  );
}
