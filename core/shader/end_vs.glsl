// -----
// 结束顶点着色器
// -----

vec4 endPosition;

uniform float uniform_materialSource[20];

void main() {
    gl_PointSize = 50.0;
    gl_PointSize = uniform_materialSource[18];
    gl_Position = uniform_ProjectionMatrix * outPosition;
}
