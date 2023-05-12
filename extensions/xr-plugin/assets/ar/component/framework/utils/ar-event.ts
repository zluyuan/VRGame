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

import { ccenum, EventTarget } from 'cc';
import { ARDevice } from '../../../../xr/component/device/ar-base/ar-device-base';
import { MoveEvent, PlaceEvent, RotateEvent, ScaleEvent, SelectEvent } from '../../interaction/ar-interaction-define';
import { FaceBlendShapeEventParam, FeatureEventParam } from './ar-defines';

/**
 * @en The event type
 * @zh 事件类型
 */
export enum AREventType {
    /**
    * @en The AR feature collects events
    * @zh AR特性收集事件
    */
    COLLECT_FEATURE = 'collect-feature',
    /**
    * @en The event is triggered when the AR device initialization is complete
    * @zh AR设备初始化完成时触发事件
    */
    DEVICE_INITED = 'device-inited',
    CHECK_TRACKING_NODE_STATE = 'check-tracking-node-state',

    FACE_BLEND_SHAPE = 'face-blend-shape',

    SELECT_ACTION = 'select_action',
    PLACE_ACTION = 'place_action',
    SELECT_MOVE_ACTION = 'select_move_action',
    SELECT_ROTATE_ACTION = 'select_rotate_action',
    SELECT_SCALE_ACTION = 'select_sacle_action',
}

interface InputEventMap {
    [AREventType.COLLECT_FEATURE]: (event: FeatureEventParam) => void,
    [AREventType.DEVICE_INITED]: (event: ARDevice | null) => void,
    [AREventType.CHECK_TRACKING_NODE_STATE]: (event: FeatureEventParam) => void,

    [AREventType.FACE_BLEND_SHAPE]: (event: FaceBlendShapeEventParam) => void,

    [AREventType.SELECT_ACTION]: (event: SelectEvent) => void,
    [AREventType.PLACE_ACTION]: (event: PlaceEvent) => void,
    [AREventType.SELECT_MOVE_ACTION]: (event: MoveEvent) => void,
    [AREventType.SELECT_ROTATE_ACTION]: (event: RotateEvent) => void,
    [AREventType.SELECT_SCALE_ACTION]: (event: ScaleEvent) => void,
}

ccenum(AREventType);

export class AREvent {
    /**
     * @en The event
     * @zh 事件对象
     */
    private _eventTarget: EventTarget = new EventTarget();

    /**
     * @en
     * Register a callback of a specific input event type.
     * @zh
     * 注册特定的输入事件回调。
     *
     * @param eventType - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     */
    public on<K extends keyof InputEventMap> (eventType: K, callback: InputEventMap[K], target?: any) {
        this._eventTarget.on(eventType, callback, target);
        return callback;
    }

    /**
     * @en
     * Register a callback of a specific input event type once.
     * @zh
     * 注册单次的输入事件回调。
     *
     * @param eventType - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     */
    public once<K extends keyof InputEventMap> (eventType: K, callback: InputEventMap[K], target?: any) {
        this._eventTarget.once(eventType, callback, target);
        return callback;
    }

    /**
     * @en
     * Unregister a callback of a specific input event type.
     * @zh
     * 取消注册特定的输入事件回调。
     *
     * @param eventType - The event type
     * @param callback - The event listener's callback
     * @param target - The event listener's target and callee
     */
    public off<K extends keyof InputEventMap> (eventType: K, callback?: InputEventMap[K], target?: any) {
        this._eventTarget.off(eventType, callback, target);
    }

    /**
     * @en
     * emit a event type.
     * @zh
     * 发射事件。
     *
     * @param eventType - The event type
     * @param arg - The event arg
     */
    public dispatch<K extends keyof InputEventMap> (eventType: K,  arg?: any): boolean {
        this._eventTarget.emit(eventType, arg, this);
        return true;
    }

    public dispatchDeviceInited (arg: ARDevice | null) {
        this._eventTarget.emit(AREventType.DEVICE_INITED, arg, this);
    }

    public collectFeature (arg: FeatureEventParam) {
        this._eventTarget.emit(AREventType.COLLECT_FEATURE, arg, this);
    }

    public checkTrackingNodeState (arg: FeatureEventParam) {
        this._eventTarget.emit(AREventType.CHECK_TRACKING_NODE_STATE, arg, this);
    }
}

/**
 * @en
 * The singleton of the ar event class.
 *
 * @zh
 * ar动作事件单例
 *
 * @example
 * ```
 * arEvent.on(ArEventType.COLLECT_FEATURE, this.onCollectFeatureEvent, this);
 * arEvent.off(ArEventType.COLLECT_FEATURE, this.onCollectFeatureEvent, this);
 * ```
 */
export const arEvent = new AREvent();
