// Vertex Shader - triangle.vert
attribute vec3 position;
attribute vec3 color;  // Read color from buffer
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

// Export color to fragment shader
varying vec3 out_Color;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // Pass the color to fragment shader (GPU will interpolate it)
    out_Color = color;
}
