// -----
// 阴影渲染片段着色器
// -----

uniform sampler2D diffuseTexture;

vec4 diffuseColor;

varying vec2 varying_uv0;
varying vec4 varying_color;
varying vec4 varying_pos;

void main() {
    diffuseColor = varying_color;
    if (diffuseColor.w == 0.0) {
        discard;
    }
    diffuseColor = texture2D(diffuseTexture, varying_uv0);
    if (diffuseColor.w <= 0.3) {
        discard;
    }
    gl_FragColor = vec4(varying_pos.zzz, 1.0);
}
