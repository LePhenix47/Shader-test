// Vertex Shader - triangle.vert
attribute vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

// Export color to fragment shader
varying vec3 out_Color;

void main() {
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vec4(position, 1.0);
    gl_Position.x *= 0.5;
    gl_Position.y *= 0.5;
    gl_Position.z *= 0.5;

    // Convert position (-1 to 1) to color (0 to 1)
    // Top vertex (0, 1, 0) -> (0.5, 1.0, 0.5) = greenish
    // Bottom left (-1, -1, 0) -> (0.0, 0.0, 0.5) = blueish
    // Bottom right (1, -1, 0) -> (1.0, 0.0, 0.5) = reddish
    out_Color = position;
}
