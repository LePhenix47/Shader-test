// Vertex Shader - triangle.vert
// This shader positions each vertex in 3D space

// Note: These are provided by Three.js but declared here for linting
attribute vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
    // Transform the vertex position from local space to clip space
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
