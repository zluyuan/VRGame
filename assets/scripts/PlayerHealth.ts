import { _decorator, Component, CCInteger, director, Sprite, Label, Node, find, AudioSource } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('PlayerHealth')
export class PlayerHealth extends Component {
    @property({ type: CCInteger })
    maxHealth: number = 100;

    @property(Label)
    healthLabel: Label = null;

    @property(Label)
    scoreLabel: Label = null;

    @property({ type:Sprite })
    healthBar: Sprite = null;

    @property({ type: AudioSource })
    hurtAudioSource: AudioSource = null;

    hitFlash: Node = null;
    lowHPFlash: Node = null;
    currentHealth: number = 0;

    start() {
        this.hitFlash = find("Canvas/HitFlash");
        this.hitFlash.active = false;
        this.lowHPFlash = find("Canvas/LowHPFlash");
        this.lowHPFlash.active = false;
        this.currentHealth = this.maxHealth;
        this.healthLabel.string = this.currentHealth + "/" + this.maxHealth;
    }

    takeDamage(damage: number) {
        this.currentHealth -= damage;
        if (this.currentHealth > 0) {
            const healthPercent = this.currentHealth / this.maxHealth;
            this.healthBar.fillRange = healthPercent;
            this.healthLabel.string = this.currentHealth + "/" + this.maxHealth;
            this.hurtAudioSource.play();
            if (healthPercent > 0.3) {
                this.hitFlash.active = true;
                setTimeout(() => {
                    this.hitFlash.active = false;
                }, 100);
            } else {
                this.lowHPFlash.active = true;
                setTimeout(() => {
                    this.lowHPFlash.active = false;
                }, 100);
            }
        } else {
            this.currentHealth = 0;
            const jsonStringGet = localStorage.getItem('Scores');
            let scoreMap = new Map<string, number>();
            const now = new Date();
            let currentTime = now.getFullYear() + "-" + ((now.getMonth() + 1) < 10 ? ("0" + (now.getMonth() + 1)) : (now.getMonth() + 1)) +
                "-" + (now.getDate() < 10 ? ("0" + now.getDate()) : now.getDate()) + " " + (now.getHours() < 10 ? ("0" + now.getHours()) : now.getHours()) +
                ":" + (now.getMinutes() < 10 ? ("0" + now.getMinutes()) : now.getMinutes()) + ":" + (now.getSeconds() < 10 ? ("0" + now.getSeconds()) : now.getSeconds());
            if (jsonStringGet) {
                const objGet = JSON.parse(jsonStringGet);
                for (const key in objGet) {
                    if (objGet.hasOwnProperty(key)) {
                        scoreMap.set(key, objGet[key]);
                    }
                }
                scoreMap.set(currentTime, parseInt(this.scoreLabel.string));
            } else {
                scoreMap.set(currentTime, parseInt(this.scoreLabel.string));
            }
            let objSet: { [key: string]: number } = {};
            scoreMap.forEach((value, key) => {
                objSet[key] = value;
            });
            const jsonStringSet = JSON.stringify(objSet);
            localStorage.setItem('Scores', jsonStringSet);
            director.loadScene('Dead');
        }
    }
}


