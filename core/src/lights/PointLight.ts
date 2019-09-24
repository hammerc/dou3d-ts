namespace dou3d {
    /**
     * 点光源
     * @author wizardc
     */
    export class PointLight extends LightBase {
        /**
         * 光源数据结构长度
         */
        public static readonly stride: number = 12;

        private _radius: number = 100;
        private _cutoff: number = 0.01;

        public constructor(color: number) {
            super();
            this._lightType = LightType.point;
            this.diffuse = color;
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

        /**
         * 灯光衰减度
         */
        public set cutoff(value: number) {
            this._cutoff = value;
        }
        public get cutoff(): number {
            return this._cutoff;
        }

        public updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void {
            lightData[index * PointLight.stride] = this.globalPosition.x;
            lightData[index * PointLight.stride + 1] = this.globalPosition.y;
            lightData[index * PointLight.stride + 2] = this.globalPosition.z;
            lightData[index * PointLight.stride + 3] = this._diffuse.x * this._intensity;
            lightData[index * PointLight.stride + 4] = this._diffuse.y * this._intensity;
            lightData[index * PointLight.stride + 5] = this._diffuse.z * this._intensity;
            lightData[index * PointLight.stride + 6] = this._ambient.x;
            lightData[index * PointLight.stride + 7] = this._ambient.y;
            lightData[index * PointLight.stride + 8] = this._ambient.z;
            lightData[index * PointLight.stride + 9] = this._intensity;
            lightData[index * PointLight.stride + 10] = this._radius;
            lightData[index * PointLight.stride + 11] = this._cutoff;
        }
    }
}
