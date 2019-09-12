namespace dou3d {
    /**
     * 着色器缓存池
     * @author wizardc
     */
    export namespace ShaderPool {
        //总shader的map容器
        const _programlib: { [key: string]: Program3D } = {};
        const _vsShaderHashMap: { [key: string]: Shader } = {};
        const _fsShaderHashMap: { [key: string]: Shader } = {};

        let _context: Context3DProxy;

        export function register(context: Context3DProxy) {
            _context = context;
        }

        export function getGPUShader(shaderType: number, shaderID: string, source: string): Shader {
            let shader = _vsShaderHashMap[shaderID];
            if (!shader) {
                shader = _fsShaderHashMap[shaderID];
            }
            if (!shader) {
                if (shaderType == ShaderType.vertex) {
                    shader = _context.createVertexShader(source);
                    shader.id = shaderID;
                    _vsShaderHashMap[shaderID] = shader;
                }
                else if (shaderType == ShaderType.fragment) {
                    shader = _context.createFragmentShader(source);
                    shader.id = shaderID;
                    _fsShaderHashMap[shaderID] = shader;
                }
            }
            return shader;
        }

        export function getProgram(vs_shaderID: string, fs_shaderID: string): Program3D {
            let vsShader = _vsShaderHashMap[vs_shaderID];
            let fsShader = _fsShaderHashMap[fs_shaderID];
            let name = vsShader.id + "_" + fsShader.id;
            let program3D: Program3D;
            if (_programlib[name]) {
                program3D = _programlib[name];
            }
            else {
                program3D = registerProgram(vsShader, fsShader);
                _programlib[name] = program3D;
            }
            return _programlib[name];
        }

        function unRegisterShader(list: Array<string>) {
            //to delet shader
        }

        function registerProgram(vsShader: Shader, fsShader: Shader): Program3D {
            let program3D = _context.createProgram(vsShader, fsShader);
            return program3D;
        }

        function unRegisterProgram(vsKey: string, fsKey: string) {
            //to delet program
        }
    }
}
