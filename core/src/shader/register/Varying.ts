namespace dou3d {
    /**
     * Varying 属性
     * @author wizardc
     */
    export class Varying extends VarRegister {
        public constructor(name: string, valueType: string) {
            super();
            this.name = name;
            this.computeVarName();
            this.key = "varying";
            this.valueType = valueType;
        }
    }
}
