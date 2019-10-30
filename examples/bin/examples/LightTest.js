var examples;
(function (examples) {
    var LightTest = /** @class */ (function () {
        function LightTest(view3D) {
            var _this = this;
            view3D.backColor = 0xff666666;
            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));
            dou.loader.load("resource/UV_Grid_Sm.jpg", function (data, url) {
                if (data && data instanceof dou3d.ImageTexture) {
                    // 从上向下照射的平行光
                    var directLight = new dou3d.DirectLight(new dou3d.Vector3(0, -1, 0));
                    directLight.diffuse = 0xffffff;
                    // 位于中心点照射半径为 1000 的点光源
                    var lightGroup2 = new dou3d.LightGroup();
                    var pointLight = new dou3d.PointLight(0xffffff);
                    pointLight.radius = 1000;
                    pointLight.x = 0;
                    pointLight.y = 0;
                    pointLight.z = 0;
                    // Z 轴正方向的聚光灯
                    var spotLight = new dou3d.SpotLight(0xffffff);
                    var cube1 = _this.createCube(data, -100, 100, 0);
                    view3D.scene.root.addChild(cube1);
                    var lightGroup1 = new dou3d.LightGroup();
                    lightGroup1.addLight(directLight);
                    cube1.material.lightGroup = lightGroup1;
                    var cube2 = _this.createCube(data, 100, 100, 0);
                    view3D.scene.root.addChild(cube2);
                    lightGroup2.addLight(pointLight);
                    cube2.material.lightGroup = lightGroup2;
                    view3D.scene.root.addChild(pointLight);
                    var cube3 = _this.createCube(data, -100, -100, 0);
                    view3D.scene.root.addChild(cube3);
                    var lightGroup3 = new dou3d.LightGroup();
                    lightGroup3.addLight(spotLight);
                    cube3.material.lightGroup = lightGroup3;
                    var cube4 = _this.createCube(data, 100, -100, 0);
                    view3D.scene.root.addChild(cube4);
                    var lightGroup4 = new dou3d.LightGroup();
                    lightGroup4.addLight(directLight);
                    lightGroup4.addLight(pointLight);
                    lightGroup4.addLight(spotLight);
                    cube4.material.lightGroup = lightGroup4;
                }
            }, this);
        }
        LightTest.prototype.createCube = function (texture, x, y, z) {
            var mat = new dou3d.TextureMaterial(texture);
            var geometery = new dou3d.CubeGeometry();
            var cube = new dou3d.Mesh(geometery, mat);
            cube.x = x;
            cube.y = y;
            cube.z = z;
            cube.rotationX = 45;
            cube.on(dou3d.Event3D.ENTER_FRAME, function () {
                cube.rotationY += dou3d.MathUtil.toRadians(90 * dou3d.ticker.deltaTime * 0.001);
            });
            return cube;
        };
        return LightTest;
    }());
    examples.LightTest = LightTest;
})(examples || (examples = {}));
