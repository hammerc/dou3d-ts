class Main {
    public constructor() {
        let engine = new dou3d.Engine();
        let viewRect = engine.viewRect;
        let view3D = new dou3d.View3D(0, 0, viewRect.w, viewRect.h);
        engine.addView3D(view3D);

        new examples.ShowBox(view3D);
    }
}

namespace examples {
    export class ShowBox {
        public constructor(view3D: dou3d.View3D) {
            console.log("显示一个立方体");
        }
    }
}
