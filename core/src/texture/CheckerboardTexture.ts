namespace dou3d {
    /**
     * 棋盘格纹理为黑白间隔色块组成的一张纹理, 主要用于判别模型UV的正确性, 若某模型UV值不正确, 其纹理表现必定乱序不规整
     * @author wizardc
     */
    export class CheckerboardTexture extends TextureBase {
        /**
        * 公用棋盘格实例对象
        */
        public static texture: CheckerboardTexture = new CheckerboardTexture();

        private _pixelArray: Uint8Array;

        public constructor(width: number = 32, height: number = 32) {
            super();
            this.width = width;
            this.height = height;
            this.uvRectangle = new Rectangle(0, 0, 1, 1);
            this.buildCheckerboard();
            this.texture2D = new ContextTexture2D();
        }

        private buildCheckerboard(): void {
            if (!this._pixelArray) {
                this._pixelArray = new Uint8Array(this.width * this.height * 4);
                let colors = [Color.WHITE, Color.BLACK];
                let colorIndex = 0;
                let blockSize = 4;
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        if ((x % blockSize) == 0) {
                            colorIndex = (colorIndex + 1) % 2;
                        }
                        if ((y % blockSize) == 0 && x == 0) {
                            let tmp = colors[0];
                            colors[0] = colors[1];
                            colors[1] = tmp;
                            colorIndex = 0;
                        }
                        this._pixelArray[(y * (this.width * 4) + x * 4) + 0] = colors[colorIndex].r * 255;
                        this._pixelArray[(y * (this.width * 4) + x * 4) + 1] = colors[colorIndex].g * 255;
                        this._pixelArray[(y * (this.width * 4) + x * 4) + 2] = colors[colorIndex].b * 255;
                        this._pixelArray[(y * (this.width * 4) + x * 4) + 3] = colors[colorIndex].a * 255;
                    }
                }
            }
        }

        public upload(context3D: Context3DProxy): void {
            if (!this.texture2D.texture) {
                this.texture2D.texture = this.texture2D.texture || context3D.createTexture();
                this.texture2D.border = 0;
                this.texture2D.internalFormat = InternalFormat.pixelArray;
                this.texture2D.dataFormat = Context3DProxy.gl.UNSIGNED_BYTE;
                this.texture2D.colorFormat = Context3DProxy.gl.RGBA;
                this.texture2D.mimapData = [];
                this.texture2D.mimapData.push(new MipmapData(this._pixelArray, this.width, this.height));
                this.texture2D.width = this.width;
                this.texture2D.height = this.height;
                this.useMipmap = false;
                context3D.upLoadTextureData(0, this);
            }
        }

        public uploadForcing(context3D: Context3DProxy): void {
            context3D.upLoadTextureData(0, this);
        }

        public dispose(): void {
            super.dispose();
            this._pixelArray = null;
        }
    }
}
