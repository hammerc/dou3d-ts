namespace examples {
    export class AnimationTest {
        public constructor(view3D: dou3d.View3D) {
            this.showAnimation(view3D).then(() => {
                console.log("done");
            }).catch((error) => {
                console.error(error);
            });
        }

        private async showAnimation(view3D: dou3d.View3D) {
            view3D.backColor = 0xff666666;

            view3D.camera3D.lookAt(new dou3d.Vector3(0, 0, -1000), new dou3d.Vector3(0, 0, 0));

            await dou.loader.loadGroupAsync([
                { url: "resource/anim/xiaoqiao/body_27.esm", type: ResourceType.esm },
                { url: "resource/anim/xiaoqiao/hero_27.png", type: ResourceType.texture },
                { url: "resource/anim/xiaoqiao/idle_1.eam", type: ResourceType.eam },
                { url: "resource/anim/xiaoqiao/run_1.eam", type: ResourceType.eam },
                { url: "resource/anim/xiaoqiao/death_1.eam", type: ResourceType.eam },
                { url: "resource/anim/xiaoqiao/attack_1.eam", type: ResourceType.eam },
                { url: "resource/anim/xiaoqiao/attack_2.eam", type: ResourceType.eam },
                { url: "resource/anim/xiaoqiao/skill_1.eam", type: ResourceType.eam },
                { url: "resource/anim/xiaoqiao/skill_2.eam", type: ResourceType.eam },
                { url: "resource/anim/xiaoqiao/skill_3.eam", type: ResourceType.eam },
                { url: "resource/anim/xiaoqiao/skill_4.eam", type: ResourceType.eam }
            ]);

            let material = new dou3d.TextureMaterial(dou.loader.get("resource/anim/xiaoqiao/hero_27.png"));
            let geometry = dou.loader.get("resource/anim/xiaoqiao/body_27.esm");
            let mesh = new dou3d.Mesh(geometry, material);
            view3D.scene.root.addChild(mesh);

            let animationList = ["idle_1", "run_1", "death_1", "attack_1", "attack_2", "skill_1", "skill_2", "skill_3", "skill_4"];
            for (let animation of animationList) {
                let clip: dou3d.SkeletonAnimationClip = dou.loader.get("resource/anim/xiaoqiao/" + animation + ".eam");
                clip.animationName = animation;
                (<dou3d.SkeletonAnimation>mesh.animation).addSkeletonAnimationClip(clip);
            }

            (<dou3d.SkeletonAnimation>mesh.animation).play("idle_1");
        }
    }
}
