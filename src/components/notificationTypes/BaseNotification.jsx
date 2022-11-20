import React from 'react';
import PropTypes from 'prop-types';
import RebloggerText from '../styled/RebloggerText';
import TinyImage from '../styled/TinyImage';
import NotificationInfoView from './NotificationInfoView';

const BaseNotification = (props) => {
    const {text, icon, notification} = props;

    return <NotificationInfoView>
        <RebloggerText>
            <TinyImage src={notification.account.avatar}/>
            {notification.account.acct}
            {' '}
            {text}
            {' '}
            {icon}
        </RebloggerText>
    </NotificationInfoView>;
};

BaseNotification.propTypes = {
    icon: PropTypes.any,
    text: PropTypes.string.isRequired,
    notification: PropTypes.object.isRequired,
};

export default BaseNotification;
