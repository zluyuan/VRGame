import { _decorator, Component, Node, CCInteger, ICollisionEvent, find, MeshCollider, SphereCollider, BoxCollider } from 'cc';
const { ccclass, property } = _decorator;
import { PlayerHealth } from './PlayerHealth';

@ccclass('HitPlayer')
export class HitPlayer extends Component {
    @property({ type: CCInteger })
    damageAmount = 10;

    player: Node = null;

    private playerHealth: PlayerHealth = null;

    onLoad() {
        this.player = find("Player");
        let collider;
        if (this.node.name == "Enemy01") {
            collider = this.node.getComponent(SphereCollider);
        }
        else if (this.node.name == "Enemy02") {
            collider = this.node.getComponent(BoxCollider);
        }
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    start() {
        this.playerHealth = this.player.getComponent(PlayerHealth);
    }

    onDestroy() {
        let collider;
        if (this.node.name == "Enemy01") {
            collider = this.node.getComponent(SphereCollider);
        }
        else if (this.node.name == "Enemy02") {
            collider = this.node.getComponent(BoxCollider);
        }
        collider.off('onCollisionEnter', this.onCollisionEnter, this);
    }

    onCollisionEnter(event: ICollisionEvent) {
        if (event.otherCollider.node.name == "Player") {
            this.playerHealth.takeDamage(this.damageAmount);
        }
    }
}


