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

import { Quat, Vec3 } from 'cc';
import { XRAnchor, XRPose, XRRigidTransform } from '../webxr-defines';
import { ARTrackingFeature } from '../../ar-base/ar-feature-base';
import { ARHandlerAnchor } from '../../ar-base/ar-handler-base';
import { WebXRDevice } from '../webxr-device';
import { ARAnchor, FeatureType } from '../../../../../ar/component/framework/utils/ar-defines';

interface IWebXRFutureAnchor {
    /**
     * The native anchor
     */
    nativeAnchor?: XRAnchor;
    /**
     * Was this request submitted to the xr frame?
     */
    submitted: boolean;
    /**
     * Was this promise resolved already?
     */
    resolved: boolean;
    /**
     * A resolve function
     */
    resolve: (xrAnchor: ARAnchor) => void;
    /**
     * A reject function
     */
    reject: (msg?: string) => void;
    /**
     * The XR Transformation of the future anchor
     */
    xrTransformation: XRRigidTransform;

    targetRaySpace: any
}

export interface IWebXRAnchor {
    id: number;
    anchorPose: XRPose;
    remove(): void;
}

export class ARWebXRHandlerAnchor extends ARHandlerAnchor {
    private _enable = true;
    private _anchorId = 1;
    private _allAnchors = new Map();
    private _futureAnchors: IWebXRFutureAnchor[] = [];
    private _immersiveRefSpace = null;

    public enableAnchor (enable: boolean) {
        this._enable = enable;
    }

    public process (frame, immersiveRefSpace) {
        this._immersiveRefSpace = immersiveRefSpace;
        if (!this._enable || !frame) {
            return;
        }
        const device = this._device as WebXRDevice;
        const feature = device.tryGetFeatureByType(FeatureType.Anchor);
        if (!feature) {
            return;
        }

        const trackedAnchors = frame.trackedAnchors;

        const removedAnchors: ARAnchor[] = [];
        const addedAnchors: ARAnchor[] = [];
        const updatedAnchors: ARAnchor[] = [];
        if (trackedAnchors) {
            this._allAnchors.forEach((anchorContext, xrAnchor) => {
                if (!trackedAnchors.has(xrAnchor)) {
                    // anchor was removed
                    this._allAnchors.delete(xrAnchor);
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    console.debug(`Anchor no longer tracked, id=${anchorContext.id}`);
                    const anchor = this._updateAnchorWithXRAnchor(anchorContext);
                    removedAnchors.push(anchor);
                }
            });

            trackedAnchors.forEach((xrAnchor) => {
                const anchorPose = frame.getPose(xrAnchor.anchorSpace, immersiveRefSpace);
                if (anchorPose) {
                    if (this._allAnchors.has(xrAnchor)) {
                        // may have been updated:
                        const anchorContext: IWebXRAnchor = this._allAnchors.get(xrAnchor);
                        anchorContext.anchorPose = anchorPose;

                        const anchor = this._updateAnchorWithXRAnchor(anchorContext);
                        updatedAnchors.push(anchor);
                    } else {
                        // new anchor created:
                        const anchorContext: IWebXRAnchor  = {
                            id: this._anchorId,
                            anchorPose,
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                            remove: () => xrAnchor.delete(),
                        };
                        this._allAnchors.set(xrAnchor, anchorContext);
                        const anchor = this._updateAnchorWithXRAnchor(anchorContext);
                        addedAnchors.push(anchor);
                        console.debug(`New anchor created, id=${this._anchorId}`);

                        // search for the future anchor promise that matches this
                        const results = this._futureAnchors.filter((futureAnchor) => futureAnchor.nativeAnchor === xrAnchor);
                        const result = results[0];
                        if (result) {
                            result.resolve(anchor);
                            result.resolved = true;
                        }

                        this._anchorId++;
                    }
                }
            });

            if (removedAnchors.length > 0) {
                (feature as ARTrackingFeature<ARAnchor>).onRemoveTracking(removedAnchors);
            }
            if (addedAnchors.length > 0) {
                (feature as ARTrackingFeature<ARAnchor>).onAddTracking(addedAnchors);
            }
            if (updatedAnchors.length > 0) {
                (feature as ARTrackingFeature<ARAnchor>).onUpdateTracking(updatedAnchors);
            }
        }

        // process future anchors
        this._futureAnchors.forEach((futureAnchor) => {
            if (!futureAnchor.resolved && !futureAnchor.submitted) {
                this._createAnchorAtTransformation(futureAnchor.xrTransformation, frame, futureAnchor.targetRaySpace).then(
                    (nativeAnchor) => {
                        futureAnchor.nativeAnchor = nativeAnchor;
                    },
                    (error) => {
                        futureAnchor.resolved = true;
                        futureAnchor.reject(error);
                    },
                );
                futureAnchor.submitted = true;
            }
        });
    }

    private _updateAnchorWithXRAnchor (anchorContext: IWebXRAnchor): ARAnchor {
        const anchor: ARAnchor = {
            id: anchorContext.id,
            pose: {
                position: new Vec3(
                    anchorContext.anchorPose.transform.position.x,
                    anchorContext.anchorPose.transform.position.y,
                    anchorContext.anchorPose.transform.position.z,
                ),
                rotation: new Quat(
                    anchorContext.anchorPose.transform.orientation.x,
                    anchorContext.anchorPose.transform.orientation.y,
                    anchorContext.anchorPose.transform.orientation.z,
                    anchorContext.anchorPose.transform.orientation.w,
                ),
            },
        };
        return anchor;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    private async _createAnchorAtTransformation (xrTransformation: XRRigidTransform, frame, targetRaySpace) {
        if (frame.createAnchor) {
            try {
                // let anchorPose = new XRRigidTransform(
                //     {x: 0, y: 0, z: -1},
                //     {x: 0, y: 0, z: 0, w: 1});
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return frame.createAnchor(xrTransformation, this._immersiveRefSpace);
                // return frame.createAnchor(anchorPose, targetRaySpace);
            } catch (error) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                throw new Error(`${error}`);
            }
        } else {
            throw new Error('Anchors are not enabled in your browser');
        }
    }

    public tryHitTest (xrTransformation: XRRigidTransform, targetRaySpace): Promise<ARAnchor>  {
        return new Promise<ARAnchor>((resolve, reject) => {
            this._futureAnchors.push({
                nativeAnchor: undefined,
                resolved: false,
                submitted: false,
                xrTransformation,
                targetRaySpace,
                resolve,
                reject,
            });
        });
    }
}
