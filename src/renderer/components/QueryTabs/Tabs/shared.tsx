import styled from 'styled-components';

export interface IQueryTabItemProps {
  visible: boolean
}

/**
 * Wraps a tab to hide it from view when it's not active
 */
export const QueryTabItemWrapper = styled.div`
  max-height: ${(props: IQueryTabItemProps) => (props.visible ? 'none' : '0px')};
  overflow-y: ${(props: IQueryTabItemProps) => (props.visible ? 'auto' : 'hidden')};
  transform: ${(props: IQueryTabItemProps) => (props.visible ? 'none' : 'translateX(105%)')};
  transition: transform .3s ease-in-out;
`;
