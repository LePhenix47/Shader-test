// Fragment Shader - triangle.frag

precision mediump float;

// Import color from vertex shader

varying vec3 out_color;
varying vec3 out_position;

void main() {
    vec3 color = vec3(out_position.r, out_position.g, out_position.b);

    color.rgb += 1.0;
    color.rgb /= 2.0;

    gl_FragColor = vec4(out_color, 1.0);
}