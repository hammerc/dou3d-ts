// -----
// 基础的片段着色器
// -----

#extension GL_OES_standard_derivatives : enable

varying vec3 varying_eyeNormal;
varying vec2 varying_uv0;
varying vec4 varying_color;

varying vec4 varying_worldPosition;
varying vec3 varying_worldNormal;

// 摄像机全局转换信息逆矩阵
uniform mat4 uniform_ViewMatrix;
// 摄像机位置
uniform vec3 uniform_eyepos;

// 从贴图获取到的颜色值
vec4 diffuseColor;
// 高光颜色
vec4 specularColor;
// 环境光颜色
vec4 ambientColor;

// 灯光颜色
vec4 light;
// 法线
vec3 normal;
// UV0
vec2 uv_0;

void main() {
	diffuseColor = vec4(1.0, 1.0, 1.0, 1.0);
	specularColor = vec4(0.0, 0.0, 0.0, 0.0);
	ambientColor = vec4(0.0, 0.0, 0.0, 0.0);
	light = vec4(1.0, 1.0, 1.0, 1.0);
	normal = normalize(varying_eyeNormal);
	uv_0 = varying_uv0;
}
