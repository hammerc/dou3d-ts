namespace dou3d {
    /**
     * 多参数控制的始终朝向指定目标的控制器
     * @author wizardc
     */
    export class HoverController extends LookAtController {
        protected _panAngle: number = 0;
        protected _tiltAngle: number = 90;
        protected _distance: number = 1000;
        protected _minPanAngle: number = -Infinity;
        protected _maxPanAngle: number = Infinity;
        protected _minTiltAngle: number = -90;
        protected _maxTiltAngle: number = 90;
        protected _steps: number = 8;
        protected _yFactor: number = 2;
        protected _wrapPanAngle: boolean = false;

        private _currentPanAngle: number;
        private _currentTiltAngle: number;

        public constructor(target?: Object3D, lookAtObject?: Object3D | Vector3, panAngle: number = 0, tiltAngle: number = 90, distance: number = 1000, minPanAngle: number = NaN, maxPanAngle: number = NaN, minTiltAngle: number = -90, maxTiltAngle: number = 90, steps: number = 8, yFactor: number = 2, wrapPanAngle: boolean = false) {
            super(target, lookAtObject);
            this.distance = distance;
            this.panAngle = panAngle;
            this.tiltAngle = tiltAngle;
            this.minPanAngle = minPanAngle || -Infinity;
            this.maxPanAngle = maxPanAngle || Infinity;
            this.minTiltAngle = minTiltAngle;
            this.maxTiltAngle = maxTiltAngle;
            this.steps = steps;
            this.yFactor = yFactor;
            this.wrapPanAngle = wrapPanAngle;
            this._currentPanAngle = this._panAngle;
            this._currentTiltAngle = this._tiltAngle;
        }

        /**
         * 水平角度
         */
        public set panAngle(value: number) {
            value = MathUtil.clamp(value, this._minPanAngle, this._maxPanAngle);
            if (this._panAngle == value) {
                return;
            }
            this._panAngle = value;
        }
        public get panAngle(): number {
            return this._panAngle;
        }

        /**
         * 倾斜角度
         */
        public set tiltAngle(value: number) {
            value = MathUtil.clamp(value, this._minTiltAngle, this._maxTiltAngle);
            if (this._tiltAngle == value) {
                return;
            }
            this._tiltAngle = value;
        }
        public get tiltAngle(): number {
            return this._tiltAngle;
        }

        /**
         * 距离
         */
        public set distance(value: number) {
            if (this._distance == value) {
                return;
            }
            this._distance = value;
        }
        public get distance(): number {
            return this._distance;
        }

        /**
         * 最小水平角度
         */
        public set minPanAngle(value: number) {
            if (this._minPanAngle == value) {
                return;
            }
            this._minPanAngle = value;
            this.panAngle = MathUtil.clamp(value, this._minPanAngle, this._maxPanAngle);
        }
        public get minPanAngle(): number {
            return this._minPanAngle;
        }

        /**
         * 最大水平角度
         */
        public set maxPanAngle(value: number) {
            if (this._maxPanAngle == value) {
                return;
            }
            this._maxPanAngle = value;
            this.panAngle = MathUtil.clamp(value, this._minPanAngle, this._maxPanAngle);
        }
        public get maxPanAngle(): number {
            return this._maxPanAngle;
        }

        /**
         * 最小倾斜角度
         */
        public set minTiltAngle(value: number) {
            if (this._minTiltAngle == value) {
                return;
            }
            this._minTiltAngle = value;
            this.tiltAngle = MathUtil.clamp(value, this._minTiltAngle, this._maxTiltAngle);
        }
        public get minTiltAngle(): number {
            return this._minTiltAngle;
        }

        /**
         * 最大倾斜角度
         */
        public set maxTiltAngle(value: number) {
            if (this._maxTiltAngle == value) {
                return;
            }
            this._maxTiltAngle = value;
            this.tiltAngle = MathUtil.clamp(value, this._minTiltAngle, this._maxTiltAngle);
        }
        public get maxTiltAngle(): number {
            return this._maxTiltAngle;
        }

        /**
         * 每帧缓动的距离的除数
         * * 为 0 表示不进行缓动, 数字越大缓动速度越慢
         */
        public set steps(value: number) {
            if (this._steps == value) {
                return;
            }
            this._steps = value;
        }
        public get steps(): number {
            return this._steps;
        }

        /**
         * y 轴和 x 轴的距离比值
         * * 为 1 时表示为圆形, 其它表示为椭圆形
         */
        public set yFactor(value: number) {
            if (this._yFactor == value) {
                return;
            }
            this._yFactor = value;
        }
        public get yFactor(): number {
            return this._yFactor;
        }

        /**
         * 当 Pan 的角度超过 360 度之后, 是否将其重新设定为360度以内
         */
        public set wrapPanAngle(value: boolean) {
            if (this._wrapPanAngle == value) {
                return;
            }
            this._wrapPanAngle = value;
        }
        public get wrapPanAngle(): boolean {
            return this._wrapPanAngle;
        }

        public update(time: number, delay: number): void {
            if (this._tiltAngle != this._currentTiltAngle || this._panAngle != this._currentPanAngle) {
                if (this._wrapPanAngle) {
                    if (this._panAngle < 0) {
                        this._currentPanAngle += this._panAngle % 360 + 360 - this._panAngle;
                        this._panAngle = this._panAngle % 360 + 360;
                    }
                    else {
                        this._currentPanAngle += this._panAngle % 360 - this._panAngle;
                        this._panAngle = this._panAngle % 360;
                    }
                    while (this._panAngle - this._currentPanAngle < -180) {
                        this._currentPanAngle -= 360;
                    }
                    while (this._panAngle - this._currentPanAngle > 180) {
                        this._currentPanAngle += 360;
                    }
                }
                if (this._steps > 0) {
                    this._currentTiltAngle += (this._tiltAngle - this._currentTiltAngle) / (this._steps + 1);
                    this._currentPanAngle += (this._panAngle - this._currentPanAngle) / (this._steps + 1);
                }
                else {
                    this._currentPanAngle = this._panAngle;
                    this._currentTiltAngle = this._tiltAngle;
                }
                if ((Math.abs(this._tiltAngle - this._currentTiltAngle) < 0.01) && (Math.abs(this._panAngle - this._currentPanAngle) < 0.01)) {
                    this._currentTiltAngle = this._tiltAngle;
                    this._currentPanAngle = this._panAngle;
                }
            }
            if (!this._target) {
                return;
            }
            let pos = dou.recyclable(Vector3);
            if (this._lookAtPosition) {
                pos.x = this._lookAtPosition.x;
                pos.y = this._lookAtPosition.y;
                pos.z = this._lookAtPosition.z;
            }
            else if (this._lookAtObject) {
                if (this._target.parent === this._lookAtObject.parent) {
                    pos.x = this._lookAtObject.x;
                    pos.y = this._lookAtObject.y;
                    pos.z = this._lookAtObject.z;
                }
                else {
                    let vect4 = dou.recyclable(Vector4);
                    this._target.parent.globalToLocal(this._lookAtObject.globalPosition, vect4);
                    pos.set(vect4.x, vect4.y, vect4.z);
                    vect4.recycle();
                }
            }
            else {
                pos.x = 0;
                pos.y = 0;
                pos.z = 0;
            }
            this._target.x = pos.x + this._distance * Math.sin(this._currentPanAngle * MathUtil.DEG_RAD) * Math.cos(this._currentTiltAngle * MathUtil.DEG_RAD);
            this._target.z = pos.z + this._distance * Math.cos(this._currentPanAngle * MathUtil.DEG_RAD) * Math.cos(this._currentTiltAngle * MathUtil.DEG_RAD);
            this._target.y = pos.y + this._distance * Math.sin(this._currentTiltAngle * MathUtil.DEG_RAD) * this._yFactor;
            pos.recycle();
            super.update(time, delay);
        }
    }
}
