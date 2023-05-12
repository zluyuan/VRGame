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

import { Mesh, MeshCollider, _decorator, Node, MeshRenderer, utils, primitives, instantiate, Material, sys } from 'cc';
import { ARFeatureSceneMesh } from '../../../../xr/component/device/ar-base/ar-features';
import { ARMatchData, ARMesh, WorldMeshConfig } from '../utils/ar-defines';
import { ARSystemBase, IExtraDisplay } from './ar-system-base';

const { ccclass } = _decorator;

@ccclass('cc.ARSystemSceneMesh')
export class ARSystemSceneMesh extends ARSystemBase<ARMesh> implements IExtraDisplay {
    private _meshesNodeMap: Map<number, Node> = new Map<number, Node>();

    constructor (feature: ARFeatureSceneMesh) {
        super();
        this._feature = feature;
    }

    public init (rootNode: Node) {
        super.init(rootNode);
        this._visualizerRoot = new Node('_MESH_VISUALIZER_');
        rootNode.addChild(this._visualizerRoot);

        if (!this._feature) {
            console.warn('mesh system this._feature === null');
            return;
        }

        const tracking = this._trackings[0];
        // register scene mesh feature events
        this._feature.onRemoveEvent.on((meshes) => {
            if (meshes) {
                meshes.forEach((mesh) => {
                    this.removeMeshVisualizer(mesh);
                    this.clearMatch(mesh.id);
                });
            }
        });
        this._feature.onAddEvent.on((meshes) => {
            if (meshes) {
                meshes.forEach((mesh) => {
                    const matchData: ARMatchData = {
                        data: mesh,
                        uuid: tracking.node.uuid,
                    };
                    this._matchings.add(matchData);

                    this.showMeshVisualizer(mesh);
                });
            }
        });
        this._feature.onUpdateEvent.on((meshes) => {
            if (meshes) {
                meshes.forEach((mesh) => {
                    const matchData: ARMatchData = this.getMatchData(mesh.id)!;
                    if (matchData) {
                        matchData.data = mesh;
                    } else {
                        const matchData: ARMatchData = {
                            data: mesh,
                            uuid: tracking.node.uuid,
                        };
                        this._matchings.add(matchData);
                    }
                    this.showMeshVisualizer(mesh);
                });
            }
        });
    }

    private removeMeshVisualizer (armesh: ARMesh) {
        if (this._meshesNodeMap.has(armesh.id)) {
            const node = this._meshesNodeMap.get(armesh.id)!;
            node.destroy();
            this._meshesNodeMap.delete(armesh.id);
        }
    }

    private showMeshVisualizer (armesh: ARMesh) {
        if (!armesh.vertices || !armesh.indices || !this._feature) {
            return;
        }
        if (armesh.vertices.length <= 0 || armesh.indices.length <= 0) {
            return;
        }
        const config = (this._feature.config as WorldMeshConfig);

        let sceneMeshNode;
        sceneMeshNode = this._meshesNodeMap.get(armesh.id)!;
        if (!sceneMeshNode) {
            sceneMeshNode = instantiate(config.visualizer);
            this._visualizerRoot?.addChild(sceneMeshNode);
            this._meshesNodeMap.set(armesh.id, sceneMeshNode);
        }

        let renderer: MeshRenderer = sceneMeshNode.getComponent(MeshRenderer)!;
        if (!renderer) {
            renderer = sceneMeshNode.addComponent(MeshRenderer)!;
        }

        sceneMeshNode.setPosition(armesh.pose.position);
        sceneMeshNode.setRotation(armesh.pose.rotation);

        if (sys.platform === sys.Platform.IOS) {
            const geo: primitives.IGeometry = {
                positions: armesh.vertices,
                indices: armesh.indices,
            };
            if (renderer) {
                renderer.mesh = utils.createMesh(geo);
            }
        } else {
            this.createOrUpdateSubMeshes(renderer, armesh.vertices, armesh.indices);
        }

        const collider: MeshCollider = sceneMeshNode.getComponent(MeshCollider)!;
        if (collider && renderer) {
            collider.mesh = renderer.mesh;
        }
    }

    private createOrUpdateSubMeshes (renderer: MeshRenderer, vertices: number[], indices: number[]) {
        if (!renderer.mesh) {
            renderer.mesh = new Mesh();
        }

        const maxSubMeshIndices = 4095;
        const subMeshCount = Math.ceil(indices.length / maxSubMeshIndices);
        const remainder = indices.length % maxSubMeshIndices;

        console.log('vertices.length', vertices.length);
        console.log('indices.length', indices.length);
        console.log('subMeshCount', subMeshCount);

        const dynamicOptions: primitives.ICreateDynamicMeshOptions = {
            maxSubMeshes: subMeshCount,
            maxSubMeshVertices: vertices.length,
            maxSubMeshIndices,
        };

        const mat = renderer.getMaterial(0);
        const renderingSubMeshCount = renderer.mesh.renderingSubMeshes.length;

        for (let index = 0; index < subMeshCount; index++) {
            const startIndiceIndex = index * maxSubMeshIndices;
            const endIndiceIndex = startIndiceIndex + (index === subMeshCount - 1 ? remainder : maxSubMeshIndices);

            const dynamicGeo: primitives.IDynamicGeometry = {
                positions: new Float32Array(vertices),
                indices32: new Uint32Array(indices.slice(startIndiceIndex, endIndiceIndex)),
            };

            if (index < renderingSubMeshCount) {
                renderer.mesh.updateSubMesh(index, dynamicGeo);
            } else {
                renderer.mesh = utils.MeshUtils.createDynamicMesh(index, dynamicGeo, renderer.mesh, dynamicOptions);
            }

            if (index > 0) {
                renderer.setMaterial(mat, index);
            }
        }
        renderer.onGeometryChanged();
    }
}
