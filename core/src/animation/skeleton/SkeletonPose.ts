namespace dou3d {
    /**
     * 单帧骨架动画数据，若干个SkeletonPose组合成SkeletonAnimationClip， 做为骨骼骨架序列数据
     * @author wizardc
     */
    export class SkeletonPose {
        /**
         * 骨架包含的骨骼
         */
        public joints: Joint[];

        /**
         * 当前骨架的帧时间
         */
        public frameTime: number;

        public constructor() {
            this.joints = [];
        }

        /**
         * 骨架插值计算
         */
        public lerp(skeletonPoseA: SkeletonPose, skeletonPoseB: SkeletonPose, t: number): SkeletonPose {
            if (skeletonPoseA.joints.length != skeletonPoseB.joints.length) {
                throw Error("Bone number does not match!");
            }
            if (this.joints.length < skeletonPoseA.joints.length) {
                for (let i = this.joints.length; i <= skeletonPoseA.joints.length; ++i) {
                    this.joints.push(new Joint(""));
                }
            }
            this.frameTime = (skeletonPoseB.frameTime - skeletonPoseA.frameTime) * t + skeletonPoseA.frameTime;
            for (let i = 0; i < skeletonPoseA.joints.length; ++i) {
                let jointA = skeletonPoseA.joints[i];
                let jointB = skeletonPoseB.joints[i];
                let joint = this.joints[i];
                joint.name = jointA.name;
                joint.parent = jointA.parent;
                joint.parentIndex = jointA.parentIndex;
                Vector3.lerp(jointA.scale, jointB.scale, t, joint.scale);
                Quaternion.slerp(jointA.orientation, jointB.orientation, t, joint.orientation);
                Vector3.slerp(jointA.translation, jointB.translation, t, joint.translation);
                joint.buildLocalMatrix(joint.scale, joint.orientation, joint.translation);
                joint.worldMatrixValid = jointA.worldMatrixValid;
                if (joint.worldMatrixValid) {
                    let translationA = dou.recyclable(Vector3);
                    let rotationA = dou.recyclable(Quaternion);
                    let scaleA = dou.recyclable(Vector3);
                    jointA.worldMatrix.decompose(translationA, rotationA, scaleA);
                    let translationB = dou.recyclable(Vector3);
                    let rotationB = dou.recyclable(Quaternion);
                    let scaleB = dou.recyclable(Vector3);
                    jointB.worldMatrix.decompose(translationB, rotationB, scaleB);
                    let pos = dou.recyclable(Vector3);
                    Vector3.slerp(translationA, translationB, t, pos);
                    let rotation = dou.recyclable(Quaternion);
                    Quaternion.slerp(rotationA, rotationB, t, rotation);
                    let scale = dou.recyclable(Vector3);
                    Vector3.lerp(scaleA, scaleB, t, scale);
                    joint.worldMatrix.compose(pos, rotation, scale);
                    translationA.recycle();
                    rotationA.recycle();
                    scaleA.recycle();
                    translationB.recycle();
                    rotationB.recycle();
                    scaleB.recycle();
                    pos.recycle();
                    rotation.recycle();
                    scale.recycle();
                }
            }
            return this;
        }

        /**
         * 计算当前骨架内所有骨骼的世界矩阵
         */
        public calculateJointWorldMatrix(): void {
            for (let i = 0; i < this.joints.length; ++i) {
                this.calculateAbsoluteMatrix(i);
            }
        }

        private calculateAbsoluteMatrix(jointIndex: number): void {
            let joint = this.joints[jointIndex];
            if (joint.parentIndex >= 0) {
                this.calculateAbsoluteMatrix(joint.parentIndex);
            }
            if (!joint.worldMatrixValid) {
                joint.worldMatrix.copy(joint.localMatrix);
                if (joint.parentIndex >= 0) {
                    joint.worldMatrix.multiply(this.joints[joint.parentIndex].worldMatrix);
                }
                joint.worldMatrixValid = true;
            }
        }

        /**
         * 更新GPU所需的骨骼缓存数据
         */
        public updateGPUCacheData(skeleton: Skeleton, skeletonMatrixData: Float32Array, offset: Vector3): Float32Array {
            for (let i = 0; i < skeleton.joints.length; ++i) {
                for (let j = 0; j < this.joints.length; ++j) {
                    if (skeleton.joints[i].name != this.joints[j].name) {
                        continue;
                    }
                    let matrix = dou.recyclable(Matrix4);
                    matrix.copy(skeleton.joints[i].inverseMatrix);
                    matrix.multiply(this.joints[j].worldMatrix);
                    let translation = dou.recyclable(Vector3);
                    let rotation = dou.recyclable(Quaternion);
                    let scale = dou.recyclable(Vector3);
                    matrix.decompose(translation, rotation, scale);
                    skeletonMatrixData[i * 8 + 0] = rotation.x;
                    skeletonMatrixData[i * 8 + 1] = rotation.y;
                    skeletonMatrixData[i * 8 + 2] = rotation.z;
                    skeletonMatrixData[i * 8 + 3] = rotation.w;
                    skeletonMatrixData[i * 8 + 4] = translation.x - offset.x;
                    skeletonMatrixData[i * 8 + 5] = translation.y - offset.y;
                    skeletonMatrixData[i * 8 + 6] = translation.z - offset.z;
                    skeletonMatrixData[i * 8 + 7] = 1;
                    matrix.recycle();
                    translation.recycle();
                    rotation.recycle();
                    scale.recycle();
                    break;
                }
            }
            return skeletonMatrixData;
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

        /**
         * 重置骨骼世界矩阵
         */
        public resetWorldMatrix(): void {
            for (let i = 0; i < this.joints.length; i++) {
                this.joints[i].worldMatrixValid = false;
            }
        }

        public clone(): SkeletonPose {
            let skeletonPose = new SkeletonPose();
            skeletonPose.frameTime = this.frameTime;
            for (let i = 0; i < this.joints.length; i++) {
                skeletonPose.joints.push(this.joints[i].clone());
            }
            return skeletonPose;
        }
    }
}
