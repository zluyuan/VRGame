import { _decorator, Component, Node, Label, director, CCInteger, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Timer')
export class Timer extends Component {

    @property(Label)
    timeLabel: Label = null;

    @property(Label)
    scoreLabel: Label = null;

    @property({ type: AudioSource })
    backgroundAudioSource: AudioSource = null;

    @property({ type: AudioSource })
    timerAudioSource: AudioSource = null;

    @property(CCInteger)
    timer: number = 300;

    second: number =0;

    start() {
        this.backgroundAudioSource.play();
        this.timeLabel.string = this.timer + "s";
    }

    update(deltaTime: number) {
        this.second += deltaTime;
        if (this.second > 1) {
            this.second = 0;
            this.timer -= 1;
            this.timeLabel.string = this.timer + "s";
            if (this.timer <= 20 && this.timer > 0) {
                this.timerAudioSource.play();
            }
        }
        if (this.timer == 0) {
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
            director.loadScene('TimeOver');
            this.timer = 1;
        }
    }
}

