import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import BaseAccountNotification from './BaseAccountNotification';

const FollowNotification = (props) => {
    const {notification} = props;

    return <BaseAccountNotification notification={notification}
                                    text="followed you"
                                    icon={<MaterialIcon color="white" name="people"/>}/>;
};

FollowNotification.propTypes = {
    notification: PropTypes.object.isRequired,
};

export default FollowNotification;
