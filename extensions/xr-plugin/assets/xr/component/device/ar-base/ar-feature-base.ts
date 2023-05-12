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

import { _decorator } from 'cc';
import { ARAnchor, ARFeatureData, FeatureType } from '../../../../ar/component/framework/utils/ar-defines';
import { ARHandler } from './ar-handler-base';

export class FeatureEvent<T> {
    private _handlers: {(data?: T): void}[] = [];

    on (handler: (data?: T) => void): void {
        this._handlers.push(handler);
    }
    off (handler: (data?: T) => void): void {
        this._handlers = this._handlers.filter((h) => h !== handler);
    }

    trigger (data?: T) {
        this._handlers.forEach((h) => h(data));
    }
}

export abstract class ARFeature {
    public abstract get featureId(): FeatureType;

    public get enable (): boolean {
        if (this._config) {
            return this._config.enable;
        }
        return false;
    }

    public set enable (value) {
        if (this._config) {
            if (this._config.enable === value) {
                return;
            }
            this._config.enable = value;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this._config.enable ? this.onEnable() : this.onDisable();
        }
    }

    protected _config: ARFeatureData | null = null;
    public get config () {
        return this._config;
    }

    protected _handler: ARHandler | null = null;
    public setHandler (handler: ARHandler | null) {
        this._handler = handler;
    }
    public getHandler () {
        return this._handler;
    }

    public init (config: ARFeatureData) {
        this._config = config;
    }

    public start () {
        if (this._config) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this._config.enable ? this.onEnable() : this.onDisable();
        }
    }

    public stop () {
        this.onDisable();
    }

    public update () {}
    protected onEnable () {}
    protected onDisable () {}
}

export abstract class ARTrackingFeature<T extends ARAnchor> extends ARFeature {
    readonly onAddEvent = new FeatureEvent<T[]>();
    readonly onUpdateEvent = new FeatureEvent<T[]>();
    readonly onRemoveEvent = new FeatureEvent<T[]>();

    public onAddTracking (data: T[]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        data && this.onAddEvent.trigger(data);
    }

    public onUpdateTracking (data: T[]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        data && this.onUpdateEvent.trigger(data);
    }

    public onRemoveTracking (data: T[]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        data && this.onRemoveEvent.trigger(data);
    }
}
