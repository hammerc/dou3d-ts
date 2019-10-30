namespace dou3d {
    /**
     * 颜色渲染通道
     * @author wizardc
     */
    export class ColorPass extends MaterialPass {
        public constructor(materialData: MaterialData) {
            super(materialData);
            this._passID = PassType.colorPass;
        }

        public initUseMethod(): void {
            this._passChange = false;
            this._passUsage = new PassUsage();
            if (this._materialData.shaderPhaseTypes[PassType.diffusePass].contains(ShaderPhaseType.diffuse_fragment)) {
                this._fs_shader_methods[ShaderPhaseType.diffuse_fragment] = [];
                this._fs_shader_methods[ShaderPhaseType.diffuse_fragment].push("diffuse_fs");
            }
            this._fs_shader_methods[ShaderPhaseType.end_fragment] = this._fs_shader_methods[ShaderPhaseType.end_fragment] || [];
            this._fs_shader_methods[ShaderPhaseType.end_fragment].push("colorPassEnd_fs");
            this.phaseEnd();
        }
    }
}
