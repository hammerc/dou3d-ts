namespace dou3d {
    /**
     * 控制器基类
     * @author wizardc
     */
    export abstract class ControllerBase {
        protected _autoUpdate: boolean = true;
        protected _target: Object3D;

        public constructor(target?: Object3D) {
            this.target = target;
        }

        public set autoUpdate(value: boolean) {
            if (this._autoUpdate == value) {
                return;
            }
            this._autoUpdate = value;
            if (this._target) {
                this._target.controller = this._autoUpdate ? this : null;
            }
        }
        public get autoUpdate(): boolean {
            return this._autoUpdate;
        }

        public set target(value: Object3D) {
            if (this._target == value) {
                return;
            }
            if (this._target && this._autoUpdate) {
                this._target.controller = null;
            }
            this._target = value;
            if (this._target && this._autoUpdate) {
                this._target.controller = this;
            }
        }
        public get target(): Object3D {
            return this._target;
        }

        public abstract update(time: number, delay: number): void;
    }
}
