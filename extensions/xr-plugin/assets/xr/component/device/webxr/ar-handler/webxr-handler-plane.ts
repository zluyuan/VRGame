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

import { Quat, Size, Vec2, Vec3 } from 'cc';
import { ARAnchor, ARPlane, FeatureType } from '../../../../../ar/component/framework/utils/ar-defines';
import { ARTrackingFeature } from '../../ar-base/ar-feature-base';
import { ARHandlerPlaneDetection } from '../../ar-base/ar-handler-base';
import { XRPlane, XRPose, XRRigidTransform } from '../webxr-defines';
import { WebXRDevice } from '../webxr-device';

interface IWebXRPlane {
    id: number;
    planePose: XRPose;
    xrPlane: XRPlane;
}

// Negates a vector. All componenes except |w| are negated.
// eslint-disable-next-line func-names
const neg = function (vector) {
    return { x: -vector.x, y: -vector.y, z: -vector.z, w: vector.w };
};

// Subtracts 2 vectors.
// eslint-disable-next-line func-names
const sub = function (lhs, rhs) {
    // eslint-disable-next-line max-len
    if (!((lhs.w === 1 && rhs.w === 1) || (lhs.w === 1 && rhs.w === 0) || (lhs.w === 0 && rhs.w === 0))) console.error('only point - point, point - line or line - line subtraction is allowed');
    return { x: lhs.x - rhs.x, y: lhs.y - rhs.y, z: lhs.z - rhs.z, w: lhs.w - rhs.w };
};

// Subtracts 2 vectors.
// eslint-disable-next-line func-names
const add = function (lhs, rhs) {
    if (!((lhs.w === 0 && rhs.w === 1) || (lhs.w === 1 && rhs.w === 0))) console.error('only line + point or point + line addition is allowed');
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return { x: lhs.x + rhs.x, y: lhs.y + rhs.y, z: lhs.z + rhs.z, w: lhs.w + rhs.w };
};

// Scales a vector by a scalar. All components except |w| are scaled.
// eslint-disable-next-line func-names
const mul = function (vector, scalar) {
    return { x: vector.x * scalar, y: vector.y * scalar, z: vector.z * scalar, w: vector.w };
};

// eslint-disable-next-line func-names
const normalize_perspective = function (point) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (point.w === 0 || point.w === 1) return point;

    return {
        x: point.x / point.w,
        y: point.y / point.w,
        z: point.z / point.w,
        w: 1,
    };
};

// eslint-disable-next-line func-names
const dotProduct = function (lhs, rhs) {
    return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
};

// eslint-disable-next-line func-names
const crossProduct = function (lhs, rhs) {
    return {
        x: lhs.y * rhs.z - lhs.z * rhs.y,
        y: lhs.z * rhs.x - lhs.x * rhs.z,
        z: lhs.x * rhs.y - lhs.y * rhs.x,
        w: 0,
    };
};

// eslint-disable-next-line func-names
const length = function (vector) {
    return Math.sqrt(dotProduct(vector, vector));
};

// eslint-disable-next-line func-names
const normalize = function (vector) {
    const l = length(vector);
    return mul(vector, 1.0 / l);
};
// eslint-disable-next-line func-names
const crossProduct2d = function (lhs, rhs) {
    return lhs.x * rhs.z - lhs.z * rhs.x;
};

export class ARWebXRHandlerPlaneDetection extends ARHandlerPlaneDetection {
    private _enable = true;
    private _detectionMode = 0;
    private _planeId = 1;
    private _allPlanes = new Map();
    private _hitResult: any = null;

    public enablePlane (enable: boolean) {
        this._enable = enable;
    }

    public setPlaneDetectionMode (mode: number) {
        this._detectionMode = mode;
    }

    public getPlanePolygon (planeId: number): Array<Vec2> {
        const polygon = new Array<Vec2>();
        this._allPlanes.forEach((planeContext, xrPlane) => {
            if (planeContext.id === planeId) {
                const xrPolygon = xrPlane.polygon;
                for (let i = 0; i < xrPolygon.length; ++i) {
                    polygon.push(new Vec2(xrPolygon[i].x, xrPolygon[i].z));
                }
            }
        });
        return polygon;
    }

