import { _decorator, Component, CCInteger, Sprite, SkeletalAnimation, Label, find, SphereCollider, MeshCollider, AudioSource, BoxCollider } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('EnemyHealth')
export class EnemyHealth extends Component {
    @property({ type: CCInteger })
    maxHealth: number;

    public currentHealth: number;

    @property({ type: CCInteger })
    score: number;

    @property({ type: SkeletalAnimation })
    anim: SkeletalAnimation = null;

    @property({ type: Sprite })
    healthBar: Sprite = null;

    enemyDeadAudioSource: AudioSource = null;

    scoreLabel: Label = null;

    start() {
        this.scoreLabel = find("Canvas/Score").getComponent(Label);
        this.enemyDeadAudioSource = find("AudioSource/EnemyDead").getComponent(AudioSource);
        this.currentHealth = this.maxHealth;
    }

    takeDamage(damage: number) {
        if (this.node.name == 'Enemy01') {
            let state = this.anim.getState('hit');
            state.repeatCount = 1;
            this.anim.play('hit');
            state.on('finished', () => {
                this.anim.play('idle');
            });
        }
        this.currentHealth -= damage;
        if (this.currentHealth > 0) {
            const healthPercent = this.currentHealth / this.maxHealth;
            this.healthBar.fillRange = healthPercent;
        } else {
            this.scoreLabel.string = (parseInt(this.scoreLabel.string) + this.score).toString();
            this.currentHealth = 0;
            this.healthBar.fillRange = 0;
            this.enemyDeadAudioSource.play();
            this.anim.play('die');
            if (this.node.name == "Enemy01") {
                this.node.getComponent(SphereCollider).enabled = false;
            } else if (this.node.name == "Enemy02") {
                this.node.getComponent(BoxCollider).enabled = false;
            }
            this.node.getChildByName("HealthBar").active = false;
            setTimeout(() => {
                this.node.destroy();
            }, 700);
        }
    }
}


