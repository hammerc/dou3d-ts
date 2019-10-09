// -----
// 漫反射顶点着色器
// -----

attribute vec3 attribute_normal;
attribute vec4 attribute_color;

varying vec4 varying_mvPose;

void main() {
    mat4 mvMatrix = mat4(uniform_ViewMatrix * uniform_ModelMatrix);
    varying_mvPose = mvMatrix * vec4(e_position, 1.0);
    mat4 normalMatrix = inverse(mvMatrix);
    normalMatrix = transpose(normalMatrix);
    varying_eyeNormal = mat3(normalMatrix) * -attribute_normal;
    outPosition = varying_mvPose;
    varying_color = attribute_color;
}
