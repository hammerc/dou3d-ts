var examples;
(function (examples) {
    var CubeTest = /** @class */ (function () {
        function CubeTest(view3D) {
            view3D.backColor = 0xff666666;
            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));
            var mat = new dou3d.ColorMaterial();
            var geometery = new dou3d.CubeGeometry();
            var cube = new dou3d.Mesh(geometery, mat);
            view3D.scene.root.addChild(cube);
            cube.rotationX = 45;
            cube.on(dou3d.Event3D.ENTER_FRAME, function () {
                cube.rotationY += dou3d.MathUtil.toRadians(90 * dou3d.ticker.deltaTime * 0.001);
            });
        }
        return CubeTest;
    }());
    examples.CubeTest = CubeTest;
})(examples || (examples = {}));
