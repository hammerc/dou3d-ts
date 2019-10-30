namespace dou3d {
    /**
     * 图片贴图对象
     * @author wizardc
     */
    export class ImageTexture extends TextureBase {
        private _imageData: HTMLImageElement;

        public constructor(img: HTMLImageElement) {
            super();
            this._imageData = img;
            this.texture2D = new ContextTexture2D();
            this.texture2D.imageData = img;
        }

        public get width(): number {
            return this._imageData.width;
        }

        public get height(): number {
            return this._imageData.height;
        }

        public upload(context3D: Context3DProxy): void {
            if (!this.texture2D.texture) {
                this.texture2D.texture = context3D.createTexture();
                this.texture2D.internalFormat = InternalFormat.imageData;
                this.texture2D.imageData = this._imageData;
                this.texture2D.dataFormat = Context3DProxy.gl.UNSIGNED_BYTE;
                this.texture2D.colorFormat = Context3DProxy.gl.RGBA;
                context3D.upLoadTextureData(0, this);
            }
        }

        public uploadForcing(context3D: Context3DProxy): void {
            context3D.upLoadTextureData(0, this);
        }
    }
}
