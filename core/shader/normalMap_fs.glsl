// -----
// 法线贴图生成片段着色器
// -----

uniform sampler2D normalTexture;

varying vec2 varying_uv0;
varying vec4 varying_modelViewPosition;

mat3 cotangentFrame(vec3 N, vec3 p, vec2 uv) {
    vec3 dp1 = dFdx(p);
    vec3 dp2 = dFdy(p);
    vec2 duv1 = dFdx(uv);
    vec2 duv2 = dFdy(uv);

    vec3 dp2perp = cross(dp2, N);
    vec3 dp1perp = cross(N, dp1);
    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;

    float invmax = 1.0 / sqrt(max(dot(T, T), dot(B, B)));
    return mat3(T * invmax, B * invmax, N);
}

vec3 tbn(vec3 map, vec3 N, vec3 V, vec2 texcoord) {
    mat3 TBN = cotangentFrame(N, -V, texcoord);
    return normalize(TBN * map);
}

void main() {
    vec3 normalTex = texture2D(normalTexture, uv_0).xyz * 2.0 - 1.0;
    normalTex.y *= -1.0;
    normal.xyz = tbn(normalTex.xyz, normal.xyz, varying_modelViewPosition.xyz, uv_0);
}
