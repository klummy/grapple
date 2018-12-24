import { ITab } from '../../types/layout';


export interface ITabItemProps extends ITab {
  active: boolean
  closeTab: (tab: ITab) => void
  renameTab: (tab: ITab) => void
  // tslint:disable-next-line:no-any
  switchTab: (tab: ITab) => void
  tab: ITab
}