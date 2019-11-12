// -----
// 阴影渲染顶点着色器
// -----

uniform mat4 uniform_ModelMatrix;
uniform mat4 uniform_ShadowMatrix;

varying vec4 varying_ShadowCoord;

void main() {
    varying_ShadowCoord = uniform_ShadowMatrix * uniform_ModelMatrix * vec4(attribute_position, 1.0);
}
