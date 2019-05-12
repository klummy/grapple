import React, { useEffect, useContext } from 'react';
import { INotification } from '../../types/layout';
import * as layoutActions from '../../store/layout/layout.actions';
import {
  NotificationWrapper, Message, Title, RawErrLink, DismissIcon,
} from './NotificationItem.components';
import CloseIcon from '../Icons/close';
import { LayoutContext } from '../../contexts';

const DEFAULT_NOTIFICATION_DURATION = 10000;

export interface INotificationItemProps {
  notification: INotification
}

const NotificationItem: React.SFC<INotificationItemProps> = ({
  notification,
}) => {
  const {
    dispatch: layoutDispatcher,
  } = useContext(LayoutContext);

  const removeNotification = () => layoutDispatcher(layoutActions.removeNotification(notification));

  const {
    message,
    rawErr,
    title,
    type,
  } = notification;

  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification();
    }, DEFAULT_NOTIFICATION_DURATION);

    return () => {
      clearInterval(timer);
    };
  });

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
            View error trace
          </RawErrLink>
        )
      }

      <DismissIcon>
        <CloseIcon onClick={() => removeNotification()} />
      </DismissIcon>
    </NotificationWrapper>
  );
};

export default NotificationItem;
