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
                { url: "resource/anim/xiaoqiao/body_27.esm" },
                { url: "resource/anim/xiaoqiao/hero_27.png" },
                { url: "resource/anim/xiaoqiao/idle_1.eam" },
                { url: "resource/anim/xiaoqiao/run_1.eam" },
                { url: "resource/anim/xiaoqiao/death_1.eam" },
                { url: "resource/anim/xiaoqiao/attack_1.eam" },
                { url: "resource/anim/xiaoqiao/attack_2.eam" },
                { url: "resource/anim/xiaoqiao/skill_1.eam" },
                { url: "resource/anim/xiaoqiao/skill_2.eam" },
                { url: "resource/anim/xiaoqiao/skill_3.eam" },
                { url: "resource/anim/xiaoqiao/skill_4.eam" }
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

            document.addEventListener("keydown", (e: KeyboardEvent) => {
                switch (e.keyCode) {
                    case 97:
                        (<dou3d.SkeletonAnimation>mesh.animation).play("idle_1");
                        break;
                    case 98:
                        (<dou3d.SkeletonAnimation>mesh.animation).play("run_1");
                        break;
                    case 99:
                        (<dou3d.SkeletonAnimation>mesh.animation).play("death_1");
                        break;
                    case 100:
                        (<dou3d.SkeletonAnimation>mesh.animation).play("attack_1");
                        break;
                    case 101:
                        (<dou3d.SkeletonAnimation>mesh.animation).play("attack_2");
                        break;
                    case 102:
                        (<dou3d.SkeletonAnimation>mesh.animation).play("skill_1");
                        break;
                    case 103:
                        (<dou3d.SkeletonAnimation>mesh.animation).play("skill_2");
                        break;
                    case 104:
                        (<dou3d.SkeletonAnimation>mesh.animation).play("skill_3");
                        break;
                    case 105:
                        (<dou3d.SkeletonAnimation>mesh.animation).play("skill_4");
                        break;
                }
            });
        }
    }
}
