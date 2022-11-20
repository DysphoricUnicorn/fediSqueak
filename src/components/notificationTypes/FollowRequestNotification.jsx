import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import BaseAccountNotification from './BaseAccountNotification';

const FollowRequestNotification = (props) => {
    const {notification} = props;

    return <BaseAccountNotification notification={notification}
                                    text="requested to follow you"
                                    icon={<MaterialIcon color="white" name="6-ft-apart"/>}/>;
};

FollowRequestNotification.propTypes = {
    notification: PropTypes.object.isRequired,
};

export default FollowRequestNotification;
