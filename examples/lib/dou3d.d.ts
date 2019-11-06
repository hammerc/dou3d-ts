declare namespace dou3d {
    /**
     * 引用计数基类
     * @author wizardc
     */
    abstract class Reference extends dou.HashObject {
        protected _count: number;
        readonly canDispose: boolean;
        incRef(): void;
        decRef(): void;
    }
}
declare namespace dou3d {
    /**
     * 渲染上下文
     * @author wizardc
     */
    class Context3DProxy {
        /**
         * 渲染上下文
         */
        static gl: WebGLRenderingContext;
        /**
         * canvas 窗口矩形
         */
        static canvasRectangle: Rectangle;
        private _program;
        private _sfactor;
        private _dfactor;
        private _cullingMode;
        private _depthTest;
        private _cullFace;
        private _depthCompareMode;
        register(): void;
        /**
         * 视口设置定义
         * 用来确定我们定义的视口在 canvas 中的所在位置
         */
        viewPort(x: number, y: number, width: number, height: number): void;
        /**
         * 设置矩形裁切区域
         */
        setScissorRectangle(x: number, y: number, width: number, height: number): void;
        /**
         * 创建顶点着色器
         */
        createVertexShader(source: string): Shader;
        /**
         * 创建片段着色器
         */
        createFragmentShader(source: string): Shader;
        /**
         * 创建渲染程序
         */
        createProgram(vertexShader: Shader, fragmentShader: Shader): Program3D;
        /**
         * 使用显卡着色器
         */
        setProgram(program: Program3D): void;
        /**
         * 创建顶点缓冲
         */
        createVertexBuffer(vertexData: Float32Array, dawType?: number): VertexBuffer3D;
        /**
         * 上传顶点缓冲
         */
        uploadVertexBuffer(vertexBuffer3D: VertexBuffer3D): void;
        /**
         * 创建索引缓冲
         */
        createIndexBuffer(indexData: Int16Array): IndexBuffer3D;
        /**
         * 上传索引缓冲
         */
        uploadIndexBuffer(indexBuffer3D: IndexBuffer3D): void;
        /**
         * 获取矩阵变量 ID
         */
        getUniformLocation(programe3D: Program3D, name: string): WebGLUniformLocation;
        /**
         * 传值给 shader 一个 float
         */
        uniform1f(location: WebGLUniformLocation, x: number): void;
        /**
         * 传值给 shader 一个 vec3 (float, float, float)
         */
        uniform1fv(location: WebGLUniformLocation, v: Float32List): void;
        /**
         * 传值给 shader 一个 int
         */
        uniform1i(location: WebGLUniformLocation, x: number): void;
        /**
         * 传值给 shader 一个 int 数组
         */
        uniform1iv(location: WebGLUniformLocation, v: Int32List): void;
        /**
         * 传值给 shader 两个 float
         */
        uniform2f(location: WebGLUniformLocation, x: number, y: number): void;
        /**
         * 传值给 shader vec2 (float, float)
         */
        uniform2fv(location: WebGLUniformLocation, v: Float32List): void;
        /**
         * 传值给 shader 两个 int 值
         */
        uniform2i(location: WebGLUniformLocation, x: number, y: number): void;
        /**
         * 传值给 shader vec2 (int, int)
         */
        uniform2iv(location: WebGLUniformLocation, v: Int32List): void;
        /**
         * 传值给 shader 3 个 float
         */
        uniform3f(location: WebGLUniformLocation, x: number, y: number, z: number): void;
        /**
         * 传值给 shader vec3 (float, float, float)
         */
        uniform3fv(location: WebGLUniformLocation, v: Float32List): void;
        /**
         * 传值给 shader 3 个 int
         */
        uniform3i(location: WebGLUniformLocation, x: number, y: number, z: number): void;
        /**
         * 传值给 shader vec3 (int, int, int)
         */
        uniform3iv(location: WebGLUniformLocation, v: Int32List): void;
        /**
         * 传值给 shader 4 个 float 值
         */
        uniform4f(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): void;
        /**
         * 传值给 shader vec (float, float, float, float)
         */
        uniform4fv(location: WebGLUniformLocation, v: Float32List): void;
        /**
         * 传值给 shader 4 个 int 值
         */
        uniform4i(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): void;
        /**
         * 传值给 shader vec4 (int, int, int, int)
         */
        uniform4iv(location: WebGLUniformLocation, v: Int32List): void;
        /**
         * 传值给 shader 2 * 2 矩阵
         * @param transpose 是否转置
         */
        uniformMatrix2fv(location: WebGLUniformLocation, transpose: boolean, value: Float32List): void;
        /**
         * 传值给 shader 3 * 3 矩阵
         * @param transpose 是否转置
         */
        uniformMatrix3fv(location: WebGLUniformLocation, transpose: boolean, value: Float32List): void;
        /**
         * 传值给 shader 4 * 4 矩阵
         * @param transpose 是否转置
         */
        uniformMatrix4fv(location: WebGLUniformLocation, transpose: boolean, value: Float32List): void;
        /**
         * 获取顶点着色器变量索引
         */
        getShaderAttribLocation(programe: Program3D, attribName: string): number;
        /**
         * 设定所有的顶点属性都是非数组结构
         */
        disableAllVertexAttribArray(): void;
        /**
         * 指定顶点着色器变量索引及结构
         * @param index 变量索引
         * @param size  数据个数
         * @param dataType  数据类型
         * @param normalized 是否单位化
         * @param stride 字节数
         * @param offset 当前变量字节偏移
         */
        vertexAttribPointer(index: number, size: number, dataType: number, normalized: boolean, stride: number, offset: number): void;
        /**
         * 实时传入显卡顶点着色器变量数组数据
         */
        setVertexShaderConstData(floats: Float32Array, offest: number, numLen: number): void;
        /**
         * 绑定顶点 Buffer
         */
        bindVertexBuffer(vertexBuffer: VertexBuffer3D): void;
        /**
         * 绑定顶点索引 Buffer
         */
        bindIndexBuffer(indexBuffer: IndexBuffer3D): void;
        /**
        * @language zh_CN
        * 创建 2维贴图 向显卡提交buffer申请 并创建Texture2D对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        createTexture(): WebGLTexture;
        /**
         * 设置2D纹理状态, 来确定贴图的采样方式
         * @param target gl.TEXTURE_2D, gl.TEXTURE_CUBE_MAP
         * @param pname 采用的纹理滤镜类型
         * @param param 对应该纹理滤镜的参数
         * @tutorial https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texParameter
         * @tutorial https://blog.csdn.net/puppet_master/article/details/53485919
         */
        texParameteri(target: number, pname: number, param: number): void;
        /**
         * 上传纹理
         */
        upLoadTextureData(mipLevel: number, texture: TextureBase): void;
        /**
         * 提交2D压缩纹理，用硬件来解析dds贴图
         */
        upLoadCompressedTexture2D(mipLevel: number, texture: ContextTexture2D): void;
        /**
         * 提交立方体纹理
         */
        uploadCubetexture(tex: ContextTexture3D): void;
        /**
         *
         * @param width
         * @param height
         * @param format
         */
        createFramebuffer(width: number, height: number, format: FrameBufferFormat): ContextTexture2D;
        /**
         * 设置渲染缓冲为贴图
         */
        setRenderToTexture(texture: ContextTexture2D): void;
        /**
         * 设置渲染缓冲为屏幕
         */
        setRenderToBackBuffer(): void;
        /**
         * 设置贴图采样
         * @param samplerIndex 激活和绑定的采样器单元, 对应 gl.TEXTURE_0 ~ gl.TEXTURE_8
         * @param uniLocation 着色器中对应的取样器索引
         * @param index 赋值给取样器变量的纹理单元编号, 纹理单元对应的编号: 如果第一个参数是 gl.TEXTURE_0 则这里传递 0
         * @param texture 贴图对象
         */
        setTexture2DAt(samplerIndex: number, uniLocation: any, index: number, texture: ContextTexture2D): void;
        /**
         * 设置贴图采样
         * @param samplerIndex 激活和绑定的采样器单元, 对应 gl.TEXTURE_0 ~ gl.TEXTURE_8
         * @param uniLocation 着色器中对应的取样器索引
         * @param index 赋值给取样器变量的纹理单元编号, 纹理单元对应的编号: 如果第一个参数是 gl.TEXTURE_0 则这里传递 0
         * @param texture 贴图对象
         */
        setCubeTextureAt(samplerIndex: number, uniLocation: number, index: number, texture: ContextTexture3D): void;
        /**
         * 设置混合模式
         */
        setBlendFactors(src: number, dst: number): void;
        /**
         * 设置剔除模式
         * @see Context3DProxy.gl.FRONT
         * @see Context3DProxy.gl.BACK
         */
        setCulling(mode: number): void;
        /**
         * 开启深度测试模式
         */
        enableDepth(): void;
        /**
         * 关闭深度测试模式
         */
        disableDepth(): void;
        /**
         * 开启剔除面模式
         */
        enableCullFace(): void;
        /**
         * 关闭剔除面模式
         */
        disableCullFace(): void;
        /**
         * 开启混合模式
         */
        enableBlend(): void;
        /**
         * 关闭混合模式
         */
        disableBlend(): void;
        /**
         * 深度测试比较模式
         */
        depthFunc(compareMode?: number): void;
        /**
         * 绘制模型元素
         * @param type 图元类型
         * @param first 第一个顶点索引
         * @param length 顶点个数
         */
        drawArrays(type: number, first: number, length: number): void;
        /**
         * 绘制模型元素
         * @param type 图元类型
         * @param indexBuffer 索引数据
         * @param offset 顶点索引偏移 (字节数)
         * @param length 顶点个数
         */
        drawElement(type: number, offset: number, length: number): void;
        /**
         * 绘制提交
         */
        flush(): void;
        /**
         * 清除指定缓冲区
         */
        clear(mask: number): void;
        /**
         * 清除渲染区域的颜色和深度
         */
        clearColor(r: number, g: number, b: number, a: number): void;
        /**
         * 清除渲染区域的模板
         */
        clearStencil(stencil: number): void;
    }
}
declare namespace dou3d {
    /**
     * 2D 纹理
     * @author wizardc
     */
    class ContextTexture2D {
        /**
         * 提交显卡的 index
         */
        index: number;
        /**
         * 显卡中上传使用的 border 边框像素大小
         */
        border: number;
        /**
         * 纹理贴图的颜色格式
         * @see Context3DProxy.gl.ColorFormat_RGB565
         * @see Context3DProxy.gl.ColorFormat_RGBA5551
         * @see Context3DProxy.gl.ColorFormat_RGBA4444
         * @see Context3DProxy.gl.ColorFormat_RGBA8888
         */
        colorFormat: number;
        /**
         * 纹理贴图的颜色格式
         * @see Context3DProxy.gl.BYTE
         * @see Context3DProxy.gl.SHORT
         * @see Context3DProxy.gl.INT
         * @see Context3DProxy.gl.UNSIGNED_BYTE
         * @see Context3DProxy.gl.UNSIGNED_SHORT
         * @see Context3DProxy.gl.UNSIGNED_INT
         */
        dataFormat: number;
        /**
         * 纹理贴图标准的格式
         */
        internalFormat: InternalFormat;
        /**
         * 原生贴图对象
         */
        texture: WebGLTexture;
        /**
         * 贴图元素对象
         */
        imageData: HTMLImageElement;
        /**
         * mipmap数据
         */
        mimapData: Array<MipmapData>;
        /**
         * 原生帧缓冲对象
         */
        frameBuffer: WebGLFramebuffer;
        /**
         * 原生渲染缓冲对象
         */
        renderbuffer: WebGLRenderbuffer;
        /**
         * 提交给显卡的贴图宽度
         * - 当作为 renderTexture 使用时一定要传入真实尺寸
         */
        width: number;
        /**
         * 提交给显卡的贴图高度
         * - 当作为 renderTexture 使用时一定要传入真实尺寸
         */
        height: number;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 由 6 个 ContextTexture2D 组成的立方体贴图
     * @author wizardc
     */
    class ContextTexture3D {
        /**
         * 提交显卡的 index
         */
        index: number;
        /**
         * 显卡中上传使用的 border 边框像素大小
         */
        border: number;
        /**
         * 纹理贴图的颜色模式
         * @see Context3DProxy.gl.ColorFormat_RGB565
         * @see Context3DProxy.gl.ColorFormat_RGBA5551
         * @see Context3DProxy.gl.ColorFormat_RGBA4444
         * @see Context3DProxy.gl.ColorFormat_RGBA8888
         */
        colorformat: number;
        /**
         * 纹理贴图标准的格式
         */
        internalformat: InternalFormat;
        /**
         * 原生贴图对象
         */
        texture: WebGLTexture;
        /**
         * mipmap数据
         */
        mimapData: Array<MipmapData>;
        image_front: ContextTexture2D;
        image_back: ContextTexture2D;
        image_left: ContextTexture2D;
        image_right: ContextTexture2D;
        image_up: ContextTexture2D;
        image_down: ContextTexture2D;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 提供了用于呈现几何定义图形的上下文的帧缓冲对象
     * 渲染上下文包括一个绘图表面及其关联的资源帧缓冲对象
     * @author wizardc
     */
    class FrameBuffer {
        name: number;
        width: number;
        height: number;
        texture: ContextTexture2D;
    }
}
declare namespace dou3d {
    /**
     * 顶点索引缓冲
     * @author wizardc
     */
    class IndexBuffer3D {
        private _buffer;
        private _arrayBuffer;
        constructor(buffer: WebGLBuffer, arrayBuffer: Uint16Array);
        readonly buffer: WebGLBuffer;
        readonly arrayBuffer: Uint16Array;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 一个贴图的不同 LOD 层级数据
     * @author wizardc
     */
    class MipmapData {
        data: Uint8Array;
        width: number;
        height: number;
        constructor(data: Uint8Array, width: number, height: number);
    }
}
declare namespace dou3d {
    /**
     * 渲染程序
     * @author wizardc
     */
    class Program3D {
        private static ID;
        private _id;
        private _program;
        constructor(program: WebGLProgram);
        readonly id: number;
        readonly program: WebGLProgram;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 着色器
     * @author wizardc
     */
    class Shader {
        private static ID;
        private _id;
        private _shader;
        constructor(shader: WebGLShader);
        id: string;
        readonly shader: WebGLShader;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 顶点数据
     * @author wizardc
     */
    class VertexBuffer3D {
        private _buffer;
        private _arrayBuffer;
        constructor(buffer: WebGLBuffer, arrayBuffer: Float32Array);
        readonly buffer: WebGLBuffer;
        readonly arrayBuffer: Float32Array;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 3D 空间中的一个对象
     * @author wizardc
     */
    class Object3D extends dou.EventDispatcher {
        protected _position: Vector3;
        protected _rotation: Vector3;
        protected _scale: Vector3;
        protected _orientation: Quaternion;
        protected _globalPosition: Vector3;
        protected _globalRotation: Vector3;
        protected _globalScale: Vector3;
        protected _globalOrientation: Quaternion;
        protected _globalMatrix: Matrix4;
        protected _globalTransformChanged: boolean;
        protected _visible: boolean;
        protected _parent: ObjectContainer3D;
        protected _name: string;
        protected _layer: Layer;
        protected _controller: ControllerBase;
        constructor();
        position: Readonly<Vector3>;
        x: number;
        y: number;
        z: number;
        rotation: Readonly<Vector3>;
        rotationX: number;
        rotationY: number;
        rotationZ: number;
        scale: Readonly<Vector3>;
        scaleX: number;
        scaleY: number;
        scaleZ: number;
        orientation: Readonly<Quaternion>;
        orientationX: number;
        orientationY: number;
        orientationZ: number;
        orientationW: number;
        globalPosition: Vector3;
        globalRotation: Vector3;
        globalScale: Vector3;
        globalOrientation: Quaternion;
        globalMatrix: Matrix4;
        visible: boolean;
        readonly parent: ObjectContainer3D;
        name: string;
        /**
         * 渲染的层
         */
        layer: Layer;
        controller: ControllerBase;
        setParent(parent: ObjectContainer3D): void;
        invalidTransform(): void;
        invalidGlobalTransform(): void;
        /**
         * 立即刷新当前的变换矩阵
         */
        validateTransformNow(): void;
        protected updateGlobalTransform(): void;
        protected markTransform(): void;
        protected onTransformUpdate(): void;
        /**
         * 朝向指定位置
         */
        lookAt(from: Vector3, to: Vector3, up?: Vector3): void;
        /**
         * 朝向指定的目标
         */
        lookAtTarget(target: Object3D): void;
        /**
         * 将对象的本地坐标转换为全局坐标
         */
        localToGlobal(local: IVector3, result?: IVector4): IVector4;
        /**
         * 将全局坐标转换为对象的本地坐标
         */
        globalToLocal(local: IVector3, result?: IVector4): IVector4;
        /**
         * 更新
         * @param time 当前时间
         * @param delay 每帧时间间隔
         * @param camera 当前渲染的摄相机
         */
        update(time: number, delay: number, camera: Camera3D): void;
        /**
         * 销毁本对象
         */
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 场景中的可见物体, 可渲染对象
     * 在渲染之前会将渲染树中对象进行筛选, 只有继承 RenderBase 的对象才会进入渲染管线
     * @author wizardc
     */
    abstract class RenderBase extends Object3D {
        /**
         * 几何体网格信息
         */
        protected _geometry: Geometry;
        protected _materialCount: number;
        protected _lightGroup: LightGroup;
        protected _order: number;
        /**
         * 当前对象使用的材质
         */
        material: MaterialBase;
        /**
         * 如果使用到多个材质时, 多个材质会存储在这里
         */
        multiMaterial: {
            [matID: number]: MaterialBase;
        };
        /**
         * 类型
         */
        type: string;
        /**
         * 动画对象, 控制骨骼动画
         */
        animation: IAnimation;
        /**
         * 渲染排序的参数，数值越大，先渲染
         */
        order: number;
        geometry: Geometry;
        /**
         * 设置材质球接受的灯光组
         */
        lightGroup: LightGroup;
        /**
         * 增加一个材质
         */
        addSubMaterial(id: number, material: MaterialBase): void;
        /**
         * 删除一个材质
         */
        removeSubMaterial(id: number): void;
        /**
         * 用ID得到一个材质
         */
        getMaterial(id: number): MaterialBase;
        /**
         * 得到所有材质的个数
         */
        materialCount(): number;
        update(time: number, delay: number, camera: Camera3D): void;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 3D 容器对象
     * @author wizardc
     */
    class ObjectContainer3D extends Object3D {
        protected _children: Object3D[];
        constructor();
        readonly children: Object3D[];
        readonly numChildren: number;
        invalidGlobalTransform(): void;
        addChild(child: Object3D): Object3D;
        getChildAt(index: number): Object3D;
        getChildIndex(child: Object3D): number;
        removeChild(child: Object3D): Object3D;
        removeChildAt(index: number): Object3D;
        removeAllChildren(): void;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 模型网格
     * @author wizardc
     */
    class Mesh extends RenderBase {
        constructor(geometry: Geometry, material?: MaterialBase, animation?: IAnimation);
        clone(): Mesh;
    }
}
declare namespace dou3d {
    /**
     * 公告板, 始终面朝摄像机的面板
     * @author wizardc
     */
    class Billboard extends Mesh {
        private _plane;
        constructor(material: MaterialBase, geometry?: Geometry, width?: number, height?: number);
        update(time: number, delay: number, camera: Camera3D): void;
        clone(): Mesh;
    }
}
declare namespace dou3d {
    /**
     * 渲染线框
     * * 使用LINES的模式进行渲染
     * @author wizardc
     */
    class Wireframe extends RenderBase {
        constructor(color?: number);
        fromVertexs(src: any, vf?: VertexFormat): void;
        fromVertexsEx(src: any, vf?: VertexFormat): void;
        fromGeometry(geo: Geometry): void;
    }
}
declare namespace dou3d {
    /**
     * 天空盒
     * @author wizardc
     */
    class SkyBox extends Mesh {
        camera: Camera3D;
        constructor(geometry: Geometry, material: MaterialBase, camera?: Camera3D);
        update(time: number, delay: number, camera: Camera3D): void;
    }
}
declare namespace dou3d {
    /**
     * 渲染对象收集器基类
     * @author wizardc
     */
    class CollectBase {
        protected _renderList: RenderBase[];
        protected _scene: Scene3D;
        constructor();
        /**
         * 可渲染对象列表
         */
        readonly renderList: RenderBase[];
        /**
         * 场景对象
         */
        scene: Scene3D;
        /**
         * 查找一个对象在渲染列表的下标
         */
        findRenderObject(target: RenderBase): number;
        /**
         * 数据更新
         */
        update(camera: Camera3D): void;
    }
}
declare namespace dou3d {
    /**
     * 渲染对象收集器, 把渲染对象进行可视筛选, 并且划分渲染层级, 依次排序到加入列表
     * @author wizardc
     */
    class EntityCollect extends CollectBase {
        layerMap: {
            [layer: number]: RenderBase[];
        };
        /**
         * 数据更新 处理需要渲染的对象
         */
        update(camera: Camera3D): void;
        protected clearLayerList(): void;
        private applyRender;
        /**
         * 尝试将一个渲染对象进行视锥体裁剪放入到渲染队列中
         */
        private addRenderList;
        /**
         * 距离摄像机由远到近的排序
         */
        protected sort(a: Object3D, b: Object3D, camera: Camera3D): number;
        /**
         * 根据 order 来进行降序排序
         */
        protected sortByOrder(a: RenderBase, b: RenderBase): number;
    }
}
declare namespace dou3d {
    /**
     * 层枚举
     * @author wizardc
     */
    const enum Layer {
        normal = 0,
        alpha = 1,
        max = 2
    }
}
declare namespace dou3d {
    /**
     * 心跳计时器
     * @author wizardc
     */
    class Ticker extends dou.TickerBase {
        private _deltaTime;
        private _engine;
        constructor(engine: Engine);
        readonly deltaTime: number;
        updateLogic(passedTime: number): void;
    }
}
declare namespace dou3d {
    /**
     * 3D 渲染视图
     * - view3D 是整个 3D 引擎的渲染视口, 可以控制渲染窗口的大小和渲染的方式
     * - 包含一个摄像机对象和一个场景对象
     * - 目前不支持添加多个摄像机
     * @author wizardc
     */
    class View3D extends dou.EventDispatcher {
        protected _viewPort: Rectangle;
        protected _camera: Camera3D;
        protected _scene: Scene3D;
        protected _render: RendererBase;
        protected _entityCollect: EntityCollect;
        protected _backColor: Vector4;
        protected _cleanParmerts: number;
        constructor(x: number, y: number, width: number, height: number, camera?: Camera3D);
        x: number;
        y: number;
        width: number;
        height: number;
        readonly viewPort: Rectangle;
        /**
         * 检测是否在当前视口内
         */
        inView3D(x: number, y: number): boolean;
        /**
         * 设置是否清除背景缓冲颜色和深度
         * @param cleanColor 是否清除背景缓冲颜色
         * @param cleanDepth 是否清除背景缓冲深度
         */
        blender(cleanColor: boolean, cleanDepth: boolean): void;
        /**
         * 背景颜色
         */
        backColor: number;
        /**
         * 场景
         */
        scene: Scene3D;
        /**
         * 摄像机
         */
        camera3D: Camera3D;
        /**
         * 实体收集对象
         */
        readonly entityCollect: EntityCollect;
        update(time: number, delay: number): void;
        private updateObject3D;
    }
}
declare namespace dou3d {
    /**
     * 动画接口
     * @author wizardc
     */
    interface IAnimation {
        /**
         * 总时间
         */
        animTime: number;
        /**
         * 帧间隔时间
         */
        delay: number;
        /**
         * 动画播放速度
         */
        speed: number;
        /**
         * 动画列表
         */
        animStateNames: string[];
        /**
         * 动画节点
         */
        animStates: IAnimationState[];
        /**
         * 更新
         */
        update(time: number, delay: number, geometry: Geometry): void;
        /**
         * GPU传值
         */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modelTransform: Matrix4, camera3D: Camera3D): void;
        /**
         * 播放动画
         * @param animName 动画名称
         * @param speed 播放速度
         * @param reset 是否重置
         * @param prewarm 是否预热
         */
        play(animName?: string, speed?: number, reset?: boolean, prewarm?: boolean): void;
        /**
         * 是否正在播放
         */
        isPlay(): boolean;
        /**
         * 停止动画播放
         */
        stop(): void;
        addAnimState(animState: IAnimationState): void;
        removeAnimState(animState: IAnimationState): void;
        clone(): IAnimation;
    }
}
declare namespace dou3d {
    /**
     * 动画状态机
     * @author wizardc
     */
    interface IAnimationState {
        /**
         * 动画名字
         */
        name: string;
    }
}
declare namespace dou3d {
    /**
     * 骨骼关节
     * * 属于骨架类的组成部分
     * @author wizardc
     */
    class Joint {
        /**
         * 骨骼名称
         */
        name: string;
        /**
         * 父骨骼名称
         */
        parent: string;
        /**
         * 父骨骼索引编号
         */
        parentIndex: number;
        /**
         * 骨骼缩放量
         */
        scale: Vector3;
        /**
         * 骨骼旋转量
         */
        orientation: Quaternion;
        /**
         * 骨骼平移量
         */
        translation: Vector3;
        /**
         * 骨骼本地矩阵
         */
        localMatrix: Matrix4;
        /**
         * 骨骼逆矩阵
         */
        inverseMatrix: Matrix4;
        /**
         * 骨骼世界矩阵
         */
        worldMatrix: Matrix4;
        /**
         * 骨骼世界矩阵是否有效
         */
        worldMatrixValid: boolean;
        constructor(name: string);
        /**
         * 构建骨骼本地矩阵
         */
        buildLocalMatrix(scale: Vector3, rotation: Vector3 | Quaternion, translation: Vector3): void;
        /**
         * 构建骨骼逆矩阵
         */
        buildInverseMatrix(scale: Vector3, rotation: Vector3 | Quaternion, translation: Vector3): void;
        clone(): Joint;
    }
}
declare namespace dou3d {
    /**
     * 骨架类
     * * 其中包含若干个 Joint (骨骼关节) 对象
     * @author wizardc
     */
    class Skeleton {
        /**
         * 骨架包含的骨骼
         */
        joints: Joint[];
        constructor();
        /**
         * 骨骼数量
         */
        readonly jointNum: number;
        /**
         * 通过名称查找指定骨骼
         */
        findJoint(name: string): Joint;
        /**
         * 通过名称查找骨骼索引编号
         */
        findJointIndex(name: string): number;
        clone(): Skeleton;
    }
}
declare namespace dou3d {
    /**
     * 骨骼动画控制类
     * @author wizardc
     */
    class SkeletonAnimation extends dou.EventDispatcher implements IAnimation {
        /**
         * 动画速率
         */
        static fps: number;
        /**
         * 播放速度
         */
        speed: number;
        isLoop: boolean;
        delay: number;
        private _currentAnimName;
        private _isPlay;
        private _animTime;
        private _animStateNames;
        private _animStates;
        private _blendSpeed;
        private _blendSkeleton;
        private _blendList;
        private _bindList;
        private _changeFrameTime;
        private _oldFrameIndex;
        private _movePosIndex;
        private _movePosObject3D;
        private _movePosition;
        private _resetMovePos;
        private _currentSkeletonPose;
        private _oldTime;
        constructor();
        /**
         * 骨架骨骼数量
         */
        readonly jointNum: number;
        /**
         * 动画名列表
         */
        readonly animStateNames: string[];
        /**
         * 动画状态对象列表
         */
        readonly animStates: SkeletonAnimationState[];
        /**
         * 动画时间
         */
        animTime: number;
        /**
         * 动画时间长度
         */
        readonly timeLength: number;
        /**
         * 动画帧索引
         */
        frameIndex: number;
        /**
         * 融合速度(默认300毫秒)
         */
        blendSpeed: number;
        /**
         * 当前播放的动画名称
         */
        readonly currentAnimName: string;
        /**
         * 当前动画是否正在播放
         */
        isPlay(): boolean;
        /**
         * 添加骨骼动画剪辑对象
         */
        addSkeletonAnimationClip(animationClip: SkeletonAnimationClip): void;
        /**
         * 添加骨骼动画状态对象
         */
        addAnimState(animState: SkeletonAnimationState): void;
        /**
         * 移除骨骼动画状态对象
         */
        removeAnimState(animState: SkeletonAnimationState): void;
        /**
         * 播放骨骼动画
         * @param animName 动画名称
         * @param speed 播放速度
         * @param reset 是否重置
         * @param prewarm 是否预热
         */
        play(animName?: string, speed?: number, reset?: boolean, prewarm?: boolean): void;
        /**
         * 暂停骨骼动画播放（停留在当前帧）
         */
        pause(): void;
        /**
         * 停止骨骼动画播放（停留在第一帧）
         */
        stop(): void;
        /**
         * 更新骨骼动画
         * @param time 总时间
         * @param delay 延迟时间
         * @param geometry 该值无效
         */
        update(time: number, delay: number, geometry: Geometry): void;
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void;
        /**
         * 绑定3D对象到骨骼
         * @param jointName 骨骼名称
         * @param obj3d 3D对象
         * @returns boolean 是否成功
         */
        bindToJointPose(jointName: string, object3D: Object3D): boolean;
        setMovePosJointName(jointName: string, target: Object3D): boolean;
        private updateBindList;
        private updateMovePos;
        clone(): SkeletonAnimation;
    }
}
declare namespace dou3d {
    /**
     *
     * @author wizardc
     */
    class SkeletonAnimationClip {
        /**
         * 每帧的骨架动画
         */
        poseArray: SkeletonPose[];
        animationName: string;
        sampling: number;
        boneCount: number;
        frameDataOffset: number;
        sourceData: dou.ByteArray;
        private _frameCount;
        private _timeLength;
        private _skeletonPose;
        constructor();
        readonly currentSkeletonPose: SkeletonPose;
        readonly frameCount: number;
        /**
         * 时间长度
         */
        readonly timeLength: number;
        /**
         * 骨骼数量
         */
        readonly jointNum: number;
        findJointIndex(name: string): number;
        addSkeletonPose(skeletonPose: SkeletonPose): void;
        buildInitialSkeleton(boneNameArray: string[], parentBoneNameArray: string[], frameCount: number): void;
        getSkeletonPose(index: number): SkeletonPose;
        private readSkeletonPose;
        clone(): SkeletonAnimationClip;
    }
}
declare namespace dou3d {
    /**
     *
     * @author wizardc
     */
    class SkeletonAnimationState implements IAnimationState {
        /**
         * State 名称
         */
        name: string;
        /**
         * 融合权重值
         */
        weight: number;
        private _timeLength;
        private _timePosition;
        private _skeletonAnimation;
        private _skeletonAnimationClip;
        constructor(name: string);
        /**
         * 骨骼动画控制器
         */
        /**
        * 骨骼动画控制器
        */
        skeletonAnimation: SkeletonAnimation;
        /**
         * 骨骼动画剪辑
         */
        readonly skeletonAnimationClip: SkeletonAnimationClip;
        /**
         * 动画时间长度
         */
        readonly timeLength: number;
        /**
         * 添加 SkeletonAnimationClip 对象
         */
        addAnimationClip(animationClip: SkeletonAnimationClip): void;
        /**
         * 时间位置
         */
        /**
        * 时间位置
        */
        timePosition: number;
        /**
         * 获取当前帧的SkeletonPose
         */
        readonly currentSkeletonPose: SkeletonPose;
        /**
         * 获取上一帧的SkeletonPose
         */
        readonly previousSkeletonPose: SkeletonPose;
        /**
         * 获取当前帧索引
         */
        readonly currentFrameIndex: number;
        /**
         * 获取帧数量
         */
        readonly frameNum: number;
        /**
         * 获取SkeletonPose
         */
        getSkeletonPose(index: number): SkeletonPose;
        /**
         * 克隆SkeletonAnimationState对象
         */
        clone(): SkeletonAnimationState;
    }
}
declare namespace dou3d {
    /**
     * 单帧骨架动画数据，若干个SkeletonPose组合成SkeletonAnimationClip， 做为骨骼骨架序列数据
     * @author wizardc
     */
    class SkeletonPose {
        /**
         * 骨架包含的骨骼
         */
        joints: Joint[];
        /**
         * 当前骨架的帧时间
         */
        frameTime: number;
        constructor();
        /**
         * 骨架插值计算
         */
        lerp(skeletonPoseA: SkeletonPose, skeletonPoseB: SkeletonPose, t: number): SkeletonPose;
        /**
         * 计算当前骨架内所有骨骼的世界矩阵
         */
        calculateJointWorldMatrix(): void;
        private calculateAbsoluteMatrix;
        /**
         * 更新GPU所需的骨骼缓存数据
         */
        updateGPUCacheData(skeleton: Skeleton, skeletonMatrixData: Float32Array, offset: Vector3): Float32Array;
        /**
         * 通过名称查找指定骨骼
         */
        findJoint(name: string): Joint;
        /**
         * 通过名称查找骨骼索引编号
         */
        findJointIndex(name: string): number;
        /**
         * 重置骨骼世界矩阵
         */
        resetWorldMatrix(): void;
        clone(): SkeletonPose;
    }
}
declare namespace dou3d {
    /**
     * 3D 摄像机对象
     * @author wizardc
     */
    class Camera3D extends Object3D {
        private _cameraType;
        private _projectMatrix;
        private _orthProjectMatrix;
        private _viewPort;
        private _aspectRatio;
        private _fov;
        private _near;
        private _far;
        private _viewMatrix;
        private _viewProjectionMatrix;
        private _lookAtPosition;
        private _orthProjectChange;
        constructor(cameraType?: CameraType);
        /**
         * 相机投影矩阵
         */
        readonly projectMatrix: Matrix4;
        /**
         * 相机类型
         */
        cameraType: CameraType;
        /**
         * 相机横纵比
         */
        aspectRatio: number;
        /**
         * 投影视角
         */
        fieldOfView: number;
        /**
         * 相机近截面
         */
        near: number;
        /**
         * 相机远截面
         */
        far: number;
        /**
         * 视口
         */
        viewPort: Rectangle;
        /**
         * 相机视图投影矩阵
         */
        readonly viewProjectionMatrix: Matrix4;
        /**
         * 相机正交投影矩阵
         */
        readonly orthProjectionMatrix: Matrix4;
        /**
         * 更新视口
         */
        updateViewport(x: number, y: number, width: number, height: number): void;
        /**
         * 面向指定的位置
         * @param pos 摄像机的全局坐标
         * @param target 面向的全局坐标
         * @param up 向上的方向
         */
        lookAt(pos: Vector3, target: Vector3, up?: Vector3): void;
        protected onTransformUpdate(): void;
        /**
         * 相机视图矩阵
         */
        readonly viewMatrix: Matrix4;
        /**
         * 相机目标点
         */
        readonly lookAtPosition: Vector3;
        /**
         * 将 3 维空间中的坐标转换为屏幕坐标
         */
        spaceToScreen(point: IVector3, result?: IVector2): IVector2;
        private project;
        /**
         * 屏幕坐标转换为 3 维空间中的坐标
         * @param z 位于 3 维空间中的深度坐标
         */
        screenToSpace(point: IVector2, z?: number, result?: IVector3): IVector3;
        private unproject;
        protected markTransform(): void;
    }
}
declare namespace dou3d {
    /**
     * 控制器基类
     * @author wizardc
     */
    abstract class ControllerBase {
        protected _autoUpdate: boolean;
        protected _target: Object3D;
        constructor(target?: Object3D);
        autoUpdate: boolean;
        target: Object3D;
        abstract update(time: number, delay: number): void;
    }
}
declare namespace dou3d {
    /**
     * 始终朝向指定目标的控制器
     * @author wizardc
     */
    class LookAtController extends ControllerBase {
        protected _lookAtPosition: Vector3;
        protected _lookAtObject: Object3D;
        protected _upAxis: Vector3;
        constructor(target?: Object3D, lookAtObject?: Object3D | Vector3);
        lookAtPosition: Vector3;
        lookAtObject: Object3D;
        upAxis: Vector3;
        update(time: number, delay: number): void;
    }
}
declare namespace dou3d {
    /**
     * 多参数控制的始终朝向指定目标的控制器
     * @author wizardc
     */
    class HoverController extends LookAtController {
        protected _panAngle: number;
        protected _tiltAngle: number;
        protected _distance: number;
        protected _minPanAngle: number;
        protected _maxPanAngle: number;
        protected _minTiltAngle: number;
        protected _maxTiltAngle: number;
        protected _steps: number;
        protected _yFactor: number;
        protected _wrapPanAngle: boolean;
        private _currentPanAngle;
        private _currentTiltAngle;
        constructor(target?: Object3D, lookAtObject?: Object3D | Vector3, panAngle?: number, tiltAngle?: number, distance?: number, minPanAngle?: number, maxPanAngle?: number, minTiltAngle?: number, maxTiltAngle?: number, steps?: number, yFactor?: number, wrapPanAngle?: boolean);
        /**
         * 水平角度
         */
        panAngle: number;
        /**
         * 倾斜角度
         */
        tiltAngle: number;
        /**
         * 距离
         */
        distance: number;
        /**
         * 最小水平角度
         */
        minPanAngle: number;
        /**
         * 最大水平角度
         */
        maxPanAngle: number;
        /**
         * 最小倾斜角度
         */
        minTiltAngle: number;
        /**
         * 最大倾斜角度
         */
        maxTiltAngle: number;
        /**
         * 每帧缓动的距离的除数
         * * 为 0 表示不进行缓动, 数字越大缓动速度越慢
         */
        steps: number;
        /**
         * y 轴和 x 轴的距离比值
         * * 为 1 时表示为圆形, 其它表示为椭圆形
         */
        yFactor: number;
        /**
         * 当 Pan 的角度超过 360 度之后, 是否将其重新设定为360度以内
         */
        wrapPanAngle: boolean;
        update(time: number, delay: number): void;
    }
}
declare namespace dou3d {
    /**
     * 混合模式
     * @author wizardc
     */
    const enum BlendMode {
        /**
         * 将显示对象的每个像素的 Alpha 值应用于背景
         */
        ALPHA = 0,
        /**
         * 强制为该显示对象创建一个透明度组
         */
        LAYER = 1,
        /**
         * 该显示对象出现在背景前面
         */
        NORMAL = 2,
        /**
         * 将显示对象的原色值与背景颜色的原色值相乘，然后除以 0xFF 进行标准化，从而得到较暗的颜色
         */
        MULTIPLY = 3,
        /**
         * 将显示对象的原色值添加到它的背景颜色中，上限值为 0xFF
         */
        ADD = 4,
        /**
         * 从背景颜色的值中减去显示对象原色的值，下限值为 0
         */
        SUB = 5,
        /**
         * 将显示对象颜色的补色（反色）与背景颜色的补色相除
         */
        DIV = 6,
        /**
         * 将显示对象颜色的补色（反色）与背景颜色的补色相乘，会产生漂白效果
         */
        SCREEN = 7,
        /**
         * 将显示对象的原色值添加到它的背景颜色中(较ADD稍微暗一些)，上限值为 0xFF
         */
        SOFT_ADD = 8
    }
}
declare namespace dou3d {
    /**
     * 摄像机类型
     * @author wizardc
     */
    const enum CameraType {
        /**
         * 透视投影
         */
        perspective = 0,
        /**
         * 正交投影
         */
        orthogonal = 1
    }
}
declare namespace dou3d {
    /**
     * 纹理贴图标准的格式
     * @author wizardc
     */
    const enum InternalFormat {
        /** Image 标签引入纹理 */
        imageData = 0,
        /** 压缩纹理 */
        compressData = 1,
        /** 像素数组 */
        pixelArray = 2
    }
}
declare namespace dou3d {
    /**
     * 贴图采样类型
     * @author wizardc
     */
    namespace ContextSamplerType {
        var TEXTURE_0: number;
        var TEXTURE_1: number;
        var TEXTURE_2: number;
        var TEXTURE_3: number;
        var TEXTURE_4: number;
        var TEXTURE_5: number;
        var TEXTURE_6: number;
        var TEXTURE_7: number;
        var TEXTURE_8: number;
    }
}
declare namespace dou3d {
    /**
     *
     * @author wizardc
     */
    const enum FrameBufferType {
        /**  */
        shadowFrameBufrfer = 0,
        /**  */
        defaultFrameBuffer = 1,
        /**  */
        positionFrameBuffer = 2,
        /**  */
        normalFrameBuffer = 3,
        /**  */
        specularFrameBuffer = 4,
        /**  */
        leftEyeFrameBuffer = 5,
        /**  */
        rightEyeFrameBuffer = 6,
        /**  */
        nextFrameBuffer = 7
    }
}
declare namespace dou3d {
    /**
     *
     * @author wizardc
     */
    const enum FrameBufferFormat {
        /**  */
        FLOAT_RGB = 0,
        /**  */
        FLOAT_RGBA = 1,
        /**  */
        UNSIGNED_BYTE_RGB = 2,
        /**  */
        UNSIGNED_BYTE_RGBA = 3
    }
}
declare namespace dou3d {
    /**
     * 着色器类型
     * @author wizardc
     */
    const enum ShaderType {
        /**
         * 顶点着色器
         */
        vertex = 0,
        /**
         * 片段着色器
         */
        fragment = 1
    }
}
declare namespace dou3d {
    /**
     * 顶点类型
     * @author wizardc
     */
    const enum VertexFormat {
        /**
         * 顶点坐标
         */
        VF_POSITION = 1,
        /**
         * 顶点法线
         */
        VF_NORMAL = 2,
        /**
         * 顶点切线
         */
        VF_TANGENT = 4,
        /**
         * 顶点颜色
         */
        VF_COLOR = 8,
        /**
         * 顶点uv
         */
        VF_UV0 = 16,
        /**
         * 顶点第二uv
         */
        VF_UV1 = 32,
        /**
         * 顶点蒙皮信息
         */
        VF_SKIN = 64
    }
}
declare namespace dou3d {
    /**
     * 灯光类型
     * @author wizardc
     */
    const enum LightType {
        /**
         * 点光源
         */
        point = 0,
        /**
         * 平行光
         */
        direct = 1,
        /**
         * 聚光灯
         */
        spot = 2
    }
}
declare namespace dou3d {
    /**
     * 渲染通道类型
     * @author wizardc
     */
    const enum PassType {
        diffusePass = 0,
        shadowPass = 1
    }
}
declare namespace dou3d {
    /**
     * 着色器片段类型
     * @author wizardc
     */
    enum ShaderPhaseType {
        /**
         * 自定义顶点着色器类型
         * * 定了这个字段的着色器之后就只会使用设定的着色器进行渲染不会动态加入其它的着色器
         */
        custom_vertex = 0,
        /**
         * 顶点着色器写入顺序: 0
         * * 自动写入 base_vs
         */
        /**
         * 顶点着色器写入顺序: 1
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 diffuse_vs 着色器片段
         * * 目前会添加的是 skeleton_vs
         */
        start_vertex = 1,
        /**
         * 顶点着色器写入顺序: 2
         * * 无默认着色器片段
         * * 目前会添加的是 shadowMapping_vs
         */
        vertex_1 = 2,
        /**
         * 顶点着色器写入顺序: 3
         * * 无默认着色器片段
         * * 目前会添加的是 cube_vs
         */
        vertex_2 = 3,
        /**
         * 顶点着色器写入顺序: 最后
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 end_vs 着色器片段
         * * 目前会添加的是
         */
        end_vertex = 4,
        /**
         * 自定义片段着色器类型
         * * 设定了这个字段的着色器之后就只会使用设定的着色器进行渲染不会动态加入其它的着色器
         */
        custom_fragment = 5,
        /**
         * 片段着色器写入顺序: 0
         * * 自动写入 base_fs
         */
        /**
         * 片段着色器写入顺序: 1
         * * 无默认着色器片段
         * * 目前会添加的是
         */
        start_fragment = 6,
        /**
         * 片段着色器写入顺序: 2
         * * 解码 materialsource 数据
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 materialSource_fs 着色器片段
         * * 目前会添加的是
         */
        materialsource_fragment = 7,
        /**
         * 片段着色器写入顺序: 3
         * * 漫反射
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 diffuse_fs 着色器片段
         * * 目前会添加的是 color_fs
         */
        diffuse_fragment = 8,
        /**
         * 片段着色器写入顺序: 4
         * * 法线贴图
         * * 无默认着色器片段
         * * 目前会添加的是
         */
        normal_fragment = 9,
        /**
         * 片段着色器写入顺序: 5
         * * 阴影贴图渲染
         * * 无默认着色器片段
         * * 目前会添加的是 shadowMapping_fss
         */
        shadow_fragment = 10,
        /**
         * 片段着色器写入顺序: 6
         * * 灯光渲染
         * * 无默认着色器片段
         * * 目前会添加的是 lightingBase_fs、directLight_fs、pointLight_fs、spotLight_fs
         */
        lighting_fragment = 11,
        /**
         * 片段着色器写入顺序: 7
         * * 高光贴图
         * * 无默认着色器片段
         * * 目前会添加的是 specularMap_fs
         */
        specular_fragment = 12,
        /**
         * 片段着色器写入顺序: 最后
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 end_fs 着色器片段
         * * 目前会添加的是 colorPassEnd_fs、normalPassEnd_fs
         */
        end_fragment = 13
    }
}
declare namespace dou3d {
    /**
     * 3D 事件
     * @author wizardc
     */
    class Event3D extends dou.Event {
        static ENTER_FRAME: string;
        static EXIT_FRAME: string;
        static RESIZE: string;
        static TOUCH_BEGIN: string;
        static TOUCH_MOVE: string;
        static TOUCH_END: string;
        static dispatch(target: dou.IEventDispatcher, type: string, data?: any, cancelable?: boolean): boolean;
        initEvent(type: string, data?: any, cancelable?: boolean): void;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 欧拉旋转顺序
     * @author wizardc
     */
    const enum EulerOrder {
        XYZ = 1,
        XZY = 2,
        YXZ = 3,
        YZX = 4,
        ZXY = 5,
        ZYX = 6
    }
}
declare namespace dou3d {
    /**
     * 二维向量接口
     * @author wizardc
     */
    interface IVector2 {
        x: number;
        y: number;
    }
    /**
     * 二维向量
     * @author wizardc
     */
    class Vector2 implements IVector2, dou.ICacheable {
        static readonly ZERO: Readonly<Vector2>;
        static readonly ONE: Readonly<Vector2>;
        static readonly MINUS_ONE: Readonly<Vector2>;
        /**
         * 获取距离
         */
        static distance(v1: IVector2, v2: IVector2): number;
        /**
         * 根据长度和角度获取一个向量
         * - 弧度制
         */
        static polar(length: number, angle: number, result?: IVector2): IVector2;
        /**
         * 判断两条直线是否相交
         * @param line1Point1 直线 1 上的任意一点
         * @param line1Point2 直线 1 上的任意一点
         * @param line2Point1 直线 2 上的任意一点
         * @param line2Point2 直线 2 上的任意一点
         * @param intersectionPoint 如果传入且相交则会保存交点的位置
         * @returns 是否相交
         * @tutorial https://github.com/thelonious/js-intersections/blob/master/src/intersection/Intersection.js
         */
        static intersection(line1Point1: IVector2, line1Point2: IVector2, line2Point1: IVector2, line2Point2: IVector2, intersectionPoint?: IVector2): boolean;
        /**
         * 线性插值
         */
        static lerp(from: IVector2, to: IVector2, t: number, result?: IVector2): IVector2;
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        readonly sqrtLength: number;
        readonly length: number;
        set(x: number, y: number): this;
        /**
         * 将该向量加上一个向量或将两个向量相加的结果写入该向量
         * - v += v1
         * - v = v1 + v2
         */
        add(v1: IVector2, v2?: IVector2): this;
        /**
         * 将该向量减去一个向量或将两个向量相减的结果写入该向量
         * - v -= v1
         * - v = v1 - v2
         */
        subtract(v1: IVector2, v2?: IVector2): this;
        /**
         * 将该向量乘上一个向量或将两个向量相乘的结果写入该向量
         * - v *= v1
         * - v = v1 * v2
         */
        multiply(v1: IVector2, v2?: IVector2): this;
        /**
         * 将该向量加上一个标量或将输入向量与标量相加的结果写入该向量
         * - v += scalar
         * - v = input + scalar
         */
        addScalar(scalar: number, input?: IVector2): this;
        /**
         * 将该向量乘上一个标量或将输入向量与标量相乘的结果写入该向量
         * - v *= scalar
         * - v = input * scalar
         */
        multiplyScalar(scalar: number, input?: IVector2): this;
        /**
         * 计算该向量与另一个向量的点积
         * - v · vector
         */
        dot(vector: IVector2): number;
        /**
         * 获取一个向量和该向量的夹角
         * - 弧度制
         */
        getAngle(vector: IVector2): number;
        /**
         * 叉乘
         */
        cross(vector: IVector2): number;
        /**
         * 归一化该向量或传入的向量
         * - v /= v.length
         */
        normalize(input?: IVector2): this;
        equal(vector: IVector2, threshold?: number): boolean;
        copy(value: IVector2): this;
        clone(): IVector2;
        clear(): this;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 三维向量接口
     * @author wizardc
     */
    interface IVector3 extends IVector2 {
        z: number;
    }
    /**
     * 三维向量
     * @author wizardc
     */
    class Vector3 implements IVector3, dou.ICacheable {
        /**
         * 零向量
         */
        static readonly ZERO: Readonly<Vector3>;
        /**
         * 三方向均为一的向量
         */
        static readonly ONE: Readonly<Vector3>;
        /**
         * 三方向均为负一的向量
         */
        static readonly MINUS_ONE: Readonly<Vector3>;
        /**
         * 上向量
         */
        static readonly UP: Readonly<Vector3>;
        /**
         * 下向量
         */
        static readonly DOWN: Readonly<Vector3>;
        /**
         * 左向量
         */
        static readonly LEFT: Readonly<Vector3>;
        /**
         * 右向量
         */
        static readonly RIGHT: Readonly<Vector3>;
        /**
         * 前向量
         */
        static readonly FORWARD: Readonly<Vector3>;
        /**
         * 后向量
         */
        static readonly BACK: Readonly<Vector3>;
        /**
         * 获取距离
         */
        static getDistance(v1: IVector3, v2: IVector3): number;
        /**
         * 判断两条直线是否相交
         * @param line1Point 直线 1 上的任意一点
         * @param line1Orientation 直线 1 的方向
         * @param line2Point 直线 2 上的任意一点
         * @param line2Orientation 直线 2 的方向
         * @param intersectionPoint 如果传入且相交则会保存交点的位置
         * @returns 是否相交
         * @tutorial https://blog.csdn.net/xdedzl/article/details/86009147
         */
        static intersection(line1Point: Vector3, line1Orientation: Vector3, line2Point: Vector3, line2Orientation: Vector3, intersectionPoint?: Vector3): boolean;
        /**
         * 线性插值
         */
        static lerp(from: IVector3, to: IVector3, t: number, result?: IVector3): IVector3;
        /**
         * 球形插值
         */
        static slerp(from: Vector3, to: Vector3, t: number, result?: Vector3): IVector3;
        x: number;
        y: number;
        z: number;
        constructor(x?: number, y?: number, z?: number);
        readonly squaredLength: number;
        readonly length: number;
        set(x: number, y: number, z: number): this;
        /**
         * 将该向量或传入向量加上一个标量
         * - v += scalar
         * - v = input + scalar
         */
        addScalar(scalar: number, input?: IVector3): this;
        /**
         * 将该向量或传入向量乘以一个标量
         * - v *= scalar
         * - v = input * scalar
         */
        multiplyScalar(scalar: number, input?: IVector3): this;
        /**
         * 将该向量加上一个向量或将两个向量相加的结果写入该向量
         * - v += v1
         * - v = v1 + v2
         */
        add(v1: IVector3, v2?: IVector3): this;
        /**
         * 将该向量减去一个向量或将两个向量相减的结果写入该向量
         * - v -= v1
         * - v = v1 - v2
         */
        subtract(v1: IVector3, v2?: IVector3): this;
        /**
         * 将该向量乘以一个向量或将两个向量相乘的结果写入该向量
         * - v *= v1
         * - v = v1 * v2
         */
        multiply(v1: IVector3, v2?: IVector3): this;
        /**
         * 将该向量除以一个向量或将两个向量相除的结果写入该向量
         * -  v /= v1
         * -  v = v1 / v2
         */
        divide(v1: IVector3, v2?: IVector3): this;
        /**
         * 计算该向量与另一个向量的点积
         * - v · vector
         */
        dot(vector: IVector3): number;
        /**
         * 获取一个向量和该向量的夹角
         * - 弧度制
         */
        getAngle(vector: Vector3): number;
        /**
         * 将该向量叉乘一个向量或将两个向量叉乘的结果写入该向量
         * - v ×= vector
         * - v = vectorA × vectorB
         */
        cross(v1: IVector3, v2?: IVector3): this;
        /**
         * 沿着一个法线向量反射该向量或传入向量
         * - 假设法线已被归一化
         */
        reflect(normal: IVector3, input?: Vector3): this;
        /**
         * 获取一点到该点的直线距离的平方
         */
        getSquaredDistance(point: IVector3): number;
        /**
         * 获取一点到该点的直线距离
         */
        getPointDistance(point: IVector3): number;
        /**
         * 通过一个球面坐标设置该向量
         * @param radius 球面半径
         * @param phi 相对于 Y 轴的极角
         * @param theta 围绕 Y 轴的赤道角
         */
        fromSphericalCoords(radius: number, phi?: number, theta?: number): this;
        /**
         * 将该向量或传入向量乘以一个 3x3 矩阵
         * - v *= matrix
         */
        applyMatrix3(matrix: Matrix3 | Matrix4, input?: IVector3): this;
        /**
         * 将该向量或传入向量乘以一个 4x4 矩阵
         * - v *= matrix
         */
        applyMatrix(matrix: Matrix4, input?: IVector3): this;
        /**
         * 将该向量或传入向量乘以一个矩阵
         * - v *= matrix
         * - 矩阵的平移数据不会影响向量
         * - 结果被归一化
         */
        applyDirection(matrix: Matrix4, input?: IVector3): this;
        /**
         * 将该向量或传入向量乘以一个四元数
         * - v *= quaternion
         * - v = input * quaternion
         */
        applyQuaternion(quaternion: IVector4, input?: IVector3): this;
        /**
         * 归一化该向量或传入的向量
         * - v /= v.length
         */
        normalize(input?: IVector3): this;
        /**
         * 归一化该向量，并使该向量垂直于自身或输入向量
         */
        orthoNormal(input?: IVector3): this;
        /**
         * 反转该向量或传入的向量
         */
        negate(input?: IVector3): this;
        equal(vector: IVector3, threshold?: number): boolean;
        fromArray(array: number[] | Float32Array, offset?: number): this;
        fromMatrixPosition(matrix: Matrix4): this;
        fromMatrixColumn(matrix: Matrix4, index: 0 | 1 | 2): this;
        toArray(array?: number[], offset?: number): number[];
        copy(value: IVector3): this;
        clone(): Vector3;
        clear(): this;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 四维向量接口
     * @author wizardc
     */
    interface IVector4 extends IVector3 {
        w: number;
    }
    /**
     * 四维向量
     * @author wizardc
     */
    class Vector4 implements IVector4, dou.ICacheable {
        /**
         * 线性插值
         */
        static lerp(from: IVector4, to: IVector4, t: number, result?: IVector4): IVector4;
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        readonly squaredLength: number;
        readonly length: number;
        set(x: number, y: number, z: number, w: number): this;
        /**
         * 将该向量或传入向量乘以一个标量
         * - v *= scalar
         * - v = input * scalar
         */
        multiplyScalar(scalar: number, input?: IVector4): this;
        /**
         * 计算该向量与另一个向量的点积
         * - v · vector
         */
        dot(vector: IVector4): number;
        /**
         * 反转该向量或传入的向量
         */
        inverse(input?: IVector4): this;
        /**
         * 归一化该向量或传入的向量
         * - v /= v.length
         */
        normalize(input?: IVector4): this;
        equal(value: IVector4, threshold?: number): boolean;
        fromArray(value: number[], offset?: number): this;
        toArray(array?: number[], offset?: number): number[];
        copy(value: IVector4): this;
        clone(): IVector4;
        clear(): this;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 四元数
     * @author wizardc
     */
    class Quaternion extends Vector4 {
        /**
         * 恒等四元数
         */
        static readonly IDENTITY: Readonly<Quaternion>;
        /**
         * 线性插值
         */
        static lerp(from: Quaternion, to: Quaternion, t: number, result?: Quaternion): Quaternion;
        /**
         * 球形插值
         * @tutorial http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
         */
        static slerp(from: Quaternion, to: Quaternion, t: number, result?: Quaternion): Quaternion;
        /**
         * 通过旋转矩阵设置该四元数
         * - 旋转矩阵不应包含缩放值
         * @tutorial http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
         */
        fromMatrix(rotateMatrix: Matrix4): this;
        /**
         * 通过欧拉旋转 (弧度制) 设置该四元数
         * @tutorial http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
         */
        fromEuler(x: number, y: number, z: number, order?: EulerOrder): this;
        /**
         * 通过旋转轴设置该四元数
         * - 假设旋转轴已被归一化
         * @param axis 旋转轴
         * @param angle 旋转角 (弧度制)
         * @tutorial http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
         */
        fromAxis(axis: IVector3, angle: number): this;
        /**
         * 通过自起始方向到目标方向的旋转值设置该四元数
         * - 假设方向向量已被归一化
         */
        fromVectors(from: Vector3, to: IVector3): this;
        /**
         * 将该四元数转换为欧拉旋转 (弧度制)
         */
        toEuler(out?: IVector3, order?: EulerOrder): IVector3;
        /**
         * 将该四元数乘以一个四元数或将两个四元数相乘的结果写入该四元数
         * - v *= q1
         * - v = q1 * q2
         * @tutorial http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
         */
        multiply(q1: Quaternion, q2?: Quaternion): this;
        /**
         * 旋转指定点
         */
        transformVector(vector: IVector3, result?: IVector3): IVector3;
        /**
         * 设置该四元数, 使其与起始点到目标点的方向相一致
         */
        lookAt(from: IVector3, to: IVector3, up: IVector3): this;
        /**
         * 设置该四元数, 使其与目标方向相一致
         */
        lookRotation(vector: IVector3, up: IVector3): this;
        /**
         * 获取该四元数和一个四元数的夹角 (弧度制)
         */
        getAngle(value: Quaternion): number;
        /**
         * 将该四元数转换为恒等四元数
         */
        identity(): this;
        clone(): Quaternion;
    }
}
declare namespace dou3d {
    /**
     * 3×3 矩阵
     * @author wizardc
     */
    class Matrix3 implements dou.ICacheable {
        /**
         * 一个静态的恒等矩阵
         */
        static readonly IDENTITY: Readonly<Matrix3>;
        readonly rawData: Float32Array;
        constructor(rawData?: number[], offsetOrByteOffset?: number);
        /**
         * 当前矩阵行列式的值
         */
        readonly determinant: number;
        set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): this;
        getNormalMatrix(matrix4: Matrix4): this;
        /**
         * 反转当前矩阵或传入的矩阵
         */
        inverse(input?: Matrix3): this;
        /**
         * 转置矩阵
         */
        transpose(): this;
        /**
         * 将该矩阵乘以一个矩阵或将两个矩阵相乘的结果写入该矩阵
         * - v *= matrix
         * - v = matrixA * matrixB
         */
        multiply(matrixA: Readonly<Matrix3>, matrixB?: Readonly<Matrix3>): this;
        fromArray(value: number[] | Float32Array, offset?: number): this;
        fromBuffer(value: ArrayBuffer, byteOffset?: number): this;
        fromScale(vector: IVector3): this;
        /**
         * 通过 UV 变换设置该矩阵
         * @param offsetX 水平偏移
         * @param offsetY 垂直偏移
         * @param repeatX 水平重复
         * @param repeatY 垂直重复
         * @param rotation 旋转 (弧度制)
         * @param pivotX 水平中心
         * @param pivotY 垂直中心
         */
        fromUVTransform(offsetX: number, offsetY: number, repeatX: number, repeatY: number, rotation?: number, pivotX?: number, pivotY?: number): this;
        fromMatrix4(value: Matrix4): this;
        toArray(array?: number[], offset?: number): number[];
        copy(value: Readonly<Matrix3>): this;
        clone(): Matrix3;
        identity(): this;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 4x4 矩阵
     * 表示一个转换矩阵, 该矩阵确定三维显示对象的位置和方向
     * 该矩阵可以执行转换功能, 包括平移 (沿 x, y 和 z 轴重新定位), 旋转和缩放 (调整大小)
     * 该类还可以执行透视投影, 这会将 3D 坐标空间中的点映射到二维视图
     * ```
     *  ---                                   ---
     *  |   scaleX      0         0       0     |   x轴
     *  |     0       scaleY      0       0     |   y轴
     *  |     0         0       scaleZ    0     |   z轴
     *  |     tx        ty        tz      tw    |   平移
     *  ---                                   ---
     *
     *  ---                                   ---
     *  |     0         1         2        3    |   x轴
     *  |     4         5         6        7    |   y轴
     *  |     8         9         10       11   |   z轴
     *  |     12        13        14       15   |   平移
     *  ---                                   ---
     * ```
     * @author wizardc
     */
    class Matrix4 implements dou.ICacheable {
        /**
         * 一个静态的恒等矩阵
         */
        static readonly IDENTITY: Readonly<Matrix4>;
        /**
         * 线性插值
         */
        static lerp(from: Matrix4, to: Matrix4, t: number, result?: Matrix4): Matrix4;
        readonly rawData: Float32Array;
        constructor(rawData?: number[], offsetOrByteOffset?: number);
        /**
         * 获取该矩阵的行列式
         * @tutorial https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js
         */
        readonly determinant: number;
        /**
         * 获取该矩阵的最大缩放值
         */
        readonly maxScaleOnAxis: number;
        set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): this;
        /**
         * 前方 (+Z轴方向)
         */
        forward(result?: Vector3): Vector3;
        /**
         * 上方 (+y轴方向)
         */
        up(result?: Vector3): IVector3;
        /**
         * 右方 (+x轴方向)
         */
        right(result?: Vector3): IVector3;
        /**
         * 后方 (-z轴方向)
         */
        back(result?: Vector3): IVector3;
        /**
         * 下方 (-y轴方向)
         */
        down(result?: Vector3): IVector3;
        /**
         * 左方 (-x轴方向)
         */
        left(result?: Vector3): IVector3;
        private copyColumnTo;
        /**
         * 通过平移向量、四元数旋转、缩放向量设置该矩阵
         * @param translation 平移向量
         * @param rotation 四元数旋转
         * @param scale 缩放向量
         */
        compose(translation: IVector3, rotation: IVector4, scale: IVector3): this;
        /**
         * 将该矩阵分解为平移向量、四元数旋转、缩放向量
         * @param translation 平移向量
         * @param rotation 四元数旋转
         * @param scale 缩放向量
         */
        decompose(translation?: IVector3, rotation?: Quaternion, scale?: IVector3): this;
        /**
         * 提取该矩阵的旋转分量或提取传入矩阵的旋转分量写入该矩阵
         */
        extractRotation(input?: Matrix4): this;
        /**
         * 转置该矩阵或将传入矩阵转置的结果写入该矩阵
         */
        transpose(input?: Matrix4): this;
        /**
         * 将该矩阵求逆或将传入矩阵的逆矩阵写入该矩阵
         */
        inverse(input?: Matrix4): this;
        /**
         * 将该矩阵乘以一个标量或将传入矩阵与一个标量相乘的结果写入该矩阵
         * - v *= scaler
         */
        multiplyScalar(scalar: number, input?: Matrix4): this;
        /**
         * 将该矩阵乘以一个矩阵或将两个矩阵相乘的结果写入该矩阵
         * - v *= matrix
         * - v = matrixA * matrixB
         */
        multiply(matrixA: Matrix4, matrixB?: Matrix4): this;
        /**
         * 将该矩阵乘以一个矩阵来之后前置一个矩阵或将两个矩阵相乘来前置一个矩阵的结果写入该矩阵
         */
        append(matrixA: Matrix4, matrixB?: Matrix4): this;
        /**
         * 转换指定点
         */
        transformVector(vector: IVector3, result?: IVector4): IVector4;
        /**
         * 根据投影参数设置该矩阵
         * @param offsetX 投影近平面水平偏移
         * @param offsetY 投影远平面垂直偏移
         * @param near 投影近平面
         * @param far 投影远平面
         * @param fov 投影视角
         * - 透视投影时生效
         * @param size 投影尺寸
         * - 正交投影时生效
         * @param opvalue 透视投影和正交投影的插值系数
         * - `0.0` ~ `1.0`
         * - `0.0` 正交投影
         * - `1.0` 透视投影
         * @param asp 投影宽高比
         * @param matchFactor 宽高适配的插值系数
         * - `0.0` ~ `1.0`
         * - `0.0` 以宽适配
         * - `1.0` 以高适配
         */
        fromProjection(near: number, far: number, fov: number, size: number, opvalue: number, asp: number, matchFactor: number, viewport?: Rectangle): this;
        /**
         * 透视矩阵
         */
        perspectiveProjectMatrix(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
        /**
         * 正交矩阵
         */
        orthographicProjectMatrix(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
        /**
         * 设置该矩阵, 使其 Z 轴正方向与起始点到目标点的方向相一致
         * - 矩阵的缩放值将被覆盖
         * @param from 起始点
         * @param to 目标点
         * @param up
         */
        lookAt(from: IVector3, to: IVector3, up: IVector3): this;
        /**
         * 设置该矩阵, 使其 Z 轴正方向与目标方向相一致
         * - 矩阵的缩放值将被覆盖
         * @param vector 目标方向
         * @param up
         */
        lookRotation(vector: IVector3, up: IVector3): this;
        fromArray(array: number[] | Float32Array, offset?: number): this;
        fromBuffer(buffer: ArrayBuffer, byteOffset?: number): this;
        /**
         * 通过平移向量设置该矩阵
         * @param translate 平移向量
         * @param rotationAndScaleStays 是否保留该矩阵的旋转数据
         */
        fromTranslate(translate: IVector3, rotationAndScaleStays?: boolean): this;
        /**
         * 通过四元数旋转设置该矩阵
         * @param rotation 四元数旋转
         * @param translateStays 是否保留该矩阵的平移数据
         */
        fromRotation(rotation: IVector4, translateStays?: boolean): this;
        /**
         * 通过欧拉旋转设置该矩阵
         * @param euler 欧拉旋转
         * @param order 欧拉旋转顺序
         * @param translateStays 是否保留该矩阵的平移数据
         * @tutorial http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
         */
        fromEuler(euler: IVector3, order?: EulerOrder, translateStays?: boolean): this;
        /**
         * 通过缩放向量设置该矩阵
         * @param scale 缩放向量
         * @param translateStays 是否保留该矩阵的平移数据
         */
        fromScale(scale: IVector3, translateStays?: boolean): this;
        /**
         * 通过绕 X 轴的旋转角度设置该矩阵
         * @param angle 旋转角
         * - 弧度制
         */
        fromRotationX(angle: number): this;
        /**
         * 通过绕 Y 轴的旋转角度设置该矩阵
         * @param angle 旋转角
         * - 弧度制
         */
        fromRotationY(angle: number): this;
        /**
         * 通过绕 Z 轴的旋转角度设置该矩阵
         * @param angle 旋转角
         * - 弧度制
         */
        fromRotationZ(angle: number): this;
        /**
         * 通过旋转轴设置该矩阵
         * - 假设旋转轴已被归一化
         * @param axis 旋转轴
         * @param angle 旋转角
         * - 弧度制
         * @tutorial http://www.gamedev.net/reference/articles/article1199.asp
         */
        fromAxis(axis: IVector3, angle: number): this;
        /**
         * 通过 X、Y、Z 轴设置该矩阵
         */
        fromAxises(axisX: IVector3, axisY: IVector3, axisZ: IVector3): this;
        toArray(array?: number[], offset?: number): number[];
        /**
         * 将该旋转矩阵转换为欧拉旋转
         * - 弧度制
         */
        toEuler(order?: EulerOrder, result?: IVector3): IVector3;
        copy(target: Matrix4): this;
        clone(): Matrix4;
        identity(): this;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 尺寸接口
     * @author wizardc
     */
    interface ISize {
        w: number;
        h: number;
    }
    /**
     * 矩形接口
     * @author wizardc
     */
    interface IRectangle extends IVector2, ISize {
    }
    /**
     * 矩形
     * @author wizardc
     */
    class Rectangle implements IRectangle, dou.ICacheable {
        x: number;
        y: number;
        w: number;
        h: number;
        constructor(x?: number, y?: number, w?: number, h?: number);
        set(x: number, y: number, w: number, h: number): this;
        contains(target: IVector2 | Rectangle): boolean;
        multiplyScalar(scalar: number, input?: Readonly<IRectangle>): this;
        copy(value: Readonly<IRectangle>): this;
        clone(): Rectangle;
        clear(): this;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 几何平面
     * @author wizardc
     */
    class Plane implements IRaycast, dou.ICacheable {
        static UP: Readonly<Plane>;
        static DOWN: Readonly<Plane>;
        static LEFT: Readonly<Plane>;
        static RIGHT: Readonly<Plane>;
        static FORWARD: Readonly<Plane>;
        static BACK: Readonly<Plane>;
        /**
         * 平面的法线
         */
        readonly normal: Vector3;
        /**
         * 二维平面到原点的距离
         */
        constant: number;
        constructor(normal: IVector3, constant?: number);
        set(normal: Readonly<IVector3>, constant?: number): this;
        getDistance(point: IVector3): number;
        normalize(input?: Plane): this;
        negate(input?: Plane): this;
        getProjectionPoint(point: IVector3, result?: Vector3): Vector3;
        getCoplanarPoint(result?: Vector3): Vector3;
        applyMatrix(matrix: Matrix4, normalMatrix?: Matrix3): this;
        raycast(ray: Ray, raycastInfo?: RaycastInfo): boolean;
        fromArray(array: number[], offset?: number): this;
        fromPoint(point: IVector3, normal?: IVector3): this;
        fromPoints(point1: IVector3, point2: IVector3, point3: IVector3): this;
        toArray(array?: number[], offset?: number): number[];
        copy(value: Plane): this;
        clone(): Plane;
        clear(): this;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 射线
     * @author wizardc
     */
    class Ray implements dou.ICacheable {
        /**
         * 射线的起点
         */
        readonly origin: Vector3;
        /**
         * 射线的方向
         */
        readonly direction: Vector3;
        constructor(origin?: IVector3, direction?: IVector3);
        set(origin: IVector3, direction: IVector3): this;
        /**
         * 将该射线乘以一个矩阵或将输入射线与一个矩阵相乘的结果写入该射线
         * - v *= matrix
         * - v = input * matrix
         */
        applyMatrix(matrix: Matrix4, input?: Ray): this;
        /**
         * 获取一个点到该射线的最近点
         */
        getClosestPointToPoint(point: IVector3, result?: Vector3): Vector3;
        /**
         * 获取从该射线的起点沿着射线方向移动一段距离的一个点
         * - out = ray.origin + ray.direction * distanceDelta
         */
        getPointAt(distanceDelta: number, result?: Vector3): Vector3;
        /**
         * 获取一个点到该射线的最近距离的平方
         */
        getSquaredDistance(point: IVector3): number;
        /**
         * 获取一个点到该射线的最近距离
         */
        getDistance(point: IVector3): number;
        /**
         * 获取该射线起点到一个平面的最近距离
         * - 如果射线并不与平面相交，则返回 -1
         */
        getDistanceToPlane(plane: Plane): number;
        fromArray(value: number[], offset?: number): this;
        /**
         * 设置该射线，使其从起点出发，经过终点
         */
        fromPoints(from: IVector3, to: IVector3): this;
        copy(value: Readonly<Ray>): this;
        clone(): Ray;
        clear(): this;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 射线检测接口
     * @author wizardc
     */
    interface IRaycast {
        /**
         * 射线检测
         * @param ray 射线
         * @param raycastInfo 将检测的详细数据写入的对象
         * @returns 是否和射线相交
         */
        raycast(ray: Ray, raycastInfo?: RaycastInfo): boolean;
    }
}
declare namespace dou3d {
    /**
     * 射线检测信息
     * @author wizardc
     */
    class RaycastInfo implements dou.ICacheable {
        /**
         * 交点到射线起始点的距离
         * - 如果未相交则为 -1
         */
        distance: number;
        /**
         * 相交的点
         */
        readonly position: Vector3;
        /**
         * 三角形或几何面相交的 UV 坐标
         */
        readonly coord: Vector2;
        /**
         * 相交的法线向量
         * - 设置该值将会在检测时计算相交的法线向量, 并将结果写入该值
         */
        normal: Vector3;
        copy(value: RaycastInfo): this;
        clear(): this;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 颜色接口
     * @author wizardc
     */
    interface IColor {
        r: number;
        g: number;
        b: number;
        a: number;
    }
    /**
     * 颜色
     * @author wizardc
     */
    class Color implements IColor, dou.ICacheable {
        /**
         * 所有颜色通道均为零的颜色
         */
        static readonly ZERO: Readonly<Color>;
        /**
         * 黑色
         */
        static readonly BLACK: Readonly<Color>;
        /**
         * 灰色
         */
        static readonly GRAY: Readonly<Color>;
        /**
         * 白色
         */
        static readonly WHITE: Readonly<Color>;
        /**
         * 红色
         */
        static readonly RED: Readonly<Color>;
        /**
         * 绿色
         */
        static readonly GREEN: Readonly<Color>;
        /**
         * 蓝色
         */
        static readonly BLUE: Readonly<Color>;
        /**
         * 黄色
         */
        static readonly YELLOW: Readonly<Color>;
        /**
         * 靛蓝色
         */
        static readonly INDIGO: Readonly<Color>;
        /**
         * 紫色
         */
        static readonly PURPLE: Readonly<Color>;
        /**
         * 线性插值
         */
        static lerp(from: IColor, to: IColor, t: number, result?: Color): Color;
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(r?: number, g?: number, b?: number, a?: number);
        set(r: number, g: number, b: number, a?: number): this;
        /**
         * 将该颜色乘以一个颜色或将两个颜色相乘的结果写入该颜色
         * - v *= color
         * - v = colorA * colorB
         */
        multiply(colorA: IColor, colorB?: IColor): this;
        scale(scalar: number, input?: IColor): this;
        fromArray(value: ArrayLike<number>, offset?: number): this;
        fromHex(hex: number): this;
        copy(value: IColor): this;
        clone(): Color;
        clear(): this;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 颜色转换类
     * @author wizardc
     */
    class ColorTransform implements dou.ICacheable {
        private _matrix;
        private _alpha;
        constructor();
        readonly matrix: Matrix4;
        alpha: number;
        /**
         * 设置颜色, 不包含 alpha
         */
        setColor(value: number): void;
        multiply(colorTransform: ColorTransform): void;
        scale(r?: number, g?: number, b?: number, a?: number): void;
        offset(r?: number, g?: number, b?: number, a?: number): void;
        /**
         * 置灰
         */
        gray(): void;
        clear(): void;
        onRecycle(): void;
    }
}
declare namespace dou3d {
    /**
     * 贝塞尔曲线
     * 目前定义了三种:
     * - 线性贝塞尔曲线 (两个点形成)
     * - 二次方贝塞尔曲线 (三个点形成)
     * - 三次方贝塞尔曲线 (四个点形成)
     * @author wizardc
     */
    class Curve3 {
        /**
         * 线性贝塞尔曲线
         */
        static createLinearBezier(point1: Vector3, point2: Vector3, bezierPointNum: number): Curve3;
        /**
         * 二次方贝塞尔曲线路径
         */
        static createQuadraticBezier(point1: Vector3, point2: Vector3, point3: Vector3, bezierPointNum: number): Curve3;
        /**
         * 三次方贝塞尔曲线路径
         */
        static createCubicBezier(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3, bezierPointNum: number): Curve3;
        /**
         * 贝塞尔曲线上的点，不包含第一个点
         */
        beizerPoints: Vector3[];
        /**
         * 贝塞尔曲线上所有的个数
         */
        bezierPointNum: number;
        constructor(beizerPoints: Vector3[], bezierPointNum: number);
    }
}
declare namespace dou3d {
    /**
     * 几何形状
     * * 注意: 当使用 vertexArray 或 indexArray 必须先设置 vertexCount 或 indexCount
     * @author wizardc
     */
    class Geometry extends Reference {
        /**
         * 顶点坐标大小
         */
        static readonly positionSize: number;
        /**
         * 顶点法线大小
         */
        static readonly normalSize: number;
        /**
         * 顶点切线大小
         */
        static readonly tangentSize: number;
        /**
         * 顶点色大小
         */
        static readonly colorSize: number;
        /**
         * 顶点uv大小
         */
        static readonly uvSize: number;
        /**
         * 顶点uv2大小
         */
        static readonly uv2Size: number;
        /**
         * 顶点uv2大小
         */
        static readonly skinSize: number;
        /**
         * 绘制类型
         */
        drawType: number;
        /**
         * 顶点格式
         */
        private _vertexFormat;
        /**
         * 顶点属性长度
         */
        vertexAttLength: number;
        /**
         * 顶点数据
         */
        vertexArray: Float32Array;
        /**
         * 索引数据
         */
        indexArray: Uint16Array;
        /**
         * shader buffer
         */
        sharedVertexBuffer: VertexBuffer3D;
        /**
         * shader index
         */
        sharedIndexBuffer: IndexBuffer3D;
        /**
         * 顶点字节数
         */
        vertexSizeInBytes: number;
        /**
         * 面翻转，仅对系统 geometry 有效
         */
        faceOrBack: boolean;
        /**
         * geometry子集
         */
        subGeometrys: SubGeometry[];
        /**
         * buffer 需要重新提交的时候
         */
        private _bufferDiry;
        /**
         * 顶点的数量
         */
        private _vertexCount;
        /**
         * 索引数量
         */
        private _indexCount;
        /**
         * 当前索引数量的最大值
         */
        private _totalIndexCount;
        /**
         * 三角形面数
         */
        _faceCount: number;
        private _skeleton;
        /**
         * 骨骼动画会上传到 GPU 的数据
         */
        skeletonGPUData: Float32Array;
        bufferDiry: boolean;
        /**
         * 设置顶点的数量
         * * 同时 this.vertexArray = new Float32Array(this.vertexAttLength * this.vertexCount);
         */
        vertexCount: number;
        /**
         * 索引的数量
         */
        /**
        * 设置索引的数量
        * * 同时 this.indexArray = new Uint16Array(this._indexCount);
        */
        indexCount: number;
        /**
         * 模型面数
         */
        faceCount: number;
        /**
         * 定义顶点数据结构
         * * 设置后, 就会增加这样的数据顶点数据结构, 如果源文件中没有这样的数据结构就会通过计算的方式计算补全, 不能计算的就默认为 0
         * @param vertexFormat 需要定义的顶点格式类型 VertexFormat.VF_COLOR | VertexFormat.VF_UV1
         * @example this.vertexFormat = VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_COLOR |  VertexFormat.VF_UV0 | VertexFormat.VF_UV1; //定义了一个完整的数据结构
         */
        vertexFormat: number;
        /**
         * 当前模型的骨骼
         */
        skeleton: Skeleton;
        /**
         * 由顶点索引根据格式拿到顶点数据
         * @param index 顶点索引
         * @param vf 得到顶点的需要的数据格式
         * @param target 获取的数据
         * @param count 得到顶点个数, 默认一个
         * @returns 获取的数据
         */
        getVertexForIndex(index: number, vf: VertexFormat, target?: number[], count?: number): number[];
        /**
         * 由顶点索引根据格式设置顶点数据
         * @param index 顶点索引
         * @param vf 设置顶点的需要的数据格式
         * @param src 设置的数据
         * @param vertexCount 设置的顶点数量
         */
        setVerticesForIndex(index: number, vf: VertexFormat, src: number[], vertexCount?: number): void;
        /**
         * 获取顶点索引数据
         * @param start 数据开始位置
         * @param count 需要的索引数据, 默认参数为 -1, 如果为 -1 那么取从 start 后面的所有索引数据
         * @param target 获取的数据
         * @returns 获取的数据
         */
        getVertexIndices(start: number, count?: number, target?: number[]): number[];
        /**
         * 设置顶点索引数据
         * @param start 数据开始位置
         * @param indices 数据
         */
        setVertexIndices(start: number, indices: number[]): void;
        activeState(context3DProxy: Context3DProxy): void;
        /**
         * 提交顶点数据, 如果顶点数据有变化的话, 需要调用此函数重新提交
         */
        upload(context3DProxy: Context3DProxy, drawType?: number): void;
        buildDefaultSubGeometry(): void;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 表示几何形状子集, 不同的子集渲染时使用的材质会不同, 这样就可以用不同的材质来共用相同的 geometry buffer
     * @author wizardc
     */
    class SubGeometry {
        private _useVertexAttributeList;
        /**
         * 顶点索引
         */
        start: number;
        /**
         * 顶点数量
         */
        count: number;
        /**
         * 材质ID
         */
        matID: number;
        /**
         * 属于的几何体对象
         */
        geometry: Geometry;
        /**
         * 材质球的漫反射贴图
         */
        textureDiffuse: string;
        /**
         * 材质球的凹凸法线贴图
         */
        textureNormal: string;
        /**
         * 材质球的高光贴图
         */
        textureSpecular: string;
        preAttList: Attribute[];
        activeState(passUsage: PassUsage, contextProxy: Context3DProxy): void;
        upload(passUsage: PassUsage, contextPorxy: Context3DProxy): void;
    }
}
declare namespace dou3d {
    /**
     * 立方体
     * @author wizardc
     */
    class CubeGeometry extends Geometry {
        private _width;
        private _height;
        private _depth;
        constructor(width?: number, height?: number, depth?: number);
        readonly width: number;
        readonly height: number;
        readonly depth: number;
        buildGeomtry(front: boolean): void;
    }
}
declare namespace dou3d {
    /**
     * 圆柱体
     * @author wizardc
     */
    class CylinderGeometry extends Geometry {
        private _height;
        private _radius;
        constructor(height?: number, radius?: number);
        readonly height: number;
        readonly radius: number;
        buildGeomtry(): void;
    }
}
declare namespace dou3d {
    /**
     * 平面
     * @author wizardc
     */
    class PlaneGeometry extends Geometry {
        private _wCenter;
        private _hCenter;
        private _segmentsW;
        private _segmentsH;
        private _width;
        private _height;
        private _scaleU;
        private _scaleV;
        constructor(width?: number, height?: number, segmentsW?: number, segmentsH?: number, uScale?: number, vScale?: number, wCenter?: boolean, hCenter?: boolean);
        readonly segmentsW: number;
        readonly segmentsH: number;
        readonly width: number;
        readonly height: number;
        readonly scaleU: number;
        readonly scaleV: number;
        private buildGeometry;
    }
}
declare namespace dou3d {
    /**
     * 球体
     * @author wizardc
     */
    class SphereGeometry extends Geometry {
        private _segmentsW;
        private _radius;
        private _segmentsH;
        constructor(r?: number, segmentsW?: number, segmentsH?: number);
        readonly segmentsW: number;
        readonly segmentsH: number;
        readonly radius: number;
        private buildSphere;
    }
}
declare namespace dou3d {
    /**
     * 几何体创建器
     * @author wizardc
     */
    class GeometryCreator {
        /**
         * 构建几何体
         */
        static buildGeomtry(source: GeometryCreator, vertexFormat: number): Geometry;
        /**
         * 顶点属性长度
         */
        vertexAttLength: number;
        /**
         * 数据长度
         */
        length: number;
        /**
         * 顶点长度
         */
        vertLen: number;
        /**
         * 面数
         */
        faces: number;
        /**
         * 索引数据
         */
        source_indexData: number[];
        /**
         * 顶点数据
         */
        source_vertexData: number[];
        /**
         * 顶点色数据
         */
        source_vertexColorData: number[];
        /**
         * 顶点法线
         */
        source_normalData: number[];
        /**
         * 顶点切线数据
         */
        source_tangtData: number[];
        /**
         * 顶点uv数据
         */
        source_uvData: number[];
        /**
         * 顶点uv2数据
         */
        source_uv2Data: number[];
        /**
         * 蒙皮数据
         */
        source_skinData: number[];
        /**
         * 顶点索引
         */
        vertexIndex: number;
        /**
         * 索引数据数组
         */
        indices: number[];
        /**
         * 顶点数据数组(x、y、z)三个number为一个顶点数据
         */
        vertices: number[];
        /**
         * 法线数据数组(x、y、z)三个number为一个法线数据
         */
        normals: number[];
        /**
         * 切线数据数组(x、y、z)三个number为一个切线数据
         */
        tangts: number[];
        /**
         * 顶点颜色数据数组
         */
        verticesColor: number[];
        /**
         * 第一套UV数据数组
         */
        uvs: number[];
        /**
         * 第二套UV数据数组
         */
        uv2s: number[];
        /**
         * 蒙皮数据数组
         */
        skinMesh: number[];
        /**
         * 面法线数据数组
         */
        faceNormals: number[];
        /**
         * 面权重数据数组
         */
        faceWeights: number[];
        /**
         * 顶点索引数据
         */
        vertexIndices: number[];
        /**
         * uv索引数据
         */
        uvIndices: number[];
        /**
         * uv2索引数据
         */
        uv2Indices: number[];
        /**
         * 法线索引数据
         */
        normalIndices: number[];
        /**
         * 顶点色索引数据
         */
        colorIndices: number[];
        /**
         * 索引数据数组
         */
        indexIds: any[];
        skeleton: Skeleton;
        /**
         * 顶点数据数组
         */
        vertexDatas: number[];
        matCount: number;
        material: any;
    }
}
declare namespace dou3d {
    /**
     * 灯光基类
     * @author wizardc
     */
    abstract class LightBase extends ObjectContainer3D {
        protected _lightType: LightType;
        protected _color: number;
        protected _colorVec4: Vector4;
        protected _intensity: number;
        protected _direction: Vector3;
        protected _change: boolean;
        constructor();
        readonly lightType: LightType;
        /**
         * 灯光强度
         * * 影响灯光的强弱显示, 值的范围 0~没有上限, 但是值过大会导致画面过度曝光
         */
        intensity: number;
        /**
         * 灯光漫反射颜色
         * * 直接影响最终灯光的颜色色值
         */
        color: number;
        protected onTransformUpdate(): void;
        /**
         * 更新灯光数据
         */
        updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void;
    }
}
declare namespace dou3d {
    /**
     * 平行灯光
     * * 当前引擎中, 只有平行光可以产生阴影
     * @author wizardc
     */
    class DirectLight extends LightBase {
        /**
         * 光源数据结构长度
         */
        static readonly stride: number;
        constructor(color?: number);
        updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void;
    }
}
declare namespace dou3d {
    /**
     * 点光源
     * @author wizardc
     */
    class PointLight extends LightBase {
        /**
         * 光源数据结构长度
         */
        static readonly stride: number;
        private _radius;
        constructor(color?: number);
        /**
         * 灯光半径
         */
        radius: number;
        updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void;
    }
}
declare namespace dou3d {
    /**
     * 聚光灯
     * @author wizardc
     */
    class SpotLight extends LightBase {
        /**
         * 光源数据结构长度
         */
        static readonly stride: number;
        private _range;
        private _angle;
        private _penumbra;
        constructor(color?: number);
        /**
         * 光照范围
         */
        range: number;
        /**
         * 角度
         */
        angle: number;
        /**
         * 半影
         */
        penumbra: number;
        updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void;
    }
}
declare namespace dou3d {
    /**
     * 灯光组
     * @author wizardc
     */
    class LightGroup {
        private _lightNum;
        private _directList;
        private _spotList;
        private _pointList;
        constructor();
        /**
         * 灯光个数
         */
        readonly lightNum: number;
        /**
         * 方向光列表
         */
        readonly directList: DirectLight[];
        /**
         * 聚光灯列表
         */
        readonly spotList: SpotLight[];
        /**
         * 点光源列表
         */
        readonly pointList: PointLight[];
        addLight(light: LightBase): void;
        removeLight(light: LightBase): void;
    }
}
declare namespace dou3d {
    /**
     * 纹理贴图加载器
     * @author wizardc
     */
    class TextureAnalyzer implements dou.IAnalyzer {
        load(url: string, callback: (url: string, data: any) => void, thisObj: any): void;
        private createTexture;
        release(data: ImageTexture): boolean;
    }
}
declare namespace dou3d {
    /**
     * 自定义文件类型模型加载器
     * @author wizardc
     */
    class ESMAnalyzer implements dou.IAnalyzer {
        load(url: string, callback: (url: string, data: any) => void, thisObj: any): void;
        private createGeometry;
        parseVersion_1(bytes: dou.ByteArray, geomtry: GeometryCreator): void;
        parseVersion_2(bytes: dou.ByteArray, geomtry: GeometryCreator): void;
        parseVersion_3(bytes: dou.ByteArray, geomtry: GeometryCreator): void;
        release(data: ImageTexture): boolean;
    }
}
declare namespace dou3d {
    /**
     * 自定义文件类型骨骼动画加载器
     * @author wizardc
     */
    class EAMAnalyzer implements dou.IAnalyzer {
        load(url: string, callback: (url: string, data: any) => void, thisObj: any): void;
        private createClip;
        parseVersion_1(bytes: dou.ByteArray): SkeletonAnimationClip;
        parseVersion_2(bytes: dou.ByteArray): SkeletonAnimationClip;
        release(data: ImageTexture): boolean;
    }
}
declare namespace dou3d {
    /**
     * 材质渲染数据
     * @author wizardc
     */
    class MaterialData {
        /**
         * 着色器阶段记录表
         * 渲染通道类型 -> 着色器片段类型数组
         */
        shaderPhaseTypes: {
            [passType: number]: ShaderPhaseType[];
        };
        /**
         * 绘制模式
         */
        drawMode: number;
        /**
         * 是否开启 MipMap
         */
        useMipmap: boolean;
        /**
         * 阴影贴图
         */
        shadowMapTexture: TextureBase;
        /**
         * 漫反射贴图
         */
        diffuseTexture: TextureBase;
        /**
         * 立方体漫反射贴图
         */
        diffuseTexture3D: TextureBase;
        /**
         * 法线贴图
         */
        normalTexture: TextureBase;
        /**
         * 高光贴图
         */
        specularTexture: TextureBase;
        /**
         * 投射阴影
         */
        castShadow: boolean;
        /**
         * 接受阴影
         */
        acceptShadow: boolean;
        /**
         * 阴影颜色
         */
        shadowColor: Float32Array;
        /**
         * 深度测试
         */
        depthTest: boolean;
        /**
         * 深度测试模式
         */
        depthMode: number;
        /**
         * 混合模式
         */
        blendMode: BlendMode;
        /**
         * 混合 src 值
         */
        blendSrc: number;
        /**
         * 混合 dest 值
         */
        blendDest: number;
        /**
         * 透明混合
         */
        alphaBlending: boolean;
        /**
         * 环境光颜色
         */
        ambientColor: number;
        /**
         * 漫反射颜色
         */
        diffuseColor: number;
        /**
         * 高光颜色
         */
        specularColor: number;
        /**
         * 色相
         */
        tintColor: number;
        /**
         * 材质球的高光强度
         */
        specularLevel: number;
        /**
         * 材质球的光滑度
         */
        gloss: number;
        /**
         * 透明度小于该值的像素完全透明
         */
        cutAlpha: number;
        /**
         * 是否重复
         */
        repeat: boolean;
        /**
         * 是否进行双面渲染
         */
        bothside: boolean;
        /**
         * 透明度
         */
        alpha: number;
        /**
         * 反射颜色的强度值，出射光照的出射率
         */
        albedo: number;
        /**
         * uv 在贴图上的映射区域， 值的范围限制在 0~1 之间
         */
        uvRectangle: Rectangle;
        /**
         * 材质数据需要变化
         */
        materialDataNeedChange: boolean;
        /**
         * 纹理变化
         */
        textureChange: boolean;
        /**
         * 纹理状态需要更新
         */
        textureStateChage: boolean;
        /**
         * 剔除模式
         */
        cullFrontOrBack: number;
        /**
         * 材质属性数据
         */
        materialSourceData: Float32Array;
        clone(): MaterialData;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 材质基类
     * @author wizardc
     */
    abstract class MaterialBase {
        protected _passes: {
            [pass: number]: MaterialPass[];
        };
        protected _materialData: MaterialData;
        private _lightGroup;
        private _shadowMethod;
        constructor(materialData?: MaterialData);
        readonly passes: {
            [pass: number]: MaterialPass[];
        };
        /**
         * 漫反射通道
         */
        readonly diffusePass: DiffusePass;
        materialData: MaterialData;
        /**
         * 材质球接受的灯光组
         */
        lightGroup: LightGroup;
        /**
         * 是否开启深度测试
         */
        depth: boolean;
        /**
         * 深度测试方式
         */
        depthMode: number;
        /**
         * 材质球的漫反射贴图
         */
        diffuseTexture: TextureBase;
        /**
         * 材质球的凹凸法线贴图
         */
        normalTexture: TextureBase;
        /**
         * 材质球的高光贴图
         */
        specularTexture: TextureBase;
        /**
         * 设置模型渲染模式
         */
        drawMode: number;
        /**
         * 模型渲染中带透明贴图的去除不渲染透明透明部分的阀值
         */
        cutAlpha: number;
        /**
         * 漫反射颜色
         */
        diffuseColor: number;
        /**
         * 环境光颜色
         */
        ambientColor: number;
        /**
         * 镜面光反射颜色
         */
        specularColor: number;
        /**
         * 色相颜色
         */
        tintColor: number;
        /**
         * 材质的透明度, 如果透明度小于 1 会自动启用 alpha blending
         */
        alpha: number;
        /**
         * 透明混合
         */
        alphaBlending: boolean;
        /**
         * 材质的高光强度
         */
        specularLevel: number;
        /**
         * 镜面平滑程度值
         */
        gloss: number;
        /**
         * 映射贴图 UV 坐标, 设置此材质要显示使用贴图的区域
         */
        uvRectangle: Rectangle;
        /**
         * 材质是否接受阴影
         */
        castShadow: boolean;
        /**
         * 材质是否是否产生阴影
         */
        acceptShadow: boolean;
        /**
         * 阴影颜色
         */
        shadowColor: number;
        /**
         * 阴影偏移
         */
        shadowOffset: number;
        /**
         * 是否进行纹理重复采样的方式开关
         */
        repeat: boolean;
        /**
         * 材质是否显示双面的开关
         */
        bothside: boolean;
        /**
         * 正面渲染三角形或者背面渲染三角形
         */
        cullMode: number;
        /**
         * 混合模式
         */
        blendMode: BlendMode;
        /**
         * 点的大小
         */
        pointSize: number;
        protected initPass(): void;
        protected passInvalid(passType: PassType): void;
        /**
         * 添加一个渲染通道
         */
        addPass(pass: PassType): void;
        /**
         * 销毁指定的渲染通道
         */
        disposePass(passType: PassType): void;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 材质渲染通道基类
     * @author wizardc
     */
    abstract class MaterialPass {
        protected _passID: number;
        protected _passUsage: PassUsage;
        protected _materialData: MaterialData;
        protected _passChange: boolean;
        protected _vs_shader_methods: {
            [phaseType: number]: string[];
        };
        protected _fs_shader_methods: {
            [phaseType: number]: string[];
        };
        methodList: MethodBase[];
        vsShaderNames: string[];
        fsShaderNames: string[];
        lightGroup: LightGroup;
        constructor(materialData: MaterialData);
        /**
         * 增加渲染方法
         */
        addMethod(method: MethodBase): void;
        /**
         * 获取指定类型的渲染方法实例
         */
        getMethod(type: {
            new (): MethodBase;
        }): MethodBase;
        /**
         * 移除渲染方法
         */
        removeMethod(method: MethodBase): void;
        passInvalid(): void;
        /**
         * 重置纹理
         */
        protected resetTexture(context3DProxy: Context3DProxy): void;
        protected addMethodShaders(shaderComposer: ShaderComposer, shaders: string[]): void;
        upload(time: number, delay: number, context3DProxy: Context3DProxy, modelTransform: Matrix4, camera3D: Camera3D, animation: IAnimation): void;
        /**
         * 初始化所有的渲染方法
         */
        protected abstract initShader(animation: IAnimation): void;
        draw(time: number, delay: number, context3DProxy: Context3DProxy, modelTransform: Matrix4, camera3D: Camera3D, subGeometry: SubGeometry, render: RenderBase): void;
        deactiveState(passUsage: PassUsage, context3DProxy: Context3DProxy): void;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 方法中需要用到的数据
     * @author wizardc
     */
    class PassUsage {
        /** 顶点位置 */
        attribute_position: Attribute;
        /** 顶点法线 */
        attribute_normal: Attribute;
        /** 顶点切线 */
        attribute_tangent: Attribute;
        /** 顶点颜色 */
        attribute_color: Attribute;
        /** 第一套 UV */
        attribute_uv0: Attribute;
        /** 第二套 UV, 一般用于场景灯光烘焙 */
        attribute_uv1: Attribute;
        /** 骨骼索引, 最多包含 4 个索引 */
        attribute_boneIndex: Attribute;
        /** 骨骼权重 */
        attribute_boneWeight: Attribute;
        /** 模型全局转换信息矩阵 */
        uniform_ModelMatrix: Uniform;
        /** 摄像机全局转换信息矩阵 */
        uniform_cameraMatrix: Uniform;
        /** 摄像机全局转换信息逆矩阵 */
        uniform_ViewMatrix: Uniform;
        /** 摄像机投影矩阵 */
        uniform_ProjectionMatrix: Uniform;
        /** 摄像机全局转换信息逆矩阵乘与摄像机投影矩阵之后的矩阵 */
        uniform_ViewProjectionMatrix: Uniform;
        /** 摄像机正交投影矩阵 */
        uniform_orthProectMatrix: Uniform;
        /** 摄像机本地坐标位置信息 */
        uniform_eyepos: Uniform;
        /** 材质自身的一些信息数据 */
        uniform_materialSource: Uniform;
        /** 方向光信息 */
        uniform_directLightSource: Uniform;
        /** 点光源信息 */
        uniform_pointLightSource: Uniform;
        /** 聚光灯信息 */
        uniform_spotLightSource: Uniform;
        /** 阴影渲染摄像机 uniform_ViewProjectionMatrix 矩阵 */
        uniform_ShadowMatrix: Uniform;
        /** 阴影颜色 */
        uniform_ShadowColor: Uniform;
        /** 骨骼动画骨骼相关造型数据 */
        uniform_PoseMatrix: Uniform;
        /** 骨骼动画的当前时间 */
        uniform_time: Uniform;
        /** 2D 采样器 */
        sampler2DList: Sampler2D[];
        /** 立方体采样器 */
        sampler3DList: Sampler3D[];
        /** 片段着色器 */
        vertexShader: ShaderComposer;
        /** 顶点着色器 */
        fragmentShader: ShaderComposer;
        /** 对应的渲染程序 */
        program3D: Program3D;
        /** 方向光数量 */
        maxDirectLight: number;
        /** 对应的方向光数据 */
        directLightData: Float32Array;
        /** 点光源数量 */
        maxPointLight: number;
        /** 对应的点光源数据 */
        pointLightData: Float32Array;
        /** 聚光灯数量 */
        maxSpotLight: number;
        /** 对应的聚光灯数据 */
        spotLightData: Float32Array;
        /** 骨骼数量 */
        maxBone: number;
        /** 存放当前使用到的所有属性 */
        attributeList: Attribute[];
        /** 属性是否改变, 改变后需要重新提交 */
        attributeDiry: boolean;
        constructor();
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 渲染通道工具类
     * @author wizardc
     */
    namespace PassUtil {
        /**
         * 和 PassType 对应, 指定的渲染通道没有设定时是否创建默认的通道对象
         */
        const passAuto: Readonly<boolean[]>;
        /**
         * 创建默认的渲染通道数组
         */
        function createPass(pass: PassType, materialData: MaterialData): MaterialPass;
    }
}
declare namespace dou3d {
    /**
     * 渲染方法基类
     * @author wizardc
     */
    abstract class MethodBase {
        /**
         * 顶点着色器列表
         */
        vsShaderList: {
            [shaderPhaseType: number]: string[];
        };
        /**
         * 片段着色器列表
         */
        fsShaderList: {
            [shaderPhaseType: number]: string[];
        };
        /**
         * 材质数据
         */
        materialData: MaterialData;
        abstract upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void;
        abstract activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 颜色渲染方法
     * @author wizardc
     */
    class ColorMethod extends MethodBase {
        constructor();
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void;
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void;
    }
}
declare namespace dou3d {
    /**
     * 阴影渲染方法
     * @author wizardc
     */
    class ShadowMethod extends MethodBase {
        constructor(material: MaterialBase);
        /**
         * 阴影贴图
         */
        shadowMapTexture: TextureBase;
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void;
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void;
    }
}
declare namespace dou3d {
    /**
     * 立方体渲染方法
     * @author wizardc
     */
    class CubeMethod extends MethodBase {
        constructor();
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void;
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void;
    }
}
declare namespace dou3d {
    /**
     * 漫反射渲染通道
     * @author wizardc
     */
    class DiffusePass extends MaterialPass {
        constructor(materialData: MaterialData);
        protected initShader(animation: IAnimation): void;
        /**
         * 根据属性添加需要的着色器片段
         */
        private phaseBegin;
        /**
         * 添加来自 Method 的着色器片段
         */
        protected initMethodShader(): void;
        /**
         * 将渲染方法的对应着色器加入到对应的 Shader 对象中以便获得最终的着色器对象
         */
        protected phaseEnd(): void;
    }
}
declare namespace dou3d {
    /**
     * 阴影渲染通道
     * @author wizardc
     */
    class ShadowPass extends MaterialPass {
        constructor(materialData: MaterialData);
        protected initShader(animation: IAnimation): void;
    }
}
declare namespace dou3d {
    /**
     * 纯颜色材质
     * @author wizardc
     */
    class ColorMaterial extends MaterialBase {
        constructor(color?: number);
        protected initMatPass(): void;
        color: number;
        alpha: number;
    }
}
declare namespace dou3d {
    /**
     * 纹理材质
     * * 标准的贴图材质球, 可以设置三种贴图: diffuse, normal, speclar 贴图
     * * 不设置贴图时默认会设定为棋盘格贴图
     * @author wizardc
     */
    class TextureMaterial extends MaterialBase {
        constructor(texture?: TextureBase, materialData?: MaterialData);
        protected initMatPass(): void;
        clone(): TextureMaterial;
    }
}
declare namespace dou3d {
    /**
     * 立方体纹理材质
     * @author wizardc
     */
    class CubeTextureMaterial extends MaterialBase {
        constructor(texture?: CubeTexture, materialData?: MaterialData);
        protected initMatPass(): void;
        clone(): CubeTextureMaterial;
    }
}
declare namespace dou3d {
    /**
     * 执行渲染基类
     * @author wizardc
     */
    abstract class RendererBase {
        renderTexture: RenderTexture;
        numEntity: number;
        /**
         * 设置为渲染到贴图
         */
        setRenderToTexture(width: number, height: number, format?: FrameBufferFormat): void;
        /**
         * 执行渲染
         * @param time 当前时间
         * @param delay 每帧间隔时间
         * @param context3D 设备上下文
         * @param collect 渲染对象收集器
         * @param camera 渲染时的相机
         */
        abstract draw(time: number, delay: number, context3D: Context3DProxy, collect: CollectBase, camera: Camera3D, backViewPort?: Rectangle): void;
    }
}
declare namespace dou3d {
    /**
     * 渲染多个可渲染项目类
     * @author wizardc
     */
    class MultiRenderer extends RendererBase {
        drawOver: (collect: CollectBase, camera: Camera3D, time: number, delay: number, backViewPort?: Rectangle) => void;
        private _pass;
        constructor(pass?: number);
        draw(time: number, delay: number, context3D: Context3DProxy, collect: CollectBase, camera: Camera3D, backViewPort?: Rectangle): void;
    }
}
declare namespace dou3d {
    /**
     * 3D 场景
     * @author wizardc
     */
    class Scene3D {
        protected _root: ObjectContainer3D;
        constructor();
        readonly root: ObjectContainer3D;
    }
}
declare namespace dou3d {
    /**
     * 着色器变量基类
     * @author wizardc
     */
    class VarRegister {
        /**
         * 值名字
         */
        varName: string;
        /**
         * 变量名
         */
        name: string;
        /**
         * 变量属性类型
         * * att varying uniform
         */
        key: string;
        /**
         * 变量类型
         * * float vec2 vec3 vec4 int int2 int3 int4
         */
        valueType: string;
        /**
         * 变量值
         * * 类型为宏和常量时
         */
        value: any;
        /**
         * 着色器中的索引
         * * 类型为 Attribute、 Uniform 和取样器时
         */
        uniformIndex: any;
        /**
         * 贴图对象
         * * 采样器类型时
         */
        texture: any;
        /**
         * 要激活的纹理单元
         * * gl.TEXTURE_0 ~ gl.TEXTURE_8
         */
        activeTextureIndex: number;
        /**
         * 绑定到取样器的纹理索引
         * * 如果激活的纹理单元是 gl.TEXTURE_0 则这里是 0, 和纹理单元对应
         */
        index: number;
        /**
         * 总大小
         */
        size: number;
        /**
         * 数据类型
         */
        dataType: number;
        /**
         * 是否归一化
         */
        normalized: boolean;
        /**
         * 一个完整数据的字节数
         */
        stride: number;
        /**
         * 单个数据的偏移量
         */
        offsetBytes: number;
        protected computeVarName(): void;
        clone(): VarRegister;
    }
}
declare namespace dou3d {
    /**
     * 变量属性
     * @author wizardc
     */
    class Attribute extends VarRegister {
        constructor(name: string, valueType: string);
    }
}
declare namespace dou3d {
    /**
     * 常量
     * @author wizardc
     */
    class ConstVar extends VarRegister {
        constructor(name: string, valueType: string, value: string);
    }
}
declare namespace dou3d {
    /**
     * 宏定义
     * @author wizardc
     */
    class DefineVar extends VarRegister {
        constructor(name: string, value: string);
    }
}
declare namespace dou3d {
    /**
     * 扩展
     * @author wizardc
     */
    class Extension extends VarRegister {
        constructor(name: string);
    }
}
declare namespace dou3d {
    /**
     * sampler2D
     * @author wizardc
     */
    class Sampler2D extends VarRegister {
        constructor(name: string);
    }
}
declare namespace dou3d {
    /**
     * sampler3D
     * @author wizardc
     */
    class Sampler3D extends VarRegister {
        constructor(name: string);
    }
}
declare namespace dou3d {
    /**
     * 临时变量
     * @author wizardc
     */
    class TmpVar extends VarRegister {
        constructor(name: string, valueType: string);
    }
}
declare namespace dou3d {
    /**
     * Uniform 属性
     * @author wizardc
     */
    class Uniform extends VarRegister {
        constructor(name: string, valueType: string);
    }
}
declare namespace dou3d {
    /**
     * Varying 属性
     * @author wizardc
     */
    class Varying extends VarRegister {
        constructor(name: string, valueType: string);
    }
}
declare namespace dou3d {
    /**
     * 着色器组合器
     * * 添加多个需要使用的着色器片段, 得到最终可以使用的着色器
     * @author wizardc
     */
    class ShaderComposer {
        protected _shadersName: string[];
        protected _endShadername: string;
        private _shaderType;
        private _shader;
        constructor(type: number);
        readonly shaderType: number;
        shader: Shader;
        addUseShaderName(shaderName: string): void;
        addEndShaderName(shaderName: string): void;
        getShader(passUsage: PassUsage): Shader;
    }
}
declare namespace dou3d {
    /**
     * 解析着色器并对其内容进行分类, 同时提供着色器合并的功能
     * @author wizardc
     */
    class ShaderContent {
        name: string;
        source: string;
        funcNames: string[];
        funcDict: {
            [key: string]: string;
        };
        structNames: string[];
        structDict: {
            [key: string]: string;
        };
        attributeList: Attribute[];
        varyingList: Varying[];
        uniformList: Uniform[];
        constList: ConstVar[];
        tempList: TmpVar[];
        sampler2DList: Sampler2D[];
        sampler3DList: Sampler3D[];
        extensionList: Extension[];
        defineList: DefineVar[];
        /**
         * 增加一个变量对象
         */
        addVar(sVar: VarRegister): void;
        /**
         * 增加一个函数
         */
        addFunc(name: string, func: string): void;
        /**
         * 增加一个结构体
         */
        addStruct(name: string, structStr: string): void;
        /**
         * 合并一个shader内容
         */
        addContent(otherContent: ShaderContent): void;
        private mergeMainFunc;
        clone(): ShaderContent;
    }
}
declare namespace dou3d {
    /**
     * 着色器缓存池
     * @author wizardc
     */
    namespace ShaderPool {
        function register(context: Context3DProxy): void;
        function getGPUShader(shaderType: number, shaderID: string, source: string): Shader;
        function getProgram(vs_shaderID: string, fs_shaderID: string): Program3D;
    }
}
declare namespace dou3d {
    /**
     * 着色器库
     * @author GLSLPacker
     */
    namespace ShaderLib {
        const base_fs = "#extension GL_OES_standard_derivatives:enable\nvarying vec3 varying_eyeNormal;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nvarying vec4 varying_worldPosition;\nvarying vec3 varying_worldNormal;\nuniform mat4 uniform_ViewMatrix;\nuniform vec3 uniform_eyepos;\nvec4 diffuseColor;\nvec4 specularColor;\nvec4 ambientColor;\nvec4 light;\nvec3 normal;\nvec2 uv_0;\nvoid main(){\ndiffuseColor=vec4(1.0,1.0,1.0,1.0);\nspecularColor=vec4(0.0,0.0,0.0,0.0);\nambientColor=vec4(0.0,0.0,0.0,0.0);\nlight=vec4(1.0,1.0,1.0,1.0);\nnormal=normalize(varying_eyeNormal);\nuv_0=varying_uv0;\n}";
        const base_vs = "attribute vec3 attribute_position;\nattribute vec3 attribute_normal;\nattribute vec4 attribute_color;\nattribute vec2 attribute_uv0;\nvec3 e_position=vec3(0.0,0.0,0.0);\nuniform mat4 uniform_ModelMatrix;\nuniform mat4 uniform_ViewMatrix;\nuniform mat4 uniform_ProjectionMatrix;\nvarying vec3 varying_eyeNormal;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nvarying vec4 varying_worldPosition;\nvarying vec3 varying_worldNormal;\nvec4 outPosition;\nmat4 transpose(mat4 inMatrix){\nvec4 i0=inMatrix[0];\nvec4 i1=inMatrix[1];\nvec4 i2=inMatrix[2];\nvec4 i3=inMatrix[3];\nmat4 outMatrix=mat4(\nvec4(i0.x,i1.x,i2.x,i3.x),\nvec4(i0.y,i1.y,i2.y,i3.y),\nvec4(i0.z,i1.z,i2.z,i3.z),\nvec4(i0.w,i1.w,i2.w,i3.w)\n);\nreturn outMatrix;\n}\nmat4 inverse(mat4 m){\nfloat\na00=m[0][0],a01=m[0][1],a02=m[0][2],a03=m[0][3],\na10=m[1][0],a11=m[1][1],a12=m[1][2],a13=m[1][3],\na20=m[2][0],a21=m[2][1],a22=m[2][2],a23=m[2][3],\na30=m[3][0],a31=m[3][1],a32=m[3][2],a33=m[3][3],\nb00=a00*a11-a01*a10,\nb01=a00*a12-a02*a10,\nb02=a00*a13-a03*a10,\nb03=a01*a12-a02*a11,\nb04=a01*a13-a03*a11,\nb05=a02*a13-a03*a12,\nb06=a20*a31-a21*a30,\nb07=a20*a32-a22*a30,\nb08=a20*a33-a23*a30,\nb09=a21*a32-a22*a31,\nb10=a21*a33-a23*a31,\nb11=a22*a33-a23*a32,\ndet=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;\nreturn mat4(\na11*b11-a12*b10+a13*b09,\na02*b10-a01*b11-a03*b09,\na31*b05-a32*b04+a33*b03,\na22*b04-a21*b05-a23*b03,\na12*b08-a10*b11-a13*b07,\na00*b11-a02*b08+a03*b07,\na32*b02-a30*b05-a33*b01,\na20*b05-a22*b02+a23*b01,\na10*b10-a11*b08+a13*b06,\na01*b08-a00*b10-a03*b06,\na30*b04-a31*b02+a33*b00,\na21*b02-a20*b04-a23*b00,\na11*b07-a10*b09-a12*b06,\na00*b09-a01*b07+a02*b06,\na31*b01-a30*b03-a32*b00,\na20*b03-a21*b01+a22*b00)/det;\n}\nvoid main(){\ne_position=attribute_position;\nvarying_color=attribute_color;\nvarying_uv0=attribute_uv0;\nvarying_worldPosition=uniform_ModelMatrix*vec4(e_position,1.0);\nvarying_worldNormal=normalize((uniform_ModelMatrix*vec4(attribute_normal,0.0)).xyz);\n}";
        const color_fs = "void main(){\n}";
        const cube_fs = "uniform samplerCube diffuseTexture3D;\nvarying vec3 varying_pos;\nvec4 diffuseColor;\nvoid main(){\nvec3 uvw=normalize(varying_pos.xyz);\ndiffuseColor=vec4(textureCube(diffuseTexture3D,uvw.xyz));\nif(diffuseColor.w<materialSource.cutAlpha){\ndiscard;\n}\nelse{\ndiffuseColor.xyz*=diffuseColor.w;\n}\n}";
        const cube_vs = "varying vec3 varying_pos;\nvoid main(){\nvarying_pos=e_position;\n}";
        const diffuse_fs = "uniform sampler2D diffuseTexture;\nvec4 diffuseColor;\nvoid main(){\ndiffuseColor=texture2D(diffuseTexture,uv_0);\nif(diffuseColor.w<materialSource.cutAlpha){\ndiscard;\n}\n}";
        const diffuse_vs = "attribute vec3 attribute_normal;\nattribute vec4 attribute_color;\nvarying vec4 varying_modelViewPosition;\nvarying vec4 varying_color;\nvoid main(){\nmat4 mvMatrix=mat4(uniform_ViewMatrix*uniform_ModelMatrix);\nvarying_modelViewPosition=mvMatrix*vec4(e_position,1.0);\nmat4 normalMatrix=inverse(mvMatrix);\nnormalMatrix=transpose(normalMatrix);\nvarying_eyeNormal=mat3(normalMatrix)*-attribute_normal;\noutPosition=varying_modelViewPosition;\nvarying_color=attribute_color;\n}";
        const directLight_fs = "const int max_directLight=0;\nuniform float uniform_directLightSource[6*max_directLight];\nstruct DirectLight{\nvec3 direction;\nvec3 diffuse;\nvec3 ambient;\n};\nvoid calculateDirectLight(MaterialSource materialSource){\nvec3 viewDir=normalize(uniform_eyepos-varying_worldPosition.xyz);\nfor(int i=0;i<max_directLight;i++){\nDirectLight directLight;\ndirectLight.direction=vec3(uniform_directLightSource[i*6],uniform_directLightSource[i*6+1],uniform_directLightSource[i*6+2]);\ndirectLight.diffuse=vec3(uniform_directLightSource[i*6+3],uniform_directLightSource[i*6+4],uniform_directLightSource[i*6+5]);\nvec3 lightDir=-directLight.direction;\nfloat diffuse=calculateLightDiffuse(varying_worldNormal,lightDir);\nfloat specular=calculateLightSpecular(varying_worldNormal,lightDir,viewDir,materialSource.specularScale);\nlight.xyz+=(materialSource.ambient+diffuse*materialSource.diffuse+specular*materialSource.specular)*directLight.diffuse;\n}\n}\nvoid main(){\ncalculateDirectLight(materialSource);\n}";
        const end_fs = "varying vec4 varying_color;\nvec4 outColor;\nvec4 diffuseColor;\nvec4 specularColor;\nvec4 ambientColor;\nvec4 light;\nvoid main(){\noutColor.xyz=(light.xyz+materialSource.ambient)*diffuseColor.xyz*materialSource.diffuse*varying_color.xyz;\noutColor.w=materialSource.alpha*diffuseColor.w*varying_color.w;\noutColor.xyz*=outColor.w;\ngl_FragColor=outColor;\n}";
        const end_vs = "uniform float uniform_materialSource[20];\nvoid main(){\ngl_PointSize=uniform_materialSource[18];\ngl_Position=uniform_ProjectionMatrix*outPosition;\n}";
        const lightingBase_fs = "float computeDistanceLightFalloff(float lightDistance,float range){\nreturn max(0.0,1.0-lightDistance/range);\n}\nfloat calculateLightDiffuse(vec3 normal,vec3 lightDir){\nreturn clamp(dot(normal,lightDir),0.0,1.0);\n}\nfloat calculateLightSpecular(vec3 normal,vec3 lightDir,vec3 viewDir,float glossiness){\nvec3 halfVec=normalize(lightDir+viewDir);\nfloat specComp=max(dot(normal,halfVec),0.0);\nspecComp=pow(specComp,glossiness);\nreturn specComp;\n}\nvoid main(){\nlight.xyzw=vec4(0.0,0.0,0.0,1.0);\n}";
        const materialSource_fs = "struct MaterialSource{\nvec3 diffuse;\nvec3 ambient;\nvec3 specular;\nfloat alpha;\nfloat cutAlpha;\nfloat shininess;\nfloat roughness;\nfloat albedo;\nvec4 uvRectangle;\nfloat specularScale;\nfloat normalScale;\n};\nuniform float uniform_materialSource[20];\nvarying vec2 varying_uv0;\nMaterialSource materialSource;\nvec2 uv_0;\nvoid main(){\nmaterialSource.diffuse.x=uniform_materialSource[0];\nmaterialSource.diffuse.y=uniform_materialSource[1];\nmaterialSource.diffuse.z=uniform_materialSource[2];\nmaterialSource.ambient.x=uniform_materialSource[3];\nmaterialSource.ambient.y=uniform_materialSource[4];\nmaterialSource.ambient.z=uniform_materialSource[5];\nmaterialSource.specular.x=uniform_materialSource[6];\nmaterialSource.specular.y=uniform_materialSource[7];\nmaterialSource.specular.z=uniform_materialSource[8];\nmaterialSource.alpha=uniform_materialSource[9];\nmaterialSource.cutAlpha=uniform_materialSource[10];\nmaterialSource.shininess=uniform_materialSource[11];\nmaterialSource.specularScale=uniform_materialSource[12];\nmaterialSource.albedo=uniform_materialSource[13];\nmaterialSource.uvRectangle.x=uniform_materialSource[14];\nmaterialSource.uvRectangle.y=uniform_materialSource[15];\nmaterialSource.uvRectangle.z=uniform_materialSource[16];\nmaterialSource.uvRectangle.w=uniform_materialSource[17];\nmaterialSource.specularScale=uniform_materialSource[18];\nmaterialSource.normalScale=uniform_materialSource[19];\nuv_0=varying_uv0.xy*materialSource.uvRectangle.zw+materialSource.uvRectangle.xy;\n}";
        const normalMap_fs = "uniform sampler2D normalTexture;\nvarying vec2 varying_uv0;\nvarying vec4 varying_modelViewPosition;\nmat3 cotangentFrame(vec3 N,vec3 p,vec2 uv){\nvec3 dp1=dFdx(p);\nvec3 dp2=dFdy(p);\nvec2 duv1=dFdx(uv);\nvec2 duv2=dFdy(uv);\nvec3 dp2perp=cross(dp2,N);\nvec3 dp1perp=cross(N,dp1);\nvec3 T=dp2perp*duv1.x+dp1perp*duv2.x;\nvec3 B=dp2perp*duv1.y+dp1perp*duv2.y;\nfloat invmax=1.0/sqrt(max(dot(T,T),dot(B,B)));\nreturn mat3(T*invmax,B*invmax,N);\n}\nvec3 tbn(vec3 map,vec3 N,vec3 V,vec2 texcoord){\nmat3 TBN=cotangentFrame(N,-V,texcoord);\nreturn normalize(TBN*map);\n}\nvoid main(){\nvec3 normalTex=texture2D(normalTexture,uv_0).xyz*2.0-1.0;\nnormalTex.y*=-1.0;\nnormal.xyz=tbn(normalTex.xyz,normal.xyz,varying_modelViewPosition.xyz,uv_0);\n}";
        const pointLight_fs = "const int max_pointLight=0;\nuniform float uniform_pointLightSource[7*max_pointLight];\nstruct PointLight{\nvec3 position;\nvec3 diffuse;\nvec3 ambient;\nfloat intensity;\nfloat radius;\n};\nvoid calculatePointLight(MaterialSource materialSource){\nvec3 viewDir=normalize(uniform_eyepos-varying_worldPosition.xyz);\nfor(int i=0;i<max_pointLight;i++){\nPointLight pointLight;\npointLight.position=vec3(uniform_pointLightSource[i*7],uniform_pointLightSource[i*7+1],uniform_pointLightSource[i*7+2]);\npointLight.diffuse=vec3(uniform_pointLightSource[i*7+3],uniform_pointLightSource[i*7+4],uniform_pointLightSource[i*7+5]);\npointLight.radius=uniform_pointLightSource[i*7+6];\nvec3 lightOffset=pointLight.position-varying_worldPosition.xyz;\nvec3 lightDir=normalize(lightOffset);\nfloat falloff=computeDistanceLightFalloff(length(lightOffset),pointLight.radius);\nfloat diffuse=calculateLightDiffuse(varying_worldNormal,lightDir);\nfloat specular=calculateLightSpecular(varying_worldNormal,lightDir,viewDir,materialSource.specularScale);\nlight.xyz+=(materialSource.ambient+diffuse*materialSource.diffuse+specular*materialSource.specular)*pointLight.diffuse*falloff;\n}\n}\nvoid main(){\ncalculatePointLight(materialSource);\n}";
        const shadowMapping_fs = "uniform sampler2D shadowMapTexture;\nuniform vec4 uniform_ShadowColor;\nvarying vec4 varying_ShadowCoord;\nvoid main(){\nvec3 shadowColor=vec3(1.0,1.0,1.0);\nfloat offset=uniform_ShadowColor.w;\nvec2 sample=varying_ShadowCoord.xy/varying_ShadowCoord.w*0.5+0.5;\nif(sample.x>=0.0 && sample.x<=1.0 && sample.y>=0.0 && sample.y<=1.0){\nvec4 sampleDepth=texture2D(shadowMapTexture,sample).xyzw;\nfloat depth=varying_ShadowCoord.z;\nif(sampleDepth.z !=0.0){\nif(sampleDepth.z<depth-offset){\nshadowColor=uniform_ShadowColor.xyz;\n}\n}\n}\ndiffuseColor.xyz=diffuseColor.xyz*shadowColor;\n}";
        const shadowMapping_vs = "uniform mat4 uniform_ShadowMatrix;\nuniform mat4 uniform_ModelMatrix;\nvarying vec4 varying_ShadowCoord;\nvoid main(){\nvarying_ShadowCoord=uniform_ShadowMatrix*uniform_ModelMatrix*vec4(e_position,1.0);\n}";
        const shadowPass_fs = "uniform sampler2D diffuseTexture;\nvec4 diffuseColor;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nvarying vec4 varying_pos;\nvoid main(){\ndiffuseColor=varying_color;\nif(diffuseColor.w==0.0){\ndiscard;\n}\ndiffuseColor=texture2D(diffuseTexture,varying_uv0);\nif(diffuseColor.w<=0.3){\ndiscard;\n}\ngl_FragColor=vec4(varying_pos.zzz,1.0);\n}";
        const shadowPass_vs = "attribute vec3 attribute_position;\nattribute vec4 attribute_color;\nattribute vec2 attribute_uv0;\nuniform mat4 uniform_ModelMatrix;\nuniform mat4 uniform_ViewMatrix;\nuniform mat4 uniform_ProjectionMatrix;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nvarying vec4 varying_pos;\nvoid main(){\nmat4 mvMatrix=mat4(uniform_ViewMatrix*uniform_ModelMatrix);\nvarying_color=attribute_color;\nvarying_uv0=attribute_uv0;\nvarying_pos=uniform_ProjectionMatrix*uniform_ViewMatrix*uniform_ModelMatrix*vec4(attribute_position,1.0);\ngl_Position=varying_pos;\n}";
        const skeleton_vs = "attribute vec4 attribute_boneIndex;\nattribute vec4 attribute_boneWeight;\nattribute vec3 attribute_normal;\nattribute vec4 attribute_color;\nvec4 e_boneIndex=vec4(0.0,0.0,0.0,0.0);\nvec4 e_boneWeight=vec4(0.0,0.0,0.0,0.0);\nconst int bonesNumber=0;\nuniform vec4 uniform_PoseMatrix[bonesNumber];\nvarying vec4 varying_modelViewPosition;\nmat4 buildMat4(int index){\nvec4 quat=uniform_PoseMatrix[index*2+0];\nvec4 translation=uniform_PoseMatrix[index*2+1];\nfloat xy2=2.0*quat.x*quat.y;\nfloat xz2=2.0*quat.x*quat.z;\nfloat xw2=2.0*quat.x*quat.w;\nfloat yz2=2.0*quat.y*quat.z;\nfloat yw2=2.0*quat.y*quat.w;\nfloat zw2=2.0*quat.z*quat.w;\nfloat xx=quat.x*quat.x;\nfloat yy=quat.y*quat.y;\nfloat zz=quat.z*quat.z;\nfloat ww=quat.w*quat.w;\nmat4 matrix=mat4(\nxx-yy-zz+ww,xy2+zw2,xz2-yw2,0,\nxy2-zw2,-xx+yy-zz+ww,yz2+xw2,0,\nxz2+yw2,yz2-xw2,-xx-yy+zz+ww,0,\ntranslation.x,translation.y,translation.z,1\n);\nreturn matrix;\n}\nvoid main(){\ne_boneIndex=attribute_boneIndex;\ne_boneWeight=attribute_boneWeight;\nvec4 temp_position=vec4(attribute_position,1.0);\nvec4 temp_normal=vec4(attribute_normal,0.0);\nmat4 m0=buildMat4(int(e_boneIndex.x));\nmat4 m1=buildMat4(int(e_boneIndex.y));\nmat4 m2=buildMat4(int(e_boneIndex.z));\nmat4 m3=buildMat4(int(e_boneIndex.w));\noutPosition=m0*temp_position*e_boneWeight.x;\noutPosition+=m1*temp_position*e_boneWeight.y;\noutPosition+=m2*temp_position*e_boneWeight.z;\noutPosition+=m3*temp_position*e_boneWeight.w;\ne_position=outPosition.xyz;\nvec4 temp_n;\ntemp_n=m0*temp_normal*e_boneWeight.x;\ntemp_n+=m1*temp_normal*e_boneWeight.y;\ntemp_n+=m2*temp_normal*e_boneWeight.z;\ntemp_n+=m3*temp_normal*e_boneWeight.w;\nmat4 mvMatrix=mat4(uniform_ViewMatrix*uniform_ModelMatrix);\nvarying_modelViewPosition=mvMatrix*vec4(e_position,1.0);\nmat4 normalMatrix=inverse(mvMatrix);\nnormalMatrix=transpose(normalMatrix);\nvarying_eyeNormal=mat3(normalMatrix)*-attribute_normal;\noutPosition.xyzw=varying_modelViewPosition.xyzw;\nvarying_color=attribute_color;\n}";
        const spotLight_fs = "const int max_spotLight=0;\nuniform float uniform_spotLightSource[12*max_spotLight];\nstruct SpotLight{\nvec3 position;\nvec3 direction;\nvec3 diffuse;\nvec3 ambient;\nfloat range;\nfloat coneCos;\nfloat penumbraCos;\n};\nvoid calculateSpotLight(MaterialSource materialSource){\nvec3 viewDir=normalize(uniform_eyepos-varying_worldPosition.xyz);\nfor(int i=0;i<max_spotLight;i++){\nSpotLight spotLight;\nspotLight.position=vec3(uniform_spotLightSource[i*12],uniform_spotLightSource[i*12+1],uniform_spotLightSource[i*12+2]);\nspotLight.direction=vec3(uniform_spotLightSource[i*12+3],uniform_spotLightSource[i*12+4],uniform_spotLightSource[i*12+5]);\nspotLight.diffuse=vec3(uniform_spotLightSource[i*12+6],uniform_spotLightSource[i*12+7],uniform_spotLightSource[i*12+8]);\nspotLight.range=uniform_spotLightSource[i*12+9];\nspotLight.coneCos=uniform_spotLightSource[i*12+10];\nspotLight.penumbraCos=uniform_spotLightSource[i*12+11];\nvec3 lightOffset=spotLight.position-varying_worldPosition.xyz;\nvec3 lightDir=normalize(lightOffset);\nfloat angleCos=dot(lightDir,-spotLight.direction);\nif(angleCos>spotLight.coneCos){\nfloat spotEffect=smoothstep(spotLight.coneCos,spotLight.penumbraCos,angleCos);\nfloat falloff=computeDistanceLightFalloff(length(lightOffset)*angleCos,spotLight.range);\nfloat diffuse=calculateLightDiffuse(varying_worldNormal,lightDir);\nfloat specular=calculateLightSpecular(varying_worldNormal,lightDir,viewDir,materialSource.specularScale);\nlight.xyz+=(materialSource.ambient+diffuse*materialSource.diffuse+specular*materialSource.specular)*spotLight.diffuse*falloff*spotEffect;\n}\n}\n}\nvoid main(){\ncalculateSpotLight(materialSource);\n}";
    }
}
declare namespace dou3d {
    /**
     * 着色器工具类
     * @author wizardc
     */
    namespace ShaderUtil {
        /**
         * 加载着色器文件
         */
        function load(): void;
        /**
         * 返回组合着色器后的内容
         */
        function fillShaderContent(shaderComposer: ShaderComposer, shaderNameList: string[], usage: PassUsage): Shader;
    }
}
declare namespace dou3d {
    /**
     * 实时阴影渲染
     * * 基于 shadow mapping 的阴影算法, 当前阴影只支持方向光,
     * * 摄像机 near 1 far 3000  width 2048 height 2048, 当渲染阴影的物体超出阴影摄像机的范围阴影将不会渲染阴影
     * @author wizardc
     */
    class ShadowCast {
        private static _instance;
        static readonly instance: ShadowCast;
        private _enableShadow;
        private _textureWidth;
        private _textureHeight;
        private _shadowCamera;
        private _shadowRender;
        private _directLight;
        private constructor();
        enableShadow: boolean;
        /**
         * 阴影贴图的宽
         */
        readonly textureWidth: number;
        /**
         * 阴影贴图的高
         */
        readonly textureHeight: number;
        /**
         * 渲染阴影的摄像机
         */
        readonly shadowCamera: Camera3D;
        /**
         * 阴影渲染器
         */
        readonly shadowRender: MultiRenderer;
        /**
         * 用于渲染的平行光
         */
        readonly directLight: DirectLight;
        /**
         * 设置阴影贴图的宽度和高度
         */
        setTextureSize(width: number, height: number): void;
        /**
         * 如需要渲染阴影必须先设置当前阴影灯光, 暂支持方向光, 灯光中的变换会用于阴影像机的变换
         * * 注意: 在阴影摄像机视锥中的物体, 阴影才会渲染
         */
        castShadowLight(light: DirectLight): void;
        update(entityCollect: EntityCollect, camera: Camera3D, time: number, delay: number, viewPort: Rectangle): void;
    }
}
declare namespace dou3d {
    /**
     * 贴图基类
     * @author wizardc
     */
    abstract class TextureBase extends dou.HashObject {
        /**
         * 贴图是否使用 mipmap
         * mipmap 为一个贴图的 LOD 层级贴图, 例如 ( 1024 * 1024 的贴图, 往下就会自动生成 512 * 512, 256 * 256, 128 * 128, 64 * 64, 32 * 32, 16 * 16, 8 * 8, 4 * 4, 2 * 2, 1 * 1 )
         */
        useMipmap: boolean;
        /**
         * 是否平滑差值
         */
        smooth: boolean;
        /**
         * 贴图采样方式
         */
        repeat: boolean;
        /**
         * 贴图的宽度
         */
        width: number;
        /**
         * 贴图的高度
         */
        height: number;
        /**
         * 贴图的数据
         */
        texture2D: ContextTexture2D;
        /**
         * 贴图的数据
         */
        texture3D: ContextTexture3D;
        /**
         * 是否预乘 alpha
         */
        premultiplyAlpha: boolean;
        /**
         * 是否需要颠倒 uv
         * gl.filp_y
         */
        filp_y: boolean;
        /**
         * 当前贴图如果是大图集的一部分则这里用来记录位于大图集中的区域信息
         */
        uvRectangle: Rectangle;
        /**
         * 大图集贴图对象
         */
        parentTexture: TextureBase;
        /**
         * 是否有 Mipmap
         */
        hasMipmap: boolean;
        /**
         * 纹理贴图标准的格式
         */
        internalFormat: InternalFormat;
        /**
         * 贴图颜色格式
         */
        colorFormat: number;
        /**
         * 贴图 mipmap data
         */
        mimapData: Array<MipmapData>;
        private _ready;
        /**
         * 从大图集中的某一区域进行拷贝
         */
        copyFromTexture(texture: TextureBase, x: number, y: number, width: number, height: number): void;
        /**
         * 上传贴图数据给GPU
         */
        abstract upload(context3D: Context3DProxy): void;
        /**
         * 强制上传贴图数据给GPU, 强制要求贴图更新
         * 在 video 贴图类型需要立即改变显卡中的贴图内存
         */
        abstract uploadForcing(context3D: Context3DProxy): void;
        activeState(context3D: Context3DProxy): void;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 图片贴图对象
     * @author wizardc
     */
    class ImageTexture extends TextureBase {
        private _imageData;
        constructor(img: HTMLImageElement);
        readonly width: number;
        readonly height: number;
        upload(context3D: Context3DProxy): void;
        uploadForcing(context3D: Context3DProxy): void;
    }
}
declare namespace dou3d {
    /**
     * 贴图对象
     * @author wizardc
     */
    class Texture extends TextureBase {
        constructor();
        upload(context3D: Context3DProxy): void;
        uploadForcing(context3D: Context3DProxy): void;
    }
}
declare namespace dou3d {
    /**
     * 立方体贴图对象
     * @author wizardc
     */
    class CubeTexture extends TextureBase {
        image_front: ContextTexture2D;
        image_back: ContextTexture2D;
        image_left: ContextTexture2D;
        image_right: ContextTexture2D;
        image_up: ContextTexture2D;
        image_down: ContextTexture2D;
        constructor(image_front?: ContextTexture2D, image_back?: ContextTexture2D, image_left?: ContextTexture2D, image_right?: ContextTexture2D, image_up?: ContextTexture2D, image_down?: ContextTexture2D);
        upload(context3D: Context3DProxy): void;
        uploadForcing(context3D: Context3DProxy): void;
    }
}
declare namespace dou3d {
    /**
     * 可以渲染的贴图对象
     * @author wizardc
     */
    class RenderTexture extends TextureBase {
        frameBufferFormat: FrameBufferFormat;
        constructor(width?: number, height?: number, frameBufferFormat?: FrameBufferFormat);
        upload(context3D: Context3DProxy): void;
        uploadForcing(context3D: Context3DProxy): void;
    }
}
declare namespace dou3d {
    /**
     * 棋盘格纹理为黑白间隔色块组成的一张纹理, 主要用于判别模型UV的正确性, 若某模型UV值不正确, 其纹理表现必定乱序不规整
     * @author wizardc
     */
    class CheckerboardTexture extends TextureBase {
        /**
        * 公用棋盘格实例对象
        */
        static texture: CheckerboardTexture;
        private _pixelArray;
        constructor(width?: number, height?: number);
        private buildCheckerboard;
        upload(context3D: Context3DProxy): void;
        uploadForcing(context3D: Context3DProxy): void;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 数学运算工具类
     * @author wizardc
     */
    namespace MathUtil {
        const PI_HALF: number;
        const PI_QUARTER: number;
        const PI_DOUBLE: number;
        /**
         * 弧度制到角度制相乘的系数
         */
        const RAD_DEG: number;
        /**
         * 角度制到弧度制相乘的系数
         */
        const DEG_RAD: number;
        /**
         * 大于零的最小正值
         * @since https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
         */
        const EPSILON = 2.220446049250313e-16;
        /**
         * 根号 2
         */
        const SQRT_2 = 1.4142135623731;
        /**
         * 根号 2 的一半
         */
        const SQRT1_2: number;
        const INT_MAX = 2147483647;
        const INT_MIN = -2147483647;
        /**
         * 把指定的数限制在指定的区间内
         */
        function clamp(v: number, min?: number, max?: number): number;
        /**
         * 线性插值
         */
        function lerp(from: number, to: number, t: number): number;
        /**
         * 转换为弧度
         */
        function toRadians(degrees: number): number;
        /**
         * 转换为角度
         */
        function toDegrees(radians: number): number;
    }
}
declare namespace dou3d {
    /**
     * 几何体工具类
     * @author wizardc
     */
    namespace GeometryUtil {
        function fromVertexFormatToLength(vf: VertexFormat): number;
    }
}
declare namespace dou3d {
    let canvas: HTMLCanvasElement;
    let ticker: Ticker;
    /**
     * 引擎类, 用来启动 3D 引擎
     * - 本引擎采用左手坐标系
     * - 可以添加多个 View3D 对象来进行 3D 场景的渲染
     * @author wizardc
     */
    class Engine {
        /**
         * 渲染上下文
         */
        static context3DProxy: Context3DProxy;
        private _canvas;
        private _viewRect;
        private _view3Ds;
        /**
         * @param canvas 用户呈现 3D 图像的 Canvas 元素, 为空则会创建一个全屏的元素
         */
        constructor(canvas?: HTMLCanvasElement);
        /**
         * 获取当前画布的可视区域
         */
        readonly viewRect: Rectangle;
        /**
         * 获取所有的 3D 视图
         */
        readonly view3Ds: View3D[];
        /**
         * 添加一个 3D 视图
         */
        addView3D(view3D: View3D): void;
        /**
         * 移除一个 3D 视图
         */
        removeView3D(view3D: View3D): void;
        private startTicker;
        private onTouchEvent;
    }
}
