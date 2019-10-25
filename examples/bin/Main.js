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
        var demo = urlParams.demo;
        loadJSAsync("bin/examples/" + demo + ".js", function () {
            new examples[demo](view3D);
        });
    }
    return Main;
}());
