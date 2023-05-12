import { _decorator, Node, Component, RigidBody, Vec3, input, Input, EventKeyboard, __private, KeyCode, CCInteger, ICollisionEvent, CapsuleCollider, EventMouse, CCFloat, game, Prefab, find, instantiate, director, Quat, Sprite, Label, AudioSource } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('PlayController')
export class PlayController extends Component {
    @property(CCInteger)
    moveSpeed: number = 20;

    @property(CCInteger)
    jumpSpeed: number = 18;

    @property(CCInteger)
    maxBulletNum: number = 20;

    currentBulletNum: number;

    @property(CCFloat)
    angleSpeedY: number = 2.5;

    @property(CCFloat)
    angleSpeedUpX: number = 1.5;

    @property(CCFloat)
    angleSpeedDownX: number = 1.5;

    @property(CCFloat)
    fireRate: number = 0.5;

    @property({ type: Node })
    gunNode: Node = null;

    @property({ type: Sprite })
    bulletBar: Sprite = null;

    @property(Prefab)
    bulletPrefab: Prefab = null

    @property(Prefab)
    firePrefab: Prefab = null

    @property(Label)
    bulletNumLabel: Label = null;

    @property(Label)
    scoreLabel: Label = null;

    @property({ type: AudioSource })
    buttonAudioSource: AudioSource = null;

    @property({ type: AudioSource })
    gunAudioSource: AudioSource = null;

    @property({ type: AudioSource })
    shootAudioSource: AudioSource = null;

    @property({ type: AudioSource })
    loadBulletAudioSource: AudioSource = null;

    @property({ type: AudioSource })
    jumpAudioSource: AudioSource = null;

    key: { [k: string]: any } = {};

    loadBulletTime = 3;
    lastShootTime: number = 0;

    gun: Node = null;
    quitBtn: Node = null;
    sight: Node = null;
    bulletNotEnough: Node = null;

    canva = game.canvas;

    rb: RigidBody;
    pos: Vec3;
    lv: Vec3;
    force: Vec3;
    enableJump: boolean = false;

