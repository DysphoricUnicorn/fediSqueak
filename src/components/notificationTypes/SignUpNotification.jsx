import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import BaseAccountNotification from './BaseAccountNotification';

const SignUpNotification = (props) => {
    const {notification} = props;

    return <BaseAccountNotification notification={notification}
                                    text="signed up on your instance"
                                    icon={<MaterialIcon name="supervised-user-circle" color="white"/>}/>;
};

SignUpNotification.propTypes = {
    notification: PropTypes.object.isRequired,
};

export default SignUpNotification;
