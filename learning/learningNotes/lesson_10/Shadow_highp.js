// 创建阴影贴图的顶点着色器
var SHADOW_VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '}\n';

// 创建阴影贴图的片段着色器
var SHADOW_FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'void main() {\n' +
    // 通过运算将深度值存储在 gl_FragColor 中
    '  const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);\n' +
    '  const vec4 bitMask = vec4(1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0, 0.0);\n' +
    '  vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);\n' +
    '  rgbaDepth -= rgbaDepth.gbaa * bitMask;\n' +
    '  gl_FragColor = rgbaDepth;\n' +
    '}\n';

// 绘制使用的顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_MvpMatrixFromLight;\n' +
    'varying vec4 v_PositionFromLight;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  v_PositionFromLight = u_MvpMatrixFromLight * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

// 绘制使用的片段着色器
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_ShadowMap;\n' +
    'varying vec4 v_PositionFromLight;\n' +
    'varying vec4 v_Color;\n' +
    // 将深度值从 vec4 中解出来
    'float unpackDepth(const in vec4 rgbaDepth) {\n' +
    '  const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));\n' +
    '  float depth = dot(rgbaDepth, bitShift);\n' +
    '  return depth;\n' +
    '}\n' +
    'void main() {\n' +
    '  vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;\n' +
    '  vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);\n' +
    '  float depth = unpackDepth(rgbaDepth);\n' +
    '  float visibility = (shadowCoord.z > depth + 0.0015) ? 0.7 : 1.0;\n' +
    '  gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);\n' +
    '}\n';

var OFFSCREEN_WIDTH = 2048, OFFSCREEN_HEIGHT = 2048;
// 光照位置
var LIGHT_X = 0, LIGHT_Y = 40, LIGHT_Z = 2;

function main() {
    var canvas = document.getElementById('webgl');

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // 创建阴影贴图的程序对象
    var shadowProgram = createProgram(gl, SHADOW_VSHADER_SOURCE, SHADOW_FSHADER_SOURCE);
    shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, 'a_Position');
    shadowProgram.u_MvpMatrix = gl.getUniformLocation(shadowProgram, 'u_MvpMatrix');
    if (shadowProgram.a_Position < 0 || !shadowProgram.u_MvpMatrix) {
        console.log('Failed to get the storage location of attribute or uniform variable from shadowProgram');
        return;
    }

    // 创建正常渲染的程序对象
    var normalProgram = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    normalProgram.a_Position = gl.getAttribLocation(normalProgram, 'a_Position');
    normalProgram.a_Color = gl.getAttribLocation(normalProgram, 'a_Color');
    normalProgram.u_MvpMatrix = gl.getUniformLocation(normalProgram, 'u_MvpMatrix');
    normalProgram.u_MvpMatrixFromLight = gl.getUniformLocation(normalProgram, 'u_MvpMatrixFromLight');
    normalProgram.u_ShadowMap = gl.getUniformLocation(normalProgram, 'u_ShadowMap');
    if (normalProgram.a_Position < 0 || normalProgram.a_Color < 0 || !normalProgram.u_MvpMatrix ||
        !normalProgram.u_MvpMatrixFromLight || !normalProgram.u_ShadowMap) {
        console.log('Failed to get the storage location of attribute or uniform variable from normalProgram');
        return;
    }

    // 获取顶点数据
    var triangle = initVertexBuffersForTriangle(gl);
    var plane = initVertexBuffersForPlane(gl);
    if (!triangle || !plane) {
        console.log('Failed to set the vertex information');
        return;
    }

    // 初始化帧缓冲对象
    var fbo = initFramebufferObject(gl);
    if (!fbo) {
        console.log('Failed to initialize frame buffer object');
        return;
    }
    // 设定当前的帧缓冲对象为当前对象
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

    // 清屏开始深度测试
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    // 用于生成阴影贴图的光线矩阵
    var viewProjMatrixFromLight = new Matrix4();
    // 正交投影
    // viewProjMatrixFromLight.setOrtho(-10, 10, -10, 10, 1.0, 200.0);
    // 透视投影
    viewProjMatrixFromLight.setPerspective(70.0, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1.0, 200.0);
    viewProjMatrixFromLight.lookAt(LIGHT_X, LIGHT_Y, LIGHT_Z, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    // 用于绘制的查看矩阵
    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(45, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(0.0, 7.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    // 旋转角度
    var currentAngle = 0.0;
    // 三角形的模型视图投影矩阵（model view projection matrix）
    var mvpMatrixFromLight_t = new Matrix4();
    // 面板的模型视图投影矩阵（model view projection matrix）
    var mvpMatrixFromLight_p = new Matrix4();

    // 更新函数
    var tick = function () {
        currentAngle = animate(currentAngle);

        // 设定 fbo 为当前绘制的帧缓冲
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.viewport(0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 使用阴影贴图程序
        gl.useProgram(shadowProgram);
        // 绘制三角形和小面板
        drawTriangle(gl, shadowProgram, triangle, currentAngle, viewProjMatrixFromLight);
        drawPlane(gl, shadowProgram, plane, viewProjMatrixFromLight);

        mvpMatrixFromLight_t.set(g_mvpMatrix);
        mvpMatrixFromLight_p.set(g_mvpMatrix);

        // 设定当前帧缓冲为默认缓冲
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 使用默认程序
        gl.useProgram(normalProgram);
        // 将 Texture0 和 u_ShadowMap 变量绑定
        gl.uniform1i(normalProgram.u_ShadowMap, 0);
        // 绘制三角形和小面板
        gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_t.elements);
        drawTriangle(gl, normalProgram, triangle, currentAngle, viewProjMatrix);
        gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_p.elements);
        drawPlane(gl, normalProgram, plane, viewProjMatrix);

        window.requestAnimationFrame(tick, canvas);
    };
    tick();
}

// 每秒钟的旋转角度
var ANGLE_STEP = 40;

var last = Date.now();
function animate(angle) {
    var now = Date.now();
    var elapsed = now - last;
    last = now;
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}

// 坐标转换矩阵
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();

function drawTriangle(gl, program, triangle, angle, viewProjMatrix) {
    // 设置旋转角度
    g_modelMatrix.setRotate(angle, 0, 1, 0);
    draw(gl, program, triangle, viewProjMatrix);
}

function drawPlane(gl, program, plane, viewProjMatrix) {
    // 设置旋转角度
    g_modelMatrix.setRotate(-45, 0, 1, 1);
    draw(gl, program, plane, viewProjMatrix);
}

function draw(gl, program, o, viewProjMatrix) {
    initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
    if (program.a_Color != undefined) {
        initAttributeVariable(gl, program.a_Color, o.colorBuffer);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

    // 矩阵运算
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

    gl.drawElements(gl.TRIANGLES, o.numIndices, gl.UNSIGNED_BYTE, 0);
}

function initAttributeVariable(gl, a_attribute, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
}

function initVertexBuffersForPlane(gl) {
    //  v1------v0
    //  |        |
    //  |        |
    //  |        |
    //  v2------v3

    var vertices = new Float32Array([
        3.0, -1.7, 2.5, -3.0, -1.7, 2.5, -3.0, -1.7, -2.5, 3.0, -1.7, -2.5
    ]);

    var colors = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
    ]);

    var indices = new Uint8Array([0, 1, 2, 0, 2, 3]);

    var o = new Object();

    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    if (!o.vertexBuffer || !o.colorBuffer || !o.indexBuffer) {
        return null;
    }

    o.numIndices = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}

