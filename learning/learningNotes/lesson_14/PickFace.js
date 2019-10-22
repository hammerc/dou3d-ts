// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute float a_Face;\n' + // 外部传入标记当前属于哪个面
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform int u_PickedFace;\n' + // 点中的立方体的面
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  int face = int(a_Face);\n' +
    '  vec3 color = (face == u_PickedFace) ? vec3(1.0) : a_Color.rgb;\n' + // 如果当前面就是点中的面则使用纯白色的颜色填充，否则使用原来的颜色
    '  if(u_PickedFace == 0) {\n' + // 如果是 0 则每个面的透明度都不一样，用来判断拾取
    '    v_Color = vec4(color, a_Face / 255.0);\n' +
    '  } else {\n' +
    '    v_Color = vec4(color, a_Color.a);\n' +
    '  }\n' +
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

var ANGLE_STEP = 20.0;

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
    gl.enable(gl.DEPTH_TEST);

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_PickedFace = gl.getUniformLocation(gl.program, 'u_PickedFace');
    if (!u_MvpMatrix || !u_PickedFace) {
        console.log('Failed to get the storage location of uniform variable');
        return;
    }

    var viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    // 初始化选中的面
    gl.uniform1i(u_PickedFace, -1);

    var currentAngle = 0.0;
    canvas.onmousedown = function (ev) {
        var x = ev.clientX, y = ev.clientY;
        var rect = ev.target.getBoundingClientRect();
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
            var x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y;
            var face = checkFace(gl, n, x_in_canvas, y_in_canvas, currentAngle, u_PickedFace, viewProjMatrix, u_MvpMatrix);
            gl.uniform1i(u_PickedFace, face); // 设置 u_PickedFace 为当前选中的面
            draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);
        }
    }

    var tick = function () {
        currentAngle = animate(currentAngle);
        draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);
        requestAnimationFrame(tick, canvas);
    };
    tick();
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
        0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56,
        0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69,
        0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84,
        0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61,
        0.27, 0.58, 0.82, 0.27, 0.58, 0.82, 0.27, 0.58, 0.82, 0.27, 0.58, 0.82,
        0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93,
    ]);

    // 每个面的数据
    var faces = new Uint8Array([
        1, 1, 1, 1,
        2, 2, 2, 2,
        3, 3, 3, 3,
        4, 4, 4, 4,
        5, 5, 5, 5,
        6, 6, 6, 6,
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
    if (!indexBuffer) {
        return -1;
    }

    if (!initArrayBuffer(gl, vertices, gl.FLOAT, 3, 'a_Position')) return -1;
    if (!initArrayBuffer(gl, colors, gl.FLOAT, 3, 'a_Color')) return -1;
    if (!initArrayBuffer(gl, faces, gl.UNSIGNED_BYTE, 1, 'a_Face')) return -1;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function checkFace(gl, n, x, y, currentAngle, u_PickedFace, viewProjMatrix, u_MvpMatrix) {
    var pixels = new Uint8Array(4);
    // 设定为 0 可以绘制不同面的不同透明度
    gl.uniform1i(u_PickedFace, 0);
    draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix);
    // pixels[3] 是透明度也就是当前的面数
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels[3];
}

var g_MvpMatrix = new Matrix4();
function draw(gl, n, currentAngle, viewProjMatrix, u_MvpMatrix) {
    g_MvpMatrix.set(viewProjMatrix);
    g_MvpMatrix.rotate(currentAngle, 1.0, 0.0, 0.0);
    g_MvpMatrix.rotate(currentAngle, 0.0, 1.0, 0.0);
    g_MvpMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_MvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

var last = Date.now();
function animate(angle) {
    var now = Date.now();
    var elapsed = now - last;
    last = now;

    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}

function initArrayBuffer(gl, data, type, num, attribute) {
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

    return true;
}
