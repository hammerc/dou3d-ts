namespace dou3d {
    /**
     * 可以渲染的贴图对象
     * @author wizardc
     */
    export class RenderTexture extends TextureBase {
        public frameBufferFormat: FrameBufferFormat;

        public constructor(width: number = 512, height: number = 512, frameBufferFormat: FrameBufferFormat = FrameBufferFormat.UNSIGNED_BYTE_RGB) {
            super();
            this.useMipmap = false;
            this.smooth = false;
            this.width = width;
            this.height = height;
            this.frameBufferFormat = frameBufferFormat;
            this.uvRectangle = new Rectangle(0, 0, 1, 1);
        }

        public upload(context3D: Context3DProxy): void {
            if (!this.texture2D) {
                this.texture2D = context3D.createFramebuffer(this.width, this.height, this.frameBufferFormat);
            }
        }

        public uploadForcing(context3D: Context3DProxy): void {
        }
    }
}
