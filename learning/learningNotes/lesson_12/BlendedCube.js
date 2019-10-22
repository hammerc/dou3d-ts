// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

// 片段着色器
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 打开深度测试，此时的透明绘制会失效
    gl.enable(gl.DEPTH_TEST);

    // 开启混合
    gl.enable(gl.BLEND);
    // 设定混合模式为透明模式
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // ADD 模式
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
        console.log('Failed to get the storage location of u_MvpMatrix');
        return;
    }

    var mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 这里可以绘制不透明的物体

    // 关闭深度测试
    gl.depthMask(false);

    // 开启剔除面功能
    // gl.enable(gl.CULL_FACE);
    // 剔除正面
    // gl.cullFace(gl.FRONT);
    // 剔除背面
    // gl.cullFace(gl.BACK);

    // 这里按照前后顺序绘制透明模型
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

    // 打开深度测试
    gl.depthMask(true);

}

function initVertexBuffers(gl) {
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3

    var vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
    ]);

    var colors = new Float32Array([
        0.5, 0.5, 1.0, 0.4, 0.5, 0.5, 1.0, 0.4, 0.5, 0.5, 1.0, 0.4, 0.5, 0.5, 1.0, 0.4,
        0.5, 1.0, 0.5, 0.4, 0.5, 1.0, 0.5, 0.4, 0.5, 1.0, 0.5, 0.4, 0.5, 1.0, 0.5, 0.4,
        1.0, 0.5, 0.5, 0.4, 1.0, 0.5, 0.5, 0.4, 1.0, 0.5, 0.5, 0.4, 1.0, 0.5, 0.5, 0.4,
        1.0, 1.0, 0.5, 0.4, 1.0, 1.0, 0.5, 0.4, 1.0, 1.0, 0.5, 0.4, 1.0, 1.0, 0.5, 0.4,
        1.0, 1.0, 1.0, 0.4, 1.0, 1.0, 1.0, 0.4, 1.0, 1.0, 1.0, 0.4, 1.0, 1.0, 1.0, 0.4,
        0.5, 1.0, 1.0, 0.4, 0.5, 1.0, 1.0, 0.4, 0.5, 1.0, 1.0, 0.4, 0.5, 1.0, 1.0, 0.4
    ]);

    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);

    var indexBuffer = gl.createBuffer();
    if (!indexBuffer)
        return -1;

    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
        return -1;

    if (!initArrayBuffer(gl, colors, 4, gl.FLOAT, 'a_Color'))
        return -1;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }

    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return true;
}
