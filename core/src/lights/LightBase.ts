namespace dou3d {
    /**
     * 灯光基类
     * @author wizardc
     */
    export abstract class LightBase extends ObjectContainer3D {
        protected _lightType: LightType;

        protected _color: number = 0xffffff;
        protected _colorVec4: Vector4;

        protected _intensity: number = 1;

        protected _direction: Vector3;

        protected _change: boolean = true;

        public constructor() {
            super();
            this._colorVec4 = new Vector4(1, 1, 1);
            this._direction = new Vector3();
        }

        public get lightType(): LightType {
            return this._lightType;
        }

        /**
         * 灯光强度
         * * 影响灯光的强弱显示, 值的范围 0~没有上限, 但是值过大会导致画面过度曝光
         */
        public set intensity(value: number) {
            if (this._intensity != value) {
                this._intensity = value;
                this._change = false;
            }
        }
        public get intensity(): number {
            return this._intensity;
        }

        /**
         * 灯光漫反射颜色
         * * 直接影响最终灯光的颜色色值
         */
        public set color(value: number) {
            this._color = value;
            this._colorVec4.w = (value >> 24 & 0xff) / 255;
            this._colorVec4.x = (value >> 16 & 0xff) / 255;
            this._colorVec4.y = (value >> 8 & 0xff) / 255;
            this._colorVec4.z = (value & 0xff) / 255;
            this._change = false;
        }
        public get color(): number {
            return this._color;
        }

        protected onTransformUpdate(): void {
            super.onTransformUpdate();

            // 更新方向
            // 注: 在所有欧拉角都为 0 时, 方向为 Z 轴正方向
            this._globalMatrix.forward(this._direction);
        }

        /**
         * 更新灯光数据
         */
        public updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void {
            this.validateTransformNow();
        }
    }
}
