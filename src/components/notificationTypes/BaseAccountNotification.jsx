import React from 'react';
import PropTypes from 'prop-types';
import MetadataContainer from '../styled/MetadataContainer';
import SmallImage from '../styled/SmallImage';
import NameContainer from '../styled/NameContainer';
import UserNameText from '../styled/UserNameText';
import {parsePost} from '../../helpers/generalHelpers';
import DisplayNameText from '../styled/DisplayNameText';
import PostTimeStamp from '../styled/PostTimeStamp';
import RebloggerText from '../styled/RebloggerText';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import PostView from '../styled/PostView';
import PostText from '../styled/PostText';
import {View} from 'react-native';

const BaseAccountNotification = (props) => {
    const {notification, icon, text} = props;

    return <PostView>
        <MetadataContainer>
            <RebloggerText>
                {icon}
                {' '}
                {notification.account.acct}
                {' '}
                {text}
            </RebloggerText>
        </MetadataContainer>
        <MetadataContainer>
            <SmallImage src={notification.account.avatar}/>
            <NameContainer>
                <DisplayNameText>{parsePost(notification.account.display_name, notification.account.emojis)}</DisplayNameText>
                <UserNameText>{notification.account.acct}</UserNameText>
                <PostTimeStamp>{new Date(notification.created_at).toLocaleString()}</PostTimeStamp>
            </NameContainer>
        </MetadataContainer>
        <View>
            <PostText>{parsePost(notification.account.note, notification.account.emojis)}</PostText>
        </View>
    </PostView>;
};

BaseAccountNotification.propTypes = {
    notification: PropTypes.object.isRequired,
    icon: PropTypes.any,
    text: PropTypes.string.isRequired,
};

export default BaseAccountNotification;
