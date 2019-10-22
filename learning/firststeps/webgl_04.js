function webgl_04() {

    // 获取canvas元素
    var canvas = document.getElementById('canvas04');
    // 获取绘制上下文
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log("Failed");
        return;
    }

    // 顶点着色器
    var VSHADER_SOURCE =
        `
attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;

void main() {
    // 设置坐标
    gl_Position = a_Position;
    // 传递颜色数据
    v_Color = a_Color;
}
`;

    // 片段着色器
    var FSHADER_SOURCE =
        `
precision mediump float;
varying vec4 v_Color;

void main() {
    gl_FragColor = v_Color;
}
`;

    // 编译着色器
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, VSHADER_SOURCE);
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, FSHADER_SOURCE);
    gl.compileShader(fragShader);

    // 创建程序
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var n = initBuffers04(gl, shaderProgram);

    if (n < 0) {
        console.log('Failed to set the positions');
        return;
    }

    // 清除指定
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 清空
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制
    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function initBuffers04(gl, shaderProgram) {

    //顶点坐标和颜色
    var vertices = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0,
    ]);

    //点的个数
    var n = 3;

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //获取单个字节
    var FSIZE = vertices.BYTES_PER_ELEMENT;

    //获取坐标点
    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');

    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);

    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    //获取Color坐标点
    var a_Color = gl.getAttribLocation(shaderProgram, 'a_Color');

    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);

    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Color);

    return n;

}
