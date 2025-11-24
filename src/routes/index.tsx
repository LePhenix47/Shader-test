import { createFileRoute } from "@tanstack/react-router";
import { TriangleScene } from "@/components/TriangleScene";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home - shader-test" },
      {
        name: "description",
        content: "This is a projec to test shaders using WebGL with THREE.js",
      },
      { property: "og:title", content: "Home - shader-test" },
      {
        property: "og:description",
        content: "This is a projec to test shaders using WebGL with THREE.js",
      },
      {
        property: "og:url",
        content: "https://younes-portfolio-dev.vercel.app",
      },
      { name: "twitter:title", content: "Home - shader-test" },
      {
        name: "twitter:description",
        content: "This is a projec to test shaders using WebGL with THREE.js",
      },
    ],
  }),
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div>
      <ThemeToggle />
      <h2>shader-test</h2>
      <p>This is a projec to test shaders using WebGL with THREE.js</p>
      <TriangleScene />
    </div>
  );
}
