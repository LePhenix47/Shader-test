// Fragment Shader - triangle.frag

precision mediump float;

// Import color from vertex shader

varying vec3 out_color;
varying vec3 out_position;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform sampler2D u_texture;

void main() {
    // Normalize coordinates (0 to 1)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

/**
We adjust the coordinates to be in the middle
So we remove 0.5, so that the origin goes from:
bottom left TO center center
*/
    uv -= 0.5;

    float screenAspect = u_resolution.x / u_resolution.y;
    uv.x *= screenAspect;

    uv += 0.5;

    uv.x += sin(uv.y * 1.5 + u_time) * 0.01;

    vec4 texColor = texture2D(u_texture, uv);

    gl_FragColor = texColor;
}