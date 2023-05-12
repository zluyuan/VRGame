import { _decorator, Component, director, ProgressBar, find, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadProgress')
export class LoadProgress extends Component {

    start() {
        director.preloadScene('ShootGame', function (completedCount, totalCount, item) {
            let progressBar = find("Canvas/ProgressBar").getComponent(ProgressBar);
            let progressLabel = find("Canvas/ProgressLabel").getComponent(Label);
            let informationLabel = find("Canvas/Information").getComponent(Label);
            let progress = Math.floor(completedCount / totalCount * 100);
            if (progress == 100) {
                progress = 99;
                informationLabel.string = "正在初始化场景";
            } else {
                informationLabel.string = "正在为您加载资源";
            }
            progressLabel.string = progress + "%";
            progressBar.progress = progress/100.0;
        }, function () {
            director.loadScene('ShootGame');
        });
    }

    update(deltaTime: number) {
        
    }
}


