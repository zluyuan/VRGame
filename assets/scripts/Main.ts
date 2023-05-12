import { _decorator, Component, Node, director, Label, AudioSource, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property(Label)
    shootGameItems: Label = null;

    @property({ type: AudioSource })
    backgroundAudioSource: AudioSource = null;

    @property({ type: AudioSource })
    buttonAudioSource: AudioSource = null;

    @property({ type: AudioSource })
    windowAudioSource: AudioSource = null;

    playBtn: Node = null;
    documentBtn: Node = null;
    documentView: Node = null;
    soundFlag :number = 1;

    start() {
        this.backgroundAudioSource.play();
        this.playBtn = this.node.getChildByName('StartShootGame');
        this.documentBtn = this.node.getChildByName('LookScores');
        this.documentView = this.node.getChildByName('ScoresDocument');
        this.documentView.active = false;
        const jsonStringGet = localStorage.getItem('Scores');
        const objGet = JSON.parse(jsonStringGet);
        for (const key in objGet) {
            if (objGet.hasOwnProperty(key)) {
                this.shootGameItems.string += (key + "         " + objGet[key]+"\n");
            }
        }
    }

    update(deltaTime: number) {
        
    }

    onBtnDocument() {
        this.windowAudioSource.play();
        this.playBtn.active = false;
        this.documentBtn.active = false;
        this.documentView.active = true;
    }
    onBtnPlay() {
        this.buttonAudioSource.play();
        director.loadScene('Progress');
    }

    onBtnClose() {
        this.documentView.active = false;
        this.playBtn.active = true;
        this.documentBtn.active = true;
    }

    onBtnSound() {
        this.buttonAudioSource.play();
        if (this.soundFlag == 1) {
            this.backgroundAudioSource.stop();
            this.soundFlag = 0;
        } else if (this.soundFlag == 0) {
            this.backgroundAudioSource.play();
            this.soundFlag = 1;
        }
      
    }
}


