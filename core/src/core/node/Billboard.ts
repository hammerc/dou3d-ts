namespace dou3d {
    /**
     * 公告板, 始终面朝摄像机的面板
     * @author wizardc
     */
    export class Billboard extends Mesh {
        private _plane: PlaneGeometry;

        public constructor(material: MaterialBase, geometry?: Geometry, width: number = 100, height: number = 100) {
            if (!geometry) {
                geometry = new PlaneGeometry(width, height, 1, 1, 1, 1);
            }
            super(geometry, material);
            this._plane = <PlaneGeometry>this.geometry;
            if (!this.bound) {
                this.bound = this.buildBoundBox();
            }
        }

        public update(time: number, delay: number, camera: Camera3D): void {
            super.update(time, delay, camera);
            this.globalOrientation = camera.globalOrientation;
        }

        public clone(): Mesh {
            let cloneMesh = new Billboard(this.material, this.geometry, this._plane.width, this._plane.height);
            cloneMesh.multiMaterial = this.multiMaterial;
            return cloneMesh;
        }
    }
}
