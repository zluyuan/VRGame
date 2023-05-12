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

import { sys, Vec2, Vec3, Quat, Size } from 'cc';
import { ARPlane, FeatureType } from '../../../../../ar/component/framework/utils/ar-defines';
import { ARTrackingFeature } from '../../ar-base/ar-feature-base';
import { ARHandlerPlaneDetection } from '../../ar-base/ar-handler-base';
import { ARMobileDevice } from '../ar-mobile-device';

export class ARMobileHandlerPlaneDetection extends ARHandlerPlaneDetection {
    private static readonly PLANE_INFO_SIZE = 12;

    public enablePlane (enable: boolean) {
        const nativeObj = (this._device as ARMobileDevice).NativeObj;
        nativeObj.enablePlane(enable);
    }

    public setPlaneDetectionMode (mode: number) {
        (this._device as ARMobileDevice).NativeObj.setPlaneDetectionMode(mode);
    }

    public getPlanePolygon (planeId: number): Array<Vec2> {
        const polygonArray: number[] = (this._device as ARMobileDevice).NativeObj.getPlanePolygon(planeId);
        const polygonVertices = new Array<Vec2>();
        const polygonVerticesCount = Math.floor(polygonArray.length * 0.5) * 2;
        for (let i = 0; i < polygonVerticesCount;) {
            polygonVertices.push(new Vec2(polygonArray[i++], polygonArray[i++]));
        }
        return polygonVertices;
    }

    public update () {
        const device = this._device as ARMobileDevice;
        const feature = device.tryGetFeatureByType(FeatureType.PlaneDetection);
        if (!feature || !feature.config?.enable) {
            return;
        }

        const planes: ARPlane[] = [];
        let planeInfos = (this._device as ARMobileDevice).NativeObj.getRemovedPlanesInfo();
        if (planeInfos.length > 0) {
            this.assembleInfos(planeInfos, planes);
            if (planes.length > 0) {
                (feature as ARTrackingFeature<ARPlane>).onRemoveTracking(planes);
            }
        }

        planeInfos = (this._device as ARMobileDevice).NativeObj.getAddedPlanesInfo();
        if (planeInfos.length > 0) {
            planes.length = 0;
            this.assembleInfos(planeInfos, planes);
            if (planes.length > 0) {
                (feature as ARTrackingFeature<ARPlane>).onAddTracking(planes);
            }
        }

        planeInfos = (this._device as ARMobileDevice).NativeObj.getUpdatedPlanesInfo();
        if (planeInfos.length > 0) {
            planes.length = 0;
            this.assembleInfos(planeInfos, planes);
            if (planes.length > 0) {
                (feature as ARTrackingFeature<ARPlane>).onUpdateTracking(planes);
            }
        }
    }

    private assembleInfos (src: number[], dst: ARPlane[]) {
        if (src) {
            const count = src.length / ARMobileHandlerPlaneDetection.PLANE_INFO_SIZE;
            let offset = 0;
            for (let i = 0; i < count; i++) {
                offset = i * ARMobileHandlerPlaneDetection.PLANE_INFO_SIZE;

                const plane: ARPlane = {
                    id: src[offset],
                    type: src[offset + 1],
                    trackingState: src[offset + 2],
                    extent: new Size(
                        src[offset + 3],
                        src[offset + 4],
                    ),
                    pose: {
                        position: new Vec3(
                            src[offset + 5],
                            src[offset + 6],
                            src[offset + 7],
                        ),
                        rotation: new Quat(
                            src[offset + 8],
                            src[offset + 9],
                            src[offset + 10],
                            src[offset + 11],
                        ),
                    },
                };
                dst.push(plane);
            }
        }
    }
}
