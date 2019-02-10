import styled from "styled-components";

import { ISidebarState } from "./sidebar.types";

export const Nav = styled.nav`
  background-color: ${(props: ISidebarState) =>
    props.dragInProgress
      ? "rgba(87, 167, 115, .3)"
      : "rgba(239, 233, 244, .7)"};
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  overflow-y: auto;
  position: relative;
  transition: background-color 0.2s ease-in-out;
  width: 200px;
  z-index: 20;
`;
