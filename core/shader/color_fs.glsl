// -----
// 颜色片段着色器
// -----

vec4 diffuseColor;

void main() {
    if (diffuseColor.w == 0.0) {
		discard;
	}
	diffuseColor = vec4(1.0, 1.0, 1.0, 1.0);
    if (diffuseColor.w < materialSource.cutAlpha) {
		discard;
	}
	else {
		diffuseColor.xyz *= diffuseColor.w;
	}
}
