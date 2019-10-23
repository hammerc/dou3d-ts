namespace dou3d {
    /**
     * 始终朝向指定目标的控制器
     * @author wizardc
     */
    export class LookAtController extends ControllerBase {
        protected _lookAtPosition: Vector3;
        protected _lookAtObject: Object3D;
        protected _upAxis: Vector3 = Vector3.UP;

        public constructor(target?: Object3D, lookAtObject?: Object3D | Vector3) {
            super(target);
            if (lookAtObject) {
                if (lookAtObject instanceof Object3D) {
                    this.lookAtObject = lookAtObject;
                }
                else {
                    this.lookAtPosition = lookAtObject;
                }
            }
        }

        public set lookAtPosition(value: Vector3) {
            this._lookAtPosition = value;
        }
        public get lookAtPosition(): Vector3 {
            return this._lookAtPosition;
        }

        public set lookAtObject(value: Object3D) {
            this._lookAtObject = value;
        }
        public get lookAtObject(): Object3D {
            return this._lookAtObject;
        }

        public set upAxis(value: Vector3) {
            this._upAxis = value;
        }
        public get upAxis(): Vector3 {
            return this._upAxis;
        }

        public update(time: number, delay: number): void {
            if (this._target) {
                if (this._lookAtPosition) {
                    this._target.lookAt(this._target.globalPosition, this._lookAtPosition, this._upAxis);
                }
                else if (this._lookAtObject) {
                    if (this._target.parent === this._lookAtObject.parent) {
                        this._target.lookAt(this._target.position, this._lookAtObject.position, this._upAxis);
                    }
                    else {
                        let vect4 = dou.recyclable(Vector4);
                        this._target.parent.globalToLocal(this._lookAtObject.globalPosition, vect4);
                        let vect3 = dou.recyclable(Vector3);
                        vect3.set(vect4.x, vect4.y, vect4.z);
                        this._target.lookAt(this._target.position, vect3, this._upAxis);
                        vect4.recycle();
                        vect3.recycle();
                    }
                }
                else {
                    this._target.lookAt(this._target.globalPosition, Vector3.ZERO, this._upAxis);
                }
            }
        }
    }
}
