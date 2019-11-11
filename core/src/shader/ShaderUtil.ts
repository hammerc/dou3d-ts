namespace dou3d {
    /**
     * 着色器工具类
     * @author wizardc
     */
    export namespace ShaderUtil {
        const _shaderContentDict: ShaderContent[] = [];

        /**
         * 加载着色器文件
         */
        export function load(): void {
            for (let key in ShaderLib) {
                let content = readShader(ShaderLib[key]);
                _shaderContentDict[key] = content;
                content.name = key;
            }
        }

        function readShader(str: string): ShaderContent {
            let content = new ShaderContent();
            let shaderLine = parseContent(str);
            while (shaderLine.length > 0) {
                let line = shaderLine[0];
                shaderLine.shift();
                let ret = getLineType(line);
                let index = -1;
                index = ret.indexOf("struct");
                if (index != -1) {
                    let tempArray = ret.split(" ");
                    let structStr = line;
                    content.addStruct(tempArray[1], structStr);
                    processStruct(tempArray[1], structStr, content);
                    continue;
                }
                index = ret.indexOf("function");
                if (index != -1) {
                    let tempArray = ret.split(" ");
                    let func = line;
                    content.addFunc(tempArray[1], func);
                    continue;
                }
                index = ret.indexOf("unknown");
                if (index != -1) {
                    let tempArray = parseLines(line);
                    let key = getVarKey(tempArray);
                    let valueType = getVarType(tempArray);
                    if (valueType == "sampler2D") {
                        let sampler2D = getSampler2D(line);
                        if (sampler2D) {
                            content.addVar(sampler2D);
                        }
                    }
                    else if (valueType == "samplerCube") {
                        let sampler3D = getSampler3D(line);
                        if (sampler3D) {
                            content.addVar(sampler3D);
                        }
                    }
                    else {
                        if (key == "attribute") {
                            let att = getAttribute(line);
                            if (att) {
                                content.addVar(att);
                            }
                        }
                        else if (key == "varying") {
                            let varying = getVarying(line);
                            if (varying) {
                                content.addVar(varying);
                            }
                        }
                        else if (key == "uniform") {
                            let uniform = getUniform(line);
                            if (uniform) {
                                content.addVar(uniform);
                            }
                        }
                        else if (key == "const") {
                            let ConstVar = getConst(line);
                            if (ConstVar) {
                                content.addVar(ConstVar);
                            }
                        }
                        else if (key == "#extension") {
                            let extension = getExtension(line);
                            if (extension) {
                                content.addVar(extension);
                            }
                        }
                        else if (key == "#define") {
                            let def = getDefine(line);
                            if (def) {
                                content.addVar(def);
                            }
                        }
                        else {
                            content.addVar(getTemper(line));
                        }
                    }
                    continue;
                }
            }
            return content;
        }

        function parseContent(file: string): string[] {
            let shaderList: string[] = [];
            let node = "";
            let endChar = ";";
            let index = -1;
            for (let i = 0; i < file.length; ++i) {
                if (file.charAt(i) == "{") {
                    index = node.indexOf("=");
                    if (index < 0) {
                        endChar = "}";
                    }
                }
                if (node == "") {
                    if (file.charAt(i) == " " || file.charAt(i) == "    " || file.charAt(i) == "\t") {
                        continue;
                    }
                }
                node += file.charAt(i);
                if (endChar != "\n") {
                    if (node.indexOf("#extension") >= 0) {
                        endChar = "\n";
                    }
                    else if (node.indexOf("#define") >= 0) {
                        endChar = "\n";
                    }
                }
                if (endChar == file.charAt(i)) {
                    if (endChar == "}") {
                        let s_num = 0;
                        let e_num = 0;
                        for (let j = 0; j < node.length; ++j) {
                            if (node.charAt(j) == "{") {
                                s_num++;
                            }
                            else if (node.charAt(j) == "}") {
                                e_num++;
                            }
                        }
                        if (s_num != e_num) {
                            continue;
                        }
                        if (node.indexOf("struct") >= 0) {
                            endChar = ";";
                            continue;
                        }
                    }
                    if (node.length > 0) {
                        shaderList.push(node);
                    }
                    node = "";
                    endChar = ";";
                }
            }
            return shaderList;
        }

        function getLineType(line: string): string {
            let index = line.indexOf("{");
            if (index > 0) {
                let firstStr = line.substr(0, index);
                if (firstStr.indexOf("struct") >= 0) {
                    let s_pos = firstStr.lastIndexOf(" ");
                    s_pos++;
                    let structName = firstStr.substr(s_pos, firstStr.length - s_pos);
                    return "struct " + structName;
                }
                if (firstStr.indexOf("=") < 0) {
                    let pos: number = line.indexOf("(");
                    let s_pos: number = line.lastIndexOf(" ", pos);
                    s_pos++;
                    let func: string = line.substr(s_pos, pos - s_pos);
                    return "function " + func;
                }
            }
            return "unknown";
        }

        function processStruct(name: string, structStr: string, content: ShaderContent): void {
            let pos = structStr.lastIndexOf("}");
            pos++;
            let end = structStr.lastIndexOf(";");
            let varName = structStr.substr(pos, end - pos);
            let varList = parseLines(varName);
            for (let i = 0; i < varList.length; ++i) {
                let varTmp = getTemper(name + " " + varList[i] + ";");
                if (varTmp) {
                    content.addVar(varTmp);
                }
            }
        }

        function parseLines(line: string): string[] {
            let list: string[] = [];
            let value = "";
            let isEnd = false;
            for (let i = 0; i < line.length; ++i) {
                if (isEnd) {
                    if (line.charAt(i) == ";") {
                        isEnd = false;
                        if (value.length > 0) {
                            list.push(value);
                            value = "";
                        }
                        break;
                    }
                    value += line.charAt(i);
                    continue;
                }
                if (line.charAt(i) != " " && line.charAt(i) != "\t" && line.charAt(i) != "," && line.charAt(i) != "\r" && line.charAt(i) != "\n" && line.charAt(i) != ":") {
                    if (line.charAt(i) == ";") {
                        if (value.length > 0) {
                            list.push(value);
                            value = "";
                        }
                        break;
                    }
                    else if (line.charAt(i) == "=") {
                        if (value.length > 0) {
                            list.push(value);
                            value = "";
                        }
                        list.push("=");
                        isEnd = true;
                        continue;
                    }
                    value += line.charAt(i);
                    if (i == line.length - 1 && line != "") {
                        list.push(value);
                        value = "";
                    }
                }
                else {
                    if (value != "") {
                        list.push(value);
                        value = "";
                    }
                }
            }
            return list;
        }

        function hasString(fields: string[], str: string): number {
            for (let i = 0; i < fields.length; ++i) {
                if (fields[i] == str) {
                    return i;
                }
            }
            return -1;
        }

        function replaceCharacter(src: string, searchValue: string[], replaceValue: string): string {
            let ret = src;
            let isBreak = false;
            while (!isBreak) {
                isBreak = true;
                for (let i = 0; i < searchValue.length; ++i) {
                    if (ret.indexOf(searchValue[i]) >= 0) {
                        isBreak = false;
                        break;
                    }
                }
                for (let i = 0; i < searchValue.length; ++i) {
                    ret = ret.replace(searchValue[i], replaceValue);
                }
            }
            return ret;
        }

        function getVarKey(fields: string[]): string {
            let index = hasString(fields, "=");
            if (index >= 0) {
                index -= 3;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            else {
                index = fields.length - 3;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
                else {
                    return fields[0];
                }
            }
            return "";
        }

        function getVarType(fields: string[]): string {
            let index = hasString(fields, "=");
            if (index >= 0) {
                index -= 2;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            else {
                index = fields.length - 2;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            return "";
        }

        function getVarName(fields: string[]): string {
            let index = hasString(fields, "=");
            if (index >= 0) {
                index -= 1;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            else {
                index = fields.length - 1;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            return "";
        }

        function getVarValue(fields: string[]): string {
            let index = hasString(fields, "=");
            if (index >= 0) {
                index += 1;
                if (index >= 0 && index < fields.length) {
                    return fields[index];
                }
            }
            return "";
        }

        function getSampler2D(shaderLine: string): Sampler2D {
            let tempStr = shaderLine;
            let sampler2DName: string;
            let sampler2D: Sampler2D;
            let tempArray = parseLines(tempStr);
            sampler2DName = getVarName(tempArray);
            sampler2D = new Sampler2D(sampler2DName);
            return sampler2D;
        }

        function getSampler3D(shaderLine: string): Sampler3D {
            let tempStr = shaderLine;
            let sampler3DName: string;
            let sampler3D: Sampler3D;
            let tempArray = parseLines(tempStr);
            sampler3DName = getVarName(tempArray);
            sampler3D = new Sampler3D(sampler3DName);
            return sampler3D;
        }

        function getAttribute(shaderLine: string): Attribute {
            let tempStr = shaderLine;
            let tmpName: string;
            let valueType: string;
            let attribute: TmpVar;
            let tempArray = parseLines(tempStr);
            tmpName = getVarName(tempArray);
            valueType = getVarType(tempArray);
            attribute = new Attribute(tmpName, valueType);
            attribute.value = getVarValue(tempArray);
            return attribute;
        }

        function getVarying(shaderLine: string): Varying {
            let tempStr = shaderLine;
            let varyingName: string;
            let valueType: string;
            let varying: Varying;
            let tempArray = parseLines(tempStr);
            varyingName = getVarName(tempArray);
            valueType = getVarType(tempArray);
            varying = new Varying(varyingName, valueType);
            return varying;
        }

        function getUniform(shaderLine: string): Uniform {
            let tempStr = shaderLine;
            let uniformName: string;
            let valueType: string;
            let uniform: Uniform;
            let tempArray = parseLines(tempStr);
            uniformName = getVarName(tempArray);
            valueType = getVarType(tempArray);
            uniform = new Uniform(uniformName, valueType);
            return uniform;
        }

        function getConst(shaderLine: string): ConstVar {
            let tempStr = shaderLine;
            let constVarName: string;
            let valueType: string;
            let varValue: string;
            let constVar: ConstVar;
            let tempArray = parseLines(tempStr);
            constVarName = getVarName(tempArray);
            valueType = getVarType(tempArray);
            varValue = getVarValue(tempArray);
            constVar = new ConstVar(constVarName, valueType, varValue);
            return constVar;
        }

        function getExtension(shaderLine: string): Extension {
            let start = shaderLine.indexOf("#");
            let end = shaderLine.indexOf(" ");
            let type = shaderLine.substr(start, end);
            let namePosEnd = shaderLine.indexOf(":");
            let name = shaderLine.substr(end, namePosEnd - end);
            name = replaceCharacter(name, [" "], "");
            namePosEnd += 1;
            let value = shaderLine.substr(namePosEnd, shaderLine.length - namePosEnd);
            value = replaceCharacter(value, [" ", ":", "\n", "\r"], "");
            let extension = new Extension(name);
            extension.value = value;
            return extension;
        }

        function getDefine(shaderLine: string): DefineVar {
            let tempStr = shaderLine;
            let name = "";
            let value = "";
            let tmpVar: DefineVar;
            let tempArray = parseLines(tempStr);
            name = tempArray[1];
            if (tempArray.length >= 3) {
                value = tempArray[2];
            }
            tmpVar = new DefineVar(name, value);
            return tmpVar;
        }

        function getTemper(shaderLine: string): TmpVar {
            let tempStr = shaderLine;
            let tmpName: string;
            let valueType: string;
            let tmpVar: TmpVar;
            let tempArray = parseLines(tempStr);
            tmpName = getVarName(tempArray);
            valueType = getVarType(tempArray);
            tmpVar = new TmpVar(tmpName, valueType);
            tmpVar.value = getVarValue(tempArray);
            return tmpVar;
        }

        /**
         * 返回组合着色器后的内容
         */
        export function fillShaderContent(shaderComposer: ShaderComposer, shaderNameList: string[], usage: PassUsage): Shader {
            let shaderContent: ShaderContent;
            let i = 0;
            let varName = "";
            for (i = 0; i < shaderNameList.length; ++i) {
                if (varName != "") {
                    varName += "/";
                }
                varName += shaderNameList[i];
            }
            varName += "/d" + usage.maxDirectLight;
            varName += "/s" + usage.maxSpotLight;
            varName += "/p" + usage.maxPointLight;
            varName += "/b" + usage.maxBone;
            if (!_shaderContentDict[varName]) {
                shaderContent = new ShaderContent();
                shaderContent.name = varName;
                for (i = 0; i < shaderNameList.length; ++i) {
                    let tempContent: ShaderContent = _shaderContentDict[shaderNameList[i]];
                    shaderContent.addContent(tempContent);
                }
            }
            else {
                shaderContent = _shaderContentDict[varName].clone();
            }
            for (i = 0; i < shaderContent.attributeList.length; i++) {
                varName = shaderContent.attributeList[i].varName;
                usage[varName] = shaderContent.attributeList[i];
            }
            for (i = 0; i < shaderContent.varyingList.length; i++) {
                varName = shaderContent.varyingList[i].varName;
                if (!usage[varName]) {
                    usage[varName] = shaderContent.varyingList[i];
                }
            }
            for (i = 0; i < shaderContent.tempList.length; i++) {
                varName = shaderContent.tempList[i].varName;
                usage[varName] = shaderContent.tempList[i];
            }
            for (i = 0; i < shaderContent.uniformList.length; i++) {
                varName = shaderContent.uniformList[i].varName;
                usage[varName] = shaderContent.uniformList[i];
            }
            let constR: ConstVar;
            for (i = 0; i < shaderContent.constList.length; i++) {
                varName = shaderContent.constList[i].varName;
                constR = shaderContent.constList[i];
                usage[varName] = constR;
                switch (varName) {
                    case "max_directLight":
                        constR.value = usage.maxDirectLight;
                        break;
                    case "max_pointLight":
                        constR.value = usage.maxPointLight;
                        break;
                    case "max_spotLight":
                        constR.value = usage.maxSpotLight;
                        break;
                    case "bonesNumber":
                        constR.value = usage.maxBone;
                        break;
                }
            }
            for (i = 0; i < shaderContent.sampler2DList.length; i++) {
                let sampler2D = shaderContent.sampler2DList[i];
                sampler2D.activeTextureIndex = getTexture2DIndex(i);
                sampler2D.index = i;
                usage.sampler2DList.push(sampler2D);
            }
            for (i = 0; i < shaderContent.sampler3DList.length; i++) {
                let sampler3D = shaderContent.sampler3DList[i];
                sampler3D.activeTextureIndex = getTexture2DIndex(shaderContent.sampler2DList.length + i);
                sampler3D.index = shaderContent.sampler2DList.length + i;
                usage.sampler3DList.push(sampler3D);
            }
            synthesisShader(shaderContent, shaderComposer);
            return ShaderPool.getGPUShader(shaderComposer.shaderType, shaderContent.name, shaderContent.source);
        }

        function synthesisShader(content: ShaderContent, shaderComposer: ShaderComposer) {
            let i: number;
            let source = "";
            for (i = 0; i < content.extensionList.length; i++) {
                source += connectExtension(content.extensionList[i]);
            }
            source += "precision highp float;\n";
            for (i = 0; i < content.defineList.length; i++) {
                source += connectDefine(content.defineList[i]);
            }
            for (i = 0; i < content.attributeList.length; i++) {
                source += connectAtt(content.attributeList[i]);
            }
            for (i = 0; i < content.structNames.length; i++) {
                source += connectStruct(content.structDict[content.structNames[i]]);
            }
            for (i = 0; i < content.varyingList.length; i++) {
                source += connectVarying(content.varyingList[i]);
            }
            for (i = 0; i < content.tempList.length; i++) {
                source += connectTemp(content.tempList[i]);
            }
            for (i = 0; i < content.constList.length; i++) {
                source += connectConst(content.constList[i]);
            }
            for (i = 0; i < content.uniformList.length; i++) {
                source += connectUniform(content.uniformList[i]);
            }
            for (i = 0; i < content.sampler2DList.length; i++) {
                let sampler2D = content.sampler2DList[i];
                source += connectSampler(sampler2D);
            }
            for (i = 0; i < content.sampler3DList.length; i++) {
                let sampler3D = content.sampler3DList[i];
                source += connectSampler3D(sampler3D);
            }
            for (i = 0; i < content.funcNames.length; i++) {
                source += content.funcDict[content.funcNames[i]];
            }
            content.source = source;
        }

        function connectAtt(att: Attribute): string {
            return "attribute " + att.valueType + " " + att.name + "; \r\n";
        }

        function connectTemp(tempVar: TmpVar): string {
            if (tempVar.value) {
                return tempVar.valueType + " " + tempVar.name + " = " + tempVar.value + "; \r\n";
            }
            return tempVar.valueType + " " + tempVar.name + "; \r\n";
        }

        function connectStruct(struct: string): string {
            return struct + " \r\n";
        }

        function connectConst(constVar: ConstVar): string {
            return "const " + constVar.valueType + " " + constVar.name + " = " + constVar.value + "; \r\n";
        }

        function connectVarying(varying: Varying): string {
            return "varying " + varying.valueType + " " + varying.name + "; \r\n";
        }

        function connectUniform(unifrom: Uniform): string {
            return "uniform " + unifrom.valueType + " " + unifrom.name + "; \r\n";
        }

        function connectSampler(sampler: Sampler2D): string {
            return "uniform sampler2D " + sampler.name + "; \r\n";
        }

        function connectSampler3D(sampler: Sampler3D): string {
            return "uniform samplerCube " + sampler.name + "; \r\n";
        }

        function connectExtension(extension: Extension): string {
            return "#extension " + extension.name + ":" + extension.value + "\r\n";
        }

        function connectDefine(def: DefineVar): string {
            return def.key + " " + def.name + " " + def.value + "\r\n";
        }

        function getTexture2DIndex(i: number): number {
            switch (i) {
                case 0:
                    return Context3DProxy.gl.TEXTURE0;
                case 1:
                    return Context3DProxy.gl.TEXTURE1;
                case 2:
                    return Context3DProxy.gl.TEXTURE2;
                case 3:
                    return Context3DProxy.gl.TEXTURE3;
                case 4:
                    return Context3DProxy.gl.TEXTURE4;
                case 5:
                    return Context3DProxy.gl.TEXTURE5;
                case 6:
                    return Context3DProxy.gl.TEXTURE6;
                case 7:
                    return Context3DProxy.gl.TEXTURE7;
                case 8:
                    return Context3DProxy.gl.TEXTURE8;
            }
            throw new Error("texture not big then 8");
        }
    }
}
