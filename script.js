import { VFX } from "https://esm.sh/@vfx-js/core";

const vfx = new VFX();
const lerp = (a, b, t) => a * (1 - t) + b * t;

console.log("Script loaded");

const shaderH = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform sampler2D src;
uniform float scroll;

float inside(vec2 uv) {
    return step(abs(uv.x - 0.5), 0.5) * step(abs(uv.y - 0.5), 0.5);
}

vec4 readTex(vec2 uv) {
    return texture2D(src, uv) * inside(uv);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    float d = scroll;
    // Shift by x position
    d *= abs(
        sin(floor(gl_FragCoord.x / 17.0) * 7.0 + time * 2.0) +
        sin(floor(gl_FragCoord.x / 19.0) * 19.0 - time * 3.0)
    );
    vec4 cr = readTex(uv + vec2(0, d));
    vec4 cg = readTex(uv + vec2(0, d * 2.0));
    vec4 cb = readTex(uv + vec2(0, d * 3.0));
    gl_FragColor = vec4(cr.r, cg.g, cb.b, (cr.a + cg.a + cb.a));
}
`;

let scroll = 0;
document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded");
    for (const e of document.querySelectorAll('h2')) {
        console.log("Adding effect to", e);
        vfx.add(e, {
            shader: shaderH,
            overflow: 500,
            uniforms: {
                scroll: () => {
                    const diff = window.scrollY - scroll;
                    scroll = lerp(scroll, window.scrollY, 0.03);
                    return diff / window.innerHeight;
                }
            }
        });
    }
});
