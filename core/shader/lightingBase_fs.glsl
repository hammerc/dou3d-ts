// -----
// 灯光相关片段着色器
// -----

vec4 LightingBlinnPhong(vec3 lightDir, vec3 lightColor, vec3 lightAmbient, vec3 normal, vec3 viewDir, float atten) {
    float NdotL = clamp(dot(normal, lightDir), 0.0, 1.0);
    vec3 diffuse = lightColor.xyz * NdotL;
    vec3 h = normalize(lightDir + normalize(viewDir));
    float nh = clamp(dot(normal, h), 0.0, 1.0);
    float specPower = pow(nh, materialSource.shininess) * materialSource.specularScale;
    vec3 specular = lightColor.xyz * specPower * materialSource.specular;
    specularColor.xyz += specular;
    vec4 c;
    c.rgb = (diffuse + specular + lightAmbient) * (atten * 2.0);
    c.a = materialSource.alpha + (specPower * atten);
    return c;
}

void main() {
    light.xyzw = vec4(0.0, 0.0, 0.0, 1.0);
}
