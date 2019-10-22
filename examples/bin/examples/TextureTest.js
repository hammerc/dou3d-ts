var examples;
(function (examples) {
    var TextureTest = /** @class */ (function () {
        function TextureTest(view3D) {
            view3D.backColor = 0xff666666;
            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));
            dou.loader.load("resource/UV_Grid_Sm.jpg", function (data, url) {
                if (data && data instanceof dou3d.ImageTexture) {
                    var mat = new dou3d.TextureMaterial(data);
                    var geometery = new dou3d.CubeGeometry();
                    var cube_1 = new dou3d.Mesh(geometery, mat);
                    view3D.scene.root.addChild(cube_1);
                    cube_1.rotationX = 45;
                    cube_1.on(dou3d.Event3D.ENTER_FRAME, function () {
                        cube_1.rotationY += dou3d.MathUtil.toRadians(90 * dou3d.ticker.deltaTime * 0.001);
                    });
                }
            }, this, "texture" /* texture */);
        }
        return TextureTest;
    }());
    examples.TextureTest = TextureTest;
})(examples || (examples = {}));
