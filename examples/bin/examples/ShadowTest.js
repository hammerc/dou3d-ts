var examples;
(function (examples) {
    var ShadowTest = /** @class */ (function () {
        function ShadowTest(view3D) {
            view3D.backColor = 0xff666666;
            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));
            var shadowCamera = dou3d.ShadowCast.instance.shadowCamera;
            shadowCamera.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));
            var directLight = dou3d.ShadowCast.instance.directLight;
            directLight.rotationX = dou3d.MathUtil.toRadians(45);
            directLight.rotationY = dou3d.MathUtil.toRadians(0);
            directLight.rotationZ = dou3d.MathUtil.toRadians(0);
            dou.loader.load("resource/UV_Grid_Sm.jpg", function (data, url) {
                if (data && data instanceof dou3d.ImageTexture) {
                    var mat = new dou3d.TextureMaterial(data);
                    mat.castShadow = true;
                    var geometery = new dou3d.CubeGeometry();
                    var cube_1 = new dou3d.Mesh(geometery, mat);
                    view3D.scene.root.addChild(cube_1);
                    cube_1.rotationX = 45;
                    cube_1.on(dou3d.Event3D.ENTER_FRAME, function () {
                        cube_1.rotationY += dou3d.MathUtil.toRadians(90 * dou3d.ticker.deltaTime * 0.001);
                    });
                    var mat2 = new dou3d.TextureMaterial(data);
                    mat2.acceptShadow = true;
                    var geometery2 = new dou3d.PlaneGeometry(500, 500);
                    var plane = new dou3d.Mesh(geometery2, mat2);
                    view3D.scene.root.addChild(plane);
                    plane.z = 300;
                    plane.rotationX = -45;
                }
            }, this);
        }
        return ShadowTest;
    }());
    examples.ShadowTest = ShadowTest;
})(examples || (examples = {}));
