// -----
// 聚光灯片段着色器
// -----

const int max_spotLight = 0;
uniform float uniform_spotLightSource[12 * max_spotLight];

struct SpotLight {
    vec3 position;
    vec3 direction;
    vec3 diffuse;
    vec3 ambient;
    float range;
    float coneCos;
    float penumbraCos;
};

void calculateSpotLight(MaterialSource materialSource) {
    vec3 viewDir = normalize(uniform_EyePos - varying_worldPosition.xyz);

    for(int i = 0; i < max_spotLight; i++) {
        SpotLight spotLight;
        spotLight.position = vec3(uniform_spotLightSource[i * 12], uniform_spotLightSource[i * 12 + 1], uniform_spotLightSource[i * 12 + 2]);
        spotLight.direction = vec3(uniform_spotLightSource[i * 12 + 3], uniform_spotLightSource[i * 12 + 4], uniform_spotLightSource[i * 12 + 5]);
        spotLight.diffuse = vec3(uniform_spotLightSource[i * 12 + 6], uniform_spotLightSource[i * 12 + 7], uniform_spotLightSource[i * 12 + 8]);
        spotLight.range = uniform_spotLightSource[i * 12 + 9];
        spotLight.coneCos = uniform_spotLightSource[i * 12 + 10];
        spotLight.penumbraCos = uniform_spotLightSource[i * 12 + 11];

        vec3 lightOffset = spotLight.position - varying_worldPosition.xyz;
        vec3 lightDir = normalize(lightOffset);
        float angleCos = dot(lightDir, -spotLight.direction);
        if(angleCos > spotLight.coneCos) {
            float spotEffect = smoothstep(spotLight.coneCos, spotLight.penumbraCos, angleCos);
            float falloff = computeDistanceLightFalloff(length(lightOffset) * angleCos, spotLight.range);
            float diffuse = calculateLightDiffuse(varying_worldNormal, lightDir);
            float specular = calculateLightSpecular(varying_worldNormal, lightDir, viewDir, materialSource.specularScale);
            light.xyz += (materialSource.ambient + diffuse * materialSource.diffuse + specular * materialSource.specular) * spotLight.diffuse * falloff * spotEffect;
        }
    }
}

void main() {
    calculateSpotLight(materialSource);
}
