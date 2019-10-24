namespace examples {
    export class LookAtControllerTest {
        public constructor(view3D: dou3d.View3D) {
            view3D.backColor = 0xff666666;

            view3D.camera3D.lookAt(new dou3d.Vector3(0, 500, -1000), new dou3d.Vector3(0, 0, 0));

            dou.loader.load("resource/UV_Grid_Sm.jpg", (data, url) => {

                if (data && data instanceof dou3d.ImageTexture) {
                    let mat = new dou3d.TextureMaterial(data);
                    let geometery = new dou3d.CubeGeometry();
                    let cube = new dou3d.Mesh(geometery, mat);
                    view3D.scene.root.addChild(cube);

                    let mat2 = new dou3d.TextureMaterial(data);
                    let geometery2 = new dou3d.PlaneGeometry(500, 500);
                    let plane = new dou3d.Mesh(geometery2, mat2);
                    view3D.scene.root.addChild(plane);

                    cube.y = 40;

                    // let left = false;
                    // cube.on(dou3d.Event3D.ENTER_FRAME, () => {
                    //     let dist = 50 * dou3d.ticker.deltaTime * 0.001;
                    //     if (left) {
                    //         cube.x -= dist;
                    //         if (cube.x <= -250) {
                    //             left = false;
                    //         }
                    //     }
                    //     else {
                    //         cube.x += dist;
                    //         if (cube.x >= 250) {
                    //             left = true;
                    //         }
                    //     }
                    // });

                    dou.Tween.get(cube, { loop: true })
                        .to({ x: 100, z: 0 }, 1000)
                        .to({ x: 50, z: 100 }, 1000)
                        .to({ x: 0, z: 0 }, 1000);

                    new dou3d.LookAtController(view3D.camera3D, cube);
                }

            }, this);
        }
    }
}
