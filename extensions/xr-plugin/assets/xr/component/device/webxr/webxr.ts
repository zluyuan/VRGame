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

import { Camera, Vec3 } from 'cc';
import { ARAPI, FeatureType } from '../../../../ar/component/framework/utils/ar-defines';

// @ts-expect-error undefined xr
const _xr = navigator.xr;
declare type XRFrameFunction = (t: number, frame: any) => void;

// 'inline', AR - 'immersive-ar', VR - 'immersive-vr'
export class WebXR {
    private _mode = 'inline';
    private _featureMask = 0;
    private _sessionInit = {
        requiredFeatures: ['local', 'anchors'],
        optionalFeatures: [],
    };
    private _session: any = null;
    private _immersiveRefSpace = null;
    private _immersiveViewSpace = null;
    private _hitTestSource = null;
    private _cameraPose: any = null;
    private _framebuffer = null;
    private _baseLayer: any = null;
    private _viewport: any = null;
    private _gl: any = null;
    private _onXRFrame: XRFrameFunction | null = null;

    public _inputSource: any = null;
    public _targetRayPose: any = null;

    private _camera: Camera | null = null;
    get Camera (): Camera | null {
        return this._camera;
    }
    set Camera (val: Camera | null) {
        this._camera = val;
    }

    constructor (mode: string) {
        this._mode = mode;
    }

    async isSessionSupportedAsync (): Promise<boolean> {
        if (!_xr) {
            return Promise.resolve(false);
        }
        const functionToUse = _xr.isSessionSupported || _xr.supportsSession;
        if (!functionToUse) {
            return Promise.resolve(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return functionToUse.call(_xr, this._mode)
            .then((result: boolean) => {
                const returnValue = typeof result === 'undefined' ? true : result;
                return Promise.resolve(returnValue);
            })
            .catch((e: any) => {
                console.warn(e);
                return Promise.resolve(false);
            });
    }

    public initXRFrameCallback (frameCallback: (t: number, frame) => void) {
        this._onXRFrame = (t, frame) => {
            const session = frame.session;
            this._baseLayer = session.renderState.baseLayer;

            //window.cancelAnimationFrame();
            session.requestAnimationFrame(this._onXRFrame);

            this._cameraPose = frame.getViewerPose(this._immersiveRefSpace);
            this._framebuffer = frame.session.renderState.baseLayer.framebuffer;

            if (this._inputSource) {
                const targetRayPose = frame.getPose(this._inputSource.targetRaySpace, this._immersiveRefSpace);
                if (targetRayPose !== null) {
                    this._targetRayPose = targetRayPose;
                    const eventInitDict = this.getTouchInit(targetRayPose.transform.position);
                    this._gl.canvas.dispatchEvent(new TouchEvent('touchmove', eventInitDict));
                }
            }
            frameCallback(t, frame);
        };
    }

    public getSupportMask () {
        return this._featureMask;
    }

    async config (featureMask: number) {
        console.log(featureMask);
        this._featureMask = featureMask;
        if ((featureMask & FeatureType.PlaneDetection) !== 0) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            const supported = await this.checkFeatureSupportedAsync('plane-detection');
            if (supported) {
                this._sessionInit.requiredFeatures.push('plane-detection');
            } else {
                this._featureMask &= ~FeatureType.PlaneDetection;
            }
        }

        this.requestSession();
    }

    private checkFeatureSupportedAsync (featureName: string): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return _xr.requestSession(this._mode, { requiredFeatures: [featureName] }).then((session) => {
            session.end();
            return Promise.resolve(true);
        }).catch((err: DOMException) => Promise.resolve(false));
    }

    private requestSession () {
        _xr.requestSession(this._mode, this._sessionInit).then((session) => {
            session.mode = this._mode;
            session.isImmersive = true;
            this._session = session;

            // session start
            session.requestReferenceSpace('local').then((refSpace) => {
                this._immersiveRefSpace = refSpace;

                this._session.requestAnimationFrame(this._onXRFrame);

                this.attachController();
            });
            // session.requestReferenceSpace('viewer').then((refSpace) => {
            //     this._immersiveViewSpace = refSpace;
            //     session.requestHitTestSource({ space: this._immersiveViewSpace }).then((hitTestSource) => {
            //         this._hitTestSource = hitTestSource;
            //     });
            // });
        }).catch((err: DOMException) => {
            console.warn('requestSession err:', err);
        });
    }

    public getImmersiveRefSpace () {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._immersiveRefSpace;
    }

