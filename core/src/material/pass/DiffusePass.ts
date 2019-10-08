namespace dou3d {
    /**
     * 漫反射渲染通道
     * @author wizardc
     */
    export class DiffusePass extends MaterialPass {
        public constructor(materialData: MaterialData) {
            super(materialData);
            this._passID = PassType.diffusePass;
        }
    }
}