    public process (frame, immersiveRefSpace) {
        if (!this._enable || !frame) {
            return;
        }
        const device = this._device as WebXRDevice;
        const feature = device.tryGetFeatureByType(FeatureType.PlaneDetection);
        if (!feature) {
            return;
        }
        const detectedPlanes = frame.detectedPlanes || frame.worldInformation?.detectedPlanes;

        const removedPlanes: ARPlane [] = [];
        const addedPlanes: ARPlane [] = [];
        const updatedPlanes: ARPlane [] = [];

        if (detectedPlanes) {
            this._allPlanes.forEach((planeContext, xrPlane) => {
                if (!detectedPlanes.has(xrPlane)) {
                    // plane was removed
                    this._allPlanes.delete(xrPlane);
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    console.debug(`plane was removed, id=${planeContext.id}`);
                    const plane: ARPlane = this._updatePlaneWithXRPlane(planeContext);
                    removedPlanes.push(plane);
                }
            });

            detectedPlanes.forEach((xrPlane) => {
                const planePose = frame.getPose(xrPlane.planeSpace, immersiveRefSpace);
                if (planePose) {
                    if (this._allPlanes.has(xrPlane)) {
                        // may have been updated:
                        const planeContext: IWebXRPlane = this._allPlanes.get(xrPlane);
                        if (planeContext.xrPlane.lastChangedTime < xrPlane.lastChangedTime) {
                            // updated!
                            planeContext.planePose = planePose;
                            const plane: ARPlane = this._updatePlaneWithXRPlane(planeContext);

                            updatedPlanes.push(plane);
                        }
                    } else {
                        // new plane
                        // eslint-disable-next-line no-lonely-if
                        if (this.checkPlaneOrientation(xrPlane.orientation)) {
                            const planeContext: IWebXRPlane = {
                                id: this._planeId,
                                planePose,
                                xrPlane,
                            };
                            this._allPlanes.set(xrPlane, planeContext);
                            const plane: ARPlane = this._updatePlaneWithXRPlane(planeContext);
                            console.debug(`New plane detected, id=${this._planeId}`);
                            addedPlanes.push(plane);
                            this._planeId++;
                        }
                    }
                }
            });

            if (removedPlanes.length > 0) {
                (feature as ARTrackingFeature<ARPlane>).onRemoveTracking(removedPlanes);
            }
            if (addedPlanes.length > 0) {
                (feature as ARTrackingFeature<ARPlane>).onAddTracking(addedPlanes);
            }
            if (updatedPlanes.length > 0) {
                (feature as ARTrackingFeature<ARPlane>).onUpdateTracking(updatedPlanes);
            }
        }
    }

    private _updatePlaneWithXRPlane (planeContext: IWebXRPlane): ARPlane {
        const plane: ARPlane = {
            id: planeContext.id,
            type: planeContext.xrPlane.orientation === 'Horizontal' ? 3 : 4,
            extent: this.calPolygonSize(planeContext.xrPlane.polygon),
            pose: {
                position: new Vec3(
                    planeContext.planePose.transform.position.x,
                    planeContext.planePose.transform.position.y,
                    planeContext.planePose.transform.position.z,
                ),
                rotation: new Quat(
                    planeContext.planePose.transform.orientation.x,
                    planeContext.planePose.transform.orientation.y,
                    planeContext.planePose.transform.orientation.z,
                    planeContext.planePose.transform.orientation.w,
                ),
            },
        };
        return plane;
    }

    private checkPlaneOrientation (orientation: string) {
        // 3 --Horizontal 4 --Vertical 7 --All
        if (this._detectionMode === 3 && orientation === 'Horizontal'
            || this._detectionMode === 4 && orientation === 'Vertical'
            || this._detectionMode === 7) {
            return true;
        }
        return false;
    }

