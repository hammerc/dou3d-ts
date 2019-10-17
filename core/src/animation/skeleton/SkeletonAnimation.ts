namespace dou3d {
    /**
     * 骨骼动画控制类
     * @author wizardc
     */
    export class SkeletonAnimation extends dou.EventDispatcher implements IAnimation {
        /**
         * 动画速率
         */
        public static fps: number = 1000 / 60;

        /**
         * 播放速度
         */
        public speed: number = 1;

        public isLoop: boolean = true;
        public delay: number;

        private _currentAnimName: string;
        private _isPlay: boolean = false;
        private _animTime: number = 0;
        private _animStateNames: string[] = [];
        private _animStates: SkeletonAnimationState[] = [];
        private _blendSpeed: number = 0;//300;
        private _blendSkeleton: SkeletonPose = null;
        private _blendList: SkeletonAnimationState[] = [];
        private _bindList: { [jointIndex: number]: Array<Object3D> } = {};
        private _changeFrameTime: number = 0;
        private _oldFrameIndex: number = 0;
        private _movePosIndex: number = -1;
        private _movePosObject3D: Object3D = null;
        private _movePosition: Vector3 = new Vector3();
        private _resetMovePos: boolean = true;
        private _currentSkeletonPose: SkeletonPose = null;
        private _oldTime: number = 0;

        public constructor() {
            super();
            this._isPlay = false;
        }

        /**
         * 骨架骨骼数量
         */
        public get jointNum(): number {
            return 48;
        }

        /**
         * 动画名列表
         */
        public get animStateNames(): string[] {
            return this._animStateNames;
        }

        /**
         * 动画状态对象列表
         */
        public get animStates(): SkeletonAnimationState[] {
            return this._animStates;
        }

        /**
         * 动画时间
         */
        public set animTime(value: number) {
            if (this._blendList.length <= 0) {
                return;
            }
            if (this._blendList[this._blendList.length - 1].timePosition == value) {
                return;
            }
            let delay = value - this._animTime;
            if (this._blendSpeed <= 0) {
                if (this._blendList.length > 1) {
                    this._blendList.splice(0, this._blendList.length - 1);
                }
                this._blendList[0].weight = 1.0;
                this._blendList[0].timePosition += delay;
            }
            else {
                let blendSpeed = Math.abs(delay / this._blendSpeed);
                for (let i = 0; i < this._blendList.length; ++i) {
                    let animationState = this._blendList[i];
                    if (i != this._blendList.length - 1) {
                        animationState.weight = Math.max(0, animationState.weight - blendSpeed);
                        if (animationState.weight <= 0) {
                            this._blendList.splice(i, 1);
                            --i;
                            continue;
                        }
                    }
                    else {
                        animationState.weight = Math.min(1, animationState.weight + blendSpeed);
                    }
                }
                this._blendList[this._blendList.length - 1].timePosition += delay;
            }
            this._animTime = this._blendList[this._blendList.length - 1].timePosition;
            let animationStateA = this._blendList[0];
            let currentSkeletonA = animationStateA.currentSkeletonPose;
            if (this._blendList.length <= 1) {
                if (!this._blendSkeleton) {
                    this._blendSkeleton = currentSkeletonA.clone();
                }
                this.updateBindList(currentSkeletonA);
                this.updateMovePos(currentSkeletonA);
                this._currentSkeletonPose = currentSkeletonA;
            }
            else {
                let animationStateB = this._blendList[1];
                let currentSkeletonB = animationStateB.currentSkeletonPose;
                if (!this._blendSkeleton) {
                    this._blendSkeleton = currentSkeletonA.clone();
                }
                this._blendSkeleton.lerp(currentSkeletonA, currentSkeletonB, animationStateB.weight);
                this._blendSkeleton.resetWorldMatrix();
                this._blendSkeleton.calculateJointWorldMatrix();
                this.updateBindList(this._blendSkeleton);
                this.updateMovePos(this._blendSkeleton);
                this._currentSkeletonPose = this._blendSkeleton;
            }
        }
        public get animTime(): number {
            return this._animTime;
        }

        /**
         * 动画时间长度
         */
        public get timeLength(): number {
            if (this._blendList.length <= 0) {
                return 0;
            }
            return this._blendList[this._blendList.length - 1].timeLength;
        }

        /**
         * 动画帧索引
         */
        public set frameIndex(value: number) {
            this.animTime = value * SkeletonAnimation.fps;
        }
        public get frameIndex(): number {
            return this.animTime / SkeletonAnimation.fps;
        }

        /**
         * 融合速度(默认300毫秒)
         */
        public set blendSpeed(value: number) {
            this._blendSpeed = Math.max(value, 0);
        }
        public get blendSpeed(): number {
            return this._blendSpeed;
        }

        /**
         * 当前播放的动画名称
         */
        public get currentAnimName(): string {
            return this._currentAnimName;
        }

        /**
         * 当前动画是否正在播放
         */
        public isPlay(): boolean {
            return this._isPlay;
        }

        /**
         * 添加骨骼动画剪辑对象
         */
        public addSkeletonAnimationClip(animationClip: SkeletonAnimationClip): void {
            let animState = new SkeletonAnimationState(animationClip.animationName);
            animState.skeletonAnimation = this;
            animState.addAnimationClip(animationClip);
            this.addAnimState(animState);
        }

        /**
         * 添加骨骼动画状态对象
         */
        public addAnimState(animState: SkeletonAnimationState): void {
            for (let i = 0; i < this._animStates.length; i++) {
                if (this._animStates[i].name == animState.name) {
                    return;
                }
            }
            this._animStates.push(animState);
            this._animStateNames.push(animState.name);
        }

        /**
         * 移除骨骼动画状态对象
         */
        public removeAnimState(animState: SkeletonAnimationState): void {
            for (let i = 0; i < this._animStates.length; i++) {
                if (this._animStates[i].name == animState.name) {
                    this._animStates.slice(i, 1);
                    this._animStateNames.slice(i, 1);
                    return;
                }
            }
        }

        /**
         * 播放骨骼动画
         * @param animName 动画名称
         * @param speed 播放速度
         * @param reset 是否重置
         * @param prewarm 是否预热
         */
        public play(animName?: string, speed: number = 1, reset: boolean = true, prewarm: boolean = true): void {
            if (this._animStates.length <= 0) {
                return;
            }
            if (!animName) {
                animName = this._animStates[0].name;
            }
            let playSkeletonAnimationState: SkeletonAnimationState;
            for (let i = 0; i < this._animStates.length; i++) {
                if (this._animStates[i].name == animName) {
                    playSkeletonAnimationState = this._animStates[i];
                    break;
                }
            }
            if (!playSkeletonAnimationState) {
                return;
            }
            this._currentAnimName = animName;
            this._blendList.push(playSkeletonAnimationState);
            if (this._blendSpeed <= 0) {
                if (this._blendList.length > 1) {
                    this._blendList.splice(0, this._blendList.length - 1);
                }
            }
            playSkeletonAnimationState.weight = this._blendList.length > 1 ? 0 : 1;
            if (reset) {
                this._animTime = playSkeletonAnimationState.timePosition = 0;
            }
            this._changeFrameTime = playSkeletonAnimationState.timePosition;
            this._oldFrameIndex = Math.floor(this._changeFrameTime / SkeletonAnimation.fps);
            this.speed = speed;
            this._isPlay = true;
            this._resetMovePos = true;
            if (this._movePosIndex != -1) {
                let position = dou.recyclable(Vector3);
                playSkeletonAnimationState.getSkeletonPose(0).joints[this._movePosIndex].worldMatrix.decompose(position);
                this._movePosition.copy(position);
                position.recycle();
            }
        }

        /**
         * 暂停骨骼动画播放（停留在当前帧）
         */
        public pause(): void {
            this._isPlay = false;
        }

        /**
         * 停止骨骼动画播放（停留在第一帧）
         */
        public stop(): void {
            this._isPlay = false;
        }

        /**
         * 更新骨骼动画
         * @param time 总时间
         * @param delay 延迟时间
         * @param geometry 该值无效
         */
        public update(time: number, delay: number, geometry: Geometry): void {
            if (this._oldTime == time) {
                return;
            }
            this._oldTime = time;
            if (!this._isPlay) {
                return;
            }
            if (this._blendList.length <= 0) {
                return;
            }
            let mainState = this._blendList[this._blendList.length - 1];
            let delayTime = delay * this.speed;
            this._changeFrameTime += delayTime;
            let count = Math.floor(Math.abs(this._changeFrameTime / SkeletonAnimation.fps));
            let playAnimName = this.currentAnimName;
            let frameNum = 0;
            for (let i = 0; i < count; ++i) {
                if (delayTime < 0) {
                    frameNum = ((this._oldFrameIndex - 1 - i) % mainState.frameNum);
                    if (frameNum < 0) {
                        frameNum += mainState.frameNum;
                    }
                }
                else {
                    frameNum = (this._oldFrameIndex + 1 + i) % mainState.frameNum;
                }
                this.dispatch(Event3D.ENTER_FRAME, frameNum);
                if (this.currentAnimName != playAnimName) {
                    frameNum = Math.floor(this._changeFrameTime / SkeletonAnimation.fps);
                    break;
                }
                this._changeFrameTime += (delayTime > 0) ? -SkeletonAnimation.fps : SkeletonAnimation.fps;
            }
            this._oldFrameIndex = frameNum;
            this.animTime += delay * this.speed;
        }

        public activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4, camera3D: Camera3D): void {
            if (this._currentSkeletonPose) {
                this._currentSkeletonPose.updateGPUCacheData(geometry.geometry.skeleton, geometry.geometry.skeletonGPUData, this._movePosition);
            }
            if (usage.uniform_time) {
                context3DProxy.uniform1f(usage.uniform_time.uniformIndex, this.animTime);
            }
            context3DProxy.uniform4fv(usage.uniform_PoseMatrix.uniformIndex, geometry.geometry.skeletonGPUData);
        }

        /**
         * 绑定3D对象到骨骼
         * @param jointName 骨骼名称
         * @param obj3d 3D对象
         * @returns boolean 是否成功
         */
        public bindToJointPose(jointName: string, object3D: Object3D): boolean {
            let jointIndex = this._animStates[0].skeletonAnimationClip.findJointIndex(jointName);
            if (jointIndex < 0) {
                return false;
            }
            let list: Object3D[];
            if (this._bindList[jointIndex]) {
                list = this._bindList[jointIndex];
            }
            else {
                list = [];
                this._bindList[jointIndex] = list;
            }
            list.push(object3D);
            return true;
        }

        public setMovePosJointName(jointName: string, target: Object3D): boolean {
            let jointIndex = this._animStates[0].skeletonAnimationClip.findJointIndex(jointName);
            if (jointIndex < 0) {
                return false;
            }
            this._movePosIndex = jointIndex;
            this._movePosObject3D = target;
            this._resetMovePos = true;
            return true;
        }

        private updateBindList(skeletonPose: SkeletonPose): void {
            let list: Object3D[];
            let jointPose: Joint;
            let object3D: Object3D;
            for (let jointIndex in this._bindList) {
                list = this._bindList[jointIndex];
                if (list.length <= 0) {
                    continue;
                }
                jointPose = skeletonPose.joints[jointIndex];
                if (!jointPose) {
                    continue;
                }
                for (let i = 0; i < list.length; i++) {
                    object3D = list[i];
                    let position = dou.recyclable(Vector3);
                    let quaternion = dou.recyclable(Quaternion);
                    jointPose.worldMatrix.decompose(position, quaternion);
                    object3D.orientation = quaternion;
                    object3D.x = position.x - this._movePosition.x;
                    object3D.y = position.y - this._movePosition.y;
                    object3D.z = position.z - this._movePosition.z;
                    position.recycle();
                    quaternion.recycle();
                }
            }
        }

        private updateMovePos(skeletonPose: SkeletonPose): void {
            let jointPose: Joint;
            if (this._movePosIndex != -1) {
                jointPose = skeletonPose.joints[this._movePosIndex];
                let position = dou.recyclable(Vector3);
                jointPose.worldMatrix.decompose(position);
                if (this._movePosObject3D) {
                    this._movePosition.x = position.x - this._movePosition.x;
                    this._movePosition.y = position.y - this._movePosition.y;
                    this._movePosition.z = position.z - this._movePosition.z;
                    this._movePosObject3D.orientation.transformVector(this._movePosition, this._movePosition);
                    this._movePosObject3D.x += this._movePosition.x;
                    this._movePosObject3D.y += this._movePosition.y;
                    this._movePosObject3D.z += this._movePosition.z;
                    if (this._resetMovePos) {
                        this._resetMovePos = false;
                        this._movePosObject3D.x -= this._movePosition.x;
                        this._movePosObject3D.y += this._movePosition.y;
                        this._movePosObject3D.z -= this._movePosition.z;
                    }
                }
                this._movePosition.copy(position);
                position.recycle();
            }
        }

        public clone(): SkeletonAnimation {
            let skeletonAnimation = new SkeletonAnimation();
            skeletonAnimation._blendSpeed = this._blendSpeed;
            skeletonAnimation.isLoop = this.isLoop;
            skeletonAnimation._animStateNames = this._animStateNames.concat([]);
            for (let i = 0; i < this._animStates.length; i++) {
                skeletonAnimation._animStates.push(this._animStates[i].clone());
            }
            return skeletonAnimation;
        }
    }
}
