import * as React from 'react';

import { INotification } from '../../types/layout';

import {
  NotificationWrapper, Message, Title, RawErrLink,
} from './NotificationItem.components';

export interface INotificationItemProps {
  notification: INotification
}

const NotificationItem: React.SFC<INotificationItemProps> = ({ notification }) => {
  const {
    message, rawErr, title, type,
  } = notification;

  return (
    <NotificationWrapper type={type}>
      <Title>
        {title}
      </Title>

      <Message>
        {message}
      </Message>

      {
        rawErr && (
          <RawErrLink>
            View trace
          </RawErrLink>
        )
      }
    </NotificationWrapper>
  );
};

export default NotificationItem;
