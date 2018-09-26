import { Config } from "@stencil/core";

export const config: Config = {
  namespace: "pbiembedded",
  outputTargets: [
    {
      type: "dist"
    },
    {
      type: "www",
      serviceWorker: null
    }
  ]
};
