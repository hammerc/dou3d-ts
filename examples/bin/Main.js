function loadJS(url) {
    document.writeln("<script src=\"" + url + "\"></script>");
}
function loadAllJS() {
}
function loadJSAsync(src, callback) {
    var s = document.createElement("script");
    s.async = false;
    s.src = src;
    s.addEventListener("load", function () {
        s.parentNode.removeChild(s);
        s.removeEventListener("load", arguments.callee, false);
        callback();
    }, false);
    document.body.appendChild(s);
}
var Main = /** @class */ (function () {
    function Main(urlParams) {
        // 注册加载类型解析器
        dou.loader.registerAnalyzer("text" /* text */, new dou.TextAnalyzer());
        dou.loader.registerAnalyzer("json" /* json */, new dou.JsonAnalyzer());
        dou.loader.registerAnalyzer("binary" /* binary */, new dou.BytesAnalyzer());
        dou.loader.registerAnalyzer("texture" /* texture */, new dou3d.TextureAnalyzer());
        dou.loader.registerAnalyzer("esm" /* esm */, new dou3d.ESMAnalyzer());
        dou.loader.registerAnalyzer("eam" /* eam */, new dou3d.EAMAnalyzer());
        // 关联文件后缀名到指定类型, 扩展名恰好就是资源类型的情况无需指定
        dou.loader.registerExtension("txt", "text" /* text */);
        dou.loader.registerExtension("bin", "binary" /* binary */);
        dou.loader.registerExtension("jpg", "texture" /* texture */);
        dou.loader.registerExtension("jpeg", "texture" /* texture */);
        dou.loader.registerExtension("png", "texture" /* texture */);
        var engine = new dou3d.Engine();
        var viewRect = engine.viewRect;
        var view3D = new dou3d.View3D(0, 0, viewRect.w, viewRect.h);
        view3D.on(dou3d.Event3D.RESIZE, function () {
            view3D.width = viewRect.w;
            view3D.height = viewRect.h;
        });
        engine.addView3D(view3D);
        switch (urlParams.demo) {
            case "cube":
                loadJSAsync("bin/examples/CubeTest.js", function () {
                    new examples.CubeTest(view3D);
                });
                break;
            case "texture":
                loadJSAsync("bin/examples/TextureTest.js", function () {
                    new examples.TextureTest(view3D);
                });
                break;
            case "light":
                loadJSAsync("bin/examples/LightTest.js", function () {
                    new examples.LightTest(view3D);
                });
                break;
            case "shadow":
                loadJSAsync("bin/examples/ShadowTest.js", function () {
                    new examples.ShadowTest(view3D);
                });
                break;
            case "animation":
                loadJSAsync("bin/examples/AnimationTest.js", function () {
                    new examples.AnimationTest(view3D);
                });
                break;
            case "lookAt":
                loadJSAsync("bin/examples/LookAtControllerTest.js", function () {
                    new examples.LookAtControllerTest(view3D);
                });
                break;
            case "hover":
                loadJSAsync("bin/examples/HoverControllerTest.js", function () {
                    new examples.HoverControllerTest(view3D);
                });
                break;
            case "transform":
                loadJSAsync("bin/examples/TransformTest.js", function () {
                    new examples.TransformTest(view3D);
                });
                break;
            case "skyBox":
                loadJSAsync("bin/examples/SkyBoxTest.js", function () {
                    new examples.SkyBoxTest(view3D);
                });
                break;
        }
    }
    return Main;
}());
