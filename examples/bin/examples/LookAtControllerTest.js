var examples;
(function (examples) {
    var LookAtControllerTest = /** @class */ (function () {
        function LookAtControllerTest(view3D) {
            view3D.backColor = 0xff666666;
            view3D.camera3D.lookAt(new dou3d.Vector3(0, 500, -1000), new dou3d.Vector3(0, 0, 0));
            dou.loader.load("resource/UV_Grid_Sm.jpg", function (data, url) {
                if (data && data instanceof dou3d.ImageTexture) {
                    var mat = new dou3d.TextureMaterial(data);
                    var geometery = new dou3d.CubeGeometry();
                    var cube_1 = new dou3d.Mesh(geometery, mat);
                    view3D.scene.root.addChild(cube_1);
                    var mat2 = new dou3d.TextureMaterial(data);
                    var geometery2 = new dou3d.PlaneGeometry(500, 500);
                    var plane = new dou3d.Mesh(geometery2, mat2);
                    view3D.scene.root.addChild(plane);
                    cube_1.y = 40;
                    var left_1 = false;
                    cube_1.on(dou3d.Event3D.ENTER_FRAME, function () {
                        var dist = 50 * dou3d.ticker.deltaTime * 0.001;
                        if (left_1) {
                            cube_1.x -= dist;
                            if (cube_1.x <= -250) {
                                left_1 = false;
                            }
                        }
                        else {
                            cube_1.x += dist;
                            if (cube_1.x >= 250) {
                                left_1 = true;
                            }
                        }
                    });
                    new dou3d.LookAtController(view3D.camera3D, cube_1);
                }
            }, this, "texture" /* texture */);
        }
        return LookAtControllerTest;
    }());
    examples.LookAtControllerTest = LookAtControllerTest;
})(examples || (examples = {}));
