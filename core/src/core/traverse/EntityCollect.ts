namespace dou3d {
    /**
     * 渲染对象收集器, 把渲染对象进行可视筛选, 并且划分渲染层级, 依次排序到加入列表
     * @author wizardc
     */
    export class EntityCollect extends CollectBase {
        public layerMap: { [layer: number]: RenderBase[] } = {};

        /**
         * 数据更新 处理需要渲染的对象
         */
        public update(camera: Camera3D): void {
            super.update(camera);
            this.clearLayerList();
            this.applyRender(this._scene.root, camera);
            for (let i = 0; i < Layer.max; i++) {
                this.layerMap[i].sort(this.sortByOrder);
                let listLen = this.layerMap[i].length;
                for (let j = 0; j < listLen; j++) {
                    this._renderList.push(this.layerMap[i][j]);
                }
            }
        }

        protected clearLayerList(): void {
            for (let i = 0; i < Layer.max; i++) {
                if (!this.layerMap[i]) {
                    this.layerMap[i] = [];
                }
                else {
                    this.layerMap[i].length = 0;
                }
            }
        }

        private applyRender(child: Object3D, camera: Camera3D): void {
            if (!child.visible) {
                return;
            }
            if (child instanceof ObjectContainer3D) {
                for (let i = 0; i < child.children.length; i++) {
                    this.applyRender(child.children[i], camera);
                }
            }
            else if (child instanceof RenderBase && child.material) {
                this.addRenderList(child, camera);
            }
        }

        /**
         * 尝试将一个渲染对象进行视锥体裁剪放入到渲染队列中
         */
        private addRenderList(renderItem: RenderBase, camera: Camera3D, cameraCulling: boolean = true): void {
            if (renderItem.material) {
                if (renderItem.layer == Layer.normal && renderItem.material.materialData.alphaBlending) {
                    this.layerMap[Layer.alpha].push(renderItem);
                }
                else {
                    for (let i = 0; i < Layer.max; i++) {
                        if (renderItem.layer == i) {
                            this.layerMap[i].push(renderItem);
                        }
                    }
                }
            }
        }

        /**
         * 距离摄像机由远到近的排序
         */
        protected sort(a: Object3D, b: Object3D, camera: Camera3D): number {
            let dis1 = Vector3.getDistance(a.globalPosition, camera.position);
            let dis2 = Vector3.getDistance(b.globalPosition, camera.position);
            if (dis1 > dis2) {
                return -1;
            }
            else if (dis1 < dis2) {
                return 1;
            }
            return 0;
        }

        /**
         * 根据 order 来进行降序排序
         */
        protected sortByOrder(a: RenderBase, b: RenderBase): number {
            return b.order - a.order;
        }
    }
}
