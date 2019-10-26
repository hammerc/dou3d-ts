namespace dou3d {
    /**
     * 天空盒
     * @author wizardc
     */
    export class SkyBox extends Mesh {
        public camera: Camera3D;

        public constructor(geometry: Geometry, material: MaterialBase, camera?: Camera3D) {
            super(geometry, material);
            this.camera = camera;
            material.cullMode = ContextConfig.FRONT;
        }

        public update(time: number, delay: number, camera: Camera3D): void {
            super.update(time, delay, camera);
            if (this.camera) {
                this.position = this.camera.globalPosition;
            }
        }
    }
}
