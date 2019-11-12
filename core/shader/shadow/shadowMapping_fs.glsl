// -----
// 阴影渲染片段着色器
// -----

uniform sampler2D shadowMapTexture;

uniform vec4 uniform_ShadowColor;

varying vec4 varying_ShadowCoord;

void main() {
    vec3 shadowColor = vec3(1.0, 1.0, 1.0);
    vec4 shadowCoord = varying_ShadowCoord;
    shadowCoord.xyz /= shadowCoord.w;
    shadowCoord.xyz = (shadowCoord.xyz + 1.0) / 2.0;
    float depth = texture2D(shadowMapTexture, shadowCoord.xy).x;
    if (shadowCoord.z > depth + 0.005) {
        shadowColor = uniform_ShadowColor.xyz;
    }
    diffuseColor.xyz = diffuseColor.xyz * shadowColor;
}
