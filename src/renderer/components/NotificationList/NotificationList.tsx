import * as React from 'react';
import styled from '@emotion/styled';

import { INotification } from '../../types/layout';
import NotificationItem from '../NotificationItem/NotificationItem';

export interface INotificationListProps {
  notifications: INotification[]
}

const NotificationListContainer = styled.div`
  right: 10px;
  position: fixed;
  top: 70px;
`;

const NotificationList: React.SFC<INotificationListProps> = ({ notifications = [] }) => {
  if (notifications.length < 1) return null;

  return (
    <NotificationListContainer>
      {
        notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
          />
        ))
      }
    </NotificationListContainer>
  );
};

export default NotificationList;
