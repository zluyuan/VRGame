import { _decorator, Component, Prefab, Node, SpriteComponent, SpriteFrame, ImageAsset, resources, error, Texture2D, instantiate, isValid, find, TextAsset, JsonAsset, Vec3 } from "cc";
import { poolManager } from "./poolManager";
const { ccclass, property } = _decorator;

@ccclass('enemy02')
export class enemy02 extends Component {

    public static loadRes(url: string, type: any, cb: Function = () => { }) {
        resources.load(url, (err: any, res: any) => {
            if (err) {
                error(err.message || err);
                cb(err, res);
                return;
            }

            cb && cb(null, res);
        })
    }

    public static loadModelRes() {
        return new Promise((resolve, reject) => {
            this.loadRes(`Enemy02`, Prefab, (err: any, prefab: Prefab) => {
                if (err) {
                    console.error("model load failed");
                    reject && reject();
                    return;
                }
                // console.log("model load succeed");
                resolve && resolve(prefab);
            })
        })
    }

    start() {
        this.schedule(function () {
            let player = enemy02.loadModelRes().then((prefab: any) => {
                let parentName = 'Group';//�ȴ������ڵ�
                let ndParent = this.node.getChildByName(parentName);
                if (!ndParent) {
                    ndParent = new Node(parentName);
                    ndParent.parent = this.node;
                }
                let ndChild = poolManager.instance.getNode(prefab, ndParent) as Node;
                let x = (Math.random() - 0.5) * 4;
                let z = (Math.random() - 0.5) * 4;
                ndChild.setPosition(new Vec3(x, 0, z));
            });
        }, 20);
    }

    update(deltaTime: number) {

    }
}


