namespace dou3d {
    /**
     * 渲染上下文
     * @author wizardc
     */
    export class Context3DProxy {
        /**
         * 渲染上下文
         */
        public static gl: WebGLRenderingContext;

        private _program: Program3D;
        private _sfactor: number;
        private _dfactor: number;
        private _cullingMode: number;
        private _depthTest: boolean;
        private _cullFace: boolean;
        // private _blend: boolean;
        private _depthCompareMode: number;

        public register(): void {
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
            ContextConfig.register(Context3DProxy.gl);
        }

        /**
         * 视口设置定义
         * 用来确定我们定义的视口在 canvas 中的所在位置
         */
        public viewPort(x: number, y: number, width: number, height: number): void {
            Context3DProxy.gl.viewport(x, y, width, height);
        }

        /**
         * 设置矩形裁切区域
         */
        public setScissorRectangle(x: number, y: number, width: number, height: number): void {
            Context3DProxy.gl.scissor(x, ContextConfig.canvasRectangle.h - height - y, width, height);
        }

        /**
         * 创建顶点着色器
         */
        public createVertexShader(source: string): Shader {
            let shader = Context3DProxy.gl.createShader(Context3DProxy.gl.VERTEX_SHADER);
            Context3DProxy.gl.shaderSource(shader, source);
            Context3DProxy.gl.compileShader(shader);
            return new Shader(shader);
        }

        /**
         * 创建片段着色器
         */
        public createFragmentShader(source: string): Shader {
            let shader = Context3DProxy.gl.createShader(Context3DProxy.gl.FRAGMENT_SHADER);
            Context3DProxy.gl.shaderSource(shader, source);
            Context3DProxy.gl.compileShader(shader);
            return new Shader(shader);
        }

        /**
         * 创建渲染程序
         */
        public createProgram(vertexShader: Shader, fragmentShader: Shader): Program3D {
            let shaderProgram = Context3DProxy.gl.createProgram();
            Context3DProxy.gl.attachShader(shaderProgram, vertexShader.shader);
            Context3DProxy.gl.attachShader(shaderProgram, fragmentShader.shader);
            Context3DProxy.gl.linkProgram(shaderProgram);
            let p = Context3DProxy.gl.getProgramParameter(shaderProgram, Context3DProxy.gl.LINK_STATUS);
            if (DEBUG && !p) {
                console.error("vsShader error" + Context3DProxy.gl.getShaderInfoLog(vertexShader.shader));
                console.error("fsShader error" + Context3DProxy.gl.getShaderInfoLog(fragmentShader.shader));
            }
            let program = new Program3D(shaderProgram);
            return program;
        }

        /**
         * 使用显卡着色器
         */
        public setProgram(program: Program3D): void {
            if (this._program == program) {
                return;
            }
            this._program = program;
            Context3DProxy.gl.useProgram(program.program);
        }

        /**
         * 创建顶点缓冲
         */
        public createVertexBuffer(vertexData: Float32Array, dawType: number = Context3DProxy.gl.STATIC_DRAW): VertexBuffer3D {
            let vertexBuffer = Context3DProxy.gl.createBuffer();
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ARRAY_BUFFER, vertexBuffer);
            Context3DProxy.gl.bufferData(Context3DProxy.gl.ARRAY_BUFFER, vertexData, dawType);
            return new VertexBuffer3D(vertexBuffer, vertexData);
        }

