namespace dou3d {
    /**
     * 实时阴影渲染, 生成阴影贴图
     * * 基于 shadow mapping 的阴影算法, 当前阴影只支持方向光
     * * 当渲染阴影的物体超出阴影摄像机的范围阴影将不会渲染阴影
     * @author wizardc
     */
    export class ShadowCast {
        private static _instance: ShadowCast;

        public static get instance(): ShadowCast {
            return ShadowCast._instance || (ShadowCast._instance = new ShadowCast());
        }

        private _enableShadow: boolean = false;

        private _textureWidth: number = 1024 * 4;
        private _textureHeight: number = 1024 * 4;

        private _shadowCamera: Camera3D;
        private _shadowRender: MultiRenderer;
        private _directLight: DirectLight;

        private constructor() {
            this._shadowCamera = new Camera3D(CameraType.orthogonal);
            this._shadowCamera.near = 1;
            this._shadowCamera.far = 3000;
            this._shadowCamera.updateViewport(0, 0, this._textureWidth, this._textureHeight);
            this._shadowRender = new MultiRenderer(PassType.shadowPass);
            this._shadowRender.setRenderToTexture(this._textureWidth, this._textureHeight, FrameBufferFormat.UNSIGNED_BYTE_RGBA);
        }

        public set enableShadow(value: boolean) {
            this._enableShadow = value;
        }
        public get enableShadow(): boolean {
            return this._enableShadow;
        }

        /**
         * 阴影贴图的宽
         */
        public get textureWidth(): number {
            return this._textureWidth;
        }

        /**
         * 阴影贴图的高
         */
        public get textureHeight(): number {
            return this._textureHeight;
        }

        /**
         * 渲染阴影的摄像机
         */
        public get shadowCamera(): Camera3D {
            return this._shadowCamera;
        }

        /**
         * 阴影渲染器
         */
        public get shadowRender(): MultiRenderer {
            return this._shadowRender;
        }

        /**
         * 用于渲染的平行光
         */
        public get directLight(): DirectLight {
            return this._directLight;
        }

        /**
         * 设置阴影贴图的宽度和高度
         */
        public setTextureSize(width: number, height: number): void {
            this._textureWidth = width;
            this._textureHeight = height;
            this._shadowRender.setRenderToTexture(this._textureWidth, this._textureHeight, FrameBufferFormat.UNSIGNED_BYTE_RGBA);
        }

        /**
         * 如需要渲染阴影必须先设置当前阴影灯光
         * * 只支持方向光, 灯光中的变换会用于阴影像机的变换
         */
        public castShadowLight(light: DirectLight): void {
            this._directLight = light;
        }

        public update(entityCollect: EntityCollect, camera: Camera3D, time: number, delay: number, viewPort: Rectangle): void {
            Engine.context3DProxy.clearColor(1.0, 1.0, 1.0, 1.0);
            Engine.context3DProxy.clear(Context3DProxy.gl.COLOR_BUFFER_BIT | Context3DProxy.gl.DEPTH_BUFFER_BIT);
            this._shadowCamera.validateTransformNow();
            this._shadowRender.draw(time, delay, Engine.context3DProxy, entityCollect, this._shadowCamera, viewPort);
        }
    }
}
