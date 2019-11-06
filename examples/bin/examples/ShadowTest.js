var examples;
(function (examples) {
    var ShadowTest = /** @class */ (function () {
        function ShadowTest(view3D) {
            view3D.backColor = 0xff666666;
            view3D.camera3D.lookAt(new dou3d.Vector3(0, 1000, -1000), new dou3d.Vector3(0, 0, 0));
            // 从上向下照射的平行光
            var directLight = new dou3d.DirectLight(0xffffff);
            directLight.lookAt(new dou3d.Vector3(), new dou3d.Vector3(0, 1, 0));
            view3D.scene.root.addChild(directLight);
            // 设定为阴影投射的灯光
            dou3d.ShadowCast.instance.castShadowLight(directLight);
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
                    cube_1.material.acceptShadow = true;
                    var plane = new dou3d.Mesh(new dou3d.PlaneGeometry(500, 500), new dou3d.TextureMaterial(data));
                    view3D.scene.root.addChild(plane);
                    plane.material.castShadow = true;
                }
            }, this);
        }
        return ShadowTest;
    }());
    examples.ShadowTest = ShadowTest;
})(examples || (examples = {}));
