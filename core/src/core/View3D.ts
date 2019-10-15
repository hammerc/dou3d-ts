namespace dou3d {
    /**
     * 3D 渲染视图
     * - view3D 是整个 3D 引擎的渲染视口, 可以控制渲染窗口的大小和渲染的方式
     * - 包含一个摄像机对象和一个场景对象
     * - 目前不支持添加多个摄像机
     * @author wizardc
     */
    export class View3D extends dou.EventDispatcher {
        protected _viewPort: Rectangle;
        protected _camera: Camera3D;
        protected _scene: Scene3D;

        protected _render: RendererBase;

        protected _entityCollect: EntityCollect;
        protected _backColor: Vector4;

        protected _cleanParmerts: number = Context3DProxy.gl.COLOR_BUFFER_BIT | Context3DProxy.gl.DEPTH_BUFFER_BIT;

        public constructor(x: number, y: number, width: number, height: number, camera?: Camera3D) {
            super();

            this._viewPort = new Rectangle();
            this._camera = camera || new Camera3D(CameraType.perspective);
            this._camera.name = "MainCamera";
            this._scene = new Scene3D();
            this._scene.root.addChild(this._camera);

            this._render = new MultiRenderer(PassType.diffusePass);

            this._entityCollect = new EntityCollect();
            this._entityCollect.scene = this._scene;
            this._backColor = new Vector4(0.3, 0.3, 0.6, 1);

            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this._camera.aspectRatio = this._viewPort.w / this._viewPort.h;
            this._camera.updateViewport(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
        }

        public set x(value: number) {
            this._viewPort.x = value;
            this._camera.updateViewport(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
        }
        public get x(): number {
            return this._viewPort.x;
        }

        public set y(value: number) {
            this._viewPort.y = value;
            this._camera.updateViewport(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
        }
        public get y(): number {
            return this._viewPort.y;
        }

        public set width(value: number) {
            this._viewPort.w = value;
            this._camera.aspectRatio = this._viewPort.w / this._viewPort.h;
            this._camera.updateViewport(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
        }
        public get width(): number {
            return this._viewPort.w;
        }

        public set height(value: number) {
            this._viewPort.h = value;
            this._camera.aspectRatio = this._viewPort.w / this._viewPort.h;
            this._camera.updateViewport(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
        }
        public get height(): number {
            return this._viewPort.h;
        }

        public get viewPort(): Rectangle {
            return this._viewPort;
        }

        /**
         * 检测是否在当前视口内
         */
        public inView3D(x: number, y: number): boolean {
            let vec2 = dou.recyclable(Vector2);
            vec2.set(x, y);
            let result = this._viewPort.contains(vec2);
            vec2.recycle();
            return result;
        }

        /**
         * 设置是否清除背景缓冲颜色和深度
         * @param cleanColor 是否清除背景缓冲颜色
         * @param cleanDepth 是否清除背景缓冲深度
         */
        public blender(cleanColor: boolean, cleanDepth: boolean): void {
            this._cleanParmerts = (cleanColor ? Context3DProxy.gl.COLOR_BUFFER_BIT : 0) | (cleanDepth ? Context3DProxy.gl.DEPTH_BUFFER_BIT : 0);
        }

        /**
         * 背景颜色
         */
        public set backColor(value: number) {
            this._backColor.w = (value >> 24 & 0xff) / 255;
            this._backColor.x = (value >> 16 & 0xff) / 255;
            this._backColor.y = (value >> 8 & 0xff) / 255;
            this._backColor.z = (value & 0xff) / 255;
        }
        public get backColor(): number {
            return (this._backColor.w * 255 << 24) | (this._backColor.x * 255 << 16) | (this._backColor.y * 255 << 8) | (this._backColor.z * 255);
        }

        /**
         * 场景
         */
        public set scene(value: Scene3D) {
            this._scene = value;
        }
        public get scene(): Scene3D {
            return this._scene;
        }

        /**
         * 摄像机
         */
        public set camera3D(value: Camera3D) {
            this._camera = value;
            this._camera.aspectRatio = this._viewPort.w / this._viewPort.h;
            this._camera.updateViewport(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
        }
        public get camera3D(): Camera3D {
            return this._camera;
        }

        /**
         * 实体收集对象
         */
        public get entityCollect(): EntityCollect {
            return this._entityCollect;
        }

        public update(time: number, delay: number): void {
            this._camera.viewPort = this._viewPort;

            this.updateObject3D(this._scene.root, time, delay);

            Engine.context3DProxy.viewPort(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
            Engine.context3DProxy.setScissorRectangle(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);

            this._entityCollect.update(this._camera);

            if (PickSystem.instance.enablePick) {
                PickSystem.instance.update(this._entityCollect, this._camera, time, delay, this._viewPort);
            }

            if (ShadowCast.instance.enableShadow) {
                ShadowCast.instance.update(this._entityCollect, this._camera, time, delay, this._viewPort);
            }

            if (this._cleanParmerts & Context3DProxy.gl.COLOR_BUFFER_BIT) {
                Engine.context3DProxy.clearColor(this._backColor.x, this._backColor.y, this._backColor.z, this._backColor.w);
            }

            Engine.context3DProxy.clear(this._cleanParmerts);

            this._render.draw(time, delay, Engine.context3DProxy, this._entityCollect, this._camera, this._viewPort);
        }

        private updateObject3D(object3d: Object3D, time: number, delay: number) {
            if (object3d) {
                object3d.dispatch(Event3D.ENTER_FRAME);
                object3d.update(time, delay, this.camera3D);
                if (object3d instanceof ObjectContainer3D) {
                    for (var i = 0; i < object3d.children.length; ++i) {
                        this.updateObject3D(object3d.children[i], time, delay);
                    }
                }
            }
        }
    }
}
