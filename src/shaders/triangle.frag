// Fragment Shader - triangle.frag

precision mediump float;

// Import color from vertex shader

varying vec3 out_color;
varying vec3 out_position;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform sampler2D u_texture;

vec2 distortUV(vec2 uv) {
    float x_freq = 10.0;
    float y_freq = 5.0;

    float strength = 0.005;

    uv.x += cos(uv.y * x_freq + u_time) * strength;
    uv.y += sin(uv.x * y_freq + u_time) * strength;

    return uv;
}

vec2 perturbUV(vec2 uv) {
    // Sample the texture to get noise from red channel
    float noise = texture2D(u_texture, uv).r;

    // Add distortion based on noise
    uv += sin(u_time + noise * 1.25) * 0.08;

    return uv;
}

vec3 chromaticAberration(vec2 uv, float distance) {

    float offset = distance * 0.005;

    float r = texture2D(u_texture, uv + offset).r;
    float g = texture2D(u_texture, uv).g;
    float b = texture2D(u_texture, uv - offset).b;

    return vec3(r, g, b);
}

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
    float d = length(uv);

// Now that the origin is at the middle of the screen, we make them between -1 & 1
    uv += 0.5;

    uv = distortUV(uv);
    uv = perturbUV(uv);
    vec3 finalColor = chromaticAberration(uv, d);

    gl_FragColor = vec4(finalColor, 1.0);

}