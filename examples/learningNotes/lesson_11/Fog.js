// 顶点着色器
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform vec4 u_Eye;\n' + // 摄像机坐标
    'varying vec4 v_Color;\n' +
    'varying float v_Dist;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    // 当前点和摄像机坐标的距离
    '  v_Dist = distance(u_ModelMatrix * a_Position, u_Eye);\n' +
    '}\n';

// 片段着色器
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform vec3 u_FogColor;\n' + // 雾的颜色
    'uniform vec2 u_FogDist;\n' +  // 雾的距离（开始有雾的距离，雾最浓的距离）
    'varying vec4 v_Color;\n' +
    'varying float v_Dist;\n' +
    'void main() {\n' +
    // 计算出雾化因子 0 没有雾 1 雾最浓
    '  float fogFactor = clamp((u_FogDist.y - v_Dist) / (u_FogDist.y - u_FogDist.x), 0.0, 1.0);\n' +
    // 混合颜色
    '  vec3 color = mix(u_FogColor, vec3(v_Color), fogFactor);\n' +
    '  gl_FragColor = vec4(color, v_Color.a);\n' +
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
    if (n < 1) {
        console.log('Failed to set the vertex information');
        return;
    }

    // 雾的颜色
    var fogColor = new Float32Array([0.137, 0.231, 0.423]);
    // 雾开始和结束的距离
    var fogDist = new Float32Array([55, 80]);
    // 摄像机的坐标
    var eye = new Float32Array([25, 65, 35, 1.0]);

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_Eye = gl.getUniformLocation(gl.program, 'u_Eye');
    var u_FogColor = gl.getUniformLocation(gl.program, 'u_FogColor');
    var u_FogDist = gl.getUniformLocation(gl.program, 'u_FogDist');
    if (!u_MvpMatrix || !u_ModelMatrix || !u_Eye || !u_FogColor || !u_FogDist) {
        console.log('Failed to get the storage location');
        return;
    }

    gl.uniform3fv(u_FogColor, fogColor);
    gl.uniform2fv(u_FogDist, fogDist);
    gl.uniform4fv(u_Eye, eye);

    gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1.0);
    gl.enable(gl.DEPTH_TEST);

    var modelMatrix = new Matrix4();
    modelMatrix.setScale(10, 10, 10);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    var mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 1000);
    mvpMatrix.lookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);
    mvpMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_FogDist, fogDist);
    };

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

    var modelViewMatrix = new Matrix4();
    modelViewMatrix.setLookAt(eye[0], eye[1], eye[2], 0, 2, 0, 0, 1, 0);
    modelViewMatrix.multiply(modelMatrix);
    modelViewMatrix.multiplyVector4(new Vector4([1, 1, 1, 1]));
    mvpMatrix.multiplyVector4(new Vector4([1, 1, 1, 1]));
    modelViewMatrix.multiplyVector4(new Vector4([-1, 1, 1, 1]));
    mvpMatrix.multiplyVector4(new Vector4([-1, 1, 1, 1]));
}

function keydown(ev, gl, n, u_FogDist, fogDist) {
    switch (ev.keyCode) {
        case 38:
            fogDist[1] += 1;
            break;
        case 40:
            if (fogDist[1] > fogDist[0]) {
                fogDist[1] -= 1;
            }
            break;
        default:
            return;
    }
    gl.uniform2fv(u_FogDist, fogDist);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
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
        1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1,
        1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,
        1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1,
        -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1,
        -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
        1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1
    ]);

    var colors = new Float32Array([     // Colors
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0
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

    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1;
    if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) return -1;

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
