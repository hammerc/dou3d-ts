namespace dou3d {
    /**
     * 2D 纹理
     * @author wizardc
     */
    export class ContextTexture2D {
        /**
         * 提交显卡的 index
         */
        public index: number;

        /**
         * 显卡中上传使用的 border 边框像素大小
         */
        public border: number = 0;

        /**
         * 纹理贴图的颜色格式
         * @see Context3DProxy.gl.ColorFormat_RGB565
         * @see Context3DProxy.gl.ColorFormat_RGBA5551
         * @see Context3DProxy.gl.ColorFormat_RGBA4444
         * @see Context3DProxy.gl.ColorFormat_RGBA8888
         */
        public colorFormat: number;

        /**
         * 纹理贴图的颜色格式
         * @see Context3DProxy.gl.BYTE
         * @see Context3DProxy.gl.SHORT
         * @see Context3DProxy.gl.INT
         * @see Context3DProxy.gl.UNSIGNED_BYTE
         * @see Context3DProxy.gl.UNSIGNED_SHORT
         * @see Context3DProxy.gl.UNSIGNED_INT
         */
        public dataFormat: number;

        /**
         * 纹理贴图标准的格式
         */
        public internalFormat: InternalFormat;

        /**
         * 原生贴图对象
         */
        public texture: WebGLTexture;

        /**
         * 贴图元素对象
         */
        public imageData: HTMLImageElement;

        /**
         * mipmap数据
         */
        public mimapData: Array<MipmapData>;

        /**
         * 原生帧缓冲对象
         */
        public frameBuffer: WebGLFramebuffer;

        /**
         * 原生渲染缓冲对象
         */
        public renderbuffer: WebGLRenderbuffer;

        /**
         * 提交给显卡的贴图宽度
         * - 当作为 renderTexture 使用时一定要传入真实尺寸
         */
        public width: number;

        /**
         * 提交给显卡的贴图高度
         * - 当作为 renderTexture 使用时一定要传入真实尺寸
         */
        public height: number;

        public dispose(): void {
            if (this.texture) {
                Context3DProxy.gl.deleteTexture(this.texture);
                this.texture = null;
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
