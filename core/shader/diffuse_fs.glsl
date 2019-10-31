// -----
// 漫反射片段着色器
// -----

uniform sampler2D diffuseTexture;

vec4 diffuseColor;

void main() {
    diffuseColor = texture2D(diffuseTexture, uv_0);
    if (diffuseColor.w < materialSource.cutAlpha) {
        discard;
    }
}
