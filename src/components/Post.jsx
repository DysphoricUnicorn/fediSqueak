import styled from 'styled-components/native';
import AppText from './AppText';
import {Button, View} from 'react-native';
import {parsePost} from '../helpers/generalHelpers';
import React from 'react';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import {callAuthenticated} from '../helpers/apiHelper';

const PostView = styled.View`
  flex-direction: column;
  width: 100%;
  padding: 5px;
  margin-bottom: 15px;
`;

const PostMetadataView = styled.View`
  flex-direction: row;
  width: 100%;
`;

const PostImage = styled.Image`
  height: 50px;
  width: 50px;
  margin-right: 5px;
`;

const TinyPostImage = styled.Image`
  height: 15px;
  width: 15px;
  margin-right: 2px;
`;

const PostDisplayName = styled(AppText)`
  /* TODO: font size from device config! */
  font-size: 18px;
`;

const PostUserName = styled(AppText)`
  /* TODO: font size from device config! */
  font-size: 14px;
`;

const PostTimeStamp = styled(AppText)`
  /* TODO: font size from device config! */
  font-size: 12px;
`;

const PostNameContainer = styled.View`
  flex-direction: column;
  justify-content: space-around;
`;

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

const PostText = styled(AppText)`
  /* TODO: font size from device config! */
  font-size: 18px;
`;

const Post = (props) => {
    const {post, setPosts, oauthToken, instanceInfo} = props;
    const readPost = post.reblog ? post.reblog : post;
    const [cnShown, setCnShown] = React.useState(!readPost.spoiler_text);
    const [favourited, setFavourited] = React.useState(readPost.favourited);
    const [reblogged, setReblogged] = React.useState(readPost.reblogged);

    const postCreationTime = new Date(readPost.created_at);

    const updatePost = (updatedPost) => {
        setPosts((oldPosts) => {
            const id = oldPosts.findIndex(oldPost => oldPost.id === post.id);
            if (id !== -1) {
                const newPosts = [...oldPosts];
                newPosts[id] = updatedPost;
                return newPosts;
            }
            console.warn('Interacted with post that does not seem to exist');
            return oldPosts;
        });
    };

    const handleFavouriteClick = () => {
        if (favourited === false) {
            setFavourited(true);
            callAuthenticated(instanceInfo.uri, '/api/v1/statuses/' + post.id + '/favourite', 'POST', oauthToken)
                .then(updatePost)
                .catch((reason) => {
                    setFavourited(false);
                    console.error('Could not favourite post', reason);
                });
        } else {
            setFavourited(false);
            callAuthenticated(instanceInfo.uri, '/api/v1/statuses/' + post.id + '/unfavourite', 'POST', oauthToken)
                .then(updatePost)
                .catch((reason) => {
                    setFavourited(true);
                    console.error('Could not unfavourite post', reason);
                });
        }
    };

    const handleReblogClick = () => {
        if (reblogged === false) {
            setReblogged(true);
            callAuthenticated(instanceInfo.uri, '/api/v1/statuses/' + post.id + '/reblog', 'POST', oauthToken)
                .catch((reason) => {
                    setReblogged(false);
                    console.error('Could not reblog post', reason);
                });
        } else {
            setReblogged(false);
            callAuthenticated(instanceInfo.uri, '/api/v1/statuses/' + post.id + '/unreblog', 'POST', oauthToken)
                .catch((reason) => {
                    setReblogged(true);
                    console.error('Could not unreblog post', reason);
                });
        }
    };

    return <PostView>
        {post.reblog && <PostMetadataView>
            <TinyPostImage source={{uri: post.account.avatar}}/>
            <PostText>
                <MaterialIcon color="white" name="repeat"/>
                {parsePost(post.account.acct, post.account.emojis)} boosted:
            </PostText>
        </PostMetadataView>}
        <PostMetadataView>
            <PostImage source={{uri: readPost.account.avatar}}/>
            <PostNameContainer>
                <PostDisplayName>{parsePost(readPost.account.display_name, readPost.account.emojis)}</PostDisplayName>
                <PostUserName>{readPost.account.acct}</PostUserName>
                <PostTimeStamp>{postCreationTime.toLocaleString()} {readPost.visibility}</PostTimeStamp>
            </PostNameContainer>
        </PostMetadataView>
        <View>
            {readPost.spoiler_text && <>
                <PostText>{parsePost(readPost.spoiler_text, post.emojis)}</PostText>
                <Button onPress={() => setCnShown(old => !old)} title={cnShown ? 'Hide post' : 'Show post'}/>
            </>}
            {cnShown && <PostText selectable={post.visibility !== 'private'}>
                {parsePost(post.content, post.emojis)}
            </PostText>}
        </View>
        <PostInteractionView>
            <InteractionPressable onPress={() => console.log('not implemented')}>
                <InteractionText active={false}>
                    <MaterialIcon name="reply" size={15}/>
                    Reply
                </InteractionText>
            </InteractionPressable>
            <InteractionPressable onPress={handleFavouriteClick}>
                <InteractionText active={favourited}>
                    {favourited ? <MaterialIcon size={15} name="star" color="#ff00ff"/> :
                        <MaterialIcon size={15} name="star-outline" color="white"/>} Favourite
                </InteractionText>
            </InteractionPressable>
            {readPost.visibility !== 'private' &&
            <InteractionPressable onPress={handleReblogClick}>
                <InteractionText active={reblogged}>
                    <MaterialIcon size={15} name="repeat" color={reblogged ? '#ff00ff' : 'white'}/>
                    Boost
                </InteractionText>
            </InteractionPressable>
            }
        </PostInteractionView>
    </PostView>;
};

export default Post;
