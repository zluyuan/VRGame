'use strict';

Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const cfg = {
  wrapWithFold: false,
  options: {
    enableAR: {
      label: "i18n:xr-plugin.builder.enableAR.label",
      description: "i18n:xr-plugin.builder.enableAR.description",
      default: false,
      render: {
        ui: "ui-checkbox"
      }
    }
  },
  hooks: "./builder-hooks.js"
};
const configs = {
  "android": cfg,
  "ios": cfg
};

exports.configs = configs;
