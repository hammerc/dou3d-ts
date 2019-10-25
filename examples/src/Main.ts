function loadJS(url: string): void {
    document.writeln(`<script src="${url}"></script>`);
}

function loadAllJS(): void {
}

function loadJSAsync(src: string, callback: () => void): void {
    let s = document.createElement("script");
    s.async = false;
    s.src = src;
    s.addEventListener("load", function () {
        s.parentNode.removeChild(s);
        s.removeEventListener("load", <any>arguments.callee, false);
        callback();
    }, false);
    document.body.appendChild(s);
}

class Main {
    public constructor(urlParams: { [key: string]: string }) {
        // 注册加载类型解析器
        dou.loader.registerAnalyzer(ResourceType.text, new dou.TextAnalyzer());
        dou.loader.registerAnalyzer(ResourceType.json, new dou.JsonAnalyzer());
        dou.loader.registerAnalyzer(ResourceType.binary, new dou.BytesAnalyzer());
        dou.loader.registerAnalyzer(ResourceType.texture, new dou3d.TextureAnalyzer());
        dou.loader.registerAnalyzer(ResourceType.esm, new dou3d.ESMAnalyzer());
        dou.loader.registerAnalyzer(ResourceType.eam, new dou3d.EAMAnalyzer());
        // 关联文件后缀名到指定类型, 扩展名恰好就是资源类型的情况无需指定
        dou.loader.registerExtension("txt", ResourceType.text);
        dou.loader.registerExtension("bin", ResourceType.binary);
        dou.loader.registerExtension("jpg", ResourceType.texture);
        dou.loader.registerExtension("jpeg", ResourceType.texture);
        dou.loader.registerExtension("png", ResourceType.texture);

        let engine = new dou3d.Engine();
        let viewRect = engine.viewRect;
        let view3D = new dou3d.View3D(0, 0, viewRect.w, viewRect.h);
        view3D.on(dou3d.Event3D.RESIZE, () => {
            view3D.width = viewRect.w;
            view3D.height = viewRect.h;
        });
        engine.addView3D(view3D);

        let demo = urlParams.demo;
        loadJSAsync("bin/examples/" + demo + ".js", () => {
            new examples[demo](view3D);
        });
    }
}
