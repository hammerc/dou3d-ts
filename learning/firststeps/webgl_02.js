function webgl_02() {

    // 获取canvas元素
    var canvas = document.getElementById('canvas02');
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

void main() {
    // 设置坐标
    gl_Position = a_Position;
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

    var n = initBuffers02(gl, shaderProgram);

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

function initBuffers02(gl, shaderProgram) {

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
