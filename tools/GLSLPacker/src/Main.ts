import * as fs from "fs"
import * as path from "path"
import * as util from "util"
import { FileUtil } from "../lib/hammerc/utils/FileUtil"

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Main {
    public constructor() {
        let args = process.argv.splice(2);

        let originPath = path.resolve(args[0]);
        let targetPath = path.resolve(args[1]);
        this.start(originPath, targetPath)
            .catch(() => {
                console.log("着色器库生成成功！");
            })
            .catch((reason: any) => {
                console.error(reason);
            });
    }

    private async start(originPath: string, targetPath: string): Promise<void> {
        let list = FileUtil.getAllFile(originPath, "glsl", true);
        let shaderCode: string[] = [];
        shaderCode.push("namespace dou3d {");
        shaderCode.push("    /**");
        shaderCode.push("     * 着色器库");
        shaderCode.push("     * @author GLSLPacker");
        shaderCode.push("     */");
        shaderCode.push("    export namespace ShaderLib {");
        for (let filePath of list) {
            let name = path.basename(filePath, ".glsl");
            let code = await this.processCode(filePath);
            code = code.replace(/[(\r\n)\r\n]/g, "\\r");
            shaderCode.push("        export const " + name + " = `" + code + "`;");
        }
        shaderCode.push("    }");
        shaderCode.push("}");
        shaderCode.push("");
        let dir = path.dirname(targetPath);
        FileUtil.createDir(dir);
        await writeFileAsync(targetPath, shaderCode.join("\r\n"), { encoding: "utf8" });
    }

    private async processCode(filePath: string): Promise<string> {
        let code = await readFileAsync(filePath, { encoding: "utf8" });

        if (code.charCodeAt(0) === 0xFEFF) {
            code = code.slice(1);
        }

        code = code.replace(/(\r\n)/g, "\n");
        code = code.replace(/\/\*{1,2}[\s\S]*?\*\//g, "");
        code = code.replace(/\/\/[\s\S]*?\n/g, "");
        code = code.replace(/[\t ]{2,}/g, " ");
        code = code.replace(/^[\t ]+/mg, "");
        code = code.replace(/[\t ]+$/mg, "");
        code = code.replace(/(\n)+/g, "\n");
        code = code.replace(/^(\n)+/g, "");
        code = code.replace(/(\n)+$/g, "");

        code = code.replace(/([\t ]*=[\t ]*)/g, "=");
        code = code.replace(/([\t ]*==[\t ]*)/g, "==");
        code = code.replace(/([\t ]*>[\t ]*)/g, ">");
        code = code.replace(/([\t ]*>=[\t ]*)/g, ">=");
        code = code.replace(/([\t ]*<[\t ]*)/g, "<");
        code = code.replace(/([\t ]*<=[\t ]*)/g, "<=");

        code = code.replace(/([\t ]*\([\t ]*)/g, "(");
        code = code.replace(/([\t ]*\)[\t ]*)/g, ")");
        code = code.replace(/([\t ]*\{[\t ]*)/g, "{");
        code = code.replace(/([\t ]*\}[\t ]*)/g, "}");

        code = code.replace(/([\t ]*,[\t ]*)/g, ",");
        code = code.replace(/([\t ]*\.[\t ]*)/g, ".");
        code = code.replace(/([\t ]*\?[\t ]*)/g, "?");
        code = code.replace(/([\t ]*:[\t ]*)/g, ":");
        code = code.replace(/([\t ]*;[\t ]*)/g, ";");

        code = code.replace(/([\t ]*\+[\t ]*)/g, "+");
        code = code.replace(/([\t ]*\+=[\t ]*)/g, "+=");
        code = code.replace(/([\t ]*\-[\t ]*)/g, "-");
        code = code.replace(/([\t ]*\-=[\t ]*)/g, "-=");
        code = code.replace(/([\t ]*\*[\t ]*)/g, "*");
        code = code.replace(/([\t ]*\*=[\t ]*)/g, "*=");
        code = code.replace(/([\t ]*\/[\t ]*)/g, "/");
        code = code.replace(/([\t ]*\/=[\t ]*)/g, "/=");

        return code;
    }
}

new Main();
