namespace dou3d {
    /**
     * 聚光灯
     * @author wizardc
     */
    export class SpotLight extends LightBase {
        /**
         * 光源数据结构长度
         */
        public static readonly stride: number = 12;

        private _range: number = 10;
        private _angle: number = 60;
        private _penumbra: number = 0;

        public constructor(color: number = 0xffffff) {
            super();
            this._lightType = LightType.spot;
            this.color = color;
        }

        /**
         * 光照范围
         */
        public set range(value: number) {
            this._range = value;
        }
        public get range(): number {
            return this._range;
        }

        /**
         * 角度
         */
        public set angle(value: number) {
            this._angle = value;
        }
        public get angle(): number {
            return this._angle;
        }

        /**
         * 半影
         */
        public set penumbra(value: number) {
            this._penumbra = value;
        }
        public get penumbra(): number {
            return this._penumbra;
        }

        public updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void {
            super.updateLightData(camera, index, lightData);

            lightData[index * SpotLight.stride] = this.globalPosition.x;
            lightData[index * SpotLight.stride + 1] = this.globalPosition.y;
            lightData[index * SpotLight.stride + 2] = this.globalPosition.z;
            lightData[index * SpotLight.stride + 3] = this._direction.x;
            lightData[index * SpotLight.stride + 4] = this._direction.y;
            lightData[index * SpotLight.stride + 5] = this._direction.z;
            lightData[index * SpotLight.stride + 6] = this._colorVec4.x * this._intensity;
            lightData[index * SpotLight.stride + 7] = this._colorVec4.y * this._intensity;
            lightData[index * SpotLight.stride + 8] = this._colorVec4.z * this._intensity;
            lightData[index * PointLight.stride + 9] = this._range;
            lightData[index * PointLight.stride + 10] = Math.cos(this._angle * 0.5 * MathUtil.DEG_RAD);
            lightData[index * PointLight.stride + 11] = Math.cos(this._angle * 0.5 * MathUtil.DEG_RAD * (1 - this._penumbra));
        }
    }
}
