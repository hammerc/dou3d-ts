namespace dou3d {
    /**
     * 宏定义
     * @author wizardc
     */
    export class DefineVar extends VarRegister {
        public constructor(name: string, value: string) {
            super();
            this.name = name;
            this.computeVarName();
            this.key = "#define";
            this.value = value;
        }
    }
}
