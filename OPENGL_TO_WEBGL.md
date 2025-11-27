# OpenGL to WebGL/Three.js Translation Guide

This guide helps you translate OpenGL shader tutorials to WebGL using Three.js.

## WebGL/Three.js Graphics Pipeline

### The Full Pipeline

```
1. CPU (JavaScript/Three.js)
   → Create vertex data (Float32Array)

2. RAM
   → Vertex data stored temporarily

3. Upload to GPU
   → `geometry.setAttribute()` sends data to GPU

4. VRAM (GPU Memory) - "Three.js Buffer"
   → Vertex Buffer Object (VBO) stores vertex data

5. Vertex Shader (GPU)
   → Runs once per vertex
   → Reads: attributes (from VBO), uniforms
   → Outputs: gl_Position, varying variables

6. Rasterizer (GPU - Automatic)
   → Interpolates varying values across triangles

7. Fragment Shader (GPU)
   → Runs once per pixel
   → Reads: varying (interpolated), uniforms
   → Outputs: `gl_FragColor`

8. Framebuffer
   → Final image rendered to screen
```

### Key Concepts

**Data Types:**
- `attribute` - Per-vertex data (position, color, UV, etc.) - Read by vertex shader from VBO
- `varying` - Data passed from vertex → fragment shader (automatically interpolated by GPU)
- `uniform` - Data that's the same for all vertices/fragments (time, mouse position, textures)

**Important:**
- Vertex shader runs 3 times for a triangle (once per vertex)
- Fragment shader runs thousands of times (once per pixel inside the triangle)
- `varying` variables are automatically interpolated - you don't need to do anything in Three.js!

---

## Shader Syntax Differences

### Version Directives

**OpenGL:**
```glsl
#version 330 core
```

**WebGL:**
```glsl
// No version directive needed for WebGL 1.0
// For WebGL 2.0, use: #version 300 es
```

---

### Vertex Shader Input/Output (WebGL 1.0)

**OpenGL (Modern):**
```glsl
#version 330 core
layout (location = 0) in vec3 in_Position;
out vec4 out_Color;

void main() {
    gl_Position = vec4(in_Position, 1.0);
    out_Color = vec4(0.5, 0.0, 0.0, 1.0);
}
```

**WebGL 1.0:**
```glsl
attribute vec3 in_Position;
varying vec4 out_Color;

void main() {
    gl_Position = vec4(in_Position, 1.0);
    out_Color = vec4(0.5, 0.0, 0.0, 1.0);
}
```

**Translation:**

- `in` → `attribute` (vertex shader inputs)
- `out` → `varying` (data passed to fragment shader)
- Remove `layout (location = X)` - Three.js handles this automatically

**Naming Convention:**

- Inputs: `in_VariableName` prefix (e.g., `in_Position`, `in_Normal`, `in_UV`)
- Outputs: `out_VariableName` prefix (e.g., `out_Color`, `out_TexCoord`)

---

### Fragment Shader Input/Output (WebGL 1.0)

**OpenGL (Modern):**
```glsl
#version 330 core
in vec4 in_Color;
out vec4 out_FragColor;

void main() {
    out_FragColor = in_Color;
}
```

**WebGL 1.0:**
```glsl
precision mediump float;

varying vec4 in_Color;

void main() {
    gl_FragColor = in_Color;
}
```

**Translation:**

- `in` → `varying` (data from vertex shader)
- `out vec4 FragColor` → Use `gl_FragColor` built-in
- Add `precision mediump float;` at the top

**Note on Naming:**

