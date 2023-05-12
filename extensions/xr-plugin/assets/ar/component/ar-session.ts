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

import { _decorator, Component, director, Director, sys } from 'cc';
import { EDITOR } from 'cc/env';
import { ARDevice } from '../../xr/component/device/ar-base/ar-device-base';
import { ARDeviceManager } from '../../xr/component/device/ar-device-manager';
import { ARManager } from './ar-manager';
import { arEvent } from './framework/utils/ar-event';

const { ccclass, property, help, menu, disallowMultiple, executeInEditMode } = _decorator;

/**
 * @en
 * AR Session components manage and control session startup and life cycle processes
 * @zh
 * AR会话组件，用于管理和控制Session启动以及生命周期等流程
 */
@ccclass('cc.ARSession')
@help('i18n:cc.ARSession')
@menu('XR/AR Tracking/ARSession')
@disallowMultiple
@executeInEditMode
export class ARSession extends Component {
    @property({ serializable: true })
    protected _autoStartARSession = true;

    @property({
        displayOrder: 1,
        tooltip: 'i18n:xr-plugin.tracking.session.autoStartARSession',
        })
    set autoStartARSession (val) {
        if (val === this._autoStartARSession) {
            return;
        }
        this._autoStartARSession = val;
    }
    get autoStartARSession () {
        return this._autoStartARSession;
    }

    protected _device: ARDevice | null = null;
    protected _arManager: ARManager | null = null;
    protected static _session: ARSession | null = null;

    get device () {
        return this._device;
    }

    get manager () {
        return this._arManager;
    }

    public static getSession (): ARSession | null {
        return this._session;
    }

    protected start () {
        if (!EDITOR && this.autoStartARSession && !sys.isBrowser) {
            this.startSession();
        }
    }
    protected onLoad () {
        ARSession._session = this;
        this._arManager = this.getComponent(ARManager);
    }

    protected onDestroy () {
        this.endSession();
    }

    public startSession () {
        if (!this._arManager) {
            return;
        }
        this._arManager.collectFeature();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        ARDeviceManager.create(this._arManager.configuration.config).then((device) => {
            this._device = device;
            if (this._device && this._arManager) {
                this._arManager.init(this._device);
                this._device.start();
            }
            arEvent.dispatchDeviceInited(device);
        });
    }

    public endSession () {
        this._device?.stop();
        if (ARSession._session && ARSession._session !== this) {
            ARSession._session.destroy();
            ARSession._session = null;
        }
    }

    protected onEnable () {
        if (ARSession._session && ARSession._session !== this) {
            ARSession._session.destroy();
            ARSession._session = null;
        }
        ARSession._session = this;
        director.on(Director.EVENT_BEFORE_UPDATE, this.onBeforeUpdate, this);
    }

    protected onDisable () {
        this.endSession();
        director.off(Director.EVENT_BEFORE_UPDATE, this.onBeforeUpdate, this);
    }

    private onBeforeUpdate () {
        if (!EDITOR && this._device) {
            this._device.update();

            if (this._arManager) {
                this._arManager.updateSystem();
            }
        }
    }
}
