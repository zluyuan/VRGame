/*
Xiamen Yaji Software Co., Ltd., (the “Licensor”) grants the user (the “Licensee”) non-exclusive and non-transferable rights
to use the software according to the following conditions:

a.  The Licensee shall pay royalties to the Licensor, and the amount of those royalties and the payment method are subject
    to separate negotiations between the parties.
b.  The software is licensed for use rather than sold, and the Licensor reserves all rights over the software that are not
    expressly granted (whether by implication, reservation or prohibition).
c.  The open source codes contained in the software are subject to the MIT Open Source Licensing Agreement (see the attached
    for the details);
d.  The Licensee acknowledges and consents to the possibility that errors may occur during the operation of the software for
    one or more technical reasons, and the Licensee shall take precautions and prepare remedies for such events. In such
    circumstance, the Licensor shall provide software patches or updates according to the agreement between the two parties.
    The Licensor will not assume any liability beyond the explicit wording of this  Licensing Agreement.
e.  Where the Licensor must assume liability for the software according to relevant laws, the Licensor’s entire liability is
    limited to the annual royalty payable by the Licensee.
f.  The Licensor owns the portions listed in the root directory and subdirectory (if any) in the software and enjoys the
    intellectual property rights over those portions. As for the portions owned by the Licensor, the Licensee shall not:
    i.  Bypass or avoid any relevant technical protection measures in the products or services;
    ii. Release the source codes to any other parties;
    iii.Disassemble, decompile, decipher, attack, emulate, exploit or reverse-engineer these portion of code;
    iv. Apply it to any third-party products or services without Licensor’s permission;
    v.  Publish, copy, rent, lease, sell, export, import, distribute or lend any products containing these portions of code;
    vi. Allow others to use any services relevant to the technology of these codes; and
    vii.Conduct any other act beyond the scope of this Licensing Agreement.
g.  This Licensing Agreement terminates immediately if the Licensee breaches this Agreement. The Licensor may claim
    compensation from the Licensee where the Licensee’s breach causes any damage to the Licensor.
h.  The laws of the People's Republic of China apply to this Licensing Agreement.
i.  This Agreement is made in both Chinese and English, and the Chinese version shall prevail the event of conflict.
*/

import { director, _decorator, Node, Vec3, ccenum, Quat } from 'cc';
import { ARCameraMgr } from '../../ar-camera';
import { ARTrackingBase } from '../../tracking/ar-tracking-base';
import { ARActionData } from '../utils/ar-defines';
import { ActionType } from '../utils/ar-enum';
import { ARActionUpdateBase } from './action-base';

const { ccclass, property } = _decorator;

enum AlignmentStyle {
    Center,
}
enum AlignmentOrientation {
    World_Up,
    Local_Up,
}
ccenum(AlignmentStyle);
ccenum(AlignmentOrientation);

/**
 * @en
 * AR adaptive Alignment behavior class
 * @zh
 * AR自适应对齐的行为类
 */
@ccclass('cc.ARAlignment')
export class ARAlignment extends ARActionUpdateBase {
    @property({ serializable: true })
    protected _layout: AlignmentStyle = AlignmentStyle.Center;

    @property({ serializable: true })
    protected _towards: AlignmentOrientation = AlignmentOrientation.Local_Up;

    @property({ serializable: true })
    protected _faceToCamera = false;

    constructor () {
        super();
        this.type = ActionType.ALIGNMENT;
    }

    @property({type: AlignmentStyle, displayOrder: 1, visible: false})
    set layout (val) {
        if (val === this._layout) {
            return;
        }
        this._layout = val;
    }
    get layout () {
        return this._layout;
    }

    @property({
        type: AlignmentOrientation,
        displayOrder: 2,
        tooltip: 'i18n:xr-plugin.action.alignment.towards'
        })
    set towards (val) {
        if (val === this._towards) {
            return;
        }
        this._towards = val;
    }
    get towards () {
        return this._towards;
    }

    @property({
        displayOrder: 3,
        tooltip: 'i18n:xr-plugin.action.alignment.faceToCamera'
        })
    set faceToCamera (val) {
        if (val === this._faceToCamera) {
            return;
        }
        this._faceToCamera = val;
    }
    get faceToCamera () {
        return this._faceToCamera;
    }

    @property({
        displayOrder: 4,
        visible: (function (this: ARActionUpdateBase) {
            return !this.closeTracking;
            }),
        tooltip: 'i18n:xr-plugin.action.alignment.matchTrackingUpdate'
        })
    set matchTrackingUpdate (val) {
        if (val === this._matchTrackingUpdate) {
            return;
        }
        this._matchTrackingUpdate = val;
    }
    get matchTrackingUpdate () {
        return this._matchTrackingUpdate;
    }

    private _trackableNode: Node | null = null;

    private _updateAction (data: ARActionData) {
        if (!this._trackableNode) {
            return;
        }

        //update rotation
        if (this._towards === AlignmentOrientation.Local_Up) {
            data.trackablePose?.rotation.set(data.pose.rotation.clone());
        } else {
            data.trackablePose?.rotation.set(Quat.IDENTITY);
        }
    }

    /**
    * @en run The action
    * @zh 执行行为
    */
    public runAction (data: ARActionData) {
        if (!data.trackableNode || !data.trackingNode) {
            return;
        }
        const trackingBase = data.trackingNode.getComponent(ARTrackingBase);
        if (this.getActivated(trackingBase?.trackingType)) {
            return;
        }
        this._trackableNode = data.trackableNode;

        data.matchTrackingUpdate = this._matchTrackingUpdate;

        this._updateAction(data);
        this.setActivated(true);
    }

    /**
    * @en update The action
    * @zh 刷新行为
    */
    public updateAction (data: ARActionData) {
        if (!data.closeTracking && this._matchTrackingUpdate) {
            this._updateAction(data);
        }

        if (this._faceToCamera) {
            const arCamera = director.getScene()!.getComponentInChildren(ARCameraMgr);
            if (arCamera?.Camera && data.trackablePose) {
                const dir = new Vec3();
                Vec3.subtract(dir, data.trackablePose.position, arCamera.Camera.node.position);
                const len = dir.length();
                Vec3.multiplyScalar(dir, dir, -1 / len);
                const quat = new Quat();
                Quat.fromViewUp(quat, dir);
                Quat.toEuler(dir, quat);
                Quat.fromEuler(data.trackablePose.rotation, 0, dir.y, 0);
            }
        }
    }

    public reset () {
        this.layout = AlignmentStyle.Center;
        this.towards = AlignmentOrientation.Local_Up;
        this.faceToCamera = false;
        this.matchTrackingUpdate = true;

        this.setActivated(false);
        this._trackableNode = null;
    }
}
