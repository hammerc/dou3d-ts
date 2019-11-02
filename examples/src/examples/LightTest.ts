namespace examples {
    export class LightTest {
        public constructor(view3D: dou3d.View3D) {
            view3D.backColor = 0xff666666;

            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));

            dou.loader.load("resource/UV_Grid_Sm.jpg", (data, url) => {

                if (data && data instanceof dou3d.ImageTexture) {
                    // 从上向下照射的平行光
                    let directLight = new dou3d.DirectLight(0xffffff);
                    view3D.scene.root.addChild(directLight);

                    // 位于中心点照射半径为 1000 的点光源
                    let pointLight = new dou3d.PointLight(0xffffff);
                    pointLight.radius = 500;
                    view3D.scene.root.addChild(pointLight);

                    // Z 轴正方向的聚光灯
                    let spotLight = new dou3d.SpotLight(0xffffff);
                    spotLight.x = -100;
                    spotLight.y = -100;
                    spotLight.z = -50;
                    spotLight.range = 200;
                    spotLight.angle = 120;
                    spotLight.penumbra = 0;
                    view3D.scene.root.addChild(spotLight);

                    let cube1 = this.createCube(data, -100, 100, 0);
                    view3D.scene.root.addChild(cube1);
                    let lightGroup1 = new dou3d.LightGroup();
                    lightGroup1.addLight(directLight);
                    cube1.material.lightGroup = lightGroup1;

                    let cube2 = this.createCube(data, 100, 100, 0);
                    view3D.scene.root.addChild(cube2);
                    let lightGroup2 = new dou3d.LightGroup();
                    lightGroup2.addLight(pointLight);
                    cube2.material.lightGroup = lightGroup2;

                    let cube3 = this.createCube(data, -100, -100, 0);
                    view3D.scene.root.addChild(cube3);
                    let lightGroup3 = new dou3d.LightGroup();
                    lightGroup3.addLight(spotLight);
                    cube3.material.lightGroup = lightGroup3;

                    let cube4 = this.createCube(data, 100, -100, 0);
                    view3D.scene.root.addChild(cube4);
                    let lightGroup4 = new dou3d.LightGroup();
                    lightGroup4.addLight(directLight);
                    lightGroup4.addLight(pointLight);
                    cube4.material.lightGroup = lightGroup4;

                }

            }, this);

        }

        private createCube(texture: dou3d.ImageTexture, x: number, y: number, z: number): dou3d.Mesh {
            let mat = new dou3d.TextureMaterial(texture);
            let geometery = new dou3d.CubeGeometry();
            let cube = new dou3d.Mesh(geometery, mat);
            cube.x = x;
            cube.y = y;
            cube.z = z;
            cube.rotationX = 45;
            cube.on(dou3d.Event3D.ENTER_FRAME, () => {
                cube.rotationY += dou3d.MathUtil.toRadians(90 * dou3d.ticker.deltaTime * 0.001);
            });
            return cube;
        }
    }
}
