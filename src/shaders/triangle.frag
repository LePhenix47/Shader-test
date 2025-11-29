// Fragment Shader - triangle.frag

precision mediump float;

// Import color from vertex shader

varying vec3 out_color;
varying vec3 out_position;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main() {
    vec3 color = vec3(out_color.r, out_color.g, out_color.b);

    // Calculate distance from mouse position
    float dist = distance(gl_FragCoord.xy, u_mouse) * 0.01;

    gl_FragColor = vec4(sin(u_time - dist - color), 1.0);
}