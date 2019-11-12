var examples;
(function (examples) {
    var ShadowTest = /** @class */ (function () {
        function ShadowTest(view3D) {
            view3D.backColor = 0xff666666;
            view3D.camera3D.lookAt(new dou3d.Vector3(0, 1000, -1000), new dou3d.Vector3(0, 0, 0));
            // 从上向下照射的平行光
            var directLight = new dou3d.DirectLight(0xffffff);
            directLight.rotationX = 90;
            view3D.scene.root.addChild(directLight);
            // 设定阴影摄像机位置和朝向
            var camera = dou3d.ShadowCast.instance.shadowCamera;
            camera.orthSize = 1000;
            camera.lookAt(new dou3d.Vector3(0, 1000, 0), new dou3d.Vector3(0, 0, 0));
            dou.loader.load("resource/UV_Grid_Sm.jpg", function (data, url) {
                if (data && data instanceof dou3d.ImageTexture) {
                    var cube_1 = new dou3d.Mesh(new dou3d.CubeGeometry(), new dou3d.TextureMaterial(data));
                    view3D.scene.root.addChild(cube_1);
                    cube_1.y = 150;
                    cube_1.on(dou3d.Event3D.ENTER_FRAME, function () {
                        cube_1.rotationY += dou3d.MathUtil.toRadians(90 * dou3d.ticker.deltaTime * 0.001);
                    });
                    var lightGroup = new dou3d.LightGroup();
                    lightGroup.addLight(directLight);
                    cube_1.material.lightGroup = lightGroup;
                    cube_1.material.castShadow = true;
                    var plane = new dou3d.Mesh(new dou3d.PlaneGeometry(500, 500), new dou3d.TextureMaterial(data));
                    view3D.scene.root.addChild(plane);
                    plane.material.acceptShadow = true;
                }
            }, this);
        }
        return ShadowTest;
    }());
    examples.ShadowTest = ShadowTest;
})(examples || (examples = {}));
