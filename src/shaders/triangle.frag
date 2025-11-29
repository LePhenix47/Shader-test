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
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // TODO: Create your river effect here by distorting the UV coordinates!
    // Hint: Modify uv.x or uv.y using sin/cos with u_time

    // Sample the texture
    vec4 texColor = texture2D(u_texture, uv);

    gl_FragColor = texColor;
}