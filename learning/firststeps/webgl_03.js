function webgl_03() {

    // 获取canvas元素
    var canvas = document.getElementById('canvas03');
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
uniform mat4 u_xformMatarix;

void main() {
    // 设置坐标
    gl_Position = u_xformMatarix * a_Position;
}
`;

    // 片段着色器
    var FSHADER_SOURCE =
        `
void main() {
    // 设置颜色
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

    var n = initBuffers03(gl, shaderProgram);

    if (n < 0) {
        console.log('Failed to set the positions');
        return;
    }

    // 控制缩放的矩阵
    var Sx = 1.5; Sy = 1.5; Sz = 1.0;
    var xformMatrix = new Float32Array([
        Sx, 0.0, 0.0, 0.0,
        0.0, Sy, 0.0, 0.0,
        0.0, 0.0, Sz, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);

    // 获取矩阵变量的下标
    var u_xformMatarix = gl.getUniformLocation(shaderProgram, 'u_xformMatarix');
    // 提交矩阵数据到GPU
    gl.uniformMatrix4fv(u_xformMatarix, false, xformMatrix);

    // 清除指定
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // 清空
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制
    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function initBuffers03(gl, shaderProgram) {

    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    // 点的个数
    var n = 3;

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create the butter object");
        return -1;
    }

    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 获取坐标点
    var a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');

    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;

}
