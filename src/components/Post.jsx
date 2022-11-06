import styled from 'styled-components/native';
import AppText from './AppText';
import {Button, Pressable, View} from 'react-native';
import {parsePost} from '../helpers/generalHelpers';
import React from 'react';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';

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

const PostDisplayName = styled(AppText)`
  font-size: 18px;
`;

const PostUserName = styled(AppText)`
  font-size: 14px;
`;

const PostTimeStamp = styled(AppText)`
  font-size: 12px;
`;

const PostNameContainer = styled.View`
  flex-direction: column;
  justify-content: space-around;
`;

const PostInteractionView = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const InteractionText = styled(AppText)`
  color: ${props => props.active ? '#ff00ff' : 'white'};
  font-size: 18px;
  padding: 2px;
  width: 33%;
`;

const PostText = styled(AppText)`
  font-size: 18px;
`;

const Post = (props) => {
    const {post} = props;
    const [cnShown, setCnShown] = React.useState(!post.spoiler_text);

    const postCreationTime = new Date(post.created_at);

    return <PostView>
        <PostMetadataView>
            <PostImage source={{uri: post.account.avatar}}/>
            <PostNameContainer>
                <PostDisplayName>{post.account.display_name}</PostDisplayName>
                <PostUserName>{post.account.acct}</PostUserName>
                <PostTimeStamp>{postCreationTime.toLocaleString()} {post.visibility}</PostTimeStamp>
            </PostNameContainer>
        </PostMetadataView>
        <View>
            {post.spoiler_text && <>
                <PostText>{parsePost(post.spoiler_text)}</PostText>
                <Button onPress={() => setCnShown(old => !old)} title={cnShown ? 'Hide post' : 'Show post'}/>
            </>}
            {cnShown && <PostText selectable={post.visibility !== 'private'}>{parsePost(post.content)}</PostText>}
        </View>
        <PostInteractionView>
            <InteractionText active={false}>
                <MaterialIcon name="reply" size={15}/>
                Reply
            </InteractionText>
            <InteractionText active={post.favourited}>
                {post.favourited ? <MaterialIcon size={15} name="star" color="#ff00ff"/> :
                    <MaterialIcon size={15} name="star-outline" color="white"/>} Favourite
            </InteractionText>
            {post.visibility !== 'private' &&
            <InteractionText active={post.reblogged}>
                <MaterialIcon size={15} name="repeat" color={post.reblogged ? '#ff0ff' : 'white'}/>
                Boost
            </InteractionText>
            }
        </PostInteractionView>
    </PostView>;
};

export default Post;
