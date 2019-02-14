import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { INotification } from '../../types/layout';

import {
  NotificationWrapper, Message, Title, RawErrLink, DismissIcon,
} from './NotificationItem.components';
import CloseIcon from '../Icons/close';
import * as layoutActions from '../../store/layout/layout.actions';

const DEFAULT_NOTIFICATION_DURATION = 10000;

export interface INotificationItemProps {
  notification: INotification
  removeNotification: (item: INotification) => void
}

const NotificationItem: React.SFC<INotificationItemProps> = ({
  notification, removeNotification,
}) => {
  const {
    message,
    rawErr,
    title,
    type,
  } = notification;

  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(notification);
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
            View trace
          </RawErrLink>
        )
      }

      <DismissIcon>
        <CloseIcon onClick={() => removeNotification(notification)} />
      </DismissIcon>
    </NotificationWrapper>
  );
};

const mapDispatchToProps = {
  removeNotification: (item: INotification) => layoutActions.removeNotification(item),
};

export default connect(
  null,
  mapDispatchToProps,
)(NotificationItem);
