// -----
// 解析传递的数据为可用的结构体
// -----

struct MaterialSource {
    vec3 diffuse;
    vec3 ambient;
    vec3 specular;
    float alpha;
    float cutAlpha;
    float shininess;
    float roughness;
    float albedo;
    vec4 uvRectangle;
    float specularScale;
    float normalScale;
};

uniform float uniform_materialSource[20];

varying vec2 varying_uv0;

MaterialSource materialSource;

vec2 uv_0;

void main() {
    materialSource.diffuse.x = uniform_materialSource[0];
    materialSource.diffuse.y = uniform_materialSource[1];
    materialSource.diffuse.z = uniform_materialSource[2];

    materialSource.ambient.x = uniform_materialSource[3];
    materialSource.ambient.y = uniform_materialSource[4];
    materialSource.ambient.z = uniform_materialSource[5];

    materialSource.specular.x = uniform_materialSource[6];
    materialSource.specular.y = uniform_materialSource[7];
    materialSource.specular.z = uniform_materialSource[8];

    materialSource.alpha = uniform_materialSource[9];
    materialSource.cutAlpha = uniform_materialSource[10];
    materialSource.shininess = uniform_materialSource[11];
    materialSource.specularScale = uniform_materialSource[12];
    materialSource.albedo = uniform_materialSource[13];

    materialSource.uvRectangle.x = uniform_materialSource[14];
    materialSource.uvRectangle.y = uniform_materialSource[15];
    materialSource.uvRectangle.z = uniform_materialSource[16];
    materialSource.uvRectangle.w = uniform_materialSource[17];
    materialSource.specularScale = uniform_materialSource[18];
    materialSource.normalScale = uniform_materialSource[19];

    uv_0 = varying_uv0.xy * materialSource.uvRectangle.zw + materialSource.uvRectangle.xy;
}
