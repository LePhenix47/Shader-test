// Fragment Shader - triangle.frag
precision mediump float;

// Import color from vertex shader (automatically interpolated by GPU!)
varying vec3 out_Color;

void main() {
    // Use the interpolated color
    gl_FragColor = vec4(out_Color, 1.0);
}
