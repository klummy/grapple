import styled from "styled-components";

export const TabItemComponent: any = styled.li`
  align-items: center;
  color: var(--text-color-default);
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 100%;
  opacity: ${(props: { active: boolean }) => (props.active ? "1" : ".5")};
  padding-left: 20px;
  transition: opacity 0.3s ease-in-out;
  max-width: 200px;

  svg {
    margin-left: 10px;

    path {
      fill: currentColor;
      transition: fill 0.3s ease-in-out;
    }

    &:hover {
      path {
        fill: #389bff;
      }
    }
  }

  &:hover {
    opacity: ${(props: { active: boolean }) => (props.active ? "1" : ".7")};
  }
`;

export const TitleComponent = styled.span`
  display: inline-block;
  font-size: 12px;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.3s ease-in-out;
  white-space: nowrap;
`;
