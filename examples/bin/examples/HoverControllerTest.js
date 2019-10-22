var examples;
(function (examples) {
    var HoverControllerTest = /** @class */ (function () {
        function HoverControllerTest(view3D) {
            view3D.backColor = 0xff666666;
            view3D.camera3D.lookAt(new dou3d.Vector3(0, 500, -1000), new dou3d.Vector3(0, 0, 0));
            dou.loader.load("resource/UV_Grid_Sm.jpg", function (data, url) {
                if (data && data instanceof dou3d.ImageTexture) {
                    var mat = new dou3d.TextureMaterial(data);
                    var geometery = new dou3d.CubeGeometry();
                    var cube = new dou3d.Mesh(geometery, mat);
                    view3D.scene.root.addChild(cube);
                    var controller_1 = new dou3d.HoverController(view3D.camera3D, cube);
                    var pos_1;
                    var pan_1, tilt_1;
                    view3D.on(dou3d.Event3D.TOUCH_BEGIN, function (event) {
                        pos_1 = new dou3d.Vector3();
                        pos_1.copy(event.data);
                        pan_1 = controller_1.panAngle;
                        tilt_1 = controller_1.tiltAngle;
                    });
                    view3D.on(dou3d.Event3D.TOUCH_MOVE, function (event) {
                        if (pos_1) {
                            var distX = event.data.x - pos_1.x;
                            var distY = event.data.y - pos_1.y;
                            controller_1.panAngle = pan_1 + distX;
                            controller_1.tiltAngle = tilt_1 + distY;
                        }
                    });
                    view3D.on(dou3d.Event3D.TOUCH_END, function (event) {
                        pos_1 = null;
                    });
                }
            }, this, "texture" /* texture */);
        }
        return HoverControllerTest;
    }());
    examples.HoverControllerTest = HoverControllerTest;
})(examples || (examples = {}));
