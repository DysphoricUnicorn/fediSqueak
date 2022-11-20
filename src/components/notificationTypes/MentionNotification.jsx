import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import BaseNotification from './BaseNotification';

const MentionNotification = (props) => {
    const {notification} = props;

    return <BaseNotification icon={<MaterialIcon color="white" name="message"/>} text="mentioned you" notification={notification}/>
};

MentionNotification.propTypes = {
    notification: PropTypes.object.isRequired,
};

export default MentionNotification;
