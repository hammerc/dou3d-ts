namespace dou3d {
    /**
     * 骨骼关节
     * * 属于骨架类的组成部分
     * @author wizardc
     */
    export class Joint {
        /**
         * 骨骼名称
         */
        public name: string;

        /**
         * 父骨骼名称
         */
        public parent: string;

        /**
         * 父骨骼索引编号
         */
        public parentIndex: number;

        /**
         * 骨骼缩放量
         */
        public scale: Vector3;

        /**
         * 骨骼旋转量
         */
        public orientation: Quaternion;

        /**
         * 骨骼平移量
         */
        public translation: Vector3;

        /**
         * 骨骼本地矩阵
         */
        public localMatrix: Matrix4;

        /**
         * 骨骼逆矩阵
         */
        public inverseMatrix: Matrix4;

        /**
         * 骨骼世界矩阵
         */
        public worldMatrix: Matrix4;

        /**
         * 骨骼世界矩阵是否有效
         */
        public worldMatrixValid: boolean;

        public constructor(name: string) {
            this.name = name;
            this.parentIndex = -1;
            this.scale = new Vector3(1, 1, 1);
            this.orientation = new Quaternion();
            this.translation = new Vector3();
            this.localMatrix = new Matrix4();
            this.worldMatrix = new Matrix4();
            this.worldMatrixValid = false;
        }

        /**
         * 构建骨骼本地矩阵
         */
        public buildLocalMatrix(scale: Vector3, rotation: Vector3 | Quaternion, translation: Vector3): void {
            this.scale.copy(scale);
            this.translation.copy(translation);
            if (rotation instanceof Vector3) {
                this.orientation.fromEuler(rotation.x * MathUtil.DEG_RAD, rotation.y * MathUtil.DEG_RAD, rotation.z * MathUtil.DEG_RAD, EulerOrder.ZYX);
            }
            else {
                this.orientation.copy(rotation);
            }
            this.localMatrix.compose(this.translation, this.orientation, this.scale);
            this.worldMatrixValid = false;
        }

        /**
         * 构建骨骼逆矩阵
         */
        public buildInverseMatrix(scale: Vector3, rotation: Vector3 | Quaternion, translation: Vector3): void {
            this.inverseMatrix = this.inverseMatrix || new Matrix4();
            if (rotation instanceof Vector3) {
                let quaternion = dou.recyclable(Quaternion);
                quaternion.fromEuler(rotation.x * MathUtil.DEG_RAD, rotation.y * MathUtil.DEG_RAD, rotation.z * MathUtil.DEG_RAD, EulerOrder.ZYX);
                this.inverseMatrix.compose(translation, quaternion, scale);
                quaternion.recycle();
            }
            else {
                this.inverseMatrix.compose(translation, rotation, scale);
            }
        }

        public clone(): Joint {
            let joint = new Joint(this.name);
            joint.parent = this.parent;
            joint.parentIndex = this.parentIndex;
            joint.scale.copy(this.scale);
            joint.orientation.copy(this.orientation);
            joint.translation.copy(this.translation);
            joint.localMatrix.copy(this.localMatrix);
            joint.worldMatrix.copy(this.worldMatrix);
            joint.worldMatrixValid = this.worldMatrixValid;
            return joint;
        }
    }
}
