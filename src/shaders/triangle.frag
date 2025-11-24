// Fragment Shader - triangle.frag
// This shader determines the color of each pixel

precision mediump float;

void main() {
    // Set the output color (RGBA format)
    // This creates a nice orange color: R=1.0, G=0.5, B=0.2, A=1.0
    gl_FragColor = vec4(0.2, 1.0, 0.2, 1.0);
}
