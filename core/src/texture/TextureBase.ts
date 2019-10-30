namespace dou3d {
    /**
     * 贴图基类
     * @author wizardc
     */
    export abstract class TextureBase extends dou.HashObject {
        /**
         * 贴图是否使用 mipmap
         * mipmap 为一个贴图的 LOD 层级贴图, 例如 ( 1024 * 1024 的贴图, 往下就会自动生成 512 * 512, 256 * 256, 128 * 128, 64 * 64, 32 * 32, 16 * 16, 8 * 8, 4 * 4, 2 * 2, 1 * 1 )
         */
        public useMipmap: boolean = true;

        /**
         * 是否平滑差值
         */
        public smooth: boolean = true;

        /**
         * 贴图采样方式
         */
        public repeat: boolean = false;

        /**
         * 贴图的宽度
         */
        public width: number;

        /**
         * 贴图的高度
         */
        public height: number;

        /**
         * 贴图的数据
         */
        public texture2D: ContextTexture2D;

        /**
         * 贴图的数据
         */
        public texture3D: ContextTexture3D;

        /**
         * 是否预乘 alpha
         */
        public premultiplyAlpha: boolean;

        /**
         * 是否需要颠倒 uv
         * gl.filp_y
         */
        public filp_y: boolean;

        /**
         * 当前贴图如果是大图集的一部分则这里用来记录位于大图集中的区域信息
         */
        public uvRectangle: Rectangle;

        /**
         * 大图集贴图对象
         */
        public parentTexture: TextureBase;

        /**
         * 是否有 Mipmap
         */
        public hasMipmap: boolean = false;

        /**
         * 纹理贴图标准的格式
         */
        public internalFormat: InternalFormat;

        /**
         * 贴图颜色格式
         */
        public colorFormat: number;

        /**
         * 贴图 mipmap data
         */
        public mimapData: Array<MipmapData>;

        private _ready: boolean = false;

        /**
         * 从大图集中的某一区域进行拷贝
         */
        public copyFromTexture(texture: TextureBase, x: number, y: number, width: number, height: number): void {
            this.parentTexture = texture;
            texture.width = width;
            texture.height = height;
            this.texture2D = texture.texture2D;
            this.uvRectangle = this.uvRectangle || new Rectangle();
            this.uvRectangle.x = x;
            this.uvRectangle.y = y;
            this.uvRectangle.w = width;
            this.uvRectangle.h = height;
        }

        /**
         * 上传贴图数据给GPU
         */
        public abstract upload(context3D: Context3DProxy): void;

        /**
         * 强制上传贴图数据给GPU, 强制要求贴图更新
         * 在 video 贴图类型需要立即改变显卡中的贴图内存
         */
        public abstract uploadForcing(context3D: Context3DProxy): void;

        public activeState(context3D: Context3DProxy) {
            if (this._ready) {
                return;
            }
            this._ready = true;
            if (!this.premultiplyAlpha) {
                Context3DProxy.gl.pixelStorei(Context3DProxy.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
            }
            if (this.useMipmap && !this.hasMipmap) {
                Context3DProxy.gl.generateMipmap(Context3DProxy.gl.TEXTURE_2D);
                this.hasMipmap = true;
            }
            if (this.smooth) {
                if (this.hasMipmap) {
                    context3D.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_MIN_FILTER, Context3DProxy.gl.LINEAR_MIPMAP_LINEAR);
                    context3D.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_MAG_FILTER, Context3DProxy.gl.LINEAR);
                }
                else {
                    context3D.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_MIN_FILTER, Context3DProxy.gl.LINEAR);
                    context3D.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_MAG_FILTER, Context3DProxy.gl.LINEAR);
                }
            }
            else {
                context3D.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_MIN_FILTER, Context3DProxy.gl.NEAREST);
                context3D.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_MAG_FILTER, Context3DProxy.gl.NEAREST);
            }
            if (this.repeat) {
                context3D.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_WRAP_S, Context3DProxy.gl.REPEAT);
                context3D.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_WRAP_T, Context3DProxy.gl.REPEAT);
            }
            else {
                context3D.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_WRAP_S, Context3DProxy.gl.CLAMP_TO_EDGE);
                context3D.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_WRAP_T, Context3DProxy.gl.CLAMP_TO_EDGE);
            }
            if (this.filp_y) {
                Context3DProxy.gl.pixelStorei(Context3DProxy.gl.UNPACK_FLIP_Y_WEBGL, this.filp_y);
            }
        }

        public dispose(): void {
            if (this.texture2D) {
                this.texture2D.dispose();
            }
            this.texture2D = null;
            if (this.texture3D) {
                this.texture3D.dispose();
            }
            this.texture3D = null;
        }
    }
}
