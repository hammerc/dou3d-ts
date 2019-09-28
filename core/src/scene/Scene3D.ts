namespace dou3d {
    /**
     * 3D 场景
     * @author wizardc
     */
    export class Scene3D {
        protected _root: ObjectContainer3D;

        public constructor() {
            this._root = new ObjectContainer3D();
        }

        public get root(): ObjectContainer3D {
            return this._root;
        }
    }
}
