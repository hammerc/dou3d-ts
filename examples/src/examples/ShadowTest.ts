namespace examples {
    export class ShadowTest {
        public constructor(view3D: dou3d.View3D) {
            view3D.backColor = 0xff666666;

            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));

            let shadowCamera = dou3d.ShadowCast.instance.shadowCamera;
            shadowCamera.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));
            let directLight = dou3d.ShadowCast.instance.directLight;
            directLight.rotationX = dou3d.MathUtil.toRadians(45);
            directLight.rotationY = dou3d.MathUtil.toRadians(0);
            directLight.rotationZ = dou3d.MathUtil.toRadians(0);

            dou.loader.load("resource/UV_Grid_Sm.jpg", (data, url) => {

                if (data && data instanceof dou3d.ImageTexture) {
                    let mat = new dou3d.TextureMaterial(data);
                    mat.castShadow = true;
                    let geometery = new dou3d.CubeGeometry();
                    let cube = new dou3d.Mesh(geometery, mat);
                    view3D.scene.root.addChild(cube);

                    cube.rotationX = 45;
                    cube.on(dou3d.Event3D.ENTER_FRAME, () => {
                        cube.rotationY += dou3d.MathUtil.toRadians(90 * dou3d.ticker.deltaTime * 0.001);
                    });

                    let mat2 = new dou3d.TextureMaterial(data);
                    mat2.acceptShadow = true;
                    let geometery2 = new dou3d.PlaneGeometry(500, 500);
                    let plane = new dou3d.Mesh(geometery2, mat2);
                    view3D.scene.root.addChild(plane);

                    plane.z = 300;
                    plane.rotationX = -45;
                }

            }, this);
        }
    }
}
