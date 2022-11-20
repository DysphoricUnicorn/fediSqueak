import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import BaseNotification from './BaseNotification';

const StatusNotification = (props) => {
    const {notification} = props;

    return <BaseNotification icon={<MaterialIcon color="white" name="favorite"/>} text="posted something" notification={notification}/>
};

StatusNotification.propTypes = {
    notification: PropTypes.object.isRequired,
};

export default StatusNotification;
