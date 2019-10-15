namespace examples {
    export class CubeTest {
        public constructor(view3D: dou3d.View3D) {
            view3D.backColor = 0xff666666;

            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));

            let mat = new dou3d.ColorMaterial();
            let geometery = new dou3d.CubeGeometry();
            let cube = new dou3d.Mesh(geometery, mat);
            view3D.scene.root.addChild(cube);
        }
    }
}
