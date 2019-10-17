namespace dou3d {
    /**
     * 
     * @author wizardc
     */
    export class SkeletonAnimationClip {
        /**
         * 每帧的骨架动画
         */
        public poseArray: SkeletonPose[];

        public animationName: string = "";

        // 流数据解析测试
        public sampling: number = 0;
        public boneCount: number = 0;
        public frameDataOffset: number = 0;
        public sourceData: dou.ByteArray;

        private _frameCount: number = 0;
        private _timeLength: number = 0;
        private _skeletonPose: SkeletonPose;

        public constructor() {
            this.poseArray = [];
        }

        public get currentSkeletonPose(): SkeletonPose {
            return this._skeletonPose;
        }

        public get frameCount(): number {
            if (this.poseArray.length > 0) {
                return this.poseArray.length;
            }
            return this._frameCount;
        }

        /**
         * 时间长度
         */
        public get timeLength(): number {
            if (this.poseArray.length > 0) {
                return this.poseArray[this.poseArray.length - 1].frameTime;
            }
            return this._timeLength;
        }

        /**
         * 骨骼数量
         */
        public get jointNum(): number {
            if (this.poseArray.length > 0) {
                return this.poseArray[0].joints.length;
            }
            return this.boneCount;
        }

        public findJointIndex(name: string): number {
            if (!this._skeletonPose) {
                if (this.poseArray.length <= 0) {
                    return -1;
                }
                return this.poseArray[0].findJointIndex(name);
            }
            return this._skeletonPose.findJointIndex(name);
        }

        public addSkeletonPose(skeletonPose: SkeletonPose): void {
            this.poseArray.push(skeletonPose);
        }

        public buildInitialSkeleton(boneNameArray: string[], parentBoneNameArray: string[], frameCount: number): void {
            if (this._skeletonPose) {
                return;
            }
            this._frameCount = frameCount;
            this._skeletonPose = new SkeletonPose();
            for (let j = 0; j < this.boneCount; j++) {
                let jointPose = new Joint(boneNameArray[j]);
                jointPose.parent = parentBoneNameArray[j];
                jointPose.parentIndex = this._skeletonPose.findJointIndex(jointPose.parent);
                this._skeletonPose.joints.push(jointPose);
            }
            this.sourceData.position = this.frameDataOffset + (40 * this.boneCount + 4) * (this.frameCount - 1);
            this._timeLength = this.sourceData.readInt() / 60 / 80 * 1000;
        }

        public getSkeletonPose(index: number): SkeletonPose {
            if (this.poseArray.length > 0) {
                return this.poseArray[index];
            }
            if (index < 0 || index >= this.frameCount * 2) {
                return null;
            }
            index = Math.floor(index / 2);
            return this.readSkeletonPose(index, this._skeletonPose);
        }

        private readSkeletonPose(index: number, skeletonPose: SkeletonPose): SkeletonPose {
            // 每帧数据需要 40 * 骨骼数 + 4字节
            this.sourceData.position = this.frameDataOffset + (40 * this.boneCount + 4) * index;
            skeletonPose.frameTime = this.sourceData.readInt() / 60 / 80 * 1000;
            for (let j = 0; j < this.boneCount; j++) {
                //读取旋转四元数分量
                let orientation = dou.recyclable(Quaternion);
                orientation.x = this.sourceData.readFloat();
                orientation.y = this.sourceData.readFloat();
                orientation.z = this.sourceData.readFloat();
                orientation.w = this.sourceData.readFloat();

                //读取缩放分量
                let scale = dou.recyclable(Vector3);
                scale.x = this.sourceData.readFloat();
                scale.y = this.sourceData.readFloat();
                scale.z = this.sourceData.readFloat();

                //读取平移分量
                let translation = dou.recyclable(Vector3);
                translation.x = this.sourceData.readFloat();
                translation.y = this.sourceData.readFloat();
                translation.z = this.sourceData.readFloat();

                skeletonPose.joints[j].worldMatrixValid = false;
                skeletonPose.joints[j].buildLocalMatrix(scale, orientation, translation);

                orientation.recycle();
                scale.recycle();
                translation.recycle();
            }
            skeletonPose.calculateJointWorldMatrix();
            return skeletonPose;
        }

        public clone(): SkeletonAnimationClip {
            let skeletonAnimationClip = new SkeletonAnimationClip();
            skeletonAnimationClip.animationName = this.animationName;
            skeletonAnimationClip.poseArray = this.poseArray;
            skeletonAnimationClip.sampling = this.sampling;
            skeletonAnimationClip.boneCount = this.boneCount;
            skeletonAnimationClip._frameCount = this._frameCount;
            skeletonAnimationClip.frameDataOffset = this.frameDataOffset;
            skeletonAnimationClip.sourceData = this.sourceData;
            skeletonAnimationClip._timeLength = this._timeLength;
            skeletonAnimationClip._skeletonPose = this._skeletonPose;
            if (this._skeletonPose) {
                skeletonAnimationClip._skeletonPose = this._skeletonPose.clone();
            }
            return skeletonAnimationClip;
        }
    }
}
