namespace dou3d {
    /**
     * 拾取渲染通道
     * @author wizardc
     */
    export class PickPass extends MaterialPass {
        public constructor(materialData: MaterialData) {
            super(materialData);
            this._passID = PassType.PickPass;
        }

        public initUseMethod(): void {
            this._passChange = false;
            this._passUsage = new PassUsage();
            this._vs_shader_methods = {};
            this._fs_shader_methods = {};
            this.addMethodShaders(this._passUsage.vertexShader, ["pickPass_vs"]);
            this.addMethodShaders(this._passUsage.fragmentShader, ["pickPass_fs"]);
        }
    }
}
