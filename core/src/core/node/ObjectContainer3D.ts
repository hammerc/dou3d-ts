namespace dou3d {
    /**
     * 3D 容器对象
     * @author wizardc
     */
    export class ObjectContainer3D extends Object3D {
        protected _children: Object3D[];

        public constructor() {
            super();

            this._children = [];
        }

        public get numChildren(): number {
            return this._children.length;
        }

        public invalidGlobalTransform(): void {
            super.invalidGlobalTransform();
            for (let child of this._children) {
                child.invalidTransform();
            }
        }

        public addChild(child: Object3D): Object3D {
            if (this._children.indexOf(child) != -1) {
                return child;
            }
            if (child.parent) {
                child.parent.removeChild(child);
            }
            child.setParent(this);
            child.invalidTransform();
            this._children.push(child);
            return child;
        }

        public getChildAt(index: number): Object3D {
            return this._children[index];
        }

        public getChildIndex(child: Object3D): number {
            return this._children.indexOf(child);
        }

        public removeChild(child: Object3D): Object3D {
            let index = this._children.indexOf(child);
            if (index == -1) {
                return child;
            }
            this._children.splice(index, 1);
            child.setParent(null);
            child.invalidTransform();
            return child;
        }

        public removeChildAt(index: number): Object3D {
            if (index < 0 || index >= this._children.length) {
                return null;
            }
            let child = this._children[index];
            this._children.splice(index, 1);
            child.setParent(null);
            child.invalidTransform();
            return child;
        }

        public removeAllChildren(): void {
            while (this._children.length > 0) {
                this.removeChildAt(0);
            }
        }

        public dispose(): void {
            super.dispose();
            for (let child of this._children) {
                child.dispose();
            }
            this.removeAllChildren();
        }
    }
}
