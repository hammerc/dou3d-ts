// -----
// 点光源片段着色器
// -----

const int max_pointLight = 0;
uniform float uniform_pointLightSource[7 * max_pointLight];

struct PointLight {
    vec3 position;
    vec3 diffuse;
    vec3 ambient;
    float intensity;
    float radius;
};

void calculatePointLight(MaterialSource materialSource) {
    vec3 viewDir = normalize(uniform_eyepos - varying_worldPosition.xyz);

    for(int i = 0; i < max_pointLight; i++) {
        PointLight pointLight;
        pointLight.position = vec3(uniform_pointLightSource[i * 7], uniform_pointLightSource[i * 7 + 1], uniform_pointLightSource[i * 7 + 2]);
        pointLight.diffuse = vec3(uniform_pointLightSource[i * 7 + 3], uniform_pointLightSource[i * 7 + 4], uniform_pointLightSource[i * 7 + 5]);
        pointLight.radius = uniform_pointLightSource[i * 7 + 6];

        vec3 lightOffset = pointLight.position - varying_worldPosition.xyz;
        vec3 lightDir = normalize(lightOffset);
        float falloff = computeDistanceLightFalloff(length(lightOffset), pointLight.radius);
        float diffuse = calculateLightDiffuse(varying_worldNormal, lightDir);
        float specular = calculateLightSpecular(varying_worldNormal, lightDir, viewDir, materialSource.specularScale);
        light.xyz += (materialSource.ambient + diffuse * materialSource.diffuse + specular * materialSource.specular) * pointLight.diffuse * falloff;
    }
}

void main() {
    calculatePointLight(materialSource);
}
