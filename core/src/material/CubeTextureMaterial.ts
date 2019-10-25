namespace dou3d {
    /**
     * 立方体纹理材质
     * @author wizardc
     */
    export class CubeTextureMaterial extends MaterialBase {
        public constructor(texture?: CubeTexture, materialData?: MaterialData) {
            super(materialData);
            this.initMatPass();
            this.materialData.diffuseTexture3D = texture;
        }

        protected initMatPass(): void {
            this.addPass(PassType.diffusePass);
            this.diffusePass.addMethod(new CubeMethod());
        }

        public clone(): CubeTextureMaterial {
            return new CubeTextureMaterial(<CubeTexture>this.diffuseTexture, this.materialData.clone());
        }
    }
}
