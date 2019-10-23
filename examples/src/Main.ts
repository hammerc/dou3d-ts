function loadJS(url: string): void {
    document.writeln(`<script src="${url}"></script>`);
}

function loadAllJS(): void {
    this.loadJS("bin/examples/CubeTest.js");
    this.loadJS("bin/examples/TextureTest.js");
    this.loadJS("bin/examples/LightTest.js");
    this.loadJS("bin/examples/ShadowTest.js");
    this.loadJS("bin/examples/AnimationTest.js");
    this.loadJS("bin/examples/LookAtControllerTest.js");
    this.loadJS("bin/examples/HoverControllerTest.js");
    this.loadJS("bin/examples/TransformTest.js");
}

class Main {
    public constructor(urlParams: { [key: string]: string }) {
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

        switch (urlParams.demo) {
            case "cube":
                new examples.CubeTest(view3D);
                break;
            case "texture":
                new examples.TextureTest(view3D);
                break;
            case "light":
                new examples.LightTest(view3D);
                break;
            case "shadow":
                new examples.ShadowTest(view3D);
                break;
            case "animation":
                new examples.AnimationTest(view3D);
                break;
            case "lookAt":
                new examples.LookAtControllerTest(view3D);
                break;
            case "hover":
                new examples.HoverControllerTest(view3D);
                break;
            case "transform":
                new examples.TransformTest(view3D);
                break;
        }
    }
}
