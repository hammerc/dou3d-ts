namespace dou3d {
    /**
     * 骨架类
     * * 其中包含若干个 Joint (骨骼关节) 对象
     * @author wizardc
     */
    export class Skeleton {
        /**
         * 骨架包含的骨骼
         */
        public joints: Joint[];

        public constructor() {
            this.joints = [];
        }

        /**
         * 骨骼数量
         */
        public get jointNum(): number {
            return this.joints.length;
        }

        /**
         * 通过名称查找指定骨骼
         */
        public findJoint(name: string): Joint {
            for (let i = 0; i < this.joints.length; i++) {
                if (this.joints[i].name == name) {
                    return this.joints[i];
                }
            }
            return null;
        }

        /**
         * 通过名称查找骨骼索引编号
         */
        public findJointIndex(name: string): number {
            for (let i = 0; i < this.joints.length; i++) {
                if (this.joints[i].name == name) {
                    return i;
                }
            }
            return -1;
        }

        public clone(): Skeleton {
            let skeleton = new Skeleton();
            for (let i = 0; i < this.joints.length; i++) {
                skeleton.joints.push(this.joints[i].clone());
            }
            return skeleton;
        }
    }
}