function initVertexBuffersForTriangle(gl) {
    //       v2
    //      / |
    //     /  |
    //    /   |
    //  v0----v1

    var vertices = new Float32Array([-0.8, 3.5, 0.0, 0.8, 3.5, 0.0, 0.0, 3.5, 1.8]);

    var colors = new Float32Array([1.0, 0.5, 0.0, 1.0, 0.5, 0.0, 1.0, 0.0, 0.0]);

    var indices = new Uint8Array([0, 1, 2]);

    var o = new Object();

    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.colorBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    if (!o.vertexBuffer || !o.colorBuffer || !o.indexBuffer) {
        return null;
    }

    o.numIndices = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return o;
}

function initArrayBufferForLaterUse(gl, data, num, type) {
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return null;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    buffer.num = num;
    buffer.type = type;

    return buffer;
}

function initElementArrayBufferForLaterUse(gl, data, type) {
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return null;
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

    buffer.type = type;

    return buffer;
}

function initFramebufferObject(gl) {
    var framebuffer, texture, depthBuffer;

    var error = function () {
        if (framebuffer) {
            gl.deleteFramebuffer(framebuffer);
        }
        if (texture) {
            gl.deleteTexture(texture);
        }
        if (depthBuffer) {
            gl.deleteRenderbuffer(depthBuffer);
        }
        return null;
    }

    framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
        console.log('Failed to create frame buffer object');
        return error();
    }

    // 创建贴图并设定贴图尺寸
    texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create texture object');
        return error();
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    // 创建 renderbuffer 并设定尺寸
    depthBuffer = gl.createRenderbuffer();
    if (!depthBuffer) {
        console.log('Failed to create renderbuffer object');
        return error();
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    // 将贴图和 renderbuffer 对象添加到帧缓冲上
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
        console.log('Frame buffer object is incomplete: ' + e.toString());
        return error();
    }

    framebuffer.texture = texture;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return framebuffer;
}
