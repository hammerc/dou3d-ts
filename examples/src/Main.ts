function loadJS(url: string): void {
    document.writeln(`<script src="${url}"></script>`);
}

function loadAllJS(): void {
    this.loadJS("bin/examples/CubeTest.js");
    this.loadJS("bin/examples/TextureTest.js");
    this.loadJS("bin/examples/LightTest.js");
    this.loadJS("bin/examples/ShadowTest.js");
    this.loadJS("bin/examples/AnimationTest.js");
}

class Main {
    public constructor() {
        // 加载类型注册
        dou.loader.registerAnalyzer(ResourceType.text, new dou.TextAnalyzer());
        dou.loader.registerAnalyzer(ResourceType.json, new dou.JsonAnalyzer());
        dou.loader.registerAnalyzer(ResourceType.binary, new dou.BytesAnalyzer());
        dou.loader.registerAnalyzer(ResourceType.texture, new dou3d.TextureAnalyzer());
        dou.loader.registerAnalyzer(ResourceType.esm, new dou3d.ESMAnalyzer());
        dou.loader.registerAnalyzer(ResourceType.eam, new dou3d.EAMAnalyzer());

        let engine = new dou3d.Engine();
        let viewRect = engine.viewRect;
        let view3D = new dou3d.View3D(0, 0, viewRect.w, viewRect.h);
        view3D.on(dou3d.Event3D.RESIZE, () => {
            view3D.width = viewRect.w;
            view3D.height = viewRect.h;
        });
        engine.addView3D(view3D);

        // new examples.CubeTest(view3D);
        // new examples.TextureTest(view3D);
        // new examples.LightTest(view3D);
        // new examples.ShadowTest(view3D);
        new examples.AnimationTest(view3D);
    }
}
