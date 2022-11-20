import React from 'react';
import BaseNotification from './BaseNotification';
import PropTypes from 'prop-types';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';

const ReblogNotification = (props) => {
    const {notification} = props;

    return <BaseNotification icon={<MaterialIcon color="white" name="repeat"/>} text="boosted your post" notification={notification}/>;
};

ReblogNotification.propTypes = {
    notification: PropTypes.object.isRequired,
};

export default ReblogNotification;