    onLoad() {
        this.canva.style.cursor = 'none';
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        let collider = this.node.getComponent(CapsuleCollider);
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    start() {
        
        this.rb = this.node.getComponent(RigidBody);
        this.pos = new Vec3(0, 0, 0);
        this.lv = new Vec3(0, 0, 0);
        this.force = new Vec3(0, -300, 0);
        this.currentBulletNum = this.maxBulletNum;
        this.gun = find("Player/Gun/blasterN");
        this.quitBtn = find("Canvas/Quit");
        this.sight = find("Canvas/Sight");
        this.bulletNotEnough = find("Canvas/NotEnough");
        this.bulletNumLabel.string = this.currentBulletNum + "/" + this.maxBulletNum;
        this.quitBtn.active = false;
        this.sight.active = false;
        this.bulletNotEnough.active = false;
        this.gun.setPosition(new Vec3(-0.255, -0.28, 0.545));
        this.gun.setRotation(new Quat(-0.04714250590061165, -0.9429744011037541, 0.017119807769240034, -0.3290650014546843));
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        let collider = this.node.getComponent(CapsuleCollider);
        collider.off('onCollisionEnter', this.onCollisionEnter, this);
    }

    update(deltaTime: number) {
        this.rb.applyForce(this.force);
        this.node.getPosition(this.pos);
        this.rb?.getLinearVelocity(this.lv);
        if (this.currentBulletNum == 0) {
            this.loadBulletTime -= deltaTime;
            if (this.loadBulletTime < 0) {
                this.loadBulletTime = 3;
                this.currentBulletNum = this.maxBulletNum;
                this.bulletBar.fillRange = 1;
                this.bulletNumLabel.string = this.currentBulletNum + "/" + this.maxBulletNum;
                this.bulletNotEnough.active = false;
            }
        }
        if (this.key[KeyCode.KEY_W]) {
            Vec3.scaleAndAdd(this.pos, this.pos, this.getDirection(0, 0, 1), deltaTime * this.moveSpeed);
        } else if (this.key[KeyCode.KEY_S]) {
            Vec3.scaleAndAdd(this.pos, this.pos, this.getDirection(0, 0, -1), deltaTime * this.moveSpeed);
        } else if (this.key[KeyCode.KEY_A]) {
            Vec3.scaleAndAdd(this.pos, this.pos, this.getDirection(1, 0, 0), deltaTime * this.moveSpeed);
        } else if (this.key[KeyCode.KEY_D]) {
            Vec3.scaleAndAdd(this.pos, this.pos, this.getDirection(-1, 0, 0), deltaTime * this.moveSpeed);
        }
        if (this.key[KeyCode.SPACE]) {
            if (this.enableJump == true) {
                this.jumpAudioSource.play();
                this.lv.y = this.jumpSpeed;
            }
            this.enableJump = false;
        } 
        if (this.key[KeyCode.ESCAPE]) {
            this.canva.style.cursor = 'auto';
            this.quitBtn.active = true;
        } else {
            this.canva.style.cursor = 'none';
            this.quitBtn.active = false;
        }
        this.node.setPosition(this.pos);
        this.rb?.setLinearVelocity(this.lv);
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode == KeyCode.ESCAPE && this.key[event.keyCode] == 1) {
            this.key[event.keyCode] = 0;
        } else {
            this.key[event.keyCode] = 1;
        }
    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode != KeyCode.ESCAPE) {
            this.key[event.keyCode] = 0;
        }
    }

    onMouseMove(event: EventMouse) {
        let delta = event.getDelta();
        if (delta.x < 0) {
            let angle = this.node.eulerAngles;
            let angleY = angle.y + this.angleSpeedY;
            this.node.eulerAngles = new Vec3(angle.x, angleY, angle.z);
        } else if (delta.x > 0) {
            let angle = this.node.eulerAngles;
            let angleY = angle.y - this.angleSpeedY;
            this.node.eulerAngles = new Vec3(angle.x, angleY, angle.z);
        }

        if (delta.y > 0) {
            let angle = this.gunNode.eulerAngles;
            let angleX = angle.x - this.angleSpeedUpX;
            if (angleX < -30) {
                angleX = -30;
            }
            this.gunNode.eulerAngles = new Vec3(angleX, angle.y, angle.z);
        } else if (delta.y < 0) {
            let angle = this.gunNode.eulerAngles;
            let angleX = angle.x + this.angleSpeedDownX;
            if (angleX > 25) {
                angleX = 25;
            }
            this.gunNode.eulerAngles = new Vec3(angleX, angle.y, angle.z);
        }
    }

    onMouseDown(event: EventMouse) {
        if (event.getButton() == EventMouse.BUTTON_LEFT) {
            if (this.sight.active == true && this.currentBulletNum > 0) {
                if (Date.now() - this.lastShootTime < this.fireRate * 1000) {
                    return;
                }
                this.shootAudioSource.play();
                const fireNode = instantiate(this.firePrefab);
                this.gun.addChild(fireNode);
                this.lastShootTime = Date.now();
                const bulletNode = instantiate(this.bulletPrefab);
                this.gun.addChild(bulletNode);
                let pos = bulletNode.getWorldPosition();
                let rot = bulletNode.getWorldRotation();
                bulletNode.removeFromParent();
                this.node.scene.addChild(bulletNode);
                bulletNode.setWorldPosition(pos);
                bulletNode.setWorldRotation(rot);
                this.currentBulletNum--;
                const bulletPercent = this.currentBulletNum / this.maxBulletNum;
                this.bulletBar.fillRange = bulletPercent;
                this.bulletNumLabel.string = this.currentBulletNum + "/" + this.maxBulletNum;
                if (this.currentBulletNum == 0) {
                    this.loadBulletAudioSource.play();
                    this.bulletNotEnough.active = true;
                }
                setTimeout(() => {
                    fireNode.destroy();
                }, 200);
            }
        }else if (event.getButton() == EventMouse.BUTTON_RIGHT) {
            if (this.sight.active == true) {
                this.sight.active = false;
                this.gun.setPosition(new Vec3(-0.255, -0.28, 0.545));
                this.gun.setRotation(new Quat(-0.04714250590061165, -0.9429744011037541, 0.017119807769240034, -0.3290650014546843));
            } else if (this.sight.active == false) {
                this.gunAudioSource.play();
                this.sight.active = true;
                this.gun.setPosition(new Vec3(0, -0.223, 0.491));
                this.gun.setRotation(new Quat(-0.004904351877207617, -0.9999872272724538, 0.0000059917991365252945, 0.0012217154794200676));
            }
        }
    }

    onCollisionEnter(event: ICollisionEvent) {
        if (event.otherCollider.node.name == "Ground") {
            this.enableJump = true;
        }
        if (event.otherCollider.node.name == "Plane") {
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

    getDirection(x: number, y: number, z: number) {
        const result = new Vec3(x, y, z);
        Vec3.transformQuat(result, result, this.node.getRotation());
        return result;
    }

    onBtnQuit() {
        this.buttonAudioSource.play();
        director.loadScene('Main');
    }
}

