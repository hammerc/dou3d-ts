namespace dou3d {
    /**
     * 由 6 个 ContextTexture2D 组成的立方体贴图
     * @author wizardc
     */
    export class ContextTexture3D {
        /**
         * 提交显卡的 index
         */
        public index: number;

        /**
         * 显卡中上传使用的 border 边框像素大小
         */
        public border: number;

        /**
         * 纹理贴图的颜色模式
         */
        public colorformat: number;

        /**
         * 纹理贴图标准的格式
         */
        public internalformat: InternalFormat;

        public texture: WebGLTexture;

        public useMipmap: boolean;

        public mimapData: Array<MipmapData>;

        public image_front: ContextTexture2D;
        public image_back: ContextTexture2D;
        public image_left: ContextTexture2D;
        public image_right: ContextTexture2D;
        public image_up: ContextTexture2D;
        public image_down: ContextTexture2D;

        public constructor() {
            this.border = 0;
            this.useMipmap = true;
            this.colorformat = ContextConfig.ColorFormat_RGBA8888;
            this.internalformat = InternalFormat.pixelArray;
            this.mimapData = new Array<MipmapData>();
        }

        public dispose(): void {
            if (this.texture) {
                Context3DProxy.gl.deleteTexture(this.texture);
                this.texture = null;
            }
            if (this.image_front) {
                this.image_front.dispose();
                this.image_front = null;
            }
            if (this.image_back) {
                this.image_back.dispose();
                this.image_back = null;
            }
            if (this.image_left) {
                this.image_left.dispose();
                this.image_left = null;
            }
            if (this.image_right) {
                this.image_right.dispose();
                this.image_right = null;
            }
            if (this.image_up) {
                this.image_up.dispose();
                this.image_up = null;
            }
            if (this.image_down) {
                this.image_down.dispose();
                this.image_down = null;
            }
        }
    }
}
