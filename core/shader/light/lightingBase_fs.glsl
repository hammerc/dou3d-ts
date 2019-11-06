// -----
// 灯光相关片段着色器
// -----

// 根据距离计算衰减
float computeDistanceLightFalloff(float lightDistance, float range) {
    return max(0.0, 1.0 - lightDistance / range);
}

// 计算光照漫反射系数
float calculateLightDiffuse(vec3 normal, vec3 lightDir) {
    return clamp(dot(normal, lightDir), 0.0, 1.0);
}

// 计算光照镜面反射系数
float calculateLightSpecular(vec3 normal, vec3 lightDir, vec3 viewDir, float glossiness) {
    vec3 halfVec = normalize(lightDir + viewDir);
    float specComp = max(dot(normal, halfVec), 0.0);
    specComp = pow(specComp, glossiness);
    return specComp;
}

void main() {
    light.xyzw = vec4(0.0, 0.0, 0.0, 1.0);
}
