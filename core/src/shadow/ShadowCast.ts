namespace dou3d {
    /**
     * 实时阴影渲染
     * * 基于 shadow mapping 的阴影算法, 当前阴影只支持方向光,
     * * 摄像机 near 1 far 3000  width 2048 height 2048, 当渲染阴影的物体超出阴影摄像机的范围阴影将不会渲染阴影
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
            this._shadowRender = new MultiRenderer(PassType.shadowPass);
            this._shadowRender.setRenderToTexture(this._textureWidth, this._textureHeight, FrameBufferFormat.UNSIGNED_BYTE_RGBA);
            this.castShadowLight(new DirectLight(new Vector3(0, -1, 1)));
            let vec3 = dou.recyclable(Vector3);
            vec3.copy(this._directLight.direction);
            vec3.negate();
            vec3.addScalar(1000);
            this._shadowCamera.globalPosition = vec3;
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
         * 如需要渲染阴影必须先设置当前阴影灯光, 暂支持方向光, 灯光中的变换会用于阴影像机的变换
         * * 注意: 在阴影摄像机视锥中的物体, 阴影才会渲染
         */
        public castShadowLight(light: DirectLight): void {
            this._directLight = light;
            this._shadowCamera.updateViewport(0, 0, 2048, 2048);
            this._shadowCamera.near = 1;
            this._shadowCamera.far = 3000;
            light.addChild(this._shadowCamera);
        }

        public update(entityCollect: EntityCollect, camera: Camera3D, time: number, delay: number, viewPort: Rectangle): void {
            Engine.context3DProxy.clearColor(1.0, 1.0, 1.0, 1.0);
            Engine.context3DProxy.clear(Context3DProxy.gl.COLOR_BUFFER_BIT | Context3DProxy.gl.DEPTH_BUFFER_BIT);
            this._shadowRender.draw(time, delay, Engine.context3DProxy, entityCollect, this._shadowCamera, viewPort);
        }
    }
}
