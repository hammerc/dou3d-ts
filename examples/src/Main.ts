class Main {
    public constructor() {
        let engine = new dou3d.Engine();
        let viewRect = engine.viewRect;
        let view3D = new dou3d.View3D(0, 0, viewRect.w, viewRect.h);
        engine.addView3D(view3D);

        new examples.ShowCube(view3D);
    }
}

namespace examples {
    export class ShowCube {
        public constructor(view3D: dou3d.View3D) {
            console.log("显示一个立方体");

            view3D.backColor = 0xff666666;

            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));

            let mat = new dou3d.ColorMaterial();
            let geometery = new dou3d.CubeGeometry();
            let cube = new dou3d.Mesh(geometery, mat);
            view3D.scene.root.addChild(cube);
        }
    }
}
