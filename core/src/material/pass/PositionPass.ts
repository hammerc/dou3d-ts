namespace dou3d {
    /**
     * 位置渲染通道
     * @author wizardc
     */
    export class PositionPass extends MaterialPass {
        public constructor(materialData: MaterialData) {
            super(materialData);
            this._passID = PassType.CubePass;
        }

        public initUseMethod(): void {
            this._passChange = false;
            this._passUsage = new PassUsage();
            this._passUsage.vertexShader.shaderType = ShaderType.vertex;
            this._passUsage.fragmentShader.shaderType = ShaderType.fragment;
            this._vs_shader_methods[ShaderPhaseType.end_vertex] = this._vs_shader_methods[ShaderPhaseType.end_vertex] || [];
            this._vs_shader_methods[ShaderPhaseType.end_vertex].push("positionEndPass_vs");
            this._fs_shader_methods[ShaderPhaseType.end_fragment] = this._fs_shader_methods[ShaderPhaseType.end_fragment] || [];
            this._fs_shader_methods[ShaderPhaseType.end_fragment].push("positionEndPass_fs");
            this.phaseEnd();
        }
    }
}
