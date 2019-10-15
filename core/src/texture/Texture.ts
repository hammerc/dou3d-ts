namespace dou3d {
    /**
     * 贴图对象
     * @author wizardc
     */
    export class Texture extends TextureBase {
        public constructor() {
            super();
            this.smooth = true;
            this.texture2D = new ContextTexture2D();
        }

        public upload(context3D: Context3DProxy): void {
            if (!this.texture2D.texture) {
                this.texture2D.texture = this.texture2D.texture || context3D.createTexture();
                this.texture2D.internalFormat = this.internalFormat;
                this.texture2D.colorFormat = this.colorFormat;
                this.texture2D.mimapData = this.mimapData;
                this.texture2D.dataFormat = Context3DProxy.gl.UNSIGNED_BYTE;
                if (this.mimapData && this.mimapData.length > 0) {
                    for (let i = 0; i < this.mimapData.length; i++) {
                        context3D.upLoadTextureData(i, this);
                    }
                }
                else {
                    context3D.upLoadTextureData(0, this);
                }
                if (this.parentTexture) {
                    if (!this.parentTexture.texture2D) {
                        this.parentTexture.upload(context3D);
                    }
                    this.texture2D = this.parentTexture.texture2D;
                    this.texture2D.internalFormat = this.parentTexture.internalFormat;
                    this.texture2D.colorFormat = this.parentTexture.colorFormat;
                    this.texture2D.mimapData = this.parentTexture.mimapData;
                }
            }
        }

        public uploadForcing(context3D: Context3DProxy): void {
            context3D.upLoadTextureData(0, this);
        }
    }
}
