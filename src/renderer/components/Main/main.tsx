import * as React from "react";

import Content from "../Content";
import { OuterWrapper } from "./main.components";

const Main: React.SFC<{}> = () => {
  return (
    <OuterWrapper>
      <Content />
    </OuterWrapper>
  );
};

export default Main;
