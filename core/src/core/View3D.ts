namespace dou3d {
    /**
     * 3D 渲染视图
     * - view3D 是整个 3D 引擎的渲染视口, 可以控制渲染窗口的大小和渲染的方式
     * - 包含一个摄像机对象和一个场景对象
     * - 目前不支持添加多个摄像机
     * @author wizardc
     */
    export class View3D {
        protected _viewPort: Rectangle;
        protected _camera: Camera3D;
        protected _scene: Scene3D;

        public constructor(x: number, y: number, width: number, height: number, camera?: Camera3D) {
            this._viewPort = new Rectangle();
            this._scene = new Scene3D();
        }

        public set x(value: number) {
            this._viewPort.x = value;
        }
        public get x(): number {
            return this._viewPort.x;
        }

        public set y(value: number) {
            this._viewPort.y = value;
        }
        public get y(): number {
            return this._viewPort.y;
        }

        public set width(value: number) {
            this._viewPort.w = value;
        }
        public get width(): number {
            return this._viewPort.w;
        }

        public set height(value: number) {
            this._viewPort.h = value;
        }
        public get height(): number {
            return this._viewPort.h;
        }

        public set camera(value: Camera3D) {

        }
        public get camera(): Camera3D {
            return this._camera;
        }

        public set scene(value: Scene3D) {

        }
        public get scene(): Scene3D {
            return this._scene;
        }
    }
}
