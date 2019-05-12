import styled from '@emotion/styled';

import { notificationTypes } from '../../types/layout';

const getNotificationColors = (type: notificationTypes) => {
  const colorMap = {
    [notificationTypes.error]: {
      background: '#fef6f6',
      color: '#9f3a38',
      shadow: '0 0 0 1px #e0b4b4 inset, 0 0 0 0 transparent',
    },
    [notificationTypes.info]: {
      background: '#e5f9e7',
      color: '#1ebc30',
      shadow: '0 0 0 1px #1ebc30 inset, 0 0 0 0 transparent',
    },
    [notificationTypes.success]: {
      background: '#e5f9e7',
      color: '#1ebc30',
      shadow: '0 0 0 1px #1ebc30 inset, 0 0 0 0 transparent',
    },
    [notificationTypes.warn]: {
      background: '#fff8db',
      color: '#b58105',
      shadow: '0 0 0 1px #b58105 inset, 0 0 0 0 transparent',
    },
  };

  return colorMap[type];
};

export const NotificationWrapper = styled.div<{ type: notificationTypes }>`
  background-color: ${props => getNotificationColors(props.type).background};
  border-radius: 4px;
  box-shadow: ${props => getNotificationColors(props.type).shadow};
  color: ${props => getNotificationColors(props.type).color};
  font-size: 12px;
  margin-bottom: 10px;
  padding: 10px;
  position: relative;
  width: 300px;
  z-index: 50;
`;


export const Title = styled.h4`
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  opacity: .9;
`;

export const Message = styled.p`
  line-height: 20px;
  margin: 5px 0;
  opacity: .8;
`;

export const RawErrLink = styled.a`
  color: orange;
  cursor: pointer;
  font-size: 12px;
`;

export const DismissIcon = styled.div`
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 5px;
`;
