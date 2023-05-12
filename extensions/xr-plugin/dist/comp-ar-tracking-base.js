'use strict';

var MenuType = /* @__PURE__ */ ((MenuType2) => {
  MenuType2[MenuType2["None"] = 0] = "None";
  MenuType2[MenuType2["Factor"] = 1] = "Factor";
  MenuType2[MenuType2["Action"] = 2] = "Action";
  return MenuType2;
})(MenuType || {});
var FaceLandMarkType = /* @__PURE__ */ ((FaceLandMarkType2) => {
  FaceLandMarkType2[FaceLandMarkType2["None"] = 0] = "None";
  FaceLandMarkType2[FaceLandMarkType2["Chin"] = 1] = "Chin";
  FaceLandMarkType2[FaceLandMarkType2["ForeHead"] = 2] = "ForeHead";
  FaceLandMarkType2[FaceLandMarkType2["Left_Top_Eyelid"] = 3] = "Left_Top_Eyelid";
  FaceLandMarkType2[FaceLandMarkType2["Left_Bottom_Eyelid"] = 4] = "Left_Bottom_Eyelid";
  FaceLandMarkType2[FaceLandMarkType2["Left_EyeBrow"] = 5] = "Left_EyeBrow";
  FaceLandMarkType2[FaceLandMarkType2["Left_Pupil"] = 6] = "Left_Pupil";
  FaceLandMarkType2[FaceLandMarkType2["Lower_Face"] = 7] = "Lower_Face";
  FaceLandMarkType2[FaceLandMarkType2["Lower_Lip"] = 8] = "Lower_Lip";
  FaceLandMarkType2[FaceLandMarkType2["Mouth"] = 9] = "Mouth";
  FaceLandMarkType2[FaceLandMarkType2["Nose_Bridge"] = 10] = "Nose_Bridge";
  FaceLandMarkType2[FaceLandMarkType2["Nose_Tip"] = 11] = "Nose_Tip";
  FaceLandMarkType2[FaceLandMarkType2["Right_Top_Eyelid"] = 12] = "Right_Top_Eyelid";
  FaceLandMarkType2[FaceLandMarkType2["Right_Bottom_Eyelid"] = 13] = "Right_Bottom_Eyelid";
  FaceLandMarkType2[FaceLandMarkType2["Right_EyeBrow"] = 14] = "Right_EyeBrow";
  FaceLandMarkType2[FaceLandMarkType2["Right_Pupil"] = 15] = "Right_Pupil";
  FaceLandMarkType2[FaceLandMarkType2["Upper_Lip"] = 16] = "Upper_Lip";
  FaceLandMarkType2[FaceLandMarkType2["Max"] = 17] = "Max";
  return FaceLandMarkType2;
})(FaceLandMarkType || {});
var FaceBlendShapeType = /* @__PURE__ */ ((FaceBlendShapeType2) => {
  FaceBlendShapeType2[FaceBlendShapeType2["None"] = 0] = "None";
  FaceBlendShapeType2[FaceBlendShapeType2["BrowsDownLeft"] = 1] = "BrowsDownLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["BrowsDownRight"] = 2] = "BrowsDownRight";
  FaceBlendShapeType2[FaceBlendShapeType2["BrowsUpCenter"] = 3] = "BrowsUpCenter";
  FaceBlendShapeType2[FaceBlendShapeType2["BrowsUpLeft"] = 4] = "BrowsUpLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["BrowsUpRight"] = 5] = "BrowsUpRight";
  FaceBlendShapeType2[FaceBlendShapeType2["CheekSquintLeft"] = 6] = "CheekSquintLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["CheekSquintRight"] = 7] = "CheekSquintRight";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeBlinkLeft"] = 8] = "EyeBlinkLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeBlinkRight"] = 9] = "EyeBlinkRight";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeDownLeft"] = 10] = "EyeDownLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeDownRight"] = 11] = "EyeDownRight";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeInLeft"] = 12] = "EyeInLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeInRight"] = 13] = "EyeInRight";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeOpenLeft"] = 14] = "EyeOpenLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeOpenRight"] = 15] = "EyeOpenRight";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeOutLeft"] = 16] = "EyeOutLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeOutRight"] = 17] = "EyeOutRight";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeSquintLeft"] = 18] = "EyeSquintLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeSquintRight"] = 19] = "EyeSquintRight";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeUpLeft"] = 20] = "EyeUpLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["EyeUpRight"] = 21] = "EyeUpRight";
  FaceBlendShapeType2[FaceBlendShapeType2["JawLeft"] = 22] = "JawLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["JawRight"] = 23] = "JawRight";
  FaceBlendShapeType2[FaceBlendShapeType2["JawOpen"] = 24] = "JawOpen";
  FaceBlendShapeType2[FaceBlendShapeType2["LipsFunnel"] = 25] = "LipsFunnel";
  FaceBlendShapeType2[FaceBlendShapeType2["LipsPucker"] = 26] = "LipsPucker";
  FaceBlendShapeType2[FaceBlendShapeType2["LowerLipClose"] = 27] = "LowerLipClose";
  FaceBlendShapeType2[FaceBlendShapeType2["LowerLipDownLeft"] = 28] = "LowerLipDownLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["LowerLipDownRight"] = 29] = "LowerLipDownRight";
  FaceBlendShapeType2[FaceBlendShapeType2["LowerLipRaise"] = 30] = "LowerLipRaise";
  FaceBlendShapeType2[FaceBlendShapeType2["UpperLipClose"] = 31] = "UpperLipClose";
  FaceBlendShapeType2[FaceBlendShapeType2["UpperLipRaise"] = 32] = "UpperLipRaise";
  FaceBlendShapeType2[FaceBlendShapeType2["UpperLipUpLeft"] = 33] = "UpperLipUpLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["UpperLipUpRight"] = 34] = "UpperLipUpRight";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthClose"] = 35] = "MouthClose";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthDimpleLeft"] = 36] = "MouthDimpleLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthDimpleRight"] = 37] = "MouthDimpleRight";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthFrownLeft"] = 38] = "MouthFrownLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthFrownRight"] = 39] = "MouthFrownRight";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthLeft"] = 40] = "MouthLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthRight"] = 41] = "MouthRight";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthSmileLeft"] = 42] = "MouthSmileLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthSmileRight"] = 43] = "MouthSmileRight";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthStretchLeft"] = 44] = "MouthStretchLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthStretchRight"] = 45] = "MouthStretchRight";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthUpLeft"] = 46] = "MouthUpLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["MouthUpRight"] = 47] = "MouthUpRight";
  FaceBlendShapeType2[FaceBlendShapeType2["Puff"] = 48] = "Puff";
  FaceBlendShapeType2[FaceBlendShapeType2["SneerLeft"] = 49] = "SneerLeft";
  FaceBlendShapeType2[FaceBlendShapeType2["SneerRight"] = 50] = "SneerRight";
  FaceBlendShapeType2[FaceBlendShapeType2["Max"] = 51] = "Max";
  return FaceBlendShapeType2;
})(FaceBlendShapeType || {});
const factorMap = {
  [1 /* PLANE_DIRECTION */]: {
    label: "i18n:xr-plugin.ar.factors.plane_direction",
    type: "cc.ARPlaneDirection"
  },
  [2 /* PLANE_SIZE */]: {
    label: "i18n:xr-plugin.ar.factors.plane_size",
    type: "cc.ARPlaneSize"
  },
  [3 /* PLANE_SEMANTIC */]: {
    label: "i18n:xr-plugin.ar.factors.plane_semantic",
    type: "cc.ARPlaneSemantic"
  },
  [4 /* IMAGE_SOURCE */]: {
    label: "i18n:xr-plugin.ar.factors.image_source",
    type: "cc.ARImageSource"
  },
  [5 /* FACE_CONTENT */]: {
    label: "i18n:xr-plugin.ar.factors.face",
    type: "cc.ARFaceTrackingContent"
  }
};
const actionMap = {
  [2 /* DISPLAY_CHILDREN */]: {
    label: "i18n:xr-plugin.ar.actions.display_children",
    type: "cc.ARDisplayChildren"
  },
  [3 /* TRACK_EVENT */]: {
    label: "i18n:xr-plugin.ar.actions.track_event",
    type: "cc.ARTrackEvent"
  },
  [1 /* SURFACE_OVERLAY */]: {
    label: "i18n:xr-plugin.ar.actions.surface_overlay",
    type: "cc.ARSurfaceOverlay"
  },
  [4 /* ALIGNMENT */]: {
    label: "i18n:xr-plugin.ar.actions.alignment",
    type: "cc.ARAlignment"
  },
  [5 /* ADAPTIVE_SCALE */]: {
    label: "i18n:xr-plugin.ar.actions.adaptive_scale",
    type: "cc.ARAdaptiveScale"
  },
  [6 /* FACE_LANDMARK */]: {
    label: "i18n:xr-plugin.ar.actions.face_landmark",
    type: "cc.ARFaceLandMark"
  },
  [7 /* FACE_BLEND_SHAPES */]: {
    label: "i18n:xr-plugin.ar.actions.face_blend_shapes",
    type: "cc.ARFaceBlendShapes"
  },
  [8 /* FACE_EXPRESSION_EVENTS */]: {
    label: "i18n:xr-plugin.ar.actions.face_expression_events",
    type: "cc.ARFaceExpressionEvents"
  }
};

