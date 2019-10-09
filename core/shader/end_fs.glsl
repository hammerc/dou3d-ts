// -----
// 结束片段着色器
// -----

varying vec4 varying_color;

vec4 outColor;
vec4 diffuseColor;
vec4 specularColor;
vec4 ambientColor;
vec4 light;

void main() {
    outColor.xyz = (light.xyz + materialSource.ambient) * diffuseColor.xyz * materialSource.diffuse * varying_color.xyz;
    outColor.w = materialSource.alpha * diffuseColor.w * varying_color.w;
    outColor.xyz *= outColor.w;
    gl_FragColor = outColor;
}
