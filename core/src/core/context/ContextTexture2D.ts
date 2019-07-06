namespace dou3d {
    /**
     * 2D 纹理
     * @author wizardc
     */
    export class ContextTexture2D {
        public index: number;
        public border: number;
        public colorFormat: number;
        public dataFormat: number;

        /**
         * 纹理贴图标准的格式
         */
        public internalFormat: InternalFormat;

        public textureBuffer: WebGLTexture;

        /**
         * 贴图元素对象
         */
        public imageData: HTMLImageElement;

        /**
         * mipmap数据
         */
        public mimapData: Array<MipmapData>;

        /**
         * @private
         */
        public frameBuffer: WebGLFramebuffer;

        /**
         * @private
         */
        public renderbuffer: WebGLRenderbuffer;

        /**
         * 提交给显卡的贴图尺寸大小 贴图宽度
         * - 当作为renderTexture使用时一定要传入真实尺寸
         */
        public width: number;

        /**
         * 提交给显卡的贴图尺寸大小 贴图高度
         * 当作为renderTexture使用时一定要传入真实尺寸
         */
        public height: number;

        public constructor() {
            this.border = 0;
            this.imageData = null;
            //this.colorFormat = ContextConfig.ColorFormat_RGBA8888;
            //this.dataFormat = Context3DProxy.gl.UNSIGNED_BYTE;
            //this.internalFormat = InternalFormat.PixelArray;
            //this.mimapData = new Array<MipmapData>();
        }

        public dispose(): void {
            if (this.textureBuffer) {
                Context3DProxy.gl.deleteTexture(this.textureBuffer);
                this.textureBuffer = null;
            }
            if (this.frameBuffer) {
                Context3DProxy.gl.deleteFramebuffer(this.frameBuffer);
                this.frameBuffer = null;
            }
            if (this.renderbuffer) {
                Context3DProxy.gl.deleteRenderbuffer(this.renderbuffer);
                this.renderbuffer = null;
            }
        }
    }
}
