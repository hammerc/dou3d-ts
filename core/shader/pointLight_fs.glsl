// -----
// 点光源片段着色器
// -----

const int max_pointLight = 0;
uniform float uniform_pointLightSource[12 * max_pointLight];

varying vec4 varying_mvPose;

struct PointLight {
    vec3 position;
    vec3 diffuse;
    vec3 ambient;
    float intensity;
    float radius;
    float cutoff;
};

void calculatePointLight(MaterialSource materialSource) {
    vec3 N = normal;
    vec3 viewDir = normalize(varying_mvPose.xyz / varying_mvPose.w);
    for(int i = 0; i < max_pointLight; i++) {
        PointLight pointLight;
        pointLight.position = vec3(uniform_pointLightSource[i * 12], uniform_pointLightSource[i * 12 + 1], uniform_pointLightSource[i * 12 + 2]);
        pointLight.diffuse = vec3(uniform_pointLightSource[i * 12 + 3], uniform_pointLightSource[i * 12 + 4], uniform_pointLightSource[i * 12 + 5]);
        pointLight.ambient = vec3(uniform_pointLightSource[i * 12 + 6], uniform_pointLightSource[i * 12 + 7], uniform_pointLightSource[i * 12 + 8]);
        pointLight.intensity = uniform_pointLightSource[i * 12 + 9];
        pointLight.radius = uniform_pointLightSource[i * 12 + 10];
        pointLight.cutoff = uniform_pointLightSource[i * 12 + 11];
        vec3 lightCentre = (mat4(uniform_ViewMatrix) * vec4(pointLight.position.xyz, 1.0)).xyz;
        float r = pointLight.radius * 0.5;
        vec3 ldir = varying_mvPose.xyz - lightCentre;
        float distance = length(ldir);
        float d = max(distance - r, 0.0);
        vec3 L = ldir / distance;
        float denom = d / r + 1.0;
        float attenuation = 1.0 / (denom * denom);
        float cutoff = pointLight.cutoff;
        attenuation = (attenuation - cutoff) / (1.0 - cutoff);
        attenuation = max(attenuation * pointLight.intensity, 0.0);
        light.xyzw += LightingBlinnPhong(normalize(ldir), pointLight.diffuse, pointLight.ambient, N, viewDir, attenuation);
    };
}

void main() {
    calculatePointLight(materialSource);
}
