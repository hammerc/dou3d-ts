namespace dou3d {
    /**
     * 自定义文件类型骨骼动画加载器
     * @author wizardc
     */
    export class EAMAnalyzer implements dou.IAnalyzer {
        public load(url: string, callback: (url: string, data: any) => void, thisObj: any): void {
            let request = new dou.HttpRequest();
            request.responseType = dou.HttpResponseType.arraybuffer;
            request.on(dou.Event.COMPLETE, (event: Event) => {
                callback.call(thisObj, url, this.createClip(request.response));
            }, this);
            request.on(dou.IOErrorEvent.IO_ERROR, (event: dou.IOErrorEvent) => {
                callback.call(thisObj, url);
            }, this);
            request.open(url, dou.HttpMethod.GET);
            request.send();
        }

        private createClip(data: any): SkeletonAnimationClip {
            let bytes = new dou.ByteArray(data);
            bytes.position = 3;
            let version = bytes.readUnsignedInt();
            let clip: SkeletonAnimationClip;
            switch (version) {
                case 1:
                    clip = this.parseVersion_1(bytes);
                    break;
                case 2:
                    clip = this.parseVersion_2(bytes);
                    break;
                default:
                    console.error("EAM version error : " + version);
                    return null;
            }
            return clip;
        }

        public parseVersion_1(bytes: dou.ByteArray): SkeletonAnimationClip {
            let boneCount = bytes.readUnsignedByte();
            let sampling = bytes.readUnsignedByte();
            if (boneCount <= 0) {
                return null;
            }
            let skeletonAnimationClip = new SkeletonAnimationClip();
            let boneNameArray: string[] = [];
            let parentBoneNameArray: string[] = [];
            for (let i = 0; i < boneCount; i++) {
                boneNameArray.push(bytes.readUTF());
                parentBoneNameArray.push(bytes.readUTF());
            }
            let frameCount = bytes.readInt();
            let nCount = bytes.readInt();
            let orientation = new Quaternion();
            let scale = new Vector3();
            let translation = new Vector3();
            for (let i = 0; i < nCount; i++) {
                let skeletonPose = new SkeletonPose();
                skeletonPose.frameTime = bytes.readInt() / 60 / 80 * 1000;
                for (let j = 0; j < boneCount; j++) {
                    let jointPose = new Joint(boneNameArray[j]);
                    jointPose.parent = parentBoneNameArray[j];
                    jointPose.parentIndex = skeletonPose.findJointIndex(jointPose.parent);
                    orientation.fromEuler(bytes.readFloat() * MathUtil.RAD_DEG, bytes.readFloat() * MathUtil.RAD_DEG, bytes.readFloat() * MathUtil.RAD_DEG);
                    scale.x = bytes.readFloat();
                    scale.y = bytes.readFloat();
                    scale.z = bytes.readFloat();
                    translation.x = bytes.readFloat();
                    translation.y = bytes.readFloat();
                    translation.z = bytes.readFloat();
                    jointPose.buildLocalMatrix(scale, orientation, translation);
                    skeletonPose.joints.push(jointPose);
                }
                skeletonPose.calculateJointWorldMatrix();
                skeletonAnimationClip.addSkeletonPose(skeletonPose);
            }
            return skeletonAnimationClip;
        }

        public parseVersion_2(bytes: dou.ByteArray): SkeletonAnimationClip {
            // 读取骨骼数
            let boneCount = bytes.readUnsignedByte();
            // 读取采样率
            let sampling: number = bytes.readUnsignedByte();
            if (boneCount <= 0) {
                return null;
            }
            let skeletonAnimationClip = new SkeletonAnimationClip();
            let boneNameArray: string[] = [];
            let parentBoneNameArray: string[] = [];
            // 读取骨骼名称
            for (let i = 0; i < boneCount; i++) {
                boneNameArray.push(bytes.readUTF());
                parentBoneNameArray.push(bytes.readUTF());
            }
            // 读取帧数
            let frameCount = bytes.readInt();
            // 读取数量
            let nCount = bytes.readInt();
            // 流数据
            let orientation = new Quaternion();
            let scale = new Vector3();
            let translation = new Vector3();
            for (let i = 0; i < nCount; i++) {
                let skeletonPose = new SkeletonPose();
                // 读取该帧时刻
                skeletonPose.frameTime = bytes.readInt() / 60 / 80 * 1000;
                for (let j = 0; j < boneCount; j++) {
                    let jointPose = new Joint(boneNameArray[j]);
                    jointPose.parent = parentBoneNameArray[j];
                    jointPose.parentIndex = skeletonPose.findJointIndex(jointPose.parent);
                    // 读取旋转四元数分量
                    orientation.x = bytes.readFloat();
                    orientation.y = bytes.readFloat();
                    orientation.z = bytes.readFloat();
                    orientation.w = bytes.readFloat();
                    // 读取缩放分量
                    scale.x = bytes.readFloat();
                    scale.y = bytes.readFloat();
                    scale.z = bytes.readFloat();
                    // 读取平移分量
                    translation.x = bytes.readFloat();
                    translation.y = bytes.readFloat();
                    translation.z = bytes.readFloat();
                    jointPose.buildLocalMatrix(scale, orientation, translation);
                    skeletonPose.joints.push(jointPose);
                }
                skeletonPose.calculateJointWorldMatrix();
                skeletonAnimationClip.addSkeletonPose(skeletonPose);
            }
            return skeletonAnimationClip;
        }

        public release(data: ImageTexture): boolean {
            return true;
        }
    }
}
