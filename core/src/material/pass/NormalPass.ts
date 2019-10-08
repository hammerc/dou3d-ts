namespace dou3d {
    /**
     * 法线渲染通道
     * @author wizardc
     */
    export class NormalPass extends MaterialPass {
        public constructor(materialData: MaterialData) {
            super(materialData);
            this._passID = PassType.CubePass;
        }

        public initUseMethod(): void {
            this._passChange = false;
            this._passUsage = new PassUsage();
            this._passUsage.vertexShader.shaderType = ShaderType.vertex;
            this._passUsage.fragmentShader.shaderType = ShaderType.fragment;
            if (this._materialData.shaderPhaseTypes[PassType.diffusePass].indexOf(ShaderPhaseType.normal_fragment) != -1) {
                this._fs_shader_methods[ShaderPhaseType.normal_fragment] = [];
                this._fs_shader_methods[ShaderPhaseType.normal_fragment].push("normalMap_fs");
            }
            this._fs_shader_methods[ShaderPhaseType.end_fragment] = this._fs_shader_methods[ShaderPhaseType.end_fragment] || [];
            this._fs_shader_methods[ShaderPhaseType.end_fragment].push("normalPassEnd_fs");
            this.phaseEnd();
        }
    }
}
