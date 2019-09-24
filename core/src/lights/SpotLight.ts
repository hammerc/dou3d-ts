namespace dou3d {
    /**
     * 聚光灯
     * @author wizardc
     */
    export class SpotLight extends LightBase {
        /**
         * 光源数据结构长度
         */
        public static readonly stride: number = 14;

        private _spotExponent: number = 1.1;
        private _spotCosCutoff: number = 0.1;
        private _constantAttenuation: number = 0.1;
        private _linearAttenuation: number = 0.1;
        private _quadraticAttenuation: number = 0.1;

        public constructor(color: number) {
            super();
            this._lightType = LightType.spot;
            this.diffuse = color;
        }

        /**
         * 裁切范围, 照射范围的大小指数
         */
        public set spotCosCutoff(value: number) {
            this._spotCosCutoff = value;
        }
        public get spotCosCutoff(): number {
            return this._spotCosCutoff;
        }

        /**
         * 灯光强弱, 圆形范围内随半径大小改变发生的灯光强弱指数
         */
        public set spotExponent(value: number) {
            this._spotExponent = value;
        }
        public get spotExponent(): number {
            return this._spotExponent;
        }

        /**
         * 灯光衰减, 圆形范围内随半径大小改变发生的灯光衰减常数指数
         */
        public set constantAttenuation(value: number) {
            this._constantAttenuation = value;
        }
        public get constantAttenuation(): number {
            return this._constantAttenuation;
        }

        /**
         * 灯光线性衰减, 圆形范围内随半径大小改变发生的灯光线性衰减
         */
        public set linearAttenuation(value: number) {
            this._linearAttenuation = value;
        }
        public get linearAttenuation(): number {
            return this._linearAttenuation;
        }

        /**
         * 灯光线性2次衰减, 圆形范围内随半径大小改变发生的灯光线性2次衰减
         */
        public set quadraticAttenuation(value: number) {
            this._quadraticAttenuation = value;
        }
        public get quadraticAttenuation(): number {
            return this._quadraticAttenuation;
        }

        public updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void {
            lightData[index * SpotLight.stride] = this.globalPosition.x;
            lightData[index * SpotLight.stride + 1] = this.globalPosition.y;
            lightData[index * SpotLight.stride + 2] = this.globalPosition.z;
            lightData[index * SpotLight.stride + 3] = this.globalRotation.x * MathUtil.DEG_RAD;
            lightData[index * SpotLight.stride + 4] = this.globalRotation.y * MathUtil.DEG_RAD;
            lightData[index * SpotLight.stride + 5] = this.globalRotation.z * MathUtil.DEG_RAD;
            lightData[index * SpotLight.stride + 6] = this._diffuse.x;
            lightData[index * SpotLight.stride + 7] = this._diffuse.y;
            lightData[index * SpotLight.stride + 8] = this._diffuse.z;
            lightData[index * SpotLight.stride + 9] = this._spotExponent;
            lightData[index * SpotLight.stride + 10] = this._spotCosCutoff;
            lightData[index * SpotLight.stride + 11] = this._constantAttenuation;
            lightData[index * SpotLight.stride + 12] = this._linearAttenuation;
            lightData[index * SpotLight.stride + 13] = this._quadraticAttenuation;
        }
    }
}
