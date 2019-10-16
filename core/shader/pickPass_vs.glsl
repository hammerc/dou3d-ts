// -----
// 拾取渲染通道顶点着色器
// -----

attribute vec3 attribute_position;
attribute vec4 attribute_color;
attribute vec2 attribute_uv0;

uniform mat4 uniform_ModelMatrix;
uniform mat4 uniform_ViewMatrix;
uniform mat4 uniform_ProjectionMatrix;

void main() {
    gl_Position = uniform_ProjectionMatrix * uniform_ViewMatrix * uniform_ModelMatrix * vec4(attribute_position, 1.0);
}
