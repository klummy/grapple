import { ITab } from "../../types/layout";

export interface ITabItemProps extends ITab {
  active: boolean;
  closeTab: (tab: ITab) => void;
  updateTab: (tab: ITab) => void;
  switchTab: (tab: ITab) => void;
  tab: ITab;
}
