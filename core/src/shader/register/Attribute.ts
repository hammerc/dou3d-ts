namespace dou3d {
    /**
     * 变量属性
     * @author wizardc
     */
    export class Attribute extends VarRegister {
        public constructor(name: string, valueType: string) {
            super();
            this.name = name;
            this.computeVarName();
            this.key = "attribute";
            this.valueType = valueType;
        }
    }
}
