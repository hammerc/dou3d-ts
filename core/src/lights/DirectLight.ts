namespace dou3d {
    /**
     * 平行灯光
     * * 当前引擎中, 只有平行光可以产生阴影
     * @author wizardc
     */
    export class DirectLight extends LightBase {
        /**
         * 光源数据结构长度
         */
        public static readonly stride: number = 6;

        public constructor(color: number = 0xffffff) {
            super();
            this._lightType = LightType.direct;
            this.color = color;
        }

        public updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void {
            super.updateLightData(camera, index, lightData);

            lightData[index * DirectLight.stride] = this._direction.x;
            lightData[index * DirectLight.stride + 1] = this._direction.y;
            lightData[index * DirectLight.stride + 2] = this._direction.z;
            lightData[index * DirectLight.stride + 3] = this._colorVec4.x * this._intensity;
            lightData[index * DirectLight.stride + 4] = this._colorVec4.y * this._intensity;
            lightData[index * DirectLight.stride + 5] = this._colorVec4.z * this._intensity;
        }
    }
}
