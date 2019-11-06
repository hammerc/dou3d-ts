// -----
// 平行光片段着色器
// -----

const int max_directLight = 0;
uniform float uniform_directLightSource[6 * max_directLight];

struct DirectLight {
    vec3 direction;
    vec3 diffuse;
    vec3 ambient;
};

void calculateDirectLight(MaterialSource materialSource) {
    vec3 viewDir = normalize(uniform_EyePos - varying_worldPosition.xyz);

    for(int i = 0; i < max_directLight; i++) {
        DirectLight directLight;
        directLight.direction = vec3(uniform_directLightSource[i * 6], uniform_directLightSource[i * 6 + 1], uniform_directLightSource[i * 6 + 2]);
        directLight.diffuse = vec3(uniform_directLightSource[i * 6 + 3], uniform_directLightSource[i * 6 + 4], uniform_directLightSource[i * 6 + 5]);

        vec3 lightDir = -directLight.direction;
        float diffuse = calculateLightDiffuse(varying_worldNormal, lightDir);
        float specular = calculateLightSpecular(varying_worldNormal, lightDir, viewDir, materialSource.specularScale);
        light.xyz += (materialSource.ambient + diffuse * materialSource.diffuse + specular * materialSource.specular) * directLight.diffuse;
    }
}

void main() {
    calculateDirectLight(materialSource);
}
