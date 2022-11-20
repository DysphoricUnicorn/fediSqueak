import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import BaseNotification from './BaseNotification';

const PollFinishedNotification = (props) => {
    const {notification} = props;

    return <BaseNotification icon={<MaterialIcon color="white" name="how-to-vote"/>}
                             text="a poll you voted in or created ended"
                             notification={notification}/>;
};

PollFinishedNotification.propTypes = {
    notification: PropTypes.object.isRequired,
};

export default PollFinishedNotification;
