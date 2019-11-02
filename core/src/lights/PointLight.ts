namespace dou3d {
    /**
     * 点光源
     * @author wizardc
     */
    export class PointLight extends LightBase {
        /**
         * 光源数据结构长度
         */
        public static readonly stride: number = 7;

        private _radius: number = 100;

        public constructor(color: number = 0xffffff) {
            super();
            this._lightType = LightType.point;
            this.color = color;
        }

        /**
         * 灯光半径
         */
        public set radius(value: number) {
            this._radius = value;
        }
        public get radius(): number {
            return this._radius;
        }

        public updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void {
            super.updateLightData(camera, index, lightData);

            lightData[index * PointLight.stride] = this.globalPosition.x;
            lightData[index * PointLight.stride + 1] = this.globalPosition.y;
            lightData[index * PointLight.stride + 2] = this.globalPosition.z;
            lightData[index * PointLight.stride + 3] = this._colorVec4.x * this._intensity;
            lightData[index * PointLight.stride + 4] = this._colorVec4.y * this._intensity;
            lightData[index * PointLight.stride + 5] = this._colorVec4.z * this._intensity;
            lightData[index * PointLight.stride + 6] = this._radius;
        }
    }
}
