namespace examples {
    export class ShadowTest {
        public constructor(view3D: dou3d.View3D) {
            view3D.backColor = 0xff666666;

            view3D.camera3D.lookAt(new dou3d.Vector3(0, 1000, -1000), new dou3d.Vector3(0, 0, 0));

            // 从上向下照射的平行光
            let directLight = new dou3d.DirectLight(0xffffff);
            directLight.lookAt(new dou3d.Vector3(), new dou3d.Vector3(0, 1, 0));
            view3D.scene.root.addChild(directLight);
            // 设定为阴影投射的灯光
            dou3d.ShadowCast.instance.castShadowLight(directLight);

            // 设定阴影摄像机位置和朝向
            let camera = dou3d.ShadowCast.instance.shadowCamera;
            camera.orthSize = 1000;
            camera.lookAt(new dou3d.Vector3(0, 1000, 0), new dou3d.Vector3(0, 0, 0));

            dou.loader.load("resource/UV_Grid_Sm.jpg", (data, url) => {

                if (data && data instanceof dou3d.ImageTexture) {
                    let cube = new dou3d.Mesh(new dou3d.CubeGeometry(), new dou3d.TextureMaterial(data));
                    view3D.scene.root.addChild(cube);

                    cube.y = 150;
                    cube.on(dou3d.Event3D.ENTER_FRAME, () => {
                        cube.rotationY += dou3d.MathUtil.toRadians(90 * dou3d.ticker.deltaTime * 0.001);
                    });

                    let lightGroup = new dou3d.LightGroup();
                    lightGroup.addLight(directLight);
                    cube.material.lightGroup = lightGroup;
                    cube.material.castShadow = true;

                    let plane = new dou3d.Mesh(new dou3d.PlaneGeometry(500, 500), new dou3d.TextureMaterial(data));
                    view3D.scene.root.addChild(plane);

                    plane.material.acceptShadow = true;
                }

            }, this);
        }
    }
}
