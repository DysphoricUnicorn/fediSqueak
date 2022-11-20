import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import BaseNotification from './BaseNotification';

const EditNotification = (props) => {
    const {notification} = props;

    return <BaseNotification icon={<MaterialIcon color="white" name="edit"/>} text="edited a post you interacted with" notification={notification}/>
};

EditNotification.propTypes = {
    notification: PropTypes.object.isRequired,
};

export default EditNotification;
