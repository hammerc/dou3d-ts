// -----
// 结束顶点着色器
// -----

uniform float uniform_materialSource[20];

void main() {
    gl_PointSize = uniform_materialSource[18];
    gl_Position = uniform_ProjectionMatrix * outPosition;
}
