// -----
// 漫反射片段着色器
// AlphaTest 透明度小于指定值的像素舍去
// -----

uniform sampler2D diffuseTexture;

vec4 diffuseColor;

void main() {
    diffuseColor = texture2D(diffuseTexture, uv_0);
    if (diffuseColor.w < materialSource.cutAlpha) {
        discard;
    }
}
