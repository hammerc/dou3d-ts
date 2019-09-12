namespace dou3d {
    /**
     * 临时变量
     * @author wizardc
     */
    export class TmpVar extends VarRegister {
        public constructor(name: string, valueType: string) {
            super();
            this.name = name;
            this.computeVarName();
            this.key = "";
            this.valueType = valueType;
        }
    }
}
