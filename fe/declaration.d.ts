declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";  // Make sure to import SvgProps
    const content: React.FC<SvgProps>;
    export default content;
  }
  