import React from 'react';
import BaseNotification from './BaseNotification';
import PropTypes from 'prop-types';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';

const FavouriteNotification = (props) => {
    const {notification} = props;

    return <BaseNotification icon={<MaterialIcon color="white" name="star"/>} text="favourited your post" notification={notification}/>;
};

FavouriteNotification.propTypes = {
    notification: PropTypes.object.isRequired,
};

export default FavouriteNotification;
