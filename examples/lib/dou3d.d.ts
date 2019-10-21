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
     * 基础包围盒类
     * - 包含包围盒的各顶点信息, 当包围盒要进行世界变换时, 应当变换各顶点信息
     * @author wizardc
     */
    abstract class Bound extends dou.HashObject {
        protected _vexData: Float32Array;
        protected _indexData: Uint16Array;
        protected _vexLength: number;
        protected _childBound: Bound;
        protected _owner: Object3D;
        private _defaultMatrix;
        constructor(owner: Object3D);
        /**
         * 被拥有的对象
         */
        owner: Object3D;
        /**
         * 顶点数据
         */
        readonly vexData: Float32Array;
        /**
         * 索引数据
         */
        readonly indexData: Uint16Array;
        /**
         * 顶点长度
         */
        readonly vexLength: number;
        /**
         * 子包围盒
         */
        readonly childBound: Bound;
        /**
         * 变换矩阵
         */
        readonly transform: Matrix4;
        protected calculateTransform(): void;
        abstract createChild(): void;
        protected abstract updateAABB(): void;
        copyVertex(bound: Bound): void;
        /**
         * 检测一个点是否包围盒内
         */
        abstract pointIntersect(pos: Vector3): boolean;
        /**
         * 检测两个包围盒是否相交
         */
        abstract intersectAABBs(box: BoundBox, boxIntersect?: BoundBox): boolean;
        /**
         * 检测两个包围对象是否相交
         */
        abstract intersect(target: Bound, intersect?: Bound): boolean;
        /**
         * 检测是否在视椎体内
         */
        abstract inBound(frustum: Frustum): boolean;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 包围盒
     * @author wizardc
     */
    class BoundBox extends Bound {
        private _min;
        private _max;
        private _width;
        private _heigth;
        private _depth;
        private _volume;
        private _center;
        private _radius;
        private _box1;
        private _box2;
        constructor(owner: Object3D, min: Vector3, max: Vector3);
        /**
         * 盒子最小点
         */
        readonly min: Vector3;
        /**
         * 盒子最大点
         */
        readonly max: Vector3;
        /**
         * 盒子宽
         */
        readonly width: number;
        /**
         * 盒子高
         */
        readonly height: number;
        /**
         * 盒子长
         */
        readonly depth: number;
        /**
         * 盒子体积
         */
        readonly volume: number;
        /**
         * 盒子包围球中心点
         */
        readonly center: Vector3;
        /**
         * 盒子包围球半径
         */
        readonly radius: number;
        copy(box: BoundBox): void;
        fillBox(min: Vector3, max: Vector3): void;
        createChild(): void;
        protected updateAABB(): void;
        /**
         * 计算包围盒数据
         */
        calculateBox(): void;
        /**
         * 检测一个点是否包围盒内
         */
        pointIntersect(pos: Vector3): boolean;
        /**
         * 检测两个包围盒是否相交
         */
        intersectAABBs(box: BoundBox, boxIntersect?: BoundBox): boolean;
        /**
         * 检测两个包围对象是否相交
         */
        intersect(target: Bound, intersect?: Bound): boolean;
        /**
         * 检测一个盒子是否在视椎体内
         */
        inBound(frustum: Frustum): boolean;
        toString(): string;
        clone(): Bound;
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
         * 设置贴图采样 第一个参数并不是类型
         * @param samplerIndex
         * @see ContextSamplerType
         */
        setTexture2DAt(samplerIndex: number, uniLocation: any, index: number, texture: ContextTexture2D): void;
        /**
         * 设置贴图采样 第一个参数并不是类型
         * @param samplerIndex
         * @see ContextSamplerType
         */
        setCubeTextureAt(samplerIndex: number, uniLocation: number, index: number, texture: ContextTexture3D): void;
        /**
         * 设置混合模式
         */
        setBlendFactors(src: number, dst: number): void;
        /**
         * 设置剔除模式
         * @see ContextConfig.FRONT
         * @see ContextConfig.BACK
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
     * 3D 相关配置
     * @author wizardc
     */
    namespace ContextConfig {
        /**
         * canvas 窗口矩形
         */
        var canvasRectangle: Rectangle;
        /**
         * 混合模式标志
         */
        var BLEND: number;
        /**
         * 深度测试标志
         */
        var DEPTH_TEST: number;
        /**
         * 剔除面模式标志
         */
        var CULL_FACE: number;
        /**
         * 裁剪正面进行反面渲染
         */
        var FRONT: number;
        /**
         * 裁剪反面进行正面渲染
         */
        var BACK: number;
        /**
         * 裁剪正面和反面
         */
        var FRONT_AND_BACK: number;
        /**
         * 一个颜色用 16 个 bit (2 字节) 表示
         */
        var ColorFormat_RGB565: number;
        /**
         * 一个颜色用 16 个 bit (2 字节) 表示
         */
        var ColorFormat_RGBA5551: number;
        /**
         * 一个颜色用 16 个 bit (2 字节) 表示
         */
        var ColorFormat_RGBA4444: number;
        /**
         * 一个颜色用 32 个 bit (4 字节) 表示
         */
        var ColorFormat_RGBA8888: number;
        /**
         * 8 位整型
         */
        var BYTE: GLenum;
        /**
         * 16 位整形
         */
        var SHORT: GLenum;
        /**
         * 32 位整型
         */
        var INT: GLenum;
        /**
         * 无符号 8 位整型
         */
        var UNSIGNED_BYTE: GLenum;
        /**
         * 无符号 16 位整型
         */
        var UNSIGNED_SHORT: GLenum;
        /**
         * 无符号 32 位整型
         */
        var UNSIGNED_INT: GLenum;
        /**
         * 32 位浮点型
         */
        var FLOAT: GLenum;
        /**
         * 小于等于
         */
        var LEQUAL: number;
        /**
         * 绘制类型, 点
         */
        var POINTS: number;
        /**
         * 绘制类型, 直线
         */
        var LINES: number;
        /**
         * 绘制类型, 连续直线
         */
        var LINE_STRIP: number;
        /**
         * 绘制类型, 三角形
         */
        var TRIANGLES: number;
        var ONE: number;
        var ZERO: number;
        var SRC_ALPHA: number;
        var ONE_MINUS_SRC_ALPHA: number;
        var SRC_COLOR: number;
        var ONE_MINUS_SRC_COLOR: number;
        function register(gl: WebGLRenderingContext): void;
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
         * @see ContextConfig.ColorFormat_RGB565
         * @see ContextConfig.ColorFormat_RGBA5551
         * @see ContextConfig.ColorFormat_RGBA4444
         * @see ContextConfig.ColorFormat_RGBA8888
         */
        colorFormat: number;
        /**
         * 纹理贴图的颜色格式
         * @see ContextConfig.BYTE
         * @see ContextConfig.SHORT
         * @see ContextConfig.INT
         * @see ContextConfig.UNSIGNED_BYTE
         * @see ContextConfig.UNSIGNED_SHORT
         * @see ContextConfig.UNSIGNED_INT
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
         * @see ContextConfig.ColorFormat_RGB565
         * @see ContextConfig.ColorFormat_RGBA5551
         * @see ContextConfig.ColorFormat_RGBA4444
         * @see ContextConfig.ColorFormat_RGBA8888
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
     * - 内置包围盒
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
        protected _bound: Bound;
        protected _enableCulling: boolean;
        protected _enablePick: boolean;
        protected _name: string;
        protected _layer: Layer;
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
        /**
         * 包围盒
         * * 每个场景物件都需要有自己的包围盒子, 可以自定义包围盒形状大小也可以根据模型本身生成
         */
        bound: Bound;
        /**
         * 相机视锥裁剪
         * * 设定这个物件是否具有视锥体裁剪功能, 为否的话将不参加场景渲染剔除, 无论是否在显示范围内都会进行相关的渲染逻辑运算
         */
        enableCulling: boolean;
        /**
         * 拣选检测
         * * 指定这个物件是否具有鼠标交互能力
         */
        enablePick: boolean;
        name: string;
        /**
         * 渲染的层
         */
        layer: Layer;
        setParent(parent: ObjectContainer3D): void;
        invalidTransform(): void;
        invalidGlobalTransform(): void;
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
        protected buildBoundBox(): Bound;
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
        constructor(src?: any, vf?: VertexFormat);
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
        protected _mousePickList: RenderBase[];
        protected _scene: Scene3D;
        constructor();
        /**
         * 可渲染对象列表
         */
        readonly renderList: RenderBase[];
        /**
         * 拾取列表
         */
        readonly mousePickList: RenderBase[];
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
        private _frustum;
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
         * 相机的视椎体, 用来检测是否在当前相机可视范围内
         */
        readonly frustum: Frustum;
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
         * 检测对象是否在相机视椎体内
         */
        isVisibleToCamera(renderItem: RenderBase): boolean;
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
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 摄像机视椎体
     * - 计算出摄像机的可视范围
     * @author wizardc
     */
    class Frustum {
        private _camera;
        private _box;
        private _vtxNum;
        private _vertex;
        private _planeNum;
        private _plane;
        private _center;
        constructor(camera: Camera3D);
        /**
         * 包围盒
         */
        readonly box: BoundBox;
        /**
         * 视椎体中心点
         */
        readonly center: Vector3;
        /**
         * 数据更新
         */
        updateFrustum(): void;
        makeFrustum(fovY: number, aspectRatio: number, nearPlane: number, farPlane: number): void;
        protected makeOrthoFrustum(w: number, h: number, zn: number, zf: number): void;
        update(): void;
        /**
         * 检测一个坐标点是否在视椎体内
         */
        inPoint(pos: Vector3): boolean;
        /**
         * 检测一个球是否在视椎体内
         */
        inSphere(center: IVector3, radius: number): boolean;
        /**
         * 检测一个盒子是否在视椎体内
         */
        inBox(box: BoundBox): boolean;
        dispose(): void;
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
        /**  */
        pixelArray = 0,
        /**  */
        compressData = 1,
        /**  */
        imageData = 2
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
        colorPass = 1,
        normalPass = 2,
        shadowPass = 3,
        lightPass = 4,
        matCapPass = 5,
        depthPass_8 = 6,
        depthPass_32 = 7,
        CubePass = 8,
        Gbuffer = 9,
        PickPass = 10
    }
}
declare namespace dou3d {
    /**
     * 着色器小片段类型
     * @author wizardc
     */
    enum ShaderPhaseType {
        /**
         * 自定义顶点着色器类型, 设定了这个字段的着色器之后就只会使用设定的着色器进行渲染不会动态加入其它的着色器
         */
        base_vertex = 0,
        start_vertex = 1,
        local_vertex = 2,
        global_vertex = 3,
        end_vertex = 4,
        /**
         * 自定义片段着色器类型, 设定了这个字段的着色器之后就只会使用设定的着色器进行渲染不会动态加入其它的着色器
         */
        base_fragment = 5,
        start_fragment = 6,
        materialsource_fragment = 7,
        diffuse_fragment = 8,
        normal_fragment = 9,
        matCap_fragment = 10,
        specular_fragment = 11,
        shadow_fragment = 12,
        lighting_fragment = 13,
        multi_end_fragment = 14,
        end_fragment = 15
    }
}
declare namespace dou3d {
    /**
     * 3D 事件
     * @author wizardc
     */
    class Event3D extends dou.Event {
        static ENTER_FRAME: string;
        static RESIZE: string;
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
        protected _ambientColor: number;
        protected _ambient: Vector4;
        protected _diffuseColor: number;
        protected _diffuse: Vector4;
        protected _specularColor: number;
        protected _specular: Vector4;
        protected _intensity: number;
        protected _halfIntensity: number;
        protected _change: boolean;
        constructor();
        readonly lightType: LightType;
        /**
         * 灯光强度
         * * 影响灯光的强弱显示, 值的范围 0~没有上限, 但是值过大会导致画面过度曝光
         */
        intensity: number;
        /**
         * 背光灯光强度
         * * 影响灯光的强弱显示, 值的范围 0~没有上限, 但是值过大会导致画面过度曝光
         */
        halfIntensity: number;
        /**
         * 灯光环境颜色
         * * 物体在未受到光的直接照射的地方, 模拟间接环境光颜色, 会影响背光面的颜色
         */
        ambient: number;
        /**
         * 灯光漫反射颜色
         * * 直接影响最终灯光的颜色色值
         */
        diffuse: number;
        /**
         * 灯光镜面高光反射颜色
         * * 在灯光方向与物体和相机成一个反光角度的时候, 就会产生反光, 高光, 而不同的物体会有不同的颜色色值, 尤其是金属
         */
        specular: number;
        /**
         * 更新灯光数据
         */
        abstract updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void;
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
        private _direction;
        constructor(direction: Vector3);
        direction: Vector3;
        protected onTransformUpdate(): void;
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
        private _cutoff;
        constructor(color: number);
        /**
         * 灯光半径
         */
        radius: number;
        /**
         * 灯光衰减度
         */
        cutoff: number;
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
        private _spotExponent;
        private _spotCosCutoff;
        private _constantAttenuation;
        private _linearAttenuation;
        private _quadraticAttenuation;
        constructor(color: number);
        /**
         * 裁切范围, 照射范围的大小指数
         */
        spotCosCutoff: number;
        /**
         * 灯光强弱, 圆形范围内随半径大小改变发生的灯光强弱指数
         */
        spotExponent: number;
        /**
         * 灯光衰减, 圆形范围内随半径大小改变发生的灯光衰减常数指数
         */
        constantAttenuation: number;
        /**
         * 灯光线性衰减, 圆形范围内随半径大小改变发生的灯光线性衰减
         */
        linearAttenuation: number;
        /**
         * 灯光线性2次衰减, 圆形范围内随半径大小改变发生的灯光线性2次衰减
         */
        quadraticAttenuation: number;
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
     * 材质渲染通道
     * @author wizardc
     */
    class MaterialPass {
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
        methodDatas: MethodData[];
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
        protected addMethodShaders(shaderBase: ShaderBase, shaders: string[]): void;
        protected addShaderPhase(passType: number, sourcePhase: {
            [shaderPhase: number]: string[];
        }, targetPhase: {
            [shaderPhase: number]: string[];
        }): void;
        /**
         * 初始化所有的渲染方法
         */
        initUseMethod(animation: IAnimation): void;
        /**
         * 添加手动添加的其它渲染方法
         */
        protected initOtherMethods(): void;
        /**
         * 将渲染方法的对应着色器加入到对应的 Shader 对象中以便获得最终的着色器对象
         */
        protected phaseEnd(): void;
        upload(time: number, delay: number, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D, animation: IAnimation): void;
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
        uniform_1ivs: Uniform[];
        uniform_1fvs: Uniform[];
        uniform_2ivs: Uniform[];
        uniform_2fvs: Uniform[];
        uniform_3ivs: Uniform[];
        uniform_3fvs: Uniform[];
        uniform_4ivs: Uniform[];
        uniform_4fvs: Uniform[];
        attribute_position: Attribute;
        attribute_normal: Attribute;
        attribute_tangent: Attribute;
        attribute_color: Attribute;
        attribute_uv0: Attribute;
        attribute_uv1: Attribute;
        attribute_boneIndex: Attribute;
        attribute_boneWeight: Attribute;
        attribute_shapePosition: Attribute;
        attribute_uvRec: Attribute;
        attribute_size: Attribute;
        attribute_quad_color: Attribute;
        attribute_offset: Attribute;
        attribute_billboardXYZ: Attribute;
        attribute_lifecycle: Attribute;
        attribute_direction: Attribute;
        attribute_speed: Attribute;
        attribute_startScale: Attribute;
        attribute_endScale: Attribute;
        attribute_startColor: Attribute;
        attribute_endColor: Attribute;
        attribute_rotate: Attribute;
        attribute_acceleRotate: Attribute;
        attribute_maskRectangle: Attribute;
        attribute_acceleScale: Attribute;
        attribute_startSpaceLifeTime: Attribute;
        varying_pos: Attribute;
        varying_normal: Attribute;
        varying_tangent: Attribute;
        varying_color: Attribute;
        varying_uv0: Attribute;
        varying_uv1: Attribute;
        varying_eyeNormal: Attribute;
        varying_eyedir: Attribute;
        TBN: Attribute;
        uniform_ModelMatrix: Uniform;
        uniform_ProjectionMatrix: Uniform;
        uniform_ViewProjectionMatrix: Uniform;
        uniform_ViewMatrix: Uniform;
        uniform_ModelViewMatrix: Uniform;
        uniform_orthProectMatrix: Uniform;
        uniform_ShadowMatrix: Uniform;
        uniform_eyepos: Uniform;
        uniform_PoseMatrix: Uniform;
        uniform_sceneWidth: Uniform;
        uniform_sceneHeight: Uniform;
        uniform_time: Uniform;
        uniform_cameraMatrix: Uniform;
        uniform_enableBillboardXYZ: Uniform;
        uniform_startColor: Uniform;
        uniform_endColor: Uniform;
        uniform_startScale: Uniform;
        uniform_endScale: Uniform;
        uniform_startRot: Uniform;
        uniform_endRot: Uniform;
        sampler2DList: Sampler2D[];
        sampler3DList: Sampler3D[];
        uniform_materialSource: Uniform;
        uniform_LightSource: Uniform;
        uniform_lightModelSource: Uniform;
        uniform_directLightSource: Uniform;
        uniform_sportLightSource: Uniform;
        uniform_pointLightSource: Uniform;
        uniform_skyLightSource: Uniform;
        uniform_ShadowColor: Uniform;
        program3D: Program3D;
        vs_shader: Shader;
        fs_shader: Shader;
        vertexShader: ShaderBase;
        fragmentShader: ShaderBase;
        maxDirectLight: number;
        maxSpotLight: number;
        maxPointLight: number;
        maxBone: number;
        directLightData: Float32Array;
        spotLightData: Float32Array;
        pointLightData: Float32Array;
        attributeDiry: boolean;
        attributeList: Attribute[];
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 渲染通道工具类
     * @author wizardc
     */
    namespace PassUtil {
        const passAuto: Readonly<boolean[]>;
        function creatPass(pass: PassType, materialData: MaterialData): MaterialPass[];
    }
}
declare namespace dou3d {
    /**
     * 颜色渲染通道
     * @author wizardc
     */
    class ColorPass extends MaterialPass {
        constructor(materialData: MaterialData);
        initUseMethod(): void;
    }
}
declare namespace dou3d {
    /**
     * 漫反射渲染通道
     * @author wizardc
     */
    class DiffusePass extends MaterialPass {
        constructor(materialData: MaterialData);
    }
}
declare namespace dou3d {
    /**
     * 阴影渲染通道
     * @author wizardc
     */
    class ShadowPass extends MaterialPass {
        constructor(materialData: MaterialData);
        initUseMethod(): void;
    }
}
declare namespace dou3d {
    /**
     * 位置渲染通道
     * @author wizardc
     */
    class PositionPass extends MaterialPass {
        constructor(materialData: MaterialData);
        initUseMethod(): void;
    }
}
declare namespace dou3d {
    /**
     * 法线渲染通道
     * @author wizardc
     */
    class NormalPass extends MaterialPass {
        constructor(materialData: MaterialData);
        initUseMethod(): void;
    }
}
declare namespace dou3d {
    /**
     *
     * @author wizardc
     */
    class GbufferPass extends MaterialPass {
    }
}
declare namespace dou3d {
    /**
     * 拾取渲染通道
     * @author wizardc
     */
    class PickPass extends MaterialPass {
        constructor(materialData: MaterialData);
        initUseMethod(): void;
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
         * 材质球特殊光效算法
         */
        matcapTexture: TextureBase;
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
         * 是否接受拾取
         */
        castPick: boolean;
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
     * 材质渲染数据
     * @author wizardc
     */
    class MaterialData {
        /**
         * 材质类型数组
         * * 每个材质球可能会有很多种贴图方法, 而这个是做为默认支持的材质方法的添加通道
         */
        shaderPhaseTypes: {
            [passID: number]: ShaderPhaseType[];
        };
        /**
         * 渲染模式
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
         * 法线贴图
         */
        normalTexture: TextureBase;
        /**
         *
         */
        matcapTexture: TextureBase;
        /**
         * 特效贴图
         */
        specularTexture: TextureBase;
        /**
         * 灯光贴图
         */
        lightTexture: TextureBase;
        /**
         * 遮罩贴图
         */
        maskTexture: TextureBase;
        /**
         * ao 贴图
         */
        aoTexture: TextureBase;
        /**
         * mask 贴图
         */
        blendMaskTexture: TextureBase;
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
         * blend_src 值
         */
        blend_src: number;
        /**
         * blend_dest 值
         */
        blend_dest: number;
        /**
         * alphaBlending
         */
        alphaBlending: boolean;
        /**
         * ambientColor 值
         */
        ambientColor: number;
        /**
         * diffuseColor
         */
        diffuseColor: number;
        /**
         * specularColor 值
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
         * cutAlpha 值
         */
        cutAlpha: number;
        /**
         * 是否重复
         */
        repeat: boolean;
        /**
         * bothside 值
         */
        bothside: boolean;
        /**
         * alpha 值
         */
        alpha: number;
        /**
         * 反射颜色的强度值，出射光照的出射率
         */
        albedo: number;
        /**
         * 高光亮度的强度值,设置较大的值会让高光部分极亮
         */
        specularScale: number;
        normalScale: number;
        /**
         * uv 在贴图上的映射区域，值的范围限制在0.0~1.0之间
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
         * cullFrontOrBack
         */
        cullFrontOrBack: number;
        materialSourceData: Float32Array;
        colorGradientsSource: Float32Array;
        colorTransform: ColorTransform;
        clone(): MaterialData;
        dispose(): void;
    }
}
declare namespace dou3d {
    /**
     * 渲染方法数据
     * @author wizardc
     */
    class MethodData {
        name: string;
        uniform: any;
        format: number;
        data: Float32Array;
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
     * 拾取系统
     * @author wizardc
     */
    class PickSystem {
        private static _instance;
        static readonly instance: PickSystem;
        enablePick: boolean;
        private constructor();
        update(entityCollect: EntityCollect, camera: Camera3D, time: number, delay: number, viewPort: Rectangle): void;
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
         */
        value: any;
        /**
         * texture
         */
        texture: any;
        /**
         * uniform Index
         */
        uniformIndex: any;
        /**
         * active Texture Index
         */
        activeTextureIndex: number;
        /**
         * index
         */
        index: number;
        size: number;
        dataType: number;
        normalized: boolean;
        stride: number;
        offset: number;
        offsetIndex: number;
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
     * 属性类型
     * @author wizardc
     */
    namespace AttributeType {
        const int: string;
        const float: string;
        const vec2: string;
        const vec3: string;
        const vec4: string;
        const mat2: string;
        const mat3: string;
        const mat4: string;
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
     * Uniform 属性类型
     * @author wizardc
     */
    namespace UniformType {
        const bool: string;
        const int: string;
        const float: string;
        const vec2: string;
        const vec3: string;
        const vec4: string;
        const bvec2: string;
        const bvec3: string;
        const bvec4: string;
        const ivec2: string;
        const ivec3: string;
        const ivec4: string;
        const mat2: string;
        const mat3: string;
        const mat4: string;
        const sampler2D: string;
        const sampleCube: string;
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
     * Varying 属性类型
     * @author wizardc
     */
    namespace VaryingType {
        const bool: string;
        const int: string;
        const float: string;
        const vec2: string;
        const vec3: string;
        const vec4: string;
        const bvec2: string;
        const bvec3: string;
        const bvec4: string;
        const ivec2: string;
        const ivec3: string;
        const ivec4: string;
        const mat2: string;
        const mat3: string;
        const mat4: string;
        const sampler2D: string;
        const sampleCube: string;
    }
}
declare namespace dou3d {
    /**
     * 着色器基类
     * @author wizardc
     */
    class ShaderBase {
        protected index: number;
        protected shadersName: string[];
        protected endShadername: string;
        protected stateChange: boolean;
        maxBone: number;
        shaderType: number;
        shader: Shader;
        constructor(type: number);
        addUseShaderName(shaderName: string): void;
        addEndShaderName(shaderName: string): void;
        getShader(passUsage: PassUsage): Shader;
    }
}
declare namespace dou3d {
    /**
     * Shader 变量名
     * 这里列出引擎中使用的所有变量名
     * @author wizardc
     */
    namespace VarConstName {
        const attribute_position: string;
        const attribute_normal: string;
        const attribute_tangent: string;
        const attribute_vertexColor: string;
        const attribute_uv0: string;
        const attribute_uv1: string;
        const varying_pos: string;
        const varying_normal: string;
        const varying_tangent: string;
        const varying_color: string;
        const varying_uv0: string;
        const varying_uv1: string;
        const varying_globalPos: string;
        const varying_lightDir: string;
        const varying_eye: string;
        const uniform_floatv_0: string;
        const uniform_floatv_1: string;
        const uniform_floatv_2: string;
        const uniform_iv_0: string;
        const uniform_iv_1: string;
        const uniform_iv_2: string;
        const uniform_bv_0: string;
        const uniform_bv_1: string;
        const uniform_bv_2: string;
        const uniform_vec2fv_0: string;
        const uniform_vec2fv_1: string;
        const uniform_vec2fv_2: string;
        const uniform_vec3fv_0: string;
        const uniform_vec3fv_1: string;
        const uniform_vec3fv_2: string;
        const uniform_vec4fv_0: string;
        const uniform_vec4fv_1: string;
        const uniform_vec4fv_2: string;
        const uniform_vec2iv_0: string;
        const uniform_vec2iv_1: string;
        const uniform_vec2iv_2: string;
        const uniform_vec3iv_0: string;
        const uniform_vec3iv_1: string;
        const uniform_vec3iv_2: string;
        const uniform_vec4iv_0: string;
        const uniform_vec4iv_1: string;
        const uniform_vec4iv_2: string;
        const uniform_vec2bv_0: string;
        const uniform_vec2bv_1: string;
        const uniform_vec2bv_2: string;
        const uniform_vec3bv_0: string;
        const uniform_vec3bv_1: string;
        const uniform_vec3bv_2: string;
        const uniform_vec4bv_0: string;
        const uniform_vec4bv_1: string;
        const uniform_vec4bv_2: string;
        const uniform_modelMatrix: string;
        const uniform_projectionMatrix: string;
        const uniform_normalMatrix: string;
        const uniform_eye: string;
        const uniform_lightDir: string;
        const texture2D_0: string;
        const texture2D_1: string;
        const texture2D_2: string;
        const texture2D_3: string;
        const texture2D_4: string;
    }
}
declare namespace dou3d {
    /**
     * 解析着色器并对其内容进行分类
     * 方便后面进行着色器合并
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
        const base_fs = "#extension GL_OES_standard_derivatives:enable\nvarying vec3 varying_eyeNormal;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nuniform mat4 uniform_ViewMatrix;\nvec4 outColor;\nvec4 diffuseColor;\nvec4 specularColor;\nvec4 ambientColor;\nvec4 light;\nvec3 normal;\nvec2 uv_0;\nvec3 flatNormals(vec3 pos){\nvec3 fdx=dFdx(pos);vec3 fdy=dFdy(pos);return normalize(cross(fdx,fdy));\n}\nvoid main(){\ndiffuseColor=vec4(1.0,1.0,1.0,1.0);\nspecularColor=vec4(0.0,0.0,0.0,0.0);\nambientColor=vec4(0.0,0.0,0.0,0.0);\nlight=vec4(1.0,1.0,1.0,1.0);\nnormal=normalize(varying_eyeNormal);\nuv_0=varying_uv0;\n}";
        const base_vs = "attribute vec3 attribute_position;\nattribute vec3 attribute_normal;\nattribute vec4 attribute_color;\nattribute vec2 attribute_uv0;\nvec3 e_position=vec3(0.0,0.0,0.0);\nuniform mat4 uniform_ModelMatrix;\nuniform mat4 uniform_ViewMatrix;\nuniform mat4 uniform_ProjectionMatrix;\nvarying vec3 varying_eyeNormal;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nvec4 outPosition;\nmat4 transpose(mat4 inMatrix){\nvec4 i0=inMatrix[0];\nvec4 i1=inMatrix[1];\nvec4 i2=inMatrix[2];\nvec4 i3=inMatrix[3];\nmat4 outMatrix=mat4(\nvec4(i0.x,i1.x,i2.x,i3.x),\nvec4(i0.y,i1.y,i2.y,i3.y),\nvec4(i0.z,i1.z,i2.z,i3.z),\nvec4(i0.w,i1.w,i2.w,i3.w)\n);\nreturn outMatrix;\n}\nmat4 inverse(mat4 m){\nfloat\na00=m[0][0],a01=m[0][1],a02=m[0][2],a03=m[0][3],\na10=m[1][0],a11=m[1][1],a12=m[1][2],a13=m[1][3],\na20=m[2][0],a21=m[2][1],a22=m[2][2],a23=m[2][3],\na30=m[3][0],a31=m[3][1],a32=m[3][2],a33=m[3][3],\nb00=a00*a11-a01*a10,\nb01=a00*a12-a02*a10,\nb02=a00*a13-a03*a10,\nb03=a01*a12-a02*a11,\nb04=a01*a13-a03*a11,\nb05=a02*a13-a03*a12,\nb06=a20*a31-a21*a30,\nb07=a20*a32-a22*a30,\nb08=a20*a33-a23*a30,\nb09=a21*a32-a22*a31,\nb10=a21*a33-a23*a31,\nb11=a22*a33-a23*a32,\ndet=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;\nreturn mat4(\na11*b11-a12*b10+a13*b09,\na02*b10-a01*b11-a03*b09,\na31*b05-a32*b04+a33*b03,\na22*b04-a21*b05-a23*b03,\na12*b08-a10*b11-a13*b07,\na00*b11-a02*b08+a03*b07,\na32*b02-a30*b05-a33*b01,\na20*b05-a22*b02+a23*b01,\na10*b10-a11*b08+a13*b06,\na01*b08-a00*b10-a03*b06,\na30*b04-a31*b02+a33*b00,\na21*b02-a20*b04-a23*b00,\na11*b07-a10*b09-a12*b06,\na00*b09-a01*b07+a02*b06,\na31*b01-a30*b03-a32*b00,\na20*b03-a21*b01+a22*b00)/det;\n}\nvoid main(){\ne_position=attribute_position;\nvarying_color=attribute_color;\nvarying_uv0=attribute_uv0;\n}";
        const colorPassEnd_fs = "void main(){\ngl_FragColor=vec4(diffuseColor.xyz,1.0);\n}";
        const color_fs = "vec4 diffuseColor;\nvoid main(){\nif(diffuseColor.w==0.0){\ndiscard;\n}\ndiffuseColor=vec4(1.0,1.0,1.0,1.0);\nif(diffuseColor.w<materialSource.cutAlpha){\ndiscard;\n}\nelse{\ndiffuseColor.xyz*=diffuseColor.w;\n}\n}";
        const diffuse_fs = "uniform sampler2D diffuseTexture;\nvec4 diffuseColor;\nvoid main(){\ndiffuseColor=texture2D(diffuseTexture,uv_0);\nif(diffuseColor.w<materialSource.cutAlpha){\ndiscard;\n}\n}";
        const diffuse_vs = "attribute vec3 attribute_normal;\nattribute vec4 attribute_color;\nvarying vec4 varying_mvPose;\nvarying vec4 varying_color;\nvoid main(){\nmat4 mvMatrix=mat4(uniform_ViewMatrix*uniform_ModelMatrix);\nvarying_mvPose=mvMatrix*vec4(e_position,1.0);\nmat4 normalMatrix=inverse(mvMatrix);\nnormalMatrix=transpose(normalMatrix);\nvarying_eyeNormal=mat3(normalMatrix)*-attribute_normal;\noutPosition=varying_mvPose;\nvarying_color=attribute_color;\n}";
        const directLight_fs = "const int max_directLight=0;\nuniform float uniform_directLightSource[9*max_directLight];\nvarying vec4 varying_mvPose;\nuniform mat4 uniform_ViewMatrix;\nmat4 normalMatrix;\nstruct DirectLight{\nvec3 direction;\nvec3 diffuse;\nvec3 ambient;\n};\nmat4 transpose(mat4 inMatrix){\nvec4 i0=inMatrix[0];\nvec4 i1=inMatrix[1];\nvec4 i2=inMatrix[2];\nvec4 i3=inMatrix[3];\nmat4 outMatrix=mat4(\nvec4(i0.x,i1.x,i2.x,i3.x),\nvec4(i0.y,i1.y,i2.y,i3.y),\nvec4(i0.z,i1.z,i2.z,i3.z),\nvec4(i0.w,i1.w,i2.w,i3.w)\n);\nreturn outMatrix;\n}\nmat4 inverse(mat4 m){\nfloat\na00=m[0][0],a01=m[0][1],a02=m[0][2],a03=m[0][3],\na10=m[1][0],a11=m[1][1],a12=m[1][2],a13=m[1][3],\na20=m[2][0],a21=m[2][1],a22=m[2][2],a23=m[2][3],\na30=m[3][0],a31=m[3][1],a32=m[3][2],a33=m[3][3],\nb00=a00*a11-a01*a10,\nb01=a00*a12-a02*a10,\nb02=a00*a13-a03*a10,\nb03=a01*a12-a02*a11,\nb04=a01*a13-a03*a11,\nb05=a02*a13-a03*a12,\nb06=a20*a31-a21*a30,\nb07=a20*a32-a22*a30,\nb08=a20*a33-a23*a30,\nb09=a21*a32-a22*a31,\nb10=a21*a33-a23*a31,\nb11=a22*a33-a23*a32,\ndet=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;\nreturn mat4(\na11*b11-a12*b10+a13*b09,\na02*b10-a01*b11-a03*b09,\na31*b05-a32*b04+a33*b03,\na22*b04-a21*b05-a23*b03,\na12*b08-a10*b11-a13*b07,\na00*b11-a02*b08+a03*b07,\na32*b02-a30*b05-a33*b01,\na20*b05-a22*b02+a23*b01,\na10*b10-a11*b08+a13*b06,\na01*b08-a00*b10-a03*b06,\na30*b04-a31*b02+a33*b00,\na21*b02-a20*b04-a23*b00,\na11*b07-a10*b09-a12*b06,\na00*b09-a01*b07+a02*b06,\na31*b01-a30*b03-a32*b00,\na20*b03-a21*b01+a22*b00)/det;\n}\nvoid calculateDirectLight(MaterialSource materialSource){\nfloat lambertTerm,specular;\nvec3 dir,viewDir=normalize(varying_mvPose.xyz/varying_mvPose.w);\nfor(int i=0;i<max_directLight;i++){\nDirectLight directLight;\ndirectLight.direction=(normalMatrix*vec4(uniform_directLightSource[i*9],uniform_directLightSource[i*9+1],uniform_directLightSource[i*9+2],1.0)).xyz;\ndirectLight.diffuse=vec3(uniform_directLightSource[i*9+3],uniform_directLightSource[i*9+4],uniform_directLightSource[i*9+5]);\ndirectLight.ambient=vec3(uniform_directLightSource[i*9+6],uniform_directLightSource[i*9+7],uniform_directLightSource[i*9+8]);\ndir=normalize(directLight.direction);\nlight.xyzw+=LightingBlinnPhong(dir,directLight.diffuse,directLight.ambient,normal,viewDir,0.5);\n}\n}\nvoid main(){\nnormalMatrix=inverse(uniform_ViewMatrix);\nnormalMatrix=transpose(normalMatrix);\ncalculateDirectLight(materialSource);\n}";
        const end_fs = "varying vec4 varying_color;\nvec4 outColor;\nvec4 diffuseColor;\nvec4 specularColor;\nvec4 ambientColor;\nvec4 light;\nvoid main(){\noutColor.xyz=(light.xyz+materialSource.ambient)*diffuseColor.xyz*materialSource.diffuse*varying_color.xyz;\noutColor.w=materialSource.alpha*diffuseColor.w*varying_color.w;\noutColor.xyz*=outColor.w;\ngl_FragColor=outColor;\n}";
        const end_vs = "vec4 endPosition;\nuniform float uniform_materialSource[20];\nvoid main(){\ngl_PointSize=50.0;\ngl_PointSize=uniform_materialSource[18];\ngl_Position=uniform_ProjectionMatrix*outPosition;\n}";
        const lightingBase_fs = "vec4 LightingBlinnPhong(vec3 lightDir,vec3 lightColor,vec3 lightAmbient,vec3 normal,vec3 viewDir,float atten){\nfloat NdotL=clamp(dot(normal,lightDir),0.0,1.0);\nvec3 diffuse=lightColor.xyz*NdotL;\nvec3 h=normalize(lightDir+normalize(viewDir));\nfloat nh=clamp(dot(normal,h),0.0,1.0);\nfloat specPower=pow(nh,materialSource.shininess)*materialSource.specularScale;\nvec3 specular=lightColor.xyz*specPower*materialSource.specular;\nspecularColor.xyz+=specular;\nvec4 c;\nc.rgb=(diffuse+specular+lightAmbient)*(atten*2.0);\nc.a=materialSource.alpha+(specPower*atten);\nreturn c;\n}\nvoid main(){\nlight.xyzw=vec4(0.0,0.0,0.0,1.0);\n}";
        const materialSource_fs = "struct MaterialSource{\nvec3 diffuse;\nvec3 ambient;\nvec3 specular;\nfloat alpha;\nfloat cutAlpha;\nfloat shininess;\nfloat roughness;\nfloat albedo;\nvec4 uvRectangle;\nfloat specularScale;\nfloat normalScale;\n};\nuniform float uniform_materialSource[20];\nvarying vec2 varying_uv0;\nMaterialSource materialSource;\nvec2 uv_0;\nvoid main(){\nmaterialSource.diffuse.x=uniform_materialSource[0];\nmaterialSource.diffuse.y=uniform_materialSource[1];\nmaterialSource.diffuse.z=uniform_materialSource[2];\nmaterialSource.ambient.x=uniform_materialSource[3];\nmaterialSource.ambient.y=uniform_materialSource[4];\nmaterialSource.ambient.z=uniform_materialSource[5];\nmaterialSource.specular.x=uniform_materialSource[6];\nmaterialSource.specular.y=uniform_materialSource[7];\nmaterialSource.specular.z=uniform_materialSource[8];\nmaterialSource.alpha=uniform_materialSource[9];\nmaterialSource.cutAlpha=uniform_materialSource[10];\nmaterialSource.shininess=uniform_materialSource[11];\nmaterialSource.specularScale=uniform_materialSource[12];\nmaterialSource.albedo=uniform_materialSource[13];\nmaterialSource.uvRectangle.x=uniform_materialSource[14];\nmaterialSource.uvRectangle.y=uniform_materialSource[15];\nmaterialSource.uvRectangle.z=uniform_materialSource[16];\nmaterialSource.uvRectangle.w=uniform_materialSource[17];\nmaterialSource.specularScale=uniform_materialSource[18];\nmaterialSource.normalScale=uniform_materialSource[19];\nuv_0=varying_uv0.xy*materialSource.uvRectangle.zw+materialSource.uvRectangle.xy;\n}";
        const normalMap_fs = "uniform sampler2D normalTexture;\nvarying vec2 varying_uv0;\nvarying vec4 varying_mvPose;\nmat3 TBN;\nmat3 cotangentFrame(vec3 N,vec3 p,vec2 uv){\nvec3 dp1=dFdx(p);\nvec3 dp2=dFdy(p);\nvec2 duv1=dFdx(uv);\nvec2 duv2=dFdy(uv);\nvec3 dp2perp=cross(dp2,N);\nvec3 dp1perp=cross(N,dp1);\nvec3 T=dp2perp*duv1.x+dp1perp*duv2.x;\nvec3 B=dp2perp*duv1.y+dp1perp*duv2.y;\nfloat invmax=1.0/sqrt(max(dot(T,T),dot(B,B)));\nreturn mat3(T*invmax,B*invmax,N);\n}\nvec3 tbn(vec3 map,vec3 N,vec3 V,vec2 texcoord){\nmat3 TBN=cotangentFrame(N,-V,texcoord);\nreturn normalize(TBN*map);\n}\nvoid main(){\nvec3 normalTex=texture2D(normalTexture,uv_0).xyz*2.0-1.0;\nnormalTex.y*=-1.0;\nnormal.xyz=tbn(normalTex.xyz,normal.xyz,varying_mvPose.xyz,uv_0);\n}";
        const normalPassEnd_fs = "void main(){\ngl_FragColor=vec4(normal,1.0);\n}";
        const pickPass_fs = "uniform vec4 uniform_ObjectId;\nvoid main(){\ngl_FragColor=uniform_ObjectId;\n}";
        const pickPass_vs = "attribute vec3 attribute_position;\nattribute vec4 attribute_color;\nattribute vec2 attribute_uv0;\nuniform mat4 uniform_ModelMatrix;\nuniform mat4 uniform_ViewMatrix;\nuniform mat4 uniform_ProjectionMatrix;\nvoid main(){\ngl_Position=uniform_ProjectionMatrix*uniform_ViewMatrix*uniform_ModelMatrix*vec4(attribute_position,1.0);\n}";
        const pointLight_fs = "const int max_pointLight=0;\nuniform float uniform_pointLightSource[12*max_pointLight];\nvarying vec4 varying_mvPose;\nstruct PointLight{\nvec3 position;\nvec3 diffuse;\nvec3 ambient;\nfloat intensity;\nfloat radius;\nfloat cutoff;\n};\nvoid calculatePointLight(MaterialSource materialSource){\nvec3 N=normal;\nvec3 viewDir=normalize(varying_mvPose.xyz/varying_mvPose.w);\nfor(int i=0;i<max_pointLight;i++){\nPointLight pointLight;\npointLight.position=vec3(uniform_pointLightSource[i*12],uniform_pointLightSource[i*12+1],uniform_pointLightSource[i*12+2]);\npointLight.diffuse=vec3(uniform_pointLightSource[i*12+3],uniform_pointLightSource[i*12+4],uniform_pointLightSource[i*12+5]);\npointLight.ambient=vec3(uniform_pointLightSource[i*12+6],uniform_pointLightSource[i*12+7],uniform_pointLightSource[i*12+8]);\npointLight.intensity=uniform_pointLightSource[i*12+9];\npointLight.radius=uniform_pointLightSource[i*12+10];\npointLight.cutoff=uniform_pointLightSource[i*12+11];\nvec3 lightCentre=(mat4(uniform_ViewMatrix)*vec4(pointLight.position.xyz,1.0)).xyz;\nfloat r=pointLight.radius*0.5;\nvec3 ldir=varying_mvPose.xyz-lightCentre;\nfloat distance=length(ldir);\nfloat d=max(distance-r,0.0);\nvec3 L=ldir/distance;\nfloat denom=d/r+1.0;\nfloat attenuation=1.0/(denom*denom);\nfloat cutoff=pointLight.cutoff;\nattenuation=(attenuation-cutoff)/(1.0-cutoff);\nattenuation=max(attenuation*pointLight.intensity,0.0);\nlight.xyzw+=LightingBlinnPhong(normalize(ldir),pointLight.diffuse,pointLight.ambient,N,viewDir,attenuation);\n};\n}\nvoid main(){\ncalculatePointLight(materialSource);\n}";
        const positionEndPass_fs = "varying vec4 varying_position;\nvoid main(){\ngl_FragColor=vec4(varying_position.xyz,1.0);\n}";
        const positionEndPass_vs = "varying vec4 varying_position;\nvoid main(){\ngl_Position=uniform_ProjectionMatrix*outPosition;\nvarying_position=gl_Position.xyzw;\n}";
        const shadowMapping_fs = "uniform sampler2D shadowMapTexture;\nuniform vec4 uniform_ShadowColor;\nvarying vec4 varying_ShadowCoord;\nvoid main(){\nvec3 shadowColor=vec3(1.0,1.0,1.0);\nfloat offset=uniform_ShadowColor.w;\nvec2 sample=varying_ShadowCoord.xy/varying_ShadowCoord.w*0.5+0.5;\nif(sample.x>=0.0 && sample.x<=1.0 && sample.y>=0.0 && sample.y<=1.0){\nvec4 sampleDepth=texture2D(shadowMapTexture,sample).xyzw;\nfloat depth=varying_ShadowCoord.z;\nif(sampleDepth.z !=0.0){\nif(sampleDepth.z<depth-offset){\nshadowColor=uniform_ShadowColor.xyz;\n}\n}\n}\ndiffuseColor.xyz=diffuseColor.xyz*shadowColor;\n}";
        const shadowMapping_vs = "uniform mat4 uniform_ShadowMatrix;\nuniform mat4 uniform_ModelMatrix;\nvarying vec4 varying_ShadowCoord;\nvoid main(){\nvarying_ShadowCoord=uniform_ShadowMatrix*uniform_ModelMatrix*vec4(e_position,1.0);\n}";
        const shadowPass_fs = "uniform sampler2D diffuseTexture;\nvec4 diffuseColor;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nvarying vec4 varying_pos;\nvoid main(){\ndiffuseColor=varying_color;\nif(diffuseColor.w==0.0){\ndiscard;\n}\ndiffuseColor=texture2D(diffuseTexture,varying_uv0);\nif(diffuseColor.w<=0.3){\ndiscard;\n}\ngl_FragColor=vec4(varying_pos.zzz,1.0);\n}";
        const shadowPass_vs = "attribute vec3 attribute_position;\nattribute vec4 attribute_color;\nattribute vec2 attribute_uv0;\nuniform mat4 uniform_ModelMatrix;\nuniform mat4 uniform_ViewMatrix;\nuniform mat4 uniform_ProjectionMatrix;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nvarying vec4 varying_pos;\nvoid main(){\nmat4 mvMatrix=mat4(uniform_ViewMatrix*uniform_ModelMatrix);\nvarying_color=attribute_color;\nvarying_uv0=attribute_uv0;\nvarying_pos=uniform_ProjectionMatrix*uniform_ViewMatrix*uniform_ModelMatrix*vec4(attribute_position,1.0);\ngl_Position=varying_pos;\n}";
        const skeleton_vs = "attribute vec4 attribute_boneIndex;\nattribute vec4 attribute_boneWeight;\nattribute vec3 attribute_normal;\nattribute vec4 attribute_color;\nvec4 e_boneIndex=vec4(0.0,0.0,0.0,0.0);\nvec4 e_boneWeight=vec4(0.0,0.0,0.0,0.0);\nconst int bonesNumber=0;\nuniform vec4 uniform_PoseMatrix[bonesNumber];\nvarying vec4 varying_mvPose;\nmat4 buildMat4(int index){\nvec4 quat=uniform_PoseMatrix[index*2+0];\nvec4 translation=uniform_PoseMatrix[index*2+1];\nfloat xy2=2.0*quat.x*quat.y;\nfloat xz2=2.0*quat.x*quat.z;\nfloat xw2=2.0*quat.x*quat.w;\nfloat yz2=2.0*quat.y*quat.z;\nfloat yw2=2.0*quat.y*quat.w;\nfloat zw2=2.0*quat.z*quat.w;\nfloat xx=quat.x*quat.x;\nfloat yy=quat.y*quat.y;\nfloat zz=quat.z*quat.z;\nfloat ww=quat.w*quat.w;\nmat4 matrix=mat4(\nxx-yy-zz+ww,xy2+zw2,xz2-yw2,0,\nxy2-zw2,-xx+yy-zz+ww,yz2+xw2,0,\nxz2+yw2,yz2-xw2,-xx-yy+zz+ww,0,\ntranslation.x,translation.y,translation.z,1\n);\nreturn matrix;\n}\nvoid main(){\ne_boneIndex=attribute_boneIndex;\ne_boneWeight=attribute_boneWeight;\nvec4 temp_position=vec4(attribute_position,1.0);\nvec4 temp_normal=vec4(attribute_normal,0.0);\nmat4 m0=buildMat4(int(e_boneIndex.x));\nmat4 m1=buildMat4(int(e_boneIndex.y));\nmat4 m2=buildMat4(int(e_boneIndex.z));\nmat4 m3=buildMat4(int(e_boneIndex.w));\noutPosition=m0*temp_position*e_boneWeight.x;\noutPosition+=m1*temp_position*e_boneWeight.y;\noutPosition+=m2*temp_position*e_boneWeight.z;\noutPosition+=m3*temp_position*e_boneWeight.w;\ne_position=outPosition.xyz;\nvec4 temp_n;\ntemp_n=m0*temp_normal*e_boneWeight.x;\ntemp_n+=m1*temp_normal*e_boneWeight.y;\ntemp_n+=m2*temp_normal*e_boneWeight.z;\ntemp_n+=m3*temp_normal*e_boneWeight.w;\nmat4 mvMatrix=mat4(uniform_ViewMatrix*uniform_ModelMatrix);\nvarying_mvPose=mvMatrix*vec4(e_position,1.0);\nmat4 normalMatrix=inverse(mvMatrix);\nnormalMatrix=transpose(normalMatrix);\nvarying_eyeNormal=mat3(normalMatrix)*-attribute_normal;\noutPosition.xyzw=varying_mvPose.xyzw;\nvarying_color=attribute_color;\n}";
        const spotLight_fs = "";
        const varyingViewDir_vs = "varying vec3 varying_ViewDir;\nuniform vec3 uniform_eyepos;\nvoid main(){\nvarying_ViewDir=uniform_eyepos.xyz-e_position;\n}";
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
        function fillShaderContent(shaderBase: ShaderBase, shaderNameList: string[], usage: PassUsage): Shader;
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
        private _boundBox;
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
        private calculateBoundBox;
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
         * gl.LINEAR
         * gl.NEAREST
         * gl.LINEAR_MIPMAP_LINEAR
         * gl.LINEAR_MIPMAP_NEAREST
         * gl.NEAREST_MIPMAP_LINEAR
         * gl.NEAREST_MIPMAP_NEAREST
         */
        min_filter: number;
        /**
         * gl.LINEAR
         * gl.NEAREST
         * gl.LINEAR_MIPMAP_LINEAR
         * gl.LINEAR_MIPMAP_NEAREST
         * gl.NEAREST_MIPMAP_LINEAR
         * gl.NEAREST_MIPMAP_NEAREST
         */
        mag_filter: number;
        /**
         * gl.REPEAT
         * gl.MIRRORED_REPEAT
         * gl.CLAMP_TO_EDGE
         */
        wrap_u_filter: number;
        /**
         * gl.REPEAT
         * gl.MIRRORED_REPEAT
         * gl.CLAMP_TO_EDGE
         */
        wrap_v_filter: number;
        /**
         * 是否需要颠倒 uv
         * gl.filp_y
         */
        filp_y: boolean;
        uvRectangle: Rectangle;
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
    }
}
