// -----
// 灯光相关顶点着色器
// -----

varying vec3 varying_ViewDir;
uniform vec3 uniform_eyepos;

void main() {
    varying_ViewDir = uniform_eyepos.xyz - e_position;
}
