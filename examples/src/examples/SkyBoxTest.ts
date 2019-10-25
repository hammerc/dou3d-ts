namespace examples {
    export class SkyBoxTest {
        public constructor(view3D: dou3d.View3D) {
            this.showSkyBox(view3D).then(() => {
                console.log("done");
            }).catch((error) => {
                console.error(error);
            });
        }

        private async showSkyBox(view3D: dou3d.View3D) {
            view3D.backColor = 0xff666666;

            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));

            await dou.loader.loadGroupAsync([
                { url: "resource/skybox/up.jpg" },
                { url: "resource/skybox/down.jpg" },
                { url: "resource/skybox/left.jpg" },
                { url: "resource/skybox/right.jpg" },
                { url: "resource/skybox/front.jpg" },
                { url: "resource/skybox/back.jpg" }
            ]);

            let texture = new dou3d.CubeTexture();
            texture.image_up = (dou.loader.get("resource/skybox/up.jpg") as dou3d.Texture).texture2D;
            texture.image_down = (dou.loader.get("resource/skybox/down.jpg") as dou3d.Texture).texture2D;
            texture.image_left = (dou.loader.get("resource/skybox/left.jpg") as dou3d.Texture).texture2D;
            texture.image_right = (dou.loader.get("resource/skybox/right.jpg") as dou3d.Texture).texture2D;
            texture.image_front = (dou.loader.get("resource/skybox/front.jpg") as dou3d.Texture).texture2D;
            texture.image_back = (dou.loader.get("resource/skybox/back.jpg") as dou3d.Texture).texture2D;

            let geometery = new dou3d.CubeGeometry(8000, 8000, 8000);
            let material = new dou3d.CubeTextureMaterial(texture);
            let skybox = new dou3d.SkyBox(geometery, material);
            view3D.scene.root.addChild(skybox);

            let controller = new dou3d.HoverController(view3D.camera3D, new dou3d.Vector3(), 0, 0, 1000);

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
                    controller.panAngle = pan + distX * 0.1;
                    controller.tiltAngle = tilt + distY * 0.1;
                }
            });
            view3D.on(dou3d.Event3D.TOUCH_END, (event: dou3d.Event3D) => {
                pos = null;
            });
        }
    }
}
