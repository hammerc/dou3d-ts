namespace dou3d {
    /**
     * 3D 摄像机对象
     * @author wizardc
     */
    export class Camera3D extends Object3D {
        public projectMatrix: Matrix4 = new Matrix4();

        private _orthProjectMatrix: Matrix4 = new Matrix4();

        public frustum: Frustum;

        private _viewPort: Rectangle = new Rectangle();

        public constructor() {
            super();
        }


    }
}
