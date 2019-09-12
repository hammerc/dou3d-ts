namespace dou3d {
    /**
     * 扩展
     * @author wizardc
     */
    export class Extension extends VarRegister {
        public constructor(name: string) {
            super();
            this.name = name;
            this.computeVarName();
            this.key = "#extension";
        }
    }
}
