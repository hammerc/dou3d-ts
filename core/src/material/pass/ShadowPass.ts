namespace dou3d {
    /**
     * 阴影渲染通道
     * @author wizardc
     */
    export class ShadowPass extends MaterialPass {
        constructor(materialData: MaterialData) {
            super(materialData);
            this._passID = PassType.shadowPass;
        }

        protected initShader(animation: IAnimation): void {
            this._passChange = false;
            this._passUsage = new PassUsage();
            this._vs_shader_methods = {};
            this._fs_shader_methods = {};

            this.addMethodShaders(this._passUsage.vertexShader, ["shadowPass_vs"]);
            this.addMethodShaders(this._passUsage.fragmentShader, ["shadowPass_fs"]);
        }
    }
}
