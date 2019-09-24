namespace dou3d {
    /**
     * 引用计数基类
     * @author wizardc
     */
    export abstract class Reference extends dou.HashObject {
        protected _count: number = 0;

        public get canDispose(): boolean {
            return this._count <= 0;
        }

        public incRef(): void {
            this._count++;
        }

        public decRef(): void {
            if (this._count - 1 >= 0) {
                this._count--;
            }
        }
    }
}