- Fragment shader inputs from vertex shader: Use `in_` prefix (they're inputs to the fragment shader)
- Uniforms: Often use `u_` prefix (e.g., `u_Time`, `u_Resolution`, `u_Texture`)

---

## Three.js vs Raw OpenGL

### Vertex Buffer Setup

**OpenGL:**
```cpp
unsigned int VBO, VAO;
float vertices[] = {
    -0.5f, -0.5f, 0.0f,
     0.5f, -0.5f, 0.0f,
     0.0f,  0.5f, 0.0f
};

glGenVertexArrays(1, &VAO);
glGenBuffers(1, &VBO);
glBindVertexArray(VAO);
glBindBuffer(GL_ARRAY_BUFFER, VBO);
glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
glEnableVertexAttribArray(0);
```

**Three.js:**
```typescript
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0,
     0.0,  0.5, 0.0
]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
```

---

### Shader Compilation

**OpenGL:**
```cpp
unsigned int vertexShader = glCreateShader(GL_VERTEX_SHADER);
glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
glCompileShader(vertexShader);

unsigned int fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
glCompileShader(fragmentShader);

unsigned int shaderProgram = glCreateProgram();
glAttachShader(shaderProgram, vertexShader);
glAttachShader(shaderProgram, fragmentShader);
glLinkProgram(shaderProgram);
```

**Three.js:**
```typescript
import vertexShader from '@/shaders/shader.vert';
import fragmentShader from '@/shaders/shader.frag';

const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
});
```

---

### Uniforms

**OpenGL:**
```cpp
// In shader:
uniform float time;

// In C++ code:
int timeLocation = glGetUniformLocation(shaderProgram, "time");
glUniform1f(timeLocation, currentTime);
```

**Three.js:**
```typescript
// In shader:
uniform float time;

// In TypeScript:
const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    time: { value: 0.0 }
  }
});

// Update in animation loop:
material.uniforms.time.value = clock.getElapsedTime();
```

---

### Render Loop

**OpenGL:**
```cpp
while (!glfwWindowShouldClose(window)) {
    glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);

    glUseProgram(shaderProgram);
    glBindVertexArray(VAO);
    glDrawArrays(GL_TRIANGLES, 0, 3);

    glfwSwapBuffers(window);
    glfwPollEvents();
}
```

**Three.js:**
```typescript
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

---

## Built-in Variables Three.js Provides

When using `RawShaderMaterial`, Three.js automatically provides these uniforms:

### Vertex Shader:
- `uniform mat4 modelMatrix;` - Model transformation
- `uniform mat4 modelViewMatrix;` - Model + View transformation
- `uniform mat4 projectionMatrix;` - Projection transformation
- `uniform mat4 viewMatrix;` - View (camera) transformation
- `uniform mat3 normalMatrix;` - For transforming normals
- `uniform vec3 cameraPosition;` - Camera position in world space

You must declare these in your shader to use them.

---

## Common Patterns

### Drawing Primitives

**OpenGL:**
```cpp
glDrawArrays(GL_TRIANGLES, 0, 3);      // Triangle
glDrawArrays(GL_TRIANGLE_STRIP, 0, 4); // Triangle strip
glDrawArrays(GL_POINTS, 0, count);      // Points
```

**Three.js:**
```typescript
const mesh = new THREE.Mesh(geometry, material);           // Triangles
const line = new THREE.Line(geometry, material);           // Line
const points = new THREE.Points(geometry, material);       // Points
```

---

### Textures

**OpenGL:**
```cpp
unsigned int texture;
glGenTextures(1, &texture);
glBindTexture(GL_TEXTURE_2D, texture);
// ... texture setup
glActiveTexture(GL_TEXTURE0);
glBindTexture(GL_TEXTURE_2D, texture);
```

**Three.js:**
```typescript
const texture = new THREE.TextureLoader().load('texture.jpg');
const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTexture: { value: texture }
  }
});
```

---

## Quick Reference Table

| OpenGL               | WebGL 1.0 (GLSL ES 1.0) | WebGL 2.0 (GLSL ES 3.0) |
| -------------------- | ----------------------- | ----------------------- |
| `#version 330 core`  | (omit)                  | `#version 300 es`       |
| `in` (vertex)        | `attribute`             | `in`                    |
| `out` (vertex)       | `varying`               | `out`                   |
| `in` (fragment)      | `varying`               | `in`                    |
| `out vec4 FragColor` | `gl_FragColor`          | `out vec4 FragColor`    |
| `texture()`          | `texture2D()`           | `texture()`             |

---

## Notes

- **ShaderMaterial vs RawShaderMaterial:**
  - `ShaderMaterial`: Three.js injects shader chunks (lights, fog, etc.)
  - `RawShaderMaterial`: Full control, closer to raw OpenGL (recommended for learning)

- **Precision qualifiers:** WebGL requires precision qualifiers in fragment shaders:
  ```glsl
  precision mediump float;  // Add at top of fragment shader
  ```

- **Matrix multiplication order:** Same as OpenGL (right to left):
  ```glsl
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  ```
