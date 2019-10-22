function loadJS(url) {
    document.writeln("<script src=\"" + url + "\"></script>");
}
function loadAllJS() {
    this.loadJS("bin/examples/CubeTest.js");
    this.loadJS("bin/examples/TextureTest.js");
    this.loadJS("bin/examples/LightTest.js");
    this.loadJS("bin/examples/ShadowTest.js");
    this.loadJS("bin/examples/AnimationTest.js");
}
var Main = /** @class */ (function () {
    function Main() {
        // 加载类型注册
        dou.loader.registerAnalyzer("text" /* text */, new dou.TextAnalyzer());
        dou.loader.registerAnalyzer("json" /* json */, new dou.JsonAnalyzer());
        dou.loader.registerAnalyzer("binary" /* binary */, new dou.BytesAnalyzer());
        dou.loader.registerAnalyzer("texture" /* texture */, new dou3d.TextureAnalyzer());
        dou.loader.registerAnalyzer("esm" /* esm */, new dou3d.ESMAnalyzer());
        dou.loader.registerAnalyzer("eam" /* eam */, new dou3d.EAMAnalyzer());
        var engine = new dou3d.Engine();
        var viewRect = engine.viewRect;
        var view3D = new dou3d.View3D(0, 0, viewRect.w, viewRect.h);
        view3D.on(dou3d.Event3D.RESIZE, function () {
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
    return Main;
}());
