var examples;
(function (examples) {
    var BillboardTest = /** @class */ (function () {
        function BillboardTest(view3D) {
            view3D.backColor = 0xff666666;
            view3D.camera3D.lookAt(new dou3d.Vector3(0, 500, -1000), new dou3d.Vector3(0, 0, 0));
            var cube = new dou3d.Mesh(new dou3d.CubeGeometry(), new dou3d.ColorMaterial(0xffff00));
            view3D.scene.root.addChild(cube);
            var billboard = new dou3d.Billboard(new dou3d.ColorMaterial(0x00ff00));
            billboard.y = 60;
            view3D.scene.root.addChild(billboard);
            var controller = new dou3d.HoverController(view3D.camera3D, cube);
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
        return BillboardTest;
    }());
    examples.BillboardTest = BillboardTest;
})(examples || (examples = {}));
