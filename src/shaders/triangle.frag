// Fragment Shader - triangle.frag

precision mediump float;

// Import color from vertex shader

varying vec3 out_color;
varying vec3 out_position;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform sampler2D u_texture;

vec3 chromaticAberration(vec2 uv, float offset) {
    // Offset red to the RIGHT
    float r = texture2D(u_texture, uv + vec2(offset, 0.0)).r;

    // Green stays centered
    float g = texture2D(u_texture, uv).g;

    // Offset blue to the LEFT
    float b = texture2D(u_texture, uv - vec2(offset, 0.0)).b;

    return vec3(r, g, b);
}

vec2 horizontalDisplacement(vec2 uv) {
    // Variable band sizes
    float numberOfBands = 15.0 + sin(uv.y * 20.0) * 5.0; // Varies between 10-20 bands
    float band = floor(uv.y * numberOfBands);

    // Make it jump (not smooth)
    float timeStep = floor(u_time * 12.5);

    // Create pseudo-random offset with more variation
    float offset = sin(band * 50.0 + timeStep) * 0.15;

    // Make glitches much rarer and more random
    float shouldGlitch = sin(band * 543.21 + timeStep * 13.7);
    if(shouldGlitch > 0.85) {  // Only ~15% of bands glitch (was 0.5 = 50%)
        uv.x += offset;
    }

    return uv;
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

    uv = horizontalDisplacement(uv);

    float frequency = 1.5;
    float strength = 0.01;
    float offset = sin(0.005 + u_time * frequency) * strength;

    vec3 finalColor = chromaticAberration(uv, offset);

    gl_FragColor = vec4(finalColor, 1.0);

}