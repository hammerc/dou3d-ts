// -----
// 立方体渲染片段着色器
// -----

uniform samplerCube diffuseTexture3D;

varying vec3 varying_pos;

vec4 diffuseColor;

void main() {
	vec3 uvw = normalize(varying_pos.xyz);
	diffuseColor = vec4(textureCube(diffuseTexture3D, uvw.xyz));
	if (diffuseColor.w < materialSource.cutAlpha) {
		discard;
	}
	else {
		diffuseColor.xyz *= diffuseColor.w;
	}
}
