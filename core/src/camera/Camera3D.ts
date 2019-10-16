namespace dou3d {
    /**
     * 3D 摄像机对象
     * @author wizardc
     */
    export class Camera3D extends Object3D {
        private _cameraType: CameraType;

        private _projectMatrix: Matrix4;
        private _orthProjectMatrix: Matrix4;

        private _frustum: Frustum;

        private _viewPort: Rectangle;
        private _aspectRatio: number = 1;
        private _fov: number = 0.78;
        private _near: number = 1;
        private _far: number = 10000;

        private _viewMatrix: Matrix4;
        private _viewProjectionMatrix: Matrix4;

        private _lookAtPosition: Vector3;
        private _orthProjectChange: boolean = true;

        public constructor(cameraType: CameraType = CameraType.perspective) {
            super();
            this._projectMatrix = new Matrix4();
            this._orthProjectMatrix = new Matrix4();
            this._viewPort = new Rectangle();
            this._lookAtPosition = new Vector3();
            this._viewMatrix = new Matrix4();
            this._viewMatrix.identity();
            this._viewProjectionMatrix = new Matrix4();
            this._viewProjectionMatrix.identity();
            this._frustum = new Frustum(this);
            this._orthProjectMatrix.orthographicProjectMatrix(0, 0, this._viewPort.w, this._viewPort.h, this._near, this._far);
            this.cameraType = cameraType;
        }

        /**
         * 相机投影矩阵
         */
        public get projectMatrix(): Matrix4 {
            return this._projectMatrix;
        }

        /**
         * 相机的视椎体, 用来检测是否在当前相机可视范围内
         */
        public get frustum(): Frustum {
            return this._frustum;
        }

        /**
         * 相机类型
         */
        public set cameraType(cameraType: CameraType) {
            this._cameraType = cameraType;
            switch (cameraType) {
                case CameraType.orthogonal:
                    this._projectMatrix.orthographicProjectMatrix(0, 0, this._viewPort.w, this._viewPort.h, this._near, this._far);
                    break;
                case CameraType.perspective:
                    this._projectMatrix.fromProjection(this._near, this._far, this._fov, 1, 1, this._aspectRatio, 1);
                    break;
            }
            this._orthProjectMatrix.orthographicProjectMatrix(0, 0, this._viewPort.w, this._viewPort.h, this._near, this._far);
            this._frustum.updateFrustum();
        }
        public get cameraType(): CameraType {
            return this._cameraType;
        }

        /**
         * 相机横纵比
         */
        public set aspectRatio(value: number) {
            if (this._aspectRatio != value) {
                this._aspectRatio = value;
                this.cameraType = this._cameraType;
            }
        }
        public get aspectRatio(): number {
            return this._aspectRatio;
        }

        /**
         * 投影视角
         */
        public set fieldOfView(value: number) {
            if (this._fov != value) {
                this._fov = value;
                this.cameraType = this._cameraType;
            }
        }
        public get fieldOfView(): number {
            return this._fov;
        }

        /**
         * 相机近截面
         */
        public set near(value: number) {
            if (this._near != value) {
                this._near = value;
                this.cameraType = this._cameraType;
            }
        }
        public get near(): number {
            return this._near;
        }

        /**
         * 相机远截面
         */
        public set far(value: number) {
            if (this._far != value) {
                this._far = value;
                this.cameraType = this._cameraType;
            }
        }
        public get far(): number {
            return this._far;
        }

        /**
         * 视口
         */
        public set viewPort(value: Rectangle) {
            this._viewPort.copy(value);
        }
        public get viewPort(): Rectangle {
            return this._viewPort;
        }

        /**
         * 相机视图投影矩阵
         */
        public get viewProjectionMatrix(): Matrix4 {
            this._viewProjectionMatrix.copy(this._viewMatrix);
            this._viewProjectionMatrix.multiply(this._projectMatrix);
            return this._viewProjectionMatrix;
        }

        /**
         * 相机正交投影矩阵
         */
        public get orthProjectionMatrix(): Matrix4 {
            if (this._orthProjectChange) {
                this._orthProjectChange = false;
                this._orthProjectMatrix.orthographicProjectMatrix(0, 0, this._viewPort.w, this._viewPort.h, this._near, this._far);
            }
            return this._orthProjectMatrix;
        }

        /**
         * 更新视口
         */
        public updateViewport(x: number, y: number, width: number, height: number): void {
            if (x == this._viewPort.x && y == this._viewPort.y && width == this._viewPort.w && height == this._viewPort.h) {
                return;
            }
            this._orthProjectChange = true;
            this._viewPort.x = x;
            this._viewPort.y = y;
            this._viewPort.w = width;
            this._viewPort.h = height;
        }

        /**
         * 面向指定的位置
         * @param pos 摄像机的全局坐标
         * @param target 面向的全局坐标
         * @param up 向上的方向
         */
        public lookAt(pos: Vector3, target: Vector3, up: Vector3 = Vector3.UP): void {
            this.position = pos;
            this._lookAtPosition.copy(target);
            this._viewMatrix.lookAt(pos, target, up);
            let quaternion = dou.recyclable(Quaternion);
            quaternion.fromMatrix(this._viewMatrix);
            this.globalOrientation = quaternion;
            quaternion.recycle();
        }

        protected onTransformUpdate(): void {
            super.onTransformUpdate();

            this._viewMatrix.copy(this._globalMatrix);
            this._viewMatrix.inverse();

            this._frustum.update();
        }

        /**
         * 相机视图矩阵
         */
        public get viewMatrix(): Matrix4 {
            this.updateGlobalTransform();
            return this._viewMatrix;
        }

        /**
         * 相机目标点
         */
        public get lookAtPosition(): Vector3 {
            return this._lookAtPosition;
        }

        /**
         * 检测对象是否在相机视椎体内
         */
        public isVisibleToCamera(renderItem: RenderBase): boolean {
            // 刷新自己和检测对象的矩阵
            this.updateGlobalTransform();
            renderItem.globalMatrix;
            if (renderItem.bound) {
                return renderItem.bound.inBound(this._frustum);
            }
            return true;
        }

        /**
         * 将 3 维空间中的坐标转换为屏幕坐标
         */
        public spaceToScreen(point: IVector3, result?: IVector2): IVector2 {
            result = result || new Vector2();
            let halfW = this._viewPort.w * 0.5;
            let halfH = this._viewPort.h * 0.5;
            let vec4 = dou.recyclable(Vector4);
            this.viewMatrix.transformVector(point, vec4);
            this.project(vec4, vec4);
            result.x = halfW + vec4.x * halfW;
            result.y = this._viewPort.h - (halfH - vec4.y * halfH);
            vec4.recycle();
            return result;
        }

        private project(point: Vector4, target: Vector4): void {
            this._projectMatrix.transformVector(point, target);
            target.x = target.x / target.w;
            target.y = -target.y / target.w;
            target.z = point.z;
        }

        /**
         * 屏幕坐标转换为 3 维空间中的坐标
         * @param z 位于 3 维空间中的深度坐标
         */
        public screenToSpace(point: IVector2, z: number = 0, result?: IVector3): IVector3 {
            result = result || new Vector3();
            let halfW = this._viewPort.w * 0.5;
            let halfH = this._viewPort.h * 0.5;
            let vec4 = dou.recyclable(Vector4);
            vec4.x = (point.x - halfW) / halfW;
            vec4.y = (halfH - (this._viewPort.h - point.y)) / halfH;
            this.unproject(vec4.x, vec4.y, z, vec4);
            this._globalMatrix.transformVector(vec4, vec4);
            result.x = vec4.x;
            result.y = vec4.y;
            result.z = vec4.z;
            vec4.recycle();
            return result;
        }

        private unproject(x: number, y: number, z: number, target: Vector4): void {
            target.x = x;
            target.y = -y;
            target.z = z;
            target.w = 1;
            target.x *= z;
            target.y *= z;
            let unprojection = dou.recyclable(Matrix4);
            unprojection.copy(this._projectMatrix);
            unprojection.inverse();
            unprojection.transformVector(target, target);
            unprojection.recycle();
            target.z = z;
        }

        protected markTransform(): void {
            let vector = dou.recyclable(Vector3);
            vector.set(1, 1, 1);
            this._globalMatrix.compose(this._globalPosition, this._globalOrientation, vector);
            vector.recycle();
        }

        public dispose() {
            super.dispose();
            if (this._frustum) {
                this._frustum.dispose();
            }
        }
    }
}
