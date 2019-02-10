import * as React from "react";

import TabList from "../../components/TabList";
import Content from "../Content";
import { OuterWrapper } from "./main.components";

const Main: React.SFC<{}> = () => {
  return (
    <OuterWrapper>
      <TabList />

      <Content />
    </OuterWrapper>
  );
};

export default Main;
