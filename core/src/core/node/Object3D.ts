namespace dou3d {
    /**
     * 3D 空间中的一个对象
     * @author wizardc
     */
    export class Object3D extends dou.EventDispatcher {
        protected _position: Vector3;
        protected _rotation: Vector3;
        protected _scale: Vector3;
        protected _orientation: Quaternion;

        protected _globalPosition: Vector3;
        protected _globalRotation: Vector3;
        protected _globalScale: Vector3;
        protected _globalOrientation: Quaternion;

        protected _globalMatrix: Matrix4;

        protected _globalTransformChanged: boolean;

        protected _visible: boolean = true;

        protected _parent: ObjectContainer3D;

        protected _name: string;
        protected _layer: Layer = Layer.normal;

        protected _controller: ControllerBase;

        public constructor() {
            super();

            this._globalMatrix = new Matrix4();

            this._position = new Vector3();
            this._rotation = new Vector3();
            this._scale = new Vector3(1, 1, 1);
            this._orientation = new Quaternion();

            this._globalPosition = new Vector3();
            this._globalRotation = new Vector3();
            this._globalScale = new Vector3(1, 1, 1);
            this._globalOrientation = new Quaternion();
        }

        public set position(value: Readonly<Vector3>) {
            if (this._position.equal(value)) {
                return;
            }
            this._position.copy(value);
            this.invalidTransform();
        }
        public get position(): Readonly<Vector3> {
            return this._position;
        }

        public set x(value: number) {
            if (this._position.x == value) {
                return;
            }
            this._position.x = value;
            this.invalidTransform();
        }
        public get x(): number {
            return this._position.x;
        }

        public set y(value: number) {
            if (this._position.y == value) {
                return;
            }
            this._position.y = value;
            this.invalidTransform();
        }
        public get y(): number {
            return this._position.y;
        }

        public set z(value: number) {
            if (this._position.z == value) {
                return;
            }
            this._position.z = value;
            this.invalidTransform();
        }
        public get z(): number {
            return this._position.z;
        }

        public set rotation(value: Readonly<Vector3>) {
            if (this._rotation.equal(value)) {
                return;
            }
            this._rotation.copy(value);
            this._orientation.fromEuler(this._rotation.x, this._rotation.y, this._rotation.z);
            this.invalidTransform();
        }
        public get rotation(): Readonly<Vector3> {
            return this._rotation;
        }

        public set rotationX(value: number) {
            if (this._rotation.x == value) {
                return;
            }
            this._rotation.x = value;
            this._orientation.fromEuler(this._rotation.x, this._rotation.y, this._rotation.z);
            this.invalidTransform();
        }
        public get rotationX(): number {
            return this._rotation.x;
        }

        public set rotationY(value: number) {
            if (this._rotation.y == value) {
                return;
            }
            this._rotation.y = value;
            this._orientation.fromEuler(this._rotation.x, this._rotation.y, this._rotation.z);
            this.invalidTransform();
        }
        public get rotationY(): number {
            return this._rotation.y;
        }

        public set rotationZ(value: number) {
            if (this._rotation.z == value) {
                return;
            }
            this._rotation.z = value;
            this._orientation.fromEuler(this._rotation.x, this._rotation.y, this._rotation.z);
            this.invalidTransform();
        }
        public get rotationZ(): number {
            return this._rotation.z;
        }

        public set scale(value: Readonly<Vector3>) {
            if (this._scale.equal(value)) {
                return;
            }
            this._scale.copy(value);
            this.invalidTransform();
        }
        public get scale(): Readonly<Vector3> {
            return this._scale;
        }

        public set scaleX(value: number) {
            if (this._scale.x == value) {
                return;
            }
            this._scale.x = value;
            this.invalidTransform();
        }
        public get scaleX(): number {
            return this._scale.x;
        }

        public set scaleY(value: number) {
            if (this._scale.y == value) {
                return;
            }
            this._scale.y = value;
            this.invalidTransform();
        }
        public get scaleY(): number {
            return this._scale.y;
        }

        public set scaleZ(value: number) {
            if (this._scale.z == value) {
                return;
            }
            this._scale.z = value;
            this.invalidTransform();
        }
        public get scaleZ(): number {
            return this._scale.z;
        }

        public set orientation(value: Readonly<Quaternion>) {
            if (this._orientation.equal(value)) {
                return;
            }
            this._orientation.copy(value);
            this.invalidTransform();
        }
        public get orientation(): Readonly<Quaternion> {
            return this._orientation;
        }

        public set orientationX(value: number) {
            if (this._orientation.x == value) {
                return;
            }
            this._orientation.x = value;
            this.invalidTransform();
        }
        public get orientationX(): number {
            return this._orientation.x;
        }

        public set orientationY(value: number) {
            if (this._orientation.y == value) {
                return;
            }
            this._orientation.y = value;
            this.invalidTransform();
        }
        public get orientationY(): number {
            return this._orientation.y;
        }

        public set orientationZ(value: number) {
            if (this._orientation.z == value) {
                return;
            }
            this._orientation.z = value;
            this.invalidTransform();
        }
        public get orientationZ(): number {
            return this._orientation.z;
        }

        public set orientationW(value: number) {
            if (this._orientation.w == value) {
                return;
            }
            this._orientation.w = value;
            this.invalidTransform();
        }
        public get orientationW(): number {
            return this._orientation.w;
        }

        public set globalPosition(value: Vector3) {
            if (this._parent) {
                let quaternion = dou.recyclable(Quaternion);
                quaternion.inverse(this._parent.globalOrientation);
                let vector = dou.recyclable(Vector3);
                vector.subtract(this._parent._globalPosition, value);
                quaternion.transformVector(vector, vector);
                vector.divide(this._parent._globalScale);
                this._position.copy(vector);
                quaternion.recycle();
                vector.recycle();
                this.invalidTransform();
            }
            else {
                this._position.copy(value);
            }
        }
        public get globalPosition(): Vector3 {
            this.validateTransformNow();
            return this._globalPosition;
        }

        public set globalRotation(value: Vector3) {
            let quaternion = dou.recyclable(Quaternion);
            quaternion.fromEuler(value.x, value.y, value.z);
            this._globalOrientation.copy(quaternion);
            quaternion.recycle();
            this.invalidTransform();
        }
        public get globalRotation(): Vector3 {
            this.validateTransformNow();
            return this._globalRotation;
        }

        public set globalScale(value: Vector3) {
            if (this._parent) {
                let vector = dou.recyclable(Vector3);
                vector.divide(value, this._parent._globalScale);
                this._scale.copy(vector);
                vector.recycle();
                this.invalidTransform();
            }
            else {
                this._scale.copy(value);
            }
        }
        public get globalScale(): Vector3 {
            this.validateTransformNow();
            return this._globalScale;
        }

        public set globalOrientation(value: Quaternion) {
            if (this._parent) {
                let quaternion = dou.recyclable(Quaternion);
                quaternion.inverse(this._parent.globalOrientation);
                quaternion.multiply(quaternion, value);
                this._orientation.copy(quaternion);
                quaternion.recycle();
                this.invalidTransform();
            }
            else {
                this._orientation.copy(value);
            }
        }
        public get globalOrientation(): Quaternion {
            this.validateTransformNow();
            return this._globalOrientation;
        }

        public set globalMatrix(value: Matrix4) {
            value.decompose(this._globalPosition, this._globalOrientation, this._globalScale);
            this.invalidTransform();
        }
        public get globalMatrix(): Matrix4 {
            this.validateTransformNow();
            return this._globalMatrix;
        }

        public set visible(value: boolean) {
            this._visible = value;
        }
        public get visible(): boolean {
            return this._visible;
        }

        public get parent(): ObjectContainer3D {
            return this._parent;
        }

        public set name(value: string) {
            this._name = value;
        }
        public get name(): string {
            return this._name;
        }

        /**
         * 渲染的层
         */
        public set layer(value: Layer) {
            this._layer = value;
        }
        public get layer(): Layer {
            return this._layer;
        }

        public set controller(value: ControllerBase) {
            this._controller = value;
        }
        public get controller(): ControllerBase {
            return this._controller;
        }

        public setParent(parent: ObjectContainer3D) {
            this._parent = parent;
        }

        public invalidTransform(): void {
            this.invalidGlobalTransform();
        }

        public invalidGlobalTransform(): void {
            this._globalTransformChanged = true;
        }

        /**
         * 立即刷新当前的变换矩阵
         */
        public validateTransformNow(): void {
            this.updateGlobalTransform();
        }

        protected updateGlobalTransform(): void {
            if (!this._globalTransformChanged) {
                return;
            }
            if (this._parent) {
                this._globalOrientation.multiply(this._parent.globalOrientation, this._orientation);
                this._globalOrientation.toEuler(this._globalRotation);
                this._globalScale.multiply(this._parent.globalScale, this._scale);
                this._globalPosition.multiply(this._parent.globalScale, this._position);
                this._parent.globalOrientation.transformVector(this._globalPosition, this._globalPosition);
                this._globalPosition.add(this._parent.globalPosition, this._globalPosition);
            }
            else {
                this._globalOrientation.copy(this._orientation);
                this._globalPosition.copy(this._position);
                this._globalScale.copy(this._scale);
                this._globalRotation.copy(this._rotation);
            }
            this._globalTransformChanged = false;
            this.markTransform();
            this.onTransformUpdate();
        }

        protected markTransform(): void {
            this._globalMatrix.compose(this._globalPosition, this._globalOrientation, this._globalScale);
        }

        protected onTransformUpdate(): void {
        }

        /**
         * 朝向指定位置
         */
        public lookAt(from: Vector3, to: Vector3, up: Vector3 = Vector3.UP): void {
            this.globalPosition = from;
            let matrix = dou.recyclable(Matrix4);
            matrix.lookAt(from, to, up);
            matrix.inverse();
            let quaternion = dou.recyclable(Quaternion);
            matrix.decompose(null, quaternion);
            this.globalOrientation = quaternion;
            matrix.recycle();
            quaternion.recycle();
        }

        /**
         * 朝向指定的目标
         */
        public lookAtTarget(target: Object3D): void {
            let vector = dou.recyclable(Vector4);
            target.globalMatrix.transformVector(Vector3.UP, vector);
            let matrix = dou.recyclable(Matrix4);
            matrix.lookAt(this._globalPosition, this._globalPosition, vector);
            matrix.inverse();
            let quaternion = dou.recyclable(Quaternion);
            matrix.decompose(null, quaternion);
            this.globalOrientation = quaternion;
            vector.recycle();
            matrix.recycle();
            quaternion.recycle();
        }

        /**
         * 将对象的本地坐标转换为全局坐标
         */
        public localToGlobal(local: IVector3, result?: IVector4): IVector4 {
            result = result || dou.recyclable(Vector4);
            if (this._parent) {
                this.globalMatrix.transformVector(local, result);
            }
            else {
                result.x = local.x;
                result.y = local.y;
                result.z = local.z;
            }
            return result;
        }

        /**
         * 将全局坐标转换为对象的本地坐标
         */
        public globalToLocal(local: IVector3, result?: IVector4): IVector4 {
            result = result || dou.recyclable(Vector4);
            if (this._parent) {
                let inverse = dou.recyclable(Matrix4);
                inverse.copy(this.globalMatrix);
                inverse.inverse();
                inverse.transformVector(local, result);
                inverse.recycle();
            }
            else {
                result.x = local.x;
                result.y = local.y;
                result.z = local.z;
            }
            return result;
        }

        /**
         * 更新
         * @param time 当前时间
         * @param delay 每帧时间间隔
         * @param camera 当前渲染的摄相机
         */
        public update(time: number, delay: number, camera: Camera3D): void {
            if (this._controller && this._controller.autoUpdate) {
                this._controller.update(time, delay);
            }
        }

        /**
         * 销毁本对象
         */
        public dispose(): void {
            this._controller = null;
        }
    }
}
