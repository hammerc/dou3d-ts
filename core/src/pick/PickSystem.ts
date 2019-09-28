namespace dou3d {
    /**
     * 拾取系统
     * @author wizardc
     */
    export class PickSystem {
        private static _instance: PickSystem;

        public static get instance(): PickSystem {
            return PickSystem._instance || (PickSystem._instance = new PickSystem());
        }

        public enablePick: boolean = false;

        private constructor() {

        }

        public update(entityCollect: EntityCollect, camera: Camera3D, time: number, delay: number, viewPort: Rectangle): void {

        }
    }
}
