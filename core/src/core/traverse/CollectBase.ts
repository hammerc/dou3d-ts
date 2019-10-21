namespace dou3d {
    /**
     * 渲染对象收集器基类
     * @author wizardc
     */
    export class CollectBase {
        protected _renderList: RenderBase[];

        protected _scene: Scene3D;

        public constructor() {
            this._renderList = [];
        }

        /**
         * 可渲染对象列表
         */
        public get renderList(): RenderBase[] {
            return this._renderList;
        }

        /**
         * 场景对象
         */
        public set scene(scene: Scene3D) {
            this._scene = scene;
        }
        public get scene(): Scene3D {
            return this._scene;
        }

        /**
         * 查找一个对象在渲染列表的下标
         */
        public findRenderObject(target: RenderBase): number {
            for (let i = 0; i < this._renderList.length; ++i) {
                if (this._renderList[i] === target) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * 数据更新
         */
        public update(camera: Camera3D): void {
            camera.globalMatrix;
            this._renderList.length = 0;
        }
    }
}
