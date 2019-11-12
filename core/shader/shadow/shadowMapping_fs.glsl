// -----
// 阴影渲染片段着色器
// -----

uniform sampler2D shadowMapTexture;

uniform vec4 uniform_ShadowColor;

varying vec4 varying_ShadowCoord;

void main() {
    vec3 shadowColor = vec3(1.0, 1.0, 1.0);
    vec3 shadowCoord = (varying_ShadowCoord.xyz / varying_ShadowCoord.w) / 2.0 + 0.5;
    vec4 rgbaDepth = texture2D(shadowMapTexture, shadowCoord.xy);
    float depth = rgbaDepth.x;
    if (shadowCoord.z > depth + 0.005) {
        shadowColor = uniform_ShadowColor.xyz;
    }
    diffuseColor.xyz = diffuseColor.xyz * shadowColor;
}