Object.assign(exports, require("./class.js"));
const {
  ready: superReady,
  update: superUpdate,
  template: superTemplate,
  style: superStyle,
  methods: superMethods
} = exports;
exports.template = superTemplate + `
    <ui-button class="btn factor blue">
        <ui-label value="i18n:xr-plugin.ar.add_factor"></ui-label> 
    </ui-button>
    <ui-button class="btn action blue">
        <ui-label value="i18n:xr-plugin.ar.add_action"></ui-label> 
    </ui-button>
`;
exports.style = superStyle + `
    .btn {
        display: block;
        margin: 8px auto;
        width: 100px;
    }
`;
Object.assign(exports.$, {
  btnAction: ".action",
  btnFactor: ".factor"
});
exports.ready = function() {
  const panel = this;
  superReady.call(panel);
  panel.$.btnFactor.addEventListener("click", () => {
    popupMenu(panel.$this.dump, MenuType.Factor);
  });
  panel.$.btnAction.addEventListener("click", () => {
    popupMenu(panel.$this.dump, MenuType.Action);
  });
};
exports.update = function(dump) {
  const panel = this;
  panel.$this.dump = dump;
  superUpdate.call(panel, dump);
  if (dump.value.dependOnFactorOrAction.value && panel.$groups) {
    if (!panel.$groups.default) {
      panel.$groups.default = superMethods.createTabGroup(dump.groups["default"]);
      if (!panel.$groups.default.isConnected) {
        superMethods.appendChildByDisplayOrder(panel.$.section, panel.$groups.default);
      }
    }
    if (!panel.$groups.default.tabs.Factor) {
      superMethods.appendToTabGroup(panel.$groups.default, "Factor");
      panel.$groups.default.tabs.Factor.appendChild(panel.$.btnFactor);
    } else {
      panel.$groups.default.tabs.Factor.lastElementChild.after(panel.$.btnFactor);
    }
    if (!panel.$groups.default.tabs.Action) {
      superMethods.appendToTabGroup(panel.$groups.default, "Action");
      panel.$groups.default.tabs.Action.appendChild(panel.$.btnAction);
    } else {
      panel.$groups.default.tabs.Action.lastElementChild.after(panel.$.btnAction);
    }
    Object.keys(dump.value).forEach((key, index) => {
      const info = dump.value[key];
      if (!info.visible) {
        return;
      }
      if (info.group && dump.groups && (info.group.name === "Action" || info.group.name === "Factor")) {
        updateFactorAndActionBase(info, panel);
        switch (info.type) {
          case "cc.ARImageSource":
            updateImageSource(info, panel);
            break;
          case "cc.ARFaceLandMark":
            updateFaceLandmark(info, panel);
            break;
          case "cc.ARFaceBlendShapes":
            updateFaceBlendShapes(info, panel);
            break;
        }
      }
    });
  } else {
    panel.$.btnAction.setAttribute("style", "display: none;");
    panel.$.btnFactor.setAttribute("style", "display: none;");
  }
};
async function updateFactorAndActionBase(info, panel) {
  const targetObjectPropID = `${info.type || info.name}:${info.path}`;
  const $targetObjectProp = panel.$propList[targetObjectPropID];
  if ($targetObjectProp) {
    const targetObjectPropMenuID = `${targetObjectPropID}:menu`;
    const $targetObjectPropMenu = panel.$propList[targetObjectPropMenuID];
    if (!$targetObjectPropMenu) {
      const $targetObjectPropHeader = $targetObjectProp.querySelector('[slot="header"]');
      if ($targetObjectPropHeader) {
        const $menu = document.createElement("ui-icon");
        $menu.setAttribute("value", "edit");
        $menu.setAttribute("class", "menu");
        $targetObjectPropHeader.appendChild($menu);
        panel.$propList[targetObjectPropMenuID] = $menu;
        $menu.addEventListener("click", (event) => {
          event.stopPropagation();
          const menu = [
            {
              label: "i18n:xr-plugin.ar.reset_prop",
              click() {
                resetProp(info, panel.$this.dump);
              }
            },
            { type: "separator" },
            {
              label: "i18n:xr-plugin.ar.remove_prop",
              click() {
                removeProp(info, panel.$this.dump);
              }
            }
          ];
          Editor.Menu.popup({
            x: event.pageX,
            y: event.pageY,
            menu
          });
        });
      }
    } else {
      if (!$targetObjectPropMenu.isConnected || !$targetObjectPropMenu.parentElement) {
        const $targetObjectPropHeader = $targetObjectProp.querySelector('[slot="header"]');
        if ($targetObjectPropHeader) {
          $targetObjectPropHeader.appendChild($targetObjectPropMenu);
        }
      }
    }
  }
}
async function updateImageSource(info, panel) {
  const targetObjectPropID = `${info.type || info.name}:${info.path}`;
  const $targetObjectProp = panel.$propList[targetObjectPropID];
  const $arrayObjectProp = $targetObjectProp.querySelectorAll('ui-prop[dump="Array"]')[0];
  const $contentObjectProp = $arrayObjectProp.querySelector(".content");
  let index = 0;
  $contentObjectProp.querySelectorAll("ui-section").forEach(($prop2) => {
    const $imageSourceProps = $prop2.querySelectorAll('ui-prop[type="dump"]');
    $imageSourceProps.forEach(($prop) => {
      const $targetObjectPropHeader = $prop.querySelector("ui-asset");
      if (!$targetObjectPropHeader) {
        return;
      }
      let uuid = $targetObjectPropHeader.getAttribute("value");
      if (!uuid || uuid == "") {
        uuid = "255e67f3-b91b-4568-8843-b0075f513f73";
      }
      let $image = $prop.querySelector("ui-image");
      if ($image) {
        const value = $image.getAttribute("value");
        if (value !== uuid) {
          $image.setAttribute("value", uuid);
          $image.setAttribute("index", index);
        }
      } else {
        $image = document.createElement("ui-image");
        $image.setAttribute("value", uuid);
        $image.setAttribute("droppable", "cc.ImageAsset");
        $image.setAttribute("style", "width:50px;height:50px;");
        $image.setAttribute("index", index);
        $prop.appendChild($image);
        $image.addEventListener("confirm", (event) => {
          const imageValue = event.target.value;
          const idx = $image.getAttribute("index");
          $targetObjectPropHeader.setAttribute("value", imageValue);
          updateImageSourceProp(imageValue, idx, panel.$this.dump);
        });
      }
      index++;
    });
  });
}
async function updateFaceLandmark(info, panel) {
  const targetObjectPropID = `${info.type || info.name}:${info.path}`;
  const $targetObjectProp = panel.$propList[targetObjectPropID];
  let index = 0;
  $targetObjectProp.querySelectorAll("ui-prop").forEach(($prop) => {
    const $targetObjectPropHeader = $prop.querySelector('[slot="header"]');
    if ($targetObjectPropHeader) {
      return;
    }
    const node = $prop.querySelector("ui-node");
    const value = node.getAttribute("value");
    if (!value || value == "") {
      removeLandMarkProp(info.value.landMarks.value[index].value, panel.$this.dump);
    }
    const label = $prop.querySelector("ui-label");
    label.value = FaceLandMarkType[info.value.landMarks.value[index].value];
    index += 1;
  });
  index = 0;
  $targetObjectProp.querySelectorAll("ui-icon").forEach(($prop) => {
    if ($prop.value == "del") {
      $prop.removeAttribute("disabled");
      $prop.setAttribute("landmarkType", info.value.landMarks.value[index].value);
      if (!$prop.hasAttribute("tag")) {
        $prop.setAttribute("tag", 1);
        $prop.addEventListener("click", (event) => {
          event.stopPropagation();
          removeLandMarkProp($prop.getAttribute("landmarkType"), panel.$this.dump);
        });
      }
      index += 1;
    }
  });
  const btnPropID = `${info.type || info.name}:${info.path}:btn_landmark`;
  let $button = panel.$propList[btnPropID];
  if (!$button) {
    $button = $targetObjectProp.querySelector(".grey");
    $button = document.createElement("ui-button");
    $button.setAttribute("style", "white-space: nowrap; margin: 8px auto; display: block; width: 120px;");
    $button.setAttribute("slot", "content");
    $button.setAttribute("class", "grey");
    $button.innerText = Editor.I18n.t("xr-plugin.ar.add_landmark");
    panel.$propList[btnPropID] = $button;
    $button.addEventListener("click", (event) => {
      event.stopPropagation();
      const data = panel.$this.dump.value[info.name];
      const _arr = [];
      for (let index2 = FaceLandMarkType.None + 1; index2 < FaceLandMarkType.Max; index2++) {
        let bIncluded = false;
        data.value.landMarks.value.forEach((element) => {
          if (element.value == index2) {
            bIncluded = true;
          }
        });
        if (!bIncluded) {
          _arr.push(index2);
        }
      }
      const menus = [];
      for (let index2 = 0; index2 < _arr.length; index2++) {
        const e = _arr[index2];
        menus.push({
          label: FaceLandMarkType[e],
          click() {
            addLandMarkProp(e, panel.$this.dump);
          }
        });
        if (index2 < _arr.length - 1) {
          menus.push({ type: "separator" });
        }
      }
      if (menus.length > 0) {
        const nCnt = 3 - menus.length;
        if (nCnt > 0) {
          menus.push({ type: "separator" });
          for (let index2 = 0; index2 < nCnt; index2++) {
            menus.push({
              label: "",
              enabled: false
            });
          }
        }
      }
      Editor.Menu.popup({
        menu: menus
      });
    });
  }
  $targetObjectProp.after($button);
}
async function updateFaceBlendShapes(info, panel) {
  const targetObjectPropID = `${info.type || info.name}:${info.path}`;
  const $targetObjectProp = panel.$propList[targetObjectPropID];
  let index = 0;
  const $arrayObjectProp = $targetObjectProp.querySelectorAll('ui-prop[dump="Array"]')[0];
  const $contentObjectProp = $arrayObjectProp.querySelector(".content");
  $contentObjectProp.querySelectorAll("ui-section").forEach(($prop) => {
    const $targetObjectPropHeader = $prop.querySelector('[slot="header"]');
    if (!$targetObjectPropHeader) {
      return;
    }
    const label = $targetObjectPropHeader.querySelector("ui-label");
    label.value = FaceBlendShapeType[info.value.blendShapes.value[index].value.blendShapeType.value];
    let $checkbox = $targetObjectPropHeader.querySelector("ui-checkbox");
    if (!$checkbox) {
      $checkbox = document.createElement("ui-checkbox");
      $checkbox.setAttribute("class", "active");
      $checkbox.setAttribute("style", "white-space: nowrap; margin: 0px;");
      $checkbox.setAttribute("value", "true");
      $checkbox.setAttribute("blendShapeType", info.value.blendShapes.value[index].value.blendShapeType.value);
      $targetObjectPropHeader.appendChild($checkbox);
      $checkbox.addEventListener("click", async (event) => {
        enableBlendShapeProp($checkbox.getAttribute("blendShapeType"), $checkbox.value, panel.$this.dump);
      });
    }
    index += 1;
  });
  index = 0;
  $contentObjectProp.querySelectorAll("ui-icon").forEach(($prop) => {
    if ($prop.value == "del") {
      $prop.removeAttribute("disabled");
      $prop.setAttribute("blendShapeType", info.value.blendShapes.value[index].value.blendShapeType.value);
      if (!$prop.hasAttribute("tag")) {
        $prop.setAttribute("tag", 1);
        $prop.addEventListener("click", (event) => {
          event.stopPropagation();
          removeBlendShapeProp($prop.getAttribute("blendShapeType"), panel.$this.dump);
        });
      }
      index += 1;
    }
  });
  const btnPropID = `${info.type || info.name}:${info.path}:add_blendShape`;
  let $button = panel.$propList[btnPropID];
  if (!$button) {
    $button = $targetObjectProp.querySelector(".grey");
    $button = document.createElement("ui-button");
    $button.setAttribute("style", "white-space: nowrap; margin: 8px auto; display: block; width: 120px;");
    $button.setAttribute("slot", "content");
    $button.setAttribute("class", "grey");
    $button.innerText = Editor.I18n.t("xr-plugin.ar.add_blendShape");
    panel.$propList[btnPropID] = $button;
    $button.addEventListener("click", (event) => {
      event.stopPropagation();
      const data = panel.$this.dump.value[info.name];
      const _arr = [];
      for (let index2 = FaceBlendShapeType.None + 1; index2 < FaceBlendShapeType.Max; index2++) {
        let bIncluded = false;
        data.value.blendShapes.value.forEach((element) => {
          if (element.value.blendShapeType.value == index2) {
            bIncluded = true;
          }
        });
        if (!bIncluded) {
          _arr.push(index2);
        }
      }
      const menus = [];
      for (let index2 = 0; index2 < _arr.length; index2++) {
        const e = _arr[index2];
        menus.push({
          label: FaceBlendShapeType[e],
          click() {
            addBlendShapeProp(e, panel.$this.dump);
          }
        });
      }
      if (menus.length > 0) {
        const nCnt = 3 - menus.length;
        if (nCnt > 0) {
          menus.push({ type: "separator" });
          for (let index2 = 0; index2 < nCnt; index2++) {
            menus.push({
              label: "",
              enabled: false
            });
          }
        }
      }
      Editor.Menu.popup({
        menu: menus
      });
    });
  }
  $targetObjectProp.after($button);
}
async function updateImageSourceProp(imageValue, index, dump) {
  Editor.Message.send("scene", "snapshot");
  await Editor.Message.request("scene", "execute-component-method", {
    uuid: dump.value.uuid.value,
    name: "updateImageSourceProp",
    args: [index, imageValue]
  });
}
async function enableBlendShapeProp(blendShapeType, enabled, dump) {
  Editor.Message.send("scene", "snapshot");
  await Editor.Message.request("scene", "execute-component-method", {
    uuid: dump.value.uuid.value,
    name: "enableBlendShapeProp",
    args: [blendShapeType, enabled]
  });
  Editor.Message.broadcast("scene:change-node", dump.value.node.value.uuid);
}
async function removeBlendShapeProp(blendShapeType, dump) {
  Editor.Message.send("scene", "snapshot");
  await Editor.Message.request("scene", "execute-component-method", {
    uuid: dump.value.uuid.value,
    name: "removeBlendShapeProp",
    args: [blendShapeType]
  });
  Editor.Message.broadcast("scene:change-node", dump.value.node.value.uuid);
}
async function addBlendShapeProp(blendShapeType, dump) {
  Editor.Message.send("scene", "snapshot");
  await Editor.Message.request("scene", "execute-component-method", {
    uuid: dump.value.uuid.value,
    name: "addBlendShapeProp",
    args: [blendShapeType]
  });
  Editor.Message.broadcast("scene:change-node", dump.value.node.value.uuid);
}
async function removeLandMarkProp(landmarkType, dump) {
  Editor.Message.send("scene", "snapshot");
  await Editor.Message.request("scene", "execute-component-method", {
    uuid: dump.value.uuid.value,
    name: "removeLandMarkProp",
    args: [landmarkType]
  });
  Editor.Message.broadcast("scene:change-node", dump.value.node.value.uuid);
}
async function addLandMarkProp(landmarkType, dump) {
  Editor.Message.send("scene", "snapshot");
  await Editor.Message.request("scene", "execute-component-method", {
    uuid: dump.value.uuid.value,
    name: "addLandMarkProp",
    args: [landmarkType]
  });
  Editor.Message.broadcast("scene:change-node", dump.value.node.value.uuid);
}
async function popupMenu(dump, menuType) {
  const deps = dump.value[menuType === MenuType.Factor ? "menuFactors" : "menuActions"].value;
  const owns = dump.value[menuType === MenuType.Factor ? "factors" : "actions"].value;
  const _arr = [];
  const maps = menuType === MenuType.Factor ? factorMap : actionMap;
  deps.forEach((e) => {
    const info = maps[e.value];
    let bIncluded = false;
    for (let index = 0; index < owns.length; index++) {
      if (info.type === owns[index].type) {
        bIncluded = true;
        break;
      }
    }
    let obj = { ft: e.value };
    obj = { ...obj, ...info };
    if (!bIncluded) {
      _arr.push(obj);
    }
  });
  const menus = [];
  for (let index = 0; index < _arr.length; index++) {
    const info = _arr[index];
    menus.push({
      label: info.label,
      click() {
        addProp(menuType, info.ft, dump);
      }
    });
    if (index < _arr.length - 1) {
      menus.push({ type: "separator" });
    }
  }
  if (menus.length > 0) {
    const nCnt = 3 - menus.length;
    if (nCnt > 0) {
      menus.push({ type: "separator" });
      for (let index = 0; index < nCnt; index++) {
        menus.push({
          label: "",
          enabled: false
        });
      }
    }
  }
  Editor.Menu.popup({
    menu: menus
  });
}
async function addProp(menuType, type, dump) {
  Editor.Message.send("scene", "snapshot");
  await Editor.Message.request("scene", "execute-component-method", {
    uuid: dump.value.uuid.value,
    name: "addProp",
    args: [menuType, type]
  });
  Editor.Message.broadcast("scene:change-node", dump.value.node.value.uuid);
}
function getPropType(proInfo) {
  let menuType = MenuType.None;
  if (proInfo.group.name === "Factor") {
    menuType = MenuType.Factor;
  } else if (proInfo.group.name === "Action") {
    menuType = MenuType.Action;
  }
  const maps = menuType === MenuType.Factor ? factorMap : actionMap;
  let type = 0;
  Object.keys(maps).forEach((key, index) => {
    const info = maps[key];
    if (info.type === proInfo.type) {
      type = parseInt(key);
    }
  });
  return { menuType, type };
}
async function resetProp(proInfo, dump) {
  const data = getPropType(proInfo);
  Editor.Message.send("scene", "snapshot");
  await Editor.Message.request("scene", "execute-component-method", {
    uuid: dump.value.uuid.value,
    name: "resetProp",
    args: [data.menuType, data.type]
  });
  Editor.Message.broadcast("scene:change-node", dump.value.node.value.uuid);
}
async function removeProp(proInfo, dump) {
  const data = getPropType(proInfo);
  Editor.Message.send("scene", "snapshot");
  await Editor.Message.request("scene", "execute-component-method", {
    uuid: dump.value.uuid.value,
    name: "removeProp",
    args: [data.menuType, data.type]
  });
  Editor.Message.broadcast("scene:change-node", dump.value.node.value.uuid);
}
