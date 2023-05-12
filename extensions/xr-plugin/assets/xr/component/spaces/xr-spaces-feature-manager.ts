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

import { _decorator, Component } from 'cc';

const { ccclass, menu } = _decorator;

export enum XRSpacesFeatureType {
    UNKNOWN = -1,
    IMAGE_TRACKING = 0,
    HIT_TESTING = 1,
    PLANE_DETECTION = 2,
    SPATIAL_ANCHOR = 3
}

export enum XRSpacesConfigKey {
    IMAGE_TRACKING = 19,
    IMAGE_TRACKING_CANDIDATEIMAGE = 20,
    IMAGE_TRACKING_DATA = 21,
    IMAGE_TRACKING_SUPPORT_STATUS = 22,
    HIT_TESTING = 23,
    HIT_TESTING_DATA = 24,
    HIT_TESTING_SUPPORT_STATUS = 25,
    PLANE_DETECTION = 26,
    PLANE_DETECTION_DATA = 27,
    PLANE_DETECTION_SUPPORT_STATUS = 28,
    SPATIAL_ANCHOR = 29,
    SPATIAL_ANCHOR_DATA = 30,
    SPATIAL_ANCHOR_SUPPORT_STATUS = 31,
}

@ccclass('cc.spaces.XRSpacesFeatureManager')
@menu('hidden:XR/Spaces/FeatureManager')
export class XRSpacesFeatureManager extends Component {
    private _isRunning = false;
    protected onStart (): void {

    }

    protected onStop (): void {

    }

    public getFeatureType (): XRSpacesFeatureType {
        return XRSpacesFeatureType.UNKNOWN;
    }

    protected onRetrieveChanges (deltaTime: number): void {

    }

    start () {

    }

    update (deltaTime: number) {
        if (this._isRunning) {
            this.onRetrieveChanges(deltaTime);
        }
    }

    onEnable (): void {
        console.log(`[XRSpacesFeatureManager] onEnable.${this.getFeatureType().toString()}`);
    }

    onDisable (): void {
        console.log(`[XRSpacesFeatureManager] onDisable.${this.getFeatureType().toString()}`);
    }

    onDestroy (): void {
        this.disableFeature();
    }

    public enableFeature (): void {
        if (!this._isRunning) {
            this._isRunning = true;
            this.onStart();
        }
    }

    public disableFeature (): void {
        if (this._isRunning) {
            this._isRunning = false;
            this.onStop();
        }
    }

    public isRunning (): boolean {
        return this._isRunning;
    }
}
