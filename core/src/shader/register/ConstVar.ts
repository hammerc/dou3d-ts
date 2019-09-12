namespace dou3d {
    /**
     * 常量
     * @author wizardc
     */
    export class ConstVar extends VarRegister {
        public constructor(name: string, valueType: string, value: string) {
            super();
            this.name = name;
            this.computeVarName();
            this.key = "const";
            this.valueType = valueType;
            this.value = value;
        }
    }
}
