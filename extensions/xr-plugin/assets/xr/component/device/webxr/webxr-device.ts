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

import { ARBackgroundStage, director, game, Quat, RenderPipeline, Vec2, Vec3 } from 'cc';
import { WebXR } from './webxr';
import { ARDevice } from '../ar-base/ar-device-base';
import * as features from '../ar-base/ar-features';
import * as handlers from './ar-handler';
import { ARWebXRHandlerAnchor, ARWebXRHandlerPlaneDetection } from './ar-handler';
import { ARAnchor, ARAPI, ARFeatureData, ARRayCastMode, FeatureType } from '../../../../ar/component/framework/utils/ar-defines';

export class WebXRDevice extends ARDevice {
    private _webXR: WebXR | null = null;
    get WebXRObj () {
        return this._webXR;
    }

    get HandlerPrefix (): string {
        return 'ARWebXRHandler';
    }

    private _lastTime = 0;
    public replaceFrameMoveFlag = false;

    public async init (featuresDataset: ARFeatureData[]) {
        this.initRendering();

        this._webXR = new WebXR('immersive-ar');
        const isSupported = await this._webXR.isSessionSupportedAsync();
        console.log('web xr isSupported : ', isSupported);
        if (!isSupported) {
            return Promise.resolve(false);
        }
        this.createFeatures(featuresDataset);
        this.createHandlers();

        await this._webXR.config(this._featureConfigMask);

        this.initFeatures(featuresDataset);

        // check for feature support, eliminate unsupported features
        this.checkFeaturesSupport(this._webXR.getSupportMask());

        globalThis.__globalXR.ar = this;

        this._webXR.initXRFrameCallback((t: number, frame) => {
            const dt = t - this._lastTime;

            this.replaceFrameMoveFlag = true;
            game.pause();
            director.tick(dt / 1000);

            this._featuresMap.forEach((feature) => {
                const handler = feature.getHandler();
                if (this._webXR && handler) {
                    handler.process(frame, this._webXR.getImmersiveRefSpace());
                }
            });

            this._lastTime = t;
        });

        return Promise.resolve(true);
    }

    private initRendering () {
        const pipeline = director?.root?.pipeline as RenderPipeline;
        const arBackgroundStage = new ARBackgroundStage();
        arBackgroundStage.initialize(ARBackgroundStage.initInfo);
        const flows = pipeline.flows;
        // TODO: Need to improve
        const forwardFlow = flows[flows.length - 1];
        forwardFlow.stages.push(arBackgroundStage);
        forwardFlow.activate(forwardFlow.pipeline);
    }

    public start () {
        this._featuresMap.forEach((feature) => {
            feature.start();
        });
    }

    public stop () {
        // stop ar session
    }

    public resume () {

    }

    public pause () {

    }

    public update () {
        if (!this._webXR) {
            return;
        }

        this._webXR.update();

        this.updateHandlers();
    }

    public getAPIState (): number {
        if (this._webXR) {
            return this._webXR.getAPIState();
        }
        return -1;
    }

    protected checkFeatureAvailable (featureClassName: string): boolean {
        return !!(<any>features)[featureClassName];
    }
    protected createFeature (featureClassName: string): any {
        const featureInstance = new (<any>features)[featureClassName](this);
        return featureInstance;
    }

    protected createHandler (featureType: FeatureType): any {
        const handlerClass = this.HandlerPrefix + FeatureType[featureType];
        const handler = new (<any>handlers)[handlerClass](this);
        return handler;
    }

    public isWebXR (): boolean {
        return this.getAPIState() === ARAPI.WebXR;
    }

    public getViewport () {
        if (this._webXR) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this._webXR.getViewport();
        }
        return null;
    }

    public getXRLayerFrameBuffer (): WebGLFramebuffer | null {
        if (this._webXR) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this._webXR.getXRLayerFrameBuffer();
        }
        return null;
    }

    public updateRenderState (gl: WebGLRenderingContext) {
        this._webXR?.updateRenderState(gl);
    }

    public async hitTest (mode: ARRayCastMode, touchPoint?: Vec2): Promise<ARAnchor> {
        if ((mode & ARRayCastMode.RAYCAST_ANCHOR) === ARRayCastMode.RAYCAST_ANCHOR) {
            const feature = this.tryGetFeatureByType(FeatureType.Anchor);
            if (feature && this._webXR) {
                // eslint-disable-next-line max-len
                return (feature.getHandler() as ARWebXRHandlerAnchor).tryHitTest(this._webXR._targetRayPose.transform, this._webXR._inputSource.targetRaySpace);
            }
        }
        if ((mode & ARRayCastMode.RAYCAST_PLANE_EXTENT) === ARRayCastMode.RAYCAST_PLANE_EXTENT
            || (mode & ARRayCastMode.RAYCAST_PLANE_POLYGON) === ARRayCastMode.RAYCAST_PLANE_POLYGON) {
            const feature = this.tryGetFeatureByType(FeatureType.PlaneDetection);
            if (feature && this._webXR) {
                return (feature.getHandler() as ARWebXRHandlerPlaneDetection).tryHitTest(this._webXR._targetRayPose.transform);
            }
        }
        return { id: -1, pose: { position: new Vec3(0, 0, 0), rotation: new Quat(0, 0, 0, 0) } };
    }
}
