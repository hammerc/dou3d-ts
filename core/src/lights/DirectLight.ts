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
        public static readonly stride: number = 9;

        private _direction: Vector3;

        public constructor(direction: Vector3) {
            super();
            this._lightType = LightType.direct;
            this._direction = new Vector3(0, 0, 1);
            this.direction = direction;
        }

        public set direction(value: Vector3) {
            this._direction.copy(value);
            this._direction.normalize();
            let quaternion = dou.recyclable(Quaternion);
            quaternion.fromVectors(Vector3.ZERO, this._direction);
            this.orientation = quaternion;
            quaternion.recycle();
        }
        public get direction(): Vector3 {
            this.updateGlobalTransform();
            return this._direction;
        }

        protected onTransformUpdate(): void {
            super.onTransformUpdate();

            this.orientation.transformVector(Vector3.UP, this._direction);
            this._direction.normalize();
            if (this.parent) {
                this.parent.globalOrientation.transformVector(this._direction, this._direction);
                this._direction.normalize();
            }
        }

        public updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void {
            lightData[index * DirectLight.stride + 0] = this._direction.x;
            lightData[index * DirectLight.stride + 1] = this._direction.y;
            lightData[index * DirectLight.stride + 2] = this._direction.z;
            lightData[index * DirectLight.stride + 3] = this._diffuse.x * this._intensity;
            lightData[index * DirectLight.stride + 4] = this._diffuse.y * this._intensity;
            lightData[index * DirectLight.stride + 5] = this._diffuse.z * this._intensity;
            lightData[index * DirectLight.stride + 6] = this._ambient.x;
            lightData[index * DirectLight.stride + 7] = this._ambient.y;
            lightData[index * DirectLight.stride + 8] = this._ambient.z;
        }
    }
}
