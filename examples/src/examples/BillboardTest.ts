namespace examples {
    export class BillboardTest {
        public constructor(view3D: dou3d.View3D) {
            view3D.backColor = 0xff666666;

            view3D.camera3D.lookAt(new dou3d.Vector3(0, 500, -1000), new dou3d.Vector3(0, 0, 0));

            let cube = new dou3d.Mesh(new dou3d.CubeGeometry(), new dou3d.ColorMaterial(0xffff00));
            view3D.scene.root.addChild(cube);

            let billboard = new dou3d.Billboard(new dou3d.ColorMaterial(0x00ff00));
            billboard.y = 60;
            view3D.scene.root.addChild(billboard);

            let controller = new dou3d.HoverController(view3D.camera3D, cube);

            let pos: dou3d.Vector3;
            let pan: number, tilt: number;
            view3D.on(dou3d.Event3D.TOUCH_BEGIN, (event: dou3d.Event3D) => {
                pos = new dou3d.Vector3();
                pos.copy(event.data);
                pan = controller.panAngle;
                tilt = controller.tiltAngle;
            });
            view3D.on(dou3d.Event3D.TOUCH_MOVE, (event: dou3d.Event3D) => {
                if (pos) {
                    let distX = event.data.x - pos.x;
                    let distY = event.data.y - pos.y;
                    controller.panAngle = pan + distX;
                    controller.tiltAngle = tilt + distY;
                }
            });
            view3D.on(dou3d.Event3D.TOUCH_END, (event: dou3d.Event3D) => {
                pos = null;
            });
        }
    }
}
