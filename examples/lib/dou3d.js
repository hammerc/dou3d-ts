var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var dou3d;
(function (dou3d) {
    /**
     * 引用计数基类
     * @author wizardc
     */
    var Reference = /** @class */ (function (_super) {
        __extends(Reference, _super);
        function Reference() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._count = 0;
            return _this;
        }
        Object.defineProperty(Reference.prototype, "canDispose", {
            get: function () {
                return this._count <= 0;
            },
            enumerable: true,
            configurable: true
        });
        Reference.prototype.incRef = function () {
            this._count++;
        };
        Reference.prototype.decRef = function () {
            if (this._count - 1 >= 0) {
                this._count--;
            }
        };
        return Reference;
    }(dou.HashObject));
    dou3d.Reference = Reference;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 渲染上下文
     * @author wizardc
     */
    var Context3DProxy = /** @class */ (function () {
        function Context3DProxy() {
        }
        Context3DProxy.prototype.register = function () {
            Context3DProxy.gl.getExtension('WEBGL_depth_texture') || Context3DProxy.gl.getExtension('MOZ_WEBGL_depth_texture') || Context3DProxy.gl.getExtension('WEBKIT_WEBGL_depth_texture');
            Context3DProxy.gl.getExtension('EXT_texture_filter_anisotropic') || Context3DProxy.gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || Context3DProxy.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
            Context3DProxy.gl.getExtension('WEBGL_compressed_texture_pvrtc') || Context3DProxy.gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
            Context3DProxy.gl.getExtension('WEBGL_compressed_texture_etc1');
            Context3DProxy.gl.getExtension('OES_element_index_uint');
            Context3DProxy.gl.getExtension("OES_texture_float_linear");
            Context3DProxy.gl.getExtension("OES_texture_float");
            Context3DProxy.gl.getExtension("OES_texture_half_float");
            Context3DProxy.gl.getExtension("OES_texture_half_float_linear");
            Context3DProxy.gl.getExtension("OES_standard_derivatives");
            Context3DProxy.gl.getExtension("GL_OES_standard_derivatives");
            Context3DProxy.gl.getExtension("WEBGL_draw_buffers");
            Context3DProxy.gl.getExtension("WEBGL_depth_texture");
            Context3DProxy.gl.getExtension("WEBGL_lose_context");
        };
        /**
         * 视口设置定义
         * 用来确定我们定义的视口在 canvas 中的所在位置
         */
        Context3DProxy.prototype.viewPort = function (x, y, width, height) {
            Context3DProxy.gl.viewport(x, y, width, height);
        };
        /**
         * 设置矩形裁切区域
         */
        Context3DProxy.prototype.setScissorRectangle = function (x, y, width, height) {
            Context3DProxy.gl.scissor(x, Context3DProxy.canvasRectangle.h - height - y, width, height);
        };
        /**
         * 创建顶点着色器
         */
        Context3DProxy.prototype.createVertexShader = function (source) {
            var shader = Context3DProxy.gl.createShader(Context3DProxy.gl.VERTEX_SHADER);
            Context3DProxy.gl.shaderSource(shader, source);
            Context3DProxy.gl.compileShader(shader);
            return new dou3d.Shader(shader);
        };
        /**
         * 创建片段着色器
         */
        Context3DProxy.prototype.createFragmentShader = function (source) {
            var shader = Context3DProxy.gl.createShader(Context3DProxy.gl.FRAGMENT_SHADER);
            Context3DProxy.gl.shaderSource(shader, source);
            Context3DProxy.gl.compileShader(shader);
            return new dou3d.Shader(shader);
        };
        /**
         * 创建渲染程序
         */
        Context3DProxy.prototype.createProgram = function (vertexShader, fragmentShader) {
            var shaderProgram = Context3DProxy.gl.createProgram();
            Context3DProxy.gl.attachShader(shaderProgram, vertexShader.shader);
            Context3DProxy.gl.attachShader(shaderProgram, fragmentShader.shader);
            Context3DProxy.gl.linkProgram(shaderProgram);
            var p = Context3DProxy.gl.getProgramParameter(shaderProgram, Context3DProxy.gl.LINK_STATUS);
            if (DEBUG && !p) {
                console.error("vsShader error" + Context3DProxy.gl.getShaderInfoLog(vertexShader.shader));
                console.error("fsShader error" + Context3DProxy.gl.getShaderInfoLog(fragmentShader.shader));
            }
            var program = new dou3d.Program3D(shaderProgram);
            return program;
        };
        /**
         * 使用显卡着色器
         */
        Context3DProxy.prototype.setProgram = function (program) {
            if (this._program == program) {
                return;
            }
            this._program = program;
            Context3DProxy.gl.useProgram(program.program);
        };
        /**
         * 创建顶点缓冲
         */
        Context3DProxy.prototype.createVertexBuffer = function (vertexData, dawType) {
            if (dawType === void 0) { dawType = Context3DProxy.gl.STATIC_DRAW; }
            var vertexBuffer = Context3DProxy.gl.createBuffer();
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ARRAY_BUFFER, vertexBuffer);
            Context3DProxy.gl.bufferData(Context3DProxy.gl.ARRAY_BUFFER, vertexData, dawType);
            return new dou3d.VertexBuffer3D(vertexBuffer, vertexData);
        };
        /**
         * 上传顶点缓冲
         */
        Context3DProxy.prototype.uploadVertexBuffer = function (vertexBuffer3D) {
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ARRAY_BUFFER, vertexBuffer3D.buffer);
            Context3DProxy.gl.bufferData(Context3DProxy.gl.ARRAY_BUFFER, vertexBuffer3D.arrayBuffer, Context3DProxy.gl.DYNAMIC_DRAW);
        };
        /**
         * 创建索引缓冲
         */
        Context3DProxy.prototype.createIndexBuffer = function (indexData) {
            var indexBuffer = Context3DProxy.gl.createBuffer();
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            Context3DProxy.gl.bufferData(Context3DProxy.gl.ELEMENT_ARRAY_BUFFER, indexData, Context3DProxy.gl.STATIC_DRAW);
            return new dou3d.IndexBuffer3D(indexBuffer, indexData);
        };
        /**
         * 上传索引缓冲
         */
        Context3DProxy.prototype.uploadIndexBuffer = function (indexBuffer3D) {
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ELEMENT_ARRAY_BUFFER, indexBuffer3D.buffer);
            Context3DProxy.gl.bufferData(Context3DProxy.gl.ELEMENT_ARRAY_BUFFER, indexBuffer3D.arrayBuffer, Context3DProxy.gl.DYNAMIC_DRAW);
        };
        /**
         * 获取矩阵变量 ID
         */
        Context3DProxy.prototype.getUniformLocation = function (programe3D, name) {
            return Context3DProxy.gl.getUniformLocation(programe3D.program, name);
        };
        /**
         * 传值给 shader 一个 float
         */
        Context3DProxy.prototype.uniform1f = function (location, x) {
            Context3DProxy.gl.uniform1f(location, x);
        };
        /**
         * 传值给 shader 一个 vec3 (float, float, float)
         */
        Context3DProxy.prototype.uniform1fv = function (location, v) {
            Context3DProxy.gl.uniform1fv(location, v);
        };
        /**
         * 传值给 shader 一个 int
         */
        Context3DProxy.prototype.uniform1i = function (location, x) {
            Context3DProxy.gl.uniform1i(location, x);
        };
        /**
         * 传值给 shader 一个 int 数组
         */
        Context3DProxy.prototype.uniform1iv = function (location, v) {
            Context3DProxy.gl.uniform1iv(location, v);
        };
        /**
         * 传值给 shader 两个 float
         */
        Context3DProxy.prototype.uniform2f = function (location, x, y) {
            Context3DProxy.gl.uniform2f(location, x, y);
        };
        /**
         * 传值给 shader vec2 (float, float)
         */
        Context3DProxy.prototype.uniform2fv = function (location, v) {
            Context3DProxy.gl.uniform2fv(location, v);
        };
        /**
         * 传值给 shader 两个 int 值
         */
        Context3DProxy.prototype.uniform2i = function (location, x, y) {
            Context3DProxy.gl.uniform2i(location, x, y);
        };
        /**
         * 传值给 shader vec2 (int, int)
         */
        Context3DProxy.prototype.uniform2iv = function (location, v) {
            Context3DProxy.gl.uniform2iv(location, v);
        };
        /**
         * 传值给 shader 3 个 float
         */
        Context3DProxy.prototype.uniform3f = function (location, x, y, z) {
            Context3DProxy.gl.uniform3f(location, x, y, z);
        };
        /**
         * 传值给 shader vec3 (float, float, float)
         */
        Context3DProxy.prototype.uniform3fv = function (location, v) {
            Context3DProxy.gl.uniform3fv(location, v);
        };
        /**
         * 传值给 shader 3 个 int
         */
        Context3DProxy.prototype.uniform3i = function (location, x, y, z) {
            Context3DProxy.gl.uniform3i(location, x, y, z);
        };
        /**
         * 传值给 shader vec3 (int, int, int)
         */
        Context3DProxy.prototype.uniform3iv = function (location, v) {
            Context3DProxy.gl.uniform3iv(location, v);
        };
        /**
         * 传值给 shader 4 个 float 值
         */
        Context3DProxy.prototype.uniform4f = function (location, x, y, z, w) {
            Context3DProxy.gl.uniform4f(location, x, y, z, w);
        };
        /**
         * 传值给 shader vec (float, float, float, float)
         */
        Context3DProxy.prototype.uniform4fv = function (location, v) {
            Context3DProxy.gl.uniform4fv(location, v);
        };
        /**
         * 传值给 shader 4 个 int 值
         */
        Context3DProxy.prototype.uniform4i = function (location, x, y, z, w) {
            Context3DProxy.gl.uniform4i(location, x, y, z, w);
        };
        /**
         * 传值给 shader vec4 (int, int, int, int)
         */
        Context3DProxy.prototype.uniform4iv = function (location, v) {
            Context3DProxy.gl.uniform4iv(location, v);
        };
        /**
         * 传值给 shader 2 * 2 矩阵
         * @param transpose 是否转置
         */
        Context3DProxy.prototype.uniformMatrix2fv = function (location, transpose, value) {
            Context3DProxy.gl.uniformMatrix2fv(location, transpose, value);
        };
        /**
         * 传值给 shader 3 * 3 矩阵
         * @param transpose 是否转置
         */
        Context3DProxy.prototype.uniformMatrix3fv = function (location, transpose, value) {
            Context3DProxy.gl.uniformMatrix3fv(location, transpose, value);
        };
        /**
         * 传值给 shader 4 * 4 矩阵
         * @param transpose 是否转置
         */
        Context3DProxy.prototype.uniformMatrix4fv = function (location, transpose, value) {
            Context3DProxy.gl.uniformMatrix4fv(location, transpose, value);
        };
        /**
         * 获取顶点着色器变量索引
         */
        Context3DProxy.prototype.getShaderAttribLocation = function (programe, attribName) {
            return Context3DProxy.gl.getAttribLocation(programe.program, attribName);
        };
        /**
         * 设定所有的顶点属性都是非数组结构
         */
        Context3DProxy.prototype.disableAllVertexAttribArray = function () {
            for (var j = 0; j < 8; j++) {
                Context3DProxy.gl.disableVertexAttribArray(j);
            }
        };
        /**
         * 指定顶点着色器变量索引及结构
         * @param index 变量索引
         * @param size  数据个数
         * @param dataType  数据类型
         * @param normalized 是否单位化
         * @param stride 字节数
         * @param offset 当前变量字节偏移
         */
        Context3DProxy.prototype.vertexAttribPointer = function (index, size, dataType, normalized, stride, offset) {
            Context3DProxy.gl.vertexAttribPointer(index, size, dataType, normalized, stride, offset);
            Context3DProxy.gl.enableVertexAttribArray(index);
        };
        /**
         * 实时传入显卡顶点着色器变量数组数据
         */
        Context3DProxy.prototype.setVertexShaderConstData = function (floats, offest, numLen) {
            Context3DProxy.gl.vertexAttrib4fv(offest, floats.subarray(offest, numLen));
        };
        /**
         * 绑定顶点 Buffer
         */
        Context3DProxy.prototype.bindVertexBuffer = function (vertexBuffer) {
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ARRAY_BUFFER, vertexBuffer.buffer);
        };
        /**
         * 绑定顶点索引 Buffer
         */
        Context3DProxy.prototype.bindIndexBuffer = function (indexBuffer) {
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        };
        /**
        * @language zh_CN
        * 创建 2维贴图 向显卡提交buffer申请 并创建Texture2D对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        Context3DProxy.prototype.createTexture = function () {
            return Context3DProxy.gl.createTexture();
        };
        /**
         * 设置2D纹理状态, 来确定贴图的采样方式
         * @param target gl.TEXTURE_2D, gl.TEXTURE_CUBE_MAP
         * @param pname 采用的纹理滤镜类型
         * @param param 对应该纹理滤镜的参数
         * @tutorial https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texParameter
         * @tutorial https://blog.csdn.net/puppet_master/article/details/53485919
         */
        Context3DProxy.prototype.texParameteri = function (target, pname, param) {
            Context3DProxy.gl.texParameteri(target, pname, param);
        };
        /**
         * 上传纹理
         */
        Context3DProxy.prototype.upLoadTextureData = function (mipLevel, texture) {
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_2D, texture.texture2D.texture);
            if (texture.texture2D.internalFormat == 0 /* imageData */) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_2D, 0, Context3DProxy.gl.RGBA, Context3DProxy.gl.RGBA, texture.texture2D.dataFormat, texture.texture2D.imageData);
            }
            else if (texture.texture2D.internalFormat == 1 /* compressData */) {
                this.upLoadCompressedTexture2D(mipLevel, texture.texture2D);
            }
            else if (texture.texture2D.internalFormat == 2 /* pixelArray */) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_2D, mipLevel, texture.texture2D.colorFormat, texture.texture2D.mimapData[mipLevel].width, texture.texture2D.mimapData[mipLevel].height, texture.texture2D.border, texture.texture2D.colorFormat, texture.texture2D.dataFormat, texture.texture2D.mimapData[mipLevel].data);
            }
            if (texture.useMipmap) {
                Context3DProxy.gl.generateMipmap(Context3DProxy.gl.TEXTURE_2D);
            }
        };
        /**
         * 提交2D压缩纹理，用硬件来解析dds贴图
         */
        Context3DProxy.prototype.upLoadCompressedTexture2D = function (mipLevel, texture) {
            Context3DProxy.gl.compressedTexImage2D(Context3DProxy.gl.TEXTURE_2D, mipLevel, texture.colorFormat, texture.mimapData[mipLevel].width, texture.mimapData[mipLevel].height, texture.border, texture.mimapData[mipLevel].data);
        };
        /**
         * 提交立方体纹理
         */
        Context3DProxy.prototype.uploadCubetexture = function (tex) {
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_CUBE_MAP, tex.texture);
            if (tex.image_right.mimapData && tex.image_right.mimapData.length > 0) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, Context3DProxy.gl.RGB, tex.image_right.mimapData[0].width, tex.image_right.mimapData[0].height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_right.mimapData[0].data);
            }
            else {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_right.imageData);
            }
            if (tex.image_left.mimapData && tex.image_left.mimapData.length > 0) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, Context3DProxy.gl.RGB, tex.image_left.mimapData[0].width, tex.image_left.mimapData[0].height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_left.mimapData[0].data);
            }
            else {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_left.imageData);
            }
            if (tex.image_up.mimapData && tex.image_up.mimapData.length > 0) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, Context3DProxy.gl.RGB, tex.image_up.mimapData[0].width, tex.image_up.mimapData[0].height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_up.mimapData[0].data);
            }
            else {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_up.imageData);
            }
            if (tex.image_down.mimapData && tex.image_down.mimapData.length > 0) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, Context3DProxy.gl.RGB, tex.image_down.mimapData[0].width, tex.image_down.mimapData[0].height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_down.mimapData[0].data);
            }
            else {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_down.imageData);
            }
            if (tex.image_front.mimapData && tex.image_front.mimapData.length > 0) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, Context3DProxy.gl.RGB, tex.image_front.mimapData[0].width, tex.image_front.mimapData[0].height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_front.mimapData[0].data);
            }
            else {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_front.imageData);
            }
            if (tex.image_back.mimapData && tex.image_back.mimapData.length > 0) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, Context3DProxy.gl.RGB, tex.image_back.mimapData[0].width, tex.image_back.mimapData[0].height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_back.mimapData[0].data);
            }
            else {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_back.imageData);
            }
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_CUBE_MAP, Context3DProxy.gl.TEXTURE_MAG_FILTER, Context3DProxy.gl.LINEAR);
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_CUBE_MAP, Context3DProxy.gl.TEXTURE_MIN_FILTER, Context3DProxy.gl.LINEAR);
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_CUBE_MAP, Context3DProxy.gl.TEXTURE_WRAP_S, Context3DProxy.gl.CLAMP_TO_EDGE);
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_CUBE_MAP, Context3DProxy.gl.TEXTURE_WRAP_T, Context3DProxy.gl.CLAMP_TO_EDGE);
        };
        /**
         *
         * @param width
         * @param height
         * @param format
         */
        Context3DProxy.prototype.createFramebuffer = function (width, height, format) {
            var rttframeBuffer = Context3DProxy.gl.createFramebuffer();
            var texture2D = new dou3d.ContextTexture2D();
            var depthRenderbuffer = Context3DProxy.gl.createRenderbuffer();
            texture2D.texture = texture2D.texture || Context3DProxy.gl.createTexture();
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_2D, texture2D.texture);
            switch (format) {
                case 2 /* UNSIGNED_BYTE_RGB */:
                    Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_2D, 0, Context3DProxy.gl.RGB, width, height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, null);
                    break;
                case 3 /* UNSIGNED_BYTE_RGBA */:
                    Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_2D, 0, Context3DProxy.gl.RGBA, width, height, 0, Context3DProxy.gl.RGBA, Context3DProxy.gl.UNSIGNED_BYTE, null);
                    break;
                case 0 /* FLOAT_RGB */: {
                    var float = new Float32Array(width * height * 4);
                    for (var i = 0; i < width * height; i++) {
                        float[i] = Math.random();
                        float[i + 1] = Math.random();
                        float[i + 2] = Math.random();
                    }
                    Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_2D, 0, Context3DProxy.gl.RGB, width, height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.FLOAT, float);
                    break;
                }
                case 1 /* FLOAT_RGBA */: {
                    var float = new Float32Array(width * height * 4);
                    for (var i = 0; i < width * height; i++) {
                        float[i] = Math.random();
                        float[i + 1] = Math.random();
                        float[i + 2] = Math.random();
                        float[i + 3] = Math.random();
                    }
                    Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_2D, 0, Context3DProxy.gl.RGBA, width, height, 0, Context3DProxy.gl.RGBA, Context3DProxy.gl.FLOAT, float);
                    break;
                }
            }
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_MAG_FILTER, Context3DProxy.gl.NEAREST);
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_MIN_FILTER, Context3DProxy.gl.NEAREST);
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_WRAP_S, Context3DProxy.gl.CLAMP_TO_EDGE);
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_2D, Context3DProxy.gl.TEXTURE_WRAP_T, Context3DProxy.gl.CLAMP_TO_EDGE);
            Context3DProxy.gl.bindFramebuffer(Context3DProxy.gl.FRAMEBUFFER, rttframeBuffer);
            Context3DProxy.gl.framebufferTexture2D(Context3DProxy.gl.FRAMEBUFFER, Context3DProxy.gl.COLOR_ATTACHMENT0, Context3DProxy.gl.TEXTURE_2D, texture2D.texture, 0);
            Context3DProxy.gl.bindRenderbuffer(Context3DProxy.gl.RENDERBUFFER, depthRenderbuffer);
            Context3DProxy.gl.renderbufferStorage(Context3DProxy.gl.RENDERBUFFER, Context3DProxy.gl.DEPTH_COMPONENT16, width, height);
            texture2D.width = width;
            texture2D.height = height;
            texture2D.frameBuffer = rttframeBuffer;
            texture2D.renderbuffer = depthRenderbuffer;
            Context3DProxy.gl.bindFramebuffer(Context3DProxy.gl.FRAMEBUFFER, null);
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_2D, null);
            Context3DProxy.gl.bindRenderbuffer(Context3DProxy.gl.RENDERBUFFER, null);
            return texture2D;
        };
        /**
         * 设置渲染缓冲为贴图
         */
        Context3DProxy.prototype.setRenderToTexture = function (texture) {
            Context3DProxy.gl.viewport(0, 0, texture.width, texture.height);
            Context3DProxy.gl.scissor(0, 0, texture.width, texture.height);
            Context3DProxy.gl.bindFramebuffer(Context3DProxy.gl.FRAMEBUFFER, texture.frameBuffer);
            Context3DProxy.gl.clearColor(0, 0, 0, 0);
            Context3DProxy.gl.clear(Context3DProxy.gl.COLOR_BUFFER_BIT | Context3DProxy.gl.DEPTH_BUFFER_BIT);
            Context3DProxy.gl.framebufferTexture2D(Context3DProxy.gl.FRAMEBUFFER, Context3DProxy.gl.COLOR_ATTACHMENT0, Context3DProxy.gl.TEXTURE_2D, texture.texture, 0);
            Context3DProxy.gl.framebufferRenderbuffer(Context3DProxy.gl.FRAMEBUFFER, Context3DProxy.gl.DEPTH_ATTACHMENT, Context3DProxy.gl.RENDERBUFFER, texture.renderbuffer);
        };
        /**
         * 设置渲染缓冲为屏幕
         */
        Context3DProxy.prototype.setRenderToBackBuffer = function () {
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_2D, null);
            Context3DProxy.gl.bindFramebuffer(Context3DProxy.gl.FRAMEBUFFER, null);
            Context3DProxy.gl.bindRenderbuffer(Context3DProxy.gl.RENDERBUFFER, null);
        };
        /**
         * 设置贴图采样
         * @param samplerIndex 激活和绑定的采样器单元, 对应 gl.TEXTURE_0 ~ gl.TEXTURE_8
         * @param uniLocation 着色器中对应的取样器索引
         * @param index 赋值给取样器变量的纹理单元编号, 纹理单元对应的编号: 如果第一个参数是 gl.TEXTURE_0 则这里传递 0
         * @param texture 贴图对象
         */
        Context3DProxy.prototype.setTexture2DAt = function (samplerIndex, uniLocation, index, texture) {
            Context3DProxy.gl.activeTexture(samplerIndex);
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_2D, texture.texture);
            Context3DProxy.gl.uniform1i(uniLocation, index);
        };
        /**
         * 设置贴图采样
         * @param samplerIndex 激活和绑定的采样器单元, 对应 gl.TEXTURE_0 ~ gl.TEXTURE_8
         * @param uniLocation 着色器中对应的取样器索引
         * @param index 赋值给取样器变量的纹理单元编号, 纹理单元对应的编号: 如果第一个参数是 gl.TEXTURE_0 则这里传递 0
         * @param texture 贴图对象
         */
        Context3DProxy.prototype.setCubeTextureAt = function (samplerIndex, uniLocation, index, texture) {
            Context3DProxy.gl.activeTexture(samplerIndex);
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_CUBE_MAP, texture.texture);
            Context3DProxy.gl.uniform1i(uniLocation, index);
        };
        /**
         * 设置混合模式
         */
        Context3DProxy.prototype.setBlendFactors = function (src, dst) {
            if (this._sfactor == src && this._dfactor == dst) {
                return;
            }
            this._sfactor = src;
            this._dfactor = dst;
            Context3DProxy.gl.blendFunc(src, dst);
        };
        /**
         * 设置剔除模式
         * @see Context3DProxy.gl.FRONT
         * @see Context3DProxy.gl.BACK
         */
        Context3DProxy.prototype.setCulling = function (mode) {
            if (this._cullingMode == mode) {
                return;
            }
            this._cullingMode = mode;
            Context3DProxy.gl.cullFace(mode);
        };
        /**
         * 开启深度测试模式
         */
        Context3DProxy.prototype.enableDepth = function () {
            if (this._depthTest) {
                return;
            }
            this._depthTest = true;
            Context3DProxy.gl.enable(Context3DProxy.gl.DEPTH_TEST);
        };
        /**
         * 关闭深度测试模式
         */
        Context3DProxy.prototype.disableDepth = function () {
            if (!this._depthTest) {
                return;
            }
            this._depthTest = false;
            Context3DProxy.gl.disable(Context3DProxy.gl.DEPTH_TEST);
        };
        /**
         * 开启剔除面模式
         */
        Context3DProxy.prototype.enableCullFace = function () {
            if (this._cullFace) {
                return;
            }
            this._cullFace = true;
            Context3DProxy.gl.enable(Context3DProxy.gl.CULL_FACE);
        };
        /**
         * 关闭剔除面模式
         */
        Context3DProxy.prototype.disableCullFace = function () {
            if (!this._cullFace) {
                return;
            }
            this._cullFace = false;
            Context3DProxy.gl.disable(Context3DProxy.gl.CULL_FACE);
        };
        /**
         * 开启混合模式
         */
        Context3DProxy.prototype.enableBlend = function () {
            // if (this._blend) {
            //     return;
            // }
            // this._blend = true;
            Context3DProxy.gl.enable(Context3DProxy.gl.BLEND);
        };
        /**
         * 关闭混合模式
         */
        Context3DProxy.prototype.disableBlend = function () {
            // if (!this._blend) {
            //     return;
            // }
            // this._blend = false;
            Context3DProxy.gl.disable(Context3DProxy.gl.BLEND);
        };
        /**
         * 深度测试比较模式
         */
        Context3DProxy.prototype.depthFunc = function (compareMode) {
            if (compareMode === void 0) { compareMode = 0; }
            if (this._depthCompareMode == compareMode) {
                return;
            }
            this._depthCompareMode = compareMode;
            Context3DProxy.gl.depthFunc(compareMode);
        };
        /**
         * 绘制模型元素
         * @param type 图元类型
         * @param first 第一个顶点索引
         * @param length 顶点个数
         */
        Context3DProxy.prototype.drawArrays = function (type, first, length) {
            Context3DProxy.gl.drawArrays(type, first, length);
        };
        /**
         * 绘制模型元素
         * @param type 图元类型
         * @param indexBuffer 索引数据
         * @param offset 顶点索引偏移 (字节数)
         * @param length 顶点个数
         */
        Context3DProxy.prototype.drawElement = function (type, offset, length) {
            Context3DProxy.gl.drawElements(type, length, Context3DProxy.gl.UNSIGNED_SHORT, offset);
        };
        /**
         * 绘制提交
         */
        Context3DProxy.prototype.flush = function () {
            Context3DProxy.gl.flush();
        };
        /**
         * 清除指定缓冲区
         */
        Context3DProxy.prototype.clear = function (mask) {
            Context3DProxy.gl.clear(mask);
        };
        /**
         * 清除渲染区域的颜色和深度
         */
        Context3DProxy.prototype.clearColor = function (r, g, b, a) {
            Context3DProxy.gl.clearColor(r, g, b, a);
        };
        /**
         * 清除渲染区域的模板
         */
        Context3DProxy.prototype.clearStencil = function (stencil) {
            Context3DProxy.gl.clearStencil(stencil);
        };
        return Context3DProxy;
    }());
    dou3d.Context3DProxy = Context3DProxy;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 2D 纹理
     * @author wizardc
     */
    var ContextTexture2D = /** @class */ (function () {
        function ContextTexture2D() {
            /**
             * 显卡中上传使用的 border 边框像素大小
             */
            this.border = 0;
        }
        ContextTexture2D.prototype.dispose = function () {
            if (this.texture) {
                dou3d.Context3DProxy.gl.deleteTexture(this.texture);
                this.texture = null;
            }
            if (this.frameBuffer) {
                dou3d.Context3DProxy.gl.deleteFramebuffer(this.frameBuffer);
                this.frameBuffer = null;
            }
            if (this.renderbuffer) {
                dou3d.Context3DProxy.gl.deleteRenderbuffer(this.renderbuffer);
                this.renderbuffer = null;
            }
        };
        return ContextTexture2D;
    }());
    dou3d.ContextTexture2D = ContextTexture2D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 由 6 个 ContextTexture2D 组成的立方体贴图
     * @author wizardc
     */
    var ContextTexture3D = /** @class */ (function () {
        function ContextTexture3D() {
            /**
             * 显卡中上传使用的 border 边框像素大小
             */
            this.border = 0;
        }
        ContextTexture3D.prototype.dispose = function () {
            if (this.texture) {
                dou3d.Context3DProxy.gl.deleteTexture(this.texture);
                this.texture = null;
            }
            if (this.image_front) {
                this.image_front.dispose();
                this.image_front = null;
            }
            if (this.image_back) {
                this.image_back.dispose();
                this.image_back = null;
            }
            if (this.image_left) {
                this.image_left.dispose();
                this.image_left = null;
            }
            if (this.image_right) {
                this.image_right.dispose();
                this.image_right = null;
            }
            if (this.image_up) {
                this.image_up.dispose();
                this.image_up = null;
            }
            if (this.image_down) {
                this.image_down.dispose();
                this.image_down = null;
            }
        };
        return ContextTexture3D;
    }());
    dou3d.ContextTexture3D = ContextTexture3D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 提供了用于呈现几何定义图形的上下文的帧缓冲对象
     * 渲染上下文包括一个绘图表面及其关联的资源帧缓冲对象
     * @author wizardc
     */
    var FrameBuffer = /** @class */ (function () {
        function FrameBuffer() {
        }
        return FrameBuffer;
    }());
    dou3d.FrameBuffer = FrameBuffer;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 顶点索引缓冲
     * @author wizardc
     */
    var IndexBuffer3D = /** @class */ (function () {
        function IndexBuffer3D(buffer, arrayBuffer) {
            this._buffer = buffer;
            this._arrayBuffer = arrayBuffer;
        }
        Object.defineProperty(IndexBuffer3D.prototype, "buffer", {
            get: function () {
                return this._buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IndexBuffer3D.prototype, "arrayBuffer", {
            get: function () {
                return this._arrayBuffer;
            },
            enumerable: true,
            configurable: true
        });
        IndexBuffer3D.prototype.dispose = function () {
            if (this._buffer) {
                dou3d.Context3DProxy.gl.deleteBuffer(this._buffer);
                this._buffer = null;
            }
            if (this._arrayBuffer) {
                this._arrayBuffer = null;
            }
        };
        return IndexBuffer3D;
    }());
    dou3d.IndexBuffer3D = IndexBuffer3D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 一个贴图的不同 LOD 层级数据
     * @author wizardc
     */
    var MipmapData = /** @class */ (function () {
        function MipmapData(data, width, height) {
            this.data = data;
            this.width = width;
            this.height = height;
        }
        return MipmapData;
    }());
    dou3d.MipmapData = MipmapData;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 渲染程序
     * @author wizardc
     */
    var Program3D = /** @class */ (function () {
        function Program3D(program) {
            this._id = Program3D.ID++;
            this._program = program;
        }
        Object.defineProperty(Program3D.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Program3D.prototype, "program", {
            get: function () {
                return this._program;
            },
            enumerable: true,
            configurable: true
        });
        Program3D.prototype.dispose = function () {
            if (this._program) {
                dou3d.Context3DProxy.gl.deleteProgram(this._program);
                this._program = null;
            }
        };
        Program3D.ID = 0;
        return Program3D;
    }());
    dou3d.Program3D = Program3D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 着色器
     * @author wizardc
     */
    var Shader = /** @class */ (function () {
        function Shader(shader) {
            this._id = "" + Shader.ID++;
            this._shader = shader;
        }
        Object.defineProperty(Shader.prototype, "id", {
            get: function () {
                return this._id;
            },
            set: function (value) {
                this._id = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shader.prototype, "shader", {
            get: function () {
                return this._shader;
            },
            enumerable: true,
            configurable: true
        });
        Shader.prototype.dispose = function () {
            if (this._shader) {
                dou3d.Context3DProxy.gl.deleteShader(this._shader);
                this._shader = null;
            }
        };
        Shader.ID = 0;
        return Shader;
    }());
    dou3d.Shader = Shader;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 顶点数据
     * @author wizardc
     */
    var VertexBuffer3D = /** @class */ (function () {
        function VertexBuffer3D(buffer, arrayBuffer) {
            this._buffer = buffer;
            this._arrayBuffer = arrayBuffer;
        }
        Object.defineProperty(VertexBuffer3D.prototype, "buffer", {
            get: function () {
                return this._buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VertexBuffer3D.prototype, "arrayBuffer", {
            get: function () {
                return this._arrayBuffer;
            },
            enumerable: true,
            configurable: true
        });
        VertexBuffer3D.prototype.dispose = function () {
            if (this._buffer) {
                dou3d.Context3DProxy.gl.deleteBuffer(this._buffer);
                this._buffer = null;
            }
            if (this._arrayBuffer) {
                this._arrayBuffer = null;
            }
        };
        return VertexBuffer3D;
    }());
    dou3d.VertexBuffer3D = VertexBuffer3D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 3D 空间中的一个对象
     * @author wizardc
     */
    var Object3D = /** @class */ (function (_super) {
        __extends(Object3D, _super);
        function Object3D() {
            var _this = _super.call(this) || this;
            _this._visible = true;
            _this._layer = 0 /* normal */;
            _this._globalMatrix = new dou3d.Matrix4();
            _this._position = new dou3d.Vector3();
            _this._rotation = new dou3d.Vector3();
            _this._scale = new dou3d.Vector3(1, 1, 1);
            _this._orientation = new dou3d.Quaternion();
            _this._globalPosition = new dou3d.Vector3();
            _this._globalRotation = new dou3d.Vector3();
            _this._globalScale = new dou3d.Vector3(1, 1, 1);
            _this._globalOrientation = new dou3d.Quaternion();
            return _this;
        }
        Object.defineProperty(Object3D.prototype, "position", {
            get: function () {
                return this._position;
            },
            set: function (value) {
                if (this._position.equal(value)) {
                    return;
                }
                this._position.copy(value);
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "x", {
            get: function () {
                return this._position.x;
            },
            set: function (value) {
                if (this._position.x == value) {
                    return;
                }
                this._position.x = value;
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "y", {
            get: function () {
                return this._position.y;
            },
            set: function (value) {
                if (this._position.y == value) {
                    return;
                }
                this._position.y = value;
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "z", {
            get: function () {
                return this._position.z;
            },
            set: function (value) {
                if (this._position.z == value) {
                    return;
                }
                this._position.z = value;
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                if (this._rotation.equal(value)) {
                    return;
                }
                this._rotation.copy(value);
                this._orientation.fromEuler(this._rotation.x, this._rotation.y, this._rotation.z);
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "rotationX", {
            get: function () {
                return this._rotation.x;
            },
            set: function (value) {
                if (this._rotation.x == value) {
                    return;
                }
                this._rotation.x = value;
                this._orientation.fromEuler(this._rotation.x, this._rotation.y, this._rotation.z);
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "rotationY", {
            get: function () {
                return this._rotation.y;
            },
            set: function (value) {
                if (this._rotation.y == value) {
                    return;
                }
                this._rotation.y = value;
                this._orientation.fromEuler(this._rotation.x, this._rotation.y, this._rotation.z);
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "rotationZ", {
            get: function () {
                return this._rotation.z;
            },
            set: function (value) {
                if (this._rotation.z == value) {
                    return;
                }
                this._rotation.z = value;
                this._orientation.fromEuler(this._rotation.x, this._rotation.y, this._rotation.z);
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "scale", {
            get: function () {
                return this._scale;
            },
            set: function (value) {
                if (this._scale.equal(value)) {
                    return;
                }
                this._scale.copy(value);
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "scaleX", {
            get: function () {
                return this._scale.x;
            },
            set: function (value) {
                if (this._scale.x == value) {
                    return;
                }
                this._scale.x = value;
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "scaleY", {
            get: function () {
                return this._scale.y;
            },
            set: function (value) {
                if (this._scale.y == value) {
                    return;
                }
                this._scale.y = value;
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "scaleZ", {
            get: function () {
                return this._scale.z;
            },
            set: function (value) {
                if (this._scale.z == value) {
                    return;
                }
                this._scale.z = value;
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "orientation", {
            get: function () {
                return this._orientation;
            },
            set: function (value) {
                if (this._orientation.equal(value)) {
                    return;
                }
                this._orientation.copy(value);
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "orientationX", {
            get: function () {
                return this._orientation.x;
            },
            set: function (value) {
                if (this._orientation.x == value) {
                    return;
                }
                this._orientation.x = value;
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "orientationY", {
            get: function () {
                return this._orientation.y;
            },
            set: function (value) {
                if (this._orientation.y == value) {
                    return;
                }
                this._orientation.y = value;
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "orientationZ", {
            get: function () {
                return this._orientation.z;
            },
            set: function (value) {
                if (this._orientation.z == value) {
                    return;
                }
                this._orientation.z = value;
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "orientationW", {
            get: function () {
                return this._orientation.w;
            },
            set: function (value) {
                if (this._orientation.w == value) {
                    return;
                }
                this._orientation.w = value;
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "globalPosition", {
            get: function () {
                this.validateTransformNow();
                return this._globalPosition;
            },
            set: function (value) {
                if (this._parent) {
                    var quaternion = dou.recyclable(dou3d.Quaternion);
                    quaternion.inverse(this._parent.globalOrientation);
                    var vector = dou.recyclable(dou3d.Vector3);
                    vector.subtract(this._parent._globalPosition, value);
                    quaternion.transformVector(vector, vector);
                    vector.divide(this._parent._globalScale);
                    this._position.copy(vector);
                    quaternion.recycle();
                    vector.recycle();
                    this.invalidTransform();
                }
                else {
                    this._position.copy(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "globalRotation", {
            get: function () {
                this.validateTransformNow();
                return this._globalRotation;
            },
            set: function (value) {
                var quaternion = dou.recyclable(dou3d.Quaternion);
                quaternion.fromEuler(value.x, value.y, value.z);
                this._globalOrientation.copy(quaternion);
                quaternion.recycle();
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "globalScale", {
            get: function () {
                this.validateTransformNow();
                return this._globalScale;
            },
            set: function (value) {
                if (this._parent) {
                    var vector = dou.recyclable(dou3d.Vector3);
                    vector.divide(value, this._parent._globalScale);
                    this._scale.copy(vector);
                    vector.recycle();
                    this.invalidTransform();
                }
                else {
                    this._scale.copy(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "globalOrientation", {
            get: function () {
                this.validateTransformNow();
                return this._globalOrientation;
            },
            set: function (value) {
                if (this._parent) {
                    var quaternion = dou.recyclable(dou3d.Quaternion);
                    quaternion.inverse(this._parent.globalOrientation);
                    quaternion.multiply(quaternion, value);
                    this._orientation.copy(quaternion);
                    quaternion.recycle();
                    this.invalidTransform();
                }
                else {
                    this._orientation.copy(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "globalMatrix", {
            get: function () {
                this.validateTransformNow();
                return this._globalMatrix;
            },
            set: function (value) {
                value.decompose(this._globalPosition, this._globalOrientation, this._globalScale);
                this.invalidTransform();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (value) {
                this._visible = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "layer", {
            get: function () {
                return this._layer;
            },
            /**
             * 渲染的层
             */
            set: function (value) {
                this._layer = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "controller", {
            get: function () {
                return this._controller;
            },
            set: function (value) {
                this._controller = value;
            },
            enumerable: true,
            configurable: true
        });
        Object3D.prototype.setParent = function (parent) {
            this._parent = parent;
        };
        Object3D.prototype.invalidTransform = function () {
            this.invalidGlobalTransform();
        };
        Object3D.prototype.invalidGlobalTransform = function () {
            this._globalTransformChanged = true;
        };
        /**
         * 立即刷新当前的变换矩阵
         */
        Object3D.prototype.validateTransformNow = function () {
            this.updateGlobalTransform();
        };
        Object3D.prototype.updateGlobalTransform = function () {
            if (!this._globalTransformChanged) {
                return;
            }
            if (this._parent) {
                this._globalOrientation.multiply(this._parent.globalOrientation, this._orientation);
                this._globalOrientation.toEuler(this._globalRotation);
                this._globalScale.multiply(this._parent.globalScale, this._scale);
                this._globalPosition.multiply(this._parent.globalScale, this._position);
                this._parent.globalOrientation.transformVector(this._globalPosition, this._globalPosition);
                this._globalPosition.add(this._parent.globalPosition, this._globalPosition);
            }
            else {
                this._globalOrientation.copy(this._orientation);
                this._globalPosition.copy(this._position);
                this._globalScale.copy(this._scale);
                this._globalRotation.copy(this._rotation);
            }
            this._globalTransformChanged = false;
            this.markTransform();
            this.onTransformUpdate();
        };
        Object3D.prototype.markTransform = function () {
            this._globalMatrix.compose(this._globalPosition, this._globalOrientation, this._globalScale);
        };
        Object3D.prototype.onTransformUpdate = function () {
        };
        /**
         * 朝向指定位置
         */
        Object3D.prototype.lookAt = function (from, to, up) {
            if (up === void 0) { up = dou3d.Vector3.UP; }
            this.globalPosition = from;
            var matrix = dou.recyclable(dou3d.Matrix4);
            matrix.lookAt(from, to, up);
            matrix.inverse();
            var quaternion = dou.recyclable(dou3d.Quaternion);
            matrix.decompose(null, quaternion);
            this.globalOrientation = quaternion;
            matrix.recycle();
            quaternion.recycle();
        };
        /**
         * 朝向指定的目标
         */
        Object3D.prototype.lookAtTarget = function (target) {
            var vector = dou.recyclable(dou3d.Vector4);
            target.globalMatrix.transformVector(dou3d.Vector3.UP, vector);
            var matrix = dou.recyclable(dou3d.Matrix4);
            matrix.lookAt(this._globalPosition, this._globalPosition, vector);
            matrix.inverse();
            var quaternion = dou.recyclable(dou3d.Quaternion);
            matrix.decompose(null, quaternion);
            this.globalOrientation = quaternion;
            vector.recycle();
            matrix.recycle();
            quaternion.recycle();
        };
        /**
         * 将对象的本地坐标转换为全局坐标
         */
        Object3D.prototype.localToGlobal = function (local, result) {
            result = result || dou.recyclable(dou3d.Vector4);
            if (this._parent) {
                this.globalMatrix.transformVector(local, result);
            }
            else {
                result.x = local.x;
                result.y = local.y;
                result.z = local.z;
            }
            return result;
        };
        /**
         * 将全局坐标转换为对象的本地坐标
         */
        Object3D.prototype.globalToLocal = function (local, result) {
            result = result || dou.recyclable(dou3d.Vector4);
            if (this._parent) {
                var inverse = dou.recyclable(dou3d.Matrix4);
                inverse.copy(this.globalMatrix);
                inverse.inverse();
                inverse.transformVector(local, result);
                inverse.recycle();
            }
            else {
                result.x = local.x;
                result.y = local.y;
                result.z = local.z;
            }
            return result;
        };
        /**
         * 更新
         * @param time 当前时间
         * @param delay 每帧时间间隔
         * @param camera 当前渲染的摄相机
         */
        Object3D.prototype.update = function (time, delay, camera) {
            if (this._controller && this._controller.autoUpdate) {
                this._controller.update(time, delay);
            }
        };
        /**
         * 销毁本对象
         */
        Object3D.prototype.dispose = function () {
            this._controller = null;
        };
        return Object3D;
    }(dou.EventDispatcher));
    dou3d.Object3D = Object3D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 场景中的可见物体, 可渲染对象
     * 在渲染之前会将渲染树中对象进行筛选, 只有继承 RenderBase 的对象才会进入渲染管线
     * @author wizardc
     */
    var RenderBase = /** @class */ (function (_super) {
        __extends(RenderBase, _super);
        function RenderBase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._materialCount = 0;
            _this._order = 0;
            /**
             * 如果使用到多个材质时, 多个材质会存储在这里
             */
            _this.multiMaterial = {};
            /**
             * 类型
             */
            _this.type = "";
            return _this;
        }
        Object.defineProperty(RenderBase.prototype, "order", {
            get: function () {
                return this._order;
            },
            /**
             * 渲染排序的参数，数值越大，先渲染
             */
            set: function (value) {
                this._order = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderBase.prototype, "geometry", {
            get: function () {
                return this._geometry;
            },
            set: function (value) {
                if (this._geometry == value) {
                    return;
                }
                if (value) {
                    value.incRef();
                }
                if (this._geometry) {
                    this._geometry.dispose();
                }
                this._geometry = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderBase.prototype, "lightGroup", {
            get: function () {
                return this._lightGroup;
            },
            /**
             * 设置材质球接受的灯光组
             */
            set: function (lightGroup) {
                this._lightGroup = lightGroup;
                for (var id in this.multiMaterial) {
                    this.multiMaterial[id].lightGroup = this._lightGroup;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 增加一个材质
         */
        RenderBase.prototype.addSubMaterial = function (id, material) {
            if (!this.multiMaterial[id]) {
                this._materialCount++;
            }
            this.multiMaterial[id] = material;
            material.lightGroup = this._lightGroup;
        };
        /**
         * 删除一个材质
         */
        RenderBase.prototype.removeSubMaterial = function (id) {
            if (this.multiMaterial[id]) {
                delete this.multiMaterial[id];
                this._materialCount--;
            }
        };
        /**
         * 用ID得到一个材质
         */
        RenderBase.prototype.getMaterial = function (id) {
            return this.multiMaterial[id];
        };
        /**
         * 得到所有材质的个数
         */
        RenderBase.prototype.materialCount = function () {
            return this._materialCount;
        };
        RenderBase.prototype.update = function (time, delay, camera) {
            _super.prototype.update.call(this, time, delay, camera);
            if (this.animation) {
                this.animation.update(time, delay, this._geometry);
            }
            if (this.geometry.subGeometrys.length <= 0) {
                this.geometry.buildDefaultSubGeometry();
            }
        };
        RenderBase.prototype.dispose = function () {
            this.geometry = null;
            this.multiMaterial = {};
        };
        return RenderBase;
    }(dou3d.Object3D));
    dou3d.RenderBase = RenderBase;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 3D 容器对象
     * @author wizardc
     */
    var ObjectContainer3D = /** @class */ (function (_super) {
        __extends(ObjectContainer3D, _super);
        function ObjectContainer3D() {
            var _this = _super.call(this) || this;
            _this._children = [];
            return _this;
        }
        Object.defineProperty(ObjectContainer3D.prototype, "children", {
            get: function () {
                return this._children;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectContainer3D.prototype, "numChildren", {
            get: function () {
                return this._children.length;
            },
            enumerable: true,
            configurable: true
        });
        ObjectContainer3D.prototype.invalidGlobalTransform = function () {
            _super.prototype.invalidGlobalTransform.call(this);
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.invalidTransform();
            }
        };
        ObjectContainer3D.prototype.addChild = function (child) {
            if (this._children.indexOf(child) != -1) {
                return child;
            }
            if (child.parent) {
                child.parent.removeChild(child);
            }
            child.setParent(this);
            child.invalidTransform();
            this._children.push(child);
            return child;
        };
        ObjectContainer3D.prototype.getChildAt = function (index) {
            return this._children[index];
        };
        ObjectContainer3D.prototype.getChildIndex = function (child) {
            return this._children.indexOf(child);
        };
        ObjectContainer3D.prototype.removeChild = function (child) {
            var index = this._children.indexOf(child);
            if (index == -1) {
                return child;
            }
            this._children.splice(index, 1);
            child.setParent(null);
            child.invalidTransform();
            return child;
        };
        ObjectContainer3D.prototype.removeChildAt = function (index) {
            if (index < 0 || index >= this._children.length) {
                return null;
            }
            var child = this._children[index];
            this._children.splice(index, 1);
            child.setParent(null);
            child.invalidTransform();
            return child;
        };
        ObjectContainer3D.prototype.removeAllChildren = function () {
            while (this._children.length > 0) {
                this.removeChildAt(0);
            }
        };
        ObjectContainer3D.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.dispose();
            }
            this.removeAllChildren();
        };
        return ObjectContainer3D;
    }(dou3d.Object3D));
    dou3d.ObjectContainer3D = ObjectContainer3D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 模型网格
     * @author wizardc
     */
    var Mesh = /** @class */ (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, material, animation) {
            var _this = _super.call(this) || this;
            _this.type = "mesh";
            _this.geometry = geometry;
            _this.material = material || new dou3d.TextureMaterial();
            _this.addSubMaterial(0, _this.material);
            if (animation) {
                _this.animation = animation;
            }
            else {
                if (geometry) {
                    if (_this.geometry.vertexFormat & 64 /* VF_SKIN */) {
                        _this.animation = new dou3d.SkeletonAnimation();
                    }
                }
            }
            return _this;
        }
        Mesh.prototype.clone = function () {
            var cloneMesh = new Mesh(this.geometry, this.material, this.animation ? this.animation.clone() : null);
            cloneMesh.multiMaterial = this.multiMaterial;
            return cloneMesh;
        };
        return Mesh;
    }(dou3d.RenderBase));
    dou3d.Mesh = Mesh;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 公告板, 始终面朝摄像机的面板
     * @author wizardc
     */
    var Billboard = /** @class */ (function (_super) {
        __extends(Billboard, _super);
        function Billboard(material, geometry, width, height) {
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            var _this = this;
            if (!geometry) {
                geometry = new dou3d.PlaneGeometry(width, height, 1, 1, 1, 1);
            }
            _this = _super.call(this, geometry, material) || this;
            _this._plane = _this.geometry;
            return _this;
        }
        Billboard.prototype.update = function (time, delay, camera) {
            _super.prototype.update.call(this, time, delay, camera);
            var euler = dou.recyclable(dou3d.Vector3);
            camera.globalOrientation.toEuler(euler);
            var orientation = dou.recyclable(dou3d.Quaternion);
            orientation.fromEuler(euler.x + dou3d.MathUtil.toRadians(270), euler.y, euler.z);
            this.globalOrientation = orientation;
            euler.recycle();
            orientation.recycle();
        };
        Billboard.prototype.clone = function () {
            var cloneMesh = new Billboard(this.material, this.geometry, this._plane.width, this._plane.height);
            cloneMesh.multiMaterial = this.multiMaterial;
            return cloneMesh;
        };
        return Billboard;
    }(dou3d.Mesh));
    dou3d.Billboard = Billboard;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 渲染线框
     * * 使用LINES的模式进行渲染
     * @author wizardc
     */
    var Wireframe = /** @class */ (function (_super) {
        __extends(Wireframe, _super);
        function Wireframe(color) {
            if (color === void 0) { color = 0x7e7e7e; }
            var _this = _super.call(this) || this;
            _this.type = "wireframe";
            _this.geometry = new dou3d.Geometry();
            _this.material = new dou3d.ColorMaterial(color);
            _this.addSubMaterial(0, _this.material);
            _this.material.drawMode = dou3d.Context3DProxy.gl.LINES;
            _this.geometry.vertexFormat = 1 /* VF_POSITION */ | 2 /* VF_NORMAL */ | 8 /* VF_COLOR */ | 16 /* VF_UV0 */;
            return _this;
        }
        Wireframe.prototype.fromVertexs = function (src, vf) {
            if (vf === void 0) { vf = 1 /* VF_POSITION */; }
            if (src) {
                this.geometry.setVerticesForIndex(0, vf, src, src.length / dou3d.GeometryUtil.fromVertexFormatToLength(vf));
                this.geometry.indexCount = (this.geometry.vertexCount - 1) * 2;
                for (var i = 0; i < this.geometry.vertexCount - 1; ++i) {
                    this.geometry.indexArray[i * 2 + 0] = i;
                    this.geometry.indexArray[i * 2 + 1] = i + 1;
                }
            }
        };
        Wireframe.prototype.fromVertexsEx = function (src, vf) {
            if (vf === void 0) { vf = 1 /* VF_POSITION */; }
            if (src) {
                this.geometry.setVerticesForIndex(0, vf, src, src.length / dou3d.GeometryUtil.fromVertexFormatToLength(vf));
                this.geometry.indexCount = this.geometry.vertexCount;
                for (var i = 0; i < this.geometry.vertexCount; ++i) {
                    this.geometry.indexArray[i] = i;
                }
            }
        };
        Wireframe.prototype.fromGeometry = function (geo) {
            var target = [];
            geo.getVertexForIndex(0, 1 /* VF_POSITION */ | 8 /* VF_COLOR */, target, geo.vertexCount);
            this.geometry.setVerticesForIndex(0, 1 /* VF_POSITION */ | 8 /* VF_COLOR */, target, geo.vertexCount);
            this.geometry.indexCount = geo.faceCount * 6;
            for (var i = 0; i < geo.faceCount; ++i) {
                var _0 = geo.indexArray[i * 3 + 0];
                var _1 = geo.indexArray[i * 3 + 1];
                var _2 = geo.indexArray[i * 3 + 2];
                this.geometry.indexArray[i * 6 + 0] = _0;
                this.geometry.indexArray[i * 6 + 1] = _1;
                this.geometry.indexArray[i * 6 + 2] = _1;
                this.geometry.indexArray[i * 6 + 3] = _2;
                this.geometry.indexArray[i * 6 + 4] = _2;
                this.geometry.indexArray[i * 6 + 5] = _0;
            }
        };
        return Wireframe;
    }(dou3d.RenderBase));
    dou3d.Wireframe = Wireframe;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 天空盒
     * @author wizardc
     */
    var SkyBox = /** @class */ (function (_super) {
        __extends(SkyBox, _super);
        function SkyBox(geometry, material, camera) {
            var _this = _super.call(this, geometry, material) || this;
            _this.camera = camera;
            material.cullMode = dou3d.Context3DProxy.gl.FRONT;
            return _this;
        }
        SkyBox.prototype.update = function (time, delay, camera) {
            _super.prototype.update.call(this, time, delay, camera);
            if (this.camera) {
                this.position = this.camera.globalPosition;
            }
        };
        return SkyBox;
    }(dou3d.Mesh));
    dou3d.SkyBox = SkyBox;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 渲染对象收集器基类
     * @author wizardc
     */
    var CollectBase = /** @class */ (function () {
        function CollectBase() {
            this._renderList = [];
        }
        Object.defineProperty(CollectBase.prototype, "renderList", {
            /**
             * 可渲染对象列表
             */
            get: function () {
                return this._renderList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollectBase.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            /**
             * 场景对象
             */
            set: function (scene) {
                this._scene = scene;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 查找一个对象在渲染列表的下标
         */
        CollectBase.prototype.findRenderObject = function (target) {
            for (var i = 0; i < this._renderList.length; ++i) {
                if (this._renderList[i] === target) {
                    return i;
                }
            }
            return -1;
        };
        /**
         * 数据更新
         */
        CollectBase.prototype.update = function (camera) {
            camera.validateTransformNow();
            this._renderList.length = 0;
        };
        return CollectBase;
    }());
    dou3d.CollectBase = CollectBase;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 渲染对象收集器, 把渲染对象进行可视筛选, 并且划分渲染层级, 依次排序到加入列表
     * @author wizardc
     */
    var EntityCollect = /** @class */ (function (_super) {
        __extends(EntityCollect, _super);
        function EntityCollect() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.layerMap = {};
            return _this;
        }
        /**
         * 数据更新 处理需要渲染的对象
         */
        EntityCollect.prototype.update = function (camera) {
            _super.prototype.update.call(this, camera);
            this.clearLayerList();
            this.applyRender(this._scene.root, camera);
            for (var i = 0; i < 2 /* max */; i++) {
                this.layerMap[i].sort(this.sortByOrder);
                var listLen = this.layerMap[i].length;
                for (var j = 0; j < listLen; j++) {
                    this._renderList.push(this.layerMap[i][j]);
                }
            }
        };
        EntityCollect.prototype.clearLayerList = function () {
            for (var i = 0; i < 2 /* max */; i++) {
                if (!this.layerMap[i]) {
                    this.layerMap[i] = [];
                }
                else {
                    this.layerMap[i].length = 0;
                }
            }
        };
        EntityCollect.prototype.applyRender = function (child, camera) {
            if (!child.visible) {
                return;
            }
            if (child instanceof dou3d.ObjectContainer3D) {
                for (var i = 0; i < child.children.length; i++) {
                    this.applyRender(child.children[i], camera);
                }
            }
            else if (child instanceof dou3d.RenderBase && child.material) {
                this.addRenderList(child, camera);
            }
        };
        /**
         * 尝试将一个渲染对象进行视锥体裁剪放入到渲染队列中
         */
        EntityCollect.prototype.addRenderList = function (renderItem, camera, cameraCulling) {
            if (cameraCulling === void 0) { cameraCulling = true; }
            if (renderItem.material) {
                if (renderItem.layer == 0 /* normal */ && renderItem.material.materialData.alphaBlending) {
                    this.layerMap[1 /* alpha */].push(renderItem);
                }
                else {
                    for (var i = 0; i < 2 /* max */; i++) {
                        if (renderItem.layer == i) {
                            this.layerMap[i].push(renderItem);
                        }
                    }
                }
            }
        };
        /**
         * 距离摄像机由远到近的排序
         */
        EntityCollect.prototype.sort = function (a, b, camera) {
            var dis1 = dou3d.Vector3.getDistance(a.globalPosition, camera.position);
            var dis2 = dou3d.Vector3.getDistance(b.globalPosition, camera.position);
            if (dis1 > dis2) {
                return -1;
            }
            else if (dis1 < dis2) {
                return 1;
            }
            return 0;
        };
        /**
         * 根据 order 来进行降序排序
         */
        EntityCollect.prototype.sortByOrder = function (a, b) {
            return b.order - a.order;
        };
        return EntityCollect;
    }(dou3d.CollectBase));
    dou3d.EntityCollect = EntityCollect;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 心跳计时器
     * @author wizardc
     */
    var Ticker = /** @class */ (function (_super) {
        __extends(Ticker, _super);
        function Ticker(engine) {
            var _this = _super.call(this) || this;
            _this._deltaTime = 0;
            _this._engine = engine;
            dou3d.Engine.context3DProxy.enableBlend();
            dou3d.Engine.context3DProxy.enableCullFace();
            dou3d.Context3DProxy.gl.enable(dou3d.Context3DProxy.gl.SCISSOR_TEST);
            dou3d.Context3DProxy.gl.enableVertexAttribArray(0);
            dou3d.Context3DProxy.gl.enableVertexAttribArray(1);
            dou3d.Context3DProxy.gl.enableVertexAttribArray(2);
            dou3d.Context3DProxy.gl.enableVertexAttribArray(3);
            dou3d.Context3DProxy.gl.enableVertexAttribArray(4);
            dou3d.Context3DProxy.gl.enableVertexAttribArray(5);
            dou3d.Context3DProxy.gl.enableVertexAttribArray(6);
            dou3d.ShaderUtil.load();
            dou3d.ShaderPool.register(dou3d.Engine.context3DProxy);
            return _this;
        }
        Object.defineProperty(Ticker.prototype, "deltaTime", {
            get: function () {
                return this._deltaTime;
            },
            enumerable: true,
            configurable: true
        });
        Ticker.prototype.updateLogic = function (passedTime) {
            this._deltaTime = passedTime;
            dou.Tween.tick(passedTime, false);
            var viewRect = this._engine.viewRect;
            var view3Ds = this._engine.view3Ds;
            dou3d.Context3DProxy.canvasRectangle = viewRect;
            dou3d.Engine.context3DProxy.viewPort(0, 0, viewRect.w, viewRect.h);
            dou3d.Engine.context3DProxy.setScissorRectangle(0, 0, viewRect.w, viewRect.h);
            for (var i = 0; i < view3Ds.length; i++) {
                view3Ds[i].update(dou.getTimer(), passedTime);
            }
            dou3d.Context3DProxy.gl.flush();
        };
        return Ticker;
    }(dou.TickerBase));
    dou3d.Ticker = Ticker;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 3D 渲染视图
     * - view3D 是整个 3D 引擎的渲染视口, 可以控制渲染窗口的大小和渲染的方式
     * - 包含一个摄像机对象和一个场景对象
     * - 目前不支持添加多个摄像机
     * @author wizardc
     */
    var View3D = /** @class */ (function (_super) {
        __extends(View3D, _super);
        function View3D(x, y, width, height, camera) {
            var _this = _super.call(this) || this;
            _this._cleanParmerts = dou3d.Context3DProxy.gl.COLOR_BUFFER_BIT | dou3d.Context3DProxy.gl.DEPTH_BUFFER_BIT;
            _this._viewPort = new dou3d.Rectangle();
            _this._camera = camera || new dou3d.Camera3D(0 /* perspective */);
            _this._camera.name = "MainCamera";
            _this._scene = new dou3d.Scene3D();
            _this._scene.root.addChild(_this._camera);
            _this._render = new dou3d.MultiRenderer(0 /* diffusePass */);
            _this._entityCollect = new dou3d.EntityCollect();
            _this._entityCollect.scene = _this._scene;
            _this._backColor = new dou3d.Vector4(0.3, 0.3, 0.6, 1);
            _this.x = x;
            _this.y = y;
            _this.width = width;
            _this.height = height;
            _this._camera.aspectRatio = _this._viewPort.w / _this._viewPort.h;
            _this._camera.updateViewport(_this._viewPort.x, _this._viewPort.y, _this._viewPort.w, _this._viewPort.h);
            return _this;
        }
        Object.defineProperty(View3D.prototype, "x", {
            get: function () {
                return this._viewPort.x;
            },
            set: function (value) {
                this._viewPort.x = value;
                this._camera.updateViewport(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View3D.prototype, "y", {
            get: function () {
                return this._viewPort.y;
            },
            set: function (value) {
                this._viewPort.y = value;
                this._camera.updateViewport(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View3D.prototype, "width", {
            get: function () {
                return this._viewPort.w;
            },
            set: function (value) {
                this._viewPort.w = value;
                this._camera.aspectRatio = this._viewPort.w / this._viewPort.h;
                this._camera.updateViewport(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View3D.prototype, "height", {
            get: function () {
                return this._viewPort.h;
            },
            set: function (value) {
                this._viewPort.h = value;
                this._camera.aspectRatio = this._viewPort.w / this._viewPort.h;
                this._camera.updateViewport(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View3D.prototype, "viewPort", {
            get: function () {
                return this._viewPort;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 检测是否在当前视口内
         */
        View3D.prototype.inView3D = function (x, y) {
            var vec2 = dou.recyclable(dou3d.Vector2);
            vec2.set(x, y);
            var result = this._viewPort.contains(vec2);
            vec2.recycle();
            return result;
        };
        /**
         * 设置是否清除背景缓冲颜色和深度
         * @param cleanColor 是否清除背景缓冲颜色
         * @param cleanDepth 是否清除背景缓冲深度
         */
        View3D.prototype.blender = function (cleanColor, cleanDepth) {
            this._cleanParmerts = (cleanColor ? dou3d.Context3DProxy.gl.COLOR_BUFFER_BIT : 0) | (cleanDepth ? dou3d.Context3DProxy.gl.DEPTH_BUFFER_BIT : 0);
        };
        Object.defineProperty(View3D.prototype, "backColor", {
            get: function () {
                return (this._backColor.w * 255 << 24) | (this._backColor.x * 255 << 16) | (this._backColor.y * 255 << 8) | (this._backColor.z * 255);
            },
            /**
             * 背景颜色
             */
            set: function (value) {
                this._backColor.w = (value >> 24 & 0xff) / 255;
                this._backColor.x = (value >> 16 & 0xff) / 255;
                this._backColor.y = (value >> 8 & 0xff) / 255;
                this._backColor.z = (value & 0xff) / 255;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View3D.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            /**
             * 场景
             */
            set: function (value) {
                this._scene = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View3D.prototype, "camera3D", {
            get: function () {
                return this._camera;
            },
            /**
             * 摄像机
             */
            set: function (value) {
                this._camera = value;
                this._camera.aspectRatio = this._viewPort.w / this._viewPort.h;
                this._camera.updateViewport(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View3D.prototype, "entityCollect", {
            /**
             * 实体收集对象
             */
            get: function () {
                return this._entityCollect;
            },
            enumerable: true,
            configurable: true
        });
        View3D.prototype.update = function (time, delay) {
            this._camera.viewPort = this._viewPort;
            this.updateObject3D(this._scene.root, time, delay);
            dou3d.Engine.context3DProxy.viewPort(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
            dou3d.Engine.context3DProxy.setScissorRectangle(this._viewPort.x, this._viewPort.y, this._viewPort.w, this._viewPort.h);
            this._entityCollect.update(this._camera);
            if (dou3d.ShadowCast.instance.enableShadow) {
                dou3d.ShadowCast.instance.update(this._entityCollect, this._camera, time, delay, this._viewPort);
            }
            if (this._cleanParmerts & dou3d.Context3DProxy.gl.COLOR_BUFFER_BIT) {
                dou3d.Engine.context3DProxy.clearColor(this._backColor.x, this._backColor.y, this._backColor.z, this._backColor.w);
            }
            dou3d.Engine.context3DProxy.clear(this._cleanParmerts);
            this._render.draw(time, delay, dou3d.Engine.context3DProxy, this._entityCollect, this._camera, this._viewPort);
        };
        View3D.prototype.updateObject3D = function (object3d, time, delay) {
            if (object3d) {
                object3d.dispatch(dou3d.Event3D.ENTER_FRAME);
                object3d.update(time, delay, this.camera3D);
                if (object3d instanceof dou3d.ObjectContainer3D) {
                    for (var i = 0; i < object3d.children.length; ++i) {
                        this.updateObject3D(object3d.children[i], time, delay);
                    }
                }
                object3d.dispatch(dou3d.Event3D.EXIT_FRAME);
            }
        };
        return View3D;
    }(dou.EventDispatcher));
    dou3d.View3D = View3D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 骨骼关节
     * * 属于骨架类的组成部分
     * @author wizardc
     */
    var Joint = /** @class */ (function () {
        function Joint(name) {
            this.name = name;
            this.parentIndex = -1;
            this.scale = new dou3d.Vector3(1, 1, 1);
            this.orientation = new dou3d.Quaternion();
            this.translation = new dou3d.Vector3();
            this.localMatrix = new dou3d.Matrix4();
            this.worldMatrix = new dou3d.Matrix4();
            this.worldMatrixValid = false;
        }
        /**
         * 构建骨骼本地矩阵
         */
        Joint.prototype.buildLocalMatrix = function (scale, rotation, translation) {
            this.scale.copy(scale);
            this.translation.copy(translation);
            if (rotation instanceof dou3d.Vector3) {
                this.orientation.fromEuler(rotation.x * dou3d.MathUtil.DEG_RAD, rotation.y * dou3d.MathUtil.DEG_RAD, rotation.z * dou3d.MathUtil.DEG_RAD, 6 /* ZYX */);
            }
            else {
                this.orientation.copy(rotation);
            }
            this.localMatrix.compose(this.translation, this.orientation, this.scale);
            this.worldMatrixValid = false;
        };
        /**
         * 构建骨骼逆矩阵
         */
        Joint.prototype.buildInverseMatrix = function (scale, rotation, translation) {
            this.inverseMatrix = this.inverseMatrix || new dou3d.Matrix4();
            if (rotation instanceof dou3d.Vector3) {
                var quaternion = dou.recyclable(dou3d.Quaternion);
                quaternion.fromEuler(rotation.x * dou3d.MathUtil.DEG_RAD, rotation.y * dou3d.MathUtil.DEG_RAD, rotation.z * dou3d.MathUtil.DEG_RAD, 6 /* ZYX */);
                this.inverseMatrix.compose(translation, quaternion, scale);
                quaternion.recycle();
            }
            else {
                this.inverseMatrix.compose(translation, rotation, scale);
            }
        };
        Joint.prototype.clone = function () {
            var joint = new Joint(this.name);
            joint.parent = this.parent;
            joint.parentIndex = this.parentIndex;
            joint.scale.copy(this.scale);
            joint.orientation.copy(this.orientation);
            joint.translation.copy(this.translation);
            joint.localMatrix.copy(this.localMatrix);
            joint.worldMatrix.copy(this.worldMatrix);
            joint.worldMatrixValid = this.worldMatrixValid;
            return joint;
        };
        return Joint;
    }());
    dou3d.Joint = Joint;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 骨架类
     * * 其中包含若干个 Joint (骨骼关节) 对象
     * @author wizardc
     */
    var Skeleton = /** @class */ (function () {
        function Skeleton() {
            this.joints = [];
        }
        Object.defineProperty(Skeleton.prototype, "jointNum", {
            /**
             * 骨骼数量
             */
            get: function () {
                return this.joints.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 通过名称查找指定骨骼
         */
        Skeleton.prototype.findJoint = function (name) {
            for (var i = 0; i < this.joints.length; i++) {
                if (this.joints[i].name == name) {
                    return this.joints[i];
                }
            }
            return null;
        };
        /**
         * 通过名称查找骨骼索引编号
         */
        Skeleton.prototype.findJointIndex = function (name) {
            for (var i = 0; i < this.joints.length; i++) {
                if (this.joints[i].name == name) {
                    return i;
                }
            }
            return -1;
        };
        Skeleton.prototype.clone = function () {
            var skeleton = new Skeleton();
            for (var i = 0; i < this.joints.length; i++) {
                skeleton.joints.push(this.joints[i].clone());
            }
            return skeleton;
        };
        return Skeleton;
    }());
    dou3d.Skeleton = Skeleton;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 骨骼动画控制类
     * @author wizardc
     */
    var SkeletonAnimation = /** @class */ (function (_super) {
        __extends(SkeletonAnimation, _super);
        function SkeletonAnimation() {
            var _this = _super.call(this) || this;
            /**
             * 播放速度
             */
            _this.speed = 1;
            _this.isLoop = true;
            _this._isPlay = false;
            _this._animTime = 0;
            _this._animStateNames = [];
            _this._animStates = [];
            _this._blendSpeed = 0; //300;
            _this._blendSkeleton = null;
            _this._blendList = [];
            _this._bindList = {};
            _this._changeFrameTime = 0;
            _this._oldFrameIndex = 0;
            _this._movePosIndex = -1;
            _this._movePosObject3D = null;
            _this._movePosition = new dou3d.Vector3();
            _this._resetMovePos = true;
            _this._currentSkeletonPose = null;
            _this._oldTime = 0;
            _this._isPlay = false;
            return _this;
        }
        Object.defineProperty(SkeletonAnimation.prototype, "jointNum", {
            /**
             * 骨架骨骼数量
             */
            get: function () {
                return 48;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimation.prototype, "animStateNames", {
            /**
             * 动画名列表
             */
            get: function () {
                return this._animStateNames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimation.prototype, "animStates", {
            /**
             * 动画状态对象列表
             */
            get: function () {
                return this._animStates;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimation.prototype, "animTime", {
            get: function () {
                return this._animTime;
            },
            /**
             * 动画时间
             */
            set: function (value) {
                if (this._blendList.length <= 0) {
                    return;
                }
                if (this._blendList[this._blendList.length - 1].timePosition == value) {
                    return;
                }
                var delay = value - this._animTime;
                if (this._blendSpeed <= 0) {
                    if (this._blendList.length > 1) {
                        this._blendList.splice(0, this._blendList.length - 1);
                    }
                    this._blendList[0].weight = 1.0;
                    this._blendList[0].timePosition += delay;
                }
                else {
                    var blendSpeed = Math.abs(delay / this._blendSpeed);
                    for (var i = 0; i < this._blendList.length; ++i) {
                        var animationState = this._blendList[i];
                        if (i != this._blendList.length - 1) {
                            animationState.weight = Math.max(0, animationState.weight - blendSpeed);
                            if (animationState.weight <= 0) {
                                this._blendList.splice(i, 1);
                                --i;
                                continue;
                            }
                        }
                        else {
                            animationState.weight = Math.min(1, animationState.weight + blendSpeed);
                        }
                    }
                    this._blendList[this._blendList.length - 1].timePosition += delay;
                }
                this._animTime = this._blendList[this._blendList.length - 1].timePosition;
                var animationStateA = this._blendList[0];
                var currentSkeletonA = animationStateA.currentSkeletonPose;
                if (this._blendList.length <= 1) {
                    if (!this._blendSkeleton) {
                        this._blendSkeleton = currentSkeletonA.clone();
                    }
                    this.updateBindList(currentSkeletonA);
                    this.updateMovePos(currentSkeletonA);
                    this._currentSkeletonPose = currentSkeletonA;
                }
                else {
                    var animationStateB = this._blendList[1];
                    var currentSkeletonB = animationStateB.currentSkeletonPose;
                    if (!this._blendSkeleton) {
                        this._blendSkeleton = currentSkeletonA.clone();
                    }
                    this._blendSkeleton.lerp(currentSkeletonA, currentSkeletonB, animationStateB.weight);
                    this._blendSkeleton.resetWorldMatrix();
                    this._blendSkeleton.calculateJointWorldMatrix();
                    this.updateBindList(this._blendSkeleton);
                    this.updateMovePos(this._blendSkeleton);
                    this._currentSkeletonPose = this._blendSkeleton;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimation.prototype, "timeLength", {
            /**
             * 动画时间长度
             */
            get: function () {
                if (this._blendList.length <= 0) {
                    return 0;
                }
                return this._blendList[this._blendList.length - 1].timeLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimation.prototype, "frameIndex", {
            get: function () {
                return this.animTime / SkeletonAnimation.fps;
            },
            /**
             * 动画帧索引
             */
            set: function (value) {
                this.animTime = value * SkeletonAnimation.fps;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimation.prototype, "blendSpeed", {
            get: function () {
                return this._blendSpeed;
            },
            /**
             * 融合速度(默认300毫秒)
             */
            set: function (value) {
                this._blendSpeed = Math.max(value, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimation.prototype, "currentAnimName", {
            /**
             * 当前播放的动画名称
             */
            get: function () {
                return this._currentAnimName;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 当前动画是否正在播放
         */
        SkeletonAnimation.prototype.isPlay = function () {
            return this._isPlay;
        };
        /**
         * 添加骨骼动画剪辑对象
         */
        SkeletonAnimation.prototype.addSkeletonAnimationClip = function (animationClip) {
            var animState = new dou3d.SkeletonAnimationState(animationClip.animationName);
            animState.skeletonAnimation = this;
            animState.addAnimationClip(animationClip);
            this.addAnimState(animState);
        };
        /**
         * 添加骨骼动画状态对象
         */
        SkeletonAnimation.prototype.addAnimState = function (animState) {
            for (var i = 0; i < this._animStates.length; i++) {
                if (this._animStates[i].name == animState.name) {
                    return;
                }
            }
            this._animStates.push(animState);
            this._animStateNames.push(animState.name);
        };
        /**
         * 移除骨骼动画状态对象
         */
        SkeletonAnimation.prototype.removeAnimState = function (animState) {
            for (var i = 0; i < this._animStates.length; i++) {
                if (this._animStates[i].name == animState.name) {
                    this._animStates.slice(i, 1);
                    this._animStateNames.slice(i, 1);
                    return;
                }
            }
        };
        /**
         * 播放骨骼动画
         * @param animName 动画名称
         * @param speed 播放速度
         * @param reset 是否重置
         * @param prewarm 是否预热
         */
        SkeletonAnimation.prototype.play = function (animName, speed, reset, prewarm) {
            if (speed === void 0) { speed = 1; }
            if (reset === void 0) { reset = true; }
            if (prewarm === void 0) { prewarm = true; }
            if (this._animStates.length <= 0) {
                return;
            }
            if (!animName) {
                animName = this._animStates[0].name;
            }
            var playSkeletonAnimationState;
            for (var i = 0; i < this._animStates.length; i++) {
                if (this._animStates[i].name == animName) {
                    playSkeletonAnimationState = this._animStates[i];
                    break;
                }
            }
            if (!playSkeletonAnimationState) {
                return;
            }
            this._currentAnimName = animName;
            this._blendList.push(playSkeletonAnimationState);
            if (this._blendSpeed <= 0) {
                if (this._blendList.length > 1) {
                    this._blendList.splice(0, this._blendList.length - 1);
                }
            }
            playSkeletonAnimationState.weight = this._blendList.length > 1 ? 0 : 1;
            if (reset) {
                this._animTime = playSkeletonAnimationState.timePosition = 0;
            }
            this._changeFrameTime = playSkeletonAnimationState.timePosition;
            this._oldFrameIndex = Math.floor(this._changeFrameTime / SkeletonAnimation.fps);
            this.speed = speed;
            this._isPlay = true;
            this._resetMovePos = true;
            if (this._movePosIndex != -1) {
                var position = dou.recyclable(dou3d.Vector3);
                playSkeletonAnimationState.getSkeletonPose(0).joints[this._movePosIndex].worldMatrix.decompose(position);
                this._movePosition.copy(position);
                position.recycle();
            }
        };
        /**
         * 暂停骨骼动画播放（停留在当前帧）
         */
        SkeletonAnimation.prototype.pause = function () {
            this._isPlay = false;
        };
        /**
         * 停止骨骼动画播放（停留在第一帧）
         */
        SkeletonAnimation.prototype.stop = function () {
            this._isPlay = false;
        };
        /**
         * 更新骨骼动画
         * @param time 总时间
         * @param delay 延迟时间
         * @param geometry 该值无效
         */
        SkeletonAnimation.prototype.update = function (time, delay, geometry) {
            if (this._oldTime == time) {
                return;
            }
            this._oldTime = time;
            if (!this._isPlay) {
                return;
            }
            if (this._blendList.length <= 0) {
                return;
            }
            var mainState = this._blendList[this._blendList.length - 1];
            var delayTime = delay * this.speed;
            this._changeFrameTime += delayTime;
            var count = Math.floor(Math.abs(this._changeFrameTime / SkeletonAnimation.fps));
            var playAnimName = this.currentAnimName;
            var frameNum = 0;
            for (var i = 0; i < count; ++i) {
                if (delayTime < 0) {
                    frameNum = ((this._oldFrameIndex - 1 - i) % mainState.frameNum);
                    if (frameNum < 0) {
                        frameNum += mainState.frameNum;
                    }
                }
                else {
                    frameNum = (this._oldFrameIndex + 1 + i) % mainState.frameNum;
                }
                this.dispatch(dou3d.Event3D.ENTER_FRAME, frameNum);
                if (this.currentAnimName != playAnimName) {
                    frameNum = Math.floor(this._changeFrameTime / SkeletonAnimation.fps);
                    break;
                }
                this._changeFrameTime += (delayTime > 0) ? -SkeletonAnimation.fps : SkeletonAnimation.fps;
            }
            this._oldFrameIndex = frameNum;
            this.animTime += delay * this.speed;
        };
        SkeletonAnimation.prototype.activeState = function (time, delay, usage, geometry, context3DProxy, modeltransform, camera3D) {
            if (this._currentSkeletonPose) {
                this._currentSkeletonPose.updateGPUCacheData(geometry.geometry.skeleton, geometry.geometry.skeletonGPUData, this._movePosition);
            }
            if (usage.uniform_time) {
                context3DProxy.uniform1f(usage.uniform_time.uniformIndex, this.animTime);
            }
            context3DProxy.uniform4fv(usage.uniform_PoseMatrix.uniformIndex, geometry.geometry.skeletonGPUData);
        };
        /**
         * 绑定3D对象到骨骼
         * @param jointName 骨骼名称
         * @param obj3d 3D对象
         * @returns boolean 是否成功
         */
        SkeletonAnimation.prototype.bindToJointPose = function (jointName, object3D) {
            var jointIndex = this._animStates[0].skeletonAnimationClip.findJointIndex(jointName);
            if (jointIndex < 0) {
                return false;
            }
            var list;
            if (this._bindList[jointIndex]) {
                list = this._bindList[jointIndex];
            }
            else {
                list = [];
                this._bindList[jointIndex] = list;
            }
            list.push(object3D);
            return true;
        };
        SkeletonAnimation.prototype.setMovePosJointName = function (jointName, target) {
            var jointIndex = this._animStates[0].skeletonAnimationClip.findJointIndex(jointName);
            if (jointIndex < 0) {
                return false;
            }
            this._movePosIndex = jointIndex;
            this._movePosObject3D = target;
            this._resetMovePos = true;
            return true;
        };
        SkeletonAnimation.prototype.updateBindList = function (skeletonPose) {
            var list;
            var jointPose;
            var object3D;
            for (var jointIndex in this._bindList) {
                list = this._bindList[jointIndex];
                if (list.length <= 0) {
                    continue;
                }
                jointPose = skeletonPose.joints[jointIndex];
                if (!jointPose) {
                    continue;
                }
                for (var i = 0; i < list.length; i++) {
                    object3D = list[i];
                    var position = dou.recyclable(dou3d.Vector3);
                    var quaternion = dou.recyclable(dou3d.Quaternion);
                    jointPose.worldMatrix.decompose(position, quaternion);
                    object3D.orientation = quaternion;
                    object3D.x = position.x - this._movePosition.x;
                    object3D.y = position.y - this._movePosition.y;
                    object3D.z = position.z - this._movePosition.z;
                    position.recycle();
                    quaternion.recycle();
                }
            }
        };
        SkeletonAnimation.prototype.updateMovePos = function (skeletonPose) {
            var jointPose;
            if (this._movePosIndex != -1) {
                jointPose = skeletonPose.joints[this._movePosIndex];
                var position = dou.recyclable(dou3d.Vector3);
                jointPose.worldMatrix.decompose(position);
                if (this._movePosObject3D) {
                    this._movePosition.x = position.x - this._movePosition.x;
                    this._movePosition.y = position.y - this._movePosition.y;
                    this._movePosition.z = position.z - this._movePosition.z;
                    this._movePosObject3D.orientation.transformVector(this._movePosition, this._movePosition);
                    this._movePosObject3D.x += this._movePosition.x;
                    this._movePosObject3D.y += this._movePosition.y;
                    this._movePosObject3D.z += this._movePosition.z;
                    if (this._resetMovePos) {
                        this._resetMovePos = false;
                        this._movePosObject3D.x -= this._movePosition.x;
                        this._movePosObject3D.y += this._movePosition.y;
                        this._movePosObject3D.z -= this._movePosition.z;
                    }
                }
                this._movePosition.copy(position);
                position.recycle();
            }
        };
        SkeletonAnimation.prototype.clone = function () {
            var skeletonAnimation = new SkeletonAnimation();
            skeletonAnimation._blendSpeed = this._blendSpeed;
            skeletonAnimation.isLoop = this.isLoop;
            skeletonAnimation._animStateNames = this._animStateNames.concat([]);
            for (var i = 0; i < this._animStates.length; i++) {
                skeletonAnimation._animStates.push(this._animStates[i].clone());
            }
            return skeletonAnimation;
        };
        /**
         * 动画速率
         */
        SkeletonAnimation.fps = 1000 / 60;
        return SkeletonAnimation;
    }(dou.EventDispatcher));
    dou3d.SkeletonAnimation = SkeletonAnimation;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     *
     * @author wizardc
     */
    var SkeletonAnimationClip = /** @class */ (function () {
        function SkeletonAnimationClip() {
            this.animationName = "";
            // 流数据解析测试
            this.sampling = 0;
            this.boneCount = 0;
            this.frameDataOffset = 0;
            this._frameCount = 0;
            this._timeLength = 0;
            this.poseArray = [];
        }
        Object.defineProperty(SkeletonAnimationClip.prototype, "currentSkeletonPose", {
            get: function () {
                return this._skeletonPose;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimationClip.prototype, "frameCount", {
            get: function () {
                if (this.poseArray.length > 0) {
                    return this.poseArray.length;
                }
                return this._frameCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimationClip.prototype, "timeLength", {
            /**
             * 时间长度
             */
            get: function () {
                if (this.poseArray.length > 0) {
                    return this.poseArray[this.poseArray.length - 1].frameTime;
                }
                return this._timeLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimationClip.prototype, "jointNum", {
            /**
             * 骨骼数量
             */
            get: function () {
                if (this.poseArray.length > 0) {
                    return this.poseArray[0].joints.length;
                }
                return this.boneCount;
            },
            enumerable: true,
            configurable: true
        });
        SkeletonAnimationClip.prototype.findJointIndex = function (name) {
            if (!this._skeletonPose) {
                if (this.poseArray.length <= 0) {
                    return -1;
                }
                return this.poseArray[0].findJointIndex(name);
            }
            return this._skeletonPose.findJointIndex(name);
        };
        SkeletonAnimationClip.prototype.addSkeletonPose = function (skeletonPose) {
            this.poseArray.push(skeletonPose);
        };
        SkeletonAnimationClip.prototype.buildInitialSkeleton = function (boneNameArray, parentBoneNameArray, frameCount) {
            if (this._skeletonPose) {
                return;
            }
            this._frameCount = frameCount;
            this._skeletonPose = new dou3d.SkeletonPose();
            for (var j = 0; j < this.boneCount; j++) {
                var jointPose = new dou3d.Joint(boneNameArray[j]);
                jointPose.parent = parentBoneNameArray[j];
                jointPose.parentIndex = this._skeletonPose.findJointIndex(jointPose.parent);
                this._skeletonPose.joints.push(jointPose);
            }
            this.sourceData.position = this.frameDataOffset + (40 * this.boneCount + 4) * (this.frameCount - 1);
            this._timeLength = this.sourceData.readInt() / 60 / 80 * 1000;
        };
        SkeletonAnimationClip.prototype.getSkeletonPose = function (index) {
            if (this.poseArray.length > 0) {
                return this.poseArray[index];
            }
            if (index < 0 || index >= this.frameCount * 2) {
                return null;
            }
            index = Math.floor(index / 2);
            return this.readSkeletonPose(index, this._skeletonPose);
        };
        SkeletonAnimationClip.prototype.readSkeletonPose = function (index, skeletonPose) {
            // 每帧数据需要 40 * 骨骼数 + 4字节
            this.sourceData.position = this.frameDataOffset + (40 * this.boneCount + 4) * index;
            skeletonPose.frameTime = this.sourceData.readInt() / 60 / 80 * 1000;
            for (var j = 0; j < this.boneCount; j++) {
                //读取旋转四元数分量
                var orientation_1 = dou.recyclable(dou3d.Quaternion);
                orientation_1.x = this.sourceData.readFloat();
                orientation_1.y = this.sourceData.readFloat();
                orientation_1.z = this.sourceData.readFloat();
                orientation_1.w = this.sourceData.readFloat();
                //读取缩放分量
                var scale = dou.recyclable(dou3d.Vector3);
                scale.x = this.sourceData.readFloat();
                scale.y = this.sourceData.readFloat();
                scale.z = this.sourceData.readFloat();
                //读取平移分量
                var translation = dou.recyclable(dou3d.Vector3);
                translation.x = this.sourceData.readFloat();
                translation.y = this.sourceData.readFloat();
                translation.z = this.sourceData.readFloat();
                skeletonPose.joints[j].worldMatrixValid = false;
                skeletonPose.joints[j].buildLocalMatrix(scale, orientation_1, translation);
                orientation_1.recycle();
                scale.recycle();
                translation.recycle();
            }
            skeletonPose.calculateJointWorldMatrix();
            return skeletonPose;
        };
        SkeletonAnimationClip.prototype.clone = function () {
            var skeletonAnimationClip = new SkeletonAnimationClip();
            skeletonAnimationClip.animationName = this.animationName;
            skeletonAnimationClip.poseArray = this.poseArray;
            skeletonAnimationClip.sampling = this.sampling;
            skeletonAnimationClip.boneCount = this.boneCount;
            skeletonAnimationClip._frameCount = this._frameCount;
            skeletonAnimationClip.frameDataOffset = this.frameDataOffset;
            skeletonAnimationClip.sourceData = this.sourceData;
            skeletonAnimationClip._timeLength = this._timeLength;
            skeletonAnimationClip._skeletonPose = this._skeletonPose;
            if (this._skeletonPose) {
                skeletonAnimationClip._skeletonPose = this._skeletonPose.clone();
            }
            return skeletonAnimationClip;
        };
        return SkeletonAnimationClip;
    }());
    dou3d.SkeletonAnimationClip = SkeletonAnimationClip;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     *
     * @author wizardc
     */
    var SkeletonAnimationState = /** @class */ (function () {
        function SkeletonAnimationState(name) {
            /**
             * State 名称
             */
            this.name = "";
            /**
             * 融合权重值
             */
            this.weight = 1.0;
            this._timeLength = 0;
            this._timePosition = 0;
            this._skeletonAnimation = null;
            this._skeletonAnimationClip = null;
            this.name = name;
        }
        Object.defineProperty(SkeletonAnimationState.prototype, "skeletonAnimation", {
            /**
             * 骨骼动画控制器
             */
            get: function () {
                return this._skeletonAnimation;
            },
            /**
             * 骨骼动画控制器
             */
            set: function (skeletonAnimation) {
                this._skeletonAnimation = skeletonAnimation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimationState.prototype, "skeletonAnimationClip", {
            /**
             * 骨骼动画剪辑
             */
            get: function () {
                return this._skeletonAnimationClip;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimationState.prototype, "timeLength", {
            /**
             * 动画时间长度
             */
            get: function () {
                return this._timeLength;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 添加 SkeletonAnimationClip 对象
         */
        SkeletonAnimationState.prototype.addAnimationClip = function (animationClip) {
            if (animationClip.sourceData) {
                this._skeletonAnimationClip = animationClip;
                this._timeLength = this._skeletonAnimationClip.timeLength;
            }
            else {
                if (!this._skeletonAnimationClip) {
                    this._skeletonAnimationClip = new dou3d.SkeletonAnimationClip();
                }
                else {
                    this._skeletonAnimationClip.poseArray = [];
                }
                if (animationClip.poseArray.length < 2) {
                    this._skeletonAnimationClip.poseArray = animationClip.poseArray;
                }
                else {
                    var skeletonPoseA = animationClip.poseArray[0];
                    var skeletonPoseB = animationClip.poseArray[1];
                    var nCount = Math.round((skeletonPoseB.frameTime - skeletonPoseA.frameTime) / dou3d.SkeletonAnimation.fps);
                    if (nCount <= 1) {
                        this._skeletonAnimationClip.poseArray = animationClip.poseArray;
                    }
                    else {
                        for (var i = 1; i < animationClip.poseArray.length; ++i) {
                            skeletonPoseA = animationClip.poseArray[i - 1];
                            skeletonPoseB = animationClip.poseArray[i];
                            for (var j = 0; j < nCount; j++) {
                                var skeletonPose = new dou3d.SkeletonPose();
                                skeletonPose.lerp(skeletonPoseA, skeletonPoseB, j / nCount);
                                this._skeletonAnimationClip.poseArray.push(skeletonPose);
                            }
                        }
                        this._skeletonAnimationClip.poseArray.push(animationClip.poseArray[animationClip.poseArray.length - 1].clone());
                    }
                }
                this._timeLength = this._skeletonAnimationClip.poseArray[this._skeletonAnimationClip.poseArray.length - 1].frameTime;
            }
        };
        Object.defineProperty(SkeletonAnimationState.prototype, "timePosition", {
            /**
             * 时间位置
             */
            get: function () {
                return this._timePosition;
            },
            /**
             * 时间位置
             */
            set: function (value) {
                if (value == this._timePosition) {
                    return;
                }
                this._timePosition = value;
                if (this._skeletonAnimation.isLoop) {
                    this._timePosition = value % this._timeLength;
                    if (this._timePosition < 0) {
                        this._timePosition += this._timeLength;
                    }
                }
                else {
                    if (this._timePosition < 0) {
                        this._timePosition = 0;
                        if (this.name == this._skeletonAnimation.currentAnimName) {
                            this._skeletonAnimation.stop();
                            this._skeletonAnimation.dispatch(dou.Event.COMPLETE);
                        }
                    }
                    else if (this._timePosition > this._timeLength) {
                        this._timePosition = this._timeLength;
                        if (this.name == this._skeletonAnimation.currentAnimName) {
                            this._skeletonAnimation.stop();
                            this._skeletonAnimation.dispatch(dou.Event.COMPLETE);
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimationState.prototype, "currentSkeletonPose", {
            /**
             * 获取当前帧的SkeletonPose
             */
            get: function () {
                return this._skeletonAnimationClip.getSkeletonPose(this.currentFrameIndex);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimationState.prototype, "previousSkeletonPose", {
            /**
             * 获取上一帧的SkeletonPose
             */
            get: function () {
                var index = this.currentFrameIndex;
                if (this._skeletonAnimation.speed > 0) {
                    index--;
                    if (index < 0) {
                        index = this.frameNum - index;
                    }
                }
                else {
                    index = (index + 1) % this.frameNum;
                }
                return this._skeletonAnimationClip.getSkeletonPose(index);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimationState.prototype, "currentFrameIndex", {
            /**
             * 获取当前帧索引
             */
            get: function () {
                return Math.floor(this._timePosition / dou3d.SkeletonAnimation.fps);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkeletonAnimationState.prototype, "frameNum", {
            /**
             * 获取帧数量
             */
            get: function () {
                if (!this._skeletonAnimationClip) {
                    return 0;
                }
                return this._skeletonAnimationClip.frameCount;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取SkeletonPose
         */
        SkeletonAnimationState.prototype.getSkeletonPose = function (index) {
            return this._skeletonAnimationClip.getSkeletonPose(index);
        };
        /**
         * 克隆SkeletonAnimationState对象
         */
        SkeletonAnimationState.prototype.clone = function () {
            var skeletonAnimationState = new SkeletonAnimationState(this.name);
            skeletonAnimationState._timeLength = this._timeLength;
            skeletonAnimationState._skeletonAnimation = this._skeletonAnimation;
            skeletonAnimationState._skeletonAnimationClip = this._skeletonAnimationClip;
            return skeletonAnimationState;
        };
        return SkeletonAnimationState;
    }());
    dou3d.SkeletonAnimationState = SkeletonAnimationState;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 单帧骨架动画数据，若干个SkeletonPose组合成SkeletonAnimationClip， 做为骨骼骨架序列数据
     * @author wizardc
     */
    var SkeletonPose = /** @class */ (function () {
        function SkeletonPose() {
            this.joints = [];
        }
        /**
         * 骨架插值计算
         */
        SkeletonPose.prototype.lerp = function (skeletonPoseA, skeletonPoseB, t) {
            if (skeletonPoseA.joints.length != skeletonPoseB.joints.length) {
                throw Error("Bone number does not match!");
            }
            if (this.joints.length < skeletonPoseA.joints.length) {
                for (var i = this.joints.length; i <= skeletonPoseA.joints.length; ++i) {
                    this.joints.push(new dou3d.Joint(""));
                }
            }
            this.frameTime = (skeletonPoseB.frameTime - skeletonPoseA.frameTime) * t + skeletonPoseA.frameTime;
            for (var i = 0; i < skeletonPoseA.joints.length; ++i) {
                var jointA = skeletonPoseA.joints[i];
                var jointB = skeletonPoseB.joints[i];
                var joint = this.joints[i];
                joint.name = jointA.name;
                joint.parent = jointA.parent;
                joint.parentIndex = jointA.parentIndex;
                dou3d.Vector3.lerp(jointA.scale, jointB.scale, t, joint.scale);
                dou3d.Quaternion.slerp(jointA.orientation, jointB.orientation, t, joint.orientation);
                dou3d.Vector3.slerp(jointA.translation, jointB.translation, t, joint.translation);
                joint.buildLocalMatrix(joint.scale, joint.orientation, joint.translation);
                joint.worldMatrixValid = jointA.worldMatrixValid;
                if (joint.worldMatrixValid) {
                    var translationA = dou.recyclable(dou3d.Vector3);
                    var rotationA = dou.recyclable(dou3d.Quaternion);
                    var scaleA = dou.recyclable(dou3d.Vector3);
                    jointA.worldMatrix.decompose(translationA, rotationA, scaleA);
                    var translationB = dou.recyclable(dou3d.Vector3);
                    var rotationB = dou.recyclable(dou3d.Quaternion);
                    var scaleB = dou.recyclable(dou3d.Vector3);
                    jointB.worldMatrix.decompose(translationB, rotationB, scaleB);
                    var pos = dou.recyclable(dou3d.Vector3);
                    dou3d.Vector3.slerp(translationA, translationB, t, pos);
                    var rotation = dou.recyclable(dou3d.Quaternion);
                    dou3d.Quaternion.slerp(rotationA, rotationB, t, rotation);
                    var scale = dou.recyclable(dou3d.Vector3);
                    dou3d.Vector3.lerp(scaleA, scaleB, t, scale);
                    joint.worldMatrix.compose(pos, rotation, scale);
                    translationA.recycle();
                    rotationA.recycle();
                    scaleA.recycle();
                    translationB.recycle();
                    rotationB.recycle();
                    scaleB.recycle();
                    pos.recycle();
                    rotation.recycle();
                    scale.recycle();
                }
            }
            return this;
        };
        /**
         * 计算当前骨架内所有骨骼的世界矩阵
         */
        SkeletonPose.prototype.calculateJointWorldMatrix = function () {
            for (var i = 0; i < this.joints.length; ++i) {
                this.calculateAbsoluteMatrix(i);
            }
        };
        SkeletonPose.prototype.calculateAbsoluteMatrix = function (jointIndex) {
            var joint = this.joints[jointIndex];
            if (joint.parentIndex >= 0) {
                this.calculateAbsoluteMatrix(joint.parentIndex);
            }
            if (!joint.worldMatrixValid) {
                joint.worldMatrix.copy(joint.localMatrix);
                if (joint.parentIndex >= 0) {
                    joint.worldMatrix.append(this.joints[joint.parentIndex].worldMatrix);
                }
                joint.worldMatrixValid = true;
            }
        };
        /**
         * 更新GPU所需的骨骼缓存数据
         */
        SkeletonPose.prototype.updateGPUCacheData = function (skeleton, skeletonMatrixData, offset) {
            for (var i = 0; i < skeleton.joints.length; ++i) {
                for (var j = 0; j < this.joints.length; ++j) {
                    if (skeleton.joints[i].name != this.joints[j].name) {
                        continue;
                    }
                    var matrix = dou.recyclable(dou3d.Matrix4);
                    matrix.copy(skeleton.joints[i].inverseMatrix);
                    matrix.append(this.joints[j].worldMatrix);
                    var translation = dou.recyclable(dou3d.Vector3);
                    var rotation = dou.recyclable(dou3d.Quaternion);
                    var scale = dou.recyclable(dou3d.Vector3);
                    matrix.decompose(translation, rotation, scale);
                    skeletonMatrixData[i * 8 + 0] = rotation.x;
                    skeletonMatrixData[i * 8 + 1] = rotation.y;
                    skeletonMatrixData[i * 8 + 2] = rotation.z;
                    skeletonMatrixData[i * 8 + 3] = rotation.w;
                    skeletonMatrixData[i * 8 + 4] = translation.x - offset.x;
                    skeletonMatrixData[i * 8 + 5] = translation.y - offset.y;
                    skeletonMatrixData[i * 8 + 6] = translation.z - offset.z;
                    skeletonMatrixData[i * 8 + 7] = 1;
                    matrix.recycle();
                    translation.recycle();
                    rotation.recycle();
                    scale.recycle();
                    break;
                }
            }
            return skeletonMatrixData;
        };
        /**
         * 通过名称查找指定骨骼
         */
        SkeletonPose.prototype.findJoint = function (name) {
            for (var i = 0; i < this.joints.length; i++) {
                if (this.joints[i].name == name) {
                    return this.joints[i];
                }
            }
            return null;
        };
        /**
         * 通过名称查找骨骼索引编号
         */
        SkeletonPose.prototype.findJointIndex = function (name) {
            for (var i = 0; i < this.joints.length; i++) {
                if (this.joints[i].name == name) {
                    return i;
                }
            }
            return -1;
        };
        /**
         * 重置骨骼世界矩阵
         */
        SkeletonPose.prototype.resetWorldMatrix = function () {
            for (var i = 0; i < this.joints.length; i++) {
                this.joints[i].worldMatrixValid = false;
            }
        };
        SkeletonPose.prototype.clone = function () {
            var skeletonPose = new SkeletonPose();
            skeletonPose.frameTime = this.frameTime;
            for (var i = 0; i < this.joints.length; i++) {
                skeletonPose.joints.push(this.joints[i].clone());
            }
            return skeletonPose;
        };
        return SkeletonPose;
    }());
    dou3d.SkeletonPose = SkeletonPose;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 3D 摄像机对象
     * @author wizardc
     */
    var Camera3D = /** @class */ (function (_super) {
        __extends(Camera3D, _super);
        function Camera3D(cameraType) {
            if (cameraType === void 0) { cameraType = 0 /* perspective */; }
            var _this = _super.call(this) || this;
            _this._aspectRatio = 1;
            _this._fov = 0.78;
            _this._size = 1;
            _this._near = 1;
            _this._far = 10000;
            _this._orthProjectChange = true;
            _this._projectMatrix = new dou3d.Matrix4();
            _this._orthProjectMatrix = new dou3d.Matrix4();
            _this._viewPort = new dou3d.Rectangle();
            _this._lookAtPosition = new dou3d.Vector3();
            _this._viewMatrix = new dou3d.Matrix4();
            _this._viewMatrix.identity();
            _this._viewProjectionMatrix = new dou3d.Matrix4();
            _this._viewProjectionMatrix.identity();
            _this._orthProjectMatrix.orthographicProjectMatrix(0, 0, _this._viewPort.w, _this._viewPort.h, _this._near, _this._far);
            _this.cameraType = cameraType;
            return _this;
        }
        Object.defineProperty(Camera3D.prototype, "projectMatrix", {
            /**
             * 相机投影矩阵
             */
            get: function () {
                return this._projectMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera3D.prototype, "cameraType", {
            get: function () {
                return this._cameraType;
            },
            /**
             * 相机类型
             */
            set: function (cameraType) {
                if (this._cameraType != cameraType) {
                    this._cameraType = cameraType;
                    this.updateMatrix();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera3D.prototype, "aspectRatio", {
            get: function () {
                return this._aspectRatio;
            },
            /**
             * 相机横纵比
             */
            set: function (value) {
                if (this._aspectRatio != value) {
                    this._aspectRatio = value;
                    this.updateMatrix();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera3D.prototype, "fieldOfView", {
            get: function () {
                return this._fov;
            },
            /**
             * 投影视角
             * * 透视相机有效
             */
            set: function (value) {
                if (this._fov != value) {
                    this._fov = value;
                    this.updateMatrix();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera3D.prototype, "orthSize", {
            get: function () {
                return this._size;
            },
            /**
             * 相机尺寸
             * * 正交相机有效
             */
            set: function (value) {
                if (this._size != value) {
                    this._size = value;
                    this.updateMatrix();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera3D.prototype, "near", {
            get: function () {
                return this._near;
            },
            /**
             * 相机近截面
             */
            set: function (value) {
                if (this._near != value) {
                    this._near = value;
                    this.updateMatrix();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera3D.prototype, "far", {
            get: function () {
                return this._far;
            },
            /**
             * 相机远截面
             */
            set: function (value) {
                if (this._far != value) {
                    this._far = value;
                    this.updateMatrix();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera3D.prototype, "viewPort", {
            get: function () {
                return this._viewPort;
            },
            /**
             * 视口
             */
            set: function (value) {
                this._viewPort.copy(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera3D.prototype, "viewProjectionMatrix", {
            /**
             * 相机视图投影矩阵
             */
            get: function () {
                this.validateTransformNow();
                this._viewProjectionMatrix.copy(this._projectMatrix);
                this._viewProjectionMatrix.multiply(this._viewMatrix);
                return this._viewProjectionMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera3D.prototype, "orthProjectionMatrix", {
            /**
             * 相机正交投影矩阵
             */
            get: function () {
                if (this._orthProjectChange) {
                    this._orthProjectChange = false;
                    this._orthProjectMatrix.orthographicProjectMatrix(0, 0, this._viewPort.w, this._viewPort.h, this._near, this._far);
                }
                return this._orthProjectMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera3D.prototype, "viewMatrix", {
            /**
             * 相机视图矩阵
             */
            get: function () {
                this.validateTransformNow();
                return this._viewMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera3D.prototype, "lookAtPosition", {
            /**
             * 相机目标点
             */
            get: function () {
                return this._lookAtPosition;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 更新视口
         */
        Camera3D.prototype.updateViewport = function (x, y, width, height) {
            if (x == this._viewPort.x && y == this._viewPort.y && width == this._viewPort.w && height == this._viewPort.h) {
                return;
            }
            this._orthProjectChange = true;
            this._viewPort.x = x;
            this._viewPort.y = y;
            this._viewPort.w = width;
            this._viewPort.h = height;
        };
        /**
         * 面向指定的位置
         * @param pos 摄像机的全局坐标
         * @param target 面向的全局坐标
         * @param up 向上的方向
         */
        Camera3D.prototype.lookAt = function (pos, target, up) {
            if (up === void 0) { up = dou3d.Vector3.UP; }
            this.position = pos;
            this._lookAtPosition.copy(target);
            this._viewMatrix.lookAt(pos, target, up);
            var quaternion = dou.recyclable(dou3d.Quaternion);
            quaternion.fromMatrix(this._viewMatrix);
            this.globalOrientation = quaternion;
            quaternion.recycle();
        };
        Camera3D.prototype.updateMatrix = function () {
            this._projectMatrix.fromProjection(this._near, this._far, this._fov, this._size, this._cameraType == 0 /* perspective */ ? 1 : 0, this._aspectRatio, 1);
            this._orthProjectMatrix.fromProjection(this._near, this._far, this._fov, this._size, 0, this._aspectRatio, 1);
        };
        Camera3D.prototype.onTransformUpdate = function () {
            _super.prototype.onTransformUpdate.call(this);
            this._viewMatrix.copy(this._globalMatrix);
            this._viewMatrix.inverse();
        };
        /**
         * 将 3 维空间中的坐标转换为屏幕坐标
         */
        Camera3D.prototype.spaceToScreen = function (point, result) {
            result = result || new dou3d.Vector2();
            var halfW = this._viewPort.w * 0.5;
            var halfH = this._viewPort.h * 0.5;
            var vec4 = dou.recyclable(dou3d.Vector4);
            this.viewMatrix.transformVector(point, vec4);
            this.project(vec4, vec4);
            result.x = halfW + vec4.x * halfW;
            result.y = this._viewPort.h - (halfH - vec4.y * halfH);
            vec4.recycle();
            return result;
        };
        Camera3D.prototype.project = function (point, target) {
            this._projectMatrix.transformVector(point, target);
            target.x = target.x / target.w;
            target.y = -target.y / target.w;
            target.z = point.z;
        };
        /**
         * 屏幕坐标转换为 3 维空间中的坐标
         * @param z 位于 3 维空间中的深度坐标
         */
        Camera3D.prototype.screenToSpace = function (point, z, result) {
            if (z === void 0) { z = 0; }
            result = result || new dou3d.Vector3();
            var halfW = this._viewPort.w * 0.5;
            var halfH = this._viewPort.h * 0.5;
            var vec4 = dou.recyclable(dou3d.Vector4);
            vec4.x = (point.x - halfW) / halfW;
            vec4.y = (halfH - (this._viewPort.h - point.y)) / halfH;
            this.unproject(vec4.x, vec4.y, z, vec4);
            this._globalMatrix.transformVector(vec4, vec4);
            result.x = vec4.x;
            result.y = vec4.y;
            result.z = vec4.z;
            vec4.recycle();
            return result;
        };
        Camera3D.prototype.unproject = function (x, y, z, target) {
            target.x = x;
            target.y = -y;
            target.z = z;
            target.w = 1;
            target.x *= z;
            target.y *= z;
            var unprojection = dou.recyclable(dou3d.Matrix4);
            unprojection.copy(this._projectMatrix);
            unprojection.inverse();
            unprojection.transformVector(target, target);
            unprojection.recycle();
            target.z = z;
        };
        Camera3D.prototype.markTransform = function () {
            var vector = dou.recyclable(dou3d.Vector3);
            vector.set(1, 1, 1);
            this._globalMatrix.compose(this._globalPosition, this._globalOrientation, vector);
            vector.recycle();
        };
        return Camera3D;
    }(dou3d.Object3D));
    dou3d.Camera3D = Camera3D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 控制器基类
     * @author wizardc
     */
    var ControllerBase = /** @class */ (function () {
        function ControllerBase(target) {
            this._autoUpdate = true;
            this.target = target;
        }
        Object.defineProperty(ControllerBase.prototype, "autoUpdate", {
            get: function () {
                return this._autoUpdate;
            },
            set: function (value) {
                if (this._autoUpdate == value) {
                    return;
                }
                this._autoUpdate = value;
                if (this._target) {
                    this._target.controller = this._autoUpdate ? this : null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControllerBase.prototype, "target", {
            get: function () {
                return this._target;
            },
            set: function (value) {
                if (this._target == value) {
                    return;
                }
                if (this._target && this._autoUpdate) {
                    this._target.controller = null;
                }
                this._target = value;
                if (this._target && this._autoUpdate) {
                    this._target.controller = this;
                }
            },
            enumerable: true,
            configurable: true
        });
        return ControllerBase;
    }());
    dou3d.ControllerBase = ControllerBase;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 始终朝向指定目标的控制器
     * @author wizardc
     */
    var LookAtController = /** @class */ (function (_super) {
        __extends(LookAtController, _super);
        function LookAtController(target, lookAtObject) {
            var _this = _super.call(this, target) || this;
            _this._upAxis = dou3d.Vector3.UP;
            if (lookAtObject) {
                if (lookAtObject instanceof dou3d.Object3D) {
                    _this.lookAtObject = lookAtObject;
                }
                else {
                    _this.lookAtPosition = lookAtObject;
                }
            }
            return _this;
        }
        Object.defineProperty(LookAtController.prototype, "lookAtPosition", {
            get: function () {
                return this._lookAtPosition;
            },
            set: function (value) {
                this._lookAtPosition = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LookAtController.prototype, "lookAtObject", {
            get: function () {
                return this._lookAtObject;
            },
            set: function (value) {
                this._lookAtObject = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LookAtController.prototype, "upAxis", {
            get: function () {
                return this._upAxis;
            },
            set: function (value) {
                this._upAxis = value;
            },
            enumerable: true,
            configurable: true
        });
        LookAtController.prototype.update = function (time, delay) {
            if (this._target) {
                if (this._lookAtPosition) {
                    this._target.lookAt(this._target.globalPosition, this._lookAtPosition, this._upAxis);
                }
                else if (this._lookAtObject) {
                    if (this._target.parent === this._lookAtObject.parent) {
                        this._target.lookAt(this._target.position, this._lookAtObject.position, this._upAxis);
                    }
                    else {
                        var vect4 = dou.recyclable(dou3d.Vector4);
                        this._target.parent.globalToLocal(this._lookAtObject.globalPosition, vect4);
                        var vect3 = dou.recyclable(dou3d.Vector3);
                        vect3.set(vect4.x, vect4.y, vect4.z);
                        this._target.lookAt(this._target.position, vect3, this._upAxis);
                        vect4.recycle();
                        vect3.recycle();
                    }
                }
                else {
                    this._target.lookAt(this._target.globalPosition, dou3d.Vector3.ZERO, this._upAxis);
                }
            }
        };
        return LookAtController;
    }(dou3d.ControllerBase));
    dou3d.LookAtController = LookAtController;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 多参数控制的始终朝向指定目标的控制器
     * @author wizardc
     */
    var HoverController = /** @class */ (function (_super) {
        __extends(HoverController, _super);
        function HoverController(target, lookAtObject, panAngle, tiltAngle, distance, minPanAngle, maxPanAngle, minTiltAngle, maxTiltAngle, steps, yFactor, wrapPanAngle) {
            if (panAngle === void 0) { panAngle = 0; }
            if (tiltAngle === void 0) { tiltAngle = 90; }
            if (distance === void 0) { distance = 1000; }
            if (minPanAngle === void 0) { minPanAngle = NaN; }
            if (maxPanAngle === void 0) { maxPanAngle = NaN; }
            if (minTiltAngle === void 0) { minTiltAngle = -90; }
            if (maxTiltAngle === void 0) { maxTiltAngle = 90; }
            if (steps === void 0) { steps = 8; }
            if (yFactor === void 0) { yFactor = 2; }
            if (wrapPanAngle === void 0) { wrapPanAngle = false; }
            var _this = _super.call(this, target, lookAtObject) || this;
            _this._panAngle = 0;
            _this._tiltAngle = 90;
            _this._distance = 1000;
            _this._minPanAngle = -Infinity;
            _this._maxPanAngle = Infinity;
            _this._minTiltAngle = -90;
            _this._maxTiltAngle = 90;
            _this._steps = 8;
            _this._yFactor = 2;
            _this._wrapPanAngle = false;
            _this.distance = distance;
            _this.panAngle = panAngle;
            _this.tiltAngle = tiltAngle;
            _this.minPanAngle = minPanAngle || -Infinity;
            _this.maxPanAngle = maxPanAngle || Infinity;
            _this.minTiltAngle = minTiltAngle;
            _this.maxTiltAngle = maxTiltAngle;
            _this.steps = steps;
            _this.yFactor = yFactor;
            _this.wrapPanAngle = wrapPanAngle;
            _this._currentPanAngle = _this._panAngle;
            _this._currentTiltAngle = _this._tiltAngle;
            return _this;
        }
        Object.defineProperty(HoverController.prototype, "panAngle", {
            get: function () {
                return this._panAngle;
            },
            /**
             * 水平角度
             */
            set: function (value) {
                value = dou3d.MathUtil.clamp(value, this._minPanAngle, this._maxPanAngle);
                if (this._panAngle == value) {
                    return;
                }
                this._panAngle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HoverController.prototype, "tiltAngle", {
            get: function () {
                return this._tiltAngle;
            },
            /**
             * 倾斜角度
             */
            set: function (value) {
                value = dou3d.MathUtil.clamp(value, this._minTiltAngle, this._maxTiltAngle);
                if (this._tiltAngle == value) {
                    return;
                }
                this._tiltAngle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HoverController.prototype, "distance", {
            get: function () {
                return this._distance;
            },
            /**
             * 距离
             */
            set: function (value) {
                if (this._distance == value) {
                    return;
                }
                this._distance = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HoverController.prototype, "minPanAngle", {
            get: function () {
                return this._minPanAngle;
            },
            /**
             * 最小水平角度
             */
            set: function (value) {
                if (this._minPanAngle == value) {
                    return;
                }
                this._minPanAngle = value;
                this.panAngle = dou3d.MathUtil.clamp(value, this._minPanAngle, this._maxPanAngle);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HoverController.prototype, "maxPanAngle", {
            get: function () {
                return this._maxPanAngle;
            },
            /**
             * 最大水平角度
             */
            set: function (value) {
                if (this._maxPanAngle == value) {
                    return;
                }
                this._maxPanAngle = value;
                this.panAngle = dou3d.MathUtil.clamp(value, this._minPanAngle, this._maxPanAngle);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HoverController.prototype, "minTiltAngle", {
            get: function () {
                return this._minTiltAngle;
            },
            /**
             * 最小倾斜角度
             */
            set: function (value) {
                if (this._minTiltAngle == value) {
                    return;
                }
                this._minTiltAngle = value;
                this.tiltAngle = dou3d.MathUtil.clamp(value, this._minTiltAngle, this._maxTiltAngle);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HoverController.prototype, "maxTiltAngle", {
            get: function () {
                return this._maxTiltAngle;
            },
            /**
             * 最大倾斜角度
             */
            set: function (value) {
                if (this._maxTiltAngle == value) {
                    return;
                }
                this._maxTiltAngle = value;
                this.tiltAngle = dou3d.MathUtil.clamp(value, this._minTiltAngle, this._maxTiltAngle);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HoverController.prototype, "steps", {
            get: function () {
                return this._steps;
            },
            /**
             * 每帧缓动的距离的除数
             * * 为 0 表示不进行缓动, 数字越大缓动速度越慢
             */
            set: function (value) {
                if (this._steps == value) {
                    return;
                }
                this._steps = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HoverController.prototype, "yFactor", {
            get: function () {
                return this._yFactor;
            },
            /**
             * y 轴和 x 轴的距离比值
             * * 为 1 时表示为圆形, 其它表示为椭圆形
             */
            set: function (value) {
                if (this._yFactor == value) {
                    return;
                }
                this._yFactor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HoverController.prototype, "wrapPanAngle", {
            get: function () {
                return this._wrapPanAngle;
            },
            /**
             * 当 Pan 的角度超过 360 度之后, 是否将其重新设定为360度以内
             */
            set: function (value) {
                if (this._wrapPanAngle == value) {
                    return;
                }
                this._wrapPanAngle = value;
            },
            enumerable: true,
            configurable: true
        });
        HoverController.prototype.update = function (time, delay) {
            if (this._tiltAngle != this._currentTiltAngle || this._panAngle != this._currentPanAngle) {
                if (this._wrapPanAngle) {
                    if (this._panAngle < 0) {
                        this._currentPanAngle += this._panAngle % 360 + 360 - this._panAngle;
                        this._panAngle = this._panAngle % 360 + 360;
                    }
                    else {
                        this._currentPanAngle += this._panAngle % 360 - this._panAngle;
                        this._panAngle = this._panAngle % 360;
                    }
                    while (this._panAngle - this._currentPanAngle < -180) {
                        this._currentPanAngle -= 360;
                    }
                    while (this._panAngle - this._currentPanAngle > 180) {
                        this._currentPanAngle += 360;
                    }
                }
                if (this._steps > 0) {
                    this._currentTiltAngle += (this._tiltAngle - this._currentTiltAngle) / (this._steps + 1);
                    this._currentPanAngle += (this._panAngle - this._currentPanAngle) / (this._steps + 1);
                }
                else {
                    this._currentPanAngle = this._panAngle;
                    this._currentTiltAngle = this._tiltAngle;
                }
                if ((Math.abs(this._tiltAngle - this._currentTiltAngle) < 0.01) && (Math.abs(this._panAngle - this._currentPanAngle) < 0.01)) {
                    this._currentTiltAngle = this._tiltAngle;
                    this._currentPanAngle = this._panAngle;
                }
            }
            if (!this._target) {
                return;
            }
            var pos = dou.recyclable(dou3d.Vector3);
            if (this._lookAtPosition) {
                pos.x = this._lookAtPosition.x;
                pos.y = this._lookAtPosition.y;
                pos.z = this._lookAtPosition.z;
            }
            else if (this._lookAtObject) {
                if (this._target.parent === this._lookAtObject.parent) {
                    pos.x = this._lookAtObject.x;
                    pos.y = this._lookAtObject.y;
                    pos.z = this._lookAtObject.z;
                }
                else {
                    var vect4 = dou.recyclable(dou3d.Vector4);
                    this._target.parent.globalToLocal(this._lookAtObject.globalPosition, vect4);
                    pos.set(vect4.x, vect4.y, vect4.z);
                    vect4.recycle();
                }
            }
            else {
                pos.x = 0;
                pos.y = 0;
                pos.z = 0;
            }
            this._target.x = pos.x + this._distance * Math.sin(this._currentPanAngle * dou3d.MathUtil.DEG_RAD) * Math.cos(this._currentTiltAngle * dou3d.MathUtil.DEG_RAD);
            this._target.z = pos.z + this._distance * Math.cos(this._currentPanAngle * dou3d.MathUtil.DEG_RAD) * Math.cos(this._currentTiltAngle * dou3d.MathUtil.DEG_RAD);
            this._target.y = pos.y + this._distance * Math.sin(this._currentTiltAngle * dou3d.MathUtil.DEG_RAD) * this._yFactor;
            pos.recycle();
            _super.prototype.update.call(this, time, delay);
        };
        return HoverController;
    }(dou3d.LookAtController));
    dou3d.HoverController = HoverController;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 着色器片段类型
     * @author wizardc
     */
    var ShaderPhaseType;
    (function (ShaderPhaseType) {
        // -----
        // 顶点着色器
        // -----
        /**
         * 自定义顶点着色器类型
         * * 定了这个字段的着色器之后就只会使用设定的着色器进行渲染不会动态加入其它的着色器
         */
        ShaderPhaseType[ShaderPhaseType["custom_vertex"] = 0] = "custom_vertex";
        /**
         * 顶点着色器写入顺序: 0
         * * 自动写入 base_vs
         */
        /**
         * 顶点着色器写入顺序: 1
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 diffuse_vs 着色器片段
         * * 目前会添加的是 skeleton_vs
         */
        ShaderPhaseType[ShaderPhaseType["start_vertex"] = 1] = "start_vertex";
        /**
         * 顶点着色器写入顺序: 2
         * * 无默认着色器片段
         * * 目前会添加的是 shadowMapping_vs
         */
        ShaderPhaseType[ShaderPhaseType["vertex_1"] = 2] = "vertex_1";
        /**
         * 顶点着色器写入顺序: 3
         * * 无默认着色器片段
         * * 目前会添加的是 cube_vs
         */
        ShaderPhaseType[ShaderPhaseType["vertex_2"] = 3] = "vertex_2";
        /**
         * 顶点着色器写入顺序: 最后
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 end_vs 着色器片段
         * * 目前会添加的是
         */
        ShaderPhaseType[ShaderPhaseType["end_vertex"] = 4] = "end_vertex";
        // -----
        // 片段着色器
        // -----
        /**
         * 自定义片段着色器类型
         * * 设定了这个字段的着色器之后就只会使用设定的着色器进行渲染不会动态加入其它的着色器
         */
        ShaderPhaseType[ShaderPhaseType["custom_fragment"] = 5] = "custom_fragment";
        /**
         * 片段着色器写入顺序: 0
         * * 自动写入 base_fs
         */
        /**
         * 片段着色器写入顺序: 1
         * * 无默认着色器片段
         * * 目前会添加的是
         */
        ShaderPhaseType[ShaderPhaseType["start_fragment"] = 6] = "start_fragment";
        /**
         * 片段着色器写入顺序: 2
         * * 解码 materialsource 数据
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 materialSource_fs 着色器片段
         * * 目前会添加的是
         */
        ShaderPhaseType[ShaderPhaseType["materialsource_fragment"] = 7] = "materialsource_fragment";
        /**
         * 片段着色器写入顺序: 3
         * * 漫反射
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 diffuse_fs 着色器片段
         * * 目前会添加的是 color_fs
         */
        ShaderPhaseType[ShaderPhaseType["diffuse_fragment"] = 8] = "diffuse_fragment";
        /**
         * 片段着色器写入顺序: 4
         * * 法线贴图
         * * 无默认着色器片段
         * * 目前会添加的是
         */
        ShaderPhaseType[ShaderPhaseType["normal_fragment"] = 9] = "normal_fragment";
        /**
         * 片段着色器写入顺序: 5
         * * 阴影贴图渲染
         * * 无默认着色器片段
         * * 目前会添加的是 shadowMapping_fss
         */
        ShaderPhaseType[ShaderPhaseType["shadow_fragment"] = 10] = "shadow_fragment";
        /**
         * 片段着色器写入顺序: 6
         * * 灯光渲染
         * * 无默认着色器片段
         * * 目前会添加的是 lightingBase_fs、directLight_fs、pointLight_fs、spotLight_fs
         */
        ShaderPhaseType[ShaderPhaseType["lighting_fragment"] = 11] = "lighting_fragment";
        /**
         * 片段着色器写入顺序: 7
         * * 高光贴图
         * * 无默认着色器片段
         * * 目前会添加的是 specularMap_fs
         */
        ShaderPhaseType[ShaderPhaseType["specular_fragment"] = 12] = "specular_fragment";
        /**
         * 片段着色器写入顺序: 最后
         * * 该片段添加过着色器片段则使用添加的着色器片段, 没有添加过则使用默认的 end_fs 着色器片段
         * * 目前会添加的是 colorPassEnd_fs、normalPassEnd_fs
         */
        ShaderPhaseType[ShaderPhaseType["end_fragment"] = 13] = "end_fragment";
    })(ShaderPhaseType = dou3d.ShaderPhaseType || (dou3d.ShaderPhaseType = {}));
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 3D 事件
     * @author wizardc
     */
    var Event3D = /** @class */ (function (_super) {
        __extends(Event3D, _super);
        function Event3D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Event3D.dispatch = function (target, type, data, cancelable) {
            var event = dou.recyclable(Event3D);
            event.initEvent(type, data, cancelable);
            var result = target.dispatchEvent(event);
            event.recycle();
            return result;
        };
        Event3D.prototype.initEvent = function (type, data, cancelable) {
            this.init(type, data, cancelable);
        };
        Event3D.prototype.onRecycle = function () {
            _super.prototype.onRecycle.call(this);
        };
        Event3D.ENTER_FRAME = "enterFrame";
        Event3D.EXIT_FRAME = "exitFrame";
        Event3D.RESIZE = "resize";
        Event3D.TOUCH_BEGIN = "touchBegin";
        Event3D.TOUCH_MOVE = "touchMove";
        Event3D.TOUCH_END = "touchEnd";
        return Event3D;
    }(dou.Event));
    dou3d.Event3D = Event3D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 二维向量
     * @author wizardc
     */
    var Vector2 = /** @class */ (function () {
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        /**
         * 获取距离
         */
        Vector2.distance = function (v1, v2) {
            var x = (v1.x - v2.x);
            var y = (v1.y - v2.y);
            return Math.sqrt(x * x + y * y);
        };
        /**
         * 根据长度和角度获取一个向量
         * - 弧度制
         */
        Vector2.polar = function (length, angle, result) {
            result = result || new Vector2();
            result.x = length * Math.sin(angle);
            result.y = length * Math.cos(angle);
            return result;
        };
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
        Vector2.intersection = function (line1Point1, line1Point2, line2Point1, line2Point2, intersectionPoint) {
            var cross = (line2Point2.y - line2Point1.y) * (line1Point2.x - line1Point1.x) - (line2Point2.x - line2Point1.x) * (line1Point2.y - line1Point1.y);
            if (cross == 0) {
                return false;
            }
            if (intersectionPoint) {
                var temp = (line2Point2.x - line2Point1.x) * (line1Point1.y - line2Point1.y) - (line2Point2.y - line2Point1.y) * (line1Point1.x - line2Point1.x);
                var u = temp / cross;
                intersectionPoint.x = line1Point1.x + u * (line1Point2.x - line1Point1.x);
                intersectionPoint.y = line1Point1.y + u * (line1Point2.y - line1Point1.y);
            }
            return true;
        };
        /**
         * 线性插值
         */
        Vector2.lerp = function (from, to, t, result) {
            result = result || new Vector2();
            result.x = from.x * (1 - t) + to.x * t;
            result.y = from.y * (1 - t) + to.y * t;
            return result;
        };
        Object.defineProperty(Vector2.prototype, "sqrtLength", {
            get: function () {
                var _a = this, x = _a.x, y = _a.y;
                return x * x + y * y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "length", {
            get: function () {
                var _a = this, x = _a.x, y = _a.y;
                return Math.sqrt(x * x + y * y);
            },
            enumerable: true,
            configurable: true
        });
        Vector2.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        /**
         * 将该向量加上一个向量或将两个向量相加的结果写入该向量
         * - v += v1
         * - v = v1 + v2
         */
        Vector2.prototype.add = function (v1, v2) {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x + v2.x;
            this.y = v1.y + v2.y;
            return this;
        };
        /**
         * 将该向量减去一个向量或将两个向量相减的结果写入该向量
         * - v -= v1
         * - v = v1 - v2
         */
        Vector2.prototype.subtract = function (v1, v2) {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x - v2.x;
            this.y = v1.y - v2.y;
            return this;
        };
        /**
         * 将该向量乘上一个向量或将两个向量相乘的结果写入该向量
         * - v *= v1
         * - v = v1 * v2
         */
        Vector2.prototype.multiply = function (v1, v2) {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x * v2.x;
            this.y = v1.y * v2.y;
            return this;
        };
        /**
         * 将该向量加上一个标量或将输入向量与标量相加的结果写入该向量
         * - v += scalar
         * - v = input + scalar
         */
        Vector2.prototype.addScalar = function (scalar, input) {
            input = input || this;
            this.x = input.x + scalar;
            this.y = input.y + scalar;
            return this;
        };
        /**
         * 将该向量乘上一个标量或将输入向量与标量相乘的结果写入该向量
         * - v *= scalar
         * - v = input * scalar
         */
        Vector2.prototype.multiplyScalar = function (scalar, input) {
            input = input || this;
            this.x = scalar * input.x;
            this.y = scalar * input.y;
            return this;
        };
        /**
         * 计算该向量与另一个向量的点积
         * - v · vector
         */
        Vector2.prototype.dot = function (vector) {
            return this.x * vector.x + this.y * vector.y;
        };
        /**
         * 获取一个向量和该向量的夹角
         * - 弧度制
         */
        Vector2.prototype.getAngle = function (vector) {
            var v1 = dou.recyclable(Vector2);
            v1.normalize(this);
            var v2 = dou.recyclable(Vector2);
            v2.normalize(vector);
            var result = Math.acos(v1.dot(v2));
            v1.recycle();
            v2.recycle();
            return result;
        };
        /**
         * 叉乘
         */
        Vector2.prototype.cross = function (vector) {
            return this.x * vector.y - this.y * vector.x;
        };
        /**
         * 归一化该向量或传入的向量
         * - v /= v.length
         */
        Vector2.prototype.normalize = function (input) {
            input = input || this;
            var x = input.x, y = input.y;
            var l = Math.sqrt(x * x + y * y);
            if (l > dou3d.MathUtil.EPSILON) {
                l = 1.0 / l;
                this.x = x * l;
                this.y = y * l;
            }
            else {
                this.x = 1;
                this.y = 0;
            }
            return this;
        };
        Vector2.prototype.equal = function (vector, threshold) {
            if (threshold === void 0) { threshold = dou3d.MathUtil.EPSILON; }
            return Math.abs(this.x - vector.x) <= threshold && Math.abs(this.y - vector.y) <= threshold;
        };
        Vector2.prototype.copy = function (value) {
            return this.set(value.x, value.y);
        };
        Vector2.prototype.clone = function () {
            return new Vector2(this.x, this.y);
        };
        Vector2.prototype.clear = function () {
            this.x = 0;
            this.y = 0;
            return this;
        };
        Vector2.prototype.onRecycle = function () {
            this.clear();
        };
        Vector2.ZERO = new Vector2(0, 0);
        Vector2.ONE = new Vector2(1, 1);
        Vector2.MINUS_ONE = new Vector2(-1, -1);
        return Vector2;
    }());
    dou3d.Vector2 = Vector2;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 三维向量
     * @author wizardc
     */
    var Vector3 = /** @class */ (function () {
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        /**
         * 获取距离
         */
        Vector3.getDistance = function (v1, v2) {
            var x = (v1.x - v2.x);
            var y = (v1.y - v2.y);
            var z = (v1.z - v2.z);
            return Math.sqrt(x * x + y * y + z * z);
        };
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
        Vector3.intersection = function (line1Point, line1Orientation, line2Point, line2Orientation, intersectionPoint) {
            var dot = line1Orientation.dot(line2Orientation);
            if (dot == 1) {
                // 平行
                return false;
            }
            var startPointSeg = dou.recyclable(Vector3);
            startPointSeg.subtract(line2Point, line1Point);
            var vecS1 = dou.recyclable(Vector3);
            vecS1.cross(line1Orientation, line2Orientation);
            var vecS2 = dou.recyclable(Vector3);
            vecS2.cross(startPointSeg, line2Orientation);
            var num = startPointSeg.dot(vecS1);
            if (num >= 0.00001 || num <= 0.00001) {
                // 共面
                startPointSeg.recycle();
                vecS1.recycle();
                vecS2.recycle();
                return false;
            }
            var num2 = vecS2.dot(vecS1) / vecS1.squaredLength;
            if (intersectionPoint) {
                intersectionPoint.copy(line1Orientation);
                intersectionPoint.multiplyScalar(num2);
                intersectionPoint.add(line1Point);
            }
            startPointSeg.recycle();
            vecS1.recycle();
            vecS2.recycle();
            return true;
        };
        /**
         * 线性插值
         */
        Vector3.lerp = function (from, to, t, result) {
            result = result || new Vector3();
            result.x = from.x + (to.x - from.x) * t;
            result.y = from.y + (to.y - from.y) * t;
            result.z = from.z + (to.z - from.z) * t;
            return result;
        };
        /**
         * 球形插值
         */
        Vector3.slerp = function (from, to, t, result) {
            result = result || new Vector3();
            var fromLength = from.length;
            var toLength = to.length;
            if (fromLength < dou3d.MathUtil.EPSILON || toLength < dou3d.MathUtil.EPSILON) {
                return this.lerp(from, to, t, result);
            }
            var dot = from.dot(to) / (fromLength * toLength);
            if (dot > 1 - dou3d.MathUtil.EPSILON) {
                return this.lerp(from, to, t, result);
            }
            var lerpedLength = dou3d.MathUtil.lerp(fromLength, toLength, t);
            var martix1 = dou.recyclable(dou3d.Matrix3);
            var martix2 = dou.recyclable(dou3d.Matrix4);
            if (dot < -1 + dou3d.MathUtil.EPSILON) {
                var axis = result.orthoNormal(from);
                martix1.fromMatrix4(martix2.fromAxis(axis, Math.PI * t));
                result.multiplyScalar(1 / fromLength, from).applyMatrix3(martix1).multiplyScalar(lerpedLength);
            }
            else {
                var axis = result.cross(from, to).normalize();
                martix1.fromMatrix4(martix2.fromAxis(axis, Math.acos(dot) * t));
                result.multiplyScalar(1 / fromLength, from).applyMatrix3(martix1).multiplyScalar(lerpedLength);
            }
            martix1.recycle();
            martix2.recycle();
            return result;
        };
        Object.defineProperty(Vector3.prototype, "squaredLength", {
            get: function () {
                var _a = this, x = _a.x, y = _a.y, z = _a.z;
                return x * x + y * y + z * z;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "length", {
            get: function () {
                var _a = this, x = _a.x, y = _a.y, z = _a.z;
                return Math.sqrt(x * x + y * y + z * z);
            },
            enumerable: true,
            configurable: true
        });
        Vector3.prototype.set = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        /**
         * 将该向量或传入向量加上一个标量
         * - v += scalar
         * - v = input + scalar
         */
        Vector3.prototype.addScalar = function (scalar, input) {
            input = input || this;
            this.x = input.x + scalar;
            this.y = input.y + scalar;
            this.z = input.z + scalar;
            return this;
        };
        /**
         * 将该向量或传入向量乘以一个标量
         * - v *= scalar
         * - v = input * scalar
         */
        Vector3.prototype.multiplyScalar = function (scalar, input) {
            input = input || this;
            this.x = scalar * input.x;
            this.y = scalar * input.y;
            this.z = scalar * input.z;
            return this;
        };
        /**
         * 将该向量加上一个向量或将两个向量相加的结果写入该向量
         * - v += v1
         * - v = v1 + v2
         */
        Vector3.prototype.add = function (v1, v2) {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x + v2.x;
            this.y = v1.y + v2.y;
            this.z = v1.z + v2.z;
            return this;
        };
        /**
         * 将该向量减去一个向量或将两个向量相减的结果写入该向量
         * - v -= v1
         * - v = v1 - v2
         */
        Vector3.prototype.subtract = function (v1, v2) {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x - v2.x;
            this.y = v1.y - v2.y;
            this.z = v1.z - v2.z;
            return this;
        };
        /**
         * 将该向量乘以一个向量或将两个向量相乘的结果写入该向量
         * - v *= v1
         * - v = v1 * v2
         */
        Vector3.prototype.multiply = function (v1, v2) {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            this.x = v1.x * v2.x;
            this.y = v1.y * v2.y;
            this.z = v1.z * v2.z;
            return this;
        };
        /**
         * 将该向量除以一个向量或将两个向量相除的结果写入该向量
         * -  v /= v1
         * -  v = v1 / v2
         */
        Vector3.prototype.divide = function (v1, v2) {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            if (DEBUG && (v2.x === 0 || v2.y === 0 || v2.z === 0)) {
                console.warn("除数为 0");
            }
            this.x = v1.x / v2.x;
            this.y = v1.y / v2.y;
            this.z = v1.z / v2.z;
            return this;
        };
        /**
         * 计算该向量与另一个向量的点积
         * - v · vector
         */
        Vector3.prototype.dot = function (vector) {
            return this.x * vector.x + this.y * vector.y + this.z * vector.z;
        };
        /**
         * 获取一个向量和该向量的夹角
         * - 弧度制
         */
        Vector3.prototype.getAngle = function (vector) {
            var v = this.squaredLength * vector.squaredLength;
            if (v < dou3d.MathUtil.EPSILON) {
                if (DEBUG) {
                    console.warn("除数为 0");
                }
                return 0;
            }
            var theta = this.dot(vector) / Math.sqrt(v);
            return Math.acos(Math.max(-1, Math.min(1, theta)));
        };
        /**
         * 将该向量叉乘一个向量或将两个向量叉乘的结果写入该向量
         * - v ×= vector
         * - v = vectorA × vectorB
         */
        Vector3.prototype.cross = function (v1, v2) {
            if (!v2) {
                v2 = v1;
                v1 = this;
            }
            var x = v1.x;
            var y = v1.y;
            var z = v1.z;
            var xB = v2.x;
            var yB = v2.y;
            var zB = v2.z;
            this.x = y * zB - z * yB;
            this.y = z * xB - x * zB;
            this.z = x * yB - y * xB;
            return this;
        };
        /**
         * 沿着一个法线向量反射该向量或传入向量
         * - 假设法线已被归一化
         */
        Vector3.prototype.reflect = function (normal, input) {
            input = input || this;
            var vector3 = dou.recyclable(Vector3);
            this.subtract(input, vector3.multiplyScalar(2 * input.dot(normal), normal));
            vector3.recycle();
            return this;
        };
        /**
         * 获取一点到该点的直线距离的平方
         */
        Vector3.prototype.getSquaredDistance = function (point) {
            var vector3 = dou.recyclable(Vector3);
            var result = vector3.subtract(point, this).squaredLength;
            vector3.recycle();
            return result;
        };
        /**
         * 获取一点到该点的直线距离
         */
        Vector3.prototype.getPointDistance = function (point) {
            var vector3 = dou.recyclable(Vector3);
            var result = vector3.subtract(point, this).length;
            vector3.recycle();
            return result;
        };
        /**
         * 通过一个球面坐标设置该向量
         * @param radius 球面半径
         * @param phi 相对于 Y 轴的极角
         * @param theta 围绕 Y 轴的赤道角
         */
        Vector3.prototype.fromSphericalCoords = function (radius, phi, theta) {
            if (phi === void 0) { phi = 0; }
            if (theta === void 0) { theta = 0; }
            var sinPhiRadius = Math.sin(phi) * radius;
            this.x = sinPhiRadius * Math.sin(theta);
            this.y = Math.cos(phi) * radius;
            this.z = sinPhiRadius * Math.cos(theta);
            return this;
        };
        /**
         * 将该向量或传入向量乘以一个 3x3 矩阵
         * - v *= matrix
         */
        Vector3.prototype.applyMatrix3 = function (matrix, input) {
            input = input || this;
            var x = input.x, y = input.y, z = input.z;
            var rawData = matrix.rawData;
            if (matrix instanceof dou3d.Matrix3) {
                this.x = rawData[0] * x + rawData[3] * y + rawData[6] * z;
                this.y = rawData[1] * x + rawData[4] * y + rawData[7] * z;
                this.z = rawData[2] * x + rawData[5] * y + rawData[8] * z;
            }
            else {
                this.x = rawData[0] * x + rawData[4] * y + rawData[8] * z;
                this.y = rawData[1] * x + rawData[5] * y + rawData[9] * z;
                this.z = rawData[2] * x + rawData[6] * y + rawData[10] * z;
            }
            return this;
        };
        /**
         * 将该向量或传入向量乘以一个 4x4 矩阵
         * - v *= matrix
         */
        Vector3.prototype.applyMatrix = function (matrix, input) {
            input = input || this;
            var x = input.x, y = input.y, z = input.z;
            var rawData = matrix.rawData;
            var w = rawData[3] * x + rawData[7] * y + rawData[11] * z + rawData[15];
            if (w < -dou3d.MathUtil.EPSILON || dou3d.MathUtil.EPSILON < w) {
                w = 1 / w;
                this.x = (rawData[0] * x + rawData[4] * y + rawData[8] * z + rawData[12]) * w;
                this.y = (rawData[1] * x + rawData[5] * y + rawData[9] * z + rawData[13]) * w;
                this.z = (rawData[2] * x + rawData[6] * y + rawData[10] * z + rawData[14]) * w;
            }
            else {
                if (DEBUG) {
                    console.warn("除数为 0");
                }
                this.x = 0.0;
                this.y = 0.0;
                this.z = 0.0;
            }
            return this;
        };
        /**
         * 将该向量或传入向量乘以一个矩阵
         * - v *= matrix
         * - 矩阵的平移数据不会影响向量
         * - 结果被归一化
         */
        Vector3.prototype.applyDirection = function (matrix, input) {
            input = input || this;
            var x = input.x, y = input.y, z = input.z;
            var rawData = matrix.rawData;
            this.x = rawData[0] * x + rawData[4] * y + rawData[8] * z;
            this.y = rawData[1] * x + rawData[5] * y + rawData[9] * z;
            this.z = rawData[2] * x + rawData[6] * y + rawData[10] * z;
            return this.normalize();
        };
        /**
         * 将该向量或传入向量乘以一个四元数
         * - v *= quaternion
         * - v = input * quaternion
         */
        Vector3.prototype.applyQuaternion = function (quaternion, input) {
            input = input || this;
            var x = input.x, y = input.y, z = input.z;
            var qx = quaternion.x, qy = quaternion.y, qz = quaternion.z, qw = quaternion.w;
            var ix = qw * x + qy * z - qz * y;
            var iy = qw * y + qz * x - qx * z;
            var iz = qw * z + qx * y - qy * x;
            var iw = -qx * x - qy * y - qz * z;
            this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return this;
        };
        /**
         * 归一化该向量或传入的向量
         * - v /= v.length
         */
        Vector3.prototype.normalize = function (input) {
            input = input || this;
            var x = input.x, y = input.y, z = input.z;
            var l = Math.sqrt(x * x + y * y + z * z);
            if (l > dou3d.MathUtil.EPSILON) {
                l = 1 / l;
                this.x = x * l;
                this.y = y * l;
                this.z = z * l;
            }
            else {
                this.x = 1;
                this.y = 0;
                this.z = 0;
            }
            return this;
        };
        /**
         * 归一化该向量，并使该向量垂直于自身或输入向量
         */
        Vector3.prototype.orthoNormal = function (input) {
            input = input || this;
            var x = input.x, y = input.y, z = input.z;
            if (z > 0 ? z > dou3d.MathUtil.SQRT1_2 : z < dou3d.MathUtil.SQRT1_2) {
                var k = 1 / Math.sqrt(y * y + z * z);
                this.x = 0;
                this.y = -z * k;
                this.z = y * k;
            }
            else {
                var k = 1 / Math.sqrt(x * x + y * y);
                this.x = -y * k;
                this.y = x * k;
                this.z = 0;
            }
            return this;
        };
        /**
         * 反转该向量或传入的向量
         */
        Vector3.prototype.negate = function (input) {
            input = input || this;
            this.x = -input.x;
            this.y = -input.y;
            this.z = -input.z;
            return this;
        };
        Vector3.prototype.equal = function (vector, threshold) {
            if (threshold === void 0) { threshold = dou3d.MathUtil.EPSILON; }
            return Math.abs(this.x - vector.x) <= threshold && Math.abs(this.y - vector.y) <= threshold && Math.abs(this.z - vector.z) <= threshold;
        };
        Vector3.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
            return this;
        };
        Vector3.prototype.fromMatrixPosition = function (matrix) {
            return this.fromArray(matrix.rawData, 12);
        };
        Vector3.prototype.fromMatrixColumn = function (matrix, index) {
            return this.fromArray(matrix.rawData, index * 4);
        };
        Vector3.prototype.toArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            array = array || [];
            array[0 + offset] = this.x;
            array[1 + offset] = this.y;
            array[2 + offset] = this.z;
            return array;
        };
        Vector3.prototype.copy = function (value) {
            return this.set(value.x, value.y, value.z);
        };
        Vector3.prototype.clone = function () {
            return new Vector3(this.x, this.y, this.z);
        };
        Vector3.prototype.clear = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        };
        Vector3.prototype.onRecycle = function () {
            this.clear();
        };
        /**
         * 零向量
         */
        Vector3.ZERO = new Vector3(0, 0, 0);
        /**
         * 三方向均为一的向量
         */
        Vector3.ONE = new Vector3(1, 1, 1);
        /**
         * 三方向均为负一的向量
         */
        Vector3.MINUS_ONE = new Vector3(-1, -1, -1);
        /**
         * 上向量
         */
        Vector3.UP = new Vector3(0, 1, 0);
        /**
         * 下向量
         */
        Vector3.DOWN = new Vector3(0, -1, 0);
        /**
         * 左向量
         */
        Vector3.LEFT = new Vector3(-1, 0, 0);
        /**
         * 右向量
         */
        Vector3.RIGHT = new Vector3(1, 0, 0);
        /**
         * 前向量
         */
        Vector3.FORWARD = new Vector3(0, 0, 1);
        /**
         * 后向量
         */
        Vector3.BACK = new Vector3(0, 0, -1);
        return Vector3;
    }());
    dou3d.Vector3 = Vector3;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 四维向量
     * @author wizardc
     */
    var Vector4 = /** @class */ (function () {
        function Vector4(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 1; }
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        /**
         * 线性插值
         */
        Vector4.lerp = function (from, to, t, result) {
            result = result || new Vector4();
            result.x = from.x + (to.x - from.x) * t;
            result.y = from.y + (to.y - from.y) * t;
            result.z = from.z + (to.z - from.z) * t;
            result.w = from.w + (to.w - from.w) * t;
            return result;
        };
        Object.defineProperty(Vector4.prototype, "squaredLength", {
            get: function () {
                var _a = this, x = _a.x, y = _a.y, z = _a.z, w = _a.w;
                return x * x + y * y + z * z + w * w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "length", {
            get: function () {
                var _a = this, x = _a.x, y = _a.y, z = _a.z, w = _a.w;
                return Math.sqrt(x * x + y * y + z * z + w * w);
            },
            enumerable: true,
            configurable: true
        });
        Vector4.prototype.set = function (x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            return this;
        };
        /**
         * 将该向量或传入向量乘以一个标量
         * - v *= scalar
         * - v = input * scalar
         */
        Vector4.prototype.multiplyScalar = function (scalar, input) {
            input = input || this;
            this.x = scalar * input.x;
            this.y = scalar * input.y;
            this.z = scalar * input.z;
            this.w = scalar * input.w;
            return this;
        };
        /**
         * 计算该向量与另一个向量的点积
         * - v · vector
         */
        Vector4.prototype.dot = function (vector) {
            return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
        };
        /**
         * 反转该向量或传入的向量
         */
        Vector4.prototype.inverse = function (input) {
            input = input || this;
            this.x = input.x * -1;
            this.y = input.y * -1;
            this.z = input.z * -1;
            this.w = input.w;
            return this;
        };
        /**
         * 归一化该向量或传入的向量
         * - v /= v.length
         */
        Vector4.prototype.normalize = function (input) {
            input = input || this;
            var x = input.x, y = input.y, z = input.z, w = input.w;
            var l = Math.sqrt(x * x + y * y + z * z + w * w);
            if (l > dou3d.MathUtil.EPSILON) {
                l = 1 / l;
                this.x = x * l;
                this.y = y * l;
                this.z = z * l;
                this.w = w * l;
            }
            else {
                this.clear();
            }
            return this;
        };
        Vector4.prototype.equal = function (value, threshold) {
            if (threshold === void 0) { threshold = dou3d.MathUtil.EPSILON; }
            return Math.abs(this.x - value.x) <= threshold && Math.abs(this.y - value.y) <= threshold && Math.abs(this.z - value.z) <= threshold && Math.abs(this.w - value.w) <= threshold;
        };
        Vector4.prototype.fromArray = function (value, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = value[offset];
            this.y = value[offset + 1];
            this.z = value[offset + 2];
            this.w = value[offset + 3];
            return this;
        };
        Vector4.prototype.toArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            array = array || [];
            array[0 + offset] = this.x;
            array[1 + offset] = this.y;
            array[2 + offset] = this.z;
            array[3 + offset] = this.w;
            return array;
        };
        Vector4.prototype.copy = function (value) {
            return this.set(value.x, value.y, value.z, value.w);
        };
        Vector4.prototype.clone = function () {
            return new Vector4(this.x, this.y, this.z, this.w);
        };
        Vector4.prototype.clear = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
            return this;
        };
        Vector4.prototype.onRecycle = function () {
            this.clear();
        };
        return Vector4;
    }());
    dou3d.Vector4 = Vector4;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 四元数
     * @author wizardc
     */
    var Quaternion = /** @class */ (function (_super) {
        __extends(Quaternion, _super);
        function Quaternion() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 线性插值
         */
        Quaternion.lerp = function (from, to, t, result) {
            result = result || new Quaternion();
            var fX = from.x, fY = from.y, fZ = from.z, fW = from.w;
            var tX = to.x, tY = to.y, tZ = to.z, tW = to.w;
            if (fX * tX + fY * tY + fZ * tZ + fW * tW < 0) {
                result.x = fX + (-tX - fX) * t;
                result.y = fY + (-tY - fY) * t;
                result.z = fZ + (-tZ - fZ) * t;
                result.w = fW + (-tW - fW) * t;
            }
            else {
                result.x = fX + (tX - fX) * t;
                result.y = fY + (tY - fY) * t;
                result.z = fZ + (tZ - fZ) * t;
                result.w = fW + (tW - fW) * t;
            }
            return result.normalize();
        };
        /**
         * 球形插值
         * @tutorial http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
         */
        Quaternion.slerp = function (from, to, t, result) {
            result = result || new Quaternion();
            var fX = from.x, fY = from.y, fZ = from.z, fW = from.w;
            var tX = to.x, tY = to.y, tZ = to.z, tW = to.w;
            var cosHalfTheta = fW * tW + fX * tX + fY * tY + fZ * tZ;
            if (cosHalfTheta < 0) {
                result.w = -tW;
                result.x = -tX;
                result.y = -tY;
                result.z = -tZ;
                cosHalfTheta = -cosHalfTheta;
            }
            else {
                result.w = tW;
                result.x = tX;
                result.y = tY;
                result.z = tZ;
            }
            if (cosHalfTheta >= 1) {
                result.w = fW;
                result.x = fX;
                result.y = fY;
                result.z = fZ;
                return result;
            }
            var sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;
            if (sqrSinHalfTheta < dou3d.MathUtil.EPSILON) {
                return this.lerp(from, result, t, result);
            }
            var sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
            var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
            var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
            result.w = fW * ratioA + result.w * ratioB;
            result.x = fX * ratioA + result.x * ratioB;
            result.y = fY * ratioA + result.y * ratioB;
            result.z = fZ * ratioA + result.z * ratioB;
            return result;
        };
        /**
         * 通过旋转矩阵设置该四元数
         * - 旋转矩阵不应包含缩放值
         * @tutorial http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
         */
        Quaternion.prototype.fromMatrix = function (rotateMatrix) {
            var rawData = rotateMatrix.rawData;
            var m11 = rawData[0], m12 = rawData[4], m13 = rawData[8];
            var m21 = rawData[1], m22 = rawData[5], m23 = rawData[9];
            var m31 = rawData[2], m32 = rawData[6], m33 = rawData[10];
            var trace = m11 + m22 + m33;
            var s = 0;
            if (trace > 0) {
                s = 0.5 / Math.sqrt(trace + 1);
                this.w = 0.25 / s;
                this.x = (m32 - m23) * s;
                this.y = (m13 - m31) * s;
                this.z = (m21 - m12) * s;
            }
            else if (m11 > m22 && m11 > m33) {
                s = 2 * Math.sqrt(1 + m11 - m22 - m33);
                this.w = (m32 - m23) / s;
                this.x = 0.25 * s;
                this.y = (m12 + m21) / s;
                this.z = (m13 + m31) / s;
            }
            else if (m22 > m33) {
                s = 2 * Math.sqrt(1 + m22 - m11 - m33);
                this.w = (m13 - m31) / s;
                this.x = (m12 + m21) / s;
                this.y = 0.25 * s;
                this.z = (m23 + m32) / s;
            }
            else {
                s = 2 * Math.sqrt(1 + m33 - m11 - m22);
                this.w = (m21 - m12) / s;
                this.x = (m13 + m31) / s;
                this.y = (m23 + m32) / s;
                this.z = 0.25 * s;
            }
            return this;
        };
        /**
         * 通过欧拉旋转 (弧度制) 设置该四元数
         * @tutorial http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
         */
        Quaternion.prototype.fromEuler = function (x, y, z, order) {
            if (order === void 0) { order = 3 /* YXZ */; }
            var cos = Math.cos;
            var sin = Math.sin;
            var c1 = cos(x * 0.5);
            var c2 = cos(y * 0.5);
            var c3 = cos(z * 0.5);
            var s1 = sin(x * 0.5);
            var s2 = sin(y * 0.5);
            var s3 = sin(z * 0.5);
            switch (order) {
                case 1 /* XYZ */:
                    this.x = s1 * c2 * c3 + c1 * s2 * s3;
                    this.y = c1 * s2 * c3 - s1 * c2 * s3;
                    this.z = c1 * c2 * s3 + s1 * s2 * c3;
                    this.w = c1 * c2 * c3 - s1 * s2 * s3;
                    break;
                case 2 /* XZY */:
                    this.x = s1 * c2 * c3 - c1 * s2 * s3;
                    this.y = c1 * s2 * c3 - s1 * c2 * s3;
                    this.z = c1 * c2 * s3 + s1 * s2 * c3;
                    this.w = c1 * c2 * c3 + s1 * s2 * s3;
                    break;
                case 3 /* YXZ */:
                    this.x = s1 * c2 * c3 + c1 * s2 * s3;
                    this.y = c1 * s2 * c3 - s1 * c2 * s3;
                    this.z = c1 * c2 * s3 - s1 * s2 * c3;
                    this.w = c1 * c2 * c3 + s1 * s2 * s3;
                    break;
                case 4 /* YZX */:
                    this.x = s1 * c2 * c3 + c1 * s2 * s3;
                    this.y = c1 * s2 * c3 + s1 * c2 * s3;
                    this.z = c1 * c2 * s3 - s1 * s2 * c3;
                    this.w = c1 * c2 * c3 - s1 * s2 * s3;
                    break;
                case 5 /* ZXY */:
                    this.x = s1 * c2 * c3 - c1 * s2 * s3;
                    this.y = c1 * s2 * c3 + s1 * c2 * s3;
                    this.z = c1 * c2 * s3 + s1 * s2 * c3;
                    this.w = c1 * c2 * c3 - s1 * s2 * s3;
                    break;
                case 6 /* ZYX */:
                    this.x = s1 * c2 * c3 - c1 * s2 * s3;
                    this.y = c1 * s2 * c3 + s1 * c2 * s3;
                    this.z = c1 * c2 * s3 - s1 * s2 * c3;
                    this.w = c1 * c2 * c3 + s1 * s2 * s3;
                    break;
            }
            return this;
        };
        /**
         * 通过旋转轴设置该四元数
         * - 假设旋转轴已被归一化
         * @param axis 旋转轴
         * @param angle 旋转角 (弧度制)
         * @tutorial http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
         */
        Quaternion.prototype.fromAxis = function (axis, angle) {
            var halfAngle = angle * 0.5, s = Math.sin(halfAngle);
            this.x = axis.x * s;
            this.y = axis.y * s;
            this.z = axis.z * s;
            this.w = Math.cos(halfAngle);
            return this;
        };
        /**
         * 通过自起始方向到目标方向的旋转值设置该四元数
         * - 假设方向向量已被归一化
         */
        Quaternion.prototype.fromVectors = function (from, to) {
            var r = from.dot(to) + 1;
            var vector3 = dou.recyclable(dou3d.Vector3);
            if (r < dou3d.MathUtil.EPSILON) {
                r = 0;
                if (Math.abs(from.x) > Math.abs(from.z)) {
                    vector3.set(-from.y, from.x, 0);
                }
                else {
                    vector3.set(0, -from.z, from.y);
                }
            }
            else {
                vector3.cross(from, to);
            }
            this.x = vector3.x;
            this.y = vector3.y;
            this.z = vector3.z;
            this.w = r;
            vector3.recycle();
            return this.normalize();
        };
        /**
         * 将该四元数转换为欧拉旋转 (弧度制)
         */
        Quaternion.prototype.toEuler = function (out, order) {
            if (order === void 0) { order = 3 /* YXZ */; }
            out = out || new dou3d.Vector3();
            var matrix = dou.recyclable(dou3d.Matrix4);
            var result = matrix.fromRotation(this).toEuler(order, out);
            matrix.recycle();
            return result;
        };
        /**
         * 将该四元数乘以一个四元数或将两个四元数相乘的结果写入该四元数
         * - v *= q1
         * - v = q1 * q2
         * @tutorial http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
         */
        Quaternion.prototype.multiply = function (q1, q2) {
            if (!q2) {
                q2 = q1;
                q1 = this;
            }
            var ax = q1.x, ay = q1.y, az = q1.z, aw = q1.w;
            var bx = q2.x, by = q2.y, bz = q2.z, bw = q2.w;
            this.x = ax * bw + aw * bx + ay * bz - az * by;
            this.y = ay * bw + aw * by + az * bx - ax * bz;
            this.z = az * bw + aw * bz + ax * by - ay * bx;
            this.w = aw * bw - ax * bx - ay * by - az * bz;
            return this;
        };
        /**
         * 旋转指定点
         */
        Quaternion.prototype.transformVector = function (vector, result) {
            result = result || new dou3d.Vector3();
            var x = this.x, y = this.y, z = this.z, w = this.w;
            var x2 = vector.x, y2 = vector.y, z2 = vector.z;
            var w1 = -x * x2 - y * y2 - z * z2;
            var x1 = w * x2 + y * z2 - z * y2;
            var y1 = w * y2 - x * z2 + z * x2;
            var z1 = w * z2 + x * y2 - y * x2;
            result.x = -w1 * x + x1 * w - y1 * z + z1 * y;
            result.y = -w1 * y + x1 * z + y1 * w - z1 * x;
            result.z = -w1 * z - x1 * y + y1 * x + z1 * w;
            return result;
        };
        /**
         * 设置该四元数, 使其与起始点到目标点的方向相一致
         */
        Quaternion.prototype.lookAt = function (from, to, up) {
            var matrix = dou.recyclable(dou3d.Matrix4);
            var result = this.fromMatrix(matrix.lookAt(from, to, up));
            matrix.recycle();
            return result;
        };
        /**
         * 设置该四元数, 使其与目标方向相一致
         */
        Quaternion.prototype.lookRotation = function (vector, up) {
            var matrix = dou.recyclable(dou3d.Matrix4);
            var result = this.fromMatrix(matrix.lookRotation(vector, up));
            matrix.recycle();
            return result;
        };
        /**
         * 获取该四元数和一个四元数的夹角 (弧度制)
         */
        Quaternion.prototype.getAngle = function (value) {
            return 2 * Math.acos(Math.abs(dou3d.MathUtil.clamp(this.dot(value), -1, 1)));
        };
        /**
         * 将该四元数转换为恒等四元数
         */
        Quaternion.prototype.identity = function () {
            this.x = this.y = this.z = 0;
            this.w = 1;
            return this;
        };
        Quaternion.prototype.clone = function () {
            return new Quaternion(this.x, this.y, this.z, this.w);
        };
        /**
         * 恒等四元数
         */
        Quaternion.IDENTITY = new Quaternion();
        return Quaternion;
    }(dou3d.Vector4));
    dou3d.Quaternion = Quaternion;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 3×3 矩阵
     * @author wizardc
     */
    var Matrix3 = /** @class */ (function () {
        function Matrix3(rawData, offsetOrByteOffset) {
            if (offsetOrByteOffset === void 0) { offsetOrByteOffset = 0; }
            if (rawData && rawData instanceof ArrayBuffer) {
                this.fromBuffer(rawData, offsetOrByteOffset);
            }
            else {
                this.rawData = new Float32Array(9);
                this.fromArray(rawData || [1, 0, 0, 0, 1, 0, 0, 0, 1]);
            }
        }
        Object.defineProperty(Matrix3.prototype, "determinant", {
            /**
             * 当前矩阵行列式的值
             */
            get: function () {
                var rawData = this.rawData;
                var a = rawData[0], b = rawData[1], c = rawData[2], d = rawData[3], e = rawData[4], f = rawData[5], g = rawData[6], h = rawData[7], i = rawData[8];
                return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
            },
            enumerable: true,
            configurable: true
        });
        Matrix3.prototype.set = function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {
            var rawData = this.rawData;
            rawData[0] = n11;
            rawData[1] = n21;
            rawData[2] = n31;
            rawData[3] = n12;
            rawData[4] = n22;
            rawData[5] = n32;
            rawData[6] = n13;
            rawData[7] = n23;
            rawData[8] = n33;
            return this;
        };
        Matrix3.prototype.getNormalMatrix = function (matrix4) {
            return this.fromMatrix4(matrix4).inverse().transpose();
        };
        /**
         * 反转当前矩阵或传入的矩阵
         */
        Matrix3.prototype.inverse = function (input) {
            input = input || this;
            var me = input.rawData, te = this.rawData, n11 = me[0], n21 = me[1], n31 = me[2], n12 = me[3], n22 = me[4], n32 = me[5], n13 = me[6], n23 = me[7], n33 = me[8], t11 = n33 * n22 - n32 * n23, t12 = n32 * n13 - n33 * n12, t13 = n23 * n12 - n22 * n13, det = n11 * t11 + n21 * t12 + n31 * t13;
            if (det === 0) {
                return this.identity();
            }
            var detInv = 1 / det;
            te[0] = t11 * detInv;
            te[1] = (n31 * n23 - n33 * n21) * detInv;
            te[2] = (n32 * n21 - n31 * n22) * detInv;
            te[3] = t12 * detInv;
            te[4] = (n33 * n11 - n31 * n13) * detInv;
            te[5] = (n31 * n12 - n32 * n11) * detInv;
            te[6] = t13 * detInv;
            te[7] = (n21 * n13 - n23 * n11) * detInv;
            te[8] = (n22 * n11 - n21 * n12) * detInv;
            return this;
        };
        /**
         * 转置矩阵
         */
        Matrix3.prototype.transpose = function () {
            var temp = 0;
            var rawData = this.rawData;
            temp = rawData[1];
            rawData[1] = rawData[3];
            rawData[3] = temp;
            temp = rawData[2];
            rawData[2] = rawData[6];
            rawData[6] = temp;
            temp = rawData[5];
            rawData[5] = rawData[7];
            rawData[7] = temp;
            return this;
        };
        /**
         * 将该矩阵乘以一个矩阵或将两个矩阵相乘的结果写入该矩阵
         * - v *= matrix
         * - v = matrixA * matrixB
         */
        Matrix3.prototype.multiply = function (matrixA, matrixB) {
            if (!matrixB) {
                matrixB = matrixA;
                matrixA = this;
            }
            var rawDataA = matrixA.rawData;
            var rawDataB = matrixB.rawData;
            var rawData = this.rawData;
            var a11 = rawDataA[0], a12 = rawDataA[3], a13 = rawDataA[6];
            var a21 = rawDataA[1], a22 = rawDataA[4], a23 = rawDataA[7];
            var a31 = rawDataA[2], a32 = rawDataA[5], a33 = rawDataA[8];
            var b11 = rawDataB[0], b12 = rawDataB[3], b13 = rawDataB[6];
            var b21 = rawDataB[1], b22 = rawDataB[4], b23 = rawDataB[7];
            var b31 = rawDataB[2], b32 = rawDataB[5], b33 = rawDataB[8];
            rawData[0] = a11 * b11 + a12 * b21 + a13 * b31;
            rawData[3] = a11 * b12 + a12 * b22 + a13 * b32;
            rawData[6] = a11 * b13 + a12 * b23 + a13 * b33;
            rawData[1] = a21 * b11 + a22 * b21 + a23 * b31;
            rawData[4] = a21 * b12 + a22 * b22 + a23 * b32;
            rawData[7] = a21 * b13 + a22 * b23 + a23 * b33;
            rawData[2] = a31 * b11 + a32 * b21 + a33 * b31;
            rawData[5] = a31 * b12 + a32 * b22 + a33 * b32;
            rawData[8] = a31 * b13 + a32 * b23 + a33 * b33;
            return this;
        };
        Matrix3.prototype.fromArray = function (value, offset) {
            if (offset === void 0) { offset = 0; }
            for (var i = 0; i < 9; ++i) {
                this.rawData[i] = value[i + offset];
            }
            return this;
        };
        Matrix3.prototype.fromBuffer = function (value, byteOffset) {
            if (byteOffset === void 0) { byteOffset = 0; }
            this.rawData = new Float32Array(value, byteOffset, 9);
            return this;
        };
        Matrix3.prototype.fromScale = function (vector) {
            var rawData = this.rawData;
            rawData[0] = vector.x;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;
            rawData[4] = vector.y;
            rawData[5] = 0;
            rawData[6] = 0;
            rawData[7] = 0;
            rawData[8] = vector.z;
            return this;
        };
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
        Matrix3.prototype.fromUVTransform = function (offsetX, offsetY, repeatX, repeatY, rotation, pivotX, pivotY) {
            if (rotation === void 0) { rotation = 0; }
            if (pivotX === void 0) { pivotX = 0; }
            if (pivotY === void 0) { pivotY = 0; }
            var cos = Math.cos(rotation);
            var sin = Math.sin(rotation);
            return this.set(repeatX * cos, repeatX * sin, -repeatX * (cos * pivotX + sin * pivotY) + pivotX + offsetX, -repeatY * sin, repeatY * cos, -repeatY * (-sin * pivotX + cos * pivotY) + pivotY + offsetY, 0, 0, 1);
        };
        Matrix3.prototype.fromMatrix4 = function (value) {
            var rawData = value.rawData;
            this.set(rawData[0], rawData[4], rawData[8], rawData[1], rawData[5], rawData[9], rawData[2], rawData[6], rawData[10]);
            return this;
        };
        Matrix3.prototype.toArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            array = array || [];
            for (var i = 0; i < 9; ++i) {
                array[i + offset] = this.rawData[i];
            }
            return array;
        };
        Matrix3.prototype.copy = function (value) {
            this.fromArray(value.rawData);
            return this;
        };
        Matrix3.prototype.clone = function () {
            var value = new Matrix3();
            value.copy(this);
            return value;
        };
        Matrix3.prototype.identity = function () {
            var rawData = this.rawData;
            rawData[0] = 1;
            rawData[1] = 0;
            rawData[2] = 0;
            rawData[3] = 0;
            rawData[4] = 1;
            rawData[5] = 0;
            rawData[6] = 0;
            rawData[7] = 0;
            rawData[8] = 1;
            return this;
        };
        Matrix3.prototype.onRecycle = function () {
            this.identity();
        };
        /**
         * 一个静态的恒等矩阵
         */
        Matrix3.IDENTITY = new Matrix3();
        return Matrix3;
    }());
    dou3d.Matrix3 = Matrix3;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
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
    var Matrix4 = /** @class */ (function () {
        function Matrix4(rawData, offsetOrByteOffset) {
            if (offsetOrByteOffset === void 0) { offsetOrByteOffset = 0; }
            if (rawData && rawData instanceof ArrayBuffer) {
                this.fromBuffer(rawData, offsetOrByteOffset);
            }
            else {
                this.rawData = new Float32Array(16);
                this.fromArray(rawData || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            }
        }
        /**
         * 线性插值
         */
        Matrix4.lerp = function (from, to, t, result) {
            result = result || new Matrix4();
            var rawData = result.rawData;
            if (t == 0) {
                for (var i = 0; i < 16; i++) {
                    rawData[i] = from.rawData[i];
                }
                return result;
            }
            else if (t == 1) {
                for (var i = 0; i < 16; i++) {
                    rawData[i] = to.rawData[i];
                }
                return result;
            }
            for (var i = 0; i < 16; i++) {
                var fV = from.rawData[i];
                rawData[i] = fV + (to.rawData[i] - fV) * t;
            }
            return result;
        };
        Object.defineProperty(Matrix4.prototype, "determinant", {
            /**
             * 获取该矩阵的行列式
             * @tutorial https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js
             */
            get: function () {
                var rawData = this.rawData;
                var n11 = rawData[0], n12 = rawData[4], n13 = rawData[8], n14 = rawData[12];
                var n21 = rawData[1], n22 = rawData[5], n23 = rawData[9], n24 = rawData[13];
                var n31 = rawData[2], n32 = rawData[6], n33 = rawData[10], n34 = rawData[14];
                var n41 = rawData[3], n42 = rawData[7], n43 = rawData[11], n44 = rawData[15];
                var n2332 = n23 * n32, n2432 = n24 * n32, n2233 = n22 * n33, n2433 = n24 * n33, n2234 = n22 * n34, n2334 = n23 * n34;
                var n2133 = n21 * n33, n2134 = n21 * n34, n2431 = n24 * n31, n2331 = n23 * n31, n2132 = n21 * n32, n2231 = n22 * n31;
                return (n41 * (n14 * n2332 - n13 * n2432 - n14 * n2233 + n12 * n2433 + n13 * n2234 - n12 * n2334) + n42 * (n11 * n2334 - n11 * n2433 + n14 * n2133 - n13 * n2134 + n13 * n2431 - n14 * n2331) + n43 * (n11 * n2432 - n11 * n2234 - n14 * n2132 + n12 * n2134 + n14 * n2231 - n12 * n2431) + n44 * (-n13 * n2231 - n11 * n2332 + n11 * n2233 + n13 * n2132 - n12 * n2133 + n12 * n2331));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "maxScaleOnAxis", {
            /**
             * 获取该矩阵的最大缩放值
             */
            get: function () {
                var rawData = this.rawData;
                var scaleXSq = rawData[0] * rawData[0] + rawData[1] * rawData[1] + rawData[2] * rawData[2];
                var scaleYSq = rawData[4] * rawData[4] + rawData[5] * rawData[5] + rawData[6] * rawData[6];
                var scaleZSq = rawData[8] * rawData[8] + rawData[9] * rawData[9] + rawData[10] * rawData[10];
                return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
            },
            enumerable: true,
            configurable: true
        });
        Matrix4.prototype.set = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
            var rawData = this.rawData;
            rawData[0] = n11;
            rawData[4] = n12;
            rawData[8] = n13;
            rawData[12] = n14;
            rawData[1] = n21;
            rawData[5] = n22;
            rawData[9] = n23;
            rawData[13] = n24;
            rawData[2] = n31;
            rawData[6] = n32;
            rawData[10] = n33;
            rawData[14] = n34;
            rawData[3] = n41;
            rawData[7] = n42;
            rawData[11] = n43;
            rawData[15] = n44;
            return this;
        };
        /**
         * 前方 (+Z轴方向)
         */
        Matrix4.prototype.forward = function (result) {
            return this.copyColumnTo(2, result).normalize();
        };
        /**
         * 上方 (+y轴方向)
         */
        Matrix4.prototype.up = function (result) {
            return this.copyColumnTo(1, result).normalize();
        };
        /**
         * 右方 (+x轴方向)
         */
        Matrix4.prototype.right = function (result) {
            return this.copyColumnTo(0, result).normalize();
        };
        /**
         * 后方 (-z轴方向)
         */
        Matrix4.prototype.back = function (result) {
            return this.copyColumnTo(2, result).normalize().negate();
        };
        /**
         * 下方 (-y轴方向)
         */
        Matrix4.prototype.down = function (result) {
            return this.copyColumnTo(1, result).normalize().negate();
        };
        /**
         * 左方 (-x轴方向)
         */
        Matrix4.prototype.left = function (result) {
            return this.copyColumnTo(0, result).normalize().negate();
        };
        Matrix4.prototype.copyColumnTo = function (column, result) {
            result = result || new dou3d.Vector3();
            result.x = this.rawData[column * 4 + 0];
            result.y = this.rawData[column * 4 + 1];
            result.z = this.rawData[column * 4 + 2];
            return result;
        };
        /**
         * 通过平移向量、四元数旋转、缩放向量设置该矩阵
         * @param translation 平移向量
         * @param rotation 四元数旋转
         * @param scale 缩放向量
         */
        Matrix4.prototype.compose = function (translation, rotation, scale) {
            var rX = rotation.x, rY = rotation.y, rZ = rotation.z, rW = rotation.w;
            var sX = scale.x, sY = scale.y, sZ = scale.z;
            var x2 = rX + rX, y2 = rY + rY, z2 = rZ + rZ;
            var xx = rX * x2, xy = rX * y2, xz = rX * z2;
            var yy = rY * y2, yz = rY * z2, zz = rZ * z2;
            var wx = rW * x2, wy = rW * y2, wz = rW * z2;
            var rawData = this.rawData;
            rawData[0] = (1 - (yy + zz)) * sX;
            rawData[1] = (xy + wz) * sX;
            rawData[2] = (xz - wy) * sX;
            rawData[4] = (xy - wz) * sY;
            rawData[5] = (1 - (xx + zz)) * sY;
            rawData[6] = (yz + wx) * sY;
            rawData[8] = (xz + wy) * sZ;
            rawData[9] = (yz - wx) * sZ;
            rawData[10] = (1 - (xx + yy)) * sZ;
            rawData[12] = translation.x;
            rawData[13] = translation.y;
            rawData[14] = translation.z;
            rawData[3] = rawData[7] = rawData[11] = 0, rawData[15] = 1;
            return this;
        };
        /**
         * 将该矩阵分解为平移向量、四元数旋转、缩放向量
         * @param translation 平移向量
         * @param rotation 四元数旋转
         * @param scale 缩放向量
         */
        Matrix4.prototype.decompose = function (translation, rotation, scale) {
            var rawData = this.rawData;
            if (translation) {
                translation.x = rawData[12];
                translation.y = rawData[13];
                translation.z = rawData[14];
            }
            if (rotation || scale) {
                var vector = dou.recyclable(dou3d.Vector3);
                var sx = vector.set(rawData[0], rawData[1], rawData[2]).length;
                var sy = vector.set(rawData[4], rawData[5], rawData[6]).length;
                var sz = vector.set(rawData[8], rawData[9], rawData[10]).length;
                if (this.determinant < 0) {
                    sx = -sx;
                }
                if (rotation) {
                    var matrix = dou.recyclable(Matrix4);
                    var helpRawData = matrix.rawData;
                    var invSX = 1 / sx;
                    var invSY = 1 / sy;
                    var invSZ = 1 / sz;
                    matrix.copy(this);
                    helpRawData[0] *= invSX;
                    helpRawData[1] *= invSX;
                    helpRawData[2] *= invSX;
                    helpRawData[4] *= invSY;
                    helpRawData[5] *= invSY;
                    helpRawData[6] *= invSY;
                    helpRawData[8] *= invSZ;
                    helpRawData[9] *= invSZ;
                    helpRawData[10] *= invSZ;
                    rotation.fromMatrix(matrix);
                    matrix.recycle();
                }
                if (scale) {
                    scale.x = sx;
                    scale.y = sy;
                    scale.z = sz;
                }
                vector.recycle();
            }
            return this;
        };
        /**
         * 提取该矩阵的旋转分量或提取传入矩阵的旋转分量写入该矩阵
         */
        Matrix4.prototype.extractRotation = function (input) {
            input = input || this;
            var rawData = this.rawData;
            var inputRawData = input.rawData;
            var vector = dou.recyclable(dou3d.Vector3);
            var scaleX = 1 / vector.fromMatrixColumn(input, 0).length;
            var scaleY = 1 / vector.fromMatrixColumn(input, 1).length;
            var scaleZ = 1 / vector.fromMatrixColumn(input, 2).length;
            rawData[0] = inputRawData[0] * scaleX;
            rawData[1] = inputRawData[1] * scaleX;
            rawData[2] = inputRawData[2] * scaleX;
            rawData[3] = 0;
            rawData[4] = inputRawData[4] * scaleY;
            rawData[5] = inputRawData[5] * scaleY;
            rawData[6] = inputRawData[6] * scaleY;
            rawData[7] = 0;
            rawData[8] = inputRawData[8] * scaleZ;
            rawData[9] = inputRawData[9] * scaleZ;
            rawData[10] = inputRawData[10] * scaleZ;
            rawData[11] = 0;
            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = 0;
            rawData[15] = 1;
            vector.recycle();
            return this;
        };
        /**
         * 转置该矩阵或将传入矩阵转置的结果写入该矩阵
         */
        Matrix4.prototype.transpose = function (input) {
            input = input || this;
            var rawData = this.rawData;
            var inputRawData = input.rawData;
            var temp = 0;
            temp = inputRawData[1];
            rawData[1] = inputRawData[4];
            rawData[4] = temp;
            temp = inputRawData[2];
            rawData[2] = inputRawData[8];
            rawData[8] = temp;
            temp = inputRawData[6];
            rawData[6] = inputRawData[9];
            rawData[9] = temp;
            temp = inputRawData[3];
            rawData[3] = inputRawData[12];
            rawData[12] = temp;
            temp = inputRawData[7];
            rawData[7] = inputRawData[13];
            rawData[13] = temp;
            temp = inputRawData[11];
            rawData[11] = inputRawData[14];
            rawData[14] = temp;
            return this;
        };
        /**
         * 将该矩阵求逆或将传入矩阵的逆矩阵写入该矩阵
         */
        Matrix4.prototype.inverse = function (input) {
            input = input || this;
            var rawData = this.rawData;
            var valueRawData = input.rawData;
            var n11 = valueRawData[0], n12 = valueRawData[4], n13 = valueRawData[8], n14 = valueRawData[12];
            var n21 = valueRawData[1], n22 = valueRawData[5], n23 = valueRawData[9], n24 = valueRawData[13];
            var n31 = valueRawData[2], n32 = valueRawData[6], n33 = valueRawData[10], n34 = valueRawData[14];
            var n41 = valueRawData[3], n42 = valueRawData[7], n43 = valueRawData[11], n44 = valueRawData[15];
            var n2332 = n23 * n32, n2432 = n24 * n32, n2233 = n22 * n33, n2433 = n24 * n33, n2234 = n22 * n34, n2334 = n23 * n34;
            var n2133 = n21 * n33, n2134 = n21 * n34, n2431 = n24 * n31, n2331 = n23 * n31, n2132 = n21 * n32, n2231 = n22 * n31;
            var t11 = n2334 * n42 - n2433 * n42 + n2432 * n43 - n2234 * n43 - n2332 * n44 + n2233 * n44;
            var t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
            var t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
            var t14 = n14 * n2332 - n13 * n2432 - n14 * n2233 + n12 * n2433 + n13 * n2234 - n12 * n2334;
            var determinant = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
            if (determinant == 0) {
                if (DEBUG) {
                    console.warn("Cannot invert matrix, determinant is 0.");
                }
                return this.identity();
            }
            var detInv = 1 / determinant;
            rawData[0] = t11 * detInv;
            rawData[1] = (n2433 * n41 - n2334 * n41 - n2431 * n43 + n2134 * n43 + n2331 * n44 - n2133 * n44) * detInv;
            rawData[2] = (n2234 * n41 - n2432 * n41 + n2431 * n42 - n2134 * n42 - n2231 * n44 + n2132 * n44) * detInv;
            rawData[3] = (n2332 * n41 - n2233 * n41 - n2331 * n42 + n2133 * n42 + n2231 * n43 - n2132 * n43) * detInv;
            rawData[4] = t12 * detInv;
            rawData[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
            rawData[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
            rawData[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
            rawData[8] = t13 * detInv;
            rawData[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
            rawData[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
            rawData[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
            rawData[12] = t14 * detInv;
            rawData[13] = (n13 * n2431 - n14 * n2331 + n14 * n2133 - n11 * n2433 - n13 * n2134 + n11 * n2334) * detInv;
            rawData[14] = (n14 * n2231 - n12 * n2431 - n14 * n2132 + n11 * n2432 + n12 * n2134 - n11 * n2234) * detInv;
            rawData[15] = (n12 * n2331 - n13 * n2231 + n13 * n2132 - n11 * n2332 - n12 * n2133 + n11 * n2233) * detInv;
            return this;
        };
        /**
         * 将该矩阵乘以一个标量或将传入矩阵与一个标量相乘的结果写入该矩阵
         * - v *= scaler
         */
        Matrix4.prototype.multiplyScalar = function (scalar, input) {
            input = input || this;
            var rawData = this.rawData;
            var inputRawData = input.rawData;
            rawData[0] = inputRawData[0] * scalar;
            rawData[1] = inputRawData[1] * scalar;
            rawData[2] = inputRawData[2] * scalar;
            rawData[3] = inputRawData[3] * scalar;
            rawData[4] = inputRawData[4] * scalar;
            rawData[5] = inputRawData[5] * scalar;
            rawData[6] = inputRawData[6] * scalar;
            rawData[7] = inputRawData[7] * scalar;
            rawData[8] = inputRawData[8] * scalar;
            rawData[9] = inputRawData[9] * scalar;
            rawData[10] = inputRawData[10] * scalar;
            rawData[11] = inputRawData[11] * scalar;
            rawData[12] = inputRawData[12] * scalar;
            rawData[13] = inputRawData[13] * scalar;
            rawData[14] = inputRawData[14] * scalar;
            rawData[15] = inputRawData[15] * scalar;
            return this;
        };
        /**
         * 将该矩阵乘以一个矩阵或将两个矩阵相乘的结果写入该矩阵
         * - v *= matrix
         * - v = matrixA * matrixB
         */
        Matrix4.prototype.multiply = function (matrixA, matrixB) {
            if (!matrixB) {
                matrixB = matrixA;
                matrixA = this;
            }
            var rawData = this.rawData;
            var rawDataA = matrixA.rawData;
            var rawDataB = matrixB.rawData;
            var a11 = rawDataA[0], a12 = rawDataA[4], a13 = rawDataA[8], a14 = rawDataA[12];
            var a21 = rawDataA[1], a22 = rawDataA[5], a23 = rawDataA[9], a24 = rawDataA[13];
            var a31 = rawDataA[2], a32 = rawDataA[6], a33 = rawDataA[10], a34 = rawDataA[14];
            var a41 = rawDataA[3], a42 = rawDataA[7], a43 = rawDataA[11], a44 = rawDataA[15];
            var b11 = rawDataB[0], b12 = rawDataB[4], b13 = rawDataB[8], b14 = rawDataB[12];
            var b21 = rawDataB[1], b22 = rawDataB[5], b23 = rawDataB[9], b24 = rawDataB[13];
            var b31 = rawDataB[2], b32 = rawDataB[6], b33 = rawDataB[10], b34 = rawDataB[14];
            var b41 = rawDataB[3], b42 = rawDataB[7], b43 = rawDataB[11], b44 = rawDataB[15];
            rawData[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            rawData[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            rawData[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            rawData[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
            rawData[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            rawData[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            rawData[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            rawData[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
            rawData[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            rawData[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            rawData[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            rawData[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
            rawData[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            rawData[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            rawData[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            rawData[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
            return this;
        };
        /**
         * 将该矩阵乘以一个矩阵来之后前置一个矩阵或将两个矩阵相乘来前置一个矩阵的结果写入该矩阵
         */
        Matrix4.prototype.append = function (matrixA, matrixB) {
            if (!matrixB) {
                matrixB = matrixA;
                matrixA = this;
            }
            var rawData = this.rawData;
            var rawDataA = matrixA.rawData;
            var rawDataB = matrixB.rawData;
            var a11 = rawDataA[0], a21 = rawDataA[4], a31 = rawDataA[8], a41 = rawDataA[12];
            var a12 = rawDataA[1], a22 = rawDataA[5], a32 = rawDataA[9], a42 = rawDataA[13];
            var a13 = rawDataA[2], a23 = rawDataA[6], a33 = rawDataA[10], a43 = rawDataA[14];
            var a14 = rawDataA[3], a24 = rawDataA[7], a34 = rawDataA[11], a44 = rawDataA[15];
            var b11 = rawDataB[0], b21 = rawDataB[4], b31 = rawDataB[8], b41 = rawDataB[12];
            var b12 = rawDataB[1], b22 = rawDataB[5], b32 = rawDataB[9], b42 = rawDataB[13];
            var b13 = rawDataB[2], b23 = rawDataB[6], b33 = rawDataB[10], b43 = rawDataB[14];
            var b14 = rawDataB[3], b24 = rawDataB[7], b34 = rawDataB[11], b44 = rawDataB[15];
            rawData[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            rawData[1] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            rawData[2] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            rawData[3] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
            rawData[4] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            rawData[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            rawData[6] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            rawData[7] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
            rawData[8] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            rawData[9] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            rawData[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            rawData[11] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
            rawData[12] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            rawData[13] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            rawData[14] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            rawData[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
            return this;
        };
        /**
         * 转换指定点
         */
        Matrix4.prototype.transformVector = function (vector, result) {
            result = result || new dou3d.Vector4();
            var x = vector.x, y = vector.y, z = vector.z;
            var rawData = this.rawData;
            result.x = x * rawData[0] + y * rawData[4] + z * rawData[8] + rawData[12];
            result.y = x * rawData[1] + y * rawData[5] + z * rawData[9] + rawData[13];
            result.z = x * rawData[2] + y * rawData[6] + z * rawData[10] + rawData[14];
            result.w = x * rawData[3] + y * rawData[7] + z * rawData[11] + rawData[15];
            return result;
        };
        /**
         * 根据投影参数设置该矩阵
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
        Matrix4.prototype.fromProjection = function (near, far, fov, size, opvalue, asp, matchFactor, viewport) {
            var orthographicMatrix = dou.recyclable(Matrix4);
            matchFactor = 1 - matchFactor;
            var offsetX = (viewport ? -viewport.x : 0) - 0.5;
            var offsetY = (viewport ? viewport.y : 0) + 0.5;
            var scaleX = viewport ? viewport.w : 1;
            var scaleY = viewport ? viewport.h : 1;
            if (opvalue > 0) {
                var wh = 2 * near * Math.tan(fov * 0.5);
                var heightX = wh;
                var widthX = asp * heightX;
                var leftX = offsetX * widthX;
                var topX = offsetY * heightX;
                var widthY = wh;
                var heightY = widthY / asp;
                var leftY = offsetX * widthY;
                var topY = offsetY * heightY;
                var left = leftX + (leftY - leftX) * matchFactor;
                var top_1 = topX + (topY - topX) * matchFactor;
                var width = (widthX + (widthY - widthX) * matchFactor) * scaleX;
                var height = (heightX + (heightY - heightX) * matchFactor) * scaleY;
                this.perspectiveProjectMatrix(left, left + width, top_1, top_1 - height, near, far);
            }
            if (opvalue < 1) {
                var widthX = size * asp;
                var heightX = size;
                var leftX = offsetX * widthX;
                var topX = offsetY * heightX;
                var widthY = size;
                var heightY = size / asp;
                var leftY = offsetX * widthY;
                var topY = offsetY * heightY;
                var left = leftX + (leftY - leftX) * matchFactor;
                var top_2 = topX + (topY - topX) * matchFactor;
                var width = (widthX + (widthY - widthX) * matchFactor) * scaleX;
                var height = (heightX + (heightY - heightX) * matchFactor) * scaleY;
                orthographicMatrix.orthographicProjectMatrix(left, left + width, top_2, top_2 - height, near, far);
            }
            if (opvalue == 0) {
                this.copy(orthographicMatrix);
            }
            else if (opvalue == 1) {
            }
            else {
                Matrix4.lerp(orthographicMatrix, this, Math.pow(opvalue, 8), this);
            }
            orthographicMatrix.recycle();
            return this;
        };
        /**
         * 透视矩阵
         */
        Matrix4.prototype.perspectiveProjectMatrix = function (left, right, top, bottom, near, far) {
            var iDeltaX = 1 / (right - left);
            var iDeltaY = 1 / (top - bottom);
            var iDeltaZ = 1 / (near - far);
            var doubleNear = 2 * near;
            var rawData = this.rawData;
            rawData[0] = doubleNear * iDeltaX;
            rawData[1] = rawData[2] = rawData[3] = 0;
            rawData[4] = rawData[6] = rawData[7] = 0;
            rawData[5] = doubleNear * iDeltaY;
            rawData[8] = (right + left) * iDeltaX;
            rawData[9] = (top + bottom) * iDeltaY;
            rawData[10] = -(far + near) * iDeltaZ;
            rawData[11] = 1;
            rawData[12] = rawData[13] = rawData[15] = 0;
            rawData[14] = doubleNear * far * iDeltaZ;
            return this;
        };
        /**
         * 正交矩阵
         */
        Matrix4.prototype.orthographicProjectMatrix = function (left, right, top, bottom, near, far) {
            var w = 1 / (right - left);
            var h = 1 / (top - bottom);
            var p = 1 / (near - far);
            var rawData = this.rawData;
            rawData[0] = 2 * w;
            rawData[1] = rawData[2] = rawData[3] = 0;
            rawData[4] = rawData[6] = rawData[7] = 0;
            rawData[5] = 2 * h;
            rawData[8] = rawData[9] = rawData[11] = 0;
            rawData[10] = -2 * p;
            rawData[12] = -(right + left) * w;
            rawData[13] = -(top + bottom) * h;
            rawData[14] = (far + near) * p;
            rawData[15] = 1;
            return this;
        };
        /**
         * 设置该矩阵, 使其 Z 轴正方向与起始点到目标点的方向相一致
         * - 矩阵的缩放值将被覆盖
         * @param from 起始点
         * @param to 目标点
         * @param up
         */
        Matrix4.prototype.lookAt = function (from, to, up) {
            var vector = dou.recyclable(dou3d.Vector3);
            this.lookRotation(vector.subtract(to, from), up);
            vector.recycle();
            return this;
        };
        /**
         * 设置该矩阵, 使其 Z 轴正方向与目标方向相一致
         * - 矩阵的缩放值将被覆盖
         * @param vector 目标方向
         * @param up
         */
        Matrix4.prototype.lookRotation = function (vector, up) {
            var vector1 = dou.recyclable(dou3d.Vector3);
            var vector2 = dou.recyclable(dou3d.Vector3);
            var vector3 = dou.recyclable(dou3d.Vector3);
            var z = vector1.normalize(vector);
            var x = vector2.cross(up, z).normalize(vector2);
            var y = vector3.cross(z, x);
            var rawData = this.rawData;
            rawData[0] = x.x;
            rawData[4] = y.x;
            rawData[8] = z.x;
            rawData[1] = x.y;
            rawData[5] = y.y;
            rawData[9] = z.y;
            rawData[2] = x.z;
            rawData[6] = y.z;
            rawData[10] = z.z;
            vector1.recycle();
            vector2.recycle();
            vector3.recycle();
            return this;
        };
        Matrix4.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            var rawData = this.rawData;
            if (offset > 0) {
                for (var i = 0; i < 16; ++i) {
                    rawData[i] = array[i + offset];
                }
            }
            else {
                for (var i = 0; i < 16; ++i) {
                    rawData[i] = array[i];
                }
            }
            return this;
        };
        Matrix4.prototype.fromBuffer = function (buffer, byteOffset) {
            if (byteOffset === void 0) { byteOffset = 0; }
            this.rawData = new Float32Array(buffer, byteOffset, 16);
            return this;
        };
        /**
         * 通过平移向量设置该矩阵
         * @param translate 平移向量
         * @param rotationAndScaleStays 是否保留该矩阵的旋转数据
         */
        Matrix4.prototype.fromTranslate = function (translate, rotationAndScaleStays) {
            if (rotationAndScaleStays === void 0) { rotationAndScaleStays = false; }
            if (!rotationAndScaleStays) {
                this.identity();
            }
            var rawData = this.rawData;
            rawData[12] = translate.x;
            rawData[13] = translate.y;
            rawData[14] = translate.z;
            return this;
        };
        /**
         * 通过四元数旋转设置该矩阵
         * @param rotation 四元数旋转
         * @param translateStays 是否保留该矩阵的平移数据
         */
        Matrix4.prototype.fromRotation = function (rotation, translateStays) {
            if (translateStays === void 0) { translateStays = false; }
            var vector = dou.recyclable(dou3d.Vector3);
            var result = this.compose(translateStays ? vector.fromArray(this.rawData, 12) : dou3d.Vector3.ZERO, rotation, dou3d.Vector3.ONE);
            vector.recycle();
            return result;
        };
        /**
         * 通过欧拉旋转设置该矩阵
         * @param euler 欧拉旋转
         * @param order 欧拉旋转顺序
         * @param translateStays 是否保留该矩阵的平移数据
         * @tutorial http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
         */
        Matrix4.prototype.fromEuler = function (euler, order, translateStays) {
            if (order === void 0) { order = 3 /* YXZ */; }
            if (translateStays === void 0) { translateStays = false; }
            var cos = Math.cos;
            var sin = Math.sin;
            var x = euler.x, y = euler.y, z = euler.z;
            var a = cos(x), b = sin(x);
            var c = cos(y), d = sin(y);
            var e = cos(z), f = sin(z);
            var rawData = this.rawData;
            switch (order) {
                case 1 /* XYZ */: {
                    var ae = a * e, af = a * f, be = b * e, bf = b * f;
                    rawData[0] = c * e;
                    rawData[4] = -c * f;
                    rawData[8] = d;
                    rawData[1] = af + be * d;
                    rawData[5] = ae - bf * d;
                    rawData[9] = -b * c;
                    rawData[2] = bf - ae * d;
                    rawData[6] = be + af * d;
                    rawData[10] = a * c;
                    break;
                }
                case 2 /* XZY */: {
                    var ac = a * c, ad = a * d, bc = b * c, bd = b * d;
                    rawData[0] = c * e;
                    rawData[4] = -f;
                    rawData[8] = d * e;
                    rawData[1] = ac * f + bd;
                    rawData[5] = a * e;
                    rawData[9] = ad * f - bc;
                    rawData[2] = bc * f - ad;
                    rawData[6] = b * e;
                    rawData[10] = bd * f + ac;
                    break;
                }
                case 3 /* YXZ */: {
                    var ce = c * e, cf = c * f, de = d * e, df = d * f;
                    rawData[0] = ce + df * b;
                    rawData[4] = de * b - cf;
                    rawData[8] = a * d;
                    rawData[1] = a * f;
                    rawData[5] = a * e;
                    rawData[9] = -b;
                    rawData[2] = cf * b - de;
                    rawData[6] = df + ce * b;
                    rawData[10] = a * c;
                    break;
                }
                case 4 /* YZX */: {
                    var ac = a * c, ad = a * d, bc = b * c, bd = b * d;
                    rawData[0] = c * e;
                    rawData[4] = bd - ac * f;
                    rawData[8] = bc * f + ad;
                    rawData[1] = f;
                    rawData[5] = a * e;
                    rawData[9] = -b * e;
                    rawData[2] = -d * e;
                    rawData[6] = ad * f + bc;
                    rawData[10] = ac - bd * f;
                    break;
                }
                case 5 /* ZXY */: {
                    var ce = c * e, cf = c * f, de = d * e, df = d * f;
                    rawData[0] = ce - df * b;
                    rawData[4] = -a * f;
                    rawData[8] = de + cf * b;
                    rawData[1] = cf + de * b;
                    rawData[5] = a * e;
                    rawData[9] = df - ce * b;
                    rawData[2] = -a * d;
                    rawData[6] = b;
                    rawData[10] = a * c;
                    break;
                }
                case 6 /* ZYX */: {
                    var ae = a * e, af = a * f, be = b * e, bf = b * f;
                    rawData[0] = c * e;
                    rawData[4] = be * d - af;
                    rawData[8] = ae * d + bf;
                    rawData[1] = c * f;
                    rawData[5] = bf * d + ae;
                    rawData[9] = af * d - be;
                    rawData[2] = -d;
                    rawData[6] = b * c;
                    rawData[10] = a * c;
                    break;
                }
            }
            rawData[3] = rawData[7] = rawData[11] = 0;
            if (!translateStays) {
                rawData[12] = rawData[13] = rawData[14] = 0;
                rawData[15] = 1;
            }
            return this;
        };
        /**
         * 通过缩放向量设置该矩阵
         * @param scale 缩放向量
         * @param translateStays 是否保留该矩阵的平移数据
         */
        Matrix4.prototype.fromScale = function (scale, translateStays) {
            if (translateStays === void 0) { translateStays = false; }
            var vector = dou.recyclable(dou3d.Vector3);
            if (translateStays) {
                vector.fromArray(this.rawData, 12);
            }
            this.identity();
            var rawData = this.rawData;
            rawData[0] = scale.x;
            rawData[5] = scale.y;
            rawData[10] = scale.z;
            if (translateStays) {
                rawData[12] = vector.x;
                rawData[13] = vector.y;
                rawData[14] = vector.z;
            }
            vector.recycle();
            return this;
        };
        /**
         * 通过绕 X 轴的旋转角度设置该矩阵
         * @param angle 旋转角
         * - 弧度制
         */
        Matrix4.prototype.fromRotationX = function (angle) {
            var c = Math.cos(angle), s = Math.sin(angle);
            return this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
        };
        /**
         * 通过绕 Y 轴的旋转角度设置该矩阵
         * @param angle 旋转角
         * - 弧度制
         */
        Matrix4.prototype.fromRotationY = function (angle) {
            var c = Math.cos(angle), s = Math.sin(angle);
            return this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
        };
        /**
         * 通过绕 Z 轴的旋转角度设置该矩阵
         * @param angle 旋转角
         * - 弧度制
         */
        Matrix4.prototype.fromRotationZ = function (angle) {
            var c = Math.cos(angle), s = Math.sin(angle);
            return this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        };
        /**
         * 通过旋转轴设置该矩阵
         * - 假设旋转轴已被归一化
         * @param axis 旋转轴
         * @param angle 旋转角
         * - 弧度制
         * @tutorial http://www.gamedev.net/reference/articles/article1199.asp
         */
        Matrix4.prototype.fromAxis = function (axis, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var t = 1 - c;
            var x = axis.x, y = axis.y, z = axis.z;
            var tx = t * x, ty = t * y;
            return this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        };
        /**
         * 通过 X、Y、Z 轴设置该矩阵
         */
        Matrix4.prototype.fromAxises = function (axisX, axisY, axisZ) {
            return this.set(axisX.x, axisY.x, axisZ.x, 0, axisX.y, axisY.y, axisZ.y, 0, axisX.z, axisY.z, axisZ.z, 0, 0, 0, 0, 1);
        };
        Matrix4.prototype.toArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            array = array || [];
            var rawData = this.rawData;
            if (offset > 0) {
                for (var i = 0; i < 16; ++i) {
                    array[i + offset] = rawData[i];
                }
            }
            else {
                for (var i = 0; i < 16; ++i) {
                    array[i] = rawData[i];
                }
            }
            return array;
        };
        /**
         * 将该旋转矩阵转换为欧拉旋转
         * - 弧度制
         */
        Matrix4.prototype.toEuler = function (order, result) {
            if (order === void 0) { order = 3 /* YXZ */; }
            result = result || new dou3d.Vector3();
            var rawData = this.rawData;
            var m11 = rawData[0], m12 = rawData[4], m13 = rawData[8];
            var m21 = rawData[1], m22 = rawData[5], m23 = rawData[9];
            var m31 = rawData[2], m32 = rawData[6], m33 = rawData[10];
            switch (order) {
                case 1 /* XYZ */: {
                    result.y = Math.asin(dou3d.MathUtil.clamp(m13, -1, 1));
                    if (Math.abs(m13) < 0.999999) {
                        result.x = Math.atan2(-m23, m33);
                        result.z = Math.atan2(-m12, m11);
                    }
                    else {
                        result.x = Math.atan2(m32, m22);
                        result.z = 0;
                    }
                    break;
                }
                case 2 /* XZY */: {
                    result.z = Math.asin(-dou3d.MathUtil.clamp(m12, -1, 1));
                    if (Math.abs(m12) < 0.999999) {
                        result.x = Math.atan2(m32, m22);
                        result.y = Math.atan2(m13, m11);
                    }
                    else {
                        result.x = Math.atan2(-m23, m33);
                        result.y = 0;
                    }
                    break;
                }
                case 3 /* YXZ */: {
                    result.x = Math.asin(-dou3d.MathUtil.clamp(m23, -1, 1));
                    if (Math.abs(m23) < 0.999999) {
                        result.y = Math.atan2(m13, m33);
                        result.z = Math.atan2(m21, m22);
                    }
                    else {
                        result.y = Math.atan2(-m31, m11);
                        result.z = 0;
                    }
                    break;
                }
                case 4 /* YZX */: {
                    result.z = Math.asin(dou3d.MathUtil.clamp(m21, -1, 1));
                    if (Math.abs(m21) < 0.999999) {
                        result.x = Math.atan2(-m23, m22);
                        result.y = Math.atan2(-m31, m11);
                    }
                    else {
                        result.x = 0;
                        result.y = Math.atan2(m13, m33);
                    }
                    break;
                }
                case 5 /* ZXY */: {
                    result.x = Math.asin(dou3d.MathUtil.clamp(m32, -1, 1));
                    if (Math.abs(m32) < 0.999999) {
                        result.y = Math.atan2(-m31, m33);
                        result.z = Math.atan2(-m12, m22);
                    }
                    else {
                        result.y = 0;
                        result.z = Math.atan2(m21, m11);
                    }
                    break;
                }
                case 6 /* ZYX */: {
                    result.y = Math.asin(-dou3d.MathUtil.clamp(m31, -1, 1));
                    if (Math.abs(m31) < 0.999999) {
                        result.x = Math.atan2(m32, m33);
                        result.z = Math.atan2(m21, m11);
                    }
                    else {
                        result.x = 0;
                        result.z = Math.atan2(-m12, m22);
                    }
                    break;
                }
            }
            return result;
        };
        Matrix4.prototype.copy = function (target) {
            return this.fromArray(target.rawData);
        };
        Matrix4.prototype.clone = function () {
            var value = new Matrix4();
            value.copy(this);
            return value;
        };
        Matrix4.prototype.identity = function () {
            var rawData = this.rawData;
            rawData[0] = 1;
            rawData[1] = rawData[2] = rawData[3] = 0;
            rawData[4] = rawData[6] = rawData[7] = 0;
            rawData[5] = 1;
            rawData[8] = rawData[9] = rawData[11] = 0;
            rawData[10] = 1;
            rawData[12] = rawData[13] = rawData[14] = 0;
            rawData[15] = 1;
            return this;
        };
        Matrix4.prototype.onRecycle = function () {
            this.identity();
        };
        /**
         * 一个静态的恒等矩阵
         */
        Matrix4.IDENTITY = new Matrix4();
        return Matrix4;
    }());
    dou3d.Matrix4 = Matrix4;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 矩形
     * @author wizardc
     */
    var Rectangle = /** @class */ (function () {
        function Rectangle(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        Rectangle.prototype.set = function (x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            return this;
        };
        Rectangle.prototype.contains = function (target) {
            var minX = this.x;
            var minY = this.y;
            var maxX = this.x + this.w;
            var maxY = this.y + this.h;
            if (target instanceof Rectangle) {
                var vMinX = target.x;
                var vMinY = target.y;
                var vMaxX = target.x + target.w;
                var vMaxY = target.y + target.h;
                return minX <= vMinX && vMaxX <= maxX && minY <= vMinY && vMaxY <= maxY;
            }
            return target.x > minX && target.x < maxX && target.y > minY && target.y < maxY;
        };
        Rectangle.prototype.multiplyScalar = function (scalar, input) {
            input = input || this;
            this.x = scalar * input.x;
            this.y = scalar * input.y;
            this.w = scalar * input.w;
            this.h = scalar * input.h;
            return this;
        };
        Rectangle.prototype.copy = function (value) {
            return this.set(value.x, value.y, value.w, value.h);
        };
        Rectangle.prototype.clone = function () {
            return new Rectangle(this.x, this.y, this.w, this.h);
        };
        Rectangle.prototype.clear = function () {
            this.x = 0;
            this.y = 0;
            this.w = 0;
            this.h = 0;
            return this;
        };
        Rectangle.prototype.onRecycle = function () {
            this.clear();
        };
        return Rectangle;
    }());
    dou3d.Rectangle = Rectangle;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 几何平面
     * @author wizardc
     */
    var Plane = /** @class */ (function () {
        function Plane(normal, constant) {
            if (constant === void 0) { constant = 0; }
            /**
             * 平面的法线
             */
            this.normal = new dou3d.Vector3();
            /**
             * 二维平面到原点的距离
             */
            this.constant = 0;
            this.normal.copy(normal);
            this.constant = constant;
        }
        Plane.prototype.set = function (normal, constant) {
            if (constant === void 0) { constant = 0; }
            this.constant = constant;
            this.normal.copy(normal);
            return this;
        };
        Plane.prototype.getDistance = function (point) {
            return this.normal.dot(point) + this.constant;
        };
        Plane.prototype.normalize = function (input) {
            input = input || this;
            var inverseNormalLength = 1 / input.normal.length;
            this.constant = input.constant * inverseNormalLength;
            this.normal.multiplyScalar(inverseNormalLength, input.normal);
            return this;
        };
        Plane.prototype.negate = function (input) {
            input = input || this;
            this.constant = -input.constant;
            this.normal.negate(input.normal);
            return this;
        };
        Plane.prototype.getProjectionPoint = function (point, result) {
            result = result || new dou3d.Vector3();
            return result.multiplyScalar(-this.getDistance(point), this.normal).add(point);
        };
        Plane.prototype.getCoplanarPoint = function (result) {
            result = result || new dou3d.Vector3();
            return result.copy(this.normal).multiplyScalar(-this.constant);
        };
        Plane.prototype.applyMatrix = function (matrix, normalMatrix) {
            if (!normalMatrix) {
                var matrix3 = dou.recyclable(dou3d.Matrix3);
                normalMatrix = matrix3.getNormalMatrix(matrix);
                matrix3.recycle();
            }
            var vector = dou.recyclable(dou3d.Vector3);
            var referencePoint = this.getCoplanarPoint(vector).applyMatrix(matrix);
            var normal = this.normal.applyMatrix3(normalMatrix).normalize();
            this.constant = -referencePoint.dot(normal);
            vector.recycle();
            return this;
        };
        Plane.prototype.raycast = function (ray, raycastInfo) {
            var t = ray.getDistanceToPlane(this);
            if (t > 0) {
                if (raycastInfo) {
                    var normal = raycastInfo.normal;
                    raycastInfo.distance = t;
                    ray.getPointAt(t, raycastInfo.position);
                    if (normal) {
                        normal.copy(this.normal);
                    }
                }
                return true;
            }
            return false;
        };
        Plane.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.normal.fromArray(array, offset);
            this.constant = array[offset + 3];
            return this;
        };
        Plane.prototype.fromPoint = function (point, normal) {
            if (normal === void 0) { normal = dou3d.Vector3.UP; }
            this.constant = -normal.dot(point);
            this.normal.copy(normal);
            return this;
        };
        Plane.prototype.fromPoints = function (point1, point2, point3) {
            var vector1 = dou.recyclable(dou3d.Vector3);
            var vector2 = dou.recyclable(dou3d.Vector3);
            var normal = vector1.subtract(point3, point2).cross(vector2.subtract(point1, point2)).normalize();
            this.fromPoint(point1, normal);
            vector1.recycle();
            vector2.recycle();
            return this;
        };
        Plane.prototype.toArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            array = array || [];
            this.normal.toArray(array, offset);
            array[offset + 3] = this.constant;
            return array;
        };
        Plane.prototype.copy = function (value) {
            return this.set(value.normal, value.constant);
        };
        Plane.prototype.clone = function () {
            return new Plane(this.normal, this.constant);
        };
        Plane.prototype.clear = function () {
            this.normal.clear();
            this.constant = 0;
            return this;
        };
        Plane.prototype.onRecycle = function () {
            this.clear();
        };
        Plane.UP = new Plane(dou3d.Vector3.UP, 0);
        Plane.DOWN = new Plane(dou3d.Vector3.DOWN, 0);
        Plane.LEFT = new Plane(dou3d.Vector3.BACK, 0);
        Plane.RIGHT = new Plane(dou3d.Vector3.BACK, 0);
        Plane.FORWARD = new Plane(dou3d.Vector3.FORWARD, 0);
        Plane.BACK = new Plane(dou3d.Vector3.BACK, 0);
        return Plane;
    }());
    dou3d.Plane = Plane;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 射线
     * @author wizardc
     */
    var Ray = /** @class */ (function () {
        function Ray(origin, direction) {
            /**
             * 射线的起点
             */
            this.origin = new dou3d.Vector3();
            /**
             * 射线的方向
             */
            this.direction = new dou3d.Vector3();
            this.origin.copy(origin || new dou3d.Vector3());
            this.direction.copy(direction || new dou3d.Vector3());
        }
        Ray.prototype.set = function (origin, direction) {
            this.origin.copy(origin);
            this.direction.copy(direction);
            return this;
        };
        /**
         * 将该射线乘以一个矩阵或将输入射线与一个矩阵相乘的结果写入该射线
         * - v *= matrix
         * - v = input * matrix
         */
        Ray.prototype.applyMatrix = function (matrix, input) {
            input = input || this;
            this.origin.applyMatrix(matrix, input.origin);
            this.direction.applyDirection(matrix, input.direction);
            return this;
        };
        /**
         * 获取一个点到该射线的最近点
         */
        Ray.prototype.getClosestPointToPoint = function (point, result) {
            result = result || new dou3d.Vector3();
            var origin = result != this.origin ? this.origin : new dou3d.Vector3().copy(this.origin);
            var direction = this.direction;
            var directionDistance = result.subtract(point, origin).dot(direction);
            if (directionDistance < 0) {
                return result.copy(origin);
            }
            return result.copy(direction).multiplyScalar(directionDistance).add(origin);
        };
        /**
         * 获取从该射线的起点沿着射线方向移动一段距离的一个点
         * - out = ray.origin + ray.direction * distanceDelta
         */
        Ray.prototype.getPointAt = function (distanceDelta, result) {
            result = result || new dou3d.Vector3();
            var origin = result != this.origin ? this.origin : new dou3d.Vector3().copy(this.origin);
            return result.multiplyScalar(distanceDelta, this.direction).add(origin);
        };
        /**
         * 获取一个点到该射线的最近距离的平方
         */
        Ray.prototype.getSquaredDistance = function (point) {
            var vector = dou.recyclable(dou3d.Vector3);
            var directionDistance = vector.subtract(point, this.origin).dot(this.direction);
            if (directionDistance < 0) {
                return this.origin.getSquaredDistance(point);
            }
            var result = this.getPointAt(directionDistance, vector).getSquaredDistance(point);
            vector.recycle();
            return result;
        };
        /**
         * 获取一个点到该射线的最近距离
         */
        Ray.prototype.getDistance = function (point) {
            return Math.sqrt(this.getSquaredDistance(point));
        };
        /**
         * 获取该射线起点到一个平面的最近距离
         * - 如果射线并不与平面相交，则返回 -1
         */
        Ray.prototype.getDistanceToPlane = function (plane) {
            var origin = this.origin;
            var planeNormal = plane.normal;
            var denominator = planeNormal.dot(this.direction);
            if (denominator == 0) {
                if (plane.getDistance(origin) == 0) {
                    return 0;
                }
                return -1;
            }
            var t = -(origin.dot(planeNormal) + plane.constant) / denominator;
            return t >= 0 ? t : -1;
        };
        Ray.prototype.fromArray = function (value, offset) {
            if (offset === void 0) { offset = 0; }
            this.origin.fromArray(value, offset);
            this.direction.fromArray(value, offset + 3);
            return this;
        };
        /**
         * 设置该射线，使其从起点出发，经过终点
         */
        Ray.prototype.fromPoints = function (from, to) {
            this.direction.subtract(to, this.origin.copy(from)).normalize();
            return this;
        };
        Ray.prototype.copy = function (value) {
            return this.set(value.origin, value.direction);
        };
        Ray.prototype.clone = function () {
            return new Ray(this.origin, this.direction);
        };
        Ray.prototype.clear = function () {
            this.origin.clear();
            this.direction.clear();
            return this;
        };
        Ray.prototype.onRecycle = function () {
            this.clear();
        };
        return Ray;
    }());
    dou3d.Ray = Ray;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 射线检测信息
     * @author wizardc
     */
    var RaycastInfo = /** @class */ (function () {
        function RaycastInfo() {
            /**
             * 交点到射线起始点的距离
             * - 如果未相交则为 -1
             */
            this.distance = -1;
            /**
             * 相交的点
             */
            this.position = new dou3d.Vector3();
            /**
             * 三角形或几何面相交的 UV 坐标
             */
            this.coord = new dou3d.Vector2();
            /**
             * 相交的法线向量
             * - 设置该值将会在检测时计算相交的法线向量, 并将结果写入该值
             */
            this.normal = null;
        }
        RaycastInfo.prototype.copy = function (value) {
            this.distance = value.distance;
            this.position.copy(value.position);
            this.coord.copy(value.coord);
            if (this.normal && value.normal) {
                this.normal.copy(value.normal);
            }
            return this;
        };
        RaycastInfo.prototype.clear = function () {
            this.distance = -1;
            this.position.set(0, 0, 0);
            this.coord.set(0, 0);
            this.normal = null;
            return this;
        };
        RaycastInfo.prototype.onRecycle = function () {
            this.clear();
        };
        return RaycastInfo;
    }());
    dou3d.RaycastInfo = RaycastInfo;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 颜色
     * @author wizardc
     */
    var Color = /** @class */ (function () {
        function Color(r, g, b, a) {
            if (r === void 0) { r = 1; }
            if (g === void 0) { g = 1; }
            if (b === void 0) { b = 1; }
            if (a === void 0) { a = 1; }
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        /**
         * 线性插值
         */
        Color.lerp = function (from, to, t, result) {
            result = result || new Color();
            result.r = t * (to.r - from.r) + from.r;
            result.g = t * (to.g - from.g) + from.g;
            result.b = t * (to.b - from.b) + from.b;
            result.a = t * (to.a - from.a) + from.a;
            return result;
        };
        Color.prototype.set = function (r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            if (!isNaN(a)) {
                this.a = a;
            }
            return this;
        };
        /**
         * 将该颜色乘以一个颜色或将两个颜色相乘的结果写入该颜色
         * - v *= color
         * - v = colorA * colorB
         */
        Color.prototype.multiply = function (colorA, colorB) {
            if (!colorB) {
                colorB = colorA;
            }
            colorA = this;
            this.r = colorA.r * colorB.r;
            this.g = colorA.g * colorB.g;
            this.b = colorA.b * colorB.b;
            this.a = colorA.a * colorB.a;
            return this;
        };
        Color.prototype.scale = function (scalar, input) {
            input = input || this;
            this.r = input.r * scalar;
            this.g = input.g * scalar;
            this.b = input.b * scalar;
            this.a = input.a * scalar;
            return this;
        };
        Color.prototype.fromArray = function (value, offset) {
            if (offset === void 0) { offset = 0; }
            this.r = value[0 + offset];
            this.g = value[1 + offset];
            this.b = value[2 + offset];
            this.a = value[3 + offset];
            return this;
        };
        Color.prototype.fromHex = function (hex) {
            this.r = (hex >> 16 & 255) / 255;
            this.g = (hex >> 8 & 255) / 255;
            this.b = (hex & 255) / 255;
            return this;
        };
        Color.prototype.copy = function (value) {
            return this.set(value.r, value.g, value.b, value.a);
        };
        Color.prototype.clone = function () {
            return new Color(this.r, this.g, this.b, this.a);
        };
        Color.prototype.clear = function () {
            this.r = 1;
            this.g = 1;
            this.b = 1;
            this.a = 1;
            return this;
        };
        Color.prototype.onRecycle = function () {
            this.clear();
        };
        /**
         * 所有颜色通道均为零的颜色
         */
        Color.ZERO = new Color(0, 0, 0, 0);
        /**
         * 黑色
         */
        Color.BLACK = new Color(0, 0, 0, 1);
        /**
         * 灰色
         */
        Color.GRAY = new Color(0.5, 0.5, 0.5, 1);
        /**
         * 白色
         */
        Color.WHITE = new Color(1, 1, 1, 1);
        /**
         * 红色
         */
        Color.RED = new Color(1, 0, 0, 1);
        /**
         * 绿色
         */
        Color.GREEN = new Color(0, 1, 0, 1);
        /**
         * 蓝色
         */
        Color.BLUE = new Color(0, 0, 1, 1);
        /**
         * 黄色
         */
        Color.YELLOW = new Color(1, 1, 0, 1);
        /**
         * 靛蓝色
         */
        Color.INDIGO = new Color(0, 1, 1, 1);
        /**
         * 紫色
         */
        Color.PURPLE = new Color(1, 0, 1, 1);
        return Color;
    }());
    dou3d.Color = Color;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 颜色转换类
     * @author wizardc
     */
    var ColorTransform = /** @class */ (function () {
        function ColorTransform() {
            this._alpha = 1;
            this._matrix = new dou3d.Matrix4();
        }
        Object.defineProperty(ColorTransform.prototype, "matrix", {
            get: function () {
                return this._matrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorTransform.prototype, "alpha", {
            get: function () {
                return this._alpha;
            },
            set: function (value) {
                this._alpha = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置颜色, 不包含 alpha
         */
        ColorTransform.prototype.setColor = function (value) {
            var r = value & 0xff0000;
            r >>= 16;
            var g = value & 0xff00;
            g >>= 8;
            var b = value & 0xff;
            r /= 0xff;
            g /= 0xff;
            b /= 0xff;
            this.matrix.identity();
            this.scale(r, g, b, this._alpha);
        };
        ColorTransform.prototype.multiply = function (colorTransform) {
            this.matrix.multiply(colorTransform.matrix);
            this.alpha *= colorTransform.alpha;
        };
        ColorTransform.prototype.scale = function (r, g, b, a) {
            if (r === void 0) { r = 1; }
            if (g === void 0) { g = 1; }
            if (b === void 0) { b = 1; }
            if (a === void 0) { a = 1; }
            var rawData = this.matrix.rawData;
            rawData[0] = r;
            rawData[5] = g;
            rawData[10] = b;
            this.alpha *= a;
        };
        ColorTransform.prototype.offset = function (r, g, b, a) {
            if (r === void 0) { r = 0; }
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            if (a === void 0) { a = 0; }
            var rawData = this.matrix.rawData;
            rawData[12] += r;
            rawData[13] += g;
            rawData[14] += b;
            this.alpha += a;
        };
        /**
         * 置灰
         */
        ColorTransform.prototype.gray = function () {
            var rawData = this.matrix.rawData;
            rawData[0] = 0.2126;
            rawData[1] = 0.7152;
            rawData[2] = 0.0722;
            rawData[3] = 1;
            rawData[4] = 0.2126;
            rawData[5] = 0.7152;
            rawData[6] = 0.0722;
            rawData[7] = 1;
            rawData[8] = 0.2126;
            rawData[9] = 0.7152;
            rawData[10] = 0.0722;
            rawData[11] = 1;
            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = 0;
            rawData[15] = 1;
        };
        ColorTransform.prototype.clear = function () {
            this.matrix.identity();
            this.alpha = 1;
        };
        ColorTransform.prototype.onRecycle = function () {
            this.clear();
        };
        return ColorTransform;
    }());
    dou3d.ColorTransform = ColorTransform;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 贝塞尔曲线
     * 目前定义了三种:
     * - 线性贝塞尔曲线 (两个点形成)
     * - 二次方贝塞尔曲线 (三个点形成)
     * - 三次方贝塞尔曲线 (四个点形成)
     * @author wizardc
     */
    var Curve3 = /** @class */ (function () {
        function Curve3(beizerPoints, bezierPointNum) {
            this.beizerPoints = beizerPoints;
            this.bezierPointNum = bezierPointNum;
        }
        /**
         * 线性贝塞尔曲线
         */
        Curve3.createLinearBezier = function (point1, point2, bezierPointNum) {
            bezierPointNum = bezierPointNum > 2 ? bezierPointNum : 3;
            var beizerPoint = [];
            var equation = function (t, val0, val1) {
                var res = (1 - t) * val0 + t * val1;
                return res;
            };
            beizerPoint.push(point1);
            for (var i = 1; i <= bezierPointNum; i++) {
                beizerPoint.push(new dou3d.Vector3(equation(i / bezierPointNum, point1.x, point2.x), equation(i / bezierPointNum, point1.y, point1.y), equation(i / bezierPointNum, point1.z, point1.z)));
            }
            return new Curve3(beizerPoint, bezierPointNum);
        };
        /**
         * 二次方贝塞尔曲线路径
         */
        Curve3.createQuadraticBezier = function (point1, point2, point3, bezierPointNum) {
            bezierPointNum = bezierPointNum > 2 ? bezierPointNum : 3;
            var beizerPoint = [];
            var equation = function (t, val0, val1, val2) {
                var res = (1 - t) * (1 - t) * val0 + 2 * t * (1 - t) * val1 + t * t * val2;
                return res;
            };
            for (var i = 1; i <= bezierPointNum; i++) {
                beizerPoint.push(new dou3d.Vector3(equation(i / bezierPointNum, point1.x, point2.x, point3.x), equation(i / bezierPointNum, point1.y, point2.y, point3.y), equation(i / bezierPointNum, point1.z, point2.z, point3.z)));
            }
            return new Curve3(beizerPoint, bezierPointNum);
        };
        /**
         * 三次方贝塞尔曲线路径
         */
        Curve3.createCubicBezier = function (point1, point2, point3, point4, bezierPointNum) {
            bezierPointNum = bezierPointNum > 3 ? bezierPointNum : 4;
            var beizerPoint = [];
            var equation = function (t, val0, val1, val2, val3) {
                var res = (1 - t) * (1 - t) * (1 - t) * val0 + 3 * t * (1 - t) * (1 - t) * val1 + 3 * t * t * (1 - t) * val2 + t * t * t * val3;
                return res;
            };
            for (var i = 1; i <= bezierPointNum; i++) {
                beizerPoint.push(new dou3d.Vector3(equation(i / bezierPointNum, point1.x, point2.x, point3.x, point4.x), equation(i / bezierPointNum, point1.y, point2.y, point3.y, point4.y), equation(i / bezierPointNum, point1.z, point2.z, point3.z, point4.z)));
            }
            return new Curve3(beizerPoint, bezierPointNum);
        };
        return Curve3;
    }());
    dou3d.Curve3 = Curve3;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 几何形状
     * * 注意: 当使用 vertexArray 或 indexArray 必须先设置 vertexCount 或 indexCount
     * @author wizardc
     */
    var Geometry = /** @class */ (function (_super) {
        __extends(Geometry, _super);
        function Geometry() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 绘制类型
             */
            _this.drawType = dou3d.Context3DProxy.gl.STATIC_DRAW;
            /**
             * 顶点格式
             */
            _this._vertexFormat = 0;
            /**
             * 顶点属性长度
             */
            _this.vertexAttLength = 0;
            /**
             * 面翻转，仅对系统 geometry 有效
             */
            _this.faceOrBack = false;
            /**
             * geometry子集
             */
            _this.subGeometrys = [];
            /**
             * buffer 需要重新提交的时候
             */
            _this._bufferDiry = true;
            /**
             * 顶点的数量
             */
            _this._vertexCount = 0;
            /**
             * 索引数量
             */
            _this._indexCount = 0;
            /**
             * 当前索引数量的最大值
             */
            _this._totalIndexCount = 0;
            /**
             * 三角形面数
             */
            _this._faceCount = 0;
            return _this;
        }
        Object.defineProperty(Geometry.prototype, "bufferDiry", {
            get: function () {
                return this._bufferDiry;
            },
            set: function (value) {
                this._bufferDiry = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometry.prototype, "vertexCount", {
            get: function () {
                return this._vertexCount;
            },
            /**
             * 设置顶点的数量
             * * 同时 this.vertexArray = new Float32Array(this.vertexAttLength * this.vertexCount);
             */
            set: function (value) {
                if (this._vertexCount == value) {
                    return;
                }
                var dataCount = value * this.vertexAttLength;
                var data = null;
                if (this.vertexArray) {
                    if (this.vertexCount < value) {
                        data = new Float32Array(dataCount);
                        data.set(this.vertexArray);
                    }
                    else {
                        data = this.vertexArray;
                    }
                }
                else {
                    data = new Float32Array(dataCount);
                }
                this.vertexArray = data;
                this._vertexCount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometry.prototype, "indexCount", {
            /**
             * 索引的数量
             */
            get: function () {
                return this._indexCount;
            },
            /**
             * 设置索引的数量
             * * 同时 this.indexArray = new Uint16Array(this._indexCount);
             */
            set: function (value) {
                this._indexCount = value;
                this._faceCount = value / 3;
                if (this._totalIndexCount >= value) {
                    return;
                }
                var data = new Uint16Array(value);
                if (this.indexArray) {
                    data.set(this.indexArray);
                }
                this.indexArray = data;
                this._totalIndexCount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometry.prototype, "faceCount", {
            get: function () {
                return this._faceCount;
            },
            /**
             * 模型面数
             */
            set: function (value) {
                if (this._faceCount == value) {
                    return;
                }
                this.indexCount = value * 3;
                this._faceCount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometry.prototype, "vertexFormat", {
            get: function () {
                return this._vertexFormat;
            },
            /**
             * 定义顶点数据结构
             * * 设置后, 就会增加这样的数据顶点数据结构, 如果源文件中没有这样的数据结构就会通过计算的方式计算补全, 不能计算的就默认为 0
             * @param vertexFormat 需要定义的顶点格式类型 VertexFormat.VF_COLOR | VertexFormat.VF_UV1
             * @example this.vertexFormat = VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_COLOR |  VertexFormat.VF_UV0 | VertexFormat.VF_UV1; //定义了一个完整的数据结构
             */
            set: function (vertexFormat) {
                this._vertexFormat = vertexFormat;
                if (this.vertexFormat & 1 /* VF_POSITION */) {
                    this.vertexAttLength += Geometry.positionSize;
                }
                if (this.vertexFormat & 2 /* VF_NORMAL */) {
                    this.vertexAttLength += Geometry.normalSize;
                }
                if (this.vertexFormat & 4 /* VF_TANGENT */) {
                    this.vertexAttLength += Geometry.tangentSize;
                }
                if (this.vertexFormat & 8 /* VF_COLOR */) {
                    this.vertexAttLength += Geometry.colorSize;
                }
                if (this.vertexFormat & 16 /* VF_UV0 */) {
                    this.vertexAttLength += Geometry.uvSize;
                }
                if (this.vertexFormat & 32 /* VF_UV1 */) {
                    this.vertexAttLength += Geometry.uv2Size;
                }
                if (this.vertexFormat & 64 /* VF_SKIN */) {
                    this.vertexAttLength += Geometry.skinSize;
                }
                this.vertexSizeInBytes = this.vertexAttLength * 4;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometry.prototype, "skeleton", {
            get: function () {
                return this._skeleton;
            },
            /**
             * 当前模型的骨骼
             */
            set: function (skeleton) {
                if (!skeleton) {
                    return;
                }
                this._skeleton = skeleton;
                this.skeletonGPUData = new Float32Array(skeleton.jointNum * 8);
                for (var i = 0; i < skeleton.jointNum; ++i) {
                    this.skeletonGPUData[i * 8 + 3] = 1;
                    this.skeletonGPUData[i * 8 + 7] = 1;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 由顶点索引根据格式拿到顶点数据
         * @param index 顶点索引
         * @param vf 得到顶点的需要的数据格式
         * @param target 获取的数据
         * @param count 得到顶点个数, 默认一个
         * @returns 获取的数据
         */
        Geometry.prototype.getVertexForIndex = function (index, vf, target, count) {
            if (count === void 0) { count = 1; }
            target = target || [];
            if (index < 0 || index >= this.vertexCount) {
                return target;
            }
            for (var i = 0; i < count; ++i) {
                var offset = 0;
                if (vf & 1 /* VF_POSITION */) {
                    if (this.vertexFormat & 1 /* VF_POSITION */) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 2]);
                    }
                    else {
                        target.push(0, 0, 0);
                    }
                }
                if (this.vertexFormat & 1 /* VF_POSITION */) {
                    offset += Geometry.positionSize;
                }
                if (vf & 2 /* VF_NORMAL */) {
                    if (this.vertexFormat & 2 /* VF_NORMAL */) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 2]);
                    }
                    else {
                        target.push(0, 0, 0);
                    }
                }
                if (this.vertexFormat & 2 /* VF_NORMAL */) {
                    offset += Geometry.normalSize;
                }
                if (vf & 4 /* VF_TANGENT */) {
                    if (this.vertexFormat & 4 /* VF_TANGENT */) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 2]);
                    }
                    else {
                        target.push(0, 0, 0);
                    }
                }
                if (this.vertexFormat & 4 /* VF_TANGENT */) {
                    offset += Geometry.tangentSize;
                }
                if (vf & 8 /* VF_COLOR */) {
                    if (this.vertexFormat & 8 /* VF_COLOR */) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 2]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 3]);
                    }
                    else {
                        target.push(0, 0, 0, 0);
                    }
                }
                if (this.vertexFormat & 8 /* VF_COLOR */) {
                    offset += Geometry.colorSize;
                }
                if (vf & 16 /* VF_UV0 */) {
                    if (this.vertexFormat & 16 /* VF_UV0 */) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                    }
                    else {
                        target.push(0, 0);
                    }
                }
                if (this.vertexFormat & 16 /* VF_UV0 */) {
                    offset += Geometry.uvSize;
                }
                if (vf & 32 /* VF_UV1 */) {
                    if (this.vertexFormat & 32 /* VF_UV1 */) {
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 0]);
                        target.push(this.vertexArray[index * this.vertexAttLength + offset + 1]);
                    }
                    else {
                        target.push(0, 0);
                    }
                }
                if (this.vertexFormat & 32 /* VF_UV1 */) {
                    offset += Geometry.uv2Size;
                }
                if (vf & 64 /* VF_SKIN */) {
                    if (this.vertexFormat & 64 /* VF_SKIN */) {
                        for (var j = 0; j < Geometry.skinSize; ++j) {
                            target.push(this.vertexArray[index * this.vertexAttLength + offset + j]);
                        }
                    }
                    else {
                        target.push(0, 0, 0, 0, 0, 0, 0, 0);
                    }
                }
                if (this.vertexFormat & 64 /* VF_SKIN */) {
                    offset += Geometry.skinSize;
                }
                index++;
            }
            return target;
        };
        /**
         * 由顶点索引根据格式设置顶点数据
         * @param index 顶点索引
         * @param vf 设置顶点的需要的数据格式
         * @param src 设置的数据
         * @param vertexCount 设置的顶点数量
         */
        Geometry.prototype.setVerticesForIndex = function (index, vf, src, vertexCount) {
            if (vertexCount === void 0) { vertexCount = 1; }
            if (index + vertexCount > this.vertexCount) {
                this.vertexCount = index + vertexCount;
            }
            this._bufferDiry = true;
            var offset = 0;
            var srcOffset = 0;
            for (var i = 0; i < vertexCount; ++i) {
                offset = 0;
                if (this.vertexFormat & 1 /* VF_POSITION */) {
                    if (vf & 1 /* VF_POSITION */) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                        this.vertexArray[index * this.vertexAttLength + offset + 2] = src[srcOffset + 2];
                    }
                    offset += Geometry.positionSize;
                }
                if (vf & 1 /* VF_POSITION */) {
                    srcOffset += Geometry.positionSize;
                }
                if (this.vertexFormat & 2 /* VF_NORMAL */) {
                    if (vf & 2 /* VF_NORMAL */) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                        this.vertexArray[index * this.vertexAttLength + offset + 2] = src[srcOffset + 2];
                    }
                    offset += Geometry.normalSize;
                }
                if (vf & 2 /* VF_NORMAL */) {
                    srcOffset += Geometry.normalSize;
                }
                if (this.vertexFormat & 4 /* VF_TANGENT */) {
                    if (vf & 4 /* VF_TANGENT */) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                        this.vertexArray[index * this.vertexAttLength + offset + 2] = src[srcOffset + 2];
                    }
                    offset += Geometry.tangentSize;
                }
                if (vf & 4 /* VF_TANGENT */) {
                    srcOffset += Geometry.tangentSize;
                }
                if (this.vertexFormat & 8 /* VF_COLOR */) {
                    if (vf & 8 /* VF_COLOR */) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                        this.vertexArray[index * this.vertexAttLength + offset + 2] = src[srcOffset + 2];
                        this.vertexArray[index * this.vertexAttLength + offset + 3] = src[srcOffset + 3];
                    }
                    else {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = 1;
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = 1;
                        this.vertexArray[index * this.vertexAttLength + offset + 2] = 1;
                        this.vertexArray[index * this.vertexAttLength + offset + 3] = 1;
                    }
                    offset += Geometry.colorSize;
                }
                if (vf & 8 /* VF_COLOR */) {
                    srcOffset += Geometry.colorSize;
                }
                if (this.vertexFormat & 16 /* VF_UV0 */) {
                    if (vf & 16 /* VF_UV0 */) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                    }
                    offset += Geometry.uvSize;
                }
                if (vf & 16 /* VF_UV0 */) {
                    srcOffset += Geometry.uvSize;
                }
                if (this.vertexFormat & 32 /* VF_UV1 */) {
                    if (vf & 32 /* VF_UV1 */) {
                        this.vertexArray[index * this.vertexAttLength + offset + 0] = src[srcOffset + 0];
                        this.vertexArray[index * this.vertexAttLength + offset + 1] = src[srcOffset + 1];
                    }
                    offset += Geometry.uv2Size;
                }
                if (vf & 32 /* VF_UV1 */) {
                    srcOffset += Geometry.uv2Size;
                }
                if (this.vertexFormat & 64 /* VF_SKIN */) {
                    if (vf & 64 /* VF_SKIN */) {
                        for (var j = 0; j < Geometry.skinSize; ++j) {
                            this.vertexArray[index * this.vertexAttLength + offset + j] = src[srcOffset + j];
                        }
                    }
                    offset += Geometry.skinSize;
                }
                if (vf & 64 /* VF_SKIN */) {
                    srcOffset += Geometry.skinSize;
                }
                index++;
            }
        };
        /**
         * 获取顶点索引数据
         * @param start 数据开始位置
         * @param count 需要的索引数据, 默认参数为 -1, 如果为 -1 那么取从 start 后面的所有索引数据
         * @param target 获取的数据
         * @returns 获取的数据
         */
        Geometry.prototype.getVertexIndices = function (start, count, target) {
            if (count === void 0) { count = -1; }
            if (target === void 0) { target = null; }
            target = target || [];
            if (start >= this.indexCount) {
                return target;
            }
            count == -1 ? count = this.indexCount : count;
            if (start + count > this.indexCount) {
                count = this.indexCount - start;
            }
            for (var i = 0; i < count; ++i) {
                target[i] = this.indexArray[i + start];
            }
            return target;
        };
        /**
         * 设置顶点索引数据
         * @param start 数据开始位置
         * @param indices 数据
         */
        Geometry.prototype.setVertexIndices = function (start, indices) {
            if (start + indices.length > this.indexCount) {
                this.indexCount = start + indices.length;
            }
            for (var i = 0; i < indices.length; ++i) {
                this.indexArray[start + i] = indices[i];
            }
        };
        Geometry.prototype.activeState = function (context3DProxy) {
            if (this._bufferDiry) {
                this._bufferDiry = false;
                this.upload(context3DProxy, this.drawType);
            }
            context3DProxy.bindVertexBuffer(this.sharedVertexBuffer);
            context3DProxy.bindIndexBuffer(this.sharedIndexBuffer);
        };
        /**
         * 提交顶点数据, 如果顶点数据有变化的话, 需要调用此函数重新提交
         */
        Geometry.prototype.upload = function (context3DProxy, drawType) {
            if (drawType === void 0) { drawType = dou3d.Context3DProxy.gl.STATIC_DRAW; }
            if (!this.sharedIndexBuffer && !this.sharedVertexBuffer) {
                this.sharedIndexBuffer = context3DProxy.createIndexBuffer(this.indexArray);
                this.sharedVertexBuffer = context3DProxy.createVertexBuffer(this.vertexArray, drawType);
            }
            else {
                context3DProxy.uploadVertexBuffer(this.sharedVertexBuffer);
                context3DProxy.uploadIndexBuffer(this.sharedIndexBuffer);
            }
        };
        Geometry.prototype.buildDefaultSubGeometry = function () {
            var subGeometry = new dou3d.SubGeometry();
            subGeometry.matID = 0;
            subGeometry.geometry = this;
            subGeometry.start = 0;
            subGeometry.count = this.indexCount;
            this.subGeometrys.push(subGeometry);
        };
        Geometry.prototype.dispose = function () {
            this.decRef();
            if (this.canDispose) {
                if (this.sharedIndexBuffer) {
                    this.sharedIndexBuffer.dispose();
                    this.sharedIndexBuffer = null;
                }
                if (this.sharedVertexBuffer) {
                    this.sharedVertexBuffer.dispose();
                    this.sharedVertexBuffer = null;
                }
                this.vertexArray = null;
                this.indexArray = null;
                this.subGeometrys = [];
            }
        };
        /**
         * 顶点坐标大小
         */
        Geometry.positionSize = 3;
        /**
         * 顶点法线大小
         */
        Geometry.normalSize = 3;
        /**
         * 顶点切线大小
         */
        Geometry.tangentSize = 3;
        /**
         * 顶点色大小
         */
        Geometry.colorSize = 4;
        /**
         * 顶点uv大小
         */
        Geometry.uvSize = 2;
        /**
         * 顶点uv2大小
         */
        Geometry.uv2Size = 2;
        /**
         * 顶点uv2大小
         */
        Geometry.skinSize = 8;
        return Geometry;
    }(dou3d.Reference));
    dou3d.Geometry = Geometry;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 表示几何形状子集, 不同的子集渲染时使用的材质会不同, 这样就可以用不同的材质来共用相同的 geometry buffer
     * @author wizardc
     */
    var SubGeometry = /** @class */ (function () {
        function SubGeometry() {
            this._useVertexAttributeList = {};
            /**
             * 顶点索引
             */
            this.start = 0;
            /**
             * 顶点数量
             */
            this.count = 0;
            /**
             * 材质ID
             */
            this.matID = 0;
            this.preAttList = [];
        }
        SubGeometry.prototype.activeState = function (passUsage, contextProxy) {
            if (passUsage.attributeDiry) {
                this.upload(passUsage, contextProxy);
            }
            contextProxy.disableAllVertexAttribArray();
            for (var i = 0; i < passUsage.attributeList.length; i++) {
                var attribute = passUsage.attributeList[i];
                if (attribute.uniformIndex >= 0) {
                    contextProxy.vertexAttribPointer(attribute.uniformIndex, attribute.size, attribute.dataType, attribute.normalized, attribute.stride, attribute.offsetBytes);
                }
            }
        };
        SubGeometry.prototype.upload = function (passUsage, contextPorxy) {
            passUsage.attributeDiry = false;
            var offsetBytes = 0;
            passUsage.attributeList = [];
            if (this.geometry.vertexFormat & 1 /* VF_POSITION */) {
                if (passUsage.attribute_position) {
                    if (!passUsage.attribute_position.uniformIndex) {
                        passUsage.attribute_position.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_position.varName);
                    }
                    passUsage.attribute_position.size = dou3d.Geometry.positionSize;
                    passUsage.attribute_position.dataType = dou3d.Context3DProxy.gl.FLOAT;
                    passUsage.attribute_position.normalized = false;
                    passUsage.attribute_position.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_position.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_position);
                    this._useVertexAttributeList[passUsage.attribute_position.uniformIndex] = passUsage.attribute_position.uniformIndex;
                }
                offsetBytes += dou3d.Geometry.positionSize * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & 2 /* VF_NORMAL */) {
                if (passUsage.attribute_normal) {
                    if (!passUsage.attribute_normal.uniformIndex) {
                        passUsage.attribute_normal.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_normal.varName);
                    }
                    passUsage.attribute_normal.size = dou3d.Geometry.normalSize;
                    passUsage.attribute_normal.dataType = dou3d.Context3DProxy.gl.FLOAT;
                    passUsage.attribute_normal.normalized = false;
                    passUsage.attribute_normal.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_normal.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_normal);
                    this._useVertexAttributeList[passUsage.attribute_normal.uniformIndex] = passUsage.attribute_normal.uniformIndex;
                }
                offsetBytes += dou3d.Geometry.normalSize * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & 4 /* VF_TANGENT */) {
                if (passUsage.attribute_tangent) {
                    if (!passUsage.attribute_tangent.uniformIndex) {
                        passUsage.attribute_tangent.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_tangent.varName);
                    }
                    passUsage.attribute_tangent.size = dou3d.Geometry.tangentSize;
                    passUsage.attribute_tangent.dataType = dou3d.Context3DProxy.gl.FLOAT;
                    passUsage.attribute_tangent.normalized = false;
                    passUsage.attribute_tangent.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_tangent.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_tangent);
                    this._useVertexAttributeList[passUsage.attribute_tangent.uniformIndex] = passUsage.attribute_tangent.uniformIndex;
                }
                offsetBytes += dou3d.Geometry.tangentSize * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & 8 /* VF_COLOR */) {
                if (passUsage.attribute_color) {
                    if (!passUsage.attribute_color.uniformIndex) {
                        passUsage.attribute_color.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_color.varName);
                    }
                    passUsage.attribute_color.size = dou3d.Geometry.colorSize;
                    passUsage.attribute_color.dataType = dou3d.Context3DProxy.gl.FLOAT;
                    passUsage.attribute_color.normalized = false;
                    passUsage.attribute_color.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_color.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_color);
                    this._useVertexAttributeList[passUsage.attribute_color.uniformIndex] = passUsage.attribute_color.uniformIndex;
                }
                offsetBytes += dou3d.Geometry.colorSize * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & 16 /* VF_UV0 */) {
                if (passUsage.attribute_uv0) {
                    if (!passUsage.attribute_uv0.uniformIndex) {
                        passUsage.attribute_uv0.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_uv0.varName);
                    }
                    passUsage.attribute_uv0.size = dou3d.Geometry.uvSize;
                    passUsage.attribute_uv0.dataType = dou3d.Context3DProxy.gl.FLOAT;
                    passUsage.attribute_uv0.normalized = false;
                    passUsage.attribute_uv0.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_uv0.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_uv0);
                    this._useVertexAttributeList[passUsage.attribute_uv0.uniformIndex] = passUsage.attribute_uv0.uniformIndex;
                }
                offsetBytes += dou3d.Geometry.uvSize * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & 32 /* VF_UV1 */) {
                if (passUsage.attribute_uv1) {
                    if (!passUsage.attribute_uv1.uniformIndex) {
                        passUsage.attribute_uv1.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_uv1.varName);
                    }
                    passUsage.attribute_uv1.size = dou3d.Geometry.uv2Size;
                    passUsage.attribute_uv1.dataType = dou3d.Context3DProxy.gl.FLOAT;
                    passUsage.attribute_uv1.normalized = false;
                    passUsage.attribute_uv1.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_uv1.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_uv1);
                    this._useVertexAttributeList[passUsage.attribute_uv1.uniformIndex] = passUsage.attribute_uv1.uniformIndex;
                }
                offsetBytes += dou3d.Geometry.uv2Size * Float32Array.BYTES_PER_ELEMENT;
            }
            if (this.geometry.vertexFormat & 64 /* VF_SKIN */) {
                if (passUsage.attribute_boneIndex) {
                    if (!passUsage.attribute_boneIndex.uniformIndex) {
                        passUsage.attribute_boneIndex.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_boneIndex.varName);
                    }
                    passUsage.attribute_boneIndex.size = dou3d.Geometry.skinSize / 2;
                    passUsage.attribute_boneIndex.dataType = dou3d.Context3DProxy.gl.FLOAT;
                    passUsage.attribute_boneIndex.normalized = false;
                    passUsage.attribute_boneIndex.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_boneIndex.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_boneIndex);
                    this._useVertexAttributeList[passUsage.attribute_boneIndex.uniformIndex] = passUsage.attribute_boneIndex.uniformIndex;
                }
                offsetBytes += dou3d.Geometry.skinSize / 2 * Float32Array.BYTES_PER_ELEMENT;
                if (passUsage.attribute_boneWeight) {
                    if (!passUsage.attribute_boneWeight.uniformIndex) {
                        passUsage.attribute_boneWeight.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, passUsage.attribute_boneWeight.varName);
                    }
                    passUsage.attribute_boneWeight.size = dou3d.Geometry.skinSize / 2;
                    passUsage.attribute_boneWeight.dataType = dou3d.Context3DProxy.gl.FLOAT;
                    passUsage.attribute_boneWeight.normalized = false;
                    passUsage.attribute_boneWeight.stride = this.geometry.vertexSizeInBytes;
                    passUsage.attribute_boneWeight.offsetBytes = offsetBytes;
                    passUsage.attributeList.push(passUsage.attribute_boneWeight);
                    this._useVertexAttributeList[passUsage.attribute_boneWeight.uniformIndex] = passUsage.attribute_boneWeight.uniformIndex;
                }
                offsetBytes += dou3d.Geometry.skinSize / 2 * Float32Array.BYTES_PER_ELEMENT;
            }
            for (var i = 0; i < this.preAttList.length; ++i) {
                var var0 = this.preAttList[i];
                var attribute = passUsage[var0.name];
                if (attribute) {
                    if (!attribute.uniformIndex) {
                        attribute.uniformIndex = contextPorxy.getShaderAttribLocation(passUsage.program3D, attribute.varName);
                        attribute.size = var0.size;
                        attribute.dataType = dou3d.Context3DProxy.gl.FLOAT;
                        attribute.normalized = false;
                        attribute.stride = this.geometry.vertexSizeInBytes;
                        attribute.offsetBytes = offsetBytes;
                        passUsage.attributeList.push(attribute);
                        this._useVertexAttributeList[attribute.uniformIndex] = attribute.uniformIndex;
                    }
                }
                offsetBytes += var0.size * Float32Array.BYTES_PER_ELEMENT;
            }
        };
        return SubGeometry;
    }());
    dou3d.SubGeometry = SubGeometry;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 立方体
     * @author wizardc
     */
    var CubeGeometry = /** @class */ (function (_super) {
        __extends(CubeGeometry, _super);
        function CubeGeometry(width, height, depth) {
            if (width === void 0) { width = 80; }
            if (height === void 0) { height = 80; }
            if (depth === void 0) { depth = 80; }
            var _this = _super.call(this) || this;
            _this._width = width;
            _this._height = height;
            _this._depth = depth;
            _this.buildGeomtry(true);
            return _this;
        }
        Object.defineProperty(CubeGeometry.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeGeometry.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CubeGeometry.prototype, "depth", {
            get: function () {
                return this._depth;
            },
            enumerable: true,
            configurable: true
        });
        CubeGeometry.prototype.buildGeomtry = function (front) {
            this.vertexFormat = 1 /* VF_POSITION */ | 2 /* VF_NORMAL */ | 4 /* VF_TANGENT */ | 8 /* VF_COLOR */ | 16 /* VF_UV0 */ | 32 /* VF_UV1 */;
            this.vertexCount = 36;
            this.indexCount = 36;
            this.vertexArray.set([
                -this._width * 0.5, -this._height * 0.5, -this._depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
                -this._width * 0.5, this._height * 0.5, -this._depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
                this._width * 0.5, this._height * 0.5, -this._depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
                this._width * 0.5, this._height * 0.5, -this._depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
                this._width * 0.5, -this._height * 0.5, -this._depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
                -this._width * 0.5, -this._height * 0.5, -this._depth * 0.5, 0.0, 0.0, -10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
                -this._width * 0.5, -this._height * 0.5, this._depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
                this._width * 0.5, -this._height * 0.5, this._depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
                this._width * 0.5, this._height * 0.5, this._depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
                this._width * 0.5, this._height * 0.5, this._depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
                -this._width * 0.5, this._height * 0.5, this._depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
                -this._width * 0.5, -this._height * 0.5, this._depth * 0.5, 0.0, 0.0, 10.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
                -this._width * 0.5, -this._height * 0.5, -this._depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
                this._width * 0.5, -this._height * 0.5, -this._depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
                this._width * 0.5, -this._height * 0.5, this._depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
                this._width * 0.5, -this._height * 0.5, this._depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
                -this._width * 0.5, -this._height * 0.5, this._depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
                -this._width * 0.5, -this._height * 0.5, -this._depth * 0.5, 0.0, -10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
                this._width * 0.5, -this._height * 0.5, -this._depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
                this._width * 0.5, this._height * 0.5, -this._depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
                this._width * 0.5, this._height * 0.5, this._depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
                this._width * 0.5, this._height * 0.5, this._depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
                this._width * 0.5, -this._height * 0.5, this._depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
                this._width * 0.5, -this._height * 0.5, -this._depth * 0.5, 10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
                this._width * 0.5, this._height * 0.5, -this._depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
                -this._width * 0.5, this._height * 0.5, -this._depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
                -this._width * 0.5, this._height * 0.5, this._depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
                -this._width * 0.5, this._height * 0.5, this._depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
                this._width * 0.5, this._height * 0.5, this._depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
                this._width * 0.5, this._height * 0.5, -this._depth * 0.5, 0.0, 10.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
                -this._width * 0.5, this._height * 0.5, -this._depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0,
                -this._width * 0.5, -this._height * 0.5, -this._depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0,
                -this._width * 0.5, -this._height * 0.5, this._depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
                -this._width * 0.5, -this._height * 0.5, this._depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 1.0, 0, 0,
                -this._width * 0.5, this._height * 0.5, this._depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 1.0, 0, 0,
                -this._width * 0.5, this._height * 0.5, -this._depth * 0.5, -10.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.0, 0.0, 0, 0
            ]);
            if (front) {
                this.indexArray.set([
                    0, 2, 1, 3, 5, 4,
                    6, 8, 7, 9, 11, 10,
                    12, 14, 13, 15, 17, 16,
                    18, 20, 19, 21, 23, 22,
                    24, 26, 25, 27, 29, 28,
                    30, 32, 31, 33, 35, 34
                ]);
            }
            else {
                this.indexArray.set([
                    0, 1, 2, 3, 4, 5,
                    6, 7, 8, 9, 10, 11,
                    12, 13, 14, 15, 16, 17,
                    18, 19, 20, 21, 22, 23,
                    24, 25, 26, 27, 28, 29,
                    30, 31, 32, 33, 34, 35
                ]);
            }
            this.buildDefaultSubGeometry();
        };
        return CubeGeometry;
    }(dou3d.Geometry));
    dou3d.CubeGeometry = CubeGeometry;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 圆柱体
     * @author wizardc
     */
    var CylinderGeometry = /** @class */ (function (_super) {
        __extends(CylinderGeometry, _super);
        function CylinderGeometry(height, radius) {
            if (height === void 0) { height = 100; }
            if (radius === void 0) { radius = 200; }
            var _this = _super.call(this) || this;
            _this._height = height;
            _this._radius = radius;
            _this.buildGeomtry();
            return _this;
        }
        Object.defineProperty(CylinderGeometry.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CylinderGeometry.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            enumerable: true,
            configurable: true
        });
        CylinderGeometry.prototype.buildGeomtry = function () {
            this.vertexFormat = 1 /* VF_POSITION */ | 2 /* VF_NORMAL */ | 4 /* VF_TANGENT */ | 8 /* VF_COLOR */ | 16 /* VF_UV0 */ | 32 /* VF_UV1 */;
            var vertexBuffer = [];
            var indexBuffer = [];
            var m_nSegments = 20;
            var nCurrentSegment = 20;
            var rDeltaSegAngle = (2.0 * Math.PI / m_nSegments);
            var rSegmentLength = 1.0 / m_nSegments;
            for (nCurrentSegment = 0; nCurrentSegment < m_nSegments; nCurrentSegment++) {
                var x0 = this._radius * Math.sin(nCurrentSegment * rDeltaSegAngle);
                var z0 = this._radius * Math.cos(nCurrentSegment * rDeltaSegAngle);
                vertexBuffer.push(x0, 0.0 + (this._height / 2.0), z0, x0, 0.0, z0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0, x0, 0.0 - (this._height / 2.0), z0, x0, 0.0, z0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0);
            }
            var len_base = vertexBuffer.length / this.vertexAttLength;
            var topCenter = len_base;
            vertexBuffer.push(0.0, 0.0 - (this._height / 2.0), 0.0, 0.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0);
            var buttomCenter = len_base + 1;
            vertexBuffer.push(0.0, 0.0 + (this._height / 2.0), 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 1.0, 0.0, 0, 0);
            for (var i = 0; i < len_base; i++) {
                if ((i & 1) != 0) {
                    indexBuffer.push(i, i + 1 >= len_base ? i + 1 - len_base : i + 1, i + 2 >= len_base ? i + 2 - len_base : i + 2, topCenter, i, i + 2 >= len_base ? i + 2 - len_base : i + 2);
                }
                else {
                    indexBuffer.push(i + 1 >= len_base ? i + 1 - len_base : i + 1, i, i + 2 >= len_base ? i + 2 - len_base : i + 2, i, buttomCenter, i + 2 >= len_base ? i + 2 - len_base : i + 2);
                }
            }
            this.setVerticesForIndex(0, this.vertexFormat, vertexBuffer, vertexBuffer.length / this.vertexAttLength);
            this.setVertexIndices(0, indexBuffer);
            var subGeometry = new dou3d.SubGeometry();
            subGeometry.geometry = this;
            subGeometry.start = 0;
            subGeometry.count = this.indexCount;
            this.subGeometrys.push(subGeometry);
        };
        return CylinderGeometry;
    }(dou3d.Geometry));
    dou3d.CylinderGeometry = CylinderGeometry;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 平面
     * @author wizardc
     */
    var PlaneGeometry = /** @class */ (function (_super) {
        __extends(PlaneGeometry, _super);
        function PlaneGeometry(width, height, segmentsW, segmentsH, uScale, vScale, wCenter, hCenter) {
            if (width === void 0) { width = 500; }
            if (height === void 0) { height = 500; }
            if (segmentsW === void 0) { segmentsW = 1; }
            if (segmentsH === void 0) { segmentsH = 1; }
            if (uScale === void 0) { uScale = 1; }
            if (vScale === void 0) { vScale = 1; }
            if (wCenter === void 0) { wCenter = true; }
            if (hCenter === void 0) { hCenter = true; }
            var _this = _super.call(this) || this;
            _this._width = width;
            _this._height = height;
            _this._segmentsW = segmentsW;
            _this._segmentsH = segmentsH;
            _this._scaleU = uScale;
            _this._scaleV = vScale;
            _this._wCenter = wCenter;
            _this._hCenter = hCenter;
            _this.buildGeometry();
            return _this;
        }
        Object.defineProperty(PlaneGeometry.prototype, "segmentsW", {
            get: function () {
                return this._segmentsW;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlaneGeometry.prototype, "segmentsH", {
            get: function () {
                return this._segmentsH;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlaneGeometry.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlaneGeometry.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlaneGeometry.prototype, "scaleU", {
            get: function () {
                return this._scaleU;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlaneGeometry.prototype, "scaleV", {
            get: function () {
                return this._scaleV;
            },
            enumerable: true,
            configurable: true
        });
        PlaneGeometry.prototype.buildGeometry = function () {
            this.vertexFormat = 1 /* VF_POSITION */ | 2 /* VF_NORMAL */ | 4 /* VF_TANGENT */ | 8 /* VF_COLOR */ | 16 /* VF_UV0 */;
            var x, y;
            var numIndices;
            var base;
            var tw = this._segmentsW + 1;
            var numVertices = (this._segmentsH + 1) * tw;
            var stride = this.vertexAttLength;
            var skip = stride - 15;
            numIndices = this._segmentsH * this._segmentsW * 6;
            this.vertexCount = numVertices;
            this.indexCount = numIndices;
            numIndices = 0;
            var index = 0;
            for (var yi = 0; yi <= this._segmentsH; ++yi) {
                for (var xi = 0; xi <= this._segmentsW; ++xi) {
                    x = (xi / this._segmentsW - .5) * this._width;
                    y = (yi / this._segmentsH - .5) * this._height;
                    if (this._wCenter == false) {
                        x += this._width / 2;
                    }
                    if (this._hCenter == false) {
                        y += this._height / 2;
                    }
                    this.vertexArray[index++] = x;
                    this.vertexArray[index++] = 0;
                    this.vertexArray[index++] = y;
                    this.vertexArray[index++] = 0;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = 0;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = 0;
                    this.vertexArray[index++] = 0;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = 1;
                    this.vertexArray[index++] = (xi / this._segmentsW) * this._scaleU;
                    this.vertexArray[index++] = (1 - yi / this._segmentsH) * this._scaleV;
                    index += skip;
                    if (xi != this._segmentsW && yi != this._segmentsH) {
                        base = xi + yi * tw;
                        var mult = 1;
                        this.indexArray[numIndices++] = base * mult;
                        this.indexArray[numIndices++] = (base + tw + 1) * mult;
                        this.indexArray[numIndices++] = (base + tw) * mult;
                        this.indexArray[numIndices++] = base * mult;
                        this.indexArray[numIndices++] = (base + 1) * mult;
                        this.indexArray[numIndices++] = (base + tw + 1) * mult;
                    }
                }
            }
            var subGeometry = new dou3d.SubGeometry();
            subGeometry.geometry = this;
            subGeometry.start = 0;
            subGeometry.count = this.indexCount;
            this.subGeometrys.push(subGeometry);
        };
        return PlaneGeometry;
    }(dou3d.Geometry));
    dou3d.PlaneGeometry = PlaneGeometry;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 球体
     * @author wizardc
     */
    var SphereGeometry = /** @class */ (function (_super) {
        __extends(SphereGeometry, _super);
        function SphereGeometry(r, segmentsW, segmentsH) {
            if (r === void 0) { r = 100; }
            if (segmentsW === void 0) { segmentsW = 15; }
            if (segmentsH === void 0) { segmentsH = 15; }
            var _this = _super.call(this) || this;
            _this._radius = r;
            _this._segmentsW = segmentsW;
            _this._segmentsH = segmentsH;
            _this.buildSphere(true);
            return _this;
        }
        Object.defineProperty(SphereGeometry.prototype, "segmentsW", {
            get: function () {
                return this._segmentsW;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereGeometry.prototype, "segmentsH", {
            get: function () {
                return this._segmentsH;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SphereGeometry.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            enumerable: true,
            configurable: true
        });
        SphereGeometry.prototype.buildSphere = function (front) {
            if (front === void 0) { front = true; }
            this.vertexFormat = 1 /* VF_POSITION */ | 2 /* VF_NORMAL */ | 4 /* VF_TANGENT */ | 8 /* VF_COLOR */ | 16 /* VF_UV0 */ | 32 /* VF_UV1 */;
            var i = 0, j = 0, triIndex = 0;
            var numVerts = (this._segmentsH + 1) * (this._segmentsW + 1);
            var stride = this.vertexAttLength;
            var skip = stride - 9;
            this.vertexCount = numVerts;
            this.indexCount = (this._segmentsH - 1) * this._segmentsW * 6;
            var startIndex = 0;
            var index = 0;
            var comp1 = 0, comp2 = 0, t1 = 0, t2 = 0;
            for (j = 0; j <= this._segmentsH; ++j) {
                startIndex = index;
                var horangle = Math.PI * j / this._segmentsH;
                var z = -this._radius * Math.cos(horangle);
                var ringradius = this._radius * Math.sin(horangle);
                for (i = 0; i <= this._segmentsW; ++i) {
                    var verangle = 2 * Math.PI * i / this._segmentsW;
                    var x = ringradius * Math.cos(verangle);
                    var y = ringradius * Math.sin(verangle);
                    var normLen = 1 / Math.sqrt(x * x + y * y + z * z);
                    var tanLen = Math.sqrt(y * y + x * x);
                    t1 = 0;
                    t2 = tanLen > .007 ? x / tanLen : 0;
                    comp1 = -z;
                    comp2 = y;
                    if (i == this._segmentsW) {
                        this.vertexArray[index++] = this.vertexArray[startIndex];
                        this.vertexArray[index++] = this.vertexArray[startIndex + 1];
                        this.vertexArray[index++] = this.vertexArray[startIndex + 2];
                        this.vertexArray[index++] = x * normLen;
                        ;
                        this.vertexArray[index++] = comp1 * normLen;
                        ;
                        this.vertexArray[index++] = comp2 * normLen;
                        ;
                        this.vertexArray[index++] = tanLen > .007 ? -y / tanLen : 1;
                        this.vertexArray[index++] = t1;
                        this.vertexArray[index++] = t2;
                        this.vertexArray[index + 0] = 1.0;
                        this.vertexArray[index + 1] = 1.0;
                        this.vertexArray[index + 2] = 1.0;
                        this.vertexArray[index + 3] = 1.0;
                    }
                    else {
                        this.vertexArray[index++] = x;
                        this.vertexArray[index++] = comp1;
                        this.vertexArray[index++] = comp2;
                        this.vertexArray[index++] = x * normLen;
                        this.vertexArray[index++] = comp1 * normLen;
                        this.vertexArray[index++] = comp2 * normLen;
                        this.vertexArray[index++] = tanLen > .007 ? -y / tanLen : 1;
                        this.vertexArray[index++] = t1;
                        this.vertexArray[index++] = t2;
                        this.vertexArray[index] = 1.0;
                        this.vertexArray[index + 1] = 1.0;
                        this.vertexArray[index + 2] = 1.0;
                        this.vertexArray[index + 3] = 1.0;
                    }
                    if (i > 0 && j > 0) {
                        var a = (this._segmentsW + 1) * j + i;
                        var b = (this._segmentsW + 1) * j + i - 1;
                        var c = (this._segmentsW + 1) * (j - 1) + i - 1;
                        var d = (this._segmentsW + 1) * (j - 1) + i;
                        if (j == this._segmentsH) {
                            this.vertexArray[index - 9] = this.vertexArray[startIndex];
                            this.vertexArray[index - 8] = this.vertexArray[startIndex + 1];
                            this.vertexArray[index - 7] = this.vertexArray[startIndex + 2];
                            if (front) {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = d;
                                this.indexArray[triIndex++] = c;
                            }
                            else {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = c;
                                this.indexArray[triIndex++] = d;
                            }
                        }
                        else if (j == 1) {
                            if (front) {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = c;
                                this.indexArray[triIndex++] = b;
                            }
                            else {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = b;
                                this.indexArray[triIndex++] = c;
                            }
                        }
                        else {
                            if (front) {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = d;
                                this.indexArray[triIndex++] = c;
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = c;
                                this.indexArray[triIndex++] = b;
                            }
                            else {
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = c;
                                this.indexArray[triIndex++] = d;
                                this.indexArray[triIndex++] = a;
                                this.indexArray[triIndex++] = b;
                                this.indexArray[triIndex++] = c;
                            }
                        }
                    }
                    index += skip;
                }
            }
            stride = 17;
            var numUvs = (this._segmentsH + 1) * (this._segmentsW + 1) * stride;
            var data;
            skip = stride - 2;
            index = 13;
            for (j = 0; j <= this._segmentsH; ++j) {
                for (i = 0; i <= this._segmentsW; ++i) {
                    this.vertexArray[index++] = (i / this._segmentsW);
                    this.vertexArray[index++] = (j / this._segmentsH);
                    index += skip;
                }
            }
            var subGeometry = new dou3d.SubGeometry();
            subGeometry.geometry = this;
            subGeometry.start = 0;
            subGeometry.count = this.indexCount;
            this.subGeometrys.push(subGeometry);
        };
        return SphereGeometry;
    }(dou3d.Geometry));
    dou3d.SphereGeometry = SphereGeometry;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 几何体创建器
     * @author wizardc
     */
    var GeometryCreator = /** @class */ (function () {
        function GeometryCreator() {
            /**
             * 顶点属性长度
             */
            this.vertexAttLength = 17;
            /**
             * 顶点长度
             */
            this.vertLen = 0;
            /**
             * 面数
             */
            this.faces = 0;
            /**
             * 索引数据
             */
            this.source_indexData = [];
            /**
             * 顶点数据
             */
            this.source_vertexData = [];
            /**
             * 顶点色数据
             */
            this.source_vertexColorData = [];
            /**
             * 顶点法线
             */
            this.source_normalData = [];
            /**
             * 顶点切线数据
             */
            this.source_tangtData = [];
            /**
             * 顶点uv数据
             */
            this.source_uvData = [];
            /**
             * 顶点uv2数据
             */
            this.source_uv2Data = [];
            /**
             * 蒙皮数据
             */
            this.source_skinData = [];
            /**
             * 顶点索引
             */
            this.vertexIndex = 0;
            /**
             * 索引数据数组
             */
            this.indices = [];
            /**
             * 顶点数据数组(x、y、z)三个number为一个顶点数据
             */
            this.vertices = [];
            /**
             * 法线数据数组(x、y、z)三个number为一个法线数据
             */
            this.normals = [];
            /**
             * 切线数据数组(x、y、z)三个number为一个切线数据
             */
            this.tangts = [];
            /**
             * 顶点颜色数据数组
             */
            this.verticesColor = [];
            /**
             * 第一套UV数据数组
             */
            this.uvs = [];
            /**
             * 第二套UV数据数组
             */
            this.uv2s = [];
            /**
             * 蒙皮数据数组
             */
            this.skinMesh = [];
            /**
             * 面法线数据数组
             */
            this.faceNormals = [];
            /**
             * 面权重数据数组
             */
            this.faceWeights = [];
            /**
             * 顶点索引数据
             */
            this.vertexIndices = [];
            /**
             * uv索引数据
             */
            this.uvIndices = [];
            /**
             * uv2索引数据
             */
            this.uv2Indices = [];
            /**
             * 法线索引数据
             */
            this.normalIndices = [];
            /**
             * 顶点色索引数据
             */
            this.colorIndices = [];
            /**
             * 索引数据数组
             */
            this.indexIds = [];
            this.matCount = 0;
            this.material = {};
        }
        /**
         * 构建几何体
         */
        GeometryCreator.buildGeomtry = function (source, vertexFormat) {
            var target = new dou3d.Geometry();
            target.vertexFormat = vertexFormat;
            target.vertexCount = source.faces * 3;
            target.indexCount = source.faces * 3;
            target.faceCount = source.faces;
            target.skeleton = source.skeleton;
            var vertex = new dou3d.Vector3();
            var normal = new dou3d.Vector3(1.0, 1.0, 1.0);
            var color = new dou3d.Vector4(1.0, 1.0, 1.0, 1.0);
            var uv_0 = { u: 1, v: 0 };
            var uv_1 = { u: 1, v: 0 };
            var index = 0;
            var vertexIndex = 0;
            var offset = 0;
            for (var faceIndex = 0; faceIndex < source.faces; faceIndex++) {
                target.indexArray[faceIndex * 3 + 0] = faceIndex * 3 + 0;
                target.indexArray[faceIndex * 3 + 1] = faceIndex * 3 + 2;
                target.indexArray[faceIndex * 3 + 2] = faceIndex * 3 + 1;
                for (var i = 0; i < 3; i++) {
                    vertexIndex = faceIndex * 3 + i;
                    vertexIndex *= target.vertexAttLength;
                    offset = 0;
                    index = source.vertexIndices[faceIndex * 3 + i] * dou3d.Geometry.positionSize;
                    if (vertexFormat & 1 /* VF_POSITION */) {
                        vertex.x = source.source_vertexData[index + 0];
                        vertex.y = source.source_vertexData[index + 1];
                        vertex.z = source.source_vertexData[index + 2];
                        target.vertexArray[vertexIndex + offset + 0] = vertex.x;
                        target.vertexArray[vertexIndex + offset + 1] = vertex.y;
                        target.vertexArray[vertexIndex + offset + 2] = vertex.z;
                        offset += dou3d.Geometry.positionSize;
                    }
                    if (vertexFormat & 2 /* VF_NORMAL */) {
                        if (source.normalIndices && source.source_normalData && source.source_normalData.length > 0) {
                            index = source.normalIndices[faceIndex * 3 + i] * dou3d.Geometry.normalSize;
                            normal.x = source.source_normalData[index + 0];
                            normal.y = source.source_normalData[index + 1];
                            normal.z = source.source_normalData[index + 2];
                        }
                        target.vertexArray[vertexIndex + offset + 0] = normal.x;
                        target.vertexArray[vertexIndex + offset + 1] = normal.y;
                        target.vertexArray[vertexIndex + offset + 2] = normal.z;
                        offset += dou3d.Geometry.normalSize;
                    }
                    if (vertexFormat & 4 /* VF_TANGENT */) {
                        target.vertexArray[vertexIndex + offset + 0] = 0;
                        target.vertexArray[vertexIndex + offset + 1] = 0;
                        target.vertexArray[vertexIndex + offset + 2] = 0;
                        offset += dou3d.Geometry.tangentSize;
                    }
                    if (vertexFormat & 8 /* VF_COLOR */) {
                        if (source.colorIndices && source.source_vertexColorData && source.source_vertexColorData.length > 0) {
                            index = source.colorIndices[faceIndex * 3 + i] * dou3d.Geometry.colorSize;
                            color.x = source.source_vertexColorData[index + 0];
                            color.y = source.source_vertexColorData[index + 1];
                            color.z = source.source_vertexColorData[index + 2];
                            color.w = source.source_vertexColorData[index + 3];
                        }
                        target.vertexArray[vertexIndex + offset + 0] = color.x;
                        target.vertexArray[vertexIndex + offset + 1] = color.y;
                        target.vertexArray[vertexIndex + offset + 2] = color.z;
                        target.vertexArray[vertexIndex + offset + 3] = color.w;
                        offset += dou3d.Geometry.colorSize;
                    }
                    if (vertexFormat & 16 /* VF_UV0 */) {
                        if (source.uvIndices && source.source_uvData && source.source_uvData.length > 0) {
                            index = source.uvIndices[faceIndex * 3 + i] * dou3d.Geometry.uvSize;
                            uv_0.u = source.source_uvData[index + 0];
                            uv_0.v = source.source_uvData[index + 1];
                        }
                        target.vertexArray[vertexIndex + offset + 0] = uv_0.u;
                        target.vertexArray[vertexIndex + offset + 1] = uv_0.v;
                        offset += dou3d.Geometry.uvSize;
                    }
                    if (vertexFormat & 32 /* VF_UV1 */) {
                        if (source.uv2Indices && source.source_uv2Data && source.source_uv2Data.length > 0) {
                            index = source.uv2Indices[faceIndex * 3 + i] * dou3d.Geometry.uv2Size;
                            uv_1.u = source.source_uv2Data[index + 0];
                            uv_1.v = source.source_uv2Data[index + 1];
                        }
                        target.vertexArray[vertexIndex + offset + 0] = uv_1.u;
                        target.vertexArray[vertexIndex + offset + 1] = uv_1.v;
                        offset += dou3d.Geometry.uv2Size;
                    }
                    if (vertexFormat & 64 /* VF_SKIN */) {
                        if (source.source_skinData && source.source_skinData.length > 0) {
                            index = source.vertexIndices[faceIndex * 3 + i] * dou3d.Geometry.skinSize;
                            target.vertexArray[vertexIndex + offset + 0] = source.source_skinData[index + 0];
                            target.vertexArray[vertexIndex + offset + 1] = source.source_skinData[index + 2];
                            target.vertexArray[vertexIndex + offset + 2] = source.source_skinData[index + 4];
                            target.vertexArray[vertexIndex + offset + 3] = source.source_skinData[index + 6];
                            target.vertexArray[vertexIndex + offset + 4] = source.source_skinData[index + 1];
                            target.vertexArray[vertexIndex + offset + 5] = source.source_skinData[index + 3];
                            target.vertexArray[vertexIndex + offset + 6] = source.source_skinData[index + 5];
                            target.vertexArray[vertexIndex + offset + 7] = source.source_skinData[index + 7];
                        }
                        else {
                            target.vertexArray[vertexIndex + offset + 0] = 0;
                            target.vertexArray[vertexIndex + offset + 1] = 0;
                            target.vertexArray[vertexIndex + offset + 2] = 0;
                            target.vertexArray[vertexIndex + offset + 3] = 0;
                            target.vertexArray[vertexIndex + offset + 4] = 0;
                            target.vertexArray[vertexIndex + offset + 5] = 0;
                            target.vertexArray[vertexIndex + offset + 6] = 0;
                            target.vertexArray[vertexIndex + offset + 7] = 0;
                        }
                    }
                }
            }
            for (var i = 0; i < source.matCount; ++i) {
                var subGeometry = new dou3d.SubGeometry();
                subGeometry.matID = i;
                subGeometry.geometry = target;
                subGeometry.start = source.material[i].start * 3 * Uint16Array.BYTES_PER_ELEMENT;
                subGeometry.count = source.material[i].count * 3;
                subGeometry.textureDiffuse = source.material[i].textureDiffuse;
                subGeometry.textureNormal = source.material[i].textureNormal;
                subGeometry.textureSpecular = source.material[i].textureSpecular;
                target.subGeometrys.push(subGeometry);
            }
            return target;
        };
        return GeometryCreator;
    }());
    dou3d.GeometryCreator = GeometryCreator;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 灯光基类
     * @author wizardc
     */
    var LightBase = /** @class */ (function (_super) {
        __extends(LightBase, _super);
        function LightBase() {
            var _this = _super.call(this) || this;
            _this._color = 0xffffff;
            _this._intensity = 1;
            _this._change = true;
            _this._colorVec4 = new dou3d.Vector4(1, 1, 1);
            _this._direction = new dou3d.Vector3();
            return _this;
        }
        Object.defineProperty(LightBase.prototype, "lightType", {
            get: function () {
                return this._lightType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightBase.prototype, "intensity", {
            get: function () {
                return this._intensity;
            },
            /**
             * 灯光强度
             * * 影响灯光的强弱显示, 值的范围 0~没有上限, 但是值过大会导致画面过度曝光
             */
            set: function (value) {
                if (this._intensity != value) {
                    this._intensity = value;
                    this._change = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightBase.prototype, "color", {
            get: function () {
                return this._color;
            },
            /**
             * 灯光漫反射颜色
             * * 直接影响最终灯光的颜色色值
             */
            set: function (value) {
                this._color = value;
                this._colorVec4.w = (value >> 24 & 0xff) / 255;
                this._colorVec4.x = (value >> 16 & 0xff) / 255;
                this._colorVec4.y = (value >> 8 & 0xff) / 255;
                this._colorVec4.z = (value & 0xff) / 255;
                this._change = false;
            },
            enumerable: true,
            configurable: true
        });
        LightBase.prototype.onTransformUpdate = function () {
            _super.prototype.onTransformUpdate.call(this);
            // 更新方向
            // 注: 在所有欧拉角都为 0 时, 方向为 Z 轴正方向
            this._globalMatrix.forward(this._direction);
        };
        /**
         * 更新灯光数据
         */
        LightBase.prototype.updateLightData = function (camera, index, lightData) {
            this.validateTransformNow();
        };
        return LightBase;
    }(dou3d.ObjectContainer3D));
    dou3d.LightBase = LightBase;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 平行灯光
     * * 当前引擎中, 只有平行光可以产生阴影
     * @author wizardc
     */
    var DirectLight = /** @class */ (function (_super) {
        __extends(DirectLight, _super);
        function DirectLight(color) {
            if (color === void 0) { color = 0xffffff; }
            var _this = _super.call(this) || this;
            _this._lightType = 1 /* direct */;
            _this.color = color;
            return _this;
        }
        DirectLight.prototype.updateLightData = function (camera, index, lightData) {
            _super.prototype.updateLightData.call(this, camera, index, lightData);
            lightData[index * DirectLight.stride] = this._direction.x;
            lightData[index * DirectLight.stride + 1] = this._direction.y;
            lightData[index * DirectLight.stride + 2] = this._direction.z;
            lightData[index * DirectLight.stride + 3] = this._colorVec4.x * this._intensity;
            lightData[index * DirectLight.stride + 4] = this._colorVec4.y * this._intensity;
            lightData[index * DirectLight.stride + 5] = this._colorVec4.z * this._intensity;
        };
        /**
         * 光源数据结构长度
         */
        DirectLight.stride = 6;
        return DirectLight;
    }(dou3d.LightBase));
    dou3d.DirectLight = DirectLight;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 点光源
     * @author wizardc
     */
    var PointLight = /** @class */ (function (_super) {
        __extends(PointLight, _super);
        function PointLight(color) {
            if (color === void 0) { color = 0xffffff; }
            var _this = _super.call(this) || this;
            _this._radius = 100;
            _this._lightType = 0 /* point */;
            _this.color = color;
            return _this;
        }
        Object.defineProperty(PointLight.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            /**
             * 灯光半径
             */
            set: function (value) {
                this._radius = value;
            },
            enumerable: true,
            configurable: true
        });
        PointLight.prototype.updateLightData = function (camera, index, lightData) {
            _super.prototype.updateLightData.call(this, camera, index, lightData);
            lightData[index * PointLight.stride] = this.globalPosition.x;
            lightData[index * PointLight.stride + 1] = this.globalPosition.y;
            lightData[index * PointLight.stride + 2] = this.globalPosition.z;
            lightData[index * PointLight.stride + 3] = this._colorVec4.x * this._intensity;
            lightData[index * PointLight.stride + 4] = this._colorVec4.y * this._intensity;
            lightData[index * PointLight.stride + 5] = this._colorVec4.z * this._intensity;
            lightData[index * PointLight.stride + 6] = this._radius;
        };
        /**
         * 光源数据结构长度
         */
        PointLight.stride = 7;
        return PointLight;
    }(dou3d.LightBase));
    dou3d.PointLight = PointLight;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 聚光灯
     * @author wizardc
     */
    var SpotLight = /** @class */ (function (_super) {
        __extends(SpotLight, _super);
        function SpotLight(color) {
            if (color === void 0) { color = 0xffffff; }
            var _this = _super.call(this) || this;
            _this._range = 10;
            _this._angle = 60;
            _this._penumbra = 0;
            _this._lightType = 2 /* spot */;
            _this.color = color;
            return _this;
        }
        Object.defineProperty(SpotLight.prototype, "range", {
            get: function () {
                return this._range;
            },
            /**
             * 光照范围
             */
            set: function (value) {
                this._range = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpotLight.prototype, "angle", {
            get: function () {
                return this._angle;
            },
            /**
             * 角度
             */
            set: function (value) {
                this._angle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpotLight.prototype, "penumbra", {
            get: function () {
                return this._penumbra;
            },
            /**
             * 半影
             */
            set: function (value) {
                this._penumbra = value;
            },
            enumerable: true,
            configurable: true
        });
        SpotLight.prototype.updateLightData = function (camera, index, lightData) {
            _super.prototype.updateLightData.call(this, camera, index, lightData);
            lightData[index * SpotLight.stride] = this.globalPosition.x;
            lightData[index * SpotLight.stride + 1] = this.globalPosition.y;
            lightData[index * SpotLight.stride + 2] = this.globalPosition.z;
            lightData[index * SpotLight.stride + 3] = this._direction.x;
            lightData[index * SpotLight.stride + 4] = this._direction.y;
            lightData[index * SpotLight.stride + 5] = this._direction.z;
            lightData[index * SpotLight.stride + 6] = this._colorVec4.x * this._intensity;
            lightData[index * SpotLight.stride + 7] = this._colorVec4.y * this._intensity;
            lightData[index * SpotLight.stride + 8] = this._colorVec4.z * this._intensity;
            lightData[index * dou3d.PointLight.stride + 9] = this._range;
            lightData[index * dou3d.PointLight.stride + 10] = Math.cos(this._angle * 0.5 * dou3d.MathUtil.DEG_RAD);
            lightData[index * dou3d.PointLight.stride + 11] = Math.cos(this._angle * 0.5 * dou3d.MathUtil.DEG_RAD * (1 - this._penumbra));
        };
        /**
         * 光源数据结构长度
         */
        SpotLight.stride = 12;
        return SpotLight;
    }(dou3d.LightBase));
    dou3d.SpotLight = SpotLight;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 灯光组
     * @author wizardc
     */
    var LightGroup = /** @class */ (function () {
        function LightGroup() {
            this._lightNum = 0;
            this._directList = [];
            this._spotList = [];
            this._pointList = [];
        }
        Object.defineProperty(LightGroup.prototype, "lightNum", {
            /**
             * 灯光个数
             */
            get: function () {
                return this._lightNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightGroup.prototype, "directList", {
            /**
             * 方向光列表
             */
            get: function () {
                return this._directList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightGroup.prototype, "spotList", {
            /**
             * 聚光灯列表
             */
            get: function () {
                return this._spotList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightGroup.prototype, "pointList", {
            /**
             * 点光源列表
             */
            get: function () {
                return this._pointList;
            },
            enumerable: true,
            configurable: true
        });
        LightGroup.prototype.addLight = function (light) {
            switch (light.lightType) {
                case 1 /* direct */:
                    this._directList.push(light);
                    this._lightNum++;
                    break;
                case 0 /* point */:
                    this._pointList.push(light);
                    this._lightNum++;
                    break;
                case 2 /* spot */:
                    this._spotList.push(light);
                    this._lightNum++;
                    break;
            }
        };
        LightGroup.prototype.removeLight = function (light) {
            switch (light.lightType) {
                case 1 /* direct */: {
                    var index = this._directList.indexOf(light);
                    if (index >= 0 && index < this._directList.length) {
                        this._directList.splice(index, 1);
                        this._lightNum--;
                    }
                    break;
                }
                case 0 /* point */: {
                    var index = this._pointList.indexOf(light);
                    if (index >= 0 && index < this._pointList.length) {
                        this._pointList.splice(index, 1);
                        this._lightNum--;
                    }
                    break;
                }
                case 2 /* spot */: {
                    var index = this._spotList.indexOf(light);
                    if (index >= 0 && index < this._spotList.length) {
                        this._spotList.splice(index, 1);
                        this._lightNum--;
                    }
                    break;
                }
            }
        };
        return LightGroup;
    }());
    dou3d.LightGroup = LightGroup;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 纹理贴图加载器
     * @author wizardc
     */
    var TextureAnalyzer = /** @class */ (function () {
        function TextureAnalyzer() {
        }
        TextureAnalyzer.prototype.load = function (url, callback, thisObj) {
            var _this = this;
            var loader = new dou.ImageLoader();
            loader.crossOrigin = true;
            loader.on(dou.Event.COMPLETE, function () {
                callback.call(thisObj, url, _this.createTexture(loader.data));
            });
            loader.on(dou.IOErrorEvent.IO_ERROR, function () {
                callback.call(thisObj, url);
            });
            loader.load(url);
        };
        TextureAnalyzer.prototype.createTexture = function (img) {
            return new dou3d.ImageTexture(img);
        };
        TextureAnalyzer.prototype.release = function (data) {
            if (data) {
                data.dispose();
                return true;
            }
            return false;
        };
        return TextureAnalyzer;
    }());
    dou3d.TextureAnalyzer = TextureAnalyzer;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 自定义文件类型模型加载器
     * @author wizardc
     */
    var ESMAnalyzer = /** @class */ (function () {
        function ESMAnalyzer() {
        }
        ESMAnalyzer.prototype.load = function (url, callback, thisObj) {
            var _this = this;
            var request = new dou.HttpRequest();
            request.responseType = dou.HttpResponseType.arraybuffer;
            request.on(dou.Event.COMPLETE, function (event) {
                callback.call(thisObj, url, _this.createGeometry(request.response));
            }, this);
            request.on(dou.IOErrorEvent.IO_ERROR, function (event) {
                callback.call(thisObj, url);
            }, this);
            request.open(url, dou.HttpMethod.GET);
            request.send();
        };
        ESMAnalyzer.prototype.createGeometry = function (data) {
            var bytes = new dou.ByteArray(data);
            bytes.position = 3;
            var version = bytes.readUnsignedInt();
            var geomtryCreator = new dou3d.GeometryCreator();
            switch (version) {
                case 1:
                    this.parseVersion_1(bytes, geomtryCreator);
                    break;
                case 2:
                    this.parseVersion_2(bytes, geomtryCreator);
                    break;
                case 3:
                    this.parseVersion_3(bytes, geomtryCreator);
                    break;
                default:
                    console.error("ESM version error : " + version);
                    return null;
            }
            var geomtry;
            var vertexFormat = 0;
            if (geomtryCreator.source_skinData.length > 0) {
                vertexFormat = 1 /* VF_POSITION */ | 2 /* VF_NORMAL */ | 4 /* VF_TANGENT */ | 8 /* VF_COLOR */ | 16 /* VF_UV0 */ | 64 /* VF_SKIN */;
                geomtry = dou3d.GeometryCreator.buildGeomtry(geomtryCreator, vertexFormat);
            }
            else {
                vertexFormat = 1 /* VF_POSITION */ | 2 /* VF_NORMAL */ | 4 /* VF_TANGENT */ | 8 /* VF_COLOR */ | 16 /* VF_UV0 */ | 32 /* VF_UV1 */;
                geomtry = dou3d.GeometryCreator.buildGeomtry(geomtryCreator, vertexFormat);
            }
            return geomtry;
        };
        ESMAnalyzer.prototype.parseVersion_1 = function (bytes, geomtry) {
            var description = bytes.readInt();
            geomtry.matCount = bytes.readInt();
            for (var i = 0; i < geomtry.matCount; ++i) {
                geomtry.material[i] = {};
                geomtry.material[i].matID = bytes.readInt();
                geomtry.material[i].start = bytes.readInt();
                geomtry.material[i].count = bytes.readInt();
                geomtry.material[i].textureDiffuse = bytes.readUTF();
                geomtry.material[i].textureNormal = bytes.readUTF();
                geomtry.material[i].textureSpecular = bytes.readUTF();
            }
            if (description & 1 /* VF_POSITION */) {
                var vertexCount = bytes.readInt();
                for (var i = 0; i < vertexCount; i++) {
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                }
            }
            if (description & 2 /* VF_NORMAL */) {
                var vertexNormalCount = bytes.readInt();
                for (var i = 0; i < vertexNormalCount; i++) {
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                }
            }
            if (description & 8 /* VF_COLOR */) {
                var vertexColorCount = bytes.readInt();
                for (var i = 0; i < vertexColorCount; i++) {
                    geomtry.source_vertexColorData.push(bytes.readFloat());
                    geomtry.source_vertexColorData.push(bytes.readFloat());
                    geomtry.source_vertexColorData.push(bytes.readFloat());
                    geomtry.source_vertexColorData.push(bytes.readFloat());
                }
            }
            if (description & 16 /* VF_UV0 */) {
                var uvCount = bytes.readInt();
                for (var i = 0; i < uvCount; i++) {
                    geomtry.source_uvData.push(bytes.readFloat());
                    geomtry.source_uvData.push(bytes.readFloat());
                }
            }
            if (description & 32 /* VF_UV1 */) {
                var uvCount = bytes.readInt();
                for (var i = 0; i < uvCount; i++) {
                    geomtry.source_uv2Data.push(bytes.readFloat());
                    geomtry.source_uv2Data.push(bytes.readFloat());
                }
            }
            geomtry.faces = bytes.readInt();
            for (var i = 0; i < geomtry.faces; i++) {
                geomtry.vertexIndices.push(bytes.readUnsignedInt());
                geomtry.vertexIndices.push(bytes.readUnsignedInt());
                geomtry.vertexIndices.push(bytes.readUnsignedInt());
                if (description & 2 /* VF_NORMAL */) {
                    geomtry.normalIndices.push(bytes.readUnsignedInt());
                    geomtry.normalIndices.push(bytes.readUnsignedInt());
                    geomtry.normalIndices.push(bytes.readUnsignedInt());
                }
                if (description & 8 /* VF_COLOR */) {
                    geomtry.colorIndices.push(bytes.readUnsignedInt());
                    geomtry.colorIndices.push(bytes.readUnsignedInt());
                    geomtry.colorIndices.push(bytes.readUnsignedInt());
                }
                if (description & 16 /* VF_UV0 */) {
                    geomtry.uvIndices.push(bytes.readUnsignedInt());
                    geomtry.uvIndices.push(bytes.readUnsignedInt());
                    geomtry.uvIndices.push(bytes.readUnsignedInt());
                }
                if (description & 32 /* VF_UV1 */) {
                    geomtry.uv2Indices.push(bytes.readUnsignedInt());
                    geomtry.uv2Indices.push(bytes.readUnsignedInt());
                    geomtry.uv2Indices.push(bytes.readUnsignedInt());
                }
            }
            var nBoneCount = bytes.readUnsignedByte();
            if (nBoneCount > 0) {
                geomtry.skeleton = new dou3d.Skeleton();
            }
            var rotation = new dou3d.Vector3();
            var scaling = new dou3d.Vector3();
            var translation = new dou3d.Vector3();
            for (var i = 0; i < nBoneCount; ++i) {
                var joint = new dou3d.Joint(null);
                bytes.readInt();
                joint.parentIndex = bytes.readInt();
                joint.name = bytes.readUTF();
                rotation.x = bytes.readFloat() * dou3d.MathUtil.RAD_DEG;
                rotation.y = bytes.readFloat() * dou3d.MathUtil.RAD_DEG;
                rotation.z = bytes.readFloat() * dou3d.MathUtil.RAD_DEG;
                scaling.x = bytes.readFloat();
                scaling.y = bytes.readFloat();
                scaling.z = bytes.readFloat();
                translation.x = bytes.readFloat();
                translation.y = bytes.readFloat();
                translation.z = bytes.readFloat();
                joint.buildInverseMatrix(scaling, rotation, translation);
                geomtry.skeleton.joints.push(joint);
            }
            var nVertsCount = bytes.readInt();
            for (var i = 0; i < nVertsCount; i++) {
                var nCount = bytes.readUnsignedByte();
                for (var j = 0; j < nCount; j++) {
                    geomtry.source_skinData.push(bytes.readUnsignedByte());
                    geomtry.source_skinData.push(bytes.readFloat());
                }
                for (var j = nCount; j < 4; j++) {
                    geomtry.source_skinData.push(0);
                    geomtry.source_skinData.push(0);
                }
            }
        };
        ESMAnalyzer.prototype.parseVersion_2 = function (bytes, geomtry) {
            var description = bytes.readInt();
            geomtry.matCount = bytes.readInt();
            for (var i = 0; i < geomtry.matCount; ++i) {
                geomtry.material[i] = {};
                geomtry.material[i].matID = bytes.readInt();
                geomtry.material[i].start = bytes.readInt();
                geomtry.material[i].count = bytes.readInt();
                geomtry.material[i].textureDiffuse = bytes.readUTF();
                geomtry.material[i].textureNormal = bytes.readUTF();
                geomtry.material[i].textureSpecular = bytes.readUTF();
            }
            if (description & 1 /* VF_POSITION */) {
                var vertexCount = bytes.readInt();
                for (var i = 0; i < vertexCount; i++) {
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                }
            }
            if (description & 2 /* VF_NORMAL */) {
                var vertexNormalCount = bytes.readInt();
                for (var i = 0; i < vertexNormalCount; i++) {
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                }
            }
            if (description & 8 /* VF_COLOR */) {
                var vertexColorCount = bytes.readInt();
                for (var i = 0; i < vertexColorCount; i++) {
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                }
            }
            if (description & 16 /* VF_UV0 */) {
                var uvCount = bytes.readInt();
                for (var i = 0; i < uvCount; i++) {
                    geomtry.source_uvData.push(bytes.readFloat());
                    geomtry.source_uvData.push(bytes.readFloat());
                }
            }
            if (description & 32 /* VF_UV1 */) {
                var uvCount = bytes.readInt();
                for (var i = 0; i < uvCount; i++) {
                    geomtry.source_uv2Data.push(bytes.readFloat());
                    geomtry.source_uv2Data.push(bytes.readFloat());
                }
            }
            geomtry.faces = bytes.readInt();
            for (var i = 0; i < geomtry.faces; i++) {
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                if (description & 2 /* VF_NORMAL */) {
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                }
                if (description & 8 /* VF_COLOR */) {
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                }
                if (description & 16 /* VF_UV0 */) {
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                }
                if (description & 32 /* VF_UV1 */) {
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                }
            }
            var nBoneCount = bytes.readUnsignedByte();
            if (nBoneCount > 0) {
                geomtry.skeleton = new dou3d.Skeleton();
            }
            var rotation = new dou3d.Vector3();
            var scaling = new dou3d.Vector3();
            var translation = new dou3d.Vector3();
            for (var i = 0; i < nBoneCount; ++i) {
                var joint = new dou3d.Joint(null);
                bytes.readInt();
                joint.parentIndex = bytes.readInt();
                joint.name = bytes.readUTF();
                rotation.x = bytes.readFloat() * dou3d.MathUtil.RAD_DEG;
                rotation.y = bytes.readFloat() * dou3d.MathUtil.RAD_DEG;
                rotation.z = bytes.readFloat() * dou3d.MathUtil.RAD_DEG;
                scaling.x = bytes.readFloat();
                scaling.y = bytes.readFloat();
                scaling.z = bytes.readFloat();
                translation.x = bytes.readFloat();
                translation.y = bytes.readFloat();
                translation.z = bytes.readFloat();
                joint.buildInverseMatrix(scaling, rotation, translation);
                geomtry.skeleton.joints.push(joint);
            }
            var nVertsCount = bytes.readInt();
            for (var i = 0; i < nVertsCount; i++) {
                var nCount = bytes.readUnsignedByte();
                for (var j = 0; j < nCount; j++) {
                    geomtry.source_skinData.push(bytes.readUnsignedByte());
                    geomtry.source_skinData.push(bytes.readFloat());
                }
                for (var j = nCount; j < 4; j++) {
                    geomtry.source_skinData.push(0);
                    geomtry.source_skinData.push(0);
                }
            }
        };
        ESMAnalyzer.prototype.parseVersion_3 = function (bytes, geomtry) {
            var description = bytes.readInt();
            geomtry.matCount = bytes.readInt();
            for (var i = 0; i < geomtry.matCount; ++i) {
                geomtry.material[i] = {};
                geomtry.material[i].matID = bytes.readInt();
                geomtry.material[i].start = bytes.readInt();
                geomtry.material[i].count = bytes.readInt();
                geomtry.material[i].textureDiffuse = bytes.readUTF();
                geomtry.material[i].textureNormal = bytes.readUTF();
                geomtry.material[i].textureSpecular = bytes.readUTF();
            }
            if (description & 1 /* VF_POSITION */) {
                var vertexCount = bytes.readInt();
                for (var i = 0; i < vertexCount; i++) {
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                    geomtry.source_vertexData.push(bytes.readFloat());
                }
            }
            if (description & 2 /* VF_NORMAL */) {
                var vertexNormalCount = bytes.readInt();
                for (var i = 0; i < vertexNormalCount; i++) {
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                    geomtry.source_normalData.push(bytes.readFloat());
                }
            }
            if (description & 8 /* VF_COLOR */) {
                var vertexColorCount = bytes.readInt();
                for (var i = 0; i < vertexColorCount; i++) {
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                    geomtry.source_vertexColorData.push(bytes.readUnsignedByte() / 255);
                }
            }
            if (description & 16 /* VF_UV0 */) {
                var uvCount = bytes.readInt();
                for (var i = 0; i < uvCount; i++) {
                    geomtry.source_uvData.push(bytes.readFloat());
                    geomtry.source_uvData.push(bytes.readFloat());
                }
            }
            if (description & 32 /* VF_UV1 */) {
                var uvCount = bytes.readInt();
                for (var i = 0; i < uvCount; i++) {
                    geomtry.source_uv2Data.push(bytes.readFloat());
                    geomtry.source_uv2Data.push(bytes.readFloat());
                }
            }
            geomtry.faces = bytes.readInt();
            for (var i = 0; i < geomtry.faces; i++) {
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                geomtry.vertexIndices.push(bytes.readUnsignedShort());
                if (description & 2 /* VF_NORMAL */) {
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                    geomtry.normalIndices.push(bytes.readUnsignedShort());
                }
                if (description & 8 /* VF_COLOR */) {
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                    geomtry.colorIndices.push(bytes.readUnsignedShort());
                }
                if (description & 16 /* VF_UV0 */) {
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                    geomtry.uvIndices.push(bytes.readUnsignedShort());
                }
                if (description & 32 /* VF_UV1 */) {
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                    geomtry.uv2Indices.push(bytes.readUnsignedShort());
                }
            }
            var nBoneCount = bytes.readUnsignedByte();
            if (nBoneCount > 0) {
                geomtry.skeleton = new dou3d.Skeleton();
            }
            var orientation = new dou3d.Quaternion();
            var scaling = new dou3d.Vector3();
            var translation = new dou3d.Vector3();
            for (var i = 0; i < nBoneCount; ++i) {
                var joint = new dou3d.Joint(null);
                bytes.readInt();
                joint.parentIndex = bytes.readInt();
                joint.name = bytes.readUTF();
                orientation.x = bytes.readFloat();
                orientation.y = bytes.readFloat();
                orientation.z = bytes.readFloat();
                orientation.w = bytes.readFloat();
                scaling.x = bytes.readFloat();
                scaling.y = bytes.readFloat();
                scaling.z = bytes.readFloat();
                translation.x = bytes.readFloat();
                translation.y = bytes.readFloat();
                translation.z = bytes.readFloat();
                joint.buildInverseMatrix(scaling, orientation, translation);
                geomtry.skeleton.joints.push(joint);
            }
            var nVertsCount = bytes.readInt();
            for (var i = 0; i < nVertsCount; i++) {
                var nCount = bytes.readUnsignedByte();
                for (var j = 0; j < nCount; j++) {
                    geomtry.source_skinData.push(bytes.readUnsignedByte());
                    geomtry.source_skinData.push(bytes.readFloat());
                }
                for (var j = nCount; j < 4; j++) {
                    geomtry.source_skinData.push(0);
                    geomtry.source_skinData.push(0);
                }
            }
        };
        ESMAnalyzer.prototype.release = function (data) {
            return true;
        };
        return ESMAnalyzer;
    }());
    dou3d.ESMAnalyzer = ESMAnalyzer;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 自定义文件类型骨骼动画加载器
     * @author wizardc
     */
    var EAMAnalyzer = /** @class */ (function () {
        function EAMAnalyzer() {
        }
        EAMAnalyzer.prototype.load = function (url, callback, thisObj) {
            var _this = this;
            var request = new dou.HttpRequest();
            request.responseType = dou.HttpResponseType.arraybuffer;
            request.on(dou.Event.COMPLETE, function (event) {
                callback.call(thisObj, url, _this.createClip(request.response));
            }, this);
            request.on(dou.IOErrorEvent.IO_ERROR, function (event) {
                callback.call(thisObj, url);
            }, this);
            request.open(url, dou.HttpMethod.GET);
            request.send();
        };
        EAMAnalyzer.prototype.createClip = function (data) {
            var bytes = new dou.ByteArray(data);
            bytes.position = 3;
            var version = bytes.readUnsignedInt();
            var clip;
            switch (version) {
                case 1:
                    clip = this.parseVersion_1(bytes);
                    break;
                case 2:
                    clip = this.parseVersion_2(bytes);
                    break;
                default:
                    console.error("EAM version error : " + version);
                    return null;
            }
            return clip;
        };
        EAMAnalyzer.prototype.parseVersion_1 = function (bytes) {
            var boneCount = bytes.readUnsignedByte();
            var sampling = bytes.readUnsignedByte();
            if (boneCount <= 0) {
                return null;
            }
            var skeletonAnimationClip = new dou3d.SkeletonAnimationClip();
            var boneNameArray = [];
            var parentBoneNameArray = [];
            for (var i = 0; i < boneCount; i++) {
                boneNameArray.push(bytes.readUTF());
                parentBoneNameArray.push(bytes.readUTF());
            }
            var frameCount = bytes.readInt();
            var nCount = bytes.readInt();
            var orientation = new dou3d.Quaternion();
            var scale = new dou3d.Vector3();
            var translation = new dou3d.Vector3();
            for (var i = 0; i < nCount; i++) {
                var skeletonPose = new dou3d.SkeletonPose();
                skeletonPose.frameTime = bytes.readInt() / 60 / 80 * 1000;
                for (var j = 0; j < boneCount; j++) {
                    var jointPose = new dou3d.Joint(boneNameArray[j]);
                    jointPose.parent = parentBoneNameArray[j];
                    jointPose.parentIndex = skeletonPose.findJointIndex(jointPose.parent);
                    orientation.fromEuler(bytes.readFloat(), bytes.readFloat(), bytes.readFloat(), 6 /* ZYX */);
                    scale.x = bytes.readFloat();
                    scale.y = bytes.readFloat();
                    scale.z = bytes.readFloat();
                    translation.x = bytes.readFloat();
                    translation.y = bytes.readFloat();
                    translation.z = bytes.readFloat();
                    jointPose.buildLocalMatrix(scale, orientation, translation);
                    skeletonPose.joints.push(jointPose);
                }
                skeletonPose.calculateJointWorldMatrix();
                skeletonAnimationClip.addSkeletonPose(skeletonPose);
            }
            return skeletonAnimationClip;
        };
        EAMAnalyzer.prototype.parseVersion_2 = function (bytes) {
            // 读取骨骼数
            var boneCount = bytes.readUnsignedByte();
            // 读取采样率
            var sampling = bytes.readUnsignedByte();
            if (boneCount <= 0) {
                return null;
            }
            var skeletonAnimationClip = new dou3d.SkeletonAnimationClip();
            var boneNameArray = [];
            var parentBoneNameArray = [];
            // 读取骨骼名称
            for (var i = 0; i < boneCount; i++) {
                boneNameArray.push(bytes.readUTF());
                parentBoneNameArray.push(bytes.readUTF());
            }
            // 读取帧数
            var frameCount = bytes.readInt();
            // 读取数量
            var nCount = bytes.readInt();
            // 流数据
            var orientation = new dou3d.Quaternion();
            var scale = new dou3d.Vector3();
            var translation = new dou3d.Vector3();
            for (var i = 0; i < nCount; i++) {
                var skeletonPose = new dou3d.SkeletonPose();
                // 读取该帧时刻
                skeletonPose.frameTime = bytes.readInt() / 60 / 80 * 1000;
                for (var j = 0; j < boneCount; j++) {
                    var jointPose = new dou3d.Joint(boneNameArray[j]);
                    jointPose.parent = parentBoneNameArray[j];
                    jointPose.parentIndex = skeletonPose.findJointIndex(jointPose.parent);
                    // 读取旋转四元数分量
                    orientation.x = bytes.readFloat();
                    orientation.y = bytes.readFloat();
                    orientation.z = bytes.readFloat();
                    orientation.w = bytes.readFloat();
                    // 读取缩放分量
                    scale.x = bytes.readFloat();
                    scale.y = bytes.readFloat();
                    scale.z = bytes.readFloat();
                    // 读取平移分量
                    translation.x = bytes.readFloat();
                    translation.y = bytes.readFloat();
                    translation.z = bytes.readFloat();
                    jointPose.buildLocalMatrix(scale, orientation, translation);
                    skeletonPose.joints.push(jointPose);
                }
                skeletonPose.calculateJointWorldMatrix();
                skeletonAnimationClip.addSkeletonPose(skeletonPose);
            }
            return skeletonAnimationClip;
        };
        EAMAnalyzer.prototype.release = function (data) {
            return true;
        };
        return EAMAnalyzer;
    }());
    dou3d.EAMAnalyzer = EAMAnalyzer;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 材质渲染数据
     * @author wizardc
     */
    var MaterialData = /** @class */ (function () {
        function MaterialData() {
            /**
             * 着色器阶段记录表
             * 渲染通道类型 -> 着色器片段类型数组
             */
            this.shaderPhaseTypes = {};
            /**
             * 绘制模式
             */
            this.drawMode = dou3d.Context3DProxy.gl.TRIANGLES;
            /**
             * 是否开启 MipMap
             */
            this.useMipmap = true;
            /**
             * 投射阴影
             */
            this.castShadow = false;
            /**
             * 接受阴影
             */
            this.acceptShadow = false;
            /**
             * 阴影颜色
             */
            this.shadowColor = new Float32Array([0.2, 0.2, 0.2, 0.003]);
            /**
             * 深度测试
             */
            this.depthTest = true;
            /**
             * 深度测试模式
             */
            this.depthMode = 0;
            /**
             * 混合模式
             */
            this.blendMode = 2 /* NORMAL */;
            /**
             * 透明混合
             */
            this.alphaBlending = false;
            /**
             * 环境光颜色
             */
            this.ambientColor = 0x333333;
            /**
             * 漫反射颜色
             */
            this.diffuseColor = 0xffffff;
            /**
             * 高光颜色
             */
            this.specularColor = 0xffffff;
            /**
             * 色相
             */
            this.tintColor = 0x80808080;
            /**
             * 材质球的高光强度
             */
            this.specularLevel = 50;
            /**
             * 材质球的光滑度
             */
            this.gloss = 20;
            /**
             * 透明度小于该值的像素完全透明
             */
            this.cutAlpha = 0;
            /**
             * 是否重复
             */
            this.repeat = false;
            /**
             * 是否进行双面渲染
             */
            this.bothside = false;
            /**
             * 透明度
             */
            this.alpha = 1;
            /**
             * 反射颜色的强度值，出射光照的出射率
             */
            this.albedo = 0.95;
            /**
             * uv 在贴图上的映射区域， 值的范围限制在 0~1 之间
             */
            this.uvRectangle = new dou3d.Rectangle(0, 0, 1, 1);
            /**
             * 材质数据需要变化
             */
            this.materialDataNeedChange = true;
            /**
             * 纹理变化
             */
            this.textureChange = false;
            /**
             * 纹理状态需要更新
             */
            this.textureStateChage = true;
            /**
             * 剔除模式
             */
            this.cullFrontOrBack = dou3d.Context3DProxy.gl.BACK;
            /**
             * 材质属性数据
             */
            this.materialSourceData = new Float32Array(20);
        }
        MaterialData.prototype.clone = function () {
            var data = new MaterialData();
            data.drawMode = this.drawMode;
            data.diffuseTexture = this.diffuseTexture;
            data.diffuseTexture3D = this.diffuseTexture3D;
            data.shadowMapTexture = this.shadowMapTexture;
            for (var i = 0; i < 4; ++i) {
                data.shadowColor[i] = this.shadowColor[i];
            }
            data.castShadow = this.castShadow;
            data.acceptShadow = this.acceptShadow;
            data.depthTest = this.depthTest;
            data.blendMode = this.blendMode;
            data.blendSrc = this.blendSrc;
            data.blendDest = this.blendDest;
            data.ambientColor = this.ambientColor;
            data.diffuseColor = this.diffuseColor;
            data.specularColor = this.specularColor;
            data.cutAlpha = this.cutAlpha;
            data.alpha = this.alpha;
            data.specularLevel = this.specularLevel;
            data.gloss = this.gloss;
            data.albedo = this.albedo;
            data.materialDataNeedChange = this.materialDataNeedChange;
            data.textureChange = true;
            data.cullFrontOrBack = this.cullFrontOrBack;
            return data;
        };
        MaterialData.prototype.dispose = function () {
        };
        return MaterialData;
    }());
    dou3d.MaterialData = MaterialData;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 材质基类
     * @author wizardc
     */
    var MaterialBase = /** @class */ (function () {
        function MaterialBase(materialData) {
            this._passes = {};
            if (materialData) {
                this.materialData = materialData;
            }
            else {
                this.materialData = new dou3d.MaterialData();
            }
        }
        Object.defineProperty(MaterialBase.prototype, "passes", {
            get: function () {
                return this._passes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "diffusePass", {
            /**
             * 漫反射通道
             */
            get: function () {
                return this._passes[0 /* diffusePass */][0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "materialData", {
            get: function () {
                return this._materialData;
            },
            set: function (value) {
                this._materialData = value;
                this.blendMode = 2 /* NORMAL */;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "lightGroup", {
            get: function () {
                return this._lightGroup;
            },
            /**
             * 材质球接受的灯光组
             */
            set: function (value) {
                this._lightGroup = value;
                if (this._passes[0 /* diffusePass */] && this._passes[0 /* diffusePass */].length > 0) {
                    for (var i = 0; i < this._passes[0 /* diffusePass */].length; i++) {
                        this._passes[0 /* diffusePass */][i].lightGroup = value;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "depth", {
            get: function () {
                return this._materialData.depthTest;
            },
            /**
             * 是否开启深度测试
             */
            set: function (value) {
                this._materialData.depthTest = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "depthMode", {
            get: function () {
                return this._materialData.depthMode;
            },
            /**
             * 深度测试方式
             */
            set: function (value) {
                this._materialData.depthMode = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "diffuseTexture", {
            get: function () {
                return this._materialData.diffuseTexture;
            },
            /**
             * 材质球的漫反射贴图
             */
            set: function (value) {
                if (value) {
                    this._materialData.diffuseTexture = value;
                    this._materialData.textureChange = true;
                    if (this._materialData.shaderPhaseTypes[0 /* diffusePass */] && !this._materialData.shaderPhaseTypes[0 /* diffusePass */].contains(dou3d.ShaderPhaseType.diffuse_fragment)) {
                        this._materialData.shaderPhaseTypes[0 /* diffusePass */].push(dou3d.ShaderPhaseType.diffuse_fragment);
                    }
                    if (this._materialData.shaderPhaseTypes[1 /* shadowPass */] && !this._materialData.shaderPhaseTypes[1 /* shadowPass */].contains(dou3d.ShaderPhaseType.diffuse_fragment)) {
                        this._materialData.shaderPhaseTypes[1 /* shadowPass */].push(dou3d.ShaderPhaseType.diffuse_fragment);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "normalTexture", {
            get: function () {
                return this._materialData.normalTexture;
            },
            /**
             * 材质球的凹凸法线贴图
             */
            set: function (value) {
                if (value) {
                    this._materialData.normalTexture = value;
                    this._materialData.textureChange = true;
                    if (this._materialData.shaderPhaseTypes[0 /* diffusePass */] && !this._materialData.shaderPhaseTypes[0 /* diffusePass */].contains(dou3d.ShaderPhaseType.normal_fragment)) {
                        this._materialData.shaderPhaseTypes[0 /* diffusePass */].push(dou3d.ShaderPhaseType.normal_fragment);
                        this.passInvalid(0 /* diffusePass */);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "specularTexture", {
            get: function () {
                return this._materialData.specularTexture;
            },
            /**
             * 材质球的高光贴图
             */
            set: function (value) {
                if (value) {
                    this._materialData.specularTexture = value;
                    this._materialData.textureChange = true;
                    if (this._materialData.shaderPhaseTypes[0 /* diffusePass */] && !this._materialData.shaderPhaseTypes[0 /* diffusePass */].contains(dou3d.ShaderPhaseType.specular_fragment)) {
                        this._materialData.shaderPhaseTypes[0 /* diffusePass */].push(dou3d.ShaderPhaseType.specular_fragment);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "drawMode", {
            get: function () {
                return this._materialData.drawMode;
            },
            /**
             * 设置模型渲染模式
             */
            set: function (value) {
                this._materialData.drawMode = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "cutAlpha", {
            get: function () {
                return this._materialData.cutAlpha;
            },
            /**
             * 模型渲染中带透明贴图的去除不渲染透明透明部分的阀值
             */
            set: function (value) {
                this._materialData.cutAlpha = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "diffuseColor", {
            get: function () {
                return this._materialData.diffuseColor;
            },
            /**
             * 漫反射颜色
             */
            set: function (value) {
                this._materialData.materialDataNeedChange = true;
                this._materialData.diffuseColor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "ambientColor", {
            get: function () {
                return this._materialData.ambientColor;
            },
            /**
             * 环境光颜色
             */
            set: function (value) {
                this._materialData.materialDataNeedChange = true;
                this._materialData.ambientColor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "specularColor", {
            get: function () {
                return this._materialData.specularColor;
            },
            /**
             * 镜面光反射颜色
             */
            set: function (value) {
                this._materialData.materialDataNeedChange = true;
                this._materialData.specularColor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "tintColor", {
            get: function () {
                return this._materialData.tintColor;
            },
            /**
             * 色相颜色
             */
            set: function (value) {
                this._materialData.materialDataNeedChange = true;
                this._materialData.tintColor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "alpha", {
            get: function () {
                return this._materialData.alpha;
            },
            /**
             * 材质的透明度, 如果透明度小于 1 会自动启用 alpha blending
             */
            set: function (value) {
                if (this._materialData.alpha != value) {
                    this._materialData.alpha = value;
                    this._materialData.materialDataNeedChange = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "alphaBlending", {
            get: function () {
                return this._materialData.alphaBlending;
            },
            /**
             * 透明混合
             */
            set: function (value) {
                if (this._materialData.alphaBlending != value) {
                    this._materialData.alphaBlending = value;
                    this._materialData.materialDataNeedChange = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "specularLevel", {
            get: function () {
                return this._materialData.specularLevel;
            },
            /**
             * 材质的高光强度
             */
            set: function (value) {
                if (this._materialData.specularLevel != value) {
                    this._materialData.specularLevel = value;
                    this._materialData.materialDataNeedChange = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "gloss", {
            get: function () {
                return this._materialData.gloss;
            },
            /**
             * 镜面平滑程度值
             */
            set: function (value) {
                if (this._materialData.gloss != value) {
                    this._materialData.gloss = value;
                    this._materialData.materialDataNeedChange = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "uvRectangle", {
            get: function () {
                return this._materialData.uvRectangle;
            },
            /**
             * 映射贴图 UV 坐标, 设置此材质要显示使用贴图的区域
             */
            set: function (value) {
                this._materialData.uvRectangle.x = value.x;
                this._materialData.uvRectangle.y = value.y;
                this._materialData.uvRectangle.w = value.w;
                this._materialData.uvRectangle.h = value.h;
                this._materialData.materialDataNeedChange = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "castShadow", {
            get: function () {
                return this._materialData.castShadow;
            },
            /**
             * 材质是否是否产生阴影
             */
            set: function (value) {
                this._materialData.castShadow = value;
                if (value) {
                    dou3d.ShadowCast.instance.enableShadow = true;
                    this.addPass(1 /* shadowPass */);
                }
                else {
                    if (this._passes[1 /* shadowPass */]) {
                        this.disposePass(1 /* shadowPass */);
                        this._passes[1 /* shadowPass */] = null;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "acceptShadow", {
            get: function () {
                return this._materialData.acceptShadow;
            },
            /**
             * 材质是否接受阴影
             */
            set: function (value) {
                if (this._materialData.acceptShadow == value) {
                    return;
                }
                this._materialData.acceptShadow = value;
                if (this._materialData.acceptShadow) {
                    this._shadowMethod = new dou3d.ShadowMethod(this);
                    this._shadowMethod.shadowMapTexture = dou3d.ShadowCast.instance.shadowRender.renderTexture;
                    this.diffusePass.addMethod(this._shadowMethod);
                }
                else {
                    if (this._shadowMethod) {
                        this.diffusePass.removeMethod(this._shadowMethod);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "shadowColor", {
            get: function () {
                var color = 0;
                color |= this._materialData.shadowColor[0] * 255.0 << 16;
                color |= this._materialData.shadowColor[1] * 255.0 << 8;
                color |= this._materialData.shadowColor[2] * 255.0;
                return color;
            },
            /**
             * 阴影颜色
             */
            set: function (value) {
                this._materialData.shadowColor[0] = value >> 16 & 0xff / 255.0;
                this._materialData.shadowColor[1] = value >> 8 & 0xff / 255.0;
                this._materialData.shadowColor[2] = value & 0xff / 255.0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "shadowOffset", {
            get: function () {
                return this._materialData.shadowColor[3];
            },
            /**
             * 阴影偏移
             */
            set: function (value) {
                this._materialData.shadowColor[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "repeat", {
            get: function () {
                return this._materialData.repeat;
            },
            /**
             * 是否进行纹理重复采样的方式开关
             */
            set: function (value) {
                this._materialData.textureStateChage = true;
                this._materialData.repeat = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "bothside", {
            get: function () {
                return this._materialData.bothside;
            },
            /**
             * 材质是否显示双面的开关
             */
            set: function (value) {
                this._materialData.textureStateChage = true;
                this._materialData.bothside = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "cullMode", {
            get: function () {
                return this._materialData.cullFrontOrBack;
            },
            /**
             * 正面渲染三角形或者背面渲染三角形
             */
            set: function (value) {
                this._materialData.textureStateChage = true;
                this._materialData.cullFrontOrBack = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "blendMode", {
            get: function () {
                return this._materialData.blendMode;
            },
            /**
             * 混合模式
             */
            set: function (value) {
                this._materialData.textureStateChage = true;
                this._materialData.blendMode = value;
                switch (value) {
                    case 2 /* NORMAL */:
                        this._materialData.blendSrc = dou3d.Context3DProxy.gl.ONE;
                        this._materialData.blendDest = dou3d.Context3DProxy.gl.ONE_MINUS_SRC_ALPHA;
                        this._materialData.alphaBlending = false;
                        break;
                    case 1 /* LAYER */:
                        this._materialData.blendSrc = dou3d.Context3DProxy.gl.SRC_ALPHA;
                        this._materialData.blendDest = dou3d.Context3DProxy.gl.ZERO;
                        this._materialData.alphaBlending = true;
                        break;
                    case 3 /* MULTIPLY */:
                        this._materialData.blendSrc = dou3d.Context3DProxy.gl.ZERO;
                        this._materialData.blendDest = dou3d.Context3DProxy.gl.SRC_COLOR;
                        this._materialData.alphaBlending = true;
                        break;
                    case 4 /* ADD */:
                        this._materialData.blendSrc = dou3d.Context3DProxy.gl.SRC_ALPHA;
                        this._materialData.blendDest = dou3d.Context3DProxy.gl.ONE;
                        this._materialData.alphaBlending = true;
                        break;
                    case 8 /* SOFT_ADD */:
                        this._materialData.blendSrc = dou3d.Context3DProxy.gl.SRC_COLOR;
                        this._materialData.blendDest = dou3d.Context3DProxy.gl.ONE;
                        this._materialData.alphaBlending = true;
                        break;
                    case 0 /* ALPHA */:
                        this._materialData.blendSrc = dou3d.Context3DProxy.gl.ONE;
                        this._materialData.blendDest = dou3d.Context3DProxy.gl.ONE_MINUS_SRC_ALPHA;
                        this._materialData.alphaBlending = true;
                        break;
                    case 7 /* SCREEN */:
                        this._materialData.blendSrc = dou3d.Context3DProxy.gl.ONE;
                        this._materialData.blendDest = dou3d.Context3DProxy.gl.ONE_MINUS_SRC_COLOR;
                        break;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialBase.prototype, "pointSize", {
            get: function () {
                return this._materialData.specularLevel;
            },
            /**
             * 点的大小
             */
            set: function (value) {
                if (value == this._materialData.specularLevel) {
                    return;
                }
                this._materialData.specularLevel = value;
                this._materialData.textureStateChage = true;
            },
            enumerable: true,
            configurable: true
        });
        MaterialBase.prototype.passInvalid = function (passType) {
            if (this._passes[passType] && this._passes[passType].length > 0) {
                for (var i = 0; i < this._passes[passType].length; i++) {
                    this._passes[passType][i].passInvalid();
                }
            }
        };
        /**
         * 添加一个渲染通道
         */
        MaterialBase.prototype.addPass = function (pass) {
            if (!this._passes[pass]) {
                this._passes[pass] = [];
            }
            this._passes[pass].push(dou3d.PassUtil.createPass(pass, this._materialData));
        };
        /**
         * 销毁指定的渲染通道
         */
        MaterialBase.prototype.disposePass = function (passType) {
            for (var i = 0; i < this._passes[passType].length; i++) {
                this._passes[passType][i].dispose();
            }
        };
        MaterialBase.prototype.dispose = function () {
            for (var key in this._passes) {
                for (var i = 0; i < this._passes[key].length; ++i) {
                    this._passes[key][i].dispose();
                }
            }
        };
        return MaterialBase;
    }());
    dou3d.MaterialBase = MaterialBase;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 材质渲染通道基类
     * @author wizardc
     */
    var MaterialPass = /** @class */ (function () {
        function MaterialPass(materialData) {
            this._passChange = true;
            this._vs_shader_methods = {};
            this._fs_shader_methods = {};
            this.methodList = [];
            this.vsShaderNames = [];
            this.fsShaderNames = [];
            this._materialData = materialData;
        }
        /**
         * 增加渲染方法
         */
        MaterialPass.prototype.addMethod = function (method) {
            var index = this.methodList.indexOf(method);
            if (index == -1) {
                this.methodList.push(method);
                method.materialData = this._materialData;
                this._passChange = true;
            }
        };
        /**
         * 获取指定类型的渲染方法实例
         */
        MaterialPass.prototype.getMethod = function (type) {
            for (var i = 0; i < this.methodList.length; ++i) {
                if (this.methodList[i] instanceof type) {
                    return this.methodList[i];
                }
            }
            return null;
        };
        /**
         * 移除渲染方法
         */
        MaterialPass.prototype.removeMethod = function (method) {
            var index = this.methodList.indexOf(method);
            if (index != -1) {
                this.methodList.slice(index);
                this._passChange = true;
            }
        };
        MaterialPass.prototype.passInvalid = function () {
            this._passChange = true;
        };
        /**
         * 重置纹理
         */
        MaterialPass.prototype.resetTexture = function (context3DProxy) {
            var sampler2D;
            for (var index in this._passUsage.sampler2DList) {
                sampler2D = this._passUsage.sampler2DList[index];
                if (this._materialData[sampler2D.varName]) {
                    sampler2D.texture = this._materialData[sampler2D.varName];
                }
            }
            var sampler3D;
            for (var index in this._passUsage.sampler3DList) {
                sampler3D = this._passUsage.sampler3DList[index];
                if (this._materialData[sampler3D.varName]) {
                    sampler3D.texture = this._materialData[sampler3D.varName];
                }
            }
            this._materialData.textureChange = false;
        };
        MaterialPass.prototype.addMethodShaders = function (shaderComposer, shaders) {
            for (var i = 0; i < shaders.length; i++) {
                shaderComposer.addUseShaderName(shaders[i]);
            }
        };
        MaterialPass.prototype.upload = function (time, delay, context3DProxy, modelTransform, camera3D, animation) {
            this._passChange = false;
            this.initShader(animation);
            this._passUsage.vertexShader.shader = this._passUsage.vertexShader.getShader(this._passUsage);
            this._passUsage.fragmentShader.shader = this._passUsage.fragmentShader.getShader(this._passUsage);
            this._passUsage.program3D = dou3d.ShaderPool.getProgram(this._passUsage.vertexShader.shader.id, this._passUsage.fragmentShader.shader.id);
            // 添加 Shader 中所有带有 uniform 名称变量的索引
            for (var property in this._passUsage) {
                if (property.indexOf("uniform") != -1) {
                    if (this._passUsage[property]) {
                        this._passUsage[property].uniformIndex = context3DProxy.getUniformLocation(this._passUsage.program3D, property);
                    }
                }
            }
            // 添加取样器的索引
            var sampler2D;
            for (var index in this._passUsage.sampler2DList) {
                sampler2D = this._passUsage.sampler2DList[index];
                sampler2D.uniformIndex = context3DProxy.getUniformLocation(this._passUsage.program3D, sampler2D.varName);
                sampler2D.texture = this._materialData[sampler2D.varName];
            }
            var sampler3D;
            for (var index in this._passUsage.sampler3DList) {
                sampler3D = this._passUsage.sampler3DList[index];
                sampler3D.uniformIndex = context3DProxy.getUniformLocation(this._passUsage.program3D, sampler3D.varName);
            }
            if (this.methodList) {
                for (var i = 0; i < this.methodList.length; i++) {
                    this.methodList[i].upload(time, delay, this._passUsage, null, context3DProxy, modelTransform, camera3D);
                }
            }
        };
        MaterialPass.prototype.draw = function (time, delay, context3DProxy, modelTransform, camera3D, subGeometry, render) {
            // 如果材质中的变量改变了, 就更新这些变量的数据到 materialSourceData 中
            if (this._materialData.materialDataNeedChange) {
                var tintValue = this._materialData.tintColor;
                var tintAlpha = Math.floor(tintValue / 0x1000000);
                var tintRed = (tintValue & 0xff0000) / 0x10000;
                var tintGreen = (tintValue & 0xff00) / 0x100;
                var tintBlue = (tintValue & 0xff);
                tintAlpha /= 0x80;
                tintRed /= 0x80;
                tintGreen /= 0x80;
                tintBlue /= 0x80;
                this._materialData.materialSourceData[0] = tintRed * (this._materialData.diffuseColor >> 16 & 0xff) / 255.0;
                this._materialData.materialSourceData[1] = tintGreen * (this._materialData.diffuseColor >> 8 & 0xff) / 255.0;
                this._materialData.materialSourceData[2] = tintBlue * (this._materialData.diffuseColor & 0xff) / 255.0;
                this._materialData.materialSourceData[3] = (this._materialData.ambientColor >> 16 & 0xff) / 255.0;
                this._materialData.materialSourceData[4] = (this._materialData.ambientColor >> 8 & 0xff) / 255.0;
                this._materialData.materialSourceData[5] = (this._materialData.ambientColor & 0xff) / 255.0;
                this._materialData.materialSourceData[6] = (this._materialData.specularColor >> 16 & 0xff) / 255.0;
                this._materialData.materialSourceData[7] = (this._materialData.specularColor >> 8 & 0xff) / 255.0;
                this._materialData.materialSourceData[8] = (this._materialData.specularColor & 0xff) / 255.0;
                this._materialData.materialSourceData[9] = tintAlpha * this._materialData.alpha;
                this._materialData.materialSourceData[10] = this._materialData.cutAlpha;
                this._materialData.materialSourceData[11] = this._materialData.gloss;
                this._materialData.materialSourceData[12] = this._materialData.specularLevel;
                this._materialData.materialSourceData[13] = this._materialData.albedo;
                this._materialData.materialSourceData[14] = this._materialData.uvRectangle.x;
                this._materialData.materialSourceData[15] = this._materialData.uvRectangle.y; // 保留
                this._materialData.materialSourceData[16] = this._materialData.uvRectangle.w; // 保留
                this._materialData.materialSourceData[17] = this._materialData.uvRectangle.h; // 保留
                this._materialData.materialSourceData[18] = this._materialData.specularLevel; // 保留
                this._materialData.materialSourceData[19] = window.devicePixelRatio; // 保留
            }
            // 通道改变之后需要重新提交
            if (this._passChange) {
                this.upload(time, delay, context3DProxy, modelTransform, camera3D, render.animation);
            }
            context3DProxy.setProgram(this._passUsage.program3D);
            subGeometry.activeState(this._passUsage, context3DProxy);
            if (this._materialData.depthTest) {
                context3DProxy.enableDepth();
                context3DProxy.depthFunc(dou3d.Context3DProxy.gl.LEQUAL);
            }
            else {
                context3DProxy.disableDepth();
                context3DProxy.depthFunc(dou3d.Context3DProxy.gl.LEQUAL);
            }
            context3DProxy.setCulling(this._materialData.cullFrontOrBack);
            if (this._materialData.bothside) {
                context3DProxy.disableCullFace();
            }
            else {
                context3DProxy.enableCullFace();
            }
            if (this._passID == 1 /* shadowPass */) {
                context3DProxy.disableBlend();
                context3DProxy.setBlendFactors(dou3d.Context3DProxy.gl.ONE, dou3d.Context3DProxy.gl.ZERO);
            }
            else {
                if (this._materialData.alphaBlending) {
                    dou3d.Context3DProxy.gl.depthMask(false);
                }
                context3DProxy.enableBlend();
                context3DProxy.setBlendFactors(this._materialData.blendSrc, this._materialData.blendDest);
            }
            if (this._passUsage.uniform_materialSource) {
                context3DProxy.uniform1fv(this._passUsage.uniform_materialSource.uniformIndex, this._materialData.materialSourceData);
            }
            if (this._materialData.textureChange) {
                this.resetTexture(context3DProxy);
            }
            var sampler2D;
            for (var index in this._passUsage.sampler2DList) {
                sampler2D = this._passUsage.sampler2DList[index];
                sampler2D.texture = this._materialData[sampler2D.varName];
                if (!sampler2D.texture) {
                    continue;
                }
                sampler2D.texture.upload(context3DProxy);
                context3DProxy.setTexture2DAt(sampler2D.activeTextureIndex, sampler2D.uniformIndex, sampler2D.index, sampler2D.texture.texture2D);
                if (sampler2D.texture.useMipmap) {
                    sampler2D.texture.useMipmap = this._materialData.useMipmap;
                }
                sampler2D.texture.repeat = this._materialData.repeat;
                sampler2D.texture.activeState(context3DProxy);
                this._materialData.textureStateChage = false;
            }
            var sampler3D;
            for (var index in this._passUsage.sampler3DList) {
                sampler3D = this._passUsage.sampler3DList[index];
                sampler3D.texture = this._materialData[sampler3D.varName];
                if (!sampler3D.texture) {
                    continue;
                }
                sampler3D.texture.upload(context3DProxy);
                context3DProxy.setCubeTextureAt(sampler3D.activeTextureIndex, sampler3D.uniformIndex, sampler3D.index, sampler3D.texture.texture3D);
            }
            if (this.lightGroup) {
                for (var i = 0; i < this._passUsage.maxDirectLight; i++) {
                    this.lightGroup.directList[i].updateLightData(camera3D, i, this._passUsage.directLightData);
                }
                for (var i = 0; i < this._passUsage.maxSpotLight; i++) {
                    this.lightGroup.spotList[i].updateLightData(camera3D, i, this._passUsage.spotLightData);
                }
                for (var i = 0; i < this._passUsage.maxPointLight; i++) {
                    this.lightGroup.pointList[i].updateLightData(camera3D, i, this._passUsage.pointLightData);
                }
                if (this._passUsage.uniform_directLightSource) {
                    context3DProxy.uniform1fv(this._passUsage.uniform_directLightSource.uniformIndex, this._passUsage.directLightData);
                }
                if (this._passUsage.uniform_spotLightSource) {
                    context3DProxy.uniform1fv(this._passUsage.uniform_spotLightSource.uniformIndex, this._passUsage.spotLightData);
                }
                if (this._passUsage.uniform_pointLightSource) {
                    context3DProxy.uniform1fv(this._passUsage.uniform_pointLightSource.uniformIndex, this._passUsage.pointLightData);
                }
            }
            if (this._passUsage.uniform_ModelMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_ModelMatrix.uniformIndex, false, modelTransform.rawData);
            }
            if (this._passUsage.uniform_ViewMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_ViewMatrix.uniformIndex, false, camera3D.viewMatrix.rawData);
            }
            if (this._passUsage.uniform_ProjectionMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_ProjectionMatrix.uniformIndex, false, camera3D.projectMatrix.rawData);
            }
            if (this._passUsage.uniform_ViewProjectionMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_ViewProjectionMatrix.uniformIndex, false, camera3D.viewProjectionMatrix.rawData);
            }
            if (this._passUsage.uniform_orthProectMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_orthProectMatrix.uniformIndex, false, camera3D.orthProjectionMatrix.rawData);
            }
            if (render.animation) {
                render.animation.activeState(time, delay, this._passUsage, subGeometry, context3DProxy, modelTransform, camera3D);
            }
            if (this.methodList) {
                for (var i = 0; i < this.methodList.length; i++) {
                    this.methodList[i].activeState(time, delay, this._passUsage, null, context3DProxy, modelTransform, camera3D);
                }
            }
            if (this._passUsage.uniform_EyePos) {
                context3DProxy.uniform3f(this._passUsage.uniform_EyePos.uniformIndex, camera3D.globalPosition.x, camera3D.globalPosition.y, camera3D.globalPosition.z);
            }
            if (this._passUsage.uniform_CameraMatrix) {
                context3DProxy.uniformMatrix4fv(this._passUsage.uniform_CameraMatrix.uniformIndex, false, camera3D.globalMatrix.rawData);
            }
            context3DProxy.drawElement(this._materialData.drawMode, subGeometry.start, subGeometry.count);
            if (this._materialData.alphaBlending) {
                dou3d.Context3DProxy.gl.depthMask(true);
            }
        };
        MaterialPass.prototype.deactiveState = function (passUsage, context3DProxy) {
            var sampler2D;
            for (var index in passUsage.sampler2DList) {
                sampler2D = this._passUsage.sampler2DList[index];
                if (!sampler2D.texture) {
                    continue;
                }
            }
        };
        MaterialPass.prototype.dispose = function () {
            if (this._passUsage) {
                this._passUsage.dispose();
            }
            this._passUsage = null;
        };
        return MaterialPass;
    }());
    dou3d.MaterialPass = MaterialPass;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 方法中需要用到的数据
     * @author wizardc
     */
    var PassUsage = /** @class */ (function () {
        function PassUsage() {
            /** 2D 采样器 */
            this.sampler2DList = [];
            /** 立方体采样器 */
            this.sampler3DList = [];
            /** 方向光数量 */
            this.maxDirectLight = 0;
            /** 点光源数量 */
            this.maxPointLight = 0;
            /** 聚光灯数量 */
            this.maxSpotLight = 0;
            /** 骨骼数量 */
            this.maxBone = 0;
            /** 属性是否改变, 改变后需要重新提交 */
            this.attributeDiry = true;
            this.vertexShader = new dou3d.ShaderComposer(0 /* vertex */);
            this.fragmentShader = new dou3d.ShaderComposer(1 /* fragment */);
        }
        PassUsage.prototype.dispose = function () {
            if (this.program3D) {
                this.program3D.dispose();
            }
            this.program3D = null;
            if (this.vertexShader && this.vertexShader.shader) {
                this.vertexShader.shader.dispose();
            }
            this.vertexShader = null;
            if (this.fragmentShader && this.fragmentShader.shader) {
                this.fragmentShader.shader.dispose();
            }
            this.fragmentShader = null;
        };
        return PassUsage;
    }());
    dou3d.PassUsage = PassUsage;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 渲染通道工具类
     * @author wizardc
     */
    var PassUtil;
    (function (PassUtil) {
        /**
         * 和 PassType 对应, 指定的渲染通道没有设定时是否创建默认的通道对象
         */
        PassUtil.passAuto = [true, true];
        /**
         * 创建默认的渲染通道数组
         */
        function createPass(pass, materialData) {
            switch (pass) {
                case 0 /* diffusePass */:
                    materialData.shaderPhaseTypes[0 /* diffusePass */] = [];
                    return new dou3d.DiffusePass(materialData);
                case 1 /* shadowPass */:
                    materialData.shaderPhaseTypes[1 /* shadowPass */] = [];
                    return new dou3d.ShadowPass(materialData);
            }
            return null;
        }
        PassUtil.createPass = createPass;
    })(PassUtil = dou3d.PassUtil || (dou3d.PassUtil = {}));
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 渲染方法基类
     * @author wizardc
     */
    var MethodBase = /** @class */ (function () {
        function MethodBase() {
            /**
             * 顶点着色器列表
             */
            this.vsShaderList = [];
            /**
             * 片段着色器列表
             */
            this.fsShaderList = [];
        }
        MethodBase.prototype.dispose = function () {
        };
        return MethodBase;
    }());
    dou3d.MethodBase = MethodBase;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 颜色渲染方法
     * @author wizardc
     */
    var ColorMethod = /** @class */ (function (_super) {
        __extends(ColorMethod, _super);
        function ColorMethod() {
            var _this = _super.call(this) || this;
            _this.fsShaderList[dou3d.ShaderPhaseType.diffuse_fragment] = _this.fsShaderList[dou3d.ShaderPhaseType.diffuse_fragment] || [];
            _this.fsShaderList[dou3d.ShaderPhaseType.diffuse_fragment].push("color_fs");
            return _this;
        }
        ColorMethod.prototype.upload = function (time, delay, usage, geometry, context3DProxy, modeltransform, camera3D) {
        };
        ColorMethod.prototype.activeState = function (time, delay, usage, geometry, context3DProxy, modeltransform, camera3D) {
        };
        return ColorMethod;
    }(dou3d.MethodBase));
    dou3d.ColorMethod = ColorMethod;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 阴影渲染方法
     * @author wizardc
     */
    var ShadowMethod = /** @class */ (function (_super) {
        __extends(ShadowMethod, _super);
        function ShadowMethod(material) {
            var _this = _super.call(this) || this;
            _this.materialData = material.materialData;
            _this.vsShaderList[dou3d.ShaderPhaseType.vertex_1] = _this.vsShaderList[dou3d.ShaderPhaseType.vertex_1] || [];
            _this.vsShaderList[dou3d.ShaderPhaseType.vertex_1].push("shadowMapping_vs");
            _this.fsShaderList[dou3d.ShaderPhaseType.shadow_fragment] = _this.fsShaderList[dou3d.ShaderPhaseType.shadow_fragment] || [];
            _this.fsShaderList[dou3d.ShaderPhaseType.shadow_fragment].push("shadowMapping_fs");
            return _this;
        }
        Object.defineProperty(ShadowMethod.prototype, "shadowMapTexture", {
            get: function () {
                return this.materialData.shadowMapTexture;
            },
            /**
             * 阴影贴图
             */
            set: function (texture) {
                if (this.materialData.shadowMapTexture != texture) {
                    this.materialData.shadowMapTexture = texture;
                    this.materialData.textureChange = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        ShadowMethod.prototype.upload = function (time, delay, usage, geometry, context3DProxy, modeltransform, camera3D) {
            if (usage.uniform_ShadowMatrix) {
                usage.uniform_ShadowMatrix.uniformIndex = context3DProxy.getUniformLocation(usage.program3D, "uniform_ShadowMatrix");
            }
        };
        ShadowMethod.prototype.activeState = function (time, delay, usage, geometry, context3DProxy, modeltransform, camera3D) {
            var camera = dou3d.ShadowCast.instance.shadowCamera;
            if (camera) {
                if (usage.uniform_ShadowMatrix && usage.uniform_ShadowMatrix.uniformIndex) {
                    context3DProxy.uniformMatrix4fv(usage.uniform_ShadowMatrix.uniformIndex, false, dou3d.ShadowCast.instance.shadowCamera.viewProjectionMatrix.rawData);
                }
            }
            context3DProxy.uniform4fv(usage.uniform_ShadowColor.uniformIndex, this.materialData.shadowColor);
        };
        return ShadowMethod;
    }(dou3d.MethodBase));
    dou3d.ShadowMethod = ShadowMethod;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 立方体渲染方法
     * @author wizardc
     */
    var CubeMethod = /** @class */ (function (_super) {
        __extends(CubeMethod, _super);
        function CubeMethod() {
            var _this = _super.call(this) || this;
            _this.vsShaderList[dou3d.ShaderPhaseType.vertex_2] = _this.fsShaderList[dou3d.ShaderPhaseType.vertex_2] || [];
            _this.vsShaderList[dou3d.ShaderPhaseType.vertex_2].push("cube_vs");
            _this.fsShaderList[dou3d.ShaderPhaseType.diffuse_fragment] = _this.fsShaderList[dou3d.ShaderPhaseType.diffuse_fragment] || [];
            _this.fsShaderList[dou3d.ShaderPhaseType.diffuse_fragment].push("cube_fs");
            return _this;
        }
        CubeMethod.prototype.upload = function (time, delay, usage, geometry, context3DProxy, modeltransform, camera3D) {
        };
        CubeMethod.prototype.activeState = function (time, delay, usage, geometry, context3DProxy, modeltransform, camera3D) {
        };
        return CubeMethod;
    }(dou3d.MethodBase));
    dou3d.CubeMethod = CubeMethod;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 漫反射渲染通道
     * @author wizardc
     */
    var DiffusePass = /** @class */ (function (_super) {
        __extends(DiffusePass, _super);
        function DiffusePass(materialData) {
            var _this = _super.call(this, materialData) || this;
            _this._passID = 0 /* diffusePass */;
            return _this;
        }
        DiffusePass.prototype.initShader = function (animation) {
            this._passChange = false;
            this._passUsage = new dou3d.PassUsage();
            this._vs_shader_methods = {};
            this._fs_shader_methods = {};
            this.phaseBegin(animation);
            this.initMethodShader();
            this.phaseEnd();
        };
        /**
         * 根据属性添加需要的着色器片段
         */
        DiffusePass.prototype.phaseBegin = function (animation) {
            // 动画
            if (animation) {
                // 添加骨骼动画处理着色器
                if (animation instanceof dou3d.SkeletonAnimation) {
                    this._passUsage.maxBone = animation.jointNum * 2;
                    this._vs_shader_methods[dou3d.ShaderPhaseType.start_vertex] = [];
                    this._vs_shader_methods[dou3d.ShaderPhaseType.start_vertex].push("skeleton_vs");
                }
            }
            // 根据属性设定加入需要的渲染方法
            if (this._materialData.acceptShadow) {
                // 添加接受阴影的 Shader
                this._vs_shader_methods[dou3d.ShaderPhaseType.vertex_2] = this._vs_shader_methods[dou3d.ShaderPhaseType.vertex_2] || [];
                this._fs_shader_methods[dou3d.ShaderPhaseType.shadow_fragment] = this._fs_shader_methods[dou3d.ShaderPhaseType.shadow_fragment] || [];
            }
            if (this._materialData.shaderPhaseTypes[0 /* diffusePass */].contains(dou3d.ShaderPhaseType.diffuse_fragment)) {
                this._fs_shader_methods[dou3d.ShaderPhaseType.diffuse_fragment] = [];
                this._fs_shader_methods[dou3d.ShaderPhaseType.diffuse_fragment].push("diffuse_fs");
            }
            if (this._materialData.shaderPhaseTypes[0 /* diffusePass */].contains(dou3d.ShaderPhaseType.normal_fragment)) {
                this._fs_shader_methods[dou3d.ShaderPhaseType.normal_fragment] = [];
                this._fs_shader_methods[dou3d.ShaderPhaseType.normal_fragment].push("normalMap_fs");
            }
            if (this._materialData.shaderPhaseTypes[0 /* diffusePass */].contains(dou3d.ShaderPhaseType.specular_fragment)) {
                this._fs_shader_methods[dou3d.ShaderPhaseType.specular_fragment] = [];
                this._fs_shader_methods[dou3d.ShaderPhaseType.specular_fragment].push("specularMap_fs");
            }
            // 灯光相关的渲染方法
            if (this.lightGroup) {
                this._passUsage.maxDirectLight = this.lightGroup.directList.length;
                this._passUsage.maxSpotLight = this.lightGroup.spotList.length;
                this._passUsage.maxPointLight = this.lightGroup.pointList.length;
                this._vs_shader_methods[dou3d.ShaderPhaseType.vertex_1] = this._vs_shader_methods[dou3d.ShaderPhaseType.vertex_1] || [];
                this._fs_shader_methods[dou3d.ShaderPhaseType.lighting_fragment] = [];
                this._fs_shader_methods[dou3d.ShaderPhaseType.lighting_fragment].push("lightingBase_fs");
                if (this.lightGroup.directList.length) {
                    this._passUsage.directLightData = new Float32Array(dou3d.DirectLight.stride * this.lightGroup.directList.length);
                    this._fs_shader_methods[dou3d.ShaderPhaseType.lighting_fragment].push("directLight_fs");
                }
                if (this.lightGroup.pointList.length) {
                    this._passUsage.pointLightData = new Float32Array(dou3d.PointLight.stride * this.lightGroup.pointList.length);
                    this._fs_shader_methods[dou3d.ShaderPhaseType.lighting_fragment].push("pointLight_fs");
                }
                if (this.lightGroup.spotList.length) {
                    this._passUsage.spotLightData = new Float32Array(dou3d.SpotLight.stride * this.lightGroup.spotList.length);
                    this._fs_shader_methods[dou3d.ShaderPhaseType.lighting_fragment].push("spotLight_fs");
                }
            }
        };
        /**
         * 添加来自 Method 的着色器片段
         */
        DiffusePass.prototype.initMethodShader = function () {
            var shaderPhase;
            var shaderList;
            for (var d = 0; d < this.methodList.length; d++) {
                var method = this.methodList[d];
                for (shaderPhase in method.vsShaderList) {
                    shaderList = method.vsShaderList[shaderPhase];
                    for (var i = 0; i < shaderList.length; i++) {
                        this._vs_shader_methods[shaderPhase] = this._vs_shader_methods[shaderPhase] || [];
                        this._vs_shader_methods[shaderPhase].push(shaderList[i]);
                    }
                }
                for (shaderPhase in method.fsShaderList) {
                    shaderList = method.fsShaderList[shaderPhase];
                    for (var i = 0; i < shaderList.length; i++) {
                        this._fs_shader_methods[shaderPhase] = this._fs_shader_methods[shaderPhase] || [];
                        this._fs_shader_methods[shaderPhase].push(shaderList[i]);
                    }
                }
            }
        };
        /**
         * 将渲染方法的对应着色器加入到对应的 Shader 对象中以便获得最终的着色器对象
         */
        DiffusePass.prototype.phaseEnd = function () {
            var shaderList;
            // 顶点着色器
            shaderList = this._vs_shader_methods[dou3d.ShaderPhaseType.custom_vertex];
            if (shaderList && shaderList.length > 0) {
                this.addMethodShaders(this._passUsage.vertexShader, shaderList);
            }
            // 没有时加入默认的着色器
            else {
                this.addMethodShaders(this._passUsage.vertexShader, ["base_vs"]);
                // start
                shaderList = this._vs_shader_methods[dou3d.ShaderPhaseType.start_vertex];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.vertexShader, shaderList);
                }
                else {
                    this.addMethodShaders(this._passUsage.vertexShader, ["diffuse_vs"]);
                }
                // vertex_1
                shaderList = this._vs_shader_methods[dou3d.ShaderPhaseType.vertex_1];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.vertexShader, shaderList);
                }
                // vertex_2
                shaderList = this._vs_shader_methods[dou3d.ShaderPhaseType.vertex_2];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.vertexShader, shaderList);
                }
                // end
                shaderList = this._vs_shader_methods[dou3d.ShaderPhaseType.end_vertex];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.vertexShader, shaderList);
                }
                else {
                    this.addMethodShaders(this._passUsage.vertexShader, ["end_vs"]);
                }
            }
            // 片段着色器
            shaderList = this._fs_shader_methods[dou3d.ShaderPhaseType.custom_fragment];
            if (shaderList && shaderList.length > 0) {
                this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
            }
            // 没有时加入默认的着色器
            else {
                this.addMethodShaders(this._passUsage.fragmentShader, ["base_fs"]);
                // start
                shaderList = this._fs_shader_methods[dou3d.ShaderPhaseType.start_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                // materialsource
                shaderList = this._fs_shader_methods[dou3d.ShaderPhaseType.materialsource_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                else {
                    this.addMethodShaders(this._passUsage.fragmentShader, ["materialSource_fs"]);
                }
                // diffuse
                shaderList = this._fs_shader_methods[dou3d.ShaderPhaseType.diffuse_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                else {
                    this.addMethodShaders(this._passUsage.fragmentShader, ["diffuse_fs"]);
                }
                // normal
                shaderList = this._fs_shader_methods[dou3d.ShaderPhaseType.normal_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                // shadow
                shaderList = this._fs_shader_methods[dou3d.ShaderPhaseType.shadow_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                // lighting
                shaderList = this._fs_shader_methods[dou3d.ShaderPhaseType.lighting_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                // specular
                shaderList = this._fs_shader_methods[dou3d.ShaderPhaseType.specular_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                // end
                shaderList = this._fs_shader_methods[dou3d.ShaderPhaseType.end_fragment];
                if (shaderList && shaderList.length > 0) {
                    this.addMethodShaders(this._passUsage.fragmentShader, shaderList);
                }
                else {
                    this.addMethodShaders(this._passUsage.fragmentShader, ["end_fs"]);
                }
            }
        };
        return DiffusePass;
    }(dou3d.MaterialPass));
    dou3d.DiffusePass = DiffusePass;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 阴影渲染通道
     * @author wizardc
     */
    var ShadowPass = /** @class */ (function (_super) {
        __extends(ShadowPass, _super);
        function ShadowPass(materialData) {
            var _this = _super.call(this, materialData) || this;
            _this._passID = 1 /* shadowPass */;
            return _this;
        }
        ShadowPass.prototype.initShader = function (animation) {
            this._passChange = false;
            this._passUsage = new dou3d.PassUsage();
            this._vs_shader_methods = {};
            this._fs_shader_methods = {};
            this.addMethodShaders(this._passUsage.vertexShader, ["shadowPass_vs"]);
            this.addMethodShaders(this._passUsage.fragmentShader, ["shadowPass_fs"]);
        };
        return ShadowPass;
    }(dou3d.MaterialPass));
    dou3d.ShadowPass = ShadowPass;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 纯颜色材质
     * @author wizardc
     */
    var ColorMaterial = /** @class */ (function (_super) {
        __extends(ColorMaterial, _super);
        function ColorMaterial(color) {
            if (color === void 0) { color = 0xcccccc; }
            var _this = _super.call(this) || this;
            _this.color = color;
            _this.initPass();
            return _this;
        }
        ColorMaterial.prototype.initPass = function () {
            this.addPass(0 /* diffusePass */);
            this.diffusePass.addMethod(new dou3d.ColorMethod());
        };
        Object.defineProperty(ColorMaterial.prototype, "color", {
            get: function () {
                return this.materialData.diffuseColor;
            },
            set: function (value) {
                this.materialData.diffuseColor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorMaterial.prototype, "alpha", {
            get: function () {
                return this.materialData.alpha;
            },
            set: function (value) {
                this.materialData.alpha = value;
            },
            enumerable: true,
            configurable: true
        });
        return ColorMaterial;
    }(dou3d.MaterialBase));
    dou3d.ColorMaterial = ColorMaterial;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 纹理材质
     * * 标准的贴图材质球, 可以设置三种贴图: diffuse, normal, speclar 贴图
     * * 不设置贴图时默认会设定为棋盘格贴图
     * @author wizardc
     */
    var TextureMaterial = /** @class */ (function (_super) {
        __extends(TextureMaterial, _super);
        function TextureMaterial(texture, materialData) {
            var _this = _super.call(this, materialData) || this;
            if (!texture) {
                texture = dou3d.CheckerboardTexture.texture;
            }
            _this.diffuseTexture = texture;
            _this.initPass();
            return _this;
        }
        TextureMaterial.prototype.initPass = function () {
            this.addPass(0 /* diffusePass */);
        };
        TextureMaterial.prototype.clone = function () {
            return new TextureMaterial(this.diffuseTexture, this.materialData.clone());
        };
        return TextureMaterial;
    }(dou3d.MaterialBase));
    dou3d.TextureMaterial = TextureMaterial;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 立方体纹理材质
     * @author wizardc
     */
    var CubeTextureMaterial = /** @class */ (function (_super) {
        __extends(CubeTextureMaterial, _super);
        function CubeTextureMaterial(texture, materialData) {
            var _this = _super.call(this, materialData) || this;
            _this.initPass();
            _this.materialData.diffuseTexture3D = texture;
            return _this;
        }
        CubeTextureMaterial.prototype.initPass = function () {
            this.addPass(0 /* diffusePass */);
            this.diffusePass.addMethod(new dou3d.CubeMethod());
        };
        CubeTextureMaterial.prototype.clone = function () {
            return new CubeTextureMaterial(this.diffuseTexture, this.materialData.clone());
        };
        return CubeTextureMaterial;
    }(dou3d.MaterialBase));
    dou3d.CubeTextureMaterial = CubeTextureMaterial;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 执行渲染基类
     * @author wizardc
     */
    var RendererBase = /** @class */ (function () {
        function RendererBase() {
            this.numEntity = 0;
        }
        /**
         * 设置为渲染到贴图
         */
        RendererBase.prototype.setRenderToTexture = function (width, height, format) {
            if (format === void 0) { format = 2 /* UNSIGNED_BYTE_RGB */; }
            this.renderTexture = new dou3d.RenderTexture(width, height, format);
        };
        return RendererBase;
    }());
    dou3d.RendererBase = RendererBase;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 渲染多个可渲染项目类
     * @author wizardc
     */
    var MultiRenderer = /** @class */ (function (_super) {
        __extends(MultiRenderer, _super);
        function MultiRenderer(pass) {
            if (pass === void 0) { pass = 0 /* diffusePass */; }
            var _this = _super.call(this) || this;
            _this._pass = pass;
            return _this;
        }
        MultiRenderer.prototype.draw = function (time, delay, context3D, collect, camera, backViewPort) {
            this.numEntity = collect.renderList.length;
            if (this.renderTexture) {
                this.renderTexture.upload(context3D);
                context3D.setRenderToTexture(this.renderTexture.texture2D);
            }
            var material;
            for (var renderIndex = 0; renderIndex < this.numEntity; renderIndex++) {
                var renderItem = collect.renderList[renderIndex];
                renderItem.geometry.activeState(context3D);
                for (var i = 0; i < renderItem.geometry.subGeometrys.length; i++) {
                    var subGeometry = renderItem.geometry.subGeometrys[i];
                    var matID = subGeometry.matID;
                    material = renderItem.multiMaterial[matID];
                    if (material == null) {
                        continue;
                    }
                    if (material.passes[this._pass]) {
                        for (var j = material.passes[this._pass].length - 1; j >= 0; j--) {
                            material.passes[this._pass][j].draw(time, delay, context3D, renderItem.globalMatrix, camera, subGeometry, renderItem);
                        }
                    }
                    // 没有设定 PASS 就使用默认的 PASS 来渲染
                    else if (dou3d.PassUtil.passAuto[this._pass]) {
                        if (!material.passes[this._pass]) {
                            material.addPass(this._pass);
                            material.passes[this._pass][0].draw(time, delay, context3D, renderItem.globalMatrix, camera, subGeometry, renderItem);
                        }
                    }
                    material = null;
                }
            }
            if (this.drawOver) {
                this.drawOver(collect, camera, time, delay, backViewPort);
            }
            if (this.renderTexture) {
                context3D.setRenderToBackBuffer();
                if (backViewPort) {
                    context3D.viewPort(backViewPort.x, backViewPort.y, backViewPort.w, backViewPort.h);
                    context3D.setScissorRectangle(backViewPort.x, backViewPort.y, backViewPort.w, backViewPort.h);
                }
            }
        };
        return MultiRenderer;
    }(dou3d.RendererBase));
    dou3d.MultiRenderer = MultiRenderer;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 3D 场景
     * @author wizardc
     */
    var Scene3D = /** @class */ (function () {
        function Scene3D() {
            this._root = new dou3d.ObjectContainer3D();
        }
        Object.defineProperty(Scene3D.prototype, "root", {
            get: function () {
                return this._root;
            },
            enumerable: true,
            configurable: true
        });
        return Scene3D;
    }());
    dou3d.Scene3D = Scene3D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 着色器变量基类
     * @author wizardc
     */
    var VarRegister = /** @class */ (function () {
        function VarRegister() {
            /**
             * 值名字
             */
            this.varName = "";
            /**
             * 变量名
             */
            this.name = "";
            /**
             * 变量属性类型
             * * att varying uniform
             */
            this.key = "";
            /**
             * 变量类型
             * * float vec2 vec3 vec4 int int2 int3 int4
             */
            this.valueType = "";
            /**
             * 变量值
             * * 类型为宏和常量时
             */
            this.value = "";
            /**
             * 要激活的纹理单元
             * * gl.TEXTURE_0 ~ gl.TEXTURE_8
             */
            this.activeTextureIndex = -1;
            /**
             * 绑定到取样器的纹理索引
             * * 如果激活的纹理单元是 gl.TEXTURE_0 则这里是 0, 和纹理单元对应
             */
            this.index = -1;
            /**
             * 总大小
             */
            this.size = 0;
            /**
             * 数据类型
             */
            this.dataType = 0;
            /**
             * 是否归一化
             */
            this.normalized = false;
            /**
             * 一个完整数据的字节数
             */
            this.stride = 0;
            /**
             * 单个数据的偏移量
             */
            this.offsetBytes = 0;
        }
        VarRegister.prototype.computeVarName = function () {
            var index = this.name.indexOf("[");
            if (index >= 0) {
                this.varName = this.name.substr(0, index);
            }
            else {
                this.varName = this.name;
            }
        };
        VarRegister.prototype.clone = function () {
            var temp = new VarRegister();
            temp.name = this.name;
            temp.valueType = this.valueType;
            temp.varName = this.varName;
            temp.value = this.value;
            temp.key = this.key;
            return temp;
        };
        return VarRegister;
    }());
    dou3d.VarRegister = VarRegister;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 变量属性
     * @author wizardc
     */
    var Attribute = /** @class */ (function (_super) {
        __extends(Attribute, _super);
        function Attribute(name, valueType) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.computeVarName();
            _this.key = "attribute";
            _this.valueType = valueType;
            return _this;
        }
        return Attribute;
    }(dou3d.VarRegister));
    dou3d.Attribute = Attribute;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 常量
     * @author wizardc
     */
    var ConstVar = /** @class */ (function (_super) {
        __extends(ConstVar, _super);
        function ConstVar(name, valueType, value) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.computeVarName();
            _this.key = "const";
            _this.valueType = valueType;
            _this.value = value;
            return _this;
        }
        return ConstVar;
    }(dou3d.VarRegister));
    dou3d.ConstVar = ConstVar;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 宏定义
     * @author wizardc
     */
    var DefineVar = /** @class */ (function (_super) {
        __extends(DefineVar, _super);
        function DefineVar(name, value) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.computeVarName();
            _this.key = "#define";
            _this.value = value;
            return _this;
        }
        return DefineVar;
    }(dou3d.VarRegister));
    dou3d.DefineVar = DefineVar;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 扩展
     * @author wizardc
     */
    var Extension = /** @class */ (function (_super) {
        __extends(Extension, _super);
        function Extension(name) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.computeVarName();
            _this.key = "#extension";
            return _this;
        }
        return Extension;
    }(dou3d.VarRegister));
    dou3d.Extension = Extension;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * sampler2D
     * @author wizardc
     */
    var Sampler2D = /** @class */ (function (_super) {
        __extends(Sampler2D, _super);
        function Sampler2D(name) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.computeVarName();
            _this.key = "sampler2D";
            return _this;
        }
        return Sampler2D;
    }(dou3d.VarRegister));
    dou3d.Sampler2D = Sampler2D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * sampler3D
     * @author wizardc
     */
    var Sampler3D = /** @class */ (function (_super) {
        __extends(Sampler3D, _super);
        function Sampler3D(name) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.computeVarName();
            _this.key = "samplerCube";
            return _this;
        }
        return Sampler3D;
    }(dou3d.VarRegister));
    dou3d.Sampler3D = Sampler3D;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 临时变量
     * @author wizardc
     */
    var TmpVar = /** @class */ (function (_super) {
        __extends(TmpVar, _super);
        function TmpVar(name, valueType) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.computeVarName();
            _this.key = "";
            _this.valueType = valueType;
            return _this;
        }
        return TmpVar;
    }(dou3d.VarRegister));
    dou3d.TmpVar = TmpVar;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * Uniform 属性
     * @author wizardc
     */
    var Uniform = /** @class */ (function (_super) {
        __extends(Uniform, _super);
        function Uniform(name, valueType) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.computeVarName();
            _this.key = "uniform";
            _this.valueType = valueType;
            return _this;
        }
        return Uniform;
    }(dou3d.VarRegister));
    dou3d.Uniform = Uniform;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * Varying 属性
     * @author wizardc
     */
    var Varying = /** @class */ (function (_super) {
        __extends(Varying, _super);
        function Varying(name, valueType) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.computeVarName();
            _this.key = "varying";
            _this.valueType = valueType;
            return _this;
        }
        return Varying;
    }(dou3d.VarRegister));
    dou3d.Varying = Varying;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 着色器组合器
     * * 添加多个需要使用的着色器片段, 得到最终可以使用的着色器
     * @author wizardc
     */
    var ShaderComposer = /** @class */ (function () {
        function ShaderComposer(type) {
            this._shadersName = [];
            this._endShadername = "";
            this._shaderType = -1;
            this._shaderType = type;
        }
        Object.defineProperty(ShaderComposer.prototype, "shaderType", {
            get: function () {
                return this._shaderType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShaderComposer.prototype, "shader", {
            get: function () {
                return this._shader;
            },
            set: function (value) {
                this._shader = value;
            },
            enumerable: true,
            configurable: true
        });
        ShaderComposer.prototype.addUseShaderName = function (shaderName) {
            this._shadersName.push(shaderName);
        };
        ShaderComposer.prototype.addEndShaderName = function (shaderName) {
            this._endShadername = shaderName;
        };
        ShaderComposer.prototype.getShader = function (passUsage) {
            if (this._endShadername) {
                var index = this._shadersName.indexOf(this._endShadername);
                if (index == -1) {
                    this._shadersName.push(this._endShadername);
                }
            }
            return dou3d.ShaderUtil.fillShaderContent(this, this._shadersName, passUsage);
        };
        return ShaderComposer;
    }());
    dou3d.ShaderComposer = ShaderComposer;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 解析着色器并对其内容进行分类, 同时提供着色器合并的功能
     * @author wizardc
     */
    var ShaderContent = /** @class */ (function () {
        function ShaderContent() {
            this.name = "";
            this.source = "";
            this.funcNames = [];
            this.funcDict = {};
            this.structNames = [];
            this.structDict = {};
            this.attributeList = [];
            this.varyingList = [];
            this.uniformList = [];
            this.constList = [];
            this.tempList = [];
            this.sampler2DList = [];
            this.sampler3DList = [];
            this.extensionList = [];
            this.defineList = [];
        }
        /**
         * 增加一个变量对象
         */
        ShaderContent.prototype.addVar = function (sVar) {
            if (sVar.key == "attribute") {
                this.attributeList.push(sVar);
            }
            else if (sVar.key == "varying") {
                this.varyingList.push(sVar);
            }
            else if (sVar.key == "uniform") {
                this.uniformList.push(sVar);
            }
            else if (sVar.key == "const") {
                this.constList.push(sVar);
            }
            else if (sVar.key == "sampler2D") {
                this.sampler2DList.push(sVar);
            }
            else if (sVar.key == "samplerCube") {
                this.sampler3DList.push(sVar);
            }
            else if (sVar.key == "#extension") {
                this.extensionList.push(sVar);
            }
            else if (sVar.key == "#define") {
                this.defineList.push(sVar);
            }
            else {
                this.tempList.push(sVar);
            }
        };
        /**
         * 增加一个函数
         */
        ShaderContent.prototype.addFunc = function (name, func) {
            if (!this.funcDict[name]) {
                this.funcDict[name] = func;
                this.funcNames.push(name);
            }
            else {
                var newfunc = this.mergeMainFunc(this.funcDict[name], func);
                this.funcDict[name] = newfunc;
            }
            if (this.funcDict["main"]) {
                var index = this.funcNames.indexOf("main");
                this.funcNames.splice(index, 1);
                this.funcNames.push("main");
            }
        };
        /**
         * 增加一个结构体
         */
        ShaderContent.prototype.addStruct = function (name, structStr) {
            if (!this.structDict[name]) {
                this.structDict[name] = structStr;
                this.structNames.push(name);
            }
            else {
                if (DEBUG) {
                    console.log("<" + name + ">" + "struct重复");
                }
            }
        };
        /**
         * 合并一个shader内容
         */
        ShaderContent.prototype.addContent = function (otherContent) {
            for (var i = 0; i < otherContent.structNames.length; ++i) {
                this.addStruct(otherContent.structNames[i], otherContent.structDict[otherContent.structNames[i]]);
            }
            for (var i = 0; i < otherContent.funcNames.length; ++i) {
                this.addFunc(otherContent.funcNames[i], otherContent.funcDict[otherContent.funcNames[i]]);
            }
            for (var i = 0; i < otherContent.attributeList.length; ++i) {
                var isAdd = true;
                for (var j = 0; j < this.attributeList.length; ++j) {
                    if (otherContent.attributeList[i].name == this.attributeList[j].name) {
                        if (DEBUG) {
                            if (otherContent.attributeList[i].valueType != this.attributeList[j].valueType || otherContent.attributeList[i].key != this.attributeList[j].key) {
                                console.log(otherContent.attributeList[i].name + "=> type:" + otherContent.attributeList[i].valueType + " " + this.attributeList[j].valueType + " => key:" + otherContent.attributeList[i].key + " " + this.attributeList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.attributeList.push(otherContent.attributeList[i].clone());
                }
            }
            for (var i = 0; i < otherContent.varyingList.length; ++i) {
                var isAdd = true;
                for (var j = 0; j < this.varyingList.length; ++j) {
                    if (otherContent.varyingList[i].name == this.varyingList[j].name) {
                        if (DEBUG) {
                            if (otherContent.varyingList[i].valueType != this.varyingList[j].valueType || otherContent.varyingList[i].key != this.varyingList[j].key) {
                                console.log(otherContent.varyingList[i].name + "=> type:" + otherContent.varyingList[i].valueType + " " + this.varyingList[j].valueType + " => key:" + otherContent.varyingList[i].key + " " + this.varyingList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.varyingList.push(otherContent.varyingList[i].clone());
                }
            }
            for (var i = 0; i < otherContent.uniformList.length; ++i) {
                var isAdd = true;
                for (var j = 0; j < this.uniformList.length; ++j) {
                    if (otherContent.uniformList[i].name == this.uniformList[j].name) {
                        if (DEBUG) {
                            if (otherContent.uniformList[i].valueType != this.uniformList[j].valueType || otherContent.uniformList[i].key != this.uniformList[j].key) {
                                console.log(otherContent.uniformList[i].name + "=> type:" + otherContent.uniformList[i].valueType + " " + this.uniformList[j].valueType + " => key:" + otherContent.uniformList[i].key + " " + this.uniformList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.uniformList.push(otherContent.uniformList[i].clone());
                }
            }
            for (var i = 0; i < otherContent.constList.length; ++i) {
                var isAdd = true;
                for (var j = 0; j < this.constList.length; ++j) {
                    if (otherContent.constList[i].name == this.constList[j].name) {
                        if (DEBUG) {
                            if (otherContent.constList[i].valueType != this.constList[j].valueType || otherContent.constList[i].key != this.constList[j].key) {
                                console.log(otherContent.constList[i].name + "=> type:" + otherContent.constList[i].valueType + " " + this.constList[j].valueType + " => key:" + otherContent.constList[i].key + " " + this.constList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.constList.push(otherContent.constList[i].clone());
                }
            }
            for (var i = 0; i < otherContent.tempList.length; ++i) {
                var isAdd = true;
                for (var j = 0; j < this.tempList.length; ++j) {
                    if (otherContent.tempList[i].name == this.tempList[j].name) {
                        if (DEBUG) {
                            if (otherContent.tempList[i].valueType != this.tempList[j].valueType || otherContent.tempList[i].key != this.tempList[j].key) {
                                console.log(otherContent.tempList[i].name + "=> type:" + otherContent.tempList[i].valueType + " " + this.tempList[j].valueType + " => key:" + otherContent.tempList[i].key + " " + this.tempList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.tempList.push(otherContent.tempList[i].clone());
                }
            }
            for (var i = 0; i < otherContent.sampler2DList.length; ++i) {
                var isAdd = true;
                for (var j = 0; j < this.sampler2DList.length; ++j) {
                    if (otherContent.sampler2DList[i].name == this.sampler2DList[j].name) {
                        if (DEBUG) {
                            if (otherContent.sampler2DList[i].valueType != this.sampler2DList[j].valueType || otherContent.sampler2DList[i].key != this.sampler2DList[j].key) {
                                console.log(otherContent.sampler2DList[i].name + "=> type:" + otherContent.sampler2DList[i].valueType + " " + this.sampler2DList[j].valueType + " => key:" + otherContent.sampler2DList[i].key + " " + this.sampler2DList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.sampler2DList.push(otherContent.sampler2DList[i].clone());
                }
            }
            for (var i = 0; i < otherContent.sampler3DList.length; ++i) {
                var isAdd = true;
                for (var j = 0; j < this.sampler3DList.length; ++j) {
                    if (otherContent.sampler3DList[i].name == this.sampler3DList[j].name) {
                        if (DEBUG) {
                            if (otherContent.sampler2DList[i].valueType != this.sampler3DList[j].valueType || otherContent.sampler3DList[i].key != this.sampler3DList[j].key) {
                                console.log(otherContent.sampler3DList[i].name + "=> type:" + otherContent.sampler3DList[i].valueType + " " + this.sampler3DList[j].valueType + " => key:" + otherContent.sampler3DList[i].key + " " + this.sampler3DList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.sampler3DList.push(otherContent.sampler3DList[i].clone());
                }
            }
            for (var i = 0; i < otherContent.extensionList.length; ++i) {
                var isAdd = true;
                for (var j = 0; j < this.extensionList.length; ++j) {
                    if (otherContent.extensionList[i].name == this.extensionList[j].name) {
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.extensionList.push(otherContent.extensionList[i].clone());
                }
            }
            for (var i = 0; i < otherContent.defineList.length; ++i) {
                var isAdd = true;
                for (var j = 0; j < this.defineList.length; ++j) {
                    if (otherContent.defineList[i].name == this.defineList[j].name) {
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.defineList.push(otherContent.defineList[i].clone());
                }
            }
        };
        ShaderContent.prototype.mergeMainFunc = function (func1, func2) {
            var ret = func1;
            var func = "";
            var s_pos = func2.indexOf("{");
            var e_pos = func2.lastIndexOf("}");
            s_pos++;
            func = func2.slice(s_pos, e_pos);
            s_pos = ret.lastIndexOf("}");
            var f_func = ret.substr(0, s_pos);
            var s_func = ret.substr(s_pos, ret.length - s_pos);
            ret = f_func;
            ret += func;
            var line = "";
            ret += line;
            ret += s_func;
            return ret;
        };
        ShaderContent.prototype.clone = function () {
            var content = new ShaderContent();
            content.name = this.name;
            content.source = this.source;
            for (var i = 0; i < this.funcNames.length; ++i) {
                content.funcNames.push(this.funcNames[i]);
            }
            for (var key in this.funcDict) {
                content.funcDict[key] = this.funcDict[key];
            }
            for (var i = 0; i < this.structNames.length; ++i) {
                content.structNames.push(this.structNames[i]);
            }
            for (var key in this.structDict) {
                content.structDict[key] = this.structDict[key];
            }
            for (var i = 0; i < this.attributeList.length; ++i) {
                content.attributeList.push(this.attributeList[i].clone());
            }
            for (var i = 0; i < this.varyingList.length; ++i) {
                content.varyingList.push(this.varyingList[i].clone());
            }
            for (var i = 0; i < this.uniformList.length; ++i) {
                content.uniformList.push(this.uniformList[i].clone());
            }
            for (var i = 0; i < this.constList.length; ++i) {
                content.constList.push(this.constList[i].clone());
            }
            for (var i = 0; i < this.tempList.length; ++i) {
                content.tempList.push(this.tempList[i].clone());
            }
            for (var i = 0; i < this.sampler2DList.length; ++i) {
                content.sampler2DList.push(this.sampler2DList[i].clone());
            }
            for (var i = 0; i < this.sampler3DList.length; ++i) {
                content.sampler3DList.push(this.sampler3DList[i].clone());
            }
            for (var i = 0; i < this.attributeList.length; ++i) {
                content.attributeList.push(this.attributeList[i].clone());
            }
            for (var i = 0; i < this.extensionList.length; ++i) {
                content.extensionList.push(this.extensionList[i].clone());
            }
            for (var i = 0; i < this.defineList.length; ++i) {
                content.defineList.push(this.defineList[i].clone());
            }
            return content;
        };
        return ShaderContent;
    }());
    dou3d.ShaderContent = ShaderContent;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 着色器缓存池
     * @author wizardc
     */
    var ShaderPool;
    (function (ShaderPool) {
        var _programlib = {};
        var _vsShaderHashMap = {};
        var _fsShaderHashMap = {};
        var _context;
        function register(context) {
            _context = context;
        }
        ShaderPool.register = register;
        function getGPUShader(shaderType, shaderID, source) {
            var shader = _vsShaderHashMap[shaderID];
            if (!shader) {
                shader = _fsShaderHashMap[shaderID];
            }
            if (!shader) {
                if (shaderType == 0 /* vertex */) {
                    shader = _context.createVertexShader(source);
                    shader.id = shaderID;
                    _vsShaderHashMap[shaderID] = shader;
                }
                else if (shaderType == 1 /* fragment */) {
                    shader = _context.createFragmentShader(source);
                    shader.id = shaderID;
                    _fsShaderHashMap[shaderID] = shader;
                }
            }
            return shader;
        }
        ShaderPool.getGPUShader = getGPUShader;
        function getProgram(vs_shaderID, fs_shaderID) {
            var vsShader = _vsShaderHashMap[vs_shaderID];
            var fsShader = _fsShaderHashMap[fs_shaderID];
            var name = vsShader.id + "_" + fsShader.id;
            var program3D;
            if (_programlib[name]) {
                program3D = _programlib[name];
            }
            else {
                program3D = registerProgram(vsShader, fsShader);
                _programlib[name] = program3D;
            }
            return _programlib[name];
        }
        ShaderPool.getProgram = getProgram;
        function registerProgram(vsShader, fsShader) {
            var program3D = _context.createProgram(vsShader, fsShader);
            return program3D;
        }
    })(ShaderPool = dou3d.ShaderPool || (dou3d.ShaderPool = {}));
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 着色器库
     * @author GLSLPacker
     */
    var ShaderLib;
    (function (ShaderLib) {
        ShaderLib.base_fs = "#extension GL_OES_standard_derivatives:enable\nvarying vec3 varying_eyeNormal;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nvarying vec4 varying_worldPosition;\nvarying vec3 varying_worldNormal;\nuniform mat4 uniform_ViewMatrix;\nuniform vec3 uniform_EyePos;\nvec4 diffuseColor;\nvec4 specularColor;\nvec4 ambientColor;\nvec4 light;\nvec3 normal;\nvec2 uv_0;\nvoid main(){\ndiffuseColor=vec4(1.0,1.0,1.0,1.0);\nspecularColor=vec4(0.0,0.0,0.0,0.0);\nambientColor=vec4(0.0,0.0,0.0,0.0);\nlight=vec4(1.0,1.0,1.0,1.0);\nnormal=normalize(varying_eyeNormal);\nuv_0=varying_uv0;\n}";
        ShaderLib.base_vs = "attribute vec3 attribute_position;\nattribute vec3 attribute_normal;\nattribute vec4 attribute_color;\nattribute vec2 attribute_uv0;\nvec3 e_position=vec3(0.0,0.0,0.0);\nuniform mat4 uniform_ModelMatrix;\nuniform mat4 uniform_ViewMatrix;\nuniform mat4 uniform_ProjectionMatrix;\nvarying vec3 varying_eyeNormal;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nvarying vec4 varying_worldPosition;\nvarying vec3 varying_worldNormal;\nvec4 outPosition;\nmat4 transpose(mat4 inMatrix){\nvec4 i0=inMatrix[0];\nvec4 i1=inMatrix[1];\nvec4 i2=inMatrix[2];\nvec4 i3=inMatrix[3];\nmat4 outMatrix=mat4(\nvec4(i0.x,i1.x,i2.x,i3.x),\nvec4(i0.y,i1.y,i2.y,i3.y),\nvec4(i0.z,i1.z,i2.z,i3.z),\nvec4(i0.w,i1.w,i2.w,i3.w)\n);\nreturn outMatrix;\n}\nmat4 inverse(mat4 m){\nfloat\na00=m[0][0],a01=m[0][1],a02=m[0][2],a03=m[0][3],\na10=m[1][0],a11=m[1][1],a12=m[1][2],a13=m[1][3],\na20=m[2][0],a21=m[2][1],a22=m[2][2],a23=m[2][3],\na30=m[3][0],a31=m[3][1],a32=m[3][2],a33=m[3][3],\nb00=a00*a11-a01*a10,\nb01=a00*a12-a02*a10,\nb02=a00*a13-a03*a10,\nb03=a01*a12-a02*a11,\nb04=a01*a13-a03*a11,\nb05=a02*a13-a03*a12,\nb06=a20*a31-a21*a30,\nb07=a20*a32-a22*a30,\nb08=a20*a33-a23*a30,\nb09=a21*a32-a22*a31,\nb10=a21*a33-a23*a31,\nb11=a22*a33-a23*a32,\ndet=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;\nreturn mat4(\na11*b11-a12*b10+a13*b09,\na02*b10-a01*b11-a03*b09,\na31*b05-a32*b04+a33*b03,\na22*b04-a21*b05-a23*b03,\na12*b08-a10*b11-a13*b07,\na00*b11-a02*b08+a03*b07,\na32*b02-a30*b05-a33*b01,\na20*b05-a22*b02+a23*b01,\na10*b10-a11*b08+a13*b06,\na01*b08-a00*b10-a03*b06,\na30*b04-a31*b02+a33*b00,\na21*b02-a20*b04-a23*b00,\na11*b07-a10*b09-a12*b06,\na00*b09-a01*b07+a02*b06,\na31*b01-a30*b03-a32*b00,\na20*b03-a21*b01+a22*b00)/det;\n}\nvoid main(){\ne_position=attribute_position;\nvarying_color=attribute_color;\nvarying_uv0=attribute_uv0;\nvarying_worldPosition=uniform_ModelMatrix*vec4(e_position,1.0);\nvarying_worldNormal=normalize((uniform_ModelMatrix*vec4(attribute_normal,0.0)).xyz);\n}";
        ShaderLib.color_fs = "void main(){\n}";
        ShaderLib.cube_fs = "uniform samplerCube diffuseTexture3D;\nvarying vec3 varying_pos;\nvec4 diffuseColor;\nvoid main(){\nvec3 uvw=normalize(varying_pos.xyz);\ndiffuseColor=vec4(textureCube(diffuseTexture3D,uvw.xyz));\nif(diffuseColor.w<materialSource.cutAlpha){\ndiscard;\n}\nelse{\ndiffuseColor.xyz*=diffuseColor.w;\n}\n}";
        ShaderLib.cube_vs = "varying vec3 varying_pos;\nvoid main(){\nvarying_pos=e_position;\n}";
        ShaderLib.diffuse_fs = "uniform sampler2D diffuseTexture;\nvec4 diffuseColor;\nvoid main(){\ndiffuseColor=texture2D(diffuseTexture,uv_0);\nif(diffuseColor.w<materialSource.cutAlpha){\ndiscard;\n}\n}";
        ShaderLib.diffuse_vs = "attribute vec3 attribute_normal;\nattribute vec4 attribute_color;\nvarying vec4 varying_modelViewPosition;\nvarying vec4 varying_color;\nvoid main(){\nmat4 mvMatrix=mat4(uniform_ViewMatrix*uniform_ModelMatrix);\nvarying_modelViewPosition=mvMatrix*vec4(e_position,1.0);\nmat4 normalMatrix=inverse(mvMatrix);\nnormalMatrix=transpose(normalMatrix);\nvarying_eyeNormal=mat3(normalMatrix)*-attribute_normal;\noutPosition=varying_modelViewPosition;\nvarying_color=attribute_color;\n}";
        ShaderLib.end_fs = "varying vec4 varying_color;\nvec4 outColor;\nvec4 diffuseColor;\nvec4 specularColor;\nvec4 ambientColor;\nvec4 light;\nvoid main(){\noutColor.xyz=(light.xyz+materialSource.ambient)*diffuseColor.xyz*materialSource.diffuse*varying_color.xyz;\noutColor.w=materialSource.alpha*diffuseColor.w*varying_color.w;\noutColor.xyz*=outColor.w;\ngl_FragColor=outColor;\n}";
        ShaderLib.end_vs = "uniform float uniform_materialSource[20];\nvoid main(){\ngl_PointSize=uniform_materialSource[18];\ngl_Position=uniform_ProjectionMatrix*outPosition;\n}";
        ShaderLib.normalMap_fs = "";
        ShaderLib.specularMap_fs = "";
        ShaderLib.directLight_fs = "const int max_directLight=0;\nuniform float uniform_directLightSource[6*max_directLight];\nstruct DirectLight{\nvec3 direction;\nvec3 diffuse;\nvec3 ambient;\n};\nvoid calculateDirectLight(MaterialSource materialSource){\nvec3 viewDir=normalize(uniform_EyePos-varying_worldPosition.xyz);\nfor(int i=0;i<max_directLight;i++){\nDirectLight directLight;\ndirectLight.direction=vec3(uniform_directLightSource[i*6],uniform_directLightSource[i*6+1],uniform_directLightSource[i*6+2]);\ndirectLight.diffuse=vec3(uniform_directLightSource[i*6+3],uniform_directLightSource[i*6+4],uniform_directLightSource[i*6+5]);\nvec3 lightDir=-directLight.direction;\nfloat diffuse=calculateLightDiffuse(varying_worldNormal,lightDir);\nfloat specular=calculateLightSpecular(varying_worldNormal,lightDir,viewDir,materialSource.specularScale);\nlight.xyz+=(materialSource.ambient+diffuse*materialSource.diffuse+specular*materialSource.specular)*directLight.diffuse;\n}\n}\nvoid main(){\ncalculateDirectLight(materialSource);\n}";
        ShaderLib.lightingBase_fs = "float computeDistanceLightFalloff(float lightDistance,float range){\nreturn max(0.0,1.0-lightDistance/range);\n}\nfloat calculateLightDiffuse(vec3 normal,vec3 lightDir){\nreturn clamp(dot(normal,lightDir),0.0,1.0);\n}\nfloat calculateLightSpecular(vec3 normal,vec3 lightDir,vec3 viewDir,float glossiness){\nvec3 halfVec=normalize(lightDir+viewDir);\nfloat specComp=max(dot(normal,halfVec),0.0);\nspecComp=pow(specComp,glossiness);\nreturn specComp;\n}\nvoid main(){\nlight.xyzw=vec4(0.0,0.0,0.0,1.0);\n}";
        ShaderLib.pointLight_fs = "const int max_pointLight=0;\nuniform float uniform_pointLightSource[7*max_pointLight];\nstruct PointLight{\nvec3 position;\nvec3 diffuse;\nvec3 ambient;\nfloat intensity;\nfloat radius;\n};\nvoid calculatePointLight(MaterialSource materialSource){\nvec3 viewDir=normalize(uniform_EyePos-varying_worldPosition.xyz);\nfor(int i=0;i<max_pointLight;i++){\nPointLight pointLight;\npointLight.position=vec3(uniform_pointLightSource[i*7],uniform_pointLightSource[i*7+1],uniform_pointLightSource[i*7+2]);\npointLight.diffuse=vec3(uniform_pointLightSource[i*7+3],uniform_pointLightSource[i*7+4],uniform_pointLightSource[i*7+5]);\npointLight.radius=uniform_pointLightSource[i*7+6];\nvec3 lightOffset=pointLight.position-varying_worldPosition.xyz;\nvec3 lightDir=normalize(lightOffset);\nfloat falloff=computeDistanceLightFalloff(length(lightOffset),pointLight.radius);\nfloat diffuse=calculateLightDiffuse(varying_worldNormal,lightDir);\nfloat specular=calculateLightSpecular(varying_worldNormal,lightDir,viewDir,materialSource.specularScale);\nlight.xyz+=(materialSource.ambient+diffuse*materialSource.diffuse+specular*materialSource.specular)*pointLight.diffuse*falloff;\n}\n}\nvoid main(){\ncalculatePointLight(materialSource);\n}";
        ShaderLib.spotLight_fs = "const int max_spotLight=0;\nuniform float uniform_spotLightSource[12*max_spotLight];\nstruct SpotLight{\nvec3 position;\nvec3 direction;\nvec3 diffuse;\nvec3 ambient;\nfloat range;\nfloat coneCos;\nfloat penumbraCos;\n};\nvoid calculateSpotLight(MaterialSource materialSource){\nvec3 viewDir=normalize(uniform_EyePos-varying_worldPosition.xyz);\nfor(int i=0;i<max_spotLight;i++){\nSpotLight spotLight;\nspotLight.position=vec3(uniform_spotLightSource[i*12],uniform_spotLightSource[i*12+1],uniform_spotLightSource[i*12+2]);\nspotLight.direction=vec3(uniform_spotLightSource[i*12+3],uniform_spotLightSource[i*12+4],uniform_spotLightSource[i*12+5]);\nspotLight.diffuse=vec3(uniform_spotLightSource[i*12+6],uniform_spotLightSource[i*12+7],uniform_spotLightSource[i*12+8]);\nspotLight.range=uniform_spotLightSource[i*12+9];\nspotLight.coneCos=uniform_spotLightSource[i*12+10];\nspotLight.penumbraCos=uniform_spotLightSource[i*12+11];\nvec3 lightOffset=spotLight.position-varying_worldPosition.xyz;\nvec3 lightDir=normalize(lightOffset);\nfloat angleCos=dot(lightDir,-spotLight.direction);\nif(angleCos>spotLight.coneCos){\nfloat spotEffect=smoothstep(spotLight.coneCos,spotLight.penumbraCos,angleCos);\nfloat falloff=computeDistanceLightFalloff(length(lightOffset)*angleCos,spotLight.range);\nfloat diffuse=calculateLightDiffuse(varying_worldNormal,lightDir);\nfloat specular=calculateLightSpecular(varying_worldNormal,lightDir,viewDir,materialSource.specularScale);\nlight.xyz+=(materialSource.ambient+diffuse*materialSource.diffuse+specular*materialSource.specular)*spotLight.diffuse*falloff*spotEffect;\n}\n}\n}\nvoid main(){\ncalculateSpotLight(materialSource);\n}";
        ShaderLib.materialSource_fs = "struct MaterialSource{\nvec3 diffuse;\nvec3 ambient;\nvec3 specular;\nfloat alpha;\nfloat cutAlpha;\nfloat shininess;\nfloat roughness;\nfloat albedo;\nvec4 uvRectangle;\nfloat specularScale;\nfloat normalScale;\n};\nuniform float uniform_materialSource[20];\nvarying vec2 varying_uv0;\nMaterialSource materialSource;\nvec2 uv_0;\nvoid main(){\nmaterialSource.diffuse.x=uniform_materialSource[0];\nmaterialSource.diffuse.y=uniform_materialSource[1];\nmaterialSource.diffuse.z=uniform_materialSource[2];\nmaterialSource.ambient.x=uniform_materialSource[3];\nmaterialSource.ambient.y=uniform_materialSource[4];\nmaterialSource.ambient.z=uniform_materialSource[5];\nmaterialSource.specular.x=uniform_materialSource[6];\nmaterialSource.specular.y=uniform_materialSource[7];\nmaterialSource.specular.z=uniform_materialSource[8];\nmaterialSource.alpha=uniform_materialSource[9];\nmaterialSource.cutAlpha=uniform_materialSource[10];\nmaterialSource.shininess=uniform_materialSource[11];\nmaterialSource.specularScale=uniform_materialSource[12];\nmaterialSource.albedo=uniform_materialSource[13];\nmaterialSource.uvRectangle.x=uniform_materialSource[14];\nmaterialSource.uvRectangle.y=uniform_materialSource[15];\nmaterialSource.uvRectangle.z=uniform_materialSource[16];\nmaterialSource.uvRectangle.w=uniform_materialSource[17];\nmaterialSource.specularScale=uniform_materialSource[18];\nmaterialSource.normalScale=uniform_materialSource[19];\nuv_0=varying_uv0.xy*materialSource.uvRectangle.zw+materialSource.uvRectangle.xy;\n}";
        ShaderLib.shadowMapping_fs = "uniform sampler2D shadowMapTexture;\nuniform vec4 uniform_ShadowColor;\nvarying vec4 varying_ShadowCoord;\nvoid main(){\nvec3 shadowColor=vec3(1.0,1.0,1.0);\nvec4 shadowCoord=varying_ShadowCoord;\nshadowCoord.xyz/=shadowCoord.w;\nshadowCoord.xyz=(shadowCoord.xyz+1.0)/2.0;\nfloat depth=texture2D(shadowMapTexture,shadowCoord.xy).x;\nif(shadowCoord.z>depth+0.005){\nshadowColor=uniform_ShadowColor.xyz;\n}\ndiffuseColor.xyz=diffuseColor.xyz*shadowColor;\n}";
        ShaderLib.shadowMapping_vs = "uniform mat4 uniform_ModelMatrix;\nuniform mat4 uniform_ShadowMatrix;\nvarying vec4 varying_ShadowCoord;\nvoid main(){\nvarying_ShadowCoord=uniform_ShadowMatrix*uniform_ModelMatrix*vec4(attribute_position,1.0);\n}";
        ShaderLib.shadowPass_fs = "uniform sampler2D diffuseTexture;\nvec4 diffuseColor;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nvoid main(){\ndiffuseColor=varying_color;\nif(diffuseColor.w==0.0){\ndiscard;\n}\ndiffuseColor=texture2D(diffuseTexture,varying_uv0);\nif(diffuseColor.w<=0.3){\ndiscard;\n}\ngl_FragColor=vec4(gl_FragCoord.z,0.0,0.0,1.0);\n}";
        ShaderLib.shadowPass_vs = "attribute vec3 attribute_position;\nattribute vec4 attribute_color;\nattribute vec2 attribute_uv0;\nuniform mat4 uniform_ModelMatrix;\nuniform mat4 uniform_ViewProjectionMatrix;\nvarying vec2 varying_uv0;\nvarying vec4 varying_color;\nvoid main(){\nvarying_uv0=attribute_uv0;\nvarying_color=attribute_color;\ngl_Position=uniform_ViewProjectionMatrix*uniform_ModelMatrix*vec4(attribute_position,1.0);\n}";
        ShaderLib.skeleton_vs = "attribute vec4 attribute_boneIndex;\nattribute vec4 attribute_boneWeight;\nattribute vec3 attribute_normal;\nattribute vec4 attribute_color;\nvec4 e_boneIndex=vec4(0.0,0.0,0.0,0.0);\nvec4 e_boneWeight=vec4(0.0,0.0,0.0,0.0);\nconst int bonesNumber=0;\nuniform vec4 uniform_PoseMatrix[bonesNumber];\nvarying vec4 varying_modelViewPosition;\nmat4 buildMat4(int index){\nvec4 quat=uniform_PoseMatrix[index*2+0];\nvec4 translation=uniform_PoseMatrix[index*2+1];\nfloat xy2=2.0*quat.x*quat.y;\nfloat xz2=2.0*quat.x*quat.z;\nfloat xw2=2.0*quat.x*quat.w;\nfloat yz2=2.0*quat.y*quat.z;\nfloat yw2=2.0*quat.y*quat.w;\nfloat zw2=2.0*quat.z*quat.w;\nfloat xx=quat.x*quat.x;\nfloat yy=quat.y*quat.y;\nfloat zz=quat.z*quat.z;\nfloat ww=quat.w*quat.w;\nmat4 matrix=mat4(\nxx-yy-zz+ww,xy2+zw2,xz2-yw2,0,\nxy2-zw2,-xx+yy-zz+ww,yz2+xw2,0,\nxz2+yw2,yz2-xw2,-xx-yy+zz+ww,0,\ntranslation.x,translation.y,translation.z,1\n);\nreturn matrix;\n}\nvoid main(){\ne_boneIndex=attribute_boneIndex;\ne_boneWeight=attribute_boneWeight;\nvec4 temp_position=vec4(attribute_position,1.0);\nvec4 temp_normal=vec4(attribute_normal,0.0);\nmat4 m0=buildMat4(int(e_boneIndex.x));\nmat4 m1=buildMat4(int(e_boneIndex.y));\nmat4 m2=buildMat4(int(e_boneIndex.z));\nmat4 m3=buildMat4(int(e_boneIndex.w));\noutPosition=m0*temp_position*e_boneWeight.x;\noutPosition+=m1*temp_position*e_boneWeight.y;\noutPosition+=m2*temp_position*e_boneWeight.z;\noutPosition+=m3*temp_position*e_boneWeight.w;\ne_position=outPosition.xyz;\nvec4 temp_n;\ntemp_n=m0*temp_normal*e_boneWeight.x;\ntemp_n+=m1*temp_normal*e_boneWeight.y;\ntemp_n+=m2*temp_normal*e_boneWeight.z;\ntemp_n+=m3*temp_normal*e_boneWeight.w;\nmat4 mvMatrix=mat4(uniform_ViewMatrix*uniform_ModelMatrix);\nvarying_modelViewPosition=mvMatrix*vec4(e_position,1.0);\nmat4 normalMatrix=inverse(mvMatrix);\nnormalMatrix=transpose(normalMatrix);\nvarying_eyeNormal=mat3(normalMatrix)*-attribute_normal;\noutPosition.xyzw=varying_modelViewPosition.xyzw;\nvarying_color=attribute_color;\n}";
    })(ShaderLib = dou3d.ShaderLib || (dou3d.ShaderLib = {}));
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 着色器工具类
     * @author wizardc
     */
    var ShaderUtil;
    (function (ShaderUtil) {
        var _shaderContentDict = [];
        /**
         * 加载着色器文件
         */
        function load() {
            for (var key in dou3d.ShaderLib) {
                var content = readShader(dou3d.ShaderLib[key]);
                _shaderContentDict[key] = content;
                content.name = key;
            }
        }
        ShaderUtil.load = load;
        function readShader(str) {
            var content = new dou3d.ShaderContent();
            var shaderLine = parseContent(str);
            while (shaderLine.length > 0) {
                var line = shaderLine[0];
                shaderLine.shift();
                var ret = getLineType(line);
                var index = -1;
                index = ret.indexOf("struct");
                if (index != -1) {
                    var tempArray = ret.split(" ");
                    var structStr = line;
                    content.addStruct(tempArray[1], structStr);
                    processStruct(tempArray[1], structStr, content);
                    continue;
                }
                index = ret.indexOf("function");
                if (index != -1) {
                    var tempArray = ret.split(" ");
                    var func = line;
                    content.addFunc(tempArray[1], func);
                    continue;
                }
                index = ret.indexOf("unknown");
                if (index != -1) {
                    var tempArray = parseLines(line);
                    var key = getVarKey(tempArray);
                    var valueType = getVarType(tempArray);
                    if (valueType == "sampler2D") {
                        var sampler2D = getSampler2D(line);
                        if (sampler2D) {
                            content.addVar(sampler2D);
                        }
                    }
                    else if (valueType == "samplerCube") {
                        var sampler3D = getSampler3D(line);
                        if (sampler3D) {
                            content.addVar(sampler3D);
                        }
                    }
                    else {
                        if (key == "attribute") {
                            var att = getAttribute(line);
                            if (att) {
                                content.addVar(att);
                            }
                        }
                        else if (key == "varying") {
                            var varying = getVarying(line);
                            if (varying) {
                                content.addVar(varying);
                            }
                        }
                        else if (key == "uniform") {
                            var uniform = getUniform(line);
                            if (uniform) {
                                content.addVar(uniform);
                            }
                        }
                        else if (key == "const") {
                            var ConstVar_1 = getConst(line);
                            if (ConstVar_1) {
                                content.addVar(ConstVar_1);
                            }
                        }
                        else if (key == "#extension") {
                            var extension = getExtension(line);
                            if (extension) {
                                content.addVar(extension);
                            }
                        }
                        else if (key == "#define") {
                            var def = getDefine(line);
                            if (def) {
                                content.addVar(def);
                            }
                        }
                        else {
                            content.addVar(getTemper(line));
                        }
                    }
                    continue;
                }
            }
            return content;
        }
        function parseContent(file) {
            var shaderList = [];
            var node = "";
            var endChar = ";";
            var index = -1;
            for (var i = 0; i < file.length; ++i) {
                if (file.charAt(i) == "{") {
                    index = node.indexOf("=");
                    if (index < 0) {
                        endChar = "}";
                    }
                }
                if (node == "") {
                    if (file.charAt(i) == " " || file.charAt(i) == "    " || file.charAt(i) == "\t") {
                        continue;
                    }
                }
                node += file.charAt(i);
                if (endChar != "\n") {
                    if (node.indexOf("#extension") >= 0) {
                        endChar = "\n";
                    }
                    else if (node.indexOf("#define") >= 0) {
                        endChar = "\n";
                    }
                }
                if (endChar == file.charAt(i)) {
                    if (endChar == "}") {
                        var s_num = 0;
                        var e_num = 0;
                        for (var j = 0; j < node.length; ++j) {
                            if (node.charAt(j) == "{") {
                                s_num++;
                            }
                            else if (node.charAt(j) == "}") {
                                e_num++;
                            }
                        }
                        if (s_num != e_num) {
                            continue;
                        }
                        if (node.indexOf("struct") >= 0) {
                            endChar = ";";
                            continue;
                        }
                    }
                    if (node.length > 0) {
                        shaderList.push(node);
                    }
                    node = "";
                    endChar = ";";
                }
            }
            return shaderList;
        }
        function getLineType(line) {
            var index = line.indexOf("{");
            if (index > 0) {
                var firstStr = line.substr(0, index);
                if (firstStr.indexOf("struct") >= 0) {
                    var s_pos = firstStr.lastIndexOf(" ");
                    s_pos++;
                    var structName = firstStr.substr(s_pos, firstStr.length - s_pos);
                    return "struct " + structName;
                }
                if (firstStr.indexOf("=") < 0) {
                    var pos = line.indexOf("(");
                    var s_pos = line.lastIndexOf(" ", pos);
                    s_pos++;
                    var func = line.substr(s_pos, pos - s_pos);
                    return "function " + func;
                }
            }
            return "unknown";
        }
        function processStruct(name, structStr, content) {
            var pos = structStr.lastIndexOf("}");
            pos++;
            var end = structStr.lastIndexOf(";");
            var varName = structStr.substr(pos, end - pos);
            var varList = parseLines(varName);
            for (var i = 0; i < varList.length; ++i) {
                var varTmp = getTemper(name + " " + varList[i] + ";");
                if (varTmp) {
                    content.addVar(varTmp);
                }
            }
        }
        function parseLines(line) {
            var list = [];
            var value = "";
            var isEnd = false;
            for (var i = 0; i < line.length; ++i) {
                if (isEnd) {
                    if (line.charAt(i) == ";") {
                        isEnd = false;
                        if (value.length > 0) {
                            list.push(value);
                            value = "";
                        }
                        break;
                    }
                    value += line.charAt(i);
                    continue;
                }
                if (line.charAt(i) != " " && line.charAt(i) != "\t" && line.charAt(i) != "," && line.charAt(i) != "\r" && line.charAt(i) != "\n" && line.charAt(i) != ":") {
                    if (line.charAt(i) == ";") {
                        if (value.length > 0) {
                            list.push(value);
                            value = "";
                        }
                        break;
                    }
                    else if (line.charAt(i) == "=") {
                        if (value.length > 0) {
                            list.push(value);
                            value = "";
                        }
                        list.push("=");
                        isEnd = true;
                        continue;
                    }
                    value += line.charAt(i);
                    if (i == line.length - 1 && line != "") {
                        list.push(value);
                        value = "";
                    }
                }
                else {
                    if (value != "") {
                        list.push(value);
                        value = "";
                    }
                }
            }
            return list;
        }
        function hasString(fields, str) {
            for (var i = 0; i < fields.length; ++i) {
                if (fields[i] == str) {
                    return i;
                }
            }
            return -1;
        }
        function replaceCharacter(src, searchValue, replaceValue) {
            var ret = src;
            var isBreak = false;
            while (!isBreak) {
                isBreak = true;
                for (var i = 0; i < searchValue.length; ++i) {
                    if (ret.indexOf(searchValue[i]) >= 0) {
                        isBreak = false;
                        break;
                    }
                }
                for (var i = 0; i < searchValue.length; ++i) {
                    ret = ret.replace(searchValue[i], replaceValue);
                }
            }
            return ret;
        }
        function getVarKey(fields) {
            var index = hasString(fields, "=");
            if (index >= 0) {
                index -= 3;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            else {
                index = fields.length - 3;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
                else {
                    return fields[0];
                }
            }
            return "";
        }
        function getVarType(fields) {
            var index = hasString(fields, "=");
            if (index >= 0) {
                index -= 2;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            else {
                index = fields.length - 2;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            return "";
        }
        function getVarName(fields) {
            var index = hasString(fields, "=");
            if (index >= 0) {
                index -= 1;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            else {
                index = fields.length - 1;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            return "";
        }
        function getVarValue(fields) {
            var index = hasString(fields, "=");
            if (index >= 0) {
                index += 1;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            return "";
        }
        function getSampler2D(shaderLine) {
            var tempStr = shaderLine;
            var sampler2DName;
            var sampler2D;
            var tempArray = parseLines(tempStr);
            sampler2DName = getVarName(tempArray);
            sampler2D = new dou3d.Sampler2D(sampler2DName);
            return sampler2D;
        }
        function getSampler3D(shaderLine) {
            var tempStr = shaderLine;
            var sampler3DName;
            var sampler3D;
            var tempArray = parseLines(tempStr);
            sampler3DName = getVarName(tempArray);
            sampler3D = new dou3d.Sampler3D(sampler3DName);
            return sampler3D;
        }
        function getAttribute(shaderLine) {
            var tempStr = shaderLine;
            var tmpName;
            var valueType;
            var attribute;
            var tempArray = parseLines(tempStr);
            tmpName = getVarName(tempArray);
            valueType = getVarType(tempArray);
            attribute = new dou3d.Attribute(tmpName, valueType);
            attribute.value = getVarValue(tempArray);
            return attribute;
        }
        function getVarying(shaderLine) {
            var tempStr = shaderLine;
            var varyingName;
            var valueType;
            var varying;
            var tempArray = parseLines(tempStr);
            varyingName = getVarName(tempArray);
            valueType = getVarType(tempArray);
            varying = new dou3d.Varying(varyingName, valueType);
            return varying;
        }
        function getUniform(shaderLine) {
            var tempStr = shaderLine;
            var uniformName;
            var valueType;
            var uniform;
            var tempArray = parseLines(tempStr);
            uniformName = getVarName(tempArray);
            valueType = getVarType(tempArray);
            uniform = new dou3d.Uniform(uniformName, valueType);
            return uniform;
        }
        function getConst(shaderLine) {
            var tempStr = shaderLine;
            var constVarName;
            var valueType;
            var varValue;
            var constVar;
            var tempArray = parseLines(tempStr);
            constVarName = getVarName(tempArray);
            valueType = getVarType(tempArray);
            varValue = getVarValue(tempArray);
            constVar = new dou3d.ConstVar(constVarName, valueType, varValue);
            return constVar;
        }
        function getExtension(shaderLine) {
            var start = shaderLine.indexOf("#");
            var end = shaderLine.indexOf(" ");
            var type = shaderLine.substr(start, end);
            var namePosEnd = shaderLine.indexOf(":");
            var name = shaderLine.substr(end, namePosEnd - end);
            name = replaceCharacter(name, [" "], "");
            namePosEnd += 1;
            var value = shaderLine.substr(namePosEnd, shaderLine.length - namePosEnd);
            value = replaceCharacter(value, [" ", ":", "\n", "\r"], "");
            var extension = new dou3d.Extension(name);
            extension.value = value;
            return extension;
        }
        function getDefine(shaderLine) {
            var tempStr = shaderLine;
            var name = "";
            var value = "";
            var tmpVar;
            var tempArray = parseLines(tempStr);
            name = tempArray[1];
            if (tempArray.length >= 3) {
                value = tempArray[2];
            }
            tmpVar = new dou3d.DefineVar(name, value);
            return tmpVar;
        }
        function getTemper(shaderLine) {
            var tempStr = shaderLine;
            var tmpName;
            var valueType;
            var tmpVar;
            var tempArray = parseLines(tempStr);
            tmpName = getVarName(tempArray);
            valueType = getVarType(tempArray);
            tmpVar = new dou3d.TmpVar(tmpName, valueType);
            tmpVar.value = getVarValue(tempArray);
            return tmpVar;
        }
        /**
         * 返回组合着色器后的内容
         */
        function fillShaderContent(shaderComposer, shaderNameList, usage) {
            var shaderContent;
            var i = 0;
            var varName = "";
            for (i = 0; i < shaderNameList.length; ++i) {
                if (varName != "") {
                    varName += "/";
                }
                varName += shaderNameList[i];
            }
            varName += "/d" + usage.maxDirectLight;
            varName += "/s" + usage.maxSpotLight;
            varName += "/p" + usage.maxPointLight;
            varName += "/b" + usage.maxBone;
            if (!_shaderContentDict[varName]) {
                shaderContent = new dou3d.ShaderContent();
                shaderContent.name = varName;
                for (i = 0; i < shaderNameList.length; ++i) {
                    var tempContent = _shaderContentDict[shaderNameList[i]];
                    shaderContent.addContent(tempContent);
                }
            }
            else {
                shaderContent = _shaderContentDict[varName].clone();
            }
            for (i = 0; i < shaderContent.attributeList.length; i++) {
                varName = shaderContent.attributeList[i].varName;
                usage[varName] = shaderContent.attributeList[i];
            }
            for (i = 0; i < shaderContent.varyingList.length; i++) {
                varName = shaderContent.varyingList[i].varName;
                if (!usage[varName]) {
                    usage[varName] = shaderContent.varyingList[i];
                }
            }
            for (i = 0; i < shaderContent.tempList.length; i++) {
                varName = shaderContent.tempList[i].varName;
                usage[varName] = shaderContent.tempList[i];
            }
            for (i = 0; i < shaderContent.uniformList.length; i++) {
                varName = shaderContent.uniformList[i].varName;
                usage[varName] = shaderContent.uniformList[i];
            }
            var constR;
            for (i = 0; i < shaderContent.constList.length; i++) {
                varName = shaderContent.constList[i].varName;
                constR = shaderContent.constList[i];
                usage[varName] = constR;
                switch (varName) {
                    case "max_directLight":
                        constR.value = usage.maxDirectLight;
                        break;
                    case "max_pointLight":
                        constR.value = usage.maxPointLight;
                        break;
                    case "max_spotLight":
                        constR.value = usage.maxSpotLight;
                        break;
                    case "bonesNumber":
                        constR.value = usage.maxBone;
                        break;
                }
            }
            for (i = 0; i < shaderContent.sampler2DList.length; i++) {
                var sampler2D = shaderContent.sampler2DList[i];
                sampler2D.activeTextureIndex = getTexture2DIndex(i);
                sampler2D.index = i;
                usage.sampler2DList.push(sampler2D);
            }
            for (i = 0; i < shaderContent.sampler3DList.length; i++) {
                var sampler3D = shaderContent.sampler3DList[i];
                sampler3D.activeTextureIndex = getTexture2DIndex(shaderContent.sampler2DList.length + i);
                sampler3D.index = shaderContent.sampler2DList.length + i;
                usage.sampler3DList.push(sampler3D);
            }
            synthesisShader(shaderContent, shaderComposer);
            return dou3d.ShaderPool.getGPUShader(shaderComposer.shaderType, shaderContent.name, shaderContent.source);
        }
        ShaderUtil.fillShaderContent = fillShaderContent;
        function synthesisShader(content, shaderComposer) {
            var i;
            var source = "";
            for (i = 0; i < content.extensionList.length; i++) {
                source += connectExtension(content.extensionList[i]);
            }
            source += "precision highp float;\n";
            for (i = 0; i < content.defineList.length; i++) {
                source += connectDefine(content.defineList[i]);
            }
            for (i = 0; i < content.attributeList.length; i++) {
                source += connectAtt(content.attributeList[i]);
            }
            for (i = 0; i < content.structNames.length; i++) {
                source += connectStruct(content.structDict[content.structNames[i]]);
            }
            for (i = 0; i < content.varyingList.length; i++) {
                source += connectVarying(content.varyingList[i]);
            }
            for (i = 0; i < content.tempList.length; i++) {
                source += connectTemp(content.tempList[i]);
            }
            for (i = 0; i < content.constList.length; i++) {
                source += connectConst(content.constList[i]);
            }
            for (i = 0; i < content.uniformList.length; i++) {
                source += connectUniform(content.uniformList[i]);
            }
            for (i = 0; i < content.sampler2DList.length; i++) {
                var sampler2D = content.sampler2DList[i];
                source += connectSampler(sampler2D);
            }
            for (i = 0; i < content.sampler3DList.length; i++) {
                var sampler3D = content.sampler3DList[i];
                source += connectSampler3D(sampler3D);
            }
            for (i = 0; i < content.funcNames.length; i++) {
                source += content.funcDict[content.funcNames[i]];
            }
            content.source = source;
        }
        function connectAtt(att) {
            return "attribute " + att.valueType + " " + att.name + "; \r\n";
        }
        function connectTemp(tempVar) {
            if (tempVar.value) {
                return tempVar.valueType + " " + tempVar.name + " = " + tempVar.value + "; \r\n";
            }
            return tempVar.valueType + " " + tempVar.name + "; \r\n";
        }
        function connectStruct(struct) {
            return struct + " \r\n";
        }
        function connectConst(constVar) {
            return "const " + constVar.valueType + " " + constVar.name + " = " + constVar.value + "; \r\n";
        }
        function connectVarying(varying) {
            return "varying " + varying.valueType + " " + varying.name + "; \r\n";
        }
        function connectUniform(unifrom) {
            return "uniform " + unifrom.valueType + " " + unifrom.name + "; \r\n";
        }
        function connectSampler(sampler) {
            return "uniform sampler2D " + sampler.name + "; \r\n";
        }
        function connectSampler3D(sampler) {
            return "uniform samplerCube " + sampler.name + "; \r\n";
        }
        function connectExtension(extension) {
            return "#extension " + extension.name + ":" + extension.value + "\r\n";
        }
        function connectDefine(def) {
            return def.key + " " + def.name + " " + def.value + "\r\n";
        }
        function getTexture2DIndex(i) {
            switch (i) {
                case 0:
                    return dou3d.Context3DProxy.gl.TEXTURE0;
                case 1:
                    return dou3d.Context3DProxy.gl.TEXTURE1;
                case 2:
                    return dou3d.Context3DProxy.gl.TEXTURE2;
                case 3:
                    return dou3d.Context3DProxy.gl.TEXTURE3;
                case 4:
                    return dou3d.Context3DProxy.gl.TEXTURE4;
                case 5:
                    return dou3d.Context3DProxy.gl.TEXTURE5;
                case 6:
                    return dou3d.Context3DProxy.gl.TEXTURE6;
                case 7:
                    return dou3d.Context3DProxy.gl.TEXTURE7;
                case 8:
                    return dou3d.Context3DProxy.gl.TEXTURE8;
            }
            throw new Error("texture not big then 8");
        }
    })(ShaderUtil = dou3d.ShaderUtil || (dou3d.ShaderUtil = {}));
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 实时阴影渲染, 生成阴影贴图
     * * 基于 shadow mapping 的阴影算法, 当前阴影只支持方向光
     * * 当渲染阴影的物体超出阴影摄像机的范围阴影将不会渲染阴影
     * @author wizardc
     */
    var ShadowCast = /** @class */ (function () {
        function ShadowCast() {
            this._enableShadow = false;
            this._textureWidth = 1024 * 4;
            this._textureHeight = 1024 * 4;
            this._shadowCamera = new dou3d.Camera3D(1 /* orthogonal */);
            this._shadowCamera.near = 1;
            this._shadowCamera.far = 3000;
            this._shadowCamera.updateViewport(0, 0, this._textureWidth, this._textureHeight);
            this._shadowRender = new dou3d.MultiRenderer(1 /* shadowPass */);
            this._shadowRender.setRenderToTexture(this._textureWidth, this._textureHeight, 3 /* UNSIGNED_BYTE_RGBA */);
        }
        Object.defineProperty(ShadowCast, "instance", {
            get: function () {
                return ShadowCast._instance || (ShadowCast._instance = new ShadowCast());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowCast.prototype, "enableShadow", {
            get: function () {
                return this._enableShadow;
            },
            set: function (value) {
                this._enableShadow = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowCast.prototype, "textureWidth", {
            /**
             * 阴影贴图的宽
             */
            get: function () {
                return this._textureWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowCast.prototype, "textureHeight", {
            /**
             * 阴影贴图的高
             */
            get: function () {
                return this._textureHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowCast.prototype, "shadowCamera", {
            /**
             * 渲染阴影的摄像机
             */
            get: function () {
                return this._shadowCamera;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShadowCast.prototype, "shadowRender", {
            /**
             * 阴影渲染器
             */
            get: function () {
                return this._shadowRender;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置阴影贴图的宽度和高度
         */
        ShadowCast.prototype.setTextureSize = function (width, height) {
            this._textureWidth = width;
            this._textureHeight = height;
            this._shadowRender.setRenderToTexture(this._textureWidth, this._textureHeight, 3 /* UNSIGNED_BYTE_RGBA */);
        };
        ShadowCast.prototype.update = function (entityCollect, camera, time, delay, viewPort) {
            dou3d.Engine.context3DProxy.clearColor(1.0, 1.0, 1.0, 1.0);
            dou3d.Engine.context3DProxy.clear(dou3d.Context3DProxy.gl.COLOR_BUFFER_BIT | dou3d.Context3DProxy.gl.DEPTH_BUFFER_BIT);
            this._shadowCamera.validateTransformNow();
            this._shadowRender.draw(time, delay, dou3d.Engine.context3DProxy, entityCollect, this._shadowCamera, viewPort);
        };
        return ShadowCast;
    }());
    dou3d.ShadowCast = ShadowCast;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 贴图基类
     * @author wizardc
     */
    var TextureBase = /** @class */ (function (_super) {
        __extends(TextureBase, _super);
        function TextureBase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 贴图是否使用 mipmap
             * mipmap 为一个贴图的 LOD 层级贴图, 例如 ( 1024 * 1024 的贴图, 往下就会自动生成 512 * 512, 256 * 256, 128 * 128, 64 * 64, 32 * 32, 16 * 16, 8 * 8, 4 * 4, 2 * 2, 1 * 1 )
             */
            _this.useMipmap = true;
            /**
             * 是否平滑差值
             */
            _this.smooth = true;
            /**
             * 贴图采样方式
             */
            _this.repeat = false;
            /**
             * 是否有 Mipmap
             */
            _this.hasMipmap = false;
            _this._ready = false;
            return _this;
        }
        /**
         * 从大图集中的某一区域进行拷贝
         */
        TextureBase.prototype.copyFromTexture = function (texture, x, y, width, height) {
            this.parentTexture = texture;
            texture.width = width;
            texture.height = height;
            this.texture2D = texture.texture2D;
            this.uvRectangle = this.uvRectangle || new dou3d.Rectangle();
            this.uvRectangle.x = x;
            this.uvRectangle.y = y;
            this.uvRectangle.w = width;
            this.uvRectangle.h = height;
        };
        TextureBase.prototype.activeState = function (context3D) {
            if (this._ready) {
                return;
            }
            this._ready = true;
            if (!this.premultiplyAlpha) {
                dou3d.Context3DProxy.gl.pixelStorei(dou3d.Context3DProxy.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
            }
            if (this.useMipmap && !this.hasMipmap) {
                dou3d.Context3DProxy.gl.generateMipmap(dou3d.Context3DProxy.gl.TEXTURE_2D);
                this.hasMipmap = true;
            }
            if (this.smooth) {
                if (this.hasMipmap) {
                    context3D.texParameteri(dou3d.Context3DProxy.gl.TEXTURE_2D, dou3d.Context3DProxy.gl.TEXTURE_MIN_FILTER, dou3d.Context3DProxy.gl.LINEAR_MIPMAP_LINEAR);
                    context3D.texParameteri(dou3d.Context3DProxy.gl.TEXTURE_2D, dou3d.Context3DProxy.gl.TEXTURE_MAG_FILTER, dou3d.Context3DProxy.gl.LINEAR);
                }
                else {
                    context3D.texParameteri(dou3d.Context3DProxy.gl.TEXTURE_2D, dou3d.Context3DProxy.gl.TEXTURE_MIN_FILTER, dou3d.Context3DProxy.gl.LINEAR);
                    context3D.texParameteri(dou3d.Context3DProxy.gl.TEXTURE_2D, dou3d.Context3DProxy.gl.TEXTURE_MAG_FILTER, dou3d.Context3DProxy.gl.LINEAR);
                }
            }
            else {
                context3D.texParameteri(dou3d.Context3DProxy.gl.TEXTURE_2D, dou3d.Context3DProxy.gl.TEXTURE_MIN_FILTER, dou3d.Context3DProxy.gl.NEAREST);
                context3D.texParameteri(dou3d.Context3DProxy.gl.TEXTURE_2D, dou3d.Context3DProxy.gl.TEXTURE_MAG_FILTER, dou3d.Context3DProxy.gl.NEAREST);
            }
            if (this.repeat) {
                context3D.texParameteri(dou3d.Context3DProxy.gl.TEXTURE_2D, dou3d.Context3DProxy.gl.TEXTURE_WRAP_S, dou3d.Context3DProxy.gl.REPEAT);
                context3D.texParameteri(dou3d.Context3DProxy.gl.TEXTURE_2D, dou3d.Context3DProxy.gl.TEXTURE_WRAP_T, dou3d.Context3DProxy.gl.REPEAT);
            }
            else {
                context3D.texParameteri(dou3d.Context3DProxy.gl.TEXTURE_2D, dou3d.Context3DProxy.gl.TEXTURE_WRAP_S, dou3d.Context3DProxy.gl.CLAMP_TO_EDGE);
                context3D.texParameteri(dou3d.Context3DProxy.gl.TEXTURE_2D, dou3d.Context3DProxy.gl.TEXTURE_WRAP_T, dou3d.Context3DProxy.gl.CLAMP_TO_EDGE);
            }
            if (this.filp_y) {
                dou3d.Context3DProxy.gl.pixelStorei(dou3d.Context3DProxy.gl.UNPACK_FLIP_Y_WEBGL, this.filp_y);
            }
        };
        TextureBase.prototype.dispose = function () {
            if (this.texture2D) {
                this.texture2D.dispose();
            }
            this.texture2D = null;
            if (this.texture3D) {
                this.texture3D.dispose();
            }
            this.texture3D = null;
        };
        return TextureBase;
    }(dou.HashObject));
    dou3d.TextureBase = TextureBase;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 图片贴图对象
     * @author wizardc
     */
    var ImageTexture = /** @class */ (function (_super) {
        __extends(ImageTexture, _super);
        function ImageTexture(img) {
            var _this = _super.call(this) || this;
            _this._imageData = img;
            _this.texture2D = new dou3d.ContextTexture2D();
            _this.texture2D.imageData = img;
            return _this;
        }
        Object.defineProperty(ImageTexture.prototype, "width", {
            get: function () {
                return this._imageData.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageTexture.prototype, "height", {
            get: function () {
                return this._imageData.height;
            },
            enumerable: true,
            configurable: true
        });
        ImageTexture.prototype.upload = function (context3D) {
            if (!this.texture2D.texture) {
                this.texture2D.texture = context3D.createTexture();
                this.texture2D.internalFormat = 0 /* imageData */;
                this.texture2D.imageData = this._imageData;
                this.texture2D.dataFormat = dou3d.Context3DProxy.gl.UNSIGNED_BYTE;
                this.texture2D.colorFormat = dou3d.Context3DProxy.gl.RGBA;
                context3D.upLoadTextureData(0, this);
            }
        };
        ImageTexture.prototype.uploadForcing = function (context3D) {
            context3D.upLoadTextureData(0, this);
        };
        return ImageTexture;
    }(dou3d.TextureBase));
    dou3d.ImageTexture = ImageTexture;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 贴图对象
     * @author wizardc
     */
    var Texture = /** @class */ (function (_super) {
        __extends(Texture, _super);
        function Texture() {
            var _this = _super.call(this) || this;
            _this.smooth = true;
            _this.texture2D = new dou3d.ContextTexture2D();
            return _this;
        }
        Texture.prototype.upload = function (context3D) {
            if (!this.texture2D.texture) {
                this.texture2D.texture = this.texture2D.texture || context3D.createTexture();
                this.texture2D.internalFormat = this.internalFormat;
                this.texture2D.colorFormat = this.colorFormat;
                this.texture2D.mimapData = this.mimapData;
                this.texture2D.dataFormat = dou3d.Context3DProxy.gl.UNSIGNED_BYTE;
                if (this.mimapData && this.mimapData.length > 0) {
                    for (var i = 0; i < this.mimapData.length; i++) {
                        context3D.upLoadTextureData(i, this);
                    }
                }
                else {
                    context3D.upLoadTextureData(0, this);
                }
                if (this.parentTexture) {
                    if (!this.parentTexture.texture2D) {
                        this.parentTexture.upload(context3D);
                    }
                    this.texture2D = this.parentTexture.texture2D;
                    this.texture2D.internalFormat = this.parentTexture.internalFormat;
                    this.texture2D.colorFormat = this.parentTexture.colorFormat;
                    this.texture2D.mimapData = this.parentTexture.mimapData;
                }
            }
        };
        Texture.prototype.uploadForcing = function (context3D) {
            context3D.upLoadTextureData(0, this);
        };
        return Texture;
    }(dou3d.TextureBase));
    dou3d.Texture = Texture;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 立方体贴图对象
     * @author wizardc
     */
    var CubeTexture = /** @class */ (function (_super) {
        __extends(CubeTexture, _super);
        function CubeTexture(image_front, image_back, image_left, image_right, image_up, image_down) {
            var _this = _super.call(this) || this;
            _this.image_front = image_front;
            _this.image_back = image_back;
            _this.image_left = image_left;
            _this.image_right = image_right;
            _this.image_up = image_up;
            _this.image_down = image_down;
            _this.texture3D = new dou3d.ContextTexture3D();
            return _this;
        }
        CubeTexture.prototype.upload = function (context3D) {
            if (!this.image_front || !this.image_back || !this.image_left || !this.image_right || !this.image_up || !this.image_down) {
                return;
            }
            if (!this.texture3D.texture) {
                this.texture3D.texture = this.texture3D.texture || context3D.createTexture();
                this.texture3D.border = 0;
                this.texture3D.image_front = this.image_front;
                this.texture3D.image_back = this.image_back;
                this.texture3D.image_left = this.image_left;
                this.texture3D.image_right = this.image_right;
                this.texture3D.image_up = this.image_up;
                this.texture3D.image_down = this.image_down;
                context3D.uploadCubetexture(this.texture3D);
            }
        };
        CubeTexture.prototype.uploadForcing = function (context3D) {
        };
        return CubeTexture;
    }(dou3d.TextureBase));
    dou3d.CubeTexture = CubeTexture;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 可以渲染的贴图对象
     * @author wizardc
     */
    var RenderTexture = /** @class */ (function (_super) {
        __extends(RenderTexture, _super);
        function RenderTexture(width, height, frameBufferFormat) {
            if (width === void 0) { width = 512; }
            if (height === void 0) { height = 512; }
            if (frameBufferFormat === void 0) { frameBufferFormat = 2 /* UNSIGNED_BYTE_RGB */; }
            var _this = _super.call(this) || this;
            _this.useMipmap = false;
            _this.smooth = false;
            _this.width = width;
            _this.height = height;
            _this.frameBufferFormat = frameBufferFormat;
            _this.uvRectangle = new dou3d.Rectangle(0, 0, 1, 1);
            return _this;
        }
        RenderTexture.prototype.upload = function (context3D) {
            if (!this.texture2D) {
                this.texture2D = context3D.createFramebuffer(this.width, this.height, this.frameBufferFormat);
            }
        };
        RenderTexture.prototype.uploadForcing = function (context3D) {
        };
        return RenderTexture;
    }(dou3d.TextureBase));
    dou3d.RenderTexture = RenderTexture;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 棋盘格纹理为黑白间隔色块组成的一张纹理, 主要用于判别模型UV的正确性, 若某模型UV值不正确, 其纹理表现必定乱序不规整
     * @author wizardc
     */
    var CheckerboardTexture = /** @class */ (function (_super) {
        __extends(CheckerboardTexture, _super);
        function CheckerboardTexture(width, height) {
            if (width === void 0) { width = 32; }
            if (height === void 0) { height = 32; }
            var _this = _super.call(this) || this;
            _this.width = width;
            _this.height = height;
            _this.uvRectangle = new dou3d.Rectangle(0, 0, 1, 1);
            _this.buildCheckerboard();
            _this.texture2D = new dou3d.ContextTexture2D();
            return _this;
        }
        CheckerboardTexture.prototype.buildCheckerboard = function () {
            if (!this._pixelArray) {
                this._pixelArray = new Uint8Array(this.width * this.height * 4);
                var colors = [dou3d.Color.WHITE, dou3d.Color.BLACK];
                var colorIndex = 0;
                var blockSize = 4;
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        if ((x % blockSize) == 0) {
                            colorIndex = (colorIndex + 1) % 2;
                        }
                        if ((y % blockSize) == 0 && x == 0) {
                            var tmp = colors[0];
                            colors[0] = colors[1];
                            colors[1] = tmp;
                            colorIndex = 0;
                        }
                        this._pixelArray[(y * (this.width * 4) + x * 4) + 0] = colors[colorIndex].r * 255;
                        this._pixelArray[(y * (this.width * 4) + x * 4) + 1] = colors[colorIndex].g * 255;
                        this._pixelArray[(y * (this.width * 4) + x * 4) + 2] = colors[colorIndex].b * 255;
                        this._pixelArray[(y * (this.width * 4) + x * 4) + 3] = colors[colorIndex].a * 255;
                    }
                }
            }
        };
        CheckerboardTexture.prototype.upload = function (context3D) {
            if (!this.texture2D.texture) {
                this.texture2D.texture = this.texture2D.texture || context3D.createTexture();
                this.texture2D.border = 0;
                this.texture2D.internalFormat = 2 /* pixelArray */;
                this.texture2D.dataFormat = dou3d.Context3DProxy.gl.UNSIGNED_BYTE;
                this.texture2D.colorFormat = dou3d.Context3DProxy.gl.RGBA;
                this.texture2D.mimapData = [];
                this.texture2D.mimapData.push(new dou3d.MipmapData(this._pixelArray, this.width, this.height));
                this.texture2D.width = this.width;
                this.texture2D.height = this.height;
                this.useMipmap = false;
                context3D.upLoadTextureData(0, this);
            }
        };
        CheckerboardTexture.prototype.uploadForcing = function (context3D) {
            context3D.upLoadTextureData(0, this);
        };
        CheckerboardTexture.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._pixelArray = null;
        };
        /**
        * 公用棋盘格实例对象
        */
        CheckerboardTexture.texture = new CheckerboardTexture();
        return CheckerboardTexture;
    }(dou3d.TextureBase));
    dou3d.CheckerboardTexture = CheckerboardTexture;
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 数学运算工具类
     * @author wizardc
     */
    var MathUtil;
    (function (MathUtil) {
        MathUtil.PI_HALF = Math.PI * 0.5;
        MathUtil.PI_QUARTER = Math.PI * 0.25;
        MathUtil.PI_DOUBLE = Math.PI * 2;
        /**
         * 弧度制到角度制相乘的系数
         */
        MathUtil.RAD_DEG = 180 / Math.PI;
        /**
         * 角度制到弧度制相乘的系数
         */
        MathUtil.DEG_RAD = Math.PI / 180;
        /**
         * 大于零的最小正值
         * @since https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
         */
        MathUtil.EPSILON = 2.2204460492503130808472633361816E-16;
        /**
         * 根号 2
         */
        MathUtil.SQRT_2 = 1.4142135623731;
        /**
         * 根号 2 的一半
         */
        MathUtil.SQRT1_2 = MathUtil.SQRT_2 * 0.5;
        MathUtil.INT_MAX = 0x7fffffff;
        MathUtil.INT_MIN = -0x7fffffff;
        /**
         * 把指定的数限制在指定的区间内
         */
        function clamp(v, min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 1; }
            if (v < min) {
                return min;
            }
            if (v > max) {
                return max;
            }
            return v;
        }
        MathUtil.clamp = clamp;
        /**
         * 线性插值
         */
        function lerp(from, to, t) {
            return from + (to - from) * t;
        }
        MathUtil.lerp = lerp;
        /**
         * 转换为弧度
         */
        function toRadians(degrees) {
            return degrees * Math.PI / 180;
        }
        MathUtil.toRadians = toRadians;
        /**
         * 转换为角度
         */
        function toDegrees(radians) {
            return radians * 180 / Math.PI;
        }
        MathUtil.toDegrees = toDegrees;
    })(MathUtil = dou3d.MathUtil || (dou3d.MathUtil = {}));
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 几何体工具类
     * @author wizardc
     */
    var GeometryUtil;
    (function (GeometryUtil) {
        function fromVertexFormatToLength(vf) {
            var length = 0;
            if (vf & 1 /* VF_POSITION */) {
                length += dou3d.Geometry.positionSize;
            }
            if (vf & 2 /* VF_NORMAL */) {
                length += dou3d.Geometry.normalSize;
            }
            if (vf & 4 /* VF_TANGENT */) {
                length += dou3d.Geometry.tangentSize;
            }
            if (vf & 8 /* VF_COLOR */) {
                length += dou3d.Geometry.colorSize;
            }
            if (vf & 16 /* VF_UV0 */) {
                length += dou3d.Geometry.uvSize;
            }
            if (vf & 32 /* VF_UV1 */) {
                length += dou3d.Geometry.uv2Size;
            }
            if (vf & 64 /* VF_SKIN */) {
                length += dou3d.Geometry.skinSize;
            }
            return length;
        }
        GeometryUtil.fromVertexFormatToLength = fromVertexFormatToLength;
    })(GeometryUtil = dou3d.GeometryUtil || (dou3d.GeometryUtil = {}));
})(dou3d || (dou3d = {}));
var dou3d;
(function (dou3d) {
    /**
     * 引擎类, 用来启动 3D 引擎
     * - 本引擎采用左手坐标系
     * - 可以添加多个 View3D 对象来进行 3D 场景的渲染
     * @author wizardc
     */
    var Engine = /** @class */ (function () {
        /**
         * @param canvas 用户呈现 3D 图像的 Canvas 元素, 为空则会创建一个全屏的元素
         */
        function Engine(canvas) {
            var _this = this;
            if (!canvas) {
                canvas = document.createElement("canvas");
                canvas.style.position = "fixed";
                canvas.style.left = "0px";
                canvas.style.top = "0px";
                canvas.style.width = "100%";
                canvas.style.height = "100%";
                document.body.appendChild(canvas);
            }
            this._canvas = dou3d.canvas = canvas;
            var gl = (canvas.getContext("experimental-webgl") || canvas.getContext("webgl"));
            if (!gl) {
                console.error("You drivers not suport WEBGL!");
                return;
            }
            dou3d.Context3DProxy.gl = gl;
            window.addEventListener("mousedown", function (event) {
                _this.onTouchEvent("mousedown", event);
            });
            window.addEventListener("mousemove", function (event) {
                _this.onTouchEvent("mousemove", event);
            });
            window.addEventListener("mouseup", function (event) {
                _this.onTouchEvent("mouseup", event);
            });
            window.addEventListener("touchstart", function (event) {
                _this.onTouchEvent("touchstart", event);
            });
            window.addEventListener("touchmove", function (event) {
                _this.onTouchEvent("touchmove", event);
            });
            window.addEventListener("touchend", function (event) {
                _this.onTouchEvent("touchend", event);
            });
            window.addEventListener("touchcancel", function (event) {
                _this.onTouchEvent("touchcancel", event);
            });
            window.addEventListener("resize", function () {
                setTimeout(function () {
                    for (var _i = 0, _a = _this._view3Ds; _i < _a.length; _i++) {
                        var view3D = _a[_i];
                        dou3d.Event3D.dispatch(view3D, dou3d.Event3D.RESIZE);
                    }
                }, 300);
            });
            this._viewRect = new dou3d.Rectangle();
            this._view3Ds = [];
            Engine.context3DProxy = new dou3d.Context3DProxy();
            Engine.context3DProxy.register();
            dou3d.ticker = new dou3d.Ticker(this);
            this.startTicker();
        }
        Object.defineProperty(Engine.prototype, "viewRect", {
            /**
             * 获取当前画布的可视区域
             */
            get: function () {
                var rect = this._canvas.getBoundingClientRect();
                this._viewRect.set(rect.left, rect.top, rect.width, rect.height);
                this._canvas.width = rect.width;
                this._canvas.height = rect.height;
                return this._viewRect;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "view3Ds", {
            /**
             * 获取所有的 3D 视图
             */
            get: function () {
                return this._view3Ds;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 添加一个 3D 视图
         */
        Engine.prototype.addView3D = function (view3D) {
            var index = this._view3Ds.indexOf(view3D);
            if (index == -1) {
                this._view3Ds.push(view3D);
            }
        };
        /**
         * 移除一个 3D 视图
         */
        Engine.prototype.removeView3D = function (view3D) {
            var index = this._view3Ds.indexOf(view3D);
            if (index != -1) {
                this._view3Ds.splice(index, 1);
            }
        };
        Engine.prototype.startTicker = function () {
            // 下面的兼容处理会导致部分 WebGL 工具不能正常运行, 所以先注释掉
            // let requestAnimationFrame = (<any>window).requestAnimationFrame ||
            //     (<any>window).webkitRequestAnimationFrame ||
            //     (<any>window).mozRequestAnimationFrame ||
            //     (<any>window).oRequestAnimationFrame ||
            //     (<any>window).msRequestAnimationFrame;
            // if (!requestAnimationFrame) {
            //     requestAnimationFrame = function (callback: Function) {
            //         return window.setTimeout(callback, 1000 / 60);
            //     };
            // }
            requestAnimationFrame(onTick);
            function onTick() {
                dou3d.ticker.update();
                requestAnimationFrame(onTick);
            }
        };
        Engine.prototype.onTouchEvent = function (type, event) {
            var eventType;
            var rect = this._canvas.getBoundingClientRect();
            var pos = dou.recyclable(dou3d.Vector2);
            if (event instanceof MouseEvent) {
                switch (type) {
                    case "mousedown":
                        eventType = dou3d.Event3D.TOUCH_BEGIN;
                        break;
                    case "mousemove":
                        eventType = dou3d.Event3D.TOUCH_MOVE;
                        break;
                    case "mouseup":
                        eventType = dou3d.Event3D.TOUCH_END;
                        break;
                }
                pos.set(event.clientX - rect.left, event.clientY - rect.top);
            }
            else {
                switch (type) {
                    case "touchstart":
                        eventType = dou3d.Event3D.TOUCH_BEGIN;
                        break;
                    case "touchmove":
                        eventType = dou3d.Event3D.TOUCH_MOVE;
                        break;
                    case "touchend":
                    case "touchcancel":
                        eventType = dou3d.Event3D.TOUCH_END;
                        break;
                }
                if (event.touches.length > 0) {
                    var touch = event.touches[0];
                    pos.set(touch.clientX - rect.left, touch.clientY - rect.top);
                }
            }
            for (var _i = 0, _a = this._view3Ds; _i < _a.length; _i++) {
                var view3D = _a[_i];
                dou3d.Event3D.dispatch(view3D, eventType, pos);
            }
            pos.recycle();
        };
        return Engine;
    }());
    dou3d.Engine = Engine;
})(dou3d || (dou3d = {}));
