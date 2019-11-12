// -----
// 阴影贴图生成顶点着色器
// -----

attribute vec3 attribute_position;
attribute vec4 attribute_color;
attribute vec2 attribute_uv0;

uniform mat4 uniform_ModelMatrix;
uniform mat4 uniform_ViewProjectionMatrix;

varying vec2 varying_uv0;
varying vec4 varying_color;

void main() {
    varying_uv0 = attribute_uv0;
    varying_color = attribute_color;

    gl_Position = uniform_ViewProjectionMatrix * uniform_ModelMatrix * vec4(attribute_position, 1.0);
}