    private calPolygonSize (polygon) {
        const x: number[] = [];
        const z: number[] = [];
        for (let i = 0; i < polygon.length; ++i) {
            const cur: Vec3 = polygon[i];
            x.push(cur.x);
            z.push(cur.z);
        }
        x.sort((a, b) => a - b);
        z.sort((a, b) => a - b);

        const distX = x[0] > x[x.length - 1] ? x[0] - x[x.length - 1] : x[x.length - 1] - x[0];
        const distZ = z[0] > z[z.length - 1] ? z[0] - z[z.length - 1] : z[z.length - 1] - z[0];
        return new Size(distX, distZ);
    }

    // |matrix| - Float32Array, |input| - point-like dict (must have x, y, z, w)
    private transform_point_by_matrix (matrix, input) {
        return {
            x: matrix[0] * input.x + matrix[4] * input.y + matrix[8] * input.z + matrix[12] * input.w,
            y: matrix[1] * input.x + matrix[5] * input.y + matrix[9] * input.z + matrix[13] * input.w,
            z: matrix[2] * input.x + matrix[6] * input.y + matrix[10] * input.z + matrix[14] * input.w,
            w: matrix[3] * input.x + matrix[7] * input.y + matrix[11] * input.z + matrix[15] * input.w,
        };
    }

    private calculateHitMatrix (ray_vector, plane_normal, point) {
        // projection of ray_vector onto a plane
        const ray_vector_projection = sub(ray_vector, mul(plane_normal, dotProduct(ray_vector, plane_normal)));

        // new coordinate system axes
        const y = plane_normal;
        const z = normalize(neg(ray_vector_projection));
        const x = normalize(crossProduct(y, z));

        const hitMatrix = new Float32Array(16);

        hitMatrix[0] = x.x;
        hitMatrix[1] = x.y;
        hitMatrix[2] = x.z;
        hitMatrix[3] = 0;

        hitMatrix[4] = y.x;
        hitMatrix[5] = y.y;
        hitMatrix[6] = y.z;
        hitMatrix[7] = 0;

        hitMatrix[8] = z.x;
        hitMatrix[9] = z.y;
        hitMatrix[10] = z.z;
        hitMatrix[11] = 0;

        hitMatrix[12] = point.x;
        hitMatrix[13] = point.y;
        hitMatrix[14] = point.z;
        hitMatrix[15] = 1;

        return hitMatrix;
    }

    private hitTest (ray) {
        const hit_test_results: any[] = [];
        this._allPlanes.forEach((planeContext, xrPlane) => {
            const result = this.hitTestPlane(ray, xrPlane, planeContext.planePose);
            if (result) {
                result.id = planeContext.id;
                // throw away results with no intersection with plane
                hit_test_results.push(result);
            }
        });

        // throw away all strange results (ray lies on plane)
        const hit_test_results_with_points = hit_test_results.filter((maybe_plane) => typeof maybe_plane.point !== 'undefined');

        // sort results by distance
        hit_test_results_with_points.sort((l, r) => l.distance - r.distance);

        // throw away the ones that don't fall within polygon bounds (except the bottommost plane)
        // convert hittest results to something that the caller expects

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return hit_test_results_with_points;
    }

    private hitTestPlane (ray, xrPlane, plane_pose): any {
        if (!plane_pose) {
            return null;
        }

        const plane_normal = this.transform_point_by_matrix(plane_pose.transform.matrix, { x: 0, y: 1.0, z: 0, w: 0 });
        const plane_center = normalize_perspective(this.transform_point_by_matrix(plane_pose.transform.matrix, { x: 0, y: 0, z: 0, w: 1.0 }));

        const ray_origin = ray.origin;
        const ray_vector = ray.direction;

        const numerator = dotProduct(sub(plane_center, ray_origin), plane_normal);
        const denominator = dotProduct(ray_vector, plane_normal);
        if (denominator < 0.0001 && denominator > -0.0001) {
            // parallel planes
            if (numerator < 0.0001 && numerator > -0.0001) {
                // contained in the plane
                console.debug('Ray contained in the plane', xrPlane);
                return { plane: xrPlane };
            } else {
                // no hit
                console.debug('No hit', xrPlane);
                return null;
            }
        } else {
            // single point of intersection
            const d =  numerator / denominator;
            if (d < 0) {
                // no hit - plane-line intersection exists but not for half-line
                console.debug('No hit', d, xrPlane);
                return null;
            } else {
                // hit test point coordinates in frameOfReference
                const point = add(ray_origin, mul(ray_vector, d));

                // hit test point coodinates relative to plane pose
                const point_on_plane = this.transform_point_by_matrix(plane_pose.transform.inverse.matrix, point);

                console.assert(Math.abs(point_on_plane.y) < 0.0001, 'Incorrect Y coordinate of mapped point');

                const hitMatrix = this.calculateHitMatrix(ray_vector, plane_normal, point);
                return {
                    distance: d,
                    plane: xrPlane,
                    ray,
                    point,
                    point_on_plane,
                    hitMatrix,
                    pose_matrix: plane_pose.transform.matrix,
                };
            }
        }
    }

