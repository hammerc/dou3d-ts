namespace dou3d {
    /**
     * 方法中需要用到的数据
     * @author wizardc
     */
    export class PassUsage {
        public uniform_1ivs: Uniform[];
        public uniform_1fvs: Uniform[];
        public uniform_2ivs: Uniform[];
        public uniform_2fvs: Uniform[];
        public uniform_3ivs: Uniform[];
        public uniform_3fvs: Uniform[];
        public uniform_4ivs: Uniform[];
        public uniform_4fvs: Uniform[];

        public attribute_position: Attribute;
        public attribute_normal: Attribute;
        public attribute_tangent: Attribute;
        public attribute_color: Attribute;
        public attribute_uv0: Attribute;
        public attribute_uv1: Attribute;
        public attribute_boneIndex: Attribute;
        public attribute_boneWeight: Attribute;
        public attribute_shapePosition: Attribute;
        public attribute_uvRec: Attribute;
        // public attribute_rotation: Attribute;
        public attribute_size: Attribute;
        public attribute_quad_color: Attribute;
        // public attribute_scale: Attribute;

        // ----- 粒子 -----
        public attribute_offset: Attribute;
        public attribute_billboardXYZ: Attribute;
        public attribute_lifecycle: Attribute;
        public attribute_direction: Attribute;
        public attribute_speed: Attribute;
        public attribute_startScale: Attribute;
        public attribute_endScale: Attribute;
        public attribute_startColor: Attribute;
        public attribute_endColor: Attribute;
        public attribute_rotate: Attribute;
        public attribute_acceleRotate: Attribute;
        public attribute_maskRectangle: Attribute;
        public attribute_acceleScale: Attribute;
        public attribute_startSpaceLifeTime: Attribute;

        public varying_pos: Attribute;
        public varying_normal: Attribute;
        public varying_tangent: Attribute;
        public varying_color: Attribute;
        public varying_uv0: Attribute;
        public varying_uv1: Attribute;
        public varying_eyeNormal: Attribute;
        public varying_eyedir: Attribute;

        public TBN: Attribute;

        public uniform_ModelMatrix: Uniform;
        public uniform_ProjectionMatrix: Uniform;
        public uniform_ViewProjectionMatrix: Uniform;
        public uniform_ViewMatrix: Uniform;
        public uniform_ModelViewMatrix: Uniform;
        public uniform_orthProectMatrix: Uniform;
        public uniform_ShadowMatrix: Uniform;
        public uniform_eyepos: Uniform;
        public uniform_PoseMatrix: Uniform;
        public uniform_sceneWidth: Uniform;
        public uniform_sceneHeight: Uniform;
        public uniform_time: Uniform;
        public uniform_cameraMatrix: Uniform;
        public uniform_enableBillboardXYZ: Uniform;
        public uniform_startColor: Uniform;
        public uniform_endColor: Uniform;
        public uniform_startScale: Uniform;
        public uniform_endScale: Uniform;
        public uniform_startRot: Uniform;
        public uniform_endRot: Uniform;

        public sampler2DList: Sampler2D[] = [];
        public sampler3DList: Sampler3D[] = [];

        public uniform_materialSource: Uniform;
        public uniform_LightSource: Uniform;
        public uniform_lightModelSource: Uniform;
        public uniform_directLightSource: Uniform;
        public uniform_sportLightSource: Uniform;
        public uniform_pointLightSource: Uniform;
        public uniform_skyLightSource: Uniform;
        public uniform_ShadowColor: Uniform;

        public program3D: Program3D;
        public vs_shader: Shader;
        public fs_shader: Shader;

        //public vertexShaderRegister: ver;

        public vertexShader: ShaderBase = new ShaderBase(ShaderType.vertex);
        public fragmentShader: ShaderBase = new ShaderBase(ShaderType.fragment);

        public maxDirectLight: number = 0;
        public maxSpotLight: number = 0;
        public maxPointLight: number = 0;
        public maxBone: number = 0;

        public directLightData: Float32Array;
        public spotLightData: Float32Array;
        public pointLightData: Float32Array;

        public attributeDiry: boolean = true;

        public attributeList: Attribute[];

        public dispose(): void {
            if (this.program3D) {
                this.program3D.dispose();
            }
            this.program3D = null;
            if (this.vertexShader && this.vertexShader.shader) {
                this.vertexShader.shader.dispose();
            }
            this.vertexShader = null;
            if (this.fragmentShader && this.fragmentShader.shader) {
                this.fragmentShader.shader.dispose();
            }
            this.fragmentShader = null;
        }
    }
}
