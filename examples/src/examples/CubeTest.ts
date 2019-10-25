namespace examples {
    export class CubeTest {
        public constructor(view3D: dou3d.View3D) {
            view3D.backColor = 0xff666666;

            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));

            let geometery = new dou3d.CubeGeometry();
            let cube = new dou3d.Mesh(geometery);
            view3D.scene.root.addChild(cube);

            cube.rotationX = 45;
            cube.on(dou3d.Event3D.ENTER_FRAME, () => {
                cube.rotationY += dou3d.MathUtil.toRadians(90 * dou3d.ticker.deltaTime * 0.001);
            });
        }
    }
}
