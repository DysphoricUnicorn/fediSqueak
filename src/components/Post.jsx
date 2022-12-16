import styled from 'styled-components/native';
import AppText from './styled/AppText';
import {Button, Pressable, View} from 'react-native';
import {parsePost} from '../helpers/generalHelpers';
import React from 'react';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import Attachment from './Attachment';
import PostText from './styled/PostText';
import {handleFavouriteClick, handleReblogClick, updatePost} from '../helpers/postHelpers';
import MetadataContainer from './styled/MetadataContainer';
import PostView from './styled/PostView';
import TinyImage from './styled/TinyImage';
import SmallImage from './styled/SmallImage';
import NameContainer from './styled/NameContainer';
import DisplayNameText from './styled/DisplayNameText';
import UserNameText from './styled/UserNameText';
import PostTimeStamp from './styled/PostTimeStamp';
import RebloggerText from './styled/RebloggerText';
import {BlurView} from 'expo-blur';
import {useConfigurationContext} from '../data/ConfigurationContext';
import FunctionalBlurView from './styled/FunctionalBlurView';
import CNText from './styled/CNText';

const PostInteractionView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
`;

const InteractionText = styled(AppText)`
  color: ${props => props.active ? '#ff00ff' : 'white'};
  /* TODO: font size from device config! */
  font-size: 18px;
  padding: 2px;
`;

const InteractionPressable = styled.Pressable`
  width: 33%;
`;

const PostContentView = styled.View`
  //max-height: 500px; /* FIXME: This causes very long posts to be rendered next to the viewable screen for some reason... */
  width: 100%;
  overflow: hidden;
  flex-direction: column;
  flex-wrap: nowrap;
`;

const AttachmentContainer = styled.View`
  width: 100%;
  padding: 5px;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Post = (props) => {
    const {post, setPosts, oauthToken, instanceInfo, hideNonExistWaning} = props;
    const readPost = post.reblog ? post.reblog : post;
    const [cnShown, setCnShown] = React.useState(post.cnShown ?? !readPost.spoiler_text);
    const [favourited, setFavourited] = React.useState(readPost.favourited);
    const [reblogged, setReblogged] = React.useState(readPost.reblogged);
    const {appSettings} = useConfigurationContext();

    const postCreationTime = new Date(readPost.created_at);

    const handleLayoutChange = (e) => {
        const {height} = e.nativeEvent.layout;
        if (post.renderedHeight !== height) {
            updatePost({...post, renderedHeight: height, cnShown: cnShown}, true, setPosts, post, hideNonExistWaning);
        }
    };

    return <PostView onLayout={handleLayoutChange}>
        {post.reblog && <MetadataContainer>
            <TinyImage src={post.account.avatar}/>
            <RebloggerText>
                <MaterialIcon color="white" name="repeat"/>
                {post.account.acct} boosted:
            </RebloggerText>
        </MetadataContainer>}
        <MetadataContainer>
            <SmallImage src={readPost.account.avatar}/>
            <NameContainer>
                <DisplayNameText>{parsePost(readPost.account.display_name, readPost.account.emojis)}</DisplayNameText>
                <UserNameText>{readPost.account.acct}</UserNameText>
                <PostTimeStamp>{postCreationTime.toLocaleString()} {readPost.visibility}</PostTimeStamp>
            </NameContainer>
        </MetadataContainer>
        <View>
            {readPost.spoiler_text && <Pressable onPress={() => setCnShown(old => !old)}>
                <CNText accessibilityLanguage={readPost.language}>{parsePost(readPost.spoiler_text, readPost.emojis, true)}</CNText>
                {appSettings.completelyHideCNs && <Button onPress={() => setCnShown(old => !old)} title={cnShown ? 'Hide post' : 'Show post'}/>}
            </Pressable>}
            {cnShown
                ? <PostContent post={post} readPost={readPost}/>
                : !appSettings.completelyHideCNs && <Pressable onPress={() => setCnShown(true)}>
                    <PostContent post={post} readPost={readPost}/>
                    <FunctionalBlurView intensity={80} tint="dark"/>
                </Pressable>
            }
        </View>
        <PostInteractionView>
            <InteractionPressable onPress={() => console.log('not implemented')}>
                <InteractionText active={false}>
                    <MaterialIcon name="reply" size={15}/>
                    Reply
                </InteractionText>
            </InteractionPressable>
            <InteractionPressable
                onPress={() =>
                    handleFavouriteClick(setPosts, oauthToken, instanceInfo, readPost, post, favourited, setFavourited, hideNonExistWaning)}
            >
                <InteractionText active={favourited}>
                    {favourited ? <MaterialIcon size={15} name="star" color="#ff00ff"/> :
                        <MaterialIcon size={15} name="star-outline" color="white"/>} Favourite
                </InteractionText>
            </InteractionPressable>
            {readPost.visibility !== 'private' &&
                <InteractionPressable
                    onPress={() =>
                        handleReblogClick(setPosts, oauthToken, instanceInfo, readPost, post, reblogged, setReblogged, hideNonExistWaning)}>
                    <InteractionText active={reblogged}>
                        <MaterialIcon size={15} name="repeat" color={reblogged ? '#ff00ff' : 'white'}/>
                        Boost
                    </InteractionText>
                </InteractionPressable>
            }
        </PostInteractionView>
    </PostView>;
};

const PostContent = (props) => {
    const {post, readPost} = props;
    return <PostContentView>
        <PostText selectable={post.visibility !== 'private'}>
            {parsePost(readPost.content, readPost.emojis)}
        </PostText>
        {Boolean(readPost.media_attachments) && <AttachmentContainer>
            {readPost.media_attachments.map((attachment, index) => <Attachment key={index} attachment={attachment}/>)}
        </AttachmentContainer>}
    </PostContentView>;
};

export default React.memo(Post);
