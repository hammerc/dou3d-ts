namespace dou3d {
    /**
     * 摄像机视椎体
     * - 计算出摄像机的可视范围
     * @author wizardc
     */
    export class Frustum {
        private _camera: Camera3D;

        private _box: BoundBox;

        private _vtxNum: number = 8;
        private _vertex: Vector3[];
        private _planeNum: number = 6;
        private _plane: Plane[];

        private _center: Vector3;

        public constructor(camera: Camera3D) {
            this._camera = camera;
            this._vertex = [];
            for (let i = 0; i < this._vtxNum; ++i) {
                this._vertex.push(new Vector3());
            }
            this._plane = [];
            for (let i = 0; i < 6; ++i) {
                this._plane.push(new Plane(Vector3.UP));
            }
            this._box = new BoundBox(null, new Vector3(), new Vector3());
            this._center = new Vector3();
        }

        /**
         * 包围盒
         */
        public get box(): BoundBox {
            return this._box;
        }

        /**
         * 视椎体中心点
         */
        public get center(): Vector3 {
            return this._center;
        }

        /**
         * 数据更新
         */
        public updateFrustum(): void {
            switch (this._camera.cameraType) {
                case CameraType.perspective:
                    this.makeFrustum(this._camera.fieldOfView, this._camera.aspectRatio, this._camera.near, this._camera.far);
                    break;
                case CameraType.orthogonal:
                    this.makeOrthoFrustum(this._camera.viewPort.w, this._camera.viewPort.h, this._camera.near, this._camera.far);
                    break;
            }
        }

        public makeFrustum(fovY: number, aspectRatio: number, nearPlane: number, farPlane: number): void {
            let tangent = Math.tan(fovY / 2 * (Math.PI / 180));
            let nearHeight = nearPlane * tangent;
            let nearWidth = nearHeight * aspectRatio;
            let farHeight = farPlane * tangent;
            let farWidth = farHeight * aspectRatio;
            // near top right
            this._vertex[0].x = nearWidth;
            this._vertex[0].y = nearHeight;
            this._vertex[0].z = nearPlane;
            // near top left
            this._vertex[1].x = -nearWidth;
            this._vertex[1].y = nearHeight;
            this._vertex[1].z = nearPlane;
            // near bottom left
            this._vertex[2].x = -nearWidth;
            this._vertex[2].y = -nearHeight;
            this._vertex[2].z = nearPlane;
            // near bottom right
            this._vertex[3].x = nearWidth;
            this._vertex[3].y = -nearHeight;
            this._vertex[3].z = nearPlane;
            // far top right
            this._vertex[4].x = farWidth;
            this._vertex[4].y = farHeight;
            this._vertex[4].z = farPlane;
            // far top left
            this._vertex[5].x = -farWidth;
            this._vertex[5].y = farHeight;
            this._vertex[5].z = farPlane;
            // far bottom left
            this._vertex[6].x = -farWidth;
            this._vertex[6].y = -farHeight;
            this._vertex[6].z = farPlane;
            // far bottom right
            this._vertex[7].x = farWidth;
            this._vertex[7].y = -farHeight;
            this._vertex[7].z = farPlane;
        }

        protected makeOrthoFrustum(w: number, h: number, zn: number, zf: number): void {
            // near top right
            this._vertex[0].x = w / 2;
            this._vertex[0].y = h / 2;
            this._vertex[0].z = zn;
            // near top left
            this._vertex[1].x = -w / 2;
            this._vertex[1].y = h / 2;
            this._vertex[1].z = zn;
            // near bottom left
            this._vertex[2].x = -w / 2;
            this._vertex[2].y = -h / 2;
            this._vertex[2].z = zn;
            // near bottom right
            this._vertex[3].x = w / 2;
            this._vertex[3].y = -h / 2;
            this._vertex[3].z = zn;
            // far top right
            this._vertex[4].x = w / 2;
            this._vertex[4].y = h / 2;
            this._vertex[4].z = zf;
            // far top left
            this._vertex[5].x = -w / 2;
            this._vertex[5].y = h / 2;
            this._vertex[5].z = zf;
            // far bottom left
            this._vertex[6].x = -w / 2;
            this._vertex[6].y = -h / 2;
            this._vertex[6].z = zf;
            // far bottom right
            this._vertex[7].x = w / 2;
            this._vertex[7].y = -h / 2;
            this._vertex[7].z = zf;
        }

        public update(): void {
            let mat = dou.recyclable(Matrix4);
            mat.copy(this._camera.globalMatrix);
            let vec3List: dou.Recyclable<Vector3>[] = [];
            for (let i = 0; i < this._vtxNum; ++i) {
                let vec4 = dou.recyclable(Vector4);
                mat.transformVector(this._vertex[i], vec4);
                let vec3 = dou.recyclable(Vector3);
                vec3.set(vec4.x, vec4.y, vec4.z);
                vec3List.push(vec3);
                vec4.recycle();
            }
            this._box.max.x = this._box.max.y = this._box.max.z = MathUtil.INT_MIN;
            this._box.min.x = this._box.min.y = this._box.min.z = MathUtil.INT_MAX;
            for (let i = 0; i < vec3List.length; ++i) {
                if (this._box.max.x < vec3List[i].x) {
                    this._box.max.x = vec3List[i].x;
                }
                if (this._box.max.y < vec3List[i].y) {
                    this._box.max.y = vec3List[i].y;
                }
                if (this._box.max.z < vec3List[i].z) {
                    this._box.max.z = vec3List[i].z;
                }
                if (this._box.min.x > vec3List[i].x) {
                    this._box.min.x = vec3List[i].x;
                }
                if (this._box.min.y > vec3List[i].y) {
                    this._box.min.y = vec3List[i].y;
                }
                if (this._box.min.z > vec3List[i].z) {
                    this._box.min.z = vec3List[i].z;
                }
            }
            this._box.calculateBox();
            this._plane[0].fromPoints(vec3List[4], vec3List[5], vec3List[6]); // 远平面(far)
            this._plane[1].fromPoints(vec3List[1], vec3List[6], vec3List[5]); // 左平面(left)
            this._plane[2].fromPoints(vec3List[0], vec3List[4], vec3List[7]); // 右平面(right)
            this._plane[3].fromPoints(vec3List[1], vec3List[0], vec3List[3]); // 近平面(near)
            this._plane[4].fromPoints(vec3List[1], vec3List[5], vec3List[4]); // 上平面(top)
            this._plane[5].fromPoints(vec3List[3], vec3List[7], vec3List[6]); // 下平面(bottom)
            for (let i = 0; i < this._planeNum; i++) {
                this._plane[i].normalize();
            }
            let nearCenter = dou.recyclable(Vector3);
            let farCenter = dou.recyclable(Vector3);
            nearCenter.copy(vec3List[0].subtract(vec3List[2]));
            nearCenter.multiplyScalar(0.5);
            nearCenter.copy(vec3List[2].add(nearCenter));
            farCenter.copy(vec3List[4].subtract(vec3List[6]));
            farCenter.multiplyScalar(0.5);
            farCenter.copy(vec3List[6].add(farCenter));
            this._center.copy(farCenter.subtract(nearCenter));
            this._center.multiplyScalar(0.5);
            this._center.copy(nearCenter.add(this._center));
            nearCenter.recycle();
            farCenter.recycle();
            for (let i = 0; i < vec3List.length; ++i) {
                vec3List[i].recycle();
            }
        }

        /**
         * 检测一个坐标点是否在视椎体内
         */
        public inPoint(pos: Vector3): boolean {
            let dis = 0;
            for (let i = 0; i < this._plane.length; ++i) {
                dis = this._plane[i].getDistance(pos);
                if (dis > 0) {
                    return false;
                }
            }
            return true;
        }

        /**
         * 检测一个球是否在视椎体内
         */
        public inSphere(center: IVector3, radius: number): boolean {
            let dis = 0;
            for (let i = 0; i < this._plane.length; ++i) {
                dis = this._plane[i].getDistance(center);
                if (dis > radius) {
                    return false;
                }
            }
            return true;
        }

        /**
         * 检测一个盒子是否在视椎体内
         */
        public inBox(box: BoundBox): boolean {
            let dis = 0;
            let planeCount = this._plane.length;
            let vec4 = dou.recyclable(Vector4);
            for (let i = 0; i < planeCount; ++i) {
                let incount = box.vexData.length / 3;
                let vexDataLength = box.vexData.length;
                for (let j = 0; j < vexDataLength; j += 3) {
                    vec4.set(box.vexData[j], box.vexData[j + 1], box.vexData[j + 2], 0);
                    box.transform.transformVector(vec4, vec4);
                    dis = this._plane[i].getDistance(vec4);
                    if (dis > 0) {
                        incount--;
                    }
                }
                if (incount <= 0) {
                    vec4.recycle();
                    return false;
                }
            }
            vec4.recycle();
            return true;
        }

        public dispose() {
        }
    }
}
