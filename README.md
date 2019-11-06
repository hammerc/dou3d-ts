# dou3d-ts

逗3D，基于 WebGL 的 3D 引擎，整体框架参考 AS3 时代的 Away3D 引擎，具体的实现参考了部分 H5 3D 引擎。

*本着以其看别人的引擎代码学习不如自己照着实现一个的想法，所以写了该引擎。*

* 该引擎主要是我自己为了了解3D底层运行原理而写，如果还有时间会扩充和完善示例。

* 本引擎采用左手坐标系。

[欢迎来我的博客，不定时发布 3D 学习心得。](https://www.cnblogs.com/hammerc/)

---

## 开始上手

1. 在编写代码之前请引入位于**examples/lib**文件夹中的**dou.js**和**dou3d.js**两个文件：

```html
<script type="text/javascript" src="examples/lib/dou.js"></script>
<script type="text/javascript" src="examples/lib/dou3d.js"></script>
```

2. 需要外部加载资源时，请注册加载类型解析器：

```javascript
// 注册贴图解析器并绑定对应的文件后缀名
dou.loader.registerAnalyzer("texture", new dou3d.TextureAnalyzer());
dou.loader.registerExtension("jpg", "texture");
dou.loader.registerExtension("jpeg", "texture");
dou.loader.registerExtension("png", "texture");
```

3. 启动引擎并创建View3D对象：

```javascript
var engine = new dou3d.Engine();
var viewRect = engine.viewRect;
var view3D = new dou3d.View3D(0, 0, viewRect.w, viewRect.h);
view3D.on(dou3d.Event3D.RESIZE, function () {
    view3D.width = viewRect.w;
    view3D.height = viewRect.h;
});
engine.addView3D(view3D);
```

4. 调整摄像机位置：

```javascript
view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));
```

5. 添加立方体对象：

```javascript
var geometery = new dou3d.CubeGeometry();
var cube = new dou3d.Mesh(geometery);
view3D.scene.root.addChild(cube);
```

## 未实现的引擎必备功能

*受时间和精力的限制，这部分的功能实现会在时间充裕之后补上。*

* 阴影支持所有类型灯光；

* 通用模型文件解码；

* 包围盒；

* 碰撞和拾取；

* 文本渲染；

* 3D声音；

* 粒子效果；

* GUI；

* 地形；

* 效率优化（绘制批处理）；

## 引擎示例

* [立方体](https://hammerc.github.io/dou3d-ts/examples/index.html?demo=CubeTest)

* [贴图](https://hammerc.github.io/dou3d-ts/examples/index.html?demo=TextureTest)

* [光照](https://hammerc.github.io/dou3d-ts/examples/index.html?demo=LightTest)

* [阴影](https://hammerc.github.io/dou3d-ts/examples/index.html?demo=ShadowTest)

    *注：阴影仅支持方向光*

* [骨骼动画](https://hammerc.github.io/dou3d-ts/examples/index.html?demo=AnimationTest)

    *注：小键盘数字键可以切换动画播放*

* [朝向控制器](https://hammerc.github.io/dou3d-ts/examples/index.html?demo=LookAtTest)

* [拖拽查看](https://hammerc.github.io/dou3d-ts/examples/index.html?demo=HoverTest)

* [坐标转换](https://hammerc.github.io/dou3d-ts/examples/index.html?demo=TransformTest)

    *注：左边使用了本地坐标转全局坐标，右边使用了全局坐标转本地坐标*

* [天空盒](https://hammerc.github.io/dou3d-ts/examples/index.html?demo=SkyBoxTest)

* [公告板](https://hammerc.github.io/dou3d-ts/examples/index.html?demo=BillboardTest)

* [线框](https://hammerc.github.io/dou3d-ts/examples/index.html?demo=WireframeTest)
