var examples;
(function (examples) {
    var WireframeTest = /** @class */ (function () {
        function WireframeTest(view3D) {
            view3D.backColor = 0xff666666;
            view3D.camera3D.lookAt(new dou3d.Vector3(0, 500, -1000), new dou3d.Vector3(0, 0, 0));
            var wireframe = new dou3d.Wireframe();
            wireframe.fromGeometry(new dou3d.CubeGeometry());
            view3D.scene.root.addChild(wireframe);
            var controller = new dou3d.HoverController(view3D.camera3D, new dou3d.Vector3());
            var pos;
            var pan, tilt;
            view3D.on(dou3d.Event3D.TOUCH_BEGIN, function (event) {
                pos = new dou3d.Vector3();
                pos.copy(event.data);
                pan = controller.panAngle;
                tilt = controller.tiltAngle;
            });
            view3D.on(dou3d.Event3D.TOUCH_MOVE, function (event) {
                if (pos) {
                    var distX = event.data.x - pos.x;
                    var distY = event.data.y - pos.y;
                    controller.panAngle = pan + distX;
                    controller.tiltAngle = tilt + distY;
                }
            });
            view3D.on(dou3d.Event3D.TOUCH_END, function (event) {
                pos = null;
            });
        }
        return WireframeTest;
    }());
    examples.WireframeTest = WireframeTest;
})(examples || (examples = {}));