        /**
         * 上传顶点缓冲
         */
        public uploadVertexBuffer(vertexBuffer3D: VertexBuffer3D): void {
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ARRAY_BUFFER, vertexBuffer3D.buffer);
            Context3DProxy.gl.bufferData(Context3DProxy.gl.ARRAY_BUFFER, vertexBuffer3D.arrayBuffer, Context3DProxy.gl.DYNAMIC_DRAW);
        }

        /**
         * 创建索引缓冲
         */
        public createIndexBuffer(indexData: Int16Array): IndexBuffer3D {
            let indexBuffer = Context3DProxy.gl.createBuffer();
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            Context3DProxy.gl.bufferData(Context3DProxy.gl.ELEMENT_ARRAY_BUFFER, indexData, Context3DProxy.gl.STATIC_DRAW);
            return new IndexBuffer3D(indexBuffer, indexData);
        }

        /**
         * 上传索引缓冲
         */
        public uploadIndexBuffer(indexBuffer3D: IndexBuffer3D): void {
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ELEMENT_ARRAY_BUFFER, indexBuffer3D.buffer);
            Context3DProxy.gl.bufferData(Context3DProxy.gl.ELEMENT_ARRAY_BUFFER, indexBuffer3D.arrayBuffer, Context3DProxy.gl.DYNAMIC_DRAW);
        }

        /**
         * 获取矩阵变量 ID
         */
        public getUniformLocation(programe3D: Program3D, name: string): WebGLUniformLocation {
            return Context3DProxy.gl.getUniformLocation(programe3D.program, name);
        }

        /**
         * 传值给 shader 一个 float
         */
        public uniform1f(location: WebGLUniformLocation, x: number): void {
            Context3DProxy.gl.uniform1f(location, x);
        }

        /**
         * 传值给 shader 一个 vec3 (float, float, float)
         */
        public uniform1fv(location: WebGLUniformLocation, v: Float32List): void {
            Context3DProxy.gl.uniform1fv(location, v);
        }

        /**
         * 传值给 shader 一个 int
         */
        public uniform1i(location: WebGLUniformLocation, x: number): void {
            Context3DProxy.gl.uniform1i(location, x);
        }

        /**
         * 传值给 shader 一个 int 数组
         */
        public uniform1iv(location: WebGLUniformLocation, v: Int32List): void {
            Context3DProxy.gl.uniform1iv(location, v);
        }

        /**
         * 传值给 shader 两个 float
         */
        public uniform2f(location: WebGLUniformLocation, x: number, y: number): void {
            Context3DProxy.gl.uniform2f(location, x, y);
        }

        /**
         * 传值给 shader vec2 (float, float)
         */
        public uniform2fv(location: WebGLUniformLocation, v: Float32List): void {
            Context3DProxy.gl.uniform2fv(location, v);
        }

        /**
         * 传值给 shader 两个 int 值
         */
        public uniform2i(location: WebGLUniformLocation, x: number, y: number): void {
            Context3DProxy.gl.uniform2i(location, x, y);
        }

        /**
         * 传值给 shader vec2 (int, int)
         */
        public uniform2iv(location: WebGLUniformLocation, v: Int32List): void {
            Context3DProxy.gl.uniform2iv(location, v);
        }

        /**
         * 传值给 shader 3 个 float
         */
        public uniform3f(location: WebGLUniformLocation, x: number, y: number, z: number): void {
            Context3DProxy.gl.uniform3f(location, x, y, z);
        }

        /**
         * 传值给 shader vec3 (float, float, float)
         */
        public uniform3fv(location: WebGLUniformLocation, v: Float32List): void {
            Context3DProxy.gl.uniform3fv(location, v);
        }

        /**
         * 传值给 shader 3 个 int
         */
        public uniform3i(location: WebGLUniformLocation, x: number, y: number, z: number): void {
            Context3DProxy.gl.uniform3i(location, x, y, z);
        }

        /**
         * 传值给 shader vec3 (int, int, int)
         */
        public uniform3iv(location: WebGLUniformLocation, v: Int32List): void {
            Context3DProxy.gl.uniform3iv(location, v);
        }

        /**
         * 传值给 shader 4 个 float 值
         */
        public uniform4f(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): void {
            Context3DProxy.gl.uniform4f(location, x, y, z, w);
        }

        /**
         * 传值给 shader vec (float, float, float, float)
         */
        public uniform4fv(location: WebGLUniformLocation, v: Float32List): void {
            Context3DProxy.gl.uniform4fv(location, v);
        }

        /**
         * 传值给 shader 4 个 int 值
         */
        public uniform4i(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): void {
            Context3DProxy.gl.uniform4i(location, x, y, z, w);
        }

        /**
         * 传值给 shader vec4 (int, int, int, int)
         */
        public uniform4iv(location: WebGLUniformLocation, v: Int32List): void {
            Context3DProxy.gl.uniform4iv(location, v);
        }

        /**
         * 传值给 shader 2 * 2 矩阵
         * @param transpose 是否转置
         */
        public uniformMatrix2fv(location: WebGLUniformLocation, transpose: boolean, value: Float32List): void {
            Context3DProxy.gl.uniformMatrix2fv(location, transpose, value);
        }

        /**
         * 传值给 shader 3 * 3 矩阵
         * @param transpose 是否转置
         */
        public uniformMatrix3fv(location: WebGLUniformLocation, transpose: boolean, value: Float32List): void {
            Context3DProxy.gl.uniformMatrix3fv(location, transpose, value);
        }

        /**
         * 传值给 shader 4 * 4 矩阵
         * @param transpose 是否转置
         */
        public uniformMatrix4fv(location: WebGLUniformLocation, transpose: boolean, value: Float32List): void {
            Context3DProxy.gl.uniformMatrix4fv(location, transpose, value);
        }

        /**
         * 获取顶点着色器变量索引
         */
        public getShaderAttribLocation(programe: Program3D, attribName: string): number {
            return Context3DProxy.gl.getAttribLocation(programe.program, attribName);
        }

        /**
         * 设定所有的顶点属性都是非数组结构
         */
        public disableAllVertexAttribArray(): void {
            for (let j = 0; j < 8; j++) {
                Context3DProxy.gl.disableVertexAttribArray(j);
            }
        }

        /**
         * 指定顶点着色器变量索引及结构
         * @param index 变量索引
         * @param size  数据个数
         * @param dataType  数据类型
         * @param normalized 是否单位化
         * @param stride 字节数
         * @param offset 当前变量字节偏移
         */
        public vertexAttribPointer(index: number, size: number, dataType: number, normalized: boolean, stride: number, offset: number): void {
            Context3DProxy.gl.vertexAttribPointer(index, size, dataType, normalized, stride, offset);
            Context3DProxy.gl.enableVertexAttribArray(index);
        }

        /**
         * 实时传入显卡顶点着色器变量数组数据
         */
        public setVertexShaderConstData(floats: Float32Array, offest: number, numLen: number): void {
            Context3DProxy.gl.vertexAttrib4fv(offest, floats.subarray(offest, numLen));
        }

        /**
         * 绑定顶点 Buffer
         */
        public bindVertexBuffer(vertexBuffer: VertexBuffer3D): void {
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ARRAY_BUFFER, vertexBuffer.buffer);
        }

        /**
         * 绑定顶点索引 Buffer
         */
        public bindIndexBuffer(indexBuffer: IndexBuffer3D): void {
            Context3DProxy.gl.bindBuffer(Context3DProxy.gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        }

        /**
        * @language zh_CN
        * 创建 2维贴图 向显卡提交buffer申请 并创建Texture2D对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public createTexture(): WebGLTexture {
            return Context3DProxy.gl.createTexture();
        }

        /**
         * 设置2D纹理状态, 来确定贴图的采样方式
         * @param target gl.TEXTURE_2D, gl.TEXTURE_CUBE_MAP
         * @param pname 采用的纹理滤镜类型
         * @param param 对应该纹理滤镜的参数
         * @tutorial https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texParameter
         * @tutorial https://blog.csdn.net/puppet_master/article/details/53485919
         */
        public texParameteri(target: number, pname: number, param: number): void {
            Context3DProxy.gl.texParameteri(target, pname, param);
        }

        /**
         * 上传纹理
         */
        public upLoadTextureData(mipLevel: number, texture: TextureBase): void {
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_2D, texture.texture2D.texture);
            if (texture.texture2D.internalFormat == InternalFormat.imageData) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_2D, 0, Context3DProxy.gl.RGBA, Context3DProxy.gl.RGBA, texture.texture2D.dataFormat, texture.texture2D.imageData);
            }
            else if (texture.texture2D.internalFormat == InternalFormat.compressData) {
                this.upLoadCompressedTexture2D(mipLevel, texture.texture2D);
            }
            else if (texture.texture2D.internalFormat == InternalFormat.pixelArray) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_2D, mipLevel, texture.texture2D.colorFormat, texture.texture2D.mimapData[mipLevel].width, texture.texture2D.mimapData[mipLevel].height, texture.texture2D.border, texture.texture2D.colorFormat, texture.texture2D.dataFormat, texture.texture2D.mimapData[mipLevel].data);
            }
            if (texture.useMipmap) {
                Context3DProxy.gl.generateMipmap(Context3DProxy.gl.TEXTURE_2D);
            }
        }

        /**
         * 提交2D压缩纹理，用硬件来解析dds贴图
         */
        public upLoadCompressedTexture2D(mipLevel: number, texture: ContextTexture2D): void {
            Context3DProxy.gl.compressedTexImage2D(Context3DProxy.gl.TEXTURE_2D, mipLevel, texture.colorFormat, texture.mimapData[mipLevel].width, texture.mimapData[mipLevel].height, texture.border, texture.mimapData[mipLevel].data);
        }

        /**
         * 提交立方体纹理
         */
        public uploadCubetexture(tex: ContextTexture3D): void {
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_CUBE_MAP, tex.texture);
            if (tex.image_right.mimapData && tex.image_right.mimapData.length > 0) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, Context3DProxy.gl.RGB, tex.image_right.mimapData[0].width, tex.image_right.mimapData[0].height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_right.mimapData[0].data);
            }
            else {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_right.imageData);
            }
            if (tex.image_left.mimapData && tex.image_left.mimapData.length > 0) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, Context3DProxy.gl.RGB, tex.image_right.mimapData[0].width, tex.image_right.mimapData[0].height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_right.mimapData[0].data);
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
            if (tex.image_back.mimapData && tex.image_back.mimapData.length > 0) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, Context3DProxy.gl.RGB, tex.image_back.mimapData[0].width, tex.image_back.mimapData[0].height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_back.mimapData[0].data);
            }
            else {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_back.imageData);
            }
            if (tex.image_front.mimapData && tex.image_front.mimapData.length > 0) {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, Context3DProxy.gl.RGB, tex.image_front.mimapData[0].width, tex.image_front.mimapData[0].height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_front.mimapData[0].data);
            }
            else {
                Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, tex.image_front.imageData);
            }
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_CUBE_MAP, Context3DProxy.gl.TEXTURE_MAG_FILTER, Context3DProxy.gl.LINEAR);
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_CUBE_MAP, Context3DProxy.gl.TEXTURE_MIN_FILTER, Context3DProxy.gl.LINEAR);
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_CUBE_MAP, Context3DProxy.gl.TEXTURE_WRAP_S, Context3DProxy.gl.CLAMP_TO_EDGE);
            Context3DProxy.gl.texParameteri(Context3DProxy.gl.TEXTURE_CUBE_MAP, Context3DProxy.gl.TEXTURE_WRAP_T, Context3DProxy.gl.CLAMP_TO_EDGE);
        }

        /**
         * 
         * @param width 
         * @param height 
         * @param format 
         */
        public createFramebuffer(width: number, height: number, format: FrameBufferFormat): ContextTexture2D {
            let rttframeBuffer = Context3DProxy.gl.createFramebuffer();
            let texture2D = new ContextTexture2D();
            let depthRenderbuffer = Context3DProxy.gl.createRenderbuffer();
            texture2D.texture = texture2D.texture || Context3DProxy.gl.createTexture();
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_2D, texture2D.texture);
            switch (format) {
                case FrameBufferFormat.UNSIGNED_BYTE_RGB:
                    Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_2D, 0, Context3DProxy.gl.RGB, width, height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.UNSIGNED_BYTE, null);
                    break;
                case FrameBufferFormat.UNSIGNED_BYTE_RGBA:
                    Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_2D, 0, Context3DProxy.gl.RGBA, width, height, 0, Context3DProxy.gl.RGBA, Context3DProxy.gl.UNSIGNED_BYTE, null);
                    break;
                case FrameBufferFormat.FLOAT_RGB: {
                    let float = new Float32Array(width * height * 4);
                    for (let i = 0; i < width * height; i++) {
                        float[i] = Math.random();
                        float[i + 1] = Math.random();
                        float[i + 2] = Math.random();
                    }
                    Context3DProxy.gl.texImage2D(Context3DProxy.gl.TEXTURE_2D, 0, Context3DProxy.gl.RGB, width, height, 0, Context3DProxy.gl.RGB, Context3DProxy.gl.FLOAT, float);
                    break;
                }
                case FrameBufferFormat.FLOAT_RGBA: {
                    let float = new Float32Array(width * height * 4);
                    for (let i = 0; i < width * height; i++) {
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
        }

        /**
         * 设置渲染缓冲为贴图
         */
        public setRenderToTexture(texture: ContextTexture2D): void {
            Context3DProxy.gl.viewport(0, 0, texture.width, texture.height);
            Context3DProxy.gl.scissor(0, 0, texture.width, texture.height);
            Context3DProxy.gl.bindFramebuffer(Context3DProxy.gl.FRAMEBUFFER, texture.frameBuffer);
            Context3DProxy.gl.clearColor(0, 0, 0, 0);
            Context3DProxy.gl.clear(Context3DProxy.gl.COLOR_BUFFER_BIT | Context3DProxy.gl.DEPTH_BUFFER_BIT);
            Context3DProxy.gl.framebufferTexture2D(Context3DProxy.gl.FRAMEBUFFER, Context3DProxy.gl.COLOR_ATTACHMENT0, Context3DProxy.gl.TEXTURE_2D, texture.texture, 0);
            Context3DProxy.gl.framebufferRenderbuffer(Context3DProxy.gl.FRAMEBUFFER, Context3DProxy.gl.DEPTH_ATTACHMENT, Context3DProxy.gl.RENDERBUFFER, texture.renderbuffer);
        }

        /**
         * 设置渲染缓冲为屏幕
         */
        public setRenderToBackBuffer(): void {
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_2D, null);
            Context3DProxy.gl.bindFramebuffer(Context3DProxy.gl.FRAMEBUFFER, null);
            Context3DProxy.gl.bindRenderbuffer(Context3DProxy.gl.RENDERBUFFER, null);
        }

        /**
         * 设置贴图采样 第一个参数并不是类型
         * @param samplerIndex
         * @see ContextSamplerType
         */
        public setTexture2DAt(samplerIndex: number, uniLocation: any, index: number, texture: ContextTexture2D): void {
            Context3DProxy.gl.activeTexture(samplerIndex);
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_2D, texture.texture);
            Context3DProxy.gl.uniform1i(uniLocation, index);
        }

        /**
         * 设置贴图采样 第一个参数并不是类型
         * @param samplerIndex
         * @see ContextSamplerType
         */
        public setCubeTextureAt(samplerIndex: number, uniLocation: number, index: number, texture: ContextTexture3D): void {
            if (!texture) {
                return;
            }
            Context3DProxy.gl.activeTexture(samplerIndex);
            Context3DProxy.gl.bindTexture(Context3DProxy.gl.TEXTURE_CUBE_MAP, texture.texture);
            Context3DProxy.gl.uniform1i(uniLocation, index);
        }

        /**
         * 设置混合模式
         */
        public setBlendFactors(src: number, dst: number): void {
            if (this._sfactor == src && this._dfactor == dst) {
                return;
            }
            this._sfactor = src;
            this._dfactor = dst;
            Context3DProxy.gl.blendFunc(src, dst);
        }

        /**
         * 设置剔除模式
         * @see ContextConfig.FRONT
         * @see ContextConfig.BACK
         */
        public setCulling(mode: number): void {
            if (this._cullingMode == mode) {
                return;
            }
            this._cullingMode = mode;
            Context3DProxy.gl.cullFace(mode);
        }

        /**
         * 开启深度测试模式
         */
        public enableDepth(): void {
            if (this._depthTest) {
                return;
            }
            this._depthTest = true;
            Context3DProxy.gl.enable(ContextConfig.DEPTH_TEST);
        }

        /**
         * 关闭深度测试模式
         */
        public disableDepth(): void {
            if (!this._depthTest) {
                return;
            }
            this._depthTest = false;
            Context3DProxy.gl.disable(ContextConfig.DEPTH_TEST);
        }

        /**
         * 开启剔除面模式
         */
        public enableCullFace(): void {
            if (this._cullFace) {
                return;
            }
            this._cullFace = true;
            Context3DProxy.gl.enable(ContextConfig.CULL_FACE);
        }

        /**
         * 关闭剔除面模式
         */
        public disableCullFace(): void {
            if (!this._cullFace) {
                return;
            }
            this._cullFace = false;
            Context3DProxy.gl.disable(ContextConfig.CULL_FACE);
        }

        /**
         * 开启混合模式
         */
        public enableBlend(): void {
            // if (this._blend) {
            //     return;
            // }
            // this._blend = true;
            Context3DProxy.gl.enable(ContextConfig.BLEND);
        }

        /**
         * 关闭混合模式
         */
        public disableBlend(): void {
            // if (!this._blend) {
            //     return;
            // }
            // this._blend = false;
            Context3DProxy.gl.disable(ContextConfig.BLEND);
        }

        /**
         * 深度测试比较模式
         */
        public depthFunc(compareMode: number = 0): void {
            if (this._depthCompareMode == compareMode) {
                return;
            }
            this._depthCompareMode = compareMode;
            Context3DProxy.gl.depthFunc(compareMode);
        }

        /**
         * 绘制模型元素
         * @param type 图元类型
         * @param first 第一个顶点索引
         * @param length 顶点个数
         */
        public drawArrays(type: number, first: number, length: number): void {
            Context3DProxy.gl.drawArrays(type, first, length);
        }

        /**
         * 绘制模型元素
         * @param type 图元类型
         * @param indexBuffer 索引数据
         * @param offset 顶点索引偏移 (字节数)
         * @param length 顶点个数
         */
        public drawElement(type: number, offset: number, length: number): void {
            Context3DProxy.gl.drawElements(type, length, Context3DProxy.gl.UNSIGNED_SHORT, offset);
        }

        /**
         * 绘制提交
         */
        public flush(): void {
            Context3DProxy.gl.flush();
        }

        /**
         * 清除指定缓冲区
         */
        public clear(mask: number): void {
            Context3DProxy.gl.clear(mask);
        }

        /**
         * 清除渲染区域的颜色和深度
         */
        public clearColor(r: number, g: number, b: number, a: number): void {
            Context3DProxy.gl.clearColor(r, g, b, a);
        }

        /**
         * 清除渲染区域的模板
         */
        public clearStencil(stencil: number): void {
            Context3DProxy.gl.clearStencil(stencil);
        }
    }
}
