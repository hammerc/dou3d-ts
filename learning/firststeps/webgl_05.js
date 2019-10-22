function webgl_05() {

    // 获取canvas元素
    var canvas = document.getElementById('canvas05');
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
attribute vec2 a_TextCoord;
varying vec2 v_TexCoord;

void main() {
    // 设置坐标
    gl_Position = a_Position;
    // 传递uv坐标
    v_TexCoord = a_TextCoord;
}
`;

    // 片段着色器
    var FSHADER_SOURCE =
        `
precision mediump float;
// 声明采样器
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

void main() {
    // 设置颜色，通过采样获得指定坐标的颜色
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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

    var n = initBuffers05(gl, shaderProgram);

    if (n < 0) {
        console.log('Failed to set the positions');
        return;
    }

    initTexture05(gl, shaderProgram, n);

}

function initBuffers05(gl, shaderProgram) {

    //顶点坐标和颜色
    var vertices = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);

    //点的个数
    var n = 4;

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var FSIZE = vertices.BYTES_PER_ELEMENT;

    //获取坐标点
    var a_Position = gl.getAttribLocation(shaderProgram, "a_Position");

    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);

    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    //获取Color坐标点
    var a_TextCoord = gl.getAttribLocation(shaderProgram, "a_TextCoord");

    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_TextCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);

    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_TextCoord);

    return n;

}

function initTexture05(gl, shaderProgram, n) {

    //创建纹理对象
    var texture = gl.createTexture();

    //获取u_Sampler的存储位置
    var u_Sampler = gl.getUniformLocation(shaderProgram, 'u_Sampler');

    //创建image对象
    var image = new Image();

    image.crossOrigin = "anonymous";

    //加载纹理
    image.onload = function () {
        loadTexture05(gl, n, texture, u_Sampler, image);
    };

    // 浏览器开始加载图片 注意：一定是2^mx2^n尺寸的图片
    image.src = "UV_Grid_Sm.jpg";

    return true;

}

function loadTexture05(gl, n, texture, u_Sampler, image) {

    //对纹理图像进行Y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    //开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);

    //向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //将0号纹理图像传递给着色器
    gl.uniform1i(u_Sampler, 0);

    // 清空 <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制矩形
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

}