    private attachController () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        function onSessionEvent (event) {
            switch (event.inputSource.targetRayMode) {
            case 'tracked-pointer':
                that.attachTrackedPointerRayMode(event);
                break;
            case 'gaze':
                that.attachGazeMode(event);
                break;
            case 'screen':
                that.attachScreenRayMode(event);
                break;
            default:
                break;
            }
        }

        function onSessionEnd (event) {
            that._session.removeEventListener('select', onSessionEvent);
            that._session.removeEventListener('selectstart', onSessionEvent);
            that._session.removeEventListener('selectend', onSessionEvent);
            that._session.removeEventListener('squeeze', onSessionEvent);
            that._session.removeEventListener('squeezestart', onSessionEvent);
            that._session.removeEventListener('squeezeend', onSessionEvent);
            that._session.removeEventListener('end', onSessionEnd);
            that._session.removeEventListener('inputsourceschange', onInputSourcesChange);
        }

        function onInputSourcesChange (event) {

        }

        this._session.addEventListener('select', onSessionEvent);
        this._session.addEventListener('selectstart', onSessionEvent);
        this._session.addEventListener('selectend', onSessionEvent);
        this._session.addEventListener('squeeze', onSessionEvent);
        this._session.addEventListener('squeezestart', onSessionEvent);
        this._session.addEventListener('squeezeend', onSessionEvent);
        this._session.addEventListener('end', onSessionEnd);
        this._session.addEventListener('inputsourceschange', onInputSourcesChange);
    }

    private getTouchInit (worldPosition) {
        const outPos = new Vec3();
        this._camera?.worldToScreen(worldPosition, outPos);

        const touchInitDict: TouchInit = {
            identifier: 0,
            target: this._gl.canvas,
            clientX: outPos.x,
            clientY: outPos.y,
            pageX: outPos.x,
            pageY: outPos.y,
            screenX: outPos.x,
            screenY: outPos.y,
            force: 1,
            radiusX: 1,
            radiusY: 1,
        };

        const touch = new Touch(touchInitDict);
        const touches: Touch[] = [touch];
        const eventInitDict: TouchEventInit = {
            touches,
            targetTouches: touches,
            changedTouches: touches,
        };
        return eventInitDict;
    }

    private attachScreenRayMode (event) {
        const source = event.inputSource;
        this._inputSource = source;
        const targetRayPose = event.frame.getPose(source.targetRaySpace, this._immersiveRefSpace);
        if (!targetRayPose || !this._camera) {
            return;
        }
        this._targetRayPose = targetRayPose;
        const eventInitDict = this.getTouchInit(targetRayPose.transform.position);

        // eslint-disable-next-line default-case
        switch (event.type) {
        case 'selectstart':
            this._gl.canvas.dispatchEvent(new TouchEvent('touchstart', eventInitDict));
            break;
        case 'selectend':
            this._gl.canvas.dispatchEvent(new TouchEvent('touchend', eventInitDict));
            this._inputSource = null;
            break;
        }
    }

    private attachGazeMode (event) {

    }

    private attachTrackedPointerRayMode (event) {

    }

    onResume () {

    }
    onPause () {

    }
    update () {

    }

    getAPIState () {
        return this._session ? ARAPI.WebXR : -1;
    }

    // camera & background
    getCameraPose () {
        let poseArray = [
            0, 0, 0,
            0, 0, 0, 1,
        ];
        if (this._cameraPose) {
            const pos = this._cameraPose.transform.position;
            const rot = this._cameraPose.transform.orientation;
            poseArray = [
                pos.x, pos.y, pos.z,
                rot.x, rot.y, rot.z, rot.w,
            ];
        }

        return poseArray;
    }
    getCameraViewMatrix () {}
    getCameraProjectionMatrix () {
        if (this._cameraPose) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this._cameraPose.views[0].projectionMatrix;
        }
        return null;
    }
    getViewport () {
        // ar
        if (this._cameraPose && this._baseLayer) {
            this._viewport = this._baseLayer.getViewport(this._cameraPose.views[0]);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._viewport;
    }
    getXRLayerFrameBuffer () {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._framebuffer;
    }
    updateRenderState (gl) {
        this._gl = gl;
        if (this._session) {
            // @ts-expect-error undefined XRWebGLLayer
            this._session.updateRenderState({ baseLayer: new XRWebGLLayer(this._session, gl, {
                alpha: true,
                antialias: true,
                depth: true,
                framebufferScaleFactor: 0.5,
                ignoreDepthValues: false,
                stencil: true,
            }) });
        }
    }
}
