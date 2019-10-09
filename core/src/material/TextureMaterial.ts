namespace dou3d {
    /**
     * 纹理材质
     * * 标准的贴图材质球, 可以设置三种贴图: diffuse, normal, speclar 贴图
     * * 不设置贴图时默认会设定为棋盘格贴图
     * @author wizardc
     */
    export class TextureMaterial extends MaterialBase {
        public constructor(texture?: TextureBase, materialData?: MaterialData) {
            super(materialData);
            if (!texture) {
                // texture = CheckerboardTexture.texture;
            }
            this.diffuseTexture = texture;
            this.initMatPass();
        }

        protected initMatPass(): void {
            this.addPass(PassType.diffusePass);
        }

        public clone(): TextureMaterial {
            return new TextureMaterial(this.diffuseTexture, this.materialData.clone());
        }
    }
}
