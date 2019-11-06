// -----
// 阴影渲染片段着色器
// -----

uniform sampler2D shadowMapTexture;
uniform vec4 uniform_ShadowColor;

varying vec4 varying_ShadowCoord;

void main() {
    vec3 shadowColor = vec3(1.0, 1.0, 1.0);
    float offset = uniform_ShadowColor.w;
    vec2 sample = varying_ShadowCoord.xy / varying_ShadowCoord.w * 0.5 + 0.5;
    if (sample.x >= 0.0 && sample.x <= 1.0 && sample.y >= 0.0 && sample.y <= 1.0) {
        vec4 sampleDepth = texture2D(shadowMapTexture, sample).xyzw;
        float depth = varying_ShadowCoord.z;
        if (sampleDepth.z != 0.0) {
            if (sampleDepth.z < depth - offset) {
                shadowColor = uniform_ShadowColor.xyz;
            }
        }
    }
    diffuseColor.xyz = diffuseColor.xyz * shadowColor;
}