    private simplifyPolygon (polygon) {
        const result: Vec3[] = [];
        let previous_point = polygon[polygon.length - 1];
        for (let i = 0; i < polygon.length; ++i) {
            const current_point = polygon[i];

            const segment = sub(current_point, previous_point);
            if (length(segment) < 0.001) {
                continue;
            }

            result.push(current_point);
            previous_point = current_point;
        }

        return result;
    }

    // Filters hit test results to keep only the planes for which the used ray falls
    // within their polygon. Optionally, we can keep the last horizontal plane that
    // was hit.
    private filterHitTestResults (hitTestResults, keep_last_plane = false, simplify_planes = false) {
        const result = hitTestResults.filter((hitTestResult) => {
            const polygon = simplify_planes ? this.simplifyPolygon(hitTestResult.plane.polygon) : hitTestResult.plane.polygon;

            const hit_test_point = hitTestResult.point_on_plane;
            // Check if the point is on the same side from all the segments:
            // - if yes, then it's in the polygon
            // - if no, then it's outside of the polygon
            // This works only for convex polygons.

            let side = 0; // unknown, 1 = right, 2 = left
            let previous_point = polygon[polygon.length - 1];
            for (let i = 0; i < polygon.length; ++i) {
                const current_point = polygon[i];

                const line_segment = sub(current_point, previous_point);
                const segment_direction = normalize(line_segment);

                const turn_segment = sub(hit_test_point, current_point);
                const turn_direction = normalize(turn_segment);

                const cosine_ray_segment = crossProduct2d(segment_direction, turn_direction);
                if (side === 0) {
                    if (cosine_ray_segment > 0) {
                        side = 1;
                    } else {
                        side = 2;
                    }
                } else {
                    if (cosine_ray_segment > 0 && side === 2) return false;
                    if (cosine_ray_segment < 0 && side === 1) return false;
                }

                previous_point = current_point;
            }

            return true;
        });

        if (keep_last_plane && hitTestResults.length > 0) {
            const last_horizontal_plane_result = hitTestResults.slice().reverse().find((element) => element.plane.orientation === 'horizontal');

            if (last_horizontal_plane_result && result.findIndex((element) => element === last_horizontal_plane_result) === -1) {
                result.push(last_horizontal_plane_result);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
    }

    tryHitTest (xrTransformation: XRRigidTransform): Promise<ARAnchor>  {
        return new Promise<ARAnchor>((resolve, reject) => {
            // @ts-expect-error undefined XRRay
            const ray = new XRRay(xrTransformation);
            // Perform a JS-side hit test against mathematical (infinte) planes:
            const hitTestResults = this.hitTest(ray);
            // Filter results down to the ones that fall within plane's polygon:
            const hitTestFiltered = this.filterHitTestResults(hitTestResults);

            if (hitTestFiltered && hitTestFiltered.length > 0) {
                this._hitResult = hitTestFiltered[0];
                resolve({
                    id: this._hitResult.id,
                    pose: {
                        position: new Vec3(this._hitResult.hitMatrix[12], this._hitResult.hitMatrix[13], this._hitResult.hitMatrix[14]),
                        rotation: new Quat(0, 0, 0, 0),
                    },
                });
            } else {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject('not hit plane');
            }
        });
    }
}
