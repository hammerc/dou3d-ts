namespace dou3d {
    /**
     * 实时阴影渲染
     * * 基于 shadow mapping 的阴影算法, 当前阴影只支持方向光,
     * * 摄像机 near 1 far 3000  width 2048 height 2048, 当渲染阴影的物体超出阴影摄像机的范围阴影将不会渲染阴影
     * @author wizardc
     */
    export class ShadowCast {
        private static _instance: ShadowCast;

        public static get instance(): ShadowCast {
            return ShadowCast._instance || (ShadowCast._instance = new ShadowCast());
        }

        public enableShadow: boolean = false;

        private constructor() {

        }

        public update(entityCollect: EntityCollect, camera: Camera3D, time: number, delay: number, viewPort: Rectangle): void {

        }
    }
}
