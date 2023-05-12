import { _decorator, Component, Node, Vec3, ICollisionEvent, find, CCInteger, CylinderCollider, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;
import { EnemyHealth } from './EnemyHealth';

@ccclass("BulletController")
export class BulletController extends Component {
    @property({ type: CCInteger })
    damageAmount: number = 10;

    @property(Prefab)
    boomPrefab: Prefab = null

    enemy: Node = null;
    private enemyHealth: EnemyHealth = null;
    firePoint: Node = null;
    speed: number = 80.0;
    direction: Vec3;
    timer: number;

    onLoad() {
        let collider = this.node.getComponent(CylinderCollider);
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    start() {
        this.direction = new Vec3(0, 0, 0);
        this.firePoint = find("Player/Gun/blasterN/FirePoint");
        let posBullet = this.node.getWorldPosition();
        let posFirePoint = this.firePoint.getWorldPosition();
        let standard = new Vec3(posBullet.x - posFirePoint.x, posBullet.y - posFirePoint.y, posBullet.z - posFirePoint.z);
        standard.normalize();
        this.direction = standard.multiplyScalar(this.speed / 60);
        this.timer = 0;
    }

    onDestroy() {
        let collider = this.node.getComponent(CylinderCollider);
        collider.off('onCollisionEnter', this.onCollisionEnter, this);
    }

    update(deltaTime: number) {
        this.timer += deltaTime;
        let currentPos = this.node.getWorldPosition();
        let nextPos = new Vec3(currentPos.x + this.direction.x, currentPos.y + this.direction.y, currentPos.z + this.direction.z);
        this.node.setWorldPosition(nextPos);
        if (this.timer > 5) {
            this.node.destroy();
        }
    }

    onCollisionEnter(event: ICollisionEvent) {
        if (event.otherCollider.node.name == "Enemy01" || event.otherCollider.node.name == "Enemy02") {
            this.enemy = event.otherCollider.node;
            this.enemyHealth = this.enemy.getComponent(EnemyHealth);
            this.enemyHealth.takeDamage(this.damageAmount);
            const boomNode = instantiate(this.boomPrefab);
            this.node.scene.addChild(boomNode);
            let pos = this.node.getWorldPosition();
            let rot = this.node.getWorldRotation();
            boomNode.setWorldPosition(pos);
            boomNode.setWorldRotation(rot);
            setTimeout(() => {
                boomNode.destroy();
            }, 200);
        }
        this.node.destroy();
    }
}




