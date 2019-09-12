namespace dou3d {
    /**
     * 解析着色器并对其内容进行分类
     * 方便后面进行着色器合并
     * @author wizardc
     */
    export class ShaderContent {
        public name: string = "";

        public source: string = "";

        public funcNames: string[] = [];
        public funcDict: { [key: string]: string } = {};

        public structNames: string[] = [];
        public structDict: { [key: string]: string } = {};

        public attributeList: Attribute[] = [];

        public varyingList: Varying[] = [];

        public uniformList: Uniform[] = [];

        public constList: ConstVar[] = [];

        public tempList: TmpVar[] = [];

        public sampler2DList: Sampler2D[] = [];
        public sampler3DList: Sampler3D[] = [];

        public extensionList: Extension[] = [];
        public defineList: DefineVar[] = [];

        /**
         * 增加一个变量对象
         */
        public addVar(sVar: VarRegister): void {
            if (sVar.key == "attribute") {
                this.attributeList.push(sVar);
            }
            else if (sVar.key == "varying") {
                this.varyingList.push(sVar);
            }
            else if (sVar.key == "uniform") {
                this.uniformList.push(sVar);
            }
            else if (sVar.key == "const") {
                this.constList.push(sVar);
            }
            else if (sVar.key == "sampler2D") {
                this.sampler2DList.push(sVar);
            }
            else if (sVar.key == "samplerCube") {
                this.sampler3DList.push(sVar);
            }
            else if (sVar.key == "#extension") {
                this.extensionList.push(sVar);
            }
            else if (sVar.key == "#define") {
                this.defineList.push(sVar);
            }
            else {
                this.tempList.push(sVar);
            }
        }

        /**
         * 增加一个函数
         */
        public addFunc(name: string, func: string): void {
            if (!this.funcDict[name]) {
                this.funcDict[name] = func;
                this.funcNames.push(name);
            }
            else {
                let newfunc = this.mergeMainFunc(this.funcDict[name], func);
                this.funcDict[name] = newfunc;
            }
            if (this.funcDict["main"]) {
                let index: number = this.funcNames.indexOf("main");
                this.funcNames.splice(index, 1);
                this.funcNames.push("main");
            }
        }

        /**
         * 增加一个结构体
         */
        public addStruct(name: string, structStr: string): void {
            if (!this.structDict[name]) {
                this.structDict[name] = structStr;
                this.structNames.push(name);
            }
            else {
                if (DEBUG) {
                    console.log("<" + name + ">" + "struct重复");
                }
            }
        }

        /**
         * 合并一个shader内容
         */
        public addContent(otherContent: ShaderContent): void {
            for (let i = 0; i < otherContent.structNames.length; ++i) {
                this.addStruct(otherContent.structNames[i], otherContent.structDict[otherContent.structNames[i]]);
            }
            for (let i = 0; i < otherContent.funcNames.length; ++i) {
                this.addFunc(otherContent.funcNames[i], otherContent.funcDict[otherContent.funcNames[i]]);
            }
            for (let i = 0; i < otherContent.attributeList.length; ++i) {
                let isAdd = true;
                for (let j = 0; j < this.attributeList.length; ++j) {
                    if (otherContent.attributeList[i].name == this.attributeList[j].name) {
                        if (DEBUG) {
                            if (otherContent.attributeList[i].valueType != this.attributeList[j].valueType || otherContent.attributeList[i].key != this.attributeList[j].key) {
                                console.log(otherContent.attributeList[i].name + "=> type:" + otherContent.attributeList[i].valueType + " " + this.attributeList[j].valueType + " => key:" + otherContent.attributeList[i].key + " " + this.attributeList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.attributeList.push(otherContent.attributeList[i].clone());
                }
            }
            for (let i = 0; i < otherContent.varyingList.length; ++i) {
                let isAdd = true;
                for (let j = 0; j < this.varyingList.length; ++j) {
                    if (otherContent.varyingList[i].name == this.varyingList[j].name) {
                        if (DEBUG) {
                            if (otherContent.varyingList[i].valueType != this.varyingList[j].valueType || otherContent.varyingList[i].key != this.varyingList[j].key) {
                                console.log(otherContent.varyingList[i].name + "=> type:" + otherContent.varyingList[i].valueType + " " + this.varyingList[j].valueType + " => key:" + otherContent.varyingList[i].key + " " + this.varyingList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.varyingList.push(otherContent.varyingList[i].clone());
                }
            }
            for (let i = 0; i < otherContent.uniformList.length; ++i) {
                let isAdd = true;
                for (let j = 0; j < this.uniformList.length; ++j) {
                    if (otherContent.uniformList[i].name == this.uniformList[j].name) {
                        if (DEBUG) {
                            if (otherContent.uniformList[i].valueType != this.uniformList[j].valueType || otherContent.uniformList[i].key != this.uniformList[j].key) {
                                console.log(otherContent.uniformList[i].name + "=> type:" + otherContent.uniformList[i].valueType + " " + this.uniformList[j].valueType + " => key:" + otherContent.uniformList[i].key + " " + this.uniformList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.uniformList.push(otherContent.uniformList[i].clone());
                }
            }
            for (let i = 0; i < otherContent.constList.length; ++i) {
                let isAdd = true;
                for (let j = 0; j < this.constList.length; ++j) {
                    if (otherContent.constList[i].name == this.constList[j].name) {
                        if (DEBUG) {
                            if (otherContent.constList[i].valueType != this.constList[j].valueType || otherContent.constList[i].key != this.constList[j].key) {
                                console.log(otherContent.constList[i].name + "=> type:" + otherContent.constList[i].valueType + " " + this.constList[j].valueType + " => key:" + otherContent.constList[i].key + " " + this.constList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.constList.push(otherContent.constList[i].clone());
                }
            }
            for (let i = 0; i < otherContent.tempList.length; ++i) {
                let isAdd = true;
                for (let j = 0; j < this.tempList.length; ++j) {
                    if (otherContent.tempList[i].name == this.tempList[j].name) {
                        if (DEBUG) {
                            if (otherContent.tempList[i].valueType != this.tempList[j].valueType || otherContent.tempList[i].key != this.tempList[j].key) {
                                console.log(otherContent.tempList[i].name + "=> type:" + otherContent.tempList[i].valueType + " " + this.tempList[j].valueType + " => key:" + otherContent.tempList[i].key + " " + this.tempList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.tempList.push(otherContent.tempList[i].clone());
                }
            }
            for (let i = 0; i < otherContent.sampler2DList.length; ++i) {
                let isAdd = true;
                for (let j = 0; j < this.sampler2DList.length; ++j) {
                    if (otherContent.sampler2DList[i].name == this.sampler2DList[j].name) {
                        if (DEBUG) {
                            if (otherContent.sampler2DList[i].valueType != this.sampler2DList[j].valueType || otherContent.sampler2DList[i].key != this.sampler2DList[j].key) {
                                console.log(otherContent.sampler2DList[i].name + "=> type:" + otherContent.sampler2DList[i].valueType + " " + this.sampler2DList[j].valueType + " => key:" + otherContent.sampler2DList[i].key + " " + this.sampler2DList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.sampler2DList.push(otherContent.sampler2DList[i].clone());
                }
            }
            for (let i = 0; i < otherContent.sampler3DList.length; ++i) {
                let isAdd = true;
                for (let j = 0; j < this.sampler3DList.length; ++j) {
                    if (otherContent.sampler3DList[i].name == this.sampler3DList[j].name) {
                        if (DEBUG) {
                            if (otherContent.sampler2DList[i].valueType != this.sampler3DList[j].valueType || otherContent.sampler3DList[i].key != this.sampler3DList[j].key) {
                                console.log(otherContent.sampler3DList[i].name + "=> type:" + otherContent.sampler3DList[i].valueType + " " + this.sampler3DList[j].valueType + " => key:" + otherContent.sampler3DList[i].key + " " + this.sampler3DList[j].key);
                            }
                        }
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.sampler3DList.push(otherContent.sampler3DList[i].clone());
                }
            }
            for (let i = 0; i < otherContent.extensionList.length; ++i) {
                let isAdd = true;
                for (let j = 0; j < this.extensionList.length; ++j) {
                    if (otherContent.extensionList[i].name == this.extensionList[j].name) {
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.extensionList.push(otherContent.extensionList[i].clone());
                }
            }
            for (let i = 0; i < otherContent.defineList.length; ++i) {
                let isAdd = true;
                for (let j = 0; j < this.defineList.length; ++j) {
                    if (otherContent.defineList[i].name == this.defineList[j].name) {
                        isAdd = false;
                        break;
                    }
                }
                if (isAdd) {
                    this.defineList.push(otherContent.defineList[i].clone());
                }
            }
        }

        private mergeMainFunc(func1: string, func2: string): string {
            let ret = func1;
            let func = "";
            let s_pos = func2.indexOf("{");
            let e_pos = func2.lastIndexOf("}");
            s_pos++;
            func = func2.slice(s_pos, e_pos);
            s_pos = ret.lastIndexOf("}");
            let f_func = ret.substr(0, s_pos);
            let s_func = ret.substr(s_pos, ret.length - s_pos);
            ret = f_func;
            ret += func;
            let line = "";
            ret += line;
            ret += s_func;
            return ret;
        }

        public clone(): ShaderContent {
            let content = new ShaderContent();
            content.name = this.name;
            content.source = this.source;
            for (let i = 0; i < this.funcNames.length; ++i) {
                content.funcNames.push(this.funcNames[i]);
            }
            for (let key in this.funcDict) {
                content.funcDict[key] = this.funcDict[key];
            }
            for (let i = 0; i < this.structNames.length; ++i) {
                content.structNames.push(this.structNames[i]);
            }
            for (let key in this.structDict) {
                content.structDict[key] = this.structDict[key];
            }
            for (let i = 0; i < this.attributeList.length; ++i) {
                content.attributeList.push(this.attributeList[i].clone());
            }
            for (let i = 0; i < this.varyingList.length; ++i) {
                content.varyingList.push(this.varyingList[i].clone());
            }
            for (let i = 0; i < this.uniformList.length; ++i) {
                content.uniformList.push(this.uniformList[i].clone());
            }
            for (let i = 0; i < this.constList.length; ++i) {
                content.constList.push(this.constList[i].clone());
            }
            for (let i = 0; i < this.tempList.length; ++i) {
                content.tempList.push(this.tempList[i].clone());
            }
            for (let i = 0; i < this.sampler2DList.length; ++i) {
                content.sampler2DList.push(this.sampler2DList[i].clone());
            }
            for (let i = 0; i < this.sampler3DList.length; ++i) {
                content.sampler3DList.push(this.sampler3DList[i].clone());
            }
            for (let i = 0; i < this.attributeList.length; ++i) {
                content.attributeList.push(this.attributeList[i].clone());
            }
            for (let i = 0; i < this.extensionList.length; ++i) {
                content.extensionList.push(this.extensionList[i].clone());
            }
            for (let i = 0; i < this.defineList.length; ++i) {
                content.defineList.push(this.defineList[i].clone());
            }
            return content;
        }
    }
}
