// Fragment Shader - triangle.frag
precision mediump float;

// Import color from vertex shader (automatically interpolated by GPU!)
varying vec3 out_Color;

void main() {
    // Create a copy to modify
    vec3 color = out_Color;

    gl_FragColor = vec4(color, 1.0);
} 