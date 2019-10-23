var examples;
(function (examples) {
    var TransformTest = /** @class */ (function () {
        function TransformTest(view3D) {
            view3D.backColor = 0xff666666;
            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));
            // 本地坐标转全局坐标
            var containerA = new dou3d.ObjectContainer3D();
            containerA.x = -200;
            view3D.scene.root.addChild(containerA);
            var cubeA = new dou3d.Mesh(new dou3d.CubeGeometry(), new dou3d.ColorMaterial());
            containerA.addChild(cubeA);
            var cubeB = new dou3d.Mesh(new dou3d.CubeGeometry(), new dou3d.ColorMaterial(0xffff00));
            view3D.scene.root.addChild(cubeB);
            containerA.on(dou3d.Event3D.ENTER_FRAME, function () {
                containerA.rotationX -= dou3d.MathUtil.toRadians(90 * dou3d.ticker.deltaTime * 0.001);
                var vec3 = cubeA.localToGlobal(new dou3d.Vector3(0, 200, 0));
                cubeB.x = vec3.x;
                cubeB.y = vec3.y;
                cubeB.z = vec3.z;
            });
            // 全局坐标转本地坐标
            var containerB = new dou3d.ObjectContainer3D();
            containerB.x = 200;
            view3D.scene.root.addChild(containerB);
            var cubeC = new dou3d.Mesh(new dou3d.CubeGeometry(), new dou3d.ColorMaterial(0x00ff00));
            containerB.addChild(cubeC);
            var cubeD = new dou3d.Mesh(new dou3d.CubeGeometry(), new dou3d.ColorMaterial(0x0000ff));
            containerB.addChild(cubeD);
            containerB.on(dou3d.Event3D.ENTER_FRAME, function () {
                containerB.rotationX -= dou3d.MathUtil.toRadians(90 * dou3d.ticker.deltaTime * 0.001);
                var vec3 = containerB.globalToLocal(new dou3d.Vector3(0, 200, 0));
                cubeD.x = vec3.x;
                cubeD.y = vec3.y;
                cubeD.z = vec3.z;
            });
        }
        return TransformTest;
    }());
    examples.TransformTest = TransformTest;
})(examples || (examples = {}));
