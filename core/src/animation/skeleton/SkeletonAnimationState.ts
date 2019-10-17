namespace dou3d {
    /**
     * 
     * @author wizardc
     */
    export class SkeletonAnimationState implements IAnimationState {
        /**
         * State 名称
         */
        public name: string = "";

        /**
         * 融合权重值
         */
        public weight: number = 1.0;

        private _timeLength: number = 0;
        private _timePosition: number = 0;
        private _skeletonAnimation: SkeletonAnimation = null;
        private _skeletonAnimationClip: SkeletonAnimationClip = null;

        public constructor(name: string) {
            this.name = name;
        }

        /**
         * 骨骼动画控制器
         */
        public get skeletonAnimation(): SkeletonAnimation {
            return this._skeletonAnimation;
        }

        /**
         * 骨骼动画控制器
         */
        public set skeletonAnimation(skeletonAnimation: SkeletonAnimation) {
            this._skeletonAnimation = skeletonAnimation;
        }

        /**
         * 骨骼动画剪辑
         */
        public get skeletonAnimationClip(): SkeletonAnimationClip {
            return this._skeletonAnimationClip;
        }

        /**
         * 动画时间长度
         */
        public get timeLength(): number {
            return this._timeLength;
        }

        /**
         * 添加 SkeletonAnimationClip 对象
         */
        public addAnimationClip(animationClip: SkeletonAnimationClip): void {
            if (animationClip.sourceData) {
                this._skeletonAnimationClip = animationClip;
                this._timeLength = this._skeletonAnimationClip.timeLength;
            }
            else {
                if (!this._skeletonAnimationClip) {
                    this._skeletonAnimationClip = new SkeletonAnimationClip();
                }
                else {
                    this._skeletonAnimationClip.poseArray = [];
                }
                if (animationClip.poseArray.length < 2) {
                    this._skeletonAnimationClip.poseArray = animationClip.poseArray;
                }
                else {
                    let skeletonPoseA = animationClip.poseArray[0];
                    let skeletonPoseB = animationClip.poseArray[1];
                    let nCount = Math.round((skeletonPoseB.frameTime - skeletonPoseA.frameTime) / SkeletonAnimation.fps);
                    if (nCount <= 1) {
                        this._skeletonAnimationClip.poseArray = animationClip.poseArray;
                    }
                    else {
                        for (let i = 1; i < animationClip.poseArray.length; ++i) {
                            skeletonPoseA = animationClip.poseArray[i - 1];
                            skeletonPoseB = animationClip.poseArray[i];
                            for (let j = 0; j < nCount; j++) {
                                let skeletonPose: SkeletonPose = new SkeletonPose();
                                skeletonPose.lerp(skeletonPoseA, skeletonPoseB, j / nCount);
                                this._skeletonAnimationClip.poseArray.push(skeletonPose);
                            }
                        }
                        this._skeletonAnimationClip.poseArray.push(animationClip.poseArray[animationClip.poseArray.length - 1].clone());
                    }
                }
                this._timeLength = this._skeletonAnimationClip.poseArray[this._skeletonAnimationClip.poseArray.length - 1].frameTime;
            }
        }

        /**
         * 时间位置
         */
        public get timePosition(): number {
            return this._timePosition;
        }

        /**
         * 时间位置
         */
        public set timePosition(value: number) {
            if (value == this._timePosition) {
                return;
            }
            this._timePosition = value;
            if (this._skeletonAnimation.isLoop) {
                this._timePosition = value % this._timeLength;
                if (this._timePosition < 0) {
                    this._timePosition += this._timeLength;
                }
            }
            else {
                if (this._timePosition < 0) {
                    this._timePosition = 0;
                    if (this.name == this._skeletonAnimation.currentAnimName) {
                        this._skeletonAnimation.stop();
                        this._skeletonAnimation.dispatch(dou.Event.COMPLETE);
                    }
                }
                else if (this._timePosition > this._timeLength) {
                    this._timePosition = this._timeLength;
                    if (this.name == this._skeletonAnimation.currentAnimName) {
                        this._skeletonAnimation.stop();
                        this._skeletonAnimation.dispatch(dou.Event.COMPLETE);
                    }
                }
            }
        }

        /**
         * 获取当前帧的SkeletonPose
         */
        public get currentSkeletonPose(): SkeletonPose {
            return this._skeletonAnimationClip.getSkeletonPose(this.currentFrameIndex);
        }

        /**
         * 获取上一帧的SkeletonPose
         */
        public get previousSkeletonPose(): SkeletonPose {
            let index = this.currentFrameIndex;
            if (this._skeletonAnimation.speed > 0) {
                index--;
                if (index < 0) {
                    index = this.frameNum - index;
                }
            }
            else {
                index = (index + 1) % this.frameNum;
            }
            return this._skeletonAnimationClip.getSkeletonPose(index);
        }

        /**
         * 获取当前帧索引
         */
        public get currentFrameIndex(): number {
            return Math.floor(this._timePosition / SkeletonAnimation.fps);
        }

        /**
         * 获取帧数量
         */
        public get frameNum(): number {
            if (!this._skeletonAnimationClip) {
                return 0;
            }
            return this._skeletonAnimationClip.frameCount;
        }

        /**
         * 获取SkeletonPose
         */
        public getSkeletonPose(index: number): SkeletonPose {
            return this._skeletonAnimationClip.getSkeletonPose(index);
        }

        /**
         * 克隆SkeletonAnimationState对象
         */
        public clone(): SkeletonAnimationState {
            let skeletonAnimationState = new SkeletonAnimationState(this.name);
            skeletonAnimationState._timeLength = this._timeLength;
            skeletonAnimationState._skeletonAnimation = this._skeletonAnimation;
            skeletonAnimationState._skeletonAnimationClip = this._skeletonAnimationClip;
            return skeletonAnimationState;
        }
    }
}
